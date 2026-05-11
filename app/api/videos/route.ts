import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const seriesId = searchParams.get("seriesId");

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    let query = supabase
      .from("generated_videos")
      .select(`
        *,
        video_series (
          series_name,
          niche
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (seriesId) {
      query = query.eq("series_id", seriesId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("[VIDEOS_GET] Supabase Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[VIDEOS_GET] Exception:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new NextResponse("Missing video ID", { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Verify ownership before deleting
    const { data: video, error: fetchError } = await supabase
      .from("generated_videos")
      .select("user_id")
      .eq("id", id)
      .single();

    if (fetchError || !video) {
      return new NextResponse("Video not found", { status: 404 });
    }

    if (video.user_id !== userId) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const { error: deleteError } = await supabase
      .from("generated_videos")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("[VIDEOS_DELETE] Supabase Error:", deleteError);
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[VIDEOS_DELETE] Exception:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
