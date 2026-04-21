'use server';

import bcrypt from "bcryptjs";
import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";

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

  const db = (process.env as any).DB;
  
  // Check if user exists
  const existingUser = await db.prepare("SELECT id FROM users WHERE email = ?").bind(email).first();
  if (existingUser) return "El usuario ya existe.";

  const id = Math.random().toString(36).substring(2, 15);
  const passwordHash = await bcrypt.hash(password, 10);
  
  // First user is admin (optional logic, or just make it user)
  const userCount = await db.prepare("SELECT count(*) as count FROM users").first();
  const role = userCount.count === 0 ? 'admin' : 'user';

  await db.prepare("INSERT INTO users (id, email, password_hash, role) VALUES (?, ?, ?, ?)")
    .bind(id, email, passwordHash, role)
    .run();

  await signIn("credentials", {
    email,
    password,
    redirectTo: "/",
  });
}
