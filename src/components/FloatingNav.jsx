import { NavLink, useLocation } from "react-router-dom";

const NAV = [
  {
    id: "about", label: "About", path: "/about",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>,
  },
  {
    id: "work", label: "Work", path: "/work",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>,
  },
  {
    id: "resume", label: "Resume", path: "/resume",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/></svg>,
  },
  {
    id: "lab", label: "DIC Lab", path: "/lab",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3h6v11l3.5 6H5.5L9 14V3z"/><line x1="6" y1="3" x2="18" y2="3"/></svg>,
  },
  {
    id: "blog", label: "Blog", path: "/blog",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
  },
  {
    id: "contact", label: "Contact", path: "/contact",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  },
];

export default function FloatingNav() {
  const location = useLocation();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;500&display=swap');

        /* -- Wrapper -- */
        .fn-wrap {
          position: fixed;
          bottom: 28px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1000;
          width: max-content;
          max-width: calc(100vw - 24px);
        }

        /* -- Pill container -- */
        .fn-pill {
          display: flex;
          align-items: center;
          gap: 2px;
          padding: 6px;
          background: rgba(15, 14, 12, 0.96);
          backdrop-filter: blur(20px) saturate(160%);
          -webkit-backdrop-filter: blur(20px) saturate(160%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          box-shadow:
            0 8px 40px rgba(0,0,0,0.55),
            0 2px 8px rgba(0,0,0,0.3),
            inset 0 1px 0 rgba(255,255,255,0.07);
        }

        /* -- Each nav link -- */
        .fn-link {
          position: relative;
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 10px 20px;
          min-height: 46px;
          border-radius: 18px;
          text-decoration: none;
          font-family: 'Rubik', sans-serif;
          font-size: 15px;
          font-weight: 400;
          letter-spacing: 0.01em;
          white-space: nowrap;
          color: rgba(255,255,255,0.52);
          transition:
            color 0.2s ease,
            background 0.2s ease,
            transform 0.2s cubic-bezier(.34,1.56,.64,1);
          outline: none;
          -webkit-tap-highlight-color: transparent;
          cursor: pointer;
        }

        /* hover state -- brighter white */
        .fn-link:hover {
          color: rgba(255,255,255,0.9);
          background: rgba(255,255,255,0.08);
          transform: translateY(-1px);
        }

        /* focus ring */
        .fn-link:focus-visible {
          outline: 2px solid #FF5E2E;
          outline-offset: 2px;
        }

        /* -- ACTIVE state -- brand accent fill -- */
        .fn-link.fn-active {
          color: #ffffff;
          background: #FF5E2E;
          font-weight: 500;
          box-shadow: 0 4px 16px rgba(255,94,46,0.4);
        }

        .fn-link.fn-active:hover {
          background: #e8521f;
          transform: translateY(-1px);
        }

        /* -- Icon -- */
        .fn-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform 0.2s cubic-bezier(.34,1.56,.64,1);
        }

        .fn-link:not(.fn-active):hover .fn-icon {
          transform: translateY(-1px) scale(1.08);
        }

        /* Active dot -- hidden since active uses colour fill now */
        .fn-link.fn-active::after { display: none; }

        /* -- Divider -- */
        .fn-div {
          width: 1px;
          height: 22px;
          background: rgba(255,255,255,0.1);
          flex-shrink: 0;
          margin: 0 1px;
        }

        /* ======================================
           MOBILE -- icon only, tooltip on hover
        ====================================== */
        @media (max-width: 640px) {
          .fn-wrap { bottom: 20px; max-width: calc(100vw - 16px); }

          .fn-pill { padding: 5px; border-radius: 22px; gap: 1px; }

          .fn-link {
            padding: 0;
            width: 50px;
            height: 50px;
            min-height: 50px;
            border-radius: 16px;
            justify-content: center;
            gap: 0;
          }

          .fn-label { display: none; }

          .fn-icon svg { width: 20px; height: 20px; }

          /* Tooltip above each icon */
          .fn-link::before {
            content: attr(data-label);
            position: absolute;
            bottom: calc(100% + 10px);
            left: 50%;
            transform: translateX(-50%) translateY(5px);
            background: rgba(15,14,12,0.97);
            color: rgba(255,255,255,0.92);
            font-family: 'Rubik', sans-serif;
            font-size: 12px;
            font-weight: 500;
            padding: 5px 12px;
            border-radius: 8px;
            white-space: nowrap;
            pointer-events: none;
            opacity: 0;
            border: 1px solid rgba(255,255,255,0.12);
            letter-spacing: 0.02em;
            transition: opacity 0.15s ease, transform 0.15s ease;
          }
          .fn-link:hover::before,
          .fn-link:focus-visible::before {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }

          /* Active on mobile -- orange dot below icon */
          .fn-link.fn-active {
            background: rgba(255,94,46,0.18);
            box-shadow: none;
          }
          .fn-link.fn-active::after {
            display: block;
            content: "";
            position: absolute;
            bottom: 5px;
            left: 50%;
            transform: translateX(-50%);
            width: 4px;
            height: 4px;
            border-radius: 50%;
            background: #FF5E2E;
          }
        }

        @media (max-width: 380px) {
          .fn-link { width: 44px; height: 46px; min-height: 46px; }
        }
      `}</style>

      <div className="fn-wrap">
        <nav className="fn-pill" role="navigation" aria-label="Main navigation">
          {NAV.map((item, i) => (
            <div key={item.id} style={{ display: "flex", alignItems: "center" }}>
              {i > 0 && <div className="fn-div" aria-hidden="true" />}
              <NavLink
                to={item.path}
                data-label={item.label}
                aria-label={item.label}
                className={({ isActive }) =>
                  "fn-link" + (isActive || location.pathname === item.path ? " fn-active" : "")
                }
              >
                <span className="fn-icon" aria-hidden="true">{item.icon}</span>
                <span className="fn-label">{item.label}</span>
              </NavLink>
            </div>
          ))}
        </nav>
      </div>
    </>
  );
}