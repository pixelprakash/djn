import blogPost from './blogPost'
import feedPost from './feedPost'
import project from './project'
import sponsoredProject from './sponsoredProject'
import exhibition from './exhibition'
import resumePage from './resumePage'
import position from './position'
import education from './education'
import award from './award'
import publication from './publication'
import cvPage from './cvPage'
import aboutPage from './aboutPage'
import siteSettings from './siteSettings'

// newsItem (the old one-line headline cards) is retired: News & Updates on the
// home page is now feedPost. Existing newsItem documents stay in the dataset
// but are no longer shown or editable.
export const schemaTypes = [
  // Whole-site pages
  aboutPage,
  siteSettings,
  // News & blogs
  feedPost,
  blogPost,
  // Work page
  project,
  sponsoredProject,
  exhibition,
  // Resume page
  resumePage,
  position,
  education,
  award,
  publication,
  cvPage,
]
