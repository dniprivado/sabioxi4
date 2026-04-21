'use server';

import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getLessons() {
  const db = (process.env as any).DB;
  const { results } = await db.prepare("SELECT * FROM lessons ORDER BY created_at DESC").all();
  return results.map((l: any) => ({
    ...l,
    questions: JSON.parse(l.questions)
  }));
}

export async function addLessonAction(title: string, questions: any[]) {
  const session = await auth();
  if (!session?.user) throw new Error("Debes iniciar sesión");

  const db = (process.env as any).DB;
  const id = Math.random().toString(36).substring(2, 9);
  
  await db.prepare("INSERT INTO lessons (id, title, questions, author_id) VALUES (?, ?, ?, ?)")
    .bind(id, title, JSON.stringify(questions), (session.user as any).id)
    .run();

  revalidatePath("/");
}

export async function getUserScore() {
  const session = await auth();
  if (!session?.user) return 0;

  const db = (process.env as any).DB;
  const res = await db.prepare("SELECT score FROM user_scores WHERE user_id = ?")
    .bind((session.user as any).id)
    .first();
  
  return res ? res.score : 0;
}

export async function incrementUserScoreAction() {
  const session = await auth();
  if (!session?.user) return;

  const userId = (session.user as any).id;
  const db = (process.env as any).DB;

  const res = await db.prepare("SELECT score FROM user_scores WHERE user_id = ?").bind(userId).first();
  
  if (res) {
    await db.prepare("UPDATE user_scores SET score = score + 1 WHERE user_id = ?").bind(userId).run();
  } else {
    await db.prepare("INSERT INTO user_scores (user_id, score) VALUES (?, 1)").bind(userId).run();
  }
}
