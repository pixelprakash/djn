import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import FloatingNav from './components/FloatingNav'
import './App.css'

import Work    from './pages/Work'
import About   from './pages/About'
import Lab     from './pages/Lab'
import Contact from './pages/Contact'
import Blog    from './pages/Blog'
import Resume  from './pages/Resume'

function App() {
  return (
    <BrowserRouter>
      <FloatingNav />
      <Routes>
        <Route path="/"        element={<Navigate to="/work" replace />} />
        <Route path="/work"    element={<Work />} />
        <Route path="/about"   element={<About />} />
        <Route path="/lab"     element={<Lab />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog"    element={<Blog />} />
        <Route path="/resume"  element={<Resume />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App