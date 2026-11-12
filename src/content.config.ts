import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * One-off and recurring events. Add a new .md file in src/content/events/
 * (you can do this straight from the GitHub website: "Add file" → "Create new file").
 *
 * - One-off events: set `date`. They disappear from the site automatically once the date has passed.
 * - Recurring events: leave `date` out and set `recurring` (e.g. "Every Tuesday").
 */
const events = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/events' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date().optional(),
      endDate: z.coerce.date().optional(),
      recurring: z.string().optional(),
      time: z.string().optional(),
      price: z.string().optional(),
      summary: z.string(),
      image: image().optional(),
      imageAlt: z.string().optional(),
      /** Built-in artwork used when there's no image: live | bingo | karate */
      poster: z.enum(['live', 'bingo', 'karate']).optional(),
      /** Big word(s) on the poster artwork, e.g. "Live Music" */
      posterText: z.string().optional(),
      /** Lower numbers show first among recurring events */
      order: z.number().default(50),
      featured: z.boolean().default(false),
      /**
       * Optional, for recurring events: tells Google & AI assistants exactly when it runs.
       * days: 0 = Sunday … 6 = Saturday. start/end: 24h "HH:MM" ("24:00" = midnight).
       * monthWeek: e.g. -1 = last week of the month, 2 = second week (leave out for weekly).
       */
      schedule: z
        .object({
          days: z.array(z.number().min(0).max(6)),
          start: z.string(),
          end: z.string().optional(),
          monthWeek: z.number().optional(),
        })
        .optional(),
      hidden: z.boolean().default(false),
    }),
});

export const collections = { events };
