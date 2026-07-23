import { NavLink } from "react-router-dom";
import { createPortal } from "react-dom";
import { preloadForPath } from "../routePreload";
import "./FloatingNav.css";

const NAV = [
  { id: "about",   label: "About",   path: "/about",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg> },
  { id: "work",    label: "Work",    path: "/work",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg> },
  { id: "resume",  label: "Resume",  path: "/resume",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/></svg> },
  { id: "lab",     label: "DIC Lab", path: "/lab",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3h6v11l3.5 6H5.5L9 14V3z"/><line x1="6" y1="3" x2="18" y2="3"/></svg> },
  { id: "blog",    label: "Blog",    path: "/blog",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg> },
  { id: "contact", label: "Contact", path: "/contact",
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> },
];

export default function FloatingNav() {
  const nav = (
    <div className="fn-wrap">
      <nav className="fn-pill" role="navigation" aria-label="Main navigation">
        {NAV.map((item, i) => (
          <div key={item.id} style={{ display: "flex", alignItems: "center" }}>
            {i > 0 && <div className="fn-div" aria-hidden="true" />}
            <NavLink
              to={item.path}
              data-label={item.label}
              aria-label={item.label}
              className={({ isActive }) => "fn-link" + (isActive ? " fn-active" : "")}
              onMouseEnter={() => preloadForPath(item.path)}
              onFocus={() => preloadForPath(item.path)}
              onTouchStart={() => preloadForPath(item.path)}
            >
              <span className="fn-icon" aria-hidden="true">{item.icon}</span>
              <span className="fn-label">{item.label}</span>
            </NavLink>
          </div>
        ))}
      </nav>
    </div>
  );

  // Render into document.body directly — escapes ALL stacking contexts
  // created by transforms, will-change, overflow:hidden on page elements
  // Portal into document.documentElement (html) which has overflow:hidden
  // This guarantees position:fixed is viewport-relative on all mobile browsers
  return createPortal(nav, document.documentElement);
}