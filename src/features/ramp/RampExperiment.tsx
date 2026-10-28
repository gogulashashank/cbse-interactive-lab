import { useEffect, useRef, useState } from 'react'
import { calculateRampMechanics, type RampModelInput } from './rampModel'
import {
  createDraftsFromInput,
  formatDisplayNumber,
  INITIAL_RAMP_INPUT,
  parseNumericDraft,
  PRESET_2M_RAMP,
  PRESET_4M_RAMP,
  RAMP_UI_LIMITS,
  validateRampDrafts,
  type RampInputDrafts,
} from './rampInputValidation'
import type { ApplyAnswerIndex, PredictionOptionIndex } from './bookPageRenderer'
import { RampScene3D, type HoverLensState, type WatchTourState } from './RampScene3D'
import { RampDiagram } from './RampDiagram'
import { useReducedMotionPreference } from '../platform/reducedMotion'

// Documented constant demonstration speed (m/s) along the slope:
// Because speed is fixed at 0.8 m/s, pulling up a 4 m ramp takes twice as long (5.0 s)
// as pulling up a 2 m ramp (2.5 s).
const DEMO_CONSTANT_SPEED_M_PER_S = 0.8

export interface RampExperimentProps {
  onOpenLensLesson?: () => void
  initialSpreadIndex?: number
}

