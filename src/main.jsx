import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Self-hosted variable fonts (replaces the render-blocking Google Fonts request).
// Each file is split by script and only the ones the page's text needs download.
import '@fontsource-variable/dm-sans'
import '@fontsource-variable/dm-sans/wght-italic.css'
import '@fontsource-variable/literata'
import '@fontsource-variable/literata/wght-italic.css'
import './styles/tokens.css'
import './index.css'
import './styles/a11y.css'
import App from './App.jsx'
import { prefetchFor } from './lib/cms'

/* Gate the scroll-reveal "from" state (opacity:0) on JS actually running,
   so a hard JS failure leaves content plainly visible rather than blank. */
document.documentElement.classList.add('js-ready')

prefetchFor(window.location.pathname)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
