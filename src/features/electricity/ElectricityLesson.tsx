import { useState } from 'react'
import { CircuitDiagramSVG, VIPlotSVG } from './ElectricityDiagrams'
import {
  addMeasurementPoint,
  createDataset,
  COMMON_MISTAKES,
  CONCEPT_CARDS,
  countCorrect,
  ELECTRICITY_PRACTICE_QUESTIONS,
  ELECTRICITY_SOURCE_METADATA,
  ELECTRICITY_WORKED_EXAMPLES,
  EMPTY_ANSWER,
  evaluatePracticeAnswer,
  evaluatePredictionTest,
  isSolutionUnlocked,
  NOTICE_PROMPTS,
  noticeUnlocked,
  loadSetupOnExperiment,
  PREDICTIONS,
  selectPracticeQuestion,
  type AddPointStatus,
  type ElectricityPresentationMode,
  type ElectricityQuestionId,
  type ExperimentState,
  type MeasurementDataset,
  type PracticeAnswer,
  type PredictionBaseline,
  type PredictionId,
} from './electricityContent'
import {
  applyOhmDraftEdit,
  createOhmDrafts,
  formatOhmNumber,
  INITIAL_CIRCUIT_INPUT,
  type OhmFieldErrors,
} from './ohmInputValidation'
import {
  calculateCircuit,
  fitSlopeOhm,
  OHM_LIMITS,
  type CircuitInput,
  type OhmField,
} from './ohmModel'

const ADD_POINT_MESSAGES: Record<AddPointStatus, string> = {
  added: 'Point added to the graph.',
  duplicate: 'You already recorded this voltage. Change the supply voltage to add a new point.',
  switch_open: 'The switch is open, so there is no current to measure. Close the switch first.',
  resistance_mismatch:
    'This graph was started at a different resistance. Start a new graph so different resistors are never mixed on one line.',
}

