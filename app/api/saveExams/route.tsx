import { NextResponse } from "next/server";
import { Pool } from "pg";

// Configure the PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { user_id, score, total_questions, duration_seconds, answers } = body;

    // Validate required fields
    if (
      !user_id ||
      typeof score !== "number" ||
      typeof total_questions !== "number" ||
      typeof duration_seconds !== "number" ||
      !Array.isArray(answers)
    ) {
      return NextResponse.json(
        { error: "Missing or invalid fields." },
        { status: 400 }
      );
    }

    const query = `
  INSERT INTO mock_exam_results 
    (user_id, score, total_questions, duration_seconds, answers)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING *;
`;

    const values = [
      user_id,
      score,
      total_questions,
      duration_seconds,
      JSON.stringify(answers),
    ];

    const result = await pool.query(query, values);

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
