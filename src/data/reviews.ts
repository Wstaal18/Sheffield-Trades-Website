/**
 * Ratings & hand-picked reviews, copied word-for-word from the club's
 * Google listing and Facebook page. Update the numbers now and then.
 *
 * The reviews section hides itself if there's no rating and no reviews.
 * Reviews alternate between the two scrolling rows in the order listed.
 * Names are shortened to first name + initial. `stars` is optional (only add it if known).
 */
export type Review = { name: string; text: string; source: 'google' | 'facebook'; stars?: number; when?: string };

export const googleReviews = {
  rating: 4.5 as number | null,
  count: 109 as number | null,
  url: 'https://maps.app.goo.gl/NgRcVwYH2hfvwRUT6',
};

export const facebookReviews = {
  /** "% recommend" figure Facebook shows */
  recommendPercent: 96 as number | null,
  count: 23 as number | null,
  url: 'https://www.facebook.com/profile.php?id=100063482235781&sk=reviews',
};

/** "as of" note for the figures above */
export const reviewsUpdated = 'November 2026';

export const reviews: Review[] = [
  { source: 'google', name: 'Gary T.', text: 'Good vibrant social club. Friendly staff, excellent drink prices.' },
  { source: 'facebook', name: 'Teresa K.', text: 'Hired the concert room for private parties on a few occasions and staff work hard and are very friendly would recommend for private functions. Also good as a member too 😁' },
  { source: 'google', name: 'Kevin D.', text: 'Fantastic friendly staff, welcoming atmosphere and cheap drinks. Top marks to Sean and his staff.' },
  { source: 'facebook', name: 'Sue Michelle', text: 'I hired the function room last night. I would highly recommend. The staff were amazing and couldn’t help more. This venue is essential for the community …' },
  { source: 'google', name: 'Khalil', text: 'Absolutely amazing pub, used there function room once to organise strike action and drink in there often, staff are super friendly drinks are cheap and the atmosphere is realy chill.' },
  { source: 'facebook', name: 'Debster P.', text: "it's a right good laugh . Good old mates in there. Shaun does a banging job" },
  { source: 'google', name: 'Lawrence B.', text: 'The Trades & Labour Club Is A Fantastic Venue With Lovely Staff, Lovely People, Good Pricing, Fantastic Entertainment Going Off All The Time & A Place That Makes You Always Feel Welcome' },
  { source: 'facebook', name: 'Alex O.', text: 'Great responsive audience and in club style there were bingo prizes. … Clean tidy building, easy to get too with parking and friendly staff.' },
  { source: 'google', name: 'Pauline W.', text: 'It was an 80th Birthday Party and it was good. … Food was good and was a good night all round.' },
  { source: 'facebook', name: 'Michael W.', text: 'top notch staff and customers alike. great place to visit' },
  { source: 'google', name: 'Levi C.', text: 'Brilliant place, everyone so warm and welcoming. Bar service excellent and nice variety of entertainment on a Sunday. Spot on!' },
  { source: 'google', name: 'Chris S.', text: 'Good atmosphere, very polite, friendly staff and a good pint 🍻' },
  { source: 'google', name: 'Joanne P.', text: 'The staff are sooo lovely. Great atmosphere and nothing is to much trouble.' },
  { source: 'google', name: 'An S.', text: "Absolutely amazing bar lady. Prices aren't too bad and the atmosphere is great, very accommodating" },
  { source: 'google', name: 'Multi Retro Man', text: 'Great place. Staff really friendly and prices very cheap as well. Love it :)' },
  { source: 'google', name: 'Pheonix B.', text: 'great atmosphere amazing people love going every Sunday' },
  { source: 'google', name: 'Karen S.', text: 'Brill place to visit and always someone to chat to love it x' },
  { source: 'google', name: 'Janet C.', text: 'We Feel welcome here love this club' },
];
