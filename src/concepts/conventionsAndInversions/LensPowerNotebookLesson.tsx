import { useState } from 'react'
import { useReducedMotionPreference } from '../../features/platform/reducedMotion'
import {
  calculateLensPowerModel,
  evaluateRulerMeasurement,
  formatSignedValue,
  LENS_POWER_LIMITS,
  validateFocalLengthCmInput,
} from './lensPowerModel'
import {
  computeStageTransition,
  countCompletedPractice,
  evaluateInitialPrediction,
  evaluateLensPowerPractice,
  INITIAL_PRACTICE_ATTEMPT,
  INITIAL_PREDICTION_OPTIONS,
  LENS_POWER_PRACTICE_QUESTIONS,
  LENS_POWER_SOURCE_METADATA,
  LENS_POWER_STAGES,
  PRESET_LENSES,
  type LensPowerStageId,
  type PracticeAttemptState,
  type PracticeQuestionId,
  type PredictionChoiceId,
} from './lensPowerContent'
import { LensPowerBenchSVG } from './LensPowerBenchSVG'
import './lensPowerNotebook.css'

export interface LensPowerNotebookLessonProps {
  onBackToConceptHub?: () => void
}

function createInitialAttemptsMap(): Record<PracticeQuestionId, PracticeAttemptState> {
  return {
    q1: { ...INITIAL_PRACTICE_ATTEMPT },
    q2: { ...INITIAL_PRACTICE_ATTEMPT },
    q3: { ...INITIAL_PRACTICE_ATTEMPT },
    q4: { ...INITIAL_PRACTICE_ATTEMPT },
    q5: { ...INITIAL_PRACTICE_ATTEMPT },
    q6: { ...INITIAL_PRACTICE_ATTEMPT },
  }
}

