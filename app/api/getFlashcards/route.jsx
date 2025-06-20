import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db/drizzle";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    const session = await getSession();
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const userId = session.user.id;

    const userResult = await db
      .select({ role: users.role })
      .from(users)
      .where(eq(users.id, userId));

    const userRole = userResult[0]?.role ?? "basic";

    await client.connect();
    const database = client.db("CPDB");
    const collection = database.collection("flashcards");

    let items;

    if (userRole === "pro") {
      items = await collection.find({}).toArray();
    } else {
      items = await collection.find({}).limit(20).toArray();
    }

    return NextResponse.json(items, {
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await client.close();
  }
}
