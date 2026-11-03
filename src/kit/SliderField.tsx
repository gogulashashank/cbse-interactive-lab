import React, { useState } from 'react'
import { formatNumber } from './format'
import { formatDraftError, parseNumericDraft } from './validation'
import './kit.css'

export interface SliderFieldProps {
  id: string
  label: string
  unit: string
  value: number
  min: number
  max: number
  step?: number
  lang: 'en' | 'hi'
  onChange: (val: number) => void
}

export const SliderField: React.FC<SliderFieldProps> = ({
  id,
  label,
  unit,
  value,
  min,
  max,
  step = 1,
  lang,
  onChange,
}) => {
  const [draft, setDraft] = useState<string>(value.toString())
  const [error, setError] = useState<string | null>(null)

  function handleRangeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const nextVal = Number(e.target.value)
    setDraft(nextVal.toString())
    setError(null)
    onChange(nextVal)
  }

  function handleNumberChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value
    setDraft(raw)
    const res = parseNumericDraft(raw, { min, max })
    if (res.ok) {
      setError(null)
      onChange(res.value)
    } else {
      setError(formatDraftError(res.error, { min, max }, lang))
    }
  }

  return (
    <div className="kit-slider-field">
      <div className="kit-slider-label-row">
        <label htmlFor={`${id}-range`}>{label}</label>
        <span className="kit-slider-value-pill">
          {formatNumber(value)} {unit}
        </span>
      </div>
      <div className="kit-slider-inputs">
        <input
          id={`${id}-range`}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleRangeChange}
          className="kit-slider-range"
        />
        <input
          id={`${id}-number`}
          type="number"
          min={min}
          max={max}
          step="any"
          value={draft}
          onChange={handleNumberChange}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="kit-slider-number"
        />
      </div>
      {error && (
        <p id={`${id}-error`} className="kit-slider-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
