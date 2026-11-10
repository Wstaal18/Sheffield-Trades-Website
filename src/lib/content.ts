import { getCollection, type CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';
import feed from '../data/facebook.json';

export type ClubEvent = CollectionEntry<'events'>;

/** Start of today in UK time, so an event stays listed for its whole day. */
function startOfTodayUK(): Date {
  const ymd = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/London' }).format(new Date());
  return new Date(`${ymd}T00:00:00`);
}

export async function getEvents() {
  const all = (await getCollection('events')).filter((e) => !e.data.hidden);
  const today = startOfTodayUK();
  const upcoming = all
    .filter((e) => e.data.date && (e.data.endDate ?? e.data.date) >= today)
    .sort((a, b) => a.data.date!.getTime() - b.data.date!.getTime());
  const recurring = all
    .filter((e) => !e.data.date && e.data.recurring)
    .sort((a, b) => a.data.order - b.data.order);
  return { upcoming, recurring };
}

export function formatEventDate(d: Date): string {
  return new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Europe/London' }).format(d);
}

/* ---------- Facebook feed ---------- */

export type FbPost = {
  id: string;
  message: string;
  createdTime: string;
  permalink: string;
  image: string | null;
};

const fbImages = import.meta.glob<{ default: ImageMetadata }>('../assets/fb/*.{jpg,jpeg,png,webp,gif}', { eager: true });

export function fbImage(file: string | null): ImageMetadata | undefined {
  if (!file) return undefined;
  return fbImages[`../assets/fb/${file}`]?.default;
}

export function getFacebookPosts(limit?: number): FbPost[] {
  const posts = (feed as { posts: FbPost[] }).posts ?? [];
  return typeof limit === 'number' ? posts.slice(0, limit) : posts;
}

export const fbFetchedAt: string | null = (feed as { fetchedAt: string | null }).fetchedAt;

/** Absolute date (not "2 days ago"), because the page is only rebuilt every few hours. */
export function postDate(iso: string): string {
  const d = new Date(iso);
  const oldYear = d.getFullYear() !== new Date().getFullYear();
  return new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: oldYear ? 'numeric' : undefined, timeZone: 'Europe/London' }).format(d);
}
