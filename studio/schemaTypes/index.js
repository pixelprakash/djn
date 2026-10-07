import blogPost from './blogPost'
import feedPost from './feedPost'

// newsItem (the old one-line headline cards) is retired: News & Updates on the
// home page is now feedPost. Existing newsItem documents stay in the dataset
// but are no longer shown or editable.
export const schemaTypes = [feedPost, blogPost]
