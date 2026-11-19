import type { StandaloneRouteId } from '../platform/routeRegistry'
import { getRelatedNotebooksForRoute } from './relatedNotebooks'
import './notebook.css'

export interface RelatedNotebooksBarProps {
  routeId: StandaloneRouteId
  onOpenConcept: (conceptPath: string) => void
}

export function RelatedNotebooksBar({ routeId, onOpenConcept }: RelatedNotebooksBarProps) {
  if (routeId === 'learn') return null
  const related = getRelatedNotebooksForRoute(routeId)
  if (related.length === 0) return null

  return (
    <aside
      className="nb-page no-print"
      style={{ paddingBottom: '0.25rem', paddingTop: '0.75rem' }}
      aria-label="Related interactive concept notebooks"
    >
      <div
        className="nb-header"
        style={{
          padding: '0.65rem 1rem',
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.6rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexWrap: 'wrap' }}>
          <span className="nb-chapter-pill">Connected Mental-Model Notebooks:</span>
          {related.map((concept) => (
            <button
              key={concept.id}
              type="button"
              className="nb-back-btn"
              onClick={() => onOpenConcept(`/learn/${concept.id}`)}
            >
              🔬 {concept.title.en} →
            </button>
          ))}
        </div>

        <button
          type="button"
          className="nb-back-btn"
          style={{ background: '#efe4ce' }}
          onClick={() => onOpenConcept('/learn')}
        >
          ← All 32 Concept Notebooks
        </button>
      </div>
    </aside>
  )
}
