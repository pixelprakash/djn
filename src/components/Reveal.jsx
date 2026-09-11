import { useInView } from '../hooks/useInView'

/* Fades + lifts its content in the first time it scrolls into view.

   Renders the element itself (via `as`) rather than adding a wrapper, so
   `:last-child` / grid / flex layout on the target class keep working:

     <Reveal as="section" className="r-section"> … </Reveal>
     <Reveal as="a" className="bl-card" delay={0.05}> … </Reveal>

   Visual styling lives in the global `.reveal` / `.reveal--in` rules. */
export default function Reveal({ as: Tag = 'div', delay, className, children, ...rest }) {
  const [ref, inView] = useInView()
  const cls = ['reveal', inView ? 'reveal--in' : '', className].filter(Boolean).join(' ')

  return (
    <Tag
      ref={ref}
      className={cls}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  )
}
