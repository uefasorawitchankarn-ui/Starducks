# Starducks — vintage galaxy journal (static prototype)

This is a pure HTML/CSS/JS prototype ready for GitHub → Netlify. It includes:

- Vintage galaxy theme with *lots* of moving white stars on a black sky
- Homepage with **Join**, **Public Chat**, **Flight Crew** (admin) buttons
- An unlabeled **symbol** (NewJeans-ish) that opens the **song** on YouTube
- **Song editor** page — requires curator code `2626` to set a YouTube URL
- **World clocks** for NYC, Bangkok, Tokyo, LA, London
- **Login/Signup** (localStorage demo)
- **Flight Crew** unlock via code `1207` (only signed-in users can unlock)
- **Posts** (contenteditable editor; add images by URL or upload; edit/delete of own posts can be added later; comments + Flight)
- **Public Chat** (requires sign-in to send messages)
- **Profile & Country** (choose country and profile photo) — emojis as flags; tiny flag appears next to name
- Footer: small gray **Design by Uefa Chankarn**

> ⚠️ This is a *no-backend demo*. Data is stored locally in the browser (localStorage). For real multi-user features, connect a backend later (Supabase/Firebase/etc.).

## Fonts
- The site uses **Alagard** for body text via `@font-face` at `assets/fonts/Alagard.ttf`. Add that file (TTF) yourself. Headings use a serif (you can change `--heading-font` in `styles.css`).

## Codes
- Crew (developers) code: **1207**
- Song curator code: **2626**

If a visitor tries to use `1207` without being signed in, they’ll be prompted to sign up first.

## Email notifications (optional)
If you deploy on **Netlify**, the client will POST to `/.netlify/functions/notify` whenever `1207` is used or a post is created. To enable email:
1. In Netlify site settings → **Environment variables**, set `SENDGRID_API_KEY` to your API key.
2. Optionally set `TO_EMAIL` (default is `uefa.sorawit.chankarn@gmail.com`).
3. Redeploy. You’ll get emails from `noreply@starducks.space`.

You can swap SendGrid for another provider by editing `netlify/functions/notify.js`.

## Structure
```
index.html          // homepage (Join, Public Chat, Song symbol, Clocks, feed preview)
login.html          // Join (signup + login)
crew.html           // Flight Crew access (enter 1207)
post.html           // Post editor (contenteditable; crew-only)
feed.html           // All posts + comments + Flight
profile.html        // Profile & Country (crew-only recommended)
chat.html           // Public chat (sign-in to send)
set-song.html       // Set homepage song (enter 2626)
styles.css          // theme styles
js/*.js             // scripts (shared utils in js/app.js)
assets/logo.svg     // artist-style wordmark
assets/grain.png    // film grain overlay
assets/fonts/       // put Alagard.ttf here
netlify/functions/notify.js // optional email sender
```

## Add/Change images later
- **Logo:** replace `assets/logo.svg` with your own.
- **Profile picture:** in Profile page, upload — it’s stored locally as a data URL.
- **Post images:** paste a URL or upload; stored inside the post HTML (as data URLs for uploads).

## Deploy: GitHub → Netlify (auto-deploy)
1. Push this folder to a new GitHub repo.
2. In Netlify, **Add new site** → **Import from GitHub** → pick the repo → deploy.
3. (Optional) Set environment variables for email in Netlify.
4. Each push to GitHub will auto-deploy.

## Notes & Next steps
- Real authentication, shared database, and moderation can be added later.
- The “Flight” action is one per signed-in user per post (tracked client-side).
- Only the **Flight Crew** has profile pages; visitors don’t.
- The posting UI only appears after entering **1207** (not visible to others).

Enjoy ✨
