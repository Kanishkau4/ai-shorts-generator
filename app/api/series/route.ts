import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
      .from("video_series")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[SERIES_GET] Supabase Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[SERIES_GET] Exception:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const {
      seriesName,
      niche,
      language,
      voice,
      backgroundMusic,
      videoStyle,
      captionStyle,
      videoDuration,
      platforms,
      publishTime,
    } = body;

    // Validate required fields
    if (!seriesName || !niche || !language || !voice || !videoStyle || !captionStyle || !videoDuration || !publishTime) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Initialize Supabase with Service Role Key to bypass RLS on the server
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
      .from("video_series")
      .insert({
        user_id: userId,
        series_name: seriesName,
        niche,
        language,
        voice,
        background_music: backgroundMusic || [],
        video_style: videoStyle,
        caption_style: captionStyle,
        video_duration: videoDuration,
        platforms: platforms || [],
        publish_time: publishTime,
        status: "active",
      })
      .select()
      .single();

    if (error) {
      console.error("[SERIES_POST] Supabase Error:", error);
      return NextResponse.json({ error: error.message, details: error.details }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[SERIES_POST] Exception:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
