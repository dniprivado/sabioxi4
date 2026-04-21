'use server';

import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { sql } from "@vercel/postgres";

async function checkAdmin() {
  const session = await auth();
  if ((session?.user as any)?.role !== 'admin') {
    throw new Error("No autorizado");
  }
}

export async function getUsers() {
  await checkAdmin();
  const { rows } = await sql`SELECT id, email, role, status FROM users`;
  return { results: rows };
}

export async function blockUser(id: string, block: boolean) {
  await checkAdmin();
  const status = block ? 'blocked' : 'active';
  await sql`UPDATE users SET status = ${status} WHERE id = ${id}`;
  revalidatePath("/admin");
}

export async function deleteUser(id: string) {
  await checkAdmin();
  await sql`DELETE FROM users WHERE id = ${id}`;
  revalidatePath("/admin");
}

export async function resetUserPassword(id: string, newPassword: string) {
  await checkAdmin();
  const passwordHash = await bcrypt.hash(newPassword, 10);
  await sql`UPDATE users SET password_hash = ${passwordHash} WHERE id = ${id}`;
  revalidatePath("/admin");
}
