import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { getYoutubeAuthUrl } from '@/utils/google/oauth';

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const authUrl = getYoutubeAuthUrl(userId);
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("YouTube Auth Init Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
