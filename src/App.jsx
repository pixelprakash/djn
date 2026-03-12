import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import FloatingNav from "./components/FloatingNav"
import "./App.css"

import About   from "./pages/About"
import Work    from "./pages/Work"
import ProjectDetail from './pages/ProjectDetail'
import Resume  from "./pages/Resume"
import Lab     from "./pages/Lab"
import Blog    from "./pages/Blog"
import Contact from "./pages/Contact"

function App() {
  return (
    <BrowserRouter>
      <FloatingNav />
      <Routes>
        {/* Default page → About */}
        <Route path="/"        element={<Navigate to="/about" replace />} />
        <Route path="/about"   element={<About />} />
        <Route path="/work"    element={<Work />} />
        <Route path="/work/:slug" element={<ProjectDetail />} />
        <Route path="/resume"  element={<Resume />} />
        <Route path="/lab"     element={<Lab />} />
        <Route path="/blog"    element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App