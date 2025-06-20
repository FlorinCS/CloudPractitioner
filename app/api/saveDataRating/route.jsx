import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const ALLOWED_ORIGIN = "https://cloud-practitioner.com"; // ✅ Change if needed

// Function to handle OPTIONS preflight request
export async function OPTIONS() {
  return NextResponse.json(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400", // Cache preflight response for 1 day
    },
  });
}

export async function POST(request) {
  const client = new MongoClient(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    const database = client.db("CPDB");
    const collection = database.collection("feedback");

    const body = await request.json();
    await collection.insertOne(body);

    return new NextResponse(JSON.stringify({ message: "Successful" }), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json",
      },
    });
  } finally {
    await client.close();
  }
}
