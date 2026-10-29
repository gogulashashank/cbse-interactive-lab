import React, { useState, useEffect } from 'react'
import {
  POWER_HEATING_LIMITS,
} from './powerHeatingLimits'
import {
  calculateHeatingCircuit,
  type HeatingCircuitInput,
} from './powerHeatingModel'
import {
  applyHeatingDraftEdit,
  createHeatingDrafts,
  formatHeatingNumber,
  type HeatingDrafts,
  type HeatingValidationErrors,
} from './powerHeatingInputValidation'
import {
  EMPTY_PH_ANSWER,
  evaluatePowerHeatingPracticeAnswer,
  loadHeatingSetup,
  POWER_HEATING_DISCOVERIES,
  POWER_HEATING_MISCONCEPTIONS,
  POWER_HEATING_PRACTICE_QUESTIONS,
  POWER_HEATING_PREDICTIONS,
  POWER_HEATING_SOURCE_METADATA,
  POWER_HEATING_WORKED_EXAMPLES,
  type PowerHeatingPracticeAnswer,
  type PowerHeatingPresentationMode,
  type PowerHeatingQuestionId,
} from './powerHeatingContent'
import {
  HeatingCircuitSVG,
  EnergyAccumulatorGauge,
  EnergyVsTimeGraphSVG,
} from './PowerHeatingDiagrams'

