import { CONTROLLED_EXPERIMENTS_CONTENT } from '../concepts/controlledExperiments/content'
import { CONVENTIONS_AND_INVERSIONS_CONTENT } from '../concepts/conventionsAndInversions/content'
import { ENERGY_CONSERVATION_CONTENT } from '../concepts/energyConservation/content'
import { RATE_VS_TOTAL_CONTENT, type ConceptCardContent } from '../concepts/rateVsTotal/content'
import { getPilotConcepts, type ConceptId, type ThreadId } from '../concepts/registry'
import { SQUARES_AND_INVERSES_CONTENT } from '../concepts/squaresAndInverses/content'
import type { Localized } from '../kit/i18n'
import { STORY_STAGE_SUPPLEMENTS, type StoryStageSupplement } from './storyCurricula'

const ALL_CONTENT_MAP: Record<string, ConceptCardContent> = {
  ...RATE_VS_TOTAL_CONTENT,
  ...SQUARES_AND_INVERSES_CONTENT,
  ...CONTROLLED_EXPERIMENTS_CONTENT,
  ...ENERGY_CONSERVATION_CONTENT,
  ...CONVENTIONS_AND_INVERSIONS_CONTENT,
}

/**
 * Supplemental 6-stage summary for the flagship `lens-power-dioptre` lesson
 * so all 28 pilot notebooks share a uniform revision & board-exam schema.
 */
