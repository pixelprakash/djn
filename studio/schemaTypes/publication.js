import {defineField, defineType} from 'sanity'

// A line under "Selected Publications" on the Resume page.
export default defineType({
  name: 'publication',
  title: 'Publication',
  type: 'document',
  description: 'A paper or chapter. Listed under "Selected Publications" on the Resume page, newest first.',
  fields: [
    defineField({
      name: 'title',
      title: 'Title of the paper',
      type: 'string',
      validation: (r) => r.required().max(300),
    }),
    defineField({
      name: 'venue',
      title: 'Journal or conference',
      type: 'string',
      description: 'e.g. "ICoRD 2023" or "Int. Journal of Design Education".',
      validation: (r) => r.required().max(200),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      validation: (r) => r.required().regex(/^\d{4}$/, {name: 'year'}).error('Use a four-digit year, like 2024'),
    }),
    defineField({
      name: 'link',
      title: 'Link to the paper (optional)',
      type: 'url',
      validation: (r) => r.uri({scheme: ['https', 'http']}),
    }),
  ],
  orderings: [{title: 'Newest first', name: 'newest', by: [{field: 'year', direction: 'desc'}]}],
  preview: {
    select: {title: 'title', year: 'year', venue: 'venue'},
    prepare: ({title, year, venue}) => ({title, subtitle: [year, venue].filter(Boolean).join(' · ')}),
  },
})
