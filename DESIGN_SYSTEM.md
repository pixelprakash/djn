# Design System

Single source of truth for this site's visual language. Tokens live in
[`src/styles/tokens.css`](src/styles/tokens.css) — read them from there,
don't redeclare colors/type/spacing in page CSS.

## Typography

- **One typeface everywhere: DM Sans.** Both `--serif` and `--body` point to
  it — the names are legacy from an earlier two-font system, kept only so
  existing `font-family: var(--serif)` / `var(--body)` call sites didn't
  all need renaming.
- **Page title (`--fs-h1`):** `clamp(36px, 5vw, 72px)`, weight 400.
  Every page's `<h1>` uses this token so titles read as the same size
  across Home/Work/Resume/Lab/Blog/Contact — don't hardcode a page-specific
  title size. `--fs-h1-sm` is a slightly smaller floor applied at ≤640px
  on a few pages for extra-tight mobile layouts.
- **Subtitle (`--fs-subtitle`):** `1.25rem` under every page title.
- **Body copy (`--fs-body`):** `1.05rem` — the floor for anything a visitor
  is meant to actually *read* (bios, card/list descriptions), as opposed to
  small metadata (category tags, dates, uppercase eyebrow labels), which
  stays intentionally smaller. If a description/paragraph reads smaller
  than this, it's usually a bug, not a deliberate hierarchy choice.
- **Letter-spacing (`--title-tracking` / `--title-tracking-sm`):** every
  page title — Home, Work, Resume, Lab, Blog, Contact, CvPage — uses the
  same literal `-5px` tracking, stepping down to `-2px` (`--title-tracking-sm`)
  wherever the page already drops to `--fs-h1-sm` (or smaller) at a mobile
  breakpoint. Always pair a `--fs-h1-sm`-or-smaller override with the `-sm`
  tracking token — `-5px` at a ~24–32px size will visibly overlap letters.
- **Title entrance (`titleReveal`, defined once in `index.css`):** every
  page's `<h1>` animates in with the same keyframe — a soft blur+slide,
  not a fade alone, and not a letter-by-letter/typewriter effect (that
  reads as a template gimmick, not a deliberate choice). Apply it as
  `animation: titleReveal .7s cubic-bezier(.16,1,.3,1) .08s both;` directly
  on the title selector; don't redefine the keyframe per page.

## Color

