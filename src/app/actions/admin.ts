'use server';

import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

async function checkAdmin() {
  const session = await auth();
  if ((session?.user as any)?.role !== 'admin') {
    throw new Error("No autorizado");
  }
}

export async function getUsers() {
  await checkAdmin();
  const db = (process.env as any).DB;
  return await db.prepare("SELECT id, email, role, status FROM users").all();
}

export async function blockUser(id: string, block: boolean) {
  await checkAdmin();
  const db = (process.env as any).DB;
  const status = block ? 'blocked' : 'active';
  await db.prepare("UPDATE users SET status = ? WHERE id = ?").bind(status, id).run();
  revalidatePath("/admin");
}

export async function deleteUser(id: string) {
  await checkAdmin();
  const db = (process.env as any).DB;
  await db.prepare("DELETE FROM users WHERE id = ?").bind(id).run();
  revalidatePath("/admin");
}

export async function resetUserPassword(id: string, newPassword: string) {
  await checkAdmin();
  const db = (process.env as any).DB;
  const passwordHash = await bcrypt.hash(newPassword, 10);
  await db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").bind(passwordHash, id).run();
  revalidatePath("/admin");
}
