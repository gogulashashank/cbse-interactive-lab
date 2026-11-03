import type { Localized } from '../kit/i18n'

export type ThreadId = 'rate-vs-total' | 'squares-and-inverses' | 'energy-conservation' | 'controlled-experiments'

export interface ThreadRecord {
  id: ThreadId
  title: Localized
  tagline: Localized
}

export type ConceptId =
  | 'rate-vs-total-intro'
  | 'current-vs-charge'
  | 'power-vs-energy'
  | 'units-on-the-bill'
  | 'inverse-area-scaling'
  | 'diameter-trap'
  | 'voltage-squared-power'
  | 'gravity-inverse-square'
  | 'mapped-ohms-law'
  | 'mapped-series-parallel'
  | 'mapped-resistivity'
  | 'mapped-power-heating'
  | 'mapped-billing'
  | 'mapped-safety'
  | 'mapped-convex-lens'
  | 'mapped-ramp'

export interface BoardMapping {
  board: 'CBSE' | 'ICSE' | 'State'
  classLevel: number
  chapterRef: string
}

export interface ConceptRecord {
  id: ConceptId
  thread: ThreadId
  title: Localized
  oneLine: Localized
  prerequisites: ConceptId[]
  misconceptionIds: string[]
  contexts: Localized[]
  boardMapping: BoardMapping[]
  deepDiveRoute?: string
  status: 'pilot' | 'mapped'
}

export const THREADS: readonly ThreadRecord[] = [
  {
    id: 'rate-vs-total',
    title: { en: 'Rate vs Total', hi: 'दर बनाम कुल (Rate vs Total)' },
    tagline: {
      en: 'Master how speed, current, power, and bills share the exact same mathematical pattern: Total = Rate × Time.',
      hi: 'गति, विद्युत धारा, शक्ति और बिजली बिल का एक ही गणितीय नियम समझें: कुल = दर × समय।',
    },
  },
  {
    id: 'squares-and-inverses',
    title: { en: 'Squares & Inverse Effects', hi: 'वर्ग एवं व्युत्क्रम प्रभाव (Squares & Inverses)' },
    tagline: {
      en: 'Conquer the biggest board-exam trap: when quantities scale by squares (4×, 9×) or invert (1/2, 1/4).',
      hi: 'बोर्ड परीक्षा का सबसे बड़ा जाल समझें: जब चीजें वर्ग (4×, 9×) या व्युत्क्रम (1/2, 1/4) में बदलती हैं।',
    },
  },
]

