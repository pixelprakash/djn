import {defineArrayMember, defineField, defineType} from 'sanity'

// News, an update or an announcement, written like a LinkedIn post: a few
// lines of text, a handful of photos, the original link. Shown as cards in
// "News & Updates" on the home page (pinned first, then newest). Blog
// articles are a different type ("Blog post") and appear on the Blogs page
// only.
export default defineType({
  name: 'feedPost',
  title: 'News, update or announcement',
  type: 'document',
  fields: [
    defineField({
      name: 'text',
      title: 'Post text',
      type: 'text',
      rows: 8,
      description:
        'Paste the post text as it appears on LinkedIn. Line breaks are kept. #hashtags and @names are highlighted automatically.',
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
      name: 'linkedinUrl',
      title: 'Link to the post on LinkedIn',
      type: 'url',
      description: 'Optional. Adds a "View on LinkedIn" link under the card.',
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
    select: {text: 'text', date: 'publishedAt', media: 'images.0', pinned: 'pinned'},
    prepare: ({text, date, media, pinned}) => ({
      title: `${pinned ? '📌 ' : ''}${(text || '').split('\n')[0].slice(0, 80)}`,
      subtitle: date ? new Date(date).toLocaleDateString('en-GB', {day: 'numeric', month: 'short', year: 'numeric'}) : '',
      media,
    }),
  },
})
