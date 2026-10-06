import { BLADES, bladeTransform } from '../utils/shutter'

/* The shutter's SVG. Class names are built from `prefix` (`il` for the
   intro, `pt` for page transitions) so each caller styles its own blades
   -- fill, edge colour -- without this file knowing about either. `refs`
   is the object from makeShutterRefs(), passed here through `reg`
   (shutterRegistrar(refs)); drive it with applyShutter().
   Starts closed (every blade edge through the centre). */
export default function ShutterBlades({ prefix, reg, startOpen = false }) {
  const d = startOpen ? 130 : 0
  const rot = startOpen ? 0 : 38
  return (
    <svg
      className={`${prefix}-shutter`}
      viewBox="-100 -100 200 200"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${prefix}-sheen`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#f5f3ee" stopOpacity=".1" />
          <stop offset="1" stopColor="#f5f3ee" stopOpacity="0" />
        </linearGradient>
      </defs>
      {Array.from({ length: BLADES }, (_, k) => (
        <g key={k} ref={reg('blades', k)} transform={bladeTransform(k, d, rot)}>
          <polygon className={`${prefix}-blade`} points="0,-700 0,700 700,700 700,-700" />
          <rect
            className={`${prefix}-sheen`} x="0" y="0" width="16" height="0"
            fill={`url(#${prefix}-sheen)`} opacity="0"
            ref={reg('sheens', k)}
          />
          <line
            className={`${prefix}-edge`} x1="0" x2="0" y1="0" y2="0" opacity="0"
            ref={reg('edges', k)}
          />
        </g>
      ))}
    </svg>
  )
}
