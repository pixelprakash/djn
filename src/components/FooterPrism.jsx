import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import './FooterPrism.css'

/* The footer's closing scene: a beam of white light enters a glass prism and
   leaves as a spectrum -- the photographer's element. It is a small optical
   simulation drawn on a canvas, not an animation loop of pictures:

   - 44 wavelengths (violet to red) are each traced through the glass with
     Snell's law, using a refractive index that is higher for short wavelengths
     (exaggerated a little so it reads). Where a ray leaves the prism sets where
     its colour lands, so the spectrum fans, narrows, swings and even vanishes
     (total internal reflection) as the prism turns -- as a real one does.
   - One gesture: the spectrum points at your cursor. Move the pointer and the
     whole prism turns so the colours fan toward it (the light source swings with
     it, so there is always a spectrum). A small ring marks what it is aiming at.
     The aim is solved from the prism's own geometry, not from last frame's picture,
     and the turn is eased with a speed limit, so it glides instead of jerking. On a touch screen, tap or drag a finger
     and it points there; scrolling up and down still scrolls the page. Click or
     tap also gives a flash of exposure. Left alone it drifts slowly by itself, and
     after a touch it settles back to drifting.
   - Dust motes drift through the scene and light up in the colour of whatever
     part of the beam or spectrum they cross.
   - It only runs while on screen. Visitors who prefer reduced motion get a still
     image that still answers to the pointer, but nothing moves on its own.
   - It is purely decorative (hidden from assistive tech); the sentence and the
     link under it are the real content. */
const VW = 1000, VH = 400                // the drawing space; the canvas covers it ("slice")
const CX = 560, CY = 200, SIDE = 210     // the prism, in the middle of the frame
const R = SIDE / Math.sqrt(3)            // circumradius
const NRAYS = 44
const FAR = 1700

// Visible wavelength (nm) -> [r, g, b] 0..255 (Bruton's approximation).
function rgbOf(l) {
  let r = 0, g = 0, b = 0
  if (l < 440) { r = -(l - 440) / 60; b = 1 }
  else if (l < 490) { g = (l - 440) / 50; b = 1 }
  else if (l < 510) { g = 1; b = -(l - 510) / 20 }
  else if (l < 580) { r = (l - 510) / 70; g = 1 }
  else if (l < 645) { r = 1; g = -(l - 645) / 65 }
  else { r = 1 }
  const f = l < 420 ? 0.35 + 0.65 * (l - 380) / 40 : l > 680 ? 0.35 + 0.65 * (700 - l) / 20 : 1
  const c = v => Math.round(255 * Math.pow(Math.max(0, v) * f, 0.8))
  return [c(r), c(g), c(b)]
}
// Rays from red (long, least bent) to violet (short, most bent).
const RAYS = Array.from({ length: NRAYS }, (_, i) => {
  const l = 700 - (700 - 385) * i / (NRAYS - 1)
  const x = (550 / l) * (550 / l)
  return { l, n: 1.52 + 0.17 * (x - 0.617), rgb: rgbOf(l) } // Cauchy-style dispersion, exaggerated so the fan reads
})

const dot = (a, b) => a.x * b.x + a.y * b.y
const norm = v => { const m = Math.hypot(v.x, v.y) || 1; return { x: v.x / m, y: v.y / m } }

// Refract direction d through a surface whose normal N faces the incoming side.
function refract(d, N, eta) {
  const cosi = -dot(N, d)
  const k = 1 - eta * eta * (1 - cosi * cosi)
  if (k < 0) return null
  const a = eta * cosi - Math.sqrt(k)
  return { x: eta * d.x + a * N.x, y: eta * d.y + a * N.y }
}
// Where ray (o, t) crosses segment P-Q: distance s along the ray, or null.
function hitSeg(o, t, P, Q) {
  const ex = Q.x - P.x, ey = Q.y - P.y
  const den = t.x * ey - t.y * ex
  if (Math.abs(den) < 1e-9) return null
  const px = P.x - o.x, py = P.y - o.y
  const s = (px * ey - py * ex) / den
  const u = (px * t.y - py * t.x) / den
  return s > 1e-4 && u >= 0 && u <= 1 ? s : null
}

