import useTheme from '../hooks/useTheme'
import './ThemeToggle.css'

/* The light / dark switch. A real switch (role="switch", aria-checked) with a
   moon-and-sun icon that shows the theme you would switch TO, so it reads at a
   glance; its name stays "Dark theme" so a screen reader says "Dark theme, switch,
   on/off" rather than a changing label. `showLabel` adds the words (mobile menu). */
export default function ThemeToggle({ showLabel = false, className = '' }) {
  const { isDark, toggle } = useTheme()
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Dark theme"
      className={`tt${showLabel ? ' tt--label' : ''} ${className}`}
      onClick={e => toggle(e.currentTarget)}
    >
      <span className="tt-icon" aria-hidden="true">
        {isDark ? (
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4.2" />
            <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.5 14.2A8.6 8.6 0 0 1 9.8 3.5a8.6 8.6 0 1 0 10.7 10.7Z" />
          </svg>
        )}
      </span>
      {showLabel && <span className="tt-text">{isDark ? 'Light theme' : 'Dark theme'}</span>}
    </button>
  )
}
