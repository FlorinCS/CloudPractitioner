// app/api/exam-history/route.ts
import { getSession } from "@/lib/auth/session";

import { db } from "@/lib/db/drizzle";
import { mockExamResults } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getSession();

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const userId = session.user.id;

  const exams = await db
    .select()
    .from(mockExamResults)
    .where(eq(mockExamResults.userId, userId));

  return NextResponse.json({ exams });
}
