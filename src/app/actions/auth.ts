'use server';

import bcrypt from "bcryptjs";
import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import { sql } from "@vercel/postgres";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Credenciales inválidas.";
        default:
          return "Algo salió mal.";
      }
    }
    throw error;
  }
}

export async function signupAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) return "Email y contraseña requeridos.";

  // Check if user exists
  const { rows: existingUsers } = await sql`SELECT id FROM users WHERE email = ${email}`;
  if (existingUsers.length > 0) return "El usuario ya existe.";

  const id = Math.random().toString(36).substring(2, 15);
  const passwordHash = await bcrypt.hash(password, 10);
  
  // First user is admin
  const { rows: userCountRows } = await sql`SELECT count(*) as count FROM users`;
  const userCount = parseInt(userCountRows[0].count);
  const role = userCount === 0 ? 'admin' : 'user';

  await sql`INSERT INTO users (id, email, password_hash, role) VALUES (${id}, ${email}, ${passwordHash}, ${role})`;

  await signIn("credentials", {
    email,
    password,
    redirectTo: "/",
  });
}
