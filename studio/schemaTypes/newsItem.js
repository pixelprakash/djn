import {defineField, defineType} from 'sanity'

export const NEWS_TAGS = [
  'Admissions',
  'Opening',
  'Publication',
  'Patent',
  'Talk',
  'Announcement',
  'Recognition',
  'Press',
  'Event',
]

// Shown on the home page's "News & Updates" band, newest first.
export default defineType({
  name: 'newsItem',
  title: 'News item',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Headline',
      type: 'string',
      description: 'One line.',
      validation: (r) => r.required().max(140),
    }),
    defineField({
      name: 'tag',
      title: 'Category',
      type: 'string',
      options: {list: NEWS_TAGS},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'dateLabel',
      title: 'Date shown on the site',
      type: 'string',
      description: 'A short label, e.g. "Mar 2026", "2025" or "Open now".',
      validation: (r) => r.required().max(24),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Sort date',
      type: 'datetime',
      description:
        'Only used for ordering (newest first). The date visitors see is the label above.',
      initialValue: () => new Date().toISOString(),
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'desc',
      title: 'Supporting sentence',
      type: 'text',
      rows: 2,
      description: 'Optional. One short sentence.',
      validation: (r) => r.max(220),
    }),
    defineField({
      name: 'href',
      title: 'Link (optional)',
      type: 'string',
      description:
        'A page on this site (e.g. /cv/papers-publications) or a full web address (https://…). Leave empty for a plain announcement.',
      validation: (r) =>
        r.custom(
          (v) =>
            !v ||
            /^(\/|https?:\/\/)/.test(v) ||
            'Start with / for a page on this site, or https:// for an external link.',
        ),
    }),
  ],
  orderings: [
    {title: 'Newest first', name: 'newest', by: [{field: 'publishedAt', direction: 'desc'}]},
  ],
  preview: {
    select: {title: 'title', tag: 'tag', date: 'dateLabel'},
    prepare: ({title, tag, date}) => ({title, subtitle: [tag, date].filter(Boolean).join(' · ')}),
  },
})