export const CONCEPTS: readonly ConceptRecord[] = [
  // Thread 1: Rate vs Total
  {
    id: 'rate-vs-total-intro',
    thread: 'rate-vs-total',
    title: { en: 'Tap and Bucket: The Core Pattern', hi: 'नल और बाल्टी: दर और कुल का मूल नियम' },
    oneLine: {
      en: 'Total accumulated amount equals the flow rate multiplied by time (Total = Rate × Time).',
      hi: 'कुल जमा मात्रा बराबर होती है बहाव की दर गुणा समय (कुल = दर × समय)।',
    },
    prerequisites: [],
    misconceptionIds: ['rate-equals-total'],
    contexts: [{ en: 'Water tap filling a household bucket', hi: 'घर में नल से बाल्टी भरना' }],
    boardMapping: [{ board: 'CBSE', classLevel: 9, chapterRef: 'Motion / Work & Energy' }],
    status: 'pilot',
  },
  {
    id: 'current-vs-charge',
    thread: 'rate-vs-total',
    title: { en: 'Electric Current vs Charge (I = Q/t)', hi: 'विद्युत धारा बनाम आवेश (I = Q/t)' },
    oneLine: {
      en: 'Electric current is the rate of flow of electric charge (Q = I × t). Current is NOT consumed.',
      hi: 'विद्युत धारा आवेश के प्रवाह की दर है (Q = I × t)। धारा "खर्च" नहीं होती।',
    },
    prerequisites: ['rate-vs-total-intro'],
    misconceptionIds: ['current-is-consumed'],
    contexts: [{ en: 'Mobile charger current in amperes', hi: 'मोबाइल चार्जर की धारा (एम्पीयर)' }],
    boardMapping: [{ board: 'CBSE', classLevel: 10, chapterRef: 'Chapter 12: Electricity (12.1)' }],
    status: 'pilot',
  },
  {
    id: 'power-vs-energy',
    thread: 'rate-vs-total',
    title: { en: 'Electric Power vs Energy (E = P × t)', hi: 'विद्युत शक्ति बनाम ऊर्जा (E = P × t)' },
    oneLine: {
      en: 'Power in Watts is the rate of doing electrical work. Total energy transferred in Joules is E = P × t.',
      hi: 'वाट (Watt) में शक्ति ऊर्जा परिवर्तन की दर है। कुल ऊर्जा जूल में E = P × t होती है।',
    },
    prerequisites: ['rate-vs-total-intro'],
    misconceptionIds: ['higher-watt-always-more-energy'],
    contexts: [{ en: 'LED bulb (10 W) vs Mixer grinder (500 W)', hi: 'एलईडी बल्ब (10 W) बनाम मिक्सी (500 W)' }],
    boardMapping: [{ board: 'CBSE', classLevel: 10, chapterRef: 'Chapter 12: Electricity (12.8)' }],
    deepDiveRoute: '/power-heating',
    status: 'pilot',
  },
  {
    id: 'units-on-the-bill',
    thread: 'rate-vs-total',
    title: { en: 'Kilowatt-Hour & Electricity Bills', hi: 'किलोवाट-घंटा और बिजली का बिल' },
    oneLine: {
      en: 'Electricity boards charge for ENERGY (kWh or "Units"), not power or current. 1 Unit = 1 kWh = 3.6 × 10⁶ J.',
      hi: 'बिजली बोर्ड ऊर्जा (kWh या "यूनिट") का बिल लेता है, शक्ति का नहीं। 1 यूनिट = 1 kWh = 3.6 × 10⁶ जूल।',
    },
    prerequisites: ['power-vs-energy'],
    misconceptionIds: ['electricity-board-bills-for-power'],
    contexts: [{ en: 'Winter geyser running 30 mins vs refrigerator running all day', hi: 'सर्दियों में गीज़र 30 मिनट बनाम फ्रिज दिन भर' }],
    boardMapping: [{ board: 'CBSE', classLevel: 10, chapterRef: 'Chapter 12: Electricity (12.9)' }],
    deepDiveRoute: '/billing',
    status: 'pilot',
  },

  // Thread 2: Squares and Inverses
  {
    id: 'inverse-area-scaling',
    thread: 'squares-and-inverses',
    title: { en: 'Thick vs Thin Wires (R ∝ 1/A)', hi: 'मोटा बनाम पतला तार (R ∝ 1/A)' },
    oneLine: {
      en: 'Resistance is inversely proportional to cross-sectional area: doubling area cuts resistance in half.',
      hi: 'प्रतिरोध क्षेत्रफल के व्युत्क्रमानुपाती है: क्षेत्रफल दोगुना करने पर प्रतिरोध आधा हो जाता है।',
    },
    prerequisites: [],
    misconceptionIds: ['area-doubling-doubles-resistance'],
    contexts: [{ en: 'Thick heavy-appliance cord vs thin mobile charging lead', hi: 'मोटा हीटर कॉर्ड बनाम पतला चार्जर तार' }],
    boardMapping: [{ board: 'CBSE', classLevel: 10, chapterRef: 'Chapter 12: Electricity (12.5)' }],
    deepDiveRoute: '/resistivity',
    status: 'pilot',
  },
  {
    id: 'diameter-trap',
    thread: 'squares-and-inverses',
    title: { en: 'The Diameter Trap (R ∝ 1/d²)', hi: 'व्यास का वर्ग नियम (R ∝ 1/d²)' },
    oneLine: {
      en: 'Because Area = πd²/4, doubling diameter quadruples area (4×) and quarters resistance (R/4)!',
      hi: 'क्षेत्रफल A = πd²/4 होने से व्यास 2× करने पर क्षेत्रफल 4× और प्रतिरोध 1/4 (R/4) रह जाता है!',
    },
    prerequisites: ['inverse-area-scaling'],
    misconceptionIds: ['diameter-doubles-halves-resistance'],
    contexts: [{ en: 'Standard SWG wire gauges in domestic wiring', hi: 'घरेलू वायरिंग के तार का व्यास (गेज)' }],
    boardMapping: [{ board: 'CBSE', classLevel: 10, chapterRef: 'Chapter 12: Electricity (12.5)' }],
    deepDiveRoute: '/resistivity',
    status: 'pilot',
  },
  {
    id: 'voltage-squared-power',
    thread: 'squares-and-inverses',
    title: { en: 'Voltage Squared in Power (P ∝ V²)', hi: 'वोल्टेज का वर्ग और शक्ति (P ∝ V²)' },
    oneLine: {
      en: 'At constant resistance, doubling voltage quadruples power and heat generation (P = V²/R).',
      hi: 'स्थिर प्रतिरोध पर वोल्टेज दोगुनी करने पर शक्ति और ऊष्मा 4 गुना हो जाती है (P = V²/R)।',
    },
    prerequisites: ['power-vs-energy'],
    misconceptionIds: ['voltage-doubles-doubles-power'],
    contexts: [{ en: '110 V overseas appliance plugged into Indian 220 V socket', hi: '110 V का उपकरण 220 V सॉकेट में लगाने पर' }],
    boardMapping: [{ board: 'CBSE', classLevel: 10, chapterRef: 'Chapter 12: Electricity (12.8)' }],
    deepDiveRoute: '/power-heating',
    status: 'pilot',
  },
  {
    id: 'gravity-inverse-square',
    thread: 'squares-and-inverses',
    title: { en: 'Universal Inverse-Square Law (F ∝ 1/r²)', hi: 'सार्वत्रिक व्युत्क्रम-वर्ग नियम (F ∝ 1/r²)' },
    oneLine: {
      en: 'Gravitational attraction weakens with the square of distance: doubling distance reduces force to 1/4th.',
      hi: 'दूरी दोगुनी करने पर गुरुत्वाकर्षण बल घटकर एक-चौथाई (1/4) रह जाता है (F ∝ 1/r²)।',
    },
    prerequisites: [],
    misconceptionIds: ['distance-doubles-halves-gravity'],
    contexts: [{ en: 'Space satellite orbiting Earth at high altitude', hi: 'पृथ्वी की कक्षा में उपग्रह की दूरी' }],
    boardMapping: [{ board: 'CBSE', classLevel: 9, chapterRef: 'Chapter 10: Gravitation' }],
    deepDiveRoute: '/',
    status: 'pilot',
  },

  // Mapped existing lessons
  {
    id: 'mapped-ohms-law',
    thread: 'rate-vs-total',
    title: { en: 'Ohm’s Law & Resistance', hi: 'ओम का नियम और प्रतिरोध' },
    oneLine: { en: 'Potential difference across a conductor is proportional to current (V = IR).', hi: 'विभवांतर धारा के समानुपाती होता है (V = IR)।' },
    prerequisites: ['current-vs-charge'],
    misconceptionIds: ['resistors-consume-current'],
    contexts: [{ en: 'Adjustable DC circuit bench', hi: 'डीसी सर्किट बेंच' }],
    boardMapping: [{ board: 'CBSE', classLevel: 10, chapterRef: 'Chapter 12: Electricity (12.2)' }],
    deepDiveRoute: '/electricity',
    status: 'mapped',
  },
  {
    id: 'mapped-series-parallel',
    thread: 'rate-vs-total',
    title: { en: 'Series and Parallel Circuits', hi: 'श्रेणीक्रम और पार्श्वक्रम परिपथ' },
    oneLine: { en: 'Compare one path vs two paths: total resistance decreases in parallel.', hi: 'एक मार्ग बनाम दो मार्ग: पार्श्वक्रम में कुल प्रतिरोध घटता है।' },
    prerequisites: ['mapped-ohms-law'],
    misconceptionIds: ['parallel-increases-resistance'],
    contexts: [{ en: 'Home wiring parallel connections', hi: 'घरेलू वायरिंग के समानांतर कनेक्शन' }],
    boardMapping: [{ board: 'CBSE', classLevel: 10, chapterRef: 'Chapter 12: Electricity (12.6)' }],
    deepDiveRoute: '/series-parallel',
    status: 'mapped',
  },
  {
    id: 'mapped-resistivity',
    thread: 'rate-vs-total',
    title: { en: 'Resistivity and Wire Design', hi: 'प्रतिरोधकता और तार का आकार' },
    oneLine: { en: 'Resistance depends on geometry (R = ρL/A), but resistivity ρ is a material property.', hi: 'प्रतिरोध लंबाई और क्षेत्रफल पर निर्भर करता है, पर प्रतिरोधकता पदार्थ का गुण है।' },
    prerequisites: ['mapped-ohms-law'],
    misconceptionIds: ['stretching-changes-resistivity'],
    contexts: [{ en: 'Copper transmission wire vs nichrome heating coil', hi: 'तांबे का तार बनाम नाइक्रोम हीटिंग कॉइल' }],
    boardMapping: [{ board: 'CBSE', classLevel: 10, chapterRef: 'Chapter 12: Electricity (12.5)' }],
    deepDiveRoute: '/resistivity',
    status: 'mapped',
  },
  {
    id: 'mapped-power-heating',
    thread: 'rate-vs-total',
    title: { en: 'Joule Heating & Power', hi: 'जूल का तापन नियम और शक्ति' },
    oneLine: { en: 'Pure Joule heating model: H = I²Rt = Pt.', hi: 'जूल तापन: H = I²Rt = Pt।' },
    prerequisites: ['power-vs-energy'],
    misconceptionIds: ['higher-resistance-always-more-heat'],
    contexts: [{ en: 'Electric toaster and heating element', hi: 'इलेक्ट्रिक टोस्टर और हीटर' }],
    boardMapping: [{ board: 'CBSE', classLevel: 10, chapterRef: 'Chapter 12: Electricity (12.7)' }],
    deepDiveRoute: '/power-heating',
    status: 'mapped',
  },
  {
    id: 'mapped-billing',
    thread: 'rate-vs-total',
    title: { en: 'Commercial Utility Energy Billing', hi: 'घरेलू बिजली बिल और मीटर' },
    oneLine: { en: 'Calculate monthly units and utility bill costs across appliances.', hi: 'महीने की यूनिट और बिजली खर्च की गणना करें।' },
    prerequisites: ['units-on-the-bill'],
    misconceptionIds: ['billing-charges-current'],
    contexts: [{ en: 'Monthly DISCOM utility bill meter', hi: 'बिजली बोर्ड का मीटर' }],
    boardMapping: [{ board: 'CBSE', classLevel: 10, chapterRef: 'Chapter 12: Electricity (12.9)' }],
    deepDiveRoute: '/billing',
    status: 'mapped',
  },
  {
    id: 'mapped-safety',
    thread: 'rate-vs-total',
    title: { en: 'Domestic Safety: Fuses and Earthing', hi: 'घरेलू सुरक्षा: फ़्यूज़ और भूसंपर्कन' },
    oneLine: { en: 'How a fuse wire melts under overload and how earthing protects from lethal shock.', hi: 'ओवरलोड में फ़्यूज़ तार का पिघलना और करंट से बचाव।' },
    prerequisites: ['mapped-series-parallel'],
    misconceptionIds: ['fuse-high-melting-point', 'earthing-saves-energy'],
    contexts: [{ en: '3-pin plug and metal body iron', hi: '3-पिन प्लग और प्रेस की बॉडी' }],
    boardMapping: [{ board: 'CBSE', classLevel: 10, chapterRef: 'Chapter 13: Magnetic Effects (13.4)' }],
    deepDiveRoute: '/safety',
    status: 'mapped',
  },
  {
    id: 'mapped-convex-lens',
    thread: 'rate-vs-total',
    title: { en: 'Convex Lens Image Formation', hi: 'उत्तल लेंस द्वारा प्रतिबिंब निर्माण' },
    oneLine: { en: 'Explore real and virtual images across lens formula 1/v - 1/u = 1/f.', hi: 'लेंस सूत्र द्वारा वास्तविक व आभासी प्रतिबिंब देखें।' },
    prerequisites: [],
    misconceptionIds: ['sign-convention-confusion'],
    contexts: [{ en: 'Magnifying glass and optical bench', hi: 'आवर्धक लेंस और प्रकाशिक बेंच' }],
    boardMapping: [{ board: 'CBSE', classLevel: 10, chapterRef: 'Chapter 9: Light' }],
    deepDiveRoute: '/alternative',
    status: 'mapped',
  },
  {
    id: 'mapped-ramp',
    thread: 'rate-vs-total',
    title: { en: 'Inclined Plane: Work Conservation', hi: 'आनत तल: कार्य संरक्षण' },
    oneLine: { en: 'Ramps reduce input force by increasing distance: Work = Force × Distance remains constant.', hi: 'दूरी बढ़ाकर बल कम किया जाता है: कार्य स्थिर रहता है।' },
    prerequisites: [],
    misconceptionIds: ['ramps-reduce-work'],
    contexts: [{ en: 'Wheelchair ramp and heavy loading', hi: 'व्हीलचेयर रैंप' }],
    boardMapping: [{ board: 'CBSE', classLevel: 9, chapterRef: 'Work and Energy' }],
    deepDiveRoute: '/',
    status: 'mapped',
  },
]

export function getConceptById(id: string): ConceptRecord | undefined {
  return CONCEPTS.find((c) => c.id === id)
}

export function getPilotConcepts(): ConceptRecord[] {
  return CONCEPTS.filter((c) => c.status === 'pilot')
}
