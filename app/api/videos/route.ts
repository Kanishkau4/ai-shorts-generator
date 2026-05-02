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
