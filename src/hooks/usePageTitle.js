import { useEffect } from 'react'
import applyMeta from '../seo/applyMeta'

/* Sets the page's title (WCAG 2.4.2 Page Titled) and, with it, everything a
   search engine or link preview reads: description, canonical address, social
   tags and structured data. Pass a meta object from src/seo/routes.js. It is a
   single-page app, so without this every page would keep the home page's
   head -- which is also what a screen reader announces. */
export default function usePageTitle(meta) {
  const key = meta ? `${meta.path}|${meta.title}|${meta.description}|${meta.image || ''}` : ''
  useEffect(() => {
    if (meta) applyMeta(meta)
    // `key` stands in for the object's contents.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
}
