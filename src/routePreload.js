// Single source of truth for lazy route imports. App.jsx uses these with
// React.lazy(); nav components call preloadForPath() on link hover/focus so
// a route's chunk is usually already cached by the time the user clicks —
// dynamic import() is deduped by the browser's module cache, so calling the
// same import twice does not trigger a second network request.
export const routeImports = {
  about:         () => import('./pages/About'),
  work:          () => import('./pages/Work'),
  projectDetail: () => import('./pages/ProjectDetail'),
  resume:        () => import('./pages/Resume'),
  lab:           () => import('./pages/Lab'),
  blog:          () => import('./pages/Blog'),
  contact:       () => import('./pages/Contact'),
  cv:            () => import('./pages/CvPage'),
}

export function preloadForPath(path) {
  if (!path) return
  if (path.startsWith('/cv/'))   return routeImports.cv()
  if (path.startsWith('/work/')) return routeImports.projectDetail()
  switch (path) {
    case '/about':   return routeImports.about()
    case '/work':    return routeImports.work()
    case '/resume':  return routeImports.resume()
    case '/lab':     return routeImports.lab()
    case '/blog':    return routeImports.blog()
    case '/contact': return routeImports.contact()
    default: return
  }
}

// Warms every remaining route chunk once the browser is idle after first
// load. Combined chunks are ~25KB gzipped total, so this is cheap — and it
// means clicking any nav link is instant even without a prior hover/focus
// (e.g. touch devices, or a fast click before the hover-prefetch timer fires).
export function preloadAllRoutes() {
  Object.values(routeImports).forEach(fn => fn())
}
