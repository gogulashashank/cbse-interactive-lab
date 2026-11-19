import { useState } from 'react'
import { usePrefs } from '../kit/prefs'
import { safeGetItem, safeSetItem } from '../kit/storage'
import { LanguageToggle } from '../kit/Toggles'
import '../kit/kit.css'
import type { StandaloneRouteId } from '../platform/routeRegistry'
import './notebook.css'
import {
  evaluateWorkbenchLabRecord,
  WORKBENCH_LAB_RECORDS,
  type WorkbenchRouteId,
  type WorkbenchStudentState,
} from './workbenchLabRecords'

function isWorkbenchRoute(routeId: StandaloneRouteId): routeId is WorkbenchRouteId {
  return routeId !== 'learn' && routeId !== 'revision'
}

function loadWorkbenchState(routeId: WorkbenchRouteId): WorkbenchStudentState {
  const raw = safeGetItem(`cil.workbench.record.${routeId}`)
  if (!raw) return {}
  try {
    return JSON.parse(raw) as WorkbenchStudentState
  } catch {
    return {}
  }
}

export interface WorkbenchLabRecordSectionProps {
  routeId: StandaloneRouteId
}

export function WorkbenchLabRecordSection({ routeId }: WorkbenchLabRecordSectionProps) {
  if (!isWorkbenchRoute(routeId)) return null
  return <WorkbenchLabRecordInner key={routeId} routeId={routeId} />
}

