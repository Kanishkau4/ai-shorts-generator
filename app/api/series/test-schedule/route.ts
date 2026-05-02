import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { inngest } from "@/inngest/client";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { seriesId, publishTime, platforms } = await req.json();

    if (!seriesId || !publishTime || !platforms) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // @ts-ignore
    await inngest.send({
      name: "series/process.scheduled",
      data: {
        seriesId,
        userId,
        publishTime,
        platforms,
        isTest: true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[TEST_SCHEDULE_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
