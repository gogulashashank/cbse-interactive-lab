import { useState, useEffect, lazy, Suspense } from 'react'
import { CONCEPTS, getConceptById, getPilotConcepts, THREADS, type ThreadId } from './registry'
import { RATE_VS_TOTAL_CONTENT } from './rateVsTotal/content'
import { SQUARES_AND_INVERSES_CONTENT } from './squaresAndInverses/content'
import { CONTROLLED_EXPERIMENTS_CONTENT } from './controlledExperiments/content'
import { ENERGY_CONSERVATION_CONTENT } from './energyConservation/content'
import { CONVENTIONS_AND_INVERSIONS_CONTENT } from './conventionsAndInversions/content'
import { LanguageToggle, ProjectorToggle } from '../kit/Toggles'
import { usePrefs } from '../kit/prefs'
import { safeGetItem, safeSetItem } from '../kit/storage'
import { NotebookHeader } from '../notebook/NotebookSpread'
import { StoryNotebookEngine } from '../notebook/StoryNotebookEngine'
import { STORY_STAGE_SUPPLEMENTS } from '../notebook/storyCurricula'
import '../kit/kit.css'
import '../notebook/notebook.css'

const BucketInteractive = lazy(() =>
  import('./rateVsTotal/BucketInteractive').then((m) => ({ default: m.BucketInteractive }))
)
const ChargeInteractive = lazy(() =>
  import('./rateVsTotal/ChargeInteractive').then((m) => ({ default: m.ChargeInteractive }))
)
const EnergyInteractive = lazy(() =>
  import('./rateVsTotal/EnergyInteractive').then((m) => ({ default: m.EnergyInteractive }))
)
const BillInteractive = lazy(() =>
  import('./rateVsTotal/BillInteractive').then((m) => ({ default: m.BillInteractive }))
)
const InverseAreaInteractive = lazy(() =>
  import('./squaresAndInverses/InverseAreaInteractive').then((m) => ({
    default: m.InverseAreaInteractive,
  }))
)
const DiameterTrapInteractive = lazy(() =>
  import('./squaresAndInverses/DiameterTrapInteractive').then((m) => ({
    default: m.DiameterTrapInteractive,
  }))
)
const VoltageSquaredInteractive = lazy(() =>
  import('./squaresAndInverses/VoltageSquaredInteractive').then((m) => ({
    default: m.VoltageSquaredInteractive,
  }))
)
const GravityInverseInteractive = lazy(() =>
  import('./squaresAndInverses/GravityInverseInteractive').then((m) => ({
    default: m.GravityInverseInteractive,
  }))
)
const FixedPowerInteractive = lazy(() =>
  import('./controlledExperiments/FixedPowerInteractive').then((m) => ({
    default: m.FixedPowerInteractive,
  }))
)
const StretchingInteractive = lazy(() =>
  import('./controlledExperiments/StretchingInteractive').then((m) => ({
    default: m.StretchingInteractive,
  }))
)
const ConstantTempInteractive = lazy(() =>
  import('./controlledExperiments/ConstantTempInteractive').then((m) => ({
    default: m.ConstantTempInteractive,
  }))
)
const CircuitFailureInteractive = lazy(() =>
  import('./controlledExperiments/CircuitFailureInteractive').then((m) => ({
    default: m.CircuitFailureInteractive,
  }))
)
const ElectricalEnergyInteractive = lazy(() =>
  import('./energyConservation/ElectricalEnergyInteractive').then((m) => ({
    default: m.ElectricalEnergyInteractive,
  }))
)
const ChargeConservationInteractive = lazy(() =>
  import('./energyConservation/ChargeConservationInteractive').then((m) => ({
    default: m.ChargeConservationInteractive,
  }))
)
const CircuitPowerBalanceInteractive = lazy(() =>
  import('./energyConservation/CircuitPowerBalanceInteractive').then((m) => ({
    default: m.CircuitPowerBalanceInteractive,
  }))
)
const MechanicalRampConservationInteractive = lazy(() =>
  import('./energyConservation/MechanicalRampConservationInteractive').then((m) => ({
    default: m.MechanicalRampConservationInteractive,
  }))
)
const CartesianSignInteractive = lazy(() =>
  import('./conventionsAndInversions/CartesianSignInteractive').then((m) => ({
    default: m.CartesianSignInteractive,
  }))
)
const RealVirtualCrossoverInteractive = lazy(() =>
  import('./conventionsAndInversions/RealVirtualCrossoverInteractive').then((m) => ({
    default: m.RealVirtualCrossoverInteractive,
  }))
)
const MagnificationDecoderInteractive = lazy(() =>
  import('./conventionsAndInversions/MagnificationDecoderInteractive').then((m) => ({
    default: m.MagnificationDecoderInteractive,
  }))
)
const LensPowerNotebookLesson = lazy(() =>
  import('./conventionsAndInversions/LensPowerNotebookLesson').then((m) => ({
    default: m.LensPowerNotebookLesson,
  }))
)
const VelocityTimeGraphInteractive = lazy(() =>
  import('./rateVsTotal/VelocityTimeGraphInteractive').then((m) => ({
    default: m.VelocityTimeGraphInteractive,
  }))
)
const MomentumImpulseInteractive = lazy(() =>
  import('./controlledExperiments/MomentumImpulseInteractive').then((m) => ({
    default: m.MomentumImpulseInteractive,
  }))
)
const ArchimedesBuoyancyInteractive = lazy(() =>
  import('./energyConservation/ArchimedesBuoyancyInteractive').then((m) => ({
    default: m.ArchimedesBuoyancyInteractive,
  }))
)
const SoundEchoWaveInteractive = lazy(() =>
  import('./squaresAndInverses/SoundEchoWaveInteractive').then((m) => ({
    default: m.SoundEchoWaveInteractive,
  }))
)
const EyeDefectCorrectionInteractive = lazy(() =>
  import('./conventionsAndInversions/EyeDefectCorrectionInteractive').then((m) => ({
    default: m.EyeDefectCorrectionInteractive,
  }))
)
const PrismDispersionInteractive = lazy(() =>
  import('./conventionsAndInversions/PrismDispersionInteractive').then((m) => ({
    default: m.PrismDispersionInteractive,
  }))
)
const MagneticFieldSolenoidInteractive = lazy(() =>
  import('./squaresAndInverses/MagneticFieldSolenoidInteractive').then((m) => ({
    default: m.MagneticFieldSolenoidInteractive,
  }))
)
const MotorForceFlemingsInteractive = lazy(() =>
  import('./controlledExperiments/MotorForceFlemingsInteractive').then((m) => ({
    default: m.MotorForceFlemingsInteractive,
  }))
)
const ChemicalMassBalanceInteractive = lazy(() =>
  import('./energyConservation/ChemicalMassBalanceInteractive').then((m) => ({
    default: m.ChemicalMassBalanceInteractive,
  }))
)
const PhScaleExponentialInteractive = lazy(() =>
  import('./squaresAndInverses/PhScaleExponentialInteractive').then((m) => ({
    default: m.PhScaleExponentialInteractive,
  }))
)
const MetalReactivityInteractive = lazy(() =>
  import('./controlledExperiments/MetalReactivityInteractive').then((m) => ({
    default: m.MetalReactivityInteractive,
  }))
)
const CarbonHomologousInteractive = lazy(() =>
  import('./rateVsTotal/CarbonHomologousInteractive').then((m) => ({
    default: m.CarbonHomologousInteractive,
  }))
)

