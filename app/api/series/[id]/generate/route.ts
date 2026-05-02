import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { inngest } from "@/inngest/client";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id: seriesId } = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Send the event to Inngest to trigger the video generation pipeline
    await inngest.send({
      name: "series/generate.video",
      data: {
        seriesId,
        userId,
      },
    });

    return NextResponse.json({ success: true, message: "Video generation started!" });
  } catch (error: any) {
    console.error("[GENERATE_VIDEO] Exception:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
