import { google } from 'googleapis';

const getOAuth2Client = () => {
  return new google.auth.OAuth2(
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/youtube/callback`
  );
};

export const getYoutubeAuthUrl = (userId: string) => {
  const client = getOAuth2Client();
  return client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/youtube.upload',
      'https://www.googleapis.com/auth/youtube.readonly',
      'https://www.googleapis.com/auth/userinfo.profile'
    ],
    prompt: 'consent',
    state: userId // Pass userId to the callback to associate the token
  });
};

export const getYoutubeTokens = async (code: string) => {
  const client = getOAuth2Client();
  const { tokens } = await client.getToken(code);
  return tokens;
};
