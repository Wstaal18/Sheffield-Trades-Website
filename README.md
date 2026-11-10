# Sheffield Trades & Labour Club website

Static site built with [Astro](https://astro.build) + Tailwind CSS v4, deployed to GitHub Pages.
The "Club News" feed is pulled automatically from the club's Facebook Page every 3 hours.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to dist/
```

## Where to edit things

| What | File |
|---|---|
| Address, phone, email, social links | `src/data/club.ts` |
| Opening hours | `src/data/club.ts` (`openingHours`) |
| Weekly programme & drinks deals | `src/data/schedule.ts` |
| Homepage deal cards | `src/pages/index.astro` (`deals`) |
| One-off & recurring events | `src/content/events/*.md` |
| Booking form | `src/pages/book.astro` (submits to Formspree `mblzkjyd`) |
| Google rating, Facebook "% recommend" & quoted reviews | `src/data/reviews.ts` |
| Privacy policy settings (retention periods, last-updated date) | `src/data/privacy.ts` |

### Adding an event (can be done on github.com, no code tools needed)

1. Upload the poster to `src/assets/images/` (optional).
2. In `src/content/events/`, click **Add file → Create new file**, e.g. `2026-12-31-new-years-eve.md`.
3. Copy the layout from `_TEMPLATE.md.example` and fill it in. Commit, and the site rebuilds in about 2 minutes.

Events with a `date` disappear automatically after that day. Recurring events use `recurring:` instead of `date:`.
Set `hidden: true` to take an event down without deleting it.

## Facebook sync: one-time setup

The build runs `scripts/fetch-facebook.mjs`, which needs a **non-expiring Page access token**.
You must be an admin of the Facebook Page.

1. Go to <https://developers.facebook.com/apps> → **Create app** → choose the *Business* type (or the
   "Manage everything on your Page" use case). Name it something like "Trades Club Website". The app can stay in
   **Development mode** because only you (an app admin, who is also a Page admin) use it.
2. Open the [Graph API Explorer](https://developers.facebook.com/tools/explorer/), select your app, then
   **Get User Access Token** with these permissions: `pages_show_list`, `pages_read_engagement`, `pages_read_user_content`.
3. Paste that token into the [Access Token Debugger](https://developers.facebook.com/tools/debug/accesstoken/) and click
   **Extend Access Token**. This gives you a long-lived *user* token.
4. Back in the Graph API Explorer, using the long-lived user token, run `GET me/accounts`. Copy the `access_token`
   shown for *Sheffield Trades & Labour Club*. This is the **Page token**.
5. Check it in the Access Token Debugger: **Expires** should say **Never**.
6. In GitHub: **Settings → Secrets and variables → Actions → New repository secret**, name it `FB_PAGE_TOKEN` and paste the Page token.
7. For local testing, copy `.env.example` to `.env` and add the token there too (`.env` is git-ignored, so never commit it).

Test it locally with `npm run fetch:fb`.

**If the feed stops updating:** the token is invalidated if you change your Facebook password, lose Page admin rights,
or remove the app. When that happens the scheduled build **fails on purpose** (GitHub emails you), and the live site
keeps showing the last good feed. Repeat steps 2–6 to fix it.

## Deployment (GitHub Pages)

1. Push this repo to GitHub.
2. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
3. Under **Settings → Pages → Custom domain**, enter `sheffieldtrades.co.uk` (keep "Enforce HTTPS" on).

The workflow in `.github/workflows/deploy.yml` runs on every push, every 3 hours (to refresh Facebook posts),
and on demand from the **Actions** tab ("Run workflow").

> GitHub pauses scheduled workflows in repos with no activity for 60 days. If the news feed stops updating and
> there's no failure email, open the Actions tab and re-enable the workflow (or just push any small change).

## Old URLs

`/booking.html` and `/booking-success.html` redirect to `/book/` so old links and bookmarks keep working.
