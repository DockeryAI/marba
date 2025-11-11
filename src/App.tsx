import { Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { MirrorPage } from './pages/MirrorPage'

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/mirror" element={<MirrorPage />} />
      </Routes>
    </div>
  )
}

export default App
