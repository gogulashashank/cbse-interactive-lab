import { useState } from 'react'
import {
  calculateConvexLens,
  type ConvexLensInput,
  type LensObjectRegime,
} from './convexLensModel'
import {
  createDraftsFromLensInput,
  formatLensNumber,
  formatSignedCm,
  INITIAL_LENS_INPUT,
  LENS_UI_LIMITS,
  NCERT_CONVEX_LENS_PRESETS,
  parseLensNumericDraft,
  validateLensDrafts,
  type LensInputDrafts,
} from './lensInputValidation'
import { LensRayDiagramSVG } from './LensRayDiagramSVG'
import { LensBookScene3D } from './LensBookScene3D'
import { useReducedMotionPreference } from '../platform/reducedMotion'

export type LensPresentationView = 'book' | '2d'
export type LensSurfaceTab = 'spread' | 'study'

export interface ConvexLensLessonProps {
  initialSpreadIndex?: number
  onOpenRampLesson?: () => void
}

const PRACTICE_TITLES = [
  '1. Real Image v',
  '2. Inside Focus F₁',
  '3. Optical Power P',
  '4. Slide Projector',
  '5. Half-Covered Lens',
] as const

export function ConvexLensLesson({
  initialSpreadIndex = 2,
  onOpenRampLesson,
}: ConvexLensLessonProps = {}) {
  // Book-first is the default lens presentation; '2d' is the Precision 2D / accessible view
  const [viewMode, setViewMode] = useState<LensPresentationView>('book')
  const [surfaceTab, setSurfaceTab] = useState<LensSurfaceTab>('spread')
  const [webglUnavailable, setWebglUnavailable] = useState<boolean>(false)
  const [spreadIndex, setSpreadIndex] = useState<number>(initialSpreadIndex)
  const [stillMode, setStillMode] = useReducedMotionPreference()

  // Single source of truth for lens experiment state (shared across Book View, 2D View & Study View)
  const [drafts, setDrafts] = useState<LensInputDrafts>(() =>
    createDraftsFromLensInput(INITIAL_LENS_INPUT)
  )
  const [lastValidInput, setLastValidInput] =
    useState<ConvexLensInput>(INITIAL_LENS_INPUT)

  // Shared prediction & explanation state on the learning surface
  const [predictionOption, setPredictionOption] = useState<0 | 1 | 2 | null>(null)
  const [predictionTested, setPredictionTested] = useState<boolean>(false)
  const [flapOpen, setFlapOpen] = useState<boolean>(true)
  const [visitedRegimes, setVisitedRegimes] = useState<Record<LensObjectRegime, boolean>>({
    beyond_2f: false,
    at_2f: true,
    between_f_and_2f: false,
    at_f: false,
    within_f: false,
  })

  // Secondary study view: one practice question at a time (0..4)
  const [activePracticeIndex, setActivePracticeIndex] = useState<number>(0)
  const [calcQ1Draft, setCalcQ1Draft] = useState<string>('')
  const [calcQ1Checked, setCalcQ1Checked] = useState<boolean>(false)
  const [calcQ2Option, setCalcQ2Option] = useState<0 | 1 | 2 | null>(null)
  const [calcQ3Draft, setCalcQ3Draft] = useState<string>('')
  const [calcQ3Checked, setCalcQ3Checked] = useState<boolean>(false)
  const [appQ1Option, setAppQ1Option] = useState<0 | 1 | 2 | null>(null)
  const [appQ2Option, setAppQ2Option] = useState<0 | 1 | 2 | null>(null)

  const validation = validateLensDrafts(drafts)
  const activeResult = validation.isValid
    ? calculateConvexLens(validation.parsedInput)
    : calculateConvexLens(lastValidInput)

  const effectiveViewMode: LensPresentationView = webglUnavailable ? '2d' : viewMode
  const targetInsideFCm = Number((activeResult.fCm * 0.6).toFixed(1))

  function recordRegimeVisit(input: ConvexLensInput) {
    const res = calculateConvexLens(input)
    setVisitedRegimes((prev) =>
      prev[res.regime] ? prev : { ...prev, [res.regime]: true }
    )
  }

  function handleDraftChange(field: keyof LensInputDrafts, value: string) {
    const nextDrafts: LensInputDrafts = {
      ...drafts,
      [field]: value,
    }
    setDrafts(nextDrafts)

    const nextValidation = validateLensDrafts(nextDrafts)
    if (nextValidation.isValid) {
      setLastValidInput(nextValidation.parsedInput)
      recordRegimeVisit(nextValidation.parsedInput)
    }
  }

  function applyLensInput(nextInput: ConvexLensInput) {
    setDrafts(createDraftsFromLensInput(nextInput))
    setLastValidInput(nextInput)
    recordRegimeVisit(nextInput)
  }

  function handlePresetClick(factorOfF: number) {
    const f = lastValidInput.focalLengthCm
    const nextObjDist = Number((f * factorOfF).toFixed(1))
    const tempRes = calculateConvexLens({
      ...lastValidInput,
      objectDistanceCm: nextObjDist,
    })
    const nextScreen =
      tempRes.canCatchOnScreen && tempRes.vCm !== null
        ? Math.min(
            LENS_UI_LIMITS.screenDistanceCm.max,
            Math.max(LENS_UI_LIMITS.screenDistanceCm.min, Number(tempRes.vCm.toFixed(1)))
          )
        : lastValidInput.screenDistanceCm

    applyLensInput({
      ...lastValidInput,
      objectDistanceCm: nextObjDist,
      screenDistanceCm: nextScreen,
    })
  }

  function handleTestPrediction() {
    setPredictionTested(true)
    setFlapOpen(true)
    setSpreadIndex(2)
    handlePresetClick(0.6)
  }

  function handleSnapScreenToImage() {
    if (!activeResult.canCatchOnScreen || activeResult.vCm === null) return
    const snappedScreen = Math.max(
      LENS_UI_LIMITS.screenDistanceCm.min,
      Math.min(
        LENS_UI_LIMITS.screenDistanceCm.max,
        Number(activeResult.vCm.toFixed(1))
      )
    )
    applyLensInput({
      ...lastValidInput,
      screenDistanceCm: snappedScreen,
    })
  }

  function handleResetExperiment() {
    setDrafts(createDraftsFromLensInput(INITIAL_LENS_INPUT))
    setLastValidInput(INITIAL_LENS_INPUT)
  }

  function handleOpenStudyView() {
    setSurfaceTab('study')
  }

  function handleLoadPracticeOnBench(nextInput: ConvexLensInput) {
    applyLensInput(nextInput)
    setSurfaceTab('spread')
    setSpreadIndex(2)
  }

  // Synchronised slider values
  const parsedObjDist = parseLensNumericDraft(drafts.objectDistanceCm)
  const sliderObjDist =
    parsedObjDist !== null &&
    parsedObjDist >= LENS_UI_LIMITS.objectDistanceCm.min &&
    parsedObjDist <= LENS_UI_LIMITS.objectDistanceCm.max
      ? parsedObjDist
      : lastValidInput.objectDistanceCm

  const parsedFocal = parseLensNumericDraft(drafts.focalLengthCm)
  const sliderFocal =
    parsedFocal !== null &&
    parsedFocal >= LENS_UI_LIMITS.focalLengthCm.min &&
    parsedFocal <= LENS_UI_LIMITS.focalLengthCm.max
      ? parsedFocal
      : lastValidInput.focalLengthCm

  const parsedHeight = parseLensNumericDraft(drafts.objectHeightCm)
  const sliderHeight =
    parsedHeight !== null &&
    parsedHeight >= LENS_UI_LIMITS.objectHeightCm.min &&
    parsedHeight <= LENS_UI_LIMITS.objectHeightCm.max
      ? parsedHeight
      : lastValidInput.objectHeightCm

  const parsedScreen = parseLensNumericDraft(drafts.screenDistanceCm)
  const sliderScreen =
    parsedScreen !== null &&
    parsedScreen >= LENS_UI_LIMITS.screenDistanceCm.min &&
    parsedScreen <= LENS_UI_LIMITS.screenDistanceCm.max
      ? parsedScreen
      : lastValidInput.screenDistanceCm

  // Dynamic explanation heading matching real, virtual, and focal-boundary results
  const explanationHeading = activeResult.canCatchOnScreen
    ? 'Why a Real Image Forms on the Screen (|u| > f)'
    : activeResult.isAtFocus
      ? 'Why Parallel Rays Form an Image at Infinity (|u| = f)'
      : 'Why a Virtual Image Forms Behind the Candle (|u| < f)'

  // Evaluate practice checks
  const q1Val = parseLensNumericDraft(calcQ1Draft)
  const isQ1Correct = q1Val !== null && Math.abs(q1Val - 60) <= 0.5
  const isQ2Correct = calcQ2Option === 1
  const q3Val = parseLensNumericDraft(calcQ3Draft)
  const isQ3Correct = q3Val !== null && Math.abs(q3Val - 5) <= 0.1
  const isApp1Correct = appQ1Option === 1
  const isApp2Correct = appQ2Option === 2

  return (
    <main className="lens-lesson-page">
      {/* 1. COMPACT ENTRY, VIEW SWITCHER & SECONDARY STUDY VIEW BAR */}
      <section className="lens-book-nav-bar" aria-label="Book navigation and view controls">
        <div className="lens-nav-left">
          <button
            type="button"
            className={`lens-pill-btn ${
              surfaceTab === 'spread' && effectiveViewMode === 'book' && spreadIndex === 1
                ? 'is-selected'
                : ''
            }`}
            aria-pressed={
              surfaceTab === 'spread' && effectiveViewMode === 'book' && spreadIndex === 1
            }
            onClick={() => {
              setSurfaceTab('spread')
              setViewMode('book')
              setSpreadIndex(1)
            }}
          >
            ‹ Book Contents
          </button>
          <button
            type="button"
            className={`lens-pill-btn ${
              surfaceTab === 'spread' && effectiveViewMode === 'book' && spreadIndex === 2
                ? 'is-selected'
                : ''
            }`}
            aria-pressed={
              surfaceTab === 'spread' && effectiveViewMode === 'book' && spreadIndex === 2
            }
            onClick={() => {
              setSurfaceTab('spread')
              setViewMode('book')
              setSpreadIndex(2)
            }}
          >
            Lesson II Spread (3D Book)
          </button>
          <button
            type="button"
            className={`lens-pill-btn ${
              surfaceTab === 'spread' && effectiveViewMode === '2d' ? 'is-selected' : ''
            }`}
            aria-pressed={surfaceTab === 'spread' && effectiveViewMode === '2d'}
            onClick={() => {
              setSurfaceTab('spread')
              setViewMode('2d')
            }}
          >
            Precision 2D / Accessible View
          </button>
        </div>

        <div className="lens-nav-right">
          <button
            type="button"
            className={`lens-pill-btn ${surfaceTab === 'study' ? 'is-selected' : ''}`}
            aria-pressed={surfaceTab === 'study'}
            onClick={() =>
              setSurfaceTab((prev) => (prev === 'study' ? 'spread' : 'study'))
            }
          >
            {surfaceTab === 'study'
              ? '← Back to Experiment Spread'
              : 'Study: Calculations, Table 9.4 & Practice'}
          </button>
          <button
            type="button"
            className="lens-pill-btn"
            aria-pressed={stillMode}
            onClick={() => setStillMode((s) => !s)}
          >
            {stillMode ? 'Motion: Reduced (Instant)' : 'Motion: Animated'}
          </button>
        </div>
      </section>

      {webglUnavailable && (
        <div className="lens-validation-banner" role="status">
          <strong>3D WebGL unavailable in this browser:</strong> Automatically showing the
          functional <strong>Precision 2D / Accessible View</strong> with identical physics and
          controls.
        </div>
      )}

      {/* 2. ACCESSIBLE HTML EQUIVALENT FOR TABLE OF CONTENTS WHEN AT SPREAD 1 */}
      {surfaceTab === 'spread' && effectiveViewMode === 'book' && spreadIndex === 1 && (
        <section
          className="lens-contents-html-card"
          aria-labelledby="book-contents-heading"
        >
          <div className="lens-card-kicker">Table of Contents · Illustrated Science Notebook</div>
          <h2 id="book-contents-heading" className="lens-card-title">
            Select a Lesson Spread (Click on the 3D Book or Use These Buttons)
          </h2>
          <div className="lens-contents-list">
            <div className="lens-contents-entry">
              <div>
                <strong>Lesson I · Less Force. More Distance. Same Energy.</strong>
                <p>Why does a ramp make lifting easier? Direct vertical lift vs. inclined plane.</p>
              </div>
              <button
                type="button"
                className="lens-pill-btn"
                onClick={() => onOpenRampLesson?.()}
              >
                Open Lesson I (Ramp) ➔
              </button>
            </div>
            <div className="lens-contents-entry is-active-lesson">
              <div>
                <strong>Lesson II · How a convex lens forms an image.</strong>
                <p>
                  Class 10 Optics · Real vs. virtual images, principal rays, and catching an image
                  on a screen.
                </p>
              </div>
              <button
                type="button"
                className="lens-action-link-btn"
                onClick={() => setSpreadIndex(2)}
              >
                Open Lesson II (Convex Lens) ➔
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 3. PRIMARY UNIFIED LEARNING SURFACE (Left: Question, Prediction & Explanation | Right: Large Experiment | Lower Edge: Compact Controls) */}
      {surfaceTab === 'spread' ? (
        <section
          className="lens-learning-surface"
          aria-labelledby="lens-lesson-title"
        >
          <div className="lens-surface-main-split">
            {/* LEFT COLUMN: Short Question, Connected Prediction & Dynamic Explanation */}
            <aside className="lens-surface-left-rail" aria-label="Lesson question, prediction and explanation">
              <header className="lens-rail-header">
                <div className="lens-rail-badges">
                  <span className="lens-chapter-pill">
                    Lesson II · NCERT Section 9.3.3–9.3.8
                  </span>
                  <span className="lens-review-status-pill" role="status">
                    Provisional — Review Pending
                  </span>
                </div>
                <h1 id="lens-lesson-title" className="lens-rail-title">
                  How a convex lens forms an image.
                </h1>
                <p className="lens-rail-question">
                  <strong>Question:</strong> When can you catch a sharp candle image on a paper
                  screen—and why does the screen stay blank when the candle moves inside the focus{' '}
                  <code>F₁</code>?
                </p>
              </header>

              {/* PREDICTION BLOCK CONNECTED TO EXPERIMENT */}
              <div className="lens-rail-block">
                <div className="lens-card-kicker">Step 1 · Predict &amp; Test on the Bench</div>
                <div className="lens-starting-setup-note">
                  <strong>Starting setup:</strong> At <code>|u| = 30 cm</code> (<code>2F₁</code>)
                  with <code>f = +15 cm</code>, refracted rays converge at <code>v = +30 cm</code>{' '}
                  to project a sharp inverted image on the screen.
                  {activeResult.regime !== 'at_2f' && !predictionTested && (
                    <button
                      type="button"
                      className="lens-inline-link-btn"
                      onClick={handleResetExperiment}
                    >
                      Show starting setup (|u| = 30 cm)
                    </button>
                  )}
                </div>

                <p className="lens-predict-prompt">
                  <strong>Target setup:</strong> If you move the candle inside <code>F₁</code> to{' '}
                  <code>|u| = {formatLensNumber(targetInsideFCm)} cm</code> (between <code>F₁</code>{' '}
                  and <code>O</code>), what will happen to the refracted rays leaving the lens?
                </p>

                <div className="lens-choice-list" role="radiogroup" aria-label="Prediction choices">
                  {[
                    'They converge closer to the lens, projecting a tiny upside-down image on the screen.',
                    'They diverge on the right (blank screen); tracing them back forms an upright virtual image behind the candle.',
                    'They stop passing through the lens glass completely.',
                  ].map((opt, idx) => {
                    const selected = predictionOption === idx
                    return (
                      <button
                        key={opt}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        className={`lens-choice-btn ${selected ? 'is-selected' : ''}`}
                        onClick={() => setPredictionOption(idx as 0 | 1 | 2)}
                      >
                        <span className="lens-choice-marker">{selected ? '●' : '○'}</span>
                        <span>{opt}</span>
                      </button>
                    )
                  })}
                </div>

                {predictionOption !== null && (
                  <div
                    className={`lens-feedback-box ${
                      predictionTested && activeResult.regime === 'within_f'
                        ? predictionOption === 1
                          ? 'is-correct'
                          : 'is-hint'
                        : 'is-neutral'
                    }`}
                    role="status"
                  >
                    {!predictionTested ? (
                      <>
                        <p>
                          <strong>Prediction selected.</strong> Now click{' '}
                          <strong>Test my prediction</strong> to move the candle to{' '}
                          <code>|u| = {formatLensNumber(targetInsideFCm)} cm</code> (inside{' '}
                          <code>F₁</code>) and observe the rays on the optical bench.
                        </p>
                        <button
                          type="button"
                          className="lens-action-link-btn"
                          onClick={handleTestPrediction}
                        >
                          Test my prediction (|u| = {formatLensNumber(targetInsideFCm)} cm)
                        </button>
                      </>
                    ) : activeResult.regime === 'within_f' ? (
                      <>
                        <p>
                          {predictionOption === 1
                            ? `✓ Prediction confirmed on the bench! At |u| = ${formatLensNumber(
                                activeResult.objectDistanceCm
                              )} cm (inside F₁ = ${formatLensNumber(
                                activeResult.fCm
                              )} cm), the refracted rays diverge on the right side. The paper screen stays blank, while an upright virtual image forms at v = ${formatSignedCm(
                                activeResult.vCm ?? 0
                              )}.`
                            : `Observed on the bench at |u| = ${formatLensNumber(
                                activeResult.objectDistanceCm
                              )} cm (inside F₁): the rays still pass through the lens, but they diverge on the right side instead of converging! No screen can catch them; tracing the dashed violet rays backward reveals an upright virtual image at v = ${formatSignedCm(
                                activeResult.vCm ?? 0
                              )}.`}
                        </p>
                      </>
                    ) : (
                      <>
                        <p>
                          <strong>Bench moved to {activeResult.objectPositionLabel}:</strong> At{' '}
                          <code>|u| = {formatLensNumber(activeResult.objectDistanceCm)} cm</code>,{' '}
                          {activeResult.canCatchOnScreen
                            ? `refracted rays converge to a real image at v = ${formatSignedCm(
                                activeResult.vCm ?? 0
                              )}.`
                            : 'refracted rays emerge parallel at infinity.'}{' '}
                          Re-apply the inside-focus target setup to review your prediction:
                        </p>
                        <button
                          type="button"
                          className="lens-action-link-btn"
                          onClick={handleTestPrediction}
                        >
                          Test my prediction (|u| = {formatLensNumber(targetInsideFCm)} cm)
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* REVEALABLE EXPLANATION WITH APPROPRIATE HEADING FOR REAL / VIRTUAL / FOCAL-BOUNDARY */}
              <div className="lens-rail-block lens-explanation-block">
                <div className="lens-flap-header-row">
                  <div>
                    <div className="lens-card-kicker">Step 2 · Connected Explanation</div>
                    <h2 className="lens-rail-subtitle">{explanationHeading}</h2>
                  </div>
                  <button
                    type="button"
                    className="lens-pill-btn"
                    aria-expanded={flapOpen}
                    onClick={() => setFlapOpen((o) => !o)}
                  >
                    {flapOpen ? 'Hide (Lower Flap)' : 'Reveal (Lift Flap)'}
                  </button>
                </div>

                {flapOpen && (
                  <div className="lens-revealed-explanation-box">
                    <p>
                      <strong>{activeResult.objectPositionLabel}:</strong> Candle at{' '}
                      <code>u = {formatSignedCm(activeResult.uCm)}</code>, lens{' '}
                      <code>f = +{formatLensNumber(activeResult.fCm)} cm</code>.
                    </p>
                    {activeResult.canCatchOnScreen ? (
                      <p>
                        Because <code>|u| &gt; f</code>, Ray 1 (parallel ➔ <code>F₂</code>), Ray 2
                        (through <code>O</code>), and Ray 3 (through <code>F₁</code> ➔ parallel)
                        physically cross on the right side at{' '}
                        <code>v = {formatSignedCm(activeResult.vCm ?? 0)}</code> (
                        <code>m = {formatLensNumber(activeResult.magnification ?? 0, 2)}×</code>). A
                        screen at <code>+{formatLensNumber(activeResult.vCm ?? 0)} cm</code> catches
                        this sharp inverted image.
                      </p>
                    ) : activeResult.isAtFocus ? (
                      <p>
                        At the focal boundary (<code>|u| = f = {formatLensNumber(activeResult.fCm)} cm</code>
                        ), Ray 1 and Ray 2 leave the lens with the exact same downward slope (
                        <code>−h/f</code>). Parallel rays never intersect at any finite screen
                        distance (<code>v = ±∞</code>).
                      </p>
                    ) : (
                      <p>
                        Because <code>|u| &lt; f</code>, the diverging rays from the close candle
                        cannot be bent enough to cross on the right. The screen stays blank, and
                        backward dashed extensions meet behind the candle at an upright, magnified{' '}
                        <strong>virtual image</strong> (
                        <code>v = {formatSignedCm(activeResult.vCm ?? 0)}</code>,{' '}
                        <code>m = +{formatLensNumber(activeResult.magnification ?? 0, 2)}×</code>).
                      </p>
                    )}
                  </div>
                )}

                <div className="lens-study-cta-row">
                  <button
                    type="button"
                    className="lens-action-link-btn"
                    onClick={handleOpenStudyView}
                  >
                    Open Full Calculations, Table 9.4 &amp; Practice ➔
                  </button>
                </div>
              </div>
            </aside>

            {/* RIGHT COLUMN: Large Experiment Stage (3D Illustrated Book or Precision 2D View) */}
            <div className="lens-surface-right-stage">
              {!validation.isValid && (
                <div className="lens-validation-banner" role="alert">
                  <strong>Input needs attention:</strong> Showing last valid bench state (
                  <code>|u| = {lastValidInput.objectDistanceCm} cm</code>,{' '}
                  <code>f = {lastValidInput.focalLengthCm} cm</code>) until the highlighted field
                  error is corrected.
                </div>
              )}

              {effectiveViewMode === 'book' ? (
                <div className="lens-book-stage-container">
                  <LensBookScene3D
                    result={activeResult}
                    spreadIndex={spreadIndex}
                    prediction={predictionOption}
                    flapOpen={flapOpen}
                    stillMode={stillMode}
                    onSpreadChange={setSpreadIndex}
                    onSelectPrediction={(idx) => setPredictionOption(idx)}
                    onToggleFlap={() => setFlapOpen((o) => !o)}
                    onOpenWorkedMath={handleOpenStudyView}
                    onSelectPresetFactor={handlePresetClick}
                    onSnapScreenToImage={handleSnapScreenToImage}
                    onChangeObjectDistance={(nextObj) =>
                      handleDraftChange('objectDistanceCm', String(nextObj))
                    }
                    onChangeScreenDistance={(nextScr) =>
                      handleDraftChange('screenDistanceCm', String(nextScr))
                    }
                    onOpenRampLesson={onOpenRampLesson}
                    onWebglUnavailable={() => setWebglUnavailable(true)}
                  />

                  <div
                    className="lens-book-capsule-bar"
                    role="toolbar"
                    aria-label="Book spread controls"
                  >
                    <button
                      type="button"
                      className="lens-pill-btn"
                      disabled={spreadIndex <= 0}
                      onClick={() => setSpreadIndex((s) => Math.max(0, s - 1))}
                    >
                      ‹ {spreadIndex === 2 ? 'Contents' : 'Cover'}
                    </button>
                    <span className="lens-book-spread-indicator">
                      {spreadIndex === 0
                        ? 'Spread 0 · Front Cover'
                        : spreadIndex === 1
                          ? 'Spread 1 · Table of Contents'
                          : `Spread 2 · ${activeResult.objectPositionLabel} (Drag 3D candle or screen)`}
                    </span>
                    <div className="lens-capsule-actions">
                      {spreadIndex < 2 ? (
                        <button
                          type="button"
                          className="lens-action-link-btn"
                          onClick={() => setSpreadIndex((s) => Math.min(2, s + 1))}
                        >
                          Open {spreadIndex === 0 ? 'Contents' : 'Lesson II'} ›
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="lens-pill-btn"
                          aria-pressed={flapOpen}
                          onClick={() => setFlapOpen((o) => !o)}
                        >
                          {flapOpen ? 'Lower 3D Flap' : 'Lift 3D Flap (?)'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="lens-2d-accessible-stage">
                  <div className="lens-2d-stage-banner">
                    <span>
                      <strong>Precision 2D / Accessible View:</strong> Exact New Cartesian scale,
                      keyboard-operable riders (Tab to <code>OBJECT</code> or <code>SCREEN</code>{' '}
                      and press <code>←</code>/<code>→</code>), and pattern-coded principal rays.
                    </span>
                    {!webglUnavailable && (
                      <button
                        type="button"
                        className="lens-pill-btn"
                        onClick={() => {
                          setViewMode('book')
                          setSpreadIndex(2)
                        }}
                      >
                        Switch to 3D Book View
                      </button>
                    )}
                  </div>
                  <LensRayDiagramSVG
                    result={activeResult}
                    onChangeObjectDistance={(nextObj) =>
                      handleDraftChange('objectDistanceCm', String(nextObj))
                    }
                    onChangeScreenDistance={(nextScr) =>
                      handleDraftChange('screenDistanceCm', String(nextScr))
                    }
                  />
                </div>
              )}

              {/* Live Screen Status & Snap Button directly beneath Experiment Stage */}
              <div
                className={`lens-screen-feedback-bar ${
                  activeResult.isSharpOnScreen
                    ? 'is-sharp'
                    : activeResult.canCatchOnScreen
                      ? 'is-blurred'
                      : 'is-nocatch'
                }`}
                role="status"
                aria-live="polite"
              >
                <div className="lens-screen-feedback-text">
                  <strong>
                    Paper Screen at +{formatLensNumber(activeResult.screenDistanceCm)} cm:
                  </strong>{' '}
                  {activeResult.screenStatusText}
                </div>
                {activeResult.canCatchOnScreen && !activeResult.isSharpOnScreen && (
                  <button
                    type="button"
                    className="lens-snap-screen-btn"
                    onClick={handleSnapScreenToImage}
                  >
                    Snap Screen to Sharp Image (+{formatLensNumber(activeResult.vCm ?? 0)} cm)
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* LOWER EDGE OF LEARNING SURFACE: Compact Labelled Controls & Live Readouts */}
          <div
            className="lens-lower-controls-dock"
            role="region"
            aria-label="Compact optical bench controls"
          >
            {/* Top Strip: Quick Presets + Compact Live Readout Badges */}
            <div className="lens-dock-top-strip">
              <div className="lens-presets-buttons">
                <span className="lens-dock-strip-label">Quick Positions:</span>
                {NCERT_CONVEX_LENS_PRESETS.map((preset) => {
                  const isCurrent = activeResult.regime === preset.id
                  const visited = visitedRegimes[preset.id as LensObjectRegime]
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      className={`lens-preset-chip ${isCurrent ? 'is-active' : ''}`}
                      aria-pressed={isCurrent}
                      onClick={() => handlePresetClick(preset.objectDistanceFactorOfF)}
                    >
                      {visited ? '✓ ' : ''}
                      {preset.shortLabel}
                    </button>
                  )
                })}
                <button
                  type="button"
                  className="lens-preset-chip lens-reset-chip"
                  onClick={handleResetExperiment}
                >
                  Reset (|u|=30, f=15)
                </button>
              </div>

              <div className="lens-dock-readout-pills" aria-label="Live optical readout values">
                <span className="lens-dock-pill">
                  v ={' '}
                  <strong>
                    {activeResult.isAtFocus ? '±∞' : formatSignedCm(activeResult.vCm ?? 0)}
                  </strong>
                </span>
                <span className="lens-dock-pill">
                  m ={' '}
                  <strong>
                    {activeResult.isAtFocus
                      ? '∞'
                      : `${(activeResult.magnification ?? 0) > 0 ? '+' : ''}${formatLensNumber(
                          activeResult.magnification ?? 0,
                          2
                        )}×`}
                  </strong>
                </span>
                <span className="lens-dock-pill">
                  h&apos; ={' '}
                  <strong>
                    {activeResult.isAtFocus
                      ? '∞'
                      : formatSignedCm(activeResult.imageHeightCm ?? 0)}
                  </strong>
                </span>
                <span
                  className={`lens-dock-pill ${
                    activeResult.canCatchOnScreen ? 'is-catchable' : 'is-virtual'
                  }`}
                >
                  Screen Catch:{' '}
                  <strong>
                    {activeResult.canCatchOnScreen ? 'Yes (Real)' : 'No (Virtual / ∞)'}
                  </strong>
                </span>
              </div>
            </div>

            {/* Bottom Strip: Side-by-Side Sliders for Object |u|, Screen d_s, and Secondary Lens Parameters */}
            <div className="lens-dock-controls-row">
              {/* Compact Control 1: Object Distance |u| */}
              <div className="lens-field-group">
                <div className="lens-field-header">
                  <label htmlFor="lens-obj-dist-number" className="lens-field-label">
                    Object Distance <code>|u|</code> (cm)
                  </label>
                  <span className="lens-signed-pill">
                    Signed u = {formatSignedCm(activeResult.uCm)}
                  </span>
                </div>
                <div className="lens-slider-number-row">
                  <input
                    id="lens-obj-dist-slider"
                    type="range"
                    min={LENS_UI_LIMITS.objectDistanceCm.min}
                    max={LENS_UI_LIMITS.objectDistanceCm.max}
                    step={LENS_UI_LIMITS.objectDistanceCm.step}
                    value={sliderObjDist}
                    aria-label="Object distance |u| slider in cm"
                    onChange={(e) => handleDraftChange('objectDistanceCm', e.target.value)}
                  />
                  <input
                    id="lens-obj-dist-number"
                    type="number"
                    className="lens-number-input"
                    min={LENS_UI_LIMITS.objectDistanceCm.min}
                    max={LENS_UI_LIMITS.objectDistanceCm.max}
                    step={LENS_UI_LIMITS.objectDistanceCm.step}
                    value={drafts.objectDistanceCm}
                    aria-invalid={Boolean(validation.errors.objectDistanceCm)}
                    aria-describedby={
                      validation.errors.objectDistanceCm
                        ? 'lens-obj-help lens-obj-error'
                        : 'lens-obj-help'
                    }
                    onChange={(e) => handleDraftChange('objectDistanceCm', e.target.value)}
                  />
                </div>
                <span id="lens-obj-help" className="lens-field-help">
                  4–60 cm (F₁ at {formatLensNumber(activeResult.fCm)} cm, 2F₁ at{' '}
                  {formatLensNumber(2 * activeResult.fCm)} cm).
                </span>
                {validation.errors.objectDistanceCm && (
                  <p id="lens-obj-error" className="lens-field-error" role="alert">
                    {validation.errors.objectDistanceCm}
                  </p>
                )}
              </div>

              {/* Compact Control 2: Screen Position d_s */}
              <div className="lens-field-group">
                <div className="lens-field-header">
                  <label htmlFor="lens-screen-dist-number" className="lens-field-label">
                    Screen Position <code>d_s</code> (cm)
                  </label>
                  <span className="lens-signed-pill">
                    +{formatLensNumber(activeResult.screenDistanceCm)} cm
                  </span>
                </div>
                <div className="lens-slider-number-row">
                  <input
                    id="lens-screen-dist-slider"
                    type="range"
                    min={LENS_UI_LIMITS.screenDistanceCm.min}
                    max={LENS_UI_LIMITS.screenDistanceCm.max}
                    step={LENS_UI_LIMITS.screenDistanceCm.step}
                    value={sliderScreen}
                    aria-label="Screen position slider in cm"
                    onChange={(e) => handleDraftChange('screenDistanceCm', e.target.value)}
                  />
                  <input
                    id="lens-screen-dist-number"
                    type="number"
                    className="lens-number-input"
                    min={LENS_UI_LIMITS.screenDistanceCm.min}
                    max={LENS_UI_LIMITS.screenDistanceCm.max}
                    step={LENS_UI_LIMITS.screenDistanceCm.step}
                    value={drafts.screenDistanceCm}
                    aria-invalid={Boolean(validation.errors.screenDistanceCm)}
                    aria-describedby={
                      validation.errors.screenDistanceCm
                        ? 'lens-scr-help lens-scr-error'
                        : 'lens-scr-help'
                    }
                    onChange={(e) => handleDraftChange('screenDistanceCm', e.target.value)}
                  />
                </div>
                <span id="lens-scr-help" className="lens-field-help">
                  5–75 cm (slide screen to intercept converging rays).
                </span>
                {validation.errors.screenDistanceCm && (
                  <p id="lens-scr-error" className="lens-field-error" role="alert">
                    {validation.errors.screenDistanceCm}
                  </p>
                )}
              </div>

              {/* Secondary Lens Parameters (Focal Length f & Candle Height h) */}
              <details className="lens-dock-secondary-details">
                <summary className="lens-secondary-summary">
                  Lens <code>f</code> (+{formatLensNumber(activeResult.fCm)} cm) &amp; Candle{' '}
                  <code>h</code> (+{formatLensNumber(activeResult.objectHeightCm)} cm)
                </summary>
                <div className="lens-secondary-fields">
                  <div className="lens-field-group">
                    <div className="lens-field-header">
                      <label htmlFor="lens-focal-number" className="lens-field-label">
                        Focal Length <code>f</code> (cm)
                      </label>
                      <span className="lens-signed-pill">
                        P = +{formatLensNumber(activeResult.opticalPowerDioptre, 2)} D
                      </span>
                    </div>
                    <div className="lens-slider-number-row">
                      <input
                        id="lens-focal-slider"
                        type="range"
                        min={LENS_UI_LIMITS.focalLengthCm.min}
                        max={LENS_UI_LIMITS.focalLengthCm.max}
                        step={LENS_UI_LIMITS.focalLengthCm.step}
                        value={sliderFocal}
                        aria-label="Convex lens focal length f slider in cm"
                        onChange={(e) => handleDraftChange('focalLengthCm', e.target.value)}
                      />
                      <input
                        id="lens-focal-number"
                        type="number"
                        className="lens-number-input"
                        min={LENS_UI_LIMITS.focalLengthCm.min}
                        max={LENS_UI_LIMITS.focalLengthCm.max}
                        step={LENS_UI_LIMITS.focalLengthCm.step}
                        value={drafts.focalLengthCm}
                        aria-invalid={Boolean(validation.errors.focalLengthCm)}
                        aria-describedby={
                          validation.errors.focalLengthCm
                            ? 'lens-focal-help lens-focal-error'
                            : 'lens-focal-help'
                        }
                        onChange={(e) => handleDraftChange('focalLengthCm', e.target.value)}
                      />
                    </div>
                    <span id="lens-focal-help" className="lens-field-help">
                      Range: 5–25 cm.
                    </span>
                    {validation.errors.focalLengthCm && (
                      <p id="lens-focal-error" className="lens-field-error" role="alert">
                        {validation.errors.focalLengthCm}
                      </p>
                    )}
                  </div>

                  <div className="lens-field-group">
                    <div className="lens-field-header">
                      <label htmlFor="lens-height-number" className="lens-field-label">
                        Object Height <code>h</code> (cm)
                      </label>
                      <span className="lens-signed-pill">
                        +{formatLensNumber(activeResult.objectHeightCm)} cm
                      </span>
                    </div>
                    <div className="lens-slider-number-row">
                      <input
                        id="lens-height-slider"
                        type="range"
                        min={LENS_UI_LIMITS.objectHeightCm.min}
                        max={LENS_UI_LIMITS.objectHeightCm.max}
                        step={LENS_UI_LIMITS.objectHeightCm.step}
                        value={sliderHeight}
                        aria-label="Object height h slider in cm"
                        onChange={(e) => handleDraftChange('objectHeightCm', e.target.value)}
                      />
                      <input
                        id="lens-height-number"
                        type="number"
                        className="lens-number-input"
                        min={LENS_UI_LIMITS.objectHeightCm.min}
                        max={LENS_UI_LIMITS.objectHeightCm.max}
                        step={LENS_UI_LIMITS.objectHeightCm.step}
                        value={drafts.objectHeightCm}
                        aria-invalid={Boolean(validation.errors.objectHeightCm)}
                        aria-describedby={
                          validation.errors.objectHeightCm
                            ? 'lens-height-help lens-height-error'
                            : 'lens-height-help'
                        }
                        onChange={(e) => handleDraftChange('objectHeightCm', e.target.value)}
                      />
                    </div>
                    <span id="lens-height-help" className="lens-field-help">
                      Range: 1–8 cm.
                    </span>
                    {validation.errors.objectHeightCm && (
                      <p id="lens-height-error" className="lens-field-error" role="alert">
                        {validation.errors.objectHeightCm}
                      </p>
                    )}
                  </div>
                </div>
              </details>
            </div>
          </div>
        </section>
      ) : (
        /* 4. SEPARATE SECONDARY STUDY VIEW: Full Calculations, One-at-a-Time Practice & NCERT Table 9.4 */
        <section
          id="lens-worked-math-section"
          className="lens-secondary-study-view"
          aria-label="Secondary study view: worked calculations, NCERT Table 9.4, and practice questions"
        >
          <header className="lens-study-view-header">
            <div>
              <div className="lens-card-kicker">
                Secondary Study View · NCERT Class 10 Sections 9.3.4–9.3.8
              </div>
              <h1 className="lens-card-title">
                Worked Thin-Lens Calculations, Practice Checks &amp; NCERT Table 9.4
              </h1>
            </div>
            <button
              type="button"
              className="lens-action-link-btn"
              onClick={() => setSurfaceTab('spread')}
            >
              ← Return to Live Experiment Spread
            </button>
          </header>

          {/* Balanced Two-Column Row: Worked Math on Left, Single Active Practice Question on Right */}
          <div className="lens-study-balanced-grid">
            {/* Left Card: Live Step-by-Step Math */}
            <article className="lens-pedagogy-card">
              <div className="lens-card-kicker">
                Worked Calculation · Connected to Live Bench ({activeResult.objectPositionLabel})
              </div>
              <h2 className="lens-card-title">
                Step-by-Step Math for u = {formatSignedCm(activeResult.uCm)}, f = +
                {formatLensNumber(activeResult.fCm)} cm
              </h2>

              <div className="lens-worked-math-box">
                <div className="lens-math-step">
                  <span className="lens-math-step-title">
                    1. Thin-Lens Formula (NCERT Section 9.3.7): <code>1/v − 1/u = 1/f</code>
                  </span>
                  <div className="lens-math-line">
                    <code>
                      1/v = 1/f + 1/u = 1/({formatLensNumber(activeResult.fCm)}) + 1/(
                      {formatLensNumber(activeResult.uCm)})
                    </code>
                  </div>
                  {activeResult.isAtFocus ? (
                    <div className="lens-math-line lens-math-highlight">
                      <code>
                        1/v = (u + f) / (u · f) = ({formatLensNumber(activeResult.uCm)} +{' '}
                        {formatLensNumber(activeResult.fCm)}) / (
                        {formatLensNumber(activeResult.uCm * activeResult.fCm)}) = 0 cm⁻¹ ➔ v = ∞
                      </code>
                    </div>
                  ) : (
                    <div className="lens-math-line lens-math-highlight">
                      <code>
                        v = (u · f) / (u + f) = ({formatLensNumber(activeResult.uCm)} ×{' '}
                        {formatLensNumber(activeResult.fCm)}) / ({formatLensNumber(activeResult.uCm)}{' '}
                        + {formatLensNumber(activeResult.fCm)}) ={' '}
                        {formatSignedCm(activeResult.vCm ?? 0, 2)}
                      </code>
                    </div>
                  )}
                </div>

                <div className="lens-math-step">
                  <span className="lens-math-step-title">
                    2. Linear Magnification (NCERT Section 9.3.7): <code>m = h&apos;/h = v/u</code>
                  </span>
                  {activeResult.isAtFocus ? (
                    <div className="lens-math-line">
                      <code>
                        At u = −f, refracted rays emerge parallel, so finite magnification is
                        undefined (infinitely large at ∞).
                      </code>
                    </div>
                  ) : (
                    <>
                      <div className="lens-math-line">
                        <code>
                          m = v / u = ({formatLensNumber(activeResult.vCm ?? 0, 2)}) / (
                          {formatLensNumber(activeResult.uCm, 2)}) ={' '}
                          {(activeResult.magnification ?? 0) > 0 ? '+' : ''}
                          {formatLensNumber(activeResult.magnification ?? 0, 2)}
                        </code>
                      </div>
                      <div className="lens-math-line lens-math-highlight">
                        <code>
                          h&apos; = m × h = {formatLensNumber(activeResult.magnification ?? 0, 2)} ×{' '}
                          {formatLensNumber(activeResult.objectHeightCm)} cm ={' '}
                          {formatSignedCm(activeResult.imageHeightCm ?? 0, 2)} (
                          {(activeResult.imageHeightCm ?? 0) < 0 ? 'Inverted' : 'Erect'})
                        </code>
                      </div>
                    </>
                  )}
                </div>

                <div className="lens-math-step">
                  <span className="lens-math-step-title">
                    3. Optical Power of Lens (NCERT Section 9.3.8):{' '}
                    <code>P = 1 / f(in m) = 100 / f(in cm)</code>
                  </span>
                  <div className="lens-math-line lens-math-highlight">
                    <code>
                      P = 100 / (+{formatLensNumber(activeResult.fCm)} cm) = +
                      {formatLensNumber(activeResult.opticalPowerDioptre, 2)} D (Converging)
                    </code>
                  </div>
                </div>
              </div>
            </article>

            {/* Right Card: One Practice Question at a Time */}
            <article className="lens-pedagogy-card">
              <div className="lens-practice-stepper-header">
                <div>
                  <div className="lens-card-kicker">
                    Practice &amp; Application · Question {activePracticeIndex + 1} of{' '}
                    {PRACTICE_TITLES.length}
                  </div>
                  <h2 className="lens-card-title">
                    Test Your Understanding (One Question at a Time)
                  </h2>
                </div>
                <div className="lens-stepper-arrows">
                  <button
                    type="button"
                    className="lens-pill-btn"
                    disabled={activePracticeIndex <= 0}
                    onClick={() => setActivePracticeIndex((i) => Math.max(0, i - 1))}
                  >
                    ‹ Previous
                  </button>
                  <button
                    type="button"
                    className="lens-pill-btn"
                    disabled={activePracticeIndex >= PRACTICE_TITLES.length - 1}
                    onClick={() =>
                      setActivePracticeIndex((i) => Math.min(PRACTICE_TITLES.length - 1, i + 1))
                    }
                  >
                    Next ›
                  </button>
                </div>
              </div>

              <div className="lens-practice-tabs" role="tablist" aria-label="Practice questions">
                {PRACTICE_TITLES.map((title, idx) => (
                  <button
                    key={title}
                    type="button"
                    role="tab"
                    aria-selected={activePracticeIndex === idx}
                    className={`lens-preset-chip ${activePracticeIndex === idx ? 'is-active' : ''}`}
                    onClick={() => setActivePracticeIndex(idx)}
                  >
                    {title}
                  </button>
                ))}
              </div>

              {/* Active Practice Question Body */}
              {activePracticeIndex === 0 && (
                <div className="lens-practice-item" role="tabpanel">
                  <div className="lens-practice-header">
                    <h3>Problem 1 · Projecting a Magnified Real Image</h3>
                    <button
                      type="button"
                      className="lens-load-bench-btn"
                      onClick={() =>
                        handleLoadPracticeOnBench({
                          focalLengthCm: 15,
                          objectDistanceCm: 20,
                          objectHeightCm: 3,
                          screenDistanceCm: 60,
                        })
                      }
                    >
                      Load on Bench (|u|=20, f=15) ➔
                    </button>
                  </div>
                  <p>
                    A <code>3 cm</code> tall candle is placed <code>20 cm</code> in front of a
                    convex lens of focal length <code>f = +15 cm</code> (so{' '}
                    <code>u = −20 cm</code>). At what signed image coordinate <code>v</code> (in cm)
                    must a screen be placed to catch a sharp image?
                  </p>
                  <div className="lens-calc-input-row">
                    <label htmlFor="calc-q1-input" className="lens-calc-label">
                      Image position <code>v</code> (cm):
                    </label>
                    <input
                      id="calc-q1-input"
                      type="number"
                      step="0.5"
                      className="lens-number-input"
                      placeholder="e.g. 60"
                      value={calcQ1Draft}
                      onChange={(e) => {
                        setCalcQ1Draft(e.target.value)
                        setCalcQ1Checked(false)
                      }}
                    />
                    <button
                      type="button"
                      className="lens-check-btn"
                      onClick={() => setCalcQ1Checked(true)}
                    >
                      Check Answer
                    </button>
                  </div>
                  {calcQ1Checked && (
                    <div
                      className={`lens-feedback-box ${
                        isQ1Correct ? 'is-correct' : 'is-hint'
                      }`}
                      role="status"
                    >
                      {isQ1Correct ? (
                        <p>
                          ✓ Correct! <code>1/v = 1/15 + 1/(−20) = (4 − 3)/60 = +1/60</code>, so{' '}
                          <code>v = +60 cm</code> (and magnification <code>m = 60/(−20) = −3</code>,
                          giving a <code>−9 cm</code> inverted real image).
                        </p>
                      ) : q1Val !== null && Math.abs(q1Val - 8.57) < 0.5 ? (
                        <p>
                          ⚠ Sign-convention trap! It looks like you used <code>u = +20 cm</code>.
                          Remember: in the New Cartesian Sign Convention, the object is to the left
                          of O, so <code>u = −20 cm</code> and{' '}
                          <code>1/v = 1/15 − 1/20 = 1/60</code>.
                        </p>
                      ) : (
                        <p>
                          Hint: Use <code>1/v = 1/f + 1/u = 1/15 + 1/(−20)</code>, or click{' '}
                          <strong>Load on Bench</strong> above to inspect the live setup.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activePracticeIndex === 1 && (
                <div className="lens-practice-item" role="tabpanel">
                  <div className="lens-practice-header">
                    <h3>Problem 2 · Inside the Principal Focus (Simple Magnifier)</h3>
                    <button
                      type="button"
                      className="lens-load-bench-btn"
                      onClick={() =>
                        handleLoadPracticeOnBench({
                          focalLengthCm: 15,
                          objectDistanceCm: 10,
                          objectHeightCm: 3,
                          screenDistanceCm: 30,
                        })
                      }
                    >
                      Load on Bench (|u|=10, f=15) ➔
                    </button>
                  </div>
                  <p>
                    An object is placed at <code>|u| = 10 cm</code> (<code>u = −10 cm</code>) in
                    front of a convex lens of focal length <code>f = +15 cm</code>. What are the
                    signed image position <code>v</code>, linear magnification <code>m</code>, and
                    screen catchability?
                  </p>
                  <div className="lens-choice-list" role="radiogroup" aria-label="Problem 2 choices">
                    {[
                      'v = +30 cm, m = −3 (real, inverted, can be caught on a screen at +30 cm)',
                      'v = −30 cm, m = +3 (virtual, erect, enlarged on the object side; cannot be caught on a screen)',
                      'v = −6 cm, m = +0.6 (virtual, diminished on the object side)',
                    ].map((opt, idx) => {
                      const selected = calcQ2Option === idx
                      return (
                        <button
                          key={opt}
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          className={`lens-choice-btn ${selected ? 'is-selected' : ''}`}
                          onClick={() => setCalcQ2Option(idx as 0 | 1 | 2)}
                        >
                          <span className="lens-choice-marker">{selected ? '●' : '○'}</span>
                          <span>{opt}</span>
                        </button>
                      )
                    })}
                  </div>
                  {calcQ2Option !== null && (
                    <div
                      className={`lens-feedback-box ${
                        isQ2Correct ? 'is-correct' : 'is-hint'
                      }`}
                    >
                      <p>
                        {isQ2Correct
                          ? '✓ Exactly right! 1/v = 1/15 + 1/(−10) = (2 − 3)/30 = −1/30 ➔ v = −30 cm, and m = v/u = (−30)/(−10) = +3. Because v < 0 (virtual), refracted rays diverge and cannot be caught on a screen.'
                          : 'Check the sign: 1/v = 1/15 − 1/10 = −1/30, so v is negative (−30 cm) and m = (−30)/(−10) = +3.'}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activePracticeIndex === 2 && (
                <div className="lens-practice-item" role="tabpanel">
                  <div className="lens-practice-header">
                    <h3>Problem 3 · Optical Power in Dioptres (NCERT Section 9.3.8)</h3>
                    <button
                      type="button"
                      className="lens-load-bench-btn"
                      onClick={() =>
                        handleLoadPracticeOnBench({
                          focalLengthCm: 20,
                          objectDistanceCm: 40,
                          objectHeightCm: 4,
                          screenDistanceCm: 40,
                        })
                      }
                    >
                      Load on Bench (f=20 cm) ➔
                    </button>
                  </div>
                  <p>
                    What is the optical power <code>P</code> (in dioptres, <code>D</code>) of a
                    convex lens whose focal length is <code>f = +20 cm</code> (
                    <code>+0.20 m</code>)?
                  </p>
                  <div className="lens-calc-input-row">
                    <label htmlFor="calc-q3-input" className="lens-calc-label">
                      Optical Power <code>P</code> (D):
                    </label>
                    <input
                      id="calc-q3-input"
                      type="number"
                      step="0.5"
                      className="lens-number-input"
                      placeholder="e.g. 5"
                      value={calcQ3Draft}
                      onChange={(e) => {
                        setCalcQ3Draft(e.target.value)
                        setCalcQ3Checked(false)
                      }}
                    />
                    <button
                      type="button"
                      className="lens-check-btn"
                      onClick={() => setCalcQ3Checked(true)}
                    >
                      Check Answer
                    </button>
                  </div>
                  {calcQ3Checked && (
                    <div
                      className={`lens-feedback-box ${
                        isQ3Correct ? 'is-correct' : 'is-hint'
                      }`}
                      role="status"
                    >
                      <p>
                        {isQ3Correct
                          ? '✓ Correct! By NCERT Section 9.3.8, P = 1 / f(in m) = 100 / 20 cm = +5.0 D.'
                          : 'Remember to convert focal length from centimetres to metres first: P = 1 / 0.20 m = 100 / 20 = +5 D.'}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activePracticeIndex === 3 && (
                <div className="lens-practice-item" role="tabpanel">
                  <h3>Application 1 · Designing a Classroom Slide Projector</h3>
                  <p>
                    Where should you place an illuminated slide relative to a convex lens (
                    <code>f = 15 cm</code>) to project a <strong>large, sharp image</strong> onto a
                    distant classroom wall?
                  </p>
                  <div
                    className="lens-choice-list"
                    role="radiogroup"
                    aria-label="Application 1 choices"
                  >
                    {[
                      'Place the slide at |u| = 10 cm (between F₁ and O) upright.',
                      'Place the slide between F₁ and 2F₁ (15 cm < |u| < 30 cm) upside-down, so the lens projects a real, enlarged image on the wall.',
                      'Place the slide beyond 2F₁ (|u| = 45 cm) upright.',
                    ].map((opt, idx) => {
                      const selected = appQ1Option === idx
                      return (
                        <button
                          key={opt}
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          className={`lens-choice-btn ${selected ? 'is-selected' : ''}`}
                          onClick={() => setAppQ1Option(idx as 0 | 1 | 2)}
                        >
                          <span className="lens-choice-marker">{selected ? '●' : '○'}</span>
                          <span>{opt}</span>
                        </button>
                      )
                    })}
                  </div>
                  {appQ1Option !== null && (
                    <div
                      className={`lens-feedback-box ${
                        isApp1Correct ? 'is-correct' : 'is-hint'
                      }`}
                    >
                      <p>
                        {isApp1Correct
                          ? '✓ Excellent! Placing the slide between F₁ and 2F₁ produces a real, enlarged (|m| > 1) image beyond 2F₂ that lands on a wall screen.'
                          : 'Remember: the image must land on a wall screen (so it must be REAL, |u| > f) and be ENLARGED (f < |u| < 2f).'}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activePracticeIndex === 4 && (
                <div className="lens-practice-item" role="tabpanel">
                  <h3>Application 2 · The Half-Covered Convex Lens Experiment</h3>
                  <p>
                    If the lower half of a convex lens is covered with black paper while projecting
                    a candle flame onto a screen, what happens to the image?
                  </p>
                  <div
                    className="lens-choice-list"
                    role="radiogroup"
                    aria-label="Application 2 choices"
                  >
                    {[
                      'Only the top half of the candle flame appears on the screen.',
                      'Only the bottom half of the candle flame appears on the screen.',
                      'The complete inverted image still forms at the same position, but becomes dimmer.',
                    ].map((opt, idx) => {
                      const selected = appQ2Option === idx
                      return (
                        <button
                          key={opt}
                          type="button"
                          role="radio"
                          aria-checked={selected}
                          className={`lens-choice-btn ${selected ? 'is-selected' : ''}`}
                          onClick={() => setAppQ2Option(idx as 0 | 1 | 2)}
                        >
                          <span className="lens-choice-marker">{selected ? '●' : '○'}</span>
                          <span>{opt}</span>
                        </button>
                      )
                    })}
                  </div>
                  {appQ2Option !== null && (
                    <div
                      className={`lens-feedback-box ${
                        isApp2Correct ? 'is-correct' : 'is-hint'
                      }`}
                    >
                      <p>
                        {isApp2Correct
                          ? '✓ Spot on! Every point on the candle sends rays across the entire lens; rays through the uncovered upper half still converge to form the complete image at reduced brightness.'
                          : 'Trace Ray 1 (top of lens) and Ray 2 (centre O): both still pass through the uncovered half and meet at the image tip!'}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </article>
          </div>

          {/* Full-Width Card: NCERT Class 10 Table 9.4 (Eliminates uneven column height) */}
          <article className="lens-pedagogy-card">
            <div className="lens-card-kicker">Reference Summary · NCERT Class 10 Section 9.3.4</div>
            <h2 className="lens-card-title">
              NCERT Table 9.4 — Image Formation by a Convex Lens (5 Interactive Finite Regimes + 1
              Infinity Reference Row)
            </h2>
            <p className="lens-field-help">
              Note: The optical bench slider models finite object distances (4–60 cm, covering 5 of
              the 6 NCERT Table 9.4 rows). The <em>Object at infinity (|u| = ∞)</em> row is included
              below as a reference case.
            </p>
            <div className="lens-table-scroll">
              <table className="lens-data-table">
                <thead>
                  <tr>
                    <th scope="col">Position of Object</th>
                    <th scope="col">Position of Image</th>
                    <th scope="col">Relative Size</th>
                    <th scope="col">Nature (Screen Catch?)</th>
                    <th scope="col">Try on Bench</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="lens-reference-row">
                    <td>
                      <em>At infinity (|u| = ∞)</em>{' '}
                      <span className="lens-ref-badge">Reference</span>
                    </td>
                    <td>At focus F₂ (v = +f)</td>
                    <td>Highly diminished, point-sized</td>
                    <td>Real &amp; inverted (Yes, at F₂)</td>
                    <td>—</td>
                  </tr>
                  {[
                    {
                      id: 'beyond_2f',
                      factor: 2.5,
                      obj: 'Beyond 2F₁ (|u| > 2f)',
                      img: 'Between F₂ and 2F₂ (+f < v < +2f)',
                      size: 'Diminished (|m| < 1)',
                      nat: 'Real & inverted (Yes)',
                    },
                    {
                      id: 'at_2f',
                      factor: 2.0,
                      obj: 'At 2F₁ (|u| = 2f)',
                      img: 'At 2F₂ (v = +2f)',
                      size: 'Same size (m = −1)',
                      nat: 'Real & inverted (Yes)',
                    },
                    {
                      id: 'between_f_and_2f',
                      factor: 1.5,
                      obj: 'Between F₁ and 2F₁ (f < |u| < 2f)',
                      img: 'Beyond 2F₂ (v > +2f)',
                      size: 'Enlarged (|m| > 1)',
                      nat: 'Real & inverted (Yes)',
                    },
                    {
                      id: 'at_f',
                      factor: 1.0,
                      obj: 'At focus F₁ (|u| = f)',
                      img: 'At infinity (v = ±∞)',
                      size: 'Infinitely large',
                      nat: 'Rays parallel (No at finite screen)',
                    },
                    {
                      id: 'within_f',
                      factor: 0.6,
                      obj: 'Between F₁ and optical centre O (|u| < f)',
                      img: 'On the same side as the object (v < 0)',
                      size: 'Enlarged (m > +1)',
                      nat: 'Virtual & erect (No)',
                    },
                  ].map((row) => {
                    const active = activeResult.regime === row.id
                    return (
                      <tr key={row.id} className={active ? 'is-highlighted-row' : ''}>
                        <td>{active ? <strong>➔ {row.obj}</strong> : row.obj}</td>
                        <td>{row.img}</td>
                        <td>{row.size}</td>
                        <td>{row.nat}</td>
                        <td>
                          <button
                            type="button"
                            className="lens-load-bench-btn"
                            onClick={() => {
                              handlePresetClick(row.factor)
                              setSurfaceTab('spread')
                            }}
                          >
                            Test ({row.factor}f)
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </article>
        </section>
      )}

      {/* 5. DOCUMENTED ASSUMPTIONS, LIMITATIONS & VERIFIED REFERENCES */}
      <footer className="lens-assumptions-footer" aria-labelledby="lens-assumptions-heading">
        <div className="lens-assumptions-grid">
          <div>
            <h2 id="lens-assumptions-heading" className="lens-footer-title">
              Scientific Model Assumptions &amp; Real-World Limitations
            </h2>
            <ul className="lens-footer-list">
              <li>
                <strong>Ideal Thin-Lens Model:</strong> Lens thickness is assumed negligible compared
                to <code>|u|</code>, <code>|v|</code>, and <code>f</code>; refraction is modelled at
                the principal plane <code>x = 0</code> passing through optical centre{' '}
                <code>O(0, 0)</code>.
              </li>
              <li>
                <strong>Paraxial &amp; Monochromatic Scope:</strong> Spherical aberration, chromatic
                dispersion, and the <em>Object at infinity (|u| = ∞)</em> slider limit are
                documented reference boundaries.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="lens-footer-title">Verified Curriculum &amp; Scientific References</h2>
            <ul className="lens-footer-list">
              <li>
                <strong>NCERT Class 10 Science</strong> (2025–26 Rationalised Edition), Chapter 9:{' '}
                <em>Light – Reflection and Refraction</em>, Sections 9.3.3–9.3.8 &amp; Table 9.4.
              </li>
              <li>
                <strong>OpenStax University Physics Volume 3</strong>, Section 2.4 (Thin Lenses).
              </li>
              <li>
                <strong>Provisional Notice:</strong> Original CBSE Interactive Lab prototype —
                educator and curriculum review pending.
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </main>
  )
}
