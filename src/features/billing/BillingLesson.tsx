import React, { useState } from 'react'
import {
  BILLING_GLOBAL_LIMITS,
  STANDARD_APPLIANCES,
} from './billingLimits'
import {
  calculateHouseholdBilling,
} from './billingModel'
import {
  applyApplianceHoursEdit,
  applyBillingDaysEdit,
  applyTariffRateEdit,
  createBillingDrafts,
  formatBillingRupees,
  formatBillingUnits,
  type BillingDrafts,
  type BillingValidationErrors,
} from './billingInputValidation'
import {
  BILLING_DISCOVERIES,
  BILLING_MISCONCEPTIONS,
  BILLING_PRACTICE_QUESTIONS,
  BILLING_PREDICTIONS,
  BILLING_SOURCE_METADATA,
  BILLING_WORKED_EXAMPLES,
  createInitialBillingState,
  EMPTY_BILLING_ANSWER,
  evaluateBillingPracticeAnswer,
  loadBillingSetup,
  type BillingExperimentState,
  type BillingPracticeAnswer,
  type BillingPresentationMode,
  type BillingQuestionId,
} from './billingContent'
import {
  UtilityEnergyMeterSVG,
  ApplianceBreakdownChartSVG,
} from './BillingDiagrams'

export const BillingLesson: React.FC = () => {
  const [mode, setMode] = useState<BillingPresentationMode>('reading')
  const [announcement, setAnnouncement] = useState<string>('')

  // Household & Experiment State
  const [expState, setExpState] = useState<BillingExperimentState>(createInitialBillingState)

  // Drafts & Validation
  const [drafts, setDrafts] = useState<BillingDrafts>(() =>
    createBillingDrafts(expState.household)
  )
  const [errors, setErrors] = useState<BillingValidationErrors>({})

  // Predictions State
  const [predChoices, setPredChoices] = useState<Record<string, number | null>>({
    'what-utility-bills-prediction': null,
    'power-vs-duration-prediction': null,
    'unit-definition-prediction': null,
  })

  // Practice State
  const [answers, setAnswers] = useState<Partial<Record<BillingQuestionId, BillingPracticeAnswer>>>({})

  // Live Calculations
  const result = calculateHouseholdBilling(expState.household)

  // Handlers for inputs
  function handleDaysChange(raw: string) {
    const res = applyBillingDaysEdit(expState.household, drafts, raw)
    setDrafts(res.drafts)
    setErrors((prev) => ({ ...prev, billingDays: res.error }))
    if (!res.error) {
      setExpState((prev) => ({ ...prev, household: res.input }))
    }
  }

  function handleTariffChange(raw: string) {
    const res = applyTariffRateEdit(expState.household, drafts, raw)
    setDrafts(res.drafts)
    setErrors((prev) => ({ ...prev, tariffRate: res.error }))
    if (!res.error) {
      setExpState((prev) => ({ ...prev, household: res.input }))
    }
  }

  function handleHoursChange(applianceId: string, raw: string) {
    const res = applyApplianceHoursEdit(expState.household, drafts, applianceId, raw)
    setDrafts(res.drafts)
    setErrors((prev) => ({
      ...prev,
      applianceHours: {
        ...prev.applianceHours,
        [applianceId]: res.error || '',
      },
    }))
    if (!res.error) {
      setExpState((prev) => ({ ...prev, household: res.input }))
    }
  }

  function handleToggleAppliance(applianceId: string) {
    setExpState((prev) => {
      const updated = prev.household.appliances.map((a) =>
        a.id === applianceId ? { ...a, enabled: !a.enabled } : a
      )
      return {
        ...prev,
        household: { ...prev.household, appliances: updated },
      }
    })
  }

  function handleLoadSetup(setup: {
    setupAppliances?: { id: string; hoursPerDay: number; enabled: boolean }[]
    billingDays?: number
    tariffRate?: number
  }) {
    const nextState = loadBillingSetup(expState, setup)
    setExpState(nextState)
    setDrafts(createBillingDrafts(nextState.household))
    setErrors({})
    setAnnouncement('Loaded appliance scenario onto simulator.')
  }

  function handleResetHousehold() {
    const initial = createInitialBillingState()
    setExpState(initial)
    setDrafts(createBillingDrafts(initial.household))
    setErrors({})
    setAnnouncement('Reset all appliances to standard household baseline.')
  }

  // Answer handler
  function handleSelectOption(qId: BillingQuestionId, optIndex: number) {
    const current = answers[qId] || EMPTY_BILLING_ANSWER
    setAnswers((prev) => ({
      ...prev,
      [qId]: { ...current, selectedOption: optIndex, checked: false },
    }))
  }

  function handleCheckAnswer(qId: BillingQuestionId) {
    const current = answers[qId] || EMPTY_BILLING_ANSWER
    setAnswers((prev) => ({
      ...prev,
      [qId]: { ...current, checked: true },
    }))
  }

  function handleToggleHint(qId: BillingQuestionId) {
    const current = answers[qId] || EMPTY_BILLING_ANSWER
    setAnswers((prev) => ({
      ...prev,
      [qId]: { ...current, showHint: !current.showHint },
    }))
  }

  function handleToggleTrap(qId: BillingQuestionId) {
    const current = answers[qId] || EMPTY_BILLING_ANSWER
    setAnswers((prev) => ({
      ...prev,
      [qId]: { ...current, showTrap: !current.showTrap },
    }))
  }

  function handleToggleSolution(qId: BillingQuestionId) {
    const current = answers[qId] || EMPTY_BILLING_ANSWER
    setAnswers((prev) => ({
      ...prev,
      [qId]: { ...current, showSolution: !current.showSolution },
    }))
  }

  const selectedPracticeQ =
    BILLING_PRACTICE_QUESTIONS.find((q) => q.id === expState.selectedQuestionId) ||
    BILLING_PRACTICE_QUESTIONS[0]
  const selectedAnswer = answers[selectedPracticeQ.id] || EMPTY_BILLING_ANSWER
  const selectedEval = evaluateBillingPracticeAnswer(selectedPracticeQ, selectedAnswer)

  return (
    <div className="alt-lesson-page">
      {/* Hidden Live Region for Screen Readers */}
      <div className="sr-only" aria-live="polite" role="status">
        {announcement}
      </div>

      {/* Lesson Header */}
      <header className="alt-lesson-hero">
        <div className="alt-hero-content">
          <span className="alt-breadcrumb">Class 10 Science · Chapter 12 · Electricity Extension</span>
          <h1 className="alt-lesson-title">
            Commercial Electrical Energy &amp; Utility Bills
          </h1>
          <p className="alt-lesson-subtitle">
            How Watts, Hours, and Kilowatt-Hours turn into your monthly electricity bill (1 Unit = 1 kWh = 3.6 × 10⁶ J).
          </p>

          <div className="alt-mode-toggle-group">
            <button
              type="button"
              className={`alt-mode-btn ${mode === 'reading' ? 'is-active' : ''}`}
              onClick={() => setMode('reading')}
              aria-pressed={mode === 'reading'}
            >
              📖 Reading Guide
            </button>
            <button
              type="button"
              className={`alt-mode-btn ${mode === 'immersive' ? 'is-active' : ''}`}
              onClick={() => setMode('immersive')}
              aria-pressed={mode === 'immersive'}
            >
              ⚡ Interactive Utility Bench
            </button>
          </div>
        </div>
      </header>

      {/* Main Dual-Mode Layout */}
      <div className={`alt-lesson-layout ${mode === 'immersive' ? 'is-immersive' : ''}`}>
        {/* Left Column: Theory, Predictions, Discoveries, Worked Examples, Practice */}
        <main className="alt-text-column">
          {/* Stage 1: Predictions */}
          <section className="alt-card">
            <h2 className="alt-card-title">1. What Do You Think? (Pre-Lesson Predictions)</h2>
            <p className="alt-card-desc">
              Test your intuition before experimenting with the household meter.
            </p>

            <div className="alt-predictions-list">
              {BILLING_PREDICTIONS.map((pred) => {
                const choice = predChoices[pred.id]
                const isAnswered = choice !== null
                const isCorrect = choice === pred.correctOptionIndex

                return (
                  <div key={pred.id} className="el-prediction">
                    <h3 className="el-pred-heading">{pred.heading}</h3>
                    <p className="el-pred-prompt">{pred.prompt}</p>
                    <div className="alt-options-grid">
                      {pred.options.map((opt, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className={`alt-option-btn ${choice === idx ? 'is-selected' : ''}`}
                          onClick={() =>
                            setPredChoices((prev) => ({ ...prev, [pred.id]: idx }))
                          }
                        >
                          <span className="alt-opt-letter">{String.fromCharCode(65 + idx)}</span>
                          <span className="alt-opt-text">{opt}</span>
                        </button>
                      ))}
                    </div>
                    {isAnswered && (
                      <div
                        className={`alt-feedback-banner ${isCorrect ? 'is-correct' : 'is-note'}`}
                      >
                        {isCorrect
                          ? '✓ Spot on! Explore how the mathematics works below.'
                          : '✦ Keep exploring! The household meter simulator will reveal why.'}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>

          {/* Stage 2: Theoretical Foundation */}
          <section className="alt-card">
            <h2 className="alt-card-title">2. Theoretical Foundation: Energy vs Power</h2>
            <div className="alt-card-body">
              <p>
                In our homes, dozens of appliances convert electrical energy into other useful forms:
                thermal energy (irons, geysers), kinetic energy (fans, mixers), or electromagnetic radiation (LED bulbs, TV screens).
              </p>

              <div className="el-concept-grid">
                <div className="el-concept-card">
                  <div className="el-term">1. Electric Power (P)</div>
                  <p>
                    The rate at which electrical energy is consumed or converted per unit time:
                    <br />
                    <span className="math-display">{'P = \\frac{E}{t} = V \\times I'}</span>
                    Measured in <strong>Watts (W)</strong> or <strong>kilowatts (kW)</strong> (1 kW = 1000 W).
                  </p>
                </div>

                <div className="el-concept-card">
                  <div className="el-term">2. Electrical Energy (E)</div>
                  <p>
                    The total work done by the electric current over an elapsed duration:
                    <br />
                    <span className="math-display">{'E = P \\times t'}</span>
                    In SI units, 1 Watt × 1 second = <strong>1 Joule (J)</strong>.
                  </p>
                </div>

                <div className="el-concept-card">
                  <div className="el-term">3. Commercial "Unit" (kWh)</div>
                  <p>
                    The practical unit for power billing:
                    <br />
                    <span className="math-display">{'1\\text{ kWh} = 1000\\text{ W} \\times 3600\\text{ s} = 3.6 \\times 10^6\\text{ J}'}</span>
                    Often termed 1 <em>Board of Trade Unit (B.O.T.U.)</em>.
                  </p>
                </div>
              </div>

              <div className="alt-callout">
                <h3 className="alt-callout-title">The Cost Formula</h3>
                <p>
                  State electricity boards and distribution utilities bill consumers based on total kilowatt-hours used:
                </p>
                <div className="alt-formula-box">
                  <span className="math-display">{'\\text{Total Cost (₹)} = \\text{Total Energy (kWh)} \\times \\text{Tariff Rate (₹/unit)}'}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Stage 3: Guided Discoveries */}
          <section className="alt-card">
            <h2 className="alt-card-title">3. Guided Discoveries</h2>
            <p className="alt-card-desc">
              Load these carefully prepared household scenarios onto the simulator to test key relationships.
            </p>

            <div className="alt-discoveries-grid">
              {BILLING_DISCOVERIES.map((disc) => (
                <div key={disc.id} className="alt-discovery-card">
                  <h3 className="alt-disc-title">{disc.title}</h3>
                  <p className="alt-disc-subtitle">{disc.subtitle}</p>
                  <p className="alt-disc-condition">
                    <strong>Fixed condition:</strong> {disc.fixedCondition}
                  </p>
                  <button
                    type="button"
                    className="alt-action-btn"
                    onClick={() =>
                      handleLoadSetup({
                        setupAppliances: disc.setupAppliances,
                        billingDays: disc.billingDays,
                        tariffRate: disc.tariffRate,
                      })
                    }
                  >
                    Load: {disc.actionLabel}
                  </button>
                  <div className="alt-disc-comparison">
                    <div className="alt-disc-item">
                      <span className="alt-disc-label">Scenario A:</span>
                      <span>{disc.beforeSummary}</span>
                    </div>
                    <div className="alt-disc-item">
                      <span className="alt-disc-label">Scenario B:</span>
                      <span>{disc.afterSummary}</span>
                    </div>
                  </div>
                  <div className="alt-disc-insight">
                    <strong>Expected Observation:</strong> {disc.expectedDiscovery}
                    <br />
                    <em>Physical Explanation:</em> {disc.physicalReason}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Stage 4: Common Misconceptions */}
          <section className="alt-card">
            <h2 className="alt-card-title">4. Common Student Misconceptions</h2>
            <div className="el-mistakes">
              <ul className="el-mistake-list">
                {BILLING_MISCONCEPTIONS.map((misc, idx) => (
                  <li key={idx}>
                    <span className="el-mistake">{misc.title}</span>
                    <p>
                      <strong>The flawed intuition:</strong> {misc.badIntuition}
                    </p>
                    <p className="el-better">
                      <strong>The scientific reality:</strong> {misc.correctPhysics}
                    </p>
                    <small>
                      <strong>Key takeaway:</strong> {misc.takeaway}
                    </small>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Stage 5: Worked NCERT Examples */}
          <section className="alt-card">
            <h2 className="alt-card-title">5. Worked Step-by-Step Examples</h2>
            <div className="alt-worked-examples">
              {BILLING_WORKED_EXAMPLES.map((ex) => (
                <div key={ex.id} className="alt-example-card">
                  <h3 className="alt-example-title">{ex.title}</h3>
                  <p className="alt-example-context">{ex.context}</p>

                  <div className="alt-given-box">
                    <strong>Given Data:</strong>
                    <ul>
                      {Object.entries(ex.given).map(([key, val]) => (
                        <li key={key}>
                          <strong>{key}:</strong> {val}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="alt-steps-list">
                    {ex.steps.map((st, sIdx) => (
                      <div key={sIdx} className="alt-step-item">
                        <span className="alt-step-num">{st.step}</span>
                        <div className="alt-step-calc">
                          <code>{st.formula}</code> → {st.calc} = <strong>{st.result}</strong>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="alt-answer-box">
                    <strong>Final Answer:</strong> {ex.finalAnswer}
                  </div>

                  {ex.setupAppliances && (
                    <button
                      type="button"
                      className="alt-small-btn"
                      onClick={() =>
                        handleLoadSetup({
                          setupAppliances: ex.setupAppliances,
                          billingDays: ex.billingDays,
                          tariffRate: ex.tariffRate,
                        })
                      }
                    >
                      Load this Example on Simulator
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Stage 6: Practice Ladder */}
          <section className="alt-card">
            <h2 className="alt-card-title">6. Practice Ladder (Foundation to Challenge)</h2>
            <p className="alt-card-desc">
              Test your problem-solving skills with authentic CBSE Board standard numericals.
            </p>

            {/* Question Selector Tabs */}
            <div className="alt-question-tabs" role="tablist">
              {BILLING_PRACTICE_QUESTIONS.map((q, idx) => (
                <button
                  key={q.id}
                  type="button"
                  role="tab"
                  className={`alt-q-tab ${expState.selectedQuestionId === q.id ? 'is-active' : ''}`}
                  aria-selected={expState.selectedQuestionId === q.id}
                  onClick={() =>
                    setExpState((prev) => ({ ...prev, selectedQuestionId: q.id }))
                  }
                >
                  Q{idx + 1} ({q.difficulty})
                </button>
              ))}
            </div>

            {/* Active Question Box */}
            <div className="alt-practice-box">
              <div className="alt-practice-header">
                <span className="alt-badge">{selectedPracticeQ.difficulty}</span>
                <h3 className="alt-practice-q-title">{selectedPracticeQ.title}</h3>
              </div>

              <p className="alt-practice-prompt">{selectedPracticeQ.prompt}</p>

              {/* Multiple Choice Options */}
              <div className="alt-options-grid">
                {selectedPracticeQ.options.map((opt, optIdx) => (
                  <button
                    key={optIdx}
                    type="button"
                    className={`alt-option-btn ${
                      selectedAnswer.selectedOption === optIdx ? 'is-selected' : ''
                    } ${
                      selectedAnswer.checked && optIdx === selectedPracticeQ.correctIndex
                        ? 'is-correct'
                        : selectedAnswer.checked && selectedAnswer.selectedOption === optIdx
                        ? 'is-wrong'
                        : ''
                    }`}
                    onClick={() => handleSelectOption(selectedPracticeQ.id, optIdx)}
                  >
                    <span className="alt-opt-letter">{String.fromCharCode(65 + optIdx)}</span>
                    <span className="alt-opt-text">{opt}</span>
                  </button>
                ))}
              </div>

              {/* Action Buttons: Check, Hint, Trap, Solution */}
              <div className="alt-practice-actions">
                <button
                  type="button"
                  className="alt-primary-btn"
                  onClick={() => handleCheckAnswer(selectedPracticeQ.id)}
                  disabled={selectedAnswer.selectedOption === null}
                >
                  Check Answer
                </button>
                <button
                  type="button"
                  className="alt-secondary-btn"
                  onClick={() => handleToggleHint(selectedPracticeQ.id)}
                >
                  {selectedAnswer.showHint ? 'Hide Hint' : '💡 Hint'}
                </button>
                <button
                  type="button"
                  className="alt-secondary-btn"
                  onClick={() => handleToggleTrap(selectedPracticeQ.id)}
                >
                  {selectedAnswer.showTrap ? 'Hide Trap' : '⚠️ Common Trap'}
                </button>
                <button
                  type="button"
                  className="alt-secondary-btn"
                  onClick={() => handleToggleSolution(selectedPracticeQ.id)}
                >
                  {selectedAnswer.showSolution ? 'Hide Steps' : '📋 Solution Steps'}
                </button>
                {selectedPracticeQ.setupAppliances && (
                  <button
                    type="button"
                    className="alt-small-btn"
                    onClick={() =>
                      handleLoadSetup({
                        setupAppliances: selectedPracticeQ.setupAppliances,
                        billingDays: selectedPracticeQ.billingDays,
                        tariffRate: selectedPracticeQ.tariffRate,
                      })
                    }
                  >
                    Load on Simulator
                  </button>
                )}
              </div>

              {/* Feedback and Expandables */}
              {selectedAnswer.checked && (
                <div
                  className={`alt-feedback-banner ${
                    selectedEval.status === 'correct' ? 'is-correct' : 'is-wrong'
                  }`}
                >
                  {selectedEval.feedback}
                </div>
              )}

              {selectedAnswer.showHint && (
                <div className="alt-hint-box">
                  <strong>Hint:</strong> {selectedPracticeQ.hint}
                </div>
              )}

              {selectedAnswer.showTrap && (
                <div className="alt-trap-box">
                  <strong>Common Pitfall:</strong> {selectedPracticeQ.trapExplanation}
                </div>
              )}

              {selectedAnswer.showSolution && (
                <div className="alt-solution-box">
                  <strong>Step-by-step Solution:</strong>
                  <ol>
                    {selectedPracticeQ.solutionSteps.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </section>

          {/* Stage 7: Lesson Recap */}
          <section className="alt-card">
            <h2 className="alt-card-title">7. Summary &amp; Board Exam Formulas</h2>
            <div className="alt-summary-table-wrap">
              <table className="alt-summary-table">
                <thead>
                  <tr>
                    <th>Quantity</th>
                    <th>Symbol</th>
                    <th>SI Unit</th>
                    <th>Commercial Unit</th>
                    <th>Key Formula</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Electric Power</td>
                    <td><em>P</em></td>
                    <td>Watt (W) / Joule per second</td>
                    <td>Kilowatt (kW)</td>
                    <td><span className="math-inline">{'P = V \\times I = I^2 R = \\frac{V^2}{R}'}</span></td>
                  </tr>
                  <tr>
                    <td>Electrical Energy</td>
                    <td><em>E</em></td>
                    <td>Joule (J)</td>
                    <td>Kilowatt-Hour (kWh) / "Unit"</td>
                    <td><span className="math-inline">{'E = P \\times t'}</span></td>
                  </tr>
                  <tr>
                    <td>Energy Conversion</td>
                    <td>—</td>
                    <td>1 J = 1 W·s</td>
                    <td>1 kWh = 3.6 × 10⁶ J</td>
                    <td><span className="math-inline">{'E\\text{ (kWh)} = \\frac{P\\text{ (W)} \\times t\\text{ (h)}}{1000}'}</span></td>
                  </tr>
                  <tr>
                    <td>Utility Bill Cost</td>
                    <td>Cost</td>
                    <td>—</td>
                    <td>Rupees (₹)</td>
                    <td><span className="math-inline">{'\\text{Cost} = E\\text{ (kWh)} \\times \\text{Tariff Rate (₹/kWh)}'}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="alt-meta-notice">
              <p>
                <strong>Curriculum Reference:</strong> {BILLING_SOURCE_METADATA.ncertReference}
              </p>
              <p>
                <strong>Assumptions:</strong> {BILLING_SOURCE_METADATA.modelAssumptions}
              </p>
            </div>
          </section>
        </main>

        {/* Right Column / Interactive Bench: Utility Meter, Appliance Room Controls, Breakdown */}
        <aside className="alt-bench-column">
          <div className="alt-bench-sticky">
            {/* The Utility Energy Meter */}
            <div className="alt-bench-card">
              <div className="alt-bench-header">
                <h2 className="alt-bench-title">Live Domestic Utility Meter</h2>
                <button
                  type="button"
                  className="alt-small-btn"
                  onClick={handleResetHousehold}
                >
                  Reset Defaults
                </button>
              </div>

              <UtilityEnergyMeterSVG result={result} />

              {/* Joules Mega-readout Banner */}
              <div className="bill-joules-banner">
                <span className="bill-joules-label">Total Work Performed (SI Joules):</span>
                <span className="bill-joules-val">
                  {formatBillingUnits(result.totalEnergyJoules, 0)} J
                </span>
                <span className="bill-joules-sub">
                  ({(result.totalEnergyJoules / 1e6).toFixed(2)} Megajoules)
                </span>
              </div>
            </div>

            {/* Household Billing Global Controls (Days & Tariff) */}
            <div className="alt-bench-card">
              <h3 className="alt-card-title">Billing Period &amp; Tariff Rate</h3>

              <div className="alt-control-grid">
                {/* Billing Days Control */}
                <div className="alt-control-item">
                  <div className="alt-control-label-row">
                    <label htmlFor="billing-days-input">Billing Period (Days):</label>
                    <span className="alt-control-val">{expState.household.billingDays} days</span>
                  </div>
                  <input
                    id="billing-days-slider"
                    type="range"
                    min={BILLING_GLOBAL_LIMITS.billingDays.min}
                    max={BILLING_GLOBAL_LIMITS.billingDays.max}
                    step={BILLING_GLOBAL_LIMITS.billingDays.step}
                    value={expState.household.billingDays}
                    onChange={(e) => handleDaysChange(e.target.value)}
                    aria-label="Billing days slider"
                  />
                  <div className="alt-input-row">
                    <input
                      id="billing-days-input"
                      type="text"
                      className="alt-text-input"
                      value={drafts.billingDays}
                      onChange={(e) => handleDaysChange(e.target.value)}
                      aria-label="Billing days text input"
                    />
                    <span className="alt-unit-suffix">days</span>
                  </div>
                  {errors.billingDays && (
                    <span className="alt-input-error">{errors.billingDays}</span>
                  )}
                </div>

                {/* Tariff Rate Control */}
                <div className="alt-control-item">
                  <div className="alt-control-label-row">
                    <label htmlFor="tariff-rate-input">Tariff Rate (₹ / kWh):</label>
                    <span className="alt-control-val">₹ {expState.household.tariffRateRupeesPerKWh} / unit</span>
                  </div>
                  <input
                    id="tariff-rate-slider"
                    type="range"
                    min={BILLING_GLOBAL_LIMITS.tariffRate.min}
                    max={BILLING_GLOBAL_LIMITS.tariffRate.max}
                    step={BILLING_GLOBAL_LIMITS.tariffRate.step}
                    value={expState.household.tariffRateRupeesPerKWh}
                    onChange={(e) => handleTariffChange(e.target.value)}
                    aria-label="Tariff rate slider"
                  />
                  <div className="alt-input-row">
                    <span className="alt-unit-prefix">₹</span>
                    <input
                      id="tariff-rate-input"
                      type="text"
                      className="alt-text-input"
                      value={drafts.tariffRate}
                      onChange={(e) => handleTariffChange(e.target.value)}
                      aria-label="Tariff rate text input"
                    />
                    <span className="alt-unit-suffix">/ unit</span>
                  </div>
                  {errors.tariffRate && (
                    <span className="alt-input-error">{errors.tariffRate}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Appliance Room Simulator Controls */}
            <div className="alt-bench-card">
              <div className="alt-bench-header">
                <h3 className="alt-card-title">Household Appliances (Runtime Control)</h3>
                <span className="alt-badge">
                  {result.appliances.filter((a) => a.enabled).length} of {STANDARD_APPLIANCES.length} Active
                </span>
              </div>

              <div className="bill-appliances-list">
                {expState.household.appliances.map((app) => {
                  const def = STANDARD_APPLIANCES.find((d) => d.id === app.id)
                  const appRes = result.appliances.find((a) => a.id === app.id)
                  const hoursDraft = drafts.applianceHours[app.id] ?? app.hoursPerDay.toString()
                  const appError = errors.applianceHours?.[app.id]

                  return (
                    <div
                      key={app.id}
                      className={`bill-app-card ${app.enabled ? 'is-enabled' : 'is-disabled'}`}
                    >
                      <div className="bill-app-header">
                        <div className="bill-app-title-group">
                          <span className="bill-app-icon">{def?.icon || '⚡'}</span>
                          <div>
                            <span className="bill-app-name">{app.name}</span>
                            <span className="bill-app-meta">
                              {app.powerW} W · Qty: {app.quantity} ({app.powerW * app.quantity} W total)
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          className={`bill-toggle-btn ${app.enabled ? 'is-on' : 'is-off'}`}
                          onClick={() => handleToggleAppliance(app.id)}
                          aria-label={`Toggle ${app.name} ${app.enabled ? 'off' : 'on'}`}
                        >
                          {app.enabled ? 'ON' : 'OFF'}
                        </button>
                      </div>

                      {app.enabled && (
                        <div className="bill-app-body">
                          <div className="alt-control-label-row">
                            <label htmlFor={`hours-${app.id}`}>Daily Runtime:</label>
                            <span className="alt-control-val">{app.hoursPerDay} hrs / day</span>
                          </div>

                          <input
                            id={`slider-${app.id}`}
                            type="range"
                            min={0}
                            max={24}
                            step={0.5}
                            value={app.hoursPerDay}
                            onChange={(e) => handleHoursChange(app.id, e.target.value)}
                            aria-label={`${app.name} daily hours slider`}
                          />

                          <div className="alt-input-row">
                            <input
                              id={`hours-${app.id}`}
                              type="text"
                              className="alt-text-input"
                              value={hoursDraft}
                              onChange={(e) => handleHoursChange(app.id, e.target.value)}
                              aria-label={`${app.name} daily hours text input`}
                            />
                            <span className="alt-unit-suffix">h / day</span>
                          </div>
                          {appError && <span className="alt-input-error">{appError}</span>}

                          {/* Individual Appliance Consumption Footprint */}
                          {appRes && (
                            <div className="bill-app-stats">
                              <span>
                                Energy: <strong>{formatBillingUnits(appRes.totalEnergyKWh, 1)} kWh</strong>
                              </span>
                              <span>
                                Cost: <strong>₹ {formatBillingRupees(appRes.totalCostRupees, 0)}</strong>
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Consumption & Cost Breakdown Graphic */}
            <div className="alt-bench-card">
              <h3 className="alt-card-title">Consumption Breakdown Comparison</h3>
              <ApplianceBreakdownChartSVG
                appliances={result.appliances}
                totalEnergyKWh={result.totalEnergyKWh}
                tariffRate={expState.household.tariffRateRupeesPerKWh}
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