const PROGRESS_KEY = 'cil.progress'

const ALL_CONTENT = {
  ...RATE_VS_TOTAL_CONTENT,
  ...SQUARES_AND_INVERSES_CONTENT,
  ...CONTROLLED_EXPERIMENTS_CONTENT,
  ...ENERGY_CONSERVATION_CONTENT,
  ...CONVENTIONS_AND_INVERSIONS_CONTENT,
}

export type BrowseMode = 'threads' | 'chapters'
export type ChapterFilterId = 'light-10' | 'electricity-10' | 'chemistry-10' | 'mechanics-9'

const SYLLABUS_CHAPTERS: readonly {
  id: ChapterFilterId
  title: { en: string; hi: string }
  tagline: { en: string; hi: string }
  matchChapter: (ref: string) => boolean
}[] = [
  {
    id: 'light-10',
    title: {
      en: 'Class 10 Ch 9 & 10: Light, Human Eye & Colourful World',
      hi: 'कक्षा 10 अध्याय 9 व 10: प्रकाश, मानव नेत्र तथा रंगबिरंगा संसार',
    },
    tagline: {
      en: 'Cartesian signs, real/virtual crossover, magnification code, lens power in Dioptres, myopia/hypermetropia correction, and prism dispersion & sky scattering.',
      hi: 'कार्तीय चिह्न, फोकस संक्रमण, आवर्धन डिकोडिंग, लेंस क्षमता (डाइऑप्टर), दृष्टि दोष संशोधन तथा प्रिज्म वर्ण-विक्षेपण एवं प्रकीर्णन।',
    },
    matchChapter: (ref) => {
      const lower = ref.toLowerCase()
      return lower.includes('light') || lower.includes('human eye')
    },
  },
  {
    id: 'electricity-10',
    title: {
      en: 'Class 10 Ch 11 & 12: Electricity & Magnetic Effects of Current',
      hi: 'कक्षा 10 अध्याय 11 व 12: विद्युत तथा विद्युत धारा के चुंबकीय प्रभाव',
    },
    tagline: {
      en: 'Current vs charge, Ohm’s law, wire diameter scaling, series/parallel power traps, Joule heating, kWh billing, Right-Hand Thumb Rule, solenoids, and Fleming’s Left-Hand Rule.',
      hi: 'धारा व आवेश, ओम का नियम, तार व्यास प्रभाव, श्रेणी/समानांतर शक्ति, जूल तापन, बिजली बिल, दक्षिण-हस्त नियम, परिनालिका तथा फ्लेमिंग का वाम-हस्त नियम।',
    },
    matchChapter: (ref) => {
      const lower = ref.toLowerCase()
      return lower.includes('electricity') || lower.includes('magnetic')
    },
  },
  {
    id: 'chemistry-10',
    title: {
      en: 'Class 10 Ch 1–4: Chemistry — Reactions, Acids/pH, Metals & Carbon',
      hi: 'कक्षा 10 अध्याय 1–4: रसायन — अभिक्रियाएं, अम्ल/pH, धातु एवं कार्बन',
    },
    tagline: {
      en: 'Stoichiometric equation balancing & conservation of mass, inverse 10-fold pH logarithmic scale, metal reactivity displacement, and carbon homologous series (+CH₂ / +14 u).',
      hi: 'रासायनिक समीकरण संतुलन व द्रव्यमान संरक्षण, pH स्केल का 10-गुना घातांकी नियम, धातु सक्रियता विस्थापन तथा कार्बन की समजातीय श्रेणी (+CH₂ / +14 u)।',
    },
    matchChapter: (ref) => {
      const lower = ref.toLowerCase()
      return (
        lower.includes('chemical') ||
        lower.includes('acids') ||
        lower.includes('metals') ||
        lower.includes('carbon')
      )
    },
  },
  {
    id: 'mechanics-9',
    title: {
      en: 'Class 9 Ch 7–11: Motion, Force, Gravitation, Work-Energy & Sound',
      hi: 'कक्षा 9 अध्याय 7–11: गति, बल, गुरुत्वाकर्षण, कार्य-ऊर्जा तथा ध्वनि',
    },
    tagline: {
      en: 'v–t graph slope vs area, Second Law impulse cushioning, Archimedes buoyancy & floatation, inverse-square gravitation, ramp energy conservation, and sound wave echoes.',
      hi: 'v–t ग्राफ ढाल व क्षेत्रफल, गति का द्वितीय नियम (आवेग), आर्किमिडीज उत्प्लावन व प्लवन, गुरुत्वाकर्षण, यांत्रिक ऊर्जा संरक्षण तथा ध्वनि प्रतिध्वनि।',
    },
    matchChapter: (ref) => {
      const lower = ref.toLowerCase()
      return (
        lower.includes('motion') ||
        lower.includes('force') ||
        lower.includes('gravitation') ||
        lower.includes('floatation') ||
        lower.includes('work') ||
        lower.includes('sound')
      )
    },
  },
]

