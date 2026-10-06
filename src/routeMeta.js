// Which /cv/:slug pages are Work's detail (shows, exhibitions, funded
// projects) rather than part of the Resume. Shared by the nav (which
// top-level item to light up on those pages) and the page transition
// (what the curtain calls them), so the two can't disagree.
export const WORK_CV = new Set(['sponsored-projects', 'solo-shows', 'selected-exhibitions'])
