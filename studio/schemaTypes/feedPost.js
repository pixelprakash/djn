import {defineArrayMember, defineField, defineType} from 'sanity'

// A short update in the style of a LinkedIn post: a few lines of text, a
// handful of photos, the original link. Shown as a card in the "From
// LinkedIn" feed on the Blog page. (Long write-ups with galleries are "Blog
// post"s instead.)
export default defineType({
  name: 'feedPost',
  title: 'LinkedIn-style post',
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
      description: 'Optional. Adds a "View on LinkedIn" link under the post.',
      validation: (r) => r.uri({scheme: ['https']}),
    }),
    defineField({
      name: 'reactions',
      title: 'Reactions (optional)',
      type: 'number',
      description: 'The number shown on LinkedIn at the time. Leave empty to hide.',
      validation: (r) => r.min(0).integer(),
    }),
    defineField({
      name: 'comments',
      title: 'Comments (optional)',
      type: 'number',
      description: 'The number shown on LinkedIn at the time. Leave empty to hide.',
      validation: (r) => r.min(0).integer(),
    }),
  ],
  orderings: [
    {title: 'Newest first', name: 'newest', by: [{field: 'publishedAt', direction: 'desc'}]},
  ],
  preview: {
    select: {text: 'text', date: 'publishedAt', media: 'images.0'},
    prepare: ({text, date, media}) => ({
      title: (text || '').split('\n')[0].slice(0, 80),
      subtitle: date ? new Date(date).toLocaleDateString('en-GB', {day: 'numeric', month: 'short', year: 'numeric'}) : '',
      media,
    }),
  },
})
