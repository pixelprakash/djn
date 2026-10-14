import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { preloadForPath } from '../routePreload'
import './WorkIndex.css'

/* "Selected work" as a typographic index: number, title, year -- and a soft
   gradient that fills the space between each title and its year. Titles differ
   in length, so the fill steps in and out like a skyline; it is one shape,
   drawn behind the rows and clipped to the measured end of each title, so it
   stays exact at any width or font size.

   On a phone the steps are dropped: the whole list sits on one gradient panel. */
const GAP = 22 // space kept clear between a title and the gradient, px

export default function WorkIndex({ projects }) {
  const listRef = useRef(null)
  const shapeRef = useRef(null)

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

      <div className="wi-list" ref={listRef}>
        <span className="wi-shape" ref={shapeRef} aria-hidden="true" />
        <ol className="wi-rows">
          {projects.map((p, i) => (
            <li className="wi-item" key={p.id}>
              <Link
                className="wi-row"
                to={`/work/${p.slug}`}
                onMouseEnter={() => preloadForPath(`/work/${p.slug}`)}
                onFocus={() => preloadForPath(`/work/${p.slug}`)}
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
      </div>
    </section>
  )
}