export default function FooterPrism() {
  const stageRef = useRef(null)
  const mainRef = useRef(null)
  const softRef = useRef(null)
  const aim = useRef(null)

  useEffect(() => {
    const stage = stageRef.current
    const canvas = mainRef.current
    if (!stage || !canvas) return
    const ctx = canvas.getContext('2d')
    const soft = softRef.current // low-resolution layer; CSS blurs it into the glow
    if (!soft) return
    const sctx = soft.getContext('2d')
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // ---- state ----
    const st = {
      w: 0, h: 0, s: 1, ox: 0, oy: 0, dpr: 1,
      aimY: 0.86,                              // the angle the light meets the glass (radians)
      rot: 0, rotTarget: 0,                    // prism angle
      pointer: false, touch: false, lastInput: -1e9,   // where the pointer is (drawing units)
      off: { x: 60, y: 20 },                   // where the colours leave the glass, relative to the prism's centre (prism unturned)
      tx: 0, ty: 0, sx: 0, sy: 0,              // pointer target and its eased position (drawing units)
      target: 0, last: 0,                      // prism angle we are turning toward; time of the last frame
      nominal: 0.3,                            // direction the spectrum leaves at when the prism is not turned
      flash: 0, t0: performance.now(), visible: false, raf: 0,
      motes: Array.from({ length: 70 }, () => ({
        x: Math.random() * VW, y: Math.random() * VH, vx: (Math.random() - 0.3) * 0.12, vy: (Math.random() - 0.5) * 0.08,
        r: 0.5 + Math.random() * 1.1, p: Math.random() * 6.28,
      })),
    }

    const size = () => {
      const r = stage.getBoundingClientRect()
      st.dpr = Math.min(window.devicePixelRatio || 1, 2)
      st.w = Math.max(2, Math.round(r.width)); st.h = Math.max(2, Math.round(r.height))
      canvas.width = Math.round(st.w * st.dpr); canvas.height = Math.round(st.h * st.dpr)
      soft.width = Math.max(2, Math.round(st.w / 4)); soft.height = Math.max(2, Math.round(st.h / 4))
      st.s = Math.max(st.w / VW, st.h / VH)
      st.ox = (st.w - VW * st.s) / 2; st.oy = (st.h - VH * st.s) / 2
      // Narrow screens show only a slice of the drawing: put the prism on the left
      // third, so the spectrum has the rest of the width to fan across.
      if (st.w < 760) { st.ox = st.w * 0.3 - CX * st.s; st.oy = st.h * 0.3 - CY * st.s } // and in the upper part, above the sentence
    }

    // ---- the optics ----
    const geometry = rot => {
      const v = a => ({ x: CX + R * Math.cos(a + rot), y: CY + R * Math.sin(a + rot) })
      const A = v(-Math.PI / 2), B = v(Math.PI / 6), C = v(5 * Math.PI / 6)
      const tri = [A, B, C]
      const edges = [[A, C], [A, B], [C, B]] // left face (entry), right face, base
      const cen = { x: (A.x + B.x + C.x) / 3, y: (A.y + B.y + C.y) / 3 }
      const normals = edges.map(([P, Q]) => {
        let n = norm({ x: Q.y - P.y, y: -(Q.x - P.x) })
        const mid = { x: (P.x + Q.x) / 2, y: (P.y + Q.y) / 2 }
        if (dot(n, { x: mid.x - cen.x, y: mid.y - cen.y }) < 0) n = { x: -n.x, y: -n.y }
        return n
      })
      return { tri, edges, normals, cen }
    }

    // `theta` is the angle (radians) at which the light meets the left face, measured
    // from that face's normal. The source swings round with the prism, so turning
    // the prism sweeps the whole spectrum instead of ever leaving the light stuck
    // outside the useful range (about 49 degrees gives the classic wide fan).
    const trace = (g, theta) => {
      const N0 = g.normals[0]
      const E = { x: (g.edges[0][0].x + g.edges[0][1].x) / 2, y: (g.edges[0][0].y + g.edges[0][1].y) / 2 }
      const base = Math.atan2(-N0.y, -N0.x)         // straight into the face
      const d = { x: Math.cos(base - theta), y: Math.sin(base - theta) }
      const S = { x: E.x - d.x * 900, y: E.y - d.y * 900 }
      const out = { S, E, d, entering: dot(N0, d) < -0.02, exits: [], inner: null, refl: null }
      if (!out.entering) return out
      const cosi0 = -dot(N0, d)
      out.refl = { x: d.x - 2 * dot(d, N0) * N0.x, y: d.y - 2 * dot(d, N0) * N0.y }
      const transmit = 0.4 + 0.6 * cosi0
      for (let i = 0; i < NRAYS; i++) {
        const ray = RAYS[i]
        let dir = refract(d, N0, 1 / ray.n)
        if (!dir) continue
        let pos = E, last = 0, exit = null
        for (let b = 0; b < 4 && !exit; b++) {
          let best = null
          for (let e = 0; e < 3; e++) {
            if (e === last) continue
            const s = hitSeg(pos, dir, g.edges[e][0], g.edges[e][1])
            if (s !== null && (!best || s < best.s)) best = { s, e }
          }
          if (!best) break
          const hit = { x: pos.x + dir.x * best.s, y: pos.y + dir.y * best.s }
          const Ni = g.normals[best.e]
          if (i === Math.floor(NRAYS / 2) && b === 0) out.inner = { from: E, to: hit }
          const o = refract(dir, { x: -Ni.x, y: -Ni.y }, ray.n)
          if (o) exit = { P: hit, dir: o, theta: Math.atan2(o.y, o.x), i, a: transmit }
          else { dir = { x: dir.x - 2 * dot(dir, Ni) * Ni.x, y: dir.y - 2 * dot(dir, Ni) * Ni.y }; pos = hit; last = best.e }
        }
        if (exit) out.exits.push(exit)
      }
      return out
    }

    // ---- drawing ----
    const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`

    const render = now => {
      const t = (now - st.t0) / 1000
      // The pointer is "active" while it is over the footer (mouse) or for a few
      // seconds after a touch; otherwise the rig drifts slowly by itself.
      const active = st.pointer && (!st.touch || now - st.lastInput < 4500)
      const dt = calm ? 1 : Math.min(0.05, Math.max(0.001, (now - (st.last || now - 16)) / 1000))
      st.last = now
      let rotTarget = 0.1 * Math.sin(t * 0.31)
      let theta = 0.86 + 0.09 * Math.sin(t * 0.5)
      if (active) {
        // The pointer itself is eased, so a jump (entering the footer, a tap) is a glide.
        const kp = calm ? 1 : 1 - Math.exp(-dt * 14)
        st.sx += (st.tx - st.sx) * kp; st.sy += (st.ty - st.sy) * kp
        // Turn the prism so the spectrum leaves toward the pointer. The colours leave from
        // `off` (turned with the prism) and travel at `nominal + rot`; solve for the turn
        // that points that line at the pointer. Close to the prism the answer is unstable,
        // so inside a small zone the prism just holds its angle.
        if (Math.hypot(st.sx - CX, st.sy - CY) > 90) {
          let r = st.target
          for (let i = 0; i < 4; i++) {
            const c = Math.cos(r), sn = Math.sin(r)
            const ex = CX + st.off.x * c - st.off.y * sn, ey = CY + st.off.x * sn + st.off.y * c
            const d = Math.atan2(st.sy - ey, st.sx - ex) - st.nominal
            r = Math.atan2(Math.sin(d), Math.cos(d))
          }
          st.target = Math.max(-2.7, Math.min(2.7, r))
        }
        rotTarget = st.target
        theta = 0.86
      } else st.target = st.rot
      // Ease toward the target (independent of frame rate) with a speed limit, so even
      // a sweep across the whole range is a smooth turn.
      const k = calm ? 1 : 1 - Math.exp(-dt * 6)
      st.aimY += (theta - st.aimY) * k
      const step = (rotTarget - st.rot) * k
      const cap = calm ? 9 : 4.5 * dt
      st.rot += Math.max(-cap, Math.min(cap, step))
      st.flash *= calm ? 0 : Math.pow(0.93, dt * 60)
      if (aim.current) {
        const ax = st.ox + st.sx * st.s, ay = st.oy + st.sy * st.s
        aim.current.style.transform = `translate3d(${ax.toFixed(1)}px, ${ay.toFixed(1)}px, 0)`
        aim.current.classList.toggle('is-on', active)
      }

      const g = geometry(st.rot)
      const tr = trace(g, st.aimY)
      const I = 1 + st.flash * 1.2

      // main canvas: the dark, with a faint vignette
      ctx.setTransform(st.dpr, 0, 0, st.dpr, 0, 0)
      ctx.globalCompositeOperation = 'source-over'
      ctx.clearRect(0, 0, st.w, st.h)

      // soft layer (glow): everything wide goes here, then is scaled up onto the main canvas
      sctx.setTransform(1, 0, 0, 1, 0, 0)
      sctx.clearRect(0, 0, soft.width, soft.height)
      const sk = st.s / 4
      sctx.setTransform(sk, 0, 0, sk, st.ox / 4, st.oy / 4)
      sctx.globalCompositeOperation = 'lighter'

      // volumetric haze along the incoming beam
      {
        const { S, E } = tr
        const gr = sctx.createLinearGradient(S.x, S.y, E.x, E.y)
        gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(0.88, `rgba(255,255,255,${0.30 * I})`); gr.addColorStop(1, `rgba(255,255,255,${0.55 * I})`)
        const nx = -tr.d.y, ny = tr.d.x
        sctx.fillStyle = gr
        sctx.beginPath()
        sctx.moveTo(S.x + nx * 6, S.y + ny * 6); sctx.lineTo(E.x + nx * 12, E.y + ny * 12)
        sctx.lineTo(E.x - nx * 12, E.y - ny * 12); sctx.lineTo(S.x - nx * 6, S.y - ny * 6); sctx.closePath(); sctx.fill()
      }

      // the spectrum: a continuous fan, soft here and crisp on the main canvas below
      const ex = tr.exits
      const wedge = (c2, e, nxt, wide, alpha, scale) => {
        // a band's width is its angular gap to the next colour, kept within sane limits
        // (near total internal reflection neighbouring rays can jump apart)
        const half = Math.min(0.03, Math.max(0.004, Math.abs((nxt ? nxt.theta : e.theta) - e.theta) || 0.004)) * wide
        const col = RAYS[e.i].rgb
        const P = e.P
        const a1 = e.theta - half, a2 = e.theta + half
        const far = FAR
        const gr = c2.createLinearGradient(P.x, P.y, P.x + Math.cos(e.theta) * 900, P.y + Math.sin(e.theta) * 900)
        gr.addColorStop(0, rgba(col, Math.min(1, alpha * 1.15 * e.a * I)))
        gr.addColorStop(0.25, rgba(col, Math.min(1, alpha * 0.8 * e.a * I)))
        gr.addColorStop(1, rgba(col, 0))
        c2.fillStyle = gr
        c2.beginPath(); c2.moveTo(P.x, P.y)
        c2.lineTo(P.x + Math.cos(a1) * far * scale, P.y + Math.sin(a1) * far * scale)
        c2.lineTo(P.x + Math.cos(a2) * far * scale, P.y + Math.sin(a2) * far * scale)
        c2.closePath(); c2.fill()
      }
      ex.forEach((e, i) => wedge(sctx, e, ex[i + 1] || ex[i - 1], 1.6, 0.34, 1))

      // an anamorphic streak and bloom where the light leaves the glass
      let mx = tr.E.x, my = tr.E.y
      if (ex.length) { mx = ex.reduce((s, e) => s + e.P.x, 0) / ex.length; my = ex.reduce((s, e) => s + e.P.y, 0) / ex.length }
      const bloom = (c2, x, y, r, a) => {
        const gr = c2.createRadialGradient(x, y, 0, x, y, r)
        gr.addColorStop(0, `rgba(255,255,255,${Math.min(1, a * I)})`); gr.addColorStop(0.35, `rgba(255,255,255,${a * 0.28 * I})`); gr.addColorStop(1, 'rgba(255,255,255,0)')
        c2.fillStyle = gr; c2.beginPath(); c2.arc(x, y, r, 0, 6.2832); c2.fill()
      }
      bloom(sctx, tr.E.x, tr.E.y, 70, 0.8)
      if (ex.length) bloom(sctx, mx, my, 95, 0.85)

      // crisp pass, in drawing units (the soft layer is blurred and blended by CSS)
      ctx.globalCompositeOperation = 'lighter'
      ctx.setTransform(st.dpr * st.s, 0, 0, st.dpr * st.s, st.dpr * st.ox, st.dpr * st.oy)
      ex.forEach((e, i) => wedge(ctx, e, ex[i + 1] || ex[i - 1], 0.55, 0.28, 1))

      // the beam core, a faint reflected ray, and the beam inside the glass
      ctx.lineCap = 'round'
      ctx.shadowColor = 'rgba(255,255,255,0.9)'; ctx.shadowBlur = 16 * st.s
      const bg = ctx.createLinearGradient(tr.S.x, tr.S.y, tr.E.x, tr.E.y)
      bg.addColorStop(0, 'rgba(255,255,255,0)'); bg.addColorStop(0.7, `rgba(255,255,255,${0.7 * Math.min(1, I)})`); bg.addColorStop(1, `rgba(255,255,255,${Math.min(1, 1 * I)})`)
      ctx.strokeStyle = bg; ctx.lineWidth = 2.4
      ctx.beginPath(); ctx.moveTo(tr.S.x, tr.S.y); ctx.lineTo(tr.E.x, tr.E.y); ctx.stroke()
      ctx.shadowBlur = 0
      if (tr.entering && tr.refl) {
        const rg = ctx.createLinearGradient(tr.E.x, tr.E.y, tr.E.x + tr.refl.x * 420, tr.E.y + tr.refl.y * 420)
        rg.addColorStop(0, `rgba(255,255,255,${0.22 * I})`); rg.addColorStop(1, 'rgba(255,255,255,0)')
        ctx.strokeStyle = rg; ctx.lineWidth = 1.4
        ctx.beginPath(); ctx.moveTo(tr.E.x, tr.E.y); ctx.lineTo(tr.E.x + tr.refl.x * 420, tr.E.y + tr.refl.y * 420); ctx.stroke()
      }
      if (tr.inner) {
        ctx.strokeStyle = `rgba(255,248,235,${0.55 * Math.min(1.4, I)})`; ctx.lineWidth = 3
        ctx.shadowColor = 'rgba(255,240,220,.8)'; ctx.shadowBlur = 10 * st.s
        ctx.beginPath(); ctx.moveTo(tr.inner.from.x, tr.inner.from.y); ctx.lineTo(tr.inner.to.x, tr.inner.to.y); ctx.stroke()
        ctx.shadowBlur = 0
      }

      // the anamorphic streak at the exit
      if (ex.length) {
        const sg = ctx.createLinearGradient(mx - 330, my, mx + 330, my)
        sg.addColorStop(0, 'rgba(180,200,255,0)'); sg.addColorStop(0.5, `rgba(235,240,255,${0.34 * I})`); sg.addColorStop(1, 'rgba(255,190,170,0)')
        ctx.fillStyle = sg; ctx.fillRect(mx - 330, my - 1.3, 660, 2.6)
      }

      // the glass: a faint body, edges that catch light, and colour fringes
      ctx.globalCompositeOperation = 'lighter'
      const [A, B, C] = g.tri
      const body = ctx.createLinearGradient(A.x, A.y, B.x, B.y)
      body.addColorStop(0, 'rgba(255,255,255,0.10)'); body.addColorStop(1, 'rgba(255,255,255,0.015)')
      ctx.fillStyle = body
      ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.lineTo(C.x, C.y); ctx.closePath(); ctx.fill()
      const edge = (P, Q, a) => {
        ctx.lineWidth = 1.2
        ctx.strokeStyle = `rgba(255,70,70,${a * 0.5})`; ctx.beginPath(); ctx.moveTo(P.x - 0.9, P.y); ctx.lineTo(Q.x - 0.9, Q.y); ctx.stroke()
        ctx.strokeStyle = `rgba(80,110,255,${a * 0.5})`; ctx.beginPath(); ctx.moveTo(P.x + 0.9, P.y); ctx.lineTo(Q.x + 0.9, Q.y); ctx.stroke()
        ctx.strokeStyle = `rgba(255,255,255,${a})`; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(P.x, P.y); ctx.lineTo(Q.x, Q.y); ctx.stroke()
      }
      // faces brighten the more they face the light
      const faceA = i => Math.min(0.95, 0.35 + 0.6 * Math.max(0, -dot(g.normals[i], tr.d)) + (i === 1 ? 0.25 : 0))
      edge(A, C, faceA(0)); edge(A, B, faceA(1)); edge(C, B, 0.45)
      // a moving glint along the left face
      const gl = 0.5 + 0.5 * Math.sin(t * 0.9)
      const gx = A.x + (C.x - A.x) * gl, gy = A.y + (C.y - A.y) * gl
      bloom(ctx, gx, gy, 14, 0.35)

      // dust motes lit by the light they cross
      ctx.shadowBlur = 0
      st.motes.forEach(m => {
        if (!calm) {
          m.x += m.vx + Math.sin(t * 0.4 + m.p) * 0.05; m.y += m.vy + Math.cos(t * 0.35 + m.p) * 0.04
          if (m.x < -10) m.x = VW + 10; if (m.x > VW + 10) m.x = -10
          if (m.y < -10) m.y = VH + 10; if (m.y > VH + 10) m.y = -10
        }
        let a = 0.05, col = [255, 255, 255]
        // in the incoming beam?
        const sx = m.x - tr.S.x, sy2 = m.y - tr.S.y
        const along = sx * tr.d.x + sy2 * tr.d.y
        const across = Math.abs(sx * -tr.d.y + sy2 * tr.d.x)
        if (along > 0 && along < Math.hypot(tr.E.x - tr.S.x, tr.E.y - tr.S.y) && across < 22) a = 0.5 * (1 - across / 22)
        // in the spectrum?
        if (ex.length > 1) {
          const first = ex[0], last = ex[ex.length - 1]
          const ang = Math.atan2(m.y - my, m.x - mx)
          const lo = Math.min(first.theta, last.theta), hi = Math.max(first.theta, last.theta)
          if (m.x > mx && ang > lo && ang < hi) {
            const u = (ang - first.theta) / (last.theta - first.theta)
            const e = ex[Math.max(0, Math.min(ex.length - 1, Math.round(u * (ex.length - 1))))]
            col = RAYS[e.i].rgb; a = 0.6
          }
        }
        if (a > 0.05) { ctx.fillStyle = rgba(col, Math.min(1, a * I)); ctx.beginPath(); ctx.arc(m.x, m.y, m.r * 1.2, 0, 6.2832); ctx.fill() }
        else { ctx.fillStyle = 'rgba(255,255,255,0.05)'; ctx.beginPath(); ctx.arc(m.x, m.y, m.r, 0, 6.2832); ctx.fill() }
      })
    }

    // ---- loop and input ----
    const frame = now => { render(now); st.raf = requestAnimationFrame(frame) }
    const start = () => { if (!st.raf && st.visible && !calm) st.raf = requestAnimationFrame(frame) }
    const stop = () => { cancelAnimationFrame(st.raf); st.raf = 0 }
    const still = () => { if (calm) render(performance.now()) } // reduced motion: draw on input only

    const mark = () => { st.lastInput = performance.now(); stage.classList.add('is-used') }
    const aimAt = e => {
      const r = stage.getBoundingClientRect()
      st.tx = (e.clientX - r.left - st.ox) / st.s
      st.ty = (e.clientY - r.top - st.oy) / st.s
      if (!st.pointer) { st.sx = st.tx; st.sy = st.ty }
      st.pointer = true; st.touch = e.pointerType === 'touch'; mark()
      still()
    }
    const down = e => { aimAt(e); st.flash = 1 }
    const leave = () => { st.pointer = false }

    // The direction the spectrum leaves in when the prism is not turned (measured once).
    {
      const rest = trace(geometry(0), 0.86).exits
      if (rest.length) {
        st.nominal = rest.reduce((a, e) => a + e.theta, 0) / rest.length
        st.off = { x: rest.reduce((a, e) => a + e.P.x, 0) / rest.length - CX, y: rest.reduce((a, e) => a + e.P.y, 0) / rest.length - CY }
      }
    }

    size(); render(performance.now())
    const ro = new ResizeObserver(() => { size(); render(performance.now()) })
    ro.observe(stage)
    const zone = stage.parentElement // the whole footer scene: pointer events over its text count too
    const io = new IntersectionObserver(([e]) => { st.visible = e.isIntersecting; if (st.visible) start(); else stop() }, { threshold: 0.05 })
    io.observe(stage)
    zone.addEventListener('pointerdown', down)
    zone.addEventListener('pointermove', aimAt)
    zone.addEventListener('pointerleave', leave)
    zone.addEventListener('pointercancel', leave)
    return () => {
      stop(); ro.disconnect(); io.disconnect()
      zone.removeEventListener('pointerdown', down); zone.removeEventListener('pointermove', aimAt)
      zone.removeEventListener('pointerleave', leave); zone.removeEventListener('pointercancel', leave)
    }
  }, [])

  return (
    <section className="fp" aria-labelledby="fp-line">
      <div className="fp-stage" ref={stageRef} aria-hidden="true">
        <canvas className="fp-soft" ref={softRef} />
        <canvas className="fp-canvas" ref={mainRef} />
        <span className="fp-grain" />
        <span className="fp-aim" ref={aim} />
        <span className="fp-hint">
          <span className="fp-hint-fine"><b>Move your cursor</b>The spectrum aims where you point: white light, split into the colours it is made of.</span>
          <span className="fp-hint-touch"><b>Tap or drag</b>The spectrum aims where you touch: white light, split into the colours it is made of.</span>
        </span>
      </div>

      <div className="fp-text">
        <p className="fp-line" id="fp-line">Photography is writing with light.</p>
        <Link className="fp-link" to="/contact">Get in touch <span aria-hidden="true">&rarr;</span></Link>
      </div>
    </section>
  )
}
