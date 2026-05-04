# 🎬 Vibio - AI Shorts Generator & Scheduler

Vibio is a fully automated, AI-powered platform for generating and scheduling short-form videos (Shorts, Reels, TikToks). It transforms simple text prompts or series concepts into highly engaging, fully-rendered videos complete with AI-generated scripts, AI voiceovers, dynamic background images, and animated captions.

![Vibio Preview](./public/video-style/realistic.jpeg)

## ✨ Features

- **🤖 Automated Video Pipeline**: From prompt to final `.mp4` without human intervention.
- **📅 Series Management**: Create recurring video series (e.g., "Daily Stoic Wisdom") that automatically generate videos on a schedule.
- **🧠 AI Scripting**: Integrated with **Google Gemini** and **Groq** to generate viral-optimized scripts, hooks, and scene descriptions.
- **🎙️ AI Voiceovers**: High-quality, emotive text-to-speech powered by **Deepgram Aura**.
- **🖼️ Dynamic Assets**: Automatically generates context-aware background images for scenes.
- **🎞️ Programmatic Rendering**: Uses **Remotion** to stitch audio, images, and animated captions together into a polished video.
- **☁️ "Free Forever" Architecture**: Designed to deploy the frontend on Vercel while offloading heavy video rendering to **GitHub Actions** for cost-free computing.
- **💳 Authentication & Billing**: Fully integrated with **Clerk** for auth and subscription management.
- **📧 Email Notifications**: Automated emails via **Plunk** when subscriptions are updated or videos finish generating.

## 🛠 Tech Stack

- **⚛️ Framework**: Next.js (App Router)
- **🎨 Styling**: Tailwind CSS, Radix UI, Framer Motion
- **🗄️ Database**: Supabase (PostgreSQL & Storage)
- **🔐 Authentication**: Clerk
- **⚙️ Background Jobs**: Inngest (Event orchestration and Cron scheduling)
- **🎥 Video Rendering**: Remotion (Local in dev, GitHub Actions in prod)
- **🧠 AI/APIs**: Deepgram (TTS), Gemini (Text), Groq (Text), Plunk (Email)

## 🚀 Local Development Setup

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/ai-shorts-generator.git
cd ai-shorts-generator
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory and add the following keys:

```env
# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# AI & APIs
GEMINI_API_KEY=your-gemini-key
DEEPGRAM_API_KEY=your-deepgram-key
GROQ_API_KEY=your-groq-key
PLUNK_API_KEY=sk_your-plunk-secret-key

# Inngest (For local dev, these can be dummy values if using the local dev server)
INNGEST_EVENT_KEY=local
INNGEST_SIGNING_KEY=local
```

### 4. Run the Development Server

You need to run two processes for local development: the Next.js app and the Inngest local dev server.

**Terminal 1 (Next.js):**
```bash
npm run dev
```

**Terminal 2 (Inngest):**
```bash
npx inngest-cli@latest dev
```

Your app will be available at [http://localhost:3000](http://localhost:3000).

## ☁️ Production Deployment (Free Tier Setup)

Vibio is uniquely architected to avoid expensive cloud rendering costs (like AWS Lambda) by leveraging GitHub Actions as a free video rendering engine.

### Step 1: Vercel Setup
1. Connect your repository to Vercel.
2. Add all the environment variables listed above.
3. Add these additional variables to tell Vercel to use GitHub for rendering:
   - `GH_PAT`: A GitHub Fine-Grained Personal Access Token (Permissions: Contents R/W, Actions R/W).
   - `GITHUB_OWNER`: Your GitHub username.
   - `GITHUB_REPO`: `ai-shorts-generator`

### Step 2: GitHub Actions Setup
1. In your GitHub repository, go to **Settings > Secrets and variables > Actions**.
2. Add the following Repository Secrets:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
*(These are required for the GitHub Action to upload the finished video back to your database).*

### Step 3: Inngest Cloud
1. Create a free account on [Inngest Cloud](https://www.inngest.com/).
2. Point the Sync URL to your production Vercel domain: `https://your-domain.vercel.app/api/inngest`.
3. Add the production `INNGEST_EVENT_KEY` and `INNGEST_SIGNING_KEY` to your Vercel environment variables.

When a user requests a video in production, the Vercel-hosted Inngest function triggers a `repository_dispatch` event. GitHub Actions spins up an Ubuntu runner, installs Chromium/FFmpeg, renders the video using Remotion, uploads the `.mp4` to Supabase, and marks the database record as complete.

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.