export const PowerHeatingLesson: React.FC = () => {
  const [mode, setMode] = useState<PowerHeatingPresentationMode>('reading')
  const [announcement, setAnnouncement] = useState<string>('')

  // Bench Circuit State
  const [circuit, setCircuit] = useState<HeatingCircuitInput>({
    supplyVoltageV: 6.0,
    resistanceOhm: 6.0,
    switchClosed: true,
    elapsedTimeS: 0,
  })
  const [targetDurationS, setTargetDurationS] = useState<number>(10)
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [energyHistory, setEnergyHistory] = useState<{ timeS: number; energyJ: number }[]>([
    { timeS: 0, energyJ: 0 },
  ])

  // Drafts & Validation
  const [drafts, setDrafts] = useState<HeatingDrafts>(() =>
    createHeatingDrafts(circuit, targetDurationS)
  )
  const [errors, setErrors] = useState<HeatingValidationErrors>({})

  // Predictions State
  const [predChoices, setPredChoices] = useState<Record<string, number | null>>({
    'voltage-quad-prediction': null,
    'duration-prediction': null,
    'resistance-power-prediction': null,
  })

  // Practice State
  const [answers, setAnswers] = useState<Partial<Record<PowerHeatingQuestionId, PowerHeatingPracticeAnswer>>>({})
  const [selectedQuestionId, setSelectedQuestionId] = useState<PowerHeatingQuestionId>('ph-q1')

  // Live calculation
  const result = calculateHeatingCircuit(circuit)

  // Simulation timer loop
  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setCircuit((prev) => {
        if (!prev.switchClosed) {
          return prev
        }
        const nextTime = prev.elapsedTimeS + 1
        const res = calculateHeatingCircuit({ ...prev, elapsedTimeS: nextTime })

        setEnergyHistory((history) => {
          // Avoid duplicate points
          if (history.some((p) => p.timeS === nextTime)) return history
          return [...history, { timeS: nextTime, energyJ: res.energyJ }]
        })

        if (nextTime >= targetDurationS) {
          setIsRunning(false)
          setAnnouncement(`Reached target duration of ${targetDurationS} seconds. Total heat: ${formatHeatingNumber(res.energyJ, 1)} J.`)
        }
        return { ...prev, elapsedTimeS: nextTime }
      })
    }, 800)

    return () => clearInterval(interval)
  }, [isRunning, targetDurationS])

  function handleStart() {
    if (circuit.elapsedTimeS >= targetDurationS) {
      // If already at or beyond target duration, reset time to 0 first
      setCircuit((prev) => ({ ...prev, elapsedTimeS: 0 }))
      setEnergyHistory([{ timeS: 0, energyJ: 0 }])
    }
    setIsRunning(true)
    setAnnouncement('Heating simulation running.')
  }

  function handlePause() {
    setIsRunning(false)
    setAnnouncement('Heating simulation paused.')
  }

  function handleReset() {
    setIsRunning(false)
    setCircuit((prev) => ({ ...prev, elapsedTimeS: 0 }))
    setEnergyHistory([{ timeS: 0, energyJ: 0 }])
    setAnnouncement('Simulation timer and energy counter reset to 0.')
  }

  function handleStep(seconds: number = 1) {
    setCircuit((prev) => {
      const nextTime = Math.min(POWER_HEATING_LIMITS.durationS.max, prev.elapsedTimeS + seconds)
      const res = calculateHeatingCircuit({ ...prev, elapsedTimeS: nextTime })
      setEnergyHistory((history) => {
        if (history.some((p) => p.timeS === nextTime)) return history
        return [...history, { timeS: nextTime, energyJ: res.energyJ }].sort((a, b) => a.timeS - b.timeS)
      })
      setAnnouncement(`Stepped time forward to ${nextTime} seconds. Energy: ${formatHeatingNumber(res.energyJ, 1)} J.`)
      return { ...prev, elapsedTimeS: nextTime }
    })
  }

  function editField(field: keyof HeatingDrafts, raw: string) {
    const out = applyHeatingDraftEdit(circuit, drafts, targetDurationS, field, raw)
    setCircuit(out.input)
    setDrafts(out.drafts)
    setTargetDurationS(out.targetDurationS)
    setErrors(out.errors)

    // Recalculate history if inputs change
    if (circuit.elapsedTimeS > 0) {
      setEnergyHistory((prev) =>
        prev.map((p) => ({
          timeS: p.timeS,
          energyJ: (out.input.switchClosed ? (out.input.supplyVoltageV ** 2 / out.input.resistanceOhm) : 0) * p.timeS,
        }))
      )
    }
  }

  function toggleSwitch() {
    const nextClosed = !circuit.switchClosed
    setCircuit((prev) => ({ ...prev, switchClosed: nextClosed }))
    setAnnouncement(nextClosed ? 'Switch closed. Heating begins.' : 'Switch opened. Current halted.')
  }

  function loadSetup(setup: { supplyVoltageV: number; resistanceOhm: number; durationS: number }, label: string) {
    const updated = loadHeatingSetup(
      {
        circuit,
        targetDurationS,
        isRunning: false,
        energyHistory: [{ timeS: 0, energyJ: 0 }],
        selectedQuestionId,
      },
      setup
    )
    setCircuit(updated.circuit)
    setTargetDurationS(updated.targetDurationS)
    setIsRunning(false)
    setEnergyHistory(updated.energyHistory)
    setDrafts(createHeatingDrafts(updated.circuit, updated.targetDurationS))
    setErrors({})
    setAnnouncement(`Loaded setup on bench: ${label}`)
  }

  function patchAnswer(id: PowerHeatingQuestionId, patch: Partial<PowerHeatingPracticeAnswer>) {
    setAnswers((prev) => ({
      ...prev,
      [id]: { ...(prev[id] ?? EMPTY_PH_ANSWER), ...patch },
    }))
  }

  function countCorrect(): number {
    return POWER_HEATING_PRACTICE_QUESTIONS.filter((q) => {
      const a = answers[q.id]
      return a?.checked === true && evaluatePowerHeatingPracticeAnswer(q, a).status === 'correct'
    }).length
  }

  return (
    <main
      className={`alt-lens-page mode-${mode}`}
      aria-label="Electrical Power and Heating Lesson"
    >
      {/* Top Header */}
      <header className="alt-lens-header">
        <div className="alt-lens-title-block">
          <span className="alt-meta-tag">CBSE Class 10 Science · Chapter 12: Electricity</span>
          <h1>Electrical Power &amp; Heating — “Where Does Electrical Energy Go?”</h1>
          <p className="alt-lens-subtitle">
            Investigate how electrical potential energy converts into thermal energy (Joule heating),
            why power is rate of energy transfer (<span className="math-inline">P = VI = I²R = V²/R</span>),
            and how heat accumulates over time (<span className="math-inline">H = Pt</span>).
          </p>
        </div>

        <div className="alt-view-toggle no-print" role="group" aria-label="Presentation mode">
          <button
            type="button"
            className={`alt-view-btn ${mode === 'reading' ? 'is-active' : ''}`}
            onClick={() => setMode('reading')}
            aria-pressed={mode === 'reading'}
          >
            Reading View
          </button>
          <button
            type="button"
            className={`alt-view-btn ${mode === 'immersive' ? 'is-active' : ''}`}
            onClick={() => setMode('immersive')}
            aria-pressed={mode === 'immersive'}
          >
            Immersive View
          </button>
        </div>
      </header>

      {/* Quick Navigation Chips */}
      <nav className="alt-stage-nav no-print" aria-label="Lesson stages">
        <a href="#ph-predict" className="alt-nav-chip">1. Predict</a>
        <a href="#ph-bench" className="alt-nav-chip">2. Heating Bench</a>
        <a href="#ph-observe" className="alt-nav-chip">3. Observations</a>
        <a href="#ph-discoveries" className="alt-nav-chip">4. 3 Discoveries</a>
        <a href="#ph-graph" className="alt-nav-chip">5. Energy vs Time</a>
        <a href="#ph-misconception" className="alt-nav-chip">6. Misconceptions</a>
        <a href="#ph-explain" className="alt-nav-chip">7. Explanation</a>
        <a href="#ph-examples" className="alt-nav-chip">8. Worked Examples</a>
        <a href="#ph-practice" className="alt-nav-chip">9. Practice Ladder</a>
        <a href="#ph-recap" className="alt-nav-chip">10. Recap</a>
      </nav>

      {/* Screen-reader Live Region */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>

      <div className="alt-lens-workspace">
        {/* STAGE 1: PREDICTIONS */}
        <section id="ph-predict" className="alt-stage-card alt-stage-predict" aria-labelledby="ph-h-predict">
          <div className="alt-stage-header">
            <span className="alt-stage-step">Stage 1 · Predictions</span>
            <h2 id="ph-h-predict">What do you predict?</h2>
          </div>
          <p className="alt-stage-lead">
            Consider a 6 Ω heating element connected across a 6 V supply, dissipating 6 W and transferring 60 J in 10 seconds:
          </p>

          {POWER_HEATING_PREDICTIONS.map((pred) => (
            <fieldset key={pred.id} className="alt-predict-fieldset el-prediction">
              <legend className="el-legend">{pred.heading}</legend>
              <p className="alt-stage-lead">{pred.prompt}</p>
              {pred.options.map((opt, idx) => (
                <label
                  key={opt}
                  className={`alt-radio-option ${predChoices[pred.id] === idx ? 'is-selected' : ''}`}
                >
                  <input
                    type="radio"
                    name={`ph-pred-${pred.id}`}
                    checked={predChoices[pred.id] === idx}
                    onChange={() => setPredChoices({ ...predChoices, [pred.id]: idx })}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </fieldset>
          ))}

          <div className="alt-stage-actions no-print">
            <button
              type="button"
              className="alt-action-btn primary"
              onClick={() =>
                loadSetup(
                  { supplyVoltageV: 6.0, resistanceOhm: 6.0, durationS: 10 },
                  'Baseline (6 V on 6 Ω for 10 s)'
                )
              }
            >
              Set up the baseline experiment (6 V, 6 Ω for 10 s)
            </button>
          </div>
        </section>

        {/* STAGE 2: EXPERIMENT BENCH */}
        <section id="ph-bench" className="alt-stage-card alt-stage-experiment" aria-labelledby="ph-h-bench">
          <div className="alt-stage-header">
            <div className="alt-stage-header-split">
              <div>
                <span className="alt-stage-step">Stage 2 · Interactive Heating Bench</span>
                <h2 id="ph-h-bench">Adjust Voltage &amp; Resistance. Run the Simulation Timer.</h2>
              </div>
              <span className="alt-live-bench-badge">
                Pure Joule Heating Model (H = Pt)
              </span>
            </div>
          </div>

          <div className="alt-notice-banner warning" role="note">
            <strong>Energy Transfer Notice:</strong> Energy transferred is shown as an accumulating gauge and live graph. This lesson focuses on the rate of electrical energy conversion (Power) and total energy transferred (Joules), without unrealistic temperature claims.
          </div>

          {/* Circuit SVG Diagram */}
          <div className="alt-bench-svg-container">
            <HeatingCircuitSVG result={result} />
          </div>

          {/* Simulation Controls: Run / Pause / Reset / Step */}
          <div className="ph-sim-controls-bar no-print" role="toolbar" aria-label="Simulation timer controls">
            <div className="ph-timer-display">
              <span className="ph-timer-label">Elapsed Time:</span>
              <strong className="ph-timer-seconds">{circuit.elapsedTimeS} s</strong>
              <span className="ph-timer-target">/ Target: {targetDurationS} s</span>
            </div>

            <div className="ph-btn-group">
              {!isRunning ? (
                <button
                  type="button"
                  className="alt-action-btn primary"
                  onClick={handleStart}
                  disabled={!circuit.switchClosed}
                >
                  ▶ Run Timer
                </button>
              ) : (
                <button type="button" className="alt-action-btn secondary" onClick={handlePause}>
                  ⏸ Pause
                </button>
              )}

              <button type="button" className="alt-action-btn secondary" onClick={() => handleStep(1)}>
                +1 s Step
              </button>
              <button type="button" className="alt-action-btn secondary" onClick={() => handleStep(5)}>
                +5 s Step
              </button>
              <button type="button" className="alt-action-btn tertiary" onClick={handleReset}>
                ↺ Reset
              </button>
              <button
                type="button"
                className={`alt-action-btn ${circuit.switchClosed ? 'secondary' : 'primary'}`}
                onClick={toggleSwitch}
              >
                {circuit.switchClosed ? 'Open Switch (Off)' : 'Close Switch (On)'}
              </button>
            </div>
          </div>

          {/* Bench Sliders and Inputs */}
          <div className="alt-controls-grid">
            {/* Supply Voltage */}
            <div className="alt-control-item">
              <div className="alt-control-label-row">
                <label htmlFor="ph-v-slider" className="alt-control-label">
                  Supply Voltage V (volts)
                </label>
                <span className="alt-signed-pill">{formatHeatingNumber(circuit.supplyVoltageV)} V</span>
              </div>
              <div className="alt-control-inputs">
                <input
                  id="ph-v-slider"
                  type="range"
                  min={POWER_HEATING_LIMITS.supplyVoltageV.min}
                  max={POWER_HEATING_LIMITS.supplyVoltageV.max}
                  step={POWER_HEATING_LIMITS.supplyVoltageV.step}
                  value={circuit.supplyVoltageV}
                  onChange={(e) => editField('supplyVoltageV', e.target.value)}
                />
                <input
                  id="ph-v-number"
                  type="number"
                  aria-label="Supply voltage in volts"
                  aria-invalid={errors.supplyVoltageV ? true : undefined}
                  min={POWER_HEATING_LIMITS.supplyVoltageV.min}
                  max={POWER_HEATING_LIMITS.supplyVoltageV.max}
                  step="any"
                  value={drafts.supplyVoltageV}
                  onChange={(e) => editField('supplyVoltageV', e.target.value)}
                  className="alt-number-input"
                />
              </div>
              <p className="el-range-hint">
                Range: {POWER_HEATING_LIMITS.supplyVoltageV.min}–{POWER_HEATING_LIMITS.supplyVoltageV.max} V
              </p>
              {errors.supplyVoltageV && (
                <p className="alt-field-error" role="alert">{errors.supplyVoltageV}</p>
              )}
            </div>

            {/* Resistance */}
            <div className="alt-control-item">
              <div className="alt-control-label-row">
                <label htmlFor="ph-r-slider" className="alt-control-label">
                  Element Resistance R (ohms)
                </label>
                <span className="alt-signed-pill">{formatHeatingNumber(circuit.resistanceOhm)} Ω</span>
              </div>
              <div className="alt-control-inputs">
                <input
                  id="ph-r-slider"
                  type="range"
                  min={POWER_HEATING_LIMITS.resistanceOhm.min}
                  max={POWER_HEATING_LIMITS.resistanceOhm.max}
                  step={POWER_HEATING_LIMITS.resistanceOhm.step}
                  value={circuit.resistanceOhm}
                  onChange={(e) => editField('resistanceOhm', e.target.value)}
                />
                <input
                  id="ph-r-number"
                  type="number"
                  aria-label="Element resistance in ohms"
                  aria-invalid={errors.resistanceOhm ? true : undefined}
                  min={POWER_HEATING_LIMITS.resistanceOhm.min}
                  max={POWER_HEATING_LIMITS.resistanceOhm.max}
                  step="any"
                  value={drafts.resistanceOhm}
                  onChange={(e) => editField('resistanceOhm', e.target.value)}
                  className="alt-number-input"
                />
              </div>
              <p className="el-range-hint">
                Range: {POWER_HEATING_LIMITS.resistanceOhm.min}–{POWER_HEATING_LIMITS.resistanceOhm.max} Ω
              </p>
              {errors.resistanceOhm && (
                <p className="alt-field-error" role="alert">{errors.resistanceOhm}</p>
              )}
            </div>

            {/* Target Duration */}
            <div className="alt-control-item">
              <div className="alt-control-label-row">
                <label htmlFor="ph-t-slider" className="alt-control-label">
                  Target Duration t (seconds)
                </label>
                <span className="alt-signed-pill">{targetDurationS} s</span>
              </div>
              <div className="alt-control-inputs">
                <input
                  id="ph-t-slider"
                  type="range"
                  min={POWER_HEATING_LIMITS.durationS.min}
                  max={POWER_HEATING_LIMITS.durationS.max}
                  step={POWER_HEATING_LIMITS.durationS.step}
                  value={targetDurationS}
                  onChange={(e) => editField('targetDurationS', e.target.value)}
                />
                <input
                  id="ph-t-number"
                  type="number"
                  aria-label="Target duration in seconds"
                  aria-invalid={errors.targetDurationS ? true : undefined}
                  min={POWER_HEATING_LIMITS.durationS.min}
                  max={POWER_HEATING_LIMITS.durationS.max}
                  step="any"
                  value={drafts.targetDurationS}
                  onChange={(e) => editField('targetDurationS', e.target.value)}
                  className="alt-number-input"
                />
              </div>
              <p className="el-range-hint">
                Range: {POWER_HEATING_LIMITS.durationS.min}–{POWER_HEATING_LIMITS.durationS.max} s
              </p>
              {errors.targetDurationS && (
                <p className="alt-field-error" role="alert">{errors.targetDurationS}</p>
              )}
            </div>
          </div>
        </section>

        {/* STAGE 3: OBSERVATIONS */}
        <section id="ph-observe" className="alt-stage-card alt-stage-feedback" aria-labelledby="ph-h-obs">
          <div className="alt-stage-header">
            <span className="alt-stage-step">Stage 3 · Observations</span>
            <h2 id="ph-h-obs">Live Power, Current &amp; Heat Readings</h2>
          </div>

          <div
            className="alt-readout-grid"
            style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(10.5rem, 1fr))' }}
            aria-label="Live electrical readings"
          >
            <div className="alt-readout-box">
              <span className="alt-readout-label">Element Voltage (V)</span>
              <strong className="alt-readout-value">{formatHeatingNumber(result.elementVoltageV)} V</strong>
            </div>
            <div className="alt-readout-box">
              <span className="alt-readout-label">Circuit Current (I = V/R)</span>
              <strong className="alt-readout-value">{formatHeatingNumber(result.currentA)} A</strong>
            </div>
            <div className="alt-readout-box">
              <span className="alt-readout-label">Instantaneous Power (P = VI)</span>
              <strong className="alt-readout-value">{formatHeatingNumber(result.powerW)} W</strong>
            </div>
            <div className="alt-readout-box">
              <span className="alt-readout-label">Accumulated Heat (H = Pt)</span>
              <strong className="alt-readout-value">{formatHeatingNumber(result.energyJ, 1)} J</strong>
            </div>
          </div>

          {/* Energy Accumulation Gauge Bar */}
          <EnergyAccumulatorGauge
            energyJ={result.energyJ}
            powerW={result.powerW}
            elapsedTimeS={circuit.elapsedTimeS}
            maxEnergyJ={Math.max(250, result.powerW * targetDurationS)}
          />

          <div className="alt-feedback-callout">
            <h3>Energy Conversion Summary</h3>
            <p>
              At a supply voltage of <strong>{formatHeatingNumber(result.supplyVoltageV)} V</strong> across a{' '}
              <strong>{formatHeatingNumber(result.resistanceOhm)} Ω</strong> heating element, the steady current is{' '}
              <strong>{formatHeatingNumber(result.currentA)} A</strong>. Electrical energy is converted into heat at a rate of{' '}
              <strong>{formatHeatingNumber(result.powerW)} W</strong> (Joules per second). After running for{' '}
              <strong>{circuit.elapsedTimeS} seconds</strong>, the total thermal energy transferred is{' '}
              <strong>{formatHeatingNumber(result.energyJ, 1)} Joules</strong> ({formatHeatingNumber(result.energyKJ, 3)} kJ).
            </p>
          </div>
        </section>

        {/* STAGE 4: THREE GUIDED DISCOVERIES */}
        <section id="ph-discoveries" className="alt-stage-card" aria-labelledby="ph-h-disc">
          <div className="alt-stage-header">
            <span className="alt-stage-step">Stage 4 · Guided Discoveries</span>
            <h2 id="ph-h-disc">Three Controlled Experiments</h2>
          </div>
          <p className="alt-stage-lead">
            Explore how voltage, time, and resistance independently change power and accumulated heat:
          </p>

          <div className="alt-discoveries-grid">
            {POWER_HEATING_DISCOVERIES.map((disc) => (
              <div key={disc.id} className="alt-discovery-card">
                <div className="alt-discovery-header">
                  <h3>{disc.title}</h3>
                  <span className="alt-fixed-tag">{disc.fixedCondition}</span>
                </div>
                <p className="alt-discovery-subtitle">{disc.subtitle}</p>

                <div className="alt-discovery-comparison">
                  <div className="alt-disc-state before">
                    <span className="alt-disc-badge">Before</span>
                    <p>{disc.beforeSummary}</p>
                  </div>
                  <div className="alt-disc-arrow">→</div>
                  <div className="alt-disc-state after">
                    <span className="alt-disc-badge">After</span>
                    <p>{disc.afterSummary}</p>
                  </div>
                </div>

                <div className="alt-discovery-outcome">
                  <strong>Discovery:</strong> {disc.expectedDiscovery}
                </div>
                <div className="alt-discovery-reason">
                  <strong>Why it happens:</strong> {disc.physicalReason}
                </div>

                <div className="alt-disc-action no-print">
                  <button
                    type="button"
                    className="alt-action-btn secondary"
                    onClick={() =>
                      loadSetup(
                        {
                          supplyVoltageV: disc.setup.supplyVoltageV,
                          resistanceOhm: disc.setup.resistanceOhm,
                          durationS: disc.targetDurationS,
                        },
                        disc.title
                      )
                    }
                  >
                    {disc.actionLabel}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* STAGE 5: ENERGY VS TIME GRAPH */}
        <section id="ph-graph" className="alt-stage-card" aria-labelledby="ph-h-graph">
          <div className="alt-stage-header">
            <span className="alt-stage-step">Stage 5 · Graphing Relationships</span>
            <h2 id="ph-h-graph">Energy vs. Time Graph (H vs. t)</h2>
          </div>
          <p className="alt-stage-lead">
            Because power <span className="math-inline">P</span> is constant for a given voltage and resistance, the heat transferred is directly proportional to elapsed time: <span className="math-inline">H = P \times t</span>. The slope of this line is the power in Watts (J/s).
          </p>

          <EnergyVsTimeGraphSVG
            history={energyHistory}
            currentPowerW={result.powerW}
            targetDurationS={targetDurationS}
          />

          <div className="alt-feedback-callout" style={{ marginTop: '1rem' }}>
            <h3>Reading the Graph</h3>
            <p>
              • <strong>Straight-line slope:</strong> The steeper the line, the greater the power <span className="math-inline">P</span>. At 12 V on 6 Ω (24 W), the line rises 4 times faster than at 6 V on 6 Ω (6 W).<br />
              • <strong>Area under the power line:</strong> In a Power vs. Time plot, the area equals energy <span className="math-inline">H = Pt</span>. In this Energy vs. Time plot, the vertical height represents accumulated Joules.
            </p>
          </div>
        </section>

        {/* STAGE 6: THE MISCONCEPTION */}
        <section id="ph-misconception" className="alt-stage-card" aria-labelledby="ph-h-misc">
          <div className="alt-stage-header">
            <span className="alt-stage-step">Stage 6 · Resolving Misconceptions</span>
            <h2 id="ph-h-misc">Does Higher Resistance Always Produce More Heat?</h2>
          </div>

          <div className="el-misconception-box">
            <h3>The Crucial Distinction: Which Quantity is Held Constant?</h3>
            <p>
              Students often ask: <em>“Formula 1 says P = I²R (more resistance means more power), but Formula 2 says P = V²/R (more resistance means less power). Which is correct?”</em>
            </p>
            <div className="ph-comparison-table-wrap">
              <table className="alt-materials-table" aria-label="Comparison between fixed voltage and fixed current">
                <thead>
                  <tr>
                    <th>Operating Condition</th>
                    <th>Where it Applies</th>
                    <th>Governing Formula</th>
                    <th>Effect of Higher Resistance</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Fixed Voltage (V = const)</strong></td>
                    <td>Household appliances plugged into 220 V mains; parallel circuits</td>
                    <td><span className="math-inline">P = V² / R</span></td>
                    <td><strong>Decreases heat &amp; power!</strong> High R draws less current. (A 2000 W geyser has a lower resistance than a 60 W bulb).</td>
                  </tr>
                  <tr>
                    <td><strong>Fixed Current (I = const)</strong></td>
                    <td>Series circuits; transmission lines with regulated current</td>
                    <td><span className="math-inline">P = I² R</span></td>
                    <td><strong>Increases heat &amp; power!</strong> High R drops more voltage across itself.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="alt-misconceptions-list" style={{ marginTop: '1.25rem' }}>
            {POWER_HEATING_MISCONCEPTIONS.map((misc, idx) => (
              <div key={idx} className="alt-misconception-item">
                <h3>{misc.title}</h3>
                <p className="alt-bad-intuition">
                  <strong>Intuitive trap:</strong> {misc.badIntuition}
                </p>
                <p className="alt-correct-physics">
                  <strong>Scientific reality:</strong> {misc.correctPhysics}
                </p>
                <p className="alt-takeaway">
                  <strong>Key Takeaway:</strong> {misc.takeaway}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* STAGE 7: FORMULAS & EXPLANATION */}
        <section id="ph-explain" className="alt-stage-card alt-stage-explain" aria-labelledby="ph-h-explain">
          <div className="alt-stage-header">
            <span className="alt-stage-step">Stage 7 · Theoretical Foundation</span>
            <h2 id="ph-h-explain">Joule’s Law of Heating &amp; Electrical Power</h2>
          </div>

          <div className="alt-explain-grid">
            <div className="alt-explain-card">
              <h3>1. Work Done by Electric Charge</h3>
              <p>
                Potential difference <span className="math-inline">V</span> is the work done per unit charge in moving it between two points:
              </p>
              <div className="alt-formula-callout">
                <span className="math-display">W = V \times Q</span>
              </div>
              <p>
                Since current <span className="math-inline">I = Q / t</span>, the charge that flows in time <span className="math-inline">t</span> is <span className="math-inline">Q = I \times t</span>:
              </p>
              <div className="alt-formula-callout">
                <span className="math-display">W = V \times I \times t</span>
              </div>
            </div>

            <div className="alt-explain-card">
              <h3>2. Electric Power (P)</h3>
              <p>
                Power is the rate at which electrical work is done or energy is dissipated:
              </p>
              <div className="alt-formula-callout">
                <span className="math-display">{'P = \\frac{W}{t} = V \\times I'}</span>
              </div>
              <p>
                Using Ohm’s Law (<span className="math-inline">V = IR</span> and <span className="math-inline">I = V/R</span>), we get the three classic expressions for power:
              </p>
              <div className="alt-formula-callout">
                <span className="math-display">{'P = VI = I^2 R = \\frac{V^2}{R}'}</span>
              </div>
            </div>

            <div className="alt-explain-card">
              <h3>3. Joule’s Law of Heating (H)</h3>
              <p>
                When current <span className="math-inline">I</span> flows through a purely resistive conductor of resistance <span className="math-inline">R</span> for time <span className="math-inline">t</span>, all the electrical work is converted into heat:
              </p>
              <div className="alt-formula-callout">
                <span className="math-display">H = I^2 R t</span>
              </div>
              <p>
                <strong>Joule’s Law states that heat produced is:</strong><br />
                1. Directly proportional to the square of current (<span className="math-inline">H \propto I^2</span>).<br />
                2. Directly proportional to resistance (<span className="math-inline">H \propto R</span>).<br />
                3. Directly proportional to time (<span className="math-inline">H \propto t</span>).
              </p>
            </div>
          </div>
        </section>

        {/* STAGE 8: WORKED EXAMPLES */}
        <section id="ph-examples" className="alt-stage-card alt-stage-worked-examples" aria-labelledby="ph-h-ex">
          <div className="alt-stage-header">
            <span className="alt-stage-step">Stage 8 · Step-by-Step Worked Examples</span>
            <h2 id="ph-h-ex">Model Numerical Problems</h2>
          </div>

          <div className="alt-examples-grid">
            {POWER_HEATING_WORKED_EXAMPLES.map((ex) => (
              <article key={ex.id} className="alt-example-card">
                <div className="alt-example-header">
                  <h3>{ex.title}</h3>
                  <p className="alt-example-context">{ex.context}</p>
                </div>

                <div className="alt-example-given">
                  <strong>Given Data:</strong>
                  <ul>
                    {Object.entries(ex.given).map(([k, v]) => (
                      <li key={k}>
                        <span className="el-bullet-label">{k}:</span> {v}
                      </li>
                    ))}
                  </ul>
                </div>

                <ol className="alt-example-steps">
                  {ex.steps.map((st, sIdx) => (
                    <li key={sIdx}>
                      <strong>{st.step}</strong>
                      <div className="alt-step-math">
                        <span className="alt-step-formula">{st.formula}</span>
                        <span className="alt-step-calc"> = {st.calc}</span>
                        <strong className="alt-step-result"> ⇒ {st.result}</strong>
                      </div>
                    </li>
                  ))}
                </ol>

                <div className="alt-example-answer">
                  <strong>Interpretation:</strong> {ex.finalAnswer}
                </div>

                {ex.benchSetup && (
                  <div className="alt-example-action no-print">
                    <button
                      type="button"
                      className="alt-action-btn secondary"
                      onClick={() =>
                        loadSetup(
                          ex.benchSetup!,
                          `Worked Example Setup (${ex.benchSetup!.supplyVoltageV} V, ${ex.benchSetup!.resistanceOhm} Ω)`
                        )
                      }
                    >
                      Load this setup on the bench
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>

        {/* STAGE 9: PRACTICE LADDER */}
        <section id="ph-practice" className="alt-stage-card alt-stage-practice" aria-labelledby="ph-h-prac">
          <div className="alt-stage-header">
            <div className="alt-stage-header-split">
              <div>
                <span className="alt-stage-step">Stage 9 · Practice Ladder</span>
                <h2 id="ph-h-prac">Test Your Understanding</h2>
              </div>
              <span className="alt-live-bench-badge">
                Score: {countCorrect()} / {POWER_HEATING_PRACTICE_QUESTIONS.length} Correct
              </span>
            </div>
          </div>

          {/* Question Selector Chips */}
          <div className="alt-preset-bar no-print" role="group" aria-label="Question selector">
            <span className="alt-preset-label">Questions:</span>
            {POWER_HEATING_PRACTICE_QUESTIONS.map((q, idx) => {
              const a = answers[q.id]
              const evaluated = a?.checked ? evaluatePowerHeatingPracticeAnswer(q, a) : null
              const isSelected = selectedQuestionId === q.id
              return (
                <button
                  key={q.id}
                  type="button"
                  className={`alt-preset-chip ${isSelected ? 'is-active' : ''} ${
                    evaluated?.status === 'correct' ? 'is-verified' : ''
                  }`}
                  onClick={() => setSelectedQuestionId(q.id)}
                >
                  Q{idx + 1} {evaluated?.status === 'correct' ? '✓' : ''}
                </button>
              )
            })}
          </div>

          {/* Active Question Card */}
          {POWER_HEATING_PRACTICE_QUESTIONS.map((q) => {
            if (q.id !== selectedQuestionId) return null
            const ans = answers[q.id] ?? EMPTY_PH_ANSWER
            const evaluation = ans.checked ? evaluatePowerHeatingPracticeAnswer(q, ans) : null

            return (
              <div key={q.id} className="alt-practice-question-card">
                <div className="alt-practice-header">
                  <div>
                    <span className="alt-difficulty-badge">{q.difficulty}</span>
                    <h3>{q.title}</h3>
                  </div>
                  {q.benchSetup && (
                    <button
                      type="button"
                      className="alt-action-btn secondary no-print"
                      onClick={() =>
                        loadSetup(
                          q.benchSetup!,
                          `Practice Question Setup (${q.benchSetup!.supplyVoltageV} V, ${q.benchSetup!.resistanceOhm} Ω)`
                        )
                      }
                    >
                      Load on Bench
                    </button>
                  )}
                </div>

                <p className="alt-practice-prompt">{q.prompt}</p>

                <fieldset className="alt-predict-fieldset">
                  <legend className="sr-only">{q.title}</legend>
                  {q.options.map((opt, optIdx) => (
                    <label
                      key={opt}
                      className={`alt-radio-option ${
                        ans.selectedOption === optIdx ? 'is-selected' : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name={`ph-question-${q.id}`}
                        checked={ans.selectedOption === optIdx}
                        onChange={() =>
                          patchAnswer(q.id, { selectedOption: optIdx, checked: false })
                        }
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </fieldset>

                <div className="alt-practice-actions no-print">
                  <button
                    type="button"
                    className="alt-action-btn primary"
                    disabled={ans.selectedOption === null}
                    onClick={() => patchAnswer(q.id, { checked: true })}
                  >
                    Check Answer
                  </button>
                  <button
                    type="button"
                    className="alt-action-btn tertiary"
                    onClick={() => patchAnswer(q.id, { showHint: !ans.showHint })}
                  >
                    {ans.showHint ? 'Hide Hint' : 'Show Hint'}
                  </button>
                  <button
                    type="button"
                    className="alt-action-btn tertiary"
                    onClick={() => patchAnswer(q.id, { showTrap: !ans.showTrap })}
                  >
                    {ans.showTrap ? 'Hide Trap' : 'Common Trap'}
                  </button>
                  <button
                    type="button"
                    className="alt-action-btn tertiary"
                    onClick={() => patchAnswer(q.id, { showSolution: !ans.showSolution })}
                  >
                    {ans.showSolution ? 'Hide Solution' : 'View Full Solution'}
                  </button>
                </div>

                {evaluation && (
                  <div
                    className={`alt-prediction-review ${
                      evaluation.status === 'correct' ? 'is-correct' : 'is-review'
                    }`}
                  >
                    <h4>{evaluation.status === 'correct' ? '✓ Correct!' : 'Review Your Thinking'}</h4>
                    <p>{evaluation.feedback}</p>
                  </div>
                )}

                {ans.showHint && (
                  <div className="alt-hint-box">
                    <strong>Hint:</strong> {q.hint}
                  </div>
                )}

                {ans.showTrap && (
                  <div className="alt-trap-box">
                    <strong>Misconception Trap:</strong> {q.trapExplanation}
                  </div>
                )}

                {ans.showSolution && (
                  <div className="alt-solution-box">
                    <strong>Step-by-Step Solution:</strong>
                    <ol>
                      {q.solutionSteps.map((step, sIdx) => (
                        <li key={sIdx}>{step}</li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            )
          })}
        </section>

        {/* STAGE 10: RECAP */}
        <section id="ph-recap" className="alt-stage-card" aria-labelledby="ph-h-recap">
          <div className="alt-stage-header">
            <span className="alt-stage-step">Stage 10 · Lesson Recap</span>
            <h2 id="ph-h-recap">Key Takeaways</h2>
          </div>
          <ul className="el-recap-list">
            <li>
              <strong>Power is the Rate of Energy Transfer:</strong> Measured in Watts (1 W = 1 J/s). Formula: <span className="math-inline">P = VI = I²R = V²/R</span>.
            </li>
            <li>
              <strong>Heat Accumulates Over Time:</strong> Measured in Joules (J) or kilojoules (kJ). Total heat: <span className="math-inline">H = Pt = I²Rt</span>.
            </li>
            <li>
              <strong>Voltage Doubling Quadruples Power:</strong> At fixed resistance, <span className="math-inline">P \propto V^2</span>. Doubling <span className="math-inline">V</span> quadruples both power and the heat accumulated in a given duration.
            </li>
            <li>
              <strong>Fixed Voltage vs Fixed Current:</strong> At fixed voltage (household mains), <span className="math-inline">P = V^2/R</span>, so <em>lower</em> resistance produces <em>more</em> heat. At fixed current (series circuit), <span className="math-inline">P = I^2R</span>, so <em>higher</em> resistance produces <em>more</em> heat.
            </li>
            <li>
              <strong>Current is Conserved:</strong> Current is not “consumed” into heat. Energy is transferred from the electric field to the lattice, while charge flow remains strictly conserved.
            </li>
          </ul>
        </section>
      </div>

      {/* Footer */}
      <footer className="alt-lens-footer" aria-label="Curriculum reference and review metadata">
        <div className="alt-footer-grid">
          <div>
            <h3>Curriculum References</h3>
            <ul>
              <li>{POWER_HEATING_SOURCE_METADATA.ncertReference}</li>
              <li>{POWER_HEATING_SOURCE_METADATA.secondaryReference}</li>
              <li>Assumptions: {POWER_HEATING_SOURCE_METADATA.modelAssumptions}</li>
              <li>{POWER_HEATING_SOURCE_METADATA.displayNotice}</li>
              <li>{POWER_HEATING_SOURCE_METADATA.questionOrigin}</li>
            </ul>
          </div>
          <div>
            <h3>Review Status</h3>
            <p className="alt-review-status">
              <strong>Status:</strong> {POWER_HEATING_SOURCE_METADATA.reviewStatus}.
            </p>
            <p className="alt-review-note">
              This lesson provides interactive visualization of electrical energy dissipation and Joule heating for CBSE Class 10 Physics students. Note that commercial energy units (kWh) and utility billing are covered in a dedicated follow-up lesson.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
