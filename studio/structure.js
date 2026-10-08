// The studio's left-hand menu. Instead of one long alphabetical list of types,
// it is grouped the way the website is, so a team member looks for the page
// they want to change: "News", "Work", "Resume". The Resume header is a
// single page (there is only ever one), so it opens straight to the editor.
const SINGLETONS = ['aboutPage', 'siteSettings', 'resumePage']

const list = (S, title, type, id) =>
  S.listItem()
    .id(id || type)
    .title(title)
    .child(S.documentTypeList(type).title(title))

export const structure = (S) =>
  S.list()
    .title('Website content')
    .items([
      S.listItem()
        .title('About page (home)')
        .id('aboutPage')
        .child(S.document().schemaType('aboutPage').documentId('aboutPage').title('About page (home)')),
      S.listItem()
        .title('Site settings (contact, social links, CV)')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings').title('Site settings')),
      S.divider(),
      S.listItem()
        .title('News, updates & blogs')
        .child(
          S.list()
            .title('News, updates & blogs')
            .items([
              list(S, 'News, updates & announcements (home page and News)', 'feedPost'),
              list(S, 'Blog posts', 'blogPost'),
            ]),
        ),
      S.divider(),
      S.listItem()
        .title('Work page')
        .child(
          S.list()
            .title('Work page')
            .items([
              list(S, 'Photography projects', 'project'),
              list(S, 'Sponsored projects', 'sponsoredProject'),
              list(S, 'Exhibitions (solo and group)', 'exhibition'),
            ]),
        ),
      S.listItem()
        .title('Resume page')
        .child(
          S.list()
            .title('Resume page')
            .items([
              S.listItem()
                .title('Header, research areas & links')
                .id('resumePage')
                .child(S.document().schemaType('resumePage').documentId('resumePage').title('Resume page: header and links')),
              S.divider(),
              list(S, 'Academic positions', 'position'),
              list(S, 'Education', 'education'),
              list(S, 'Awards & scholarships', 'award'),
              list(S, 'Selected publications', 'publication'),
              S.divider(),
              list(S, 'CV detail pages (Books, Teaching, Training…)', 'cvPage'),
            ]),
        ),
    ])

export const singletonTypes = SINGLETONS

// Keep the one-off page from being created twice or deleted by accident.
export const newDocumentOptions = (prev, {creationContext}) =>
  creationContext.type === 'global' ? prev.filter((t) => !SINGLETONS.includes(t.templateId)) : prev

export const documentActions = (prev, {schemaType}) =>
  SINGLETONS.includes(schemaType)
    ? prev.filter(({action}) => !['unpublish', 'delete', 'duplicate'].includes(action))
    : prev
