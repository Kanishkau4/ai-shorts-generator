import { Inngest } from "inngest";

// Create a client to send and receive events
export const inngest = new Inngest({ 
  id: "vibio-ai-shorts",
  signingKey: process.env.INNGEST_SIGNING_KEY,
});
