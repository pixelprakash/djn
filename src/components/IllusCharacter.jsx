import { useEffect, useRef, useState } from 'react'
import './IllusCharacter.css'

const CONFIG = {
  about:   { img: '/illustrations/illus-about.png',   bubble: 'Hi there!',   hoverClass: 'illus--wave'  },
  work:    { img: '/illustrations/illus-work.png',    bubble: 'Click!',      hoverClass: 'illus--click' },
  resume:  { img: '/illustrations/illus-resume.png',  bubble: 'My CV!',      hoverClass: 'illus--tip'   },
  lab:     { img: '/illustrations/illus-lab.png',     bubble: 'Explore XR!', hoverClass: 'illus--scan'  },
  blog:    { img: '/illustrations/illus-blog.png',    bubble: 'Writing...',  hoverClass: 'illus--write' },
  contact: { img: '/illustrations/illus-contact.png', bubble: "Let's talk!", hoverClass: 'illus--ring'  },
}

export default function IllusCharacter({ page = 'about' }) {
  const cfg = CONFIG[page] || CONFIG.about
  const [hovered, setHovered] = useState(false)
  const [visible, setVisible] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 300)
    return () => clearTimeout(t)
  }, [page])

  useEffect(() => {
    setVisible(false)
    setHovered(false)
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [page])

  const handleEnter = () => { clearTimeout(timerRef.current); setHovered(true) }
  const handleLeave = () => { timerRef.current = setTimeout(() => setHovered(false), 1200) }

  return (
    <div
      className={[
        'illus-wrap',
        visible  ? 'illus-wrap--visible' : '',
        hovered  ? 'illus-wrap--hovered' : '',
      ].filter(Boolean).join(' ')}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onTouchStart={handleEnter}
      onTouchEnd={handleLeave}
      aria-hidden="true"
    >
      {/* Illustration + bubble side by side */}
      <div className="illus-inner">
        {/* Image */}
        <div className={`illus-img-wrap${hovered ? ' ' + cfg.hoverClass : ''}`}>
          <img src={cfg.img} alt="" className="illus-img" draggable="false" />
        </div>

        {/* Speech bubble — to the RIGHT of the image, always visible */}
        <div className={`illus-bubble${visible ? ' illus-bubble--show' : ''}`}>
          {cfg.bubble}
          <span className="illus-bubble-tail" />
        </div>
      </div>
    </div>
  )
}