export function ConceptHub() {
  const { lang, projector } = usePrefs()
  const [browseMode, setBrowseMode] = useState<BrowseMode>('threads')
  const [selectedChapter, setSelectedChapter] = useState<ChapterFilterId>('light-10')
  const [selectedThread, setSelectedThread] = useState<ThreadId>(() => {
    if (typeof window === 'undefined') return 'conventions-and-inversions'
    const parts = window.location.pathname.split('/').filter(Boolean)
    const initialId = parts[1]
    if (initialId) {
      const c = getConceptById(initialId)
      if (c) return c.thread
    }
    return 'conventions-and-inversions'
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [classFilter, setClassFilter] = useState<'all' | 9 | 10>('all')
  const [completed, setCompleted] = useState<string[]>(() => {
    const raw = safeGetItem(PROGRESS_KEY)
    return raw ? JSON.parse(raw) : []
  })

  // Deep link parsing: /learn/<conceptId>
  const [activeConceptId, setActiveConceptId] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null
    const parts = window.location.pathname.split('/').filter(Boolean)
    return parts[1] || null
  })

  useEffect(() => {
    function handlePop() {
      const parts = window.location.pathname.split('/').filter(Boolean)
      const nextId = parts[1] || null
      setActiveConceptId(nextId)
      if (nextId) {
        const c = getConceptById(nextId)
        if (c) setSelectedThread(c.thread)
      }
    }
    window.addEventListener('popstate', handlePop)
    return () => window.removeEventListener('popstate', handlePop)
  }, [])

  function navigateToConcept(id: string | null) {
    const nextPath = id ? `/learn/${id}` : '/learn'
    if (typeof window !== 'undefined' && window.location.pathname !== nextPath) {
      window.history.pushState({}, '', nextPath)
    }
    setActiveConceptId(id)
    if (id) {
      const c = getConceptById(id)
      if (c) setSelectedThread(c.thread)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function markCompleted(id: string) {
    if (!completed.includes(id)) {
      const next = [...completed, id]
      setCompleted(next)
      safeSetItem(PROGRESS_KEY, JSON.stringify(next))
    }
  }

  const pilotConcepts = getPilotConcepts()
  const activeConcept = activeConceptId ? getConceptById(activeConceptId) : null
  const content = activeConceptId ? ALL_CONTENT[activeConceptId] : null
  const currentThread = THREADS.find((t) => t.id === selectedThread) || THREADS[0]
  const currentChapter =
    SYLLABUS_CHAPTERS.find((ch) => ch.id === selectedChapter) || SYLLABUS_CHAPTERS[0]

  const isFiltering = searchQuery.trim().length > 0 || classFilter !== 'all'
  const displayedConcepts = pilotConcepts.filter((c) => {
    if (!isFiltering) {
      if (browseMode === 'threads' && c.thread !== selectedThread) return false
      if (
        browseMode === 'chapters' &&
        !c.boardMapping.some((b) => currentChapter.matchChapter(b.chapterRef))
      ) {
        return false
      }
    }
    if (classFilter !== 'all' && !c.boardMapping.some((b) => b.classLevel === classFilter))
      return false
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.trim().toLowerCase()
      const itemContent = ALL_CONTENT[c.id]
      const hay = [
        c.title.en,
        c.title.hi,
        c.oneLine.en,
        c.oneLine.hi,
        c.boardMapping.map((b) => b.chapterRef).join(' '),
        c.misconceptionIds.join(' '),
        itemContent?.insightFormula || '',
        itemContent?.insightTerm.en || '',
        itemContent?.insightTerm.hi || '',
      ]
        .join(' ')
        .toLowerCase()
      if (!hay.includes(q)) return false
    }
    return true
  })

  if (activeConceptId === 'lens-power-dioptre') {
    return (
      <Suspense fallback={<div className="platform-loading">Loading notebook…</div>}>
        <LensPowerNotebookLesson onBackToConceptHub={() => navigateToConcept(null)} />
      </Suspense>
    )
  }

  const completedPilotCount = completed.filter((c) => pilotConcepts.some((p) => p.id === c)).length

  if (activeConcept && content && activeConcept.id !== 'lens-power-dioptre') {
    const supplement =
      STORY_STAGE_SUPPLEMENTS[activeConcept.id as keyof typeof STORY_STAGE_SUPPLEMENTS]
    const curIdx = pilotConcepts.findIndex((c) => c.id === activeConcept.id)
    const nextConcept = pilotConcepts[curIdx + 1] || null

    if (supplement) {
      return (
        <main className={`nb-page ${projector ? 'cil-projector' : ''}`}>
          <StoryNotebookEngine
            key={activeConcept.id}
            concept={activeConcept}
            threadTitle={currentThread.title[lang]}
            content={content}
            supplement={supplement}
            lang={lang}
            isCompleted={completed.includes(activeConcept.id)}
            onMarkCompleted={() => markCompleted(activeConcept.id)}
            onBackToShelf={() => navigateToConcept(null)}
            nextConcept={nextConcept}
            onNavigateConcept={(nextId) => navigateToConcept(nextId)}
            apparatusSlot={
              <Suspense fallback={<div className="platform-loading">Loading apparatus…</div>}>
                {activeConcept.id === 'rate-vs-total-intro' && <BucketInteractive lang={lang} />}
                {activeConcept.id === 'current-vs-charge' && <ChargeInteractive lang={lang} />}
                {activeConcept.id === 'power-vs-energy' && <EnergyInteractive lang={lang} />}
                {activeConcept.id === 'units-on-the-bill' && <BillInteractive lang={lang} />}
                {activeConcept.id === 'inverse-area-scaling' && <InverseAreaInteractive lang={lang} />}
                {activeConcept.id === 'diameter-trap' && <DiameterTrapInteractive lang={lang} />}
                {activeConcept.id === 'voltage-squared-power' && <VoltageSquaredInteractive lang={lang} />}
                {activeConcept.id === 'gravity-inverse-square' && <GravityInverseInteractive lang={lang} />}
                {activeConcept.id === 'fixed-voltage-vs-current' && <FixedPowerInteractive lang={lang} />}
                {activeConcept.id === 'stretching-vs-comparing' && <StretchingInteractive lang={lang} />}
                {activeConcept.id === 'constant-temp-ohmic' && <ConstantTempInteractive lang={lang} />}
                {activeConcept.id === 'series-parallel-failure' && <CircuitFailureInteractive lang={lang} />}
                {activeConcept.id === 'electrical-energy-transfer' && <ElectricalEnergyInteractive lang={lang} />}
                {activeConcept.id === 'charge-conservation-junction' && <ChargeConservationInteractive lang={lang} />}
                {activeConcept.id === 'circuit-power-balance' && <CircuitPowerBalanceInteractive lang={lang} />}
                {activeConcept.id === 'mechanical-ramp-conservation' && <MechanicalRampConservationInteractive lang={lang} />}
                {activeConcept.id === 'cartesian-sign-trap' && <CartesianSignInteractive lang={lang} />}
                {activeConcept.id === 'real-vs-virtual-switch' && <RealVirtualCrossoverInteractive lang={lang} />}
                {activeConcept.id === 'magnification-code' && <MagnificationDecoderInteractive lang={lang} />}
                {activeConcept.id === 'velocity-time-graph-area' && <VelocityTimeGraphInteractive lang={lang} />}
                {activeConcept.id === 'momentum-impulse-cushion' && <MomentumImpulseInteractive lang={lang} />}
                {activeConcept.id === 'archimedes-buoyancy-float' && <ArchimedesBuoyancyInteractive lang={lang} />}
                {activeConcept.id === 'sound-echo-wave-speed' && <SoundEchoWaveInteractive lang={lang} />}
                {activeConcept.id === 'eye-defects-correction' && <EyeDefectCorrectionInteractive lang={lang} />}
                {activeConcept.id === 'prism-dispersion-scattering' && <PrismDispersionInteractive lang={lang} />}
                {activeConcept.id === 'magnetic-field-solenoid' && <MagneticFieldSolenoidInteractive lang={lang} />}
                {activeConcept.id === 'motor-force-flemings-rule' && <MotorForceFlemingsInteractive lang={lang} />}
                {activeConcept.id === 'chemical-equation-mass-balance' && <ChemicalMassBalanceInteractive lang={lang} />}
                {activeConcept.id === 'ph-scale-exponential-acid' && <PhScaleExponentialInteractive lang={lang} />}
                {activeConcept.id === 'metal-reactivity-displacement' && <MetalReactivityInteractive lang={lang} />}
                {activeConcept.id === 'carbon-homologous-series' && <CarbonHomologousInteractive lang={lang} />}
              </Suspense>
            }
          />
        </main>
      )
    }
  }

  return (
    <main className={`nb-page ${projector ? 'cil-projector' : ''}`}>
      <NotebookHeader
        eyebrow={
          lang === 'hi'
            ? 'सीबीएसई इंटरैक्टिव विज्ञान नोटबुक (Illustrated Science Notebook Shelf)'
            : 'Illustrated Science Notebook · Interactive Concept Shelf'
        }
        title={
          browseMode === 'threads'
            ? currentThread.title[lang]
            : currentChapter.title[lang]
        }
        subtitle={
          isFiltering
            ? lang === 'hi'
              ? `${displayedConcepts.length} मिलान मिले (सभी अध्यायों में से)`
              : `Showing ${displayedConcepts.length} matching interactive notebook lessons`
            : browseMode === 'threads'
              ? currentThread.tagline[lang]
              : currentChapter.tagline[lang]
        }
        statusBadge={
          lang === 'hi'
            ? `प्रगति: ${completedPilotCount}/${pilotConcepts.length} पूर्ण`
            : `Notebook Progress: ${completedPilotCount}/${pilotConcepts.length}`
        }
        utilities={
          <>
            <button
              type="button"
              className="nb-QuickChip is-active"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.history.pushState({}, '', '/revision')
                  window.dispatchEvent(new PopStateEvent('popstate'))
                }
              }}
            >
              {lang === 'hi'
                ? '📝 बोर्ड परीक्षा एवं पुनरावृत्ति कार्यपुस्तिका'
                : '📝 Board Exam & Revision Workbook'}
            </button>
            <LanguageToggle />
            <ProjectorToggle />
          </>
        }
      />

      {/* Notebook Shelf Overview (/learn) */}
      <>
          <section className="nb-shelf-controls" aria-label="Notebook shelf browse controls">
            {/* Two Ways to Browse: By Mental-Model Thread vs By NCERT Syllabus Chapter */}
            <div className="nb-shelf-mode-row">
              <div className="nb-mode-tabs" role="tablist" aria-label="Browse mode">
                <button
                  type="button"
                  role="tab"
                  aria-selected={browseMode === 'threads'}
                  className={`nb-mode-tab ${browseMode === 'threads' ? 'is-active' : ''}`}
                  onClick={() => setBrowseMode('threads')}
                >
                  {lang === 'hi'
                    ? '1. मानसिक मॉडल सूत्र (5 Core Threads)'
                    : '1. By Mental-Model Thread (5 Core Patterns)'}
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={browseMode === 'chapters'}
                  className={`nb-mode-tab ${browseMode === 'chapters' ? 'is-active' : ''}`}
                  onClick={() => setBrowseMode('chapters')}
                >
                  {lang === 'hi'
                    ? '2. एनसीईआरटी अध्याय के अनुसार (By NCERT Chapter)'
                    : '2. By NCERT Syllabus Chapter (Class 9 & 10)'}
                </button>
              </div>

              <div style={{ display: 'flex', gap: '0.35rem' }}>
                {(
                  [
                    { id: 'all', en: 'All Classes', hi: 'सभी कक्षाएं' },
                    { id: 10, en: 'Class 10', hi: 'कक्षा 10' },
                    { id: 9, en: 'Class 9', hi: 'कक्षा 9' },
                  ] as const
                ).map((tab) => (
                  <button
                    key={String(tab.id)}
                    type="button"
                    className={`nb-chip-btn ${classFilter === tab.id ? 'is-active' : ''}`}
                    onClick={() => setClassFilter(tab.id)}
                  >
                    {lang === 'hi' ? tab.hi : tab.en}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Input */}
            <div className="nb-search-row">
              <input
                type="search"
                className="nb-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  lang === 'hi'
                    ? 'सूत्र, अध्याय या अवधारणा खोजें (जैसे: ओम, लेंस, डाइऑप्टर, kWh, V²/R)...'
                    : 'Search formula, chapter, or board-exam trap (e.g. lens, dioptre, Ohm, kWh, V²/R)...'
                }
                aria-label={lang === 'hi' ? 'अवधारणा खोजें' : 'Search concepts'}
              />
            </div>

            {/* Thread or Chapter Switcher Pills */}
            {!isFiltering && browseMode === 'threads' && (
              <div className="nb-thread-ribbon" role="navigation" aria-label="Concept threads">
                {THREADS.map((thread) => (
                  <button
                    key={thread.id}
                    type="button"
                    className={`nb-thread-pill ${selectedThread === thread.id ? 'is-active' : ''}`}
                    onClick={() => setSelectedThread(thread.id)}
                  >
                    {thread.title[lang]}
                  </button>
                ))}
              </div>
            )}

            {!isFiltering && browseMode === 'chapters' && (
              <div className="nb-thread-ribbon" role="navigation" aria-label="NCERT chapters">
                {SYLLABUS_CHAPTERS.map((ch) => (
                  <button
                    key={ch.id}
                    type="button"
                    className={`nb-thread-pill ${selectedChapter === ch.id ? 'is-active' : ''}`}
                    onClick={() => setSelectedChapter(ch.id)}
                  >
                    {ch.title[lang]}
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Grid of Notebook Lesson Cards */}
          <section className="nb-card-grid" aria-label="Interactive notebook lessons">
            {displayedConcepts.map((concept, idx) => {
              const isDone = completed.includes(concept.id)
              const itemContent = ALL_CONTENT[concept.id]
              const isOptics = concept.thread === 'conventions-and-inversions'
              return (
                <button
                  key={concept.id}
                  type="button"
                  className={`nb-index-card ${isOptics ? 'is-optics' : ''}`}
                  onClick={() => navigateToConcept(concept.id)}
                >
                  <div>
                    <div className="nb-index-card-top">
                      <span className="nb-index-card-tag">
                        {lang === 'hi' ? `पाठ ${idx + 1}` : `Notebook ${idx + 1}`} ·{' '}
                        {concept.boardMapping[0]?.chapterRef}
                      </span>
                      {isDone && (
                        <span className="nb-badge-pill is-done">
                          ✓ {lang === 'hi' ? 'पूर्ण' : 'Done'}
                        </span>
                      )}
                    </div>
                    <h3 className="nb-index-card-title">{concept.title[lang]}</h3>
                    <p className="nb-index-card-desc" style={{ marginTop: '0.3rem' }}>
                      {concept.oneLine[lang]}
                    </p>
                  </div>

                  <div className="nb-index-card-footer">
                    <span>{itemContent?.insightFormula.split('|')[0]?.trim() || 'Interactive Bench'}</span>
                    <span>{lang === 'hi' ? 'खोलें →' : 'Open Bench →'}</span>
                  </div>
                </button>
              )
            })}
          </section>

          {/* Full Chapter Experiment Labs Shelf */}
          <section className="nb-header" style={{ marginTop: '0.5rem' }}>
            <div>
              <p className="nb-eyebrow">
                {lang === 'hi' ? 'विस्तृत अध्याय प्रयोगशालाएँ' : 'Full-Chapter Apparatus Labs'}
              </p>
              <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.12rem', color: 'var(--nb-ink)' }}>
                {lang === 'hi'
                  ? 'एनसीईआरटी कक्षा 9 व 10 पूर्ण प्रयोगशालाएँ (Deep-Dive Chapter Labs)'
                  : 'Complete NCERT Chapter Workbenches (Optics, Mechanics & Electricity)'}
              </h2>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
              {CONCEPTS.filter((c) => c.status === 'mapped').map((mc) => (
                <a
                  key={mc.id}
                  href={mc.deepDiveRoute || '/'}
                  className="nb-back-btn"
                  style={{ textDecoration: 'none' }}
                >
                  {mc.title[lang]} →
                </a>
              ))}
            </div>
          </section>
        </>
    </main>
  )
}
