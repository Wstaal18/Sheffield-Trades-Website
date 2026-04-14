# Sheffield Trades & Labour Club — Website Documentation

## Overview
Static website for the Sheffield Trades & Labour Club community pub. Pure HTML/CSS/JS — no build tools or frameworks. Hosted as flat files.

## Tech Stack
- **HTML5** with Tailwind CSS (via CDN)
- **Feather Icons** (via CDN)
- **AOS** (Animate On Scroll) for scroll animations on homepage
- **Google Fonts** — Playfair Display (headings) + Roboto (body)
- **Formspree** for booking form submission (`https://formspree.io/f/mblzkjyd`)

## File Structure
```
index.html            — Homepage (specials, events, contact/map)
booking.html          — Booking form page (Formspree integration)
booking-success.html  — Post-booking confirmation (unused, success handled inline)
email-template.html   — Email template (standalone)
images/               — Logo, event posters, hero image
```

## Pages

### index.html (Homepage)
- **Nav:** Red bar with logo, Home / Contact / Make a Booking links. Active page highlighted in yellow (`text-yellow-300`).
- **Hero:** Full-width background image with CTAs.
- **Specials (Members Only):** Grid of daily deal cards — Monday Club, Cheap Tuesday, Daily Happy Hour, Wednesday Ladies Section, Saturday Night, Sunday Night.
- **Upcoming Events:** Clairvoyant Night, Bingo Night, Chess Club, and Kids Karate Club are visible. Games Night and Halloween Party cards are commented out (can be restored).
- **Contact/Find Us:** Address, phone, email (click-to-reveal anti-scrape button), hours, embedded Google Map.
- **Footer:** Logo, social links (Facebook, YouTube), copyright.

### booking.html (Make a Booking)
- **Nav:** Same structure as homepage. "Make a Booking" highlighted as active.
- **Booking Form:** Date (Thu/Fri only, JS validated), time slot, party size (max 120), contact details, occasion, special requests. Submitted via Formspree. Success message rendered inline.
- **Contact/Find Us:** Same as homepage.
- **Footer:** Same as homepage.

## Key Patterns
- **Active page highlighting:** The current page link in both desktop and mobile navbars uses `text-yellow-300` (same as hover colour) so users know where they are.
- **Contact anti-scrape:** The email address and phone number in contact sections are hidden behind "Click to reveal" buttons. On click, button text is replaced with the actual contact detail and styling is removed. Contact text is not present in the DOM until user interaction — simple bot deterrent, no CAPTCHA.
- **Commented-out events:** The Halloween Party and Games Night event cards are wrapped in HTML comments. Search for `Halloween Party (hidden` or `Games Night (hidden` to find and restore them.

## Current Pricing (Monday Club, 12pm–5pm)
- Select lagers & beers: £2.50
- Guinness: £3.6
- Ciders & premium lager: £2.95
