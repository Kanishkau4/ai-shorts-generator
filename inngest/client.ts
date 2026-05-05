import { Inngest } from "inngest";

// Create a client to send and receive events
export const inngest = new Inngest({ 
  id: "vibio-ai-shorts",
  signingKey: process.env.INNGEST_SIGNING_KEY,
  eventKey: process.env.INNGEST_EVENT_KEY,
  // Force production mode on Vercel to ensure signed responses
  isDev: process.env.NODE_ENV === "development",
} as any);
