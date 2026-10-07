import {defineArrayMember, defineField, defineType} from 'sanity'

// The one-off parts of the Resume page: research areas, the line under his
// name, and the link lists. (The long lists -- positions, education, awards,
// publications -- are their own document types, so adding one is "Create".)
// There is exactly ONE of these; the studio menu opens it directly.
export default defineType({
  name: 'resumePage',
  title: 'Resume page: header and links',
  type: 'document',
  description: 'The top of the Resume page, its research-area tags, and the profile links at the bottom.',
  fields: [
    defineField({
      name: 'nodalLine',
      title: 'Line under his name',
      type: 'text',
      rows: 2,
      description: 'Two short lines work best. Press Enter for the second line.',
      initialValue:
        'Principal Investigator & Nodal Coordinator, Design Innovation Centre\nMinistry of Education, Govt. of India',
      validation: (r) => r.required().max(240),
    }),
    defineField({
      name: 'researchAreas',
      title: 'Research areas',
      type: 'array',
      description: 'Shown as small tags near the top. Drag to reorder.',
      of: [defineArrayMember({type: 'string', validation: (r) => r.max(60)})],
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'headerLinks',
      title: 'Links beside his name',
      type: 'array',
      description: 'A few quick links shown under his name (website, Scholar, LinkedIn…).',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'headerLink',
          fields: [
            defineField({name: 'text', title: 'Text shown', type: 'string', validation: (r) => r.required().max(30)}),
            defineField({
              name: 'url',
              title: 'Address',
              type: 'url',
              validation: (r) => r.required().uri({scheme: ['https', 'http']}),
            }),
          ],
          preview: {select: {title: 'text', subtitle: 'url'}},
        }),
      ],
      validation: (r) => r.max(6),
    }),
    defineField({
      name: 'profileGroups',
      title: 'Profiles & gallery (bottom of the page)',
      type: 'array',
      description: 'Groups of links, e.g. "Academic" (ResearchGate…), "Gallery", "Social".',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'profileGroup',
          fields: [
            defineField({name: 'label', title: 'Group name', type: 'string', validation: (r) => r.required().max(24)}),
            defineField({
              name: 'links',
              title: 'Links',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'profileLink',
                  fields: [
                    defineField({name: 'text', title: 'Text shown', type: 'string', validation: (r) => r.required().max(40)}),
                    defineField({
                      name: 'url',
                      title: 'Address',
                      type: 'url',
                      validation: (r) => r.required().uri({scheme: ['https', 'http']}),
                    }),
                  ],
                  preview: {select: {title: 'text', subtitle: 'url'}},
                }),
              ],
              validation: (r) => r.required().min(1),
            }),
          ],
          preview: {
            select: {title: 'label', links: 'links'},
            prepare: ({title, links}) => ({title, subtitle: (links || []).map((l) => l.text).join(', ')}),
          },
        }),
      ],
    }),
  ],
  preview: {prepare: () => ({title: 'Resume page: header and links'})},
})
