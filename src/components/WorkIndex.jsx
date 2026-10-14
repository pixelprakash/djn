import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { preloadForPath } from '../routePreload'
import './WorkIndex.css'

/* "Selected work" as a typographic index: number, title, year -- and a soft
   gradient that fills the space between each title and its year. Titles differ
   in length, so the fill steps in and out like a skyline; it is one shape,
   drawn behind the rows and clipped to the measured end of each title, so it
   stays exact at any width or font size.

   On a phone the steps are dropped: the whole list sits on one gradient panel.

   Pointing at a row (or focusing it with the keyboard) shows a preview of the
   project: its cover follows the pointer up and down, and the other rows step back. Touch
   screens skip the preview; there a row simply opens the project. */
const GAP = 22 // space kept clear between a title and the gradient, px

const PREVIEW_GAP = 28 // space between the preview and the years column, px

export default function WorkIndex({ projects }) {
  const listRef = useRef(null)
  const shapeRef = useRef(null)
  const previewRef = useRef(null)
  const [active, setActive] = useState(-1)
  const aim = useRef({ x: 0, y: 0 })   // where the preview wants to be
  const pos = useRef({ x: 0, y: 0 })   // where it is (eased toward aim)
  const warmed = useRef(false)
  const rowEl = useRef(null)            // the row currently pointed at / focused

  // Fetch the covers the first time the list is pointed at, so the preview is
  // never an empty box.
  const warm = () => {
    if (warmed.current) return
    warmed.current = true
    projects.forEach(p => { const i = new Image(); i.src = p.cover })
  }

  // Aim the preview. It sits in a fixed column, just left of the years (inside
  // the gradient), and only follows the pointer up and down, so it never covers
  // the title being read. `py` is the pointer's height in list coordinates.
  const aimAt = py => {
    const list = listRef.current
    const pv = previewRef.current
    if (!list || !pv) return
    const w = pv.offsetWidth, h = pv.offsetHeight
    const L = list.getBoundingClientRect()
    const year = list.querySelector('.wi-year')
    const yearLeft = year ? year.getBoundingClientRect().left - L.left : L.width
    const x = Math.max(0, yearLeft - PREVIEW_GAP - w)
    let y = Math.max(-h * 0.25, Math.min(py - h / 2, L.height - h * 0.75))
    // A title long enough to run under the preview: drop it just below that row.
    const row = rowEl.current
    const title = row && row.querySelector('.wi-title-text')
    if (title && title.getBoundingClientRect().right - L.left + 14 > x) {
      y = row.getBoundingClientRect().bottom - L.top + 6
    }
    aim.current = { x, y }
  }
  const onMove = e => {
    const L = listRef.current.getBoundingClientRect()
    aimAt(e.clientY - L.top)
  }
  const focusRow = (e, i) => {
    warm()
    rowEl.current = e.currentTarget
    const L = listRef.current.getBoundingClientRect()
    const r = e.currentTarget.getBoundingClientRect()
    aimAt(r.top - L.top + r.height / 2)
    pos.current = { ...aim.current } // keyboard focus: no gliding from far away
    setActive(i)
  }

  // Ease the preview toward the cursor while a row is active.
  useEffect(() => {
    if (active < 0) return
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    const step = () => {
      const pv = previewRef.current
      if (pv) {
        const k = calm ? 1 : 0.18
        pos.current.x += (aim.current.x - pos.current.x) * k
        pos.current.y += (aim.current.y - pos.current.y) * k
        pv.style.transform = `translate3d(${pos.current.x.toFixed(1)}px, ${pos.current.y.toFixed(1)}px, 0)`
      }
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [active])

  useLayoutEffect(() => {
    const list = listRef.current
    const shape = shapeRef.current
    if (!list || !shape) return

    const place = () => {
      const rows = [...list.querySelectorAll('.wi-row')]
      const narrow = window.matchMedia('(max-width: 700px)').matches
      if (!rows.length || narrow) {
        shape.style.clipPath = ''
        shape.classList.toggle('wi-shape--on', rows.length > 0)
        return
      }
      const box = list.getBoundingClientRect()
      const years = rows.map(r => r.querySelector('.wi-year').getBoundingClientRect())
      const right = Math.min(...years.map(y => y.left)) - box.left - GAP
      const steps = rows.map(r => {
        const row = r.getBoundingClientRect()
        const t = r.querySelector('.wi-title-text').getBoundingClientRect()
        return {
          top: row.top - box.top,
          bottom: row.bottom - box.top,
          // never start past the right edge (a very long title leaves no fill)
          x: Math.min(t.right - box.left + GAP, right - 24),
        }
      })
      const n = steps.length
      // down the right edge, then back up the left edge in steps
      const pts = [[steps[0].x, steps[0].top], [right, steps[0].top], [right, steps[n - 1].bottom], [steps[n - 1].x, steps[n - 1].bottom]]
      for (let i = n - 1; i >= 1; i--) {
        pts.push([steps[i].x, steps[i].top])
        pts.push([steps[i - 1].x, steps[i].top])
      }
      shape.style.clipPath = `polygon(${pts.map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(', ')})`
      shape.classList.add('wi-shape--on')
    }

    place()
    const ro = new ResizeObserver(place)
    ro.observe(list)
    // The grotesque may arrive after first layout; re-measure once it has.
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(place)
    return () => ro.disconnect()
  }, [projects])

  return (
    <section className="wi" aria-labelledby="wi-heading">
      <div className="wi-head">
        <h2 className="wi-heading" id="wi-heading">Selected work</h2>
        <Link className="wi-all" to="/work" onMouseEnter={() => preloadForPath('/work')} onFocus={() => preloadForPath('/work')}>
          All work <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>

      <div className="wi-cols" aria-hidden="true"><span>No.</span><span>Project</span><span>Year</span></div>

      <div
        className={`wi-list${active >= 0 ? ' wi-list--hover' : ''}`}
        ref={listRef}
        onMouseEnter={warm}
        onMouseMove={onMove}
        onMouseLeave={() => setActive(-1)}
      >
        <span className="wi-shape" ref={shapeRef} aria-hidden="true" />
        <ol className="wi-rows">
          {projects.map((p, i) => (
            <li className="wi-item" key={p.id}>
              <Link
                className="wi-row"
                to={`/work/${p.slug}`}
                onMouseEnter={e => {
                  preloadForPath(`/work/${p.slug}`)
                  rowEl.current = e.currentTarget
                  if (active < 0) { // first row entered: start the preview at the cursor
                    const L = listRef.current.getBoundingClientRect()
                    aimAt(e.clientY - L.top)
                    pos.current = { ...aim.current }
                  }
                  setActive(i)
                }}
                onFocus={e => { preloadForPath(`/work/${p.slug}`); focusRow(e, i) }}
                onBlur={() => setActive(-1)}
              >
                <span className="wi-no" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <span className="wi-title">
                  <span className="wi-title-text">{p.title}</span>
                </span>
                <span className="wi-meta">{p.category}</span>
                <span className="wi-year">{p.year}</span>
              </Link>
            </li>
          ))}
        </ol>

        {/* The preview: decorative (the row is the link), so hidden from assistive tech. */}
        <div className={`wi-preview${active >= 0 ? ' wi-preview--on' : ''}`} ref={previewRef} aria-hidden="true">
          {projects.map((p, i) => (
            <img key={p.id} className={i === active ? 'is-active' : undefined} src={p.cover} alt="" decoding="async" />
          ))}
        </div>
      </div>
    </section>
  )
}
