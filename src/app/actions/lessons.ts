'use server';

import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { sql } from "@vercel/postgres";

export async function getLessons() {
  try {
    const { rows } = await sql`SELECT * FROM lessons ORDER BY created_at DESC`;
    return rows.map((l: any) => ({
      ...l,
      questions: typeof l.questions === 'string' ? JSON.parse(l.questions) : l.questions
    }));
  } catch (e) {
    console.error("Database error, returning mock data:", e);
    return [
      { id: '1', title: 'Lección de Prueba (Mock)', questions: [{ q: '¿Funciona?', a: ['Sí', 'No'] }] }
    ];
  }
}

export async function addLessonAction(title: string, questions: any[]) {
  const session = await auth();
  if (!session?.user) throw new Error("Debes iniciar sesión");

  const id = Math.random().toString(36).substring(2, 9);
  const authorId = (session.user as any).id;
  const questionsJson = JSON.stringify(questions);
  
  await sql`INSERT INTO lessons (id, title, questions, author_id) VALUES (${id}, ${title}, ${questionsJson}, ${authorId})`;

  revalidatePath("/");
}

export async function getUserScore() {
  const session = await auth();
  if (!session?.user) return 0;

  const userId = (session.user as any).id;
  try {
    const { rows } = await sql`SELECT score FROM user_scores WHERE user_id = ${userId}`;
    return rows[0] ? rows[0].score : 0;
  } catch (e) {
    return 99; // Mock score
  }
}

export async function incrementUserScoreAction() {
  const session = await auth();
  if (!session?.user) return;

  const userId = (session.user as any).id;

  const { rows } = await sql`SELECT score FROM user_scores WHERE user_id = ${userId}`;
  
  if (rows[0]) {
    await sql`UPDATE user_scores SET score = score + 1 WHERE user_id = ${userId}`;
  } else {
    await sql`INSERT INTO user_scores (user_id, score) VALUES (${userId}, 1)`;
  }
}