const LENS_POWER_DIOPTRE_SUPPLEMENT: StoryStageSupplement = {
  ncertSection: 'NCERT Class 10 Chapter 9: Light — Reflection & Refraction (Sec 9.3.6 — Power of a Lens)',
  openingQuestion: {
    en: '“Why does a shorter focal length lens have a HIGHER optical power in Dioptres, and why must centimetres always be converted to metres first?”',
    hi: '“कम फोकस दूरी वाले लेंस की क्षमता (डाइऑप्टर में) अधिक क्यों होती है, और सेंटीमीटर को पहले मीटर में बदलना क्यों अनिवार्य है?”',
  },
  experimentProtocol: {
    goal: {
      en: 'Sweep focal length f between −50 cm and +50 cm to observe how ray bending sharpness and Dioptre power P = 100/f(cm) scale inversely.',
      hi: 'फोकस दूरी f को −50 cm से +50 cm के बीच बदलकर देखें कि किरणों का मोड़ और लेंस क्षमता P = 100/f(cm) कैसे व्युत्क्रमानुपाती रूप से बदलते हैं।',
    },
    steps: [
      {
        en: 'Set convex lens focal length f = +50 cm (0.50 m) and observe gentle convergence with P = +2.0 D.',
        hi: 'उत्तल लेंस की फोकस दूरी f = +50 cm (0.50 m) रखें और P = +2.0 D देखें।',
      },
      {
        en: 'Shorten focal length to f = +10 cm (0.10 m) and observe sharp convergence with P = +10.0 D (5× stronger).',
        hi: 'फोकस दूरी घटाकर f = +10 cm (0.10 m) करें और तीव्र अभिसरण P = +10.0 D देखें।',
      },
    ],
    observationCheck: {
      prompt: {
        en: 'When focal length is shortened from +50 cm to +10 cm, what happens to the lens power in Dioptres?',
        hi: 'जब फोकस दूरी +50 cm से घटाकर +10 cm की जाती है, तो लेंस की क्षमता पर क्या प्रभाव पड़ता है?',
      },
      options: [
        { en: 'Power increases 5-fold from +2.0 D to +10.0 D', hi: 'क्षमता 5 गुना बढ़कर +2.0 D से +10.0 D हो जाती है' },
        { en: 'Power decreases from +50 D to +10 D', hi: 'क्षमता +50 D से घटकर +10 D हो जाती है' },
      ],
      correctIndex: 0,
      explanation: {
        en: 'By P = 100 / f(cm), reducing f from 50 cm to 10 cm increases P from +2.0 D to +10.0 D.',
        hi: 'P = 100 / f(cm) के अनुसार f को 50 cm से 10 cm करने पर क्षमता +2.0 D से बढ़कर +10.0 D हो जाती है।',
      },
    },
  },
  discoveryNotes: {
    physicalMeaning: {
      en: 'Optical power measures the degree of convergence (+) or divergence (−) of light rays achieved by a lens: P = 1 / f(in metres).',
      hi: 'लेंस की क्षमता प्रकाश किरणों को अभिसरित (+) या अपसरित (−) करने की मात्रा की माप है: P = 1 / f(मीटर में)।',
    },
    scalingRule: {
      en: 'P = 1 / f(m) = 100 / f(cm). For lenses in contact, net power adds algebraically with signs: P_net = P₁ + P₂.',
      hi: 'P = 1 / f(m) = 100 / f(cm)। संपर्क में रखे लेंसों की कुल क्षमता चिह्नों सहित जुड़ती है: P_कुल = P₁ + P₂।',
    },
    siUnitRule: {
      en: '1 Dioptre (1 D = 1 m⁻¹) is the power of a lens of focal length 1 METRE. Convex lens: +D; Concave lens: −D.',
      hi: '1 डाइऑप्टर (1 D = 1 m⁻¹) उस लेंस की क्षमता है जिसकी फोकस दूरी 1 मीटर हो। उत्तल लेंस: +D; अवतल लेंस: −D।',
    },
  },
  workedNumerical: {
    title: {
      en: 'NCERT Class 10 Ch 9 · Power of a Two-Lens Combination in Contact',
      hi: 'NCERT कक्षा 10 अध्याय 9 · संपर्क में रखे दो लेंसों के संयोजन की क्षमता',
    },
    problem: {
      en: 'A convex lens of focal length +20 cm is placed in contact with a concave lens of focal length −40 cm. Calculate the individual powers, net power P_net, and equivalent focal length of the combination.',
      hi: '+20 cm फोकस दूरी का एक उत्तल लेंस −40 cm फोकस दूरी के अवतल लेंस के संपर्क में रखा है। दोनों की अलग-अलग क्षमता, संयोजन की कुल क्षमता P_net तथा समतुल्य फोकस दूरी ज्ञात कीजिए।',
    },
    given: [
      { en: 'Convex lens f₁ = +20 cm = +0.20 m', hi: 'उत्तल लेंस f₁ = +20 cm = +0.20 m' },
      { en: 'Concave lens f₂ = −40 cm = −0.40 m', hi: 'अवतल लेंस f₂ = −40 cm = −0.40 m' },
    ],
    formula: 'P₁ = 100/f₁(cm), P₂ = 100/f₂(cm)  |  P_net = P₁ + P₂  |  f_net(cm) = 100 / P_net',
    substitution: 'P₁ = 100/(+20) = +5.0 D, P₂ = 100/(−40) = −2.5 D ⇒ P_net = +5.0 − 2.5 = +2.5 D ⇒ f_net = 100/2.5 = +40 cm',
    answer: {
      en: 'P_net = +2.5 D; Equivalent focal length f_net = +40 cm (behaves as a converging lens).',
      hi: 'कुल क्षमता P_net = +2.5 D; समतुल्य फोकस दूरी f_net = +40 cm (अभिसारी संयोजन)।',
    },
    unitTrapNote: {
      en: 'Always convert f from centimetres to metres (or divide 100 by f_cm) before computing Dioptres!',
      hi: 'डाइऑप्टर निकालने से पहले हमेशा सेमी को मीटर में बदलें (अथवा 100 में f_cm से भाग दें)!',
    },
  },
  contrastTrap: {
    trapTitle: {
      en: 'Dividing 1 by Focal Length in Centimetres (P = 1/f_cm) Without Converting to Metres',
      hi: 'फोकस दूरी को मीटर में बदले बिना सीधे सेमी में 1/f कर देना (P = 1/f_cm)',
    },
    commonMistake: {
      en: 'For a lens of f = 25 cm, writing P = 1 / 25 = 0.04 D (off by a factor of 100!).',
      hi: 'f = 25 cm के लिए P = 1 / 25 = 0.04 D लिख देना (100 गुना की त्रुटि!)।',
    },
    correctPhysics: {
      en: 'Because 1 Dioptre = 1 m⁻¹, focal length MUST be in metres: f = 25 cm = 0.25 m ⇒ P = 1 / 0.25 = +4.0 D (or P = 100 / f_cm).',
      hi: 'चूँकि 1 D = 1 m⁻¹ होता है, इसलिए फोकस दूरी मीटर में होनी चाहिए: f = 0.25 m ⇒ P = 1 / 0.25 = +4.0 D (अथवा P = 100 / f_cm)।',
    },
    checkRule: {
      en: 'If f is given in cm, write 100 in the numerator immediately: P = 100 / f(cm)!',
      hi: 'यदि f सेमी (cm) में दिया हो, तो तुरंत अंश में 100 लिखें: P = 100 / f(cm)!',
    },
  },
  hotsReasoningTask: {
    title: {
      en: 'HOTS Optical Bench Comparison: +2.0 D vs +5.0 D Lens Ray Convergence',
      hi: 'उच्च स्तरीय विश्लेषण: +2.0 D तथा +5.0 D लेंसों के किरण अभिसरण की तुलना',
    },
    prompt: {
      en: 'Two convex lenses A and B have powers +2.0 D and +5.0 D respectively. Calculate the focal length of each lens in centimetres, state which lens bends parallel rays through a larger angle, and find their combined power when placed in contact.',
      hi: 'दो उत्तल लेंसों A तथा B की क्षमताएं क्रमशः +2.0 D तथा +5.0 D हैं। प्रत्येक की फोकस दूरी (सेमी में) ज्ञात कीजिए, बताइए कौन-सा लेंस समानांतर किरणों को अधिक मोड़ेगा, तथा संपर्क में रखने पर संयुक्त क्षमता ज्ञात कीजिए।',
    },
    claimOptions: [
      {
        en: 'f_A = +50 cm and f_B = +20 cm; Lens B (+5.0 D) has the shorter focal length so it bends rays more sharply; combined power P = +7.0 D.',
        hi: 'f_A = +50 cm तथा f_B = +20 cm; लेंस B (+5.0 D) की फोकस दूरी कम होने से वह किरणों को अधिक मोड़ता है; संयुक्त क्षमता P = +7.0 D।',
      },
      {
        en: 'f_A = +20 cm and f_B = +50 cm; Lens A bends rays more sharply.',
        hi: 'f_A = +20 cm तथा f_B = +50 cm; लेंस A किरणों को अधिक मोड़ता है।',
      },
    ],
    correctClaimIndex: 0,
    claimExplanation: {
      en: 'By f(cm) = 100/P, f_A = 100/2 = +50 cm and f_B = 100/5 = +20 cm. Higher power (+5.0 D) means shorter focal length (+20 cm) and sharper ray bending. Combined power P = +2.0 + 5.0 = +7.0 D.',
      hi: 'f(cm) = 100/P से f_A = +50 cm तथा f_B = +20 cm। अधिक क्षमता (+5.0 D) वाले लेंस B की फोकस दूरी कम (+20 cm) है इसलिए वह किरणों को अधिक मोड़ता है। संयुक्त क्षमता = +7.0 D।',
    },
    rubricPoints: [
      {
        en: 'Converts power to focal length in cm using f = 100/P: f_A = +50 cm (0.5 m) and f_B = +20 cm (0.2 m).',
        hi: 'f = 100/P का उपयोग करके फोकस दूरी निकालता है: f_A = +50 cm तथा f_B = +20 cm।',
      },
      {
        en: 'Explains that Lens B (+5.0 D, f = +20 cm) converges parallel rays closer to the optical centre (sharper bending).',
        hi: 'स्पष्ट करता है कि कम फोकस दूरी (+20 cm) वाला लेंस B (+5.0 D) किरणों को प्रकाशिक केंद्र के अधिक पास मोड़ता है।',
      },
      {
        en: 'Calculates net additive power in contact: P_net = P_A + P_B = +2.0 D + 5.0 D = +7.0 D.',
        hi: 'संपर्क में संयुक्त क्षमता की गणना करता है: P_कुल = +2.0 + 5.0 = +7.0 D।',
      },
    ],
  },
}