export function LensPowerNotebookLesson({ onBackToConceptHub }: LensPowerNotebookLessonProps) {
  const [stillMode, setStillMode] = useReducedMotionPreference()

  // ---------------------------------------------------------------------------
  // 1. Stage & Pedagogical Progression State
  // ---------------------------------------------------------------------------
  const [activeStage, setActiveStage] = useState<LensPowerStageId>('predict')
  const [predictionChoice, setPredictionChoice] = useState<PredictionChoiceId | null>(null)
  const [predictionCommitted, setPredictionCommitted] = useState<boolean>(false)

  // ---------------------------------------------------------------------------
  // 2. Live Optical Bench Experiment State (Strictly separate from assessment)
  // ---------------------------------------------------------------------------
  const [activePresetId, setActivePresetId] = useState<'lens-a' | 'lens-b' | 'concave-c' | 'custom'>('lens-a')
  const [focalLengthCm, setFocalLengthCm] = useState<number>(20)
  const [focalDraft, setFocalDraft] = useState<string>('20')
  const [focalInputError, setFocalInputError] = useState<string | null>(null)

  const [compareOverlayActive, setCompareOverlayActive] = useState<boolean>(false)
  const [showFocalMarker, setShowFocalMarker] = useState<boolean>(true)
  const [showRuler, setShowRuler] = useState<boolean>(true)
  // Start ruler at +10 cm (unaligned) so the learner genuinely measures the focus in Stage B
  const [rulerCursorCm, setRulerCursorCm] = useState<number>(10)
  const [hasAttemptedRulerMeasurement, setHasAttemptedRulerMeasurement] = useState<boolean>(false)

  // ---------------------------------------------------------------------------
  // 3. Assessment & Practice State (Isolated from live bench exploration)
  // ---------------------------------------------------------------------------
  const [activeQuestionId, setActiveQuestionId] = useState<PracticeQuestionId>('q1')
  const [practiceAttempts, setPracticeAttempts] = useState<
    Record<PracticeQuestionId, PracticeAttemptState>
  >(() => createInitialAttemptsMap())

  // Polite screen-reader announcement region (only updated on deliberate user actions, never on continuous drag)
  const [srAnnouncement, setSrAnnouncement] = useState<string>('')

  const activeModel = calculateLensPowerModel({ focalLengthCm })
  const rulerEval = evaluateRulerMeasurement(rulerCursorCm, activeModel)

  // When "Compare Both Lenses" overlay is active on a convex configuration, overlay the reference convex lens
  const comparisonModel =
    compareOverlayActive && focalLengthCm > 0
      ? focalLengthCm === 20
        ? PRESET_LENSES['lens-b'].model
        : PRESET_LENSES['lens-a'].model
      : null

  const raysRevealed = predictionCommitted
  const showExactFocalValueOnMarker =
    predictionCommitted &&
    (activeStage !== 'experiment' || rulerEval.isAlignedWithFocus || hasAttemptedRulerMeasurement)

  const unrevealedLensLabel =
    activePresetId === 'lens-b'
      ? PRESET_LENSES['lens-b'].unrevealedLabel
      : PRESET_LENSES['lens-a'].unrevealedLabel

  // ---------------------------------------------------------------------------
  // Experiment Actions
  // ---------------------------------------------------------------------------
  function handleRulerChange(nextCm: number) {
    const clamped = Math.max(
      LENS_POWER_LIMITS.rulerCm.min,
      Math.min(LENS_POWER_LIMITS.rulerCm.max, Math.round(nextCm))
    )
    setRulerCursorCm(clamped)
    setHasAttemptedRulerMeasurement(true)
  }

  function handleAlignRulerHint() {
    setRulerCursorCm(activeModel.focalLengthCm)
    setHasAttemptedRulerMeasurement(true)
    setSrAnnouncement(
      `Aligned ruler caliper with principal focus ${activeModel.principalFocusPoint.label} at ${formatSignedValue(
        activeModel.focalLengthCm,
        0
      )} centimetres.`
    )
  }

  function selectPresetLens(presetId: 'lens-a' | 'lens-b' | 'concave-c') {
    const spec = PRESET_LENSES[presetId]
    setActivePresetId(presetId)
    setFocalLengthCm(spec.focalLengthCm)
    setFocalDraft(String(Math.abs(spec.focalLengthCm)))
    setFocalInputError(null)
    if (presetId === 'concave-c') {
      setCompareOverlayActive(false)
    }
    // Zero answer leakage before prediction is committed
    if (!predictionCommitted) {
      setSrAnnouncement(`Selected ${spec.unrevealedLabel}.`)
    } else {
      setSrAnnouncement(`Selected ${spec.revealedLabel}.`)
    }
  }

  function handleSignToggle(nextSign: '+' | '-') {
    const nextF = nextSign === '+' ? Math.abs(focalLengthCm) : -Math.abs(focalLengthCm)
    setActivePresetId(
      nextF === 20 ? 'lens-a' : nextF === 40 ? 'lens-b' : nextF === -25 ? 'concave-c' : 'custom'
    )
    setFocalLengthCm(nextF)
    setFocalInputError(null)
    if (nextF < 0) setCompareOverlayActive(false)
    setSrAnnouncement(
      nextSign === '+'
        ? `Switched to converging convex lens with f = +${Math.abs(nextF)} cm.`
        : `Switched to diverging concave lens with f = −${Math.abs(nextF)} cm.`
    )
  }

  function handleAbsFocalChange(raw: string) {
    setFocalDraft(raw)
    const sign = focalLengthCm >= 0 ? '+' : '-'
    const validation = validateFocalLengthCmInput(raw, '+')
    if (!validation.isValid || validation.parsedFocalLengthCm === null) {
      setFocalInputError(validation.errorMessage)
      return
    }
    setFocalInputError(null)
    const signedF = sign === '+' ? validation.parsedFocalLengthCm : -validation.parsedFocalLengthCm
    setFocalLengthCm(signedF)
    setActivePresetId(
      signedF === 20 ? 'lens-a' : signedF === 40 ? 'lens-b' : signedF === -25 ? 'concave-c' : 'custom'
    )
  }

  function handleCommitPrediction() {
    if (!predictionChoice) return
    setPredictionCommitted(true)
    setShowFocalMarker(true)
    setShowRuler(true)
    const evalRes = evaluateInitialPrediction(predictionChoice)
    setSrAnnouncement(`Prediction committed. ${evalRes.headline}`)
  }

  function handleStageChange(nextStage: LensPowerStageId) {
    // Prevent skipping Stage A before committing to the initial prediction
    if (!predictionCommitted && nextStage !== 'predict') {
      setSrAnnouncement('Please commit to a prediction in Stage A before unlocking the measurement stages.')
      return
    }
    const nextState = computeStageTransition(
      {
        activeStage,
        activePresetId,
        focalLengthCm,
        focalDraft,
        compareOverlayActive,
      },
      nextStage
    )
    setActiveStage(nextState.activeStage)
    setActivePresetId(nextState.activePresetId)
    setFocalLengthCm(nextState.focalLengthCm)
    setFocalDraft(nextState.focalDraft)
    setCompareOverlayActive(nextState.compareOverlayActive)
    setFocalInputError(null)
  }

  /** Resets only the optical bench experiment parameters without erasing prediction or practice answers */
  function handleResetExperiment() {
    setActivePresetId('lens-a')
    setFocalLengthCm(20)
    setFocalDraft('20')
    setFocalInputError(null)
    setCompareOverlayActive(false)
    setShowFocalMarker(true)
    setShowRuler(true)
    setRulerCursorCm(10)
    setSrAnnouncement(
      predictionCommitted
        ? 'Optical bench reset to Lens A (+20 cm) with ruler at +10 cm. Prediction and practice answers preserved.'
        : 'Optical bench reset to Lens A.'
    )
  }

  /** Restarts the entire lesson including prediction, stage progression, and all 6 practice attempts */
  function handleRestartLesson() {
    setActiveStage('predict')
    setPredictionChoice(null)
    setPredictionCommitted(false)
    setActivePresetId('lens-a')
    setFocalLengthCm(20)
    setFocalDraft('20')
    setFocalInputError(null)
    setCompareOverlayActive(false)
    setShowFocalMarker(true)
    setShowRuler(true)
    setRulerCursorCm(10)
    setHasAttemptedRulerMeasurement(false)
    setActiveQuestionId('q1')
    setPracticeAttempts(createInitialAttemptsMap())
    setSrAnnouncement('Entire lesson restarted from Stage A: Predict.')
  }

  // ---------------------------------------------------------------------------
  // Practice / Assessment Actions
  // ---------------------------------------------------------------------------
  const currentQuestion = LENS_POWER_PRACTICE_QUESTIONS.find((q) => q.id === activeQuestionId)!
  const currentAttempt = practiceAttempts[activeQuestionId]
  const currentEvaluation = currentAttempt.submitted
    ? evaluateLensPowerPractice(currentQuestion, currentAttempt)
    : null
  const completedCount = countCompletedPractice(practiceAttempts)

  function updateAttempt(id: PracticeQuestionId, patch: Partial<PracticeAttemptState>) {
    setPracticeAttempts((prev) => ({
      ...prev,
      [id]: { ...prev[id], ...patch },
    }))
  }

  function handleCheckPracticeAnswer() {
    const nextAttempt: PracticeAttemptState = {
      ...currentAttempt,
      submitted: true,
    }
    updateAttempt(activeQuestionId, { submitted: true })
    const res = evaluateLensPowerPractice(currentQuestion, nextAttempt)
    setSrAnnouncement(`${res.headline} ${res.feedback}`)
  }

  function handleRevealNextHint() {
    const nextCount = Math.min(2, currentAttempt.revealedHintCount + 1) as 0 | 1 | 2
    updateAttempt(activeQuestionId, { revealedHintCount: nextCount })
  }

  function handleLoadQuestionOnBench(fCm: number) {
    setFocalLengthCm(fCm)
    setFocalDraft(String(Math.abs(fCm)))
    setFocalInputError(null)
    setActivePresetId(
      fCm === 20 ? 'lens-a' : fCm === 40 ? 'lens-b' : fCm === -25 ? 'concave-c' : 'custom'
    )
    setCompareOverlayActive(fCm === 15)
    setSrAnnouncement(
      `Loaded f = ${formatSignedValue(fCm, 0)} cm onto the optical bench. Your practice answer stays locked to the question.`
    )
  }

  const predictionEval =
    predictionCommitted && predictionChoice ? evaluateInitialPrediction(predictionChoice) : null
  const committedPredictionOption = predictionChoice
    ? INITIAL_PREDICTION_OPTIONS.find((o) => o.id === predictionChoice)
    : null

  const currentStageIndex = LENS_POWER_STAGES.findIndex((s) => s.id === activeStage)

  return (
    <main
      className={`lp-notebook-page ${stillMode ? 'still-mode' : ''}`}
      aria-label="Lens Power and Dioptre Interactive Science Notebook"
    >
      <div className="sr-only" aria-live="polite">
        {srAnnouncement}
      </div>

      {/* ──────────────────────────────────────────────────────────────────────
          TOP NOTEBOOK HEADER & COMPACT STAGE NAVIGATION
          ────────────────────────────────────────────────────────────────────── */}
      <header className="lp-notebook-header">
        <div className="lp-header-top-row">
          <div className="lp-breadcrumbs">
            {onBackToConceptHub && (
              <button
                type="button"
                className="lp-back-btn"
                onClick={onBackToConceptHub}
              >
                ← Concept Hub
              </button>
            )}
            <span className="lp-chapter-pill">{LENS_POWER_SOURCE_METADATA.curriculum}</span>
            <span className="lp-provisional-pill">
              NCERT §9.3.8 · Thin-Lens Model
            </span>
          </div>

          <div className="lp-header-utilities">
            <button
              type="button"
              className="lp-util-btn"
              aria-pressed={stillMode}
              onClick={() => setStillMode((prev) => !prev)}
            >
              {stillMode ? 'Motion: Reduced' : 'Motion: Standard'}
            </button>
            <button
              type="button"
              className="lp-util-btn"
              onClick={handleResetExperiment}
              title="Reset the optical bench to Lens A without erasing your answers"
            >
              Reset Bench
            </button>
            <button
              type="button"
              className="lp-util-btn lp-util-btn-danger"
              onClick={handleRestartLesson}
              title="Clear prediction and practice progress and restart from Stage A"
            >
              Restart Lesson
            </button>
          </div>
        </div>

        <div className="lp-opening-question-banner">
          <p className="lp-notebook-eyebrow">Illustrated Optics Notebook · Investigation</p>
          <h1 className="lp-opening-h1">
            “Two lenses bend light differently. How can we measure which one is stronger?”
          </h1>
        </div>

        {/* Connected 6-Stage Progression Bar */}
        <nav className="lp-stage-stepper" aria-label="Lesson progression stages">
          {LENS_POWER_STAGES.map((stage, idx) => {
            const isCurrent = stage.id === activeStage
            const isVisited = idx < currentStageIndex || (stage.id === 'predict' && predictionCommitted)
            const isLocked = !predictionCommitted && stage.id !== 'predict'
            return (
              <button
                key={stage.id}
                type="button"
                className={`lp-stage-tab ${isCurrent ? 'is-active' : ''} ${
                  isVisited ? 'is-visited' : ''
                } ${isLocked ? 'is-locked' : ''}`}
                aria-current={isCurrent ? 'step' : undefined}
                aria-disabled={isLocked ? true : undefined}
                title={isLocked ? 'Commit to a prediction in Stage A first' : stage.title}
                onClick={() => handleStageChange(stage.id)}
              >
                <span className="lp-stage-dot" aria-hidden="true">
                  {isVisited && !isCurrent ? '✓' : stage.stepNumber}
                </span>
                <span>{stage.shortLabel}</span>
              </button>
            )
          })}
          <span className="lp-progress-summary" aria-label="Auto-graded practice progress">
            Auto-Graded: {completedCount}/{LENS_POWER_PRACTICE_QUESTIONS.length}
          </span>
        </nav>
      </header>

      {/* ──────────────────────────────────────────────────────────────────────
          CONNECTED WORKSPACE: CONTINUOUS BENCH + CONTEXTUAL STAGE SHEET
          ────────────────────────────────────────────────────────────────────── */}
      <div className="lp-notebook-spread">
        {/* LEFT / TOP DOMINANT REGION: THE INTERACTIVE OPTICAL BENCH */}
        <section className="lp-bench-column" aria-label="Interactive thin-lens optical bench">
          {/* Contextual Lens Selector & Comparison Bar directly above the diagram */}
          <div className="lp-bench-toolbar">
            <div className="lp-lens-selector-group" role="group" aria-label="Select lens on optical bench">
              <button
                type="button"
                className={`lp-lens-chip ${activePresetId === 'lens-a' ? 'is-selected' : ''}`}
                aria-pressed={activePresetId === 'lens-a'}
                onClick={() => selectPresetLens('lens-a')}
              >
                {raysRevealed
                  ? PRESET_LENSES['lens-a'].revealedLabel
                  : PRESET_LENSES['lens-a'].unrevealedLabel}
              </button>
              <button
                type="button"
                className={`lp-lens-chip ${activePresetId === 'lens-b' ? 'is-selected' : ''}`}
                aria-pressed={activePresetId === 'lens-b'}
                onClick={() => selectPresetLens('lens-b')}
              >
                {raysRevealed
                  ? PRESET_LENSES['lens-b'].revealedLabel
                  : PRESET_LENSES['lens-b'].unrevealedLabel}
              </button>
              {raysRevealed && (activeStage === 'contrast' || activeStage === 'apply' || focalLengthCm < 0) && (
                <button
                  type="button"
                  className={`lp-lens-chip lp-lens-chip-concave ${
                    activePresetId === 'concave-c' ? 'is-selected' : ''
                  }`}
                  aria-pressed={activePresetId === 'concave-c'}
                  onClick={() => selectPresetLens('concave-c')}
                >
                  {PRESET_LENSES['concave-c'].revealedLabel}
                </button>
              )}
            </div>

            {raysRevealed && (
              <div className="lp-bench-toggles">
                {focalLengthCm > 0 && (
                  <button
                    type="button"
                    className={`lp-toggle-pill ${compareOverlayActive ? 'is-on' : ''}`}
                    aria-pressed={compareOverlayActive}
                    onClick={() => setCompareOverlayActive((v) => !v)}
                  >
                    {compareOverlayActive ? '✓ Compare Overlay On' : 'Compare Both Lenses (Overlay)'}
                  </button>
                )}
                <button
                  type="button"
                  className={`lp-toggle-pill ${showFocalMarker ? 'is-on' : ''}`}
                  aria-pressed={showFocalMarker}
                  onClick={() => setShowFocalMarker((v) => !v)}
                >
                  {showFocalMarker ? '✓ Focus Marker F' : 'Show Focus Marker F'}
                </button>
                <button
                  type="button"
                  className={`lp-toggle-pill ${showRuler ? 'is-on' : ''}`}
                  aria-pressed={showRuler}
                  onClick={() => setShowRuler((v) => !v)}
                >
                  {showRuler ? '✓ Bench Ruler' : 'Show Bench Ruler'}
                </button>
              </div>
            )}
          </div>

          {/* Primary SVG Optical Diagram */}
          <LensPowerBenchSVG
            model={activeModel}
            unrevealedLensLabel={unrevealedLensLabel}
            comparisonModel={comparisonModel}
            raysRevealed={raysRevealed}
            showFocalMarker={showFocalMarker}
            showExactFocalValueOnMarker={showExactFocalValueOnMarker}
            showRuler={showRuler}
            rulerCursorCm={rulerCursorCm}
            onChangeRulerCursorCm={handleRulerChange}
            showEquationTag={activeStage === 'calculate' || activeStage === 'contrast' || activeStage === 'apply'}
            stillMode={stillMode}
          />

          {/* Contextual Controls directly attached to the bench (Shown once prediction is committed) */}
          {raysRevealed && (
            <div className="lp-bench-controls-strip">
              {/* Accessible Ruler Measurement Controls (No pointer dragging required) */}
              {showRuler && (
                <div className="lp-control-pod">
                  <div className="lp-pod-header">
                    <label htmlFor="lp-ruler-number" className="lp-pod-label">
                      Your Ruler Caliper Position (cm from O)
                    </label>
                    {/* Withhold auto-snap until the learner has attempted a measurement or is past Stage B */}
                    {(hasAttemptedRulerMeasurement || activeStage !== 'experiment') &&
                      !rulerEval.isAlignedWithFocus && (
                        <button
                          type="button"
                          className="lp-snap-btn"
                          onClick={handleAlignRulerHint}
                        >
                          Hint: Align Ruler with {activeModel.principalFocusPoint.label} (
                          {formatSignedValue(activeModel.focalLengthCm, 0)} cm)
                        </button>
                      )}
                  </div>
                  <div className="lp-dual-input-row">
                    <input
                      id="lp-ruler-slider"
                      type="range"
                      aria-label="Ruler caliper position slider in cm"
                      min={LENS_POWER_LIMITS.rulerCm.min}
                      max={LENS_POWER_LIMITS.rulerCm.max}
                      step={LENS_POWER_LIMITS.rulerCm.step}
                      value={rulerCursorCm}
                      onChange={(e) => handleRulerChange(Number(e.target.value))}
                    />
                    <input
                      id="lp-ruler-number"
                      type="number"
                      className="lp-num-input"
                      min={LENS_POWER_LIMITS.rulerCm.min}
                      max={LENS_POWER_LIMITS.rulerCm.max}
                      step={LENS_POWER_LIMITS.rulerCm.step}
                      value={rulerCursorCm}
                      onChange={(e) => {
                        const v = Number(e.target.value)
                        if (Number.isFinite(v)) handleRulerChange(v)
                      }}
                    />
                    <span className="lp-unit-tag">cm</span>
                  </div>
                  {/* Button alternatives to dragging for mobile & keyboard users */}
                  <div className="lp-step-btn-row" role="group" aria-label="Step ruler caliper position">
                    <button
                      type="button"
                      className="lp-step-btn"
                      onClick={() => handleRulerChange(rulerCursorCm - 5)}
                    >
                      −5 cm
                    </button>
                    <button
                      type="button"
                      className="lp-step-btn"
                      onClick={() => handleRulerChange(rulerCursorCm - 1)}
                    >
                      −1 cm
                    </button>
                    <button
                      type="button"
                      className="lp-step-btn"
                      onClick={() => handleRulerChange(rulerCursorCm + 1)}
                    >
                      +1 cm
                    </button>
                    <button
                      type="button"
                      className="lp-step-btn"
                      onClick={() => handleRulerChange(rulerCursorCm + 5)}
                    >
                      +5 cm
                    </button>
                  </div>
                  <p
                    className={`lp-ruler-status ${
                      rulerEval.isAlignedWithFocus ? 'is-aligned' : 'is-unaligned'
                    }`}
                  >
                    {rulerEval.statusMessage}
                  </p>
                </div>
              )}

              {/* Continuous Focal Length & Lens Type Control */}
              <div className="lp-control-pod">
                <div className="lp-pod-header">
                  <label htmlFor="lp-focal-number" className="lp-pod-label">
                    Configured Lens Focal Length |f| ({LENS_POWER_LIMITS.absFocalLengthCm.min}–
                    {LENS_POWER_LIMITS.absFocalLengthCm.max} cm)
                  </label>
                  <div className="lp-sign-switch" role="group" aria-label="Lens optical nature">
                    <button
                      type="button"
                      className={`lp-mini-sign-btn ${focalLengthCm > 0 ? 'is-active' : ''}`}
                      aria-pressed={focalLengthCm > 0}
                      onClick={() => handleSignToggle('+')}
                    >
                      +f (Convex)
                    </button>
                    <button
                      type="button"
                      className={`lp-mini-sign-btn ${focalLengthCm < 0 ? 'is-active' : ''}`}
                      aria-pressed={focalLengthCm < 0}
                      onClick={() => handleSignToggle('-')}
                    >
                      −f (Concave)
                    </button>
                  </div>
                </div>
                <div className="lp-dual-input-row">
                  <input
                    id="lp-focal-slider"
                    type="range"
                    aria-label="Configured lens focal length magnitude slider in cm"
                    min={LENS_POWER_LIMITS.absFocalLengthCm.min}
                    max={LENS_POWER_LIMITS.absFocalLengthCm.max}
                    step={1}
                    value={Math.abs(focalLengthCm)}
                    onChange={(e) => handleAbsFocalChange(e.target.value)}
                  />
                  <input
                    id="lp-focal-number"
                    type="number"
                    className="lp-num-input"
                    min={LENS_POWER_LIMITS.absFocalLengthCm.min}
                    max={LENS_POWER_LIMITS.absFocalLengthCm.max}
                    step={1}
                    value={focalDraft}
                    aria-invalid={focalInputError ? true : undefined}
                    onChange={(e) => handleAbsFocalChange(e.target.value)}
                  />
                  <span className="lp-unit-tag">cm</span>
                </div>
                <p className="lp-sheet-note">
                  Interactive Bench Range: <code>|f| = 10–50 cm</code> is chosen so the principal
                  focus always lies inside the calibrated <code>−50 cm to +50 cm</code> ruler.
                </p>
                {focalInputError && (
                  <p className="lp-input-error" role="alert">
                    {focalInputError}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Accessible Live Measurement Ledger: Explicitly Distinguishes Lens Model vs Learner's Ruler */}
          {raysRevealed && (
            <dl className="lp-live-ledger" aria-label="Optical bench model vs ruler measurement comparison">
              <div className="lp-ledger-cell">
                <dt>Lens Type</dt>
                <dd>
                  {activeModel.lensNature === 'converging'
                    ? 'Convex (+)'
                    : 'Concave (−)'}
                </dd>
              </div>
              <div className="lp-ledger-cell">
                <dt>Lens True Focus (f)</dt>
                <dd>
                  {formatSignedValue(activeModel.focalLengthCm, 0)} cm ({formatSignedValue(activeModel.focalLengthMetres, 2)} m)
                </dd>
              </div>
              <div className="lp-ledger-cell lp-ledger-cell-highlight">
                <dt>Lens True Power (P)</dt>
                <dd>{formatSignedValue(activeModel.powerDioptres, 2)} D</dd>
              </div>
              <div className="lp-ledger-cell">
                <dt>Your Ruler Position</dt>
                <dd>
                  {formatSignedValue(rulerEval.rulerPositionCm, 0)} cm{' '}
                  {rulerEval.isAlignedWithFocus ? '✓' : '(Unaligned)'}
                </dd>
              </div>
              <div className="lp-ledger-cell">
                <dt>Power at Ruler</dt>
                <dd>
                  {rulerEval.measuredPowerDioptres === null
                    ? 'Undefined (0 cm)'
                    : rulerEval.isAlignedWithFocus
                      ? `${formatSignedValue(rulerEval.measuredPowerDioptres, 2)} D ✓`
                      : `${formatSignedValue(rulerEval.measuredPowerDioptres, 2)} D (Align ruler)`}
                </dd>
              </div>
            </dl>
          )}
        </section>

        {/* RIGHT / BOTTOM NARRATIVE & INVESTIGATION SHEET */}
        <aside className="lp-narrative-column" aria-label="Notebook stage instructions and reasoning">
          {/* STAGE A: PREDICT */}
          {activeStage === 'predict' && (
            <div className="lp-stage-sheet">
              <div className="lp-sheet-badge">Stage A · Predict Before Revealing</div>
              <h2 className="lp-sheet-h2">
                Which lens will bring parallel rays together closer to the lens?
              </h2>
              <p className="lp-sheet-lead">
                On the optical bench, you can switch between two converging convex lenses made of
                the same optical glass: <strong>Lens A (more strongly curved)</strong> and{' '}
                <strong>Lens B (more gently curved)</strong>. Parallel rays enter from the left.
              </p>

              <fieldset className="lp-predict-fieldset">
                <legend className="lp-fieldset-legend">
                  Commit to your prediction to reveal the refracted rays and ruler:
                </legend>
                {INITIAL_PREDICTION_OPTIONS.map((opt) => (
                  <label
                    key={opt.id}
                    className={`lp-radio-card ${predictionChoice === opt.id ? 'is-checked' : ''}`}
                  >
                    <input
                      type="radio"
                      name="lp-initial-prediction"
                      checked={predictionChoice === opt.id}
                      onChange={() => setPredictionChoice(opt.id)}
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </fieldset>

              <div className="lp-sheet-actions">
                <button
                  type="button"
                  className="lp-primary-btn"
                  disabled={!predictionChoice}
                  onClick={handleCommitPrediction}
                >
                  {predictionCommitted ? 'Update Prediction on Bench' : 'Commit & Reveal Rays →'}
                </button>
                {predictionCommitted && (
                  <button
                    type="button"
                    className="lp-secondary-btn"
                    onClick={() => handleStageChange('experiment')}
                  >
                    Continue to Stage B: Experiment →
                  </button>
                )}
              </div>

              {predictionEval && (
                <div
                  className={`lp-callout ${
                    predictionEval.isCorrect ? 'lp-callout-success' : 'lp-callout-warn'
                  }`}
                  role="status"
                >
                  <h3>{predictionEval.headline}</h3>
                  <p>{predictionEval.explanation}</p>
                  <p className="lp-callout-prompt">{predictionEval.nextActionPrompt}</p>
                </div>
              )}
            </div>
          )}

          {/* STAGE B: EXPERIMENT */}
          {activeStage === 'experiment' && (
            <div className="lp-stage-sheet">
              <div className="lp-sheet-badge">Stage B · Experiment &amp; Measure</div>
              <h2 className="lp-sheet-h2">Measure Focal Distance &amp; Compare Both Lenses</h2>

              {/* Retained learner prediction from Stage A */}
              {committedPredictionOption && (
                <div className="lp-retained-prediction">
                  <strong>Your Stage A Prediction:</strong> “{committedPredictionOption.shortSummary}”{' '}
                  ({predictionChoice === 'lens-a-closer' ? 'Confirmed by bench ✓' : 'Compare with bench below'})
                </div>
              )}

              <p className="lp-sheet-lead">
                Keep the optical centre <strong>O (0 cm)</strong> fixed and test both lenses directly:
              </p>

              <ol className="lp-action-checklist">
                <li>
                  <strong>Align the Bench Ruler with F₂:</strong> Notice that the ruler caliper starts
                  at <code>+10 cm</code> (unaligned). Use the <code>+1 cm</code> / <code>+5 cm</code>{' '}
                  buttons, slider, or number box to move the caliper to the point <strong>F₂</strong>{' '}
                  where the parallel rays cross the axis.
                </li>
                <li>
                  <strong>Switch between Lens A (+20 cm) and Lens B (+40 cm):</strong> Observe how{' '}
                  <em>the same incoming parallel beam meets closer to Lens A than to Lens B</em>.
                </li>
                <li>
                  <strong>Overlay Both Configurations:</strong> Click{' '}
                  <button
                    type="button"
                    className="lp-inline-action"
                    onClick={() => setCompareOverlayActive((v) => !v)}
                  >
                    {compareOverlayActive ? 'Hide Comparison Overlay' : 'Compare Both Lenses (Overlay)'}
                  </button>{' '}
                  to see Active (solid line + circle focus) and Comparison (dash-dot line + square
                  focus) together.
                </li>
              </ol>

              <div className="lp-observation-box">
                <h3>Core Experimental Observation</h3>
                <p>
                  The same incoming parallel beam meets at{' '}
                  <strong>{formatSignedValue(activeModel.focalLengthCm, 0)} cm</strong> from the
                  optical centre O. Comparing <strong>Lens A (+20 cm)</strong> against{' '}
                  <strong>Lens B (+40 cm)</strong> shows that the lens with the{' '}
                  <em>shorter focal length</em> bends the parallel beam together in half the distance.
                </p>
              </div>

              {/* Optional drawer for ray-height deflection angle geometry */}
              <details className="lp-optional-drawer">
                <summary>Optional Geometry Note: Ray height, deflection angle, and thin-lens model</summary>
                <p>
                  In the ideal paraxial thin-lens model, all refraction is drawn at the principal
                  plane <em>x = 0 cm</em> and parallel rays at height <em>y</em> bend by{' '}
                  <code>tan(θ) = |y / f|</code> to meet at a single focus <em>F</em>: the outer ray
                  at <em>y = +6 cm</em> bends by{' '}
                  <code>{activeModel.parallelRays[0].deflectionAngleDeg}°</code>, the inner ray at{' '}
                  <em>y = +3 cm</em> bends by{' '}
                  <code>{activeModel.parallelRays[1].deflectionAngleDeg}°</code>, and the central
                  axial ray (<em>y = 0 cm</em>) passes through <em>O</em> undeviated (
                  <code>0°</code>). For screen legibility, the beam is drawn 12 cm tall (so steep
                  settings like <code>|f| = 10 cm</code> produce large visual angles), while the{' '}
                  <code>10–50 cm</code> slider range is chosen simply to keep <em>F</em> inside the{' '}
                  <code>−50 cm to +50 cm</code> bench ruler.
                </p>
              </details>

              <div className="lp-sheet-actions">
                <button
                  type="button"
                  className="lp-primary-btn"
                  onClick={() => handleStageChange('discover')}
                >
                  Next: Stage C — Discover the Rule →
                </button>
              </div>
            </div>
          )}

          {/* STAGE C: DISCOVER */}
          {activeStage === 'discover' && (
            <div className="lp-stage-sheet">
              <div className="lp-sheet-badge">Stage C · Discover the Relationship</div>
              <h2 className="lp-sheet-h2">Shorter Focal Length = Greater Bending Power</h2>
              <p className="lp-sheet-lead">
                The ability of a lens to converge or diverge light rays is called its{' '}
                <strong>Optical Power (P)</strong>.
              </p>

              <div className="lp-notebook-rule-box">
                <h3>Direct Link to Your Experiment</h3>
                <ul className="lp-bullet-list">
                  <li>
                    <strong>Lens A (f = +20 cm)</strong> brought the parallel beam together closer to O
                    than <strong>Lens B (f = +40 cm)</strong>.
                  </li>
                  <li>
                    Because a lens that focuses parallel rays at a <em>shorter</em> distance bends
                    light <em>more strongly</em>, optical power <strong>P</strong> is{' '}
                    <strong>inversely proportional</strong> to focal length <strong>f</strong>: halving{' '}
                    <em>f</em> doubles <em>P</em>.
                  </li>
                </ul>
              </div>

              <div className="lp-model-note">
                <strong>Ideal Thin-Lens Modelling Note:</strong> The diagram uses the ideal thin-lens
                construction (refraction at a single plane <em>x = 0 cm</em> with no spherical
                aberration). In our comparison of Lens A and Lens B, both lenses are assumed to use
                the same optical glass; in general, focal length depends on both the{' '}
                <em>radii of curvature of the surfaces</em> and the <em>refractive index</em>—not on
                centre thickness alone. The <code>10–50 cm</code> bench range is a display range
                chosen so <em>F₁</em> and <em>F₂</em> remain inside the calibrated{' '}
                <code>−50 cm to +50 cm</code> ruler.
              </div>

              <div className="lp-sheet-actions">
                <button
                  type="button"
                  className="lp-primary-btn"
                  onClick={() => handleStageChange('calculate')}
                >
                  Next: Stage D — Calculate in Dioptres →
                </button>
              </div>
            </div>
          )}

          {/* STAGE D: CALCULATE */}
          {activeStage === 'calculate' && (
            <div className="lp-stage-sheet">
              <div className="lp-sheet-badge">Stage D · Calculate &amp; Convert Units</div>
              <h2 className="lp-sheet-h2">The Formula P = 1 / f &amp; The Centimetre Trap</h2>

              <div className="lp-equation-card">
                <div className="lp-equation-main">P = 1 / f (in metres)</div>
                <ul className="lp-symbol-legend">
                  <li>
                    <strong>P</strong> = Optical power of the lens in <strong>dioptres (D)</strong>,
                    where <code>1 D = 1 m⁻¹</code>.
                  </li>
                  <li>
                    <strong>f</strong> = Signed focal length measured in <strong>metres (m)</strong>.
                  </li>
                </ul>
              </div>

              {/* Live visual pipeline connecting configured lens focal length to equation */}
              <div className="lp-conversion-pipeline" aria-label="Step-by-step unit conversion pipeline">
                <div className="lp-pipe-step">
                  <span className="lp-pipe-label">1. Lens Focal Length (cm)</span>
                  <strong className="lp-pipe-val">
                    f = {formatSignedValue(activeModel.focalLengthCm, 0)} cm
                  </strong>
                </div>
                <span className="lp-pipe-arrow" aria-hidden="true">
                  ÷ 100 →
                </span>
                <div className="lp-pipe-step">
                  <span className="lp-pipe-label">2. Convert to Metres (SI)</span>
                  <strong className="lp-pipe-val">
                    f = {formatSignedValue(activeModel.focalLengthMetres, 2)} m
                  </strong>
                </div>
                <span className="lp-pipe-arrow" aria-hidden="true">
                  1 / f →
                </span>
                <div className="lp-pipe-step lp-pipe-step-final">
                  <span className="lp-pipe-label">3. Power in Dioptres</span>
                  <strong className="lp-pipe-val">
                    P = {formatSignedValue(activeModel.powerDioptres, 2)} D
                  </strong>
                </div>
              </div>

              {/* Explicit distinction between Learner's Ruler Reading and True Lens Focal Length */}
              <div
                className={`lp-callout ${
                  rulerEval.isAlignedWithFocus ? 'lp-callout-success' : 'lp-callout-warn'
                }`}
              >
                <h3>
                  {rulerEval.isAlignedWithFocus
                    ? 'Ruler Reading Matches Principal Focus ✓'
                    : 'Ruler vs True Focus Check'}
                </h3>
                <p>
                  {rulerEval.isAlignedWithFocus ? (
                    <>
                      Your ruler caliper is aligned with <strong>{activeModel.principalFocusPoint.label}</strong> at{' '}
                      <code>{formatSignedValue(rulerEval.rulerPositionCm, 0)} cm</code> (
                      <code>{formatSignedValue(rulerEval.rulerPositionMetres, 2)} m</code>), giving{' '}
                      <code>P = {formatSignedValue(activeModel.powerDioptres, 2)} D</code>.
                    </>
                  ) : (
                    <>
                      Your ruler caliper is currently at{' '}
                      <code>{formatSignedValue(rulerEval.rulerPositionCm, 0)} cm</code> (which would
                      give{' '}
                      <code>
                        {rulerEval.measuredPowerDioptres === null
                          ? 'undefined'
                          : `${formatSignedValue(rulerEval.measuredPowerDioptres, 2)} D`}
                      </code>
                      ), whereas the lens’s true focus <strong>{activeModel.principalFocusPoint.label}</strong> is at{' '}
                      <code>{formatSignedValue(activeModel.focalLengthCm, 0)} cm</code> (
                      <code>P = {formatSignedValue(activeModel.powerDioptres, 2)} D</code>).{' '}
                      <button
                        type="button"
                        className="lp-inline-action"
                        onClick={handleAlignRulerHint}
                      >
                        Align Ruler with {activeModel.principalFocusPoint.label}
                      </button>
                    </>
                  )}
                </p>
              </div>

              {/* Worked example button & trap comparison */}
              <div className="lp-trap-comparison">
                <div className="lp-trap-col lp-trap-correct">
                  <h4>✅ Worked Example (+25 cm)</h4>
                  <p>
                    <code>+25 cm → +0.25 m → P = 1 / (+0.25 m) = +4.0 D</code>
                  </p>
                  {activeModel.focalLengthCm !== 25 && (
                    <button
                      type="button"
                      className="lp-inline-action"
                      onClick={() => handleLoadQuestionOnBench(25)}
                    >
                      Load +25 cm Worked Example on Bench
                    </button>
                  )}
                </div>
                <div className="lp-trap-col lp-trap-wrong">
                  <h4>⚠️ The #1 Board-Exam Mistake</h4>
                  <p>
                    Using cm directly gives{' '}
                    <del>
                      1 / {formatSignedValue(activeModel.focalLengthCm, 0)} ={' '}
                      {formatSignedValue(activeModel.unconvertedCmTrapPower, 3)} D
                    </del>
                    . Never divide 1 by centimetres without converting to metres!
                  </p>
                </div>
              </div>

              <div className="lp-sheet-actions">
                <button
                  type="button"
                  className="lp-primary-btn"
                  onClick={() => handleStageChange('contrast')}
                >
                  Next: Stage E — Contrast with Concave Lens →
                </button>
              </div>
            </div>
          )}

          {/* STAGE E: CONTRAST */}
          {activeStage === 'contrast' && (
            <div className="lp-stage-sheet">
              <div className="lp-sheet-badge">Stage E · Contrast: Diverging Concave Lens</div>
              <h2 className="lp-sheet-h2">
                Virtual Focus F₁ &amp; Why Diverging Power is Negative (−D)
              </h2>

              {activeModel.lensNature !== 'diverging' && (
                <div className="lp-callout lp-callout-warn">
                  <p>
                    Switch the optical bench to <strong>Lens C (Concave, f = −25 cm)</strong> to inspect
                    diverging rays and backward extensions:
                  </p>
                  <button
                    type="button"
                    className="lp-primary-btn"
                    onClick={() => selectPresetLens('concave-c')}
                  >
                    Switch Bench to Concave Lens (f = −25 cm)
                  </button>
                </div>
              )}

              <ul className="lp-bullet-list">
                <li>
                  <strong>Actual Rays vs Backward Extensions:</strong> On the bench, the{' '}
                  <strong>solid lines with arrowheads</strong> on the right are actual refracted light
                  rays spreading apart. The <strong>dashed construction lines</strong> on the left
                  (with no arrowheads) trace where the diverging rays appear to originate.
                </li>
                <li>
                  <strong>Virtual Principal Focus (F₁):</strong> Because the backward extensions meet on
                  the incident (left) side of the optical centre O, the Cartesian coordinate of the
                  focus is negative (<strong>f = {formatSignedValue(activeModel.focalLengthCm, 0)} cm ={' '}
                  {formatSignedValue(activeModel.focalLengthMetres, 2)} m</strong>).
                </li>
                <li>
                  <strong>What the Minus Sign Means:</strong> Substituting a negative{' '}
                  <em>f</em> into <code>P = 1 / f</code> yields{' '}
                  <strong>P = {formatSignedValue(activeModel.powerDioptres, 2)} D</strong>. The minus
                  sign tells an optician the lens <em>diverges</em> light—it does <strong>not</strong>{' '}
                  mean the lens is physically “weaker” than a positive lens!
                </li>
              </ul>

              <div className="lp-sheet-actions">
                <button
                  type="button"
                  className="lp-primary-btn"
                  onClick={() => handleStageChange('apply')}
                >
                  Next: Stage F — Apply &amp; Practice (6 Questions) →
                </button>
              </div>
            </div>
          )}

          {/* STAGE F: APPLY (6-QUESTION TARGETED PRACTICE SEQUENCE) */}
          {activeStage === 'apply' && (
            <div className="lp-stage-sheet">
              <div className="lp-sheet-badge">
                Stage F · Apply ({completedCount} of {LENS_POWER_PRACTICE_QUESTIONS.length} Auto-Graded
                Checks Completed)
              </div>
              <h2 className="lp-sheet-h2">Focused Practice &amp; Misconception Check</h2>
              <p className="lp-sheet-note">
                Exploring the optical bench on the left will never overwrite or alter your submitted
                answers below. Note: Q1–Q5 and Q6 Part A are auto-graded; Q6 Part B (written prose) is
                self-assessed using the 3-point rubric.
              </p>

              {/* 6-question numbered selector pills */}
              <div className="lp-question-tabs" role="tablist" aria-label="Practice questions">
                {LENS_POWER_PRACTICE_QUESTIONS.map((q) => {
                  const att = practiceAttempts[q.id]
                  const isDone =
                    att.submitted && evaluateLensPowerPractice(q, att).status === 'correct'
                  const isCurrent = q.id === activeQuestionId
                  return (
                    <button
                      key={q.id}
                      type="button"
                      role="tab"
                      aria-selected={isCurrent}
                      className={`lp-q-tab ${isCurrent ? 'is-active' : ''} ${
                        isDone ? 'is-correct' : ''
                      }`}
                      onClick={() => setActiveQuestionId(q.id)}
                    >
                      Q{q.stepNumber} {isDone ? '✓' : ''}
                    </button>
                  )
                })}
              </div>

              {/* Active Question Card */}
              <div className="lp-practice-box">
                <div className="lp-practice-header">
                  <span className="lp-q-category">{currentQuestion.categoryLabel}</span>
                  <button
                    type="button"
                    className="lp-inline-action"
                    onClick={() => handleLoadQuestionOnBench(currentQuestion.benchFocalLengthCm)}
                  >
                    Inspect f = {formatSignedValue(currentQuestion.benchFocalLengthCm, 0)} cm on Bench
                  </button>
                </div>

                <p className="lp-q-prompt">{currentQuestion.prompt}</p>

                {/* Choice or Structured-Explanation Part A input */}
                {(currentQuestion.kind === 'choice' ||
                  currentQuestion.kind === 'structured-explanation') &&
                  currentQuestion.options && (
                    <div className="lp-q-options">
                      {currentQuestion.kind === 'structured-explanation' && (
                        <span className="lp-pod-label">
                          Part A — Structured Scientific Claim (Rule-Evaluated):
                        </span>
                      )}
                      {currentQuestion.options.map((opt, idx) => (
                        <label
                          key={idx}
                          className={`lp-radio-card ${
                            currentAttempt.choiceIndex === idx ? 'is-checked' : ''
                          }`}
                        >
                          <input
                            type="radio"
                            name={`practice-${currentQuestion.id}`}
                            checked={currentAttempt.choiceIndex === idx}
                            onChange={() =>
                              updateAttempt(currentQuestion.id, {
                                choiceIndex: idx,
                                submitted: false,
                              })
                            }
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}

                {/* Part B Written Explanation + Transparent Self-Check Rubric for Question 6 */}
                {currentQuestion.kind === 'structured-explanation' && (
                  <div className="lp-written-explanation-block">
                    <label
                      htmlFor={`written-exp-${currentQuestion.id}`}
                      className="lp-pod-label"
                    >
                      Part B — Your Written Notebook Explanation (Self-Assessed · Not Auto-Graded):
                    </label>
                    <textarea
                      id={`written-exp-${currentQuestion.id}`}
                      rows={3}
                      className="lp-written-textarea"
                      placeholder="Write 1–2 sentences explaining why the lens is concave, why f = −0.20 m, and why P = −5.0 D..."
                      value={currentAttempt.writtenExplanationDraft}
                      onChange={(e) =>
                        updateAttempt(currentQuestion.id, {
                          writtenExplanationDraft: e.target.value,
                        })
                      }
                    />
                    <p className="lp-rubric-disclosure">
                      <strong>Evaluation Disclosure:</strong> Your written response above is{' '}
                      <strong>not automatically graded</strong> (entering text alone does not mark it
                      correct). Checking your answer evaluates Part A’s structured claim and reveals
                      the 3-point self-check rubric below so you can compare and revise your prose.
                    </p>
                    {currentAttempt.submitted && currentQuestion.selfCheckRubric && (
                      <div className="lp-rubric-box">
                        <h4>3-Point Self-Check Rubric (Based on NCERT §9.3.8):</h4>
                        <ul>
                          {currentQuestion.selfCheckRubric.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Numeric or Number + Reason input */}
                {(currentQuestion.kind === 'number' ||
                  currentQuestion.kind === 'number-and-reason') && (
                  <div className="lp-numeric-entry">
                    <label htmlFor={`num-input-${currentQuestion.id}`} className="lp-pod-label">
                      Your Numerical Answer ({currentQuestion.unitLabel}):
                    </label>
                    <div className="lp-num-row">
                      <input
                        id={`num-input-${currentQuestion.id}`}
                        type="number"
                        step="any"
                        className="lp-practice-number-input"
                        placeholder="e.g. 0.25, 4, or -40"
                        value={currentAttempt.numericDraft}
                        onChange={(e) =>
                          updateAttempt(currentQuestion.id, {
                            numericDraft: e.target.value,
                            submitted: false,
                          })
                        }
                      />
                      <span className="lp-unit-tag">{currentQuestion.unitLabel}</span>
                    </div>
                  </div>
                )}

                {/* Conceptual follow-up for number-and-reason questions */}
                {currentQuestion.kind === 'number-and-reason' &&
                  currentQuestion.followUpQuestion &&
                  currentQuestion.followUpOptions && (
                    <fieldset className="lp-followup-fieldset">
                      <legend className="lp-fieldset-legend">
                        Conceptual Reasoning Check: {currentQuestion.followUpQuestion}
                      </legend>
                      {currentQuestion.followUpOptions.map((opt, idx) => (
                        <label
                          key={idx}
                          className={`lp-radio-card ${
                            currentAttempt.followUpChoiceIndex === idx ? 'is-checked' : ''
                          }`}
                        >
                          <input
                            type="radio"
                            name={`followup-${currentQuestion.id}`}
                            checked={currentAttempt.followUpChoiceIndex === idx}
                            onChange={() =>
                              updateAttempt(currentQuestion.id, {
                                followUpChoiceIndex: idx,
                                submitted: false,
                              })
                            }
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </fieldset>
                  )}

                {/* Action buttons: Check Answer, Progressive Hints, Worked Solution */}
                <div className="lp-practice-actions">
                  <button
                    type="button"
                    className="lp-primary-btn"
                    onClick={handleCheckPracticeAnswer}
                  >
                    Check Answer
                  </button>

                  {currentAttempt.revealedHintCount < 2 && (
                    <button
                      type="button"
                      className="lp-secondary-btn"
                      onClick={handleRevealNextHint}
                    >
                      {currentAttempt.revealedHintCount === 0
                        ? 'Hint 1 (Observation)'
                        : 'Hint 2 (Reasoning Step)'}
                    </button>
                  )}

                  {currentAttempt.submitted && !currentAttempt.solutionRevealed && (
                    <button
                      type="button"
                      className="lp-secondary-btn"
                      onClick={() => updateAttempt(currentQuestion.id, { solutionRevealed: true })}
                    >
                      Show Worked Solution
                    </button>
                  )}
                </div>

                {/* Progressive Hints Display */}
                {currentAttempt.revealedHintCount >= 1 && (
                  <div className="lp-hints-stack">
                    <div className="lp-hint-item">
                      <strong>Hint 1 (Observation):</strong> {currentQuestion.hints[0]}
                    </div>
                    {currentAttempt.revealedHintCount >= 2 && (
                      <div className="lp-hint-item">
                        <strong>Hint 2 (Next Step):</strong> {currentQuestion.hints[1]}
                      </div>
                    )}
                  </div>
                )}

                {/* Misconception-Specific Evaluation Callout */}
                {currentEvaluation && (
                  <div
                    className={`lp-callout ${
                      currentEvaluation.status === 'correct'
                        ? 'lp-callout-success'
                        : 'lp-callout-warn'
                    }`}
                    role="status"
                  >
                    <h3>{currentEvaluation.headline}</h3>
                    <p>{currentEvaluation.feedback}</p>
                    {currentEvaluation.suggestReplayComparison && (
                      <button
                        type="button"
                        className="lp-inline-action"
                        onClick={() => {
                          handleLoadQuestionOnBench(15)
                          setCompareOverlayActive(true)
                        }}
                      >
                        Overlay &amp; Compare on Optical Bench →
                      </button>
                    )}
                  </div>
                )}

                {/* Worked Solution Box */}
                {currentAttempt.solutionRevealed && (
                  <div className="lp-worked-solution">
                    <h4>Worked Solution</h4>
                    <p className="lp-sol-formula">
                      <strong>Formula:</strong> <code>{currentQuestion.workedSolution.formula}</code>
                    </p>
                    <p className="lp-sol-sub">
                      <strong>Substitution:</strong>{' '}
                      <code>{currentQuestion.workedSolution.substitution}</code>
                    </p>
                    <p className="lp-sol-conc">{currentQuestion.workedSolution.conclusion}</p>
                  </div>
                )}

                {/* Next Question Stepper */}
                <div className="lp-next-q-row">
                  {currentQuestion.stepNumber < LENS_POWER_PRACTICE_QUESTIONS.length && (
                    <button
                      type="button"
                      className="lp-secondary-btn"
                      onClick={() => {
                        const nextQ =
                          LENS_POWER_PRACTICE_QUESTIONS[currentQuestion.stepNumber]
                        if (nextQ) setActiveQuestionId(nextQ.id)
                      }}
                    >
                      Next Question (Q{currentQuestion.stepNumber + 1}) →
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>
    </main>
  )
}
