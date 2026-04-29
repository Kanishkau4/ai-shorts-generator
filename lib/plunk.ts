import Plunk from "@plunk/node";

export interface SendVideoNotificationOptions {
  to: string;
  name: string;
  videoTitle: string;
  videoUrl: string;
  thumbnailUrl: string;
}

export const sendVideoNotificationEmail = async ({
  to,
  name,
  videoTitle,
  videoUrl,
  thumbnailUrl,
}: SendVideoNotificationOptions) => {
  if (!process.env.PLUNK_API_KEY) {
    console.warn("PLUNK_API_KEY is not set. Skipping email notification.");
    return;
  }

  const plunk = new Plunk(process.env.PLUNK_API_KEY);

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #f3f4f6; padding: 20px; text-align: center;">
        <h1 style="margin: 0; color: #111827; font-size: 24px;">Your Video is Ready! 🎉</h1>
      </div>
      <div style="padding: 20px;">
        <p style="color: #374151; font-size: 16px;">Hi ${name},</p>
        <p style="color: #374151; font-size: 16px;">Great news! Your video <strong>"${videoTitle}"</strong> has been successfully generated and is ready for you to view and download.</p>
        
        <div style="text-align: center; margin: 20px 0;">
          <img src="${thumbnailUrl}" alt="${videoTitle}" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);" />
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <a href="${videoUrl}" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">View / Download Video</a>
        </div>
      </div>
      <div style="background-color: #f9fafb; padding: 15px; text-align: center; border-top: 1px solid #e0e0e0;">
        <p style="margin: 0; color: #6b7280; font-size: 14px;">Thank you for using our AI Shorts Generator!</p>
      </div>
    </div>
  `;

  try {
    return await plunk.emails.send({
      to,
      subject: `Your video "${videoTitle}" is ready!`,
      body: html,
    });
  } catch (error) {
    console.error("Error sending Plunk email:", error);
    throw error;
  }
};
