/**
 * Central route registry.
 *
 * Every standalone page is listed once here with its canonical path, aliases
 * and a lazy loader, so each lesson ships as its own JS chunk. Students on
 * low-end phones then only download the lesson they open — the heavy
 * three.js 3D book is fetched only when the book route ("/") is visited.
 */

export type StandaloneRouteId =
  | 'learn'
  | 'alternative'
  | 'electricity'
  | 'series-parallel'
  | 'resistivity'
  | 'power-heating'
  | 'billing'
  | 'safety'

export interface StandaloneRoute {
  id: StandaloneRouteId
  path: string
  aliases: readonly string[]
  navLabel: string
}

export const STANDALONE_ROUTES: readonly StandaloneRoute[] = [
  { id: 'learn', path: '/learn', aliases: ['/concepts'], navLabel: 'Concept Cards (EN / हिं)' },
  {
    id: 'alternative',
    path: '/alternative',
    aliases: [],
    navLabel: 'Lesson II (/alternative): Reading & Immersive Bench',
  },
  { id: 'electricity', path: '/electricity', aliases: [], navLabel: 'Electricity: What makes current change?' },
  { id: 'series-parallel', path: '/series-parallel', aliases: [], navLabel: 'Series & Parallel: One Path or Two?' },
  { id: 'resistivity', path: '/resistivity', aliases: [], navLabel: 'Resistivity: Why Do Wires Differ?' },
  {
    id: 'power-heating',
    path: '/power-heating',
    aliases: ['/heating'],
    navLabel: 'Power & Heating: Where Does Energy Go?',
  },
  { id: 'billing', path: '/billing', aliases: ['/electricity-bill'], navLabel: 'Electricity Bill: Watts, kWh & Cost' },
  {
    id: 'safety',
    path: '/safety',
    aliases: ['/domestic-circuits', '/fuses'],
    navLabel: 'Domestic Safety: Fuses & Earthing',
  },
]

export function normalizePathname(pathname: string): string {
  return pathname.replace(/\/+$/, '') || '/'
}

/** Returns the standalone route for a pathname, or null for the book ("/"). */
export function resolveStandaloneRoute(pathname: string): StandaloneRoute | null {
  const normalized = normalizePathname(pathname)
  // Concept deep links such as /learn/rate-vs-total belong to the learn route.
  const firstSegment = '/' + (normalized.split('/')[1] ?? '')
  return (
    STANDALONE_ROUTES.find(
      (r) =>
        r.path === normalized ||
        r.aliases.includes(normalized) ||
        (r.id === 'learn' && (firstSegment === r.path || r.aliases.includes(firstSegment)))
    ) ?? null
  )
}