export interface RevisionEntry {
  conceptId: ConceptId
  threadId: ThreadId
  classLevel: 9 | 10
  chapterRef: string
  title: Localized
  oneLine: Localized
  governingFormula: string
  insightTerm: Localized
  insightSummary: Localized
  discoveryNotes: StoryStageSupplement['discoveryNotes']
  workedNumerical: StoryStageSupplement['workedNumerical']
  contrastTrap: StoryStageSupplement['contrastTrap']
  boardNumerical: ConceptCardContent['examQuestions'][number]
  hotsTask: StoryStageSupplement['hotsReasoningTask']
}

export function getAllRevisionEntries(): readonly RevisionEntry[] {
  const pilots = getPilotConcepts()
  return pilots.map((concept) => {
    const content = ALL_CONTENT_MAP[concept.id]
    const supplement =
      concept.id === 'lens-power-dioptre'
        ? LENS_POWER_DIOPTRE_SUPPLEMENT
        : STORY_STAGE_SUPPLEMENTS[concept.id as keyof typeof STORY_STAGE_SUPPLEMENTS]

    const classLevel = (concept.boardMapping[0]?.classLevel === 9 ? 9 : 10) as 9 | 10
    const chapterRef = concept.boardMapping[0]?.chapterRef ?? 'NCERT Physics'

    return {
      conceptId: concept.id,
      threadId: concept.thread,
      classLevel,
      chapterRef,
      title: concept.title,
      oneLine: concept.oneLine,
      governingFormula: content.insightFormula,
      insightTerm: content.insightTerm,
      insightSummary: content.insightSummary,
      discoveryNotes: supplement.discoveryNotes,
      workedNumerical: supplement.workedNumerical,
      contrastTrap: supplement.contrastTrap,
      boardNumerical: content.examQuestions[0],
      hotsTask: supplement.hotsReasoningTask,
    }
  })
}

