import { NextResponse } from "next/server";
import { Pool } from "pg";
import { getSession } from "@/lib/auth/session";

// PostgreSQL pool config
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

// POST route to reset `tries` to 0 for the logged-in user
export async function POST(req) {
  const session = await getSession();

  if (!session?.user || !session.user.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const userId = session.user.id;

  try {
    const client = await pool.connect();

    // Set tries = 0 for this user
    await client.query("UPDATE users SET tries = 0 WHERE id = $1", [userId]);

    client.release();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DB error on update:", error);
    return NextResponse.json(
      { error: "Failed to update tries" },
      { status: 500 }
    );
  }
}
