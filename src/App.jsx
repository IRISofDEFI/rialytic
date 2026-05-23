import { BrowserRouter, Routes, Route } from 'react-router-dom'

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
      <Routes>
        <Route path="/" element={<PlaceholderPage name="Home" />} />
        <Route path="/calc" element={<PlaceholderPage name="Margin Calculator" />} />
        <Route path="/sfs" element={<PlaceholderPage name="SfS Planner" />} />
      </Routes>
    </BrowserRouter>
  )
}