export interface RevisionFilter {
  classLevel: 'all' | 9 | 10
  threadId: 'all' | ThreadId
  searchQuery: string
  flaggedOnly?: boolean
  flaggedIds?: ReadonlySet<string>
}

export function filterRevisionEntries(
  entries: readonly RevisionEntry[],
  filter: RevisionFilter
): readonly RevisionEntry[] {
  const q = filter.searchQuery.trim().toLowerCase()
  return entries.filter((entry) => {
    if (filter.classLevel !== 'all' && entry.classLevel !== filter.classLevel) return false
    if (filter.threadId !== 'all' && entry.threadId !== filter.threadId) return false
    if (filter.flaggedOnly && filter.flaggedIds && !filter.flaggedIds.has(entry.conceptId)) {
      return false
    }
    if (q.length > 0) {
      const hay = [
        entry.title.en,
        entry.title.hi,
        entry.oneLine.en,
        entry.oneLine.hi,
        entry.chapterRef,
        entry.governingFormula,
        entry.contrastTrap.trapTitle.en,
        entry.contrastTrap.trapTitle.hi,
      ]
        .join(' ')
        .toLowerCase()
      if (!hay.includes(q)) return false
    }
    return true
  })
}

export interface StudentQuestionResponse {
  numericalChoice?: number
  numericalLocked?: boolean
  claimChoice?: number
  claimLocked?: boolean
  writtenExplanation?: string
  rubricChecked?: readonly boolean[]
}

export interface BoardPaperScoreSummary {
  questionCount: number
  autoGradedNumericalAnswered: number
  autoGradedNumericalCorrect: number
  autoGradedClaimAnswered: number
  autoGradedClaimCorrect: number
  totalAutoGradedCorrect: number
  totalAutoGradedPossible: number
  selfAssessedRubricChecked: number
  selfAssessedRubricPossible: number
  weakConceptIds: readonly ConceptId[]
}

/**
 * Computes the student's Board Exam Simulator score while strictly separating
 * deterministic Auto-Graded items (Section A Numerical + Section B Part A Claim)
 * from Self-Assessed Part B written rubric checkboxes.
 */
export function computeBoardPaperScore(
  entries: readonly RevisionEntry[],
  responses: Record<string, StudentQuestionResponse>
): BoardPaperScoreSummary {
  let autoGradedNumericalAnswered = 0
  let autoGradedNumericalCorrect = 0
  let autoGradedClaimAnswered = 0
  let autoGradedClaimCorrect = 0
  let selfAssessedRubricChecked = 0
  const weakSet = new Set<ConceptId>()

  for (const entry of entries) {
    const resp = responses[entry.conceptId]
    if (!resp) continue

    if (resp.numericalLocked && typeof resp.numericalChoice === 'number') {
      autoGradedNumericalAnswered += 1
      if (resp.numericalChoice === entry.boardNumerical.correctIndex) {
        autoGradedNumericalCorrect += 1
      } else {
        weakSet.add(entry.conceptId)
      }
    }

    if (resp.claimLocked && typeof resp.claimChoice === 'number') {
      autoGradedClaimAnswered += 1
      if (resp.claimChoice === entry.hotsTask.correctClaimIndex) {
        autoGradedClaimCorrect += 1
      } else {
        weakSet.add(entry.conceptId)
      }
    }

    if (resp.rubricChecked) {
      selfAssessedRubricChecked += resp.rubricChecked.filter(Boolean).length
    }
  }

  return {
    questionCount: entries.length,
    autoGradedNumericalAnswered,
    autoGradedNumericalCorrect,
    autoGradedClaimAnswered,
    autoGradedClaimCorrect,
    totalAutoGradedCorrect: autoGradedNumericalCorrect + autoGradedClaimCorrect,
    totalAutoGradedPossible: entries.length * 2,
    selfAssessedRubricChecked,
    selfAssessedRubricPossible: entries.length * 3,
    weakConceptIds: Array.from(weakSet),
  }
}
