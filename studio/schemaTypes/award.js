import {defineField, defineType} from 'sanity'

// A line under "Awards & Scholarships" on the Resume page.
export default defineType({
  name: 'award',
  title: 'Award or scholarship',
  type: 'document',
  description: 'Listed under "Awards & Scholarships" on the Resume page, newest first.',
  fields: [
    defineField({
      name: 'text',
      title: 'Award',
      type: 'string',
      description: 'The award and who gave it, e.g. "Lifetime Achievement Award for Design Research — Design Research Council of India".',
      validation: (r) => r.required().max(260),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      description: 'Four digits, like 2025.',
      validation: (r) => r.required().regex(/^\d{4}$/, {name: 'year'}).error('Use a four-digit year, like 2025'),
    }),
  ],
  orderings: [{title: 'Newest first', name: 'newest', by: [{field: 'year', direction: 'desc'}]}],
  preview: {
    select: {title: 'text', year: 'year'},
    prepare: ({title, year}) => ({title, subtitle: year}),
  },
})
