import { useState } from 'react'
import './MasonryGallery.css'

/* A photo wall that never leaves holes: photos flow down balanced columns at
   their own proportions, so portraits and landscapes sit together without
   gaps. The shape is read from the file name (WordPress names resized copies
   "...-1024x681.jpg"), so every tile reserves its space before the picture
   arrives and the page doesn't jump as photos load. Long sets show the first
   `limit` and keep the rest one click away. */
const ratioOf = src => {
  const m = /-(\d{2,5})x(\d{2,5})\.(?:jpe?g|png|webp)/i.exec(src)
  return m ? `${m[1]} / ${m[2]}` : '3 / 2'
}

export default function MasonryGallery({ images, label, onOpen, limit = 12 }) {
  const [all, setAll] = useState(false)
  const shown = all ? images : images.slice(0, limit)
  const hidden = images.length - shown.length

  return (
    <div className="mg">
      <ul className="mg-grid">
        {shown.map((src, i) => (
          <li className="mg-cell" key={src}>
            <button
              type="button"
              className="mg-item"
              style={{ aspectRatio: ratioOf(src) }}
              onClick={() => onOpen(i)}
              aria-label={`Open photo ${i + 1} of ${images.length}${label ? ` from ${label}` : ''}`}
            >
              <img src={src} alt="" loading="lazy" decoding="async" />
            </button>
          </li>
        ))}
      </ul>
      {hidden > 0 && (
        <div className="mg-more">
          <button type="button" className="mg-more-btn" aria-expanded={all} onClick={() => setAll(true)}>
            Show all {images.length} photographs <span className="mg-more-n">+{hidden} more</span>
          </button>
        </div>
      )}
    </div>
  )
}
