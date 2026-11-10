/**
 * The regular weekly programme. This is the part that rarely changes.
 * One-off events live in src/content/events/ instead.
 *
 * Days use 0 = Sunday … 6 = Saturday.
 */
export type ScheduleItem = {
  title: string;
  time?: string;
  detail?: string;
  kind: 'deal' | 'entertainment' | 'club' | 'note';
};

export type Day = {
  day: number;
  name: string;
  headline: string;
  items: ScheduleItem[];
};

export const happyHour: ScheduleItem = {
  title: 'Happy Hour',
  time: '2pm–3pm',
  detail: 'All pints on draught £2.95',
  kind: 'deal',
};

export const week: Day[] = [
  {
    day: 1,
    name: 'Monday',
    headline: 'Monday Club',
    items: [
      { title: 'Monday Club', time: '12pm–5pm', detail: 'Select lagers & beers £2.50 · Guinness £3.60 · Ciders & premium lager £2.95', kind: 'deal' },
      happyHour,
      { title: 'Kids Karate Club', time: '6pm–8pm', detail: 'Ages 5–12, pay as you go from £5', kind: 'club' },
      { title: '£10 Bingo Night', time: '7pm', detail: 'Last Monday of every month', kind: 'entertainment' },
    ],
  },
  {
    day: 2,
    name: 'Tuesday',
    headline: 'Cheap Tuesday',
    items: [
      { title: 'Cheap Tuesday', time: 'All day', detail: 'All pints on draught £2.95', kind: 'deal' },
      { title: 'Chess Club', time: 'From 7:30pm', detail: 'Casual or competitive, all levels welcome', kind: 'club' },
    ],
  },
  {
    day: 3,
    name: 'Wednesday',
    headline: 'Ladies Section Bingo',
    items: [
      happyHour,
      { title: 'Ladies Section, Bingo Night', time: '7pm–midnight', kind: 'entertainment' },
    ],
  },
  {
    day: 4,
    name: 'Thursday',
    headline: 'Private functions',
    items: [
      { title: 'Available for private functions', detail: 'Request the room for your party, wake or celebration', kind: 'note' },
    ],
  },
  {
    day: 5,
    name: 'Friday',
    headline: 'Functions & Karate',
    items: [
      happyHour,
      { title: 'Kids Karate Club', time: '6pm–8pm', detail: 'Ages 5–12, pay as you go from £5', kind: 'club' },
      { title: 'Available for private functions', kind: 'note' },
    ],
  },
  {
    day: 6,
    name: 'Saturday',
    headline: 'Saturday Night Live',
    items: [
      happyHour,
      { title: 'Turn singer / live music & bingo', time: '7pm–midnight', kind: 'entertainment' },
      { title: '25% off everything in the concert room', time: 'Evening', kind: 'deal' },
    ],
  },
  {
    day: 0,
    name: 'Sunday',
    headline: 'Musical Bingo',
    items: [
      happyHour,
      { title: 'Musical Bingo', time: '7pm–midnight', kind: 'entertainment' },
      { title: 'Karaoke & regular bingo', kind: 'entertainment' },
    ],
  },
];