| Token | Value | Use |
|---|---|---|
| `--bg` | `#f5f3ee` | Page background |
| `--ink` | `#1a1814` | Primary text |
| `--sub` | `#4a4540` | Secondary text |
| `--muted` | `#6b6660` | Tertiary/label text (kept ≥4.5:1 on `--bg`, don't lighten) |
| `--rule` | `#dbd6ce` | Borders, dividers |
| `--accent` | `#1c5d8c` (brand blue) | **The** primary/interactive color — links, focus rings, active nav state, CTA buttons, hover states. Everything should route through this token, not a hardcoded hex, so a future rebrand is a one-line change. |
| `--accent-rgb` | `28, 93, 140` | Same color as r,g,b, for `rgba(var(--accent-rgb), .2)`-style glows/borders that need partial opacity — `rgba()` can't take a hex custom property directly. **Never hardcode a literal `rgba(r,g,b,a)` for an accent-tinted glow** — that's exactly how a page-wide accent-color change (orange → blue, done once already) leaves stale-colored shadows behind on individual pages that someone forgot to grep for. |
| `--green` | `#024F46` | Used sparingly for the About-page dark-green treatment |

The Home page (`About.jsx`/`About.css`) additionally scopes two local
palettes for its Works/Research panels: `--hp-blue`/`--hp-blue-card` and
`--hp-purple`/`--hp-purple-card`, plus `--hp-accent` (a light cyan) for
the panel headings. These are page-specific accents on top of the shared
palette, not replacements for `--accent`.

## Spacing & Layout

- **Page gutter (`--g`):** `clamp(20px, 6vw, 60px)`. Fluid by design —
  every page reads this one token instead of setting its own breakpoint
  overrides. If a page needs a different gutter at some width, that's a
  sign the token itself needs adjusting, not that the page should
  override `--g` locally (we removed ~20 duplicate `:root { --g: Npx }`
  overrides across page CSS files for exactly this reason).
- **Bottom breathing room (`--nav-safe`):** `48px`, applied as
  `padding-bottom` on long pages.

## Radius scale

- `--radius-lg` (12px) — outer containers (e.g. the Home Works/Research panels)
- `--radius-md` (10px) — cards/elements nested inside a `--radius-lg` container
- `--radius-sm` (6px) — small chips, inputs

Nested radius should always be ≤ its parent's, per the scale above.

## Motion

- **Spring/bounce easing:** `cubic-bezier(.34, 1.56, .64, 1)` — used for
  anything that should feel like it settles with a little overshoot
  (hover lifts, toggle thumbs, icon rotations). This is the site's
  signature easing; reach for it before inventing a new curve.
- **Underline/reveal sweeps:** plain `ease-out`, ~0.25s.
- Respect `prefers-reduced-motion: reduce` — decorative
  animations/transitions should no-op, not just run faster.

## Navbar

- **Gutter:** `.tn-inner` padding is `var(--g)`, same as every page — the
  navbar's left/right edges always line up with page content below it.
- **Contact is a CTA, not a nav link:** it's excluded from `NAV_ITEMS` in
  `TopNav.jsx` and rendered separately as `.tn-cta` — a solid `--accent`
  pill, pinned to the right via `margin-left: auto` (which works whether
  or not `.tn-links` is visible, since `.tn-links` itself is `flex:1` on
  desktop). It stays visible at every breakpoint, including alongside the
  mobile hamburger — don't add Contact back into the link list or the
  mobile dropdown, that would duplicate it.

## Page header pattern -- the "title card"

Work, Blogs, Resume and Contact open with the shared `PageHero`
(`src/components/PageHero.jsx` + `PageHero.css`):

```
<PageHero title="…" sub="…" />          // Work, Blog
<PageHero title="…" sub="…" aside={<Portrait … />}>…extra lines…</PageHero>   // Resume
```

- **One full-width tinted band** (`#e8eef3` → `#dce6ee`), not a left/right
  split. The title is oversized Literata (`clamp(3.25rem, 10.5vw, 9.5rem)`)
  sitting on the band's lower edge, the subtitle under it.
- **The page overlaps the band.** The hero scrolls away normally (it is NOT
  pinned -- a pinned hero made the title and portrait look stuck while the
  page covered them). It sits at `z-index: -1` and the page root must set
  `isolation: isolate`; every following sibling gets the page background,
  and the first one rises 28px over the hero's lower edge with rounded top
  corners and a soft shadow.
- **Nothing from further down the page is repeated in the hero** -- no cover
  photos, thumbnails, counts or stats. The only imagery allowed is the
  person's own cut-out portrait (`aside`), which stands on the band's bottom
  edge in front of the title; the sheet covers its cropped lower edge.
- No eyebrow line, no decorative grid or frames.
- **One title size for all four pages** (Work, Blogs, Resume, Contact): the
  `--fs-hero` token (`clamp(3rem, 7vw, 6.5rem)`, `--fs-hero-sm` on phones), with
  the same line height (1.1, enough clearance that a descender never touches the
  next line) and tracking (-0.02em). Don't size a hero title per page. The About
  page keeps its own hero. `--fs-h1` still applies to ordinary page titles.

## Custom cursor

`src/components/CustomCursor.jsx` replaces the OS cursor sitewide with a
small camera-viewfinder (corner brackets + center dot, `--accent`
colored) — a nod to the photography side of the profile. It only
activates on `(pointer: fine)` devices (checked via `matchMedia`, so
touch is completely untouched) and has four states, driven by
`element.closest()` against selector lists in that file:
`default` (resting), `interactive` (links/buttons/nav — brackets relax
outward), `view` (photos, project/blog cards, videos — brackets pull in
tight around a small expand glyph — "focus lock"), and `text`
(inputs/textareas — cursor hides entirely, native caret takes over).
A brief scale-down on mousedown gives click feedback (a shutter-click
squeeze). When adding a new "this opens something bigger" element
(another card type, a lightbox trigger, etc.), add its class to
`VIEW_SELECTOR` in CustomCursor.jsx rather than inventing a separate
per-page cursor — that's what used to exist for the ProjectDetail photo
grid (`.pd-cursor`) before it was folded into this shared component.

## Card pattern — universal, not just Home

Every card-like surface on the site (Home Works/Research marquee cards,
Work's `.proj-card` list, Blog's `.bl-card`/`.bl-featured`, Lab's
`.lab-video`) follows the same physical language:

- **Resting shadow**, always — `box-shadow: 0 1px 2px rgba(26,24,20,.06), 0
  8px 24px rgba(26,24,20,.08)` (or the equivalent on a dark surface like
  `.lab-video`). A card with *zero* shadow until hover is a tell that it
  was added later without checking what the rest of the site does — every
  card should feel picked-up-off-the-table even before you touch it.
- **Hover**: shadow deepens substantially and the card lifts (`-5px` to
  `-7px` via `transform: translateY()`), using the spring easing above.
- **Radius**: `--radius-lg` for standalone cards, `--radius-md` for a card
  nested inside another `--radius-lg` container (the Home marquee panels).

Don't add a new card type with only a hover shadow and no resting one —
that inconsistency is exactly what made the site feel like disconnected
pages rather than one product before this pass.

## Footer

`src/components/Footer.jsx` renders once in `App.jsx`, after `<main>`, on
every route — not per-page. It's a dark (`--ink`) surface, a deliberate
break from the cream page background so it reads as a definite end-of-page
bookend. Contains: logo + identity tagline, a flat list of the main nav
links (excluding the Contact CTA — Contact is still reachable via the
navbar CTA), the same `SOCIALS` list as the Home hero (imported from
`src/data/socials.js`, not redeclared), and a copyright line. If the nav
structure changes, update `LINKS` in `Footer.jsx` to match — it's a
separate array from `TopNav.jsx`'s `NAV_ITEMS` by necessity (the footer
doesn't need the CV dropdown children), but the top-level pages listed
should stay in sync.

## Voice & persona

Copy on this site — especially the Home hero, which is the one place the
site talks about *him* rather than his CV — is grounded in a workshop
conducted with the professor specifically to get this right. Two things
from it should keep steering future copy decisions:

- **Self-identity**: asked which single word he'd want a student to use,
  he said "Designer and Researcher and a creative artist" — not
  "Professor." Lead with that framing over an institutional title when
  writing about who he is (see the Home hero bio).
- **Values**: Curiosity, Mentorship, Innovation, Friendly, Experimentation,
  and Rigour are strongly-him; Strict is explicitly *not* him. Copy should
  read warm and curious, never stiff or authoritative-for-its-own-sake —
  but "Rigour" being strongly-him is exactly why the site itself shouldn't
  expose its own process (no literal workshop mechanics, sticky-note
  language, or values-sorting UI on the actual pages — that reads as
  internal scaffolding, not a finished, considered site).
- **Audience**: students and designers are primary; academics/researchers
  secondary; general public/gallerists occasional. When in doubt about
  which reader a piece of copy is for, write for a student first.

## Accessibility (target: WCAG 2.2 Level AA)

Conventions every page and component follows -- keep them when adding to the site:

- **Every page sets its title** with `usePageTitle('Page name')` (`src/hooks/usePageTitle.js`).
  Detail pages pass their own name (project, article, CV section).
- **Page changes are announced.** `PageTransition` fires `route-shown` after each swap;
  `RouteAnnouncer` (App.jsx) reads the new title in a live region and focuses `#main-content`.
  Only one `<main>` per page -- it lives in App.jsx, never in a page.
- **Tabs use the real tabs pattern** (`role=tablist/tab/tabpanel`, roving tabindex, arrow keys):
  see Work.jsx. `aria-selected` is invalid on plain buttons.
- **Modals are real dialogs** (`role=dialog`, `aria-modal`, focus in on open, Tab kept inside,
  Escape closes, focus returned to the opener): see `Slideshow` in PhotoGallery.jsx. They sit above
  the navbar (z-index 99999).
- **Forms:** a visible `<label>` per field, `autoComplete` where it applies, validation messages
  tied to fields with `aria-describedby` + `aria-invalid`, focus moved to the first problem
  (Contact.jsx). Field borders must be >= 3:1 (`#86817a`), placeholders >= 4.5:1.
- **Target size:** >= 24px always, 44px on touch / <= 860px (`src/styles/a11y.css`). Add new small
  links/buttons to that list.
- **Text:** nothing under 14px; body copy >= 1.05rem; `--muted` is #534e48 (7.4:1).
- **Motion:** respect `prefers-reduced-motion` (intro, page transitions, stacking and the Lab strip
  all switch off); anything that moves by itself for more than 5s can be paused or skipped
  (the intro has a "Skip intro" button and Escape).
- **Focus is never hidden:** `#root` has `scroll-padding-top` for the fixed navbar and pinned tabs.
- **Names:** an accessible name must contain the visible text (e.g. "Slide Show", not an unrelated
  aria-label).

**How to test:** `npm install --no-save axe-core`, then in the browser load
`/node_modules/axe-core/axe.min.js` on a page (after skipping the intro) and run
`axe.run(document, {runOnly: {type: 'tag', values: ['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})`.
