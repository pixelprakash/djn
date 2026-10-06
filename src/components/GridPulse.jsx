import { useEffect, useRef } from 'react'
import './GridPulse.css'

/* Ported from the 21st.dev "grid-pulse" component (TSX + Tailwind) to plain
   JSX + CSS to match this project, which has neither TypeScript nor
   Tailwind. Behaviour is the original's; two deliberate changes for this
   site:
   - the spectrum is a prism's: red through violet, laid out left to right
     across the field the way light fans out of a prism, rather than the
     original's top-to-bottom printed-chart ramp (a footer is wide and
     short, so a vertical ramp would only ever show a sliver of it);
   - the grid is styled through GridPulse.css, no utility classes. */

const TINTS = [88, 80, 72, 64, 56]
// On a dark ground the pale end of the ladder fades through grey, so it
// starts deeper there.
const TINTS_DARK = [72, 65, 58, 51, 44]
const FAINT = 0.13   // how faint a cell goes right behind a line of text
const FADE = 2.2     // cells it takes to come back up to full strength
const PAD = 5        // clearing kept around each line of text, px
const FADE_IN = 160
const FADE_OUT = 750

const easeOut = t => 1 - (1 - t) ** 2
const easeIn = t => t * t

/**
 * A fine grid that takes colour where the pointer passes and lets it go a
 * moment later, with a few cells lighting on their own. Place it inside a
 * positioned container, under the content. Decoration only: hidden from
 * assistive tech, transparent to the pointer, drawn on one canvas that
 * sleeps whenever nothing is lit, paused off screen, and still for readers
 * who ask for reduced motion.
 *
 * Props
 *  cell      cell size in px (hairlines and lit cells share it)
 *  reach     how far from the pointer a cell can still catch light, in cells
 *  ambient   cells that light on their own each beat, so it's never dead
 *  maxLit    a lid, so a fast sweep can't light the whole field at once
 *  avoid     selector for elements whose lines of text the light holds back
 *            from (looked up inside the grid's parent)
 *  direction 'x' = spectrum runs left to right, 'y' = top to bottom
 *  hueStart / hueSpan  the spectrum: 0 / 280 is red through violet
 */
