import React, { useState } from 'react'
import './kit.css'

export interface BoardStep {
  label: string
  content: string
}

export interface ExamQuestionProps {
  title: string
  marks?: number
  prompt: string
  options: readonly string[]
  correctIndex: number
  hint?: string
  solutionSteps: readonly BoardStep[]
  finalAnswer: string
  lang: 'en' | 'hi'
}

export const ExamQuestion: React.FC<ExamQuestionProps> = ({
  title,
  marks = 2,
  prompt,
  options,
  correctIndex,
  hint,
  solutionSteps,
  finalAnswer,
  lang,
}) => {
  const [selected, setSelected] = useState<number | null>(null)
  const [checked, setChecked] = useState<boolean>(false)
  const [showHint, setShowHint] = useState<boolean>(false)
  const [showSolution, setShowSolution] = useState<boolean>(false)

  const isCorrect = selected === correctIndex

  return (
    <div className="kit-exam-card">
      <div className="kit-exam-header">
        <span className="kit-exam-tag">
          {lang === 'hi' ? 'बोर्ड परीक्षा प्रारूप' : 'Board Exam Pattern'}
        </span>
        <span className="kit-exam-marks">{marks} {lang === 'hi' ? 'अंक (Marks)' : 'Marks'}</span>
      </div>

      <h4 style={{ margin: '0 0 0.5rem', fontSize: '1rem', color: '#1e293b' }}>{title}</h4>
      <p style={{ margin: '0 0 1rem', fontSize: '0.95rem', color: '#334155', lineHeight: 1.5 }}>
        {prompt}
      </p>

      <div className="kit-predict-options">
        {options.map((opt, idx) => (
          <label
            key={idx}
            className={`kit-predict-opt ${selected === idx ? 'is-selected' : ''}`}
          >
            <input
              type="radio"
              name={`exam-${title}`}
              checked={selected === idx}
              onChange={() => {
                setSelected(idx)
                setChecked(false)
              }}
            />
            <span>{opt}</span>
          </label>
        ))}
      </div>

      <div className="kit-predict-actions">
        <button
          type="button"
          className="kit-btn kit-btn-primary"
          disabled={selected === null}
          onClick={() => setChecked(true)}
        >
          {lang === 'hi' ? 'उत्तर जाँचें (Check)' : 'Check Answer'}
        </button>
        {hint && (
          <button
            type="button"
            className="kit-btn kit-btn-secondary"
            onClick={() => setShowHint(!showHint)}
          >
            {showHint
              ? lang === 'hi'
                ? 'संकेत छिपाएँ'
                : 'Hide Hint'
              : lang === 'hi'
              ? 'संकेत (Hint)'
              : 'Hint'}
          </button>
        )}
        <button
          type="button"
          className="kit-btn kit-btn-secondary"
          onClick={() => setShowSolution(!showSolution)}
        >
          {showSolution
            ? lang === 'hi'
              ? 'समाधान छिपाएँ'
              : 'Hide Solution'
            : lang === 'hi'
            ? 'स्टेप-बाय-स्टेप हल'
            : 'Board Solution'}
        </button>
      </div>

      {checked && (
        <div
          className={`kit-feedback-banner ${isCorrect ? 'correct' : 'review'}`}
          role="region"
          aria-live="polite"
        >
          <strong>{isCorrect ? (lang === 'hi' ? '✓ बिल्कुल सही!' : '✓ Correct!') : (lang === 'hi' ? 'एक बार फिर सोचें:' : 'Review your steps:')}</strong>{' '}
          {isCorrect
            ? lang === 'hi'
              ? 'आपने सही विकल्प चुना है।'
              : 'You selected the exact board answer.'
            : lang === 'hi'
            ? 'नीचे दिए गए बोर्ड स्टेप्स देखें।'
            : 'Check the step-by-step board answer formatting below.'}
        </div>
      )}

      {showHint && hint && (
        <div style={{ marginTop: '0.75rem', padding: '0.6rem 0.8rem', background: '#eff6ff', borderRadius: '4px', fontSize: '0.9rem', color: '#1e40af' }}>
          <strong>{lang === 'hi' ? 'संकेत:' : 'Hint:'}</strong> {hint}
        </div>
      )}

      {showSolution && (
        <div className="kit-solution-box">
          <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
            {lang === 'hi' ? 'बोर्ड परीक्षा उत्तर प्रारूप (Step Marking):' : 'Board Exam Answer Format (Step Marking):'}
          </div>
          {solutionSteps.map((s, idx) => (
            <div key={idx} className="kit-step-item">
              <strong style={{ color: '#475569' }}>{s.label}:</strong> {s.content}
            </div>
          ))}
          <div style={{ marginTop: '0.5rem', fontWeight: 700, color: '#047857' }}>
            <strong>{lang === 'hi' ? 'अंतिम उत्तर:' : 'Final Answer:'}</strong> {finalAnswer}
          </div>
        </div>
      )}
    </div>
  )
}
