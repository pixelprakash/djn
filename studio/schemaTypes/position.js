import {defineField, defineType} from 'sanity'

// A line under "Academic Positions" on the Resume page.
export default defineType({
  name: 'position',
  title: 'Academic position',
  type: 'document',
  description: 'A post he holds or has held. Listed under "Academic Positions" on the Resume page.',
  fields: [
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      description: 'e.g. "Professor, Department of Design".',
      validation: (r) => r.required().max(160),
    }),
    defineField({
      name: 'org',
      title: 'Institution',
      type: 'string',
      description: 'e.g. "IIT Hyderabad".',
      validation: (r) => r.required().max(160),
    }),
    defineField({
      name: 'period',
      title: 'Dates',
      type: 'string',
      description: 'Write it as shown: "2023 - present" or "2007 - 2013".',
      validation: (r) => r.required().max(40),
    }),
    defineField({
      name: 'order',
      title: 'Position in the list',
      type: 'number',
      description: '1 shows first. Give a new entry a number that puts it where you want; later ones can be left as they are.',
      validation: (r) => r.min(1).integer(),
    }),
  ],
  orderings: [{title: 'List order', name: 'listOrder', by: [{field: 'order', direction: 'asc'}]}],
  preview: {
    select: {title: 'role', org: 'org', period: 'period'},
    prepare: ({title, org, period}) => ({title, subtitle: [period, org].filter(Boolean).join(' · ')}),
  },
})
