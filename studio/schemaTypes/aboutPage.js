import {defineArrayMember, defineField, defineType} from 'sanity'

// The top of the home page ("About Me"): name, the line under it, a short
// introduction, areas of interest and the portrait. There is exactly ONE of
// these; the studio menu opens it directly.
export default defineType({
  name: 'aboutPage',
  title: 'About page (home)',
  type: 'document',
  description: 'The first thing visitors see on the home page. The news and the Works strip below it are managed separately.',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'The large heading, e.g. "Prof. Deepak John Mathew".',
      initialValue: 'Prof. Deepak John Mathew',
      validation: (r) => r.required().max(60),
    }),
    defineField({
      name: 'roleLine',
      title: 'Line under the name',
      type: 'array',
      description:
        'One sentence about his role. To make words a link (to the department, the institute…), select them and click the link icon.',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [],
          lists: [],
          marks: {
            decorators: [{title: 'Bold', value: 'strong'}],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  defineField({
                    name: 'href',
                    type: 'url',
                    validation: (r) => r.required().uri({scheme: ['https', 'http']}),
                  }),
                ],
              },
            ],
          },
        }),
      ],
      validation: (r) => r.required().max(1).error('Just one paragraph, please.'),
    }),
    defineField({
      name: 'bio',
      title: 'Short introduction',
      type: 'text',
      rows: 3,
      description: 'Two sentences at most. It sits right under his name, so make it count.',
      validation: (r) => r.required().max(300),
    }),
    defineField({
      name: 'interests',
      title: 'Areas of interest',
      type: 'array',
      description: 'Type an area and press Enter. Drag to reorder. Shown as a comma-separated line.',
      of: [defineArrayMember({type: 'string', validation: (r) => r.max(50)})],
      options: {layout: 'tags'},
      validation: (r) => r.max(12),
    }),
    defineField({
      name: 'portrait',
      title: 'Portrait (optional)',
      type: 'image',
      description:
        'Leave empty to keep the current portrait. If you replace it, use a photo with the background removed (a PNG or WebP cut-out), standing on the bottom edge.',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Description (for screen readers)', type: 'string'})],
    }),
  ],
  preview: {prepare: () => ({title: 'About page (home)'})},
})
