import {defineArrayMember, defineField, defineType} from 'sanity'

// One of the CV detail pages: /cv/<web address> (Books, Papers & Publications,
// Thesis Guidance, Solo Shows…). Each is a title and a few headed lists.
export default defineType({
  name: 'cvPage',
  title: 'CV detail page',
  type: 'document',
  description:
    'A full list on its own page (Books, Teaching Experience, Training Programs…). Open one to add a line: find the right heading, click "Add item", type the line.',
  fields: [
    defineField({
      name: 'title',
      title: 'Page title',
      type: 'string',
      validation: (r) => r.required().max(80),
    }),
    defineField({
      name: 'slug',
      title: 'Web address ending',
      type: 'slug',
      description: 'Becomes /cv/<this>. Please do not change it for an existing page.',
      options: {source: 'title', maxLength: 60},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'parent',
      title: 'Belongs to',
      type: 'string',
      description: 'Which page the "Back" link returns to.',
      options: {
        list: [
          {title: 'Resume', value: 'resume'},
          {title: 'Work', value: 'work'},
        ],
        layout: 'radio',
      },
      initialValue: 'resume',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'sections',
      title: 'Lists',
      type: 'array',
      description: 'Each list has a heading and its lines. Drag to reorder.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'cvSection',
          title: 'List',
          fields: [
            defineField({
              name: 'heading',
              title: 'Heading',
              type: 'string',
              description: 'e.g. "Grants & Fellowships" or "2023".',
              validation: (r) => r.required().max(80),
            }),
            defineField({
              name: 'items',
              title: 'Lines',
              type: 'array',
              description: 'Start each line with the year and a dash, like "2012 — Grant from…". Newest first reads best.',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'cvItem',
                  title: 'Line',
                  fields: [
                    defineField({
                      name: 'text',
                      title: 'Line',
                      type: 'text',
                      rows: 2,
                      validation: (r) => r.required().max(500),
                    }),
                    defineField({
                      name: 'link',
                      title: 'Link (optional)',
                      type: 'url',
                      description: 'Makes the line a link, e.g. to the paper.',
                      validation: (r) => r.uri({scheme: ['https', 'http']}),
                    }),
                  ],
                  preview: {select: {title: 'text', subtitle: 'link'}},
                }),
              ],
              validation: (r) => r.required().min(1),
            }),
          ],
          preview: {
            select: {title: 'heading', items: 'items'},
            prepare: ({title, items}) => ({title, subtitle: `${(items || []).length} lines`}),
          },
        }),
      ],
      validation: (r) => r.required().min(1),
    }),
  ],
  orderings: [{title: 'Title', name: 'title', by: [{field: 'title', direction: 'asc'}]}],
  preview: {
    select: {title: 'title', parent: 'parent'},
    prepare: ({title, parent}) => ({title, subtitle: parent === 'work' ? 'Work' : 'Resume'}),
  },
})
