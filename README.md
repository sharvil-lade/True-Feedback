# True Feedback

Anonymous feedback platform built with Next.js App Router, NextAuth, MongoDB, and AI-powered moderation.

Users can:
- Sign up with username and email, verify via one-time code sent by email
- Toggle whether they're accepting anonymous messages
- Share a public profile URL to receive anonymous messages
- Use AI to enhance their message before sending (preserves original intent, temperature 0)
- View and delete received messages in their dashboard
- See message stats (total / safe / flagged) at a glance

## AI features
- **Content moderation** — every incoming message is classified as `safe`, `borderline`, or `toxic` by Gemini before saving. Toxic messages are blocked outright; borderline messages are flagged and visible in a separate filter tab on the dashboard.
- **Message enhancement** — senders can enhance their draft with AI (Gemini, temperature 0) to improve clarity without changing the original meaning or intent.

## Tech stack
- Next.js 15.5.19 (App Router) + TypeScript
- React + Tailwind CSS (v4)
- NextAuth.js (JWT sessions, Credentials provider)
- MongoDB + Mongoose
- Nodemailer + React Email (for HTML emails)
- Google Generative AI (Gemini 1.5 Flash) — moderation + enhancement


## Project structure
Key folders and files:
- `src/app` — App Router pages and API routes
  - `api/` — auth, signup/verify, messages (send/get/delete), toggles, moderation, enhancement
  - `(auth)/sign-in`, `(auth)/sign-up`, `(auth)/verify/[username]`
  - `(app)/dashboard` — authenticated area with stats and flagged filter
  - `u/[username]` — public anonymous message page
- `src/model/User.ts` — Mongoose schemas for User and embedded messages (includes `isFlagged`, `moderationScore`, `moderationLabel`)
- `src/lib/` — `dbConnect` (Mongo), `moderateMessage` (AI moderation helper)
- `src/helpers/sendVerificationEmail.ts` — renders and sends verification email
- `emails/VerificationEmail.tsx` — React Email template
- `src/components` — UI components and primitives


## Environment variables
Copy `.env.example` to `.env.local` and fill in values:
- `MONGODB_URI` — MongoDB connection string
- `NEXTAUTH_SECRET` — long random string for NextAuth JWT/signing
- `NEXTAUTH_URL` — base URL (e.g., `http://localhost:3000` in dev, Vercel URL in prod)
- `EMAIL` — sender email (e.g., your Gmail address)
- `PASSWORD` — email provider app password (for Gmail, use an App Password)
- `GEMINI_API_KEY` — Google Generative AI API key (required for moderation + enhancement)

Notes:
- Gmail requires 2FA and an App Password. Regular account password won't work.
- When deploying, set the same variables in your hosting provider (e.g., Vercel Project Settings > Environment Variables).


## Local development
Prerequisites:
- Node.js 18.17+ (or 20+ recommended)
- A MongoDB database (Atlas or local)
- Email credentials (Gmail App Password or another SMTP provider)
- Google Generative AI API key

Install dependencies and run the dev server:
```powershell
npm install
npm run dev
```
Open http://localhost:3000.

## App flow
1. Sign up: create an account with username, email, and password
2. Email verification: a 6-digit code is sent to your email
3. Verify: enter the code on `/verify/[username]`
4. Sign in: use email/username + password
5. Dashboard: view stats, filter flagged messages, delete messages, toggle acceptance
6. Public page: share `/u/[username]` — senders can optionally enhance their message with AI before sending

## API routes
- `POST /api/sign-up` — create or refresh unverified user, send verification code
- `POST /api/verify-code` — verify code, mark user as verified
- `GET /api/check-username-unique?username=` — validate username availability
- `GET /api/accept-messages` — read current acceptance status (auth required)
- `POST /api/accept-messages` — update acceptance status (auth required)
- `GET /api/get-messages` — fetch messages for current user, sorted newest first (auth required)
- `DELETE /api/delete-message/[messageId]` — delete a message by id (auth required)
- `POST /api/send-message` — public endpoint; runs AI moderation before saving
- `POST /api/enhance-message` — enhance a draft message with Gemini (temperature 0)

## Scripts
```powershell
npm run dev     # Start the development server
npm run build   # Build for production
npm run start   # Start the production server (after build)
npm run lint    # Run linting
```

## Deployment
- Recommended: Vercel
- Set all environment variables in Vercel project settings
- Ensure `NEXTAUTH_URL` matches your deployed URL

## Troubleshooting
- Mongo connection failing: verify `MONGODB_URI`, Atlas IP allowlist, and network access
- Email not sending: ensure `EMAIL` and `PASSWORD` (app password) are set; check provider limits
- Verification not received: check spam folder; sign up again to resend the code
- 401 on protected routes: confirm you're signed in and `NEXTAUTH_SECRET` is set
- Moderation/enhancement not working: verify `GEMINI_API_KEY` is set and has quota

## Acknowledgements
- Next.js, React, Tailwind CSS
- NextAuth.js
- MongoDB + Mongoose
- Nodemailer + React Email
- Google Generative AI (Gemini)
