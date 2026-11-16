import type { ReactNode } from 'react'
import './notebook.css'

export interface NotebookHeaderProps {
  eyebrow: string
  title: string
  subtitle?: string
  chapterBadge?: string
  statusBadge?: string
  isCompleted?: boolean
  completedLabel?: string
  onBack?: () => void
  backLabel?: string
  utilities?: ReactNode
  children?: ReactNode
}

export function NotebookHeader({
  eyebrow,
  title,
  subtitle,
  chapterBadge,
  statusBadge,
  isCompleted,
  completedLabel = '✓ Completed',
  onBack,
  backLabel = '← All Notebook Cards',
  utilities,
  children,
}: NotebookHeaderProps) {
  return (
    <header className="nb-header">
      <div className="nb-header-top-row">
        <div className="nb-breadcrumbs">
          {onBack && (
            <button type="button" className="nb-back-btn" onClick={onBack}>
              {backLabel}
            </button>
          )}
          {chapterBadge && <span className="nb-chapter-pill">{chapterBadge}</span>}
          {statusBadge && <span className="nb-badge-pill">{statusBadge}</span>}
          {isCompleted && <span className="nb-badge-pill is-done">{completedLabel}</span>}
        </div>
        {utilities && <div className="nb-header-utilities">{utilities}</div>}
      </div>

      <div>
        <p className="nb-eyebrow">{eyebrow}</p>
        <h1 className="nb-title">{title}</h1>
        {subtitle && <p className="nb-subtitle">{subtitle}</p>}
      </div>

      {children}
    </header>
  )
}

export interface NotebookSpreadProps {
  apparatus: ReactNode
  fieldNotes: ReactNode
  stickyApparatus?: boolean
}

export function NotebookSpread({
  apparatus,
  fieldNotes,
  stickyApparatus = true,
}: NotebookSpreadProps) {
  return (
    <div className="nb-spread">
      <section
        className={`nb-bench-sheet ${stickyApparatus ? 'nb-spread-left-sticky' : ''}`}
        aria-label="Interactive apparatus bench"
      >
        {apparatus}
      </section>
      <aside className="nb-notes-sheet" aria-label="Illustrated notebook field notes and practice">
        {fieldNotes}
      </aside>
    </div>
  )
}

export interface PipelineStepItem {
  kicker: string
  math: string
}

export function NotebookPipeline({
  steps,
  ariaLabel = 'Formula and unit conversion pipeline',
}: {
  steps: readonly PipelineStepItem[]
  ariaLabel?: string
}) {
  return (
    <div className="nb-pipeline-row" role="region" aria-label={ariaLabel}>
      {steps.map((step, idx) => (
        <div key={idx} className="nb-pipeline-step">
          <div className="nb-pipeline-step-kicker">{step.kicker}</div>
          <div className="nb-pipeline-step-math">{step.math}</div>
        </div>
      ))}
    </div>
  )
}
