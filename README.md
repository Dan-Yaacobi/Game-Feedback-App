# Sky Archer — Feedback & Bug Report App

A Next.js web app for collecting player feedback and bug reports for **Sky Archer**. Emails are delivered via [Resend](https://resend.com).

---

## Local development

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy the example file and fill in your values:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
CONTACT_EMAIL=you@yourdomain.com
```

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Add `?version=0.1.0` to the URL to simulate a version param from the game.

---

## Setting up Resend

1. Sign up at [resend.com](https://resend.com).
2. Go to **API Keys** → **Create API Key** → copy the key into `RESEND_API_KEY`.
3. **Sender email:**
   - For testing, the pre-verified `onboarding@resend.dev` sender works immediately (emails can only go to your own Resend-verified address in sandbox mode).
   - For production, go to **Domains** → **Add Domain**, verify your DNS records, then change the `from` address in `app/api/feedback/route.js` to `feedback@yourdomain.com`.

---

## Deploying to Vercel

1. Push this repo to GitHub.
2. Go to [vercel.com](https://vercel.com) → **New Project** → import your repo.
3. Vercel auto-detects Next.js — no build config needed.
4. Before deploying, add your environment variables:
   - **Settings → Environment Variables**
   - Add `RESEND_API_KEY` and `CONTACT_EMAIL`
5. Click **Deploy**.

Your app will be live at `https://your-project.vercel.app`.

---

## Passing `version` from Godot

The app reads `?version=` from the URL query string and silently includes it in every email.

In Godot, open the feedback page using `OS.shell_open()` with the version embedded:

```gdscript
var version = "1.0.3"
var url = "https://your-project.vercel.app/?version=" + version
OS.shell_open(url)
```

This opens the player's default browser with the correct version param. The player never sees the version string — it only appears in the email.
