import { NextResponse } from "next/server";
import { getPineconeClient } from "@/lib/pinecone";
import { getOpenAIClient } from "@/lib/openai";
import { prisma } from "@/lib/db";

export async function GET() {
  const results: Record<string, string> = {};

  // Test Pinecone
  try {
    const pinecone = getPineconeClient();
    const indexes = await pinecone.listIndexes();
    results.pinecone =
      indexes.indexes && indexes.indexes.length > 0
        ? "connected"
        : "no indexes";
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    results.pinecone = `error: ${errorMessage}`;
  }

  // Test OpenAI
  try {
    const openai = getOpenAIClient();
    await openai.models.list();
    results.openai = "connected";
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    results.openai = `error: ${errorMessage}`;
  }

  // Test Database
  try {
    await prisma.$queryRaw`SELECT 1 as result`;
    results.database = "connected";
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    results.database = `error: ${errorMessage}`;
  }

  // Determine overall status
  const hasErrors = Object.values(results).some((status) =>
    status.startsWith("error"),
  );

  return NextResponse.json(
    {
      status: hasErrors ? "partial" : "ok",
      services: results,
    },
    { status: hasErrors ? 500 : 200 },
  );
}
