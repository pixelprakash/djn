import {defineArrayMember, defineField, defineType} from 'sanity'

export const BLOG_TAGS = ['Exhibition', 'Workshop', 'Portrait', 'Talk', 'Research', 'Teaching', 'Travel', 'Note']

// A post on the Blog page and its own /blogs/:slug page.
export default defineType({
  name: 'blogPost',
  title: 'Blog post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (r) => r.required().max(160),
    }),
    defineField({
      name: 'slug',
      title: 'Web address ending',
      type: 'slug',
      description: 'Click "Generate". Becomes /blogs/<this>. Don\'t change it after publishing.',
      options: {source: 'title', maxLength: 90},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'tag',
      title: 'Category',
      type: 'string',
      options: {list: BLOG_TAGS},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Date',
      type: 'date',
      description: 'Shown on the site as month and year, and used to order posts (newest first).',
      initialValue: () => new Date().toISOString().slice(0, 10),
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'venue',
      title: 'Venue / subtitle',
      type: 'string',
      description: 'Optional. e.g. "Ashna Gallery, New Delhi · curated by Johny ML".',
    }),
    defineField({
      name: 'desc',
      title: 'Summary',
      type: 'text',
      rows: 3,
      description: 'Two sentences at most. Shown on the Blog listing card.',
      validation: (r) => r.required().max(320),
    }),
    defineField({
      name: 'images',
      title: 'Photographs',
      type: 'array',
      description:
        'The FIRST photo is the cover. The rest appear as a gallery below the text. Drag to reorder.',
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
      validation: (r) => r.required().min(1),
    }),
    defineField({
      name: 'body',
      title: 'Text',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [{title: 'Paragraph', value: 'normal'}],
          lists: [],
          marks: {
            decorators: [
              {title: 'Bold', value: 'strong'},
              {title: 'Italic', value: 'em'},
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  defineField({
                    name: 'href',
                    type: 'url',
                    validation: (r) =>
                      r.uri({scheme: ['http', 'https', 'mailto'], allowRelative: true}),
                  }),
                ],
              },
            ],
          },
        }),
      ],
    }),
    defineField({
      name: 'originalHref',
      title: 'Original post link (optional)',
      type: 'url',
      description: 'If this was first published elsewhere (e.g. his Blogger blog).',
    }),
    defineField({
      name: 'externalNote',
      title: 'Closing note (optional)',
      type: 'string',
      description: 'A short line shown at the end of the text, e.g. a website address.',
    }),
  ],
  orderings: [
    {title: 'Newest first', name: 'newest', by: [{field: 'publishedAt', direction: 'desc'}]},
  ],
  preview: {
    select: {title: 'title', tag: 'tag', date: 'publishedAt', media: 'images.0'},
    prepare: ({title, tag, date, media}) => ({
      title,
      subtitle: [tag, date].filter(Boolean).join(' · '),
      media,
    }),
  },
})
