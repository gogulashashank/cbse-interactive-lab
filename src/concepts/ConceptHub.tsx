import { useState, useEffect } from 'react'
import { CONCEPTS, getConceptById, getPilotConcepts, THREADS, type ThreadId } from './registry'
import { RATE_VS_TOTAL_CONTENT } from './rateVsTotal/content'
import { SQUARES_AND_INVERSES_CONTENT } from './squaresAndInverses/content'
import { CONTROLLED_EXPERIMENTS_CONTENT } from './controlledExperiments/content'
import { ENERGY_CONSERVATION_CONTENT } from './energyConservation/content'
import { BucketInteractive } from './rateVsTotal/BucketInteractive'
import { ChargeInteractive } from './rateVsTotal/ChargeInteractive'
import { EnergyInteractive } from './rateVsTotal/EnergyInteractive'
import { BillInteractive } from './rateVsTotal/BillInteractive'
import { InverseAreaInteractive } from './squaresAndInverses/InverseAreaInteractive'
import { DiameterTrapInteractive } from './squaresAndInverses/DiameterTrapInteractive'
import { VoltageSquaredInteractive } from './squaresAndInverses/VoltageSquaredInteractive'
import { GravityInverseInteractive } from './squaresAndInverses/GravityInverseInteractive'
import { FixedPowerInteractive } from './controlledExperiments/FixedPowerInteractive'
import { StretchingInteractive } from './controlledExperiments/StretchingInteractive'
import { ConstantTempInteractive } from './controlledExperiments/ConstantTempInteractive'
import { CircuitFailureInteractive } from './controlledExperiments/CircuitFailureInteractive'
import { ElectricalEnergyInteractive } from './energyConservation/ElectricalEnergyInteractive'
import { ChargeConservationInteractive } from './energyConservation/ChargeConservationInteractive'
import { CircuitPowerBalanceInteractive } from './energyConservation/CircuitPowerBalanceInteractive'
import { MechanicalRampConservationInteractive } from './energyConservation/MechanicalRampConservationInteractive'
import { PredictCard } from '../kit/PredictCard'
import { ExamQuestion } from '../kit/ExamQuestion'
import { ShareButton } from '../kit/ShareButton'
import { LanguageToggle, ProjectorToggle } from '../kit/Toggles'
import { usePrefs } from '../kit/prefs'
import { safeGetItem, safeSetItem } from '../kit/storage'
import '../kit/kit.css'

const PROGRESS_KEY = 'cil.progress'

const ALL_CONTENT = {
  ...RATE_VS_TOTAL_CONTENT,
  ...SQUARES_AND_INVERSES_CONTENT,
  ...CONTROLLED_EXPERIMENTS_CONTENT,
  ...ENERGY_CONSERVATION_CONTENT,
}

