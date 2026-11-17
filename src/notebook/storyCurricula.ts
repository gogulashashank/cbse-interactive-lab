import type { ConceptId } from '../concepts/registry'

export type StoryStageId =
  | 'predict'
  | 'experiment'
  | 'discover'
  | 'calculate'
  | 'contrast'
  | 'apply'

export const STORY_NOTEBOOK_STAGES: readonly {
  id: StoryStageId
  stepNumber: number
  shortLabel: { en: string; hi: string }
  title: { en: string; hi: string }
}[] = [
  {
    id: 'predict',
    stepNumber: 1,
    shortLabel: { en: '1. Predict', hi: '1. पूर्वानुमान' },
    title: { en: 'Stage A · Qualitative Prediction', hi: 'चरण A · गुणात्मक पूर्वानुमान' },
  },
  {
    id: 'experiment',
    stepNumber: 2,
    shortLabel: { en: '2. Experiment', hi: '2. प्रयोग' },
    title: { en: 'Stage B · Guided Apparatus Investigation', hi: 'चरण B · निर्देशित उपकरण प्रयोग' },
  },
  {
    id: 'discover',
    stepNumber: 3,
    shortLabel: { en: '3. Discover', hi: '3. खोज' },
    title: { en: 'Stage C · Pattern & Law Synthesis', hi: 'चरण C · वैज्ञानिक नियम की खोज' },
  },
  {
    id: 'calculate',
    stepNumber: 4,
    shortLabel: { en: '4. Calculate', hi: '4. गणना' },
    title: { en: 'Stage D · Step-by-Step Numerical Walkthrough', hi: 'चरण D · चरणबद्ध संख्यात्मक हल' },
  },
  {
    id: 'contrast',
    stepNumber: 5,
    shortLabel: { en: '5. Contrast', hi: '5. तुलना एवं जाल' },
    title: { en: 'Stage E · Board-Exam Trap vs Physical Reality', hi: 'चरण E · परीक्षा का जाल बनाम वास्तविकता' },
  },
  {
    id: 'apply',
    stepNumber: 6,
    shortLabel: { en: '6. Apply', hi: '6. अभ्यास' },
    title: { en: 'Stage F · Board-Exam Application & Self-Check', hi: 'चरण F · बोर्ड परीक्षा अभ्यास एवं स्व-मूल्यांकन' },
  },
]

export interface StoryStageSupplement {
  ncertSection: string
  openingQuestion: { en: string; hi: string }
  experimentProtocol: {
    goal: { en: string; hi: string }
    steps: readonly { en: string; hi: string }[]
    observationCheck: {
      prompt: { en: string; hi: string }
      options: readonly { en: string; hi: string }[]
      correctIndex: number
      explanation: { en: string; hi: string }
    }
  }
  discoveryNotes: {
    physicalMeaning: { en: string; hi: string }
    scalingRule: { en: string; hi: string }
    siUnitRule: { en: string; hi: string }
  }
  workedNumerical: {
    title: { en: string; hi: string }
    problem: { en: string; hi: string }
    given: readonly { en: string; hi: string }[]
    formula: string
    substitution: string
    answer: { en: string; hi: string }
    unitTrapNote: { en: string; hi: string }
  }
  contrastTrap: {
    trapTitle: { en: string; hi: string }
    commonMistake: { en: string; hi: string }
    correctPhysics: { en: string; hi: string }
    checkRule: { en: string; hi: string }
  }
  hotsReasoningTask: {
    title: { en: string; hi: string }
    prompt: { en: string; hi: string }
    claimOptions: readonly { en: string; hi: string }[]
    correctClaimIndex: number
    claimExplanation: { en: string; hi: string }
    rubricPoints: readonly { en: string; hi: string }[]
  }
}

export const STORY_STAGE_SUPPLEMENTS: Record<
  Exclude<
    ConceptId,
    | 'lens-power-dioptre'
    | 'mapped-ohms-law'
    | 'mapped-series-parallel'
    | 'mapped-resistivity'
    | 'mapped-power-heating'
    | 'mapped-billing'
    | 'mapped-safety'
    | 'mapped-convex-lens'
    | 'mapped-ramp'
  >,
  StoryStageSupplement
