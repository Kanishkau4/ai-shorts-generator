import { google } from 'googleapis';
import { Readable } from 'stream';

export async function uploadToYoutube({
  videoUrl,
  title,
  description,
  refreshToken,
}: {
  videoUrl: string;
  title: string;
  description: string;
  refreshToken: string;
}) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  oauth2Client.setCredentials({
    refresh_token: refreshToken,
  });

  const youtube = google.youtube({
    version: 'v3',
    auth: oauth2Client,
  });

  // Download video as stream
  const response = await fetch(videoUrl);
  if (!response.ok || !response.body) {
    throw new Error(`Failed to download video from ${videoUrl}: ${response.statusText}`);
  }
  
  // Convert Web ReadableStream to Node Readable stream
  const reader = response.body.getReader();
  const stream = new Readable({
    async read() {
      const { done, value } = await reader.read();
      if (done) {
        this.push(null);
      } else {
        this.push(Buffer.from(value));
      }
    },
  });

  console.log(`Starting YouTube upload for: ${title}`);

  const res = await youtube.videos.insert({
    part: ['snippet', 'status'],
    requestBody: {
      snippet: {
        title,
        description,
        categoryId: '22', // People & Blogs
        tags: ['ai', 'shorts', 'automated', 'vibio'],
        defaultAudioLanguage: 'en',
        defaultLanguage: 'en'
      },
      status: {
        privacyStatus: 'public', 
        selfDeclaredMadeForKids: false,
      },
    },
    media: {
      body: stream,
    },
  });

  console.log(`YouTube upload successful! Video ID: ${res.data.id}`);

  return {
    id: res.data.id,
    url: `https://www.youtube.com/watch?v=${res.data.id}`
  };
}
