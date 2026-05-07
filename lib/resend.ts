import { Resend } from "resend";

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
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is not set. Skipping email notification.");
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

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
        <p style="margin: 0; color: #6b7280; font-size: 14px;">Thank you for using Vibio AI!</p>
      </div>
    </div>
  `;

  try {
    return await resend.emails.send({
      from: "Vibio AI <onboarding@resend.dev>",
      to: [to],
      subject: `Your video "${videoTitle}" is ready!`,
      html: html,
    });
  } catch (error) {
    console.error("Error sending Resend email:", error);
    throw error;
  }
};

export interface SendSubscriptionNotificationOptions {
  to: string;
  name: string;
  planName: string;
}

export const sendSubscriptionNotificationEmail = async ({
  to,
  name,
  planName,
}: SendSubscriptionNotificationOptions) => {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is not set. Skipping email notification.");
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
      <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 40px 20px; text-align: center; color: #ffffff;">
        <h1 style="margin: 0; font-size: 28px; font-weight: 800;">Welcome to ${planName}! 🚀</h1>
        <p style="margin-top: 10px; opacity: 0.9; font-size: 16px;">Your subscription is now active.</p>
      </div>
      <div style="padding: 30px; background-color: #ffffff;">
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">Hi ${name},</p>
        <p style="color: #374151; font-size: 16px; line-height: 1.6;">Thank you for upgrading to the <strong>${planName}</strong> plan! Your account has been successfully upgraded.</p>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://vibio.ai'}/dashboard" style="background-color: #2563eb; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">Go to Dashboard</a>
        </div>
      </div>
      <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
        <p style="margin: 0; color: #6b7280; font-size: 14px;">We're excited to see what you create!</p>
      </div>
    </div>
  `;

  try {
    return await resend.emails.send({
      from: "Vibio AI <onboarding@resend.dev>",
      to: [to],
      subject: `Welcome to Vibio ${planName}!`,
      html: html,
    });
  } catch (error) {
    console.error("Error sending Resend subscription email:", error);
    throw error;
  }
};