function WorkbenchLabRecordInner({ routeId }: { routeId: WorkbenchRouteId }) {
  const { lang } = usePrefs()
  const record = WORKBENCH_LAB_RECORDS[routeId]

  const [state, setState] = useState<WorkbenchStudentState>(() => loadWorkbenchState(routeId))
  const [sheetOpen, setSheetOpen] = useState<boolean>(true)

  const summary = evaluateWorkbenchLabRecord(record, state)

  function updateState(updater: (cur: WorkbenchStudentState) => WorkbenchStudentState) {
    setState((prev) => {
      const next = updater(prev)
      safeSetItem(`cil.workbench.record.${routeId}`, JSON.stringify(next))
      return next
    })
  }

  function handleResetRecord() {
    setState({})
    safeSetItem(`cil.workbench.record.${routeId}`, JSON.stringify({}))
  }

  const obsChoice = state.observationChoice ?? null
  const obsLocked = Boolean(state.observationLocked)
  const claimChoice = state.claimChoice ?? null
  const claimLocked = Boolean(state.claimLocked)
  const rubricChecked = state.rubricChecked ?? [false, false, false]

  return (
    <section
      className="nb-page"
      style={{ paddingTop: '0.35rem', paddingBottom: '0.65rem' }}
      aria-label={record.labTitle[lang]}
    >
      {/* Top Guided Practical Protocol & Score Strip */}
      <div className="nb-header" style={{ padding: '0.9rem 1.15rem', gap: '0.65rem' }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.45rem' }}>
            <span className="nb-chapter-pill">{record.ncertActivityRef}</span>
            <span className="nb-progress-summary" data-testid="wb-autograded-score">
              {lang === 'hi'
                ? `स्वतः मूल्यांकित प्रयोग (Auto-Graded): ${summary.autoGradedScore}/${summary.autoGradedPossible}`
                : `Auto-Graded Practical: ${summary.autoGradedScore}/${summary.autoGradedPossible}`}
            </span>
            <span
              className="nb-progress-summary"
              data-testid="wb-selfassessed-score"
              style={{ background: '#eff6ff', borderColor: '#93c5fd', color: '#1e3a8a' }}
            >
              {lang === 'hi'
                ? `स्व-मूल्यांकित रूब्रिक (Self-Assessed): ${summary.selfAssessedRubricScore}/${summary.selfAssessedRubricPossible}`
                : `Self-Assessed Rubric: ${summary.selfAssessedRubricScore}/${summary.selfAssessedRubricPossible} (Not Auto-Graded)`}
            </span>
          </div>

          <div className="no-print" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center' }}>
            <LanguageToggle />
            <button
              type="button"
              className="nb-QuickChip"
              onClick={handleResetRecord}
            >
              {lang === 'hi' ? '↺ अभिलेख रीसेट' : '↺ Reset Record'}
            </button>
            <button
              type="button"
              className={`nb-QuickChip ${sheetOpen ? 'is-active' : ''}`}
              aria-expanded={sheetOpen}
              onClick={() => setSheetOpen((v) => !v)}
            >
              {sheetOpen
                ? lang === 'hi'
                  ? '▲ प्रायोगिक अभिलेख संक्षिप्त करें'
                  : '▲ Hide Practical Record Sheet'
                : lang === 'hi'
                  ? '▼ प्रायोगिक अभिलेख एवं रूब्रिक खोलें'
                  : '▼ Open Practical Record & Rubric Sheet'}
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '0.35rem' }}>
          <h2 className="nb-stage-heading" style={{ fontSize: '1.15rem', margin: 0 }}>
            {record.labTitle[lang]}
          </h2>
          <p style={{ margin: 0, fontSize: '0.88rem', color: '#334155', lineHeight: 1.48 }}>
            <strong>{lang === 'hi' ? 'उद्देश्य (Aim):' : 'Aim:'}</strong> {record.aim[lang]}
          </p>
        </div>

        {/* 3-Step Hands-On Apparatus Protocol Strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: '0.55rem',
          }}
        >
          {record.procedureSteps.map((step, idx) => (
            <div
              key={idx}
              style={{
                background: '#fcf8ef',
                border: '1px solid #d4c4a8',
                borderRadius: '0.5rem',
                padding: '0.55rem 0.75rem',
                fontSize: '0.83rem',
                lineHeight: 1.45,
                color: '#1e293b',
              }}
            >
              {step[lang]}
            </div>
          ))}
        </div>
      </div>

      {/* Expandable Ruled Science Notebook Practical Record & Viva Spread */}
      {sheetOpen && (
        <div className="nb-spread" style={{ marginTop: '0.75rem' }}>
          {/* Left Sheet: Part 1 Apparatus Observation Check (Auto-Graded) + Part 2 Viva-Voce Trap */}
          <div className="nb-sheet nb-sheet--apparatus" style={{ position: 'static' }}>
            <div>
              <span className="nb-stage-kicker">
                {lang === 'hi'
                  ? 'भाग 1 · उपकरण प्रेक्षण जाँच (Auto-Graded · 1 अंक)'
                  : 'Part 1 · Apparatus Observation Check (Auto-Graded · 1 Mark)'}
              </span>
              <div className="nb-math-block" style={{ margin: '0.4rem 0' }}>
                {record.governingEquation}
              </div>
              <p style={{ fontWeight: 700, fontSize: '0.92rem', lineHeight: 1.5, margin: '0.4rem 0' }}>
                {record.observationCheck.prompt[lang]}
              </p>

              <div style={{ display: 'grid', gap: '0.42rem' }}>
                {record.observationCheck.options.map((opt, idx) => {
                  const selected = obsChoice === idx
                  return (
                    <label
                      key={idx}
                      className={`cil-option ${selected ? 'cil-option--selected' : ''} ${
                        obsLocked && idx === record.observationCheck.correctIndex
                          ? 'cil-option--correct'
                          : ''
                      } ${
                        obsLocked && selected && idx !== record.observationCheck.correctIndex
                          ? 'cil-option--wrong'
                          : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name={`wb-obs-${routeId}`}
                        checked={selected}
                        disabled={obsLocked}
                        onChange={() =>
                          updateState((cur) => ({ ...cur, observationChoice: idx }))
                        }
                      />
                      <span>{opt[lang]}</span>
                    </label>
                  )
                })}
              </div>

              {!obsLocked && (
                <button
                  type="button"
                  className="cil-btn cil-btn--primary no-print"
                  style={{ marginTop: '0.6rem' }}
                  disabled={obsChoice === null}
                  onClick={() =>
                    updateState((cur) => ({ ...cur, observationLocked: true }))
                  }
                >
                  {lang === 'hi'
                    ? 'प्रेक्षण जाँचें (Verify Observation · Auto-Graded)'
                    : 'Verify Apparatus Observation (Auto-Graded)'}
                </button>
              )}

              {obsLocked && (
                <div
                  className={`cil-feedback ${
                    summary.observationCorrect ? 'cil-feedback--correct' : 'cil-feedback--wrong'
                  }`}
                  style={{ marginTop: '0.65rem' }}
                >
                  <strong>
                    {summary.observationCorrect
                      ? lang === 'hi'
                        ? '✓ सही प्रायोगिक प्रेक्षण! (1/1 Auto-Graded)'
                        : '✓ Correct Apparatus Observation! (1/1 Auto-Graded)'
                      : lang === 'hi'
                        ? '✗ सही प्रायोगिक स्पष्टीकरण देखें:'
                        : '✗ Review the apparatus observation explanation:'}
                  </strong>
                  <p style={{ margin: '0.3rem 0 0', fontSize: '0.86rem' }}>
                    {record.observationCheck.explanation[lang]}
                  </p>
                </div>
              )}
            </div>

            {/* Part 2: Practical Viva-Voce Trap vs Verified Answer */}
            <div style={{ display: 'grid', gap: '0.5rem', marginTop: '0.4rem' }}>
              <span className="nb-stage-kicker">
                {lang === 'hi'
                  ? 'भाग 2 · प्रायोगिक मौखिक प्रश्न (Viva-Voce Trap vs Physical Reality)'
                  : 'Part 2 · Practical Viva-Voce Question & Mistake Trap'}
              </span>
              <p style={{ margin: 0, fontWeight: 800, fontSize: '0.9rem', color: '#1e293b' }}>
                Q: {record.vivaVoceTrap.question[lang]}
              </p>
              <div className="nb-trap-card">
                <div className="nb-trap-kicker">
                  {lang === 'hi' ? '✗ सामान्य प्रायोगिक भूल' : '✗ Common Lab Mistake'}
                </div>
                <p style={{ margin: 0, fontSize: '0.86rem', lineHeight: 1.45 }}>
                  {record.vivaVoceTrap.commonMistake[lang]}
                </p>
              </div>
              <div className="nb-reality-card">
                <div className="nb-reality-kicker">
                  {lang === 'hi' ? '✓ परीक्षक-प्रमाणित उत्तर' : '✓ Examiner-Verified Answer'}
                </div>
                <p style={{ margin: 0, fontSize: '0.86rem', lineHeight: 1.45 }}>
                  {record.vivaVoceTrap.correctAnswer[lang]}
                </p>
              </div>
            </div>
          </div>

          {/* Right Sheet: Part 3A HOTS Practical Claim (Auto-Graded) + Part 3B Self-Assessed Written Conclusion & 3-Point Rubric */}
          <div className="nb-sheet nb-sheet--ruled">
            <span className="nb-stage-kicker">
              {lang === 'hi'
                ? 'भाग 3 · उच्च स्तरीय प्रायोगिक निष्कर्ष एवं 3-बिंदु स्व-मूल्यांकन रूब्रिक'
                : 'Part 3 · HOTS Practical Conclusion & 3-Point Self-Check Rubric'}
            </span>
            <h3 className="nb-stage-heading" style={{ fontSize: '1.08rem', margin: 0 }}>
              {record.hotsClaimAndRubric.title[lang]}
            </h3>
            <p style={{ fontWeight: 700, fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>
              {record.hotsClaimAndRubric.prompt[lang]}
            </p>

            {/* Part 3A: Deterministic Structured Claim */}
            <div className="nb-protocol-box" style={{ margin: 0 }}>
              <div className="nb-worked-step-label">
                {lang === 'hi'
                  ? 'भाग 3A: वैज्ञानिक दावा चुनें (Auto-Graded · 1 अंक)'
                  : 'Part 3A: Select the Scientific Claim (Auto-Graded · 1 Mark)'}
              </div>
              <div style={{ display: 'grid', gap: '0.42rem', marginTop: '0.4rem' }}>
                {record.hotsClaimAndRubric.claimOptions.map((opt, idx) => {
                  const selected = claimChoice === idx
                  return (
                    <label
                      key={idx}
                      className={`cil-option ${selected ? 'cil-option--selected' : ''} ${
                        claimLocked && idx === record.hotsClaimAndRubric.correctClaimIndex
                          ? 'cil-option--correct'
                          : ''
                      } ${
                        claimLocked && selected && idx !== record.hotsClaimAndRubric.correctClaimIndex
                          ? 'cil-option--wrong'
                          : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name={`wb-claim-${routeId}`}
                        checked={selected}
                        disabled={claimLocked}
                        onChange={() =>
                          updateState((cur) => ({ ...cur, claimChoice: idx }))
                        }
                      />
                      <span>{opt[lang]}</span>
                    </label>
                  )
                })}
              </div>

              {!claimLocked && (
                <button
                  type="button"
                  className="cil-btn cil-btn--primary no-print"
                  style={{ marginTop: '0.6rem' }}
                  disabled={claimChoice === null}
                  onClick={() =>
                    updateState((cur) => ({ ...cur, claimLocked: true }))
                  }
                >
                  {lang === 'hi'
                    ? 'वैज्ञानिक दावा जाँचें (Auto-Grade Claim)'
                    : 'Verify Practical Claim (Auto-Graded)'}
                </button>
              )}

              {claimLocked && (
                <div
                  className={`cil-feedback ${
                    summary.claimCorrect ? 'cil-feedback--correct' : 'cil-feedback--wrong'
                  }`}
                  style={{ marginTop: '0.65rem' }}
                >
                  <strong>
                    {summary.claimCorrect
                      ? lang === 'hi'
                        ? '✓ वैज्ञानिक दावा बिल्कुल सही है! (1/1 Auto-Graded)'
                        : '✓ Correct Scientific Claim! (1/1 Auto-Graded)'
                      : lang === 'hi'
                        ? '✗ सही वैज्ञानिक तर्क देखें:'
                        : '✗ Review the physical justification:'}
                  </strong>
                  <p style={{ margin: '0.3rem 0 0', fontSize: '0.86rem' }}>
                    {record.hotsClaimAndRubric.claimExplanation[lang]}
                  </p>
                </div>
              )}
            </div>

            {/* Part 3B: Transparent Self-Assessed Written Conclusion & 3-Point Rubric */}
            <div className="nb-rubric-box" style={{ margin: 0 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.4rem',
                }}
              >
                <span className="nb-worked-step-label">
                  {lang === 'hi'
                    ? 'भाग 3B: लिखित निष्कर्ष एवं 3-बिंदु स्व-मूल्यांकन रूब्रिक'
                    : 'Part 3B: Written Lab Conclusion & 3-Point Self-Check Rubric'}
                </span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '0.18rem 0.5rem',
                    borderRadius: '999px',
                    background: '#eff6ff',
                    color: '#1e3a8a',
                    border: '1px solid #93c5fd',
                  }}
                >
                  {lang === 'hi'
                    ? `स्व-मूल्यांकित: ${summary.selfAssessedRubricScore}/3 (स्वतः ग्रेड नहीं किया जाता)`
                    : `Self-Assessed: ${summary.selfAssessedRubricScore}/3 (Not Automatically Graded)`}
                </span>
              </div>

              <textarea
                className="nb-textarea"
                rows={2}
                value={state.writtenConclusion ?? ''}
                onChange={(e) =>
                  updateState((cur) => ({
                    ...cur,
                    writtenConclusion: e.target.value,
                  }))
                }
                placeholder={
                  lang === 'hi'
                    ? 'अपना प्रायोगिक निष्कर्ष यहाँ लिखें और नीचे दिए गए 3-बिंदु रूब्रिक से स्वयं मिलान करें...'
                    : 'Write your practical conclusion here, then compare with the 3-point self-check rubric below...'
                }
              />

              <p style={{ margin: '0.25rem 0', fontSize: '0.78rem', color: '#475569' }}>
                {lang === 'hi'
                  ? 'खुलासा: यह लिखित निष्कर्ष स्वतः मूल्यांकित नहीं होता। नीचे दिए गए रूब्रिक बिंदुओं से अपने उत्तर की तुलना करें और सुधार करें:'
                  : 'Disclosure: Written conclusions are not auto-graded. Compare your explanation with the 3 rubric checkpoints below and revise freely:'}
              </p>

              <div style={{ display: 'grid', gap: '0.35rem' }}>
                {record.hotsClaimAndRubric.rubricPoints.map((pt, rIdx) => (
                  <label key={rIdx} className="nb-rubric-item">
                    <input
                      type="checkbox"
                      checked={Boolean(rubricChecked[rIdx])}
                      onChange={(e) => {
                        const next = [...rubricChecked]
                        next[rIdx] = e.target.checked
                        updateState((cur) => ({ ...cur, rubricChecked: next }))
                      }}
                    />
                    <span>{pt[lang]}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
