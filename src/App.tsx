import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/mirror" element={<div>Mirror (Coming Soon)</div>} />
      </Routes>
    </div>
  );
}

function HomePage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary-900 mb-4">
          MARBA.ai
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Marketing Intelligence Platform
        </p>
        <div className="space-y-2 text-sm text-gray-500">
          <p>✓ Foundation Setup Complete</p>
          <p>✓ Build System Ready</p>
          <p>⏳ Building Core Features...</p>
        </div>
      </div>
    </div>
  );
}

export default App;
