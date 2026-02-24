import { NavLink, useLocation } from "react-router-dom";

const navItems = [
  {
    id: "work",
    label: "Work",
    path: "/work",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      </svg>
    ),
  },
  {
    id: "about",
    label: "About",
    path: "/about",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
  {
    id: "lab",
    label: "Lab",
    path: "/lab",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 3h6v11l3.5 6H5.5L9 14V3z" />
        <line x1="6" y1="3" x2="18" y2="3" />
      </svg>
    ),
  },
  {
    id: "contact",
    label: "Contact",
    path: "/contact",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
  {
    id: "blog",
    label: "Blog",
    path: "/blog",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
  },
  {
    id: "resume",
    label: "Resume",
    path: "/resume",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="8" y1="13" x2="16" y2="13" />
        <line x1="8" y1="17" x2="16" y2="17" />
      </svg>
    ),
  },
];

export default function FloatingNav() {
  const location = useLocation();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

        .floating-nav-wrapper {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1000;
          font-family: 'DM Sans', sans-serif;
          width: max-content;
          max-width: calc(100vw - 32px);
        }

        .floating-nav {
          display: flex;
          align-items: center;
          gap: 2px;
          padding: 6px;
          background: rgba(22, 22, 24, 0.88);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.5),
            0 2px 8px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.06);
          transition: box-shadow 0.3s ease;
        }

        .floating-nav:hover {
          box-shadow:
            0 14px 44px rgba(0, 0, 0, 0.55),
            0 4px 12px rgba(0, 0, 0, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.08);
        }

        .nav-link {
          position: relative;
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 9px 16px;
          border-radius: 14px;
          cursor: pointer;
          text-decoration: none;
          color: rgba(255, 255, 255, 0.42);
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          font-weight: 500;
          letter-spacing: 0.01em;
          transition: color 0.2s ease, background 0.2s ease;
          white-space: nowrap;
          outline: none;
        }

        .nav-link:hover {
          color: rgba(255, 255, 255, 0.78);
          background: rgba(255, 255, 255, 0.06);
        }

        .nav-link.active {
          color: rgba(255, 255, 255, 0.96);
          background: rgba(255, 255, 255, 0.11);
        }

        .nav-link .nav-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.65;
          transition: opacity 0.2s ease, transform 0.2s ease;
          flex-shrink: 0;
        }

        .nav-link:hover .nav-icon {
          opacity: 0.9;
          transform: translateY(-1px);
        }

        .nav-link.active .nav-icon {
          opacity: 1;
        }

        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: 5px;
          left: 50%;
          transform: translateX(-50%);
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.45);
        }

        .nav-divider {
          width: 1px;
          height: 18px;
          background: rgba(255, 255, 255, 0.07);
          flex-shrink: 0;
          margin: 0 2px;
        }

        /* ── Mobile: icons only + tooltip ── */
        @media (max-width: 600px) {
          .floating-nav-wrapper {
            bottom: 20px;
          }

          .floating-nav {
            padding: 5px;
            border-radius: 18px;
            gap: 0;
          }

          .nav-link {
            padding: 10px 12px;
            gap: 0;
            border-radius: 12px;
          }

          .nav-label {
            display: none;
          }

          .nav-link .nav-icon {
            opacity: 0.55;
          }

          .nav-link.active .nav-icon {
            opacity: 1;
          }

          .nav-link.active::after {
            display: none;
          }

          /* Tooltip */
          .nav-link::before {
            content: attr(data-label);
            position: absolute;
            bottom: calc(100% + 10px);
            left: 50%;
            transform: translateX(-50%) translateY(4px);
            background: rgba(22, 22, 24, 0.95);
            color: rgba(255, 255, 255, 0.85);
            font-size: 11px;
            font-family: 'DM Sans', sans-serif;
            font-weight: 500;
            padding: 4px 10px;
            border-radius: 8px;
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.15s ease, transform 0.15s ease;
            border: 1px solid rgba(255, 255, 255, 0.08);
          }

          .nav-link:hover::before,
          .nav-link:focus::before {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        /* ── Very small screens ── */
        @media (max-width: 380px) {
          .nav-link {
            padding: 10px 9px;
          }
        }
      `}</style>

      <div className="floating-nav-wrapper">
        <nav className="floating-nav" role="navigation" aria-label="Main navigation">
          {navItems.map((item, index) => (
            <div key={item.id} style={{ display: "flex", alignItems: "center" }}>
              {index > 0 && <div className="nav-divider" />}
              <NavLink
                to={item.path}
                data-label={item.label}
                className={({ isActive }) =>
                  `nav-link${isActive || location.pathname === item.path ? " active" : ""}`
                }
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </NavLink>
            </div>
          ))}
        </nav>
      </div>
    </>
  );
}