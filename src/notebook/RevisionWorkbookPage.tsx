import { useMemo, useState } from 'react'
import { THREADS, type ConceptId, type ThreadId } from '../concepts/registry'
import { usePrefs } from '../kit/prefs'
import { safeGetItem, safeSetItem } from '../kit/storage'
import { LanguageToggle, ProjectorToggle } from '../kit/Toggles'
import '../kit/kit.css'
import './notebook.css'
import { NotebookHeader } from './NotebookSpread'
import {
  computeBoardPaperScore,
  filterRevisionEntries,
  getAllRevisionEntries,
  type RevisionEntry,
  type StudentQuestionResponse,
} from './revisionModel'

const FLAGGED_TRAPS_KEY = 'cil.revision.flagged'

export type RevisionWorkbookMode = 'exam' | 'traps' | 'compendium'

function navigateToPath(nextPath: string) {
  if (typeof window !== 'undefined' && window.location.pathname !== nextPath) {
    window.history.pushState({}, '', nextPath)
    window.dispatchEvent(new PopStateEvent('popstate'))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

export function RevisionWorkbookPage() {
  const { lang, projector } = usePrefs()
  const allEntries = useMemo(() => getAllRevisionEntries(), [])

  const [mode, setMode] = useState<RevisionWorkbookMode>('exam')
  const [classFilter, setClassFilter] = useState<'all' | 9 | 10>('all')
  const [threadFilter, setThreadFilter] = useState<'all' | ThreadId>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [flaggedOnly, setFlaggedOnly] = useState(false)

  const [flaggedIds, setFlaggedIds] = useState<string[]>(() => {
    const raw = safeGetItem(FLAGGED_TRAPS_KEY)
    return raw ? JSON.parse(raw) : []
  })

  const [responses, setResponses] = useState<Record<string, StudentQuestionResponse>>({})

  const flaggedSet = useMemo(() => new Set<string>(flaggedIds), [flaggedIds])

  const filteredEntries = useMemo(
    () =>
      filterRevisionEntries(allEntries, {
        classLevel: classFilter,
        threadId: threadFilter,
        searchQuery,
        flaggedOnly,
        flaggedIds: flaggedSet,
      }),
    [allEntries, classFilter, threadFilter, searchQuery, flaggedOnly, flaggedSet]
  )

  const scoreSummary = useMemo(
    () => computeBoardPaperScore(filteredEntries, responses),
    [filteredEntries, responses]
  )

  function toggleFlagged(conceptId: ConceptId) {
    setFlaggedIds((prev) => {
      const next = prev.includes(conceptId)
        ? prev.filter((id) => id !== conceptId)
        : [...prev, conceptId]
      safeSetItem(FLAGGED_TRAPS_KEY, JSON.stringify(next))
      return next
    })
  }

  function updateResponse(
    conceptId: ConceptId,
    updater: (cur: StudentQuestionResponse) => StudentQuestionResponse
  ) {
    setResponses((prev) => ({
      ...prev,
      [conceptId]: updater(prev[conceptId] ?? {}),
    }))
  }

  function handleResetPaper() {
    setResponses({})
  }

  function handlePrintWorkbook() {
    if (typeof window !== 'undefined' && typeof window.print === 'function') {
      window.print()
    }
  }

  return (
    <main className={`nb-page ${projector ? 'cil-projector' : ''}`}>
      <NotebookHeader
        eyebrow={
          lang === 'hi'
            ? 'सीबीएसई बोर्ड परीक्षा सिम्युलेटर एवं पुनरावृत्ति कार्यपुस्तिका (36 अध्याय)'
            : 'CBSE Board Exam Simulator & Printable Revision Workbook · All 36 Notebooks'
        }
        title={
          lang === 'hi'
            ? 'कक्षा 9 एवं 10 विज्ञान: सूत्र, परीक्षा के जाल एवं बोर्ड अभ्यास'
            : 'Class 9 & 10 Science: Board Paper Simulator, Trap Deck & Formula Sheets'
        }
        subtitle={
          lang === 'hi'
            ? 'स्वतः मूल्यांकित संख्यात्मक प्रश्नों (Auto-Graded) और स्व-मूल्यांकित लिखित तर्क (Self-Assessed 3-Point Rubric) के साथ संपूर्ण अभ्यास।'
            : 'Practice mixed-chapter board numericals, HOTS scientific claims with transparent 3-point self-check rubrics, and print-ready revision sheets.'
        }
        chapterBadge="CBSE Class 9 & 10 Complete Science Syllabus (36 Labs)"
        onBack={() => navigateToPath('/learn')}
        backLabel={lang === 'hi' ? '← नोटबुक शेल्फ (36 लैब्स)' : '← Notebook Shelf (36 Labs)'}
        utilities={
          <div className="no-print" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', alignItems: 'center' }}>
            <LanguageToggle />
            <ProjectorToggle />
            <button
              type="button"
              className="nb-QuickChip is-active"
              onClick={handlePrintWorkbook}
            >
              {lang === 'hi' ? '🖨️ प्रिंट / PDF सेव करें' : '🖨️ Print / Save PDF'}
            </button>
            {mode === 'exam' && (
              <button
                type="button"
                className="nb-QuickChip"
                onClick={handleResetPaper}
              >
                {lang === 'hi' ? '↺ पेपर रीसेट करें' : '↺ Reset Exam Paper'}
              </button>
            )}
          </div>
        }
      >
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {/* 3 Workbook Modes */}
          <div
            className="nb-stage-stepper no-print"
            role="tablist"
            aria-label="Revision workbook modes"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'exam'}
              className={`nb-stage-tab ${mode === 'exam' ? 'is-active' : ''}`}
              onClick={() => setMode('exam')}
            >
              <span className="nb-stage-dot">1</span>
              <span>
                {lang === 'hi'
                  ? '1. बोर्ड परीक्षा सिम्युलेटर (Auto-Graded + HOTS Rubric)'
                  : '1. Board Exam Simulator (Auto-Graded + HOTS Rubric)'}
              </span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'traps'}
              className={`nb-stage-tab ${mode === 'traps' ? 'is-active' : ''}`}
              onClick={() => setMode('traps')}
            >
              <span className="nb-stage-dot">2</span>
              <span>
                {lang === 'hi'
                  ? '2. परीक्षा के 28 जाल एवं 3-सेकंड नियम (Mistake-Trap Deck)'
                  : '2. 28-Lab Mistake-Trap & 3-Second Check Deck'}
              </span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'compendium'}
              className={`nb-stage-tab ${mode === 'compendium' ? 'is-active' : ''}`}
              onClick={() => setMode('compendium')}
            >
              <span className="nb-stage-dot">3</span>
              <span>
                {lang === 'hi'
                  ? '3. प्रिंट-योग्य सूत्र एवं हल किए गए उदाहरण (Formula Sheet)'
                  : '3. Printable Formula & Worked-Numerical Compendium'}
              </span>
            </button>
          </div>

          {/* Filter & Score Bar */}
          <div
            className="no-print"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center' }}>
              <button
                type="button"
                className={`nb-QuickChip ${classFilter === 'all' ? 'is-active' : ''}`}
                aria-pressed={classFilter === 'all'}
                onClick={() => setClassFilter('all')}
              >
                {lang === 'hi' ? 'सभी कक्षाएं (36)' : 'All Classes (36)'}
              </button>
              <button
                type="button"
                className={`nb-QuickChip ${classFilter === 10 ? 'is-active' : ''}`}
                aria-pressed={classFilter === 10}
                onClick={() => setClassFilter(10)}
              >
                {lang === 'hi' ? 'कक्षा 10 बोर्ड (29)' : 'Class 10 Board (29)'}
              </button>
              <button
                type="button"
                className={`nb-QuickChip ${classFilter === 9 ? 'is-active' : ''}`}
                aria-pressed={classFilter === 9}
                onClick={() => setClassFilter(9)}
              >
                {lang === 'hi' ? 'कक्षा 9 फाउंडेशन (7)' : 'Class 9 Foundation (7)'}
              </button>

              <select
                aria-label={lang === 'hi' ? 'मानसिक-मॉडल थ्रेड चुनें' : 'Filter by mental-model thread'}
                value={threadFilter}
                onChange={(e) => setThreadFilter(e.target.value as 'all' | ThreadId)}
                style={{
                  padding: '0.35rem 0.65rem',
                  borderRadius: '6px',
                  border: '1.5px solid #b8a585',
                  background: '#fffdf7',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: '#1e293b',
                }}
              >
                <option value="all">
                  {lang === 'hi' ? 'सभी 5 मानसिक-मॉडल थ्रेड्स' : 'All 5 Mental-Model Threads'}
                </option>
                {THREADS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title[lang]}
                  </option>
                ))}
              </select>

              <button
                type="button"
                className={`nb-QuickChip ${flaggedOnly ? 'is-active' : ''}`}
                aria-pressed={flaggedOnly}
                onClick={() => setFlaggedOnly((v) => !v)}
              >
                {lang === 'hi'
                  ? `★ चिह्नित अध्याय (${flaggedIds.length})`
                  : `★ Flagged for Review (${flaggedIds.length})`}
              </button>

              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  lang === 'hi'
                    ? 'सूत्र, अध्याय या विषय खोजें...'
                    : 'Search formula, chapter, or topic...'
                }
                aria-label="Search revision workbook"
                style={{
                  padding: '0.35rem 0.7rem',
                  borderRadius: '6px',
                  border: '1.5px solid #b8a585',
                  background: '#ffffff',
                  fontSize: '0.82rem',
                  minWidth: '210px',
                }}
              />
            </div>

            {/* Dual Score Badges (Strictly separating Auto-Graded from Self-Assessed) */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', alignItems: 'center' }}>
              <span className="nb-progress-summary" data-testid="revision-autograded-score">
                {lang === 'hi'
                  ? `स्वतः मूल्यांकित (Auto-Graded): ${scoreSummary.totalAutoGradedCorrect}/${scoreSummary.totalAutoGradedPossible} (संख्यात्मक ${scoreSummary.autoGradedNumericalCorrect}/${scoreSummary.questionCount} · दावा ${scoreSummary.autoGradedClaimCorrect}/${scoreSummary.questionCount})`
                  : `Auto-Graded: ${scoreSummary.totalAutoGradedCorrect}/${scoreSummary.totalAutoGradedPossible} (Numericals ${scoreSummary.autoGradedNumericalCorrect}/${scoreSummary.questionCount} · Claims ${scoreSummary.autoGradedClaimCorrect}/${scoreSummary.questionCount})`}
              </span>
              <span
                className="nb-progress-summary"
                data-testid="revision-selfassessed-score"
                style={{ background: '#eff6ff', borderColor: '#93c5fd', color: '#1e3a8a' }}
              >
                {lang === 'hi'
                  ? `स्व-मूल्यांकित रूब्रिक (Self-Assessed): ${scoreSummary.selfAssessedRubricChecked}/${scoreSummary.selfAssessedRubricPossible}`
                  : `Self-Assessed Rubric: ${scoreSummary.selfAssessedRubricChecked}/${scoreSummary.selfAssessedRubricPossible} (Not Auto-Graded)`}
              </span>
            </div>
          </div>

          {/* Mistake Tracker Alert when any auto-graded question is missed */}
          {scoreSummary.weakConceptIds.length > 0 && (
            <div
              className="nb-hook-box no-print"
              style={{ background: '#fef2f2', borderColor: '#fca5a5', padding: '0.75rem 1rem' }}
            >
              <span className="nb-hook-label" style={{ color: '#991b1b' }}>
                {lang === 'hi'
                  ? `⚠️ त्रुटि ट्रैकर (Mistake Tracker): ${scoreSummary.weakConceptIds.length} अध्यायों में पुनः अभ्यास की आवश्यकता`
                  : `⚠️ Mistake Tracker: ${scoreSummary.weakConceptIds.length} concept(s) missed on auto-graded check — click to review on the apparatus`}
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.4rem' }}>
                {scoreSummary.weakConceptIds.map((id) => {
                  const entry = allEntries.find((e) => e.conceptId === id)
                  if (!entry) return null
                  return (
                    <button
                      key={id}
                      type="button"
                      className="nb-QuickChip"
                      onClick={() => navigateToPath(`/learn/${id}`)}
                    >
                      {entry.title[lang]} →
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </NotebookHeader>

      {/* Empty Filter State */}
      {filteredEntries.length === 0 && (
        <section className="nb-sheet nb-sheet--ruled" style={{ marginTop: '1rem' }}>
          <p className="nb-stage-kicker">
            {lang === 'hi' ? 'कोई अध्याय नहीं मिला' : 'No Matching Chapters'}
          </p>
          <p style={{ margin: '0.5rem 0' }}>
            {lang === 'hi'
              ? 'कृपया फ़िल्टर या खोज शब्द बदलें।'
              : 'No chapters match the current filter. Clear the search query or uncheck Flagged for Review.'}
          </p>
          <button
            type="button"
            className="nb-QuickChip is-active"
            onClick={() => {
              setClassFilter('all')
              setThreadFilter('all')
              setSearchQuery('')
              setFlaggedOnly(false)
            }}
          >
            {lang === 'hi' ? 'सभी 28 अध्याय दिखाएं' : 'Show All 28 Chapters'}
          </button>
        </section>
      )}

      {/* MODE 1: BOARD EXAM SIMULATOR */}
      {mode === 'exam' && filteredEntries.length > 0 && (
        <div style={{ display: 'grid', gap: '1.25rem', marginTop: '0.5rem' }}>
          {filteredEntries.map((entry, idx) => (
            <BoardExamQuestionCard
              key={entry.conceptId}
              index={idx + 1}
              entry={entry}
              lang={lang}
              isFlagged={flaggedSet.has(entry.conceptId)}
              onToggleFlag={() => toggleFlagged(entry.conceptId)}
              response={responses[entry.conceptId] ?? {}}
              onUpdateResponse={(updater) => updateResponse(entry.conceptId, updater)}
            />
          ))}
        </div>
      )}

      {/* MODE 2: 28-LAB MISTAKE-TRAP & 3-SECOND CHECK DECK */}
      {mode === 'traps' && filteredEntries.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))',
            gap: '1.15rem',
            marginTop: '0.5rem',
          }}
        >
          {filteredEntries.map((entry, idx) => {
            const isFlagged = flaggedSet.has(entry.conceptId)
            return (
              <article
                key={entry.conceptId}
                className="nb-sheet nb-sheet--ruled nb-revision-card"
                style={{ display: 'grid', gap: '0.75rem', alignContent: 'start' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span className="nb-stage-kicker">
                    #{idx + 1} · CLASS {entry.classLevel} · {entry.chapterRef}
                  </span>
                  <div className="no-print" style={{ display: 'flex', gap: '0.35rem' }}>
                    <button
                      type="button"
                      className={`nb-QuickChip ${isFlagged ? 'is-active' : ''}`}
                      onClick={() => toggleFlagged(entry.conceptId)}
                    >
                      {isFlagged
                        ? lang === 'hi'
                          ? '★ चिह्नित'
                          : '★ Flagged'
                        : lang === 'hi'
                          ? '☆ चिह्नित करें'
                          : '☆ Flag Trap'}
                    </button>
                    <button
                      type="button"
                      className="nb-QuickChip"
                      onClick={() => navigateToPath(`/learn/${entry.conceptId}`)}
                    >
                      {lang === 'hi' ? 'प्रयोगशाला खोलें →' : 'Open Lab →'}
                    </button>
                  </div>
                </div>

                <h2 className="nb-stage-heading" style={{ fontSize: '1.15rem', margin: 0 }}>
                  {entry.contrastTrap.trapTitle[lang]}
                </h2>

                <div className="nb-math-block" style={{ margin: 0 }}>
                  {entry.governingFormula}
                </div>

                <div className="nb-trap-card">
                  <div className="nb-trap-kicker">
                    {lang === 'hi'
                      ? '✗ सामान्य परीक्षा भूल (Common Student Misconception)'
                      : '✗ Common Student Misconception'}
                  </div>
                  <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: 1.5 }}>
                    {entry.contrastTrap.commonMistake[lang]}
                  </p>
                </div>

                <div className="nb-reality-card">
                  <div className="nb-reality-kicker">
                    {lang === 'hi'
                      ? '✓ प्रमाणित भौतिक सत्य (Verified Physical Reality)'
                      : '✓ Verified Physical Reality'}
                  </div>
                  <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: 1.5 }}>
                    {entry.contrastTrap.correctPhysics[lang]}
                  </p>
                </div>

                <div className="nb-hook-box" style={{ margin: 0 }}>
                  <span className="nb-hook-label">
                    {lang === 'hi'
                      ? '🔑 3-सेकंड बोर्ड परीक्षा जाँच नियम'
                      : '🔑 3-Second Board-Exam Check Rule'}
                  </span>
                  <p className="nb-hook-text" style={{ fontWeight: 700 }}>
                    {entry.contrastTrap.checkRule[lang]}
                  </p>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {/* MODE 3: PRINTABLE FORMULA & WORKED-NUMERICAL COMPENDIUM */}
      {mode === 'compendium' && filteredEntries.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
            gap: '1.15rem',
            marginTop: '0.5rem',
          }}
        >
          {filteredEntries.map((entry, idx) => (
            <article
              key={entry.conceptId}
              className="nb-sheet nb-sheet--ruled nb-revision-card"
              style={{ display: 'grid', gap: '0.75rem', alignContent: 'start' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span className="nb-stage-kicker">
                  #{idx + 1} · CLASS {entry.classLevel} · {entry.chapterRef}
                </span>
                <button
                  type="button"
                  className="nb-QuickChip no-print"
                  onClick={() => navigateToPath(`/learn/${entry.conceptId}`)}
                >
                  {lang === 'hi' ? 'इंटरैक्टिव प्रयोग खोलें →' : 'Open Interactive Lab →'}
                </button>
              </div>

              <h2 className="nb-stage-heading" style={{ fontSize: '1.15rem', margin: 0 }}>
                {entry.title[lang]}
              </h2>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#334155', lineHeight: 1.5 }}>
                {entry.oneLine[lang]}
              </p>

              <div className="nb-insight-strip" style={{ margin: 0 }}>
                <div className="nb-insight-kicker">
                  {lang === 'hi' ? 'मुख्य सूत्र एवं SI मात्रक नियम' : 'Governing Law & SI Unit Rule'}
                </div>
                <div className="nb-insight-formula">{entry.governingFormula}</div>
                <div className="nb-insight-summary">
                  <strong>{lang === 'hi' ? 'मात्रक नियम:' : 'SI Unit Rule:'}</strong>{' '}
                  {entry.discoveryNotes.siUnitRule[lang]}
                </div>
              </div>

              <div className="nb-worked-card" style={{ margin: 0 }}>
                <div className="nb-worked-step">
                  <div className="nb-worked-step-label">
                    {entry.workedNumerical.title[lang]}
                  </div>
                  <p style={{ margin: '0.25rem 0', fontSize: '0.88rem', lineHeight: 1.45 }}>
                    {entry.workedNumerical.problem[lang]}
                  </p>
                </div>
                <div className="nb-worked-step">
                  <div className="nb-worked-step-label">
                    {lang === 'hi' ? 'सूत्र एवं मान प्रतिस्थापन' : 'Formula & Substitution'}
                  </div>
                  <div className="nb-math-block" style={{ fontSize: '0.85rem' }}>
                    {entry.workedNumerical.formula}
                    {'\n'}
                    {entry.workedNumerical.substitution}
                  </div>
                </div>
                <div
                  className="nb-worked-step"
                  style={{ background: '#ecfdf5', padding: '0.55rem 0.75rem', borderRadius: '6px' }}
                >
                  <strong style={{ color: '#065f46', fontSize: '0.9rem' }}>
                    {entry.workedNumerical.answer[lang]}
                  </strong>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#92400e', fontWeight: 700 }}>
                  ⚠️ {entry.workedNumerical.unitTrapNote[lang]}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}

interface BoardExamQuestionCardProps {
  index: number
  entry: RevisionEntry
  lang: 'en' | 'hi'
  isFlagged: boolean
  onToggleFlag: () => void
  response: StudentQuestionResponse
  onUpdateResponse: (updater: (cur: StudentQuestionResponse) => StudentQuestionResponse) => void
}

function BoardExamQuestionCard({
  index,
  entry,
  lang,
  isFlagged,
  onToggleFlag,
  response,
  onUpdateResponse,
}: BoardExamQuestionCardProps) {
  const numChoice = response.numericalChoice ?? null
  const numLocked = Boolean(response.numericalLocked)
  const numIsCorrect = numLocked && numChoice === entry.boardNumerical.correctIndex

  const claimChoice = response.claimChoice ?? null
  const claimLocked = Boolean(response.claimLocked)
  const claimIsCorrect = claimLocked && claimChoice === entry.hotsTask.correctClaimIndex

  const rubricChecked = response.rubricChecked ?? [false, false, false]
  const rubricCount = rubricChecked.filter(Boolean).length

  return (
    <section
      className="nb-spread nb-revision-card"
      aria-label={`Question ${index}: ${entry.title[lang]}`}
    >
      {/* Left Sheet: Section A Auto-Graded Board Numerical */}
      <div className="nb-sheet nb-sheet--apparatus" style={{ position: 'static' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span className="nb-stage-kicker">
            Q{index}A · AUTO-GRADED BOARD NUMERICAL · CLASS {entry.classLevel} ({entry.chapterRef})
          </span>
          <div className="no-print" style={{ display: 'flex', gap: '0.35rem' }}>
            <button
              type="button"
              className={`nb-QuickChip ${isFlagged ? 'is-active' : ''}`}
              onClick={onToggleFlag}
            >
              {isFlagged
                ? lang === 'hi'
                  ? '★ चिह्नित'
                  : '★ Flagged'
                : lang === 'hi'
                  ? '☆ चिह्नित करें'
                  : '☆ Flag'}
            </button>
            <button
              type="button"
              className="nb-QuickChip"
              onClick={() => navigateToPath(`/learn/${entry.conceptId}`)}
            >
              {lang === 'hi' ? 'प्रयोगशाला खोलें →' : 'Open Lab →'}
            </button>
          </div>
        </div>

        <h2 className="nb-stage-heading" style={{ fontSize: '1.15rem', margin: '0.35rem 0' }}>
          {entry.boardNumerical.title[lang]}
        </h2>

        <div className="nb-math-block" style={{ marginBottom: '0.65rem' }}>
          {entry.governingFormula}
        </div>

        <p style={{ fontWeight: 700, fontSize: '0.94rem', lineHeight: 1.5, margin: '0 0 0.65rem' }}>
          {entry.boardNumerical.prompt[lang]}
        </p>

        <div style={{ display: 'grid', gap: '0.45rem' }}>
          {entry.boardNumerical.options.map((opt, oIdx) => {
            const selected = numChoice === oIdx
            return (
              <label
                key={oIdx}
                className={`cil-option ${selected ? 'cil-option--selected' : ''} ${
                  numLocked && oIdx === entry.boardNumerical.correctIndex
                    ? 'cil-option--correct'
                    : ''
                } ${
                  numLocked && selected && oIdx !== entry.boardNumerical.correctIndex
                    ? 'cil-option--wrong'
                    : ''
                }`}
              >
                <input
                  type="radio"
                  name={`rev-num-${entry.conceptId}`}
                  checked={selected}
                  disabled={numLocked}
                  onChange={() =>
                    onUpdateResponse((cur) => ({ ...cur, numericalChoice: oIdx }))
                  }
                />
                <span>{opt[lang]}</span>
              </label>
            )
          })}
        </div>

        {!numLocked && (
          <button
            type="button"
            className="cil-btn cil-btn--primary no-print"
            style={{ marginTop: '0.65rem' }}
            disabled={numChoice === null}
            onClick={() =>
              onUpdateResponse((cur) => ({ ...cur, numericalLocked: true }))
            }
          >
            {lang === 'hi'
              ? 'संख्यात्मक उत्तर जाँचें (Auto-Grade Numerical)'
              : 'Check Numerical Answer (Auto-Graded)'}
          </button>
        )}

        {numLocked && (
          <div
            className={`cil-feedback ${
              numIsCorrect ? 'cil-feedback--correct' : 'cil-feedback--wrong'
            }`}
            style={{ marginTop: '0.75rem' }}
          >
            <strong>
              {numIsCorrect
                ? lang === 'hi'
                  ? '✓ सही संख्यात्मक हल! (1/1 Auto-Graded)'
                  : '✓ Correct Board Numerical! (1/1 Auto-Graded)'
                : lang === 'hi'
                  ? '✗ चरणबद्ध हल एवं मात्रक नियम देखें:'
                  : '✗ Review the step-by-step solution & unit rule:'}
            </strong>
            <div style={{ display: 'grid', gap: '0.35rem', marginTop: '0.45rem', fontSize: '0.86rem' }}>
              {entry.boardNumerical.steps.map((st, sIdx) => (
                <div key={sIdx}>
                  <strong>{st.label[lang]}:</strong> {st.content[lang]}
                </div>
              ))}
              <div style={{ fontWeight: 800, color: '#065f46' }}>
                {entry.boardNumerical.finalAnswer[lang]}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Sheet: Section B HOTS Structured Claim (Auto-Graded) + Written Explanation (Self-Assessed 3-Point Rubric) */}
      <div className="nb-sheet nb-sheet--ruled">
        <span className="nb-stage-kicker">
          Q{index}B · HOTS SCIENTIFIC CLAIM (AUTO-GRADED) + WRITTEN RUBRIC (SELF-ASSESSED)
        </span>
        <h3 className="nb-stage-heading" style={{ fontSize: '1.1rem', margin: 0 }}>
          {entry.hotsTask.title[lang]}
        </h3>

        <p style={{ fontWeight: 700, fontSize: '0.92rem', lineHeight: 1.5, margin: 0 }}>
          {entry.hotsTask.prompt[lang]}
        </p>

        {/* Part A: Deterministic Structured Scientific Claim */}
        <div className="nb-protocol-box" style={{ margin: 0 }}>
          <div className="nb-worked-step-label">
            {lang === 'hi'
              ? 'भाग A: वैज्ञानिक दावा चुनें (Auto-Graded · 1 अंक)'
              : 'Part A: Select the Scientific Claim (Auto-Graded · 1 Mark)'}
          </div>
          <div style={{ display: 'grid', gap: '0.45rem', marginTop: '0.45rem' }}>
            {entry.hotsTask.claimOptions.map((opt, cIdx) => {
              const selected = claimChoice === cIdx
              return (
                <label
                  key={cIdx}
                  className={`cil-option ${selected ? 'cil-option--selected' : ''} ${
                    claimLocked && cIdx === entry.hotsTask.correctClaimIndex
                      ? 'cil-option--correct'
                      : ''
                  } ${
                    claimLocked && selected && cIdx !== entry.hotsTask.correctClaimIndex
                      ? 'cil-option--wrong'
                      : ''
                  }`}
                >
                  <input
                    type="radio"
                    name={`rev-claim-${entry.conceptId}`}
                    checked={selected}
                    disabled={claimLocked}
                    onChange={() =>
                      onUpdateResponse((cur) => ({ ...cur, claimChoice: cIdx }))
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
                onUpdateResponse((cur) => ({ ...cur, claimLocked: true }))
              }
            >
              {lang === 'hi'
                ? 'वैज्ञानिक दावा जाँचें (Auto-Grade Claim)'
                : 'Verify Scientific Claim (Auto-Graded)'}
            </button>
          )}

          {claimLocked && (
            <div
              className={`cil-feedback ${
                claimIsCorrect ? 'cil-feedback--correct' : 'cil-feedback--wrong'
              }`}
              style={{ marginTop: '0.65rem' }}
            >
              <strong>
                {claimIsCorrect
                  ? lang === 'hi'
                    ? '✓ वैज्ञानिक दावा बिल्कुल सही है! (1/1 Auto-Graded)'
                    : '✓ Correct Scientific Claim! (1/1 Auto-Graded)'
                  : lang === 'hi'
                    ? '✗ सही वैज्ञानिक तर्क देखें:'
                    : '✗ Review the physical justification:'}
              </strong>
              <p style={{ margin: '0.35rem 0 0', fontSize: '0.86rem' }}>
                {entry.hotsTask.claimExplanation[lang]}
              </p>
            </div>
          )}
        </div>

        {/* Part B: Transparent Self-Assessed Written Explanation & 3-Point Rubric */}
        <div className="nb-rubric-box" style={{ margin: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
            <span className="nb-worked-step-label">
              {lang === 'hi'
                ? 'भाग B: लिखित स्पष्टीकरण एवं 3-बिंदु स्व-मूल्यांकन रूब्रिक'
                : 'Part B: Written Reasoning & 3-Point Self-Check Rubric'}
            </span>
            <span
              style={{
                fontSize: '0.76rem',
                fontWeight: 800,
                padding: '0.18rem 0.5rem',
                borderRadius: '999px',
                background: '#eff6ff',
                color: '#1e3a8a',
                border: '1px solid #93c5fd',
              }}
            >
              {lang === 'hi'
                ? `स्व-मूल्यांकित: ${rubricCount}/3 (स्वतः ग्रेड नहीं किया जाता)`
                : `Self-Assessed: ${rubricCount}/3 (Not Automatically Graded)`}
            </span>
          </div>

          <textarea
            className="nb-textarea"
            rows={2}
            value={response.writtenExplanation ?? ''}
            onChange={(e) =>
              onUpdateResponse((cur) => ({
                ...cur,
                writtenExplanation: e.target.value,
              }))
            }
            placeholder={
              lang === 'hi'
                ? 'अपना 2–3 पंक्तियों का बोर्ड-परीक्षा उत्तर यहाँ लिखें और नीचे दिए गए 3-बिंदु रूब्रिक से स्वयं मिलान करें...'
                : 'Draft your 2–3 sentence board explanation here, then compare against the 3-point self-check rubric below...'
            }
          />

          <p style={{ margin: '0.3rem 0', fontSize: '0.78rem', color: '#475569' }}>
            {lang === 'hi'
              ? 'खुलासा: यह लिखित उत्तर स्वतः मूल्यांकित नहीं होता। नीचे दिए गए रूब्रिक बिंदुओं से अपने उत्तर की तुलना करें:'
              : 'Disclosure: Free-text explanations are not auto-graded. Compare your draft against the 3 rubric checkpoints below and revise freely:'}
          </p>

          <div style={{ display: 'grid', gap: '0.35rem' }}>
            {entry.hotsTask.rubricPoints.map((pt, rIdx) => (
              <label key={rIdx} className="nb-rubric-item">
                <input
                  type="checkbox"
                  checked={Boolean(rubricChecked[rIdx])}
                  onChange={(e) => {
                    const next = [...rubricChecked]
                    next[rIdx] = e.target.checked
                    onUpdateResponse((cur) => ({ ...cur, rubricChecked: next }))
                  }}
                />
                <span>{pt[lang]}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
