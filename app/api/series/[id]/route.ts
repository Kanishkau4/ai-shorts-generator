import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase with Service Role Key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { data, error } = await supabase
      .from("video_series")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("[SERIES_GET_ID] Supabase Error:", error);
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[SERIES_GET_ID] Exception:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    // Map body fields to DB columns
    const updateData: any = {};
    if (body.seriesName) updateData.series_name = body.seriesName;
    if (body.niche) updateData.niche = body.niche;
    if (body.language) updateData.language = body.language;
    if (body.voice) updateData.voice = body.voice;
    if (body.backgroundMusic) updateData.background_music = body.backgroundMusic;
    if (body.videoStyle) updateData.video_style = body.videoStyle;
    if (body.captionStyle) updateData.caption_style = body.captionStyle;
    if (body.videoDuration) updateData.video_duration = body.videoDuration;
    if (body.platforms) updateData.platforms = body.platforms;
    if (body.publishTime) updateData.publish_time = body.publishTime;
    if (body.status) updateData.status = body.status;

    const { data, error } = await supabase
      .from("video_series")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      console.error("[SERIES_PATCH] Supabase Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[SERIES_PATCH] Exception:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { error } = await supabase
      .from("video_series")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      console.error("[SERIES_DELETE] Supabase Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error("[SERIES_DELETE] Exception:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
