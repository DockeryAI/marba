import { Routes, Route } from 'react-router-dom'
import { ErrorBoundary } from './components/common/ErrorBoundary'
import { BrandProvider } from './contexts/BrandContext'
import { MirrorProvider } from './contexts/MirrorContext'
import { HomePage } from './pages/HomePage'
import { OnboardingPage } from './pages/OnboardingPage'
import { MirrorPage } from './pages/MirrorPage'
import { AdminPage } from './pages/AdminPage'
import { ContentCalendarPage } from './pages/ContentCalendarPage'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { IntelligencePage } from './pages/IntelligencePage'
import { DesignStudioPage } from './pages/DesignStudioPage'

function App() {
  return (
    <ErrorBoundary>
      <BrandProvider>
        <MirrorProvider>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/mirror" element={<MirrorPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/content-calendar" element={<ContentCalendarPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/intelligence" element={<IntelligencePage />} />
              <Route path="/design-studio" element={<DesignStudioPage />} />
              <Route path="/design-studio/:contentId" element={<DesignStudioPage />} />
            </Routes>
          </div>
        </MirrorProvider>
      </BrandProvider>
    </ErrorBoundary>
  )
}

export default App
