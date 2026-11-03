import React, { useState } from 'react'
import './kit.css'

export interface PredictCardProps {
  question: string
  options: readonly string[]
  correctIndex: number
  explanation: string
  lang: 'en' | 'hi'
  onLocked?: (correct: boolean) => void
}

export const PredictCard: React.FC<PredictCardProps> = ({
  question,
  options,
  correctIndex,
  explanation,
  lang,
  onLocked,
}) => {
  const [selected, setSelected] = useState<number | null>(null)
  const [isLocked, setIsLocked] = useState<boolean>(false)

  const checkText = lang === 'hi' ? 'उत्तर लॉक करें (Lock Prediction)' : 'Lock In Prediction'

  function handleLock() {
    if (selected === null) return
    setIsLocked(true)
    onLocked?.(selected === correctIndex)
  }

  const isCorrect = selected === correctIndex

  return (
    <div className="kit-predict-card">
      <h3 className="kit-predict-q">{question}</h3>
      <div className="kit-predict-options">
        {options.map((opt, idx) => (
          <label
            key={idx}
            className={`kit-predict-opt ${selected === idx ? 'is-selected' : ''}`}
          >
            <input
              type="radio"
              name={`predict-${question}`}
              checked={selected === idx}
              disabled={isLocked}
              onChange={() => setSelected(idx)}
            />
            <span>{opt}</span>
          </label>
        ))}
      </div>

      {!isLocked ? (
        <div className="kit-predict-actions">
          <button
            type="button"
            className="kit-btn kit-btn-primary"
            disabled={selected === null}
            onClick={handleLock}
          >
            {checkText}
          </button>
        </div>
      ) : (
        <div
          className={`kit-feedback-banner ${isCorrect ? 'correct' : 'review'}`}
          role="region"
          aria-live="polite"
        >
          <strong>
            {isCorrect
              ? lang === 'hi'
                ? '✓ सही अनुमान!'
                : '✓ Great Intuition!'
              : lang === 'hi'
              ? 'दिलचस्प सोच! आइए प्रयोग से देखें:'
              : 'Interesting prediction! Let us see what happens:'}
          </strong>{' '}
          {explanation}
        </div>
      )}
    </div>
  )
}
