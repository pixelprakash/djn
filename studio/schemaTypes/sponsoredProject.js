import {defineField, defineType} from 'sanity'

export const SPONSORED_ROLES = ['Principal Investigator', 'Co-Principal Investigator']

// One row of the Work page's "Sponsored Projects" tab.
export default defineType({
  name: 'sponsoredProject',
  title: 'Sponsored project',
  type: 'document',
  description: 'A funded research project, listed on the Work page under "Sponsored Projects".',
  fields: [
    defineField({
      name: 'title',
      title: 'Project title',
      type: 'string',
      validation: (r) => r.required().max(220),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      description: 'Four digits, like 2022. Newest years are listed first.',
      validation: (r) => r.required().regex(/^\d{4}$/, {name: 'year'}).error('Use a four-digit year, like 2022'),
    }),
    defineField({
      name: 'role',
      title: 'His role',
      type: 'string',
      options: {list: SPONSORED_ROLES, layout: 'radio'},
      initialValue: 'Principal Investigator',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'funder',
      title: 'Funded by',
      type: 'string',
      description: 'e.g. "DSIR, Department of Science and Technology".',
      validation: (r) => r.required().max(200),
    }),
    defineField({
      name: 'amount',
      title: 'Amount (optional)',
      type: 'string',
      description: 'Kept for the record. It is not shown on the Work page.',
    }),
  ],
  orderings: [{title: 'Newest first', name: 'newest', by: [{field: 'year', direction: 'desc'}]}],
  preview: {
    select: {title: 'title', year: 'year', role: 'role'},
    prepare: ({title, year, role}) => ({title, subtitle: [year, role].filter(Boolean).join(' · ')}),
  },
})
