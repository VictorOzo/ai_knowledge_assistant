import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    console.log("🧪 Testing database...");

    // 1. Create a test document
    const doc = await prisma.document.create({
      data: {
        title: "Test Document",
        fileName: "test.pdf",
        fileSize: 1024,
        fileType: "pdf",
        status: "ready",
      },
    });
    console.log("✅ Created document:", doc.id);

    // 2. Read it back
    const allDocs = await prisma.document.findMany();
    console.log("✅ Found documents:", allDocs.length);

    // 3. Delete the test document (cleanup)
    await prisma.document.delete({
      where: { id: doc.id },
    });
    console.log("✅ Cleaned up test document");

    // 4. Return success
    return NextResponse.json({
      success: true,
      message: "✅ Database is working perfectly!",
      testResults: {
        created: doc.id,
        totalDocuments: allDocs.length,
      },
    });
  } catch (error:string | any) {
    console.error("❌ Database error:", error);
    if (error.code === "P1001") {
      console.error("Cannot reach database server. Check:");
      console.error("1. Is Supabase project active?");
      console.error("2. Is DATABASE_URL correct in .env?");
      console.error("3. Is your IP whitelisted in Supabase?");
    }
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}
