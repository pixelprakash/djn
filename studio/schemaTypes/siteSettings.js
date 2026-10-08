import {defineArrayMember, defineField, defineType} from 'sanity'

export const SOCIAL_PLATFORMS = ['LinkedIn', 'Instagram', 'Facebook', 'Google Scholar', 'ResearchGate', 'YouTube', 'X (Twitter)', 'ORCID', 'GitHub']

// Things that appear in more than one place on the site (or that only the
// owner should change): contact details, social profiles, the contact form's
// address, the downloadable CV, and how the site looks in a search result or a
// shared link. One document, edited in one place.
export default defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  description: 'Contact details, social links and other site-wide information. Changes show up everywhere they are used.',
  groups: [
    {name: 'contact', title: 'Contact', default: true},
    {name: 'social', title: 'Social links'},
    {name: 'files', title: 'CV & sharing'},
  ],
  fields: [
    defineField({
      name: 'publicEmail',
      title: 'Public email address (optional)',
      type: 'string',
      group: 'contact',
      description: 'If filled in, it is shown on the Contact page so people can write directly (the form is still there). Leave empty to hide it.',
      validation: (r) =>
        r.custom((v) => (!v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? true : 'That does not look like an email address')),
    }),
    defineField({
      name: 'place',
      title: 'Where he is based',
      type: 'string',
      group: 'contact',
      initialValue: 'Indian Institute of Technology Hyderabad',
      validation: (r) => r.required().max(120),
    }),
    defineField({
      name: 'addressLines',
      title: 'Address',
      type: 'text',
      rows: 2,
      group: 'contact',
      description: 'Press Enter for a new line.',
      initialValue: 'Kandi, Sangareddy\nTelangana 502284, India',
      validation: (r) => r.required().max(200),
    }),
    defineField({
      name: 'mapUrl',
      title: '"View on map" link',
      type: 'url',
      group: 'contact',
      description: 'A Google Maps link to the address.',
      validation: (r) => r.uri({scheme: ['https']}),
    }),
    defineField({
      name: 'contactFormEndpoint',
      title: 'Contact form address',
      type: 'url',
      group: 'contact',
      description:
        'Where messages from the Contact page are sent. Create a free form at formspree.io, copy its address (it looks like https://formspree.io/f/abcd1234) and paste it here. Until this is filled in, the form cannot send.',
      validation: (r) => r.uri({scheme: ['https']}),
    }),
    defineField({
      name: 'socials',
      title: 'Social and profile links',
      type: 'array',
      group: 'social',
      description:
        'Shown as icons on the home page and in the footer, and as a list on the Contact page. Drag to reorder. LinkedIn, Instagram, Facebook and Google Scholar have icons; the others appear as text links.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'social',
          fields: [
            defineField({
              name: 'label',
              title: 'Which site',
              type: 'string',
              options: {list: SOCIAL_PLATFORMS},
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'url',
              title: 'Address of his profile',
              type: 'url',
              description: 'Open his profile in a browser and copy the address.',
              validation: (r) => r.required().uri({scheme: ['https']}),
            }),
          ],
          preview: {select: {title: 'label', subtitle: 'url'}},
        }),
      ],
      validation: (r) => r.max(8),
    }),
    defineField({
      name: 'cvFile',
      title: 'CV (PDF)',
      type: 'file',
      group: 'files',
      description: 'Upload a PDF to offer a "Download CV" button. Replace the file whenever the CV changes.',
      options: {accept: 'application/pdf'},
    }),
    defineField({
      name: 'siteDescription',
      title: 'Description for search results',
      type: 'text',
      rows: 3,
      group: 'files',
      description: 'One or two sentences about the site (up to about 155 characters). This is what Google shows under the link.',
      validation: (r) => r.max(200).warning('Search engines cut descriptions at about 155 characters.'),
    }),
    defineField({
      name: 'shareImage',
      title: 'Picture for shared links',
      type: 'image',
      group: 'files',
      description: 'Shown when the site is shared on WhatsApp, LinkedIn or Slack. Best at 1200 × 630 pixels.',
    }),
  ],
  preview: {prepare: () => ({title: 'Site settings'})},
})
