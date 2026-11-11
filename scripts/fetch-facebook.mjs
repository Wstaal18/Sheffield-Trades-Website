#!/usr/bin/env node
/**
 * Pulls the latest posts from the club's Facebook Page via the Graph API
 * and saves them for the site build:
 *   - src/data/facebook.json   post text, dates, links
 *   - src/assets/fb/<id>.<ext> post images (downloaded, because Facebook's
 *                              image URLs expire; Astro then optimises them)
 *   - public/fb-version.txt    fingerprint of the feed, published with the site
 *                              so the GitHub check can tell when posts change
 *
 * Env vars (see scripts/fb-lib.mjs):
 *   FB_PAGE_TOKEN     required for a live fetch: a never-expiring *Page* access token
 *   FB_PAGE_ID        optional, defaults to "me" (the Page the token belongs to)
 *   FB_GRAPH_VERSION  optional, defaults to v23.0
 *   FB_POST_LIMIT     optional, defaults to 24
 *
 * Behaviour:
 *   - No token: keeps any existing data (or writes an empty feed) and exits 0,
 *     so local development works without credentials.
 *   - Token set but the fetch fails: exits 1. On Netlify this fails the build,
 *     so the live site keeps its last good version instead of going blank.
 */
import { mkdir, readdir, rm, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import { root, config, fetchPosts, fingerprint } from './fb-lib.mjs';

const dataFile = path.join(root, 'src/data/facebook.json');
const imageDir = path.join(root, 'src/assets/fb');
const versionFile = path.join(root, 'public/fb-version.txt');

async function exists(p) {
  try { await access(p); return true; } catch { return false; }
}

const extFor = (contentType) =>
  ({ 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' })[contentType?.split(';')[0]] ?? 'jpg';

async function main() {
  await mkdir(path.dirname(dataFile), { recursive: true });
  await mkdir(imageDir, { recursive: true });

  if (!config.token) {
    console.log('[facebook] FB_PAGE_TOKEN not set, skipping live fetch');
    if (!(await exists(dataFile))) {
      await writeFile(dataFile, JSON.stringify({ fetchedAt: null, posts: [] }, null, 2));
      console.log('[facebook] wrote empty feed');
    }
    await writeFile(versionFile, 'none\n');
    return;
  }

  const raw = await fetchPosts();
  const posts = [];
  const keep = new Set(['.gitkeep']);

  for (const p of raw) {
    let image = null;
    if (p.full_picture) {
      try {
        const img = await fetch(p.full_picture);
        if (img.ok) {
          const file = `${p.id.replace(/[^0-9_]/g, '')}.${extFor(img.headers.get('content-type'))}`;
          await writeFile(path.join(imageDir, file), Buffer.from(await img.arrayBuffer()));
          keep.add(file);
          image = file;
        }
      } catch (e) {
        console.warn(`[facebook] image download failed for ${p.id}: ${e.message}`);
      }
    }
    posts.push({
      id: p.id,
      message: (p.message ?? '').trim(),
      createdTime: p.created_time,
      permalink: p.permalink_url,
      image,
    });
  }

  // Remove images from posts that are no longer in the feed
  for (const f of await readdir(imageDir)) {
    if (!keep.has(f)) await rm(path.join(imageDir, f));
  }

  await writeFile(dataFile, JSON.stringify({ fetchedAt: new Date().toISOString(), posts }, null, 2));
  await writeFile(versionFile, `${fingerprint(raw)}\n`);
  console.log(`[facebook] saved ${posts.length} posts (${posts.filter((p) => p.image).length} with images)`);
}

main().catch((e) => {
  console.error(`[facebook] ${e.message}`);
  process.exit(1);
});
