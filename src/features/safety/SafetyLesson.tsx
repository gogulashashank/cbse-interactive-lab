import React, { useState } from 'react'
import {
  DEFAULT_APPLIANCES,
  STANDARD_FUSE_RATINGS,
  type FuseRating,
  type SafetyFaultMode,
} from './safetyLimits'
import {
  simulateDomesticCircuit,
  type DomesticCircuitInput,
} from './safetyModel'
import {
  SAFETY_PREDICTIONS,
  SAFETY_DISCOVERIES,
  SAFETY_MISCONCEPTIONS,
  SAFETY_WORKED_EXAMPLES,
  SAFETY_PRACTICE_QUESTIONS,
  getInitialCircuitInput,
} from './safetyContent'
import { SafetyDiagrams } from './SafetyDiagrams'

export type SafetyLessonMode = 'reading' | 'immersive'

export const SafetyLesson: React.FC = () => {
  const [mode, setMode] = useState<SafetyLessonMode>('reading')
  const [announcement, setAnnouncement] = useState<string>('')

  // Circuit Bench State
  const [circuitInput, setCircuitInput] = useState<DomesticCircuitInput>(getInitialCircuitInput)

  // Predictions State
  const [selectedPredictions, setSelectedPredictions] = useState<Record<string, string>>({})
  const [submittedPredictions, setSubmittedPredictions] = useState<Record<string, boolean>>({})

  // Discoveries State
  const [activeDiscoveryId, setActiveDiscoveryId] = useState<string>('disc-1')
  const [discoveryChoices, setDiscoveryChoices] = useState<Record<string, string>>({})

  // Practice Ladder State
  const [practiceAnswers, setPracticeAnswers] = useState<Record<string, string>>({})
  const [practiceRevealed, setPracticeRevealed] = useState<Record<string, boolean>>({})

  // Compute live circuit result
  const circuitResult = simulateDomesticCircuit(circuitInput)

  // Bench Controls
  const handleToggleAppliance = (id: string) => {
    setCircuitInput((prev) => {
      const nextAppliances = prev.appliances.map((app) =>
        app.id === id ? { ...app, enabled: !app.enabled } : app
      )
      return { ...prev, appliances: nextAppliances }
    })
    setAnnouncement(`Toggled appliance ${id}`)
  }

  const handleFuseChange = (rating: FuseRating) => {
    setCircuitInput((prev) => ({ ...prev, fuseRatingA: rating }))
    setAnnouncement(`Fuse rating updated to ${rating} A`)
  }

  const handleFaultModeChange = (mode: SafetyFaultMode) => {
    setCircuitInput((prev) => ({
      ...prev,
      faultMode: mode,
      // If switching away from chassis leakage, reset user touch
      userTouchingChassis: mode === 'chassis_leakage' ? prev.userTouchingChassis : false,
    }))
    setAnnouncement(`Fault condition changed to: ${mode}`)
  }

  const handleToggleEarthing = () => {
    setCircuitInput((prev) => ({
      ...prev,
      earthingConnected: !prev.earthingConnected,
    }))
    setAnnouncement(`Earthing toggled ${!circuitInput.earthingConnected ? 'ON' : 'OFF'}`)
  }

  const handleToggleChassisTouch = () => {
    setCircuitInput((prev) => ({
      ...prev,
      userTouchingChassis: !prev.userTouchingChassis,
    }))
    setAnnouncement(
      !circuitInput.userTouchingChassis ? 'Touching appliance chassis' : 'Released hand from chassis'
    )
  }

  const handleResetFuse = () => {
    setCircuitInput((prev) => ({
      ...prev,
      faultMode: 'none',
      userTouchingChassis: false,
    }))
    setAnnouncement('Fuse replaced and circuit faults cleared')
  }

  const handleLoadDiscoveryPreset = (discoveryId: string) => {
    const discovery = SAFETY_DISCOVERIES.find((d) => d.id === discoveryId)
    if (!discovery) return

    setActiveDiscoveryId(discoveryId)
    setCircuitInput({
      appliances: DEFAULT_APPLIANCES.map((app) => ({
        ...app,
        enabled: !!discovery.preset.appliances[app.id],
      })),
      fuseRatingA: discovery.preset.fuseRatingA,
      faultMode: discovery.preset.faultMode,
      earthingConnected: discovery.preset.earthingConnected,
      userTouchingChassis: discovery.preset.userTouchingChassis,
    })
    setAnnouncement(`Loaded preset: ${discovery.title}`)
  }

  return (
    <div className="alt-container" data-testid="safety-lesson">
      {/* Screen Reader Announcements */}
      <div className="sr-only" role="status" aria-live="polite">
        {announcement}
      </div>

      {/* Hero Header */}
      <header className="alt-hero">
        <div className="alt-hero-badge">NCERT Class 10 Science · Chapter 12 &amp; 13</div>
        <h1 className="alt-title">Domestic Electric Circuits: Fuses, Earthing &amp; Short Circuits</h1>
        <p className="alt-subtitle">
          Explore why Indian homes operate on a 220 V AC parallel grid, how electric fuses prevent
          overloading and electrical fires, and how earth wires safeguard human lives from lethal electric shocks.
        </p>

        <div className="alt-mode-toggle" role="group" aria-label="Lesson Presentation Mode">
          <button
            type="button"
            className={`alt-mode-btn ${mode === 'reading' ? 'is-active' : ''}`}
            onClick={() => setMode('reading')}
            aria-pressed={mode === 'reading'}
          >
            📖 Reading Mode (Structured Notebook)
          </button>
          <button
            type="button"
            className={`alt-mode-btn ${mode === 'immersive' ? 'is-active' : ''}`}
            onClick={() => setMode('immersive')}
            aria-pressed={mode === 'immersive'}
          >
            ⚡ Immersive Circuit Bench
          </button>
        </div>
      </header>

      {/* 1. Predict Section */}
      <section className="alt-section" aria-labelledby="sec-predict-heading">
        <h2 id="sec-predict-heading" className="alt-section-title">
          1. Predict: Intuition Check
        </h2>
        <p className="alt-section-desc">
          Formulate your scientific hypothesis before testing the circuit simulation.
        </p>

        <div className="alt-cards-grid">
          {SAFETY_PREDICTIONS.map((pred) => {
            const selectedOptId = selectedPredictions[pred.id]
            const isSubmitted = submittedPredictions[pred.id]
            const selectedOpt = pred.options.find((o) => o.id === selectedOptId)

            return (
              <div key={pred.id} className="alt-card">
                <h3 className="alt-card-title">{pred.prompt}</h3>
                <div className="alt-options-list">
                  {pred.options.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      className={`alt-option-btn ${selectedOptId === opt.id ? 'is-selected' : ''}`}
                      onClick={() =>
                        setSelectedPredictions((prev) => ({ ...prev, [pred.id]: opt.id }))
                      }
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                <div className="alt-card-actions">
                  <button
                    type="button"
                    className="alt-btn-primary"
                    disabled={!selectedOptId || isSubmitted}
                    onClick={() =>
                      setSubmittedPredictions((prev) => ({ ...prev, [pred.id]: true }))
                    }
                  >
                    {isSubmitted ? 'Hypothesis Submitted' : 'Submit Hypothesis'}
                  </button>
                </div>

                {isSubmitted && selectedOpt && (
                  <div
                    className={`alt-feedback-box ${
                      selectedOpt.isCorrect ? 'is-correct' : 'is-incorrect'
                    }`}
                  >
                    <strong>{selectedOpt.isCorrect ? '✓ Spot on!' : 'ℹ Think deeper:'}</strong>{' '}
                    {selectedOpt.explanation}
                    <div className="alt-test-in-bench">
                      🔍 <em>Test it below:</em> {pred.testedInBench}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* 2. Domestic Circuit Bench & Live Simulation */}
      <section className="alt-section" aria-labelledby="sec-bench-heading">
        <h2 id="sec-bench-heading" className="alt-section-title">
          2. Domestic Circuit Bench: 220 V Mains &amp; Safety Controls
        </h2>
        <p className="alt-section-desc">
          Simulate a real single-phase household board: switch appliances in parallel, adjust fuse rating,
          inject short circuits, and toggle the earth wire.
        </p>

        {/* Live SVG Diagram Component */}
        <SafetyDiagrams
          circuitResult={circuitResult}
          earthingConnected={circuitInput.earthingConnected}
          faultMode={circuitInput.faultMode}
          userTouchingChassis={circuitInput.userTouchingChassis}
          onToggleAppliance={handleToggleAppliance}
          onToggleChassisTouch={handleToggleChassisTouch}
        />

        {/* Interactive Control Panel */}
        <div className="safe-controls-grid">
          {/* Fuse Rating Selector */}
          <div className="safe-control-card">
            <h3 className="safe-control-title">🔌 Main Fuse Cartridge</h3>
            <p className="safe-control-desc">
              Standard commercial ratings: 5 A (Lighting/fans) or 15 A (Heating/appliances).
            </p>
            <div className="safe-fuse-selector" role="group" aria-label="Select Fuse Rating">
              {STANDARD_FUSE_RATINGS.map((rating) => (
                <button
                  key={rating}
                  type="button"
                  className={`safe-pill-btn ${
                    circuitInput.fuseRatingA === rating ? 'is-active' : ''
                  }`}
                  onClick={() => handleFuseChange(rating)}
                >
                  {rating} A
                </button>
              ))}
            </div>

            <div className="safe-fuse-status-box">
              Fuse Status:{' '}
              <strong
                className={
                  circuitResult.fuseStatus === 'BLOWN'
                    ? 'safe-text-danger'
                    : circuitResult.fuseColor === 'overheating'
                    ? 'safe-text-warning'
                    : 'safe-text-success'
                }
              >
                {circuitResult.fuseStatus === 'BLOWN'
                  ? '💥 BLOWN / MELTED'
                  : circuitResult.fuseColor === 'overheating'
                  ? '⚠️ OVERHEATING'
                  : '✅ INTACT'}
              </strong>
              {circuitResult.fuseStatus === 'BLOWN' && (
                <button
                  type="button"
                  className="safe-reset-btn"
                  onClick={handleResetFuse}
                >
                  🔄 Replace Fuse Wire
                </button>
              )}
            </div>
          </div>

          {/* Fault Injector */}
          <div className="safe-control-card">
            <h3 className="safe-control-title">⚠️ Fault Condition Injector</h3>
            <p className="safe-control-desc">
              Simulate insulation breakdown or accidental direct contact.
            </p>
            <div className="safe-fault-selector" role="group" aria-label="Fault Mode">
              <button
                type="button"
                className={`safe-pill-btn ${circuitInput.faultMode === 'none' ? 'is-active' : ''}`}
                onClick={() => handleFaultModeChange('none')}
              >
                Normal Operation
              </button>
              <button
                type="button"
                className={`safe-pill-btn is-danger ${
                  circuitInput.faultMode === 'short_circuit' ? 'is-active' : ''
                }`}
                onClick={() => handleFaultModeChange('short_circuit')}
              >
                ⚡ Short Circuit (L to N)
              </button>
              <button
                type="button"
                className={`safe-pill-btn is-warning ${
                  circuitInput.faultMode === 'chassis_leakage' ? 'is-active' : ''
                }`}
                onClick={() => handleFaultModeChange('chassis_leakage')}
              >
                ⚠️ Live touching Metal Casing
              </button>
            </div>

            <div className="safe-earthing-toggle-row">
              <label className="safe-toggle-label">
                <input
                  type="checkbox"
                  checked={circuitInput.earthingConnected}
                  onChange={handleToggleEarthing}
                />
                <span className="safe-toggle-custom" />
                <strong>Earth Wire Grounded (Green wire to ground pit)</strong>
              </label>
            </div>
          </div>

          {/* Parallel Appliances Rack */}
          <div className="safe-control-card safe-appliances-card">
            <h3 className="safe-control-title">🏡 Parallel Household Appliances</h3>
            <p className="safe-control-desc">
              Toggle individual branch switches. Each appliance operates across 220 V independently.
            </p>

            <div className="safe-appliances-grid">
              {circuitInput.appliances.map((app) => (
                <div
                  key={app.id}
                  className={`safe-appliance-item ${app.enabled ? 'is-on' : 'is-off'}`}
                >
                  <div className="safe-app-header">
                    <span className="safe-app-icon">{app.icon}</span>
                    <span className="safe-app-name">{app.name}</span>
                  </div>
                  <div className="safe-app-specs">
                    <span>{app.powerW} W</span>
                    <span>{(app.powerW / 220).toFixed(2)} A</span>
                  </div>
                  <button
                    type="button"
                    className={`safe-switch-btn ${app.enabled ? 'is-on' : 'is-off'}`}
                    onClick={() => handleToggleAppliance(app.id)}
                  >
                    {app.enabled ? 'SWITCH ON' : 'SWITCH OFF'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Safety Metrics Readout */}
        <div className="safe-metrics-banner" role="region" aria-label="Circuit Telemetry">
          <div className="safe-metric">
            <div className="safe-metric-label">Supply Voltage</div>
            <div className="safe-metric-val">{circuitResult.supplyVoltageV} V AC (50 Hz)</div>
          </div>
          <div className="safe-metric">
            <div className="safe-metric-label">Active Power</div>
            <div className="safe-metric-val">{circuitResult.totalActivePowerW.toFixed(0)} W</div>
          </div>
          <div className="safe-metric">
            <div className="safe-metric-label">Total Line Current</div>
            <div className="safe-metric-val">{circuitResult.totalLineCurrentA.toFixed(2)} A</div>
          </div>
          <div className="safe-metric">
            <div className="safe-metric-label">Fuse Capacity</div>
            <div className="safe-metric-val">{circuitResult.fuseRatingA} A</div>
          </div>
          <div className="safe-metric">
            <div className="safe-metric-label">Chassis Potential</div>
            <div
              className={`safe-metric-val ${
                circuitResult.chassisVoltageV > 10 ? 'safe-text-danger' : 'safe-text-success'
              }`}
            >
              {circuitResult.chassisVoltageV.toFixed(1)} V
            </div>
          </div>
          <div className="safe-metric">
            <div className="safe-metric-label">Human Shock Current</div>
            <div
              className={`safe-metric-val ${
                circuitResult.humanShockCurrentA > 0.01 ? 'safe-text-danger' : 'safe-text-success'
              }`}
            >
              {(circuitResult.humanShockCurrentA * 1000).toFixed(1)} mA ({circuitResult.shockRiskLevel})
            </div>
          </div>
        </div>

        {/* Safety Summary Alert */}
        <div
          className={`safe-summary-alert ${
            circuitResult.fuseStatus === 'BLOWN'
              ? 'is-tripped'
              : circuitResult.shockRiskLevel === 'LETHAL' || circuitResult.shockRiskLevel === 'DANGEROUS'
              ? 'is-danger'
              : 'is-normal'
          }`}
        >
          <strong>Status:</strong> {circuitResult.safetySummary}
        </div>
      </section>

      {/* 3. Guided Discoveries */}
      <section className="alt-section" aria-labelledby="sec-discoveries-heading">
        <h2 id="sec-discoveries-heading" className="alt-section-title">
          3. Guided Discoveries: Overloading, Short Circuits &amp; Grounding
        </h2>
        <p className="alt-section-desc">
          Step through three fundamental domestic circuit phenomena with one-click simulation setups.
        </p>

        <div className="safe-discovery-tabs" role="tablist">
          {SAFETY_DISCOVERIES.map((d) => (
            <button
              key={d.id}
              type="button"
              role="tab"
              aria-selected={activeDiscoveryId === d.id}
              className={`safe-tab-btn ${activeDiscoveryId === d.id ? 'is-active' : ''}`}
              onClick={() => handleLoadDiscoveryPreset(d.id)}
            >
              {d.title}
            </button>
          ))}
        </div>

        {(() => {
          const disc = SAFETY_DISCOVERIES.find((d) => d.id === activeDiscoveryId)
          if (!disc) return null
          const selectedChoiceId = discoveryChoices[disc.id]
          const selectedChoice = disc.options.find((o) => o.id === selectedChoiceId)

          return (
            <div className="alt-card safe-discovery-card">
              <h3 className="alt-card-title">{disc.title}</h3>
              <p className="safe-discovery-obj">
                <strong>Objective:</strong> {disc.objective}
              </p>

              <div className="safe-preset-banner">
                <span>Preset loaded: Fuse {disc.preset.fuseRatingA} A | Fault: {disc.preset.faultMode}</span>
                <button
                  type="button"
                  className="safe-reload-preset-btn"
                  onClick={() => handleLoadDiscoveryPreset(disc.id)}
                >
                  Reload Preset
                </button>
              </div>

              <p className="safe-discovery-q">
                <strong>Question:</strong> {disc.question}
              </p>

              <div className="alt-options-list">
                {disc.options.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    className={`alt-option-btn ${selectedChoiceId === opt.id ? 'is-selected' : ''}`}
                    onClick={() =>
                      setDiscoveryChoices((prev) => ({ ...prev, [disc.id]: opt.id }))
                    }
                  >
                    {opt.text}
                  </button>
                ))}
              </div>

              {selectedChoice && (
                <div
                  className={`alt-feedback-box ${
                    selectedChoice.correct ? 'is-correct' : 'is-incorrect'
                  }`}
                >
                  <strong>{selectedChoice.correct ? '✓ Exactly Right!' : 'ℹ Notice:'}</strong>{' '}
                  {selectedChoice.feedback}
                  <div className="safe-key-takeaway">
                    🔑 <strong>Key Takeaway:</strong> {disc.keyTakeaway}
                  </div>
                </div>
              )}
            </div>
          )
        })()}
      </section>

      {/* 4. Common Misconceptions Debunked */}
      <section className="alt-section" aria-labelledby="sec-misc-heading">
        <h2 id="sec-misc-heading" className="alt-section-title">
          4. Common Misconceptions Debunked
        </h2>
        <p className="alt-section-desc">
          Exam traps and real-world domestic wiring misunderstandings clarified.
        </p>

        <div className="alt-cards-grid">
          {SAFETY_MISCONCEPTIONS.map((m) => (
            <div key={m.id} className="alt-card safe-misc-card">
              <div className="safe-misc-myth">
                <span className="safe-misc-badge myth">MYTH</span>
                <p>"{m.myth}"</p>
              </div>
              <div className="safe-misc-reality">
                <span className="safe-misc-badge reality">REALITY</span>
                <p>{m.reality}</p>
              </div>
              <p className="safe-misc-exp">{m.explanation}</p>
              <div className="safe-ncert-ref">📖 {m.ncertReference}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Theoretical Foundation */}
      <section className="alt-section" aria-labelledby="sec-theory-heading">
        <h2 id="sec-theory-heading" className="alt-section-title">
          5. Theoretical Foundation &amp; Scientific Formulas
        </h2>
        <div className="alt-card">
          <div className="safe-theory-grid">
            <div className="safe-theory-item">
              <h3>Parallel Connection in Homes</h3>
              <p>
                In a domestic household, all appliances are connected in <strong>parallel</strong> across
                the Live (220 V) and Neutral (0 V) wires:
              </p>
              <code>V₁ = V₂ = ... = Vₙ = 220 V</code>
              <p>
                Total current drawn from the mains is the algebraic sum of all branch currents:
              </p>
              <code>I_total = Σ I_branch = Σ (P_i / V)</code>
            </div>

            <div className="safe-theory-item">
              <h3>Joule Heating &amp; The Fuse</h3>
              <p>
                The electric fuse works on the heating effect of electric current. Heat generated per
                second in the fuse wire:
              </p>
              <code>H = I² · R_fuse · t</code>
              <p>
                The fuse wire is made of a lead-tin alloy having a <strong>low melting point</strong>.
                When current exceeds the rated capacity, Joule heat melts the wire and saves household
                conductors from catching fire.
              </p>
            </div>

            <div className="safe-theory-item">
              <h3>Short Circuit (R → 0)</h3>
              <p>
                When Live and Neutral wires touch directly, the circuit bypasses all appliance load resistance:
              </p>
              <code>I = V / R → 220 V / 0.44 Ω ≈ 500 A</code>
              <p>
                This massive surge instantaneously melts the fuse wire, breaking the circuit in milliseconds.
              </p>
            </div>

            <div className="safe-theory-item">
              <h3>Earthing of Metallic Appliances</h3>
              <p>
                The green earth wire connects appliance metal casings to a copper plate buried deep in moist ground (R_earth ≈ 1 Ω).
              </p>
              <code>I_fault = 220 V / 1 Ω = 220 A &gt;&gt; I_fuse</code>
              <p>
                This heavy surge immediately blows the fuse, ensuring the metal casing never remains at 220 V to shock a human.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Worked Examples */}
      <section className="alt-section" aria-labelledby="sec-examples-heading">
        <h2 id="sec-examples-heading" className="alt-section-title">
          6. NCERT Worked Examples &amp; Step-by-Step Solutions
        </h2>

        <div className="alt-cards-grid">
          {SAFETY_WORKED_EXAMPLES.map((ex) => (
            <div key={ex.id} className="alt-card">
              <div className="safe-ncert-tag">{ex.ncertProblemRef}</div>
              <h3 className="alt-card-title">{ex.title}</h3>
              <p className="safe-problem-stmt">
                <strong>Problem:</strong> {ex.problemStatement}
              </p>

              <div className="safe-given-data">
                <strong>Given Data:</strong>
                <ul>
                  {ex.givenData.map((g, idx) => (
                    <li key={idx}>
                      {g.label}: <code>{g.value}</code>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="safe-steps-container">
                {ex.steps.map((st, idx) => (
                  <div key={idx} className="safe-step-box">
                    <div className="safe-step-title">{st.stepTitle}</div>
                    <div className="safe-step-formula">Formula: <code>{st.formula}</code></div>
                    <div className="safe-step-calc">Calc: {st.calculation}</div>
                    <div className="safe-step-result"><strong>Result:</strong> {st.result}</div>
                  </div>
                ))}
              </div>

              <div className="safe-conclusion-box">
                <strong>Conclusion:</strong> {ex.conclusion}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Practice Ladder (6 Questions) */}
      <section className="alt-section" aria-labelledby="sec-practice-heading">
        <h2 id="sec-practice-heading" className="alt-section-title">
          7. Practice Ladder: Foundation to Challenge (NCERT &amp; Board Focus)
        </h2>
        <p className="alt-section-desc">
          Test your mastery across 6 levels: Foundation, Standard, Advanced, Exemplar, and Board-Special.
        </p>

        <div className="safe-practice-list">
          {SAFETY_PRACTICE_QUESTIONS.map((q) => {
            const selectedOptId = practiceAnswers[q.id]
            const isRevealed = practiceRevealed[q.id]
            const selectedOpt = q.options.find((o) => o.id === selectedOptId)

            return (
              <div key={q.id} className="alt-card safe-practice-card">
                <div className="safe-practice-header">
                  <span className={`safe-level-badge level-${q.level.toLowerCase()}`}>{q.level}</span>
                  <h3 className="safe-practice-title">{q.title}</h3>
                </div>

                <p className="safe-practice-question">{q.question}</p>

                <div className="alt-options-list">
                  {q.options.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      className={`alt-option-btn ${selectedOptId === opt.id ? 'is-selected' : ''}`}
                      onClick={() =>
                        setPracticeAnswers((prev) => ({ ...prev, [q.id]: opt.id }))
                      }
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>

                <div className="safe-practice-actions">
                  <button
                    type="button"
                    className="alt-btn-primary"
                    disabled={!selectedOptId}
                    onClick={() =>
                      setPracticeRevealed((prev) => ({ ...prev, [q.id]: !prev[q.id] }))
                    }
                  >
                    {isRevealed ? 'Hide Solution' : 'Check Answer &amp; View Steps'}
                  </button>
                </div>

                {isRevealed && selectedOpt && (
                  <div
                    className={`alt-feedback-box ${
                      selectedOpt.correct ? 'is-correct' : 'is-incorrect'
                    }`}
                  >
                    <div>
                      <strong>{selectedOpt.correct ? '✓ Correct Answer!' : '✗ Not quite.'}</strong>
                    </div>
                    <div className="safe-trap-box">
                      ⚠️ <strong>Common Trap:</strong> {q.commonTrap}
                    </div>
                    <div className="safe-solution-steps">
                      <strong>Step-by-Step NCERT Derivation:</strong>
                      <ol>
                        {q.solutionSteps.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* 8. Recap & Key Takeaways */}
      <footer className="alt-section" aria-labelledby="sec-recap-heading">
        <h2 id="sec-recap-heading" className="alt-section-title">
          8. Summary of Domestic Electrical Safety Principles
        </h2>
        <div className="alt-card">
          <ul className="safe-summary-bullets">
            <li>
              <strong>220 V AC Single-Phase Supply:</strong> Indian domestic mains supply delivers 220 V RMS at 50 Hz. Live is at 220 V, Neutral is at 0 V.
            </li>
            <li>
              <strong>Parallel Circuit Wiring:</strong> Every appliance gets independent 220 V. Switching off or failing one branch does not break current to others.
            </li>
            <li>
              <strong>Overloading:</strong> Occurs when too many appliances operate simultaneously (I_total = Σ I_branch) or when high-power appliances are plugged into low-capacity circuits.
            </li>
            <li>
              <strong>Electric Fuse:</strong> Safety wire with high resistance and low melting point placed strictly in the <strong>Live wire</strong>. Blows via Joule heating (H = I² · R · t) when current exceeds rating.
            </li>
            <li>
              <strong>Short Circuit:</strong> Live wire touches Neutral wire directly (R → 0). Current surges to hundreds of amperes, causing fuse to melt instantaneously.
            </li>
            <li>
              <strong>Earthing Protection:</strong> Green earth wire provides a ~1 Ω path from metallic bodies to ground. Fault currents safely trip the fuse, keeping casing voltage near 0 V and preventing fatal shocks to humans.
            </li>
          </ul>
        </div>
      </footer>
    </div>
  )
}
