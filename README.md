# Sheffield Trades & Labour Club website

Static site built with [Astro](https://astro.build) + Tailwind CSS v4, hosted on **Netlify**.
The "Club News" feed comes from the club's Facebook Page and updates automatically whenever new posts appear.

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
| FAQ (homepage + Google FAQ data + `llms.txt`) | `src/data/faq.ts` |
| Facilities, other names, summary used by Google & AI assistants | `src/data/club.ts` |

### Search engines & AI assistants (SEO)

All of this is generated from the data files above, so keeping those files accurate keeps Google and AI answers accurate.

- **Page titles, descriptions, social previews:** `src/layouts/Layout.astro` (defaults) and each page's `<Layout title=… description=…>`.
- **Structured data (JSON-LD):** the club details (address, phone, hours, facilities, socials, booking link) live in `Layout.astro`.
  Events and the FAQ are on `index.astro`, and the function-room service is on `book.astro`.
  Recurring events only get schedule data if their `.md` file has a `schedule:` line (see `_TEMPLATE.md.example`).
- **`/llms.txt`:** a plain-text summary for ChatGPT, Claude, Perplexity and others, built by `src/pages/llms.txt.ts`.
- **`public/robots.txt`:** allows all search engines and AI crawlers, and points to the sitemap (made automatically by `@astrojs/sitemap`).
- **Google Business Profile:** keep the hours, phone and address there identical to `src/data/club.ts`.

### Adding an event (can be done on github.com, no code tools needed)

1. Upload the poster to `src/assets/images/` (optional).
2. In `src/content/events/`, click **Add file → Create new file**, e.g. `2026-12-31-new-years-eve.md`.
3. Copy the layout from `_TEMPLATE.md.example` and fill it in. Commit to `main`, and Netlify rebuilds the site in about 2 minutes.

Events with a `date` disappear automatically after that day. Recurring events use `recurring:` instead of `date:`.
Set `hidden: true` to take an event down without deleting it.

---

## How it all fits together

```
 Facebook Page ──(every 3 hrs)──► GitHub Action "Facebook refresh"
                                     │  new/edited posts?  no → stop (no build used)
                                     ▼ yes
 GitHub repo (main) ──push──►  Netlify build:  fetch Facebook posts → astro build → publish
                                     ▲
                    Netlify build hook (secret)
```

- **Netlify** is linked to this repo. Every push to `main` triggers a build, and `netlify.toml` holds the build settings.
- **The build** (`npm run build`) first runs `scripts/fetch-facebook.mjs` to download the latest posts and images,
  then builds the site. It also publishes `/fb-version.txt`, a short fingerprint of the feed.
- **The "Facebook refresh" GitHub Action** (`.github/workflows/facebook-refresh.yml`) runs every 3 hours. It compares
  Facebook with `/fb-version.txt` on the live site and only triggers a Netlify build if something has changed.
  That keeps Netlify build usage tiny.
- **If the Facebook token stops working**, both the check and the Netlify build fail on purpose. GitHub emails you,
  and the live site keeps showing its last good version.

### Secrets & settings

| Where | Name | Value |
|---|---|---|
| Netlify → Site configuration → **Environment variables** | `FB_PAGE_TOKEN` | the Facebook Page token |
| GitHub → Settings → Secrets and variables → **Actions** | `FB_PAGE_TOKEN` | the same Page token |
| GitHub → Settings → Secrets and variables → **Actions** | `NETLIFY_BUILD_HOOK` | Netlify build hook URL (see below) |

**Creating the build hook:** Netlify → the site → **Site configuration → Build & deploy → Continuous deployment →
Build hooks → Add build hook**. Name it `Facebook refresh`, branch `main`, then **Save**. Copy the URL it shows into the
`NETLIFY_BUILD_HOOK` GitHub secret.

**Refresh manually:** GitHub → **Actions** tab → **Facebook refresh** → **Run workflow**. Tick *force* to rebuild even if
nothing changed. Or in Netlify: **Deploys → Trigger deploy → Deploy site**.

> GitHub pauses scheduled workflows in repos with no activity for 60 days. If new Facebook posts stop appearing and
> there's no failure email, open the **Actions** tab and re-enable **Facebook refresh** (or push any small change).

---

## Facebook token: setup & renewal

The website needs a **Facebook Page access token**, a long password-like code that lets it *read* the Page's posts.
It can't post or change anything.

The club's Page is **owned by the club's business portfolio**, so the token comes from a **system user** in that
portfolio. That means it **isn't tied to anyone's personal Facebook account** and keeps working if people change passwords
or leave.

**Current setup** (for reference):

| Thing | Name / ID |
|---|---|
| Business portfolio | Sheffield Trades & Labour Club (`3028026510712536`) |
| Meta app | `Trades_Business` (`1127274349883931`), owned by the portfolio |
| System user | `Website`, Admin, assigned the Page (full control) and the app |
| Facebook Page ID | `134549869940296` |

### Before you start

- Log in to Facebook as someone who is an **admin of the club's business portfolio**.
- Open **Notepad** for pasting into as you go (keep it *outside* the project folder).
- **Treat tokens like passwords.** Don't email them, post them in chat, or put them in any project file.
  Delete the Notepad file when you're done.

> Meta tweaks these screens from time to time, so a button may be worded slightly differently. Look for the closest match.

### Step 1: Generate the system user token

1. Go to <https://business.facebook.com/settings/system-users?business_id=3028026510712536>
   (or business.facebook.com → ⚙️ Settings → **Users → System users**).
2. Click **Website**.
   - *First-time setup only:* if it doesn't exist, click **+ Add** → name `Website`, role **Admin** → **Create system user**.
     Then click **Assign assets** twice: once for the **Page** *Sheffield Trades & Labour Club* (full control), and once
     for the **App** *Trades_Business* (full control).
3. Click **Generate token**:
   - **App:** Trades_Business
   - **Token expiration:** **Never**
   - **Permissions:** `pages_show_list`, `pages_read_engagement`, `pages_read_user_content`
4. Click **Generate token** and copy it into Notepad as `TOKEN S`. It's only shown once.

### Step 2: Swap it for the Page token

1. Open the **Graph API Explorer**: <https://developers.facebook.com/tools/explorer/>
2. Delete what's in the **Access Token** box at the top and paste **TOKEN S**.
   Don't click *Generate Access Token* on the right, because that would replace it.
3. In the query bar, after the version (e.g. `v23.0/`, with **no space**), enter:

   ```
   me/accounts?fields=name,access_token
   ```

4. Click **Submit**. You'll see:

   ```
   "name": "Sheffield Trades & Labour Club",
   "access_token": "EAAQ……long code……",
   ```

5. Copy **just the long code** after `"access_token":`, without the quote marks or the comma after them.
   That's the **Page token**. Ignore the `"id"` and `"paging"` bits.

✅ **Check it:** paste it into the [Access Token Debugger](https://developers.facebook.com/tools/debug/accesstoken/) and click
**Debug**. You want **Type: Page** and **Expires: Never**.

### Step 3: Put the Page token in both places

1. **GitHub:** <https://github.com/Wstaal18/Sheffield-Trades-Website/settings/secrets/actions>.
   Edit `FB_PAGE_TOKEN` with the pencil icon (or create it with **New repository secret**) and paste the Page token.
2. **Netlify:** the site → **Site configuration → Environment variables**. Edit `FB_PAGE_TOKEN` (or **Add a variable**)
   and paste the same Page token.
3. Trigger a rebuild: GitHub **Actions → Facebook refresh → Run workflow** (tick *force*).

✅ In the Netlify deploy log you should see `[facebook] saved 24 posts (…)`.

### Optional: test on your computer

Create a file called `.env` in the project folder containing one line, `FB_PAGE_TOKEN=` followed by the Page token
(no spaces or quotes). Run `npm run fetch:fb` and you should see `[facebook] saved … posts`. Then `npm run dev`.
`.env` is ignored by git, so it can't be committed.

### If the news feed stops updating

A system user token doesn't expire, but it stops working if someone clicks **Revoke tokens** on the `Website` system
user, removes its access to the Page, or deletes the app. You'll get a GitHub email about a failed **Facebook refresh**
run. The live site keeps its last good version.

**Fix:** repeat **Steps 1–3** above.

| Message in the failed run's log | What it means | Fix |
|---|---|---|
| `code 190` | Token revoked or invalid | Steps 1–3 |
| `code 10` / `code 200` / mentions a permission | A permission is missing from the token | Step 1, making sure all three permissions are ticked |
| `me/accounts` returns `"data": []` | The token isn't from the system user, or the system user isn't assigned the Page | Use the system user token; check **Assign assets** includes the Page |
| `NETLIFY_BUILD_HOOK secret is not set` | Build hook missing from GitHub | See *Creating the build hook* above |

---

## Old URLs

Old links like `/booking.html` permanently redirect (301) to `/book/` via `public/_redirects`, so bookmarks and search results keep working.
