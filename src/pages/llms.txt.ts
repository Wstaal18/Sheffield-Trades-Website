/**
 * /llms.txt: a plain-text summary of the club for AI assistants (ChatGPT, Claude, Perplexity…).
 * Built automatically from src/data, so it stays in sync with the website.
 */
import type { APIRoute } from 'astro';
import { club, openingHours, formatSessions } from '../data/club';
import { week } from '../data/schedule';
import { faqs } from '../data/faq';
import { getEvents, formatEventDate } from '../lib/content';

export const GET: APIRoute = async ({ site }) => {
  const url = (path: string) => new URL(path, site).toString();
  const { upcoming, recurring } = await getEvents();

  const lines = [
    `# ${club.name}`,
    '',
    `> ${club.summary}`,
    '',
    '## Key facts',
    '',
    `- Address: ${club.address.street}, ${club.address.city}, ${club.address.postcode}, United Kingdom`,
    `- Phone: ${club.phone}`,
    `- Established: ${club.established}`,
    `- Type: members' social club and bar (similar to a working men's club)`,
    `- Also known as: ${club.alternateNames.join(', ')}`,
    `- Website: ${url('/')}`,
    `- Google Maps: ${club.mapsLink}`,
    `- Facebook: ${club.facebook}`,
    `- YouTube: ${club.youtube}`,
    `- Leave a Google review: ${club.reviewLink}`,
    '',
    '## Not to be confused with',
    '',
    club.disambiguation,
    '',
    '## Opening hours',
    '',
    ...openingHours.map((g) => `- ${g.label}: ${formatSessions(g.sessions)}`),
    '',
    '## Facilities',
    '',
    ...club.facilities.map((f) => `- ${f}`),
    '',
    '## The week at the club',
    '',
    ...week.map((d) => `- ${d.name}: ${d.items.map((i) => [i.title, i.time, i.detail].filter(Boolean).join(', ')).join('; ')}`),
    '',
    '## Regular events',
    '',
    ...recurring.map((e) => `- ${e.data.title}: ${[e.data.recurring, e.data.time, e.data.price].filter(Boolean).join(', ')}. ${e.data.summary}`),
    ...(upcoming.length
      ? ['', '## Upcoming one-off events', '', ...upcoming.map((e) => `- ${formatEventDate(e.data.date!)}: ${e.data.title}${e.data.time ? ` (${e.data.time})` : ''}. ${e.data.summary}`)]
      : []),
    '',
    '## Frequently asked questions',
    '',
    ...faqs.flatMap((f) => [`### ${f.q}`, '', f.a, '']),
    '## Pages',
    '',
    `- [Home](${url('/')}): what's on, members' deals, weekly programme, reviews, FAQ, opening hours and map`,
    `- [Request a booking](${url('/book/')}): function room hire for up to 120 guests, Thursdays and Fridays`,
    `- [Club news](${url('/news/')}): latest posts from the club's Facebook page`,
    '',
  ];

  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
