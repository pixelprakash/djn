import './PageHero.css'

/* The shared page hero for Work, Blog and Resume: a "title card".

   One tinted full-width band with an oversized serif title sitting on its
   lower edge -- no left/right halves. The band stays pinned while the page's
   content slides up over it as a rounded sheet, which gives the section a
   little depth without repeating any imagery from further down the page.

   `aside` (the Resume's cut-out portrait) is layered in front of the title,
   standing on the band's bottom edge. */
export default function PageHero({ title, sub, children, aside, className = '' }) {
  return (
    <header data-stack className={`ph${aside ? ' ph--portrait' : ''} ${className}`}>
      <div className="ph-text">
        <h1 className="ph-title">{title}</h1>
        {sub && <p className="ph-sub">{sub}</p>}
        {children}
      </div>
      {aside && <div className="ph-aside">{aside}</div>}
    </header>
  )
}
