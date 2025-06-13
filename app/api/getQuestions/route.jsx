import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { getSession } from "@/lib/auth/session";
import { db } from "@/lib/db/drizzle";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const referer = request.headers.get("referer");
  const isDirectAccess = !referer;

  // Optional referer protection
  // if (isDirectAccess) {
  //   return NextResponse.json({ error: "Direct access not allowed" }, { status: 403 });
  // }

  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();

    const session = await getSession();
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const userId = session.user.id;

    const userResult = await db
      .select({ role: users.role })
      .from(users)
      .where(eq(users.id, userId));

    const userRole = userResult[0]?.role ?? "basic"; // default fallback if somehow not found

    const database = client.db("CPDB");
    const collection = database.collection("questions");

    const items =
      userRole === "basic"
        ? await collection.find({}).limit(20).toArray()
        : await collection.find({}).toArray();

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
