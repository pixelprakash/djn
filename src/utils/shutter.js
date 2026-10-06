// The six-blade camera shutter shared by the one-time intro (IntroLoader)
// and the project-page transition (PageTransition in App.jsx), so the two
// are literally the same mechanism.
//
// Each blade is a half-plane whose straight edge sits `d` from the centre,
// the six rotated 60 degrees apart. Closed (d = 0) every edge passes
// through the centre and the screen is covered; opening slides each edge
// outward along its own normal while the whole set unwinds, so the hexagonal
// aperture swells like a real diaphragm. Blades are stacked, so only the
// top overlap of each edge is visible: the pinwheel seams.
export const BLADES = 6
export const OPEN = 130 // aperture inradius (viewBox units) that clears any screen
const TWIST = 38         // degrees the set unwinds while opening

export const bladeTransform = (k, d, rot) =>
  `rotate(${(rot + k * 360 / BLADES).toFixed(2)}) translate(${d.toFixed(2)} 0)`

export const makeShutterRefs = () => ({ blades: [], edges: [], sheens: [] })

// o: 0 = closed, 1 = fully open. `refs` is the object ShutterBlades fills.
export function applyShutter(refs, o) {
  if (!refs.blades[BLADES - 1]) return // not mounted (or already gone)
  const d = o * OPEN
  const rot = (1 - o) * TWIST
  const reach = 0.9 * d + 4 // visible length of a blade edge
  const fade = Math.min(1, d / 7) // seams only appear once the blades part
  for (let k = 0; k < BLADES; k++) {
    refs.blades[k].setAttribute('transform', bladeTransform(k, d, rot))
    const e = refs.edges[k]
    const h = refs.sheens[k]
    e.setAttribute('y1', -reach); e.setAttribute('y2', reach); e.setAttribute('opacity', fade)
    h.setAttribute('y', -reach); h.setAttribute('height', reach * 2); h.setAttribute('opacity', fade)
  }
}

// Ref-callback factory for ShutterBlades: reg('blades', k) -> (el) => store it.
export const shutterRegistrar = refs => (kind, k) => el => { refs[kind][k] = el }
