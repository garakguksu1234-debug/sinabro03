'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { mistakeNotes } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('UNAUTHORIZED')
  return session.user.id
}

export async function saveMistakeNote(input: { subject: string; title: string; question: string; concept: string; explanation: string }) {
  const userId = await getUserId()
  await db.insert(mistakeNotes).values({ ...input, userId })
  revalidatePath('/')
  return { ok: true }
}

export async function getMistakeNotes() {
  const userId = await getUserId()
  return db.select().from(mistakeNotes).where(eq(mistakeNotes.userId, userId)).orderBy(desc(mistakeNotes.createdAt))
}
