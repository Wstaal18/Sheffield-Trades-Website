#!/usr/bin/env node
/**
 * Pulls the latest posts from the club's Facebook Page via the Graph API
 * and saves them for the site build:
 *   - src/data/facebook.json   post text, dates, links
 *   - src/assets/fb/<id>.<ext> post images (downloaded, because Facebook's
 *                              image URLs expire; Astro then optimises them)
 *
 * Env vars:
 *   FB_PAGE_TOKEN     required for a live fetch: a long-lived *Page* access token
 *   FB_PAGE_ID        optional, defaults to "me" (the Page the token belongs to)
 *   FB_GRAPH_VERSION  optional, defaults to v23.0
 *   FB_POST_LIMIT     optional, defaults to 24
 *
 * Behaviour:
 *   - No token: keeps any existing data (or writes an empty feed) and exits 0,
 *     so local development works without credentials.
 *   - Token set but the fetch fails: exits 1. In CI this stops the deploy,
 *     so the live site keeps its last good feed instead of going blank.
 */
import { mkdir, readdir, rm, writeFile, access } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataFile = path.join(root, 'src/data/facebook.json');
const imageDir = path.join(root, 'src/assets/fb');

// Load .env for local runs (no dependency needed)
const envPath = path.join(root, '.env');
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

const token = process.env.FB_PAGE_TOKEN;
const pageId = process.env.FB_PAGE_ID || 'me';
const version = process.env.FB_GRAPH_VERSION || 'v23.0';
const limit = Number(process.env.FB_POST_LIMIT || 24);

async function exists(p) {
  try { await access(p); return true; } catch { return false; }
}

async function ensureEmptyFeed() {
  await mkdir(path.dirname(dataFile), { recursive: true });
  await mkdir(imageDir, { recursive: true });
  if (!(await exists(dataFile))) {
    await writeFile(dataFile, JSON.stringify({ fetchedAt: null, posts: [] }, null, 2));
    console.log('[facebook] wrote empty feed');
  }
}

const extFor = (contentType) =>
  ({ 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' })[contentType?.split(';')[0]] ?? 'jpg';

async function main() {
  if (!token) {
    console.log('[facebook] FB_PAGE_TOKEN not set, skipping live fetch');
    await ensureEmptyFeed();
    return;
  }

  const fields = 'id,message,created_time,permalink_url,full_picture,status_type';
  const url = `https://graph.facebook.com/${version}/${pageId}/posts?fields=${fields}&limit=${limit}&access_token=${encodeURIComponent(token)}`;
  const res = await fetch(url);
  const body = await res.json();
  if (!res.ok || body.error) {
    const err = body.error ?? {};
    throw new Error(`Graph API error ${res.status}: ${err.message ?? 'unknown'} (code ${err.code ?? '?'}, type ${err.type ?? '?'})`);
  }

  await mkdir(imageDir, { recursive: true });
  const posts = [];
  const keep = new Set(['.gitkeep']);

  for (const p of body.data ?? []) {
    const message = (p.message ?? '').trim();
    if (!message && !p.full_picture) continue; // skip empty shares / profile updates

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
      message,
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
  console.log(`[facebook] saved ${posts.length} posts (${posts.filter((p) => p.image).length} with images)`);
}

main().catch(async (e) => {
  console.error(`[facebook] ${e.message}`);
  process.exit(1);
});