export function ElectricityLesson() {
  const [mode, setMode] = useState<ElectricityPresentationMode>('reading')
  const [exp, setExp] = useState<ExperimentState>(() => ({
    circuit: INITIAL_CIRCUIT_INPUT,
    drafts: createOhmDrafts(INITIAL_CIRCUIT_INPUT),
    selectedQuestionId: 'q1',
  }))
  const [errors, setErrors] = useState<OhmFieldErrors>({})
  const [announcement, setAnnouncement] = useState('')

  const [choices, setChoices] = useState<Record<PredictionId, number | null>>({
    'double-voltage': null,
    'double-resistance': null,
  })
  const [baselines, setBaselines] = useState<Record<PredictionId, PredictionBaseline | null>>({
    'double-voltage': null,
    'double-resistance': null,
  })

  const [dataset, setDataset] = useState<MeasurementDataset>(() =>
    createDataset(INITIAL_CIRCUIT_INPUT.resistanceOhm)
  )
  const [pointMessage, setPointMessage] = useState('')

  const [answers, setAnswers] = useState<Partial<Record<ElectricityQuestionId, PracticeAnswer>>>({})

  function patchAnswer(id: ElectricityQuestionId, patch: Partial<PracticeAnswer>) {
    setAnswers((prev) => ({ ...prev, [id]: { ...(prev[id] ?? EMPTY_ANSWER), ...patch } }))
  }

  const { circuit, drafts, selectedQuestionId } = exp
  const result = calculateCircuit(circuit)
  const slope = fitSlopeOhm(dataset.points)
  const resistanceMatchesDataset = Math.abs(circuit.resistanceOhm - dataset.resistanceOhm) < 1e-9

  function editField(field: OhmField, raw: string) {
    const out = applyOhmDraftEdit(circuit, drafts, field, raw)
    setExp({ ...exp, circuit: out.input, drafts: out.drafts })
    setErrors(out.errors)
  }

  function setSwitch(closed: boolean) {
    setExp({ ...exp, circuit: { ...circuit, switchClosed: closed } })
    setAnnouncement(closed ? 'Switch closed.' : 'Switch opened. Current is zero.')
  }

  function loadSetup(setup: CircuitInput, label: string) {
    setExp(loadSetupOnExperiment(exp, setup))
    setErrors({})
    setAnnouncement(`Loaded on experiment: ${label}`)
  }

  function startPrediction(id: PredictionId) {
    const spec = PREDICTIONS.find((p) => p.id === id)!
    loadSetup(spec.startSetup, spec.heading)
    setBaselines({
      ...baselines,
      [id]: { predictionId: id, setup: spec.startSetup, currentA: calculateCircuit(spec.startSetup).currentA },
    })
  }

  function addPoint() {
    const out = addMeasurementPoint(dataset, result)
    setDataset(out.dataset)
    setPointMessage(ADD_POINT_MESSAGES[out.status])
  }

  function startNewGraph() {
    setDataset(createDataset(circuit.resistanceOhm))
    setPointMessage(`New graph started for R = ${formatOhmNumber(circuit.resistanceOhm)} Ω.`)
  }

  function clearPoints() {
    setDataset(createDataset(dataset.resistanceOhm))
    setPointMessage('Points cleared.')
  }

  function chooseQuestion(id: ElectricityQuestionId) {
    setExp(selectPracticeQuestion(exp, id))
  }

  const unlocked = noticeUnlocked(dataset.points.length)

  function tryAnotherResistor() {
    const nextR = circuit.resistanceOhm === 10 ? 20 : 10
    const setup: CircuitInput = { supplyVoltageV: 6, resistanceOhm: nextR, switchClosed: true }
    loadSetup(setup, `new resistor ${nextR} Ω`)
    setDataset(createDataset(nextR))
    setPointMessage(`New graph started for R = ${nextR} Ω.`)
  }

  function renderControl(field: OhmField, label: string, unit: string, id: string) {
    const lim = OHM_LIMITS[field]
    const current = circuit[field]
    const err = errors[field]
    return (
      <div className="alt-control-item">
        <div className="alt-control-label-row">
          <label htmlFor={`${id}-slider`} className="alt-control-label">
            {label}
          </label>
          <span className="alt-signed-pill">
            {formatOhmNumber(current)} {unit}
          </span>
        </div>
        <div className="alt-control-inputs">
          <input
            id={`${id}-slider`}
            type="range"
            min={lim.min}
            max={lim.max}
            step={lim.step}
            value={current}
            onChange={(e) => editField(field, e.target.value)}
          />
          <input
            id={`${id}-number`}
            type="number"
            aria-label={`${label} (number entry, ${lim.min} to ${lim.max} ${unit})`}
            aria-invalid={err ? true : undefined}
            aria-describedby={err ? `${id}-error` : undefined}
            min={lim.min}
            max={lim.max}
            step="any"
            value={drafts[field]}
            onChange={(e) => editField(field, e.target.value)}
            className="alt-number-input"
          />
        </div>
        <p className="el-range-hint">
          Allowed range: {lim.min}–{lim.max} {unit}
        </p>
        {err && (
          <p id={`${id}-error`} className="alt-field-error" role="alert">
            {err}
          </p>
        )}
      </div>
    )
  }

  const stateText =
    result.state === 'open'
      ? 'Switch open: the circuit is broken, so no current flows.'
      : result.state === 'zero_supply'
        ? 'Switch closed but the supply is 0 V: nothing pushes charge round the circuit, so the current is 0 A.'
        : `Switch closed: I = V ÷ R = ${formatOhmNumber(circuit.supplyVoltageV)} V ÷ ${formatOhmNumber(circuit.resistanceOhm)} Ω = ${formatOhmNumber(result.currentA)} A.`

  return (
    <main className={`alt-lens-page mode-${mode}`} aria-label="Electricity lesson">
      <header className="alt-lens-header">
        <div className="alt-lens-title-block">
          <div className="alt-lens-eyebrow-row">
            <span className="alt-lens-chapter-tag">Class 10 Physics · Electricity</span>
            <span className="alt-lens-provisional-pill">{ELECTRICITY_SOURCE_METADATA.reviewStatus}</span>
          </div>
          <h1 className="alt-lens-h1">What Makes Current Change?</h1>
          <p className="alt-lens-subtitle">
            Change the supply voltage and the resistance of one simple circuit, watch the ammeter and
            voltmeter, and find the rule that links them.
          </p>
        </div>
        <div className="alt-lens-toolbar no-print">
          <div className="alt-mode-toggle" role="group" aria-label="Lesson presentation mode">
            <button
              type="button"
              className={`alt-mode-btn ${mode === 'reading' ? 'is-active' : ''}`}
              aria-pressed={mode === 'reading'}
              onClick={() => setMode('reading')}
            >
              Read &amp; Learn
            </button>
            <button
              type="button"
              className={`alt-mode-btn ${mode === 'immersive' ? 'is-active' : ''}`}
              aria-pressed={mode === 'immersive'}
              onClick={() => setMode('immersive')}
            >
              Explore the Circuit
            </button>
          </div>
          <button type="button" className="alt-print-btn" onClick={() => window.print()}>
            Print Lesson Sheet
          </button>
        </div>
      </header>

      <div className="sr-only" aria-live="polite">
        {announcement}
      </div>

      <nav className="alt-sequence-nav no-print" aria-label="Lesson sequence">
        <a href="#el-ideas" className="alt-seq-chip">1. Ideas</a>
        <a href="#el-predict" className="alt-seq-chip">2. Predict</a>
        <a href="#el-experiment" className="alt-seq-chip">3. Experiment</a>
        <a href="#el-feedback" className="alt-seq-chip">4. Feedback</a>
        <a href="#el-graph" className="alt-seq-chip">5. Graph</a>
        <a href="#el-explain" className="alt-seq-chip">6. Explain</a>
        <a href="#el-examples" className="alt-seq-chip">7. Worked Examples</a>
        <a href="#el-practice" className="alt-seq-chip">8. Practice</a>
        <a href="#el-recap" className="alt-seq-chip">9. Recap</a>
      </nav>

      <div className="alt-lens-workspace">
        {/* 1. IDEAS */}
        <section id="el-ideas" className="alt-stage-card" aria-labelledby="el-h-ideas">
          <div className="alt-stage-header">
            <span className="alt-stage-step">Stage 1 · Three ideas first</span>
            <h2 id="el-h-ideas">Three words you need</h2>
          </div>
          <p className="alt-stage-lead">
            Each idea has an everyday picture. The textbook name is in brackets.
          </p>
          <div className="el-concept-grid">
            {CONCEPT_CARDS.map((c) => (
              <article key={c.id} className="alt-explain-card el-concept-card">
                <h3>
                  {c.plainName} <span className="el-term">({c.ncertTerm})</span>
                </h3>
                <p>{c.meaning}</p>
                <p className="el-picture">
                  <strong>Picture it:</strong> {c.picture}
                </p>
                <p>
                  <strong>Unit:</strong> {c.unit}. {c.meter}
                </p>
                <details className="alt-solution-details el-check">
                  <summary>Check yourself: {c.checkQuestion}</summary>
                  <p>{c.checkAnswer}</p>
                </details>
              </article>
            ))}
          </div>
          <p className="alt-stage-lead el-together">
            <strong>Put them together:</strong> the same push with a harder path gives less flow. In
            symbols, I = V ÷ R.
          </p>
        </section>

        {/* 2. PREDICT */}
        <section id="el-predict" className="alt-stage-card alt-stage-predict" aria-labelledby="el-h-predict">
          <div className="alt-stage-header">
            <span className="alt-stage-step">Stage 2 · Prediction</span>
            <h2 id="el-h-predict">What do you predict?</h2>
          </div>
          {PREDICTIONS.map((spec) => (
            <fieldset key={spec.id} className="alt-predict-fieldset el-prediction">
              <legend className="el-legend">{spec.heading}</legend>
              <p className="alt-stage-lead">{spec.prompt}</p>
              {spec.options.map((opt, idx) => (
                <label
                  key={opt}
                  className={`alt-radio-option ${choices[spec.id] === idx ? 'is-selected' : ''}`}
                >
                  <input
                    type="radio"
                    name={`el-pred-${spec.id}`}
                    checked={choices[spec.id] === idx}
                    onChange={() => setChoices({ ...choices, [spec.id]: idx })}
                  />
                  <span>{opt}</span>
                </label>
              ))}
              <div className="alt-stage-actions no-print">
                <button type="button" className="alt-action-btn primary" onClick={() => startPrediction(spec.id)}>
                  Set up the starting circuit ({formatOhmNumber(spec.startSetup.supplyVoltageV)} V,{' '}
                  {formatOhmNumber(spec.startSetup.resistanceOhm)} Ω)
                </button>
              </div>
            </fieldset>
          ))}
        </section>

        {/* 2. EXPERIMENT */}
        <section id="el-experiment" className="alt-stage-card alt-stage-experiment" aria-labelledby="el-h-exp">
          <div className="alt-stage-header">
            <div className="alt-stage-header-split">
              <div>
                <span className="alt-stage-step">Stage 3 · Experiment</span>
                <h2 id="el-h-exp">Change the circuit. Watch the meters.</h2>
              </div>
              <span className="alt-live-bench-badge">Current Setup</span>
            </div>
          </div>
          <div className="alt-bench-svg-container">
            <CircuitDiagramSVG result={result} />
          </div>
          <div className="alt-preset-bar no-print" role="group" aria-label="Switch">
            <span className="alt-preset-label">Switch:</span>
            <button
              type="button"
              className={`alt-preset-chip ${circuit.switchClosed ? 'is-active' : ''}`}
              aria-pressed={circuit.switchClosed}
              onClick={() => setSwitch(true)}
            >
              Closed
            </button>
            <button
              type="button"
              className={`alt-preset-chip ${!circuit.switchClosed ? 'is-active' : ''}`}
              aria-pressed={!circuit.switchClosed}
              onClick={() => setSwitch(false)}
            >
              Open
            </button>
          </div>
          <div className="alt-controls-grid">
            {renderControl('supplyVoltageV', 'Supply voltage', 'V', 'el-v')}
            {renderControl('resistanceOhm', 'Resistance', 'Ω', 'el-r')}
          </div>
        </section>

        {/* 3. FEEDBACK */}
        <section id="el-feedback" className="alt-stage-card alt-stage-feedback" aria-labelledby="el-h-fb">
          <div className="alt-stage-header">
            <div className="alt-stage-header-split">
              <div>
                <span className="alt-stage-step">Stage 4 · Feedback</span>
                <h2 id="el-h-fb">What the meters show right now</h2>
              </div>
              <span className="alt-live-bench-badge">Updates as you change the circuit</span>
            </div>
          </div>
          <div className="alt-readout-grid el-readout-grid" aria-label="Meter readings">
            <div className="alt-readout-box">
              <span className="alt-readout-label">Supply voltage (set)</span>
              <strong className="alt-readout-value">{formatOhmNumber(result.supplyVoltageV)} V</strong>
            </div>
            <div className="alt-readout-box">
              <span className="alt-readout-label">Voltmeter across resistor</span>
              <strong className="alt-readout-value">{formatOhmNumber(result.resistorVoltageV)} V</strong>
            </div>
            <div className="alt-readout-box">
              <span className="alt-readout-label">Ammeter (circuit current)</span>
              <strong className="alt-readout-value">{formatOhmNumber(result.currentA)} A</strong>
            </div>
          </div>
          <div className="alt-feedback-callout">
            <h3>{result.state === 'flowing' ? 'Current is flowing' : 'No current'}</h3>
            <p>{stateText}</p>
          </div>
          {PREDICTIONS.map((spec) => {
            const outcome = evaluatePredictionTest(spec, baselines[spec.id], circuit, choices[spec.id])
            if (outcome.status === 'not_started') return null
            const cls =
              outcome.status === 'tested' && outcome.matchesChoice === false
                ? 'is-review'
                : outcome.status === 'tested' && outcome.matchesChoice
                  ? 'is-correct'
                  : 'is-review'
            return (
              <div key={spec.id} className={`alt-prediction-review ${cls}`}>
                <h4>{spec.heading}</h4>
                <p>{outcome.message}</p>
              </div>
            )
          })}
        </section>

        {/* 4. MEASURE & GRAPH */}
        <section id="el-graph" className="alt-stage-card el-graph-stage" aria-labelledby="el-h-graph">
          <div className="alt-stage-header">
            <div className="alt-stage-header-split">
              <div>
                <span className="alt-stage-step">Stage 5 · Measure, Graph &amp; Notice</span>
                <h2 id="el-h-graph">Plot voltage against current</h2>
              </div>
              <span className="alt-static-example-badge">
                One graph = one resistor: R = {formatOhmNumber(dataset.resistanceOhm)} Ω
              </span>
            </div>
          </div>
          <p className="alt-stage-lead">
            Keep the resistance fixed. Change the supply voltage, then press “Add point” each time. If
            you change the resistance, start a new graph instead of mixing resistors on one line.
          </p>
          {!resistanceMatchesDataset && (
            <p className="alt-field-error" role="status">
              The circuit now uses R = {formatOhmNumber(circuit.resistanceOhm)} Ω, but this graph is for
              R = {formatOhmNumber(dataset.resistanceOhm)} Ω. Points cannot be added until you start a
              new graph.
            </p>
          )}
          <div className="alt-stage-actions no-print">
            <button
              type="button"
              className="alt-action-btn primary"
              onClick={addPoint}
              disabled={!resistanceMatchesDataset || !circuit.switchClosed}
            >
              Add point (V = {formatOhmNumber(result.resistorVoltageV)} V, I = {formatOhmNumber(result.currentA)} A)
            </button>
            <button type="button" className="alt-action-btn secondary" onClick={startNewGraph}>
              Start new graph at {formatOhmNumber(circuit.resistanceOhm)} Ω
            </button>
            <button
              type="button"
              className="alt-action-btn secondary"
              onClick={clearPoints}
              disabled={dataset.points.length === 0}
            >
              Clear points
            </button>
          </div>
          <p className="el-point-message" role="status">
            {pointMessage}
          </p>
          <div className="el-graph-grid">
            <div className="alt-bench-svg-container">
              <VIPlotSVG points={dataset.points} resistanceOhm={dataset.resistanceOhm} />
            </div>
            <div className="alt-table-wrapper">
              <table className="alt-ncert-table">
                <caption className="el-caption">Measurements for R = {formatOhmNumber(dataset.resistanceOhm)} Ω</caption>
                <thead>
                  <tr>
                    <th scope="col">I (A)</th>
                    <th scope="col">V (V)</th>
                    <th scope="col">V ÷ I (Ω)</th>
                  </tr>
                </thead>
                <tbody>
                  {dataset.points.length === 0 ? (
                    <tr>
                      <td colSpan={3}>No points yet.</td>
                    </tr>
                  ) : (
                    dataset.points.map((p) => (
                      <tr key={p.voltageV}>
                        <td>{formatOhmNumber(p.currentA)}</td>
                        <td>{formatOhmNumber(p.voltageV)}</td>
                        <td>{p.currentA > 0 ? formatOhmNumber(p.voltageV / p.currentA) : '—'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <p className="el-slope-note">
                {slope === null
                  ? 'Add at least two points with different currents to see the slope.'
                  : `Slope of the line = ΔV ÷ ΔI ≈ ${formatOhmNumber(slope)} Ω. This equals the resistance of this resistor.`}
              </p>
            </div>
          </div>
          <div className="el-notice">
            <h3>Now notice</h3>
            <p className="el-notice-lead">Look at your own table and graph, then open each answer.</p>
            {NOTICE_PROMPTS.map((n, i) => (
              <details key={n.id} className="alt-solution-details" open={false}>
                {unlocked[i] ? (
                  <>
                    <summary>{n.question}</summary>
                    <p>{n.conclusion}</p>
                  </>
                ) : (
                  <summary className="el-locked">
                    {n.question} (Add {n.pointsNeeded - dataset.points.length} more point
                    {n.pointsNeeded - dataset.points.length === 1 ? '' : 's'} to unlock.)
                  </summary>
                )}
              </details>
            ))}
          </div>
        </section>

        {/* 6. EXPLAIN */}
        <section id="el-explain" className="alt-stage-card alt-stage-explain" aria-labelledby="el-h-explain">
          <div className="alt-stage-header">
            <span className="alt-stage-step">Stage 6 · Explanation</span>
            <h2 id="el-h-explain">The rule in simple words</h2>
          </div>
          <div className="alt-explain-columns">
            <article className="alt-explain-card">
              <h3>What you found</h3>
              <ul>
                <li>The push (voltage) makes charge flow. The hard path (resistance) holds it back.</li>
                <li>More push gives more current. A harder path gives less current.</li>
                <li>
                  The rule is <span className="math-inline">V = I × R</span> (Ohm’s law). You can also
                  write <span className="math-inline">I = V ÷ R</span> or{' '}
                  <span className="math-inline">R = V ÷ I</span>.
                </li>
                <li>On a V–I graph, the slope is R.</li>
                <li>If the switch is open, the path is broken. So I = 0, and V across the resistor is 0.</li>
              </ul>
            </article>
            <article className="alt-explain-card">
              <h3>When does the rule work?</h3>
              <ul>
                <li>
                  <strong>Same temperature.</strong> V = I × R with a constant R needs a conductor at
                  constant temperature. A hot filament changes its R, and its graph bends.
                </li>
                <li>
                  <strong>The supply keeps its voltage</strong> (an ideal source).
                </li>
                <li>
                  <strong>The meters do not disturb the circuit</strong> (ideal meters).
                </li>
                <li>
                  <strong>Not in this lesson:</strong> short circuits (R = 0), more than one resistor, AC
                  and real bulbs.
                </li>
              </ul>
            </article>
          </div>
          <div className="el-mistakes">
            <h3>Common mistakes</h3>
            <ul className="el-mistake-list">
              {COMMON_MISTAKES.map((m) => (
                <li key={m.mistake}>
                  <span className="el-mistake">✗ {m.mistake}</span>
                  <span className="el-better">✓ {m.better}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 7. WORKED EXAMPLES */}
        <section id="el-examples" className="alt-stage-card alt-stage-examples" aria-labelledby="el-h-examples">
          <div className="alt-stage-header">
            <div className="alt-stage-header-split">
              <div>
                <span className="alt-stage-step">Stage 7 · Worked Examples</span>
                <h2 id="el-h-examples">Worked Examples</h2>
              </div>
              <span className="alt-static-example-badge">Fixed numbers — not linked to your circuit</span>
            </div>
          </div>
          <div className="alt-examples-grid">
            {ELECTRICITY_WORKED_EXAMPLES.map((ex) => (
              <article key={ex.id} className="alt-example-card" aria-labelledby={`el-title-${ex.id}`}>
                <div className="alt-example-card-top">
                  <span className="alt-example-badge">{ex.badge}</span>
                </div>
                <h3 id={`el-title-${ex.id}`}>{ex.title}</h3>
                <p className="alt-example-scenario">{ex.scenario}</p>
                <ol className="alt-example-steps">
                  {ex.steps.map((s) => (
                    <li key={s.heading} className="alt-example-step">
                      <strong>{s.heading}</strong>
                      <div className="alt-substitution-line">{s.line}</div>
                      <p className="alt-step-conclusion">{s.note}</p>
                    </li>
                  ))}
                </ol>
                <div className="alt-example-footer no-print">
                  <button
                    type="button"
                    className="alt-action-btn secondary"
                    onClick={() => loadSetup(ex.input, ex.title)}
                  >
                    Load on Experiment ({formatOhmNumber(ex.input.supplyVoltageV)} V, {formatOhmNumber(ex.input.resistanceOhm)} Ω)
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 8. PRACTICE */}
        <section id="el-practice" className="alt-stage-card alt-stage-practice" aria-labelledby="el-h-practice">
          <div className="alt-stage-header">
            <div className="alt-stage-header-split">
              <div>
                <span className="alt-stage-step">Stage 8 · Practice</span>
                <h2 id="el-h-practice">Practice, from easy to harder</h2>
              </div>
              <span className="alt-static-example-badge">Choosing a question keeps your circuit</span>
            </div>
          </div>
          <p className="alt-stage-lead">
            Do one question at a time. Use the hint if you are stuck. The worked solution opens after
            you check your answer once.
          </p>
          <p className="el-score" role="status">
            Answered correctly: {countCorrect(answers)} of {ELECTRICITY_PRACTICE_QUESTIONS.length}
          </p>
          <div className="alt-practice-tabs no-print" role="tablist" aria-label="Practice questions">
            {ELECTRICITY_PRACTICE_QUESTIONS.map((q, i) => (
              <button
                key={q.id}
                type="button"
                role="tab"
                id={`el-tab-${q.id}`}
                aria-selected={selectedQuestionId === q.id}
                aria-controls={`el-panel-${q.id}`}
                className={`alt-practice-tab ${selectedQuestionId === q.id ? 'is-active' : ''}`}
                onClick={() => chooseQuestion(q.id)}
              >
                {i + 1}. {q.level}
              </button>
            ))}
          </div>

          {ELECTRICITY_PRACTICE_QUESTIONS.map((q, i) => {
            const ans = answers[q.id] ?? EMPTY_ANSWER
            const ev = evaluatePracticeAnswer(q, ans)
            const selected = selectedQuestionId === q.id
            const next = ELECTRICITY_PRACTICE_QUESTIONS[i + 1]
            return (
              <div
                key={q.id}
                id={`el-panel-${q.id}`}
                role="tabpanel"
                aria-labelledby={`el-tab-${q.id}`}
                hidden={!selected}
                className={`alt-practice-panel ${selected ? 'is-visible' : 'print-only-block'}`}
              >
                <div className="alt-practice-card">
                  <div className="alt-practice-card-header">
                    <h3>
                      {q.title} <span className="el-level">({q.level})</span>
                    </h3>
                    {q.setup && (
                      <button
                        type="button"
                        className="alt-action-btn secondary no-print"
                        onClick={() => loadSetup(q.setup as CircuitInput, q.title)}
                      >
                        Load on Experiment
                      </button>
                    )}
                  </div>
                  <p className="alt-practice-prompt">{q.prompt}</p>

                  {q.graph && (
                    <div className="el-q-graph">
                      <VIPlotSVG points={q.graph.points} resistanceOhm={q.graph.resistanceOhm} />
                      <p className="el-slope-note">
                        Points (I, V):{' '}
                        {q.graph.points
                          .map((p) => `(${formatOhmNumber(p.currentA)} A, ${formatOhmNumber(p.voltageV)} V)`)
                          .join(', ')}
                      </p>
                    </div>
                  )}

                  {q.kind === 'choice' ? (
                    <fieldset className="alt-predict-fieldset">
                      <legend className="sr-only">Choose the best answer for {q.title}</legend>
                      {q.options.map((opt, idx) => (
                        <label key={opt} className={`alt-radio-option ${ans.choice === idx ? 'is-selected' : ''}`}>
                          <input
                            type="radio"
                            name={`el-choice-${q.id}`}
                            checked={ans.choice === idx}
                            onChange={() => patchAnswer(q.id, { choice: idx, checked: false })}
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </fieldset>
                  ) : (
                    <div className="alt-numerical-entry-row no-print">
                      <label htmlFor={`el-input-${q.id}`} className="alt-control-label">
                        {q.inputLabel}:
                      </label>
                      <input
                        id={`el-input-${q.id}`}
                        type="text"
                        inputMode="decimal"
                        placeholder="Enter a number"
                        value={ans.draft}
                        onChange={(e) => patchAnswer(q.id, { draft: e.target.value, checked: false })}
                        className="alt-practice-input"
                      />
                    </div>
                  )}

                  <div className="alt-stage-actions no-print">
                    <button
                      type="button"
                      className="alt-action-btn primary"
                      onClick={() => patchAnswer(q.id, { checked: true })}
                    >
                      Check answer
                    </button>
                    <button
                      type="button"
                      className="alt-action-btn secondary"
                      aria-expanded={ans.hintShown}
                      onClick={() => patchAnswer(q.id, { hintShown: !ans.hintShown })}
                    >
                      {ans.hintShown ? 'Hide hint' : 'Show hint'}
                    </button>
                    {next && (
                      <button
                        type="button"
                        className="alt-action-btn secondary"
                        onClick={() => chooseQuestion(next.id)}
                      >
                        Next question
                      </button>
                    )}
                  </div>

                  {ans.hintShown && (
                    <p className="el-hint" role="note">
                      <strong>Hint:</strong> {q.hint}
                    </p>
                  )}

                  {ans.checked && (
                    <div
                      className={`alt-practice-feedback status-${ev.status === 'correct' ? 'correct' : 'incorrect'}`}
                      role="status"
                    >
                      <p>{ev.message}</p>
                    </div>
                  )}

                  {isSolutionUnlocked(ans) ? (
                    <details className="alt-solution-details">
                      <summary>Worked solution</summary>
                      <p>{q.workedSolution}</p>
                    </details>
                  ) : (
                    <>
                      <p className="el-locked-note no-print">
                        Check your answer once to open the worked solution.
                      </p>
                      <p className="el-print-solution">
                        <strong>Worked solution:</strong> {q.workedSolution}
                      </p>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </section>

        {/* 9. RECAP */}
        <section id="el-recap" className="alt-stage-card" aria-labelledby="el-h-recap">
          <div className="alt-stage-header">
            <span className="alt-stage-step">Stage 9 · Recap</span>
            <h2 id="el-h-recap">What you can say now</h2>
          </div>
          <ul className="el-recap-list">
            <li>Voltage is the push, current is the flow, and resistance holds the flow back.</li>
            <li>
              At constant temperature, <span className="math-inline">V = I × R</span>. So doubling V
              doubles I, and doubling R halves I.
            </li>
            <li>On a V–I graph for one resistor, the points lie on a straight line and the slope is R.</li>
            <li>With the switch open, no current flows, and V across the resistor is 0.</li>
          </ul>
          <div className="alt-stage-actions no-print">
            <button type="button" className="alt-action-btn primary" onClick={tryAnotherResistor}>
              Try a different resistor (starts a new graph)
            </button>
            <a href="#el-experiment" className="alt-seq-chip">
              Go to the experiment
            </a>
          </div>
        </section>
      </div>

      <footer className="alt-lens-footer" aria-label="Sources and review status">
        <div className="alt-footer-grid">
          <div>
            <h3>Sources</h3>
            <ul>
              <li>{ELECTRICITY_SOURCE_METADATA.ncertReference}</li>
              <li>{ELECTRICITY_SOURCE_METADATA.cbseSession}</li>
              <li>{ELECTRICITY_SOURCE_METADATA.questionOrigin}</li>
            </ul>
          </div>
          <div>
            <h3>Model and review status</h3>
            <ul>
              <li>
                Ideal DC circuit: ideal source, ideal meters, resistor at constant temperature, supply
                0–12 V, resistance 1–100 Ω.
              </li>
              <li>
                <em>{ELECTRICITY_SOURCE_METADATA.reviewStatus}.</em> This page does not claim board or
                educator approval.
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </main>
  )
}
