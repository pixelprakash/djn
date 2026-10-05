// Shared by IntroLoader (the one-time site intro) and App.jsx's
// RouteTransition (every page-to-page navigation) so both use the exact
// same aperture-iris shape language instead of two different ad hoc
// wipes -- one signature move for the whole site's motion, not one for
// the intro and a different one for everything after it.
//
// A 6-point polygon standing in for a camera iris diaphragm -- the same
// shape a 6-blade aperture leaves in bokeh. Computed procedurally (not
// as a couple of fixed CSS keyframe stops) so the blades visibly
// *rotate* as they open/close instead of just uniformly scaling -- a
// plain circle (or a non-rotating hexagon) reads as a generic wipe; the
// rotation is what makes it read as a mechanical iris.
//
// `openness`: 0 = fully closed (collapsed to a point at center),
// 1 = fully open (large enough to cover any viewport/aspect ratio).
export function irisClipPath(openness, { rMax = 160, rotMax = 50 } = {}) {
  const r = rMax * openness
  const rot = (1 - openness) * rotMax
  const pts = []
  for (let k = 0; k < 6; k++) {
    const angle = (rot + k * 60) * (Math.PI / 180)
    const x = 50 + r * Math.cos(angle)
    const y = 50 + r * Math.sin(angle)
    pts.push(`${x.toFixed(2)}% ${y.toFixed(2)}%`)
  }
  return `polygon(${pts.join(', ')})`
}
