import './Blog.css'

const posts = [
  {
    date: "Jan 2025",
    title: "Why Design Education Needs VR — Now",
    tag: "Education",
    desc: "A reflection on three years of immersive classroom experiments and what we've learned about embodied learning in design studios.",
  },
  {
    date: "Oct 2024",
    title: "Heritage as a Design Problem",
    tag: "Research",
    desc: "Preserving the Qutb Shahi monuments raised questions I hadn't expected about authorship, fidelity, and what it means to keep something alive.",
  },
  {
    date: "Jun 2024",
    title: "The Brief is the Design",
    tag: "Practice",
    desc: "After years of studying how design briefs evolve in professional practice, I've come to believe that the way we frame problems is itself a design act.",
  },
  {
    date: "Feb 2024",
    title: "Photographing to Think",
    tag: "Photography",
    desc: "Photography was my first design education. How the discipline of the frame taught me more about composition, light, and observation than any formal course.",
  },
  {
    date: "Nov 2023",
    title: "Drones, Interiors, and the Future Passenger",
    tag: "Research",
    desc: "Urban air mobility is coming. What will it feel like inside? Notes from our ongoing study into passenger comfort in autonomous aerial vehicles.",
  },
]

export default function Blog() {
  return (
    <div className="blog-page">
      <header className="blog-header">
        <p className="blog-eyebrow">Thoughts & Writing</p>
        <h1 className="blog-heading">Blog</h1>
        <p className="blog-sub">Notes on design, research, and education.</p>
      </header>

      <div className="blog-list">
        {posts.map((p, i) => (
          <article key={i} className="blog-post">
            <div className="blog-post-left">
              <span className="blog-date">{p.date}</span>
              <span className="blog-tag">{p.tag}</span>
            </div>
            <div className="blog-post-right">
              <h2 className="blog-title">{p.title}</h2>
              <p className="blog-desc">{p.desc}</p>
              <span className="blog-read">Read more →</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}