export function RampExperiment({
  onOpenLensLesson,
  initialSpreadIndex = 2,
}: RampExperimentProps = {}) {
  const [drafts, setDrafts] = useState<RampInputDrafts>(() =>
    createDraftsFromInput(INITIAL_RAMP_INPUT)
  )
  const [lastValidInput, setLastValidInput] = useState<RampModelInput>(INITIAL_RAMP_INPUT)

  // Pedagogical Sequence State (Predict -> Investigate -> Observe -> Reveal -> Apply)
  const [prediction, setPrediction] = useState<PredictionOptionIndex>(null)
  const [hasInvestigatedLengths, setHasInvestigatedLengths] = useState<boolean>(false)
  const [flapOpen, setFlapOpen] = useState<boolean>(false)
  const [applyAnswer, setApplyAnswer] = useState<ApplyAnswerIndex>(null)

  // Constant-speed demonstration ("Pull the block") state
  const [demoStatus, setDemoStatus] = useState<'idle' | 'playing' | 'paused' | 'completed'>('idle')
  const [demoProgress, setDemoProgress] = useState<number>(0)

  // View & Motion preferences (respects prefers-reduced-motion on initial load and changes)
  const [stillMode, setStillMode] = useReducedMotionPreference()
  const [spreadIndex, setSpreadIndex] = useState<number>(initialSpreadIndex)
  const [watchTrigger, setWatchTrigger] = useState<number>(0)
  const [watchState, setWatchState] = useState<WatchTourState>({
    active: false,
    stepIndex: 0,
    totalSteps: 5,
    captionTitle: '',
    captionBody: '',
  })
  const [sheetOpen, setSheetOpen] = useState<boolean>(false)
  const [show2DSchematic, setShow2DSchematic] = useState<boolean>(false)
  const [lensEnabled, setLensEnabled] = useState<boolean>(true)
  const [hoverLens, setHoverLens] = useState<HoverLensState | null>(null)

  const validation = validateRampDrafts(drafts)

  // Only call the scientific model when inputs are valid
  const modelResult = validation.isValid
    ? calculateRampMechanics(validation.parsedInput)
    : null

  // Award completion stamp only after the student investigates/reveals AND answers the Apply check correctly
  const stampEarned = Boolean(
    applyAnswer === 1 && (hasInvestigatedLengths || flapOpen || demoStatus === 'completed')
  )

  const rafRef = useRef<number | null>(null)
  const lastFrameTimeRef = useRef<number | null>(null)

  // Stop and cancel animation frame helper
  function stopAndResetDemo() {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    lastFrameTimeRef.current = null
    setDemoStatus('idle')
    setDemoProgress(0)
  }

  // Run constant-speed demonstration loop when demoStatus === 'playing'
  useEffect(() => {
    if (demoStatus !== 'playing' || !modelResult) {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      lastFrameTimeRef.current = null
      return
    }

    const totalDurationSec = modelResult.rampLengthM / DEMO_CONSTANT_SPEED_M_PER_S

    function tick(now: number) {
      if (lastFrameTimeRef.current === null) {
        lastFrameTimeRef.current = now
      }
      const dtSec = Math.min(0.1, (now - lastFrameTimeRef.current) / 1000)
      lastFrameTimeRef.current = now

      setDemoProgress((prev) => {
        const next = prev + dtSec / totalDurationSec
        if (next >= 1) {
          setDemoStatus('completed')
          return 1
        }
        return next
      })

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      lastFrameTimeRef.current = null
    }
  }, [demoStatus, modelResult])

  function handleDraftChange(field: keyof RampInputDrafts, value: string) {
    // Changing inputs stops and resets the demonstration
    stopAndResetDemo()

    const nextDrafts: RampInputDrafts = {
      ...drafts,
      [field]: value,
    }
    setDrafts(nextDrafts)

    const nextValidation = validateRampDrafts(nextDrafts)
    if (nextValidation.isValid) {
      setLastValidInput(nextValidation.parsedInput)
      if (nextValidation.parsedInput.rampLengthM !== INITIAL_RAMP_INPUT.rampLengthM) {
        setHasInvestigatedLengths(true)
      }
    }
  }

  function handleSceneRampLengthChange(lengthM: number) {
    stopAndResetDemo()
    const nextDrafts: RampInputDrafts = {
      ...drafts,
      rampLengthM: String(lengthM),
    }
    setDrafts(nextDrafts)
    const nextValidation = validateRampDrafts(nextDrafts)
    if (nextValidation.isValid) {
      setLastValidInput(nextValidation.parsedInput)
      if (nextValidation.parsedInput.rampLengthM !== INITIAL_RAMP_INPUT.rampLengthM) {
        setHasInvestigatedLengths(true)
      }
    }
  }

  function applyPreset(preset: RampModelInput) {
    stopAndResetDemo()
    setDrafts(createDraftsFromInput(preset))
    setLastValidInput(preset)
    if (preset.rampLengthM !== INITIAL_RAMP_INPUT.rampLengthM) {
      setHasInvestigatedLengths(true)
    }
  }

  function handleReset() {
    stopAndResetDemo()
    setDrafts(createDraftsFromInput(INITIAL_RAMP_INPUT))
    setLastValidInput(INITIAL_RAMP_INPUT)
    setPrediction(null)
    setFlapOpen(false)
    setApplyAnswer(null)
    setHasInvestigatedLengths(false)
  }

  function handlePlayPauseReplay() {
    if (!modelResult) return
    if (stillMode) {
      // In Still / Reduced-motion mode, step immediately to full ascent or toggle back
      if (demoStatus === 'completed') {
        setDemoProgress(0)
        setDemoStatus('idle')
      } else {
        setDemoProgress(1)
        setDemoStatus('completed')
      }
      return
    }

    if (demoStatus === 'idle' || demoStatus === 'completed') {
      setDemoProgress(0)
      setDemoStatus('playing')
    } else if (demoStatus === 'playing') {
      setDemoStatus('paused')
    } else if (demoStatus === 'paused') {
      setDemoStatus('playing')
    }
  }

  function handleStepProgress(targetFraction: number) {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    setDemoProgress(targetFraction)
    setDemoStatus(targetFraction >= 1 ? 'completed' : targetFraction === 0 ? 'idle' : 'paused')
  }

  // Synchronized slider values
  const parsedMass = parseNumericDraft(drafts.massKg)
  const sliderMass =
    parsedMass !== null &&
    parsedMass >= RAMP_UI_LIMITS.massKg.min &&
    parsedMass <= RAMP_UI_LIMITS.massKg.max
      ? parsedMass
      : lastValidInput.massKg

  const parsedHeight = parseNumericDraft(drafts.heightM)
  const sliderHeight =
    parsedHeight !== null &&
    parsedHeight >= RAMP_UI_LIMITS.heightM.min &&
    parsedHeight <= RAMP_UI_LIMITS.heightM.max
      ? parsedHeight
      : lastValidInput.heightM

  const parsedLength = parseNumericDraft(drafts.rampLengthM)
  const sliderLength =
    parsedLength !== null &&
    parsedLength >= RAMP_UI_LIMITS.rampLengthM.min &&
    parsedLength <= RAMP_UI_LIMITS.rampLengthM.max
      ? parsedLength
      : lastValidInput.rampLengthM

  const isPreset2mActive =
    validation.isValid &&
    validation.parsedInput.massKg === PRESET_2M_RAMP.massKg &&
    validation.parsedInput.heightM === PRESET_2M_RAMP.heightM &&
    validation.parsedInput.rampLengthM === PRESET_2M_RAMP.rampLengthM

  const isPreset4mActive =
    validation.isValid &&
    validation.parsedInput.massKg === PRESET_4M_RAMP.massKg &&
    validation.parsedInput.heightM === PRESET_4M_RAMP.heightM &&
    validation.parsedInput.rampLengthM === PRESET_4M_RAMP.rampLengthM

  const massDescribedBy = validation.errors.massKg ? 'mass-help mass-error' : 'mass-help'
  const heightDescribedBy = validation.errors.heightM ? 'height-help height-error' : 'height-help'
  const lengthDescribedBy = validation.errors.rampLengthM
    ? 'length-help length-error'
    : 'length-help'

  const workSoFarJ = modelResult
    ? demoStatus === 'idle'
      ? 0
      : modelResult.appliedWorkJ * demoProgress
    : 0
  const demoDurationSec = modelResult
    ? modelResult.rampLengthM / DEMO_CONSTANT_SPEED_M_PER_S
    : 0

  return (
    <div className={`ej-book-app ${stillMode ? 'still-mode' : ''}`}>
      {/* 1. FULL-VIEWPORT 3D OPEN BOOK STAGE (or 2D Fallback / Invalid Input Alert) */}
      <div className="ej-canvas-layer">
        {modelResult ? (
          show2DSchematic ? (
            <div className="schematic-2d-stage">
              <RampDiagram result={modelResult} />
            </div>
          ) : (
            <RampScene3D
              result={modelResult}
              prediction={prediction}
              flapOpen={flapOpen}
              applyAnswer={applyAnswer}
              stampEarned={stampEarned}
              demoProgress={demoProgress}
              demoStatus={demoStatus}
              stillMode={stillMode}
              spreadIndex={spreadIndex}
              watchTrigger={watchTrigger}
              onSpreadChange={setSpreadIndex}
              onSelectPrediction={(idx) => setPrediction(idx)}
              onToggleFlap={() => setFlapOpen((o) => !o)}
              onSelectApplyAnswer={(idx) => setApplyAnswer(idx)}
              onScrubProgress={handleStepProgress}
              onDragRampLength={handleSceneRampLengthChange}
              onTriggerPlay={handlePlayPauseReplay}
              onHoverLensChange={setHoverLens}
              onWatchStateChange={setWatchState}
              onOpenLensLesson={onOpenLensLesson}
            />
          )
        ) : (
          <div className="invalid-stage-overlay" role="alert">
            <div className="invalid-stage-card">
              <h2>Experiment unavailable for the current input values</h2>
              <p>
                One or more parameters are incomplete or outside the allowed bounds (ramp length
                must be at least the vertical height). Open the controls drawer below to fix the
                highlighted input error.
              </p>
              <button
                type="button"
                className="ej-pill-btn ej-pill-accent"
                onClick={handleReset}
              >
                Reset experiment to valid defaults
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. TOP-LEFT EDITORIAL BRANDING & PROTOTYPE BADGE */}
      <header className="ej-top-hud">
        <div className="ej-brand-chip">
          <span className="ej-brand-title">CBSE Interactive Lab</span>
          <span className="ej-sep-dot" aria-hidden="true">
            ·
          </span>
          <span className="ej-prototype-tag" role="status">
            Prototype — educator and curriculum review pending
          </span>
        </div>

        <div className="ej-top-actions">
          <button
            type="button"
            className={`ej-pill-btn ${watchState.active ? 'ej-pill-accent' : ''}`}
            aria-pressed={watchState.active}
            onClick={() => setWatchTrigger((c) => c + 1)}
          >
            {watchState.active ? 'Stop 3D Tour ✕' : 'Watch 5-Shot 3D Tour ▶'}
          </button>
          <button
            type="button"
            className="ej-pill-btn"
            aria-pressed={lensEnabled}
            onClick={() => {
              setLensEnabled((v) => !v)
              setHoverLens(null)
            }}
          >
            {lensEnabled ? 'Reading Lens: On' : 'Reading Lens: Off'}
          </button>
          <button
            type="button"
            className="ej-pill-btn"
            aria-pressed={show2DSchematic}
            onClick={() => {
              setShow2DSchematic((v) => !v)
              setHoverLens(null)
            }}
          >
            {show2DSchematic ? '3D Open Book' : '2D SVG Fallback'}
          </button>
          <button
            type="button"
            className="ej-pill-btn"
            onClick={handleReset}
          >
            Reset experiment
          </button>
        </div>
      </header>

      {/* 2B. EVERY JOULE FLOATING READING LENS (lensDisc + lensCard when hovering book sections) */}
      {lensEnabled && hoverLens && hoverLens.visible && !show2DSchematic && !sheetOpen && modelResult ? (
        <div className="ej-lens-layer" aria-hidden="true">
          <div
            className="ej-lens-disc"
            style={{
              transform: `translate(${Math.round(hoverLens.x - 52)}px, ${Math.round(hoverLens.y - 52)}px)`,
            }}
          />
          <div
            className="ej-lens-card"
            style={{
              transform: `translate(${Math.round(
                hoverLens.x + 76 + 310 > (typeof window !== 'undefined' ? window.innerWidth - 16 : 1200)
                  ? Math.max(14, hoverLens.x - 310 - 66)
                  : hoverLens.x + 66
              )}px, ${Math.round(
                Math.max(
                  58,
                  Math.min(
                    (typeof window !== 'undefined' ? window.innerHeight : 800) - 210,
                    hoverLens.y - 58
                  )
                )
              )}px)`,
            }}
          >
            <div className="ej-lens-tag">{hoverLens.kicker}</div>
            <div className="ej-lens-title">{hoverLens.title}</div>
            <div
              className="ej-lens-body"
              dangerouslySetInnerHTML={{ __html: hoverLens.bodyHtml }}
            />
          </div>
        </div>
      ) : null}

      {/* 3. EXPANDABLE GLASS SHEET ("This page's words, controls & accessible table") */}
      <section
        className={`ej-glass-sheet ${sheetOpen || !modelResult ? 'open' : ''}`}
        aria-label="Lesson text, experiment controls, and numerical comparison"
      >
        <div className="ej-sheet-header-bar">
          <button
            type="button"
            className="ej-sheet-grip"
            aria-expanded={sheetOpen || !modelResult}
            onClick={() => setSheetOpen((o) => !o)}
          >
            <span className="ej-sheet-title">
              <strong>Lesson 1:</strong> Why does a ramp make lifting easier?{' '}
              <span className="ej-sheet-subtitle">
                (Controls, comparison table &amp; full accessible text)
              </span>
            </span>
            <span className="ej-sheet-chev" aria-hidden="true">
              {sheetOpen || !modelResult ? '▾ Hide panel' : '▴ Open controls & text'}
            </span>
          </button>

          {/* Always-visible quick presets & Pull the block button on the bar */}
          <div className="ej-quick-bar-actions">
            <button
              type="button"
              className={`ej-chip-btn ${isPreset2mActive ? 'on' : ''}`}
              aria-pressed={isPreset2mActive}
              onClick={() => applyPreset(PRESET_2M_RAMP)}
            >
              Compare 2 m ramp
            </button>
            <button
              type="button"
              className={`ej-chip-btn ${isPreset4mActive ? 'on' : ''}`}
              aria-pressed={isPreset4mActive}
              onClick={() => applyPreset(PRESET_4M_RAMP)}
            >
              Compare 4 m ramp
            </button>
            {modelResult ? (
              <button
                type="button"
                className="ej-chip-btn ej-chip-play"
                onClick={handlePlayPauseReplay}
              >
                {stillMode
                  ? demoStatus === 'completed'
                    ? 'Reset block position'
                    : 'Step block to top'
                  : demoStatus === 'playing'
                    ? '❚❚ Pause pull'
                    : demoStatus === 'paused'
                      ? '▶ Resume pull'
                      : demoStatus === 'completed'
                        ? '↻ Replay pull'
                        : '▶ Pull the block'}
              </button>
            ) : null}
          </div>
        </div>

        {/* Sheet Body: Accessible HTML controls, Predict, Reveal Flap, Apply Check & Comparison Table */}
        <div className="ej-sheet-body">
          <p className="ej-objective-line">
            <strong>Learning objective:</strong> Explore how ramp length changes pulling force and
            distance when lifting the same object to the same height.{' '}
            <em>
              Compare the force, distance and work. What changes? What stays the same?
            </em>
          </p>

          <div className="ej-sheet-columns">
            {/* Column 1: Experiment Controls (Ramp Length + Secondary Mass/Height) */}
            <div className="ej-sheet-col">
              <h3>2 · Investigate ramp length &amp; parameters</h3>
              <form
                className="ej-controls-form"
                noValidate
                onSubmit={(e) => e.preventDefault()}
              >
                {/* Primary Control: Ramp Length */}
                <fieldset className="ej-fieldset">
                  <legend>Ramp length (0.5–8 m, step 0.1 m)</legend>
                  <p id="length-help" className="ej-help">
                    Ramp length must be at least the vertical height ({drafts.heightM || '1'} m).
                  </p>
                  <div className="ej-dual-input">
                    <div className="ej-slider-cell">
                      <label htmlFor="length-slider">Ramp length slider (m)</label>
                      <input
                        id="length-slider"
                        type="range"
                        min={RAMP_UI_LIMITS.rampLengthM.min}
                        max={RAMP_UI_LIMITS.rampLengthM.max}
                        step={RAMP_UI_LIMITS.rampLengthM.step}
                        value={sliderLength}
                        aria-describedby={lengthDescribedBy}
                        aria-invalid={Boolean(validation.errors.rampLengthM)}
                        onChange={(e) => handleDraftChange('rampLengthM', e.target.value)}
                      />
                    </div>
                    <div className="ej-number-cell">
                      <label htmlFor="length-number">Exact length (m)</label>
                      <input
                        id="length-number"
                        type="number"
                        min={RAMP_UI_LIMITS.rampLengthM.min}
                        max={RAMP_UI_LIMITS.rampLengthM.max}
                        step={RAMP_UI_LIMITS.rampLengthM.step}
                        value={drafts.rampLengthM}
                        aria-describedby={lengthDescribedBy}
                        aria-invalid={Boolean(validation.errors.rampLengthM)}
                        onChange={(e) => handleDraftChange('rampLengthM', e.target.value)}
                      />
                    </div>
                  </div>
                  {validation.errors.rampLengthM ? (
                    <p id="length-error" className="ej-error" role="alert">
                      {validation.errors.rampLengthM}
                    </p>
                  ) : null}
                </fieldset>

                {/* Secondary "Explore more" disclosure for Mass and Vertical Height */}
                <details
                  className="ej-explore-more"
                  open={Boolean(validation.errors.massKg || validation.errors.heightM)}
                >
                  <summary>
                    Explore more: Object mass ({drafts.massKg || '—'} kg) &amp; Vertical height (
                    {drafts.heightM || '—'} m)
                  </summary>

                  <div className="ej-secondary-stack">
                    <fieldset className="ej-fieldset">
                      <legend>Object mass (1–50 kg, step 1 kg)</legend>
                      <p id="mass-help" className="ej-help">
                        Allowed range: 1 kg to 50 kg.
                      </p>
                      <div className="ej-dual-input">
                        <div className="ej-slider-cell">
                          <label htmlFor="mass-slider">Mass slider (kg)</label>
                          <input
                            id="mass-slider"
                            type="range"
                            min={RAMP_UI_LIMITS.massKg.min}
                            max={RAMP_UI_LIMITS.massKg.max}
                            step={RAMP_UI_LIMITS.massKg.step}
                            value={sliderMass}
                            aria-describedby={massDescribedBy}
                            aria-invalid={Boolean(validation.errors.massKg)}
                            onChange={(e) => handleDraftChange('massKg', e.target.value)}
                          />
                        </div>
                        <div className="ej-number-cell">
                          <label htmlFor="mass-number">Exact mass (kg)</label>
                          <input
                            id="mass-number"
                            type="number"
                            min={RAMP_UI_LIMITS.massKg.min}
                            max={RAMP_UI_LIMITS.massKg.max}
                            step={RAMP_UI_LIMITS.massKg.step}
                            value={drafts.massKg}
                            aria-describedby={massDescribedBy}
                            aria-invalid={Boolean(validation.errors.massKg)}
                            onChange={(e) => handleDraftChange('massKg', e.target.value)}
                          />
                        </div>
                      </div>
                      {validation.errors.massKg ? (
                        <p id="mass-error" className="ej-error" role="alert">
                          {validation.errors.massKg}
                        </p>
                      ) : null}
                    </fieldset>

                    <fieldset className="ej-fieldset">
                      <legend>Vertical height (0.5–3 m, step 0.1 m)</legend>
                      <p id="height-help" className="ej-help">
                        Allowed range: 0.5 m to 3 m.
                      </p>
                      <div className="ej-dual-input">
                        <div className="ej-slider-cell">
                          <label htmlFor="height-slider">Height slider (m)</label>
                          <input
                            id="height-slider"
                            type="range"
                            min={RAMP_UI_LIMITS.heightM.min}
                            max={RAMP_UI_LIMITS.heightM.max}
                            step={RAMP_UI_LIMITS.heightM.step}
                            value={sliderHeight}
                            aria-describedby={heightDescribedBy}
                            aria-invalid={Boolean(validation.errors.heightM)}
                            onChange={(e) => handleDraftChange('heightM', e.target.value)}
                          />
                        </div>
                        <div className="ej-number-cell">
                          <label htmlFor="height-number">Exact height (m)</label>
                          <input
                            id="height-number"
                            type="number"
                            min={RAMP_UI_LIMITS.heightM.min}
                            max={RAMP_UI_LIMITS.heightM.max}
                            step={RAMP_UI_LIMITS.heightM.step}
                            value={drafts.heightM}
                            aria-describedby={heightDescribedBy}
                            aria-invalid={Boolean(validation.errors.heightM)}
                            onChange={(e) => handleDraftChange('heightM', e.target.value)}
                          />
                        </div>
                      </div>
                      {validation.errors.heightM ? (
                        <p id="height-error" className="ej-error" role="alert">
                          {validation.errors.heightM}
                        </p>
                      ) : null}
                    </fieldset>
                  </div>
                </details>
              </form>

              {/* Step 3: Constant-Speed Ascent Demonstration Controls */}
              {modelResult ? (
                <div className="ej-demo-box">
                  <h4>3 · Observe constant-speed ascent (v = 0.8 m/s)</h4>
                  <p className="ej-help">
                    Illustrative constant-speed demonstration (not dynamic acceleration). At{' '}
                    {DEMO_CONSTANT_SPEED_M_PER_S} m/s, this{' '}
                    {formatDisplayNumber(modelResult.rampLengthM, 2)} m ramp takes{' '}
                    <strong>{formatDisplayNumber(demoDurationSec, 2)} s</strong>.
                  </p>
                  <div className="ej-demo-buttons">
                    <button
                      type="button"
                      className="ej-chip-btn ej-chip-play"
                      onClick={handlePlayPauseReplay}
                    >
                      {demoStatus === 'playing'
                        ? 'Pause'
                        : demoStatus === 'paused'
                          ? 'Resume'
                          : demoStatus === 'completed'
                            ? 'Replay'
                            : 'Play ascent'}
                    </button>
                    <button
                      type="button"
                      className="ej-chip-btn"
                      onClick={() => handleStepProgress(0)}
                    >
                      Start (0%)
                    </button>
                    <button
                      type="button"
                      className="ej-chip-btn"
                      onClick={() => handleStepProgress(0.5)}
                    >
                      Midway (50%)
                    </button>
                    <button
                      type="button"
                      className="ej-chip-btn"
                      onClick={() => handleStepProgress(1)}
                    >
                      Top (100%)
                    </button>
                  </div>
                  <p className="ej-demo-readout">
                    Required pulling force:{' '}
                    <strong>{formatDisplayNumber(modelResult.pullingForceN, 3)} N</strong> · Work
                    done so far: <strong>{formatDisplayNumber(workSoFarJ, 2)} J</strong> of{' '}
                    <strong>{formatDisplayNumber(modelResult.appliedWorkJ, 2)} J</strong> full
                    ascent work.
                  </p>
                </div>
              ) : null}
            </div>

            {/* Column 2: Comparison Table + Predict / Reveal Flap / Apply Check */}
            <div className="ej-sheet-col">
              <h3>Ramp versus vertical lift comparison</h3>
              {modelResult ? (
                <>
                  <div
                    tabIndex={0}
                    role="region"
                    aria-labelledby="ej-comp-caption"
                    className="ej-table-wrap"
                  >
                    <table className="ej-comp-table">
                      <caption id="ej-comp-caption">
                        Constant-speed comparison for lifting a{' '}
                        {formatDisplayNumber(modelResult.massKg, 1)} kg object by{' '}
                        {formatDisplayNumber(modelResult.heightM, 2)} m vertically (g ={' '}
                        {formatDisplayNumber(modelResult.gravitationalAccelerationMPerS2, 2)} m/s²).
                      </caption>
                      <thead>
                        <tr>
                          <th scope="col">Quantity</th>
                          <th scope="col">Ramp</th>
                          <th scope="col">Vertical lift</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <th scope="row">Pulling/lifting force</th>
                          <td>{formatDisplayNumber(modelResult.pullingForceN, 3)} N</td>
                          <td>{formatDisplayNumber(modelResult.verticalLiftForceN, 3)} N</td>
                        </tr>
                        <tr>
                          <th scope="row">Distance travelled</th>
                          <td>{formatDisplayNumber(modelResult.distanceAlongRampM, 2)} m</td>
                          <td>{formatDisplayNumber(modelResult.verticalLiftDistanceM, 2)} m</td>
                        </tr>
                        <tr>
                          <th scope="row">Applied work</th>
                          <td>{formatDisplayNumber(modelResult.appliedWorkJ, 2)} J</td>
                          <td>{formatDisplayNumber(modelResult.verticalLiftWorkJ, 2)} J</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <p className="ej-secondary-metrics">
                    <strong>Ramp angle:</strong> {formatDisplayNumber(modelResult.rampAngleDegrees, 1)}° ·{' '}
                    <strong>Ideal mechanical advantage:</strong>{' '}
                    {formatDisplayNumber(modelResult.idealMechanicalAdvantage, 2)} ·{' '}
                    <strong>Potential energy gain:</strong>{' '}
                    {formatDisplayNumber(modelResult.potentialEnergyGainJ, 2)} J ·{' '}
                    <strong>g:</strong>{' '}
                    {formatDisplayNumber(modelResult.gravitationalAccelerationMPerS2, 2)} m/s²
                  </p>
                </>
              ) : (
                <p className="ej-error">
                  Numerical results are hidden until input validation errors are corrected.
                </p>
              )}

              {/* Accessible HTML mirrors for Predict, Reveal Why Flap, and Apply Check */}
              <div className="ej-pedagogy-mirror">
                <div>
                  <h4>1 · Predict</h4>
                  <p>
                    If we make the ramp longer while keeping the object and height the same, what
                    happens to the pulling force?
                  </p>
                  <div className="ej-picks-row">
                    {(['It increases', 'It decreases', 'It stays the same'] as const).map(
                      (label, idx) => (
                        <button
                          key={label}
                          type="button"
                          className={`ej-chip-btn ${prediction === idx ? 'on' : ''}`}
                          aria-pressed={prediction === idx}
                          onClick={() => setPrediction(idx as 0 | 1 | 2)}
                        >
                          {label}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <h4>4 · Reveal why (Answer Flap)</h4>
                  <button
                    type="button"
                    className="ej-lift-btn"
                    aria-expanded={flapOpen}
                    onClick={() => setFlapOpen((o) => !o)}
                  >
                    {flapOpen ? 'Lower the flap' : 'Reveal why (Lift the flap)'}
                  </button>
                  {flapOpen ? (
                    <div className="ej-flap-revealed">
                      <p>
                        <strong>Less force, more distance, same ideal work:</strong> Making the
                        ramp longer reduces the slope angle and reduces the uphill pulling force
                        proportionally (<code className="inline-code">F_pull = mgh / L</code>).
                        Because you pull over a correspondingly longer distance{' '}
                        <code className="inline-code">L</code>, the ideal applied work (
                        <code className="inline-code">F_pull × L = mgh</code>) equals the gain in
                        gravitational potential energy. (Assumes constant speed and zero friction;
                        real ramps require extra work due to frictional losses.)
                      </p>
                    </div>
                  ) : null}
                </div>

                <div>
                  <h4>5 · Apply check</h4>
                  <p>
                    Does a longer frictionless ramp reduce the energy needed to reach the same
                    height?
                  </p>
                  <div className="ej-picks-row">
                    {(['Yes, it uses less energy', 'No, ideal work stays equal to mgh'] as const).map(
                      (label, idx) => (
                        <button
                          key={label}
                          type="button"
                          className={`ej-chip-btn ${applyAnswer === idx ? 'on' : ''}`}
                          aria-pressed={applyAnswer === idx}
                          onClick={() => setApplyAnswer(idx as 0 | 1)}
                        >
                          {label}
                        </button>
                      )
                    )}
                  </div>
                  {applyAnswer !== null ? (
                    <p className="ej-apply-feedback">
                      {applyAnswer === 1
                        ? 'Correct! A longer frictionless ramp reduces the required pulling force, but increases the pulling distance so total ideal work (mgh) stays the same.'
                        : 'Not quite: a longer ramp reduces the pulling force, not the total energy/work. Because distance increases in the same ratio, ideal work remains equal to mgh.'}
                      {stampEarned ? (
                        <strong className="ej-stamp-badge"> ✓ Lesson 01 Stamp Earned</strong>
                      ) : null}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FLOATING BOTTOM GLASS CAPSULE (Every Joule signature book navigation & demo bar) */}
      <nav className="ej-glass-capsule" aria-label="Book and demonstration controls">
        <button
          type="button"
          className="ej-cap-icon"
          disabled={spreadIndex <= 0}
          onClick={() => setSpreadIndex((s) => Math.max(0, s - 1))}
          aria-label="Turn to previous book spread"
          title="Previous spread (Contents / Cover)"
        >
          ‹
        </button>

        <button
          type="button"
          className="ej-cap-icon"
          aria-label={sheetOpen ? 'Close controls and text sheet' : 'Open controls and text sheet'}
          aria-pressed={sheetOpen}
          onClick={() => setSheetOpen((o) => !o)}
          title="Controls & Lesson Sheet"
        >
          ☰
        </button>

        <div className="ej-cap-mid">
          {watchState.active ? (
            <div className="ej-cap-caption">
              <span className="ej-cap-dots" aria-hidden="true">
                {Array.from({ length: watchState.totalSteps }, (_, idx) => (
                  <i
                    key={idx}
                    className={
                      idx === watchState.stepIndex
                        ? 'on'
                        : idx < watchState.stepIndex
                          ? 'done'
                          : ''
                    }
                  />
                ))}
              </span>
              <span className="ej-cap-txt" aria-live="polite">
                <strong>{watchState.captionTitle}:</strong> {watchState.captionBody}
              </span>
              <button
                type="button"
                className="ej-cap-stop"
                onClick={() => setWatchTrigger((c) => c + 1)}
                aria-label="Stop 3D guided tour"
              >
                ✕
              </button>
            </div>
          ) : demoStatus === 'idle' ? (
            <div className="ej-cap-where">
              <button
                type="button"
                className="ej-cap-play"
                onClick={() => setWatchTrigger((c) => c + 1)}
                disabled={!modelResult}
                aria-label="Watch 5-shot guided 3D camera tour"
                title="Watch 5-shot guided 3D camera tour"
              >
                ▶
              </button>
              <span className="ej-cap-label">
                <b>
                  {spreadIndex === 0
                    ? 'Front Cover'
                    : spreadIndex === 1
                      ? 'Contents'
                      : 'Lesson 1'}
                </b>
                <span>
                  {spreadIndex === 0
                    ? 'Click the cover or press › to open the book'
                    : spreadIndex === 1
                      ? 'Illustrated Science Notebook · Click Lesson I (Ramp) or Lesson II (Convex Lens)'
                      : `Less force. More distance. Same energy.${
                          modelResult
                            ? ` (L = ${formatDisplayNumber(modelResult.rampLengthM, 1)} m · F = ${formatDisplayNumber(
                                modelResult.pullingForceN,
                                2
                              )} N · W = ${formatDisplayNumber(modelResult.appliedWorkJ, 1)} J)`
                            : ''
                        }`}
                </span>
              </span>
            </div>
          ) : (
            <div className="ej-cap-caption">
              <button
                type="button"
                className="ej-cap-play"
                onClick={handlePlayPauseReplay}
                aria-label={demoStatus === 'playing' ? 'Pause demonstration' : 'Resume or replay'}
              >
                {demoStatus === 'playing' ? '❚❚' : '↻'}
              </button>
              <span className="ej-cap-txt" aria-live="polite">
                Constant speed ({DEMO_CONSTANT_SPEED_M_PER_S} m/s): Force ={' '}
                {modelResult ? formatDisplayNumber(modelResult.pullingForceN, 2) : '—'} N · Work so
                far = {formatDisplayNumber(workSoFarJ, 1)} J /{' '}
                {modelResult ? formatDisplayNumber(modelResult.appliedWorkJ, 1) : '—'} J
              </span>
              <button
                type="button"
                className="ej-cap-stop"
                onClick={stopAndResetDemo}
                aria-label="Reset block to bottom"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        <span className="ej-cap-sep" aria-hidden="true" />

        <button
          type="button"
          className="ej-cap-icon"
          aria-pressed={flapOpen}
          onClick={() => setFlapOpen((o) => !o)}
          title="Lift or lower the Why? answer flap"
          aria-label="Lift or lower the Why? answer flap"
        >
          ?
        </button>

        <button
          type="button"
          className="ej-cap-icon"
          aria-pressed={stillMode}
          onClick={() => {
            const next = !stillMode
            setStillMode(next)
            if (next && demoStatus === 'playing') {
              setDemoStatus('paused')
            }
          }}
          title="Still mode (stop motion)"
          aria-label="Still mode (stop all motion)"
        >
          ⏸
        </button>

        <button
          type="button"
          className="ej-cap-icon"
          disabled={spreadIndex >= 2}
          onClick={() => setSpreadIndex((s) => Math.min(2, s + 1))}
          aria-label="Turn to next book spread"
          title="Next spread (Lesson 1)"
        >
          ›
        </button>
      </nav>
    </div>
  )
}
