import {defineField, defineType} from 'sanity'

// A line under "Education" on the Resume page.
export default defineType({
  name: 'education',
  title: 'Education',
  type: 'document',
  description: 'A degree or training. Listed under "Education" on the Resume page.',
  fields: [
    defineField({
      name: 'degree',
      title: 'Degree or course',
      type: 'string',
      description: 'e.g. "M.A. Fine Arts (Graphic Arts)".',
      validation: (r) => r.required().max(160),
    }),
    defineField({
      name: 'institution',
      title: 'Institution (or what it was about)',
      type: 'string',
      validation: (r) => r.required().max(240),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      validation: (r) => r.required().regex(/^\d{4}$/, {name: 'year'}).error('Use a four-digit year, like 1996'),
    }),
    defineField({
      name: 'order',
      title: 'Position in the list',
      type: 'number',
      description: '1 shows first.',
      validation: (r) => r.min(1).integer(),
    }),
  ],
  orderings: [{title: 'List order', name: 'listOrder', by: [{field: 'order', direction: 'asc'}]}],
  preview: {
    select: {title: 'degree', year: 'year', inst: 'institution'},
    prepare: ({title, year, inst}) => ({title, subtitle: [year, inst].filter(Boolean).join(' · ')}),
  },
})
