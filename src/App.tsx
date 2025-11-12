import { Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { MirrorPage } from './pages/MirrorPage'
import { AdminPage } from './pages/AdminPage'

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/mirror" element={<MirrorPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </div>
  )
}

export default App
