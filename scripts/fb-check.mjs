#!/usr/bin/env node
/**
 * Run by the "Facebook refresh" GitHub Action every few hours.
 *
 * Compares the Facebook feed right now with the fingerprint published on the
 * live site (/fb-version.txt). Only if they differ does it trigger a Netlify
 * rebuild, so builds are used only when there's actually something new.
 *
 * Env vars:
 *   FB_PAGE_TOKEN       Page access token (GitHub secret)
 *   NETLIFY_BUILD_HOOK  Netlify build hook URL (GitHub secret)
 *   SITE_URL            optional, defaults to https://sheffieldtrades.co.uk
 *   FORCE_REBUILD       "true" to rebuild regardless
 */
import { config, fetchPosts, fingerprint } from './fb-lib.mjs';

const hook = process.env.NETLIFY_BUILD_HOOK;
const siteUrl = (process.env.SITE_URL || 'https://sheffieldtrades.co.uk').replace(/\/$/, '');
const force = process.env.FORCE_REBUILD === 'true';

async function liveFingerprint() {
  try {
    const res = await fetch(`${siteUrl}/fb-version.txt`, { cache: 'no-store' });
    return res.ok ? (await res.text()).trim() : null;
  } catch {
    return null;
  }
}

async function main() {
  if (!hook) throw new Error('NETLIFY_BUILD_HOOK secret is not set');
  if (!config.token) throw new Error('FB_PAGE_TOKEN secret is not set');

  // Fails loudly (and GitHub emails you) if the token has stopped working
  const current = fingerprint(await fetchPosts());
  const live = await liveFingerprint();
  console.log(`Facebook feed: ${current} · live site: ${live ?? 'unknown'}`);

  if (!force && live === current) {
    console.log('No new or edited posts, nothing to do.');
    return;
  }

  console.log(force ? 'Forced rebuild requested.' : 'Feed has changed, triggering Netlify rebuild…');
  const res = await fetch(`${hook}?trigger_title=${encodeURIComponent('Facebook refresh')}`, { method: 'POST' });
  if (!res.ok) throw new Error(`Build hook returned ${res.status}`);
  console.log('Netlify rebuild triggered.');
}

main().catch((e) => {
  console.error(`[fb-check] ${e.message}`);
  process.exit(1);
});
