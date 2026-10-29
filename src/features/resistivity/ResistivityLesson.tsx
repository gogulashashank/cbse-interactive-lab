import { useState } from 'react'
import { WireSpecimenSVG } from './ResistivityDiagrams'
import {
  EMPTY_RES_ANSWER,
  evaluateResPracticeAnswer,
  GUIDED_DISCOVERIES,
  loadWireSetupOnExperiment,
  RESISTIVITY_MISCONCEPTIONS,
  RESISTIVITY_PRACTICE_QUESTIONS,
  RESISTIVITY_PREDICTIONS,
  RESISTIVITY_SOURCE_METADATA,
  RESISTIVITY_WORKED_EXAMPLES,
  selectResQuestion,
  type ResPracticeAnswer,
  type ResistivityExperimentState,
  type ResistivityPresentationMode,
  type ResistivityQuestionId,
} from './resistivityContent'
import {
  applyWireDraftEdit,
  createWireDrafts,
  formatWireNumber,
  INITIAL_WIRE_INPUT,
  type WireFieldErrors,
} from './resistivityInputValidation'
import {
  calculateWire,
  MATERIALS,
  RESISTIVITY_LIMITS,
  type MaterialId,
  type WireInput,
} from './resistivityModel'

export function ResistivityLesson() {
  const [mode, setMode] = useState<ResistivityPresentationMode>('reading')
  const [exp, setExp] = useState<ResistivityExperimentState>(() => ({
    wire: INITIAL_WIRE_INPUT,
    drafts: createWireDrafts(INITIAL_WIRE_INPUT),
    selectedQuestionId: 'res-q1',
  }))
  const [errors, setErrors] = useState<WireFieldErrors>({})
  const [announcement, setAnnouncement] = useState('')

  // Predictions state
  const [predChoices, setPredChoices] = useState<Record<string, number | null>>({
    'length-prediction': null,
    'area-prediction': null,
    'resistivity-prediction': null,
  })

  // Practice state
  const [answers, setAnswers] = useState<Partial<Record<ResistivityQuestionId, ResPracticeAnswer>>>({})

  const { wire, drafts, selectedQuestionId } = exp
  const result = calculateWire(wire)

  function editField(field: 'lengthM' | 'areaMm2' | 'supplyVoltageV', raw: string) {
    const out = applyWireDraftEdit(wire, drafts, field, raw)
    setExp({ ...exp, wire: out.input, drafts: out.drafts })
    setErrors(out.errors)
  }

  function setMaterial(matId: MaterialId) {
    setExp({ ...exp, wire: { ...wire, materialId: matId } })
    setAnnouncement(`Switched wire material to ${matId}.`)
  }

  function setSwitch(closed: boolean) {
    setExp({ ...exp, wire: { ...wire, switchClosed: closed } })
    setAnnouncement(closed ? 'Switch closed.' : 'Switch opened. Current is zero.')
  }

  function loadSetup(setup: WireInput, label: string) {
    setExp(loadWireSetupOnExperiment(exp, setup))
    setErrors({})
    setAnnouncement(`Loaded setup on experiment: ${label}`)
  }

  function patchAnswer(id: ResistivityQuestionId, patch: Partial<ResPracticeAnswer>) {
    setAnswers((prev) => ({
      ...prev,
      [id]: { ...(prev[id] ?? EMPTY_RES_ANSWER), ...patch },
    }))
  }

  function countCorrect(): number {
    return RESISTIVITY_PRACTICE_QUESTIONS.filter((q) => {
      const a = answers[q.id]
      return a?.checked === true && evaluateResPracticeAnswer(q, a).status === 'correct'
    }).length
  }

  return (
    <main
      className={`alt-lens-page mode-${mode}`}
      aria-label="Wire Resistance and Resistivity Lesson"
    >
      {/* Top Header */}
      <header className="alt-lens-header">
        <div className="alt-lens-title-block">
          <div className="alt-lens-eyebrow-row">
            <span className="alt-lens-chapter-tag">
              Class 10 Physics · Electricity · Factors Affecting Resistance
            </span>
            <span className="alt-lens-provisional-pill">
              {RESISTIVITY_SOURCE_METADATA.reviewStatus}
            </span>
          </div>
          <h1 className="alt-lens-h1">
            Resistivity: Why Do Different Wires Have Different Resistance?
          </h1>
          <p className="alt-lens-subtitle">
            Explore how wire length (<span className="math-inline">L</span>), cross-sectional area (
            <span className="math-inline">A</span>), and material resistivity (
            <span className="math-inline">ρ</span>) determine resistance through{' '}
            <strong>R = ρL/A</strong> at a constant temperature (
            {RESISTIVITY_SOURCE_METADATA.statedTemperature}).
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
              Explore Wire Bench
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

      {/* Navigation sequence */}
      <nav className="alt-sequence-nav no-print" aria-label="Lesson sequence">
        <a href="#res-predict" className="alt-seq-chip">1. Predict</a>
        <a href="#res-experiment" className="alt-seq-chip">2. Design Wire</a>
        <a href="#res-observe" className="alt-seq-chip">3. Observe</a>
        <a href="#res-discoveries" className="alt-seq-chip">4. 3 Discoveries</a>
        <a href="#res-materials" className="alt-seq-chip">5. Materials Table</a>
        <a href="#res-explain" className="alt-seq-chip">6. Explain</a>
        <a href="#res-examples" className="alt-seq-chip">7. Worked Examples</a>
        <a href="#res-practice" className="alt-seq-chip">8. Practice</a>
        <a href="#res-recap" className="alt-seq-chip">9. Recap</a>
      </nav>

      <div className="alt-lens-workspace">
        {/* STAGE 1: PREDICT */}
        <section
          id="res-predict"
          className="alt-stage-card alt-stage-predict"
          aria-labelledby="res-h-predict"
        >
          <div className="alt-stage-header">
            <span className="alt-stage-step">Stage 1 · Predictions</span>
            <h2 id="res-h-predict">What do you predict?</h2>
          </div>
          <p className="alt-stage-lead">
            Consider comparing different wires under identical temperature conditions (20 °C):
          </p>

          {RESISTIVITY_PREDICTIONS.map((pred) => (
            <fieldset key={pred.id} className="alt-predict-fieldset el-prediction">
              <legend className="el-legend">{pred.heading}</legend>
              <p className="alt-stage-lead">{pred.prompt}</p>
              {pred.options.map((opt, idx) => (
                <label
                  key={opt}
                  className={`alt-radio-option ${
                    predChoices[pred.id] === idx ? 'is-selected' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name={`res-pred-${pred.id}`}
                    checked={predChoices[pred.id] === idx}
                    onChange={() =>
                      setPredChoices({ ...predChoices, [pred.id]: idx })
                    }
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
                  {
                    materialId: 'nichrome',
                    lengthM: 1.0,
                    areaMm2: 0.5,
                    supplyVoltageV: 6.0,
                    switchClosed: true,
                  },
                  'Baseline Nichrome (1 m, 0.5 mm²)'
                )
              }
            >
              Set up the baseline wire (Nichrome 1 m, 0.5 mm² at 6 V)
            </button>
          </div>
        </section>

        {/* STAGE 2: EXPERIMENT (DESIGN YOUR WIRE) */}
        <section
          id="res-experiment"
          className="alt-stage-card alt-stage-experiment"
          aria-labelledby="res-h-exp"
        >
          <div className="alt-stage-header">
            <div className="alt-stage-header-split">
              <div>
                <span className="alt-stage-step">Stage 2 · Wire Test Bench</span>
                <h2 id="res-h-exp">Design Your Wire. Inspect Resistance and Current.</h2>
              </div>
              <span className="alt-live-bench-badge">
                Temperature: 20 °C (constant)
              </span>
            </div>
          </div>

          <div className="alt-notice-banner warning" role="note">
            <strong>Safety &amp; Ideal Modeling Notice:</strong> Ideal calculation only. The model ignores source current limits and wire heating. Do not reproduce this setup with a real power supply.
          </div>

          {/* Material Selector Bar */}
          <div
            className="alt-preset-bar no-print"
            role="group"
            aria-label="Material selector"
          >
            <span className="alt-preset-label">Material:</span>
            {MATERIALS.map((mat) => (
              <button
                key={mat.id}
                type="button"
                className={`alt-preset-chip ${
                  wire.materialId === mat.id ? 'is-active' : ''
                }`}
                onClick={() => setMaterial(mat.id)}
              >
                {mat.name} ({mat.category})
              </button>
            ))}

            <span className="alt-preset-label" style={{ marginInlineStart: '0.8rem' }}>
              Switch:
            </span>
            <button
              type="button"
              className={`alt-preset-chip ${wire.switchClosed ? 'is-active' : ''}`}
              onClick={() => setSwitch(true)}
            >
              Closed
            </button>
            <button
              type="button"
              className={`alt-preset-chip ${!wire.switchClosed ? 'is-active' : ''}`}
              onClick={() => setSwitch(false)}
            >
              Open
            </button>
          </div>

          {/* Interactive Wire Specimen SVG */}
          <div className="alt-bench-svg-container">
            <WireSpecimenSVG result={result} />
          </div>

          {/* Sliders and Numeric Inputs */}
          <div className="alt-controls-grid">
            {/* Length Control */}
            <div className="alt-control-item">
              <div className="alt-control-label-row">
                <label htmlFor="wire-l-slider" className="alt-control-label">
                  Wire Length L (m)
                </label>
                <span className="alt-signed-pill">
                  {formatWireNumber(wire.lengthM)} m
                </span>
              </div>
              <div className="alt-control-inputs">
                <input
                  id="wire-l-slider"
                  type="range"
                  min={RESISTIVITY_LIMITS.lengthM.min}
                  max={RESISTIVITY_LIMITS.lengthM.max}
                  step={RESISTIVITY_LIMITS.lengthM.step}
                  value={wire.lengthM}
                  onChange={(e) => editField('lengthM', e.target.value)}
                />
                <input
                  id="wire-l-number"
                  type="number"
                  aria-label="Wire length in meters"
                  aria-invalid={errors.lengthM ? true : undefined}
                  min={RESISTIVITY_LIMITS.lengthM.min}
                  max={RESISTIVITY_LIMITS.lengthM.max}
                  step="any"
                  value={drafts.lengthM}
                  onChange={(e) => editField('lengthM', e.target.value)}
                  className="alt-number-input"
                />
              </div>
              <p className="el-range-hint">
                Range: {RESISTIVITY_LIMITS.lengthM.min}–{RESISTIVITY_LIMITS.lengthM.max} m
              </p>
              {errors.lengthM && (
                <p className="alt-field-error" role="alert">
                  {errors.lengthM}
                </p>
              )}
            </div>

            {/* Area Control */}
            <div className="alt-control-item">
              <div className="alt-control-label-row">
                <label htmlFor="wire-a-slider" className="alt-control-label">
                  Cross-Sectional Area A (mm²)
                </label>
                <span className="alt-signed-pill">
                  {formatWireNumber(wire.areaMm2)} mm²
                </span>
              </div>
              <div className="alt-control-inputs">
                <input
                  id="wire-a-slider"
                  type="range"
                  min={RESISTIVITY_LIMITS.areaMm2.min}
                  max={RESISTIVITY_LIMITS.areaMm2.max}
                  step={RESISTIVITY_LIMITS.areaMm2.step}
                  value={wire.areaMm2}
                  onChange={(e) => editField('areaMm2', e.target.value)}
                />
                <input
                  id="wire-a-number"
                  type="number"
                  aria-label="Cross-sectional area in mm²"
                  aria-invalid={errors.areaMm2 ? true : undefined}
                  min={RESISTIVITY_LIMITS.areaMm2.min}
                  max={RESISTIVITY_LIMITS.areaMm2.max}
                  step="any"
                  value={drafts.areaMm2}
                  onChange={(e) => editField('areaMm2', e.target.value)}
                  className="alt-number-input"
                />
              </div>
              <p className="el-range-hint">
                Diameter d ≈ {formatWireNumber(result.diameterMm, 2)} mm
              </p>
              {errors.areaMm2 && (
                <p className="alt-field-error" role="alert">
                  {errors.areaMm2}
                </p>
              )}
            </div>

            {/* Supply Voltage Control */}
            <div className="alt-control-item">
              <div className="alt-control-label-row">
                <label htmlFor="wire-v-slider" className="alt-control-label">
                  Supply Voltage V (volts)
                </label>
                <span className="alt-signed-pill">
                  {formatWireNumber(wire.supplyVoltageV)} V
                </span>
              </div>
              <div className="alt-control-inputs">
                <input
                  id="wire-v-slider"
                  type="range"
                  min={RESISTIVITY_LIMITS.supplyVoltageV.min}
                  max={RESISTIVITY_LIMITS.supplyVoltageV.max}
                  step={RESISTIVITY_LIMITS.supplyVoltageV.step}
                  value={wire.supplyVoltageV}
                  onChange={(e) => editField('supplyVoltageV', e.target.value)}
                />
                <input
                  id="wire-v-number"
                  type="number"
                  aria-label="Supply voltage in volts"
                  aria-invalid={errors.supplyVoltageV ? true : undefined}
                  min={RESISTIVITY_LIMITS.supplyVoltageV.min}
                  max={RESISTIVITY_LIMITS.supplyVoltageV.max}
                  step="any"
                  value={drafts.supplyVoltageV}
                  onChange={(e) => editField('supplyVoltageV', e.target.value)}
                  className="alt-number-input"
                />
              </div>
              <p className="el-range-hint">Fixed during comparisons (e.g. 6.0 V)</p>
              {errors.supplyVoltageV && (
                <p className="alt-field-error" role="alert">
                  {errors.supplyVoltageV}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* STAGE 3: OBSERVE */}
        <section
          id="res-observe"
          className="alt-stage-card alt-stage-feedback"
          aria-labelledby="res-h-obs"
        >
          <div className="alt-stage-header">
            <div className="alt-stage-header-split">
              <div>
                <span className="alt-stage-step">Stage 3 · Observations</span>
                <h2 id="res-h-obs">Live Resistance &amp; Current Readings</h2>
              </div>
              <span className="alt-live-bench-badge">
                Material: {result.material.name}
              </span>
            </div>
          </div>

          <div
            className="alt-readout-grid"
            style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(11rem, 1fr))' }}
            aria-label="Live wire readouts"
          >
            <div className="alt-readout-box">
              <span className="alt-readout-label">Calculated Resistance (R = ρL/A)</span>
              <strong className="alt-readout-value">
                {formatWireNumber(result.resistanceOhm)} Ω
              </strong>
            </div>
            <div className="alt-readout-box">
              <span className="alt-readout-label">Ammeter Reading (I = V/R)</span>
              <strong className="alt-readout-value">
                {formatWireNumber(result.currentA)} A
              </strong>
            </div>
            <div className="alt-readout-box">
              <span className="alt-readout-label">Material Resistivity (ρ at 20 °C)</span>
              <strong className="alt-readout-value">
                {formatWireNumber(result.material.resistivityOhmMeter)} Ω·m
              </strong>
            </div>
            <div className="alt-readout-box">
              <span className="alt-readout-label">Equivalent Diameter (d)</span>
              <strong className="alt-readout-value">
                ≈ {formatWireNumber(result.diameterMm, 2)} mm
              </strong>
            </div>
          </div>

          <div className="alt-feedback-callout">
            <h3>
              {result.resistanceOhm > 1.0
                ? 'High Resistance Specimen'
                : 'Low Resistance (Connecting Lead Quality)'}
            </h3>
            <p>
              With length L = {formatWireNumber(result.lengthM)} m, area A ={' '}
              {formatWireNumber(result.areaMm2)} mm², and material{' '}
              <strong>{result.material.name}</strong>, this wire offers an electrical
              resistance of <strong>{formatWireNumber(result.resistanceOhm)} Ω</strong>.
              Connected across {formatWireNumber(result.supplyVoltageV)} V, the current is{' '}
              <strong>{formatWireNumber(result.currentA)} A</strong>.
            </p>
            {result.currentA > 10 && (
              <div className="alt-notice-banner warning" role="note" style={{ margin: '0.4rem 0 0' }}>
                <strong>Ideal calculation only.</strong> The model ignores source current limits and wire heating. Do not reproduce this setup with a real power supply. (Notice how large current would quickly heat up the wire — explored in the Electrical Power &amp; Heating lesson!)
              </div>
            )}
          </div>
        </section>

        {/* STAGE 4: THREE GUIDED DISCOVERIES */}
        <section
          id="res-discoveries"
          className="alt-stage-card"
          aria-labelledby="res-h-disc"
        >
          <div className="alt-stage-header">
            <span className="alt-stage-step">Stage 4 · Guided Discoveries</span>
            <h2 id="res-h-disc">Three Controlled Comparisons</h2>
          </div>

          <p className="alt-stage-lead">
            To isolate what factors control resistance, scientific inquiry changes only{' '}
            <em>one variable at a time</em> while keeping all others constant:
          </p>

          <div
            className="el-concept-grid"
            style={{ marginBlockStart: '0.85rem' }}
          >
            {/* Discovery 1 */}
            <article className="alt-explain-card">
              <h3>1. Double the Length</h3>
              <p>
                <strong>Keep unchanged:</strong> Area (0.5 mm²), Material (Nichrome), Temp (20 °C).
              </p>
              <p>
                <strong>Observation:</strong> Changing L from 1.0 m to 2.0 m causes
                resistance to change from <strong>2.0 Ω → 4.0 Ω (DOUBLES)</strong>.
              </p>
              <p className="el-range-hint">
                <strong>Discovery:</strong> Resistance is directly proportional to length (R ∝ L).
              </p>
              <button
                type="button"
                className="alt-table-load-btn no-print"
                style={{ marginBlockStart: '0.5rem' }}
                onClick={() => loadSetup(GUIDED_DISCOVERIES[1].setup, GUIDED_DISCOVERIES[1].title)}
              >
                Test 2.0 m Length
              </button>
            </article>

            {/* Discovery 2 */}
            <article className="alt-explain-card">
              <h3>2. Double the Area</h3>
              <p>
                <strong>Keep unchanged:</strong> Length (1.0 m), Material (Nichrome), Temp (20 °C).
              </p>
              <p>
                <strong>Observation:</strong> Changing A from 0.5 mm² to 1.0 mm² causes
                resistance to change from <strong>2.0 Ω → 1.0 Ω (HALVES)</strong>.
              </p>
              <p className="el-range-hint">
                <strong>Discovery:</strong> Resistance is inversely proportional to area (R ∝ 1/A).
              </p>
              <button
                type="button"
                className="alt-table-load-btn no-print"
                style={{ marginBlockStart: '0.5rem' }}
                onClick={() => loadSetup(GUIDED_DISCOVERIES[2].setup, GUIDED_DISCOVERIES[2].title)}
              >
                Test 1.0 mm² Area
              </button>
            </article>

            {/* Discovery 3 */}
            <article className="alt-explain-card">
              <h3>3. Change the Material</h3>
              <p>
                <strong>Keep unchanged:</strong> Length (1.0 m), Area (0.5 mm²), Temp (20 °C).
              </p>
              <p>
                <strong>Observation:</strong> Replacing Nichrome with Copper causes
                resistance to drop from <strong>2.0 Ω → 0.032 Ω (~62× drop)</strong>!
              </p>
              <p className="el-range-hint">
                <strong>Discovery:</strong> Resistance depends on the material’s intrinsic resistivity (ρ).
              </p>
              <button
                type="button"
                className="alt-table-load-btn no-print"
                style={{ marginBlockStart: '0.5rem' }}
                onClick={() => loadSetup(GUIDED_DISCOVERIES[3].setup, GUIDED_DISCOVERIES[3].title)}
              >
                Test Copper Material
              </button>
            </article>
          </div>
        </section>

        {/* STAGE 5: MATERIALS TABLE */}
        <section
          id="res-materials"
          className="alt-stage-card"
          aria-labelledby="res-h-mat"
        >
          <div className="alt-stage-header">
            <span className="alt-stage-step">Stage 5 · Materials Reference</span>
            <h2 id="res-h-mat">Resistivity of Substances at 20 °C (NCERT Reference)</h2>
          </div>

          <p className="alt-stage-lead">
            Good conductors have very low resistivity in the range of 10⁻⁸ Ω·m. Alloys have much higher
            resistivity and do not oxidize easily when heated.
          </p>

          <div className="alt-table-wrapper">
            <table className="alt-ncert-table">
              <thead>
                <tr>
                  <th scope="col">Material</th>
                  <th scope="col">Category</th>
                  <th scope="col">Resistivity ρ at 20 °C (Ω·m)</th>
                  <th scope="col">Typical Applications</th>
                  <th scope="col" className="no-print">Bench Action</th>
                </tr>
              </thead>
              <tbody>
                {MATERIALS.map((m) => (
                  <tr
                    key={m.id}
                    className={wire.materialId === m.id ? 'is-highlighted-row' : ''}
                  >
                    <td>
                      <strong style={{ color: m.colorHex }}>{m.name}</strong>
                    </td>
                    <td>{m.category}</td>
                    <td>
                      <strong>{m.resistivityOhmMeter.toExponential(2)} Ω·m</strong>
                    </td>
                    <td>{m.description}</td>
                    <td className="no-print">
                      <button
                        type="button"
                        className="alt-table-load-btn"
                        onClick={() => setMaterial(m.id)}
                      >
                        Select {m.name}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* STAGE 6: EXPLAIN */}
        <section
          id="res-explain"
          className="alt-stage-card alt-stage-explain"
          aria-labelledby="res-h-explain"
        >
          <div className="alt-stage-header">
            <span className="alt-stage-step">Stage 6 · Scientific Explanation</span>
            <h2 id="res-h-explain">The Formula: R = ρ · (L / A)</h2>
          </div>

          <div className="alt-explain-columns">
            <article className="alt-explain-card">
              <h3>Understanding the Formula</h3>
              <ul>
                <li>
                  <strong>Length (L):</strong> Resistance is directly proportional to length (
                  <span className="math-inline">R ∝ L</span>). Longer wire = more atom collisions
                  for electrons.
                </li>
                <li>
                  <strong>Area (A):</strong> Resistance is inversely proportional to area (
                  <span className="math-inline">R ∝ 1/A</span>). Thicker wire = wider highway for
                  electrons.
                </li>
                <li>
                  <strong>Resistivity (ρ):</strong> The constant of proportionality is called electrical
                  resistivity (<span className="math-inline">ρ</span>).
                </li>
                <li>
                  <strong>Unit of Resistivity:</strong> Rearranging gives{' '}
                  <span className="math-inline">ρ = (R · A) / L</span>. The SI unit is{' '}
                  <strong>(Ω · m²) / m = Ω·m (ohm-meter)</strong>.
                </li>
              </ul>
            </article>

            <article className="alt-explain-card">
              <h3>Resistivity vs Resistance</h3>
              <ul>
                <li>
                  <strong>Resistance (R):</strong> Depends on <em>both</em> the material and the shape/size
                  (length and thickness). Measured in ohms (Ω).
                </li>
                <li>
                  <strong>Resistivity (ρ):</strong> An <em>intrinsic</em> material property at a stated
                  temperature. Does NOT change if you cut, lengthen, or thicken the wire. Measured in Ω·m.
                </li>
                <li>
                  <strong>Role of Temperature:</strong> Resistivity increases with temperature for most metals.
                  In this lesson, temperature is held constant at 20 °C.
                </li>
              </ul>
            </article>
          </div>

          <div className="el-mistakes">
            <h3>Common Student Misconceptions</h3>
            <ul className="el-mistake-list">
              {RESISTIVITY_MISCONCEPTIONS.map((m) => (
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
          id="res-examples"
          className="alt-stage-card alt-stage-examples"
          aria-labelledby="res-h-examples"
        >
          <div className="alt-stage-header">
            <div className="alt-stage-header-split">
              <div>
                <span className="alt-stage-step">Stage 7 · Worked Examples</span>
                <h2 id="res-h-examples">Step-by-Step Calculations</h2>
              </div>
              <span className="alt-static-example-badge">
                Fixed Numbers — Independent of Live Circuit
              </span>
            </div>
          </div>

          <div className="alt-examples-grid">
            {RESISTIVITY_WORKED_EXAMPLES.map((ex) => (
              <article
                key={ex.id}
                className="alt-example-card"
                aria-labelledby={`res-title-${ex.id}`}
              >
                <div className="alt-example-card-top">
                  <span className="alt-example-badge">{ex.badge}</span>
                </div>
                <h3 id={`res-title-${ex.id}`}>{ex.title}</h3>
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
                    Load on Bench ({ex.setup.materialId}, {formatWireNumber(ex.setup.lengthM)} m,{' '}
                    {formatWireNumber(ex.setup.areaMm2)} mm²)
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* STAGE 8: PRACTICE LADDER */}
        <section
          id="res-practice"
          className="alt-stage-card alt-stage-practice"
          aria-labelledby="res-h-practice"
        >
          <div className="alt-stage-header">
            <div className="alt-stage-header-split">
              <div>
                <span className="alt-stage-step">Stage 8 · Practice Ladder</span>
                <h2 id="res-h-practice">Check Your Understanding (Easy to Think)</h2>
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
            Answered correctly: {countCorrect()} of {RESISTIVITY_PRACTICE_QUESTIONS.length}
          </p>

          <div
            className="alt-practice-tabs no-print"
            role="tablist"
            aria-label="Practice questions"
          >
            {RESISTIVITY_PRACTICE_QUESTIONS.map((q, idx) => (
              <button
                key={q.id}
                type="button"
                role="tab"
                id={`res-tab-${q.id}`}
                aria-selected={selectedQuestionId === q.id}
                aria-controls={`res-panel-${q.id}`}
                className={`alt-practice-tab ${
                  selectedQuestionId === q.id ? 'is-active' : ''
                }`}
                onClick={() => setExp(selectResQuestion(exp, q.id))}
              >
                {idx + 1}. {q.level}
              </button>
            ))}
          </div>

          {RESISTIVITY_PRACTICE_QUESTIONS.map((q, idx) => {
            const ans = answers[q.id] ?? EMPTY_RES_ANSWER
            const ev = evaluateResPracticeAnswer(q, ans)
            const isSelected = selectedQuestionId === q.id
            const nextQ = RESISTIVITY_PRACTICE_QUESTIONS[idx + 1]

            return (
              <div
                key={q.id}
                id={`res-panel-${q.id}`}
                role="tabpanel"
                aria-labelledby={`res-tab-${q.id}`}
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
                        onClick={() => loadSetup(q.setup as WireInput, q.title)}
                      >
                        Load on Bench
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
                            name={`res-choice-${q.id}`}
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
                      <label htmlFor={`res-input-${q.id}`} className="alt-control-label">
                        {q.inputLabel}:
                      </label>
                      <input
                        id={`res-input-${q.id}`}
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
                        onClick={() => setExp(selectResQuestion(exp, nextQ.id))}
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
        <section id="res-recap" className="alt-stage-card" aria-labelledby="res-h-recap">
          <div className="alt-stage-header">
            <span className="alt-stage-step">Stage 9 · Lesson Recap</span>
            <h2 id="res-h-recap">Key Takeaways</h2>
          </div>
          <ul className="el-recap-list">
            <li>
              <strong>Length (L):</strong> Resistance is directly proportional to wire length (
              <span className="math-inline">R ∝ L</span>). Doubling length doubles resistance.
            </li>
            <li>
              <strong>Cross-Sectional Area (A):</strong> Resistance is inversely proportional to area (
              <span className="math-inline">R ∝ 1/A</span>). Doubling area halves resistance.
            </li>
            <li>
              <strong>Diameter (d):</strong> Because <span className="math-inline">A = πd²/4</span>,
              doubling diameter quadruples area and cuts resistance to one-quarter (<span className="math-inline">R/4</span>).
            </li>
            <li>
              <strong>Resistivity (ρ):</strong> An intrinsic material property measured in{' '}
              <strong>Ω·m</strong>. Cutting or stretching a wire does not change its resistivity!
            </li>
            <li>
              <strong>Metals vs Alloys:</strong> Copper has very low resistivity (ideal for leads),
              whereas Nichrome has high resistivity and high oxidation resistance (ideal for toasters and irons).
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
              <li>{RESISTIVITY_SOURCE_METADATA.ncertReference}</li>
              <li>{RESISTIVITY_SOURCE_METADATA.secondaryReference}</li>
              <li>Temperature stated: {RESISTIVITY_SOURCE_METADATA.statedTemperature}.</li>
              <li>
                <strong>Notice:</strong> {RESISTIVITY_SOURCE_METADATA.idealCalculationNotice}
              </li>
              <li>{RESISTIVITY_SOURCE_METADATA.questionOrigin}</li>
            </ul>
          </div>
          <div>
            <h3>Model Assumptions &amp; Review Status</h3>
            <ul>
              <li>
                Uniform cylindrical wire model with constant cross-section; constant 20 °C temperature.
              </li>
              <li>
                <em>{RESISTIVITY_SOURCE_METADATA.reviewStatus}.</em>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </main>
  )
}
