import { useState } from 'react'
import {
  calculateConvexLens,
  type ConvexLensInput,
} from './convexLensModel'
import {
  createDraftsFromLensInput,
  formatLensNumber,
  formatSignedCm,
  INITIAL_LENS_INPUT,
  LENS_UI_LIMITS,
  validateLensDrafts,
  type LensFieldErrors,
  type LensInputDrafts,
} from './lensInputValidation'
import { LensRayDiagramSVG } from './LensRayDiagramSVG'
import {
  ALTERNATIVE_WORKED_EXAMPLES,
  CONCEPTUAL_PRACTICE_QUESTION,
  evaluateConceptualPracticeAnswer,
  evaluateNumericalPracticeAnswer,
  loadSetupOntoBenchState,
  NUMERICAL_PRACTICE_QUESTION,
  selectPracticeQuestionState,
  type AlternativeBenchAndPracticeState,
  type AlternativePresentationMode,
  type PracticeQuestionId,
} from './alternativeLensContent'

const PREDICTION_TARGET_SETUP: ConvexLensInput = {
  focalLengthCm: 15,
  objectDistanceCm: 9,
  objectHeightCm: 4,
  screenDistanceCm: 30,
}

const NCERT_TABLE_9_4_SUMMARY_ROWS: readonly {
  id: string
  objectPosition: string
  imagePosition: string
  relativeSize: string
  nature: string
  presetFactorOfF: number | null
}[] = [
  {
    id: 'infinity',
    objectPosition: 'At infinity (u → −∞)',
    imagePosition: 'At focus F₂ (+f)',
    relativeSize: 'Highly diminished, point-sized',
    nature: 'Real and inverted',
    presetFactorOfF: null,
  },
  {
    id: 'beyond_2f',
    objectPosition: 'Beyond 2F₁ (|u| > 2f)',
    imagePosition: 'Between F₂ and 2F₂',
    relativeSize: 'Diminished (|m| < 1)',
    nature: 'Real and inverted',
    presetFactorOfF: 2.5,
  },
  {
    id: 'at_2f',
    objectPosition: 'At 2F₁ (|u| = 2f)',
    imagePosition: 'At 2F₂ (v = +2f)',
    relativeSize: 'Same size (m = −1)',
    nature: 'Real and inverted',
    presetFactorOfF: 2.0,
  },
  {
    id: 'between_f_and_2f',
    objectPosition: 'Between F₁ and 2F₁ (f < |u| < 2f)',
    imagePosition: 'Beyond 2F₂ (v > +2f)',
    relativeSize: 'Enlarged (|m| > 1)',
    nature: 'Real and inverted',
    presetFactorOfF: 1.5,
  },
  {
    id: 'at_f',
    objectPosition: 'At focus F₁ (|u| = f)',
    imagePosition: 'At infinity (parallel rays)',
    relativeSize: 'Infinitely large / undefined',
    nature: 'Refracted rays parallel (no finite screen image)',
    presetFactorOfF: 1.0,
  },
  {
    id: 'within_f',
    objectPosition: 'Between focus F₁ and optical centre O (|u| < f)',
    imagePosition: 'On the same side of the lens as the object (v < 0)',
    relativeSize: 'Enlarged (m > +1)',
    nature: 'Virtual and erect (cannot be caught on screen)',
    presetFactorOfF: 0.6,
  },
]