> = {
  'rate-vs-total-intro': {
    ncertSection: 'NCERT Class 9 Ch 7 & Class 10 Ch 11 Foundation',
    openingQuestion: {
      en: '“Does a faster flow rate always guarantee a fuller bucket?”',
      hi: '“क्या तेज़ बहाव की दर हमेशा अधिक कुल पानी की गारंटी देती है?”',
    },
    experimentProtocol: {
      goal: {
        en: 'Use the Tap & Bucket apparatus on the left to test how Flow Rate (L/min) and Time (min) combine.',
        hi: 'बाईं ओर नल और बाल्टी उपकरण का उपयोग करके जांचें कि बहाव की दर (L/min) और समय (min) कैसे मिलते हैं।',
      },
      steps: [
        {
          en: '1. Set Flow Rate = 8 L/min and Elapsed Time = 1 min. Observe the total volume rectangle (8 L).',
          hi: '1. बहाव की दर = 8 L/min और समय = 1 मिनट रखें। कुल आयतन (8 L) देखें।',
        },
        {
          en: '2. Now set Flow Rate = 4 L/min and Elapsed Time = 4 min. Compare the new volume (16 L).',
          hi: '2. अब बहाव की दर = 4 L/min और समय = 4 मिनट रखें। नए आयतन (16 L) की तुलना करें।',
        },
      ],
      observationCheck: {
        prompt: {
          en: 'In your experiment, what geometric feature on the apparatus represents the Total Accumulated Volume?',
          hi: 'आपके प्रयोग में, उपकरण पर कौन-सी ज्यामितीय आकृति कुल जमा आयतन को दर्शाती है?',
        },
        options: [
          { en: 'The rectangular area: Rate (height) × Time (width)', hi: 'आयताकार क्षेत्रफल: दर (ऊँचाई) × समय (चौड़ाई)' },
          { en: 'Only the height of the rate bar', hi: 'केवल दर पट्टी की ऊँचाई' },
          { en: 'Rate divided by elapsed time', hi: 'दर बटा समय' },
        ],
        correctIndex: 0,
        explanation: {
          en: 'Total accumulated quantity is always the product (area) of the rate and the elapsed duration: Total = Rate × Time.',
          hi: 'कुल जमा मात्रा हमेशा दर और समय के गुणनफल (आयत के क्षेत्रफल) के बराबर होती है: कुल = दर × समय।',
        },
      },
    },
    discoveryNotes: {
      physicalMeaning: {
        en: 'A rate tells how fast something happens per unit time; the total tells how much has accumulated over an interval.',
        hi: 'दर बताती है कि प्रति इकाई समय में कोई क्रिया कितनी तेज़ है; कुल मात्रा बताती है कि पूरे समय में कितना जमा हुआ।',
      },
      scalingRule: {
        en: 'Doubling the rate for half the time leaves the total unchanged (2R × ½t = R·t).',
        hi: 'दर दोगुनी करने और समय आधा करने पर कुल मात्रा अपरिवर्तित रहती है (2R × ½t = R·t)।',
      },
      siUnitRule: {
        en: 'Always match the time unit in the rate (per minute vs per second vs per hour) with the duration unit before multiplying.',
        hi: 'गुणा करने से पहले दर की समय इकाई (प्रति मिनट, सेकंड या घंटा) को समय अंतराल की इकाई से मिलाएं।',
      },
    },
    workedNumerical: {
      title: { en: 'Worked Numerical: Comparing Two Taps', hi: 'हल किया गया प्रश्न: दो नलों की तुलना' },
      problem: {
        en: 'Tap A flows at 6 L/min for 150 seconds. Tap B flows at 3 L/min for 6 minutes. Which tap delivers more water?',
        hi: 'नल A 150 सेकंड तक 6 L/min की दर से बहता है। नल B 6 मिनट तक 3 L/min की दर से बहता है। कौन अधिक पानी देता है?',
      },
      given: [
        { en: 'Tap A: R_A = 6 L/min, t_A = 150 s = 2.5 min', hi: 'नल A: R_A = 6 L/min, t_A = 150 s = 2.5 min' },
        { en: 'Tap B: R_B = 3 L/min, t_B = 6 min', hi: 'नल B: R_B = 3 L/min, t_B = 6 min' },
      ],
      formula: 'V_total = Rate (L/min) × Time (min)',
      substitution: 'V_A = 6 × 2.5 = 15 L  |  V_B = 3 × 6 = 18 L',
      answer: { en: 'Tap B delivers 18 L (3 L more than Tap A).', hi: 'नल B 18 लीटर पानी देता है (नल A से 3 लीटर अधिक)।' },
      unitTrapNote: {
        en: 'Unit Trap: Never multiply 6 L/min by 150 seconds directly without converting 150 s → 2.5 min!',
        hi: 'इकाई जाल: 150 सेकंड को 2.5 मिनट में बदले बिना सीधे 6 L/min से गुणा न करें!',
      },
    },
    contrastTrap: {
      trapTitle: { en: 'Mistaking High Rate for High Total', hi: 'अधिक दर को अधिक कुल मात्रा समझ लेना' },
      commonMistake: {
        en: 'Assuming the faster tap, higher current, or higher-wattage appliance always produces the larger total regardless of time.',
        hi: 'समय देखे बिना यह मान लेना कि तेज़ नल या अधिक वाट का उपकरण हमेशा अधिक कुल मात्रा खर्च करेगा।',
      },
      correctPhysics: {
        en: 'Total = Rate × Time. A modest rate sustained over a long duration often exceeds a high burst rate run briefly.',
        hi: 'कुल = दर × समय। लंबे समय तक चलने वाली धीमी दर अक्सर थोड़े समय की तेज़ दर से आगे निकल जाती है।',
      },
      checkRule: {
        en: 'Ask: “Did the question ask for the per-second rate, or the accumulated total over time t?”',
        hi: 'पूछें: “क्या प्रश्न में प्रति-सेकंड दर पूछी गई है या समय t में जमा कुल मात्रा?”',
      },
    },
    hotsReasoningTask: {
      title: { en: 'Reasoning Synthesis: Cross-Chapter Pattern', hi: 'तर्क संश्लेषण: अध्यायों के पार एक ही नियम' },
      prompt: {
        en: 'Explain why distance (d = v·t), electric charge (Q = I·t), and electrical energy (E = P·t) all follow the exact same mathematical structure.',
        hi: 'स्पष्ट करें कि दूरी (d = v·t), विद्युत आवेश (Q = I·t) और विद्युत ऊर्जा (E = P·t) सभी एक ही गणितीय नियम का पालन क्यों करते हैं।',
      },
      claimOptions: [
        {
          en: 'Speed v, current I, and power P are all rates per unit time, so multiplying by time t gives the accumulated total.',
          hi: 'चाल v, धारा I और शक्ति P सभी प्रति इकाई समय की दरें हैं, इसलिए समय t से गुणा करने पर कुल मात्रा मिलती है।',
        },
        {
          en: 'They only look similar by coincidence; current and power already include time.',
          hi: 'वे केवल संयोग से समान दिखते हैं।',
        },
      ],
      correctClaimIndex: 0,
      claimExplanation: {
        en: 'In physics, v = d/t, I = Q/t, and P = E/t are all rates of change with respect to time.',
        hi: 'भौतिकी में v = d/t, I = Q/t और P = E/t सभी समय के सापेक्ष परिवर्तन की दरें हैं।',
      },
      rubricPoints: [
        { en: 'Identifies v, I, and P as rates per unit second (m/s, C/s, J/s).', hi: 'v, I और P को प्रति सेकंड की दर (m/s, C/s, J/s) के रूप में पहचानता है।' },
        { en: 'States that multiplying a rate by duration t yields the total accumulated quantity.', hi: 'बताता है कि दर को समय t से गुणा करने पर कुल संचित मात्रा प्राप्त होती है।' },
        { en: 'Notes that time units must match (e.g., seconds with per-second rates).', hi: 'उल्लेख करता है कि समय की इकाइयाँ समान होनी चाहिए।' },
      ],
    },
  },

  'current-vs-charge': {
    ncertSection: 'NCERT Class 10 Science · §11.1 Electric Current and Circuit',
    openingQuestion: {
      en: '“Does a 5 A current always deliver more electric charge than a 2 A current?”',
      hi: '“क्या 5 A की विद्युत धारा हमेशा 2 A की धारा से अधिक आवेश प्रवाहित करती है?”',
    },
    experimentProtocol: {
      goal: {
        en: 'Use the Copper Wire Counting Gate on the left to measure total Coulombs Q = I × t.',
        hi: 'बाईं ओर तांबे के तार के गेट पर कुल आवेश Q = I × t मापें।',
      },
      steps: [
        {
          en: '1. Set Current I = 4.0 A and Time t = 2 s. Observe the gate rate (4 C/s) and total charge (8 C).',
          hi: '1. धारा I = 4.0 A और समय t = 2 s रखें। गेट दर (4 C/s) और कुल आवेश (8 C) देखें।',
        },
        {
          en: '2. Now set Current I = 1.5 A and Time t = 10 s. Notice how the lower current passes 15 C!',
          hi: '2. अब धारा I = 1.5 A और समय t = 10 s रखें। देखें कि कम धारा भी 15 C आवेश प्रवाहित करती है!',
        },
      ],
      observationCheck: {
        prompt: {
          en: 'What does 1 Ampere of electric current physically mean at the wire cross-section?',
          hi: 'तार के अनुप्रस्थ काट पर 1 एम्पियर विद्युत धारा का भौतिक अर्थ क्या है?',
        },
        options: [
          { en: '1 Coulomb of charge flows past the cross-section every 1 second (1 A = 1 C/s)', hi: 'प्रति 1 सेकंड में 1 कूलॉम आवेश गुजरता है (1 A = 1 C/s)' },
          { en: '1 Coulomb of charge is stored permanently inside the wire', hi: 'तार के अंदर 1 कूलॉम आवेश स्थायी रूप से जमा है' },
          { en: '1 electron passes per second', hi: 'प्रति सेकंड 1 इलेक्ट्रॉन गुजरता है' },
        ],
        correctIndex: 0,
        explanation: {
          en: 'By definition (NCERT §11.1), I = Q / t, so 1 Ampere = 1 Coulomb per second.',
          hi: 'एनसीईआरटी §11.1 के अनुसार, I = Q / t, अर्थात 1 एम्पियर = 1 कूलॉम प्रति सेकंड।',
        },
      },
    },
    discoveryNotes: {
      physicalMeaning: {
        en: 'Electric current I is the flow rate of charge through a cross-section; Charge Q is the total quantity of electricity.',
        hi: 'विद्युत धारा I आवेश के प्रवाह की दर है; आवेश Q प्रवाहित विद्युत की कुल मात्रा है।',
      },
      scalingRule: {
        en: 'Q = I × t and N = Q / e (where e = 1.6 × 10⁻¹⁹ C, so 1 C ≈ 6.25 × 10¹⁸ electrons).',
        hi: 'Q = I × t तथा इलेक्ट्रॉन संख्या N = Q / e (1 C ≈ 6.25 × 10¹⁸ इलेक्ट्रॉन)।',
      },
      siUnitRule: {
        en: 'Convert milliamperes (1 mA = 10⁻³ A) and minutes (1 min = 60 s) before computing Coulombs.',
        hi: 'कूलॉम निकालने से पहले मिलीएम्पियर (1 mA = 10⁻³ A) को एम्पियर में और मिनट को सेकंड में बदलें।',
      },
    },
    workedNumerical: {
      title: { en: 'NCERT Example 11.1: Filament Bulb Charge', hi: 'एनसीईआरटी उदाहरण 11.1: बल्ब के तंतु में आवेश' },
      problem: {
        en: 'A current of 0.5 A is drawn by a filament of an electric bulb for 10 minutes. Find the amount of electric charge that flows through the circuit.',
        hi: 'किसी विद्युत बल्ब के तंतु में से 0.5 A विद्युत धारा 10 मिनट तक प्रवाहित होती है। परिपथ से प्रवाहित विद्युत आवेश का परिमाण ज्ञात कीजिए।',
      },
      given: [
        { en: 'Current I = 0.5 A', hi: 'विद्युत धारा I = 0.5 A' },
        { en: 'Time t = 10 min = 10 × 60 s = 600 s', hi: 'समय t = 10 मिनट = 10 × 60 s = 600 s' },
      ],
      formula: 'Q = I × t',
      substitution: 'Q = 0.5 A × 600 s = 300 C',
      answer: { en: 'Q = 300 C (300 Coulombs of charge).', hi: 'Q = 300 C (300 कूलॉम आवेश)।' },
      unitTrapNote: {
        en: 'Writing Q = 0.5 × 10 = 5 C is the #1 board-exam error! Always convert minutes to seconds first.',
        hi: 'Q = 0.5 × 10 = 5 C लिखना बोर्ड परीक्षा की सबसे आम गलती है! हमेशा मिनट को सेकंड में बदलें।',
      },
    },
    contrastTrap: {
      trapTitle: { en: 'Minutes Trap & Electron Count Confusion', hi: 'मिनट को सेकंड में न बदलना' },
      commonMistake: {
        en: 'Multiplying Amperes (C/s) by minutes directly, or confusing Coulombs with the number of electrons.',
        hi: 'एम्पियर (C/s) को सीधे मिनट से गुणा करना, या कूलॉम को इलेक्ट्रॉनों की संख्या समझ लेना।',
      },
      correctPhysics: {
        en: 'Since 1 A = 1 C/s, time t MUST be in seconds. To find electrons, divide total Coulombs by e = 1.6 × 10⁻¹⁹ C.',
        hi: 'चूंकि 1 A = 1 C/s है, समय t सेकंड में होना अनिवार्य है। इलेक्ट्रॉनों की संख्या के लिए Q को 1.6 × 10⁻¹⁹ C से भाग दें।',
      },
      checkRule: {
        en: 'Check: Is Current in Amperes (not mA)? Is Time in Seconds (not minutes)?',
        hi: 'जांचें: क्या धारा एम्पियर में है? क्या समय सेकंड में है?',
      },
    },
    hotsReasoningTask: {
      title: { en: 'HOTS Reasoning: Milliamperes & Electron Flow', hi: 'उच्च स्तरीय तर्क: मिलीएम्पियर और इलेक्ट्रॉन प्रवाह' },
      prompt: {
        en: 'A sensor draws 200 mA for 1 minute, while a starter motor draws 10 A for 1 second. Which device transfers more electrons, and why?',
        hi: 'एक सेंसर 1 मिनट तक 200 mA धारा लेता है, जबकि एक मोटर 1 सेकंड के लिए 10 A धारा लेती है। किसमें अधिक इलेक्ट्रॉन प्रवाहित होते हैं और क्यों?',
      },
      claimOptions: [
        {
          en: 'The sensor transfers more electrons (Q = 0.2 A × 60 s = 12 C vs 10 A × 1 s = 10 C).',
          hi: 'सेंसर अधिक इलेक्ट्रॉन प्रवाहित करता है (Q = 0.2 A × 60 s = 12 C बनाम 10 C)।',
        },
        {
          en: 'The starter motor transfers more electrons because 10 A is much larger than 200 mA.',
          hi: 'मोटर अधिक इलेक्ट्रॉन प्रवाहित करती है क्योंकि 10 A बहुत अधिक है।',
        },
      ],
      correctClaimIndex: 0,
      claimExplanation: {
        en: '200 mA = 0.2 A over 60 s gives Q = 12 C, whereas 10 A over 1 s gives Q = 10 C. More Coulombs means more electrons (N = Q/e).',
        hi: '200 mA = 0.2 A और 60 s से Q = 12 C मिलता है, जबकि 10 A × 1 s = 10 C। अधिक कूलॉम का अर्थ है अधिक इलेक्ट्रॉन।',
      },
      rubricPoints: [
        { en: 'Converts 200 mA to 0.2 A and 1 minute to 60 seconds.', hi: '200 mA को 0.2 A और 1 मिनट को 60 सेकंड में बदलता है।' },
        { en: 'Computes Q_sensor = 12 C and Q_motor = 10 C using Q = I × t.', hi: 'Q = I × t से Q_sensor = 12 C और Q_motor = 10 C की गणना करता है।' },
        { en: 'Links total charge Q directly to electron count via N = Q / e.', hi: 'N = Q / e द्वारा कुल आवेश Q को इलेक्ट्रॉनों की संख्या से जोड़ता है।' },
      ],
    },
  },

  'power-vs-energy': {
    ncertSection: 'NCERT Class 10 Science · §11.8 Electric Power',
    openingQuestion: {
      en: '“Why does a 75 W ceiling fan running all day use more energy than a 500 W mixer grinder?”',
      hi: '“दिन भर चलने वाला 75 W का पंखा 500 W के मिक्सर ग्राइंडर से अधिक ऊर्जा क्यों खर्च करता है?”',
    },
    experimentProtocol: {
      goal: {
        en: 'Switch between the 4 appliances on the left bench and vary operating time to compare Watts (Rate) vs Watt-hours/Joules (Total).',
        hi: 'बाईं ओर के 4 उपकरणों के बीच स्विच करें और समय बदलकर वाट (दर) बनाम जूल/वाट-घंटा (कुल ऊर्जा) की तुलना करें।',
      },
      steps: [
        {
          en: '1. Select Mixer Grinder (500 W) and set Operating Time = 10 mins. Note the energy (83.3 Wh).',
          hi: '1. मिक्सर ग्राइंडर (500 W) चुनें और समय = 10 मिनट रखें। कुल ऊर्जा (83.3 Wh) नोट करें।',
        },
        {
          en: '2. Select Ceiling Fan (75 W) and set Operating Time = 120 mins (2 hours). Note that it reaches 150 Wh!',
          hi: '2. छत का पंखा (75 W) चुनें और समय = 120 मिनट रखें। देखें कि यह 150 Wh तक पहुँच जाता है!',
        },
      ],
      observationCheck: {
        prompt: {
          en: 'What is the fundamental physical difference between Electric Power (W) and Electrical Energy (J or Wh)?',
          hi: 'विद्युत शक्ति (W) और विद्युत ऊर्जा (J या Wh) में मुख्य भौतिक अंतर क्या है?',
        },
        options: [
          { en: 'Power is the rate of energy conversion per second (J/s); Energy is power multiplied by time (E = P × t)', hi: 'शक्ति प्रति सेकंड ऊर्जा रूपांतरण की दर (J/s) है; ऊर्जा = शक्ति × समय (E = P × t)' },
          { en: 'Power and energy are two names for the same quantity', hi: 'शक्ति और ऊर्जा एक ही राशि के दो नाम हैं' },
          { en: 'Power is measured in Joules and Energy in Watts', hi: 'शक्ति जूल में और ऊर्जा वाट में मापी जाती है' },
        ],
        correctIndex: 0,
        explanation: {
          en: '1 Watt = 1 Joule per second. Total energy transferred is E = P × t.',
          hi: '1 वाट = 1 जूल प्रति सेकंड। कुल स्थानांतरित ऊर्जा E = P × t होती है।',
        },
      },
    },
    discoveryNotes: {
      physicalMeaning: {
        en: 'Power (Watts) is the speed of energy use; Energy (Joules or kWh) is the total work done over time.',
        hi: 'शक्ति (वाट) ऊर्जा उपयोग की गति है; ऊर्जा (जूल या kWh) समय के साथ किया गया कुल कार्य है।',
      },
      scalingRule: {
        en: 'E (in Joules) = P (in Watts) × t (in seconds); E (in Wh) = P (in Watts) × t (in hours).',
        hi: 'E (जूल में) = P (वाट में) × t (सेकंड में); E (Wh में) = P (वाट में) × t (घंटों में)।',
      },
      siUnitRule: {
        en: '1 kWh = 1000 W × 3600 s = 3.6 × 10⁶ Joules.',
        hi: '1 kWh = 1000 W × 3600 s = 3.6 × 10⁶ जूल।',
      },
    },
    workedNumerical: {
      title: { en: 'Worked Numerical: TV vs Toaster Energy', hi: 'हल किया गया प्रश्न: टीवी बनाम टोस्टर ऊर्जा' },
      problem: {
        en: 'Which uses more energy: a 250 W TV set in 1 hour, or a 1200 W toaster in 10 minutes?',
        hi: 'किसमें अधिक ऊर्जा उपभुक्त होती है: 250 W का टीवी सेट जो 1 घंटे चलाया जाता है, अथवा 1200 W का विद्युत टोस्टर जो 10 मिनट के लिए चलाया जाता है?',
      },
      given: [
        { en: 'TV: P₁ = 250 W, t₁ = 1 h = 3600 s', hi: 'टीवी: P₁ = 250 W, t₁ = 1 h = 3600 s' },
        { en: 'Toaster: P₂ = 1200 W, t₂ = 10 min = 1/6 h = 600 s', hi: 'टोस्टर: P₂ = 1200 W, t₂ = 10 min = 600 s' },
      ],
      formula: 'E = P × t',
      substitution: 'E_TV = 250 W × 1 h = 250 Wh (900 kJ)  |  E_toaster = 1200 W × (1/6 h) = 200 Wh (720 kJ)',
      answer: { en: 'The 250 W TV uses more energy (250 Wh > 200 Wh).', hi: '250 W का टीवी सेट अधिक ऊर्जा खर्च करता है (250 Wh > 200 Wh)।' },
      unitTrapNote: {
        en: 'Convert 10 minutes to 1/6 hour (for Wh) or 600 seconds (for Joules) so both appliances use the same energy unit!',
        hi: '10 मिनट को 1/6 घंटे (Wh के लिए) या 600 सेकंड (जूल के लिए) में बदलें ताकि दोनों की इकाइयाँ समान रहें!',
      },
    },
    contrastTrap: {
      trapTitle: { en: 'Confusing Wattage Rating with Energy Consumed', hi: 'वाट क्षमता को कुल ऊर्जा खपत समझ लेना' },
      commonMistake: {
        en: 'Saying “1200 W is bigger than 250 W, so the toaster must consume more energy.”',
        hi: 'यह कहना कि “1200 W, 250 W से बड़ा है, इसलिए टोस्टर अधिक ऊर्जा खर्च करेगा।”',
      },
      correctPhysics: {
        en: 'Wattage is only the instantaneous rate (J/s). You must multiply by operating time t to compare energy.',
        hi: 'वाट केवल तात्कालिक दर (J/s) है। कुल ऊर्जा की तुलना के लिए समय t से गुणा करना अनिवार्य है।',
      },
      checkRule: {
        en: 'Always compute E₁ = P₁t₁ and E₂ = P₂t₂ in matching units before comparing.',
        hi: 'तुलना करने से पहले हमेशा समान इकाइयों में E₁ = P₁t₁ और E₂ = P₂t₂ निकालें।',
      },
    },
    hotsReasoningTask: {
      title: { en: 'HOTS Claim: Kilowatt vs Kilowatt-Hour', hi: 'उच्च स्तरीय प्रश्न: किलोवाट बनाम किलोवाट-घंटा' },
      prompt: {
        en: 'A student writes in their exam: “The power consumed by our house this month was 250 kWh.” Identify and correct the scientific error in this statement.',
        hi: 'एक छात्र परीक्षा में लिखता है: “इस महीने हमारे घर द्वारा खर्च की गई शक्ति 250 kWh थी।” इस कथन की वैज्ञानिक त्रुटि सुधारें।',
      },
      claimOptions: [
        {
          en: 'kWh is a unit of electrical ENERGY (Power × Time), not power. The statement should say “electrical energy consumed was 250 kWh.”',
          hi: 'kWh विद्युत ऊर्जा (शक्ति × समय) की इकाई है, शक्ति की नहीं। सही कथन है: “खर्च की गई विद्युत ऊर्जा 250 kWh थी।”',
        },
        {
          en: 'kWh is a unit of electric current, not power.',
          hi: 'kWh विद्युत धारा की इकाई है।',
        },
      ],
      correctClaimIndex: 0,
      claimExplanation: {
        en: 'Kilowatt (kW) measures power; Kilowatt-hour (kWh) = kW × h measures total electrical energy.',
        hi: 'किलोवाट (kW) शक्ति मापता है; किलोवाट-घंटा (kWh) = kW × h कुल विद्युत ऊर्जा मापता है।',
      },
      rubricPoints: [
        { en: 'Distinguishes Power (kW, rate) from Energy (kWh, total work).', hi: 'शक्ति (kW, दर) और ऊर्जा (kWh, कुल कार्य) में अंतर स्पष्ट करता है।' },
        { en: 'Shows that 1 kWh = 1 kW × 1 hour = 3.6 × 10⁶ J.', hi: 'दर्शाता है कि 1 kWh = 1 kW × 1 घंटा = 3.6 × 10⁶ J।' },
        { en: 'Rewrites the statement accurately using “electrical energy consumed”.', hi: '“खर्च की गई विद्युत ऊर्जा” लिखकर कथन को सही करता है।' },
      ],
    },
  },

  'units-on-the-bill': {
    ncertSection: 'NCERT Class 10 Science · §11.8 Commercial Unit of Electrical Energy',
    openingQuestion: {
      en: '“Why does a 150 W refrigerator add more to your monthly bill than a 2000 W water geyser used for 30 minutes a day?”',
      hi: '“150 W का फ्रिज रोज़ 30 मिनट चलने वाले 2000 W के गीज़र की तुलना में मासिक बिल क्यों बढ़ा देता है?”',
    },
    experimentProtocol: {
      goal: {
        en: 'Adjust Geyser Daily Runtime and Tariff Rate on the left 30-day utility meter bench.',
        hi: 'बाईं ओर 30-दिन के बिजली मीटर बेंच पर गीज़र का दैनिक समय और बिजली दर बदलें।',
      },
      steps: [
        {
          en: '1. At Geyser Runtime = 30 mins/day (0.5 h/day), compare Geyser (30 kWh) vs Fridge (108 kWh).',
          hi: '1. गीज़र समय = 30 मिनट/दिन पर गीज़र (30 kWh) बनाम फ्रिज (108 kWh) की तुलना करें।',
        },
        {
          en: '2. Increase Geyser Runtime to 110 mins/day to see when the geyser overtakes the 24-hour fridge.',
          hi: '2. गीज़र का समय बढ़ाकर 110 मिनट/दिन करें और देखें कि वह कब फ्रिज से आगे निकलता है।',
        },
      ],
      observationCheck: {
        prompt: {
          en: 'How do you convert Watt-hours (Wh) into commercial electricity bill "Units" (kWh)?',
          hi: 'वाट-घंटा (Wh) को बिजली बिल की व्यावसायिक "यूनिट" (kWh) में कैसे बदलते हैं?',
        },
        options: [
          { en: 'Divide Watt-hours by 1000: Units (kWh) = [P(in W) × t(in hours)] / 1000', hi: 'वाट-घंटा को 1000 से भाग दें: यूनिट (kWh) = [P(W) × t(घंटे)] / 1000' },
          { en: 'Multiply Watt-hours by 3600', hi: 'वाट-घंटा को 3600 से गुणा करें' },
          { en: 'Divide Watts by voltage', hi: 'वाट को वोल्टेज से भाग दें' },
        ],
        correctIndex: 0,
        explanation: {
          en: '1 kWh = 1000 Wh, so dividing total Watt-hours by 1000 gives the exact number of billed Units.',
          hi: '1 kWh = 1000 Wh, इसलिए कुल वाट-घंटा को 1000 से भाग देने पर बिल की यूनिट मिलती हैं।',
        },
      },
    },
    discoveryNotes: {
      physicalMeaning: {
        en: '1 Commercial "Unit" = 1 kilowatt-hour (kWh) = energy consumed by a 1000 W device running for 1 hour.',
        hi: '1 व्यावसायिक "यूनिट" = 1 किलोवाट-घंटा (kWh) = 1000 W के उपकरण द्वारा 1 घंटे में खर्च ऊर्जा।',
      },
      scalingRule: {
        en: 'Monthly Bill (₹) = [P(W) × hours/day × days / 1000] × Tariff (₹/unit).',
        hi: 'मासिक बिल (₹) = [P(W) × घंटे/दिन × दिन / 1000] × दर (₹/यूनिट)।',
      },
      siUnitRule: {
        en: '1 Unit = 1 kWh = 1000 J/s × 3600 s = 3.6 × 10⁶ Joules.',
        hi: '1 यूनिट = 1 kWh = 1000 J/s × 3600 s = 3.6 × 10⁶ जूल।',
      },
    },
    workedNumerical: {
      title: { en: 'NCERT Example 11.13: Refrigerator Monthly Bill', hi: 'एनसीईआरटी उदाहरण 11.13: रेफ्रिजरेटर का मासिक बिल' },
      problem: {
        en: 'An electric refrigerator rated 400 W operates 8 hours/day. What is the cost of the energy to operate it for 30 days at ₹3.00 per kWh?',
        hi: '400 W अनुमतांक का कोई विद्युत रेफ्रिजरेटर 8 घंटे/दिन चलाया जाता है। ₹3.00 प्रति kWh की दर से इसे 30 दिन तक चलाने के लिए ऊर्जा का मूल्य क्या है?',
      },
      given: [
        { en: 'Power P = 400 W = 0.4 kW', hi: 'शक्ति P = 400 W = 0.4 kW' },
        { en: 'Total time t = 8 h/day × 30 days = 240 hours', hi: 'कुल समय t = 8 घंटे/दिन × 30 दिन = 240 घंटे' },
      ],
      formula: 'E (kWh) = [P(W) × t(h)] / 1000  |  Cost = E × Rate',
      substitution: 'E = (400 × 240) / 1000 = 96 kWh  →  Cost = 96 × ₹3.00 = ₹288.00',
      answer: { en: 'Total energy = 96 kWh (Units); Total cost = ₹288.00.', hi: 'कुल ऊर्जा = 96 kWh (यूनिट); कुल मूल्य = ₹288.00।' },
      unitTrapNote: {
        en: 'Don’t forget to divide Watt-hours (96,000 Wh) by 1000 to get kWh before multiplying by the rupee tariff!',
        hi: 'रुपये की दर से गुणा करने से पहले वाट-घंटा (96,000 Wh) को 1000 से भाग देकर kWh में बदलना न भूलें!',
      },
    },
    contrastTrap: {
      trapTitle: { en: 'Forgetting the ÷ 1000 (W → kW) or × 30 Days Factor', hi: '÷ 1000 (W → kW) या × 30 दिन भूल जाना' },
      commonMistake: {
        en: 'Calculating 400 W × 8 h = 3200 and multiplying directly by ₹3, or forgetting to multiply daily energy by 30 days.',
        hi: '400 W × 8 h = 3200 को सीधे ₹3 से गुणा कर देना, या 30 दिनों से गुणा करना भूल जाना।',
      },
      correctPhysics: {
        en: 'Tariff rates are charged per KILOWATT-hour (1000 Wh). Always convert Watts to kilowatts (÷ 1000) and multiply by total days.',
        hi: 'बिजली दर प्रति किलोवाट-घंटा (1000 Wh) होती है। हमेशा वाट को किलोवाट (÷ 1000) में बदलें और कुल दिनों से गुणा करें।',
      },
      checkRule: {
        en: 'Use the 4-part checklist: kW = W/1000 → × hours/day → × days → × ₹/kWh.',
        hi: '4-चरण जांच: kW = W/1000 → × घंटे/दिन → × कुल दिन → × ₹/kWh।',
      },
    },
    hotsReasoningTask: {
      title: { en: 'HOTS Derivation: Why 1 kWh = 3.6 × 10⁶ J', hi: 'उच्च स्तरीय व्युत्पत्ति: 1 kWh = 3.6 × 10⁶ J क्यों होता है?' },
      prompt: {
        en: 'Prove step-by-step from SI base definitions why 1 commercial unit of electricity (1 kWh) equals 3.6 × 10⁶ Joules.',
        hi: 'एसआई परिभाषाओं के आधार पर चरणबद्ध सिद्ध करें कि 1 व्यावसायिक यूनिट (1 kWh) = 3.6 × 10⁶ जूल क्यों होती है।',
      },
      claimOptions: [
        {
          en: '1 kW = 1000 J/s and 1 hour = 3600 s, so 1 kWh = 1000 J/s × 3600 s = 3,600,000 J = 3.6 × 10⁶ J.',
          hi: '1 kW = 1000 J/s और 1 घंटा = 3600 s, अतः 1 kWh = 1000 J/s × 3600 s = 3.6 × 10⁶ J।',
        },
        {
          en: '1 kW = 100 W and 1 hour = 60 s, so 1 kWh = 6000 J.',
          hi: '1 kW = 100 W और 1 घंटा = 60 s।',
        },
      ],
      correctClaimIndex: 0,
      claimExplanation: {
        en: 'Replacing 1 kW with 1000 W (J/s) and 1 h with 3600 s cancels seconds and yields 3.6 × 10⁶ J.',
        hi: '1 kW = 1000 J/s और 1 घंटा = 3600 s रखने पर सेकंड कट जाता है और 3.6 × 10⁶ J प्राप्त होता है।',
      },
      rubricPoints: [
        { en: 'Writes 1 kilowatt = 1000 Watts = 1000 Joules/second.', hi: '1 किलोवाट = 1000 वाट = 1000 जूल/सेकंड लिखता है।' },
        { en: 'Writes 1 hour = 60 × 60 = 3600 seconds.', hi: '1 घंटा = 60 × 60 = 3600 सेकंड लिखता है।' },
        { en: 'Multiplies 1000 J/s × 3600 s = 3.6 × 10⁶ J in standard scientific notation.', hi: '1000 J/s × 3600 s = 3.6 × 10⁶ J मानक वैज्ञानिक रूप में लिखता है।' },
      ],
    },
  },

  'inverse-area-scaling': {
    ncertSection: 'NCERT Class 10 Science · §11.5 Factors on which Resistance Depends',
    openingQuestion: {
      en: '“Why does a thicker wire have LESS electrical resistance than a thin wire of the same length?”',
      hi: '“समान लंबाई के पतले तार की तुलना में मोटे तार का विद्युत प्रतिरोध कम क्यों होता है?”',
    },
    experimentProtocol: {
      goal: {
        en: 'Use the Conductor Corridor Bench on the left to vary cross-sectional area A from 0.5 mm² to 4.0 mm².',
        hi: 'बाईं ओर चालक गलियारे बेंच पर अनुप्रस्थ काट क्षेत्रफल A को 0.5 mm² से 4.0 mm² तक बदलें।',
      },
      steps: [
        {
          en: '1. Set Area A = 1.0 mm² (baseline R = 1.00 Ω). Now double Area to A = 2.0 mm² and observe R drop to 0.50 Ω.',
          hi: '1. क्षेत्रफल A = 1.0 mm² (R = 1.00 Ω) रखें। अब A = 2.0 mm² करें और देखें कि R घटकर 0.50 Ω हो जाता है।',
        },
        {
          en: '2. Halve Area to A = 0.5 mm² and notice R doubles to 2.00 Ω.',
          hi: '2. क्षेत्रफल घटाकर A = 0.5 mm² करें और देखें कि प्रतिरोध दोगुना (2.00 Ω) हो जाता है।',
        },
      ],
      observationCheck: {
        prompt: {
          en: 'When the cross-sectional area A of a conductor is tripled (3×) at constant length and temperature, what happens to its resistance R?',
          hi: 'जब स्थिर लंबाई और ताप पर चालक का अनुप्रस्थ काट क्षेत्रफल A तीन गुना (3×) किया जाता है, तो प्रतिरोध R पर क्या प्रभाव पड़ता है?',
        },
        options: [
          { en: 'Resistance becomes one-third (R / 3) because R ∝ 1/A', hi: 'प्रतिरोध एक-तिहाई (R / 3) हो जाता है क्योंकि R ∝ 1/A' },
          { en: 'Resistance triples (3R)', hi: 'प्रतिरोध तीन गुना (3R) हो जाता है' },
          { en: 'Resistance remains unchanged', hi: 'प्रतिरोध अपरिवर्तित रहता है' },
        ],
        correctIndex: 0,
        explanation: {
          en: 'By R = ρL / A, cross-sectional area A is in the denominator, so tripling A reduces R to R/3.',
          hi: 'R = ρL / A में क्षेत्रफल A हर (denominator) में है, इसलिए A को 3 गुना करने पर प्रतिरोध R/3 रह जाता है।',
        },
      },
    },
    discoveryNotes: {
      physicalMeaning: {
        en: 'A wider cross-section provides more parallel conducting paths for drifting electrons, reducing opposition to flow.',
        hi: 'चौड़ा अनुप्रस्थ काट इलेक्ट्रॉनों के प्रवाह के लिए अधिक समानांतर मार्ग देता है, जिससे रुकावट (प्रतिरोध) घटती है।',
      },
      scalingRule: {
        en: 'R ∝ 1 / A (at fixed L and material ρ): R₂ / R₁ = A₁ / A₂.',
        hi: 'R ∝ 1 / A (स्थिर L और पदार्थ ρ पर): R₂ / R₁ = A₁ / A₂।',
      },
      siUnitRule: {
        en: '1 mm² = (10⁻³ m)² = 10⁻⁶ m² when substituting into R = ρL / A.',
        hi: 'R = ρL / A में मान रखते समय 1 mm² = 10⁻⁶ m² में बदलें।',
      },
    },
    workedNumerical: {
      title: { en: 'NCERT In-Text Numerical: Thicker Wire Resistance', hi: 'एनसीईआरटी प्रश्न: मोटे तार का प्रतिरोध' },
      problem: {
        en: 'A wire of given material having length L and area of cross-section A has a resistance of 4 Ω. What would be the resistance of another wire of the same material having length L/2 and area of cross-section 2A?',
        hi: 'किसी दिए गए पदार्थ के किसी L लंबाई तथा A मोटाई के तार का प्रतिरोध 4 Ω है। इसी पदार्थ के किसी अन्य तार का प्रतिरोध क्या होगा जिसकी लंबाई L/2 तथा मोटाई 2A है?',
      },
      given: [
        { en: 'Wire 1: R₁ = ρL / A = 4 Ω', hi: 'तार 1: R₁ = ρL / A = 4 Ω' },
        { en: 'Wire 2: L₂ = L / 2, A₂ = 2A', hi: 'तार 2: L₂ = L / 2, A₂ = 2A' },
      ],
      formula: 'R₂ = ρ (L₂ / A₂) = ρ (L/2) / (2A) = ¼ (ρL / A)',
      substitution: 'R₂ = ¼ × R₁ = ¼ × 4 Ω = 1 Ω',
      answer: { en: 'The resistance of the second wire is 1 Ω.', hi: 'दूसरे तार का प्रतिरोध 1 Ω होगा।' },
      unitTrapNote: {
        en: 'Halving L halves R (×½), and doubling A halves R again (×½), giving ¼ of the original resistance!',
        hi: 'लंबाई आधी करने से प्रतिरोध आधा (×½) और क्षेत्रफल दोगुना करने से फिर आधा (×½) होकर कुल ¼ रह जाता है!',
      },
    },
    contrastTrap: {
      trapTitle: { en: 'Treating Area Like Length (Direct vs Inverse)', hi: 'क्षेत्रफल को लंबाई की तरह समानुपाती मान लेना' },
      commonMistake: {
        en: 'Thinking “a bigger wire has more metal, so a thicker wire should have more resistance.”',
        hi: 'यह सोचना कि “मोटे तार में अधिक धातु है, इसलिए उसका प्रतिरोध भी अधिक होना चाहिए।”',
      },
      correctPhysics: {
        en: 'More length in series adds obstacles (R ∝ L), but more cross-sectional area adds parallel lanes (R ∝ 1/A).',
        hi: 'अधिक लंबाई बाधा बढ़ाती है (R ∝ L), परंतु अधिक अनुप्रस्थ काट क्षेत्रफल चौड़ा रास्ता देता है (R ∝ 1/A)।',
      },
      checkRule: {
        en: 'Highway analogy: Longer road = more effort (∝ L); Wider multi-lane highway = easier traffic flow (∝ 1/A).',
        hi: 'राजमार्ग उदाहरण: लंबी सड़क = अधिक दूरी (∝ L); चौड़ा राजमार्ग = सुगम प्रवाह (∝ 1/A)।',
      },
    },
    hotsReasoningTask: {
      title: { en: 'HOTS Reasoning: Heavy-Duty Appliance Cords', hi: 'उच्च स्तरीय तर्क: भारी उपकरणों के मोटे तार' },
      prompt: {
        en: 'Why are the connecting copper cords of an electric iron or geyser made much thicker than the cord of a table lamp?',
        hi: 'विद्युत प्रेस या गीज़र के संयोजक तांबे के तार टेबल लैंप के तार की तुलना में अधिक मोटे क्यों बनाए जाते हैं?',
      },
      claimOptions: [
        {
          en: 'Heavy appliances draw large current (5–15 A); a larger cross-sectional area A lowers wire resistance (R ∝ 1/A) and prevents dangerous Joule heating (I²R) in the cord.',
          hi: 'भारी उपकरण अधिक धारा (5–15 A) लेते हैं; अधिक क्षेत्रफल A से तार का प्रतिरोध घटता है (R ∝ 1/A) और तार खतरनाक रूप से गर्म (I²R) नहीं होता।',
        },
        {
          en: 'Thicker wires increase resistance so the geyser gets more voltage.',
          hi: 'मोटे तार प्रतिरोध बढ़ाते हैं ताकि गीज़र को अधिक वोल्टेज मिले।',
        },
      ],
      correctClaimIndex: 0,
      claimExplanation: {
        en: 'Large A keeps cord resistance R very small so power wasted in the cord (P = I²R) stays negligible.',
        hi: 'बड़ा क्षेत्रफल A तार के प्रतिरोध R को बहुत कम रखता है जिससे तार में ऊष्मा हानि (P = I²R) नगण्य रहती है।',
      },
      rubricPoints: [
        { en: 'Notes that geysers/irons draw high current compared to a lamp.', hi: 'बताता है कि गीज़र/प्रेस लैंप की तुलना में उच्च धारा लेते हैं।' },
        { en: 'Applies R = ρL/A to explain why thicker wires (larger A) have lower resistance.', hi: 'R = ρL/A से स्पष्ट करता है कि मोटे तार (बड़ा A) का प्रतिरोध कम होता है।' },
        { en: 'Connects low R to preventing cord overheating via H = I²Rt.', hi: 'H = I²Rt द्वारा कम प्रतिरोध को तार को गर्म होने से बचाने से जोड़ता है।' },
      ],
    },
  },

  'diameter-trap': {
    ncertSection: 'NCERT Class 10 Science · §11.5 Example 11.6 (Diameter & Resistance)',
    openingQuestion: {
      en: '“If you double a wire’s diameter, why does its resistance drop to ONE-FOURTH instead of half?”',
      hi: '“यदि आप किसी तार का व्यास दोगुना कर दें, तो उसका प्रतिरोध आधा होने के बजाय एक-चौथाई (1/4) क्यों हो जाता है?”',
    },
    experimentProtocol: {
      goal: {
        en: 'Use the Wire Cross-Section Caliper Bench on the left to compare d = 1.0 mm, d = 2.0 mm, and d = 3.0 mm.',
        hi: 'बाईं ओर तार के व्यास कैलिपर बेंच पर d = 1.0 mm, d = 2.0 mm और d = 3.0 mm की तुलना करें।',
      },
      steps: [
        {
          en: '1. Slide Wire Diameter from d = 1.0 mm to d = 2.0 mm (2×). Watch the circular area grow by 4× and R drop to 0.25×!',
          hi: '1. तार का व्यास d = 1.0 mm से d = 2.0 mm (2×) करें। देखें कि वृत्ताकार क्षेत्रफल 4× हो जाता है और प्रतिरोध 0.25× (1/4) रह जाता है!',
        },
        {
          en: '2. Slide to d = 0.5 mm (½×). Watch Area shrink to ¼× and Resistance jump by 4×!',
          hi: '2. व्यास d = 0.5 mm (½×) करें। देखें कि क्षेत्रफल ¼× रह जाता है और प्रतिरोध 4 गुना बढ़ जाता है!',
        },
      ],
      observationCheck: {
        prompt: {
          en: 'Why does doubling diameter d multiply the cross-sectional area A by 4 instead of 2?',
          hi: 'व्यास d को दोगुना करने पर अनुप्रस्थ काट क्षेत्रफल A दो गुना के बजाय 4 गुना क्यों हो जाता है?',
        },
        options: [
          { en: 'Because circular area is A = πr² = πd²/4, which scales with the SQUARE of diameter (2² = 4)', hi: 'क्योंकि वृत्त का क्षेत्रफल A = πr² = πd²/4 व्यास के वर्ग (2² = 4) के समानुपाती होता है' },
          { en: 'Because resistivity changes when diameter doubles', hi: 'क्योंकि व्यास दोगुना करने पर प्रतिरोधकता बदल जाती है' },
          { en: 'Because length automatically halves', hi: 'क्योंकि लंबाई स्वतः आधी हो जाती है' },
        ],
        correctIndex: 0,
        explanation: {
          en: 'A circle expands in two dimensions (width and height), so A = πd²/4 scales as d².',
          hi: 'वृत्त दोनों विमाओं में फैलता है, इसलिए A = πd²/4 व्यास के वर्ग (d²) के अनुसार बढ़ता है।',
        },
      },
    },
    discoveryNotes: {
      physicalMeaning: {
        en: 'Board-exam questions almost never give Area A directly—they give diameter d or radius r to test if you remember A = πr² = πd²/4.',
        hi: 'बोर्ड परीक्षा में क्षेत्रफल A सीधे देने के बजाय व्यास d या त्रिज्या r दी जाती है ताकि A = πr² = πd²/4 की जांच हो सके।',
      },
      scalingRule: {
        en: 'R = ρL / (πd²/4)  ⇒  R ∝ 1 / d²  ⇒  R₂ / R₁ = (d₁ / d₂)².',
        hi: 'R = ρL / (πd²/4)  ⇒  R ∝ 1 / d²  ⇒  R₂ / R₁ = (d₁ / d₂)²।',
      },
      siUnitRule: {
        en: 'Convert diameter in mm to metres (d_m = d_mm × 10⁻³ m) AND divide by 2 for radius r before squaring!',
        hi: 'मिमी में दिए व्यास को मीटर में बदलें (× 10⁻³ m) और वर्ग करने से पहले त्रिज्या r = d/2 निकालें!',
      },
    },
    workedNumerical: {
      title: { en: 'NCERT Exercise Q6: Copper Wire Diameter Doubled', hi: 'एनसीईआरटी अभ्यास प्रश्न 6: तांबे के तार का व्यास दोगुना करने पर' },
      problem: {
        en: 'A copper wire has diameter 0.5 mm and resistivity of 1.6 × 10⁻⁸ Ω·m. What will be the length of this wire to make its resistance 10 Ω? How much does the resistance change if the diameter is doubled?',
        hi: 'किसी तांबे के तार का व्यास 0.5 mm तथा प्रतिरोधकता 1.6 × 10⁻⁸ Ω·m है। 10 Ω प्रतिरोध का तार बनाने के लिए कितनी लंबाई चाहिए? यदि व्यास दोगुना कर दें तो प्रतिरोध में क्या अंतर आएगा?',
      },
      given: [
        { en: 'd = 0.5 mm = 0.5 × 10⁻³ m  ⇒  A = πd²/4 = 1.96 × 10⁻⁷ m²', hi: 'd = 0.5 mm = 0.5 × 10⁻³ m  ⇒  A = πd²/4 = 1.96 × 10⁻⁷ m²' },
        { en: 'R₁ = 10 Ω, ρ = 1.6 × 10⁻⁸ Ω·m', hi: 'R₁ = 10 Ω, ρ = 1.6 × 10⁻⁸ Ω·m' },
      ],
      formula: 'L = R·A / ρ  |  R₂ = R₁ / (d₂/d₁)²',
      substitution: 'L = (10 × 1.96×10⁻⁷) / (1.6×10⁻⁸) = 122.7 m  |  R₂ = 10 Ω / 2² = 2.5 Ω',
      answer: { en: 'Length L = 122.7 m; when diameter is doubled, resistance becomes one-fourth (2.5 Ω).', hi: 'लंबाई L = 122.7 m; व्यास दोगुना करने पर प्रतिरोध एक-चौथाई (2.5 Ω) रह जाता है।' },
      unitTrapNote: {
        en: 'When squaring d = 0.5 × 10⁻³ m, remember (10⁻³)² = 10⁻⁶ m²!',
        hi: 'd = 0.5 × 10⁻³ m का वर्ग करते समय याद रखें कि (10⁻³)² = 10⁻⁶ m² होता है!',
      },
    },
    contrastTrap: {
      trapTitle: { en: 'Confusing Diameter d with Area A', hi: 'व्यास d को क्षेत्रफल A समझ लेना' },
      commonMistake: {
        en: 'Saying “diameter is doubled, so resistance is halved (R/2).”',
        hi: 'यह लिखना कि “व्यास दोगुना हुआ है, इसलिए प्रतिरोध आधा (R/2) हो जाएगा।”',
      },
      correctPhysics: {
        en: 'Resistance is inversely proportional to AREA (A = πd²/4), which means R is inversely proportional to d². Doubling d quarters R (R/4).',
        hi: 'प्रतिरोध क्षेत्रफल (A = πd²/4) के व्युत्क्रमानुपाती है, अर्थात d² के व्युत्क्रमानुपाती है। व्यास दोगुना करने पर प्रतिरोध R/4 होता है।',
      },
      checkRule: {
        en: 'Spot the word “diameter” or “radius” → immediately write the exponent ²!',
        hi: 'प्रश्न में “व्यास” या “त्रिज्या” शब्द देखते ही तुरंत वर्ग (²) लगाएं!',
      },
    },
    hotsReasoningTask: {
      title: { en: 'HOTS Ratio Problem: Two Wires of Different Radii', hi: 'उच्च स्तरीय अनुपात प्रश्न: भिन्न त्रिज्याओं के दो तार' },
      prompt: {
        en: 'Two wires X and Y of the same material and equal length have radii in the ratio 1 : 3. Find the ratio of their resistances R_X : R_Y.',
        hi: 'समान पदार्थ और समान लंबाई के दो तारों X और Y की त्रिज्याओं का अनुपात 1 : 3 है। उनके प्रतिरोधों का अनुपात R_X : R_Y ज्ञात कीजिए।',
      },
      claimOptions: [
        {
          en: 'R_X : R_Y = 9 : 1 (Since R ∝ 1/r², R_X / R_Y = (r_Y / r_X)² = (3 / 1)² = 9 / 1).',
          hi: 'R_X : R_Y = 9 : 1 (चूंकि R ∝ 1/r², R_X / R_Y = (r_Y / r_X)² = (3 / 1)² = 9 : 1)।',
        },
        {
          en: 'R_X : R_Y = 3 : 1',
          hi: 'R_X : R_Y = 3 : 1',
        },
      ],
      correctClaimIndex: 0,
      claimExplanation: {
        en: 'Thin wire X (r_X = 1) has 1/9th the area of thick wire Y (r_Y = 3), so R_X is 9 times larger than R_Y.',
        hi: 'पतले तार X का क्षेत्रफल मोटे तार Y का 1/9 है, इसलिए R_X का प्रतिरोध R_Y से 9 गुना अधिक है।',
      },
      rubricPoints: [
        { en: 'Writes R = ρL / (πr²) with ρ and L constant.', hi: 'ρ और L को स्थिर रखते हुए R = ρL / (πr²) लिखता है।' },
        { en: 'Inverts AND squares the radius ratio: R_X / R_Y = (r_Y / r_X)².', hi: 'त्रिज्या अनुपात का व्युत्क्रम और वर्ग करता है: R_X / R_Y = (r_Y / r_X)²।' },
        { en: 'Concludes R_X : R_Y = 9 : 1.', hi: 'R_X : R_Y = 9 : 1 निष्कर्ष निकालता है।' },
      ],
    },
  },

  'voltage-squared-power': {
    ncertSection: 'NCERT Class 10 Science · §11.8 Electric Power (P = V²/R)',
    openingQuestion: {
      en: '“Why does a 220 V heater lose THREE-FOURTHS of its heating power when voltage drops to 110 V?”',
      hi: '“जब वोल्टेज 220 V से गिरकर 110 V हो जाता है, तो हीटर की तापन शक्ति आधी होने के बजाय एक-चौथाई (¼) क्यों रह जाती है?”',
    },
    experimentProtocol: {
      goal: {
        en: 'Use the Parabolic P = V²/R Bench on the left to test how voltage V affects both current I and power P across the 6 Ω heater.',
        hi: 'बाईं ओर परवलयिक P = V²/R बेंच पर देखें कि 6 Ω हीटर पर वोल्टेज V धारा I और शक्ति P दोनों को कैसे प्रभावित करता है।',
      },
      steps: [
        {
          en: '1. Set Supply Voltage V = 6 V (Baseline: I = 1 A, P = 6 W).',
          hi: '1. वोल्टेज V = 6 V रखें (आधार: I = 1 A, P = 6 W)।',
        },
        {
          en: '2. Double Voltage to V = 12 V. Observe that I doubles to 2 A AND P quadruples to 24 W (4×)!',
          hi: '2. वोल्टेज दोगुना करके V = 12 V करें। देखें कि I दोगुना (2 A) और शक्ति P चार गुनी (24 W) हो जाती है!',
        },
      ],
      observationCheck: {
        prompt: {
          en: 'What is the physical reason why power scales with V² (and not V) for a fixed resistor R?',
          hi: 'एक स्थिर प्रतिरोधक R के लिए शक्ति V के बजाय V² के समानुपाती क्यों होती है?',
        },
        options: [
          { en: 'Doubling V doubles the energy per coulomb (V) AND doubles the current flow rate (I = V/R), so P = V × I quadruples (2 × 2 = 4×)', hi: 'V दोगुना करने से प्रति कूलॉम ऊर्जा (V) और धारा (I = V/R) दोनों दोगुने हो जाते हैं, जिससे P = V × I चार गुना (2×2 = 4×) हो जाता है' },
          { en: 'Resistance R drops to half when voltage doubles', hi: 'वोल्टेज दोगुना होने पर प्रतिरोध R आधा हो जाता है' },
          { en: 'Charge ceases to be conserved at high voltage', hi: 'उच्च वोल्टेज पर आवेश संरक्षित नहीं रहता' },
        ],
        correctIndex: 0,
        explanation: {
          en: 'Because I = V/R changes with V, substituting I into P = V × I gives P = V × (V/R) = V²/R.',
          hi: 'चूंकि I = V/R वोल्टेज के साथ बदलता है, इसलिए P = V × I में मान रखने पर P = V²/R प्राप्त होता है।',
        },
      },
    },
    discoveryNotes: {
      physicalMeaning: {
        en: 'An appliance’s resistance R = V_rated² / P_rated is fixed by its physical filament/coil geometry.',
        hi: 'किसी उपकरण का प्रतिरोध R = V_rated² / P_rated उसकी कुंडली की बनावट से स्थिर रहता है।',
      },
      scalingRule: {
        en: 'For constant R: P₂ / P₁ = (V₂ / V₁)².',
        hi: 'स्थिर R के लिए: P₂ / P₁ = (V₂ / V₁)²।',
      },
      siUnitRule: {
        en: 'If supply voltage drops to ½ of rated voltage, actual power drops to (½)² = ¼ of rated wattage.',
        hi: 'यदि सप्लाई वोल्टेज रेटेड वोल्टेज का ½ रह जाए, तो वास्तविक शक्ति (½)² = ¼ रह जाती है।',
      },
    },
    workedNumerical: {
      title: { en: 'NCERT Exercise Q3: Bulb Operated at Half Voltage', hi: 'एनसीईआरटी अभ्यास प्रश्न 3: आधे वोल्टेज पर बल्ब' },
      problem: {
        en: 'An electric bulb is rated 220 V and 100 W. When it is operated on 110 V, what will be the power consumed?',
        hi: 'किसी विद्युत बल्ब का अनुमतांक 220 V; 100 W है। जब इसे 110 V पर प्रचालित करते हैं तब इसके द्वारा उपभुक्त शक्ति कितनी होती है?',
      },
      given: [
        { en: 'Rated: V₁ = 220 V, P₁ = 100 W  ⇒  R = V₁² / P₁ = 220² / 100 = 484 Ω', hi: 'अनुमतांक: V₁ = 220 V, P₁ = 100 W  ⇒  R = 220² / 100 = 484 Ω' },
        { en: 'Operating voltage: V₂ = 110 V (= ½ V₁)', hi: 'प्रचालन वोल्टेज: V₂ = 110 V (= ½ V₁)' },
      ],
      formula: 'P₂ = V₂² / R = P₁ × (V₂ / V₁)²',
      substitution: 'P₂ = 100 W × (110 / 220)² = 100 W × (1/4) = 25 W',
      answer: { en: 'The bulb consumes 25 W (one-fourth of 100 W, NOT 50 W!).', hi: 'बल्ब 25 W शक्ति उपभुक्त करता है (100 W का एक-चौथाई, 50 W नहीं!)।' },
      unitTrapNote: {
        en: 'Never assume current I stays constant when V changes on the same bulb! R = 484 Ω stays constant, not I.',
        hi: 'यह कभी न मानें कि वोल्टेज बदलने पर धारा I स्थिर रहती है! बल्ब का प्रतिरोध R = 484 Ω स्थिर रहता है।',
      },
    },
    contrastTrap: {
      trapTitle: { en: 'Using P ∝ V Instead of P ∝ V²', hi: 'P ∝ V² के स्थान पर P ∝ V लगा देना' },
      commonMistake: {
        en: 'Answering 50 W when a 220 V, 100 W bulb is plugged into 110 V.',
        hi: '220 V, 100 W के बल्ब को 110 V पर चलाने पर 50 W उत्तर देना।',
      },
      correctPhysics: {
        en: 'At 110 V, both voltage (½) and current (½) are halved, so power P = V × I becomes ½ × ½ = ¼ (25 W).',
        hi: '110 V पर वोल्टेज (½) और धारा (½) दोनों आधे हो जाते हैं, इसलिए शक्ति P = V × I = ½ × ½ = ¼ (25 W) हो जाती है।',
      },
      checkRule: {
        en: 'When the same appliance is plugged into a new voltage, R is constant → always use P = V²/R.',
        hi: 'जब एक ही उपकरण को नए वोल्टेज से जोड़ा जाए, तो R स्थिर रहता है → हमेशा P = V²/R का प्रयोग करें।',
      },
    },
    hotsReasoningTask: {
      title: { en: 'HOTS Reasoning: Brownout Dimming of Bulbs', hi: 'उच्च स्तरीय तर्क: कम वोल्टेज पर बल्ब का मंद पड़ना' },
      prompt: {
        en: 'During a summer voltage dip, household supply drops by 20% (to 0.8 V₀). By what percentage does the heat output of an electric kettle drop?',
        hi: 'गर्मियों में वोल्टेज 20% गिरकर 0.8 V₀ रह जाता है। विद्युत केतली की तापन शक्ति कितने प्रतिशत घट जाएगी?',
      },
      claimOptions: [
        {
          en: 'Heat power drops by 36% (since P₂/P₁ = (0.8)² = 0.64, which is a 36% reduction).',
          hi: 'तापन शक्ति 36% घट जाती है (क्योंकि P₂/P₁ = (0.8)² = 0.64, अर्थात 36% की कमी)।',
        },
        {
          en: 'Heat power drops by 20%.',
          hi: 'तापन शक्ति 20% घट जाती है।',
        },
      ],
      correctClaimIndex: 0,
      claimExplanation: {
        en: '(0.8)² = 0.64 of original power, meaning 1 − 0.64 = 0.36 (36% loss of heating power).',
        hi: '(0.8)² = 0.64, अर्थात मूल शक्ति में 1 − 0.64 = 36% की कमी आती है।',
      },
      rubricPoints: [
        { en: 'Writes V₂ = 0.8 V₁ with kettle resistance R constant.', hi: 'केतली का प्रतिरोध R स्थिर रखते हुए V₂ = 0.8 V₁ लिखता है।' },
        { en: 'Applies P₂ / P₁ = (V₂ / V₁)² = (0.8)² = 0.64.', hi: 'P₂ / P₁ = (V₂ / V₁)² = (0.8)² = 0.64 लागू करता है।' },
        { en: 'Subtracts 100% − 64% = 36% power drop.', hi: '100% − 64% = 36% शक्ति में कमी निकालता है।' },
      ],
    },
  },

  'gravity-inverse-square': {
    ncertSection: 'NCERT Class 9 Science · §9.1 Universal Law of Gravitation',
    openingQuestion: {
      en: '“If two planets move twice as far apart, why does their gravitational pull drop to ONE-FOURTH?”',
      hi: '“यदि दो ग्रहों के बीच की दूरी दोगुनी हो जाए, तो उनके बीच गुरुत्वाकर्षण बल एक-चौथाई (1/4) क्यों रह जाता है?”',
    },
    experimentProtocol: {
      goal: {
        en: 'Slide the Centre-to-Centre Distance r from 1.0 to 4.0 units on the left Gravitational Bench.',
        hi: 'बाईं ओर गुरुत्वाकर्षण बेंच पर केंद्र-से-केंद्र दूरी r को 1.0 से 4.0 इकाई तक स्लाइड करें।',
      },
      steps: [
        {
          en: '1. At r = 1.0 unit, note F = 100 N. Slide to r = 2.0 units and verify F drops to 25 N (¼×).',
          hi: '1. r = 1.0 पर F = 100 N देखें। r = 2.0 करने पर बल घटकर 25 N (¼×) हो जाता है।',
        },
        {
          en: '2. Slide to r = 3.0 units and verify F drops to 11.11 N (1/9th of baseline).',
          hi: '2. r = 3.0 करने पर सत्यापित करें कि बल 11.11 N (1/9 भाग) रह जाता है।',
        },
      ],
      observationCheck: {
        prompt: {
          en: 'If the distance between two masses is reduced to HALF (r / 2), how does the gravitational force between them change?',
          hi: 'यदि दो पिंडों के बीच की दूरी आधी (r / 2) कर दी जाए, तो उनके बीच गुरुत्वाकर्षण बल कैसे बदलेगा?',
        },
        options: [
          { en: 'Force increases to 4 times (4F) because 1 / (½)² = 4', hi: 'बल 4 गुना (4F) बढ़ जाएगा क्योंकि 1 / (½)² = 4' },
          { en: 'Force doubles (2F)', hi: 'बल दोगुना (2F) हो जाएगा' },
          { en: 'Force drops to one-fourth (F / 4)', hi: 'बल एक-चौथाई (F / 4) रह जाएगा' },
        ],
        correctIndex: 0,
        explanation: {
          en: 'By F = G m₁m₂ / r², halving r divides the denominator by ¼, multiplying F by 4.',
          hi: 'F = G m₁m₂ / r² के अनुसार दूरी आधी करने पर बल 4 गुना बढ़ जाता है।',
        },
      },
    },
    discoveryNotes: {
      physicalMeaning: {
        en: 'Every mass attracts every other mass with a force proportional to the product of their masses and inversely proportional to the square of the distance between their centres.',
        hi: 'प्रत्येक पिंड दूसरे पिंड को एक ऐसे बल से आकर्षित करता है जो उनके द्रव्यमानों के गुणनफल के समानुपाती तथा केंद्रों के बीच की दूरी के वर्ग के व्युत्क्रमानुपाती होता है।',
      },
      scalingRule: {
        en: 'F = G (M × m) / r²  ⇒  F₂ / F₁ = (r₁ / r₂)².',
        hi: 'F = G (M × m) / r²  ⇒  F₂ / F₁ = (r₁ / r₂)²।',
      },
      siUnitRule: {
        en: 'Distance r is always measured from the CENTRE of one body to the CENTRE of the other (e.g., R_earth + h for a satellite).',
        hi: 'दूरी r हमेशा दोनों पिंडों के केंद्रों के बीच मापी जाती है (जैसे उपग्रह के लिए R_earth + h)।',
      },
    },
    workedNumerical: {
      title: { en: 'NCERT Exercise Q1: Distance Halved Between Masses', hi: 'एनसीईआरटी अभ्यास प्रश्न 1: दूरी आधी करने पर बल' },
      problem: {
        en: 'Two objects attract each other with a gravitational force of 16 N. If the distance between their centres is doubled while one of the masses is also doubled, find the new gravitational force.',
        hi: 'दो वस्तुएं एक-दूसरे को 16 N के गुरुत्वाकर्षण बल से आकर्षित करती हैं। यदि उनके बीच की दूरी दोगुनी कर दी जाए और एक वस्तु का द्रव्यमान भी दोगुना कर दिया जाए, तो नया बल क्या होगा?',
      },
      given: [
        { en: 'Initial force F₁ = G m₁m₂ / r² = 16 N', hi: 'प्रारंभिक बल F₁ = G m₁m₂ / r² = 16 N' },
        { en: 'New mass m₁\' = 2m₁, New distance r\' = 2r', hi: 'नया द्रव्यमान m₁\' = 2m₁, नई दूरी r\' = 2r' },
      ],
      formula: 'F₂ = G (2m₁)(m₂) / (2r)² = (2 / 4) × F₁ = ½ F₁',
      substitution: 'F₂ = ½ × 16 N = 8 N',
      answer: { en: 'The new gravitational force is 8 N.', hi: 'नया गुरुत्वाकर्षण बल 8 N होगा।' },
      unitTrapNote: {
        en: 'Mass in the numerator scales linearly (×2), while distance in the denominator is squared (÷2² = ÷4), giving net factor 2/4 = ½.',
        hi: 'अंश में द्रव्यमान 2 गुना होता है, जबकि हर में दूरी का वर्ग (÷2² = ÷4) होता है, जिससे कुल गुणक 2/4 = ½ मिलता है।',
      },
    },
    contrastTrap: {
      trapTitle: { en: 'Altitude above Surface vs Distance from Earth’s Centre', hi: 'सतह से ऊँचाई बनाम पृथ्वी के केंद्र से दूरी' },
      commonMistake: {
        en: 'Thinking gravity becomes zero just above the atmosphere, or forgetting to add Earth’s radius R when an object is at height h = R above the surface.',
        hi: 'सतह से h = R ऊँचाई पर केंद्र से दूरी r = R + R = 2R लेने के बजाय केवल R ले लेना।',
      },
      correctPhysics: {
        en: 'At height h = R_earth above the surface, distance from Earth’s centre is r = R + R = 2R, so g drops to g / 2² = g / 4.',
        hi: 'पृथ्वी की सतह से h = R ऊँचाई पर केंद्र से कुल दूरी r = R + R = 2R होती है, इसलिए गुरुत्वीय त्वरण g/4 रह जाता है।',
      },
      checkRule: {
        en: 'Always measure r from the centre of mass: r = R_planet + h_altitude.',
        hi: 'दूरी r हमेशा ग्रह के केंद्र से मापें: r = R_planet + h।',
      },
    },
    hotsReasoningTask: {
      title: { en: 'HOTS Reasoning: Weight at Altitude h = R_earth', hi: 'उच्च स्तरीय तर्क: पृथ्वी की त्रिज्या के बराबर ऊँचाई पर भार' },
      prompt: {
        en: 'A satellite weighing 400 N on Earth’s surface is lifted to an altitude equal to Earth’s radius (h = R) above the surface. What is Earth’s gravitational pull on it there?',
        hi: 'पृथ्वी की सतह पर 400 N भार वाले एक उपग्रह को पृथ्वी की त्रिज्या के बराबर ऊँचाई (h = R) पर ले जाया जाता है। वहाँ उस पर गुरुत्वाकर्षण बल कितना होगा?',
      },
      claimOptions: [
        {
          en: '100 N (Distance from Earth’s centre doubles from R to R + R = 2R, so force drops to 400 / 2² = 100 N).',
          hi: '100 N (पृथ्वी के केंद्र से दूरी R से बढ़कर 2R हो जाती है, इसलिए बल 400 / 2² = 100 N रह जाता है)।',
        },
        {
          en: '400 N because h = R is the same distance.',
          hi: '400 N क्योंकि दूरी समान है।',
        },
      ],
      correctClaimIndex: 0,
      claimExplanation: {
        en: 'On the surface r₁ = R; at altitude h = R, r₂ = R + R = 2R. Thus F₂ = F₁ / 4 = 100 N.',
        hi: 'सतह पर r₁ = R; ऊँचाई h = R पर केंद्र से दूरी r₂ = 2R। अतः F₂ = 400 / 4 = 100 N।',
      },
      rubricPoints: [
        { en: 'Identifies initial distance from Earth’s centre as r₁ = R.', hi: 'पृथ्वी के केंद्र से प्रारंभिक दूरी r₁ = R लिखता है।' },
        { en: 'Computes new distance from Earth’s centre as r₂ = R + h = 2R.', hi: 'केंद्र से नई दूरी r₂ = R + h = 2R निकालता है।' },
        { en: 'Applies inverse-square law F₂ = 400 / 2² = 100 N.', hi: 'व्युत्क्रम-वर्ग नियम से F₂ = 400 / 2² = 100 N प्राप्त करता है।' },
      ],
    },
  },

  'fixed-voltage-vs-current': {
    ncertSection: 'NCERT Class 10 Science · §11.7 & §11.8 (P = V²/R vs P = I²R)',
    openingQuestion: {
      en: '“Why does a 4 Ω resistor glow brighter than a 12 Ω resistor in parallel, yet the 12 Ω resistor glows brighter in series?”',
      hi: '“4 Ω का प्रतिरोधक समानांतर क्रम में 12 Ω से अधिक क्यों चमकता है, जबकि श्रेणीक्रम में 12 Ω अधिक चमकता है?”',
    },
    experimentProtocol: {
      goal: {
        en: 'Toggle between 1. Fixed Voltage (12 V Parallel) and 2. Fixed Current (2 A Series) on the left Circuit Bench.',
        hi: 'बाईं ओर सर्किट बेंच पर 1. स्थिर वोल्टेज (12 V समानांतर) और 2. स्थिर धारा (2 A श्रेणीक्रम) के बीच टॉगल करें।',
      },
      steps: [
        {
          en: '1. In Fixed Voltage (12 V Parallel), observe R₁ = 4 Ω dissipates 36 W while R₂ = 12 Ω dissipates 12 W.',
          hi: '1. स्थिर वोल्टेज (12 V समानांतर) में देखें कि R₁ = 4 Ω में 36 W और R₂ = 12 Ω में 12 W शक्ति बनती है।',
        },
        {
          en: '2. Switch to Fixed Current (2 A Series). Observe the winner flips: R₂ = 12 Ω now dissipates 48 W while R₁ = 4 Ω dissipates 16 W!',
          hi: '2. स्थिर धारा (2 A श्रेणीक्रम) पर स्विच करें। देखें कि अब R₂ = 12 Ω में 48 W और R₁ = 4 Ω में 16 W शक्ति बनती है!',
        },
      ],
      observationCheck: {
        prompt: {
          en: 'What single question must you ask BEFORE choosing between P = V²/R and P = I²R?',
          hi: 'P = V²/R और P = I²R में से चुनाव करने से पहले आपको कौन-सा एक प्रश्न पूछना चाहिए?',
        },
        options: [
          { en: '“Which electrical quantity (V or I) is held the SAME across both resistors?”', hi: '“दोनों प्रतिरोधकों में कौन-सी राशि (V या I) समान/स्थिर रखी गई है?”' },
          { en: '“Which resistor is physically larger?”', hi: '“कौन-सा प्रतिरोधक आकार में बड़ा है?”' },
          { en: '“What is the room temperature?”', hi: '“कमरे का तापमान क्या है?”' },
        ],
        correctIndex: 0,
        explanation: {
          en: 'In parallel, V is identical across branches (use P = V²/R). In series, I is identical through components (use P = I²R).',
          hi: 'समानांतर क्रम में V समान रहता है (P = V²/R लगाएं)। श्रेणीक्रम में I समान रहता है (P = I²R लगाएं)।',
        },
      },
    },
    discoveryNotes: {
      physicalMeaning: {
        en: 'Both P = I²R and P = V²/R are always algebraically true, but to compare two resistors you must use the formula containing the variable that is held fixed.',
        hi: 'P = I²R और P = V²/R दोनों सदैव सत्य हैं, परंतु दो प्रतिरोधकों की तुलना के लिए वह सूत्र चुनें जिसमें स्थिर राशि हो।',
      },
      scalingRule: {
        en: 'Parallel (Fixed V): P ∝ 1/R (smaller R wins). Series (Fixed I): P ∝ R (larger R wins).',
        hi: 'समानांतर (स्थिर V): P ∝ 1/R (कम R में अधिक शक्ति)। श्रेणीक्रम (स्थिर I): P ∝ R (अधिक R में अधिक शक्ति)।',
      },
      siUnitRule: {
        en: 'Household 220 V wiring is ALWAYS parallel (fixed V), so higher-wattage appliances have LOWER resistance!',
        hi: 'घरेलू 220 V वायरिंग हमेशा समानांतर (स्थिर V) होती है, इसलिए अधिक वाट वाले उपकरणों का प्रतिरोध कम होता है!',
      },
    },
    workedNumerical: {
      title: { en: 'NCERT Exercise Q14: Series vs Parallel Power Ratio', hi: 'एनसीईआरटी अभ्यास प्रश्न 14: श्रेणी बनाम समानांतर शक्ति अनुपात' },
      problem: {
        en: 'Compare the power used in the 2 Ω resistor in each of the following circuits: (i) a 6 V battery in series with 1 Ω and 2 Ω resistors, and (ii) a 4 V battery in parallel with 12 Ω and 2 Ω resistors.',
        hi: 'निम्नलिखित परिपथों में प्रत्येक में 2 Ω प्रतिरोधक द्वारा उपभुक्त शक्तियों की तुलना कीजिए: (i) 6 V की बैटरी से 1 Ω तथा 2 Ω श्रेणीक्रम में, तथा (ii) 4 V की बैटरी से 12 Ω तथा 2 Ω पार्श्वक्रम में।',
      },
      given: [
        { en: 'Case (i) Series: R_eq = 1 + 2 = 3 Ω, V = 6 V  ⇒  I = 6 / 3 = 2 A', hi: 'स्थिति (i) श्रेणीक्रम: R_eq = 1 + 2 = 3 Ω, V = 6 V  ⇒  I = 2 A' },
        { en: 'Case (ii) Parallel: V across 2 Ω branch = 4 V', hi: 'स्थिति (ii) पार्श्वक्रम: 2 Ω शाखा पर वोल्टेज V = 4 V' },
      ],
      formula: 'Case (i): P₁ = I²R  |  Case (ii): P₂ = V² / R',
      substitution: 'P₁ = (2 A)² × 2 Ω = 8 W  |  P₂ = (4 V)² / 2 Ω = 8 W',
      answer: { en: 'Both circuits dissipate the exact same power (8 W) in the 2 Ω resistor!', hi: 'दोनों परिपथों में 2 Ω प्रतिरोधक में समान शक्ति (8 W) उपभुक्त होती है!' },
      unitTrapNote: {
        en: 'In Case (i), do NOT use 6² / 2 = 18 W because the 2 Ω resistor does not get the full 6 V in series!',
        hi: 'स्थिति (i) में 6² / 2 = 18 W न लगाएं क्योंकि श्रेणीक्रम में 2 Ω प्रतिरोधक को पूरा 6 V नहीं मिलता!',
      },
    },
    contrastTrap: {
      trapTitle: { en: 'Applying V_battery² / R_single to a Series Resistor', hi: 'श्रेणीक्रम के एक प्रतिरोधक पर सीधे बैटरी वोल्टेज V²/R लगा देना' },
      commonMistake: {
        en: 'Using the total battery voltage V in P = V²/R₁ when R₁ is in series with another resistor R₂.',
        hi: 'जब R₁ किसी अन्य प्रतिरोधक R₂ के साथ श्रेणीक्रम में हो, तब P = V²/R₁ में कुल बैटरी वोल्टेज रख देना।',
      },
      correctPhysics: {
        en: 'In series, battery voltage splits across resistors, whereas current I = V / (R₁ + R₂) is the same everywhere—so find I first and use P₁ = I²R₁.',
        hi: 'श्रेणीक्रम में वोल्टेज बँट जाता है जबकि धारा I समान रहती है—अतः पहले कुल धारा I निकालें और P₁ = I²R₁ लगाएं।',
      },
      checkRule: {
        en: 'Series → find shared I first, then P = I²R. Parallel → each branch gets full V, so P = V²/R.',
        hi: 'श्रेणीक्रम → पहले साझा धारा I निकालें, फिर P = I²R। समानांतर → प्रत्येक शाखा को पूरा V मिलता है, अतः P = V²/R।',
      },
    },
    hotsReasoningTask: {
      title: { en: 'HOTS Paradox: 60 W Bulb vs 100 W Bulb in Series', hi: 'उच्च स्तरीय पहेली: 60 W और 100 W के बल्ब श्रेणीक्रम में' },
      prompt: {
        en: 'Two bulbs rated (220 V, 60 W) and (220 V, 100 W) are connected in SERIES across a 220 V mains supply. Which bulb glows brighter, and why?',
        hi: '(220 V, 60 W) और (220 V, 100 W) के दो बल्ब 220 V सप्लाई के साथ श्रेणीक्रम में जोड़े गए हैं। कौन-सा बल्ब अधिक चमकेगा और क्यों?',
      },
      claimOptions: [
        {
          en: 'The 60 W bulb glows brighter in series because it has higher filament resistance (R = V²/P_rated), and in series (same I) P = I²R gives more power to the higher resistance!',
          hi: 'श्रेणीक्रम में 60 W का बल्ब अधिक चमकेगा क्योंकि उसका प्रतिरोध अधिक है (R = V²/P_rated), और समान धारा I में P = I²R के अनुसार अधिक प्रतिरोध में अधिक शक्ति बनती है!',
        },
        {
          en: 'The 100 W bulb always glows brighter in any circuit.',
          hi: '100 W का बल्ब हर परिपथ में अधिक चमकता है।',
        },
      ],
      correctClaimIndex: 0,
      claimExplanation: {
        en: 'By R = 220² / P_rated, R_60W > R_100W. When connected in series, both carry the same current I, so P_actual = I²R is larger for the 60 W bulb!',
        hi: 'R = 220² / P_rated से R_60W > R_100W। श्रेणीक्रम में दोनों में समान धारा I बहती है, अतः P = I²R से 60 W बल्ब अधिक चमकता है!',
      },
      rubricPoints: [
        { en: 'Uses R = V_rated² / P_rated to show R_60W > R_100W.', hi: 'R = V_rated² / P_rated से सिद्ध करता है कि R_60W > R_100W।' },
        { en: 'Identifies that current I is identical through both bulbs in series.', hi: 'बताता है कि श्रेणीक्रम में दोनों बल्बों में धारा I समान होती है।' },
        { en: 'Applies P = I²R to conclude the higher-resistance 60 W bulb dissipates more power in series.', hi: 'P = I²R लागू कर निष्कर्ष निकालता है कि अधिक प्रतिरोध वाला 60 W बल्ब श्रेणीक्रम में अधिक चमकेगा।' },
      ],
    },
  },

  'stretching-vs-comparing': {
    ncertSection: 'NCERT Class 10 Science · §11.5 Stretching a Wire (Volume Conservation)',
    openingQuestion: {
      en: '“Why does stretching a wire to double its length multiply its resistance by 4× instead of 2×?”',
      hi: '“किसी तार को खींचकर उसकी लंबाई दोगुनी करने पर उसका प्रतिरोध 2 गुना के बजाय 4 गुना (4×) क्यों हो जाता है?”',
    },
    experimentProtocol: {
      goal: {
        en: 'Slide the Length Multiplier n from 1.0× to 4.0× on the left Wire Geometry Caliper Bench.',
        hi: 'बाईं ओर तार ज्यामिति बेंच पर लंबाई गुणांक n को 1.0× से 4.0× तक स्लाइड करें।',
      },
      steps: [
        {
          en: '1. At n = 2.0×, compare Scenario A (Cut a 2× longer wire of same thickness: R = 2 Ω) vs Scenario B (Stretch the same wire: Area drops to ½A₀, so R = 4 Ω).',
          hi: '1. n = 2.0× पर स्थिति A (समान मोटाई का 2× लंबा तार: R = 2 Ω) बनाम स्थिति B (उसी तार को खींचना: क्षेत्रफल ½A₀, अतः R = 4 Ω) की तुलना करें।',
        },
        {
          en: '2. Slide to n = 3.0×. Notice Scenario A gives 3 Ω (n×) while Scenario B gives 9 Ω (n²×)!',
          hi: '2. n = 3.0× करें। देखें कि स्थिति A में 3 Ω (n×) और स्थिति B में 9 Ω (n²×) प्रतिरोध मिलता है!',
        },
      ],
      observationCheck: {
        prompt: {
          en: 'What physical quantity remains constant when a single solid wire is stretched to n times its original length?',
          hi: 'जब एक ही ठोस तार को खींचकर उसकी लंबाई n गुना की जाती है, तो कौन-सी भौतिक राशि स्थिर रहती है?',
        },
        options: [
          { en: 'Total volume of metal (V = L × A = L\' × A\') AND material resistivity ρ', hi: 'धातु का कुल आयतन (V = L × A = L\' × A\') तथा पदार्थ की प्रतिरोधकता ρ' },
          { en: 'Cross-sectional area A', hi: 'अनुप्रस्थ काट क्षेत्रफल A' },
          { en: 'Electrical resistance R', hi: 'विद्युत प्रतिरोध R' },
        ],
        correctIndex: 0,
        explanation: {
          en: 'Since no metal is added or removed, Volume = L × A stays constant. So if L becomes nL, Area A must shrink to A / n.',
          hi: 'चूंकि धातु न जोड़ी गई है न हटाई गई, आयतन V = L × A स्थिर रहता है। अतः L के nL होने पर क्षेत्रफल A/n रह जाता है।',
        },
      },
    },
    discoveryNotes: {
      physicalMeaning: {
        en: 'Stretching a wire simultaneously increases length (×n) AND decreases cross-sectional area (÷n), compounding both effects.',
        hi: 'तार को खींचने से लंबाई बढ़ती है (×n) और साथ ही मोटाई घटती है (÷n), जिससे दोनों प्रभाव मिलकर प्रतिरोध को n² गुना कर देते हैं।',
      },
      scalingRule: {
        en: 'New Cut Wire (fixed A): R\' = n R₀. Stretched Wire (fixed Volume): R\' = n² R₀.',
        hi: 'नया तार (स्थिर A): R\' = n R₀। खींचा गया तार (स्थिर आयतन): R\' = n² R₀।',
      },
      siUnitRule: {
        en: 'Resistivity ρ depends ONLY on material and temperature—stretching a wire NEVER changes ρ!',
        hi: 'प्रतिरोधकता ρ केवल पदार्थ और ताप पर निर्भर करती है—तार खींचने से ρ कभी नहीं बदलती!',
      },
    },
    workedNumerical: {
      title: { en: 'CBSE Board Numerical: 8 Ω Wire Stretched to Double Length', hi: 'सीबीएसई बोर्ड प्रश्न: 8 Ω के तार को खींचकर दोगुना करना' },
      problem: {
        en: 'A wire of resistance 8 Ω is stretched so that its length becomes twice its original length. Calculate its new resistance and state what happens to its resistivity.',
        hi: '8 Ω प्रतिरोध के एक तार को खींचकर उसकी लंबाई मूल लंबाई की दोगुनी कर दी जाती है। उसका नया प्रतिरोध ज्ञात कीजिए तथा बताइए कि उसकी प्रतिरोधकता पर क्या प्रभाव पड़ेगा।',
      },
      given: [
        { en: 'Original resistance R₀ = ρL / A = 8 Ω', hi: 'मूल प्रतिरोध R₀ = ρL / A = 8 Ω' },
        { en: 'Stretched length L\' = 2L  ⇒  New area A\' = A / 2 (constant volume)', hi: 'नई लंबाई L\' = 2L  ⇒  नया क्षेत्रफल A\' = A / 2 (स्थिर आयतन)' },
      ],
      formula: 'R\' = ρ (L\' / A\') = ρ (2L) / (A/2) = 4 (ρL / A) = 4 R₀',
      substitution: 'R\' = 4 × 8 Ω = 32 Ω',
      answer: { en: 'New resistance R\' = 32 Ω; Resistivity ρ remains UNCHANGED because material and temperature are unchanged.', hi: 'नया प्रतिरोध R\' = 32 Ω; प्रतिरोधकता ρ अपरिवर्तित रहती है क्योंकि पदार्थ और ताप नहीं बदले हैं।' },
      unitTrapNote: {
        en: 'Board exams often add a 1-mark sub-question: “What happens to resistivity?” Answer: Unchanged!',
        hi: 'बोर्ड परीक्षा में अक्सर 1 अंक का उप-प्रश्न होता है: “प्रतिरोधकता पर क्या प्रभाव पड़ता है?” उत्तर: अपरिवर्तित!',
      },
    },
    contrastTrap: {
      trapTitle: { en: 'Missing the Word “Stretched” / “Drawn Out”', hi: 'प्रश्न में “खींचकर (Stretched)” शब्द पर ध्यान न देना' },
      commonMistake: {
        en: 'Using R\' = n R₀ (giving 16 Ω instead of 32 Ω) when the problem says the wire is stretched or drawn out.',
        hi: 'जब प्रश्न में तार को “खींचकर” लंबा करने को कहा गया हो, तब n²R₀ के बजाय nR₀ लगा देना।',
      },
      correctPhysics: {
        en: 'Words like “stretched”, “drawn out”, or “melted and recast” mean Volume is constant (R\' = n² R₀). Words like “another wire of same thickness” mean Area is constant (R\' = n R₀).',
        hi: '“खींचकर” या “पिघलाकर ढाला गया” का अर्थ है आयतन स्थिर (R\' = n² R₀)। “समान मोटाई का दूसरा तार” का अर्थ है क्षेत्रफल स्थिर (R\' = n R₀)।',
      },
      checkRule: {
        en: 'Underline the verb in the question: “Stretched” → n²R₀; “Folded/doubled on itself” → R₀/4.',
        hi: 'प्रश्न की क्रिया रेखांकित करें: “खींचा गया” → n²R₀; “मोड़कर दोगुना किया” → R₀/4।',
      },
    },
    hotsReasoningTask: {
      title: { en: 'HOTS Inverse Case: Wire Folded / Doubled on Itself', hi: 'उच्च स्तरीय प्रश्न: तार को मोड़कर स्वयं पर दोगुना करना' },
      prompt: {
        en: 'A wire of resistance 12 Ω is bent in the middle and the two halves are twisted together (doubled on itself). What is the new resistance?',
        hi: '12 Ω प्रतिरोध के एक तार को बीच से मोड़कर दोनों हिस्सों को एक साथ लपेट दिया जाता है। नया प्रतिरोध क्या होगा?',
      },
      claimOptions: [
        {
          en: '3 Ω (Length becomes L/2 and cross-sectional area becomes 2A, so R\' = (½) / 2 × 12 Ω = ¼ × 12 Ω = 3 Ω).',
          hi: '3 Ω (लंबाई L/2 और क्षेत्रफल 2A हो जाता है, अतः R\' = ¼ × 12 Ω = 3 Ω)।',
        },
        {
          en: '6 Ω because length is halved.',
          hi: '6 Ω क्योंकि लंबाई आधी हो गई है।',
        },
      ],
      correctClaimIndex: 0,
      claimExplanation: {
        en: 'Folding in half makes L\' = ½L and doubles the bundle cross-section A\' = 2A, so R\' = R₀ / 4 = 3 Ω.',
        hi: 'बीच से मोड़ने पर लंबाई L\' = ½L और अनुप्रस्थ काट क्षेत्रफल A\' = 2A हो जाता है, जिससे R\' = 12 / 4 = 3 Ω मिलता है।',
      },
      rubricPoints: [
        { en: 'Identifies new length L\' = L / 2.', hi: 'नई लंबाई L\' = L / 2 पहचानता है।' },
        { en: 'Identifies new cross-sectional area A\' = 2A.', hi: 'नया क्षेत्रफल A\' = 2A पहचानता है।' },
        { en: 'Computes R\' = ρ(L/2)/(2A) = R₀ / 4 = 3 Ω.', hi: 'R\' = ρ(L/2)/(2A) = R₀ / 4 = 3 Ω की गणना करता है।' },
      ],
    },
  },

  'constant-temp-ohmic': {
    ncertSection: 'NCERT Class 10 Science · §11.4 Ohm’s Law & Activity 11.2',
    openingQuestion: {
      en: '“Why does Ohm’s law begin with the condition ‘provided its temperature remains the same’?”',
      hi: '“ओम के नियम में यह शर्त क्यों जोड़ी जाती है कि ‘यदि चालक की भौतिक अवस्थाएं (विशेषकर ताप) अपरिवर्तित रहें’?”',
    },
    experimentProtocol: {
      goal: {
        en: 'Increase Applied Voltage V from 2 V to 20 V on the left I–V Graph Bench and compare the green Ohmic line with the orange Filament curve.',
        hi: 'बाईं ओर I–V ग्राफ बेंच पर वोल्टेज V को 2 V से 20 V तक बढ़ाएं और हरे ओमीय ग्राफ की नारंगी फिलामेंट वक्र से तुलना करें।',
      },
      steps: [
        {
          en: '1. At V = 2 V, notice both have nearly the same resistance (~10 Ω vs 12.4 Ω).',
          hi: '1. V = 2 V पर देखें कि दोनों का प्रतिरोध लगभग पास है (~10 Ω बनाम 12.4 Ω)।',
        },
        {
          en: '2. Slide Voltage to V = 20 V. Observe the constant-temp resistor stays at 10 Ω (I = 2.0 A), while the hot tungsten filament rises to 34 Ω (I = 0.59 A)!',
          hi: '2. वोल्टेज V = 20 V करें। देखें कि स्थिर ताप प्रतिरोधक 10 Ω (I = 2.0 A) पर रहता है, जबकि गर्म बल्ब तंतु का प्रतिरोध बढ़कर 34 Ω हो जाता है!',
        },
      ],
      observationCheck: {
        prompt: {
          en: 'Why does the I–V graph of an incandescent filament bulb bend downward at higher voltages?',
          hi: 'उच्च वोल्टेज पर बल्ब के तंतु का I–V ग्राफ नीचे की ओर (वोल्टेज अक्ष की ओर) क्यों झुक जाता है?',
        },
        options: [
          { en: 'Higher current heats the filament, increasing thermal vibrations and raising resistance R(T)', hi: 'अधिक धारा से तंतु गर्म होता है, जिससे प्रतिरोध R(T) बढ़ जाता है और धारा अपेक्षा से कम बढ़ती है' },
          { en: 'The battery runs out of charge at higher voltage', hi: 'उच्च वोल्टेज पर बैटरी का आवेश समाप्त हो जाता है' },
          { en: 'Resistance decreases at high temperature', hi: 'उच्च ताप पर प्रतिरोध घट जाता है' },
        ],
        correctIndex: 0,
        explanation: {
          en: 'In metals like tungsten, resistivity increases with temperature, so V / I = R is no longer constant when the filament heats up.',
          hi: 'टंगस्टन जैसी धातुओं में ताप बढ़ने पर प्रतिरोध बढ़ता है, इसलिए तंतु गर्म होने पर V / I = R स्थिर नहीं रहता।',
        },
      },
    },
    discoveryNotes: {
      physicalMeaning: {
        en: 'Ohm’s law (V ∝ I, or V/I = constant R) holds only when temperature and physical dimensions are held constant.',
        hi: 'ओम का नियम (V ∝ I, या V/I = स्थिर R) तभी लागू होता है जब ताप और भौतिक अवस्थाएं स्थिर रखी जाएं।',
      },
      scalingRule: {
        en: 'Ohmic conductor: R = V / I = constant (straight line through origin). Non-ohmic filament: R increases as T increases.',
        hi: 'ओमीय चालक: R = V / I = स्थिरांक (मूल बिंदु से सीधी रेखा)। अन-ओमीय तंतु: ताप T बढ़ने पर R बढ़ता है।',
      },
      siUnitRule: {
        en: '1 Ohm (Ω) = 1 Volt / 1 Ampere.',
        hi: '1 ओम (Ω) = 1 वोल्ट / 1 एम्पियर।',
      },
    },
    workedNumerical: {
      title: { en: 'NCERT Activity 11.1 Data Analysis: Checking Ohmic Behaviour', hi: 'एनसीईआरटी क्रियाकलाप 11.1: ओमीय व्यवहार की जांच' },
      problem: {
        en: 'In an experiment on a nichrome wire at constant temperature, V = 1.6 V gives I = 0.5 A, and V = 6.4 V gives I = 2.0 A. Find the resistance of the wire and the current at V = 9.6 V.',
        hi: 'स्थिर ताप पर नाइक्रोम तार के प्रयोग में V = 1.6 V पर I = 0.5 A तथा V = 6.4 V पर I = 2.0 A प्राप्त होता है। तार का प्रतिरोध तथा V = 9.6 V पर धारा ज्ञात कीजिए।',
      },
      given: [
        { en: 'Reading 1: V₁ = 1.6 V, I₁ = 0.5 A  ⇒  R = 1.6 / 0.5 = 3.2 Ω', hi: 'पाठ्यांक 1: V₁ = 1.6 V, I₁ = 0.5 A  ⇒  R = 3.2 Ω' },
        { en: 'Reading 2: V₂ = 6.4 V, I₂ = 2.0 A  ⇒  R = 6.4 / 2.0 = 3.2 Ω (Constant!)', hi: 'पाठ्यांक 2: V₂ = 6.4 V, I₂ = 2.0 A  ⇒  R = 3.2 Ω (स्थिर!)' },
      ],
      formula: 'R = V / I  ⇒  I₃ = V₃ / R',
      substitution: 'I₃ = 9.6 V / 3.2 Ω = 3.0 A',
      answer: { en: 'Resistance R = 3.2 Ω; Current at 9.6 V is 3.0 A.', hi: 'प्रतिरोध R = 3.2 Ω; 9.6 V पर धारा 3.0 A होगी।' },
      unitTrapNote: {
        en: 'When reading an I–V graph, check which axis is V and which is I: Slope of V-vs-I is R, whereas slope of I-vs-V is 1/R!',
        hi: 'ग्राफ पढ़ते समय अक्षों की जांच करें: V-बनाम-I ग्राफ की ढाल R होती है, जबकि I-बनाम-V ग्राफ की ढाल 1/R होती है!',
      },
    },
    contrastTrap: {
      trapTitle: { en: 'Saying “Resistance is Proportional to Voltage (R = V/I)”', hi: 'R = V/I देखकर यह सोचना कि प्रतिरोध वोल्टेज के समानुपाती है' },
      commonMistake: {
        en: 'Looking at R = V / I and claiming that doubling voltage V doubles the resistance R of an ohmic resistor.',
        hi: 'R = V / I सूत्र देखकर यह दावा करना कि वोल्टेज दोगुना करने से ओमीय प्रतिरोधक का प्रतिरोध R दोगुना हो जाता है।',
      },
      correctPhysics: {
        en: 'For an ohmic resistor at constant temperature, doubling V automatically doubles I, so the ratio R = 2V / 2I remains completely constant!',
        hi: 'स्थिर ताप पर ओमीय प्रतिरोधक के लिए V दोगुना करने पर धारा I भी दोगुनी हो जाती है, इसलिए अनुपात R = 2V / 2I स्थिर रहता है!',
      },
      checkRule: {
        en: 'R depends on L, A, material, and temperature T—NOT on the applied V or I (unless heating changes T).',
        hi: 'R केवल L, A, पदार्थ और ताप T पर निर्भर करता है—लागू V या I पर नहीं।',
      },
    },
    hotsReasoningTask: {
      title: { en: 'HOTS Graph Comparison: Two Temperatures T₁ and T₂', hi: 'उच्च स्तरीय ग्राफ प्रश्न: दो तापमान T₁ और T₂ पर V–I ग्राफ' },
      prompt: {
        en: 'The V–I graph (with V on the y-axis and I on the x-axis) of a metallic wire is plotted at two temperatures T₁ and T₂. The straight line for T₂ is steeper than for T₁. Which temperature is higher, and why?',
        hi: 'किसी धातु के तार का V–I ग्राफ (y-अक्ष पर V और x-अक्ष पर I) दो तापमानों T₁ और T₂ पर खींचा गया है। T₂ की रेखा T₁ से अधिक खड़ी (तीव्र ढाल वाली) है। कौन-सा तापमान अधिक है और क्यों?',
      },
      claimOptions: [
        {
          en: 'T₂ > T₁ (On a V-vs-I graph, slope = V/I = R. Steeper slope means R₂ > R₁, and since metallic resistance rises with temperature, T₂ is higher).',
          hi: 'T₂ > T₁ (V-बनाम-I ग्राफ की ढाल = V/I = R। अधिक ढाल का अर्थ है R₂ > R₁, और धातु का प्रतिरोध ताप के साथ बढ़ता है, अतः T₂ > T₁)।',
        },
        {
          en: 'T₁ > T₂ because lower slope means higher temperature.',
          hi: 'T₁ > T₂ क्योंकि कम ढाल का अर्थ अधिक तापमान है।',
        },
      ],
      correctClaimIndex: 0,
      claimExplanation: {
        en: 'With V on the vertical axis and I on the horizontal axis, slope = ΔV/ΔI = R. Larger slope means higher R and therefore higher temperature T₂.',
        hi: 'ऊर्ध्वाधर अक्ष पर V और क्षैतिज अक्ष पर I होने पर ढाल = V/I = R होती है। अतः अधिक ढाल का अर्थ है अधिक प्रतिरोध R₂ और उच्च ताप T₂।',
      },
      rubricPoints: [
        { en: 'Identifies that slope of V–I graph (V on y-axis) equals resistance R = V/I.', hi: 'पहचानता है कि V–I ग्राफ की ढाल प्रतिरोध R = V/I के बराबर है।' },
        { en: 'Deduces R₂ > R₁ from the steeper line at T₂.', hi: 'T₂ की अधिक ढाल से R₂ > R₁ निष्कर्ष निकालता है।' },
        { en: 'Uses the positive temperature coefficient of metals (R ↑ as T ↑) to conclude T₂ > T₁.', hi: 'धातुओं में ताप बढ़ने पर प्रतिरोध बढ़ने के नियम से T₂ > T₁ सिद्ध करता है।' },
      ],
    },
  },

  'series-parallel-failure': {
    ncertSection: 'NCERT Class 10 Science · §11.6.1 & §11.6.2 Series vs Parallel Domestic Wiring',
    openingQuestion: {
      en: '“Why does one burnt bulb extinguish an entire string of series fairy lights, while your house lights stay on when one bulb fuses?”',
      hi: '“एक बल्ब फ्यूज होने पर श्रेणीक्रम की पूरी लड़ी क्यों बुझ जाती है, जबकि घर के अन्य बल्ब जलते रहते हैं?”',
    },
    experimentProtocol: {
      goal: {
        en: 'Click any bulb on the left Click-to-Fuse SVG Circuit Bench in both 1. Series Circuit and 2. Parallel Circuit modes.',
        hi: 'बाईं ओर सर्किट बेंच पर 1. श्रेणीक्रम और 2. पार्श्वक्रम दोनों मोड में किसी भी बल्ब पर क्लिक करके उसे फ्यूज करें।',
      },
      steps: [
        {
          en: '1. In Series Circuit mode, click Bulb 2 (B2) to fuse it. Observe that B1 and B3 also go dark because the single loop is open!',
          hi: '1. श्रेणीक्रम मोड में बल्ब 2 (B2) को फ्यूज करें। देखें कि एकल मार्ग टूटने से B1 और B3 भी बुझ जाते हैं!',
        },
        {
          en: '2. Switch to Parallel Circuit mode and fuse Bulb 2. Observe that B1 and B3 continue glowing at full 220 V!',
          hi: '2. पार्श्वक्रम मोड में स्विच करें और बल्ब 2 को फ्यूज करें। देखें कि B1 और B3 पूरे 220 V पर जलते रहते हैं!',
        },
      ],
      observationCheck: {
        prompt: {
          en: 'Give TWO distinct scientific reasons why household appliances are never connected in series.',
          hi: 'घरेलू उपकरणों को श्रेणीक्रम में न जोड़ने के दो मुख्य वैज्ञानिक कारण क्या हैं?',
        },
        options: [
          { en: '(1) If one appliance fails or is switched off, the entire circuit opens; (2) A single loop cannot give different currents (e.g. 0.5 A bulb vs 10 A heater) or full 220 V to each appliance', hi: '(1) एक उपकरण बंद या खराब होने पर पूरा परिपथ रुक जाता है; (2) श्रेणीक्रम में बल्ब और हीटर को अलग-अलग धारा और पूरा 220 V नहीं मिल सकता' },
          { en: 'Series circuits use too many switches', hi: 'श्रेणीक्रम में बहुत अधिक स्विच लगते हैं' },
          { en: 'Parallel circuits increase total resistance', hi: 'पार्श्वक्रम कुल प्रतिरोध को बढ़ाता है' },
        ],
        correctIndex: 0,
        explanation: {
          en: 'NCERT §11.6.2 highlights both reasons: independent switching/fault isolation AND different current requirements at the same 220 V voltage.',
          hi: 'एनसीईआरटी §11.6.2 दोनों कारण बताता है: स्वतंत्र स्विचिंग तथा समान 220 V पर भिन्न धारा की आवश्यकता।',
        },
      },
    },
    discoveryNotes: {
      physicalMeaning: {
        en: 'A series circuit has a single conduction path; a parallel circuit provides an independent branch across the supply rails for each load.',
        hi: 'श्रेणीक्रम में धारा का केवल एक मार्ग होता है; पार्श्वक्रम में प्रत्येक उपकरण को सप्लाई से स्वतंत्र शाखा मिलती है।',
      },
      scalingRule: {
        en: 'Series: R_s = R₁ + R₂ + ... (increases R). Parallel: 1/R_p = 1/R₁ + 1/R₂ + ... (decreases R_eq below the smallest branch!).',
        hi: 'श्रेणीक्रम: R_s = R₁ + R₂ (प्रतिरोध बढ़ता है)। पार्श्वक्रम: 1/R_p = 1/R₁ + 1/R₂ (तुल्य प्रतिरोध सबसे छोटे प्रतिरोध से भी कम होता है!)।',
      },
      siUnitRule: {
        en: 'In Indian domestic wiring, every parallel branch receives V = 220 V AC at 50 Hz.',
        hi: 'भारतीय घरेलू वायरिंग में प्रत्येक समानांतर शाखा को 220 V AC (50 Hz) मिलता है।',
      },
    },
    workedNumerical: {
      title: { en: 'NCERT Example 11.8: 3-Branch Parallel Circuit', hi: 'एनसीईआरटी उदाहरण 11.8: तीन शाखाओं वाला पार्श्वक्रम परिपथ' },
      problem: {
        en: 'Three resistors R₁ = 5 Ω, R₂ = 10 Ω, and R₃ = 30 Ω are connected in parallel across a 12 V battery. Find (a) the current through each resistor, (b) total current, and (c) total equivalent resistance.',
        hi: 'R₁ = 5 Ω, R₂ = 10 Ω तथा R₃ = 30 Ω के तीन प्रतिरोधकों को 12 V की बैटरी से पार्श्वक्रम में जोड़ा गया है। (a) प्रत्येक से प्रवाहित धारा, (b) कुल धारा, तथा (c) कुल प्रतिरोध ज्ञात कीजिए।',
      },
      given: [
        { en: 'V = 12 V across every parallel branch', hi: 'प्रत्येक समानांतर शाखा पर वोल्टेज V = 12 V' },
        { en: 'R₁ = 5 Ω, R₂ = 10 Ω, R₃ = 30 Ω', hi: 'R₁ = 5 Ω, R₂ = 10 Ω, R₃ = 30 Ω' },
      ],
      formula: 'I_k = V / R_k  |  I_total = I₁ + I₂ + I₃  |  R_p = V / I_total',
      substitution: 'I₁ = 12/5 = 2.4 A, I₂ = 12/10 = 1.2 A, I₃ = 12/30 = 0.4 A  →  I_total = 4.0 A  →  R_p = 12/4 = 3 Ω',
      answer: { en: 'Branch currents: 2.4 A, 1.2 A, 0.4 A; Total current = 4.0 A; R_p = 3.0 Ω (< 5 Ω!).', hi: 'शाखा धाराएं: 2.4 A, 1.2 A, 0.4 A; कुल धारा = 4.0 A; तुल्य प्रतिरोध R_p = 3.0 Ω (< 5 Ω!)।' },
      unitTrapNote: {
        en: 'After finding 1/R_p = 1/3 Ω⁻¹, remember to take the reciprocal to get R_p = 3 Ω!',
        hi: '1/R_p = 1/3 निकालने के बाद व्युत्क्रम (उल्टा) करके R_p = 3 Ω लिखना न भूलें!',
      },
    },
    contrastTrap: {
      trapTitle: { en: 'Forgetting to Invert 1/R_p at the Final Step', hi: 'अंतिम चरण में 1/R_p को उलटना भूल जाना' },
      commonMistake: {
        en: 'Computing 1/R_p = 1/5 + 1/10 + 1/30 = 10/30 = 1/3 and writing R_p = 0.33 Ω instead of 3 Ω.',
        hi: '1/R_p = 1/3 निकालने के बाद R_p = 3 Ω के बजाय 0.33 Ω लिख देना।',
      },
      correctPhysics: {
        en: '1/R_p is the conductance; always invert the fraction at the end AND sanity-check that R_p is slightly smaller than the smallest branch resistor (3 Ω < 5 Ω).',
        hi: 'अंत में भिन्न को हमेशा पलटें और जांचें कि तुल्य प्रतिरोध R_p सबसे छोटे प्रतिरोध (5 Ω) से थोड़ा कम (3 Ω) है।',
      },
      checkRule: {
        en: 'Sanity Check: In series, R_s > largest R; in parallel, R_p < smallest R.',
        hi: 'जांच नियम: श्रेणीक्रम में R_s सबसे बड़े प्रतिरोध से बड़ा होता है; पार्श्वक्रम में R_p सबसे छोटे प्रतिरोध से छोटा होता है।',
      },
    },
    hotsReasoningTask: {
      title: { en: 'HOTS Reasoning: Switching Off One Branch in Parallel', hi: 'उच्च स्तरीय तर्क: समानांतर क्रम में एक उपकरण बंद करना' },
      prompt: {
        en: 'Three identical bulbs A, B, and C are connected in parallel across an ideal 220 V supply. If bulb C is switched OFF, what happens to (i) the brightness of bulbs A and B, and (ii) the total current drawn from the mains?',
        hi: 'तीन समान बल्ब A, B और C आदर्श 220 V सप्लाई से समानांतर क्रम में जुड़े हैं। यदि बल्ब C बंद कर दिया जाए, तो (i) बल्ब A और B की चमक, तथा (ii) मेन्स से ली गई कुल धारा पर क्या प्रभाव पड़ेगा?',
      },
      claimOptions: [
        {
          en: '(i) Brightness of A and B stays unchanged (each still gets 220 V); (ii) Total mains current decreases from 3I to 2I.',
          hi: '(i) A और B की चमक अपरिवर्तित रहती है (दोनों को 220 V मिलता रहता है); (ii) कुल मुख्य धारा 3I से घटकर 2I हो जाती है।',
        },
        {
          en: 'Bulbs A and B get brighter because bulb C’s current goes into them.',
          hi: 'बल्ब A और B अधिक चमकने लगते हैं क्योंकि C की धारा उनमें चली जाती है।',
        },
      ],
      correctClaimIndex: 0,
      claimExplanation: {
        en: 'Each parallel branch is connected directly across 220 V, so I_A = 220/R and I_B = 220/R do not change when branch C opens. Total current drops from I_A + I_B + I_C to I_A + I_B.',
        hi: 'प्रत्येक समानांतर शाखा सीधे 220 V से जुड़ी है, इसलिए शाखा C खुलने पर I_A और I_B नहीं बदलते। कुल धारा 3I से घटकर 2I हो जाती है।',
      },
      rubricPoints: [
        { en: 'States that voltage across branches A and B remains 220 V.', hi: 'बताता है कि शाखा A और B पर वोल्टेज 220 V बना रहता है।' },
        { en: 'Concludes current and power (V²/R) in bulbs A and B stay unchanged.', hi: 'निष्कर्ष निकालता है कि A और B में धारा और चमक (V²/R) अपरिवर्तित रहती है।' },
        { en: 'Explains that total line current I_total = ΣI_branch decreases when one branch is switched off.', hi: 'स्पष्ट करता है कि एक शाखा बंद होने पर कुल धारा I_total = ΣI_branch घट जाती है।' },
      ],
    },
  },

  'electrical-energy-transfer': {
    ncertSection: 'NCERT Class 10 Science · §11.7 Heating Effect of Electric Current',
    openingQuestion: {
      en: '“When current flows through a resistor, where does the electrical energy go?”',
      hi: '“जब किसी प्रतिरोधक से विद्युत धारा प्रवाहित होती है, तो विद्युत ऊर्जा कहाँ जाती है?”',
    },
    experimentProtocol: {
      goal: {
        en: 'Use the Electrical-to-Thermal Conservation Bench on the left to vary Voltage V, Current I, and Runtime t.',
        hi: 'बाईं ओर विद्युत-से-ऊष्मा संरक्षण बेंच पर वोल्टेज V, धारा I और समय t बदलें।',
      },
      steps: [
        {
          en: '1. Set V = 220 V, I = 5 A, and Runtime = 10 mins (600 s). Observe Power = 1100 W and Heat = 660.0 kJ.',
          hi: '1. V = 220 V, I = 5 A और समय = 10 मिनट (600 s) रखें। शक्ति = 1100 W और ऊष्मा = 660.0 kJ देखें।',
        },
        {
          en: '2. Double Runtime to 20 mins (1200 s). Notice Heat doubles to 1320.0 kJ while 100% of electrical work becomes thermal energy.',
          hi: '2. समय दोगुना करके 20 मिनट (1200 s) करें। देखें कि ऊष्मा दोगुनी (1320.0 kJ) हो जाती है।',
        },
      ],
      observationCheck: {
        prompt: {
          en: 'For a purely resistive heating element (like an electric iron or toaster), how are electrical work W = VIt and Joule heat H = I²Rt related?',
          hi: 'एक शुद्ध प्रतिरोधक तापन अवयव (जैसे प्रेस या टोस्टर) के लिए विद्युत कार्य W = VIt और जूल ऊष्मा H = I²Rt कैसे संबंधित हैं?',
        },
        options: [
          { en: 'They are 100% equal: since V = IR by Ohm’s law, W = (IR)·I·t = I²Rt = H', hi: 'वे 100% बराबर हैं: ओम के नियम V = IR से, W = (IR)·I·t = I²Rt = H' },
          { en: 'Only half of electrical work becomes heat', hi: 'केवल आधा विद्युत कार्य ऊष्मा बनता है' },
          { en: 'Heat depends only on voltage and not on time', hi: 'ऊष्मा समय पर निर्भर नहीं करती' },
        ],
        correctIndex: 0,
        explanation: {
          en: 'In a purely resistive conductor, all electrical work done by the battery goes into heating the resistor (H = VIt = I²Rt).',
          hi: 'शुद्ध प्रतिरोधक चालक में बैटरी द्वारा किया गया समस्त विद्युत कार्य ऊष्मा में परिवर्तित हो जाता है (H = VIt = I²Rt)।',
        },
      },
    },
    discoveryNotes: {
      physicalMeaning: {
        en: 'Joule’s Law of Heating states that heat H produced in a resistor is (i) directly proportional to I², (ii) directly proportional to R, and (iii) directly proportional to time t.',
        hi: 'जूल का तापन नियम: किसी प्रतिरोधक में उत्पन्न ऊष्मा H (i) धारा के वर्ग I² के, (ii) प्रतिरोध R के, तथा (iii) समय t के अनुक्रमानुपाती होती है।',
      },
      scalingRule: {
        en: 'H = V · I · t = I² · R · t = (V² / R) · t.',
        hi: 'H = V · I · t = I² · R · t = (V² / R) · t।',
      },
      siUnitRule: {
        en: 'Always convert time t into SECONDS so that Watts (J/s) × seconds gives Joules (J).',
        hi: 'समय t को हमेशा सेकंड में बदलें ताकि वाट (J/s) × सेकंड से जूल (J) प्राप्त हो।',
      },
    },
    workedNumerical: {
      title: { en: 'NCERT Example 11.10 & 11.11: Electric Iron Joule Heating', hi: 'एनसीईआरटी उदाहरण 11.10 व 11.11: विद्युत इस्तरी में जूल तापन' },
      problem: {
        en: 'An electric iron of resistance 20 Ω takes a current of 5 A. Calculate the heat developed in 30 seconds.',
        hi: '20 Ω प्रतिरोध की कोई विद्युत इस्तरी 5 A विद्युत धारा लेती है। 30 s में उत्पन्न ऊष्मा परिकलित कीजिए।',
      },
      given: [
        { en: 'Current I = 5 A, Resistance R = 20 Ω', hi: 'विद्युत धारा I = 5 A, प्रतिरोध R = 20 Ω' },
        { en: 'Time t = 30 s', hi: 'समय t = 30 s' },
      ],
      formula: 'H = I² × R × t',
      substitution: 'H = (5 A)² × 20 Ω × 30 s = 25 × 20 × 30 = 15,000 J = 15 kJ',
      answer: { en: 'Heat developed H = 15,000 J (15 kJ = 1.5 × 10⁴ J).', hi: 'उत्पन्न ऊष्मा H = 15,000 J (15 kJ = 1.5 × 10⁴ J)।' },
      unitTrapNote: {
        en: 'Remember to square the current I = 5 A → I² = 25 A² before multiplying by R and t!',
        hi: 'R और t से गुणा करने से पहले धारा I = 5 A का वर्ग (I² = 25) करना न भूलें!',
      },
    },
    contrastTrap: {
      trapTitle: { en: 'Forgetting to Square Current I in H = I²Rt', hi: 'H = I²Rt में धारा I का वर्ग करना भूल जाना' },
      commonMistake: {
        en: 'Computing I × R × t (which is V × t, not energy!) instead of I² × R × t.',
        hi: 'I² × R × t के बजाय केवल I × R × t की गणना कर देना।',
      },
      correctPhysics: {
        en: 'Voltage is V = I × R, so energy W = V × I × t = (I × R) × I × t = I²Rt. Doubling current quadruples heat!',
        hi: 'V = I × R होता है, इसलिए ऊर्जा W = V × I × t = I²Rt होती है। धारा दोगुनी करने पर ऊष्मा 4 गुनी हो जाती है!',
      },
      checkRule: {
        en: 'If I is doubled for the same R and t, heat H increases by 2² = 4 times.',
        hi: 'यदि समान R और t के लिए धारा I दोगुनी की जाए, तो ऊष्मा 2² = 4 गुनी बढ़ जाती है।',
      },
    },
    hotsReasoningTask: {
      title: { en: 'HOTS Reasoning: Heating Element Glows While Cord Stays Cool', hi: 'उच्च स्तरीय तर्क: हीटर की कुंडली चमकती है पर डोरी ठंडी क्यों रहती है?' },
      prompt: {
        en: 'NCERT In-Text Q1 (§11.7): Why does the cord of an electric heater not glow while the heating element does, even though both carry the exact same series current?',
        hi: 'एनसीईआरटी प्रश्न (§11.7): किसी विद्युत हीटर की डोरी क्यों उत्तप्त नहीं होती जबकि उसका तापन अवयव उत्तप्त हो जाता है, यद्यपि दोनों में समान धारा बहती है?',
      },
      claimOptions: [
        {
          en: 'The cord (copper) and heating element (nichrome alloy) are in series and carry the same current I, but R_nichrome >> R_copper, so by H = I²Rt almost all heat is generated in the high-resistance heating element.',
          hi: 'तांबे की डोरी और नाइक्रोम कुंडली श्रेणीक्रम में समान धारा I वहन करते हैं, पर नाइक्रोम का प्रतिरोध तांबे से बहुत अधिक है, अतः H = I²Rt के अनुसार लगभग सारी ऊष्मा तापन अवयव में बनती है।',
        },
        {
          en: 'Current is used up inside the heating element before reaching the cord.',
          hi: 'धारा तापन अवयव में ही समाप्त हो जाती है।',
        },
      ],
      correctClaimIndex: 0,
      claimExplanation: {
        en: 'Both carry identical current I in series. Since H = I²Rt and R_element >> R_cord, the high-resistance nichrome coil becomes red-hot while the low-resistance copper cord stays cool.',
        hi: 'श्रेणीक्रम में दोनों में समान धारा I बहती है। H = I²Rt और R_element >> R_cord होने से नाइक्रोम कुंडली लाल-तप्त हो जाती है जबकि तांबे की डोरी ठंडी रहती है।',
      },
      rubricPoints: [
        { en: 'States that the copper cord and nichrome element are in series and carry the same current I.', hi: 'बताता है कि डोरी और तापन अवयव श्रेणीक्रम में हैं और उनमें समान धारा I बहती है।' },
        { en: 'Contrasts the very low resistance of copper with the high resistance of the nichrome heating coil.', hi: 'तांबे के अति निम्न प्रतिरोध और नाइक्रोम के उच्च प्रतिरोध की तुलना करता है।' },
        { en: 'Uses H = I²Rt to show H_element >> H_cord.', hi: 'H = I²Rt से दर्शाता है कि H_element >> H_cord।' },
      ],
    },
  },

  'charge-conservation-junction': {
    ncertSection: 'NCERT Class 10 Science · §11.6 Electric Charge Conservation in Circuits',
    openingQuestion: {
      en: '“Do resistors ‘consume’ electric current as charges flow through a circuit?”',
      hi: '“क्या प्रतिरोधक परिपथ में बहने वाली विद्युत धारा को ‘खर्च/नष्ट’ कर देते हैं?”',
    },
    experimentProtocol: {
      goal: {
        en: 'Vary Inflow Current 1, Inflow Current 2, and Branch Split Ratio on the left Junction Node Bench.',
        hi: 'बाईं ओर संधि (Junction) बेंच पर प्रवेश धारा 1, प्रवेश धारा 2 और शाखा अनुपात बदलें।',
      },
      steps: [
        {
          en: '1. Set I₁(in) = 3.0 A and I₂(in) = 2.0 A (ΣI_in = 5.0 A). Vary the split ratio from 0.2 to 0.8.',
          hi: '1. I₁(in) = 3.0 A और I₂(in) = 2.0 A (कुल प्रवेश = 5.0 A) रखें। विभाजन अनुपात को 0.2 से 0.8 तक बदलें।',
        },
        {
          en: '2. Verify that for every split ratio, I₃(out) + I₄(out) always equals 5.0 A!',
          hi: '2. सत्यापित करें कि प्रत्येक अनुपात के लिए निकास धारा I₃ + I₄ का योग हमेशा 5.0 A रहता है!',
        },
      ],
      observationCheck: {
        prompt: {
          en: 'If 4.5 A enters a parallel junction that splits into two branches, and one branch carries 1.8 A, how much current MUST flow in the second branch?',
          hi: 'यदि 4.5 A की धारा एक समानांतर जोड़ में प्रवेश करती है और एक शाखा में 1.8 A जाती है, तो दूसरी शाखा में कितनी धारा बहेगी?',
        },
        options: [
          { en: '2.7 A (Because ΣI_in = ΣI_out  ⇒  4.5 A − 1.8 A = 2.7 A)', hi: '2.7 A (क्योंकि ΣI_in = ΣI_out  ⇒  4.5 A − 1.8 A = 2.7 A)' },
          { en: '4.5 A in both branches', hi: 'दोनों शाखाओं में 4.5 A' },
          { en: 'Less than 2.7 A because the node consumes charge', hi: '2.7 A से कम क्योंकि जोड़ पर आवेश खर्च हो जाता है' },
        ],
        correctIndex: 0,
        explanation: {
          en: 'Electric charge cannot accumulate or vanish at a wire junction, so the total rate of charge entering per second equals the total rate leaving.',
          hi: 'तार के जोड़ पर आवेश न तो जमा हो सकता है और न नष्ट, इसलिए प्रति सेकंड आने वाला आवेश जाने वाले आवेश के बराबर होता है।',
        },
      },
    },
    discoveryNotes: {
      physicalMeaning: {
        en: 'Resistors transform electrical ENERGY into heat/light, but every single electron (charge) that enters a resistor exits the other side.',
        hi: 'प्रतिरोधक विद्युत ऊर्जा को ऊष्मा/प्रकाश में बदलते हैं, परंतु प्रतिरोधक में प्रवेश करने वाला प्रत्येक इलेक्ट्रॉन दूसरी ओर से बाहर निकलता है।',
      },
      scalingRule: {
        en: 'Series: I_before = I_after. Parallel Junction: I_total = I₁ + I₂ + ...',
        hi: 'श्रेणीक्रम: I_पहले = I_बाद में। समानांतर संधि: I_कुल = I₁ + I₂ + ...',
      },
      siUnitRule: {
        en: '1 A = 1 C/s entering a node means 1 C/s must leave that node.',
        hi: 'किसी बिंदु पर 1 A = 1 C/s का प्रवेश अर्थात 1 C/s का निकास।',
      },
    },
    workedNumerical: {
      title: { en: 'Worked Numerical: Ammeter Readings in a Split Circuit', hi: 'हल किया गया प्रश्न: विभाजित परिपथ में अमीटर पाठ्यांक' },
      problem: {
        en: 'A battery supplies a total current of 3.6 A, which splits at junction A into two parallel branches of resistances R₁ = 6 Ω and R₂ = 12 Ω before recombining at junction B. Find the current in each branch and the current returning to the negative terminal.',
        hi: 'एक बैटरी 3.6 A की कुल धारा देती है जो संधि A पर R₁ = 6 Ω और R₂ = 12 Ω की दो समानांतर शाखाओं में बँटती है और संधि B पर पुनः मिलती है। प्रत्येक शाखा में धारा तथा बैटरी के ऋण टर्मिनल पर लौटने वाली धारा ज्ञात कीजिए।',
      },
      given: [
        { en: 'I_total = 3.6 A entering junction A', hi: 'संधि A पर कुल प्रवेश धारा I_total = 3.6 A' },
        { en: 'Parallel branches: R₁ = 6 Ω, R₂ = 12 Ω (so I₁ : I₂ = R₂ : R₁ = 2 : 1)', hi: 'शाखाएं: R₁ = 6 Ω, R₂ = 12 Ω (अतः धारा अनुपात I₁ : I₂ = 2 : 1)' },
      ],
      formula: 'I₁ + I₂ = I_total  |  I_return = I₁ + I₂',
      substitution: 'I₁ = (2/3) × 3.6 A = 2.4 A  |  I₂ = (1/3) × 3.6 A = 1.2 A  |  I_return = 2.4 + 1.2 = 3.6 A',
      answer: { en: 'I₁ = 2.4 A, I₂ = 1.2 A; Current returning to the battery is the full 3.6 A.', hi: 'I₁ = 2.4 A, I₂ = 1.2 A; बैटरी में वापस लौटने वाली धारा पूरी 3.6 A है।' },
      unitTrapNote: {
        en: 'The current returning to the negative terminal of the battery is NEVER less than the current leaving the positive terminal!',
        hi: 'बैटरी के ऋण टर्मिनल पर लौटने वाली धारा धन टर्मिनल से निकलने वाली धारा से कभी कम नहीं होती!',
      },
    },
    contrastTrap: {
      trapTitle: { en: 'The “Current Gets Used Up by the Bulb” Myth', hi: '“बल्ब धारा को खा जाता है” का भ्रम' },
      commonMistake: {
        en: 'Believing that an ammeter placed after a bulb reads less current than an ammeter placed before the bulb.',
        hi: 'यह सोचना कि बल्ब के बाद लगा अमीटर बल्ब से पहले लगे अमीटर की तुलना में कम धारा दिखाएगा।',
      },
      correctPhysics: {
        en: 'Charges are like links of a bicycle chain moving around the loop—energy is transferred to the bulb (potential V drops), but the charge flow rate (current I) is identical before and after the bulb.',
        hi: 'आवेश साइकिल की चेन की कड़ियों की तरह पूरे लूप में एक साथ चलते हैं—बल्ब में विभव V गिरता है (ऊर्जा स्थानांतरित होती है), पर धारा I बल्ब के पहले और बाद में समान रहती है।',
      },
      checkRule: {
        en: 'Potential (V) drops across a resistor; Current (I) stays constant along any unbranched path.',
        hi: 'प्रतिरोधक के सिरों पर विभव (V) गिरता है; किसी भी बिना शाखा वाले पथ में धारा (I) समान रहती है।',
      },
    },
    hotsReasoningTask: {
      title: { en: 'HOTS Reasoning: Two Ammeters A₁ and A₂ in Series', hi: 'उच्च स्तरीय तर्क: श्रेणीक्रम में दो अमीटर A₁ और A₂' },
      prompt: {
        en: 'In a series circuit containing a 12 V battery, ammeter A₁, a 4 Ω bulb, a 2 Ω resistor, and ammeter A₂ (placed just before the negative terminal), compare the readings of A₁ and A₂ and explain physically.',
        hi: 'एक श्रेणी परिपथ में 12 V बैटरी, अमीटर A₁, 4 Ω बल्ब, 2 Ω प्रतिरोधक और ऋण टर्मिनल से ठीक पहले अमीटर A₂ लगे हैं। A₁ और A₂ के पाठ्यांकों की तुलना करें और कारण स्पष्ट करें।',
      },
      claimOptions: [
        {
          en: 'Both A₁ and A₂ read the exact same current (2.0 A) because charge is conserved and cannot be consumed by resistors.',
          hi: 'A₁ और A₂ दोनों समान धारा (2.0 A) दिखाते हैं क्योंकि आवेश संरक्षित रहता है और प्रतिरोधक धारा को नष्ट नहीं करते।',
        },
        {
          en: 'A₁ reads 2.0 A and A₂ reads 0 A because the bulb and resistor use up the current.',
          hi: 'A₁ में 2.0 A और A₂ में 0 A होगा क्योंकि बल्ब धारा खर्च कर लेता है।',
        },
      ],
      correctClaimIndex: 0,
      claimExplanation: {
        en: 'R_total = 4 + 2 = 6 Ω, so I = 12 V / 6 Ω = 2.0 A everywhere in the single loop.',
        hi: 'R_total = 4 + 2 = 6 Ω, अतः पूरे एकल लूप में हर बिंदु पर धारा I = 12 V / 6 Ω = 2.0 A है।',
      },
      rubricPoints: [
        { en: 'Calculates total series resistance R_s = 4 + 2 = 6 Ω and loop current I = 12 / 6 = 2.0 A.', hi: 'कुल प्रतिरोध R_s = 6 Ω और धारा I = 2.0 A की गणना करता है।' },
        { en: 'States that A₁ and A₂ show the exact same reading (2.0 A).', hi: 'स्पष्ट करता है कि A₁ और A₂ दोनों का पाठ्यांक समान (2.0 A) है।' },
        { en: 'Explains that resistors convert electrical energy into heat/light while conserving electric charge.', hi: 'समझाता है कि प्रतिरोधक आवेश को संरक्षित रखते हुए केवल विद्युत ऊर्जा को ऊष्मा/प्रकाश में बदलते हैं।' },
      ],
    },
  },

  'circuit-power-balance': {
    ncertSection: 'NCERT Class 10 Science · §11.8 Complete Circuit Power Conservation',
    openingQuestion: {
      en: '“Does the power supplied by a battery always equal the sum of powers dissipated in all resistors?”',
      hi: '“क्या बैटरी द्वारा दी गई कुल शक्ति हमेशा सभी प्रतिरोधकों में खर्च हुई शक्तियों के योग के बराबर होती है?”',
    },
    experimentProtocol: {
      goal: {
        en: 'Adjust Battery Voltage V, R₁, and R₂ on the left Circuit Power Balance Bench.',
        hi: 'बाईं ओर परिपथ शक्ति संतुलन बेंच पर बैटरी वोल्टेज V, R₁ और R₂ को बदलें।',
      },
      steps: [
        {
          en: '1. At V = 12 V, R₁ = 6 Ω, R₂ = 4 Ω, observe P₁ = 24 W, P₂ = 36 W, and Battery Power P_in = 60 W (24 + 36 = 60 W!).',
          hi: '1. V = 12 V, R₁ = 6 Ω, R₂ = 4 Ω पर देखें कि P₁ = 24 W, P₂ = 36 W और बैटरी शक्ति P_in = 60 W (24 + 36 = 60 W!) है।',
        },
        {
          en: '2. Change R₁ and R₂ to any values and verify that P_battery = V × I_total always matches P₁ + P₂.',
          hi: '2. R₁ और R₂ का कोई भी मान रखें और सत्यापित करें कि P_battery हमेशा P₁ + P₂ के बराबर होती है।',
        },
      ],
      observationCheck: {
        prompt: {
          en: 'Whether resistors are connected in series OR in parallel, how is total circuit power P_total related to the individual resistor powers P₁ and P₂?',
          hi: 'चाहे प्रतिरोधक श्रेणीक्रम में जुड़े हों या समानांतर क्रम में, कुल परिपथ शक्ति P_total व्यक्तिगत शक्तियों P₁ और P₂ से कैसे संबंधित होती है?',
        },
        options: [
          { en: 'Powers ALWAYS add directly: P_total = P₁ + P₂ in both series and parallel circuits', hi: 'शक्तियाँ हमेशा सीधे जुड़ती हैं: श्रेणी और समानांतर दोनों में P_total = P₁ + P₂' },
          { en: 'In parallel, 1/P_total = 1/P₁ + 1/P₂', hi: 'समानांतर क्रम में 1/P_total = 1/P₁ + 1/P₂ होता है' },
          { en: 'Battery power is larger than P₁ + P₂', hi: 'बैटरी शक्ति P₁ + P₂ से अधिक होती है' },
        ],
        correctIndex: 0,
        explanation: {
          en: 'Because energy is a scalar conserved quantity, the total energy transferred per second by the source must equal the sum of energies dissipated per second in all loads (P_source = P₁ + P₂).',
          hi: 'चूंकि ऊर्जा संरक्षित अदिश राशि है, इसलिए स्रोत द्वारा प्रति सेकंड दी गई कुल ऊर्जा सभी लोड में प्रति सेकंड खर्च ऊर्जा के योग के बराबर होती है (P_source = P₁ + P₂)।',
        },
      },
    },
    discoveryNotes: {
      physicalMeaning: {
        en: 'Conservation of energy per unit time guarantees P_supplied = Σ P_dissipated in every circuit.',
        hi: 'प्रति इकाई समय ऊर्जा संरक्षण यह सुनिश्चित करता है कि प्रत्येक परिपथ में P_प्रदाय = Σ P_खपत।',
      },
      scalingRule: {
        en: 'In parallel at 220 V, adding another appliance of power P₃ simply adds P₃ to the total house power draw (P_total = P₁ + P₂ + P₃).',
        hi: '220 V समानांतर वायरिंग में P₃ शक्ति का नया उपकरण चालू करने पर कुल शक्ति सीधे जुड़ जाती है (P_total = P₁ + P₂ + P₃)।',
      },
      siUnitRule: {
        en: 'Total mains current drawn is I_total = P_total / V_mains.',
        hi: 'मेन्स से ली गई कुल धारा I_total = P_total / V_mains होती है।',
      },
    },
    workedNumerical: {
      title: { en: 'NCERT Exercise Q12: Multiple Bulbs on a 5 A Line', hi: 'एनसीईआरटी अभ्यास प्रश्न 12: 5 A लाइन पर कई बल्ब' },
      problem: {
        en: 'Several electric bulbs designed to be used on a 220 V electric supply line are rated 10 W. How many lamps can be connected in parallel with each other across the two wires of 220 V line if the maximum allowable current is 5 A?',
        hi: '220 V की विद्युत लाइन पर उपयोग किए जाने वाले बहुत से बल्बों का अनुमतांक 10 W है। यदि 220 V लाइन से अनुमत अधिकतम धारा 5 A है, तो इस लाइन के दो तारों के बीच कितने बल्ब पार्श्वक्रम में संयोजित किए जा सकते हैं?',
      },
      given: [
        { en: 'Supply V = 220 V, Max current I_max = 5 A', hi: 'सप्लाई V = 220 V, अधिकतम धारा I_max = 5 A' },
        { en: 'Each bulb power P₁ = 10 W', hi: 'प्रत्येक बल्ब की शक्ति P₁ = 10 W' },
      ],
      formula: 'P_max = V × I_max = N × P₁  ⇒  N = (V × I_max) / P₁',
      substitution: 'P_max = 220 V × 5 A = 1100 W  ⇒  N = 1100 W / 10 W = 110 bulbs',
      answer: { en: '110 bulbs of 10 W each can be connected safely in parallel!', hi: '10 W के 110 बल्ब समानांतर क्रम में सुरक्षित रूप से जोड़े जा सकते हैं!' },
      unitTrapNote: {
        en: 'Notice how using Power Balance (N × 10 W = 1100 W) solves this in 2 lines without needing to compute the resistance of a single bulb!',
        hi: 'देखें कि शक्ति संतुलन (N × 10 W = 1100 W) से बिना एक बल्ब का प्रतिरोध निकाले यह सवाल 2 लाइनों में हल हो जाता है!',
      },
    },
    contrastTrap: {
      trapTitle: { en: 'Trying to Compute 1/R_p for 110 Bulbs Instead of Adding Powers', hi: 'शक्तियों को सीधे जोड़ने के बजाय 110 बल्बों का 1/R_p निकालना' },
      commonMistake: {
        en: 'Calculating R = 220² / 10 = 4840 Ω and getting lost in fractions for N parallel resistors instead of using P_total = N × P_bulb = V × I_max.',
        hi: 'R = 4840 Ω निकालकर भिन्नों में उलझ जाना, जबकि P_total = N × P_bulb = V × I_max से तुरंत उत्तर आ जाता है।',
      },
      correctPhysics: {
        en: 'In parallel across rated voltage, each bulb consumes its rated 10 W, and total power is simply the sum N × 10 W = V × I_total.',
        hi: 'रेटेड वोल्टेज पर समानांतर क्रम में प्रत्येक बल्ब पूरे 10 W लेता है, और कुल शक्ति सीधे N × 10 W = V × I_total होती है।',
      },
      checkRule: {
        en: 'For parallel appliances at rated V: P_total = P₁ + P₂ + ... and I_total = P_total / V.',
        hi: 'रेटेड वोल्टेज पर समानांतर उपकरणों के लिए: P_total = P₁ + P₂ + ... तथा I_total = P_total / V।',
      },
    },
    hotsReasoningTask: {
      title: { en: 'HOTS Overload Check: Can a 5 A Fuse Handle Iron + Geyser?', hi: 'उच्च स्तरीय ओवरलोड जांच: क्या 5 A का फ्यूज प्रेस और गीज़र सहन कर सकता है?' },
      prompt: {
        en: 'A kitchen circuit at 220 V has a 5 A fuse. If a 1000 W electric iron and a 500 W toaster are switched ON simultaneously in parallel, will the fuse blow? Justify using power balance.',
        hi: '220 V के एक रसोई परिपथ में 5 A का फ्यूज लगा है। यदि 1000 W की विद्युत प्रेस और 500 W का टोस्टर एक साथ समानांतर में चालू किए जाएं, तो क्या फ्यूज उड़ जाएगा? शक्ति संतुलन से स्पष्ट करें।',
      },
      claimOptions: [
        {
          en: 'Yes, the 5 A fuse will blow! Total power P_total = 1000 + 500 = 1500 W, which draws I = 1500 / 220 = 6.82 A (> 5 A fuse limit).',
          hi: 'हाँ, 5 A का फ्यूज पिघल जाएगा! कुल शक्ति P_total = 1000 + 500 = 1500 W, जिससे धारा I = 1500 / 220 = 6.82 A (> 5 A सीमा) हो जाती है।',
        },
        {
          en: 'No, because 1000 W and 500 W divide the current between them.',
          hi: 'नहीं, क्योंकि धारा दोनों में बँट जाएगी।',
        },
      ],
      correctClaimIndex: 0,
      claimExplanation: {
        en: 'A 5 A fuse at 220 V can supply at most P_max = 220 × 5 = 1100 W. Since 1000 W + 500 W = 1500 W > 1100 W (I = 6.82 A > 5 A), the fuse melts to prevent fire.',
        hi: '220 V पर 5 A फ्यूज अधिकतम 220 × 5 = 1100 W सहन कर सकता है। चूंकि 1500 W > 1100 W (6.82 A > 5 A), फ्यूज पिघल जाएगा।',
      },
      rubricPoints: [
        { en: 'Sums parallel load powers: P_total = 1000 W + 500 W = 1500 W.', hi: 'समानांतर लोड शक्तियों को जोड़ता है: P_total = 1000 + 500 = 1500 W।' },
        { en: 'Computes total line current I = P_total / V = 1500 / 220 = 6.82 A (or max fuse power 220 × 5 = 1100 W).', hi: 'कुल धारा I = 1500 / 220 = 6.82 A (या अधिकतम अनुमत शक्ति 1100 W) निकालता है।' },
        { en: 'Concludes 6.82 A > 5 A (overload), causing the fuse wire to melt via Joule heating.', hi: '6.82 A > 5 A (ओवरलोड) से निष्कर्ष निकालता है कि जूल तापन से फ्यूज पिघल जाएगा।' },
      ],
    },
  },

  'mechanical-ramp-conservation': {
    ncertSection: 'NCERT Class 9 Science · §10.2.4 Law of Conservation of Energy',
    openingQuestion: {
      en: '“As a cart rolls down a frictionless ramp, potential energy vanishes—where does every Joule go?”',
      hi: '“जब कोई ट्रॉली घर्षण-रहित ढलान से नीचे उतरती है, तो घटती हुई स्थितिज ऊर्जा का प्रत्येक जूल कहाँ जाता है?”',
    },
    experimentProtocol: {
      goal: {
        en: 'Slide Current Ramp Height h from 10 m down to 0 m on the left Inclined Ramp Bench and watch the PE and KE bars.',
        hi: 'बाईं ओर नत समतल बेंच पर वर्तमान ऊँचाई h को 10 m से 0 m तक स्लाइड करें और PE तथा KE पट्टियों को देखें।',
      },
      steps: [
        {
          en: '1. At the top (h = 10 m, m = 2 kg), note PE = 196 J, KE = 0 J, Total E = 196 J.',
          hi: '1. शीर्ष पर (h = 10 m, m = 2 kg), PE = 196 J, KE = 0 J और कुल ऊर्जा E = 196 J देखें।',
        },
        {
          en: '2. Slide halfway down (h = 5 m) and to the bottom (h = 0 m). Verify PE + KE stays locked at 196 J at every height!',
          hi: '2. आधी ऊँचाई (h = 5 m) और तल (h = 0 m) पर ले जाएं। सत्यापित करें कि हर ऊँचाई पर PE + KE = 196 J स्थिर रहता है!',
        },
      ],
      observationCheck: {
        prompt: {
          en: 'At the exact midpoint of the descent (h = H₀ / 2), how do Potential Energy (PE) and Kinetic Energy (KE) compare?',
          hi: 'उतरते समय ठीक आधी ऊँचाई (h = H₀ / 2) पर स्थितिज ऊर्जा (PE) और गतिज ऊर्जा (KE) में क्या संबंध होता है?',
        },
        options: [
          { en: 'PE = KE = ½ E_total (Exactly half of initial PE has transformed into KE)', hi: 'PE = KE = ½ E_total (प्रारंभिक PE का ठीक आधा भाग KE में बदल चुका है)' },
          { en: 'KE is zero until the cart hits the bottom', hi: 'तल पर पहुँचने तक KE शून्य रहती है' },
          { en: 'KE is one-fourth of PE', hi: 'KE, PE की एक-चौथाई होती है' },
        ],
        correctIndex: 0,
        explanation: {
          en: 'Since PE = mgh is linear in h, at h = H₀/2 the remaining PE is ½E_total, so by conservation KE = E_total − ½E_total = ½E_total.',
          hi: 'चूंकि PE = mgh ऊँचाई h के समानुपाती है, h = H₀/2 पर शेष PE = ½E_total होती है, अतः KE भी ½E_total होती है।',
        },
      },
    },
    discoveryNotes: {
      physicalMeaning: {
        en: 'In the absence of friction, total mechanical energy E = PE + KE = mgh + ½mv² remains constant throughout the motion.',
        hi: 'घर्षण की अनुपस्थिति में कुल यांत्रिक ऊर्जा E = PE + KE = mgh + ½mv² संपूर्ण गति के दौरान नियत रहती है।',
      },
      scalingRule: {
        en: 'ΔKE = −ΔPE = mg(H₀ − h)  ⇒  v = √(2gΔh), which is independent of mass m!',
        hi: 'ΔKE = −ΔPE = mg(H₀ − h)  ⇒  वेग v = √(2gΔh), जो द्रव्यमान m पर निर्भर नहीं करता!',
      },
      siUnitRule: {
        en: 'Mass in kg, height in m, and g in m/s² (9.8 or 10 m/s²) give energy in Joules (J).',
        hi: 'द्रव्यमान kg में, ऊँचाई m में और g (9.8 या 10 m/s²) लेने पर ऊर्जा जूल (J) में प्राप्त होती है।',
      },
    },
    workedNumerical: {
      title: { en: 'NCERT Exercise Q10: Free-Fall / Ramp Energy Conversion', hi: 'एनसीईआरटी अभ्यास प्रश्न 10: मुक्त पतन / ढलान ऊर्जा रूपांतरण' },
      problem: {
        en: 'An object of mass 40 kg is raised to a height of 5 m above the ground. What is its potential energy? If the object is allowed to fall, find its kinetic energy when it is half-way down (take g = 10 m/s²).',
        hi: '40 kg द्रव्यमान का एक पिंड धरती से 5 m की ऊँचाई तक उठाया जाता है। इसकी स्थितिज ऊर्जा क्या है? यदि पिंड को गिरने दिया जाए तो जब यह आधे रास्ते पर है उस समय इसकी गतिज ऊर्जा ज्ञात कीजिए (g = 10 m/s²)।',
      },
      given: [
        { en: 'Mass m = 40 kg, Initial height H₀ = 5 m, g = 10 m/s²', hi: 'द्रव्यमान m = 40 kg, प्रारंभिक ऊँचाई H₀ = 5 m, g = 10 m/s²' },
        { en: 'Half-way height h = 2.5 m', hi: 'आधे रास्ते की ऊँचाई h = 2.5 m' },
      ],
      formula: 'E_total = m · g · H₀  |  KE_halfway = E_total − m · g · (H₀/2) = ½ E_total',
      substitution: 'E_total = 40 × 10 × 5 = 2000 J  →  KE_halfway = ½ × 2000 J = 1000 J',
      answer: { en: 'Initial PE = 2000 J; Kinetic energy half-way down = 1000 J.', hi: 'प्रारंभिक स्थितिज ऊर्जा = 2000 J; आधे रास्ते पर गतिज ऊर्जा = 1000 J।' },
      unitTrapNote: {
        en: 'You don’t need to compute velocity v first to find KE at a given height—just subtract the remaining PE from initial PE!',
        hi: 'किसी ऊँचाई पर गतिज ऊर्जा निकालने के लिए पहले वेग v निकालने की आवश्यकता नहीं है—सीधे प्रारंभिक PE में से शेष PE घटाएं!',
      },
    },
    contrastTrap: {
      trapTitle: { en: 'Thinking Mass m Changes Final Speed on a Frictionless Ramp', hi: 'यह सोचना कि अधिक द्रव्यमान वाली वस्तु ढलान पर तेज़ चलेगी' },
      commonMistake: {
        en: 'Believing a heavier cart (e.g. 10 kg) reaches a higher speed at the bottom of a frictionless ramp than a 2 kg cart.',
        hi: 'यह मानना कि घर्षण-रहित ढलान के तल पर 10 kg की ट्रॉली का वेग 2 kg की ट्रॉली से अधिक होगा।',
      },
      correctPhysics: {
        en: 'While the 10 kg cart has 5× more PE and KE (Joules), setting ½mv² = mgh cancels m on both sides, so v = √(2gh) is identical!',
        hi: '10 kg की ट्रॉली में ऊर्जा (जूल) 5 गुनी होती है, परंतु ½mv² = mgh में दोनों ओर से m कट जाता है, इसलिए वेग v = √(2gh) समान रहता है!',
      },
      checkRule: {
        en: 'Energy (PE, KE) depends on mass m; Speed v = √(2gΔh) depends only on vertical drop Δh.',
        hi: 'ऊर्जा (PE, KE) द्रव्यमान m पर निर्भर करती है; परंतु वेग v = √(2gΔh) केवल ऊर्ध्वाधर ऊँचाई के अंतर Δh पर निर्भर करता है।',
      },
    },
    hotsReasoningTask: {
      title: { en: 'HOTS Reasoning: Does Ramp Slope Angle Change Bottom Speed?', hi: 'उच्च स्तरीय तर्क: क्या ढलान का कोण तल पर वेग बदलता है?' },
      prompt: {
        en: 'Two frictionless slides start at the same height H = 5 m—Slide A is steep and short, while Slide B is gentle and long. Compare the final speed of a child reaching the bottom of Slide A vs Slide B.',
        hi: 'दो घर्षण-रहित फिसलन पट्टियाँ समान ऊँचाई H = 5 m से शुरू होती हैं—पट्टी A खड़ी और छोटी है, जबकि पट्टी B कम ढलान वाली और लंबी है। दोनों के तल पर पहुँचने पर बच्चे की चाल की तुलना करें।',
      },
      claimOptions: [
        {
          en: 'Final speed is identical on both slides (v = √(2gH)) because gravitational PE depends only on vertical height H, and total mechanical energy is conserved.',
          hi: 'दोनों पट्टियों के तल पर अंतिम चाल समान (v = √(2gH)) होगी क्योंकि गुरुत्वीय स्थितिज ऊर्जा केवल ऊर्ध्वाधर ऊँचाई H पर निर्भर करती है।',
        },
        {
          en: 'Slide A gives a higher final speed because it is steeper.',
          hi: 'पट्टी A पर अंतिम चाल अधिक होगी क्योंकि वह अधिक खड़ी है।',
        },
      ],
      correctClaimIndex: 0,
      claimExplanation: {
        en: 'Steeper Slide A has larger acceleration over a shorter distance, while gentle Slide B has smaller acceleration over a longer distance; by mgh = ½mv², both reach the exact same bottom speed v = √(2gH).',
        hi: 'mgh = ½mv² के अनुसार दोनों पट्टियों पर समान स्थितिज ऊर्जा mgh गतिज ऊर्जा में बदलती है, अतः अंतिम चाल v = √(2gH) समान होती है।',
      },
      rubricPoints: [
        { en: 'Writes initial potential energy PE = mgH (same for both slides).', hi: 'दोनों पट्टियों के लिए समान प्रारंभिक स्थितिज ऊर्जा PE = mgH लिखता है।' },
        { en: 'Equates PE_top = KE_bottom (mgH = ½mv²) for frictionless motion.', hi: 'घर्षण-रहित गति के लिए mgH = ½mv² बराबर करता है।' },
        { en: 'Shows v = √(2gH) depends only on vertical drop H, not ramp length or angle.', hi: 'दर्शाता है कि v = √(2gH) केवल ऊर्ध्वाधर ऊँचाई H पर निर्भर करता है, ढलान की लंबाई या कोण पर नहीं।' },
      ],
    },
  },

  'cartesian-sign-trap': {
    ncertSection: 'NCERT Class 10 Science · §9.2.3 & §9.3.4 New Cartesian Sign Convention',
    openingQuestion: {
      en: '“Why does forgetting ONE minus sign turn a correct optics calculation into a completely wrong image position?”',
      hi: '“केवल एक ऋण (−) चिह्न भूल जाने से प्रकाशिकी के सवाल में प्रतिबिंब की पूरी गणना गलत क्यों हो जाती है?”',
    },
    experimentProtocol: {
      goal: {
        en: 'Switch across all 4 optical devices on the left Ray-Tracing Bench and drag the blue Object Arrow to observe the signs of u, f, and v.',
        hi: 'बाईं ओर किरण आरेख बेंच पर चारों प्रकाशिक उपकरणों को चुनें और नीले बिंब तीर को ड्रैग करके u, f और v के चिह्न देखें।',
      },
      steps: [
        {
          en: '1. Select Convex Lens (+f) vs Concave Lens (−f) at |u| = 30 cm, |f| = 15 cm. Observe u is ALWAYS −30 cm (left of O), while f flips from +15 cm to −15 cm.',
          hi: '1. |u| = 30 cm, |f| = 15 cm पर उत्तल लेंस (+f) और अवतल लेंस (−f) की तुलना करें। देखें कि u सदैव −30 cm रहता है, जबकि f +15 cm से −15 cm हो जाता है।',
        },
        {
          en: '2. Switch to Concave Mirror (−f) and Convex Mirror (+f) and notice the mirror formula uses + (1/v + 1/u = 1/f) while the lens formula uses − (1/v − 1/u = 1/f).',
          hi: '2. अवतल दर्पण (−f) और उत्तल दर्पण (+f) पर स्विच करें और देखें कि दर्पण सूत्र में + (1/v + 1/u = 1/f) और लेंस सूत्र में − (1/v − 1/u = 1/f) होता है।',
        },
      ],
      observationCheck: {
        prompt: {
          en: 'Under the New Cartesian Sign Convention, which two spherical devices have a NEGATIVE focal length (f < 0)?',
          hi: 'नई कार्तीय चिह्न परिपाटी के अनुसार किन दो गोलीय उपकरणों की फोकस दूरी ऋणात्मक (f < 0) होती है?',
        },
        options: [
          { en: 'Concave Mirror AND Concave Lens (both have f < 0)', hi: 'अवतल दर्पण और अवतल लेंस दोनों (दोनों के लिए f < 0)' },
          { en: 'Convex Mirror and Convex Lens', hi: 'उत्तल दर्पण और उत्तल लेंस' },
          { en: 'Concave Mirror and Convex Lens', hi: 'अवतल दर्पण और उत्तल लेंस' },
        ],
        correctIndex: 0,
        explanation: {
          en: 'A concave mirror’s principal focus lies in front (left, −x), and a concave lens’s virtual focus for parallel incident light also lies on the left (−x). So Concave = Negative f (-), Convex = Positive f (+)!',
          hi: 'अवतल दर्पण और अवतल लेंस दोनों का मुख्य फोकस बाईं ओर (−x) होता है। अतः याद रखने का सरल नियम: अवतल = ऋणात्मक f (−), उत्तल = धनात्मक f (+) !',
        },
      },
    },
    discoveryNotes: {
      physicalMeaning: {
        en: 'The optical centre O (or pole P) is the Cartesian origin (0, 0). Incident light travels left-to-right (+x), so all distances to the left are negative (−) and to the right are positive (+).',
        hi: 'प्रकाशिक केंद्र O (या ध्रुव P) मूल बिंदु (0, 0) है। आपतित प्रकाश बाएं से दाएं (+x) चलता है, अतः बाईं ओर की सभी दूरियाँ ऋणात्मक (−) और दाईं ओर की धनात्मक (+) होती हैं।',
      },
      scalingRule: {
        en: 'u is ALWAYS negative (−). f is POSITIVE (+) for Convex (lens or mirror) and NEGATIVE (−) for Concave (lens or mirror).',
        hi: 'u सदैव ऋणात्मक (−) होता है। उत्तल (लेंस या दर्पण) के लिए f धनात्मक (+) और अवतल (लेंस या दर्पण) के लिए f ऋणात्मक (−) होता है।',
      },
      siUnitRule: {
        en: 'Keep u, v, and f in matching length units (all in cm) when using 1/v − 1/u = 1/f or 1/v + 1/u = 1/f.',
        hi: 'लेंस या दर्पण सूत्र में u, v और f तीनों को समान इकाई (सभी cm में) में रखें।',
      },
    },
    workedNumerical: {
      title: { en: 'NCERT Example 9.3: Concave Lens Image Position & Magnification', hi: 'एनसीईआरटी उदाहरण 9.3: अवतल लेंस में प्रतिबिंब की स्थिति' },
      problem: {
        en: 'A concave lens has focal length of 15 cm. At what distance should the object from the lens be placed so that it forms an image at 10 cm from the lens? Also, find the magnification produced by the lens.',
        hi: 'किसी अवतल लेंस की फोकस दूरी 15 cm है। बिंब को लेंस से कितनी दूरी पर रखें कि इसके द्वारा बिंब का लेंस से 10 cm दूरी पर प्रतिबिंब बने? लेंस द्वारा उत्पन्न आवर्धन भी ज्ञात कीजिए।',
      },
      given: [
        { en: 'Concave lens ⇒ f = −15 cm', hi: 'अवतल लेंस ⇒ f = −15 cm' },
        { en: 'Concave lens always forms a virtual image on the object side ⇒ v = −10 cm', hi: 'अवतल लेंस सदैव बिंब की ओर आभासी प्रतिबिंब बनाता है ⇒ v = −10 cm' },
      ],
      formula: '1/v − 1/u = 1/f  ⇒  1/u = 1/v − 1/f  |  m = v / u',
      substitution: '1/u = 1/(−10) − 1/(−15) = −1/10 + 1/15 = −1/30  ⇒  u = −30 cm  |  m = (−10)/(−30) = +0.33',
      answer: { en: 'Object distance u = −30 cm (30 cm in front); Magnification m = +1/3 (+0.33, virtual & erect).', hi: 'बिंब दूरी u = −30 cm (लेंस के सामने 30 cm); आवर्धन m = +1/3 (+0.33, आभासी व सीधा)।' },
      unitTrapNote: {
        en: 'Notice the double minus sign in −1/u = −(−30): always write parentheses around negative numbers when substituting!',
        hi: 'सूत्र में मान रखते समय ऋणात्मक संख्याओं के चारों ओर कोष्ठक जैसे 1/(−15) अवश्य लगाएं ताकि चिह्न की गलती न हो!',
      },
    },
    contrastTrap: {
      trapTitle: { en: 'Double-Minus Sign Cancellation Error in 1/v − 1/u = 1/f', hi: 'लेंस सूत्र 1/v − 1/u = 1/f में दोहरे ऋण चिह्न की गलती' },
      commonMistake: {
        en: 'Writing 1/v − 1/30 = 1/f instead of 1/v − 1/(−30) = 1/v + 1/30 = 1/f.',
        hi: 'u = −30 cm रखते समय 1/v − 1/(−30) के स्थान पर 1/v − 1/30 लिख देना।',
      },
      correctPhysics: {
        en: 'Rearrange the formula FIRST before substituting numbers: For a lens, 1/v = 1/f + 1/u; for a mirror, 1/v = 1/f − 1/u.',
        hi: 'संख्याएं रखने से पहले सूत्र को व्यवस्थित करें: लेंस के लिए 1/v = 1/f + 1/u; दर्पण के लिए 1/v = 1/f − 1/u।',
      },
      checkRule: {
        en: 'Always write “Given: u = −... cm, f = ±... cm” on line 1 of your solution before touching the formula.',
        hi: 'हल की पहली पंक्ति में हमेशा चिह्न सहित “दिया है: u = −... cm, f = ±... cm” लिखें।',
      },
    },
    hotsReasoningTask: {
      title: { en: 'HOTS Sign Diagnosis: Identifying the Student’s Mistake', hi: 'उच्च स्तरीय चिह्न निदान: छात्र की गलती पहचानें' },
      prompt: {
        en: 'A student solves for the image formed by a convex mirror of focal length 15 cm when an object is 30 cm in front, and gets v = −30 cm (real image in front). Diagnose the exact sign error the student made and find the true v.',
        hi: 'एक छात्र 15 cm फोकस दूरी के उत्तल दर्पण के सामने 30 cm पर रखे बिंब के लिए v = −30 cm निकालता है। छात्र की चिह्न गलती पहचानें और सही v ज्ञात करें।',
      },
      claimOptions: [
        {
          en: 'The student wrongly used f = −15 cm (or the lens formula) instead of f = +15 cm with the mirror formula 1/v = 1/f − 1/u = 1/15 − 1/(−30) = +3/30 ⇒ v = +10 cm (virtual, behind mirror).',
          hi: 'छात्र ने उत्तल दर्पण के लिए f = +15 cm और दर्पण सूत्र 1/v = 1/f − 1/u = 1/15 − 1/(−30) = +1/10 ⇒ v = +10 cm के बजाय गलत चिह्न रखा।',
        },
        {
          en: 'A convex mirror can form a real image at v = −30 cm.',
          hi: 'उत्तल दर्पण v = −30 cm पर वास्तविक प्रतिबिंब बना सकता है।',
        },
      ],
      correctClaimIndex: 0,
      claimExplanation: {
        en: 'A convex mirror has f = +15 cm and u = −30 cm. By 1/v + 1/u = 1/f ⇒ 1/v = 1/15 − 1/(−30) = 1/15 + 1/30 = 3/30 = 1/10 ⇒ v = +10 cm (virtual and erect behind the mirror).',
        hi: 'उत्तल दर्पण के लिए f = +15 cm और u = −30 cm। दर्पण सूत्र से 1/v = 1/15 − 1/(−30) = +1/10 ⇒ v = +10 cm (दर्पण के पीछे आभासी व सीधा)।',
      },
      rubricPoints: [
        { en: 'Assigns u = −30 cm and f = +15 cm for the convex mirror.', hi: 'उत्तल दर्पण के लिए u = −30 cm और f = +15 cm लिखता है।' },
        { en: 'Applies the mirror formula 1/v + 1/u = 1/f → 1/v = 1/15 − 1/(−30) = +1/10.', hi: 'दर्पण सूत्र 1/v + 1/u = 1/f से 1/v = +1/10 निकालता है।' },
        { en: 'Concludes v = +10 cm (virtual, erect, diminished image behind the mirror).', hi: 'v = +10 cm (दर्पण के पीछे आभासी, सीधा व छोटा प्रतिबिंब) निष्कर्ष निकालता है।' },
      ],
    },
  },

  'real-vs-virtual-switch': {
    ncertSection: 'NCERT Class 10 Science · §9.3.3 Image Formation by Lenses (Table 9.4)',
    openingQuestion: {
      en: '“How can the exact same convex lens project an upside-down image on a wall AND act as an upright magnifying glass?”',
      hi: '“वही एक उत्तल लेंस दीवार पर उल्टा वास्तविक प्रतिबिंब कैसे बनाता है और पास रखने पर सीधा आवर्धक लेंस कैसे बन जाता है?”',
    },
    experimentProtocol: {
      goal: {
        en: 'Use the Focal Crossover Bench (f = +20 cm) on the left to drag the object across F₁ (−20 cm) and toggle 📌 Compare Across Focus F.',
        hi: 'बाईं ओर फोकस संक्रमण बेंच (f = +20 cm) पर वस्तु को F₁ (−20 cm) के पार ड्रैग करें और 📌 फोकस के पार तुलना ऑन करें।',
      },
      steps: [
        {
          en: '1. Click Projector Zone (|u| = 35 cm > f). Observe the refracted rays converge on the right to a Real, Inverted image at v = +46.7 cm.',
          hi: '1. प्रोजेक्टर क्षेत्र (|u| = 35 cm > f) चुनें। देखें कि किरणें दाईं ओर मिलकर v = +46.7 cm पर वास्तविक व उल्टा प्रतिबिंब बनाती हैं।',
        },
        {
          en: '2. Click Focal Crossover (|u| = 20 cm = f) to see parallel outgoing rays (v = ∞), then click Magnifier Zone (|u| = 12 cm < f) to see diverging rays trace back to a Virtual, Erect, Magnified image at v = −30 cm!',
          hi: '2. फोकस सीमा (|u| = 20 cm) पर समानांतर किरणें (v = ∞) देखें, और फिर आवर्धक क्षेत्र (|u| = 12 cm < f) में v = −30 cm पर आभासी, सीधा व बड़ा प्रतिबिंब देखें!',
        },
      ],
      observationCheck: {
        prompt: {
          en: 'Why do the refracted rays fail to meet on the right side of the convex lens when the object is placed inside the principal focus (|u| < f)?',
          hi: 'जब वस्तु को मुख्य फोकस के भीतर (|u| < f) रखा जाता है, तो अपवर्तित किरणें लेंस के दाईं ओर क्यों नहीं मिलतीं?',
        },
        options: [
          { en: 'Because the incoming rays from a very close object diverge too steeply for the lens’s fixed bending power to bring them together, so they still diverge after refraction and only meet when extended backward', hi: 'क्योंकि बहुत पास रखी वस्तु से आने वाली किरणें इतना अधिक फैलती हैं कि लेंस की निश्चित क्षमता उन्हें मोड़कर मिला नहीं पाती, अतः वे पीछे बढ़ाने पर आभासी रूप से मिलती हैं' },
          { en: 'Because the convex lens turns into a concave lens when held close', hi: 'क्योंकि पास रखने पर उत्तल लेंस अवतल लेंस बन जाता है' },
          { en: 'Because light stops refracting inside the focal length', hi: 'क्योंकि फोकस दूरी के भीतर अपवर्तन रुक जाता है' },
        ],
        correctIndex: 0,
        explanation: {
          en: 'A lens has a fixed converging power P = 1/f. Outside F, incoming divergence is gentle enough for the lens to converge the rays; inside F, incoming divergence exceeds the lens’s bending power.',
          hi: 'लेंस की अभिसारी क्षमता निश्चित होती है। F के भीतर आपतित किरणों का फैलाव इतना अधिक होता है कि अपवर्तन के बाद भी किरणें फैलती रहती हैं और पीछे बढ़ाने पर आभासी प्रतिबिंब बनाती हैं।',
        },
      },
    },
    discoveryNotes: {
      physicalMeaning: {
        en: 'The principal focus F (|u| = f) is the critical phase boundary between converging outgoing rays (Real image) and diverging outgoing rays (Virtual image).',
        hi: 'मुख्य फोकस F (|u| = f) अभिसारी निर्गत किरणों (वास्तविक प्रतिबिंब) और अपसारी निर्गत किरणों (आभासी प्रतिबिंब) के बीच की संक्रमण सीमा है।',
      },
      scalingRule: {
        en: '|u| > 2f: Real, inverted, diminished. |u| = 2f: Real, inverted, same size (m = −1). f < |u| < 2f: Real, inverted, magnified. |u| < f: Virtual, erect, magnified (m > +1).',
        hi: '|u| > 2f: वास्तविक, उल्टा, छोटा। |u| = 2f: समान आकार (m = −1)। f < |u| < 2f: बड़ा। |u| < f: आभासी, सीधा और बड़ा (m > +1)।',
      },
      siUnitRule: {
        en: 'A virtual image (v < 0 for a lens) cannot be caught on a physical paper screen—it is seen by looking through the lens.',
        hi: 'आभासी प्रतिबिंब (लेंस के लिए v < 0) को किसी कागज़ के पर्दे पर प्राप्त नहीं किया जा सकता—इसे लेंस में से देखकर देखा जाता है।',
      },
    },
    workedNumerical: {
      title: { en: 'CBSE Board Numerical: Crossing the Focal Boundary', hi: 'सीबीएसई बोर्ड प्रश्न: फोकस सीमा के पार प्रतिबिंब' },
      problem: {
        en: 'A convex lens has focal length f = +20 cm. Calculate the image position v and magnification m when an object is placed at (a) u = −30 cm (outside F) and (b) u = −10 cm (inside F).',
        hi: 'एक उत्तल लेंस की फोकस दूरी f = +20 cm है। प्रतिबिंब की स्थिति v तथा आवर्धन m ज्ञात कीजिए जब बिंब (a) u = −30 cm (F के बाहर) तथा (b) u = −10 cm (F के भीतर) रखा हो।',
      },
      given: [
        { en: 'Focal length f = +20 cm', hi: 'फोकस दूरी f = +20 cm' },
        { en: 'Case (a): u₁ = −30 cm  |  Case (b): u₂ = −10 cm', hi: 'स्थिति (a): u₁ = −30 cm  |  स्थिति (b): u₂ = −10 cm' },
      ],
      formula: '1/v = 1/f + 1/u  |  m = v / u',
      substitution: '(a) 1/v₁ = 1/20 − 1/30 = +1/60 ⇒ v₁ = +60 cm, m₁ = −2.0  |  (b) 1/v₂ = 1/20 − 1/10 = −1/20 ⇒ v₂ = −20 cm, m₂ = +2.0',
      answer: { en: '(a) v = +60 cm, m = −2.0 (Real, inverted, magnified); (b) v = −20 cm, m = +2.0 (Virtual, erect, magnified).', hi: '(a) v = +60 cm, m = −2.0 (वास्तविक, उल्टा, बड़ा); (b) v = −20 cm, m = +2.0 (आभासी, सीधा, बड़ा)।' },
      unitTrapNote: {
        en: 'Both cases give 2× magnification (|m| = 2), but m = −2.0 is inverted on a screen (+60 cm) whereas m = +2.0 is upright on the object side (−20 cm)!',
        hi: 'दोनों स्थितियों में 2× आवर्धन मिलता है, परंतु m = −2.0 उल्टा वास्तविक प्रतिबिंब (+60 cm) है जबकि m = +2.0 सीधा आभासी प्रतिबिंब (−20 cm) है!',
      },
    },
    contrastTrap: {
      trapTitle: { en: 'Thinking a Screen Can Catch the Image When |u| < f', hi: '|u| < f होने पर पर्दे पर प्रतिबिंब ढूँढना' },
      commonMistake: {
        en: 'Moving the paper screen further and further back when the candle is inside F, expecting a sharp image to appear on the screen.',
        hi: 'जब मोमबत्ती F के भीतर हो, तब भी कागज़ के पर्दे को आगे-पीछे खिसकाकर उस पर तीक्ष्ण प्रतिबिंब पाने की कोशिश करना।',
      },
      correctPhysics: {
        en: 'When |u| < f, emerging rays diverge on the right side and never cross in real space—no screen at any distance can catch a virtual image!',
        hi: 'जब |u| < f होता है, तो निर्गत किरणें दाईं ओर फैलती जाती हैं और वास्तव में कभी नहीं मिलतीं—कोई भी पर्दा आभासी प्रतिबिंब को नहीं पकड़ सकता!',
      },
      checkRule: {
        en: 'Compare |u| with f BEFORE solving: |u| > f ⇒ Real (v > 0); |u| < f ⇒ Virtual (v < 0).',
        hi: 'हल करने से पहले |u| और f की तुलना करें: |u| > f ⇒ वास्तविक (v > 0); |u| < f ⇒ आभासी (v < 0)।',
      },
    },
    hotsReasoningTask: {
      title: { en: 'HOTS Lab Investigation: Blank Screen Diagnosis', hi: 'उच्च स्तरीय प्रयोगशाला निदान: पर्दे पर प्रतिबिंब न बनना' },
      prompt: {
        en: 'During an optics lab practical, a student places a lighted candle 12 cm from a convex lens of focal length 15 cm and moves a white screen on the other side, but sees only a faint blur. Explain why no sharp image forms on the screen and how the student can see the image.',
        hi: 'प्रयोगशाला में एक छात्र 15 cm फोकस दूरी के उत्तल लेंस से 12 cm पर जलती मोमबत्ती रखता है और दूसरी ओर पर्दा खिसकाता है, पर कोई स्पष्ट प्रतिबिंब नहीं मिलता। स्पष्ट करें कि पर्दे पर प्रतिबिंब क्यों नहीं बनता और इसे कैसे देखा जा सकता है?',
      },
      claimOptions: [
        {
          en: 'Because |u| = 12 cm < f = 15 cm (object is inside F₁), the refracted rays diverge and form a virtual, erect, magnified image at v = −60 cm on the candle side, which can only be seen by looking through the lens—or by moving the candle beyond 15 cm to get a real screen image.',
          hi: 'चूंकि |u| = 12 cm < f = 15 cm (वस्तु F₁ के भीतर है), अपवर्तित किरणें फैलती हैं और मोमबत्ती की ही ओर v = −60 cm पर आभासी व सीधा प्रतिबिंब बनाती हैं जिसे लेंस से देखकर देखा जा सकता है।',
        },
        {
          en: 'The lens is defective because a convex lens always forms a real image on a screen.',
          hi: 'लेंस खराब है क्योंकि उत्तल लेंस हमेशा पर्दे पर प्रतिबिंब बनाता है।',
        },
      ],
      correctClaimIndex: 0,
      claimExplanation: {
        en: 'At u = −12 cm and f = +15 cm, 1/v = 1/15 − 1/12 = −1/60 ⇒ v = −60 cm (virtual). To catch a real image on the screen, the candle must be placed at |u| > 15 cm.',
        hi: 'u = −12 cm और f = +15 cm पर v = −60 cm (आभासी) मिलता है। पर्दे पर वास्तविक प्रतिबिंब के लिए मोमबत्ती को |u| > 15 cm पर रखना होगा।',
      },
      rubricPoints: [
        { en: 'Compares object distance |u| = 12 cm with focal length f = 15 cm (|u| < f).', hi: 'बिंब दूरी |u| = 12 cm की फोकस दूरी f = 15 cm से तुलना करता है (|u| < f)।' },
        { en: 'Explains that refracted rays diverge and form a virtual image (v = −60 cm) that cannot be projected on a screen.', hi: 'स्पष्ट करता है कि किरणें फैलती हैं और आभासी प्रतिबिंब (v = −60 cm) पर्दे पर नहीं आ सकता।' },
        { en: 'States how to view the virtual image (look through lens) or get a real screen image (move candle to |u| > 15 cm).', hi: 'आभासी प्रतिबिंब देखने (लेंस से देखना) या वास्तविक प्रतिबिंब पाने (|u| > 15 cm रखना) का उपाय बताता है।' },
      ],
    },
  },

  'magnification-code': {
    ncertSection: 'NCERT Class 10 Science · §9.2.4 & §9.3.5 Magnification (m = hᵢ / hₒ)',
    openingQuestion: {
      en: '“How can a single number like m = +0.4 or m = −2.0 reveal the image nature, size, AND the exact type of lens?”',
      hi: '“केवल m = +0.4 या m = −2.0 जैसी एक संख्या प्रतिबिंब की प्रकृति, आकार और लेंस का प्रकार कैसे बता देती है?”',
    },
    experimentProtocol: {
      goal: {
        en: 'Click through the 6 Board-Exam Presets on the left Magnification Dual-Code Bench and toggle Sign (±) vs Magnitude (|m|).',
        hi: 'बाईं ओर आवर्धन डिकोडर बेंच पर 6 बोर्ड-परीक्षा प्रीसेट पर क्लिक करें और चिह्न (±) बनाम परिमाण (|m|) बदलें।',
      },
      steps: [
        {
          en: '1. Compare m = +0.4 (Concave Lens: upright & smaller) vs m = +2.0 (Convex Magnifier: upright & larger).',
          hi: '1. m = +0.4 (अवतल लेंस: सीधा व छोटा) बनाम m = +2.0 (उत्तल आवर्धक: सीधा व बड़ा) की तुलना करें।',
        },
        {
          en: '2. Switch sign from + to − at |m| = 2.0 (m = −2.0). Observe the image arrow flips upside-down below the axis (Real & Inverted) while keeping the exact same 2× length!',
          hi: '2. |m| = 2.0 पर चिह्न + से − (m = −2.0) करें। देखें कि प्रतिबिंब तीर अक्ष के नीचे उल्टा (वास्तविक) हो जाता है जबकि उसकी लंबाई 2× ही रहती है!',
        },
      ],
      observationCheck: {
        prompt: {
          en: 'Why can a convex lens NEVER produce a magnification of m = +0.5?',
          hi: 'कोई उत्तल लेंस कभी भी m = +0.5 आवर्धन क्यों नहीं उत्पन्न कर सकता?',
        },
        options: [
          { en: 'Because + means Virtual & Erect, and a convex lens only forms MAGNIFIED virtual images (m > +1); only a concave lens (or convex mirror) forms diminished virtual images (0 < m < +1)', hi: 'क्योंकि + का अर्थ आभासी व सीधा है, और उत्तल लेंस केवल बड़ा आभासी प्रतिबिंब (m > +1) बनाता है; केवल अवतल लेंस (या उत्तल दर्पण) ही छोटा आभासी प्रतिबिंब (0 < m < +1) बनाता है' },
          { en: 'Because a convex lens cannot form virtual images at all', hi: 'क्योंकि उत्तल लेंस आभासी प्रतिबिंब बना ही नहीं सकता' },
          { en: 'Because magnification is always negative for lenses', hi: 'क्योंकि लेंस के लिए आवर्धन सदैव ऋणात्मक होता है' },
        ],
        correctIndex: 0,
        explanation: {
          en: 'By m = f / (f + u), when a convex lens (f > 0) has an object inside F (−f < u < 0), 0 < f + u < f, so m > +1 always. For a concave lens (f < 0), m = |f| / (|f| + |u|) is always between 0 and +1!',
          hi: 'उत्तल लेंस आभासी प्रतिबिंब केवल |u| < f में बनाता है जो सदैव बड़ा (m > +1) होता है। अवतल लेंस सदैव छोटा आभासी प्रतिबिंब (0 < m < +1) बनाता है!',
        },
      },
    },
    discoveryNotes: {
      physicalMeaning: {
        en: 'Magnification m = hᵢ / hₒ encodes two independent facts: Sign(m) = Orientation/Nature, and |m| = Size Ratio.',
        hi: 'आवर्धन m = hᵢ / hₒ में दो स्वतंत्र तथ्य छिपे हैं: m का चिह्न = सीधा/उल्टा (प्रकृति), तथा परिमाण |m| = आकार का अनुपात।',
      },
      scalingRule: {
        en: 'Lens: m = hᵢ / hₒ = +v / u. Mirror: m = hᵢ / hₒ = −v / u.',
        hi: 'लेंस: m = hᵢ / hₒ = +v / u। दर्पण: m = hᵢ / hₒ = −v / u।',
      },
      siUnitRule: {
        en: 'Magnification m is a pure dimensionless ratio (cm / cm) and has NO unit!',
        hi: 'आवर्धन m दो लंबाइयों का अनुपात (cm / cm) है, इसलिए इसका कोई मात्रक नहीं होता!',
      },
    },
    workedNumerical: {
      title: { en: 'NCERT Example 9.4: Convex Lens Magnification & Object Distance', hi: 'एनसीईआरटी उदाहरण 9.4: उत्तल लेंस में आवर्धन एवं प्रतिबिंब का आकार' },
      problem: {
        en: 'A 2.0 cm tall object is placed perpendicular to the principal axis of a convex lens of focal length 10 cm. The distance of the object from the lens is 15 cm. Find the nature, position, size of the image, and its magnification.',
        hi: 'कोई 2.0 cm लंबा बिंब 10 cm फोकस दूरी के किसी उत्तल लेंस के मुख्य अक्ष के लंबवत रखा है। बिंब की लेंस से दूरी 15 cm है। प्रतिबिंब की प्रकृति, स्थिति, साइज तथा आवर्धन ज्ञात कीजिए।',
      },
      given: [
        { en: 'hₒ = +2.0 cm, f = +10 cm, u = −15 cm', hi: 'hₒ = +2.0 cm, f = +10 cm, u = −15 cm' },
      ],
      formula: '1/v = 1/f + 1/u  |  m = v / u = hᵢ / hₒ',
      substitution: '1/v = 1/10 + 1/(−15) = +1/30 ⇒ v = +30 cm  |  m = +30 / (−15) = −2.0  |  hᵢ = m × hₒ = −4.0 cm',
      answer: { en: 'v = +30 cm; m = −2.0; hᵢ = −4.0 cm (Real, inverted, and 2× enlarged).', hi: 'v = +30 cm; m = −2.0; hᵢ = −4.0 cm (वास्तविक, उल्टा तथा दोगुना बड़ा)।' },
      unitTrapNote: {
        en: 'Note the formula difference: for a LENS, m = +v/u; for a MIRROR, m = −v/u! Both always equal hᵢ/hₒ.',
        hi: 'सूत्र का अंतर ध्यान रखें: लेंस के लिए m = +v/u होता है, जबकि दर्पण के लिए m = −v/u! दोनों में m = hᵢ/hₒ समान रहता है।',
      },
    },
    contrastTrap: {
      trapTitle: { en: 'Thinking a Negative Magnification (e.g. m = −3) Means a Smaller Image', hi: 'ऋणात्मक आवर्धन (जैसे m = −3) को छोटा प्रतिबिंब समझ लेना' },
      commonMistake: {
        en: 'Looking at m = −3 and thinking “−3 is less than 1, so the image must be diminished.”',
        hi: 'm = −3 देखकर यह सोचना कि “−3 एक से छोटा है, इसलिए प्रतिबिंब छोटा होगा।”',
      },
      correctPhysics: {
        en: 'In physics, the minus sign in m = −3 ONLY means the image is upside-down (inverted, below the axis). The size ratio is given by the absolute magnitude |m| = 3 > 1 (3× enlarged)!',
        hi: 'm = −3 में ऋण (−) चिह्न का अर्थ केवल यह है कि प्रतिबिंब उल्टा है। आकार का निर्णय केवल परिमाण |m| = 3 (> 1, अर्थात 3 गुना बड़ा) से होता है!',
      },
      checkRule: {
        en: 'Never compare m with 1 before taking the absolute value |m|: |−3| = 3 > 1 (Magnified!).',
        hi: 'आकार जानने के लिए हमेशा निरपेक्ष मान |m| को 1 से तुलना करें: |−3| = 3 > 1 (बड़ा प्रतिबिंब!)।',
      },
    },
    hotsReasoningTask: {
      title: { en: 'HOTS Fingerprint Table: Identifying 3 Mystery Lenses/Mirrors', hi: 'उच्च स्तरीय पहचान: आवर्धन से 3 अज्ञात लेंस/दर्पण पहचानना' },
      prompt: {
        en: 'Three optical setups produce magnifications: Setup P gives m = −0.5, Setup Q gives m = +2.5, and Setup R gives m = +0.5. Decode the image nature/size and identify which type of spherical lens (convex or concave) produced each.',
        hi: 'तीन गोलीय लेंस व्यवस्थाएं आवर्धन उत्पन्न करती हैं: P में m = −0.5, Q में m = +2.5, तथा R में m = +0.5। प्रत्येक के प्रतिबिंब की प्रकृति/आकार तथा लेंस का प्रकार (उत्तल या अवतल) पहचानें।',
      },
      claimOptions: [
        {
          en: 'P (m = −0.5): Real, inverted, diminished → Convex lens (|u| > 2f); Q (m = +2.5): Virtual, erect, magnified → Convex lens (|u| < f); R (m = +0.5): Virtual, erect, diminished → Concave lens.',
          hi: 'P (m = −0.5): वास्तविक, उल्टा, छोटा → उत्तल लेंस (|u| > 2f); Q (m = +2.5): आभासी, सीधा, बड़ा → उत्तल लेंस (|u| < f); R (m = +0.5): आभासी, सीधा, छोटा → अवतल लेंस।',
        },
        {
          en: 'P is a concave lens because m is negative, while Q and R are convex lenses.',
          hi: 'P अवतल लेंस है क्योंकि m ऋणात्मक है, जबकि Q और R उत्तल लेंस हैं।',
        },
      ],
      correctClaimIndex: 0,
      claimExplanation: {
        en: 'Only a converging (convex) lens can form real images (m < 0) or magnified virtual images (m > +1). Only a diverging (concave) lens can form a diminished virtual image (0 < m < +1).',
        hi: 'केवल उत्तल लेंस ही वास्तविक प्रतिबिंब (m < 0) या बड़ा आभासी प्रतिबिंब (m > +1) बना सकता है। केवल अवतल लेंस ही छोटा आभासी प्रतिबिंब (0 < m < +1) बनाता है।',
      },
      rubricPoints: [
        { en: 'Decodes signs: − in P means Real & Inverted; + in Q and R means Virtual & Erect.', hi: 'चिह्न डिकोड करता है: P में − का अर्थ वास्तविक व उल्टा; Q और R में + का अर्थ आभासी व सीधा।' },
        { en: 'Decodes magnitudes: |−0.5| = 0.5 < 1 (diminished), |+2.5| = 2.5 > 1 (magnified), |+0.5| = 0.5 < 1 (diminished).', hi: 'परिमाण डिकोड करता है: 0.5 < 1 (छोटा) और 2.5 > 1 (बड़ा)।' },
        { en: 'Identifies P and Q as Convex Lenses and R (0 < m < +1) as a Concave Lens.', hi: 'P व Q को उत्तल लेंस तथा R (0 < m < +1) को अवतल लेंस के रूप में पहचानता है।' },
      ],
    },
  },
}
