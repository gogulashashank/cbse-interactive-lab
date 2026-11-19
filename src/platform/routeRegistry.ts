/**
 * Central route registry.
 *
 * Every standalone page is listed once here with its canonical path, aliases
 * and a lazy loader, so each lesson ships as its own JS chunk. Students on
 * low-end phones then only download the lesson they open — the heavy
 * three.js 3D book is fetched only when the "/book" route is visited.
 */

export type StandaloneRouteId =
  | 'learn'
  | 'revision'
  | 'alternative'
  | 'electricity'
  | 'series-parallel'
  | 'resistivity'
  | 'power-heating'
  | 'billing'
  | 'safety'

export type RouteGroup = 'hub' | 'optics' | 'electricity'

export interface StandaloneRoute {
  id: StandaloneRouteId
  path: string
  aliases: readonly string[]
  navLabel: string
  group: RouteGroup
}

export const STANDALONE_ROUTES: readonly StandaloneRoute[] = [
  {
    id: 'learn',
    path: '/learn',
    aliases: ['/', '/concepts'],
    navLabel: 'Notebook Shelf (32 Labs)',
    group: 'hub',
  },
  {
    id: 'revision',
    path: '/revision',
    aliases: ['/exam', '/workbook'],
    navLabel: 'Board Exam & Revision',
    group: 'hub',
  },
  {
    id: 'alternative',
    path: '/alternative',
    aliases: [],
    navLabel: 'Convex Lens Workbench',
    group: 'optics',
  },
  {
    id: 'electricity',
    path: '/electricity',
    aliases: [],
    navLabel: 'Ohm’s Law',
    group: 'electricity',
  },
  {
    id: 'series-parallel',
    path: '/series-parallel',
    aliases: [],
    navLabel: 'Series & Parallel',
    group: 'electricity',
  },
  {
    id: 'resistivity',
    path: '/resistivity',
    aliases: [],
    navLabel: 'Resistivity',
    group: 'electricity',
  },
  {
    id: 'power-heating',
    path: '/power-heating',
    aliases: ['/heating'],
    navLabel: 'Power & Heating',
    group: 'electricity',
  },
  {
    id: 'billing',
    path: '/billing',
    aliases: ['/electricity-bill'],
    navLabel: 'kWh Billing',
    group: 'electricity',
  },
  {
    id: 'safety',
    path: '/safety',
    aliases: ['/domestic-circuits', '/fuses'],
    navLabel: 'Domestic Safety',
    group: 'electricity',
  },
]

export function normalizePathname(pathname: string): string {
  return pathname.replace(/\/+$/, '') || '/'
}

/** Returns the standalone route for a pathname, or null for the 3D book ("/book"). */
export function resolveStandaloneRoute(pathname: string): StandaloneRoute | null {
  const normalized = normalizePathname(pathname)
  // Concept deep links such as /learn/rate-vs-total belong to the learn route.
  const firstSegment = '/' + (normalized.split('/')[1] ?? '')
  return (
    STANDALONE_ROUTES.find(
      (r) =>
        r.path === normalized ||
        r.aliases.includes(normalized) ||
        (r.id === 'learn' &&
          firstSegment !== '/' &&
          (firstSegment === r.path || r.aliases.includes(firstSegment)))
    ) ?? null
  )
}