export function AlternativeConvexLensLesson() {
  const [presentationMode, setPresentationMode] =
    useState<AlternativePresentationMode>('reading')

  const [benchAndPractice, setBenchAndPractice] =
    useState<AlternativeBenchAndPracticeState>(() => ({
      benchInput: INITIAL_LENS_INPUT,
      drafts: createDraftsFromLensInput(INITIAL_LENS_INPUT),
      selectedQuestionId: 'numerical-q1',
    }))

  const [fieldErrors, setFieldErrors] = useState<LensFieldErrors>({})
  const [statusAnnouncement, setStatusAnnouncement] = useState<string>('')

  // Stage 1: Prediction state
  const [predictionChoice, setPredictionChoice] = useState<number | null>(null)
  const [predictionCommitted, setPredictionCommitted] = useState<boolean>(false)
  const [predictionTestedOnBench, setPredictionTestedOnBench] =
    useState<boolean>(false)

  // Stage 6: Independent Practice state (preserved across question selection and mode switches)
  const [numericalDraft, setNumericalDraft] = useState<string>('')
  const [numericalSubmitted, setNumericalSubmitted] = useState<boolean>(false)
  const [conceptualChoice, setConceptualChoice] = useState<number | null>(null)
  const [conceptualSubmitted, setConceptualSubmitted] = useState<boolean>(false)

  const { benchInput, drafts, selectedQuestionId } = benchAndPractice
  const result = calculateConvexLens(benchInput)

  function updateFieldFromDraft(field: keyof LensInputDrafts, rawValue: string) {
    setBenchAndPractice((prev) => {
      const nextDrafts: LensInputDrafts = { ...prev.drafts, [field]: rawValue }
      const validation = validateLensDrafts(nextDrafts)
      setFieldErrors(validation.errors)
      return {
        ...prev,
        benchInput: validation.isValid ? validation.parsedInput : prev.benchInput,
        drafts: nextDrafts,
      }
    })
  }

  function updateObjectDistanceDirect(nextDistanceCm: number) {
    updateFieldFromDraft('objectDistanceCm', String(nextDistanceCm))
  }

  function updateScreenDistanceDirect(nextScreenCm: number) {
    updateFieldFromDraft('screenDistanceCm', String(nextScreenCm))
  }

  function handleApplySetupToBench(targetSetup: ConvexLensInput, label: string) {
    setBenchAndPractice((prev) => loadSetupOntoBenchState(prev, targetSetup))
    setFieldErrors({})
    setStatusAnnouncement(`Loaded setup onto optical bench: ${label}`)
  }

  function handleSnapScreen() {
    if (result.vCm === null || result.vCm <= 0) {
      return
    }
    const clampedScreen = Math.min(
      LENS_UI_LIMITS.screenDistanceCm.max,
      Math.max(
        LENS_UI_LIMITS.screenDistanceCm.min,
        Number(result.vCm.toFixed(1))
      )
    )
    const nextSetup: ConvexLensInput = {
      ...benchInput,
      screenDistanceCm: clampedScreen,
    }
    setBenchAndPractice((prev) => loadSetupOntoBenchState(prev, nextSetup))
    setFieldErrors({})
    setStatusAnnouncement(
      `Screen snapped to sharp real image at +${formatLensNumber(clampedScreen)} cm.`
    )
  }

  function handleTestPredictionOnBench() {
    setPredictionCommitted(true)
    setPredictionTestedOnBench(true)
    handleApplySetupToBench(
      PREDICTION_TARGET_SETUP,
      'Prediction test setup (|u| = 9 cm, f = 15 cm)'
    )
  }

  function handleSelectPracticeQuestion(questionId: PracticeQuestionId) {
    // Selecting a question strictly updates selectedQuestionId and does NOT change benchInput
    setBenchAndPractice((prev) => selectPracticeQuestionState(prev, questionId))
  }

  const numericalEvaluation = evaluateNumericalPracticeAnswer(numericalDraft)
  const conceptualEvaluation = evaluateConceptualPracticeAnswer(conceptualChoice)

  return (
    <main
      className={`alt-lens-page mode-${presentationMode}`}
      aria-label="Alternative Convex-Lens Lesson (/alternative)"
    >
      {/* Top Lesson Banner & Presentation Switcher */}
      <header className="alt-lens-header">
        <div className="alt-lens-title-block">
          <div className="alt-lens-eyebrow-row">
            <span className="alt-lens-chapter-tag">
              Class 10 Physics · Chapter 9: Light — Reflection and Refraction
            </span>
            <span className="alt-lens-provisional-pill">
              Provisional — educator and curriculum review pending
            </span>
          </div>
          <h1 className="alt-lens-h1">
            Can You Catch an Image? — How a Convex Lens Forms an Image
          </h1>
          <p className="alt-lens-subtitle">
            Investigate when a converging lens projects a real image onto a paper
            screen, why the screen goes blank inside the principal focus{' '}
            <span className="math-inline">F₁</span>, and how the thin-lens formula
            predicts both regimes.
          </p>
        </div>

        <div className="alt-lens-toolbar no-print">
          <div
            className="alt-mode-toggle"
            role="group"
            aria-label="Lesson presentation mode"
          >
            <button
              type="button"
              className={`alt-mode-btn ${
                presentationMode === 'reading' ? 'is-active' : ''
              }`}
              aria-pressed={presentationMode === 'reading'}
              onClick={() => setPresentationMode('reading')}
            >
              Read &amp; Learn
            </button>
            <button
              type="button"
              className={`alt-mode-btn ${
                presentationMode === 'immersive' ? 'is-active' : ''
              }`}
              aria-pressed={presentationMode === 'immersive'}
              onClick={() => setPresentationMode('immersive')}
            >
              Explore the Lens
            </button>
          </div>

          <button
            type="button"
            className="alt-print-btn"
            onClick={() => window.print()}
          >
            Print Lesson Sheet
          </button>
        </div>
      </header>

      {/* Screen-reader live region for bench load announcements */}
      <div className="sr-only" aria-live="polite">
        {statusAnnouncement}
      </div>

      {/* Sequence Progress Navigation */}
      <nav
        className="alt-sequence-nav no-print"
        aria-label="Lesson learning sequence"
      >
        <a href="#stage-1-predict" className="alt-seq-chip">
          1. Predict
        </a>
        <a href="#stage-2-experiment" className="alt-seq-chip">
          2. Experiment
        </a>
        <a href="#stage-3-feedback" className="alt-seq-chip">
          3. Feedback
        </a>
        <a href="#stage-4-explain" className="alt-seq-chip">
          4. Explain
        </a>
        <a href="#stage-5-examples" className="alt-seq-chip">
          5. Worked Examples
        </a>
        <a href="#stage-6-practice" className="alt-seq-chip">
          6. Independent Practice
        </a>
      </nav>

      <div className="alt-lens-workspace">
        {/* STAGE 1: PREDICTION */}
        <section
          id="stage-1-predict"
          className="alt-stage-card alt-stage-predict"
          aria-labelledby="heading-stage-1"
        >
          <div className="alt-stage-header">
            <span className="alt-stage-step">Stage 1 · Prediction</span>
            <h2 id="heading-stage-1">
              What do you predict?
            </h2>
          </div>

          <p className="alt-stage-lead">
            With a lens of <strong>f = +15 cm</strong>, a candle at{' '}
            <strong>30 cm</strong> gives a sharp image on the screen. Move the
            candle to <strong>9 cm</strong>, closer than the focus. What will the
            screen show?
          </p>

          <fieldset className="alt-predict-fieldset">
            <legend className="sr-only">
              Select your prediction for |u| = 9 cm with f = +15 cm
            </legend>
            {[
              'A smaller, inverted real image will form on the paper screen closer to the lens.',
              'No sharp image can be caught on the paper screen at any distance; looking back through the lens shows an enlarged, upright virtual image on the candle side.',
              'An upright real image will appear on the paper screen at +9 cm.',
            ].map((optionText, idx) => (
              <label
                key={idx}
                className={`alt-radio-option ${
                  predictionChoice === idx ? 'is-selected' : ''
                }`}
              >
                <input
                  type="radio"
                  name="alt-lens-prediction"
                  checked={predictionChoice === idx}
                  onChange={() => {
                    setPredictionChoice(idx)
                    setPredictionCommitted(true)
                  }}
                />
                <span>{optionText}</span>
              </label>
            ))}
          </fieldset>

          <div className="alt-stage-actions no-print">
            <button
              type="button"
              className="alt-action-btn primary"
              onClick={handleTestPredictionOnBench}
            >
              Test My Prediction on Bench (|u| = 9 cm)
            </button>
            <button
              type="button"
              className="alt-action-btn secondary"
              onClick={() =>
                handleApplySetupToBench(
                  INITIAL_LENS_INPUT,
                  'Starting setup at 2F₁ (|u| = 30 cm, f = 15 cm)'
                )
              }
            >
              Reset to 2F₁ Starting Setup (|u| = 30 cm)
            </button>
          </div>
        </section>

        {/* STAGE 2: ACCESSIBLE SVG OPTICAL BENCH EXPERIMENT */}
        <section
          id="stage-2-experiment"
          className="alt-stage-card alt-stage-experiment"
          aria-labelledby="heading-stage-2"
        >
          <div className="alt-stage-header">
            <div className="alt-stage-header-split">
              <div>
                <span className="alt-stage-step">
                  Stage 2 · Interactive Optical Bench
                </span>
                <h2 id="heading-stage-2">
                  Move the candle. Find the image.
                </h2>
              </div>
              <span className="alt-live-bench-badge">
                Current Setup
              </span>
            </div>
          </div>

          <div className="alt-bench-svg-container">
            <LensRayDiagramSVG
              result={result}
              onChangeObjectDistance={updateObjectDistanceDirect}
              onChangeScreenDistance={updateScreenDistanceDirect}
            />
          </div>

          {/* Preset Case Bar (NCERT Table 9.4 positions) */}
          <div
            className="alt-preset-bar no-print"
            role="group"
            aria-label="NCERT Table 9.4 object position presets"
          >
            <span className="alt-preset-label">Quick Bench Positions:</span>
            {[
              { label: 'Beyond 2F₁ (45 cm)', u: 45, s: 22.5 },
              { label: 'At 2F₁ (30 cm)', u: 30, s: 30 },
              { label: 'Between F₁ & 2F₁ (20 cm)', u: 20, s: 60 },
              { label: 'At Focus F₁ (15 cm)', u: 15, s: 40 },
              { label: 'Inside F₁ (9 cm)', u: 9, s: 30 },
            ].map((preset) => (
              <button
                key={preset.label}
                type="button"
                className={`alt-preset-chip ${
                  Math.abs(benchInput.objectDistanceCm - preset.u) < 0.2 &&
                  Math.abs(benchInput.focalLengthCm - 15) < 0.2
                    ? 'is-active'
                    : ''
                }`}
                onClick={() =>
                  handleApplySetupToBench(
                    {
                      focalLengthCm: 15,
                      objectDistanceCm: preset.u,
                      objectHeightCm: benchInput.objectHeightCm,
                      screenDistanceCm: preset.s,
                    },
                    preset.label
                  )
                }
              >
                {preset.label}
              </button>
            ))}
            <button
              type="button"
              className="alt-action-btn primary"
              disabled={result.vCm === null || result.vCm <= 0}
              onClick={handleSnapScreen}
              title={
                result.vCm !== null && result.vCm > 0
                  ? `Move screen to sharp image at +${formatLensNumber(result.vCm)} cm`
                  : 'Screen snap is only available when a real image forms on the right side (|u| > f)'
              }
            >
              Snap Screen to Sharp Image
            </button>
          </div>

          {/* Labelled Accessible Bench Controls */}
          <div className="alt-controls-grid">
            {/* Object Distance |u| */}
            <div className="alt-control-item">
              <div className="alt-control-label-row">
                <label htmlFor="alt-u-slider" className="alt-control-label">
                  Object Distance |u| (cm)
                </label>
                <span className="alt-signed-pill">
                  Signed u = {formatSignedCm(result.uCm)}
                </span>
              </div>
              <div className="alt-control-inputs">
                <input
                  id="alt-u-slider"
                  type="range"
                  min={LENS_UI_LIMITS.objectDistanceCm.min}
                  max={LENS_UI_LIMITS.objectDistanceCm.max}
                  step={LENS_UI_LIMITS.objectDistanceCm.step}
                  value={benchInput.objectDistanceCm}
                  onChange={(e) =>
                    updateFieldFromDraft('objectDistanceCm', e.target.value)
                  }
                />
                <input
                  id="alt-u-number"
                  type="number"
                  aria-label="Object Distance |u| in cm (numeric entry)"
                  min={LENS_UI_LIMITS.objectDistanceCm.min}
                  max={LENS_UI_LIMITS.objectDistanceCm.max}
                  step={LENS_UI_LIMITS.objectDistanceCm.step}
                  value={drafts.objectDistanceCm}
                  onChange={(e) =>
                    updateFieldFromDraft('objectDistanceCm', e.target.value)
                  }
                  className="alt-number-input"
                />
              </div>
              {fieldErrors.objectDistanceCm && (
                <p className="alt-field-error" role="alert">
                  {fieldErrors.objectDistanceCm}
                </p>
              )}
            </div>

            {/* Screen Position d_s */}
            <div className="alt-control-item">
              <div className="alt-control-label-row">
                <label htmlFor="alt-screen-slider" className="alt-control-label">
                  Paper Screen Position d_s (cm)
                </label>
                <span className="alt-signed-pill">
                  +{formatLensNumber(benchInput.screenDistanceCm)} cm
                </span>
              </div>
              <div className="alt-control-inputs">
                <input
                  id="alt-screen-slider"
                  type="range"
                  min={LENS_UI_LIMITS.screenDistanceCm.min}
                  max={LENS_UI_LIMITS.screenDistanceCm.max}
                  step={LENS_UI_LIMITS.screenDistanceCm.step}
                  value={benchInput.screenDistanceCm}
                  onChange={(e) =>
                    updateFieldFromDraft('screenDistanceCm', e.target.value)
                  }
                />
                <input
                  id="alt-screen-number"
                  type="number"
                  aria-label="Paper Screen Position d_s in cm (numeric entry)"
                  min={LENS_UI_LIMITS.screenDistanceCm.min}
                  max={LENS_UI_LIMITS.screenDistanceCm.max}
                  step={LENS_UI_LIMITS.screenDistanceCm.step}
                  value={drafts.screenDistanceCm}
                  onChange={(e) =>
                    updateFieldFromDraft('screenDistanceCm', e.target.value)
                  }
                  className="alt-number-input"
                />
              </div>
              {fieldErrors.screenDistanceCm && (
                <p className="alt-field-error" role="alert">
                  {fieldErrors.screenDistanceCm}
                </p>
              )}
            </div>

            {/* Focal Length f */}
            <div className="alt-control-item">
              <div className="alt-control-label-row">
                <label htmlFor="alt-f-slider" className="alt-control-label">
                  Focal Length f (cm)
                </label>
                <span className="alt-signed-pill">
                  f = +{formatLensNumber(result.fCm)} cm
                </span>
              </div>
              <div className="alt-control-inputs">
                <input
                  id="alt-f-slider"
                  type="range"
                  min={LENS_UI_LIMITS.focalLengthCm.min}
                  max={LENS_UI_LIMITS.focalLengthCm.max}
                  step={LENS_UI_LIMITS.focalLengthCm.step}
                  value={benchInput.focalLengthCm}
                  onChange={(e) =>
                    updateFieldFromDraft('focalLengthCm', e.target.value)
                  }
                />
                <input
                  id="alt-f-number"
                  type="number"
                  aria-label="Focal Length f in cm (numeric entry)"
                  min={LENS_UI_LIMITS.focalLengthCm.min}
                  max={LENS_UI_LIMITS.focalLengthCm.max}
                  step={LENS_UI_LIMITS.focalLengthCm.step}
                  value={drafts.focalLengthCm}
                  onChange={(e) =>
                    updateFieldFromDraft('focalLengthCm', e.target.value)
                  }
                  className="alt-number-input"
                />
              </div>
              {fieldErrors.focalLengthCm && (
                <p className="alt-field-error" role="alert">
                  {fieldErrors.focalLengthCm}
                </p>
              )}
            </div>

            {/* Object Height h */}
            <div className="alt-control-item">
              <div className="alt-control-label-row">
                <label htmlFor="alt-h-slider" className="alt-control-label">
                  Object Height h (cm)
                </label>
                <span className="alt-signed-pill">
                  h = +{formatLensNumber(result.objectHeightCm)} cm
                </span>
              </div>
              <div className="alt-control-inputs">
                <input
                  id="alt-h-slider"
                  type="range"
                  min={LENS_UI_LIMITS.objectHeightCm.min}
                  max={LENS_UI_LIMITS.objectHeightCm.max}
                  step={LENS_UI_LIMITS.objectHeightCm.step}
                  value={benchInput.objectHeightCm}
                  onChange={(e) =>
                    updateFieldFromDraft('objectHeightCm', e.target.value)
                  }
                />
                <input
                  id="alt-h-number"
                  type="number"
                  aria-label="Object Height h in cm (numeric entry)"
                  min={LENS_UI_LIMITS.objectHeightCm.min}
                  max={LENS_UI_LIMITS.objectHeightCm.max}
                  step={LENS_UI_LIMITS.objectHeightCm.step}
                  value={drafts.objectHeightCm}
                  onChange={(e) =>
                    updateFieldFromDraft('objectHeightCm', e.target.value)
                  }
                  className="alt-number-input"
                />
              </div>
              {fieldErrors.objectHeightCm && (
                <p className="alt-field-error" role="alert">
                  {fieldErrors.objectHeightCm}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* STAGE 3: FEEDBACK (LIVE BENCH & PREDICTION OUTCOME) */}
        <section
          id="stage-3-feedback"
          className="alt-stage-card alt-stage-feedback"
          aria-labelledby="heading-stage-3"
        >
          <div className="alt-stage-header">
            <div className="alt-stage-header-split">
              <div>
                <span className="alt-stage-step">
                  Stage 3 · Observation &amp; Feedback
                </span>
                <h2 id="heading-stage-3">
                  What the Optical Bench Shows Right Now
                </h2>
              </div>
              <span className="alt-live-bench-badge">
                Updates as you move things
              </span>
            </div>
          </div>

          {/* Live Readout Strip */}
          <div className="alt-readout-grid" aria-label="Live optical bench readouts">
            <div className="alt-readout-box">
              <span className="alt-readout-label">Signed Object (u)</span>
              <strong className="alt-readout-value">
                {formatSignedCm(result.uCm)}
              </strong>
            </div>
            <div className="alt-readout-box">
              <span className="alt-readout-label">Focal Length (f)</span>
              <strong className="alt-readout-value">
                +{formatLensNumber(result.fCm)} cm
              </strong>
            </div>
            <div className="alt-readout-box">
              <span className="alt-readout-label">Signed Image (v)</span>
              <strong className="alt-readout-value">
                {result.vCm === null ? '±∞ (Parallel)' : formatSignedCm(result.vCm)}
              </strong>
            </div>
            <div className="alt-readout-box">
              <span className="alt-readout-label">Magnification (m = v/u)</span>
              <strong className="alt-readout-value">
                {result.magnification === null
                  ? 'Undefined'
                  : `${result.magnification > 0 ? '+' : ''}${formatLensNumber(
                      result.magnification,
                      2
                    )}×`}
              </strong>
            </div>
            <div className="alt-readout-box">
              <span className="alt-readout-label">Image Height (h&apos;)</span>
              <strong className="alt-readout-value">
                {result.imageHeightCm === null
                  ? 'Undefined'
                  : formatSignedCm(result.imageHeightCm)}
              </strong>
            </div>
            <div className="alt-readout-box">
              <span className="alt-readout-label">Lens Power (P = 1/f_m)</span>
              <strong className="alt-readout-value">
                +{formatLensNumber(result.opticalPowerDioptre, 2)} D
              </strong>
            </div>
          </div>

          <div className="alt-feedback-callout">
            <h3>
              {result.imageNature === 'real_inverted'
                ? `Real & Inverted Image (${result.relativeSize.replace('_', ' ')}) — ${result.objectPositionLabel}`
                : result.imageNature === 'virtual_erect'
                ? `Virtual & Erect Image (${result.relativeSize.replace('_', ' ')}) — Cannot Be Caught on Screen`
                : `Focal Boundary (|u| = f) — Refracted Rays Emerge Parallel`}
            </h3>
            <p>{result.screenStatusText}</p>
            <p className="alt-feedback-detail">
              Object: {result.objectPositionLabel} · Image:{' '}
              {result.imagePositionLabel}
            </p>
          </div>

          {(predictionCommitted || predictionTestedOnBench) && (
            <div
              className={`alt-prediction-review ${
                predictionChoice === 1 ? 'is-correct' : 'is-review'
              }`}
            >
              <h4>Prediction Check (for |u| = 9 cm inside F₁ = 15 cm):</h4>
              {predictionChoice === 1 ? (
                <p>
                  <strong>Confirmed!</strong> You predicted that the paper screen
                  cannot catch the image when <span className="math-inline">|u| &lt; f</span>.
                  At <span className="math-inline">u = −9 cm</span> and{' '}
                  <span className="math-inline">f = +15 cm</span>, the refracted rays
                  diverge on the right side and trace backward (dashed lines) to a
                  virtual, upright, magnified image at{' '}
                  <span className="math-inline">v = −22.5 cm</span> on the candle side.
                </p>
              ) : (
                <p>
                  <strong>Compare with the ray diagram:</strong> When the object is
                  inside <span className="math-inline">F₁</span> (
                  <span className="math-inline">|u| = 9 cm &lt; f = 15 cm</span>),
                  the lens cannot bend the strongly diverging incident rays enough to
                  converge on the right side. The paper screen only receives a diffuse
                  blur, while backward ray extensions meet at{' '}
                  <span className="math-inline">v = −22.5 cm</span> on the object side
                  to form an upright virtual image.
                </p>
              )}
            </div>
          )}
        </section>

        {/* STAGE 4: EXPLANATION */}
        <section
          id="stage-4-explain"
          className="alt-stage-card alt-stage-explain"
          aria-labelledby="heading-stage-4"
        >
          <div className="alt-stage-header">
            <span className="alt-stage-step">
              Stage 4 · Scientific Explanation
            </span>
            <h2 id="heading-stage-4">
              How Ray Construction and the Thin-Lens Formula Connect
            </h2>
          </div>

          <div className="alt-explain-columns">
            <article className="alt-explain-card">
              <h3>1. Three Principal Rays (NCERT Section 9.3.4)</h3>
              <ul>
                <li>
                  <strong>Ray 1 (Parallel → F₂):</strong> A ray from the object tip
                  parallel to the principal axis refracts through the principal focus{' '}
                  <span className="math-inline">F₂ (+f, 0)</span> on the right side.
                </li>
                <li>
                  <strong>Ray 2 (Through O → Undeviated):</strong> A ray passing
                  through the optical centre <span className="math-inline">O(0, 0)</span>{' '}
                  continues straight without deviation.
                </li>
                <li>
                  <strong>Ray 3 (Through F₁ → Parallel):</strong> A ray passing
                  through (or directed from) <span className="math-inline">F₁ (−f, 0)</span>{' '}
                  emerges parallel to the principal axis after refraction.
                </li>
              </ul>
            </article>

            <article className="alt-explain-card">
              <h3>
                2. Sign Convention, Lens Formula &amp; Power (Sections 9.3.6–9.3.8)
              </h3>
              <ul>
                <li>
                  <strong>New Cartesian Sign Convention:</strong> Optical centre{' '}
                  <span className="math-inline">O</span> is the origin. The object is
                  placed to the left, so <span className="math-inline">u &lt; 0</span>.
                  For a convex lens, <span className="math-inline">f &gt; 0</span>.
                </li>
                <li>
                  <strong>Thin-Lens Formula:</strong>{' '}
                  <span className="math-inline">1/v − 1/u = 1/f</span>, or{' '}
                  <span className="math-inline">1/v = 1/f + 1/u</span>. When{' '}
                  <span className="math-inline">|u| &gt; f</span>,{' '}
                  <span className="math-inline">v &gt; 0</span> (real image on right).
                  When <span className="math-inline">|u| &lt; f</span>,{' '}
                  <span className="math-inline">v &lt; 0</span> (virtual image on left).
                </li>
                <li>
                  <strong>Magnification &amp; Power:</strong>{' '}
                  <span className="math-inline">m = h&apos;/h = v/u</span> and{' '}
                  <span className="math-inline">P = 1/f(in m) = 100/f(in cm)</span> in
                  dioptres (D).
                </li>
              </ul>
            </article>
          </div>

          {/* NCERT Table 9.4 Summary */}
          <div className="alt-table-wrapper">
            <h3 className="alt-table-heading">
              Summary of Image Formation by a Convex Lens (NCERT Table 9.4)
            </h3>
            <table className="alt-ncert-table">
              <thead>
                <tr>
                  <th scope="col">Object Position</th>
                  <th scope="col">Image Position</th>
                  <th scope="col">Relative Size</th>
                  <th scope="col">Nature of Image</th>
                  <th scope="col" className="no-print">
                    Bench Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {NCERT_TABLE_9_4_SUMMARY_ROWS.map((row) => (
                  <tr key={row.id}>
                    <td>{row.objectPosition}</td>
                    <td>{row.imagePosition}</td>
                    <td>{row.relativeSize}</td>
                    <td>{row.nature}</td>
                    <td className="no-print">
                      {row.presetFactorOfF !== null ? (
                        <button
                          type="button"
                          className="alt-table-load-btn"
                          onClick={() => {
                            const nextU = Number(
                              (
                                benchInput.focalLengthCm * row.presetFactorOfF!
                              ).toFixed(1)
                            )
                            const preview = calculateConvexLens({
                              ...benchInput,
                              objectDistanceCm: nextU,
                            })
                            handleApplySetupToBench(
                              {
                                ...benchInput,
                                objectDistanceCm: nextU,
                                screenDistanceCm:
                                  preview.vCm !== null && preview.vCm > 0
                                    ? Math.min(90, Math.max(5, preview.vCm))
                                    : benchInput.screenDistanceCm,
                              },
                              `NCERT Table 9.4: ${row.objectPosition}`
                            )
                          }}
                        >
                          Load ({row.presetFactorOfF}f)
                        </button>
                      ) : (
                        <span className="alt-table-ref-note">
                          Reference limit (u → −∞)
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* STAGE 5: WORKED EXAMPLES (ONE REAL, ONE VIRTUAL — FIXED INPUTS) */}
        <section
          id="stage-5-examples"
          className="alt-stage-card alt-stage-examples"
          aria-labelledby="heading-stage-5"
        >
          <div className="alt-stage-header">
            <div className="alt-stage-header-split">
              <div>
                <span className="alt-stage-step">Stage 5 · Worked Examples</span>
                <h2 id="heading-stage-5">
                  Worked Examples
                </h2>
              </div>
              <span className="alt-static-example-badge">
                Fixed numbers — not linked to your bench
              </span>
            </div>
          </div>

          <p className="alt-stage-lead">
            The two worked examples below are calculated directly from their own
            stated inputs using the thin-lens model. Adjusting the live optical
            bench sliders above will <strong>never</strong> alter the numbers in
            these worked solutions.
          </p>

          <div className="alt-examples-grid">
            {ALTERNATIVE_WORKED_EXAMPLES.map((example) => (
              <article
                key={example.id}
                className="alt-example-card"
                aria-labelledby={`title-${example.id}`}
              >
                <div className="alt-example-card-top">
                  <span className="alt-example-badge">{example.badge}</span>
                  <span className="alt-example-fixed-tag">
                    Static Example Inputs: f = +{example.input.focalLengthCm} cm, |u| ={' '}
                    {example.input.objectDistanceCm} cm, h ={' '}
                    {example.input.objectHeightCm} cm
                  </span>
                </div>

                <h3 id={`title-${example.id}`}>{example.title}</h3>
                <p className="alt-example-scenario">{example.scenarioSummary}</p>

                <ol className="alt-example-steps">
                  {example.steps.map((step) => (
                    <li key={step.heading} className="alt-example-step">
                      <strong>{step.heading}</strong>
                      <div className="alt-formula-line">{step.formula}</div>
                      <div className="alt-substitution-line">
                        {step.substitution}
                      </div>
                      <p className="alt-step-conclusion">{step.conclusion}</p>
                    </li>
                  ))}
                </ol>

                <div className="alt-example-footer no-print">
                  <button
                    type="button"
                    className="alt-action-btn secondary"
                    onClick={() =>
                      handleApplySetupToBench(example.input, example.title)
                    }
                  >
                    Load Example on Bench (f = {example.input.focalLengthCm} cm, |u| ={' '}
                    {example.input.objectDistanceCm} cm)
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* STAGE 6: INDEPENDENT PRACTICE (1 NUMERICAL, 1 CONCEPTUAL) */}
        <section
          id="stage-6-practice"
          className="alt-stage-card alt-stage-practice"
          aria-labelledby="heading-stage-6"
        >
          <div className="alt-stage-header">
            <div className="alt-stage-header-split">
              <div>
                <span className="alt-stage-step">
                  Stage 6 · Independent Practice
                </span>
                <h2 id="heading-stage-6">
                  Check Your Understanding (Numerical &amp; Conceptual)
                </h2>
              </div>
              <span className="alt-static-example-badge">
                Choosing a question keeps your setup
              </span>
            </div>
          </div>

          <p className="alt-stage-lead">
            Switch between the numerical and conceptual practice problems below.
            Selecting a question leaves your optical bench untouched; click{' '}
            <strong>Load on Bench</strong> only if you want to set up that
            problem on the optical bench.
          </p>

          {/* Question Selector Tabs */}
          <div
            className="alt-practice-tabs no-print"
            role="tablist"
            aria-label="Practice questions"
          >
            <button
              type="button"
              role="tab"
              id="tab-numerical-q1"
              aria-selected={selectedQuestionId === 'numerical-q1'}
              aria-controls="panel-numerical-q1"
              className={`alt-practice-tab ${
                selectedQuestionId === 'numerical-q1' ? 'is-active' : ''
              }`}
              onClick={() => handleSelectPracticeQuestion('numerical-q1')}
            >
              1. Numerical Question (Beyond 2F₁)
            </button>
            <button
              type="button"
              role="tab"
              id="tab-conceptual-q2"
              aria-selected={selectedQuestionId === 'conceptual-q2'}
              aria-controls="panel-conceptual-q2"
              className={`alt-practice-tab ${
                selectedQuestionId === 'conceptual-q2' ? 'is-active' : ''
              }`}
              onClick={() => handleSelectPracticeQuestion('conceptual-q2')}
            >
              2. Conceptual Question (Inside F₁)
            </button>
          </div>

          {/* Numerical Question Panel */}
          <div
            id="panel-numerical-q1"
            role="tabpanel"
            aria-labelledby="tab-numerical-q1"
            className={`alt-practice-panel ${
              selectedQuestionId === 'numerical-q1' ? 'is-visible' : 'print-only-block'
            }`}
            hidden={selectedQuestionId !== 'numerical-q1'}
          >
            <div className="alt-practice-card">
              <div className="alt-practice-card-header">
                <h3>{NUMERICAL_PRACTICE_QUESTION.title}</h3>
                <button
                  type="button"
                  className="alt-action-btn secondary no-print"
                  onClick={() =>
                    handleApplySetupToBench(
                      NUMERICAL_PRACTICE_QUESTION.benchSetup,
                      NUMERICAL_PRACTICE_QUESTION.title
                    )
                  }
                >
                  Load on Bench
                </button>
              </div>

              <p className="alt-practice-prompt">
                {NUMERICAL_PRACTICE_QUESTION.prompt}
              </p>

              <div className="alt-numerical-entry-row no-print">
                <label htmlFor="alt-num-q1-input" className="alt-control-label">
                  Your calculated image position v (in cm):
                </label>
                <input
                  id="alt-num-q1-input"
                  type="text"
                  inputMode="decimal"
                  placeholder="Enter signed v"
                  value={numericalDraft}
                  onChange={(e) => {
                    setNumericalDraft(e.target.value)
                    setNumericalSubmitted(false)
                  }}
                  className="alt-practice-input"
                />
                <button
                  type="button"
                  className="alt-action-btn primary"
                  onClick={() => setNumericalSubmitted(true)}
                >
                  Check Numerical Answer
                </button>
              </div>

              {numericalSubmitted && (
                <div
                  className={`alt-practice-feedback status-${numericalEvaluation.status}`}
                  role="status"
                >
                  <p>{numericalEvaluation.message}</p>
                </div>
              )}

              <details className="alt-solution-details">
                <summary>Worked solution for Question 1</summary>
                <p>{NUMERICAL_PRACTICE_QUESTION.correctExplanation.replace(/^Correct!\s*/, '')}</p>
              </details>
            </div>
          </div>

          {/* Conceptual Question Panel */}
          <div
            id="panel-conceptual-q2"
            role="tabpanel"
            aria-labelledby="tab-conceptual-q2"
            className={`alt-practice-panel ${
              selectedQuestionId === 'conceptual-q2' ? 'is-visible' : 'print-only-block'
            }`}
            hidden={selectedQuestionId !== 'conceptual-q2'}
          >
            <div className="alt-practice-card">
              <div className="alt-practice-card-header">
                <h3>{CONCEPTUAL_PRACTICE_QUESTION.title}</h3>
                <button
                  type="button"
                  className="alt-action-btn secondary no-print"
                  onClick={() =>
                    handleApplySetupToBench(
                      CONCEPTUAL_PRACTICE_QUESTION.benchSetup,
                      CONCEPTUAL_PRACTICE_QUESTION.title
                    )
                  }
                >
                  Load on Bench
                </button>
              </div>

              <p className="alt-practice-prompt">
                {CONCEPTUAL_PRACTICE_QUESTION.prompt}
              </p>

              <fieldset className="alt-predict-fieldset">
                <legend className="sr-only">
                  Select the best explanation for Question 2
                </legend>
                {CONCEPTUAL_PRACTICE_QUESTION.options.map((opt, idx) => (
                  <label
                    key={idx}
                    className={`alt-radio-option ${
                      conceptualChoice === idx ? 'is-selected' : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="alt-conceptual-q2"
                      checked={conceptualChoice === idx}
                      onChange={() => {
                        setConceptualChoice(idx)
                        setConceptualSubmitted(false)
                      }}
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </fieldset>

              <div className="alt-stage-actions no-print">
                <button
                  type="button"
                  className="alt-action-btn primary"
                  onClick={() => setConceptualSubmitted(true)}
                >
                  Check Conceptual Answer
                </button>
              </div>

              {conceptualSubmitted && (
                <div
                  className={`alt-practice-feedback status-${conceptualEvaluation.status}`}
                  role="status"
                >
                  <p>{conceptualEvaluation.message}</p>
                </div>
              )}

              <details className="alt-solution-details">
                <summary>Worked explanation for Question 2</summary>
                <p>{CONCEPTUAL_PRACTICE_QUESTION.correctExplanation.replace(/^Correct!\s*/, '')}</p>
              </details>
            </div>
          </div>
        </section>
      </div>

      {/* SOURCE, ASSUMPTIONS & REVIEW METADATA FOOTER */}
      <footer
        className="alt-lens-footer"
        aria-label="Curriculum references, assumptions, and review status"
      >
        <div className="alt-footer-grid">
          <div>
            <h3>Source &amp; Curriculum References</h3>
            <ul>
              <li>
                <strong>Primary Reference:</strong> NCERT Class 10 Science,
                Chapter 9: <em>Light – Reflection and Refraction</em>, Sections
                9.3.3–9.3.8 (Spherical Lenses, Ray Construction, New Cartesian
                Sign Convention, Lens Formula &amp; Magnification, Power of a
                Lens) and Table 9.4 (2024–25 / 2025–26 rationalised edition).
              </li>
              <li>
                <strong>Secondary Physics Reference:</strong> OpenStax{' '}
                <em>University Physics Volume 3</em>, Section 2.4 (Thin Lenses).
              </li>
            </ul>
          </div>

          <div>
            <h3>Model Assumptions &amp; Review Status</h3>
            <ul>
              <li>
                <strong>Ideal Thin-Lens Paraxial Model:</strong> Thickness is
                negligible compared to <span className="math-inline">|u|</span>,{' '}
                <span className="math-inline">|v|</span>, and{' '}
                <span className="math-inline">f</span>; rays bend once at vertical
                plane <span className="math-inline">x = 0</span>; spherical and
                chromatic aberrations are omitted.
              </li>
              <li>
                <strong>Review Status:</strong>{' '}
                <em>Provisional — educator and curriculum review pending.</em>{' '}
                All questions and explanations on this page are original learning
                items and do not claim official board endorsement.
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </main>
  )
}
