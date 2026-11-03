import React from 'react'
import { setLang, setProjector, usePrefs } from './prefs'
import './kit.css'

export const LanguageToggle: React.FC = () => {
  const { lang } = usePrefs()

  return (
    <div style={{ display: 'inline-flex', background: '#e2e8f0', borderRadius: '6px', padding: '2px' }}>
      <button
        type="button"
        style={{
          border: 'none',
          padding: '4px 10px',
          borderRadius: '4px',
          background: lang === 'en' ? '#ffffff' : 'transparent',
          fontWeight: lang === 'en' ? 700 : 500,
          color: lang === 'en' ? '#0f172a' : '#475569',
          cursor: 'pointer',
          fontSize: '0.85rem',
        }}
        onClick={() => setLang('en')}
      >
        English
      </button>
      <button
        type="button"
        style={{
          border: 'none',
          padding: '4px 10px',
          borderRadius: '4px',
          background: lang === 'hi' ? '#ffffff' : 'transparent',
          fontWeight: lang === 'hi' ? 700 : 500,
          color: lang === 'hi' ? '#0f172a' : '#475569',
          cursor: 'pointer',
          fontSize: '0.85rem',
        }}
        onClick={() => setLang('hi')}
      >
        हिन्दी
      </button>
    </div>
  )
}

export const ProjectorToggle: React.FC = () => {
  const { projector, lang } = usePrefs()

  return (
    <button
      type="button"
      className={`kit-btn ${projector ? 'kit-btn-primary' : 'kit-btn-secondary'}`}
      style={{ padding: '4px 12px', fontSize: '0.85rem', minHeight: '36px' }}
      onClick={() => setProjector(!projector)}
      title={lang === 'hi' ? 'कक्षा या प्रोजेक्टर के लिए बड़े फॉन्ट' : 'Enlarge fonts for classroom or TV projector'}
    >
      <span>📺</span>
      <span>
        {projector
          ? lang === 'hi'
            ? 'प्रोजेक्टर मोड (चालू)'
            : 'Projector Mode (ON)'
          : lang === 'hi'
          ? 'प्रोजेक्टर मोड'
          : 'Projector Mode'}
      </span>
    </button>
  )
}
