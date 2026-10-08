import {defineField, defineType} from 'sanity'

// One line of the Work page's "Exhibitions" tab -- a solo show or a group show.
export default defineType({
  name: 'exhibition',
  title: 'Exhibition',
  type: 'document',
  description: 'A solo show or a group exhibition, listed on the Work page under "Exhibitions".',
  fields: [
    defineField({
      name: 'kind',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          {title: 'Solo show', value: 'solo'},
          {title: 'Group exhibition', value: 'group'},
        ],
        layout: 'radio',
      },
      initialValue: 'group',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'The name of the show. Use "Solo Exhibition" or "Group Show" if it had no title.',
      validation: (r) => r.required().max(160),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      description: 'Four digits, like 2013. Newest years are listed first.',
      validation: (r) => r.required().regex(/^\d{4}$/, {name: 'year'}).error('Use a four-digit year, like 2013'),
    }),
    defineField({
      name: 'venue',
      title: 'Venue (and curator)',
      type: 'string',
      description: 'e.g. "Lalit Kala Akademi, New Delhi, curated by Johny ML".',
      validation: (r) => r.required().max(200),
    }),
    // Keeps the order of entries from the same year as first set up; new entries
    // simply sort after them. Editors never see or need this.
    defineField({name: 'order', type: 'number', hidden: true}),
  ],
  orderings: [{title: 'Newest first', name: 'newest', by: [{field: 'year', direction: 'desc'}]}],
  preview: {
    select: {title: 'title', year: 'year', venue: 'venue', kind: 'kind'},
    prepare: ({title, year, venue, kind}) => ({
      title,
      subtitle: [year, kind === 'solo' ? 'Solo show' : 'Group', venue].filter(Boolean).join(' · '),
    }),
  },
})
