import { Pinecone } from "@pinecone-database/pinecone";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("Testing Pinecone connection...");

    const pc = new Pinecone({
      apiKey:
        "pcsk_TkTqt_Nmu7kqmotJGN6hbeZLmuZLy3qv35rXCaBVHo4yamtwfRoLpshXDMvLeJ3Kv3i1u",
    });

    console.log("Pinecone client created");

    const indexes = await pc.listIndexes();

    console.log("Indexes:", indexes);

    return NextResponse.json({
      success: true,
      indexes: indexes.indexes,
    });
  } catch (error) {
    console.error("Pinecone error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        details: error,
      },
      { status: 500 },
    );
  }
}
