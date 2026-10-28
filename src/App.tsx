import { useState } from 'react'
import './App.css'
import { ConvexLensLesson } from './features/lens/ConvexLensLesson'
import { RampExperiment } from './features/ramp/RampExperiment'

export type ActiveLessonId = 'convex-lens' | 'inclined-ramp'

function App() {
  const [activeLesson, setActiveLesson] = useState<ActiveLessonId>('convex-lens')
  const [lensStartSpread, setLensStartSpread] = useState<number>(2)
  const [rampStartSpread, setRampStartSpread] = useState<number>(2)
  const [navKey, setNavKey] = useState<number>(0)

  function handleOpenContents() {
    setActiveLesson('convex-lens')
    setLensStartSpread(1)
    setNavKey((k) => k + 1)
  }

  function handleOpenLensLesson() {
    setActiveLesson('convex-lens')
    setLensStartSpread(2)
    setNavKey((k) => k + 1)
  }

  function handleOpenRampLesson() {
    setActiveLesson('inclined-ramp')
    setRampStartSpread(2)
    setNavKey((k) => k + 1)
  }

  return (
    <div className="platform-shell">
      {/* Top Reusable Platform Navigation & Provisional Branding Header */}
      <header className="platform-topbar">
        <div className="platform-brand-group">
          <span className="platform-brand-title">
            CBSE Interactive Lab · Illustrated Science Notebook
          </span>
          <span className="platform-provisional-badge">
            Provisional Prototype — Educator &amp; Curriculum Review Pending
          </span>
        </div>

        <nav className="platform-lesson-switcher" aria-label="Book contents and lesson navigation">
          <button
            type="button"
            className={`platform-lesson-btn ${
              activeLesson === 'convex-lens' && lensStartSpread === 1 ? 'is-active' : ''
            }`}
            onClick={handleOpenContents}
          >
            Book Contents
          </button>
          <button
            type="button"
            className={`platform-lesson-btn ${
              activeLesson === 'convex-lens' && lensStartSpread === 2 ? 'is-active' : ''
            }`}
            aria-pressed={activeLesson === 'convex-lens' && lensStartSpread === 2}
            onClick={handleOpenLensLesson}
          >
            Lesson II: How a convex lens forms an image.
          </button>
          <button
            type="button"
            className={`platform-lesson-btn ${
              activeLesson === 'inclined-ramp' ? 'is-active' : ''
            }`}
            aria-pressed={activeLesson === 'inclined-ramp'}
            onClick={handleOpenRampLesson}
          >
            Lesson I: Why does a ramp make lifting easier?
          </button>
        </nav>
      </header>

      {/* Active Lesson Content */}
      <div className="platform-content-area">
        {activeLesson === 'convex-lens' ? (
          <ConvexLensLesson
            key={`lens-${navKey}`}
            initialSpreadIndex={lensStartSpread}
            onOpenRampLesson={handleOpenRampLesson}
          />
        ) : (
          <RampExperiment
            key={`ramp-${navKey}`}
            initialSpreadIndex={rampStartSpread}
            onOpenLensLesson={handleOpenLensLesson}
          />
        )}
      </div>
    </div>
  )
}

export default App
