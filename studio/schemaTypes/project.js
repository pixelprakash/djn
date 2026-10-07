import {defineArrayMember, defineField, defineType} from 'sanity'

export const PROJECT_CATEGORIES = ['Solo Show', 'Group Exhibition', 'Photography']

const year = (r) =>
  r.required().regex(/^\d{4}$/, {name: 'year'}).error('Use a four-digit year, like 2024')

// A photography project: a card on the Work page and its own page at
// /work/<web address>.
export default defineType({
  name: 'project',
  title: 'Photography project',
  type: 'document',
  description:
    'One project on the Work page (a series, a solo show or a group show), with its own page of photographs.',
  groups: [
    {name: 'basics', title: 'About the project', default: true},
    {name: 'photos', title: 'Notes & photographs'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Project title',
      type: 'string',
      group: 'basics',
      validation: (r) => r.required().max(120),
    }),
    defineField({
      name: 'slug',
      title: 'Web address ending',
      type: 'slug',
      group: 'basics',
      description:
        'Click "Generate". It becomes the page address: /work/<this>. Please do not change it after publishing, or old links will stop working.',
      options: {source: 'title', maxLength: 70},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'category',
      title: 'Type',
      type: 'string',
      group: 'basics',
      options: {list: PROJECT_CATEGORIES, layout: 'radio'},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      group: 'basics',
      description: 'Four digits, like 2024.',
      validation: year,
    }),
    defineField({
      name: 'venue',
      title: 'Where it was shown',
      type: 'string',
      group: 'basics',
      description: 'e.g. "Alliance Française Gallery, Ahmedabad", or "Photography Series" for a project not shown in a gallery.',
      validation: (r) => r.required().max(160),
    }),
    defineField({
      name: 'cover',
      title: 'Cover photograph',
      type: 'image',
      group: 'basics',
      description: 'The large picture on the Work page and at the top of the project page. A wide (landscape) photo works best.',
      options: {hotspot: true},
      fields: [
        defineField({name: 'alt', title: 'Description (for screen readers)', type: 'string'}),
      ],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'order',
      title: 'Position on the Work page',
      type: 'number',
      group: 'basics',
      description:
        'Optional. 1 shows first (as the large lead project). Leave empty to put it after the numbered ones, newest year first.',
      validation: (r) => r.min(1).integer(),
    }),
    defineField({
      name: 'sections',
      title: 'Notes & photographs',
      type: 'array',
      group: 'photos',
      description:
        'The page is a series of parts. Each part has an optional short note and its photographs. Add a part with the button below; drag parts to reorder them.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'part',
          title: 'Part',
          fields: [
            defineField({
              name: 'text',
              title: 'Note (optional)',
              type: 'text',
              rows: 6,
              description:
                'A few lines about this part. Leave a blank line between paragraphs. The first part\'s first paragraph is shown larger, as the introduction.',
            }),
            defineField({
              name: 'photos',
              title: 'Photographs',
              type: 'array',
              description:
                'Drag photos here (or click "Add item"). They appear in this order; drag to reorder. All of them are shown on the page.',
              of: [
                defineArrayMember({
                  type: 'image',
                  options: {hotspot: true},
                  fields: [
                    defineField({
                      name: 'alt',
                      title: 'Description (for screen readers)',
                      type: 'string',
                      description: 'Optional but kind: say in a few words what the photograph shows.',
                    }),
                  ],
                }),
              ],
              validation: (r) => r.required().min(1),
            }),
          ],
          preview: {
            select: {text: 'text', photos: 'photos', media: 'photos.0'},
            prepare: ({text, photos, media}) => ({
              title: (text || 'Photographs').split('\n')[0].slice(0, 70),
              subtitle: `${(photos || []).length} photograph${(photos || []).length === 1 ? '' : 's'}`,
              media,
            }),
          },
        }),
      ],
      validation: (r) => r.required().min(1),
    }),
  ],
  orderings: [
    {title: 'Position on the Work page', name: 'position', by: [{field: 'order', direction: 'asc'}, {field: 'year', direction: 'desc'}]},
    {title: 'Newest first', name: 'newest', by: [{field: 'year', direction: 'desc'}]},
  ],
  preview: {
    select: {title: 'title', category: 'category', year: 'year', media: 'cover'},
    prepare: ({title, category, year, media}) => ({title, subtitle: [category, year].filter(Boolean).join(' · '), media}),
  },
})