export function ConceptHub() {
  const { lang, projector } = usePrefs()
  const [selectedThread, setSelectedThread] = useState<ThreadId>('rate-vs-total')
  const [completed, setCompleted] = useState<string[]>(() => {
    const raw = safeGetItem(PROGRESS_KEY)
    return raw ? JSON.parse(raw) : []
  })

  // Deep link parsing: /learn/<conceptId>
  const [activeConceptId, setActiveConceptId] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null
    const parts = window.location.pathname.split('/').filter(Boolean)
    return parts[1] || null
  })

  useEffect(() => {
    function handlePop() {
      const parts = window.location.pathname.split('/').filter(Boolean)
      const nextId = parts[1] || null
      setActiveConceptId(nextId)
      if (nextId) {
        const c = getConceptById(nextId)
        if (c) setSelectedThread(c.thread)
      }
    }
    window.addEventListener('popstate', handlePop)
    return () => window.removeEventListener('popstate', handlePop)
  }, [])

  function navigateToConcept(id: string | null) {
    const nextPath = id ? `/learn/${id}` : '/learn'
    if (typeof window !== 'undefined' && window.location.pathname !== nextPath) {
      window.history.pushState({}, '', nextPath)
    }
    setActiveConceptId(id)
    if (id) {
      const c = getConceptById(id)
      if (c) setSelectedThread(c.thread)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function markCompleted(id: string) {
    if (!completed.includes(id)) {
      const next = [...completed, id]
      setCompleted(next)
      safeSetItem(PROGRESS_KEY, JSON.stringify(next))
    }
  }

  const pilotConcepts = getPilotConcepts()
  const activeConcept = activeConceptId ? getConceptById(activeConceptId) : null
  const content = activeConceptId ? ALL_CONTENT[activeConceptId] : null
  const threadConcepts = pilotConcepts.filter((c) => c.thread === selectedThread)
  const currentThread = THREADS.find((t) => t.id === selectedThread) || THREADS[0]

  return (
    <main
      className={`alt-lens-page ${projector ? 'cil-projector' : ''}`}
      style={{ maxWidth: '840px', margin: '0 auto', padding: '1rem', fontFamily: 'var(--kit-font-sans)' }}
    >
      {/* Top action bar: Language and Projector toggles */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          paddingBottom: '0.75rem',
          borderBottom: '1px solid #e2e8f0',
          marginBottom: '1rem',
        }}
      >
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0369a1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {lang === 'hi' ? 'अवधारणा कार्ड (Concept Cards)' : 'Core Concept Threads'}
          </span>
          <h1 style={{ margin: '0.2rem 0 0', fontSize: '1.4rem', color: '#0f172a' }}>
            {activeConcept ? activeConcept.title[lang] : currentThread.title[lang]}
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <LanguageToggle />
          <ProjectorToggle />
        </div>
      </header>

      {/* Thread Switcher Tabs when on Hub overview */}
      {!activeConceptId && (
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          {THREADS.map((thread) => (
            <button
              key={thread.id}
              type="button"
              className={`kit-btn ${selectedThread === thread.id ? 'kit-btn-primary' : 'kit-btn-secondary'}`}
              style={{ fontSize: '0.9rem', whiteSpace: 'nowrap' }}
              onClick={() => setSelectedThread(thread.id)}
            >
              {thread.title[lang]}
            </button>
          ))}
        </div>
      )}

      {/* Progress pill */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', background: '#f8fafc', padding: '0.5rem 0.85rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
        <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
          {lang === 'hi' ? 'आपकी प्रगति:' : 'Your Progress:'} {completed.filter((c) => pilotConcepts.some((p) => p.id === c)).length} / {pilotConcepts.length} {lang === 'hi' ? 'कार्ड पूरे' : 'cards completed'}
        </span>
        {activeConceptId && (
          <button
            type="button"
            className="kit-btn kit-btn-secondary"
            style={{ minHeight: '32px', padding: '2px 8px', fontSize: '0.8rem' }}
            onClick={() => navigateToConcept(null)}
          >
            {lang === 'hi' ? '← सभी कार्ड देखें' : '← All Cards'}
          </button>
        )}
      </div>

      {/* Active Concept Card View */}
      {activeConcept && content ? (
        <article>
          {/* Card Title & Board Badge */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.3rem' }}>
              <span className="kit-exam-tag">{activeConcept.boardMapping[0]?.chapterRef}</span>
              {completed.includes(activeConcept.id) && (
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#047857', background: '#ecfdf5', padding: '2px 6px', borderRadius: '4px' }}>
                  ✓ {lang === 'hi' ? 'पूर्ण' : 'Completed'}
                </span>
              )}
            </div>
            <h2 style={{ margin: 0, fontSize: '1.35rem', color: '#0f172a' }}>{activeConcept.title[lang]}</h2>
            <p style={{ margin: '0.4rem 0 0', fontSize: '0.95rem', color: '#475569' }}>{activeConcept.oneLine[lang]}</p>
          </div>

          {/* Hook Question */}
          <div style={{ background: '#fefce8', borderInlineStart: '4px solid #ca8a04', padding: '0.75rem 1rem', borderRadius: '4px', margin: '1rem 0' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#854d0e', display: 'block' }}>
              {lang === 'hi' ? 'रोज़मर्रा की पहेली (Daily Life Hook)' : 'Daily Life Hook'}
            </span>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.95rem', fontWeight: 600, color: '#713f12' }}>
              {content.hook[lang]}
            </p>
          </div>

          {/* Predict First */}
          <PredictCard
            question={content.predictQuestion[lang]}
            options={content.predictOptions.map((o) => o[lang])}
            correctIndex={content.predictCorrectIndex}
            explanation={content.predictExplanation[lang]}
            lang={lang}
            onLocked={() => markCompleted(activeConcept.id)}
          />

          {/* Interactive Experiment Reveal */}
          {activeConcept.id === 'rate-vs-total-intro' && <BucketInteractive lang={lang} />}
          {activeConcept.id === 'current-vs-charge' && <ChargeInteractive lang={lang} />}
          {activeConcept.id === 'power-vs-energy' && <EnergyInteractive lang={lang} />}
          {activeConcept.id === 'units-on-the-bill' && <BillInteractive lang={lang} />}
          {activeConcept.id === 'inverse-area-scaling' && <InverseAreaInteractive lang={lang} />}
          {activeConcept.id === 'diameter-trap' && <DiameterTrapInteractive lang={lang} />}
          {activeConcept.id === 'voltage-squared-power' && <VoltageSquaredInteractive lang={lang} />}
          {activeConcept.id === 'gravity-inverse-square' && <GravityInverseInteractive lang={lang} />}
          {activeConcept.id === 'fixed-voltage-vs-current' && <FixedPowerInteractive lang={lang} />}
          {activeConcept.id === 'stretching-vs-comparing' && <StretchingInteractive lang={lang} />}
          {activeConcept.id === 'constant-temp-ohmic' && <ConstantTempInteractive lang={lang} />}
          {activeConcept.id === 'series-parallel-failure' && <CircuitFailureInteractive lang={lang} />}
          {activeConcept.id === 'electrical-energy-transfer' && <ElectricalEnergyInteractive lang={lang} />}
          {activeConcept.id === 'charge-conservation-junction' && <ChargeConservationInteractive lang={lang} />}
          {activeConcept.id === 'circuit-power-balance' && <CircuitPowerBalanceInteractive lang={lang} />}
          {activeConcept.id === 'mechanical-ramp-conservation' && <MechanicalRampConservationInteractive lang={lang} />}

          {/* Core Insight Callout */}
          <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '8px', padding: '1rem', margin: '1.25rem 0' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#166534' }}>
              {lang === 'hi' ? 'मुख्य वैज्ञानिक सिद्धांत (Core Insight)' : 'Core Scientific Insight'}
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#14532d', margin: '0.3rem 0' }}>
              {content.insightFormula}
            </div>
            <div style={{ fontSize: '0.92rem', color: '#166534', lineHeight: 1.45 }}>
              <strong>{content.insightTerm[lang]}:</strong> {content.insightSummary[lang]}
            </div>
          </div>

          {/* Board Exam Practice */}
          <section style={{ marginTop: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#0f172a', marginBottom: '0.5rem' }}>
              {lang === 'hi' ? 'बोर्ड परीक्षा अभ्यास (Exam Pattern)' : 'Board Exam Practice'}
            </h3>
            {content.examQuestions.map((q, qIdx) => (
              <ExamQuestion
                key={qIdx}
                title={q.title[lang]}
                prompt={q.prompt[lang]}
                options={q.options.map((o) => o[lang])}
                correctIndex={q.correctIndex}
                hint={q.hint[lang]}
                solutionSteps={q.steps.map((s) => ({ label: s.label[lang], content: s.content[lang] }))}
                finalAnswer={q.finalAnswer[lang]}
                lang={lang}
              />
            ))}
          </section>

          {/* Card Footer: Share + Deep Dive + Next card */}
          <footer style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <ShareButton
                challengeText={content.hook[lang]}
                path={`/learn/${activeConcept.id}`}
                lang={lang}
              />
              {activeConcept.deepDiveRoute && (
                <a
                  href={activeConcept.deepDiveRoute}
                  className="kit-btn kit-btn-secondary"
                  style={{ textDecoration: 'none' }}
                >
                  {lang === 'hi' ? 'गहराई से पढ़ें (Deep Dive Lab) →' : 'Full Experiment Lab →'}
                </a>
              )}
            </div>

            {/* Stepper to next pilot card */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              {(() => {
                const curIdx = pilotConcepts.findIndex((c) => c.id === activeConcept.id)
                const next = pilotConcepts[curIdx + 1]
                if (!next) return null
                return (
                  <button
                    type="button"
                    className="kit-btn kit-btn-primary"
                    onClick={() => navigateToConcept(next.id)}
                  >
                    {lang === 'hi' ? `अगला कार्ड: ${next.title[lang]} →` : `Next: ${next.title[lang]} →`}
                  </button>
                )
              })()}
            </div>
          </footer>
        </article>
      ) : (
        /* Thread Overview: Cards in selected thread */
        <section>
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ margin: 0, fontSize: '0.95rem', color: '#475569' }}>
              {currentThread.tagline[lang]}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {threadConcepts.map((concept, idx) => {
              const isDone = completed.includes(concept.id)
              return (
                <div
                  key={concept.id}
                  style={{
                    background: '#ffffff',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '1rem 1.25rem',
                    cursor: 'pointer',
                    transition: 'border-color 0.15s ease',
                  }}
                  onClick={() => navigateToConcept(concept.id)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0369a1', textTransform: 'uppercase' }}>
                      {lang === 'hi' ? `कार्ड ${idx + 1}` : `Card ${idx + 1}`} · {concept.boardMapping[0]?.chapterRef}
                    </span>
                    {isDone && (
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#047857', background: '#ecfdf5', padding: '2px 6px', borderRadius: '4px' }}>
                        ✓ {lang === 'hi' ? 'पूर्ण' : 'Done'}
                      </span>
                    )}
                  </div>
                  <h3 style={{ margin: '0 0 0.3rem', fontSize: '1.1rem', color: '#0f172a' }}>{concept.title[lang]}</h3>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569', lineHeight: 1.45 }}>{concept.oneLine[lang]}</p>
                </div>
              )
            })}
          </div>

          {/* Mapped Deep Dive Lessons */}
          <div style={{ marginTop: '2rem', padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ margin: '0 0 0.5rem', color: '#0f172a' }}>
              {lang === 'hi' ? 'विस्तृत प्रयोगशालाएँ (Deep Dive Labs)' : 'Full Experiment Labs (Mapped to NCERT)'}
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {CONCEPTS.filter((c) => c.status === 'mapped').map((mc) => (
                <a
                  key={mc.id}
                  href={mc.deepDiveRoute || '/'}
                  style={{
                    display: 'inline-block',
                    padding: '0.4rem 0.75rem',
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '4px',
                    fontSize: '0.85rem',
                    color: '#0369a1',
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  {mc.title[lang]} →
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
