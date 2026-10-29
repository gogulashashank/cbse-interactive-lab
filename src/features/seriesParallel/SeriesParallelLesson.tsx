import { useState } from 'react'
import { SPCircuitSVG } from './SPDiagrams'
import {
  buildComparisonData,
  EMPTY_SP_ANSWER,
  evaluateSPPracticeAnswer,
  loadSPSetupOnExperiment,
  selectSPQuestion,
  SP_MISCONCEPTIONS,
  SP_PRACTICE_QUESTIONS,
  SP_PREDICTION,
  SP_SOURCE_METADATA,
  SP_WORKED_EXAMPLES,
  type SPExperimentState,
  type SPPracticeAnswer,
  type SPPresentationMode,
  type SPQuestionId,
} from './spContent'
import {
  applySPDraftEdit,
  createSPDrafts,
  formatOhmNumber,
  INITIAL_SP_INPUT,
  type SPFieldErrors,
} from './spInputValidation'
import {
  calculateSeriesParallel,
  SP_LIMITS,
  type Arrangement,
  type SPField,
  type SPInput,
} from './spModel'

export function SeriesParallelLesson() {
  const [mode, setMode] = useState<SPPresentationMode>('reading')
  const [exp, setExp] = useState<SPExperimentState>(() => ({
    circuit: INITIAL_SP_INPUT,
    drafts: createSPDrafts(INITIAL_SP_INPUT),
    selectedQuestionId: 'sp-q1',
  }))
  const [errors, setErrors] = useState<SPFieldErrors>({})
  const [announcement, setAnnouncement] = useState('')

  // Prediction state
  const [predictionChoice, setPredictionChoice] = useState<number | null>(null)
  const [predictionTested, setPredictionTested] = useState<boolean>(false)

  // Practice state
  const [answers, setAnswers] = useState<Partial<Record<SPQuestionId, SPPracticeAnswer>>>({})

  const { circuit, drafts, selectedQuestionId } = exp
  const result = calculateSeriesParallel(circuit)
  const comparisonRows = buildComparisonData(
    circuit.supplyVoltageV,
    circuit.resistance1Ohm,
    circuit.resistance2Ohm,
    circuit.switchClosed
  )

  function editField(field: SPField, raw: string) {
    const out = applySPDraftEdit(circuit, drafts, field, raw)
    setExp({ ...exp, circuit: out.input, drafts: out.drafts })
    setErrors(out.errors)
  }

  function setArrangement(arr: Arrangement) {
    setExp({ ...exp, circuit: { ...circuit, arrangement: arr } })
    setAnnouncement(`Switched circuit arrangement to ${arr}.`)
  }

  function setSwitch(closed: boolean) {
    setExp({ ...exp, circuit: { ...circuit, switchClosed: closed } })
    setAnnouncement(closed ? 'Switch closed.' : 'Switch opened. Current is zero.')
  }

  function loadSetup(setup: SPInput, label: string) {
    setExp(loadSPSetupOnExperiment(exp, setup))
    setErrors({})
    setAnnouncement(`Loaded setup on experiment: ${label}`)
  }

  function patchAnswer(id: SPQuestionId, patch: Partial<SPPracticeAnswer>) {
    setAnswers((prev) => ({
      ...prev,
      [id]: { ...(prev[id] ?? EMPTY_SP_ANSWER), ...patch },
    }))
  }

  function countCorrect(): number {
    return SP_PRACTICE_QUESTIONS.filter((q) => {
      const a = answers[q.id]
      return a?.checked === true && evaluateSPPracticeAnswer(q, a).status === 'correct'
    }).length
  }

  function renderControl(field: SPField, label: string, unit: string, id: string) {
    const lim = field === 'supplyVoltageV' ? SP_LIMITS.supplyVoltageV : SP_LIMITS.resistanceOhm
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
            aria-label={`${label} (numeric entry)`}
            aria-invalid={err ? true : undefined}
            min={lim.min}
            max={lim.max}
            step="any"
            value={drafts[field]}
            onChange={(e) => editField(field, e.target.value)}
            className="alt-number-input"
          />
        </div>
        <p className="el-range-hint">
          Allowed: {lim.min}–{lim.max} {unit}
        </p>
        {err && (
          <p className="alt-field-error" role="alert">
            {err}
          </p>
        )}
      </div>
    )
  }

  return (
    <main
      className={`alt-lens-page mode-${mode}`}
      aria-label="Series and Parallel Circuits Lesson"
    >
      {/* Top Header */}
      <header className="alt-lens-header">
        <div className="alt-lens-title-block">
          <div className="alt-lens-eyebrow-row">
            <span className="alt-lens-chapter-tag">
              Class 10 Physics · Electricity · Two Resistors
            </span>
            <span className="alt-lens-provisional-pill">
              {SP_SOURCE_METADATA.reviewStatus}
            </span>
          </div>
          <h1 className="alt-lens-h1">
            One Path or Two: What Happens When We Add Another Resistor?
          </h1>
          <p className="alt-lens-subtitle">
            Explore how adding a second resistor in series versus parallel changes
            equivalent resistance, battery current, and voltage distribution.
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
          <button
            type="button"
            className="alt-print-btn"
            onClick={() => window.print()}
          >
            Print Lesson Sheet
          </button>
        </div>
      </header>

      <div className="sr-only" aria-live="polite">
        {announcement}
      </div>

      {/* Sequence Chips */}
      <nav className="alt-sequence-nav no-print" aria-label="Lesson sequence">
        <a href="#sp-predict" className="alt-seq-chip">1. Predict</a>
        <a href="#sp-experiment" className="alt-seq-chip">2. Experiment</a>
        <a href="#sp-observe" className="alt-seq-chip">3. Observe</a>
        <a href="#sp-compare" className="alt-seq-chip">4. Compare Table</a>
        <a href="#sp-unequal" className="alt-seq-chip">5. Unequal Branches</a>
        <a href="#sp-explain" className="alt-seq-chip">6. Explain</a>
        <a href="#sp-examples" className="alt-seq-chip">7. Worked Examples</a>
        <a href="#sp-practice" className="alt-seq-chip">8. Practice</a>
        <a href="#sp-recap" className="alt-seq-chip">9. Recap</a>
      </nav>

      <div className="alt-lens-workspace">
        {/* STAGE 1: PREDICT */}
        <section
          id="sp-predict"
          className="alt-stage-card alt-stage-predict"
          aria-labelledby="sp-h-predict"
        >
          <div className="alt-stage-header">
            <span className="alt-stage-step">Stage 1 · Prediction</span>
            <h2 id="sp-h-predict">{SP_PREDICTION.heading}</h2>
          </div>
          <p className="alt-stage-lead">{SP_PREDICTION.prompt}</p>

          <fieldset className="alt-predict-fieldset">
            <legend className="sr-only">Choose your prediction</legend>
            {SP_PREDICTION.options.map((opt, idx) => (
              <label
                key={opt}
                className={`alt-radio-option ${
                  predictionChoice === idx ? 'is-selected' : ''
                }`}
              >
                <input
                  type="radio"
                  name="sp-pred"
                  checked={predictionChoice === idx}
                  onChange={() => {
                    setPredictionChoice(idx)
                    setPredictionTested(false)
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
              onClick={() => {
                loadSetup(SP_PREDICTION.startSetup, 'Starting: One 6 Ω Resistor (1 A)')
                setPredictionTested(true)
              }}
            >
              1. Start with One Resistor (6 V, 6 Ω → 1 A)
            </button>
            <button
              type="button"
              className="alt-action-btn secondary"
              onClick={() => {
                loadSetup(
                  {
                    arrangement: 'series',
                    supplyVoltageV: 6,
                    resistance1Ohm: 6,
                    resistance2Ohm: 6,
                    switchClosed: true,
                  },
                  'Test Series (6 Ω + 6 Ω)'
                )
                setPredictionTested(true)
              }}
            >
              2. Test Series Connection
            </button>
            <button
              type="button"
              className="alt-action-btn secondary"
              onClick={() => {
                loadSetup(
                  {
                    arrangement: 'parallel',
                    supplyVoltageV: 6,
                    resistance1Ohm: 6,
                    resistance2Ohm: 6,
                    switchClosed: true,
                  },
                  'Test Parallel Connection'
                )
                setPredictionTested(true)
              }}
            >
              3. Test Parallel Connection
            </button>
          </div>

          {predictionTested && (
            <div
              className={`alt-prediction-review ${
                predictionChoice === SP_PREDICTION.correctOptionIndex
                  ? 'is-correct'
                  : 'is-review'
              }`}
            >
              <h4>Experimental Observation:</h4>
              <p>
                Right now, the circuit is in <strong>{circuit.arrangement}</strong>{' '}
                mode with supply current{' '}
                <strong>{formatOhmNumber(result.supplyCurrentA)} A</strong> (R_eq ={' '}
                {formatOhmNumber(result.equivalentResistanceOhm)} Ω). Notice that adding a
                second 6 Ω resistor in series drops the current to 0.5 A, but adding it
                in parallel doubles the current to 2.0 A!
              </p>
            </div>
          )}
        </section>

        {/* STAGE 2: EXPERIMENT */}
        <section
          id="sp-experiment"
          className="alt-stage-card alt-stage-experiment"
          aria-labelledby="sp-h-exp"
        >
          <div className="alt-stage-header">
            <div className="alt-stage-header-split">
              <div>
                <span className="alt-stage-step">Stage 2 · Interactive Circuit</span>
                <h2 id="sp-h-exp">Connect One Resistor or Two. Watch the Flow.</h2>
              </div>
              <span className="alt-live-bench-badge">Current Circuit Setup</span>
            </div>
          </div>

          {/* Arrangement Selector Bar */}
          <div
            className="alt-preset-bar no-print"
            role="group"
            aria-label="Arrangement selector"
          >
            <span className="alt-preset-label">Arrangement:</span>
            <button
              type="button"
              className={`alt-preset-chip ${
                circuit.arrangement === 'single' ? 'is-active' : ''
              }`}
              onClick={() => setArrangement('single')}
            >
              One Resistor (R₁ only)
            </button>
            <button
              type="button"
              className={`alt-preset-chip ${
                circuit.arrangement === 'series' ? 'is-active' : ''
              }`}
              onClick={() => setArrangement('series')}
            >
              Two in Series (One path: R₁ + R₂)
            </button>
            <button
              type="button"
              className={`alt-preset-chip ${
                circuit.arrangement === 'parallel' ? 'is-active' : ''
              }`}
              onClick={() => setArrangement('parallel')}
            >
              Two in Parallel (Two paths: R₁ || R₂)
            </button>

            <span className="alt-preset-label" style={{ marginInlineStart: '0.8rem' }}>
              Switch:
            </span>
            <button
              type="button"
              className={`alt-preset-chip ${circuit.switchClosed ? 'is-active' : ''}`}
              onClick={() => setSwitch(true)}
            >
              Closed
            </button>
            <button
              type="button"
              className={`alt-preset-chip ${!circuit.switchClosed ? 'is-active' : ''}`}
              onClick={() => setSwitch(false)}
            >
              Open
            </button>
          </div>

          {/* Interactive Circuit Schematic */}
          <div className="alt-bench-svg-container">
            <SPCircuitSVG result={result} />
          </div>

          {/* Controls */}
          <div className="alt-controls-grid">
            {renderControl('supplyVoltageV', 'Supply voltage (V)', 'V', 'sp-v')}
            {renderControl('resistance1Ohm', 'Resistor R₁ (Ω)', 'Ω', 'sp-r1')}
            {circuit.arrangement !== 'single' ? (
              renderControl('resistance2Ohm', 'Resistor R₂ (Ω)', 'Ω', 'sp-r2')
            ) : (
              <div className="alt-control-item" style={{ opacity: 0.6 }}>
                <span className="alt-control-label">Resistor R₂ (disconnected)</span>
                <p className="el-range-hint" style={{ marginBlockStart: '0.5rem' }}>
                  Switch to Series or Parallel above to connect R₂.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* STAGE 3: OBSERVE */}
        <section
          id="sp-observe"
          className="alt-stage-card alt-stage-feedback"
          aria-labelledby="sp-h-obs"
        >
          <div className="alt-stage-header">
            <div className="alt-stage-header-split">
              <div>
                <span className="alt-stage-step">Stage 3 · Observations</span>
                <h2 id="sp-h-obs">Meter Readouts for Current Setup</h2>
              </div>
              <span className="alt-live-bench-badge">
                Arrangement: {circuit.arrangement.toUpperCase()}
              </span>
            </div>
          </div>

          <div
            className="alt-readout-grid"
            style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(11rem, 1fr))' }}
            aria-label="Circuit readouts"
          >
            <div className="alt-readout-box">
              <span className="alt-readout-label">Equivalent Resistance (R_eq)</span>
              <strong className="alt-readout-value">
                {formatOhmNumber(result.equivalentResistanceOhm)} Ω
              </strong>
            </div>
            <div className="alt-readout-box">
              <span className="alt-readout-label">Supply Ammeter (I_total)</span>
              <strong className="alt-readout-value">
                {formatOhmNumber(result.supplyCurrentA)} A
              </strong>
            </div>
            <div className="alt-readout-box">
              <span className="alt-readout-label">Resistor R₁ Readings</span>
              <strong className="alt-readout-value">
                {formatOhmNumber(result.resistor1.currentA)} A ·{' '}
                {formatOhmNumber(result.resistor1.voltageV)} V
              </strong>
            </div>
            {result.resistor2 && (
              <div className="alt-readout-box">
                <span className="alt-readout-label">Resistor R₂ Readings</span>
                <strong className="alt-readout-value">
                  {formatOhmNumber(result.resistor2.currentA)} A ·{' '}
                  {formatOhmNumber(result.resistor2.voltageV)} V
                </strong>
              </div>
            )}
          </div>

          <div className="alt-feedback-callout">
            <h3>
              {circuit.arrangement === 'single'
                ? 'Single Resistor: Only One Path'
                : circuit.arrangement === 'series'
                ? 'Series Connection: One Continuous Loop'
                : 'Parallel Connection: Two Alternative Paths'}
            </h3>
            <p>
              {circuit.arrangement === 'single'
                ? `All current from the ${formatOhmNumber(
                    circuit.supplyVoltageV
                  )} V supply flows through R₁ (${formatOhmNumber(
                    circuit.resistance1Ohm
                  )} Ω). I = V / R = ${formatOhmNumber(result.supplyCurrentA)} A.`
                : circuit.arrangement === 'series'
                ? `In series, the exact same current (${formatOhmNumber(
                    result.supplyCurrentA
                  )} A) flows through R₁ and R₂. The voltages divide: V₁ (${formatOhmNumber(
                    result.resistor1.voltageV
                  )} V) + V₂ (${formatOhmNumber(
                    result.resistor2?.voltageV ?? 0
                  )} V) = ${formatOhmNumber(circuit.supplyVoltageV)} V.`
                : `In parallel, both resistors get the full ${formatOhmNumber(
                    circuit.supplyVoltageV
                  )} V. The currents split at the junction: I₁ (${formatOhmNumber(
                    result.resistor1.currentA
                  )} A) + I₂ (${formatOhmNumber(
                    result.resistor2?.currentA ?? 0
                  )} A) = ${formatOhmNumber(result.supplyCurrentA)} A.`}
            </p>
          </div>
        </section>

        {/* STAGE 4: COMPARE SIDE-BY-SIDE */}
        <section
          id="sp-compare"
          className="alt-stage-card"
          aria-labelledby="sp-h-comp"
        >
          <div className="alt-stage-header">
            <div className="alt-stage-header-split">
              <div>
                <span className="alt-stage-step">
                  Stage 4 · Side-by-Side Comparison
                </span>
                <h2 id="sp-h-comp">Compare the Three Setups at Fixed Voltage</h2>
              </div>
              <span className="alt-static-example-badge">
                Fixed V = {formatOhmNumber(circuit.supplyVoltageV)} V, R₁ ={' '}
                {formatOhmNumber(circuit.resistance1Ohm)} Ω, R₂ ={' '}
                {formatOhmNumber(circuit.resistance2Ohm)} Ω
              </span>
            </div>
          </div>

          <p className="alt-stage-lead">
            Look at how adding the second resistor affects the total resistance and the
            battery current compared to having only one resistor:
          </p>

          <div className="alt-table-wrapper">
            <table className="alt-ncert-table">
              <thead>
                <tr>
                  <th scope="col">Arrangement</th>
                  <th scope="col">Total Resistance (R_eq)</th>
                  <th scope="col">Supply Current (I)</th>
                  <th scope="col">Branch 1 (I₁, V₁)</th>
                  <th scope="col">Branch 2 (I₂, V₂)</th>
                  <th scope="col" className="no-print">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr
                    key={row.arrangement}
                    className={
                      circuit.arrangement === row.arrangement
                        ? 'is-highlighted-row'
                        : ''
                    }
                  >
                    <td>
                      <strong>{row.label}</strong>
                      <div className="el-range-hint">{row.description}</div>
                    </td>
                    <td>
                      <strong>{formatOhmNumber(row.reqOhm)} Ω</strong>
                    </td>
                    <td>
                      <strong
                        style={{
                          color:
                            row.arrangement === 'parallel'
                              ? '#15803d'
                              : row.arrangement === 'series'
                              ? '#b91c1c'
                              : 'inherit',
                        }}
                      >
                        {formatOhmNumber(row.supplyCurrentA)} A
                      </strong>
                    </td>
                    <td>
                      {formatOhmNumber(row.r1Reading.currentA)} A ·{' '}
                      {formatOhmNumber(row.r1Reading.voltageV)} V
                    </td>
                    <td>
                      {row.r2Reading
                        ? `${formatOhmNumber(
                            row.r2Reading.currentA
                          )} A · ${formatOhmNumber(row.r2Reading.voltageV)} V`
                        : '— (disconnected)'}
                    </td>
                    <td className="no-print">
                      <button
                        type="button"
                        className="alt-table-load-btn"
                        onClick={() => setArrangement(row.arrangement)}
                      >
                        Switch to {row.arrangement}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* STAGE 5: TARGET MISCONCEPTION - UNEQUAL PARALLEL BRANCHES */}
        <section
          id="sp-unequal"
          className="alt-stage-card"
          aria-labelledby="sp-h-unequal"
        >
          <div className="alt-stage-header">
            <span className="alt-stage-step">
              Stage 5 · Crucial Discovery (Unequal Branches)
            </span>
            <h2 id="sp-h-unequal">
              Does Current Split Equally in Parallel? (Only if R₁ = R₂!)
            </h2>
          </div>

          <p className="alt-stage-lead">
            A common student trap is thinking current always splits 50/50 at any
            junction. Test what happens when one branch has twice the resistance of the
            other (e.g. <strong>R₁ = 6 Ω</strong> vs <strong>R₂ = 12 Ω</strong> on a 6 V
            battery):
          </p>

          <div className="alt-stage-actions no-print">
            <button
              type="button"
              className="alt-action-btn primary"
              onClick={() =>
                loadSetup(
                  {
                    arrangement: 'parallel',
                    supplyVoltageV: 6,
                    resistance1Ohm: 6,
                    resistance2Ohm: 12,
                    switchClosed: true,
                  },
                  'Unequal parallel: 6 Ω and 12 Ω on 6 V'
                )
              }
            >
              Load Unequal Parallel Setup (6 Ω || 12 Ω at 6 V)
            </button>
          </div>

          <div
            className="el-concept-grid"
            style={{ marginBlockStart: '0.85rem' }}
          >
            <article className="alt-explain-card">
              <h3>Branch 1 (R₁ = 6 Ω)</h3>
              <p>
                <strong>Voltage:</strong> Full 6 V across this branch.
              </p>
              <p>
                <strong>Current:</strong> I₁ = 6 V ÷ 6 Ω ={' '}
                <strong style={{ color: '#15803d' }}>1.0 A</strong>
              </p>
              <p className="el-range-hint">Smaller resistance → MORE current flow.</p>
            </article>

            <article className="alt-explain-card">
              <h3>Branch 2 (R₂ = 12 Ω)</h3>
              <p>
                <strong>Voltage:</strong> Exact same 6 V across this branch!
              </p>
              <p>
                <strong>Current:</strong> I₂ = 6 V ÷ 12 Ω ={' '}
                <strong style={{ color: '#b91c1c' }}>0.5 A</strong>
              </p>
              <p className="el-range-hint">Larger resistance → LESS current flow.</p>
            </article>

            <article className="alt-explain-card">
              <h3>Total Battery Supply</h3>
              <p>
                <strong>Equivalent R:</strong> R_eq = (6 × 12) ÷ (6 + 12) ={' '}
                <strong>4.0 Ω</strong>
              </p>
              <p>
                <strong>Total Current:</strong> I_total = 1.0 A + 0.5 A ={' '}
                <strong>1.5 A</strong>
              </p>
              <p className="el-range-hint">
                Current splits 2:1, exactly matching the inverse ratio of resistances!
              </p>
            </article>
          </div>
        </section>

        {/* STAGE 6: EXPLAIN */}
        <section
          id="sp-explain"
          className="alt-stage-card alt-stage-explain"
          aria-labelledby="sp-h-explain"
        >
          <div className="alt-stage-header">
            <span className="alt-stage-step">Stage 6 · Scientific Explanation</span>
            <h2 id="sp-h-explain">The Formulas and Why They Work</h2>
          </div>

          <div className="alt-explain-columns">
            <article className="alt-explain-card">
              <h3>Resistors in Series (One Continuous Path)</h3>
              <ul>
                <li>
                  <strong>Formula:</strong>{' '}
                  <span className="math-inline">R_eq = R₁ + R₂</span>
                </li>
                <li>
                  <strong>Current is the same:</strong>{' '}
                  <span className="math-inline">I = I₁ = I₂</span>. There is no other
                  branch, so every charge flows through both.
                </li>
                <li>
                  <strong>Voltages add up:</strong>{' '}
                  <span className="math-inline">V_supply = V₁ + V₂</span>.
                </li>
                <li>
                  <strong>Total resistance increases:</strong> Adding another resistor in
                  series always increases R_eq and decreases battery current.
                </li>
              </ul>
            </article>

            <article className="alt-explain-card">
              <h3>Resistors in Parallel (Alternative Paths)</h3>
              <ul>
                <li>
                  <strong>Formula:</strong>{' '}
                  <span className="math-inline">1/R_eq = 1/R₁ + 1/R₂</span>, or{' '}
                  <span className="math-inline">R_eq = (R₁·R₂) / (R₁ + R₂)</span>.
                </li>
                <li>
                  <strong>Voltage is the same:</strong>{' '}
                  <span className="math-inline">V₁ = V₂ = V_supply</span>. Both branches
                  connect directly across the battery terminals.
                </li>
                <li>
                  <strong>Currents add up:</strong>{' '}
                  <span className="math-inline">I_supply = I₁ + I₂</span>.
                </li>
                <li>
                  <strong>Total resistance decreases:</strong> Opening another path is
                  like opening an extra lane on a highway—more charge can flow per
                  second!
                </li>
              </ul>
            </article>
          </div>

          <div className="el-mistakes">
            <h3>Common Misconceptions</h3>
            <ul className="el-mistake-list">
              {SP_MISCONCEPTIONS.map((m) => (
                <li key={m.myth}>
                  <span className="el-mistake">✗ Myth: {m.myth}</span>
                  <span className="el-better">✓ Reality: {m.reality}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* STAGE 7: WORKED EXAMPLES */}
        <section
          id="sp-examples"
          className="alt-stage-card alt-stage-examples"
          aria-labelledby="sp-h-examples"
        >
          <div className="alt-stage-header">
            <div className="alt-stage-header-split">
              <div>
                <span className="alt-stage-step">Stage 7 · Worked Examples</span>
                <h2 id="sp-h-examples">Step-by-Step Calculations</h2>
              </div>
              <span className="alt-static-example-badge">
                Fixed Numbers — Independent of Live Circuit
              </span>
            </div>
          </div>

          <div className="alt-examples-grid">
            {SP_WORKED_EXAMPLES.map((ex) => (
              <article
                key={ex.id}
                className="alt-example-card"
                aria-labelledby={`sp-title-${ex.id}`}
              >
                <div className="alt-example-card-top">
                  <span className="alt-example-badge">{ex.badge}</span>
                </div>
                <h3 id={`sp-title-${ex.id}`}>{ex.title}</h3>
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
                    onClick={() => loadSetup(ex.setup, ex.title)}
                  >
                    Load on Experiment ({ex.setup.arrangement},{' '}
                    {formatOhmNumber(ex.setup.resistance1Ohm)} Ω,{' '}
                    {formatOhmNumber(ex.setup.resistance2Ohm)} Ω)
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* STAGE 8: PRACTICE LADDER */}
        <section
          id="sp-practice"
          className="alt-stage-card alt-stage-practice"
          aria-labelledby="sp-h-practice"
        >
          <div className="alt-stage-header">
            <div className="alt-stage-header-split">
              <div>
                <span className="alt-stage-step">Stage 8 · Practice Ladder</span>
                <h2 id="sp-h-practice">Check Your Understanding (Easy to Think)</h2>
              </div>
              <span className="alt-static-example-badge">
                Selecting a Question Does Not Change Circuit
              </span>
            </div>
          </div>

          <p className="alt-stage-lead">
            Solve each problem step by step. Use the hint if needed. The worked solution
            unlocks after checking your answer.
          </p>
          <p className="el-score" role="status">
            Answered correctly: {countCorrect()} of {SP_PRACTICE_QUESTIONS.length}
          </p>

          <div
            className="alt-practice-tabs no-print"
            role="tablist"
            aria-label="Practice questions"
          >
            {SP_PRACTICE_QUESTIONS.map((q, idx) => (
              <button
                key={q.id}
                type="button"
                role="tab"
                id={`sp-tab-${q.id}`}
                aria-selected={selectedQuestionId === q.id}
                aria-controls={`sp-panel-${q.id}`}
                className={`alt-practice-tab ${
                  selectedQuestionId === q.id ? 'is-active' : ''
                }`}
                onClick={() => setExp(selectSPQuestion(exp, q.id))}
              >
                {idx + 1}. {q.level}
              </button>
            ))}
          </div>

          {SP_PRACTICE_QUESTIONS.map((q, idx) => {
            const ans = answers[q.id] ?? EMPTY_SP_ANSWER
            const ev = evaluateSPPracticeAnswer(q, ans)
            const isSelected = selectedQuestionId === q.id
            const nextQ = SP_PRACTICE_QUESTIONS[idx + 1]

            return (
              <div
                key={q.id}
                id={`sp-panel-${q.id}`}
                role="tabpanel"
                aria-labelledby={`sp-tab-${q.id}`}
                hidden={!isSelected}
                className={`alt-practice-panel ${
                  isSelected ? 'is-visible' : 'print-only-block'
                }`}
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
                        onClick={() => loadSetup(q.setup as SPInput, q.title)}
                      >
                        Load on Experiment
                      </button>
                    )}
                  </div>
                  <p className="alt-practice-prompt">{q.prompt}</p>

                  {q.kind === 'choice' ? (
                    <fieldset className="alt-predict-fieldset">
                      <legend className="sr-only">Choose your answer</legend>
                      {q.options.map((opt, optIdx) => (
                        <label
                          key={opt}
                          className={`alt-radio-option ${
                            ans.choice === optIdx ? 'is-selected' : ''
                          }`}
                        >
                          <input
                            type="radio"
                            name={`sp-choice-${q.id}`}
                            checked={ans.choice === optIdx}
                            onChange={() =>
                              patchAnswer(q.id, { choice: optIdx, checked: false })
                            }
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </fieldset>
                  ) : (
                    <div className="alt-numerical-entry-row no-print">
                      <label htmlFor={`sp-input-${q.id}`} className="alt-control-label">
                        {q.inputLabel}:
                      </label>
                      <input
                        id={`sp-input-${q.id}`}
                        type="text"
                        inputMode="decimal"
                        placeholder="Enter a number"
                        value={ans.draft}
                        onChange={(e) =>
                          patchAnswer(q.id, { draft: e.target.value, checked: false })
                        }
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
                      onClick={() => patchAnswer(q.id, { hintShown: !ans.hintShown })}
                    >
                      {ans.hintShown ? 'Hide hint' : 'Show hint'}
                    </button>
                    {nextQ && (
                      <button
                        type="button"
                        className="alt-action-btn secondary"
                        onClick={() => setExp(selectSPQuestion(exp, nextQ.id))}
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
                      className={`alt-practice-feedback status-${
                        ev.status === 'correct' ? 'correct' : 'incorrect'
                      }`}
                      role="status"
                    >
                      <p>{ev.message}</p>
                    </div>
                  )}

                  {ans.checked ? (
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

        {/* STAGE 9: RECAP */}
        <section id="sp-recap" className="alt-stage-card" aria-labelledby="sp-h-recap">
          <div className="alt-stage-header">
            <span className="alt-stage-step">Stage 9 · Lesson Recap</span>
            <h2 id="sp-h-recap">What You Discovered</h2>
          </div>
          <ul className="el-recap-list">
            <li>
              <strong>Series (One Path):</strong> Adding another resistor{' '}
              <em>increases</em> total resistance (R_eq = R₁ + R₂) and <em>reduces</em>{' '}
              supply current. The same current flows through all components.
            </li>
            <li>
              <strong>Parallel (Multiple Paths):</strong> Adding another resistor{' '}
              <em>decreases</em> total resistance (1/R_eq = 1/R₁ + 1/R₂) and{' '}
              <em>increases</em> supply current. Both branches experience the exact same
              supply voltage.
            </li>
            <li>
              <strong>Unequal Branches:</strong> In parallel, current does not split 50/50
              unless R₁ = R₂. The smaller resistor carries the larger share of the
              current.
            </li>
            <li>
              <strong>Home Wiring:</strong> Household appliances are wired in parallel so
              each gets full voltage and can operate independently.
            </li>
          </ul>
        </section>
      </div>

      {/* Footer */}
      <footer className="alt-lens-footer" aria-label="Sources and review status">
        <div className="alt-footer-grid">
          <div>
            <h3>Curriculum References</h3>
            <ul>
              <li>{SP_SOURCE_METADATA.ncertReference}</li>
              <li>{SP_SOURCE_METADATA.secondaryReference}</li>
              <li>{SP_SOURCE_METADATA.questionOrigin}</li>
            </ul>
          </div>
          <div>
            <h3>Model Assumptions &amp; Review Status</h3>
            <ul>
              <li>
                Ideal DC model: zero wire resistance, ideal supply, ideal ammeters and
                voltmeters, constant resistor temperatures.
              </li>
              <li>
                <em>{SP_SOURCE_METADATA.reviewStatus}.</em>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </main>
  )
}
