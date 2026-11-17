import { useState, type ReactNode } from 'react'
import type { ConceptCardContent } from '../concepts/rateVsTotal/content'
import type { ConceptRecord } from '../concepts/registry'
import { ExamQuestion } from '../kit/ExamQuestion'
import type { Lang } from '../kit/i18n'
import { PredictCard } from '../kit/PredictCard'
import { ShareButton } from '../kit/ShareButton'
import { LanguageToggle, ProjectorToggle } from '../kit/Toggles'
import { NotebookHeader, NotebookSpread } from './NotebookSpread'
import {
  STORY_NOTEBOOK_STAGES,
  type StoryStageId,
  type StoryStageSupplement,
} from './storyCurricula'
import './notebook.css'

export interface StoryNotebookEngineProps {
  concept: ConceptRecord
  threadTitle: string
  content: ConceptCardContent
  supplement: StoryStageSupplement
  lang: Lang
  isCompleted: boolean
  onMarkCompleted: () => void
  onBackToShelf: () => void
  nextConcept?: ConceptRecord | null
  onNavigateConcept?: (nextId: string) => void
  apparatusSlot: ReactNode
}

export function StoryNotebookEngine({
  concept,
  threadTitle,
  content,
  supplement,
  lang,
  isCompleted,
  onMarkCompleted,
  onBackToShelf,
  nextConcept,
  onNavigateConcept,
  apparatusSlot,
}: StoryNotebookEngineProps) {
  const [activeStage, setActiveStage] = useState<StoryStageId>('predict')
  const [predictionCommitted, setPredictionCommitted] = useState<boolean>(isCompleted)
  const [obsChoice, setObsChoice] = useState<number | null>(null)
  const [obsSubmitted, setObsSubmitted] = useState<boolean>(false)

  // Stage F Practice State
  const [activePracticeTab, setActivePracticeTab] = useState<'q1' | 'q2'>('q1')
  const [hotsClaimChoice, setHotsClaimChoice] = useState<number | null>(null)
  const [hotsClaimChecked, setHotsClaimChecked] = useState<boolean>(false)
  const [writtenExplanation, setWrittenExplanation] = useState<string>('')
  const [rubricChecks, setRubricChecks] = useState<boolean[]>([false, false, false])

  const [srAnnouncement, setSrAnnouncement] = useState<string>('')

  const currentStageIndex = STORY_NOTEBOOK_STAGES.findIndex((s) => s.id === activeStage)

  const obsCorrect =
    obsSubmitted && obsChoice === supplement.experimentProtocol.observationCheck.correctIndex
  const hotsClaimCorrect =
    hotsClaimChecked && hotsClaimChoice === supplement.hotsReasoningTask.correctClaimIndex

  const autoGradedCount =
    (predictionCommitted ? 1 : 0) + (obsCorrect ? 1 : 0) + (hotsClaimCorrect ? 1 : 0)

  function handleSelectStage(nextStage: StoryStageId) {
    if (!predictionCommitted && nextStage !== 'predict') {
      setSrAnnouncement(
        lang === 'hi'
          ? 'अगले चरण खोलने से पहले चरण A में अपना पूर्वानुमान लॉक करें।'
          : 'Commit your qualitative prediction in Stage A first to unlock the investigation stages.'
      )
      return
    }
    setActiveStage(nextStage)
  }

  function handleRestartLesson() {
    setActiveStage('predict')
    setPredictionCommitted(false)
    setObsChoice(null)
    setObsSubmitted(false)
    setActivePracticeTab('q1')
    setHotsClaimChoice(null)
    setHotsClaimChecked(false)
    setWrittenExplanation('')
    setRubricChecks([false, false, false])
    setSrAnnouncement('Lesson restarted from Stage 1: Predict.')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="sr-only" aria-live="polite">
        {srAnnouncement}
      </div>

      <NotebookHeader
        eyebrow={`${threadTitle} · ${supplement.ncertSection}`}
        title={supplement.openingQuestion[lang]}
        subtitle={`${concept.title[lang]} — ${concept.oneLine[lang]}`}
        chapterBadge={concept.boardMapping[0]?.chapterRef}
        statusBadge={supplement.ncertSection}
        isCompleted={isCompleted}
        completedLabel={lang === 'hi' ? '✓ पूर्ण' : '✓ Completed'}
        onBack={onBackToShelf}
        backLabel={lang === 'hi' ? '← सभी नोटबुक पाठ' : '← Notebook Shelf'}
        utilities={
          <>
            <LanguageToggle />
            <ProjectorToggle />
            <button
              type="button"
              className="nb-back-btn"
              onClick={handleRestartLesson}
              title="Restart this 6-stage notebook from Stage 1"
            >
              ↺ {lang === 'hi' ? 'पुनः प्रारंभ करें' : 'Restart Lesson'}
            </button>
          </>
        }
      >
        {/* Connected 6-Stage Progression Stepper */}
        <nav className="nb-stage-stepper" aria-label="Lesson progression stages">
          {STORY_NOTEBOOK_STAGES.map((stage, idx) => {
            const isCurrent = stage.id === activeStage
            const isVisited =
              idx < currentStageIndex || (stage.id === 'predict' && predictionCommitted)
            const isLocked = !predictionCommitted && stage.id !== 'predict'
            return (
              <button
                key={stage.id}
                type="button"
                className={`nb-stage-tab ${isCurrent ? 'is-active' : ''} ${
                  isVisited ? 'is-visited' : ''
                } ${isLocked ? 'is-locked' : ''}`}
                aria-current={isCurrent ? 'step' : undefined}
                aria-disabled={isLocked ? true : undefined}
                title={
                  isLocked
                    ? lang === 'hi'
                      ? 'पहले चरण 1 में पूर्वानुमान लॉक करें'
                      : 'Commit to a prediction in Stage 1 first'
                    : stage.title[lang]
                }
                onClick={() => handleSelectStage(stage.id)}
              >
                <span className="nb-stage-dot" aria-hidden="true">
                  {isVisited && !isCurrent ? '✓' : stage.stepNumber}
                </span>
                <span>{stage.shortLabel[lang]}</span>
              </button>
            )
          })}
          <span className="nb-progress-summary" aria-label="Auto-graded checkpoints completed">
            {lang === 'hi' ? `स्व-जांच: ${autoGradedCount}/3` : `Auto-Graded: ${autoGradedCount}/3`}
          </span>
        </nav>
      </NotebookHeader>

      <NotebookSpread
        apparatus={
          <>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.5rem',
              }}
            >
              <span className="nb-chapter-pill">
                {lang === 'hi'
                  ? 'प्रत्यक्ष उपकरण बेंच (Interactive Apparatus)'
                  : 'Interactive Apparatus & Simulation Bench'}
              </span>
              {concept.deepDiveRoute && (
                <a
                  href={concept.deepDiveRoute}
                  className="nb-back-btn"
                  style={{ textDecoration: 'none' }}
                >
                  {lang === 'hi' ? 'पूर्ण अध्याय प्रयोगशाला →' : 'Open Chapter Deep-Dive Lab →'}
                </a>
              )}
            </div>

            {!predictionCommitted && (
              <div
                style={{
                  background: '#fef9c3',
                  border: '1px solid #eab308',
                  borderRadius: '0.55rem',
                  padding: '0.6rem 0.85rem',
                  fontFamily: 'var(--nb-sans)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: '#854d0e',
                }}
              >
                {lang === 'hi'
                  ? '🔍 चरण 1 (पूर्वानुमान): पहले दाईं ओर अपना पूर्वानुमान लॉक करें, फिर सभी 6 प्रायोगिक चरण खुल जाएंगे।'
                  : '🔍 Stage 1 (Predict First): Lock in your qualitative prediction on the right to unlock all 6 investigation stages.'}
              </div>
            )}

            {apparatusSlot}

            {/* Core Scientific Formula Callout */}
            <div className="nb-insight-box">
              <div className="nb-insight-label">
                {lang === 'hi'
                  ? 'मुख्य वैज्ञानिक सिद्धांत (Core Insight)'
                  : 'Core Scientific Principle'}
              </div>
              <div className="nb-insight-formula">{content.insightFormula}</div>
              <div className="nb-insight-summary">
                <strong>{content.insightTerm[lang]}:</strong> {content.insightSummary[lang]}
              </div>
            </div>
          </>
        }
        fieldNotes={
          <>
            {/* STAGE 1: PREDICT */}
            {activeStage === 'predict' && (
              <>
                <div>
                  <p className="nb-stage-kicker">
                    {STORY_NOTEBOOK_STAGES[0].title[lang]}
                  </p>
                  <h2 className="nb-stage-heading">
                    {lang === 'hi' ? 'प्रयोग से पहले सोचें' : 'Form Your Hypothesis First'}
                  </h2>
                </div>

                <div className="nb-hook-box">
                  <span className="nb-hook-label">
                    {lang === 'hi'
                      ? 'रोज़मर्रा की पहेली (Field Observation Hook)'
                      : 'Field Observation Hook'}
                  </span>
                  <p className="nb-hook-text">{content.hook[lang]}</p>
                </div>

                <PredictCard
                  question={content.predictQuestion[lang]}
                  options={content.predictOptions.map((o) => o[lang])}
                  correctIndex={content.predictCorrectIndex}
                  explanation={content.predictExplanation[lang]}
                  lang={lang}
                  onLocked={() => {
                    setPredictionCommitted(true)
                    onMarkCompleted()
                    setSrAnnouncement('Prediction locked! Stages 2 through 6 are now unlocked.')
                  }}
                />

                {predictionCommitted && (
                  <button
                    type="button"
                    className="nb-next-stage-btn"
                    onClick={() => handleSelectStage('experiment')}
                  >
                    {lang === 'hi'
                      ? 'चरण 2 पर आगे बढ़ें: निर्देशित प्रयोग →'
                      : 'Continue to Stage 2: Experiment →'}
                  </button>
                )}
              </>
            )}

            {/* STAGE 2: EXPERIMENT */}
            {activeStage === 'experiment' && (
              <>
                <div>
                  <p className="nb-stage-kicker">
                    {STORY_NOTEBOOK_STAGES[1].title[lang]}
                  </p>
                  <h2 className="nb-stage-heading">
                    {lang === 'hi'
                      ? 'उपकरण चलाएं और मापें'
                      : 'Test Your Hypothesis on the Apparatus'}
                  </h2>
                </div>

                <div className="nb-protocol-box">
                  <strong style={{ fontSize: '0.86rem', fontFamily: 'var(--nb-sans)' }}>
                    {supplement.experimentProtocol.goal[lang]}
                  </strong>
                  <ul className="nb-protocol-list">
                    {supplement.experimentProtocol.steps.map((st, idx) => (
                      <li key={idx}>{st[lang]}</li>
                    ))}
                  </ul>
                </div>

                {/* Observation Check */}
                <div className="nb-worked-card">
                  <span className="nb-stage-kicker">
                    {lang === 'hi' ? 'प्रायोगिक अवलोकन जांच' : 'Apparatus Observation Check'}
                  </span>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: '0.94rem' }}>
                    {supplement.experimentProtocol.observationCheck.prompt[lang]}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {supplement.experimentProtocol.observationCheck.options.map((opt, idx) => {
                      const selected = obsChoice === idx
                      return (
                        <button
                          key={idx}
                          type="button"
                          className={`nb-chip-btn ${selected ? 'is-active' : ''}`}
                          style={{ textAlign: 'left', padding: '0.5rem 0.75rem' }}
                          onClick={() => {
                            setObsChoice(idx)
                            setObsSubmitted(true)
                          }}
                        >
                          {opt[lang]}
                        </button>
                      )
                    })}
                  </div>

                  {obsSubmitted && obsChoice !== null && (
                    <div className={obsCorrect ? 'nb-reality-card' : 'nb-trap-card'}>
                      <strong>
                        {obsCorrect
                          ? lang === 'hi'
                            ? '✓ सटीक अवलोकन!'
                            : '✓ Verified Observation!'
                          : lang === 'hi'
                            ? 'ℹ पुनः बाईं ओर के उपकरण पर ध्यान दें:'
                            : 'ℹ Check the apparatus readout again:'}
                      </strong>{' '}
                      {supplement.experimentProtocol.observationCheck.explanation[lang]}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  className="nb-next-stage-btn"
                  onClick={() => handleSelectStage('discover')}
                >
                  {lang === 'hi'
                    ? 'चरण 3 पर आगे बढ़ें: वैज्ञानिक नियम की खोज →'
                    : 'Continue to Stage 3: Discover →'}
                </button>
              </>
            )}

            {/* STAGE 3: DISCOVER */}
            {activeStage === 'discover' && (
              <>
                <div>
                  <p className="nb-stage-kicker">
                    {STORY_NOTEBOOK_STAGES[2].title[lang]}
                  </p>
                  <h2 className="nb-stage-heading">{content.insightTerm[lang]}</h2>
                </div>

                <div className="nb-insight-box">
                  <div className="nb-insight-label">
                    {lang === 'hi' ? 'गणितीय नियम (Mathematical Law)' : 'Governing Mathematical Law'}
                  </div>
                  <div className="nb-insight-formula">{content.insightFormula}</div>
                  <div className="nb-insight-summary">{content.insightSummary[lang]}</div>
                </div>

                <div className="nb-worked-card">
                  <div>
                    <span className="nb-stage-kicker">
                      {lang === 'hi' ? '1. भौतिक अर्थ' : '1. Physical Meaning'}
                    </span>
                    <p style={{ margin: '0.2rem 0 0', fontFamily: 'var(--nb-sans)', fontSize: '0.88rem', lineHeight: 1.48 }}>
                      {supplement.discoveryNotes.physicalMeaning[lang]}
                    </p>
                  </div>

                  <div>
                    <span className="nb-stage-kicker">
                      {lang === 'hi' ? '2. अनुपात एवं स्केलिंग नियम' : '2. Proportionality & Scaling Rule'}
                    </span>
                    <div className="nb-math-block" style={{ marginTop: '0.2rem' }}>
                      {supplement.discoveryNotes.scalingRule[lang]}
                    </div>
                  </div>

                  <div>
                    <span className="nb-stage-kicker">
                      {lang === 'hi' ? '3. एसआई इकाई नियम (SI Unit Rule)' : '3. SI Unit & Sign Discipline'}
                    </span>
                    <p style={{ margin: '0.2rem 0 0', fontFamily: 'var(--nb-sans)', fontSize: '0.88rem', lineHeight: 1.48 }}>
                      {supplement.discoveryNotes.siUnitRule[lang]}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="nb-next-stage-btn"
                  onClick={() => handleSelectStage('calculate')}
                >
                  {lang === 'hi'
                    ? 'चरण 4 पर आगे बढ़ें: संख्यात्मक हल →'
                    : 'Continue to Stage 4: Calculate →'}
                </button>
              </>
            )}

            {/* STAGE 4: CALCULATE */}
            {activeStage === 'calculate' && (
              <>
                <div>
                  <p className="nb-stage-kicker">
                    {STORY_NOTEBOOK_STAGES[3].title[lang]}
                  </p>
                  <h2 className="nb-stage-heading">
                    {supplement.workedNumerical.title[lang]}
                  </h2>
                </div>

                <div className="nb-worked-card">
                  <p style={{ margin: 0, fontSize: '0.94rem', lineHeight: 1.5, fontWeight: 600 }}>
                    {supplement.workedNumerical.problem[lang]}
                  </p>

                  <div className="nb-protocol-box">
                    <span className="nb-stage-kicker">
                      {lang === 'hi' ? 'चरण 1: चिह्न व इकाई सहित दिया गया डेटा' : 'Step 1: Given Data (with SI Units & Signs)'}
                    </span>
                    <ul className="nb-protocol-list">
                      {supplement.workedNumerical.given.map((g, idx) => (
                        <li key={idx}>• {g[lang]}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="nb-stage-kicker">
                      {lang === 'hi' ? 'चरण 2: सूत्र (Formula)' : 'Step 2: Formula'}
                    </span>
                    <div className="nb-math-block" style={{ marginTop: '0.2rem' }}>
                      {supplement.workedNumerical.formula}
                    </div>
                  </div>

                  <div>
                    <span className="nb-stage-kicker">
                      {lang === 'hi' ? 'चरण 3: मान प्रतिस्थापन (Substitution)' : 'Step 3: Substitution & Calculation'}
                    </span>
                    <div className="nb-math-block" style={{ marginTop: '0.2rem' }}>
                      {supplement.workedNumerical.substitution}
                    </div>
                  </div>

                  <div className="nb-reality-card">
                    <strong>{lang === 'hi' ? 'अंतिम उत्तर:' : 'Final Answer:'}</strong>{' '}
                    {supplement.workedNumerical.answer[lang]}
                  </div>

                  <div className="nb-hook-box">
                    <span className="nb-hook-label">
                      ⚠️ {lang === 'hi' ? 'इकाई और चिह्न सावधानी' : 'Board-Exam Unit & Sign Alert'}
                    </span>
                    <p className="nb-hook-text" style={{ fontSize: '0.86rem' }}>
                      {supplement.workedNumerical.unitTrapNote[lang]}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="nb-next-stage-btn"
                  onClick={() => handleSelectStage('contrast')}
                >
                  {lang === 'hi'
                    ? 'चरण 5 पर आगे बढ़ें: परीक्षा का जाल बनाम वास्तविकता →'
                    : 'Continue to Stage 5: Contrast →'}
                </button>
              </>
            )}

            {/* STAGE 5: CONTRAST */}
            {activeStage === 'contrast' && (
              <>
                <div>
                  <p className="nb-stage-kicker">
                    {STORY_NOTEBOOK_STAGES[4].title[lang]}
                  </p>
                  <h2 className="nb-stage-heading">
                    {supplement.contrastTrap.trapTitle[lang]}
                  </h2>
                </div>

                <div className="nb-contrast-grid">
                  <div className="nb-trap-card">
                    <div style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.74rem', marginBottom: '0.25rem' }}>
                      ✗ {lang === 'hi' ? 'आम परीक्षा भूल (Common Exam Trap)' : 'Common Student Misconception'}
                    </div>
                    {supplement.contrastTrap.commonMistake[lang]}
                  </div>

                  <div className="nb-reality-card">
                    <div style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.74rem', marginBottom: '0.25rem' }}>
                      ✓ {lang === 'hi' ? 'सही वैज्ञानिक सिद्धांत (Verified Physics)' : 'Verified Physical Reality'}
                    </div>
                    {supplement.contrastTrap.correctPhysics[lang]}
                  </div>
                </div>

                <div className="nb-protocol-box">
                  <span className="nb-stage-kicker">
                    🔑 {lang === 'hi' ? '3-सेकंड परीक्षा जांच नियम' : '3-Second Board-Exam Check Rule'}
                  </span>
                  <p style={{ margin: 0, fontFamily: 'var(--nb-sans)', fontSize: '0.88rem', fontWeight: 700 }}>
                    {supplement.contrastTrap.checkRule[lang]}
                  </p>
                </div>

                <button
                  type="button"
                  className="nb-next-stage-btn"
                  onClick={() => handleSelectStage('apply')}
                >
                  {lang === 'hi'
                    ? 'चरण 6 पर आगे बढ़ें: बोर्ड परीक्षा अभ्यास →'
                    : 'Continue to Stage 6: Apply →'}
                </button>
              </>
            )}

            {/* STAGE 6: APPLY */}
            {activeStage === 'apply' && (
              <>
                <div>
                  <p className="nb-stage-kicker">
                    {STORY_NOTEBOOK_STAGES[5].title[lang]}
                  </p>
                  <h2 className="nb-stage-heading">
                    {lang === 'hi'
                      ? 'बोर्ड परीक्षा अभ्यास और स्व-मूल्यांकन'
                      : 'Board-Exam Application & Self-Check'}
                  </h2>
                </div>

                {/* Practice Question Tabs */}
                <div className="nb-device-chips" role="tablist" aria-label="Practice questions">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activePracticeTab === 'q1'}
                    className={`nb-chip-btn ${activePracticeTab === 'q1' ? 'is-active' : ''}`}
                    onClick={() => setActivePracticeTab('q1')}
                  >
                    {lang === 'hi'
                      ? 'प्रश्न 1: बोर्ड संख्यात्मक प्रश्न (Auto-Graded)'
                      : 'Q1: Board Numerical (Auto-Graded)'}
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activePracticeTab === 'q2'}
                    className={`nb-chip-btn ${activePracticeTab === 'q2' ? 'is-active' : ''}`}
                    onClick={() => setActivePracticeTab('q2')}
                  >
                    {lang === 'hi'
                      ? 'प्रश्न 2: उच्च स्तरीय तर्क एवं रूब्रिक (HOTS + Rubric)'
                      : 'Q2: HOTS Claim + Self-Check Rubric'}
                  </button>
                </div>

                {activePracticeTab === 'q1' ? (
                  <section>
                    {content.examQuestions.map((q, qIdx) => (
                      <ExamQuestion
                        key={qIdx}
                        title={q.title[lang]}
                        prompt={q.prompt[lang]}
                        options={q.options.map((o) => o[lang])}
                        correctIndex={q.correctIndex}
                        hint={q.hint[lang]}
                        solutionSteps={q.steps.map((s) => ({
                          label: s.label[lang],
                          content: s.content[lang],
                        }))}
                        finalAnswer={q.finalAnswer[lang]}
                        lang={lang}
                      />
                    ))}
                  </section>
                ) : (
                  <section className="nb-worked-card">
                    <span className="nb-stage-kicker">
                      {supplement.hotsReasoningTask.title[lang]}
                    </span>
                    <p style={{ margin: 0, fontSize: '0.94rem', fontWeight: 700, lineHeight: 1.48 }}>
                      {supplement.hotsReasoningTask.prompt[lang]}
                    </p>

                    {/* Part A: Auto-Graded Structured Scientific Claim */}
                    <div className="nb-protocol-box">
                      <span className="nb-stage-kicker">
                        {lang === 'hi'
                          ? 'भाग A — वैज्ञानिक दावा चुनें (Auto-Graded)'
                          : 'Part A — Select the Scientific Claim (Auto-Graded)'}
                      </span>
                      {supplement.hotsReasoningTask.claimOptions.map((opt, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className={`nb-chip-btn ${hotsClaimChoice === idx ? 'is-active' : ''}`}
                          style={{ textAlign: 'left', padding: '0.5rem 0.75rem' }}
                          onClick={() => {
                            setHotsClaimChoice(idx)
                            setHotsClaimChecked(true)
                          }}
                        >
                          {opt[lang]}
                        </button>
                      ))}

                      {hotsClaimChecked && hotsClaimChoice !== null && (
                        <div className={hotsClaimCorrect ? 'nb-reality-card' : 'nb-trap-card'}>
                          <strong>
                            {hotsClaimCorrect
                              ? lang === 'hi'
                                ? '✓ सही वैज्ञानिक दावा!'
                                : '✓ Correct Scientific Claim!'
                              : lang === 'hi'
                                ? 'ℹ वैज्ञानिक तर्क देखें:'
                                : 'ℹ Review the physical reasoning:'}
                          </strong>{' '}
                          {supplement.hotsReasoningTask.claimExplanation[lang]}
                        </div>
                      )}
                    </div>

                    {/* Part B: Transparent Self-Assessed Written Explanation + 3-Point Rubric */}
                    <div className="nb-rubric-box">
                      <span className="nb-stage-kicker">
                        {lang === 'hi'
                          ? 'भाग B — आपका लिखित स्पष्टीकरण (स्व-मूल्यांकित · ऑटो-ग्रेडेड नहीं)'
                          : 'Part B — Your Written Notebook Explanation (Self-Assessed · Not Auto-Graded)'}
                      </span>
                      <textarea
                        className="nb-textarea"
                        value={writtenExplanation}
                        onChange={(e) => setWrittenExplanation(e.target.value)}
                        placeholder={
                          lang === 'hi'
                            ? 'यहाँ अपने शब्दों में 2–3 वाक्यों का बोर्ड-परीक्षा उत्तर लिखें और नीचे दिए गए 3-बिंदु रूब्रिक से मिलान करें...'
                            : 'Write your 2–3 sentence board-exam explanation here, then compare it against the 3-point rubric below...'
                        }
                        aria-label="Your written notebook explanation"
                      />

                      <span className="nb-stage-kicker" style={{ marginTop: '0.25rem' }}>
                        {lang === 'hi'
                          ? `3-बिंदु स्व-जांच रूब्रिक (${supplement.ncertSection} पर आधारित)`
                          : `3-Point Self-Check Rubric (Based on ${supplement.ncertSection})`}
                      </span>
                      {supplement.hotsReasoningTask.rubricPoints.map((pt, idx) => (
                        <label
                          key={idx}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '0.45rem',
                            fontFamily: 'var(--nb-sans)',
                            fontSize: '0.83rem',
                            cursor: 'pointer',
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={rubricChecks[idx] || false}
                            onChange={(e) => {
                              const next = [...rubricChecks]
                              next[idx] = e.target.checked
                              setRubricChecks(next)
                            }}
                          />
                          <span>{pt[lang]}</span>
                        </label>
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}

            {/* Notebook Spine Footer: Share + Next Lesson Stepper */}
            <footer
              style={{
                paddingTop: '0.85rem',
                borderTop: '1px dashed var(--nb-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.65rem',
              }}
            >
              <ShareButton
                challengeText={content.hook[lang]}
                path={`/learn/${concept.id}`}
                lang={lang}
              />

              {nextConcept && onNavigateConcept && (
                <button
                  type="button"
                  className="kit-btn kit-btn-primary"
                  onClick={() => onNavigateConcept(nextConcept.id)}
                >
                  {lang === 'hi'
                    ? `अगला पाठ: ${nextConcept.title[lang]} →`
                    : `Next Notebook: ${nextConcept.title[lang]} →`}
                </button>
              )}
            </footer>
          </>
        }
      />
    </div>
  )
}
