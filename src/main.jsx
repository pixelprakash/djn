import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/tokens.css'
import './index.css'
import App from './App.jsx'

/* Gate the scroll-reveal "from" state (opacity:0) on JS actually running,
   so a hard JS failure leaves content plainly visible rather than blank. */
document.documentElement.classList.add('js-ready')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
