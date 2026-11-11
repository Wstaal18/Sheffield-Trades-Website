/**
 * Shared Facebook Graph API helpers, used by:
 *   - fetch-facebook.mjs  (runs at the start of every site build)
 *   - fb-check.mjs        (GitHub Action: rebuilds the site only when posts change)
 */
import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Load .env for local runs (no dependency needed)
const envPath = path.join(root, '.env');
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

export const config = {
  token: process.env.FB_PAGE_TOKEN,
  pageId: process.env.FB_PAGE_ID || 'me',
  version: process.env.FB_GRAPH_VERSION || 'v23.0',
  limit: Number(process.env.FB_POST_LIMIT || 24),
};

/** Fetch the Page's latest posts. Throws on any API error. */
export async function fetchPosts() {
  const { token, pageId, version, limit } = config;
  const fields = 'id,message,created_time,permalink_url,full_picture,status_type';
  const url = `https://graph.facebook.com/${version}/${pageId}/posts?fields=${fields}&limit=${limit}&access_token=${encodeURIComponent(token)}`;
  const res = await fetch(url);
  const body = await res.json();
  if (!res.ok || body.error) {
    const err = body.error ?? {};
    throw new Error(`Graph API error ${res.status}: ${err.message ?? 'unknown'} (code ${err.code ?? '?'}, type ${err.type ?? '?'})`);
  }
  // Skip empty shares / profile updates
  return (body.data ?? []).filter((p) => (p.message ?? '').trim() || p.full_picture);
}

/**
 * Short fingerprint of the feed. Changes when a post is added, removed or its
 * text edited. (Image URLs are signed and change on every request, so only
 * whether a post *has* an image is included.)
 */
export function fingerprint(posts) {
  const basis = posts.map((p) => [p.id, p.created_time, (p.message ?? '').trim(), Boolean(p.full_picture)]);
  return createHash('sha256').update(JSON.stringify(basis)).digest('hex').slice(0, 16);
}
