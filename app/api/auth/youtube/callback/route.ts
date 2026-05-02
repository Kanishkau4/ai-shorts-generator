import { NextResponse } from 'next/server';
import { getYoutubeTokens } from '@/utils/google/oauth';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const userId = url.searchParams.get('state');
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  if (!code || !userId) {
    return NextResponse.redirect(`${appUrl}/dashboard/settings?error=invalid_request`);
  }

  try {
    const tokens = await getYoutubeTokens(code);
    
    // We primarily need the refresh_token to publish videos later in background tasks
    if (tokens.refresh_token) {
      const supabase = await createClient();
      
      const { error } = await supabase
        .from('user_settings')
        .upsert({ 
          user_id: userId, 
          youtube_connected: true,
          youtube_refresh_token: tokens.refresh_token,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (error) throw error;
      
      return NextResponse.redirect(`${appUrl}/dashboard/settings?success=youtube_connected`);
    } else {
      // If no refresh token is returned, check if we already have one or if the user needs to re-consent
      return NextResponse.redirect(`${appUrl}/dashboard/settings?error=no_refresh_token`);
    }
  } catch (error) {
    console.error('YouTube Auth Error:', error);
    return NextResponse.redirect(`${appUrl}/dashboard/settings?error=auth_failed`);
  }
}
