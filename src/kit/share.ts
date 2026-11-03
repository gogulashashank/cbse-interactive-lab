/** Pure helpers for sharing a concept card (WhatsApp first, as content spreads there). */

export const WHATSAPP_BASE = 'https://wa.me/'

/** Builds an absolute deep link from an origin and a path, avoiding double slashes. */
export function buildDeepLink(origin: string, path: string): string {
  const cleanOrigin = origin.replace(/\/+$/, '')
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${cleanOrigin}${cleanPath}`
}

/** Message body: the challenge text, a blank line, then the link. */
export function buildShareMessage(challenge: string, deepLink: string): string {
  return `${challenge.trim()}\n\n${deepLink}`
}

/** `https://wa.me/?text=<encoded>` — opens WhatsApp's contact picker with the text filled in. */
export function buildWhatsAppUrl(message: string): string {
  return `${WHATSAPP_BASE}?text=${encodeURIComponent(message)}`
}
