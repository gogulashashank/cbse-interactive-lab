import React, { useState } from 'react'
import { buildDeepLink, buildShareMessage, buildWhatsAppUrl } from './share'
import './kit.css'

export interface ShareButtonProps {
  challengeText: string
  path: string
  lang: 'en' | 'hi'
}

export const ShareButton: React.FC<ShareButtonProps> = ({ challengeText, path, lang }) => {
  const [copied, setCopied] = useState<boolean>(false)

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://cbse-interactive-lab.vercel.app'
  const fullLink = buildDeepLink(origin, path)
  const message = buildShareMessage(challengeText, fullLink)
  const waUrl = buildWhatsAppUrl(message)

  async function handleNativeShare() {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'CBSE Science Challenge',
          text: challengeText,
          url: fullLink,
        })
        return
      } catch {
        // Fall back to copy or whatsapp
      }
    }
    // Copy link as fallback
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(message)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  return (
    <div style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="kit-btn"
        style={{ background: '#25D366', color: '#ffffff', textDecoration: 'none' }}
      >
        <span>💬</span>
        <span>{lang === 'hi' ? 'व्हाट्सएप पर शेयर करें' : 'Share on WhatsApp'}</span>
      </a>
      <button
        type="button"
        className="kit-btn kit-btn-secondary"
        onClick={handleNativeShare}
      >
        {copied
          ? lang === 'hi'
            ? '✓ लिंक कॉपी हो गया!'
            : '✓ Link Copied!'
          : lang === 'hi'
          ? '🔗 लिंक कॉपी'
          : '🔗 Copy Challenge'}
      </button>
    </div>
  )
}
