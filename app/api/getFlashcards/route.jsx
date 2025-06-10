import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export const dynamic = "force-dynamic"; // Ensure dynamic fetching (disables caching)

export async function GET(request) {
  const referer = request.headers.get("referer"); // Check the Referer header
  const isDirectAccess = !referer; // If Referer is missing, it's likely from the URL bar

  // if (isDirectAccess) {
  //   return NextResponse.json(
  //     { error: "Direct access from URL bar is not allowed" },
  //     { status: 403 }
  //   );
  // }

  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();

    const database = client.db("CPDB");
    const collection = database.collection("flashcards");

    const allItems = await collection.find({}).toArray();

    // Create response with proper cache headers
    return NextResponse.json(allItems, {
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
