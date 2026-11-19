import { lazy, Suspense, useEffect, useState, type ComponentType } from 'react'
import './App.css'
import {
  resolveStandaloneRoute,
  STANDALONE_ROUTES,
  type StandaloneRouteId,
} from './platform/routeRegistry'
import { RelatedNotebooksBar } from './notebook/RelatedNotebooksBar'
import { WorkbenchLabRecordSection } from './notebook/WorkbenchLabRecordSheet'

/*
 * Every lesson is lazy-loaded into its own chunk (Phase 0 performance budget).
 * The 3D book lessons pull in three.js, so they are only fetched on "/".
 */
const ConvexLensLesson = lazy(() =>
  import('./features/lens/ConvexLensLesson').then((m) => ({ default: m.ConvexLensLesson }))
)
const RampExperiment = lazy(() =>
  import('./features/ramp/RampExperiment').then((m) => ({ default: m.RampExperiment }))
)

const STANDALONE_COMPONENTS: Record<StandaloneRouteId, ComponentType> = {
  learn: lazy(() => import('./concepts/ConceptHub').then((m) => ({ default: m.ConceptHub }))),
  revision: lazy(() =>
    import('./notebook/RevisionWorkbookPage').then((m) => ({
      default: m.RevisionWorkbookPage,
    }))
  ),
  alternative: lazy(() =>
    import('./features/lens/AlternativeConvexLensLesson').then((m) => ({
      default: m.AlternativeConvexLensLesson,
    }))
  ),
  electricity: lazy(() =>
    import('./features/electricity/ElectricityLesson').then((m) => ({ default: m.ElectricityLesson }))
  ),
  'series-parallel': lazy(() =>
    import('./features/seriesParallel/SeriesParallelLesson').then((m) => ({
      default: m.SeriesParallelLesson,
    }))
  ),
  resistivity: lazy(() =>
    import('./features/resistivity/ResistivityLesson').then((m) => ({ default: m.ResistivityLesson }))
  ),
  'power-heating': lazy(() =>
    import('./features/powerHeating/PowerHeatingLesson').then((m) => ({ default: m.PowerHeatingLesson }))
  ),
  billing: lazy(() =>
    import('./features/billing/BillingLesson').then((m) => ({ default: m.BillingLesson }))
  ),
  safety: lazy(() =>
    import('./features/safety/SafetyLesson').then((m) => ({ default: m.SafetyLesson }))
  ),
}

export type ActiveLessonId = 'convex-lens' | 'inclined-ramp'

function currentPathname(): string {
  return typeof window !== 'undefined' ? window.location.pathname : '/'
}

function LoadingFallback() {
  return (
    <div className="platform-loading" role="status" aria-live="polite">
      Loading lesson… / पाठ लोड हो रहा है…
    </div>
  )
}

function App() {
  const [pathname, setPathname] = useState<string>(currentPathname)
  const [activeLesson, setActiveLesson] = useState<ActiveLessonId>('convex-lens')
  const [lensStartSpread, setLensStartSpread] = useState<number>(2)
  const [rampStartSpread, setRampStartSpread] = useState<number>(2)
  const [navKey, setNavKey] = useState<number>(0)

  const standalone = resolveStandaloneRoute(pathname)
  const isBook = standalone === null

  useEffect(() => {
    function handlePopState() {
      setPathname(window.location.pathname)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  function navigateTo(nextPath: string) {
    if (typeof window !== 'undefined' && window.location.pathname !== nextPath) {
      window.history.pushState({}, '', nextPath)
    }
    setPathname(nextPath)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  function openBook(lesson: ActiveLessonId, spread: number) {
    navigateTo('/book')
    setActiveLesson(lesson)
    if (lesson === 'convex-lens') setLensStartSpread(spread)
    else setRampStartSpread(spread)
    setNavKey((k) => k + 1)
  }

  const handleOpenLensLesson = () => openBook('convex-lens', 2)
  const handleOpenRampLesson = () => openBook('inclined-ramp', 2)

  const StandaloneComponent = standalone ? STANDALONE_COMPONENTS[standalone.id] : null
  const isDioptreRoute = pathname.startsWith('/learn/lens-power-dioptre')

  return (
    <div className="platform-shell">
      {/* Unified Illustrated Science Notebook Top Bar */}
      <header className="platform-topbar no-print">
        <div className="platform-brand-group">
          <span className="platform-brand-title">
            CBSE Interactive Lab · Illustrated Science Notebook
          </span>
          <span className="platform-provisional-badge">
            Class 9 &amp; 10 Interactive Science
          </span>
        </div>

        <nav className="platform-lesson-switcher" aria-label="Science notebook navigation">
          {/* Primary Notebook Hub */}
          <button
            type="button"
            className={`platform-lesson-btn ${
              standalone?.id === 'learn' && !isDioptreRoute ? 'is-active' : ''
            }`}
            aria-pressed={standalone?.id === 'learn' && !isDioptreRoute}
            onClick={() => navigateTo('/learn')}
          >
            Notebook Shelf (36 Labs)
          </button>

          {/* Flagship Optics Notebook Shortcut */}
          <button
            type="button"
            className={`platform-lesson-btn ${isDioptreRoute ? 'is-active' : ''}`}
            aria-pressed={isDioptreRoute}
            onClick={() => navigateTo('/learn/lens-power-dioptre')}
          >
            Optics: Power &amp; Dioptre
          </button>

          {/* Standalone Chapter Workbenches */}
          {STANDALONE_ROUTES.filter((r) => r.id !== 'learn').map((route) => {
            const active = standalone?.id === route.id
            return (
              <button
                key={route.id}
                type="button"
                className={`platform-lesson-btn ${active ? 'is-active' : ''}`}
                aria-pressed={active}
                onClick={() => navigateTo(route.path)}
              >
                {route.navLabel}
              </button>
            )
          })}

          {/* 3D Book Views */}
          <button
            type="button"
            className={`platform-lesson-btn ${
              isBook && activeLesson === 'convex-lens' && lensStartSpread === 1 ? 'is-active' : ''
            }`}
            onClick={() => openBook('convex-lens', 1)}
          >
            3D Book Contents
          </button>
          <button
            type="button"
            className={`platform-lesson-btn ${
              isBook && activeLesson === 'convex-lens' && lensStartSpread === 2 ? 'is-active' : ''
            }`}
            aria-pressed={isBook && activeLesson === 'convex-lens' && lensStartSpread === 2}
            onClick={handleOpenLensLesson}
          >
            3D Lens Book
          </button>
          <button
            type="button"
            className={`platform-lesson-btn ${
              isBook && activeLesson === 'inclined-ramp' ? 'is-active' : ''
            }`}
            aria-pressed={isBook && activeLesson === 'inclined-ramp'}
            onClick={handleOpenRampLesson}
          >
            3D Ramp Book
          </button>
        </nav>
      </header>

      {/* Active Lesson Content */}
      <div className="platform-content-area">
        <Suspense fallback={<LoadingFallback />}>
          {StandaloneComponent && standalone ? (
            <>
              <RelatedNotebooksBar
                routeId={standalone.id}
                onOpenConcept={(conceptPath) => navigateTo(conceptPath)}
              />
              <WorkbenchLabRecordSection routeId={standalone.id} />
              <StandaloneComponent />
            </>
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
        </Suspense>
      </div>
    </div>
  )
}

export default App
