/**
 * Core club details. Change them here and they update everywhere
 * (header, footer, Find Us page, Google structured data).
 */
export const club = {
  name: 'Sheffield Trades & Labour Club',
  shortName: 'Sheffield Trades',
  established: 1981,
  tagline: 'Good drinks, great company and proper club nights in the heart of Sheffield since 1981.',
  address: {
    street: '200 Duke Street',
    city: 'Sheffield',
    postcode: 'S2 5QQ',
    country: 'GB',
  },
  phone: '0114 275 4671',
  phoneHref: 'tel:+441142754671',
  email: 'info.sheffieldtrades@gmail.com',
  facebook: 'https://www.facebook.com/profile.php?id=100063482235781',
  youtube: 'https://www.youtube.com/@SunNightSheffTradesLabour',
  mapsLink: 'https://maps.app.goo.gl/NgRcVwYH2hfvwRUT6',
  // Exact pin from the Google listing
  geo: { lat: 53.3789272, lng: -1.4556784 },
  mapsEmbed: 'https://www.google.com/maps?q=Sheffield+Trades+%26+Labour+Club@53.3789272,-1.4556784&z=17&output=embed',
};

/**
 * Opening hours. Days use 0 = Sunday … 6 = Saturday.
 * `sessions` are [open, close] in 24h "HH:MM"; a close of "24:00" means midnight.
 */
export const openingHours: { days: number[]; label: string; sessions: [string, string][] }[] = [
  { days: [1, 3, 5, 6, 0], label: 'Mon, Wed, Fri, Sat & Sun', sessions: [['12:00', '17:00'], ['19:00', '24:00']] },
  { days: [2, 4], label: 'Tue & Thu', sessions: [['19:00', '23:30']] },
];

export function formatTime(t: string): string {
  if (t === '24:00') return 'midnight';
  const [h, m] = t.split(':').map(Number);
  const suffix = h >= 12 ? 'pm' : 'am';
  const hour = h % 12 === 0 ? 12 : h % 12;
  return m ? `${hour}:${String(m).padStart(2, '0')}${suffix}` : `${hour}${suffix}`;
}

export function formatSessions(sessions: [string, string][]): string {
  return sessions.map(([a, b]) => `${formatTime(a)}–${formatTime(b)}`).join(' & ');
}
