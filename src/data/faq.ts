/**
 * Frequently asked questions. These show on the homepage AND are sent to Google /
 * AI assistants as FAQ structured data, so keep answers short, factual and up to date.
 * Answers are plain text (no HTML).
 */
import { club, openingHours, formatSessions } from './club';

const hours = openingHours.map((g) => `${g.label}: ${formatSessions(g.sessions)}`).join('. ');

export const faqs: { q: string; a: string }[] = [
  {
    q: 'Where is Sheffield Trades & Labour Club?',
    a: `We're at ${club.address.street}, ${club.address.city}, ${club.address.postcode}.`,
  },
  {
    q: 'What are your opening hours?',
    a: `${hours}.`,
  },
  {
    q: 'Can I hire a function room for a party?',
    a: 'Yes. Our function room holds up to 120 guests and is available on Thursdays and Fridays for birthdays, anniversaries, retirement do\'s and wakes. Send a request through the booking page and the club will get back to you to confirm.',
  },
  {
    q: 'Do you host birthday parties?',
    a: 'Yes, for 22nd birthdays and over. We don\'t host birthday parties for anyone younger than that.',
  },
  {
    q: 'What drinks deals do you have?',
    a: 'Members get Monday Club (12pm–5pm) with select lagers and beers at £2.50, Cheap Tuesday with all draught pints at £2.95, happy hour from 2pm–3pm with draught pints at £2.95, and 25% off everything in the concert room on Saturday nights. Ask at the bar about membership.',
  },
  {
    q: 'Do you show live sport?',
    a: 'Yes. We show live sport on Sky Sports and TNT Sports, and we have pool and darts too.',
  },
  {
    q: 'When is bingo on?',
    a: 'Bingo runs on Wednesday nights (Ladies Section), Saturday nights alongside a live singer, and Sunday nights with musical bingo and karaoke. There\'s also a special £10 Bingo Night on the last Monday of every month at 7pm.',
  },
  {
    q: 'Is there anything for kids?',
    a: 'Yes. Our Kids Karate Club runs every Monday and Friday from 6pm–8pm for children aged 5–12, pay as you go from £5 per session.',
  },
  {
    q: 'Do you have a chess club?',
    a: 'Yes. Chess Club meets every Tuesday night from 7:30pm. Play casually or competitively. All skill levels are welcome.',
  },
];
