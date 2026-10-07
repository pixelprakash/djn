import {defineArrayMember, defineField, defineType} from 'sanity'

// News, an update or an announcement, written like a LinkedIn post: a few
// lines of text, a handful of photos, the original link. Shown as cards in
// "News & Updates" on the home page (pinned first, then newest). Blog
// articles are a different type ("Blog post") and appear on the Blogs page
// only.
export default defineType({
  name: 'feedPost',
  title: 'News, update or announcement',
  description:
    'For the posts that matter on the site: admissions, openings, awards, talks, publications. Everything else stays on LinkedIn (the site links there). Needs only a title, the text and photos.',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'A short headline, e.g. "PhD admissions open, July 2026". Shown above the text.',
      validation: (r) => r.required().max(120),
    }),
    defineField({
      name: 'slug',
      title: 'Web address',
      type: 'slug',
      description: 'Click Generate. This becomes the update\'s own page: /news/this-part.',
      options: {source: 'title', maxLength: 80},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'text',
      rows: 8,
      description:
        'The details. Line breaks are kept; web addresses become links and #hashtags are highlighted.',
      validation: (r) => r.required().max(3000),
    }),
    defineField({
      name: 'topic',
      title: 'Topic (optional)',
      type: 'string',
      description: 'Shown as a small label on the card, e.g. Award or Admissions.',
      options: {
        list: ['Award', 'Workshop & talk', 'Publication', 'Admissions', 'Careers & openings', 'Event', 'Announcement', 'Student work', 'Photography'],
      },
    }),
    defineField({
      name: 'images',
      title: 'Photos',
      type: 'array',
      description: 'Optional. Up to 10, in the order they appear in the post. Drag to reorder.',
      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Description (for screen readers)',
              type: 'string',
              description:
                'Say what the photo shows. For a poster, write what it says (title, dates, who it is for) -- people who cannot see the image rely on it.',
            }),
          ],
        }),
      ],
      validation: (r) => r.max(10),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Date posted',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'closesOn',
      title: 'Closes on (optional)',
      type: 'date',
      description:
        'For a deadline: last date to apply or register. The card shows "Closes in N days", and once the date has passed it leaves the home page (it stays on the News page, marked Closed).',
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Button text (optional)',
      type: 'string',
      description: 'e.g. "Apply now", "Register". Used with the button link below.',
      validation: (r) => r.max(24),
    }),
    defineField({
      name: 'ctaUrl',
      title: 'Button link (optional)',
      type: 'url',
      description: 'Adds a clear button to the card, e.g. the application form.',
      validation: (r) => r.uri({scheme: ['https']}),
    }),
    defineField({
      name: 'linkedinUrl',
      title: 'Link (optional)',
      type: 'url',
      description: 'The LinkedIn post, a news article or a page. Adds a "Read more" link under the card.',
      validation: (r) => r.uri({scheme: ['https']}),
    }),
    defineField({
      name: 'pinned',
      title: 'Pin to the top',
      type: 'boolean',
      description: 'Keeps this post first in the feed, above newer ones. Use for one or two at most (e.g. open admissions).',
      initialValue: false,
    }),
  ],
  orderings: [
    {title: 'Newest first', name: 'newest', by: [{field: 'publishedAt', direction: 'desc'}]},
  ],
  preview: {
    select: {title: 'title', text: 'text', date: 'publishedAt', media: 'images.0', pinned: 'pinned', closes: 'closesOn'},
    prepare: ({title, text, date, media, pinned, closes}) => ({
      title: `${pinned ? '📌 ' : ''}${title || (text || '').split('\n')[0].slice(0, 80)}`,
      subtitle:
        (date ? new Date(date).toLocaleDateString('en-GB', {day: 'numeric', month: 'short', year: 'numeric'}) : '') +
        (closes ? `  ·  closes ${closes}` : ''),
      media,
    }),
  },
})
