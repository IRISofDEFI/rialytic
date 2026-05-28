import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import MarginCalc from './pages/MarginCalc.jsx'
import SfSPlanner from './pages/SfSPlanner.jsx'

function PlaceholderPage({ name }) {
  return (
    <div style={{ padding: '40px', color: 'var(--text)' }}>
      <h1 style={{ fontWeight: 600 }}>{name}</h1>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main style={{ paddingTop: '56px', flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calc" element={<MarginCalc />} />
          <Route path="/sfs" element={<SfSPlanner />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}
