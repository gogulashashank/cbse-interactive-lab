import { useEffect, useState } from 'react'
import './App.css'
import { AlternativeConvexLensLesson } from './features/lens/AlternativeConvexLensLesson'
import { ElectricityLesson } from './features/electricity/ElectricityLesson'
import { SeriesParallelLesson } from './features/seriesParallel/SeriesParallelLesson'
import { ResistivityLesson } from './features/resistivity/ResistivityLesson'
import { PowerHeatingLesson } from './features/powerHeating/PowerHeatingLesson'
import { ConvexLensLesson } from './features/lens/ConvexLensLesson'
import { RampExperiment } from './features/ramp/RampExperiment'

export type ActiveLessonId = 'convex-lens' | 'inclined-ramp'
export type AppRoutePath =
  | '/'
  | '/alternative'
  | '/electricity'
  | '/series-parallel'
  | '/resistivity'
  | '/power-heating'
  | '/heating'

function resolveRouteFromPathname(pathname: string): AppRoutePath {
  const normalized = pathname.replace(/\/+$/, '') || '/'
  if (normalized === '/alternative') return '/alternative'
  if (normalized === '/electricity') return '/electricity'
  if (normalized === '/series-parallel') return '/series-parallel'
  if (normalized === '/resistivity') return '/resistivity'
  if (normalized === '/power-heating' || normalized === '/heating') return '/power-heating'
  return '/'
}

function App() {
  const [routePath, setRoutePath] = useState<AppRoutePath>(() =>
    typeof window !== 'undefined'
      ? resolveRouteFromPathname(window.location.pathname)
      : '/'
  )
  const [activeLesson, setActiveLesson] = useState<ActiveLessonId>('convex-lens')
  const [lensStartSpread, setLensStartSpread] = useState<number>(2)
  const [rampStartSpread, setRampStartSpread] = useState<number>(2)
  const [navKey, setNavKey] = useState<number>(0)

  useEffect(() => {
    function handlePopState() {
      setRoutePath(resolveRouteFromPathname(window.location.pathname))
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  function navigateToRoute(nextRoute: AppRoutePath) {
    if (typeof window !== 'undefined' && window.location.pathname !== nextRoute) {
      window.history.pushState({}, '', nextRoute)
    }
    setRoutePath(nextRoute)
  }

  function handleOpenContents() {
    navigateToRoute('/')
    setActiveLesson('convex-lens')
    setLensStartSpread(1)
    setNavKey((k) => k + 1)
  }

  function handleOpenLensLesson() {
    navigateToRoute('/')
    setActiveLesson('convex-lens')
    setLensStartSpread(2)
    setNavKey((k) => k + 1)
  }

  function handleOpenRampLesson() {
    navigateToRoute('/')
    setActiveLesson('inclined-ramp')
    setRampStartSpread(2)
    setNavKey((k) => k + 1)
  }

  function handleOpenAlternativeLesson() {
    navigateToRoute('/alternative')
  }

  function handleOpenElectricityLesson() {
    navigateToRoute('/electricity')
  }

  function handleOpenSeriesParallelLesson() {
    navigateToRoute('/series-parallel')
  }

  function handleOpenResistivityLesson() {
    navigateToRoute('/resistivity')
  }

  function handleOpenPowerHeatingLesson() {
    navigateToRoute('/power-heating')
  }

  return (
    <div className="platform-shell">
      {/* Top Reusable Platform Navigation & Provisional Branding Header */}
      <header className="platform-topbar no-print">
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
              routePath === '/' && activeLesson === 'convex-lens' && lensStartSpread === 1
                ? 'is-active'
                : ''
            }`}
            onClick={handleOpenContents}
          >
            Book Contents
          </button>
          <button
            type="button"
            className={`platform-lesson-btn ${
              routePath === '/' && activeLesson === 'convex-lens' && lensStartSpread === 2
                ? 'is-active'
                : ''
            }`}
            aria-pressed={
              routePath === '/' && activeLesson === 'convex-lens' && lensStartSpread === 2
            }
            onClick={handleOpenLensLesson}
          >
            Lesson II: How a convex lens forms an image.
          </button>
          <button
            type="button"
            className={`platform-lesson-btn ${
              routePath === '/alternative' ? 'is-active' : ''
            }`}
            aria-pressed={routePath === '/alternative'}
            onClick={handleOpenAlternativeLesson}
          >
            Lesson II (/alternative): Reading &amp; Immersive Bench
          </button>
          <button
            type="button"
            className={`platform-lesson-btn ${
              routePath === '/electricity' ? 'is-active' : ''
            }`}
            aria-pressed={routePath === '/electricity'}
            onClick={handleOpenElectricityLesson}
          >
            Electricity: What makes current change?
          </button>
          <button
            type="button"
            className={`platform-lesson-btn ${
              routePath === '/series-parallel' ? 'is-active' : ''
            }`}
            aria-pressed={routePath === '/series-parallel'}
            onClick={handleOpenSeriesParallelLesson}
          >
            Series &amp; Parallel: One Path or Two?
          </button>
          <button
            type="button"
            className={`platform-lesson-btn ${
              routePath === '/resistivity' ? 'is-active' : ''
            }`}
            aria-pressed={routePath === '/resistivity'}
            onClick={handleOpenResistivityLesson}
          >
            Resistivity: Why Do Wires Differ?
          </button>
          <button
            type="button"
            className={`platform-lesson-btn ${
              routePath === '/power-heating' || routePath === '/heating' ? 'is-active' : ''
            }`}
            aria-pressed={routePath === '/power-heating' || routePath === '/heating'}
            onClick={handleOpenPowerHeatingLesson}
          >
            Power &amp; Heating: Where Does Energy Go?
          </button>
          <button
            type="button"
            className={`platform-lesson-btn ${
              routePath === '/' && activeLesson === 'inclined-ramp' ? 'is-active' : ''
            }`}
            aria-pressed={routePath === '/' && activeLesson === 'inclined-ramp'}
            onClick={handleOpenRampLesson}
          >
            Lesson I: Why does a ramp make lifting easier?
          </button>
        </nav>
      </header>

      {/* Active Lesson Content */}
      <div className="platform-content-area">
        {routePath === '/power-heating' || routePath === '/heating' ? (
          <PowerHeatingLesson />
        ) : routePath === '/resistivity' ? (
          <ResistivityLesson />
        ) : routePath === '/series-parallel' ? (
          <SeriesParallelLesson />
        ) : routePath === '/electricity' ? (
          <ElectricityLesson />
        ) : routePath === '/alternative' ? (
          <AlternativeConvexLensLesson />
        ) : activeLesson === 'convex-lens' ? (
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