export default function GridPulse({
  cell = 24,
  reach = 2.6,
  ambient = 2,
  maxLit = 180,
  avoid = '[data-grid-avoid]',
  direction = 'x',
  hueStart = 0,
  hueSpan = 280,
  className = '',
  style,
}) {
  const box = useRef(null)
  const canvas = useRef(null)

  useEffect(() => {
    const el = box.current
    const paper = canvas.current
    const ctx = paper && paper.getContext('2d')
    if (!el || !paper || !ctx) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let cols = 1
    let rows = 1
    let width = 0
    let height = 0
    let clear = []
    let tints = TINTS
    const cells = new Map()

    // Light or dark ground, read from the text colour the grid inherits, so
    // it follows any theme. Resolved through a pixel, since computed colours
    // may not be plain rgb().
    const probe = document.createElement('canvas').getContext('2d', { willReadFrequently: true })
    const readTheme = () => {
      if (!probe) return
      probe.clearRect(0, 0, 1, 1)
      probe.fillStyle = getComputedStyle(el).color
      probe.fillRect(0, 0, 1, 1)
      const [r, g, b] = probe.getImageData(0, 0, 1, 1).data
      const isLightText = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 > 0.5
      tints = isLightText ? TINTS_DARK : TINTS
    }

    // Protect the lines of text, not the boxes that hold them: a paragraph
    // set to a measure keeps that width on its short last line too, and the
    // box would hold a band of cells dark where there's nothing to read.
    const measureText = () => {
      const bounds = el.getBoundingClientRect()
      const scope = el.parentElement || document
      clear = [...scope.querySelectorAll(avoid)].flatMap(node => {
        const range = document.createRange()
        range.selectNodeContents(node)
        const lines = [...range.getClientRects()].filter(r => r.width > 0 && r.height > 0)
        const boxes = lines.length > 0 ? lines : [node.getBoundingClientRect()]
        return boxes.map(r => new DOMRect(
          r.left - bounds.left - PAD,
          r.top - bounds.top - PAD,
          r.width + PAD * 2,
          r.height + PAD * 2,
        ))
      })
    }

    const measure = () => {
      width = el.clientWidth
      height = el.clientHeight
      cols = Math.max(1, Math.ceil(width / cell))
      rows = Math.max(1, Math.ceil(height / cell))
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      paper.width = Math.round(width * dpr)
      paper.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      readTheme()
      measureText()
      wake()
    }

    // How bright a cell may be, by its distance from the nearest line of
    // text. Cells behind the words go faint rather than dark: a hole cut in
    // the grid reads as a fault, a dip in brightness reads as depth.
    const brightness = (col, row) => {
      const x = col * cell + cell / 2
      const y = row * cell + cell / 2
      let nearest = Infinity
      for (const r of clear) {
        const dx = Math.max(r.left - x, 0, x - r.right)
        const dy = Math.max(r.top - y, 0, y - r.bottom)
        nearest = Math.min(nearest, Math.hypot(dx, dy))
        if (nearest === 0) break
      }
      if (nearest === Infinity) return 1
      return FAINT + (1 - FAINT) * Math.min(1, nearest / (FADE * cell))
    }

    const ink = (col, row) => {
      const along = direction === 'y'
        ? (rows > 1 ? row / (rows - 1) : 0)
        : (cols > 1 ? col / (cols - 1) : 0)
      const hue = (((hueStart + Math.min(1, along) * hueSpan) % 360) + 360) % 360
      const tint = tints[Math.floor(Math.random() * tints.length)]
      return `hsl(${Math.round(hue)} 94% ${tint}%)`
    }

    // One loop draws every cell; it runs only while something is lit.
    let frame = 0
    const draw = now => {
      frame = 0
      ctx.clearRect(0, 0, width, height)
      for (const [key, c] of cells) {
        let alpha
        if (now < c.until) {
          alpha = easeOut(Math.min(1, (now - c.born) / FADE_IN))
        } else {
          const t = (now - c.until) / FADE_OUT
          if (t >= 1) { cells.delete(key); continue }
          alpha = 1 - easeIn(t)
        }
        ctx.globalAlpha = alpha * c.dim
        ctx.fillStyle = c.colour
        // Inset by the hairline, so the grid still shows between lit cells.
        ctx.fillRect(c.col * cell + 1, c.row * cell + 1, cell - 1, cell - 1)
      }
      ctx.globalAlpha = 1
      if (cells.size > 0) frame = requestAnimationFrame(draw)
    }
    function wake() { if (!frame) frame = requestAnimationFrame(draw) }

    const light = (col, row, hold) => {
      if (col < 0 || row < 0 || col >= cols || row >= rows) return
      if (cells.size >= maxLit) return
      const key = `${col},${row}`
      const now = performance.now()
      const lit = cells.get(key)
      if (lit && now < lit.until) return
      // A cell caught again while fading picks up from where it had got to,
      // instead of blinking out and back in.
      let born = now
      if (lit) {
        const faded = 1 - easeIn(Math.min(1, (now - lit.until) / FADE_OUT))
        born = now - (1 - Math.sqrt(1 - faded)) * FADE_IN
      }
      cells.set(key, {
        col, row,
        colour: lit ? lit.colour : ink(col, row),
        dim: brightness(col, row),
        born,
        until: now + hold,
      })
      wake()
    }

    // The pointer paints. Cells further from it catch light less often, so
    // the edge of the trail breaks up instead of moving as a block.
    let pending = 0
    let at = null
    const paint = () => {
      pending = 0
      if (!at) return
      const cx = Math.floor(at.x / cell)
      const cy = Math.floor(at.y / cell)
      const span = Math.ceil(reach)
      for (let dy = -span; dy <= span; dy++) {
        for (let dx = -span; dx <= span; dx++) {
          const away = Math.hypot(dx, dy)
          if (away > reach) continue
          if (Math.random() > 1 - away / (reach + 0.6)) continue
          light(cx + dx, cy + dy, 260 + Math.random() * 900)
        }
      }
    }
    // Listened for on the window, because the grid sits under the content
    // and never receives the pointer itself.
    const onMove = event => {
      const bounds = el.getBoundingClientRect()
      at = { x: event.clientX - bounds.left, y: event.clientY - bounds.top }
      if (!pending) pending = requestAnimationFrame(paint)
    }

    // A few cells find their own way on, so the grid is alive on arrival and
    // on a screen with no pointer at all. Paused while out of sight.
    let visible = true
    let beat = 0
    const drift = () => {
      beat = window.setTimeout(drift, 1400 + Math.random() * 1800)
      if (!visible || document.hidden) return
      for (let i = 0; i < ambient; i++) {
        light(
          Math.floor(Math.random() * cols),
          Math.floor(Math.random() * rows),
          900 + Math.random() * 1600,
        )
      }
    }
    beat = window.setTimeout(drift, 500)

    const sight = new IntersectionObserver(([entry]) => {
      visible = entry ? entry.isIntersecting : true
    })
    sight.observe(el)
    const resize = new ResizeObserver(measure)
    resize.observe(el)
    // Text added, removed or rewritten moves the lines to hold back from.
    let recheck = 0
    const copy = new MutationObserver(() => {
      if (!recheck) {
        recheck = requestAnimationFrame(() => { recheck = 0; measureText() })
      }
    })
    copy.observe(el.parentElement || document.body, {
      childList: true, subtree: true, characterData: true,
    })
    measure()
    // Lines of text move once the web fonts arrive.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(measureText).catch(() => {})
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    return () => {
      sight.disconnect()
      resize.disconnect()
      copy.disconnect()
      cancelAnimationFrame(recheck)
      cancelAnimationFrame(frame)
      cancelAnimationFrame(pending)
      clearTimeout(beat)
      window.removeEventListener('pointermove', onMove)
    }
  }, [cell, reach, ambient, maxLit, avoid, direction, hueStart, hueSpan])

  return (
    <div
      ref={box}
      aria-hidden="true"
      data-slot="grid-pulse"
      className={`grid-pulse ${className}`.trim()}
      style={{ '--grid-pulse-cell': `${cell}px`, ...style }}
    >
      <canvas ref={canvas} className="grid-pulse-canvas" />
    </div>
  )
}
