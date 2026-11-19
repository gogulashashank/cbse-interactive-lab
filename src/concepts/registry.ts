import type { Localized } from '../kit/i18n'

export type ThreadId =
  | 'rate-vs-total'
  | 'squares-and-inverses'
  | 'energy-conservation'
  | 'controlled-experiments'
  | 'conventions-and-inversions'

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
  | 'fixed-voltage-vs-current'
  | 'stretching-vs-comparing'
  | 'constant-temp-ohmic'
  | 'series-parallel-failure'
  | 'electrical-energy-transfer'
  | 'charge-conservation-junction'
  | 'circuit-power-balance'
  | 'mechanical-ramp-conservation'
  | 'cartesian-sign-trap'
  | 'real-vs-virtual-switch'
  | 'magnification-code'
  | 'lens-power-dioptre'
  | 'velocity-time-graph-area'
  | 'momentum-impulse-cushion'
  | 'archimedes-buoyancy-float'
  | 'sound-echo-wave-speed'
  | 'eye-defects-correction'
  | 'prism-dispersion-scattering'
  | 'magnetic-field-solenoid'
  | 'motor-force-flemings-rule'
  | 'chemical-equation-mass-balance'
  | 'ph-scale-exponential-acid'
  | 'metal-reactivity-displacement'
  | 'carbon-homologous-series'
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
  {
    id: 'controlled-experiments',
    title: { en: 'What is Held Fixed?', hi: 'क्या स्थिर रखा गया है? (Controlled Experiments)' },
    tagline: {
      en: 'The #1 source of board mistakes: pick the right formula based on what is kept constant (fixed V vs fixed I, stretching vs cutting).',
      hi: 'बोर्ड परीक्षा की सबसे बड़ी भूल से बचें: देखें क्या स्थिर है (समानांतर में V या श्रेणीक्रम में I; खींचने पर आयतन या तार बदलना)।',
    },
  },
  {
    id: 'energy-conservation',
    title: { en: 'Conservation of Energy & Charge', hi: 'ऊर्जा एवं आवेश संरक्षण (Conservation)' },
    tagline: {
      en: 'Energy cannot vanish: see how electrical work becomes heat, charges never disappear at junctions, and battery power balances the loads.',
      hi: 'ऊर्जा कभी नष्ट नहीं होती: देखें विद्युत कार्य कैसे ऊष्मा बनता है, जोड़ पर आवेश सुरक्षित रहता है और बैटरी शक्ति लोड को संतुलित करती है।',
    },
  },
  {
    id: 'conventions-and-inversions',
    title: { en: 'Optics: Signs & Inversions', hi: 'प्रकाशिकी: चिह्न एवं प्रतिबिंब (Optics & Signs)' },
    tagline: {
      en: 'Master Class 10 Light numericals without memorization: Cartesian +/- signs, the focal crossover point, magnification decoding, and Dioptres.',
      hi: 'बिना रटे कक्षा 10 प्रकाशिकी के सवाल हल करें: कार्तीय चिह्न (+/-), फोकस संक्रमण बिंदु, आवर्धन डिकोडिंग और लेंस की क्षमता (डाइऑप्टर)।',
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

  // Thread 3: Controlled Experiments ("What is Held Fixed?")
  {
    id: 'fixed-voltage-vs-current',
    thread: 'controlled-experiments',
    title: { en: 'Fixed V vs Fixed I: The Power Paradox', hi: 'स्थिर वोल्टेज बनाम स्थिर धारा: शक्ति का द्वंद्व' },
    oneLine: {
      en: 'In parallel (fixed V), lower R draws MORE power (P = V²/R). In series (fixed I), higher R consumes MORE power (P = I²R)!',
      hi: 'समानांतर (स्थिर V) में कम प्रतिरोध अधिक शक्ति खींचता है (P = V²/R)। श्रेणीक्रम (स्थिर I) में अधिक प्रतिरोध अधिक शक्ति लेता है (P = I²R)!',
    },
    prerequisites: ['power-vs-energy', 'voltage-squared-power'],
    misconceptionIds: ['higher-r-always-more-heat', 'same-formula-fits-all'],
    contexts: [{ en: '60 W vs 100 W bulb in house wiring vs Diwali series string', hi: 'घर में 60W व 100W बल्ब बनाम दिवाली की लड़ियाँ' }],
    boardMapping: [{ board: 'CBSE', classLevel: 10, chapterRef: 'Chapter 12: Electricity (12.8)' }],
    deepDiveRoute: '/power-heating',
    status: 'pilot',
  },
  {
    id: 'stretching-vs-comparing',
    thread: 'controlled-experiments',
    title: { en: 'Stretching vs Comparing Wires (n² vs n)', hi: 'तार खींचना बनाम अलग तार: आयतन संरक्षण (n² बनाम n)' },
    oneLine: {
      en: 'Doubling length by taking a longer wire doubles R (2×). Stretching the SAME wire doubles L but halves A, quadrupling R (4×)!',
      hi: 'दूसरा लंबा तार लेने पर R 2 गुना होता है। लेकिन उसी तार को खींचने पर लंबाई 2× और क्षेत्रफल आधा होने से R 4 गुना (n²) हो जाता है!',
    },
    prerequisites: ['inverse-area-scaling', 'diameter-trap'],
    misconceptionIds: ['stretching-only-changes-length', 'volume-changes-on-stretching'],
    contexts: [{ en: 'Drawing copper wire into a thinner gauge in industry', hi: 'फैक्ट्री में तांबे के तार को खींचकर पतला करना' }],
    boardMapping: [{ board: 'CBSE', classLevel: 10, chapterRef: 'Chapter 12: Electricity (12.5)' }],
    deepDiveRoute: '/resistivity',
    status: 'pilot',
  },
  {
    id: 'constant-temp-ohmic',
    thread: 'controlled-experiments',
    title: { en: 'Ohm’s Law Condition: "Constant Temperature"', hi: 'ओम के नियम की शर्त: "स्थिर तापमान"' },
    oneLine: {
      en: 'V ∝ I holds ONLY when temperature is constant. Real incandescent bulbs heat up, increasing R and bending the V-I curve!',
      hi: 'V ∝ I केवल तभी लागू होता है जब तापमान स्थिर रहे। बल्ब गर्म होने पर उसका प्रतिरोध बढ़ जाता है और V-I वक्र मुड़ जाता है!',
    },
    prerequisites: ['mapped-ohms-law'],
    misconceptionIds: ['ohms-law-always-linear', 'temperature-has-no-effect'],
    contexts: [{ en: 'Tungsten filament bulb V-I characteristic vs nichrome wire', hi: 'टंगस्टन बल्ब का V-I ग्राफ बनाम नाइक्रोम तार' }],
    boardMapping: [{ board: 'CBSE', classLevel: 10, chapterRef: 'Chapter 12: Electricity (12.2)' }],
    deepDiveRoute: '/electricity',
    status: 'pilot',
  },
  {
    id: 'series-parallel-failure',
    thread: 'controlled-experiments',
    title: { en: 'Failure Modes: Series vs Parallel', hi: 'खराबी का प्रभाव: श्रेणीक्रम बनाम पार्श्वक्रम' },
    oneLine: {
      en: 'In series, 1 blown bulb breaks the only circuit loop and kills all bulbs. In parallel, each appliance has its own path.',
      hi: 'श्रेणीक्रम में 1 बल्ब फ्यूज होने से पूरा परिपथ टूट जाता है। समानांतर में प्रत्येक उपकरण का स्वतंत्र परिपथ रहता है।',
    },
    prerequisites: ['mapped-series-parallel'],
    misconceptionIds: ['parallel-failure-affects-all', 'series-is-more-reliable'],
    contexts: [{ en: 'Diwali fairy lights vs domestic kitchen and bedroom lighting', hi: 'दीपावली की लड़ियाँ बनाम घर के कमरे की लाइट' }],
    boardMapping: [{ board: 'CBSE', classLevel: 10, chapterRef: 'Chapter 12: Electricity (12.6)' }],
    deepDiveRoute: '/series-parallel',
    status: 'pilot',
  },

  // Thread 4: Conservation of Energy & Charge
  {
    id: 'electrical-energy-transfer',
    thread: 'energy-conservation',
    title: { en: 'Electrical Energy into Heat (E = VIt)', hi: 'विद्युत ऊर्जा का ऊष्मा में रूपांतरण (E = VIt)' },
    oneLine: {
      en: 'Electrical work done on charges transfers completely into internal thermal energy: E = V·I·t = I²Rt.',
      hi: 'आवेशों पर किया गया कुल विद्युत कार्य पूर्णतः आंतरिक तापीय ऊर्जा में बदल जाता है: E = V·I·t = I²Rt।',
    },
    prerequisites: ['power-vs-energy'],
    misconceptionIds: ['energy-disappears-in-resistors'],
    contexts: [{ en: 'Water immersion heater and electric geyser', hi: 'पानी का हीटर और गीज़र' }],
    boardMapping: [{ board: 'CBSE', classLevel: 10, chapterRef: 'Chapter 12: Electricity (12.7)' }],
    deepDiveRoute: '/power-heating',
    status: 'pilot',
  },
  {
    id: 'charge-conservation-junction',
    thread: 'energy-conservation',
    title: { en: 'Charge Conservation at Junctions (Σ I_in = Σ I_out)', hi: 'जोड़ पर आवेश संरक्षण (Σ I_in = Σ I_out)' },
    oneLine: {
      en: 'Electric charge cannot pool or vanish at wire joints: incoming currents strictly equal outgoing currents.',
      hi: 'तार के जोड़ पर आवेश न तो जमा हो सकता है न गायब: आने वाली धाराओं का योग जाने वाली धाराओं के ठीक बराबर होता है।',
    },
    prerequisites: ['current-vs-charge', 'mapped-series-parallel'],
    misconceptionIds: ['current-consumed-at-junctions', 'charges-get-lost'],
    contexts: [{ en: 'T-junction in household circuit wiring', hi: 'घरेलू वायरिंग में टी-जंक्शन' }],
    boardMapping: [{ board: 'CBSE', classLevel: 10, chapterRef: 'Chapter 12: Electricity (12.6)' }],
    deepDiveRoute: '/series-parallel',
    status: 'pilot',
  },
  {
    id: 'circuit-power-balance',
    thread: 'energy-conservation',
    title: { en: 'Circuit Power Balance (P_source = Σ P_loads)', hi: 'परिपथ शक्ति संतुलन (P_स्रोत = Σ P_लोड)' },
    oneLine: {
      en: 'Total power delivered by the electrical source always matches the sum of powers dissipated by every load.',
      hi: 'बैटरी या मेन्स द्वारा दी गई कुल शक्ति परिपथ के सभी उपकरणों द्वारा खर्च की गई शक्तियों के योग के बराबर होती है।',
    },
    prerequisites: ['fixed-voltage-vs-current', 'power-vs-energy'],
    misconceptionIds: ['power-created-or-lost-in-branching'],
    contexts: [{ en: 'Parallel lamps in domestic 220 V supply', hi: '220 V मेन्स पर समानांतर लैम्प' }],
    boardMapping: [{ board: 'CBSE', classLevel: 10, chapterRef: 'Chapter 12: Electricity (12.8)' }],
    deepDiveRoute: '/power-heating',
    status: 'pilot',
  },
  {
    id: 'mechanical-ramp-conservation',
    thread: 'energy-conservation',
    title: { en: 'Mechanical Energy on a Ramp (PE + KE = Const)', hi: 'आनत तल पर यांत्रिक ऊर्जा (PE + KE = स्थिर)' },
    oneLine: {
      en: 'As an object descends a frictionless incline, potential energy transfers smoothly into kinetic energy.',
      hi: 'घर्षणहीन आनत तल पर वस्तु के नीचे आते समय स्थितिज ऊर्जा गतिज ऊर्जा में बदलती है, कुल योग स्थिर रहता है।',
    },
    prerequisites: [],
    misconceptionIds: ['energy-lost-sliding-down'],
    contexts: [{ en: 'Roller coaster descent and ramp experiment', hi: 'रोलर कोस्टर और रैंप प्रयोग' }],
    boardMapping: [{ board: 'CBSE', classLevel: 9, chapterRef: 'Chapter 11: Work and Energy' }],
    deepDiveRoute: '/',
    status: 'pilot',
  },

  // Thread 5: Optics — Conventions & Inversions
  {
    id: 'cartesian-sign-trap',
    thread: 'conventions-and-inversions',
    title: { en: 'New Cartesian Sign Trap (u, v, f)', hi: 'नई कार्तीय चिह्न परिपाटी (u, v, f)' },
    oneLine: {
      en: 'Object distance u is ALWAYS negative (-). Convex has positive focus (+f); Concave has negative focus (-f).',
      hi: 'बिंब दूरी u सदैव ऋणात्मक (-) होती है। उत्तल की फोकस दूरी धनात्मक (+f) और अवतल की ऋणात्मक (-f) होती है।',
    },
    prerequisites: [],
    misconceptionIds: ['positive-object-distance', 'concave-positive-focus'],
    contexts: [{ en: 'Optical bench ray measurements', hi: 'प्रकाशिक बेंच पर दूरियां मापना' }],
    boardMapping: [{ board: 'CBSE', classLevel: 10, chapterRef: 'Chapter 9: Light (9.2.3 & 9.3.4)' }],
    deepDiveRoute: '/alternative',
    status: 'pilot',
  },
  {
    id: 'real-vs-virtual-switch',
    thread: 'conventions-and-inversions',
    title: { en: 'The Focal Crossover: Real vs Virtual', hi: 'फोकस संक्रमण: वास्तविक बनाम आभासी' },
    oneLine: {
      en: 'Outside F (|u| > f), a convex lens forms a Real & Inverted image. Inside F (|u| < f), it flips to Virtual, Erect & Magnified!',
      hi: 'फोकस F के बाहर (|u| > f) उत्तल लेंस वास्तविक व उल्टा प्रतिबिंब बनाता है। F के भीतर (|u| < f) यह आभासी, सीधा व बड़ा हो जाता है!',
    },
    prerequisites: ['cartesian-sign-trap'],
    misconceptionIds: ['convex-always-real', 'magnifying-glass-outside-focus'],
    contexts: [{ en: 'Cinema projector vs reading magnifying glass', hi: 'सिनेमा प्रोजेक्टर बनाम पढ़ने का आवर्धक लेंस' }],
    boardMapping: [{ board: 'CBSE', classLevel: 10, chapterRef: 'Chapter 9: Light (9.3.3)' }],
    deepDiveRoute: '/alternative',
    status: 'pilot',
  },
  {
    id: 'magnification-code',
    thread: 'conventions-and-inversions',
    title: { en: 'Decoding Magnification (m = ±|m|)', hi: 'आवर्धन का दोहरा संकेत (m = ±|m|)' },
    oneLine: {
      en: 'Sign of m reveals orientation (- = Real/Inverted, + = Virtual/Erect); magnitude |m| reveals relative size (<1 smaller, >1 larger).',
      hi: 'm का चिह्न प्रकृति बताता है (- = वास्तविक/उल्टा, + = आभासी/सीधा); परिमाण |m| आकार बताता है (<1 छोटा, >1 बड़ा)।',
    },
    prerequisites: ['cartesian-sign-trap', 'real-vs-virtual-switch'],
    misconceptionIds: ['negative-magnification-means-diminished'],
    contexts: [{ en: 'Rear-view convex mirror (+0.3) vs projector (-3.0)', hi: 'वाहन का उत्तल दर्पण (+0.3) बनाम प्रोजेक्टर (-3.0)' }],
    boardMapping: [{ board: 'CBSE', classLevel: 10, chapterRef: 'Chapter 9: Light (9.2.4 & 9.3.5)' }],
    deepDiveRoute: '/alternative',
    status: 'pilot',
  },
  {
    id: 'lens-power-dioptre',
    thread: 'conventions-and-inversions',
    title: { en: 'Lens Power & The Centimetre Trap (P = 100/f_cm)', hi: 'लेंस की क्षमता और सेमी का जाल (P = 100/f_cm)' },
    oneLine: {
      en: 'Dioptre is defined per METRE (P = 1/f_m = 100/f_cm). Shorter focal length means sharper ray bending and higher power!',
      hi: 'डाइऑप्टर मीटर में परिभाषित है (P = 1/f_m = 100/f_cm)। कम फोकस दूरी का अर्थ है अधिक मोड़ और अधिक क्षमता!',
    },
    prerequisites: ['cartesian-sign-trap', 'inverse-area-scaling'],
    misconceptionIds: ['dioptre-uses-centimetres'],
    contexts: [{ en: 'Optometrist eye prescription (+2.0 D vs -1.5 D)', hi: 'चश्मे का नंबर (+2.0 D बनाम -1.5 D)' }],
    boardMapping: [{ board: 'CBSE', classLevel: 10, chapterRef: 'Chapter 9: Light (9.3.6)' }],
    deepDiveRoute: '/alternative',
    status: 'pilot',
  },

  // Class 9 Physics Expansion: Motion, Force & Laws of Motion, Floatation, and Sound
  {
    id: 'velocity-time-graph-area',
    thread: 'rate-vs-total',
    title: {
      en: 'Velocity–Time Graph: Slope vs Area Under the Curve',
      hi: 'वेग–समय ग्राफ: ढाल (त्वरण) बनाम क्षेत्रफल (विस्थापन)',
    },
    oneLine: {
      en: 'Slope Δv/Δt gives the rate of change (acceleration a), while shaded area under the v–t line gives accumulated displacement (s = ut + ½at²).',
      hi: 'ग्राफ की ढाल Δv/Δt त्वरण (a) देती है, जबकि v–t रेखा के नीचे का क्षेत्रफल कुल विस्थापन (s = ut + ½at²) देता है।',
    },
    prerequisites: ['rate-vs-total-intro'],
    misconceptionIds: ['vt-slope-is-distance', 'vt-area-ignores-initial-velocity'],
    contexts: [{ en: 'Train accelerating along a straight track', hi: 'सीधी पटरी पर त्वरित होती रेलगाड़ी' }],
    boardMapping: [{ board: 'CBSE', classLevel: 9, chapterRef: 'Chapter 7: Motion (7.4)' }],
    status: 'pilot',
  },
  {
    id: 'momentum-impulse-cushion',
    thread: 'controlled-experiments',
    title: {
      en: 'Second Law of Motion: Why Fielding Hands Pull Back (F = Δp/Δt)',
      hi: 'गति का द्वितीय नियम: कैच लेते समय हाथ पीछे क्यों खींचते हैं? (F = Δp/Δt)',
    },
    oneLine: {
      en: 'Stopping an incoming ball requires a fixed momentum change Δp = mu; extending stopping time Δt inversely slashes peak impact force F.',
      hi: 'आती हुई गेंद को रोकने के लिए संवेग परिवर्तन Δp = mu स्थिर रहता है; समय Δt बढ़ाने से चोट का बल F व्युत्क्रमानुपाती रूप से घटता है।',
    },
    prerequisites: ['inverse-area-scaling'],
    misconceptionIds: ['pulling-hands-back-reduces-momentum-change'],
    contexts: [{ en: 'Cricket fielder catching a fast ball & car airbags', hi: 'क्रिकेट खिलाड़ी द्वारा कैच लेना और कार एयरबैग' }],
    boardMapping: [{ board: 'CBSE', classLevel: 9, chapterRef: 'Chapter 8: Force and Laws of Motion (8.4)' }],
    status: 'pilot',
  },
  {
    id: 'archimedes-buoyancy-float',
    thread: 'energy-conservation',
    title: {
      en: 'Archimedes’ Principle: Upthrust & The Float–Sink Density Threshold',
      hi: 'आर्किमिडीज का सिद्धांत: उत्प्लावन बल एवं तैरने–डूबने की शर्त',
    },
    oneLine: {
      en: 'Upward buoyant force equals the weight of displaced fluid (F_B = W_disp), reducing apparent weight (W_app = W_air − F_B).',
      hi: 'ऊपर की ओर उत्प्लावन बल विस्थापित तरल के भार के बराबर होता है (F_B = W_disp), जिससे आभासी भार घट जाता है।',
    },
    prerequisites: ['inverse-area-scaling'],
    misconceptionIds: ['heavy-objects-always-sink', 'buoyancy-depends-on-object-mass'],
    contexts: [{ en: 'Eureka overflow beaker, spring balance & iron ship vs nail', hi: 'यूरेका पात्र, कमानीदार तुला और लोहे का जहाज बनाम कील' }],
    boardMapping: [{ board: 'CBSE', classLevel: 9, chapterRef: 'Chapter 9: Gravitation & Floatation (9.5)' }],
    status: 'pilot',
  },
  {
    id: 'sound-echo-wave-speed',
    thread: 'squares-and-inverses',
    title: {
      en: 'Sound Waves: Inverse Wavelength (λ = v/f) & Echo Round-Trip (2d = vt)',
      hi: 'ध्वनि तरंगें: व्युत्क्रम तरंगदैर्घ्य (λ = v/f) एवं प्रतिध्वनि (2d = vt)',
    },
    oneLine: {
      en: 'In a given medium, wave speed v is constant so λ = v/f; an echo travels to the cliff and back (2d = vt) requiring t ≥ 0.1 s.',
      hi: 'समान माध्यम में चाल v स्थिर रहती है (λ = v/f); प्रतिध्वनि जाकर वापस लौटती है (2d = vt) और स्पष्ट सुनने हेतु t ≥ 0.1 s आवश्यक है।',
    },
    prerequisites: ['rate-vs-total-intro'],
    misconceptionIds: ['higher-frequency-travels-faster', 'echo-forgets-factor-of-two'],
    contexts: [{ en: 'Mountain cliff echo & SONAR depth ranging', hi: 'पहाड़ी प्रतिध्वनि और सोनार (SONAR) गहराई मापन' }],
    boardMapping: [{ board: 'CBSE', classLevel: 9, chapterRef: 'Chapter 11: Sound (11.2 & 11.3)' }],
    status: 'pilot',
  },

  // Class 10 Physics Completion: Ch 10 (Human Eye & Colourful World) and Ch 12 (Magnetic Effects of Electric Current)
  {
    id: 'eye-defects-correction',
    thread: 'conventions-and-inversions',
    title: {
      en: 'Myopia & Hypermetropia: Corrective Lens Power & Near/Far Point Shift',
      hi: 'निकट-दृष्टि एवं दीर्घ-दृष्टि दोष: संशोधक लेंस क्षमता (Myopia & Hypermetropia)',
    },
    oneLine: {
      en: 'Myopia focuses distant rays before the retina (concave f = −d_F); Hypermetropia focuses near rays behind the retina (convex 1/f = 1/25 − 1/d_N).',
      hi: 'निकट-दृष्टि दोष में दूर की किरणें रेटिना के आगे मिलती हैं (अवतल f = −d_F); दीर्घ-दृष्टि दोष में पास की किरणें रेटिना के पीछे मिलती हैं (उत्तल लेंस)।',
    },
    prerequisites: ['cartesian-sign-trap', 'lens-power-dioptre'],
    misconceptionIds: ['myopia-uses-convex-lens', 'hypermetropia-ignores-25cm-near-point'],
    contexts: [{ en: 'Optometrist eye clinic & reading glasses vs distance spectacles', hi: 'नेत्र चिकित्सक क्लिनिक और पढ़ने बनाम दूर देखने का चश्मा' }],
    boardMapping: [{ board: 'CBSE', classLevel: 10, chapterRef: 'Chapter 10: The Human Eye and the Colourful World (10.2)' }],
    deepDiveRoute: '/alternative',
    status: 'pilot',
  },
  {
    id: 'prism-dispersion-scattering',
    thread: 'conventions-and-inversions',
    title: {
      en: 'Glass Prism Dispersion, Inverted Recombination & Rayleigh Sky Scattering',
      hi: 'प्रिज्म द्वारा वर्ण-विक्षेपण, न्यूटन का पुनर्योजन एवं प्रकाश का प्रकीर्णन',
    },
    oneLine: {
      en: 'Shorter wavelength (Violet/Blue) has higher refractive index in glass (bends most) and scatters ~6–9× more in air (I ∝ 1/λ⁴) than Red.',
      hi: 'छोटी तरंगदैर्घ्य (बैंगनी/नीला) का काँच में अपवर्तनांक अधिक होता है (सर्वाधिक विचलन) और वायु में लाल से ~6–9 गुना अधिक प्रकीर्णन (I ∝ 1/λ⁴) होता है।',
    },
    prerequisites: ['lens-power-dioptre'],
    misconceptionIds: ['red-bends-more-than-violet', 'prism-creates-colour-rather-than-splitting'],
    contexts: [{ en: 'Newton’s two-prism recombination, rainbow & red danger signals', hi: 'न्यूटन का द्वि-प्रिज्म प्रयोग, इंद्रधनुष और लाल खतरे के संकेत' }],
    boardMapping: [{ board: 'CBSE', classLevel: 10, chapterRef: 'Chapter 10: The Human Eye and the Colourful World (10.3–10.6)' }],
    deepDiveRoute: '/alternative',
    status: 'pilot',
  },
  {
    id: 'magnetic-field-solenoid',
    thread: 'squares-and-inverses',
    title: {
      en: 'Right-Hand Thumb Rule & Solenoid Electromagnet (B ∝ I/r vs Uniform Core)',
      hi: 'दक्षिण-हस्त अंगुष्ठ नियम एवं परिनालिका का चुंबकीय क्षेत्र (B ∝ I/r बनाम एकसमान क्रोड)',
    },
    oneLine: {
      en: 'Around a straight wire magnetic field weakens inversely with distance (B ∝ I/r); inside a solenoid of N turns field lines are parallel and uniform (B ∝ N·I).',
      hi: 'सीधे तार के चारों ओर चुंबकीय क्षेत्र दूरी के व्युत्क्रमानुपाती घटता है (B ∝ I/r); परिनालिका के भीतर समानांतर रेखाओं वाला एकसमान क्षेत्र (B ∝ N·I) बनता है।',
    },
    prerequisites: ['current-vs-charge', 'inverse-area-scaling'],
    misconceptionIds: ['solenoid-interior-field-is-zero-or-nonuniform'],
    contexts: [{ en: 'Oersted compass deflection & soft-iron core electromagnet', hi: 'ओर्स्टेड का दिक्सूची प्रयोग और नर्म लोहे के क्रोड वाला विद्युत चुंबक' }],
    boardMapping: [{ board: 'CBSE', classLevel: 10, chapterRef: 'Chapter 12: Magnetic Effects of Electric Current (12.2)' }],
    deepDiveRoute: '/safety',
    status: 'pilot',
  },
  {
    id: 'motor-force-flemings-rule',
    thread: 'controlled-experiments',
    title: {
      en: 'Fleming’s Left-Hand Rule & Magnetic Force on a Conductor (F = BIL sinθ)',
      hi: 'फ्लेमिंग का वाम-हस्त नियम एवं धारावाही चालक पर बल (F = BIL sinθ)',
    },
    oneLine: {
      en: 'Magnetic force is maximum when current is perpendicular to field (θ = 90°), zero when parallel (θ = 0°), and unchanged if both I and B reverse together.',
      hi: 'धारा और चुंबकीय क्षेत्र लंबवत (θ = 90°) होने पर बल अधिकतम, समानांतर (θ = 0°) होने पर शून्य, तथा I व B दोनों एक साथ पलटने पर बल की दिशा अपरिवर्तित रहती है।',
    },
    prerequisites: ['fixed-voltage-vs-current'],
    misconceptionIds: ['electron-motion-equals-conventional-current-direction', 'parallel-current-experiences-magnetic-force'],
    contexts: [{ en: 'Kicking aluminium rod in horseshoe magnet & electron beam deflection', hi: 'नाल चुंबक में एल्युमिनियम छड़ का विस्थापन और इलेक्ट्रॉन पुंज का विक्षेपण' }],
    boardMapping: [{ board: 'CBSE', classLevel: 10, chapterRef: 'Chapter 12: Magnetic Effects of Electric Current (12.3)' }],
    deepDiveRoute: '/safety',
    status: 'pilot',
  },

  // Class 10 Chemistry Expansion (Chapters 1–4): Chemical Reactions, Acids/Bases/pH, Metals & Carbon Compounds
  {
    id: 'chemical-equation-mass-balance',
    thread: 'energy-conservation',
    title: {
      en: 'Balancing Chemical Equations & Law of Conservation of Mass (3Fe + 4H₂O → Fe₃O₄ + 4H₂)',
      hi: 'रासायनिक समीकरण संतुलन एवं द्रव्यमान संरक्षण का नियम (3Fe + 4H₂O → Fe₃O₄ + 4H₂)',
    },
    oneLine: {
      en: 'Atoms are never created or destroyed: adjust front stoichiometric coefficients (never subscripts!) so LHS atom counts and total mass equal RHS.',
      hi: 'रासायनिक अभिक्रिया में परमाणु नष्ट नहीं होते: सूत्र के पादांक बदले बिना आगे के गुणांक समायोजित करें ताकि दोनों पक्षों का कुल द्रव्यमान बराबर हो।',
    },
    prerequisites: ['charge-conservation-junction'],
    misconceptionIds: ['changing-formula-subscripts-to-balance'],
    contexts: [{ en: 'Red-hot iron reacting with steam & double-displacement precipitates', hi: 'तप्त लोहे की भाप से अभिक्रिया और द्विविस्थापन अवक्षेपण' }],
    boardMapping: [{ board: 'CBSE', classLevel: 10, chapterRef: 'Chapter 1: Chemical Reactions and Equations (1.1)' }],
    status: 'pilot',
  },
  {
    id: 'ph-scale-exponential-acid',
    thread: 'squares-and-inverses',
    title: {
      en: 'The pH Scale: Inverse Ten-Fold [H⁺] Scaling & Tooth Decay Threshold ([H⁺] = 10⁻ᵖᴴ)',
      hi: 'pH स्केल: हाइड्रोजन आयन सांद्रता का 10-गुना व्युत्क्रम नियम ([H⁺] = 10⁻ᵖᴴ)',
    },
    oneLine: {
      en: 'Lower pH means higher [H⁺]; every 1-unit drop in pH multiplies [H⁺] by 10× (pH 2 is 1,000× more acidic than pH 5, and tooth enamel corrodes below pH 5.5).',
      hi: 'कम pH का अर्थ अधिक [H⁺] है; pH में 1 इकाई की कमी [H⁺] को 10 गुना बढ़ाती है (pH 5.5 से नीचे दंत-क्षय प्रारंभ होता है)।',
    },
    prerequisites: ['inverse-area-scaling'],
    misconceptionIds: ['ph-scale-is-linear', 'higher-ph-means-higher-h-plus'],
    contexts: [{ en: 'Universal indicator strip, tooth enamel decay (pH < 5.5) & antacids', hi: 'सार्वत्रिक सूचक पट्टी, दंत-क्षय (pH < 5.5) और ऐंटासिड' }],
    boardMapping: [{ board: 'CBSE', classLevel: 10, chapterRef: 'Chapter 2: Acids, Bases and Salts (2.3)' }],
    status: 'pilot',
  },
  {
    id: 'metal-reactivity-displacement',
    thread: 'controlled-experiments',
    title: {
      en: 'The Reactivity Series: Single-Displacement Direction (Fe + CuSO₄ → FeSO₄ + Cu)',
      hi: 'सक्रियता श्रेणी एवं एकल विस्थापन अभिक्रिया की दिशा (Fe + CuSO₄ → FeSO₄ + Cu)',
    },
    oneLine: {
      en: 'A metal A displaces metal ions B²⁺ from aqueous solution if and only if A stands higher than B in the Reactivity Series (Mg > Zn > Fe > Cu > Ag).',
      hi: 'कोई धातु A किसी लवण विलयन से धातु B को तभी विस्थापित करती है जब सक्रियता श्रेणी में A का स्थान B से ऊपर हो (Mg > Zn > Fe > Cu > Ag)।',
    },
    prerequisites: ['fixed-voltage-vs-current'],
    misconceptionIds: ['any-metal-displaces-any-other-metal'],
    contexts: [{ en: 'Iron nail in blue CuSO₄ vs copper wire in FeSO₄ or AgNO₃', hi: 'नीले कॉपर सल्फेट में लोहे की कील बनाम सिल्वर नाइट्रेट में तांबा' }],
    boardMapping: [{ board: 'CBSE', classLevel: 10, chapterRef: 'Chapter 3: Metals and Non-metals (3.2.5)' }],
    status: 'pilot',
  },
  {
    id: 'carbon-homologous-series',
    thread: 'rate-vs-total',
    title: {
      en: 'Carbon Homologous Series: The Constant +CH₂ (+14 u) Step & Unsaturation',
      hi: 'कार्बन की समजातीय श्रेणी: नियत +CH₂ (+14 u) अंतर एवं असंतृप्तता',
    },
    oneLine: {
      en: 'Every successive member in a homologous series (Alkanes CₙH₂ₙ₊₂, Alkenes CₙH₂ₙ, Alkynes CₙH₂ₙ₋₂) adds a constant −CH₂− unit (+14 u molecular mass).',
      hi: 'समजातीय श्रेणी (ऐल्केन CₙH₂ₙ₊₂, ऐल्कीन CₙH₂ₙ, ऐल्काइन CₙH₂ₙ₋₂) के प्रत्येक क्रमागत सदस्य में −CH₂− इकाई (+14 u द्रव्यमान) का नियत अंतर होता है।',
    },
    prerequisites: ['rate-vs-total-intro'],
    misconceptionIds: ['alkene-starts-at-n-equals-1', 'homologous-members-have-different-chemical-properties'],
    contexts: [{ en: 'LPG fuel alkanes, unsaturated alkenes & alcohol functional groups', hi: 'ईंधन ऐल्केन, असंतृप्त ऐल्कीन और ऐल्कोहॉल प्रकार्यात्मक समूह' }],
    boardMapping: [{ board: 'CBSE', classLevel: 10, chapterRef: 'Chapter 4: Carbon and its Compounds (4.2.4)' }],
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
