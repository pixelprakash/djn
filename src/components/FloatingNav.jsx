import { NavLink, useLocation } from "react-router-dom";

const navItems = [
  {
    id: "about",
    label: "About",
    path: "/about",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
  {
    id: "work",
    label: "Work",
    path: "/work",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      </svg>
    ),
  },
  {
    id: "resume",
    label: "Resume",
    path: "/resume",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="8" y1="13" x2="16" y2="13" />
        <line x1="8" y1="17" x2="16" y2="17" />
      </svg>
    ),
  },
  {
    id: "lab",
    label: "DIC Lab",
    path: "/lab",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 3h6v11l3.5 6H5.5L9 14V3z" />
        <line x1="6" y1="3" x2="18" y2="3" />
      </svg>
    ),
  },
  {
    id: "blog",
    label: "Blog",
    path: "/blog",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
  },
  {
    id: "contact",
    label: "Contact",
    path: "/contact",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
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
          bottom: 28px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1000;
          font-family: "DM Sans", sans-serif;
          width: max-content;
          max-width: calc(100vw - 24px);
        }

        .floating-nav {
          display: flex;
          align-items: center;
          gap: 2px;
          padding: 6px;
          background: rgba(22, 22, 24, 0.92);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 22px;
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
          gap: 8px;
          padding: 11px 18px;
          min-height: 44px;
          border-radius: 16px;
          cursor: pointer;
          text-decoration: none;
          color: rgba(255, 255, 255, 0.45);
          font-family: "DM Sans", sans-serif;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.01em;
          transition: color 0.2s ease, background 0.2s ease;
          white-space: nowrap;
          outline: none;
          -webkit-tap-highlight-color: transparent;
        }

        .nav-link:focus-visible {
          outline: 2px solid rgba(255, 94, 46, 0.8);
          outline-offset: 2px;
        }

        .nav-link:hover {
          color: rgba(255, 255, 255, 0.82);
          background: rgba(255, 255, 255, 0.07);
        }

        .nav-link.active {
          color: rgba(255, 255, 255, 0.97);
          background: rgba(255, 255, 255, 0.12);
        }

        .nav-link .nav-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.65;
          flex-shrink: 0;
          transition: opacity 0.2s ease, transform 0.2s ease;
        }

        .nav-link:hover .nav-icon {
          opacity: 0.95;
          transform: translateY(-1px);
        }

        .nav-link.active .nav-icon {
          opacity: 1;
        }

        .nav-link.active::after {
          content: "";
          position: absolute;
          bottom: 5px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
        }

        .nav-divider {
          width: 1px;
          height: 20px;
          background: rgba(255, 255, 255, 0.08);
          flex-shrink: 0;
          margin: 0 2px;
        }

        @media (max-width: 600px) {
          .floating-nav-wrapper {
            bottom: 20px;
            max-width: calc(100vw - 16px);
          }

          .floating-nav {
            padding: 6px;
            border-radius: 20px;
            gap: 0;
          }

          .nav-link {
            padding: 0;
            width: 52px;
            height: 52px;
            min-height: 52px;
            border-radius: 14px;
            justify-content: center;
            gap: 0;
          }

          .nav-label {
            display: none;
          }

          .nav-link .nav-icon svg {
            width: 22px;
            height: 22px;
          }

          .nav-link .nav-icon {
            opacity: 0.5;
          }

          .nav-link.active .nav-icon {
            opacity: 1;
          }

          .nav-link::before {
            content: attr(data-label);
            position: absolute;
            bottom: calc(100% + 12px);
            left: 50%;
            transform: translateX(-50%) translateY(6px);
            background: rgba(22, 22, 24, 0.96);
            color: rgba(255, 255, 255, 0.9);
            font-size: 12px;
            font-family: "DM Sans", sans-serif;
            font-weight: 500;
            padding: 5px 12px;
            border-radius: 8px;
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.15s ease, transform 0.15s ease;
            border: 1px solid rgba(255, 255, 255, 0.1);
            letter-spacing: 0.02em;
          }

          .nav-link:hover::before,
          .nav-link:focus-visible::before {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }

          .nav-divider {
            height: 24px;
            margin: 0 1px;
          }
        }

        @media (max-width: 360px) {
          .nav-link {
            width: 46px;
            height: 48px;
            min-height: 48px;
          }
        }
      `}</style>

      <div className="floating-nav-wrapper">
        <nav className="floating-nav" role="navigation" aria-label="Main navigation">
          {navItems.map((item, index) => (
            <div key={item.id} style={{ display: "flex", alignItems: "center" }}>
              {index > 0 && <div className="nav-divider" aria-hidden="true" />}
              <NavLink
                to={item.path}
                data-label={item.label}
                aria-label={item.label}
                className={({ isActive }) =>
                  `nav-link${isActive || location.pathname === item.path ? " active" : ""}`
                }
              >
                <span className="nav-icon" aria-hidden="true">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </NavLink>
            </div>
          ))}
        </nav>
      </div>
    </>
  );
}