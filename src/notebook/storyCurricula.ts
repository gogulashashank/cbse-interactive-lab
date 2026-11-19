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

  'velocity-time-graph-area': {
    ncertSection: 'NCERT Class 9 Chapter 7: Motion (Sec 7.4 — Graphical Representation of Motion)',
    openingQuestion: {
      en: '“Why do we divide axes on a velocity–time graph to find acceleration, but calculate the shaded area underneath to find displacement?”',
      hi: '“वेग–समय ग्राफ में त्वरण निकालने के लिए हम ढाल (भागफल) लेते हैं, परंतु विस्थापन निकालने के लिए नीचे का क्षेत्रफल क्यों निकालते हैं?”',
    },
    experimentProtocol: {
      goal: {
        en: 'Separate the rectangle area (ut) and triangle area (½at²) under a v–t graph and verify how slope gives acceleration while area gives total displacement.',
        hi: 'v–t ग्राफ के नीचे आयत (ut) और त्रिभुज (½at²) के क्षेत्रफल को अलग करें और सत्यापित करें कि ढाल त्वरण देती है जबकि क्षेत्रफल कुल विस्थापन देता है।',
      },
      steps: [
        {
          en: 'Set initial velocity u = 5 m/s, final velocity v = 25 m/s, and time t = 4 s. Observe the red slope line rising by Δv = 20 m/s in 4 s (a = 5 m/s²).',
          hi: 'u = 5 m/s, v = 25 m/s और समय t = 4 s रखें। देखें कि रेखा 4 s में Δv = 20 m/s ऊपर उठती है (ढाल a = 5 m/s²)।',
        },
        {
          en: 'Inspect the blue rectangle (5 × 4 = 20 m) and the amber triangle (½ × 20 × 4 = 40 m). Their sum is the total displacement s = 60 m.',
          hi: 'नीले आयत (5 × 4 = 20 m) और पीले त्रिभुज (½ × 20 × 4 = 40 m) को देखें। इनका योग कुल विस्थापन s = 60 m है।',
        },
        {
          en: 'Now set u = 15 m/s and v = 15 m/s (uniform motion). Notice the triangle vanishes (a = 0 m/s²) and only the rectangle area remains!',
          hi: 'अब u = 15 m/s और v = 15 m/s (एकसमान गति) रखें। देखें कि त्रिभुज शून्य हो जाता है (a = 0 m/s²) और केवल आयत का क्षेत्रफल बचता है!',
        },
      ],
      observationCheck: {
        prompt: {
          en: 'On the v–t graph bench, when you set u = 5 m/s, v = 25 m/s, and t = 4 s, how much extra distance does the car cover because of its acceleration (the amber triangle area) compared to moving at steady u = 5 m/s?',
          hi: 'जब आप u = 5 m/s, v = 25 m/s और t = 4 s रखते हैं, तो त्वरण के कारण (त्रिभुज क्षेत्रफल) कार नियत चाल u = 5 m/s की तुलना में कितनी अतिरिक्त दूरी तय करती है?',
        },
        options: [
          {
            en: '40 m (Triangle area ½ × (25 − 5) × 4 = 40 m on top of the 20 m rectangle)',
            hi: '40 m (20 m के आयत के ऊपर त्रिभुज का क्षेत्रफल ½ × 20 × 4 = 40 m)',
          },
          {
            en: '20 m (Only the rectangle area)',
            hi: '20 m (केवल आयत का क्षेत्रफल)',
          },
          {
            en: '100 m (Simple product 25 × 4)',
            hi: '100 m (सीधा गुणनफल 25 × 4)',
          },
        ],
        correctIndex: 0,
        explanation: {
          en: 'At steady u = 5 m/s for 4 s, the car would cover the rectangle area ut = 20 m. Uniform acceleration adds the triangle area ½(v − u)t = ½ × 20 × 4 = 40 m, giving s = 60 m total.',
          hi: 'नियत u = 5 m/s पर 4 s में कार आयत क्षेत्रफल ut = 20 m तय करती। एकसमान त्वरण त्रिभुज क्षेत्रफल ½(v − u)t = 40 m जोड़ता है, जिससे कुल विस्थापन 60 m होता है।',
        },
      },
    },
    discoveryNotes: {
      physicalMeaning: {
        en: 'A v–t graph encodes both Rate and Total simultaneously: the slope (vertical rise ÷ horizontal run) is the rate of change of velocity (acceleration a), while the 2D area under the curve (height × base) accumulates total displacement (s).',
        hi: 'v–t ग्राफ एक साथ दर और कुल मात्रा दोनों दर्शाता है: ढाल (लंब ÷ आधार) वेग परिवर्तन की दर (त्वरण a) है, जबकि रेखा के नीचे का क्षेत्रफल कुल संचित विस्थापन (s) है।',
      },
      scalingRule: {
        en: 'Splitting the trapezium under a uniform-acceleration v–t graph into a rectangle (ut) + triangle (½(v−u)t = ½at²) visually proves the second equation of motion: s = ut + ½at².',
        hi: 'समलंब चतुर्भुज क्षेत्रफल को आयत (ut) और त्रिभुज (½(v−u)t = ½at²) में बाँटने से गति का द्वितीय समीकरण s = ut + ½at² स्वतः सिद्ध हो जाता है।',
      },
      siUnitRule: {
        en: 'Slope units: (m/s) ÷ s = m/s² (Acceleration). Area units: (m/s) × s = m (Metres of displacement).',
        hi: 'ढाल का मात्रक: (m/s) ÷ s = m/s² (त्वरण)। क्षेत्रफल का मात्रक: (m/s) × s = m (विस्थापन, मीटर)।',
      },
    },
    workedNumerical: {
      title: {
        en: 'NCERT Class 9 Motion · Braking Train Trapezium Area',
        hi: 'NCERT कक्षा 9 गति · रेलगाड़ी के वेग–समय ग्राफ से दूरी व त्वरण',
      },
      problem: {
        en: 'A car moving at 5 m/s accelerates uniformly to 25 m/s in 4 seconds. Using the velocity–time graph method, find (a) its acceleration and (b) the total distance covered in 4 seconds.',
        hi: '5 m/s से चलती हुई एक कार 4 सेकंड में एकसमान रूप से त्वरित होकर 25 m/s का वेग प्राप्त करती है। वेग–समय ग्राफ विधि से (a) त्वरण तथा (b) 4 सेकंड में तय कुल दूरी ज्ञात कीजिए।',
      },
      given: [
        { en: 'Initial velocity u = 5 m/s', hi: 'प्रारंभिक वेग u = 5 m/s' },
        { en: 'Final velocity v = 25 m/s, Time t = 4 s', hi: 'अंतिम वेग v = 25 m/s, समय t = 4 s' },
      ],
      formula: 'a = (v − u) / t  |  s = Area of trapezium = u·t + ½(v − u)·t',
      substitution: 'a = (25 − 5) / 4 = 5 m/s²  |  s = (5 × 4) + ½(20 × 4) = 20 + 40 = 60 m',
      answer: {
        en: 'Acceleration a = 5 m/s²; Total Distance s = 60 m.',
        hi: 'त्वरण a = 5 m/s²; कुल तय दूरी s = 60 m।',
      },
      unitTrapNote: {
        en: 'If speed is given in km/h (e.g. 36 km/h or 72 km/h) and time in seconds, ALWAYS multiply km/h by 5/18 to convert into m/s before finding slope or area!',
        hi: 'यदि चाल km/h में दी हो और समय सेकंड में, तो ढाल या क्षेत्रफल निकालने से पहले हमेशा 5/18 से गुणा करके m/s में बदलें!',
      },
    },
    contrastTrap: {
      trapTitle: {
        en: 'Multiplying Final Velocity by Time (s = v × t) When Acceleration is Present',
        hi: 'त्वरित गति में सीधे अंतिम वेग को समय से गुणा कर देना (s = v × t)',
      },
      commonMistake: {
        en: 'Writing Distance = Speed × Time = 25 m/s × 4 s = 100 m even though the car started at 5 m/s and only reached 25 m/s at the very end.',
        hi: 'दूरी = चाल × समय = 25 × 4 = 100 m लिख देना, जबकि कार 5 m/s से शुरू हुई थी और केवल अंतिम क्षण में 25 m/s पर पहुँची।',
      },
      correctPhysics: {
        en: 'When velocity changes uniformly from u to v, the region under the v–t graph is a triangle/trapezium, NOT a full v × t rectangle! You must use average velocity ((u + v)/2) × t or ut + ½at².',
        hi: 'जब वेग u से v तक बदलता है, तो ग्राफ के नीचे का क्षेत्र समलंब होता है, पूरा v × t आयत नहीं! इसलिए औसत वेग ((u + v)/2) × t या ut + ½at² का उपयोग करना अनिवार्य है।',
      },
      checkRule: {
        en: 'Always check whether velocity is constant (rectangle area) or changing (rectangle + triangle area).',
        hi: 'हमेशा जाँचें कि वेग स्थिर है (आयत क्षेत्रफल) या बदल रहा है (आयत + त्रिभुज क्षेत्रफल)।',
      },
    },
    hotsReasoningTask: {
      title: {
        en: 'HOTS Graph Comparison: Two Cars Achieving the Same Final Velocity',
        hi: 'उच्च स्तरीय ग्राफ विश्लेषण: समान अंतिम वेग प्राप्त करने वाली दो कारें',
      },
      prompt: {
        en: 'In 4 seconds, Car A accelerates uniformly from rest (u = 0 m/s) to v = 20 m/s, while Car B accelerates uniformly from u = 10 m/s to the same v = 20 m/s. Which car has the greater acceleration (slope), and which car covers the greater distance (area)? Explain using the v–t graph.',
        hi: '4 सेकंड में, कार A विराम (u = 0 m/s) से v = 20 m/s तक त्वरित होती है, जबकि कार B u = 10 m/s से v = 20 m/s तक त्वरित होती है। किस कार का त्वरण (ढाल) अधिक है, और कौन-सी कार अधिक दूरी (क्षेत्रफल) तय करती है? v–t ग्राफ के आधार पर स्पष्ट कीजिए।',
      },
      claimOptions: [
        {
          en: 'Car A has greater acceleration (5 m/s² vs 2.5 m/s²), but Car B covers a greater distance (60 m vs 40 m).',
          hi: 'कार A का त्वरण अधिक है (5 m/s² बनाम 2.5 m/s²), परंतु कार B अधिक दूरी तय करती है (60 m बनाम 40 m)।',
        },
        {
          en: 'Car A has both greater acceleration and greater distance because its slope is steeper.',
          hi: 'कार A का त्वरण और तय दूरी दोनों अधिक हैं क्योंकि उसकी ढाल अधिक तीखी है।',
        },
        {
          en: 'Both cars cover the same distance because both finish at 20 m/s after 4 s.',
          hi: 'दोनों कारें समान दूरी तय करती हैं क्योंकि दोनों 4 s बाद 20 m/s पर पहुँचती हैं।',
        },
      ],
      correctClaimIndex: 0,
      claimExplanation: {
        en: 'Car A has a steeper slope: a_A = (20 − 0)/4 = 5 m/s² vs a_B = (20 − 10)/4 = 2.5 m/s². However, Car B’s v–t line sits higher throughout the 4 s, giving a trapezium area s_B = ½(10 + 20) × 4 = 60 m vs Car A’s triangle area s_A = ½ × 20 × 4 = 40 m!',
        hi: 'कार A की ढाल अधिक है: a_A = 20/4 = 5 m/s² जबकि a_B = 10/4 = 2.5 m/s²। किंतु कार B का ग्राफ पूरे 4 s में ऊपर रहता है, जिससे उसका क्षेत्रफल s_B = 60 m होता है जबकि कार A का त्रिभुज क्षेत्रफल s_A = 40 m होता है!',
      },
      rubricPoints: [
        {
          en: 'Compares slopes for acceleration: a_A = (20 − 0)/4 = 5 m/s² is greater than a_B = (20 − 10)/4 = 2.5 m/s².',
          hi: 'त्वरण के लिए ढाल की तुलना करता है: a_A = 5 m/s² > a_B = 2.5 m/s²।',
        },
        {
          en: 'Calculates area under v–t graph for Car A: triangle area s_A = ½ × 4 × 20 = 40 m.',
          hi: 'कार A के लिए त्रिभुज क्षेत्रफल की गणना करता है: s_A = ½ × 4 × 20 = 40 m।',
        },
        {
          en: 'Calculates area under v–t graph for Car B: trapezium area s_B = (10 × 4) + ½(10 × 4) = 60 m > 40 m.',
          hi: 'कार B के लिए समलंब क्षेत्रफल की गणना करता है: s_B = 40 + 20 = 60 m > 40 m।',
        },
      ],
    },
  },

  'momentum-impulse-cushion': {
    ncertSection: 'NCERT Class 9 Chapter 8: Force and Laws of Motion (Sec 8.4 — Second Law of Motion)',
    openingQuestion: {
      en: '“Whether you catch a fast cricket ball with stiff hands or pull your hands back smoothly, the ball still stops completely—so why do stiff hands sting painfully?”',
      hi: '“चाहे आप तेज़ गेंद को कड़े हाथों से पकड़ें या हाथ पीछे खींचकर, गेंद दोनों स्थितियों में रुकती ही है—फिर कड़े हाथों में तेज़ चोट क्यों लगती है?”',
    },
    experimentProtocol: {
      goal: {
        en: 'Hold the incoming ball mass m and speed u constant (fixed momentum change Δp) while varying stopping time Δt to observe how peak impact force scales inversely.',
        hi: 'गेंद का द्रव्यमान m और चाल u स्थिर रखकर (निश्चित संवेग परिवर्तन Δp) रोकने का समय Δt बदलें और देखें कि चोट का बल कैसे घटता है।',
      },
      steps: [
        {
          en: 'Keep Ball Mass m = 0.15 kg and Incoming Speed u = 20 m/s. Note in the header that required momentum change Δp = m × u = 3 kg·m/s is HELD FIXED.',
          hi: 'm = 0.15 kg और u = 20 m/s रखें। देखें कि आवश्यक संवेग परिवर्तन Δp = m × u = 3 kg·m/s स्थिर है।',
        },
        {
          en: 'Slide Stopping Time Δt down to 0.05 s (stiff hands). Observe that peak impact force spikes to 60 N.',
          hi: 'रोकने का समय Δt घटाकर 0.05 s (कड़े हाथ) करें। देखें कि हाथों पर लगने वाला बल 60 N तक पहुँच जाता है।',
        },
        {
          en: 'Now slide Stopping Time Δt up to 0.25 s (5× longer pull-back). Observe that the impact force drops 5-fold to just 12 N!',
          hi: 'अब Δt बढ़ाकर 0.25 s (5 गुना अधिक समय) करें। देखें कि चोट का बल 5 गुना घटकर केवल 12 N रह जाता है!',
        },
      ],
      observationCheck: {
        prompt: {
          en: 'When you increase Stopping Time Δt from 0.05 s to 0.25 s for the same 0.15 kg ball arriving at 20 m/s, what happens to the total momentum change Δp and the stopping force F?',
          hi: '20 m/s से आती 0.15 kg की उसी गेंद के लिए जब आप रोकने का समय Δt = 0.05 s से बढ़ाकर 0.25 s करते हैं, तो कुल संवेग परिवर्तन Δp और बल F पर क्या प्रभाव पड़ता है?',
        },
        options: [
          {
            en: 'Δp remains 3 kg·m/s, while stopping force F drops from 60 N to 12 N.',
            hi: 'Δp = 3 kg·m/s अपरिवर्तित रहता है, जबकि बल F 60 N से घटकर 12 N हो जाता है।',
          },
          {
            en: 'Δp drops from 3 kg·m/s to 0.6 kg·m/s, and force stays 60 N.',
            hi: 'Δp घटकर 0.6 kg·m/s हो जाता है और बल 60 N रहता है।',
          },
          {
            en: 'Both Δp and F increase 5 times.',
            hi: 'Δp और F दोनों 5 गुना बढ़ जाते हैं।',
          },
        ],
        correctIndex: 0,
        explanation: {
          en: 'Because initial momentum (mu = 3 kg·m/s) and final momentum (0) are unchanged, Δp = 3 kg·m/s is invariant. Multiplying Δt by 5 divides F = Δp/Δt by 5 (60 N → 12 N).',
          hi: 'प्रारंभिक संवेग (3 kg·m/s) और अंतिम संवेग (0) समान रहने से Δp = 3 kg·m/s स्थिर रहता है। समय Δt को 5 गुना करने पर बल F = Δp/Δt पाँचवाँ हिस्सा (12 N) रह जाता है।',
        },
      },
    },
    discoveryNotes: {
      physicalMeaning: {
        en: 'Newton’s Second Law states that net force equals the RATE of change of momentum: F = Δp / Δt. Pain and damage in a collision are caused by peak force F, not by momentum change Δp alone!',
        hi: 'न्यूटन के गति के द्वितीय नियम के अनुसार बल संवेग में परिवर्तन की दर के बराबर होता है: F = Δp / Δt। टक्कर में चोट संवेग परिवर्तन Δp के बजाय चरम बल F से लगती है!',
      },
      scalingRule: {
        en: 'For a fixed momentum change Δp = m(u − v), Impact Force is inversely proportional to stopping duration: F ∝ 1 / Δt.',
        hi: 'निश्चित संवेग परिवर्तन Δp = m(u − v) के लिए, औसत बल रोकने के समयांतराल के व्युत्क्रमानुपाती होता है: F ∝ 1 / Δt।',
      },
      siUnitRule: {
        en: '1 Newton (N) = 1 kg·m/s² = 1 (kg·m/s) per second. Always convert mass from grams (g) to kilograms (kg) before computing momentum!',
        hi: '1 न्यूटन (N) = 1 kg·m/s² = 1 (kg·m/s) प्रति सेकंड। संवेग निकालने से पहले हमेशा द्रव्यमान को ग्राम (g) से किलोग्राम (kg) में बदलें!',
      },
    },
    workedNumerical: {
      title: {
        en: 'NCERT Class 9 Ch 8 · Automobile Braking Force',
        hi: 'NCERT कक्षा 9 अध्याय 8 · वाहन पर लगने वाला ब्रेक बल',
      },
      problem: {
        en: 'A motorcar of mass 1200 kg is moving along a straight line with a uniform velocity of 20 m/s. Its velocity is slowed down to 5 m/s in 3 seconds by an unbalanced external braking force. Calculate the change in momentum and the magnitude of the braking force.',
        hi: '1200 kg द्रव्यमान की एक कार 20 m/s के एकसमान वेग से चल रही है। ब्रेक लगाने पर 3 सेकंड में इसका वेग घटकर 5 m/s रह जाता है। संवेग में परिवर्तन तथा ब्रेक बल का परिमाण ज्ञात कीजिए।',
      },
      given: [
        { en: 'Mass m = 1200 kg, u = 20 m/s, v = 5 m/s', hi: 'द्रव्यमान m = 1200 kg, u = 20 m/s, v = 5 m/s' },
        { en: 'Braking time interval Δt = 3 s', hi: 'समयांतराल Δt = 3 s' },
      ],
      formula: 'Δp = m(v − u)  |  |F| = |Δp| / Δt',
      substitution: '|Δp| = 1200 × (20 − 5) = 18,000 kg·m/s  |  |F| = 18,000 / 3 = 6,000 N',
      answer: {
        en: 'Momentum change |Δp| = 18,000 kg·m/s; Braking force |F| = 6,000 N.',
        hi: 'संवेग परिवर्तन |Δp| = 18,000 kg·m/s; ब्रेक बल |F| = 6,000 N।',
      },
      unitTrapNote: {
        en: 'Watch out for cricket/bullet problems where mass is in grams (e.g. 150 g or 20 g): divide by 1000 to get kg before using F = Δp/Δt!',
        hi: 'क्रिकेट गेंद या बंदूक की गोली वाले प्रश्नों में द्रव्यमान ग्राम (g) में दिया होता है: सूत्र लगाने से पहले 1000 से भाग देकर kg में बदलें!',
      },
    },
    contrastTrap: {
      trapTitle: {
        en: 'Claiming That Pulling Hands Back or Using Airbags “Reduces the Change in Momentum”',
        hi: 'यह लिखना कि हाथ पीछे खींचने या एयरबैग से “संवेग परिवर्तन (Δp) कम हो जाता है”',
      },
      commonMistake: {
        en: 'Writing in board exams: “A fielder pulls their hands back to reduce the change in momentum of the ball.”',
        hi: 'परीक्षा में यह लिखना: “खिलाड़ी गेंद के संवेग परिवर्तन को कम करने के लिए हाथ पीछे खींचता है।”',
      },
      correctPhysics: {
        en: 'The ball still goes from speed u to rest (v = 0), so the total change in momentum Δp = mu is 100% IDENTICAL! Pulling hands back increases the stopping time Δt, which reduces the RATE of change of momentum (Δp/Δt) and therefore reduces the force F.',
        hi: 'गेंद को अभी भी वेग u से विराम (v = 0) में लाना होता है, इसलिए कुल संवेग परिवर्तन Δp = mu बिल्कुल समान रहता है! हाथ पीछे खींचने से समय Δt बढ़ता है, जिससे संवेग परिवर्तन की दर (Δp/Δt) अर्थात बल F कम होता है।',
      },
      checkRule: {
        en: 'Always write “reduces the RATE of change of momentum (Δp/Δt)”, never “reduces the change in momentum (Δp)”.',
        hi: 'हमेशा “संवेग परिवर्तन की दर (Δp/Δt) कम होती है” लिखें, न कि “संवेग परिवर्तन (Δp) कम होता है”।',
      },
    },
    hotsReasoningTask: {
      title: {
        en: 'HOTS Real-World Engineering: High-Jump Cushioned Mats vs Concrete Floor',
        hi: 'उच्च स्तरीय अनुप्रयोग: ऊँची कूद में गद्देदार मैट बनाम पक्का फर्श',
      },
      prompt: {
        en: 'In an athletic high-jump event, athletes of mass 60 kg land at 8 m/s on a thick foam cushion rather than a hard track. Compare the athlete’s momentum change Δp and landing force F on the foam cushion (stopping time 0.40 s) versus the hard floor (stopping time 0.04 s).',
        hi: 'ऊँची कूद प्रतियोगिता में 60 kg का खिलाड़ी 8 m/s के वेग से कड़े फर्श (रुकने का समय 0.04 s) के बजाय मोटे गद्दे (रुकने का समय 0.40 s) पर गिरता है। दोनों स्थितियों में संवेग परिवर्तन Δp तथा लगने वाले बल F की तुलना कीजिए।',
      },
      claimOptions: [
        {
          en: 'Both surfaces produce the exact same momentum change Δp = 480 kg·m/s, but the foam cushion increases Δt 10-fold (0.40 s vs 0.04 s), cutting peak impact force 10-fold from 12,000 N to 1,200 N.',
          hi: 'दोनों सतहों पर संवेग परिवर्तन Δp = 480 kg·m/s समान है, परंतु गद्दा समय Δt को 10 गुना बढ़ाकर आघात बल को 12,000 N से घटाकर 1,200 N (1/10) कर देता है।',
        },
        {
          en: 'The foam cushion reduces the athlete’s momentum change Δp by 10 times.',
          hi: 'गद्दा खिलाड़ी के संवेग परिवर्तन Δp को 10 गुना कम कर देता है।',
        },
        {
          en: 'The impact force is identical on both surfaces because landing speed is 8 m/s in both cases.',
          hi: 'दोनों सतहों पर बल समान रहता है क्योंकि टकराने का वेग 8 m/s समान है।',
        },
      ],
      correctClaimIndex: 0,
      claimExplanation: {
        en: 'In both landings, the athlete decelerates from 8 m/s to 0 m/s, so Δp = 60 × 8 = 480 kg·m/s is held fixed. Extending stopping time from 0.04 s to 0.40 s slashes F = Δp/Δt from 12,000 N to 1,200 N.',
        hi: 'दोनों स्थितियों में खिलाड़ी 8 m/s से विराम में आता है, अतः Δp = 60 × 8 = 480 kg·m/s स्थिर है। समय 0.04 s से 0.40 s होने पर बल F = Δp/Δt 12,000 N से घटकर 1,200 N रह जाता है।',
      },
      rubricPoints: [
        {
          en: 'States that momentum change Δp = m × u = 60 × 8 = 480 kg·m/s is identical on both surfaces.',
          hi: 'स्पष्ट करता है कि दोनों सतहों पर संवेग परिवर्तन Δp = 60 × 8 = 480 kg·m/s समान रहता है।',
        },
        {
          en: 'Applies Newton’s Second Law F = Δp / Δt to show force is inversely proportional to stopping time Δt.',
          hi: 'न्यूटन के द्वितीय नियम F = Δp / Δt से दर्शाता है कि बल समय Δt के व्युत्क्रमानुपाती है।',
        },
        {
          en: 'Computes the 10× force reduction: F_floor = 480/0.04 = 12,000 N vs F_cushion = 480/0.40 = 1,200 N.',
          hi: 'बल में 10 गुना कमी की गणना करता है: फर्श पर 12,000 N बनाम गद्दे पर 1,200 N।',
        },
      ],
    },
  },

  'archimedes-buoyancy-float': {
    ncertSection: 'NCERT Class 9 Chapter 9: Gravitation (Sec 9.5–9.6 — Thrust, Pressure & Archimedes’ Principle)',
    openingQuestion: {
      en: '“Why does a tiny solid iron nail sink immediately in water, while a massive steel cargo ship weighing thousands of tonnes floats high on the sea?”',
      hi: '“लोहे की एक छोटी-सी कील पानी में तुरंत डूब जाती है, जबकि हज़ारों टन वजनी लोहे का विशाल जहाज समुद्र पर आसानी से क्यों तैरता है?”',
    },
    experimentProtocol: {
      goal: {
        en: 'Use the Eureka overflow beaker and spring balance to verify that upward buoyant force equals the weight of displaced fluid (F_B = W_disp) and test the density threshold for floating vs sinking.',
        hi: 'यूरेका पात्र और कमानीदार तुला से सत्यापित करें कि उत्प्लावन बल विस्थापित तरल के भार के बराबर होता है (F_B = W_disp) और तैरने-डूबने की घनत्व शर्त जाँचें।',
      },
      steps: [
        {
          en: 'Set Object Density ρ_obj = 2.5 g/cm³, Volume V = 400 cm³, and Fluid Density ρ_fluid = 1.0 g/cm³. Observe that true weight in air is 10 N, displaced water is 400 cm³ (4 N), and the spring balance reads 10 − 4 = 6 N.',
          hi: 'ρ_obj = 2.5 g/cm³, V = 400 cm³ और ρ_fluid = 1.0 g/cm³ रखें। देखें कि वायु में भार 10 N है, विस्थापित जल 400 cm³ (4 N) है, और तुला का पाठ्यांक 10 − 4 = 6 N है।',
        },
        {
          en: 'Increase Fluid Density ρ_fluid to 1.4 g/cm³ (dense brine). Notice the displaced fluid still has volume 400 cm³, but weighs 5.6 N, dropping apparent weight to 4.4 N!',
          hi: 'द्रव का घनत्व बढ़ाकर 1.4 g/cm³ करें। देखें कि विस्थापित आयतन अभी भी 400 cm³ है, पर उत्प्लावन बल 5.6 N हो जाता है और आभासी भार घटकर 4.4 N रह जाता है!',
        },
        {
          en: 'Now lower Object Density ρ_obj to 0.6 g/cm³ in water (1.0 g/cm³). Watch the block rise and float with 60% of its volume submerged and Apparent Weight = 0 N.',
          hi: 'अब पानी (1.0 g/cm³) में वस्तु का घनत्व घटाकर 0.6 g/cm³ करें। देखें कि गुटका 60% डूबकर तैरता है और आभासी भार 0 N हो जाता है।',
        },
      ],
      observationCheck: {
        prompt: {
          en: 'When the 400 cm³ block of density 2.5 g/cm³ (Weight in air = 10 N) is fully submerged in water (1.0 g/cm³), how does the upward buoyant force F_B compare to the water collected in the overflow cylinder?',
          hi: 'जब 2.5 g/cm³ घनत्व और 400 cm³ आयतन वाला गुटका (वायु में भार = 10 N) पानी (1.0 g/cm³) में पूर्णतः डूबता है, तो उत्प्लावन बल F_B और विस्थापित पानी के भार में क्या संबंध होता है?',
        },
        options: [
          {
            en: 'F_B = 4 N, which is exactly equal to the weight of the 400 cm³ (0.4 kg) of displaced water.',
            hi: 'F_B = 4 N, जो विस्थापित 400 cm³ (0.4 kg) पानी के भार के बिल्कुल बराबर है।',
          },
          {
            en: 'F_B = 10 N, equal to the weight of the metal block in air.',
            hi: 'F_B = 10 N, धातु के गुटके के वायु में भार के बराबर।',
          },
          {
            en: 'F_B = 6 N, equal to the reading on the spring balance.',
            hi: 'F_B = 6 N, कमानीदार तुला के पाठ्यांक के बराबर।',
          },
        ],
        correctIndex: 0,
        explanation: {
          en: '400 cm³ of water has a mass of 400 g = 0.4 kg and weight W_disp = 0.4 kg × 10 m/s² = 4 N. By Archimedes’ Principle, F_B = W_disp = 4 N, reducing the spring scale reading from 10 N to 6 N.',
          hi: '400 cm³ पानी का द्रव्यमान 400 g = 0.4 kg तथा भार 0.4 × 10 = 4 N होता है। आर्किमिडीज सिद्धांत से उत्प्लावन बल F_B = 4 N है, जिससे तुला का पाठ्यांक 10 N से घटकर 6 N रह जाता है।',
        },
      },
    },
    discoveryNotes: {
      physicalMeaning: {
        en: 'Buoyancy is not magic: fluid pressure increases with depth, pushing upward on the bottom of a submerged object harder than downward on its top. That net upward force equals the weight of the displaced fluid: F_B = ρ_fluid · V_disp · g.',
        hi: 'गहराई के साथ द्रव का दाब बढ़ता है, जिससे वस्तु की निचली सतह पर ऊपर की ओर लगने वाला बल ऊपरी सतह के बल से अधिक होता है। यह परिणामी उत्प्लावन बल हटाए गए द्रव के भार के बराबर होता है: F_B = ρ_fluid · V_disp · g।',
      },
      scalingRule: {
        en: 'Float–Sink Rule: An object floats if its average density is less than or equal to the fluid density (ρ_obj ≤ ρ_fluid), submerging just enough fraction (ρ_obj / ρ_fluid) so F_B balances W_air. If ρ_obj > ρ_fluid, even 100% submersion cannot balance W_air, so it sinks.',
        hi: 'तैरने-डूबने का नियम: यदि वस्तु का औसत घनत्व तरल के घनत्व से कम या बराबर हो (ρ_obj ≤ ρ_fluid) तो वस्तु तैरती है। यदि ρ_obj > ρ_fluid हो, तो वस्तु डूब जाती है।',
      },
      siUnitRule: {
        en: 'Water density is 1 g/cm³ = 1000 kg/m³. Relative Density (RD = ρ_obj / ρ_water) is a pure ratio and has NO units!',
        hi: 'पानी का घनत्व 1 g/cm³ = 1000 kg/m³ होता है। आपेक्षिक घनत्व (समान राशियों का अनुपात) का कोई मात्रक नहीं होता!',
      },
    },
    workedNumerical: {
      title: {
        en: 'NCERT Class 9 Gravitation · Apparent Weight & Displaced Water',
        hi: 'NCERT कक्षा 9 · पानी में आभासी भार एवं उत्प्लावन बल',
      },
      problem: {
        en: 'A solid cube of volume 500 cm³ and mass 1.5 kg is suspended from a spring balance and completely immersed in water (density = 1 g/cm³, take g = 10 m/s²). Calculate (a) its weight in air, (b) the buoyant force acting on it, and (c) its apparent weight in water.',
        hi: '500 cm³ आयतन तथा 1.5 kg द्रव्यमान का एक ठोस घन कमानीदार तुला से लटकाकर पानी (घनत्व = 1 g/cm³, g = 10 m/s²) में पूर्णतः डुबोया जाता है। (a) वायु में भार, (b) उत्प्लावन बल तथा (c) पानी में आभासी भार ज्ञात कीजिए।',
      },
      given: [
        { en: 'Volume V = 500 cm³, Mass m = 1.5 kg', hi: 'आयतन V = 500 cm³, द्रव्यमान m = 1.5 kg' },
        { en: 'Water density ρ_water = 1 g/cm³, g = 10 m/s²', hi: 'पानी का घनत्व ρ_water = 1 g/cm³, g = 10 m/s²' },
      ],
      formula: 'W_air = m·g  |  F_B = m_water_disp · g  |  W_app = W_air − F_B',
      substitution: 'W_air = 1.5 × 10 = 15 N  |  m_water = 500 g = 0.5 kg ⇒ F_B = 0.5 × 10 = 5 N  |  W_app = 15 − 5 = 10 N',
      answer: {
        en: 'W_air = 15 N; Buoyant Force F_B = 5 N; Apparent Weight W_app = 10 N.',
        hi: 'वायु में भार = 15 N; उत्प्लावन बल F_B = 5 N; आभासी भार = 10 N।',
      },
      unitTrapNote: {
        en: 'Remember that Buoyant Force F_B depends on the density of the FLUID and the displaced VOLUME—not the mass or density of the submerged metal!',
        hi: 'ध्यान रखें कि पूर्णतः डूबी वस्तु पर उत्प्लावन बल F_B केवल विस्थापित आयतन और तरल के घनत्व पर निर्भर करता है, धातु के द्रव्यमान पर नहीं!',
      },
    },
    contrastTrap: {
      trapTitle: {
        en: 'Thinking a Denser Metal Block Experiences a Larger Buoyant Force When Both Blocks Have the Same Volume',
        hi: 'समान आयतन के दो पूर्णतः डूबे गुटकों में भारी धातु पर अधिक उत्प्लावन बल मान लेना',
      },
      commonMistake: {
        en: 'Saying that a 100 cm³ lead block submerged in water experiences a greater upward buoyant force than a 100 cm³ aluminium block submerged in water.',
        hi: 'यह सोचना कि पानी में डूबे 100 cm³ सीसे (Lead) के गुटके पर 100 cm³ एल्युमिनियम के गुटके से अधिक उत्प्लावन बल लगता है।',
      },
      correctPhysics: {
        en: 'Both submerged blocks displace the exact same 100 cm³ of water! Since F_B equals the weight of displaced water (100 g → 1 N), BOTH blocks experience the exact same upward buoyant force F_B = 1 N.',
        hi: 'दोनों गुटके समान 100 cm³ पानी विस्थापित करते हैं! चूँकि उत्प्लावन बल विस्थापित पानी के भार (1 N) के बराबर होता है, इसलिए दोनों गुटकों पर बिल्कुल समान उत्प्लावन बल F_B = 1 N लगता है।',
      },
      checkRule: {
        en: 'To find F_B, always ask: “How much FLUID was pushed aside?” (F_B = ρ_fluid · V_disp · g).',
        hi: 'उत्प्लावन बल निकालने के लिए हमेशा पूछें: “कितना तरल विस्थापित हुआ?” (F_B = ρ_fluid · V_disp · g)।',
      },
    },
    hotsReasoningTask: {
      title: {
        en: 'HOTS Naval Architecture: Why a Hollow Steel Ship Floats While an Iron Nail Sinks',
        hi: 'उच्च स्तरीय विश्लेषण: लोहे की कील डूबती है पर लोहे का जहाज क्यों तैरता है?',
      },
      prompt: {
        en: 'Solid iron has a density of 7.8 g/cm³, which is much greater than water (1.0 g/cm³). Explain scientifically why a solid iron nail sinks in water, whereas a ship made of the same steel floats easily and can carry heavy cargo.',
        hi: 'ठोस लोहे का घनत्व 7.8 g/cm³ है जो पानी (1.0 g/cm³) से बहुत अधिक है। वैज्ञानिक कारण स्पष्ट कीजिए कि लोहे की ठोस कील पानी में क्यों डूब जाती है, जबकि उसी इस्पात से बना जहाज आसानी से तैरता है।',
      },
      claimOptions: [
        {
          en: 'The hollow hull of the ship encloses a large volume of air, making the ship’s average density (Total Mass ÷ Total Hull Volume) less than 1.0 g/cm³, so it displaces a weight of water equal to the entire ship’s weight before submerging completely.',
          hi: 'जहाज का खोखला ढाँचा बहुत अधिक आयतन घेरता है जिससे जहाज का औसत घनत्व पानी (1.0 g/cm³) से कम हो जाता है और वह पूर्णतः डूबे बिना ही अपने भार के बराबर पानी विस्थापित कर लेता है।',
        },
        {
          en: 'Ocean water has a density greater than 7.8 g/cm³.',
          hi: 'समुद्र के पानी का घनत्व 7.8 g/cm³ से अधिक होता है।',
        },
        {
          en: 'Archimedes’ principle applies only to small objects like nails and not to large ships.',
          hi: 'आर्किमिडीज का सिद्धांत केवल छोटी वस्तुओं पर लागू होता है, बड़े जहाजों पर नहीं।',
        },
      ],
      correctClaimIndex: 0,
      claimExplanation: {
        en: 'A solid nail displaces a tiny volume of water whose weight is much less than the nail’s weight (ρ_nail = 7.8 > 1.0 g/cm³). Shaping steel into a wide hollow hull dramatically increases displaced water volume V_disp, lowering average density below 1.0 g/cm³ so F_B = W_ship.',
        hi: 'ठोस कील बहुत कम पानी हटाती है जिसका भार कील के भार से कम होता है। इस्पात को खोखले जहाज का आकार देने से विस्थापित जल का आयतन V_disp बहुत बढ़ जाता है और औसत घनत्व 1.0 g/cm³ से कम हो जाता है, जिससे F_B = W_जहाज संतुलित हो जाता है।',
      },
      rubricPoints: [
        {
          en: 'Explains why the solid iron nail sinks: its density (7.8 g/cm³) exceeds water (1.0 g/cm³), so buoyant force F_B < weight W_nail.',
          hi: 'बताता है कि ठोस कील का घनत्व (7.8 g/cm³) पानी से अधिक होने के कारण F_B < W_कील होता है और वह डूब जाती है।',
        },
        {
          en: 'Explains how the hollow hull geometry encloses a large volume of air, reducing the ship’s overall average density below 1.0 g/cm³.',
          hi: 'स्पष्ट करता है कि जहाज की खोखली बनावट बड़े आयतन में हवा घेरती है जिससे औसत घनत्व 1.0 g/cm³ से कम हो जाता है।',
        },
        {
          en: 'Connects to Archimedes’ Principle: the wide hull displaces a large volume of water whose weight equals the total weight of the ship (F_B = W_ship).',
          hi: 'आर्किमिडीज के सिद्धांत से जोड़ता है: जहाज अपने कुल भार के बराबर पानी विस्थापित कर लेता है (F_B = W_जहाज)।',
        },
      ],
    },
  },

  'sound-echo-wave-speed': {
    ncertSection: 'NCERT Class 9 Chapter 11: Sound (Sec 11.2 — Propagation & Wave Speed; Sec 11.3 — Reflection of Sound & Echo)',
    openingQuestion: {
      en: '“If a soprano singer hits a high-pitched note (twice the frequency of a bass note) in an auditorium, does her high note reach the back row any faster?”',
      hi: '“यदि किसी सभागार में एक गायिका दोगुनी आवृत्ति (उच्च तारत्व) का स्वर गाती है, तो क्या उसकी आवाज़ पिछली पंक्ति तक तेज़ी से पहुँचेगी?”',
    },
    experimentProtocol: {
      goal: {
        en: 'Investigate how wavelength λ scales inversely with frequency f in a uniform medium (v = fλ) and determine the minimum cliff distance required for a distinct echo (t ≥ 0.1 s).',
        hi: 'समान माध्यम में आवृत्ति f के साथ तरंगदैर्घ्य λ के व्युत्क्रम संबंध (v = fλ) का परीक्षण करें और स्पष्ट प्रतिध्वनि (t ≥ 0.1 s) के लिए न्यूनतम दूरी ज्ञात करें।',
      },
      steps: [
        {
          en: 'Keep Wave Speed v = 340 m/s and increase Wave Frequency f from 170 Hz to 340 Hz. Observe in the top wave profile that wavelength λ halves from 2.0 m to 1.0 m while speed remains 340 m/s.',
          hi: 'ध्वनि की चाल v = 340 m/s स्थिर रखकर आवृत्ति f को 170 Hz से 340 Hz करें। देखें कि तरंगदैर्घ्य λ 2.0 m से घटकर 1.0 m (आधी) हो जाती है।',
        },
        {
          en: 'Set Cliff Distance d = 85 m at v = 340 m/s. Note that the sound travels 85 m to the cliff + 85 m back (2d = 170 m), taking t = 170 / 340 = 0.50 s (Distinct Echo Heard ✓).',
          hi: 'चट्टान की दूरी d = 85 m रखें। देखें कि ध्वनि 85 m जाकर 85 m लौटती है (2d = 170 m) और समय t = 170/340 = 0.50 s लगता है (स्पष्ट प्रतिध्वनि ✓)।',
        },
        {
          en: 'Slide Cliff Distance d down to 15 m. Notice round-trip distance is 30 m and t = 0.09 s < 0.10 s — the bench warns “TOO CLOSE FOR ECHO”!',
          hi: 'अब चट्टान की दूरी d घटाकर 15 m करें। देखें कि कुल पथ 30 m और समय t = 0.09 s (< 0.10 s) हो जाता है, जिससे स्पष्ट प्रतिध्वनि सुनाई नहीं देती!',
        },
      ],
      observationCheck: {
        prompt: {
          en: 'At a wave speed of v = 340 m/s in air, what is the minimum cliff distance d at which the echo bench switches to “DISTINCT ECHO HEARD ✓” (t_echo ≥ 0.10 s)?',
          hi: 'वायु में v = 340 m/s की चाल पर स्पष्ट प्रतिध्वनि (t_echo ≥ 0.10 s) सुनने के लिए अवरोधक की न्यूनतम दूरी d कितनी होनी चाहिए?',
        },
        options: [
          {
            en: 'd = 17 m (because round-trip 2d = 34 m takes 34 / 340 = 0.10 s)',
            hi: 'd = 17 m (क्योंकि कुल आने-जाने की दूरी 2d = 34 m में 34 / 340 = 0.10 s लगते हैं)',
          },
          {
            en: 'd = 34 m (ignoring the return journey)',
            hi: 'd = 34 m (वापसी की दूरी को अनदेखा करने पर)',
          },
          {
            en: 'd = 340 m',
            hi: 'd = 340 m',
          },
        ],
        correctIndex: 0,
        explanation: {
          en: 'The sensation of sound persists in the human brain for 0.1 s. In 0.1 s at 340 m/s, sound travels a total round-trip distance 2d = 340 × 0.1 = 34 m, so the reflecting surface must be at least d = 34 / 2 = 17 m away!',
          hi: 'मस्तिष्क में ध्वनि की संवेदना 0.1 s तक बनी रहती है। 0.1 s में ध्वनि कुल दूरी 2d = 340 × 0.1 = 34 m तय करती है, अतः परावर्तक सतह की न्यूनतम दूरी d = 34 / 2 = 17 m होनी चाहिए!',
        },
      },
    },
    discoveryNotes: {
      physicalMeaning: {
        en: 'Wave speed v is a property of the medium (faster in solids/liquids than gases, and faster in warmer air). Frequency f is fixed by the vibrating source. Therefore wavelength λ = v/f adjusts automatically to match both.',
        hi: 'ध्वनि की चाल v माध्यम का गुण है (ठोस व द्रव में गैस से अधिक, तथा गर्म वायु में अधिक)। आवृत्ति f स्रोत द्वारा तय होती है, इसलिए तरंगदैर्घ्य λ = v/f स्वतः समायोजित होती है।',
      },
      scalingRule: {
        en: '1. In the same medium (fixed v): λ ∝ 1/f.  2. For any reflection/echo/SONAR problem: Total Distance = 2d = v × t, so one-way distance d = (v × t) / 2.',
        hi: '1. समान माध्यम में (स्थिर v): λ ∝ 1/f।  2. किसी भी प्रतिध्वनि या सोनार प्रश्न में: कुल दूरी = 2d = v × t, अतः एकतरफा दूरी d = (v × t) / 2।',
      },
      siUnitRule: {
        en: 'Frequency f is in Hertz (Hz = 1/s), Time Period T = 1/f is in seconds (s), Wavelength λ is in metres (m), and Wave Speed v = fλ is in m/s.',
        hi: 'आवृत्ति f का मात्रक हर्ट्ज़ (Hz = 1/s), आवर्तकाल T = 1/f का सेकंड (s), तरंगदैर्घ्य λ का मीटर (m) तथा चाल v = fλ का m/s होता है।',
      },
    },
    workedNumerical: {
      title: {
        en: 'NCERT Class 9 Sound · SONAR Seabed Depth Calculation',
        hi: 'NCERT कक्षा 9 ध्वनि · सोनार (SONAR) से समुद्र की गहराई',
      },
      problem: {
        en: 'A ship sends out an ultrasound pulse that returns from the seabed and is detected after 3.42 s. If the speed of ultrasound through seawater is 1531 m/s, what is the distance of the seabed from the ship?',
        hi: 'एक जहाज पराध्वनि उत्सर्जित करता है जो समुद्र तल से परावर्तित होकर 3.42 s के पश्चात संसूचित की जाती है। यदि समुद्री जल में पराध्वनि की चाल 1531 m/s हो, तो समुद्र तल से जहाज की दूरी कितनी है?',
      },
      given: [
        { en: 'Ultrasound speed in seawater v = 1531 m/s', hi: 'समुद्री जल में चाल v = 1531 m/s' },
        { en: 'Round-trip echo time t = 3.42 s', hi: 'पल्स के लौटने का कुल समय t = 3.42 s' },
      ],
      formula: '2d = v × t  ⇒  d = (v × t) / 2',
      substitution: '2d = 1531 × 3.42 = 5236.02 m  ⇒  d = 5236.02 / 2 = 2618.01 m',
      answer: {
        en: 'Seabed depth d = 2618 m (approx 2.62 km).',
        hi: 'समुद्र तल की गहराई d = 2618 m (लगभग 2.62 km)।',
      },
      unitTrapNote: {
        en: 'If frequency is given in kilohertz (e.g. 2 kHz), convert it to Hz (2000 Hz) and convert wavelength from cm to m before computing v = fλ!',
        hi: 'यदि आवृत्ति kHz में दी हो (जैसे 2 kHz = 2000 Hz) और तरंगदैर्घ्य सेमी (cm) में, तो v = fλ लगाने से पहले उन्हें Hz और मीटर (m) में बदलें!',
      },
    },
    contrastTrap: {
      trapTitle: {
        en: 'Forgetting the Factor of 2 in Echo & SONAR Problems (Writing d = v × t Instead of 2d = v × t)',
        hi: 'प्रतिध्वनि व सोनार प्रश्नों में 2 का गुणक भूल जाना (2d = vt के स्थान पर d = vt लिखना)',
      },
      commonMistake: {
        en: 'Multiplying speed by echo time (v × t) and reporting that full round-trip distance as the distance to the cliff or seabed.',
        hi: 'चाल और प्रतिध्वनि समय का गुणा (v × t) करके उसी कुल दूरी को चट्टान या समुद्र तल की दूरी मान लेना।',
      },
      correctPhysics: {
        en: 'An echo must travel from the source to the reflector (+d) AND from the reflector back to the receiver (+d). Therefore v × t equals 2d, and the reflector distance is always d = (v × t) / 2.',
        hi: 'प्रतिध्वनि स्रोत से परावर्तक तक जाती है (+d) और परावर्तक से वापस श्रोता तक लौटती है (+d)। अतः v × t हमेशा 2d के बराबर होता है, और एकतरफा दूरी d = (v × t) / 2 होती है।',
      },
      checkRule: {
        en: 'As soon as you read “echo” or “SONAR return pulse”, write 2d = v × t on your first line!',
        hi: 'जैसे ही प्रश्न में “प्रतिध्वनि (Echo)” या “सोनार (SONAR)” पढ़ें, पहली ही पंक्ति में 2d = v × t लिखें!',
      },
    },
    hotsReasoningTask: {
      title: {
        en: 'HOTS Summer vs Winter Echo: Why a Distant Valley Echo May Vanish on a Hot Day',
        hi: 'उच्च स्तरीय विश्लेषण: गर्मी के दिन प्रतिध्वनि के लिए अधिक न्यूनतम दूरी क्यों चाहिए?',
      },
      prompt: {
        en: 'On a cold winter morning (air temperature 10 °C), the speed of sound is 336 m/s and a student standing 17.0 m from a wall hears a distinct echo. On a hot summer afternoon (40 °C), the speed of sound rises to 356 m/s. Will the student still hear a distinct echo from the same 17.0 m spot? Explain with calculation.',
        hi: 'सर्दियों की सुबह (10 °C) ध्वनि की चाल 336 m/s है और दीवार से 17.0 m दूर खड़े छात्र को स्पष्ट प्रतिध्वनि सुनाई देती है। गर्मियों की दोपहर (40 °C) में ध्वनि की चाल बढ़कर 356 m/s हो जाती है। क्या उसी 17.0 m दूरी से स्पष्ट प्रतिध्वनि सुनाई देगी? गणना सहित स्पष्ट कीजिए।',
      },
      claimOptions: [
        {
          en: 'No! At v = 356 m/s, the echo returns in t = 34 / 356 = 0.0955 s (< 0.10 s threshold), so the minimum distance needed rises to d_min = (356 × 0.1)/2 = 17.8 m.',
          hi: 'नहीं! v = 356 m/s पर प्रतिध्वनि t = 34 / 356 = 0.0955 s (< 0.10 s) में लौट आती है; स्पष्ट प्रतिध्वनि हेतु अब न्यूनतम दूरी d_min = 17.8 m चाहिए।',
        },
        {
          en: 'Yes, because faster sound always makes echoes easier to hear at shorter distances.',
          hi: 'हाँ, क्योंकि तेज़ चाल होने से कम दूरी पर भी प्रतिध्वनि आसानी से सुनाई देती है।',
        },
        {
          en: 'Yes, because the minimum distance for an echo is fixed at 17.0 m regardless of temperature.',
          hi: 'हाँ, क्योंकि प्रतिध्वनि की न्यूनतम दूरी तापमान से स्वतंत्र होकर सदैव 17.0 m रहती है।',
        },
      ],
      correctClaimIndex: 0,
      claimExplanation: {
        en: 'Because the human brain requires at least t = 0.10 s to separate an echo from the original sound, a higher wave speed v in hot air requires a larger minimum reflector distance: d_min = (v × 0.10) / 2 = 17.8 m > 17.0 m!',
        hi: 'मस्तिष्क को मूल ध्वनि और प्रतिध्वनि में अंतर करने हेतु कम से कम 0.10 s चाहिए। गर्म हवा में चाल बढ़ने (356 m/s) पर न्यूनतम आवश्यक दूरी d_min = (356 × 0.10)/2 = 17.8 m हो जाती है, इसलिए 17.0 m पर स्पष्ट प्रतिध्वनि नहीं सुनाई देगी!',
      },
      rubricPoints: [
        {
          en: 'States the persistence of hearing requirement: echo return time must be at least t ≥ 0.10 s.',
          hi: 'श्रवण निबंध (Persistence of hearing) की शर्त लिखता है: प्रतिध्वनि का समय t ≥ 0.10 s होना चाहिए।',
        },
        {
          en: 'Calculates echo return time at 40 °C (v = 356 m/s) for d = 17.0 m: t = 2d / v = 34 / 356 = 0.0955 s < 0.10 s.',
          hi: '40 °C (v = 356 m/s) पर d = 17.0 m के लिए समय की गणना करता है: t = 34 / 356 = 0.0955 s < 0.10 s।',
        },
        {
          en: 'Concludes that no distinct echo is heard at 17.0 m because the new minimum distance is d_min = (356 × 0.10)/2 = 17.8 m.',
          hi: 'निष्कर्ष निकालता है कि 17.0 m पर स्पष्ट प्रतिध्वनि नहीं सुनाई देगी क्योंकि अब न्यूनतम दूरी 17.8 m आवश्यक है।',
        },
      ],
    },
  },

  'eye-defects-correction': {
    ncertSection: 'NCERT Class 10 Chapter 10: The Human Eye and the Colourful World (Sec 10.2 — Defects of Vision and Their Correction)',
    openingQuestion: {
      en: '“Why does a near-sighted (myopic) eye need a negative diverging lens, whereas a far-sighted (hypermetropic) eye needs a positive converging lens?”',
      hi: '“निकट-दृष्टि दोष (Myopia) के लिए ऋणात्मक अवतल लेंस की आवश्यकता क्यों होती है, जबकि दीर्घ-दृष्टि दोष (Hypermetropia) के लिए धनात्मक उत्तल लेंस क्यों लगाया जाता है?”',
    },
    experimentProtocol: {
      goal: {
        en: 'Compare where light rays focus inside an uncorrected myopic versus hypermetropic eyeball, and verify how corrective spectacle lenses restore sharp focus on the retina.',
        hi: 'बिना चश्मे के निकट-दृष्टि एवं दीर्घ-दृष्टि दोष वाले नेत्र गोलक में किरणों के फोकस की तुलना करें और सत्यापित करें कि संशोधक लेंस रेटिना पर फोकस कैसे स्थापित करता है।',
      },
      steps: [
        {
          en: 'Select “Myopia (Near-Sighted)” with Far Point d_F = 80 cm and toggle “Uncorrected Eye (Spectacles OFF)”. Observe that parallel rays from infinity converge IN FRONT of the retina.',
          hi: '“Myopia (निकट-दृष्टि दोष)” और दूर बिंदु d_F = 80 cm चुनें तथा चश्मा बंद (OFF) करें। देखें कि अनंत से आने वाली समानांतर किरणें रेटिना के सामने ही मिल जाती हैं।',
        },
        {
          en: 'Toggle “Corrective Spectacles ON”. Notice the concave lens (f = −80 cm, P = −1.25 D) diverges incoming rays slightly so the eye lens focuses them squarely onto the retina!',
          hi: 'अब चश्मा चालू (ON) करें। देखें कि अवतल लेंस (f = −80 cm, P = −1.25 D) किरणों को थोड़ा अपसरित करता है जिससे नेत्र लेंस उन्हें ठीक रेटिना पर फोकस कर देता है!',
        },
        {
          en: 'Switch to “Hypermetropia (Far-Sighted)” with Near Point d_N = 100 cm. Toggle spectacles OFF to see near rays (u = −25 cm) focus BEHIND the retina, then ON to see the +3.0 D convex lens restore retinal focus.',
          hi: 'अब “Hypermetropia (दीर्घ-दृष्टि दोष)” और निकट बिंदु d_N = 100 cm चुनें। बिना चश्मे के पास की किरणें (u = −25 cm) रेटिना के पीछे जाती हैं, जिन्हें +3.0 D उत्तल लेंस रेटिना पर लाता है।',
        },
      ],
      observationCheck: {
        prompt: {
          en: 'In the Hypermetropia mode with defective near point d_N = 50 cm, what focal length f and spectacle power P are required so the person can read a book held at the normal near point (u = −25 cm)?',
          hi: 'दीर्घ-दृष्टि दोष में जब दोषपूर्ण निकट बिंदु d_N = 50 cm हो, तो सामान्य निकट बिंदु (u = −25 cm) पर रखी पुस्तक पढ़ने के लिए किस फोकस दूरी f और क्षमता P का लेंस चाहिए?',
        },
        options: [
          {
            en: 'Convex lens with f = +50 cm and Power P = +2.0 D (1/f = 1/(−50) − 1/(−25) = +1/50)',
            hi: 'उत्तल लेंस जिसकी फोकस दूरी f = +50 cm तथा क्षमता P = +2.0 D हो (1/f = 1/(−50) − 1/(−25) = +1/50)',
          },
          {
            en: 'Concave lens with f = −50 cm and Power P = −2.0 D',
            hi: 'अवतल लेंस जिसकी फोकस दूरी f = −50 cm तथा क्षमता P = −2.0 D हो',
          },
          {
            en: 'Convex lens with f = +25 cm and Power P = +4.0 D',
            hi: 'उत्तल लेंस जिसकी फोकस दूरी f = +25 cm तथा क्षमता P = +4.0 D हो',
          },
        ],
        correctIndex: 0,
        explanation: {
          en: 'Here u = −25 cm and target virtual image v = −50 cm. By the lens formula: 1/f = 1/(−50) − 1/(−25) = −1/50 + 2/50 = +1/50 cm⁻¹, so f = +50 cm = +0.5 m and P = +2.0 D.',
          hi: 'यहाँ u = −25 cm तथा आभासी प्रतिबिंब दूरी v = −50 cm है। लेंस सूत्र से: 1/f = 1/(−50) − 1/(−25) = +1/50 cm⁻¹, अतः f = +50 cm = +0.5 m तथा क्षमता P = +2.0 D।',
        },
      },
    },
    discoveryNotes: {
      physicalMeaning: {
        en: 'A corrective spectacle lens does not heal the eyeball; instead, it takes an object at the desired normal position (u = −∞ for myopia, u = −25 cm for hypermetropia) and forms a virtual image at the distance where the person’s eye CAN see clearly (v = −d_F or v = −d_N).',
        hi: 'संशोधक चश्मा नेत्र गोलक को नहीं बदलता; वह वस्तु (निकट-दृष्टि हेतु u = −∞, दीर्घ-दृष्टि हेतु u = −25 cm) का आभासी प्रतिबिंब उस बिंदु (v = −d_F या v = −d_N) पर बना देता है जहाँ व्यक्ति का नेत्र स्पष्ट देख सकता है।',
      },
      scalingRule: {
        en: '1. Myopia: f = −d_F (Concave lens, negative Dioptres).  2. Hypermetropia: 1/f = 1/(−d_N) − 1/(−25) = (d_N − 25)/(25·d_N) (Convex lens, positive Dioptres).',
        hi: '1. निकट-दृष्टि दोष: f = −d_F (अवतल लेंस, ऋणात्मक क्षमता)।  2. दीर्घ-दृष्टि दोष: 1/f = 1/25 − 1/d_N (उत्तल लेंस, धनात्मक क्षमता)।',
      },
      siUnitRule: {
        en: 'Both u and v in human-eye problems lie in front of the spectacle lens, so BOTH u and v carry a NEGATIVE (−) sign under the New Cartesian Sign Convention!',
        hi: 'नेत्र दोष के प्रश्नों में बिंब (u) और आभासी प्रतिबिंब (v) दोनों चश्मे के सामने (बाईं ओर) होते हैं, इसलिए कार्तीय परिपाटी में u और v दोनों ऋणात्मक (−) लिए जाते हैं!',
      },
    },
    workedNumerical: {
      title: {
        en: 'NCERT Class 10 Ch 10 Q5 · Myopic Far-Point Prescription',
        hi: 'NCERT कक्षा 10 अध्याय 10 प्रश्न 5 · निकट-दृष्टि दोष संशोधन',
      },
      problem: {
        en: 'A person with a myopic eye cannot see objects beyond 1.2 m (120 cm) distinctly. What should be the type of the corrective lens used to restore proper vision, and what is its power?',
        hi: 'निकट-दृष्टि दोष का कोई व्यक्ति 1.2 m (120 cm) से अधिक दूरी पर रखी वस्तुओं को सुस्पष्ट नहीं देख सकता। इस दोष को दूर करने के लिए प्रयुक्त संशोधक लेंस किस प्रकार का होना चाहिए तथा उसकी क्षमता क्या होगी?',
      },
      given: [
        { en: 'Object at infinity: u = −∞', hi: 'अनंत पर स्थित बिंब: u = −∞' },
        { en: 'Myopic far point: v = −1.2 m = −120 cm', hi: 'दोषपूर्ण दूर बिंदु: v = −1.2 m = −120 cm' },
      ],
      formula: '1/f = 1/v − 1/u  |  P = 1 / f(m)',
      substitution: '1/f = 1/(−1.2 m) − 1/(−∞) = −1/1.2 m⁻¹ ⇒ f = −1.2 m  |  P = 1 / (−1.2) = −0.83 D',
      answer: {
        en: 'Concave (diverging) lens of focal length f = −1.2 m and power P = −0.83 D.',
        hi: 'अवतल (अपसारी) लेंस जिसकी फोकस दूरी f = −1.2 m तथा क्षमता P = −0.83 D हो।',
      },
      unitTrapNote: {
        en: 'Never plug u = −25 cm into a Myopia distant-vision problem! Myopia affects distant vision, so u = −∞ and f simply equals −d_F.',
        hi: 'निकट-दृष्टि दोष (दूर की वस्तु न दिखना) के प्रश्न में गलती से u = −25 cm न रखें! वहाँ दूरस्थ वस्तु के लिए u = −∞ होता है और f = −d_F होता है।',
      },
    },
    contrastTrap: {
      trapTitle: {
        en: 'Setting f = +d_N Directly in Hypermetropia Instead of Using u = −25 cm and v = −d_N',
        hi: 'दीर्घ-दृष्टि दोष में u = −25 cm का उपयोग किए बिना सीधे f = +d_N लिख देना',
      },
      commonMistake: {
        en: 'Reading “the near point of a hypermetropic eye is 100 cm” and immediately writing f = +100 cm, P = +1.0 D.',
        hi: '“दीर्घ-दृष्टि दोष वाले नेत्र का निकट बिंदु 100 cm है” पढ़कर सीधे f = +100 cm और P = +1.0 D लिख देना।',
      },
      correctPhysics: {
        en: 'In hypermetropia, the object is a book held at the normal near point u = −25 cm, and its virtual image must be formed at v = −100 cm! Using 1/f = 1/(−100) − 1/(−25) = +3/100 gives f = +33.3 cm and P = +3.0 D—three times stronger!',
        hi: 'दीर्घ-दृष्टि दोष में पुस्तक सामान्य निकट बिंदु u = −25 cm पर रखी होती है और उसका आभासी प्रतिबिंब v = −100 cm पर बनना चाहिए! लेंस सूत्र 1/f = 1/(−100) − 1/(−25) = +3/100 से f = +33.3 cm और क्षमता P = +3.0 D आती है!',
      },
      checkRule: {
        en: 'Myopia uses 1 distance (u = −∞, v = −d_F ⇒ f = −d_F). Hypermetropia ALWAYS combines 2 distances (u = −25 cm and v = −d_N)!',
        hi: 'निकट-दृष्टि में 1 दूरी (f = −d_F) लगती है, जबकि दीर्घ-दृष्टि में हमेशा 2 दूरियाँ (u = −25 cm तथा v = −d_N) सूत्र में रखी जाती हैं!',
      },
    },
    hotsReasoningTask: {
      title: {
        en: 'HOTS Bifocal Prescription: Decoding a Dual-Lens Spectacle Card',
        hi: 'उच्च स्तरीय विश्लेषण: द्विफोकसी (Bifocal) चश्मे के कार्ड को डिकोड करना',
      },
      prompt: {
        en: 'An elderly teacher suffering from presbyopia wears bifocal spectacles: the upper part has power −1.0 D and the lower part has power +2.0 D. Identify which defect each part corrects, state the lens type of each part, and calculate the teacher’s uncorrected far point and near point.',
        hi: 'जरा-दूरदृष्टिता (Presbyopia) से पीड़ित एक वरिष्ठ शिक्षक द्विफोकसी चश्मा पहनते हैं: ऊपरी भाग की क्षमता −1.0 D और निचले भाग की क्षमता +2.0 D है। प्रत्येक भाग का लेंस प्रकार तथा शिक्षक का बिना चश्मे का दूर बिंदु (d_F) और निकट बिंदु (d_N) ज्ञात कीजिए।',
      },
      claimOptions: [
        {
          en: 'Upper part (−1.0 D, concave) corrects myopia with far point d_F = 100 cm; lower part (+2.0 D, convex, f = +50 cm) corrects hypermetropia with near point d_N = 50 cm.',
          hi: 'ऊपरी भाग (−1.0 D, अवतल) दूर देखने हेतु है (d_F = 100 cm); निचला भाग (+2.0 D, उत्तल, f = +50 cm) पढ़ने हेतु है (निकट बिंदु d_N = 50 cm)।',
        },
        {
          en: 'Upper part is convex for reading and lower part is concave for distance.',
          hi: 'ऊपरी भाग पढ़ने के लिए उत्तल है और निचला भाग दूर देखने के लिए अवतल है।',
        },
        {
          en: 'Upper part gives far point 100 cm and lower part gives near point 25 cm.',
          hi: 'ऊपरी भाग से दूर बिंदु 100 cm और निचले भाग से दोषपूर्ण निकट बिंदु 25 cm है।',
        },
      ],
      correctClaimIndex: 0,
      claimExplanation: {
        en: 'For the upper −1.0 D concave lens, f = −100 cm ⇒ uncorrected far point d_F = 100 cm (1 m). For the lower +2.0 D convex reading lens, f = +50 cm; using 1/50 = 1/v − 1/(−25) gives 1/v = 1/50 − 1/25 = −1/50 ⇒ v = −50 cm (uncorrected near point d_N = 50 cm).',
        hi: 'ऊपरी −1.0 D अवतल लेंस के लिए f = −100 cm ⇒ दूर बिंदु d_F = 100 cm। निचले +2.0 D उत्तल लेंस के लिए f = +50 cm; सूत्र 1/50 = 1/v − 1/(−25) से 1/v = −1/50 ⇒ v = −50 cm (दोषपूर्ण निकट बिंदु d_N = 50 cm)।',
      },
      rubricPoints: [
        {
          en: 'Identifies upper part (−1.0 D) as a concave lens for distant vision and calculates far point d_F = 100 / 1.0 = 100 cm (1 m).',
          hi: 'ऊपरी भाग (−1.0 D) को दूर दृष्टि हेतु अवतल लेंस पहचानता है और दूर बिंदु d_F = 100 cm (1 m) निकालता है।',
        },
        {
          en: 'Identifies lower part (+2.0 D) as a convex lens for near reading with focal length f = +50 cm.',
          hi: 'निचले भाग (+2.0 D) को निकट पठन हेतु उत्तल लेंस (f = +50 cm) पहचानता है।',
        },
        {
          en: 'Substitutes u = −25 cm and f = +50 cm into 1/v = 1/f + 1/u to find uncorrected near point v = −50 cm (d_N = 50 cm).',
          hi: 'u = −25 cm और f = +50 cm रखकर दोषपूर्ण निकट बिंदु d_N = 50 cm की गणना करता है।',
        },
      ],
    },
  },

  'prism-dispersion-scattering': {
    ncertSection: 'NCERT Class 10 Chapter 10: The Human Eye and the Colourful World (Sec 10.3–10.6 — Prism Dispersion, Rainbow & Tyndall/Rayleigh Scattering)',
    openingQuestion: {
      en: '“Why does a rectangular glass slab merely shift a white light beam sideways without splitting it into colours, whereas a triangular glass prism fans it out into VIBGYOR?”',
      hi: '“काँच का आयताकार स्लैब श्वेत प्रकाश को बिना रंगों में बाँटे केवल पार्श्विक रूप से विस्थापित करता है, जबकि त्रिभुजाकार प्रिज्म उसे सात रंगों (VIBGYOR) में क्यों फैला देता है?”',
    },
    experimentProtocol: {
      goal: {
        en: 'Explore how refractive index n, prism deviation angle δ, and Rayleigh sky scattering scale inversely with light wavelength λ across 400 nm (Violet) to 700 nm (Red), and test Newton’s two-prism recombination.',
        hi: '400 nm (बैंगनी) से 700 nm (लाल) तक तरंगदैर्घ्य λ के साथ अपवर्तनांक n, विचलन कोण δ और प्रकीर्णन के व्युत्क्रम संबंध का परीक्षण करें तथा न्यूटन के द्वि-प्रिज्म पुनर्योजन की जाँच करें।',
      },
      steps: [
        {
          en: 'Slide Light Wavelength λ to 400 nm (Violet). Note in the ledger that glass refractive index is highest (n = 1.532), deviation angle is largest (δ = 43.2°), and Rayleigh scattering is 9.38× stronger than Red.',
          hi: 'तरंगदैर्घ्य λ को 400 nm (बैंगनी) पर सेट करें। देखें कि अपवर्तनांक सर्वाधिक (n = 1.532), विचलन कोण अधिकतम (δ = 43.2°) और प्रकीर्णन लाल की तुलना में 9.38 गुना अधिक है।',
        },
        {
          en: 'Slide Wavelength λ up to 700 nm (Red). Observe that refractive index drops to 1.512, deviation angle drops to 39.2° (least bent at top of spectrum), and relative scattering is 1×.',
          hi: 'अब तरंगदैर्घ्य λ को 700 nm (लाल) तक बढ़ाएं। देखें कि अपवर्तनांक घटकर 1.512 और विचलन कोण घटकर 39.2° (स्पेक्ट्रम में सबसे ऊपर, न्यूनतम झुकाव) रह जाता है।',
        },
        {
          en: 'Click “2. Newton’s Inverted 2nd Prism: Recombine White Light”. Observe how the upside-down second prism bends the dispersed fan in the opposite direction to emerge as a single white beam!',
          hi: '“2. न्यूटन का उल्टा द्वितीय प्रिज्म” बटन दबाएं। देखें कि उल्टा रखा दूसरा प्रिज्म सातों रंगों के कोणीय फैलाव को निरस्त कर पुनः श्वेत प्रकाश पुंज बाहर निकालता है!',
        },
      ],
      observationCheck: {
        prompt: {
          en: 'As you sweep the wavelength slider from 400 nm (Violet) to 700 nm (Red), how do the speed of light inside glass and the prism deviation angle δ change?',
          hi: 'जब आप तरंगदैर्घ्य स्लाइडर को 400 nm (बैंगनी) से 700 nm (लाल) की ओर ले जाते हैं, तो काँच के भीतर प्रकाश की चाल और विचलन कोण δ में क्या परिवर्तन होता है?',
        },
        options: [
          {
            en: 'Speed inside glass INCREASES from Violet to Red, so refractive index n and deviation angle δ DECREASE (Red bends the least).',
            hi: 'बैंगनी से लाल की ओर जाने पर काँच में प्रकाश की चाल बढ़ती है, इसलिए अपवर्तनांक n और विचलन कोण δ घटते हैं (लाल सबसे कम मुड़ता है)।',
          },
          {
            en: 'Speed inside glass DECREASES from Violet to Red, so Red bends the most.',
            hi: 'बैंगनी से लाल की ओर जाने पर चाल घटती है और लाल सबसे अधिक मुड़ता है।',
          },
          {
            en: 'All wavelengths have the exact same refractive index n in glass.',
            hi: 'काँच में सभी तरंगदैर्घ्यों का अपवर्तनांक n समान रहता है।',
          },
        ],
        correctIndex: 0,
        explanation: {
          en: 'Longer wavelength Red (700 nm) interacts less strongly with glass electrons, travelling faster in glass (lower refractive index n = c/v) and therefore bending the least (δ = 39.2° vs 43.2° for Violet).',
          hi: 'बड़ी तरंगदैर्घ्य वाला लाल प्रकाश (700 nm) काँच में सबसे तेज़ चलता है, जिससे उसका अपवर्तनांक n = c/v सबसे कम होता है और वह सबसे कम कोण (39.2°) पर मुड़ता है।',
        },
      },
    },
    discoveryNotes: {
      physicalMeaning: {
        en: 'In vacuum/air, all colours of light travel at the same speed c ≈ 3 × 10⁸ m/s. Inside a dispersive medium like glass or a water raindrop, speed depends on wavelength: shorter λ (Violet) slows down more than longer λ (Red), splitting white light into its component spectrum.',
        hi: 'निर्वात में सभी रंग समान चाल (3 × 10⁸ m/s) से चलते हैं। परंतु काँच या पानी की बूँद में चाल तरंगदैर्घ्य पर निर्भर करती है: छोटी λ (बैंगनी) अधिक धीमी हो जाती है और अधिक मुड़ती है, जिससे श्वेत प्रकाश सात रंगों में विभक्त हो जाता है।',
      },
      scalingRule: {
        en: '1. Wavelength order: λ_Red (~700 nm) > ... > λ_Violet (~400 nm).  2. Bending / Deviation order: δ_Violet > ... > δ_Red.  3. Rayleigh Scattering off air molecules: I_scat ∝ 1 / λ⁴.',
        hi: '1. तरंगदैर्घ्य क्रम: λ_लाल > ... > λ_बैंगनी।  2. विचलन (झुकाव) क्रम: δ_बैंगनी > ... > δ_लाल।  3. वायु के अणुओं द्वारा प्रकीर्णन: I_scat ∝ 1 / λ⁴।',
      },
      siUnitRule: {
        en: '1 nanometre (nm) = 10⁻⁹ m. Visible light spans roughly 400 nm (Violet) to 700 nm (Red).',
        hi: '1 नैनोमीटर (nm) = 10⁻⁹ मीटर। दृश्य प्रकाश का परिसर लगभग 400 nm (बैंगनी) से 700 nm (लाल) तक होता है।',
      },
    },
    workedNumerical: {
      title: {
        en: 'NCERT Class 10 Ch 10 · Rayleigh Scattering Ratio Between Blue and Red Light',
        hi: 'NCERT कक्षा 10 अध्याय 10 · नीले और लाल प्रकाश के प्रकीर्णन का अनुपात',
      },
      problem: {
        en: 'The wavelength of red light is approximately 700 nm, which is about 1.75 times the wavelength of violet-blue light (400 nm). Using Rayleigh’s inverse fourth-power law (I ∝ 1/λ⁴), calculate how many times more strongly violet-blue light is scattered by fine air molecules than red light.',
        hi: 'लाल प्रकाश की तरंगदैर्घ्य (700 nm) बैंगनी-नीले प्रकाश (400 nm) की लगभग 1.75 गुनी है। रैले के प्रकीर्णन नियम (I ∝ 1/λ⁴) से गणना कीजिए कि वायु के सूक्ष्म अणुओं द्वारा बैंगनी-नीला प्रकाश लाल प्रकाश की तुलना में कितने गुना अधिक प्रकीर्णित होता है।',
      },
      given: [
        { en: 'λ_red = 700 nm, λ_violet = 400 nm', hi: 'λ_लाल = 700 nm, λ_बैंगनी = 400 nm' },
        { en: 'Wavelength ratio: λ_red / λ_violet = 700 / 400 = 1.75', hi: 'तरंगदैर्घ्य अनुपात: 700 / 400 = 1.75' },
      ],
      formula: 'I_violet / I_red = (λ_red / λ_violet)⁴',
      substitution: 'I_violet / I_red = (700 / 400)⁴ = (1.75)⁴ = 9.38',
      answer: {
        en: 'Violet-blue light scatters 9.38 times (nearly 10×) more strongly than red light.',
        hi: 'बैंगनी-नीला प्रकाश लाल प्रकाश की तुलना में 9.38 गुना (लगभग 10 गुना) अधिक प्रकीर्णित होता है।',
      },
      unitTrapNote: {
        en: 'Because (λ_red / λ_violet) is a ratio of two wavelengths, keep both in nanometres (nm) so the units cancel cleanly before raising to the 4th power!',
        hi: 'अनुपात निकालते समय दोनों तरंगदैर्घ्यों को एक ही मात्रक (nm) में रखें ताकि घात 4 करने से पहले मात्रक कट जाएं!',
      },
    },
    contrastTrap: {
      trapTitle: {
        en: 'Thinking Newton’s Second Prism Must Be Upright or Thinking the Prism “Paints” Colour Onto White Light',
        hi: 'न्यूटन के दूसरे प्रिज्म को सीधा बना देना या यह सोचना कि प्रिज्म स्वयं रंग उत्पन्न करता है',
      },
      commonMistake: {
        en: 'Drawing both prisms with their apexes pointing UPWARD in the recombination diagram, or claiming the glass prism chemically colours the white light.',
        hi: 'पुनर्योजन चित्र में दोनों प्रिज्मों के शीर्ष ऊपर की ओर बना देना, यह भूलकर कि समान दिशा में रखने पर वर्ण-विक्षेपण और अधिक बढ़ जाएगा।',
      },
      correctPhysics: {
        en: 'White light already contains all 7 spectral wavelengths. The second identical prism MUST be placed INVERTED (apex downward, parallel to the first prism’s opposite face) so its angular dispersion is equal and opposite, recombining the colours into white light!',
        hi: 'श्वेत प्रकाश में पहले से ही सभी रंग उपस्थित होते हैं। दूसरे समान प्रिज्म को उल्टा (शीर्ष नीचे की ओर) रखना अनिवार्य है ताकि उसका कोणीय विक्षेपण विपरीत दिशा में होकर सातों रंगों को पुनः श्वेत प्रकाश में मिला दे!',
      },
      checkRule: {
        en: 'In exam diagrams of Newton’s recombination: Prism 1 = Apex UP (△), Prism 2 = Apex DOWN (▽)!',
        hi: 'बोर्ड परीक्षा में न्यूटन के पुनर्योजन चित्र में: पहला प्रिज्म = सीधा (△), दूसरा प्रिज्म = उल्टा (▽) बनाएं!',
      },
    },
    hotsReasoningTask: {
      title: {
        en: 'HOTS Atmospheric Optics: Why the Sky is Blue to Us on Earth but Pitch-Black to Astronauts in Space',
        hi: 'उच्च स्तरीय विश्लेषण: पृथ्वी से आकाश नीला पर अंतरिक्ष यात्रियों को काला क्यों दिखता है?',
      },
      prompt: {
        en: 'Explain scientifically why the clear daytime sky appears blue to an observer on Earth, why the Sun appears reddish at sunrise/sunset, and why the sky appears dark/black to an astronaut aboard the International Space Station.',
        hi: 'वैज्ञानिक कारण स्पष्ट कीजिए कि पृथ्वी पर स्वच्छ आकाश नीला क्यों दिखता है, सूर्योदय/सूर्यास्त के समय सूर्य रक्ताभ (लाल) क्यों प्रतीत होता है, तथा अंतरिक्ष यात्री को आकाश काला क्यों दिखाई देता है?',
      },
      claimOptions: [
        {
          en: 'Fine air molecules scatter short-wavelength blue light strongly across the sky (I ∝ 1/λ⁴); at horizon sunrise/sunset, blue is scattered away over the long atmospheric path leaving red; in outer space, there is no atmosphere so no scattering occurs and the sky looks black.',
          hi: 'वायु के सूक्ष्म अणु छोटी तरंगदैर्घ्य के नीले प्रकाश को प्रकीर्णित करते हैं (I ∝ 1/λ⁴); क्षितिज पर लंबी वायुमंडलीय दूरी में नीला प्रकाश बिखर जाता है व लाल पहुँचता है; अंतरिक्ष में वायुमंडल न होने से प्रकीर्णन नहीं होता और आकाश काला दिखता है।',
        },
        {
          en: 'The blue colour of the sky is caused by reflection of the blue oceans, which cannot reach outer space.',
          hi: 'आकाश का नीला रंग समुद्र के परावर्तन के कारण होता है जो अंतरिक्ष तक नहीं पहुँच पाता।',
        },
        {
          en: 'Red light scatters the most at noon and blue light scatters the least in space.',
          hi: 'दोपहर में लाल प्रकाश सबसे अधिक फैलता है और अंतरिक्ष में नीला प्रकाश सबसे कम।',
        },
      ],
      correctClaimIndex: 0,
      claimExplanation: {
        en: 'Air molecules are smaller than visible wavelengths and scatter short-wavelength blue light ~6–9× more than red (I ∝ 1/λ⁴). At sunset, sunlight traverses a thick horizontal layer of air, scattering away most blue light so predominantly red reaches the eye. In vacuum space, absence of atmosphere means zero scattering (dark sky).',
        hi: 'वायु के अणु छोटी तरंगदैर्घ्य वाले नीले प्रकाश को लाल की अपेक्षा बहुत अधिक प्रकीर्णित करते हैं। सूर्यास्त पर प्रकाश वायुमंडल की मोटी परत से गुजरता है जिससे नीला रंग मार्ग में बिखर जाता है और लाल आँख तक पहुँचता है। अंतरिक्ष में वायुमंडल न होने से प्रकीर्णन शून्य होता है।',
      },
      rubricPoints: [
        {
          en: 'Explains blue daytime sky: fine air molecules scatter shorter-wavelength blue light much more strongly than red light (I ∝ 1/λ⁴).',
          hi: 'नीले आकाश का कारण: वायु के सूक्ष्म कण छोटी तरंगदैर्घ्य के नीले प्रकाश का लाल से कहीं अधिक प्रकीर्णन करते हैं।',
        },
        {
          en: 'Explains reddish sunrise/sunset: sunlight travels a much longer atmospheric path near the horizon, scattering away blue light so longer-wavelength red reaches the observer.',
          hi: 'सूर्योदय/सूर्यास्त पर लालिमा: क्षितिज के पास प्रकाश वायुमंडल में लंबी दूरी तय करता है जिससे नीला रंग बिखर जाता है और केवल लाल रंग पहुँचता है।',
        },
        {
          en: 'Explains dark sky in space: in the absence of an atmosphere in outer space, no scattering of sunlight takes place.',
          hi: 'अंतरिक्ष में काला आकाश: वायुमंडल की अनुपस्थिति में सूर्य के प्रकाश का प्रकीर्णन नहीं होता।',
        },
      ],
    },
  },

  'magnetic-field-solenoid': {
    ncertSection: 'NCERT Class 10 Chapter 12: Magnetic Effects of Electric Current (Sec 12.2 — Straight Conductor, Right-Hand Thumb Rule & Solenoid)',
    openingQuestion: {
      en: '“How can a simple coil of copper wire—which is completely non-magnetic on its own—turn into a powerful bar magnet with North and South poles the instant electric current flows through it?”',
      hi: '“तांबे के तार की एक साधारण कुंडली—जो स्वयं चुंबकीय नहीं होती—विद्युत धारा प्रवाहित होते ही उत्तरी और दक्षिणी ध्रुवों वाले शक्तिशाली छड़ चुंबक में कैसे बदल जाती है?”',
    },
    experimentProtocol: {
      goal: {
        en: 'Verify how magnetic field B weakens inversely with distance r around a straight wire (B ∝ I/r), how Right-Hand Thumb Rule predicts field direction, and how a solenoid concentrates field lines into a uniform core (B ∝ N·I).',
        hi: 'सत्यापित करें कि सीधे तार से दूरी r बढ़ने पर चुंबकीय क्षेत्र कैसे घटता है (B ∝ I/r), दक्षिण-हस्त अंगुष्ठ नियम दिशा कैसे बताता है, और परिनालिका के भीतर एकसमान क्षेत्र (B ∝ N·I) कैसे बनता है।',
      },
      steps: [
        {
          en: 'Set Electric Current I = 4 A and Radial Distance r = 2 cm in panel 1. Note that the wire field is B = 40 μT and the loops run Anticlockwise (↺) for upward current.',
          hi: 'धारा I = 4 A और दूरी r = 2 cm रखें। देखें कि सीधे तार का चुंबकीय क्षेत्र B = 40 μT है और ऊपर जाती धारा के लिए दिशा वामावर्त (↺) है।',
        },
        {
          en: 'Increase Radial Distance r from 2 cm to 8 cm (4× farther). Observe that the straight-wire magnetic field drops to 1/4th (from 40 μT to 10 μT)!',
          hi: 'अब तार से दूरी r को 2 cm से बढ़ाकर 8 cm (4 गुना दूर) करें। देखें कि चुंबकीय क्षेत्र घटकर चौथाई (40 μT से 10 μT) रह जाता है!',
        },
        {
          en: 'Now increase Solenoid Coil Turns N from 100 to 200 turns and toggle current direction between Upward (↑) and Downward (↓). Watch the uniform core field double from 4 mT to 8 mT and the N/S poles swap ends!',
          hi: 'अब परिनालिका के फेरे N को 100 से 200 करें और धारा की दिशा बदलें। देखें कि क्रोड का एकसमान चुंबकीय क्षेत्र दोगुना (4 mT से 8 mT) हो जाता है और N/S ध्रुव आपस में बदल जाते हैं!',
        },
      ],
      observationCheck: {
        prompt: {
          en: 'On the magnetic field bench, if you double the electric current I from 3 A to 6 A AND double the radial distance r from the straight wire from 2 cm to 4 cm, what happens to the magnetic field B_wire?',
          hi: 'यदि आप सीधे तार में विद्युत धारा I को 3 A से दोगुना (6 A) कर दें और तार से दूरी r को भी 2 cm से दोगुना (4 cm) कर दें, तो चुंबकीय क्षेत्र B_wire पर क्या प्रभाव पड़ेगा?',
        },
        options: [
          {
            en: 'B_wire stays unchanged at 30 μT because B ∝ I/r and the 2× current cancels the 2× distance.',
            hi: 'B_wire = 30 μT अपरिवर्तित रहता है क्योंकि B ∝ I/r में दोगुनी धारा और दोगुनी दूरी का अनुपात समान रहता है।',
          },
          {
            en: 'B_wire quadruples to 120 μT.',
            hi: 'B_wire चार गुना बढ़कर 120 μT हो जाता है।',
          },
          {
            en: 'B_wire drops to zero.',
            hi: 'B_wire शून्य हो जाता है।',
          },
        ],
        correctIndex: 0,
        explanation: {
          en: 'Because B_wire = 20 × I / r (in μT), at I = 3 A, r = 2 cm we get B = 60/2 = 30 μT. At I = 6 A, r = 4 cm we get B = 120/4 = 30 μT—doubling numerator I and denominator r leaves B invariant!',
          hi: 'चूँकि B_wire ∝ I / r होता है, इसलिए अंश (धारा I) और हर (दूरी r) दोनों को दोगुना करने पर चुंबकीय क्षेत्र 30 μT पर अपरिवर्तित रहता है!',
        },
      },
    },
    discoveryNotes: {
      physicalMeaning: {
        en: 'Moving electric charges always generate a magnetic field in the surrounding space. Wrapping a current-carrying wire into a tightly packed cylinder of N turns (a solenoid) adds the fields of all N loops axially, producing a uniform parallel interior field and external poles just like a bar magnet.',
        hi: 'गतिमान आवेश (विद्युत धारा) हमेशा अपने चारों ओर चुंबकीय क्षेत्र उत्पन्न करते हैं। तार को N फेरों वाली बेलनाकार परिनालिका में लपेटने से सभी फेरों का चुंबकीय क्षेत्र जुड़ जाता है और भीतर समानांतर रेखाओं वाला एकसमान चुंबकीय क्षेत्र बनता है।',
      },
      scalingRule: {
        en: '1. Straight Conductor: B ∝ I and B ∝ 1/r (Concentric circles get sparser farther from wire).  2. Solenoid Interior: B ∝ N · I (Uniform parallel lines; inserting a soft-iron core multiplies B into a strong electromagnet).',
        hi: '1. सीधा चालक: B ∝ I तथा B ∝ 1/r।  2. परिनालिका का भीतरी भाग: B ∝ N · I (समानांतर रेखाएं = एकसमान क्षेत्र; नर्म लोहे का क्रोड रखने पर शक्तिशाली विद्युत चुंबक बनता है)।',
      },
      siUnitRule: {
        en: 'The SI unit of magnetic field strength B is the Tesla (T). 1 milliTesla (mT) = 10⁻³ T; 1 microTesla (μT) = 10⁻⁶ T (Earth’s surface magnetic field is ~30–50 μT).',
        hi: 'चुंबकीय क्षेत्र B का SI मात्रक टेस्ला (Tesla, T) है। 1 mT = 10⁻³ T तथा 1 μT = 10⁻⁶ T।',
      },
    },
    workedNumerical: {
      title: {
        en: 'NCERT Class 10 Ch 12 Example 12.1 · Right-Hand Thumb Rule on an East–West Power Line',
        hi: 'NCERT कक्षा 10 उदाहरण 12.1 · पूर्व–पश्चिम विद्युत लाइन के नीचे चुंबकीय क्षेत्र की दिशा',
      },
      problem: {
        en: 'A current through a horizontal overhead power line flows from East to West direction. What is the direction of the magnetic field at a point directly BELOW it and at a point directly ABOVE it?',
        hi: 'किसी क्षैतिज शक्ति संचरण लाइन (Power line) में पूर्व से पश्चिम दिशा की ओर विद्युत धारा प्रवाहित हो रही है। इसके ठीक नीचे के किसी बिंदु पर तथा इसके ठीक ऊपर के किसी बिंदु पर चुंबकीय क्षेत्र की दिशा क्या है?',
      },
      given: [
        { en: 'Current direction: East → West', hi: 'विद्युत धारा की दिशा: पूर्व से पश्चिम की ओर' },
        { en: 'Observation points: (a) Directly below wire, (b) Directly above wire', hi: 'प्रेक्षण बिंदु: (a) तार के ठीक नीचे, (b) तार के ठीक ऊपर' },
      ],
      formula: 'Right-Hand Thumb Rule: Thumb = Current (East → West), Curled Fingers = Magnetic Field B',
      substitution: 'Viewing from East looking West: fingers curl clockwise ⇒ ABOVE wire points North, BELOW wire points South',
      answer: {
        en: 'Directly BELOW the wire: towards SOUTH. Directly ABOVE the wire: towards NORTH.',
        hi: 'तार के ठीक नीचे: दक्षिण (South) की ओर। तार के ठीक ऊपर: उत्तर (North) की ओर।',
      },
      unitTrapNote: {
        en: 'Always use your RIGHT hand for finding the magnetic field created by a current (Right-Hand Thumb Rule), and save your LEFT hand for finding the force on a current inside an external magnetic field!',
        hi: 'धारा से उत्पन्न चुंबकीय क्षेत्र की दिशा जानने के लिए हमेशा दाहिने हाथ (दक्षिण-हस्त अंगुष्ठ नियम) का प्रयोग करें, और बाह्य क्षेत्र में बल जानने के लिए बाएँ हाथ (फ्लेमिंग वाम-हस्त नियम) का!',
      },
    },
    contrastTrap: {
      trapTitle: {
        en: 'Claiming Two Magnetic Field Lines Can Intersect Each Other or That Field Inside a Solenoid Weakens at the Center',
        hi: 'दो चुंबकीय क्षेत्र रेखाओं का प्रतिच्छेद करना या परिनालिका के भीतर असमान क्षेत्र मान लेना',
      },
      commonMistake: {
        en: 'Drawing crossing magnetic field lines or stating that the magnetic field inside a long solenoid is zero at its center.',
        hi: 'चुंबकीय क्षेत्र रेखाओं को एक-दूसरे को काटते हुए बनाना या परिनालिका के केंद्र पर चुंबकीय क्षेत्र शून्य बताना।',
      },
      correctPhysics: {
        en: '1. Two magnetic field lines NEVER intersect—if they did, a compass needle placed at the intersection would have to point in two directions at once, which is impossible! 2. Inside a long solenoid, field lines are parallel straight lines, meaning the field is UNIFORM throughout the core.',
        hi: '1. दो चुंबकीय क्षेत्र रेखाएं कभी एक-दूसरे को नहीं काटतीं—यदि काटतीं तो प्रतिच्छेदन बिंदु पर दिक्सूची को एक साथ दो दिशाओं में रुकना पड़ता जो असंभव है! 2. परिनालिका के भीतर समानांतर रेखाएं एकसमान चुंबकीय क्षेत्र दर्शाती हैं।',
      },
      checkRule: {
        en: 'Never let two field lines cross, and remember: outside a magnet N → S, inside a magnet/solenoid S → N (closed loops)!',
        hi: 'क्षेत्र रेखाएं बंद वक्र होती हैं: चुंबक के बाहर उत्तर से दक्षिण (N → S) तथा भीतर दक्षिण से उत्तर (S → N)!',
      },
    },
    hotsReasoningTask: {
      title: {
        en: 'HOTS Electromagnet Design: Soft Iron Core vs Permanent Steel Core in a Solenoid',
        hi: 'उच्च स्तरीय अभिकल्पन: विद्युत चुंबक के क्रोड हेतु नर्म लोहा बनाम इस्पात (Steel)',
      },
      prompt: {
        en: 'A student winds an insulated copper solenoid around a soft iron rod in Setup A and around a hardened carbon-steel rod in Setup B, passing 5 A of current through both. Explain what happens in each setup during current flow AND after the switch is turned OFF, and state three ways to increase an electromagnet’s strength.',
        hi: 'एक छात्र व्यवस्था A में नर्म लोहे की छड़ पर तथा व्यवस्था B में कठोर इस्पात (Steel) की छड़ पर परिनालिका लपेटकर 5 A की धारा प्रवाहित करता है। धारा बहते समय तथा स्विच बंद (OFF) करने के बाद दोनों में क्या अंतर होगा? विद्युत चुंबक की प्रबलता बढ़ाने के तीन उपाय भी लिखिए।',
      },
      claimOptions: [
        {
          en: 'Soft iron (Setup A) produces a much stronger temporary electromagnet that demagnetises immediately when current is switched OFF; steel (Setup B) retains magnetism permanently and cannot be switched off. Strength increases by increasing turns N, increasing current I, or using a soft-iron core.',
          hi: 'नर्म लोहा (A) प्रबल अस्थायी विद्युत चुंबक बनाता है जो धारा बंद करते ही विचुंबकित हो जाता है; इस्पात (B) स्थायी चुंबक बन जाता है। प्रबलता बढ़ाने के उपाय: फेरों की संख्या N बढ़ाना, धारा I बढ़ाना, तथा नर्म लोहे का क्रोड लगाना।',
        },
        {
          en: 'Both soft iron and steel lose all magnetism immediately when current stops.',
          hi: 'धारा बंद करने पर नर्म लोहा और इस्पात दोनों तुरंत अपना संपूर्ण चुंबकत्व खो देते हैं।',
        },
        {
          en: 'Decreasing the number of turns N and reducing current I increases the magnetic field of the solenoid.',
          hi: 'फेरों की संख्या N और धारा I घटाने से परिनालिका का चुंबकीय क्षेत्र बढ़ता है।',
        },
      ],
      correctClaimIndex: 0,
      claimExplanation: {
        en: 'Soft iron has high magnetic permeability and low retentivity, making it ideal for controllable electromagnets (cranes, electric bells) that turn off when current stops. Steel has high retentivity/coercivity and becomes a permanent magnet.',
        hi: 'नर्म लोहा धारा प्रवाहित होने पर प्रबल चुंबकत्व देता है और धारा बंद होते ही चुंबकत्व खो देता है, इसलिए क्रेन व विद्युत घंटी के विद्युत चुंबक में प्रयुक्त होता है। इस्पात चुंबकत्व को स्थायी रूप से बनाए रखता है।',
      },
      rubricPoints: [
        {
          en: 'Distinguishes soft iron vs steel: soft iron loses magnetism when current is switched off (temporary electromagnet), whereas steel retains magnetism (permanent magnet).',
          hi: 'नर्म लोहा और इस्पात में अंतर स्पष्ट करता है: धारा बंद करने पर नर्म लोहा विचुंबकित हो जाता है जबकि इस्पात स्थायी चुंबक बन जाता है।',
        },
        {
          en: 'Identifies factors increasing solenoid field strength: (1) increasing number of turns per unit length (N), and (2) increasing current (I).',
          hi: 'प्रबलता बढ़ाने के कारक लिखता है: (1) प्रति एकांक लंबाई में फेरों की संख्या N बढ़ाना, (2) विद्युत धारा I का मान बढ़ाना।',
        },
        {
          en: 'Notes that inserting a soft-iron core inside the solenoid concentrates magnetic flux and reverses polarity when current direction is reversed.',
          hi: 'बताता है कि नर्म लोहे का क्रोड रखने से क्षेत्र अत्यंत प्रबल हो जाता है तथा धारा की दिशा पलटने पर ध्रुवता (N/S) पलट जाती है।',
        },
      ],
    },
  },

  'motor-force-flemings-rule': {
    ncertSection: 'NCERT Class 10 Chapter 12: Magnetic Effects of Electric Current (Sec 12.3 — Force on a Current-Carrying Conductor in a Magnetic Field)',
    openingQuestion: {
      en: '“Why does a current-carrying wire jump violently when placed across a magnetic field, yet feel zero magnetic force when aligned parallel to the exact same magnet?”',
      hi: '“चुंबकीय क्षेत्र के लंबवत रखा धारावाही तार अचानक झटका खाता है, किंतु उसी चुंबक के समानांतर रखने पर उस पर शून्य चुंबकीय बल क्यों लगता है?”',
    },
    experimentProtocol: {
      goal: {
        en: 'Control magnetic field B, conductor current I, angle θ, and polarities independently to verify F = B·I·L·sin(θ) and test single vs double polarity reversals under Fleming’s Left-Hand Rule.',
        hi: 'चुंबकीय क्षेत्र B, धारा I, कोण θ और ध्रुवता को नियंत्रित करते हुए F = B·I·L·sin(θ) का सत्यापन करें तथा फ्लेमिंग के वाम-हस्त नियम के अंतर्गत एकल बनाम दोहरे व्युत्क्रमण का परीक्षण करें।',
      },
      steps: [
        {
          en: 'Set Magnetic Field B = 0.5 T, Current I = 4 A, and Angle θ = 90° (Perpendicular). Observe that Rod AB experiences maximum upward force F = 0.5 × 4 × 0.2 × sin(90°) = 0.40 N Upward (+Z).',
          hi: 'B = 0.5 T, I = 4 A और कोण θ = 90° (लंबवत) रखें। देखें कि छड़ AB पर अधिकतम बल F = 0.40 N ऊपर की ओर (+Z) लगता है।',
        },
        {
          en: 'Click “Reverse Current I” ONCE. Notice the force immediately flips to Downward (−Z). Now click “Reverse Magnetic Field B” so BOTH are reversed—notice the force returns to Upward (+Z)!',
          hi: '“धारा दिशा पलटें” पर एक बार क्लिक करें—बल नीचे की ओर (−Z) हो जाता है। अब “चुंबक ध्रुव पलटें” पर भी क्लिक करें (दोनों उलट गए)—देखें कि बल पुनः ऊपर की ओर (+Z) आ जाता है!',
        },
        {
          en: 'Click “θ = 0° (Parallel · Zero Force)” or slide Angle θ to 0°. Even with strong B and I flowing, sin(0°) = 0 so the magnetic force drops to 0 N!',
          hi: 'अब कोण θ को 0° (समानांतर) पर सेट करें। प्रबल B और I होने के बावजूद sin(0°) = 0 होने के कारण चुंबकीय बल शून्य (0 N) हो जाता है!',
        },
      ],
      observationCheck: {
        prompt: {
          en: 'On the Fleming’s Left-Hand Rule apparatus, starting from an upward force (+Z), what happens if you reverse BOTH the electric current direction I AND swap the North–South magnet poles B at the same time?',
          hi: 'फ्लेमिंग के वाम-हस्त नियम उपकरण में, यदि प्रारंभ में बल ऊपर की ओर (+Z) है और आप विद्युत धारा I की दिशा तथा चुंबक के N–S ध्रुव दोनों एक साथ पलट दें, तो बल की दिशा क्या होगी?',
        },
        options: [
          {
            en: 'The force continues to act UPWARD (+Z) because reversing both I (−1) and B (−1) cancels out ((−1) × (−1) = +1).',
            hi: 'बल ऊपर की ओर (+Z) ही बना रहता है क्योंकि धारा (−1) और क्षेत्र (−1) दोनों को एक साथ पलटने पर प्रभाव निरस्त हो जाता है ((−1) × (−1) = +1)।',
          },
          {
            en: 'The force reverses to DOWNWARD (−Z).',
            hi: 'बल पलटकर नीचे की ओर (−Z) हो जाता है।',
          },
          {
            en: 'The force becomes zero.',
            hi: 'बल शून्य हो जाता है।',
          },
        ],
        correctIndex: 0,
        explanation: {
          en: 'Magnetic force depends on the cross product of current I and magnetic field B. Reversing either one alone flips the force sign, so reversing both simultaneously flips the sign twice, restoring the original upward (+Z) direction!',
          hi: 'धारा अथवा चुंबकीय क्षेत्र में से किसी एक को पलटने पर बल की दिशा उलटती है। अतः दोनों को एक साथ पलटने पर दिशा दो बार उलटकर पुनः मूल दिशा (ऊपर की ओर +Z) में आ जाती है!',
        },
      },
    },
    discoveryNotes: {
      physicalMeaning: {
        en: 'When a current-carrying conductor sits inside an external magnetic field, the conductor’s own magnetic field interacts with the external magnet’s field—crowding field lines on one side and thinning them on the other—producing a sideways mechanical push (the motor principle!).',
        hi: 'जब किसी धारावाही चालक को बाह्य चुंबकीय क्षेत्र में रखा जाता है, तो चालक का चुंबकीय क्षेत्र और बाह्य चुंबक का क्षेत्र परस्पर क्रिया करते हैं, जिससे चालक पर लंबवत यांत्रिक बल लगता है (विद्युत मोटर का मूल सिद्धांत!)।',
      },
      scalingRule: {
        en: 'F = B · I · L · sin(θ): Force is directly proportional to field B, current I, active length L, and sin(θ). It is maximum at θ = 90° (perpendicular) and zero at θ = 0° or 180° (parallel/antiparallel).',
        hi: 'F = B · I · L · sin(θ): बल B, I, L और sin(θ) के समानुपाती होता है। θ = 90° (लंबवत) पर अधिकतम तथा θ = 0° या 180° (समानांतर) पर शून्य होता है।',
      },
      siUnitRule: {
        en: '1 Tesla = 1 N / (A · m). Thus B (in Tesla) × I (in Amperes) × L (in metres) yields Force directly in Newtons (N).',
        hi: '1 टेस्ला (T) = 1 न्यूटन / (एम्पीयर × मीटर)। अतः B (T) × I (A) × L (m) से बल सीधे न्यूटन (N) में प्राप्त होता है।',
      },
    },
    workedNumerical: {
      title: {
        en: 'NCERT Class 10 Ch 12 · Force on a Conductor Rod in a Horseshoe Magnet',
        hi: 'NCERT कक्षा 10 अध्याय 12 · चुंबकीय क्षेत्र में रखी छड़ पर बल की गणना',
      },
      problem: {
        en: 'A straight aluminium rod of length 0.20 m carrying a current of 5.0 A is placed perpendicular (θ = 90°) to a uniform magnetic field of flux density 0.40 T. Calculate the magnitude of the magnetic force acting on the rod, and state what the force becomes if the rod is rotated parallel to the field.',
        hi: '0.20 m लंबाई की एक सीधी एल्युमिनियम छड़ जिसमें 5.0 A की विद्युत धारा प्रवाहित हो रही है, 0.40 T के एकसमान चुंबकीय क्षेत्र के लंबवत (θ = 90°) रखी है। छड़ पर लगने वाले चुंबकीय बल का परिमाण ज्ञात कीजिए, तथा बताइए कि छड़ को क्षेत्र के समानांतर कर देने पर बल कितना होगा।',
      },
      given: [
        { en: 'Magnetic field B = 0.40 T, Current I = 5.0 A', hi: 'चुंबकीय क्षेत्र B = 0.40 T, विद्युत धारा I = 5.0 A' },
        { en: 'Length L = 0.20 m, Angle θ = 90° (sin 90° = 1)', hi: 'लंबाई L = 0.20 m, कोण θ = 90° (sin 90° = 1)' },
      ],
      formula: 'F = B × I × L × sin(θ)',
      substitution: 'At 90°: F = 0.40 × 5.0 × 0.20 × 1 = 0.40 N  |  At 0° (parallel): F = 0.40 × 5.0 × 0.20 × sin(0°) = 0 N',
      answer: {
        en: 'Perpendicular Force F = 0.40 N; Parallel Force F = 0 N.',
        hi: 'लंबवत स्थिति में बल F = 0.40 N; समानांतर स्थिति में बल F = 0 N।',
      },
      unitTrapNote: {
        en: 'If conductor length L is given in centimetres (e.g. 20 cm), divide by 100 to convert to metres (0.20 m) before multiplying B × I × L!',
        hi: 'यदि चालक की लंबाई L सेंटीमीटर में दी हो (जैसे 20 cm), तो सूत्र में रखने से पहले 100 से भाग देकर मीटर (0.20 m) में बदलें!',
      },
    },
    contrastTrap: {
      trapTitle: {
        en: 'Pointing Your Left Middle Finger in the Direction of Electron Motion Instead of Conventional Current (+ Charge Flow)',
        hi: 'फ्लेमिंग के वाम-हस्त नियम में मध्यमा को विद्युत धारा के बजाय इलेक्ट्रॉन की गति की दिशा में रख देना',
      },
      commonMistake: {
        en: 'When a board question says “an electron beam moves towards the East”, pointing the left middle finger East and getting the exact opposite force direction.',
        hi: 'जब प्रश्न में दिया हो कि “इलेक्ट्रॉन पुंज पूर्व की ओर गतिमान है”, तो बाएँ हाथ की मध्यमा को पूर्व की ओर रखकर बल की विपरीत (गलत) दिशा निकाल लेना।',
      },
      correctPhysics: {
        en: 'In Fleming’s Left-Hand Rule, the Middle Finger represents CONVENTIONAL CURRENT I—which is the direction of positive charge flow (alpha particles/protons) and is strictly OPPOSITE to the motion of negative electrons! If electrons move East, point your middle finger WEST.',
        hi: 'फ्लेमिंग के वाम-हस्त नियम में मध्यमा सदैव परंपरागत विद्युत धारा I (धनावेश/प्रोटॉन/अल्फा कणों की गति की दिशा) को दर्शाती है, जो ऋणावेशित इलेक्ट्रॉन की गति के ठीक विपरीत होती है! यदि इलेक्ट्रॉन पूर्व में जा रहे हैं, तो मध्यमा पश्चिम में रखें।',
      },
      checkRule: {
        en: 'Proton / Alpha particle (+): Current I = SAME direction. Electron / Beta particle (−): Current I = OPPOSITE direction!',
        hi: 'प्रोटॉन / अल्फा कण (+): धारा I = समान दिशा। इलेक्ट्रॉन (−): धारा I = विपरीत दिशा!',
      },
    },
    hotsReasoningTask: {
      title: {
        en: 'HOTS Charged-Particle Deflection: Alpha Particle (+2e), Electron (−e), and Neutron (0) Entering a Magnetic Field',
        hi: 'उच्च स्तरीय विश्लेषण: चुंबकीय क्षेत्र में अल्फा कण, इलेक्ट्रॉन तथा न्यूट्रॉन का विक्षेपण',
      },
      prompt: {
        en: 'A uniform magnetic field points vertically INTO the page. Three particles—an alpha particle (positively charged), an electron (negatively charged), and a neutron (uncharged)—are projected horizontally from Left to Right (+X) into the field. Using Fleming’s Left-Hand Rule, predict the initial direction of magnetic force on each of the three particles.',
        hi: 'एकसमान चुंबकीय क्षेत्र कागज के तल के लंबवत भीतर की ओर है। तीन कण—एक अल्फा कण (धनावेशित), एक इलेक्ट्रॉन (ऋणावेशित) तथा एक न्यूट्रॉन (उदासीन)—बाईं से दाईं ओर (+X) इस क्षेत्र में प्रवेश करते हैं। फ्लेमिंग के वाम-हस्त नियम से तीनों कणों पर लगने वाले प्रारंभिक बल की दिशा बताइए।',
      },
      claimOptions: [
        {
          en: 'Alpha particle (+): current is Left → Right, so force is UPWARD (towards top of page); Electron (−): conventional current is Right → Left, so force is DOWNWARD; Neutron (q = 0): zero current, so ZERO magnetic force (moves straight undeviated).',
          hi: 'अल्फा कण (+): धारा बाईं से दाईं ओर है, अतः बल कागज के तल में ऊपर की ओर; इलेक्ट्रॉन (−): धारा विपरीत (दाईं से बाईं ओर) है, अतः बल नीचे की ओर; न्यूट्रॉन (आवेशहीन): शून्य धारा, अतः कोई बल नहीं (सीधा निकल जाएगा)।',
        },
        {
          en: 'All three particles are deflected upward towards the top of the page.',
          hi: 'तीनों कण ऊपर की ओर विक्षेपित होते हैं।',
        },
        {
          en: 'Alpha particle and electron are both deflected downward, while neutron stops.',
          hi: 'अल्फा कण और इलेक्ट्रॉन दोनों नीचे की ओर मुड़ते हैं और न्यूट्रॉन रुक जाता है।',
        },
      ],
      correctClaimIndex: 0,
      claimExplanation: {
        en: 'Point left forefinger INTO the page (Field B). For the positive alpha particle moving right, middle finger (Current I) points Right ⇒ Thumb points UPWARD. For the negative electron moving right, conventional current points Left ⇒ force is DOWNWARD. The neutral neutron carries no charge (I = 0), experiencing zero magnetic force.',
        hi: 'बाएँ हाथ की तर्जनी (क्षेत्र B) कागज के भीतर रखें। धनावेशित अल्फा कण के लिए मध्यमा (धारा I) दाईं ओर रखने पर अंगूठा ऊपर की ओर इंगित करता है। ऋणावेशित इलेक्ट्रॉन के लिए धारा विपरीत होने से बल नीचे की ओर लगता है। उदासीन न्यूट्रॉन (q = 0) पर कोई चुंबकीय बल नहीं लगता।',
      },
      rubricPoints: [
        {
          en: 'Determines upward force on the positive alpha particle using Fleming’s Left-Hand Rule (Field into page, Current I to the right).',
          hi: 'फ्लेमिंग के वाम-हस्त नियम से धनावेशित अल्फा कण पर ऊपर की ओर बल निर्धारित करता है।',
        },
        {
          en: 'Determines opposite (downward) force on the negative electron because conventional current I is opposite to electron motion.',
          hi: 'ऋणावेशित इलेक्ट्रॉन के लिए धारा की दिशा विपरीत लेकर नीचे की ओर बल निर्धारित करता है।',
        },
        {
          en: 'Concludes that the uncharged neutron constitutes zero electric current and passes through undeviated (F = 0).',
          hi: 'स्पष्ट करता है कि आवेशहीन न्यूट्रॉन से कोई धारा नहीं बनती, अतः उस पर शून्य बल (F = 0) लगता है।',
        },
      ],
    },
  },

  'chemical-equation-mass-balance': {
    ncertSection: 'NCERT Class 10 Chapter 1: Chemical Reactions and Equations (Sec 1.1.2 — Balanced Chemical Equations)',
    openingQuestion: {
      en: '“Why must every chemical equation be balanced, and why is changing a subscript inside a formula (like turning H₂O into H₂O₂) strictly forbidden?”',
      hi: '“प्रत्येक रासायनिक समीकरण को संतुलित करना क्यों आवश्यक है, और किसी सूत्र के पादांक को बदलना (जैसे H₂O को H₂O₂ लिखना) पूर्णतः वर्जित क्यों है?”',
    },
    experimentProtocol: {
      goal: {
        en: 'Use the analytical mass balance and atom-count ledger to balance the steam-iron reaction (c₁Fe + c₂H₂O → c₃Fe₃O₄ + c₄H₂) and verify that total reactant mass equals total product mass.',
        hi: 'द्रव्यमान तुला और परमाणु लेजर की सहायता से भाप-लोहा अभिक्रिया (c₁Fe + c₂H₂O → c₃Fe₃O₄ + c₄H₂) को संतुलित करें और सत्यापित करें कि अभिकारकों का कुल द्रव्यमान उत्पादों के कुल द्रव्यमान के बराबर होता है।',
      },
      steps: [
        {
          en: 'Click “✗ Load Unbalanced Skeleton (1 : 1 : 1 : 1)”. Notice the scale tips heavily to the right: LHS has 1 Fe, 2 H, 1 O (74 g) while RHS has 3 Fe, 2 H, 4 O (234 g)!',
          hi: '“✗ असंतुलित कंकाली समीकरण (1 : 1 : 1 : 1)” बटन दबाएं। देखें कि तुला दाईं ओर झुक जाती है: LHS पर 74 g तथा RHS पर 234 g है!',
        },
        {
          en: 'First balance Oxygen (4 O in Fe₃O₄) by sliding H₂O Coefficient (c₂) to 4. Now LHS has 8 H atoms, so slide H₂ Coefficient (c₄) to 4.',
          hi: 'सबसे पहले ऑक्सीजन (Fe₃O₄ में 4 O) को संतुलित करने के लिए H₂O गुणांक (c₂) को 4 करें। अब LHS पर 8 H हो गए, अतः H₂ गुणांक (c₄) को भी 4 करें।',
        },
        {
          en: 'Finally, balance Iron (3 Fe in Fe₃O₄) by sliding Fe Coefficient (c₁) to 3. Watch the beam level horizontally at 240 g LHS = 240 g RHS!',
          hi: 'अंत में आयरन (Fe₃O₄ में 3 Fe) को संतुलित करने के लिए Fe गुणांक (c₁) को 3 करें। देखें कि तुला 240 g LHS = 240 g RHS पर पूर्णतः क्षैतिज हो जाती है!',
        },
      ],
      observationCheck: {
        prompt: {
          en: 'On the mass-balance bench, when the steam-iron reaction is balanced at 3Fe + 4H₂O → Fe₃O₄ + 4H₂, what is the total molar mass on the Reactant pan (LHS) and Product pan (RHS)? (Fe = 56 u, H = 1 u, O = 16 u)',
          hi: 'जब समीकरण 3Fe + 4H₂O → Fe₃O₄ + 4H₂ पर संतुलित होता है, तो अभिकारक पलड़े (LHS) और उत्पाद पलड़े (RHS) पर कुल द्रव्यमान कितना होता है?',
        },
        options: [
          {
            en: '240 g on LHS (3×56 + 4×18) and 240 g on RHS (232 + 4×2) — exact mass conservation!',
            hi: 'LHS पर 240 g (3×56 + 4×18) तथा RHS पर 240 g (232 + 4×2) — पूर्ण द्रव्यमान संरक्षण!',
          },
          {
            en: '74 g on LHS and 234 g on RHS.',
            hi: 'LHS पर 74 g तथा RHS पर 234 g।',
          },
          {
            en: '100 g on both sides.',
            hi: 'दोनों ओर 100 g।',
          },
        ],
        correctIndex: 0,
        explanation: {
          en: '3 mol Fe (168 g) + 4 mol H₂O (72 g) = 240 g on LHS. 1 mol Fe₃O₄ (232 g) + 4 mol H₂ (8 g) = 240 g on RHS.',
          hi: '3 मोल Fe (168 g) + 4 मोल H₂O (72 g) = 240 g (LHS)। 1 मोल Fe₃O₄ (232 g) + 4 मोल H₂ (8 g) = 240 g (RHS)।',
        },
      },
    },
    discoveryNotes: {
      physicalMeaning: {
        en: 'A chemical reaction breaks existing chemical bonds and forms new ones, rearranging atoms without ever creating or destroying a single atom (Dalton’s Atomic Theory + Lavoisier’s Law of Conservation of Mass).',
        hi: 'रासायनिक अभिक्रिया में पुराने आबंध टूटते हैं और नए आबंध बनते हैं, परंतु एक भी परमाणु न तो उत्पन्न होता है और न ही नष्ट होता है।',
      },
      scalingRule: {
        en: 'Draw an imaginary box around every chemical formula first! You may multiply a whole box by a front coefficient c, which multiplies every atom inside that box by c, until ∑ Atoms_LHS = ∑ Atoms_RHS.',
        hi: 'सबसे पहले प्रत्येक रासायनिक सूत्र के चारों ओर एक बॉक्स बनाएं! बॉक्स के भीतर पादांक कभी न बदलें; केवल बॉक्स के बाहर गुणांक लगाकर दोनों पक्षों के परमाणु बराबर करें।',
      },
      siUnitRule: {
        en: 'Physical state symbols in balanced equations: (s) = solid, (l) = liquid, (g) = gas/steam, and (aq) = aqueous solution dissolved in water.',
        hi: 'भौतिक अवस्था संकेत: (s) = ठोस, (l) = द्रव, (g) = गैस/भाप, तथा (aq) = जल में घुला जलीय विलयन।',
      },
    },
    workedNumerical: {
      title: {
        en: 'NCERT Class 10 Ch 1 · Mass Conservation in Magnesium Ribbon Combustion',
        hi: 'NCERT कक्षा 10 अध्याय 1 · मैग्नीशियम रिबन के दहन में द्रव्यमान संरक्षण',
      },
      problem: {
        en: 'Write the balanced chemical equation for the burning of magnesium ribbon in oxygen to form magnesium oxide. Using atomic masses Mg = 24 u and O = 16 u, verify that total reactant mass equals total product mass, and calculate what mass of MgO is produced when 48 g of Mg burns completely.',
        hi: 'ऑक्सीजन में मैग्नीशियम रिबन के दहन से मैग्नीशियम ऑक्साइड बनने का संतुलित समीकरण लिखिए। परमाणु द्रव्यमान Mg = 24 u तथा O = 16 u लेकर द्रव्यमान संरक्षण सत्यापित कीजिए और 48 g Mg के पूर्ण दहन से बनने वाले MgO का द्रव्यमान ज्ञात कीजिए।',
      },
      given: [
        { en: 'Skeletal reaction: Mg(s) + O₂(g) → MgO(s)', hi: 'कंकाली समीकरण: Mg(s) + O₂(g) → MgO(s)' },
        { en: 'Atomic masses: Mg = 24 u, O = 16 u (Molar mass of MgO = 40 g/mol)', hi: 'परमाणु द्रव्यमान: Mg = 24 u, O = 16 u (MgO = 40 g/mol)' },
      ],
      formula: '2Mg(s) + O₂(g) → 2MgO(s)',
      substitution: 'LHS Mass = 2(24) + 2(16) = 48 g + 32 g = 80 g  |  RHS Mass = 2(24 + 16) = 2 × 40 g = 80 g',
      answer: {
        en: '48 g of Mg reacts with 32 g of O₂ to produce 80 g of white MgO powder (80 g LHS = 80 g RHS).',
        hi: '48 g Mg, 32 g O₂ से अभिक्रिया कर 80 g श्वेत MgO चूर्ण बनाता है (80 g LHS = 80 g RHS)।',
      },
      unitTrapNote: {
        en: 'Oxygen gas is diatomic (O₂ = 32 g/mol), never monoatomic O! And Magnesium Oxide is MgO (Mg²⁺ and O²⁻), never MgO₂!',
        hi: 'ऑक्सीजन गैस द्विपरमाणुक (O₂ = 32 g/mol) होती है, और संयोजकता 2 होने से मैग्नीशियम ऑक्साइड का सूत्र MgO होता है, MgO₂ नहीं!',
      },
    },
    contrastTrap: {
      trapTitle: {
        en: 'Altering Chemical Subscripts (Writing MgO₂ or H₂O₂) Instead of Placing Stoichiometric Coefficients in Front',
        hi: 'गुणांक लगाने के स्थान पर रासायनिक सूत्र का पादांक बदल देना (जैसे MgO को MgO₂ लिख देना)',
      },
      commonMistake: {
        en: 'Balancing Mg + O₂ → MgO by changing the product formula to “MgO₂”, or balancing H₂ + O₂ → H₂O by changing water to “H₂O₂”.',
        hi: 'Mg + O₂ → MgO को संतुलित करने के लिए उत्पाद को “MgO₂” लिख देना, या जल H₂O को “H₂O₂” बना देना।',
      },
      correctPhysics: {
        en: 'Subscripts are fixed by ionic valency/covalent bonding: changing H₂O to H₂O₂ changes water into toxic hydrogen peroxide! You must NEVER alter subscripts—place a coefficient in front of the entire formula instead (2H₂ + O₂ → 2H₂O; 2Mg + O₂ → 2MgO).',
        hi: 'सूत्र के पादांक संयोजकता द्वारा निश्चित होते हैं: H₂O को H₂O₂ करने से जल बदलकर हाइड्रोजन पेरॉक्साइड बन जाता है! इसलिए पादांक कभी न बदलें—पूरे सूत्र के आगे गुणांक लगाएं (2Mg + O₂ → 2MgO)।',
      },
      checkRule: {
        en: 'Put every formula in a box [MgO] first—nothing inside the box is allowed to change!',
        hi: 'प्रत्येक सूत्र को पहले एक बॉक्स [MgO] में बंद करें—बॉक्स के अंदर कुछ भी बदलना मना है!',
      },
    },
    hotsReasoningTask: {
      title: {
        en: 'HOTS Endothermic vs Exothermic & Stoichiometry: Respiration and Quicklime Slaking',
        hi: 'उच्च स्तरीय विश्लेषण: श्वसन एवं बिना बुझे चूने की जल से अभिक्रिया',
      },
      prompt: {
        en: 'Explain why cellular respiration (C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + Energy) is classified as an exothermic reaction, verify the atom counts on both sides of the balanced respiration equation, and explain why magnesium ribbon must be cleaned with sandpaper before burning in air.',
        hi: 'स्पष्ट कीजिए कि श्वसन (C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ऊर्जा) को ऊष्माक्षेपी अभिक्रिया क्यों कहा जाता है, दोनों पक्षों के परमाणुओं की संख्या सत्यापित कीजिए, तथा बताइए कि वायु में जलाने से पहले मैग्नीशियम रिबन को रेगमाल से साफ क्यों किया जाता है।',
      },
      claimOptions: [
        {
          en: 'Respiration breaks down glucose with oxygen to release energy (ATP/heat), with 6 C, 12 H, and 18 O conserved on both sides; magnesium ribbon is sanded to remove the protective basic magnesium oxide/carbonate layer that hinders combustion.',
          hi: 'श्वसन में ग्लूकोज के ऑक्सीकरण से ऊर्जा मुक्त होती है तथा दोनों पक्षों में 6 C, 12 H व 18 O संरक्षित रहते हैं; मैग्नीशियम रिबन पर जमी मैग्नीशियम ऑक्साइड की बाधक परत हटाने के लिए उसे रेगमाल से साफ किया जाता है।',
        },
        {
          en: 'Respiration absorbs heat (endothermic) and destroys oxygen atoms.',
          hi: 'श्वसन ऊष्माशोषी अभिक्रिया है और इसमें ऑक्सीजन परमाणु नष्ट हो जाते हैं।',
        },
        {
          en: 'Magnesium ribbon is sanded to make it heavier before burning.',
          hi: 'मैग्नीशियम रिबन को भारी बनाने के लिए रेगमाल से रगड़ा जाता है।',
        },
      ],
      correctClaimIndex: 0,
      claimExplanation: {
        en: 'In C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O, LHS has 6 C, 12 H, and 6 + 12 = 18 O; RHS has 6 C, 12 H, and 12 + 6 = 18 O. Energy is released during glucose oxidation (exothermic). Sanding Mg ribbon strips away the unreactive MgO coating formed by moist air.',
        hi: 'C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O में दोनों ओर 6 C, 12 H तथा 18 O परमाणु बराबर हैं। ऊर्जा मुक्त होने के कारण यह ऊष्माक्षेपी है। मैग्नीशियम पर वायु की नमी से बनी MgO की परत हटाने हेतु रेगमाल से साफ किया जाता है।',
      },
      rubricPoints: [
        {
          en: 'Defines exothermic reaction and explains that respiration oxidises glucose to release energy needed for life.',
          hi: 'ऊष्माक्षेपी अभिक्रिया को परिभाषित करता है और बताता है कि श्वसन में ग्लूकोज के ऑक्सीकरण से ऊर्जा मुक्त होती है।',
        },
        {
          en: 'Verifies atom conservation in C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O (6 C, 12 H, 18 O on both LHS and RHS).',
          hi: 'समीकरण के दोनों पक्षों में परमाणुओं की समान संख्या (6 C, 12 H, 18 O) सत्यापित करता है।',
        },
        {
          en: 'Explains that sandpaper removes the protective magnesium oxide layer from the Mg ribbon so it can react freely with oxygen.',
          hi: 'बताता है कि रेगमाल मैग्नीशियम रिबन की सतह से मैग्नीशियम ऑक्साइड की सुरक्षात्मक परत हटाता है ताकि दहन आसानी से हो सके।',
        },
      ],
    },
  },

  'ph-scale-exponential-acid': {
    ncertSection: 'NCERT Class 10 Chapter 2: Acids, Bases and Salts (Sec 2.3 — How Strong are Acid or Base Solutions? & Importance of pH in Everyday Life)',
    openingQuestion: {
      en: '“Why does dropping just 2 units on the pH scale—from pH 6 down to pH 4—multiply the acid’s hydrogen-ion punch by 100 times instead of just 2 times?”',
      hi: '“pH स्केल पर मान केवल 2 इकाई कम होने (pH 6 से pH 4 आने) पर अम्ल की हाइड्रोजन आयन सांद्रता 2 गुना के बजाय 100 गुना क्यों बढ़ जाती है?”',
    },
    experimentProtocol: {
      goal: {
        en: 'Explore the inverse ten-fold relationship [H⁺] = 10⁻ᵖᴴ mol/L across pH 0 to 14 on the Universal Indicator bench and test biological thresholds for tooth decay (pH < 5.5) and antacid neutralization.',
        hi: 'सार्वत्रिक सूचक बेंच पर pH 0 से 14 के बीच [H⁺] = 10⁻ᵖᴴ mol/L के 10-गुना व्युत्क्रम नियम का परीक्षण करें तथा दंत-क्षय (pH < 5.5) और ऐंटासिड उदासीनीकरण की सीमा जाँचें।',
      },
      steps: [
        {
          en: 'Set Comparison Reference pH = 5 and Sample Solution pH = 4 (1 unit lower). Observe in the ledger that [H⁺] increases 10× (from 10⁻⁵ M to 10⁻⁴ M).',
          hi: 'तुलनात्मक विलयन B का pH = 5 और विलयन A का pH = 4 (1 इकाई कम) रखें। देखें कि [H⁺] सांद्रता 10 गुना (10⁻⁵ M से 10⁻⁴ M) बढ़ जाती है।',
        },
        {
          en: 'Now slide Sample Solution pH down to 2 (3 units below pH 5). Observe that [H⁺] jumps to 1,000× (10³×) relative to pH 5!',
          hi: 'अब विलयन A का pH घटाकर 2 (pH 5 से 3 इकाई कम) करें। देखें कि [H⁺] सांद्रता 1,000 गुना (10³×) हो जाती है!',
        },
        {
          en: 'Click “Tooth Decay Limit (pH 5.4)” vs “Pure Water (pH 7.0)” vs “Milk of Magnesia (pH 10.0)”. Verify how the tooth enamel corrosion alert triggers whenever pH < 5.5.',
          hi: '“Tooth Decay Limit (pH 5.4)”, “Pure Water (pH 7.0)” तथा “Milk of Magnesia (pH 10.0)” पर क्लिक करें और देखें कि pH < 5.5 होते ही दंत इनेमल क्षय की चेतावनी सक्रिय हो जाती है।',
        },
      ],
      observationCheck: {
        prompt: {
          en: 'Solution X has pH = 3 and Solution Y has pH = 6. Which solution is more acidic, and how many times greater is its [H⁺] ion concentration?',
          hi: 'विलयन X का pH = 3 है तथा विलयन Y का pH = 6 है। कौन-सा विलयन अधिक अम्लीय है, और उसकी [H⁺] आयन सांद्रता कितने गुना अधिक है?',
        },
        options: [
          {
            en: 'Solution X (pH 3) is more acidic, and its [H⁺] concentration (10⁻³ M) is 1,000 times (10³×) greater than Solution Y (10⁻⁶ M).',
            hi: 'विलयन X (pH 3) अधिक अम्लीय है, और इसकी [H⁺] सांद्रता (10⁻³ M) विलयन Y (10⁻⁶ M) से 1,000 गुना (10³×) अधिक है।',
          },
          {
            en: 'Solution X is 2 times more acidic than Solution Y.',
            hi: 'विलयन X, विलयन Y से 2 गुना अधिक अम्लीय है।',
          },
          {
            en: 'Solution Y (pH 6) is more acidic because 6 > 3.',
            hi: 'विलयन Y (pH 6) अधिक अम्लीय है क्योंकि 6 > 3 है।',
          },
        ],
        correctIndex: 0,
        explanation: {
          en: '[H⁺]_X / [H⁺]_Y = 10⁻³ / 10⁻⁶ = 10^(6 − 3) = 10³ = 1,000 times.',
          hi: '[H⁺]_X / [H⁺]_Y = 10⁻³ / 10⁻⁶ = 10³ = 1,000 गुना।',
        },
      },
    },
    discoveryNotes: {
      physicalMeaning: {
        en: 'The “p” in pH stands for “potenz” (power of 10 in German): pH is the negative power of 10 of the hydronium/hydrogen ion concentration in moles per litre ([H⁺] = 10⁻ᵖᴴ M). Even basic solutions contain [H⁺] ions, just fewer than [OH⁻] ions!',
        hi: 'pH में “p” जर्मन शब्द “पुसांस (potenz)” अर्थात 10 की घात को दर्शाता है ([H⁺] = 10⁻ᵖᴴ mol/L)। क्षारीय विलयनों में भी H⁺ आयन होते हैं, परंतु उनकी संख्या OH⁻ आयनों से कम होती है!',
      },
      scalingRule: {
        en: '1. Inverse Rule: As pH increases from 0 to 14, [H⁺] decreases from 10⁰ to 10⁻¹⁴ M while [OH⁻] increases from 10⁻¹⁴ to 10⁰ M.  2. Ten-Fold Rule: [H⁺]₁ / [H⁺]₂ = 10^(pH₂ − pH₁).',
        hi: '1. व्युत्क्रम नियम: pH बढ़ने पर [H⁺] घटती है और [OH⁻] बढ़ती है।  2. दस-गुना नियम: [H⁺]₁ / [H⁺]₂ = 10^(pH₂ − pH₁)।',
      },
      siUnitRule: {
        en: 'pH is a pure dimensionless number (0 to 14 at 25 °C). Ion concentrations [H⁺] and [OH⁻] are measured in mol/L (Molarity, M).',
        hi: 'pH एक विमाहीन संख्या (0 से 14) है, जबकि आयन सांद्रता [H⁺] का मात्रक मोल प्रति लीटर (mol/L या M) होता है।',
      },
    },
    workedNumerical: {
      title: {
        en: 'NCERT Class 10 Ch 2 · Dilution & pH Shift of an Acid Solution',
        hi: 'NCERT कक्षा 10 अध्याय 2 · अम्ल के तनुकरण से [H⁺] एवं pH में परिवर्तन',
      },
      problem: {
        en: 'An aqueous hydrochloric acid (HCl) solution has a hydrogen ion concentration [H⁺] = 10⁻² mol/L (pH = 2). If 10 mL of this solution is diluted with pure water to a total volume of 1,000 mL (100-fold dilution), find the new [H⁺] concentration and the new pH.',
        hi: 'हाइड्रोक्लोरिक अम्ल (HCl) के एक जलीय विलयन में [H⁺] सांद्रता 10⁻² mol/L (pH = 2) है। यदि इसके 10 mL को शुद्ध जल मिलाकर 1,000 mL तक तनुकृत (100 गुना तनुकरण) किया जाए, तो नई [H⁺] सांद्रता और नया pH मान ज्ञात कीजिए।',
      },
      given: [
        { en: 'Initial [H⁺]₁ = 10⁻² mol/L (pH₁ = 2)', hi: 'प्रारंभिक [H⁺]₁ = 10⁻² mol/L (pH₁ = 2)' },
        { en: 'Dilution factor: V₂ / V₁ = 1000 mL / 10 mL = 100 (10²)', hi: 'तनुकरण गुणक: 1000 / 10 = 100 (10²)' },
      ],
      formula: '[H⁺]₂ = [H⁺]₁ / 100  |  pH₂ = −log₁₀([H⁺]₂)',
      substitution: '[H⁺]₂ = 10⁻² / 10² = 10⁻⁴ mol/L  ⇒  pH₂ = 4',
      answer: {
        en: 'New [H⁺]₂ = 10⁻⁴ mol/L; New pH = 4 (pH shifts 2 units towards neutral 7).',
        hi: 'नई सांद्रता [H⁺]₂ = 10⁻⁴ mol/L; नया pH = 4 (उदासीन 7 की ओर 2 इकाई बढ़ता है)।',
      },
      unitTrapNote: {
        en: 'Diluting an acid with water decreases [H⁺] per unit volume, which INCREASES pH towards 7 (never above 7!).',
        hi: 'अम्ल में जल मिलाने (तनुकरण) पर प्रति इकाई आयतन [H⁺] घटती है, जिससे pH का मान बढ़कर 7 की ओर जाता है!',
      },
    },
    contrastTrap: {
      trapTitle: {
        en: 'Thinking Higher pH Means Higher [H⁺] Concentration or Treating pH as a Linear Scale',
        hi: 'अधिक pH का अर्थ अधिक [H⁺] मान लेना या pH स्केल को रैखिक समझ लेना',
      },
      commonMistake: {
        en: 'Writing that pH 6 has more H⁺ ions than pH 2 because 6 > 2, or saying that basic solutions (pH > 7) contain zero H⁺ ions.',
        hi: 'यह लिखना कि pH 6 में pH 2 से अधिक H⁺ आयन हैं, या यह कहना कि क्षारकीय विलयनों (pH > 7) में H⁺ आयन बिल्कुल नहीं होते।',
      },
      correctPhysics: {
        en: '1. Because of the minus sign in pH = −log₁₀[H⁺], a SMALLER pH means a LARGER [H⁺] concentration (10⁻² M > 10⁻⁶ M by 10,000×!). 2. Basic solutions DO contain H⁺(aq) ions—they are basic simply because [OH⁻] > [H⁺].',
        hi: '1. ऋणात्मक चिह्न के कारण कम pH का अर्थ बहुत अधिक [H⁺] सांद्रता होता है (10⁻² M, 10⁻⁶ M से 10,000 गुना बड़ा है!)। 2. क्षारकीय विलयनों में भी H⁺ आयन उपस्थित होते हैं, किंतु उनमें OH⁻ आयनों की सांद्रता H⁺ से अधिक होती है।',
      },
      checkRule: {
        en: 'Low pH = High [H⁺] (Acidic). High pH = Low [H⁺] & High [OH⁻] (Basic)!',
        hi: 'कम pH = अधिक [H⁺] (अम्लीय)। अधिक pH = कम [H⁺] एवं अधिक [OH⁻] (क्षारीय)!',
      },
    },
    hotsReasoningTask: {
      title: {
        en: 'HOTS Everyday Chemistry: Why Toothpaste is Basic and Why Curd Is Never Kept in Brass/Copper Vessels',
        hi: 'उच्च स्तरीय दैनिक रसायन: दंतमंजन क्षारीय क्यों होता है और दही को पीतल/तांबे के बर्तन में क्यों नहीं रखते?',
      },
      prompt: {
        en: 'Explain scientifically: (a) Why tooth decay starts when the pH of the mouth falls below 5.5 after meals, and how toothpaste prevents it; (b) Why sour substances like curd should not be stored in brass or copper vessels.',
        hi: 'वैज्ञानिक कारण स्पष्ट कीजिए: (a) भोजन के बाद मुँह का pH 5.5 से कम होने पर दंत-क्षय क्यों प्रारंभ होता है और दंतमंजन इसे कैसे रोकता है? (b) दही एवं खट्टे पदार्थों को पीतल या तांबे के बर्तनों में क्यों नहीं रखना चाहिए?',
      },
      claimOptions: [
        {
          en: '(a) Bacteria in the mouth degrade sugar into acids that lower pH below 5.5, corroding calcium hydroxyapatite enamel; basic toothpaste (pH > 7) neutralizes the excess acid. (b) Lactic acid in curd reacts with copper/brass to form toxic metal salts unfit for consumption.',
          hi: '(a) मुँह के जीवाणु शर्करा का निम्नीकरण कर अम्ल बनाते हैं जिससे pH < 5.5 होकर कैल्सियम हाइड्रॉक्सीऐपेटाइट इनेमल संक्षारित होता है; क्षारकीय दंतमंजन अम्ल को उदासीन करता है। (b) दही का अम्ल तांबे/पीतल से क्रिया कर विषैले लवण बनाता है।',
        },
        {
          en: 'Toothpaste is strongly acidic (pH 1) to dissolve bacteria, and curd freezes inside copper vessels.',
          hi: 'दंतमंजन प्रबल अम्लीय (pH 1) होता है और दही तांबे के बर्तन में जम जाता है।',
        },
      ],
      correctClaimIndex: 0,
      claimExplanation: {
        en: 'Tooth enamel is crystalline calcium hydroxyapatite—the hardest substance in the body—which corrodes below pH 5.5. Basic toothpaste neutralizes bacterial acids. Acids in curd react with Cu/Zn in brass to leach poisonous soluble copper/zinc salts.',
        hi: 'दंत इनेमल (कैल्सियम हाइड्रॉक्सीऐपेटाइट) pH 5.5 से नीचे संक्षारित होने लगता है। क्षारकीय दंतमंजन अतिरिक्त अम्ल को उदासीन करता है। दही का लैक्टिक अम्ल पीतल/तांबे से अभिक्रिया कर विषाक्त धात्विक लवण बनाता है।',
      },
      rubricPoints: [
        {
          en: 'Identifies tooth enamel composition (calcium hydroxyapatite) and states that mouth bacteria produce acids from food sugars, dropping pH below 5.5.',
          hi: 'दंत इनेमल (कैल्सियम हाइड्रॉक्सीऐपेटाइट) तथा शर्करा से जीवाणुओं द्वारा अम्ल बनने से pH < 5.5 होने का उल्लेख करता है।',
        },
        {
          en: 'Explains that toothpaste is basic (alkaline) in nature and neutralizes the excess acid to prevent enamel corrosion.',
          hi: 'स्पष्ट करता है कि दंतमंजन क्षारकीय प्रकृति का होता है जो अतिरिक्त अम्ल को उदासीन कर दंत-क्षय रोकता है।',
        },
        {
          en: 'Explains that acids in curd/sour food react with copper and brass (Cu + Zn) to form toxic metal salts.',
          hi: 'बताता है कि दही के अम्ल तांबे व पीतल के साथ अभिक्रिया कर हानिकारक (विषैले) लवण बनाते हैं।',
        },
      ],
    },
  },

  'metal-reactivity-displacement': {
    ncertSection: 'NCERT Class 10 Chapter 3: Metals and Non-metals (Sec 3.2.5 — How do Metals React with Solutions of other Metal Salts? & The Reactivity Series)',
    openingQuestion: {
      en: '“Why can an iron nail strip the blue copper ions right out of copper sulphate solution, whereas a gleaming copper coin sitting in iron sulphate solution can’t displace a single iron ion?”',
      hi: '“लोहे की कील नीले कॉपर सल्फेट विलयन से कॉपर आयनों को आसानी से बाहर निकाल देती है, परंतु आयरन सल्फेट में पड़ा तांबे का सिक्का एक भी आयरन आयन को विस्थापित क्यों नहीं कर पाता?”',
    },
    experimentProtocol: {
      goal: {
        en: 'Test pairwise metal-in-salt combinations across Mg, Zn, Fe, Cu, and Ag to verify the one-way single-displacement rule: Metal A displaces Metal B from solution if and only if Reactivity(A) > Reactivity(B).',
        hi: 'Mg, Zn, Fe, Cu तथा Ag के युग्मों का परीक्षण कर एकतरफा विस्थापन नियम सत्यापित करें: धातु A विलयन से धातु B को तभी विस्थापित करती है जब सक्रियता(A) > सक्रियता(B)।',
      },
      steps: [
        {
          en: 'Select Metal Strip A = Fe (Iron) and Salt Solution BC = CuSO₄ (aq). Observe that blue CuSO₄ turns pale green (FeSO₄) and a reddish-brown Cu coating deposits on the iron strip!',
          hi: 'धातु पट्टी A = Fe (लोहा) और विलयन BC = CuSO₄ (aq) चुनें। देखें कि नीला विलयन हल्का हरा (FeSO₄) हो जाता है और पट्टी पर लाल-भूरा तांबा जम जाता है!',
        },
        {
          en: 'Now reverse the pair: select Metal Strip A = Cu (Copper) and Salt Solution BC = FeSO₄ (aq). Notice the ledger reads “✗ NO REACTION” because Cu is lower than Fe in the Reactivity Series!',
          hi: 'अब युग्म उलट दें: पट्टी A = Cu (तांबा) और विलयन BC = FeSO₄ चुनें। देखें कि कोई अभिक्रिया नहीं होती क्योंकि सक्रियता श्रेणी में Cu, Fe से नीचे है!',
        },
        {
          en: 'Test Metal Strip A = Cu (Copper) in Salt Solution BC = AgNO₃ (aq). Observe that Cu DOES displace Ag (Cu > Ag), turning the colourless solution blue (Cu(NO₃)₂) and depositing shiny silver Ag crystals!',
          hi: 'अब पट्टी A = Cu (तांबा) को AgNO₃ (aq) विलयन में परखें। देखें कि Cu, Ag को विस्थापित कर देता है (Cu > Ag), जिससे विलयन नीला (Cu(NO₃)₂) हो जाता है और चाँदी जम जाती है!',
        },
      ],
      observationCheck: {
        prompt: {
          en: 'On the Reactivity Series bench, when you immerse a clean Copper (Cu) strip into colourless aqueous Silver Nitrate (AgNO₃) solution, what do you observe?',
          hi: 'जब आप साफ तांबे (Cu) की पट्टी को रंगहीन सिल्वर नाइट्रेट (AgNO₃) विलयन में डुबोते हैं, तो क्या प्रेक्षण मिलता है?',
        },
        options: [
          {
            en: 'Displacement occurs (Cu > Ag): shiny silver (Ag) deposits on the copper strip and the solution turns blue due to Cu(NO₃)₂ formation.',
            hi: 'विस्थापन होता है (Cu > Ag): तांबे की पट्टी पर चमकदार चाँदी (Ag) जम जाती है और Cu(NO₃)₂ बनने से विलयन नीला हो जाता है।',
          },
          {
            en: 'No reaction occurs because copper never reacts with any salt solution.',
            hi: 'कोई अभिक्रिया नहीं होती क्योंकि तांबा किसी लवण से क्रिया नहीं करता।',
          },
          {
            en: 'The solution turns pale green due to FeSO₄.',
            hi: 'विलयन हल्का हरा हो जाता है।',
          },
        ],
        correctIndex: 0,
        explanation: {
          en: 'Copper lies above Silver in the reactivity series (Cu > Ag): Cu(s) + 2AgNO₃(aq) → Cu(NO₃)₂(aq, Blue) + 2Ag(s)↓.',
          hi: 'सक्रियता श्रेणी में कॉपर, सिल्वर से ऊपर है (Cu > Ag): Cu(s) + 2AgNO₃(aq) → Cu(NO₃)₂(aq, नीला) + 2Ag(s)↓।',
        },
      },
    },
    discoveryNotes: {
      physicalMeaning: {
        en: 'Single displacement is an electron-transfer competition: a more reactive metal atom A has a stronger tendency to give up valence electrons (oxidise to A²⁺) than a less reactive metal ion B²⁺, forcing B²⁺ to accept those electrons and plate out as solid metal B(s).',
        hi: 'एकल विस्थापन वास्तव में इलेक्ट्रॉन त्यागने की प्रतिस्पर्धा है: अधिक अभिक्रियाशील धातु A आसानी से इलेक्ट्रॉन त्यागकर धनायन (A²⁺) बनाती है और कम अभिक्रियाशील आयन B²⁺ को इलेक्ट्रॉन ग्रहण कर ठोस धातु B(s) के रूप में निक्षेपित होने के लिए बाध्य करती है।',
      },
      scalingRule: {
        en: 'NCERT Reactivity Hierarchy (Top to Bottom): K > Na > Ca > Mg > Al > Zn > Fe > Pb > [H] > Cu > Hg > Ag > Au. Metals above [H] displace H₂ gas from dilute acids; metals below [H] (Cu, Ag, Au) do not!',
        hi: 'सक्रियता श्रेणी: K > Na > Ca > Mg > Al > Zn > Fe > Pb > [H] > Cu > Hg > Ag > Au। [H] से ऊपर स्थित धातुएं तनु अम्लों से H₂ गैस विस्थापित करती हैं, जबकि नीचे स्थित धातुएं (Cu, Ag, Au) नहीं करतीं!',
      },
      siUnitRule: {
        en: 'Key aqueous ion colours for board exams: Cu²⁺(aq) = Deep Blue; Fe²⁺(aq) = Pale Green; Zn²⁺(aq), Mg²⁺(aq), Al³⁺(aq), Ag⁺(aq) = Colourless!',
        hi: 'बोर्ड परीक्षा हेतु मुख्य जलीय आयनों के रंग: Cu²⁺(aq) = नीला; Fe²⁺(aq) = हल्का हरा; Zn²⁺, Mg²⁺, Al³⁺, Ag⁺ = रंगहीन!',
      },
    },
    workedNumerical: {
      title: {
        en: 'NCERT Class 10 Ch 3 Q7 · Ranking Four Unknown Metals A, B, C, D from Displacement Table',
        hi: 'NCERT कक्षा 10 अध्याय 3 · विस्थापन सारणी से चार अज्ञात धातुओं A, B, C, D का क्रम निर्धारण',
      },
      problem: {
        en: 'Samples of four metals A, B, C, and D were added to solutions: Metal A displaced Cu from CuSO₄ but gave no reaction with FeSO₄; Metal B displaced Fe from FeSO₄ but gave no reaction with ZnSO₄; Metal C displaced Ag from AgNO₃ only; Metal D gave no reaction with any of them. Arrange A, B, C, D in decreasing order of reactivity.',
        hi: 'चार धातुओं A, B, C तथा D को लवण विलयनों में डाला गया: धातु A ने CuSO₄ से Cu को विस्थापित किया पर FeSO₄ से क्रिया नहीं की; धातु B ने FeSO₄ से Fe को विस्थापित किया पर ZnSO₄ से क्रिया नहीं की; धातु C ने केवल AgNO₃ से Ag को विस्थापित किया; धातु D ने किसी से क्रिया नहीं की। इन्हें घटती सक्रियता के क्रम में व्यवस्थित कीजिए।',
      },
      given: [
        { en: 'B displaces Fe (so B > Fe); A displaces Cu but not Fe (so Fe > A > Cu)', hi: 'B > Fe तथा Fe > A > Cu' },
        { en: 'C displaces only Ag (so Cu > C > Ag); D displaces none (so Ag > D)', hi: 'Cu > C > Ag तथा Ag > D' },
      ],
      formula: 'Chain Inequality: B > Fe > A > Cu > C > Ag > D',
      substitution: 'Most reactive = Metal B; Least reactive = Metal D; Decreasing order: B > A > C > D',
      answer: {
        en: 'Decreasing reactivity order: B > A > C > D (Metal B will also displace Cu from CuSO₄ yielding blue-to-colourless/green shift).',
        hi: 'सक्रियता का घटता क्रम: B > A > C > D (धातु B सर्वाधिक अभिक्रियाशील है)।',
      },
      unitTrapNote: {
        en: 'Always check whether the exam question asks for DECREASING order (Most → Least: B > A > C > D) or INCREASING order (Least → Most: D < C < A < B)!',
        hi: 'परीक्षा में ध्यान से पढ़ें कि प्रश्न में “घटता क्रम (B > A > C > D)” पूछा गया है या “बढ़ता क्रम (D < C < A < B)”!',
      },
    },
    contrastTrap: {
      trapTitle: {
        en: 'Assuming Copper Reacts With Dilute HCl to Release H₂ Gas or Confusing ZnSO₄ Colour With CuSO₄',
        hi: 'तांबे (Cu) की तनु HCl से अभिक्रिया द्वारा H₂ गैस निकाल देना या ZnSO₄ को नीला मान लेना',
      },
      commonMistake: {
        en: 'Writing Cu + 2HCl → CuCl₂ + H₂↑, or saying aqueous zinc sulphate (ZnSO₄) is blue.',
        hi: 'Cu + 2HCl → CuCl₂ + H₂↑ लिख देना, या जिंक सल्फेट (ZnSO₄) के जलीय विलयन को नीला बताना।',
      },
      correctPhysics: {
        en: '1. Copper stands BELOW Hydrogen [H] in the reactivity series, so Copper CANNOT displace hydrogen from dilute HCl or dilute H₂SO₄ (No bubbles, No reaction!). 2. CuSO₄(aq) is blue, FeSO₄(aq) is pale green, and ZnSO₄(aq) / Al₂(SO₄)₃(aq) are completely COLOURLESS!',
        hi: '1. सक्रियता श्रेणी में तांबा (Cu) हाइड्रोजन [H] से नीचे स्थित है, इसलिए तांबा तनु HCl या तनु H₂SO₄ से हाइड्रोजन गैस विस्थापित नहीं कर सकता! 2. CuSO₄ नीला तथा FeSO₄ हल्का हरा होता है, जबकि ZnSO₄ व Al₂(SO₄)₃ पूर्णतः रंगहीन होते हैं!',
      },
      checkRule: {
        en: 'Cu, Ag, Au are below [H] → ZERO reaction with dilute HCl! ZnSO₄ & Al₂(SO₄)₃ = Colourless!',
        hi: 'Cu, Ag, Au हाइड्रोजन [H] से नीचे हैं → तनु HCl के साथ कोई अभिक्रिया नहीं! ZnSO₄ = रंगहीन!',
      },
    },
    hotsReasoningTask: {
      title: {
        en: 'HOTS Metallurgy & Oxide Chemistry: Thermite Welding Reaction & Amphoteric Aluminium Oxide',
        hi: 'उच्च स्तरीय धातुकर्म: थर्मिट अभिक्रिया (रेलवे ट्रैक जोड़ना) एवं उभयधर्मी ऑक्साइड',
      },
      prompt: {
        en: '(a) Which highly exothermic displacement reaction is used to join cracked railway tracks or machine parts (the Thermite process)? Write its balanced equation. (b) Why is aluminium oxide (Al₂O₃) called an amphoteric oxide?',
        hi: '(a) रेल की पटरियों एवं मशीनी पुर्जों की दरारों को जोड़ने के लिए किस अत्यंत ऊष्माक्षेपी विस्थापन अभिक्रिया (थर्मिट अभिक्रिया) का उपयोग किया जाता है? संतुलित समीकरण लिखिए। (b) ऐलुमिनियम ऑक्साइड (Al₂O₃) को उभयधर्मी ऑक्साइड क्यों कहते हैं?',
      },
      claimOptions: [
        {
          en: '(a) In the Thermite reaction, more reactive Aluminium powder reduces Iron(III) oxide to molten iron: Fe₂O₃(s) + 2Al(s) → 2Fe(l) + Al₂O₃(s) + Heat. (b) Al₂O₃ is amphoteric because it reacts with both acids (HCl) and bases (NaOH) to form salt and water.',
          hi: '(a) थर्मिट अभिक्रिया में अधिक अभिक्रियाशील ऐलुमिनियम चूर्ण आयरन(III) ऑक्साइड को गलित लोहे में अपचयित करता है: Fe₂O₃(s) + 2Al(s) → 2Fe(l) + Al₂O₃(s) + ऊष्मा। (b) Al₂O₃ अम्ल (HCl) तथा क्षारक (NaOH) दोनों से अभिक्रिया कर लवण तथा जल बनाता है, इसलिए उभयधर्मी है।',
        },
        {
          en: 'Copper reduces aluminium oxide in the thermite reaction, and Al₂O₃ reacts only with water.',
          hi: 'थर्मिट अभिक्रिया में तांबा ऐलुमिनियम ऑक्साइड को अपचयित करता है।',
        },
      ],
      correctClaimIndex: 0,
      claimExplanation: {
        en: 'Because Al > Fe in the reactivity series, Al displaces Fe from Fe₂O₃ with so much heat that the produced iron emerges in the molten state (2Fe(l)), welding the cracked rail tracks. Al₂O₃ and ZnO show both acidic and basic behaviour (amphoteric).',
        hi: 'चूँकि सक्रियता श्रेणी में Al > Fe है, इसलिए Al, Fe₂O₃ से लोहे को विस्थापित करता है और इतनी अधिक ऊष्मा निकलती है कि लोहा गलित अवस्था (2Fe(l)) में प्राप्त होता है। Al₂O₃ तथा ZnO अम्ल और क्षारक दोनों से क्रिया करते हैं।',
      },
      rubricPoints: [
        {
          en: 'Writes the balanced Thermite equation: Fe₂O₃(s) + 2Al(s) → 2Fe(l) + Al₂O₃(s) + Heat, noting that molten iron fills the rail crack.',
          hi: 'संतुलित थर्मिट समीकरण Fe₂O₃(s) + 2Al(s) → 2Fe(l) + Al₂O₃(s) + ऊष्मा लिखता है तथा गलित लोहे का उल्लेख करता है।',
        },
        {
          en: 'Defines amphoteric oxides as metal oxides (such as Al₂O₃ and ZnO) that react with both acids and bases to produce salt and water.',
          hi: 'उभयधर्मी ऑक्साइड (जैसे Al₂O₃ व ZnO) को परिभाषित करता है जो अम्ल और क्षारक दोनों से अभिक्रिया कर लवण तथा जल बनाते हैं।',
        },
        {
          en: 'Supports with reaction examples: Al₂O₃ + 6HCl → 2AlCl₃ + 3H₂O and Al₂O₃ + 2NaOH → 2NaAlO₂ + H₂O.',
          hi: 'अम्ल (HCl) तथा क्षार (NaOH से सोडियम ऐलुमिनेट NaAlO₂) के साथ अभिक्रिया का उल्लेख करता है।',
        },
      ],
    },
  },

  'carbon-homologous-series': {
    ncertSection: 'NCERT Class 10 Chapter 4: Carbon and its Compounds (Sec 4.2.2–4.2.4 — Chains, Functional Groups & Homologous Series)',
    openingQuestion: {
      en: '“Why do Methane, Ethane, Propane, and Butane all undergo the exact same type of chemical reactions, even though their boiling points climb higher with every carbon added?”',
      hi: '“मेथेन, एथेन, प्रोपेन और ब्यूटेन के क्वथनांक प्रत्येक कार्बन बढ़ने के साथ बढ़ते जाते हैं, फिर भी उनके रासायनिक गुणधर्म बिल्कुल एक जैसे क्यों रहते हैं?”',
    },
    experimentProtocol: {
      goal: {
        en: 'Build carbon chains from n = 1 to n = 6 across Alkanes (CₙH₂ₙ₊₂), Alkenes (CₙH₂ₙ), Alkynes (CₙH₂ₙ₋₂), and Alcohols (CₙH₂ₙ₊₁OH) to verify the invariant +CH₂ (+14 u) homologous step and compare saturated vs unsaturated bonding.',
        hi: 'n = 1 से n = 6 तक ऐल्केन, ऐल्कीन, ऐल्काइन तथा ऐल्कोहॉल श्रृंखलाओं का निर्माण कर नियत +CH₂ (+14 u) समजातीय अंतर सत्यापित करें और संतृप्त बनाम असंतृप्त आबंधों की तुलना करें।',
      },
      steps: [
        {
          en: 'Select “Alkanes (CₙH₂ₙ₊₂)” and step Carbon Count n from 1 (Methane CH₄, 16 u) to 2 (Ethane C₂H₆, 30 u) to 3 (Propane C₃H₈, 44 u). Observe that every step adds +CH₂ and increases mass by exactly +14 u!',
          hi: '“Alkanes (CₙH₂ₙ₊₂)” चुनें और कार्बन संख्या n को 1 (मेथेन CH₄, 16 u) से 2 (एथेन C₂H₆, 30 u) तथा 3 (प्रोपेन C₃H₈, 44 u) तक बढ़ाएं। देखें कि प्रत्येक चरण में +CH₂ और ठीक +14 u जुड़ता है!',
        },
        {
          en: 'Switch to “Alkenes (CₙH₂ₙ · Double C=C)” at n = 3 (Propene C₃H₆, 42 u) and “Alkynes (CₙH₂ₙ₋₂ · Triple C≡C)” (Propyne C₃H₄, 40 u). Notice that each extra pi-bond removes 2 H atoms (−2 u) and triggers the “Decolourises Br₂ Water!” badge.',
          hi: 'अब n = 3 पर “Alkenes (प्रोपीन C₃H₆, 42 u)” तथा “Alkynes (प्रोपाइन C₃H₄, 40 u)” चुनें। देखें कि प्रत्येक अतिरिक्त आबंध 2 H परमाणु (−2 u) कम करता है और असंतृप्तता (ब्रोमीन जल परीक्षण) दर्शाता है।',
        },
        {
          en: 'Switch to “Alcohols (CₙH₂ₙ₊₁OH)” and vary n from 1 (Methanol CH₃OH, 32 u) to 2 (Ethanol C₂H₅OH, 46 u). Confirm that even with the −OH functional group attached, the step to the next homologue is still +CH₂ (+14 u)!',
          hi: 'अब “Alcohols (CₙH₂ₙ₊₁OH)” चुनकर n = 1 (मेथेनॉल CH₃OH, 32 u) से n = 2 (एथेनॉल C₂H₅OH, 46 u) करें। पुष्टि करें कि −OH समूह होने पर भी क्रमागत अंतर +CH₂ (+14 u) ही रहता है!',
        },
      ],
      observationCheck: {
        prompt: {
          en: 'On the Carbon Homologous Series bench, compare Propane (alkane, n = 3), Propene (alkene, n = 3), and Propyne (alkyne, n = 3). What are their molecular formulas and which of them decolourise bromine water?',
          hi: 'n = 3 कार्बन के लिए प्रोपेन (ऐल्केन), प्रोपीन (ऐल्कीन) और प्रोपाइन (ऐल्काइन) के आणविक सूत्र क्या हैं और इनमें से कौन ब्रोमीन जल को रंगहीन करते हैं?',
        },
        options: [
          {
            en: 'Propane = C₃H₈ (saturated, does NOT decolourise Br₂); Propene = C₃H₆ and Propyne = C₃H₄ (both unsaturated, both decolourise Br₂ water).',
            hi: 'प्रोपेन = C₃H₈ (संतृप्त, ब्रोमीन जल को रंगहीन नहीं करता); प्रोपीन = C₃H₆ तथा प्रोपाइन = C₃H₄ (दोनों असंतृप्त हैं और ब्रोमीन जल को रंगहीन करते हैं)।',
          },
          {
            en: 'All three have the formula C₃H₈ and all three decolourise bromine water.',
            hi: 'तीनों का सूत्र C₃H₈ है और तीनों ब्रोमीन जल को रंगहीन करते हैं।',
          },
          {
            en: 'Only Propane C₃H₈ decolourises bromine water.',
            hi: 'केवल प्रोपेन C₃H₈ ब्रोमीन जल को रंगहीन करता है।',
          },
        ],
        correctIndex: 0,
        explanation: {
          en: 'At n = 3: Alkane CₙH₂ₙ₊₂ = C₃H₈ (only single bonds); Alkene CₙH₂ₙ = C₃H₆ (one C=C double bond); Alkyne CₙH₂ₙ₋₂ = C₃H₄ (one C≡C triple bond). Unsaturated hydrocarbons add bromine across their multiple bond, decolourising reddish-brown Br₂ water.',
          hi: 'n = 3 पर: ऐल्केन C₃H₈ (संतृप्त एकल आबंध); ऐल्कीन C₃H₆ (द्वि-आबंध); ऐल्काइन C₃H₄ (त्रि-आबंध)। असंतृप्त हाइड्रोकार्बन संकलन अभिक्रिया द्वारा ब्रोमीन जल का रंग उड़ा देते हैं।',
        },
      },
    },
    discoveryNotes: {
      physicalMeaning: {
        en: 'Carbon’s unique ability to form strong covalent bonds with other carbon atoms (catenation) and its tetravalency (valency = 4) allow it to build long chains. The functional group (e.g., −OH, −CHO, −COOH, C=C) dictates the chemical properties, while chain length n dictates physical properties like boiling point.',
        hi: 'कार्बन में श्रृंखलन (Catenation) तथा चतुःसंयोजकता (संयोजकता = 4) का अद्वितीय गुण होता है। किसी यौगिक के रासायनिक गुण उसके प्रकार्यात्मक समूह (जैसे −OH, −COOH) द्वारा तय होते हैं, जबकि भौतिक गुण (जैसे क्वथनांक) श्रृंखला के द्रव्यमान पर निर्भर करते हैं।',
      },
      scalingRule: {
        en: '1. Successive Homologues: ΔFormula = +CH₂, ΔMass = +14 u.  2. Hydrogen count at carbon n: Alkane = 2n + 2; Alkene = 2n; Alkyne = 2n − 2.  3. Single covalent bonds in an Alkane CₙH₂ₙ₊₂ = 3n + 1.',
        hi: '1. क्रमागत समजात अंतर: +CH₂ तथा +14 u।  2. n कार्बन पर हाइड्रोजन संख्या: ऐल्केन = 2n + 2; ऐल्कीन = 2n; ऐल्काइन = 2n − 2।  3. ऐल्केन CₙH₂ₙ₊₂ में कुल सहसंयोजी आबंध = 3n + 1।',
      },
      siUnitRule: {
        en: 'Unified atomic mass unit (u): C = 12 u, H = 1 u, O = 16 u. Molar mass in g/mol has the exact same numerical value as molecular mass in u.',
        hi: 'परमाणु द्रव्यमान मात्रक (u): C = 12 u, H = 1 u, O = 16 u।',
      },
    },
    workedNumerical: {
      title: {
        en: 'NCERT Class 10 Ch 4 Q2–Q3 · Covalent Bond Counting in Ethane (C₂H₆) & Propane (C₃H₈)',
        hi: 'NCERT कक्षा 10 अध्याय 4 · एथेन (C₂H₆) एवं प्रोपेन (C₃H₈) में सहसंयोजी आबंधों की गणना',
      },
      problem: {
        en: 'Calculate the total number of covalent single bonds in a molecule of (a) Ethane (C₂H₆) and (b) Propane (C₃H₈), and verify the formula Total Bonds = (n − 1) C–C bonds + (2n + 2) C–H bonds = 3n + 1.',
        hi: '(a) एथेन (C₂H₆) तथा (b) प्रोपेन (C₃H₈) के एक अणु में कुल कितने सहसंयोजी एकल आबंध होते हैं? सूत्र कुल आबंध = (n − 1) C–C आबंध + (2n + 2) C–H आबंध = 3n + 1 से सत्यापित कीजिए।',
      },
      given: [
        { en: 'Ethane: C₂H₆ (n = 2 carbons, 6 hydrogens)', hi: 'एथेन: C₂H₆ (n = 2 कार्बन, 6 हाइड्रोजन)' },
        { en: 'Propane: C₃H₈ (n = 3 carbons, 8 hydrogens)', hi: 'प्रोपेन: C₃H₈ (n = 3 कार्बन, 8 हाइड्रोजन)' },
      ],
      formula: 'Total Covalent Bonds in Alkane CₙH₂ₙ₊₂ = (n − 1) + (2n + 2) = 3n + 1',
      substitution: 'Ethane (n=2): 1 (C–C) + 6 (C–H) = 7 covalent bonds  |  Propane (n=3): 2 (C–C) + 8 (C–H) = 10 covalent bonds',
      answer: {
        en: 'Ethane (C₂H₆) has 7 covalent bonds; Propane (C₃H₈) has 10 covalent bonds.',
        hi: 'एथेन (C₂H₆) में 7 सहसंयोजी आबंध तथा प्रोपेन (C₃H₈) में 10 सहसंयोजी आबंध हैं।',
      },
      unitTrapNote: {
        en: 'Never forget to count the C–C backbone bonds along with the C–H peripheral bonds! In Propane (C₃H₈), 8 C–H bonds + 2 C–C bonds = 10 bonds (not 8!).',
        hi: 'केवल C–H आबंध गिनकर उत्तर न दें—कार्बन परमाणुओं के बीच के C–C आबंधों को जोड़ना कभी न भूलें (प्रोपेन में 8 C–H + 2 C–C = 10 आबंध)!',
      },
    },
    contrastTrap: {
      trapTitle: {
        en: 'Writing “Methene (CH₂)” as the First Member of the Alkene Series (Forgetting That C=C Requires n ≥ 2)',
        hi: 'ऐल्कीन श्रेणी का प्रथम सदस्य “मेथीन (CH₂)” लिख देना (यह भूलकर कि C=C के लिए n ≥ 2 अनिवार्य है)',
      },
      commonMistake: {
        en: 'When asked for the first member of the alkene series (CₙH₂ₙ), plugging in n = 1 and writing “CH₂ (Methene)”.',
        hi: 'परीक्षा में ऐल्कीन श्रेणी (CₙH₂ₙ) का प्रथम सदस्य पूछे जाने पर n = 1 रखकर “CH₂ (मेथीन)” लिख देना।',
      },
      correctPhysics: {
        en: 'An alkene is defined by a carbon–carbon double bond (C=C), which physically requires AT LEAST TWO carbon atoms (n ≥ 2)! Therefore the 1st member of the alkene series is Ethene (n = 2, C₂H₄), the 2nd member is Propene (n = 3, C₃H₆), and the 3rd member is Butene (n = 4, C₄H₈). Likewise, the 1st alkyne is Ethyne (n = 2, C₂H₂)!',
        hi: 'ऐल्कीन में कार्बन–कार्बन के बीच द्वि-आबंध (C=C) होना अनिवार्य है, जिसके लिए कम से कम 2 कार्बन परमाणु (n ≥ 2) चाहिए! अतः ऐल्कीन श्रेणी का प्रथम सदस्य एथीन (n = 2, C₂H₄) और दूसरा सदस्य प्रोपीन (n = 3, C₃H₆) होता है!',
      },
      checkRule: {
        en: 'Alkanes & Alcohols start at n = 1 (Methane, Methanol). Alkenes & Alkynes ALWAYS start at n = 2 (Ethene, Ethyne)!',
        hi: 'ऐल्केन व ऐल्कोहॉल n = 1 से शुरू होते हैं, परंतु ऐल्कीन व ऐल्काइन सदैव n = 2 (एथीन C₂H₄, एथाइन C₂H₂) से शुरू होते हैं!',
      },
    },
    hotsReasoningTask: {
      title: {
        en: 'HOTS Organic Chemistry: Distinguishing Saturated Butter vs Unsaturated Vegetable Oil & Hydrogenation',
        hi: 'उच्च स्तरीय कार्बनिक रसायन: संतृप्त बनाम असंतृप्त हाइड्रोकार्बन की पहचान एवं हाइड्रोजनीकरण',
      },
      prompt: {
        en: 'Give a chemical test to distinguish between saturated hydrocarbons (like propane/butter) and unsaturated hydrocarbons (like ethene/vegetable oil). Also write the chemical reaction and catalyst used in the industrial hydrogenation of vegetable oils.',
        hi: 'संतृप्त हाइड्रोकार्बन (जैसे मक्खन/प्रोपेन) तथा असंतृप्त हाइड्रोकार्बन (जैसे वनस्पति तेल/एथीन) में अंतर करने के लिए एक रासायनिक परीक्षण लिखिए। वनस्पति तेलों के औद्योगिक हाइड्रोजनीकरण की अभिक्रिया तथा प्रयुक्त उत्प्रेरक भी लिखिए।',
      },
      claimOptions: [
        {
          en: 'Unsaturated hydrocarbons decolourise reddish-brown bromine water via an addition reaction across C=C (and burn with a yellow sooty flame), whereas saturated hydrocarbons do not decolourise Br₂ water (and burn with a clean blue flame). Vegetable oils (unsaturated) are hydrogenated using H₂ in the presence of a Nickel (Ni) or Palladium (Pd) catalyst to form saturated fats.',
          hi: 'असंतृप्त हाइड्रोकार्बन संकलन अभिक्रिया द्वारा ब्रोमीन जल का रंग उड़ा देते हैं (तथा कज्जली पीली ज्वाला से जलते हैं), जबकि संतृप्त हाइड्रोकार्बन ब्रोमीन जल को रंगहीन नहीं करते (स्वच्छ नीली ज्वाला देते हैं)। निकेल (Ni) या पैलेडियम (Pd) उत्प्रेरक की उपस्थिति में H₂ जोड़कर वनस्पति तेलों का हाइड्रोजनीकरण किया जाता है।',
        },
        {
          en: 'Saturated hydrocarbons decolourise bromine water and use copper catalyst for hydrogenation.',
          hi: 'संतृप्त हाइड्रोकार्बन ब्रोमीन जल को रंगहीन करते हैं और हाइड्रोजनीकरण में तांबा उत्प्रेरक प्रयुक्त होता है।',
        },
      ],
      correctClaimIndex: 0,
      claimExplanation: {
        en: 'Unsaturated carbon chains contain reactive pi-bonds (C=C) that undergo addition reactions with Br₂ (decolourising bromine water) and H₂ in the presence of Ni/Pd catalyst (converting liquid unsaturated vegetable oil into solid saturated vanaspati ghee).',
        hi: 'असंतृप्त कार्बन श्रृंखलाओं में द्वि-आबंध (C=C) होता है जो ब्रोमीन (Br₂) के साथ संकलन अभिक्रिया कर उसका रंग उड़ा देता है तथा निकेल (Ni) उत्प्रेरक की उपस्थिति में हाइड्रोजन (H₂) जोड़कर संतृप्त वसा बनाता है।',
      },
      rubricPoints: [
        {
          en: 'Describes the Bromine Water Test (or Alkaline KMnO₄ test): unsaturated hydrocarbons decolourise bromine water via addition reaction, while saturated hydrocarbons do not.',
          hi: 'ब्रोमीन जल परीक्षण लिखता है: असंतृप्त हाइड्रोकार्बन ब्रोमीन जल को रंगहीन कर देते हैं जबकि संतृप्त नहीं करते।',
        },
        {
          en: 'Contrasts combustion flame: saturated hydrocarbons burn with a clean blue flame, whereas unsaturated hydrocarbons give a yellow flame with black soot.',
          hi: 'दहन ज्वाला की तुलना करता है: संतृप्त स्वच्छ नीली ज्वाला देते हैं जबकि असंतृप्त कज्जली (धुएँदार) पीली ज्वाला देते हैं।',
        },
        {
          en: 'Explains hydrogenation of unsaturated vegetable oils with H₂ gas in the presence of Nickel (Ni) or Palladium (Pd) catalyst.',
          hi: 'निकेल (Ni) या पैलेडियम (Pd) उत्प्रेरक की उपस्थिति में H₂ द्वारा वनस्पति तेलों के हाइड्रोजनीकरण (संकलन अभिक्रिया) को स्पष्ट करता है।',
        },
      ],
    },
  },

  'respiration-atp-pathways': {
    ncertSection: 'NCERT Class 10 Chapter 5: Life Processes (Sec 5.3 — Respiration & Fig 5.8 Breakdown of Glucose by Various Pathways)',
    openingQuestion: {
      en: '“Why do both yeast cells in a closed fermentation vat and your leg muscles during a hard sprint start with the exact same pyruvate step in the cytoplasm, yet end up with completely different molecules?”',
      hi: '“बंद पात्र में किण्वन करती यीस्ट कोशिका और तेज़ दौड़ के दौरान आपकी पैर की पेशी कोशिका दोनों कोशिकाद्रव्य में पायरुवेट के एक ही चरण से शुरू करती हैं, फिर भी उनके अंतिम उत्पाद बिल्कुल अलग क्यों होते हैं?”',
    },
    experimentProtocol: {
      goal: {
        en: 'Compare the 3 NCERT Figure 5.8 glucose breakdown pathways (Mitochondria +O₂, Yeast No O₂, and Muscle Cell Lack of O₂) to verify the 19-fold ATP yield difference (38 ATP vs 2 ATP per glucose) and end-product carbon counts.',
        hi: 'NCERT चित्र 5.8 के तीनों ग्लूकोज़ विखंडन पथों (माइटोकॉन्ड्रिया +O₂, यीस्ट O₂ अनुपस्थित, तथा पेशी कोशिका O₂ अभाव) की तुलना कर 19-गुना ATP अंतर (38 ATP बनाम 2 ATP) और अंतिम उत्पादों के कार्बन परमाणुओं का सत्यापन करें।',
      },
      steps: [
        {
          en: 'Select “1. Mitochondria: Aerobic (+O₂ · 38 ATP/glucose)” with 2 moles of Glucose. Observe that 2 Glucose (6C) split into 4 Pyruvate (3C) in the cytoplasm and then oxidise in mitochondria to yield 76 ATP + 12 CO₂ + 12 H₂O.',
          hi: '2 मोल ग्लूकोज़ के साथ “1. माइटोकॉन्ड्रिया: वायवीय श्वसन (+O₂)” चुनें। देखें कि कोशिकाद्रव्य में 4 पायरुवेट (3C) बनकर माइटोकॉन्ड्रिया में 76 ATP + 12 CO₂ + 12 H₂O बनते हैं।',
        },
        {
          en: 'Switch to “2. Yeast: Anaerobic Fermentation (No O₂ · 2 ATP)”. Notice that total ATP drops 19-fold from 76 ATP down to just 4 ATP, while pyruvate converts into 2-carbon Ethanol (C₂H₅OH) + CO₂ gas!',
          hi: '“2. यीस्ट: अवायवीय किण्वन” चुनें। देखें कि कुल ATP 76 से घटकर केवल 4 ATP रह जाता है और पायरुवेट 2-कार्बन एथेनॉल (C₂H₅OH) + CO₂ में बदलता है!',
        },
        {
          en: 'Switch to “3. Muscle Sprint: Lack of O₂ (Lactic Acid · 2 ATP)”. Observe that pyruvate converts into 3-carbon Lactic Acid (C₃H₆O₃) with ZERO CO₂ released, triggering the muscle cramp warning!',
          hi: '“3. पेशी कोशिका: O₂ का अभाव” चुनें। देखें कि पायरुवेट बिना कोई CO₂ निकाले 3-कार्बन लैक्टिक अम्ल में बदलता है, जिससे पेशी ऐंठन (क्रैम्प) होती है!',
        },
      ],
      observationCheck: {
        prompt: {
          en: 'According to NCERT Figure 5.8 on the respiration bench, what is the key chemical difference between anaerobic fermentation in Yeast versus anaerobic breakdown in Human Muscle Cells?',
          hi: 'NCERT चित्र 5.8 के अनुसार यीस्ट में अवायवीय किण्वन तथा मानव पेशी कोशिकाओं में ऑक्सीजन के अभाव में होने वाले विखंडन के अंतिम उत्पादों में मुख्य अंतर क्या है?',
        },
        options: [
          {
            en: 'Yeast converts 3C Pyruvate into 2-carbon Ethanol + CO₂ gas (+2 ATP), whereas human muscle cells convert 3C Pyruvate into 3-carbon Lactic Acid with NO CO₂ gas (+2 ATP).',
            hi: 'यीस्ट 3C पायरुवेट को 2-कार्बन एथेनॉल + CO₂ (+2 ATP) में बदलता है, जबकि मानव पेशी कोशिकाएं 3C पायरुवेट को बिना CO₂ के 3-कार्बन लैक्टिक अम्ल (+2 ATP) में बदलती हैं।',
          },
          {
            en: 'Human muscle cells produce Ethanol and CO₂ gas during a sprint.',
            hi: 'दौड़ते समय मानव पेशी कोशिकाओं में एथेनॉल और CO₂ गैस बनती है।',
          },
          {
            en: 'Yeast produces 38 ATP per glucose while muscle cells produce 2 ATP.',
            hi: 'यीस्ट प्रति ग्लूकोज़ 38 ATP बनाता है जबकि पेशी कोशिका 2 ATP।',
          },
        ],
        correctIndex: 0,
        explanation: {
          en: 'Because Pyruvate has 3 carbons, splitting off 1 carbon as CO₂ in yeast leaves a 2-carbon molecule (Ethanol, C₂H₅OH). In human muscle cells, all 3 carbons stay together as 3-carbon Lactic Acid (C₃H₆O₃), so zero CO₂ is produced in that step!',
          hi: 'पायरुवेट में 3 कार्बन होते हैं: यीस्ट में 1 कार्बन CO₂ के रूप में निकलकर 2-कार्बन एथेनॉल बचता है, जबकि मानव पेशी में तीनों कार्बन 3-कार्बन लैक्टिक अम्ल के रूप में रहते हैं (कोई CO₂ नहीं निकलती)!',
        },
      },
    },
    discoveryNotes: {
      physicalMeaning: {
        en: 'ATP (Adenosine Triphosphate) is the universal energy currency of the cell: energy released during glucose oxidation is used to attach an inorganic phosphate (Pᵢ) onto ADP to form ATP (releasing ~30.5 kJ/mol when its terminal phosphate bond is hydrolysed).',
        hi: 'ATP (ऐडिनोसिन ट्राइफॉस्फेट) कोशिका की ऊर्जा मुद्रा है: श्वसन में मुक्त ऊर्जा का उपयोग ADP और अकार्बनिक फॉस्फेट (Pᵢ) से ATP बनाने में होता है (जिसके अंतस्थ फॉस्फेट आबंध के टूटने पर ~30.5 kJ/mol ऊर्जा मिलती है)।',
      },
      scalingRule: {
        en: '1. Universal Step 1 (Cytoplasm): 1 Glucose (6C) → 2 Pyruvate (3C).  2. Aerobic Rate: 38 ATP/glucose.  3. Anaerobic Rate: 2 ATP/glucose (Total ATP = Rate × Moles of Glucose).',
        hi: '1. सार्वत्रिक प्रथम चरण (कोशिकाद्रव्य): 1 ग्लूकोज़ (6C) → 2 पायरुवेट (3C)।  2. वायवीय दर: 38 ATP/ग्लूकोज़।  3. अवायवीय दर: 2 ATP/ग्लूकोज़।',
      },
      siUnitRule: {
        en: 'Hydrolysis of 1 mole of ATP releases 30.5 kJ/mol of usable biological energy for muscle contraction, protein synthesis, and nerve conduction.',
        hi: '1 मोल ATP के जल-अपघटन से 30.5 kJ/mol ऊर्जा मुक्त होती है जो पेशी संकुचन व तंत्रिका आवेग चालन में प्रयुक्त होती है।',
      },
    },
    workedNumerical: {
      title: {
        en: 'NCERT Class 10 Ch 5 · Comparing Aerobic vs Anaerobic Glucose Consumption for Equal ATP Demand',
        hi: 'NCERT कक्षा 10 अध्याय 5 · समान ATP ऊर्जा के लिए वायवीय बनाम अवायवीय ग्लूकोज़ खपत',
      },
      problem: {
        en: 'A contracting muscle fibre requires 190 moles of ATP during an intense workout. (a) How many moles of glucose are needed if supplied completely by aerobic respiration in mitochondria (38 ATP/glucose)? (b) How many moles of glucose are consumed if supplied by anaerobic lactic-acid breakdown (2 ATP/glucose)?',
        hi: 'व्यायाम के दौरान किसी पेशी तंतु को 190 मोल ATP ऊर्जा की आवश्यकता है। (a) माइटोकॉन्ड्रिया में वायवीय श्वसन (38 ATP/ग्लूकोज़) द्वारा यह ऊर्जा प्राप्त करने के लिए कितने मोल ग्लूकोज़ चाहिए? (b) अवायवीय लैक्टिक अम्ल पथ (2 ATP/ग्लूकोज़) से यही ऊर्जा पाने के लिए कितने मोल ग्लूकोज़ खर्च होंगे?',
      },
      given: [
        { en: 'Target Total Energy = 190 mol ATP', hi: 'आवश्यक कुल ऊर्जा = 190 मोल ATP' },
        { en: 'Aerobic rate = 38 ATP/mol glucose; Anaerobic rate = 2 ATP/mol glucose', hi: 'वायवीय दर = 38 ATP/मोल; अवायवीय दर = 2 ATP/मोल' },
      ],
      formula: 'Glucose Moles = Total ATP Required / (ATP per Glucose)',
      substitution: '(a) Aerobic: 190 / 38 = 5 mol Glucose  |  (b) Anaerobic: 190 / 2 = 95 mol Glucose (19× more glucose burned!)',
      answer: {
        en: 'Aerobic requires only 5 mol Glucose; Anaerobic requires 95 mol Glucose (19× higher fuel consumption).',
        hi: 'वायवीय श्वसन में केवल 5 मोल ग्लूकोज़ लगता है; अवायवीय पथ में 95 मोल ग्लूकोज़ (19 गुना अधिक) खर्च होता है।',
      },
      unitTrapNote: {
        en: 'Keep track of carbon atoms per molecule: Glucose = 6C, Pyruvate = 3C, Lactic Acid = 3C, Ethanol = 2C, CO₂ = 1C!',
        hi: 'प्रत्येक अणु में कार्बन संख्या याद रखें: ग्लूकोज़ = 6C, पायरुवेट = 3C, लैक्टिक अम्ल = 3C, एथेनॉल = 2C, तथा CO₂ = 1C!',
      },
    },
    contrastTrap: {
      trapTitle: {
        en: 'Writing That Lactic Acid Fermentation in Human Muscles Releases CO₂ Gas or Occurs in Mitochondria',
        hi: 'मानव पेशी कोशिकाओं में लैक्टिक अम्ल के साथ CO₂ गैस निकाल देना या इसे माइटोकॉन्ड्रिया में बताना',
      },
      commonMistake: {
        en: 'Writing in board exams: “In human muscle cells under lack of oxygen, pyruvate breaks down into lactic acid + CO₂ inside the mitochondria.”',
        hi: 'परीक्षा में यह लिखना कि “पेशी कोशिकाओं में ऑक्सीजन के अभाव में माइटोकॉन्ड्रिया के भीतर लैक्टिक अम्ल तथा CO₂ बनती है।”',
      },
      correctPhysics: {
        en: '1. Pyruvate (3-carbon) → Lactic Acid (3-carbon) conserves all 3 carbon atoms inside the lactic acid molecule, so ZERO CO₂ is released in muscle cells (unlike 2-carbon ethanol + 1-carbon CO₂ in yeast)! 2. Only aerobic oxidation occurs in the mitochondria; lactic acid formation occurs in the muscle cell cytoplasm.',
        hi: '1. पायरुवेट (3-कार्बन) से लैक्टिक अम्ल (3-कार्बन) बनने में तीनों कार्बन परमाणु लैक्टिक अम्ल में ही रहते हैं, इसलिए पेशी कोशिका में CO₂ गैस बिल्कुल नहीं बनती! 2. केवल वायवीय श्वसन ही माइटोकॉन्ड्रिया में होता है।',
      },
      checkRule: {
        en: 'Count carbons! 3C Pyruvate → 2C Ethanol + 1C CO₂ (Yeast) vs 3C Pyruvate → 3C Lactic Acid + 0 CO₂ (Muscle)!',
        hi: 'कार्बन गिनें! 3C पायरुवेट → 2C एथेनॉल + 1C CO₂ (यीस्ट) बनाम 3C पायरुवेट → 3C लैक्टिक अम्ल + 0 CO₂ (पेशी)!',
      },
    },
    hotsReasoningTask: {
      title: {
        en: 'HOTS Comparative Physiology: Terrestrial vs Aquatic Breathing Rate & Alveolar Gas Exchange Design',
        hi: 'उच्च स्तरीय शरीर क्रिया विज्ञान: जलीय जीवों की तेज़ श्वसन दर एवं कूपिकाओं (Alveoli) की संरचना',
      },
      prompt: {
        en: 'Explain scientifically: (a) Why the rate of breathing in aquatic organisms (like fishes) is much faster than that seen in terrestrial organisms; (b) How the lungs are designed in human beings to maximize the area for exchange of gases.',
        hi: 'वैज्ञानिक कारण स्पष्ट कीजिए: (a) जलीय जीवों (जैसे मछली) में श्वसन की दर स्थलीय जीवों की अपेक्षा बहुत तेज़ क्यों होती है? (b) मनुष्यों में गैसों के अधिकतम विनिमय के लिए फुफ्फुस (फेफड़े) किस प्रकार अभिकल्पित हैं?',
      },
      claimOptions: [
        {
          en: '(a) The amount of dissolved oxygen in water is fairly low compared to the ~21% oxygen in air, forcing aquatic organisms to breathe much faster. (b) Inside human lungs, tubes divide into millions of balloon-like Alveoli (~80 m² surface area) richly supplied with blood capillaries and ultra-thin walls.',
          hi: '(a) जल में घुली हुई ऑक्सीजन की मात्रा वायु में उपलब्ध ऑक्सीजन (~21%) की तुलना में बहुत कम होती है, इसलिए जलीय जीवों की श्वसन दर तेज़ होती है। (b) मानव फुफ्फुस में श्वसनिकाएं लाखों गुब्बारे जैसी कूपिकाओं (Alveoli, ~80 m² क्षेत्रफल) में खुलती हैं जिनकी भित्ति पर रुधिर वाहिकाओं का घना जाल होता है।',
        },
        {
          en: 'Water contains more oxygen than air, and human lungs are hollow smooth bags without alveoli.',
          hi: 'जल में वायु से अधिक ऑक्सीजन होती है और फेफड़ों में कूपिकाएं नहीं होतीं।',
        },
      ],
      correctClaimIndex: 0,
      claimExplanation: {
        en: 'Dissolved O₂ in water is < 1% by volume vs 21% O₂ in atmospheric air. In human lungs, millions of alveoli unfold to ~80 m² (the size of a tennis court!) with one-cell-thick moist membranes and dense capillary networks for rapid diffusion.',
        hi: 'जल में विलेय ऑक्सीजन अत्यंत कम होती है। मानव फेफड़ों में लाखों कूपिकाएं (Alveoli) सतह क्षेत्रफल को ~80 m² तक बढ़ा देती हैं तथा उनकी पतली भित्ति व रुधिर केशिकाओं का जाल तीव्र विसरण सुनिश्चित करता है।',
      },
      rubricPoints: [
        {
          en: 'Explains faster aquatic breathing: the concentration of dissolved oxygen in water is much lower than the oxygen concentration in air.',
          hi: 'स्पष्ट करता है कि जल में घुली ऑक्सीजन की मात्रा वायु की तुलना में बहुत कम होने के कारण जलीय जीवों की श्वसन दर तेज़ होती है।',
        },
        {
          en: 'Describes alveolar structure: bronchioles terminate in millions of balloon-like alveoli that provide a huge surface area (~80 m²).',
          hi: 'कूपिकाओं (Alveoli) की गुब्बारे जैसी संरचना तथा विशाल सतह क्षेत्रफल (~80 m²) का उल्लेख करता है।',
        },
        {
          en: 'Mentions the extensive network of blood capillaries in alveolar walls and residual volume of air for continuous gas exchange.',
          hi: 'कूपिकाओं की भित्ति में रुधिर वाहिकाओं के विस्तृत जाल तथा गैसों के निरंतर विनिमय का उल्लेख करता है।',
        },
      ],
    },
  },

  'reflex-arc-hormone-feedback': {
    ncertSection: 'NCERT Class 10 Chapter 6: Control and Coordination (Sec 6.1.1 — What happens in Reflex Actions? & Sec 6.3 — Hormones in Animals)',
    openingQuestion: {
      en: '“If the human brain is the master command center of the body, why did evolution wire the emergency hot-plate withdrawal reflex directly through the spinal cord instead of waiting for the brain to decide?”',
      hi: '“यदि मानव मस्तिष्क शरीर का सर्वोच्च नियंत्रण केंद्र है, तो गर्म वस्तु छूने पर हाथ हटाने का आपातकालीन प्रतिवर्ती चाप मस्तिष्क के निर्णय की प्रतीक्षा किए बिना सीधे मेरुरज्जु (Spinal Cord) से क्यों जुड़ा है?”',
    },
    experimentProtocol: {
      goal: {
        en: 'Compare impulse travel time along the 5-step Spinal Reflex Arc versus a Conscious Brain Detour, and test how the Pancreatic Negative-Feedback Loop regulates blood glucose around its 70–110 mg/dL setpoint.',
        hi: '5-चरणीय मेरुरज्जु प्रतिवर्ती चाप बनाम मस्तिष्क विचार मार्ग के प्रतिक्रिया समय की तुलना करें, तथा परीक्षण करें कि अग्नाशय की पुनर्भरण क्रियाविधि रक्त शर्करा को 70–110 mg/dL पर कैसे नियंत्रित करती है।',
      },
      steps: [
        {
          en: 'Select “1. Spinal Cord Reflex Arc” at Arm Path Length L = 0.8 m. Trace the 5 steps in Panel 1 (Receptor → Sensory → Spinal Relay → Motor → Effector Muscle) completing in just 26 ms.',
          hi: 'L = 0.8 m पर “1. मेरुरज्जु प्रतिवर्ती चाप” चुनें। पैनल 1 में 5 चरणों (ग्राही → संवेदी → मेरुरज्जु रिले → प्रेरक → पेशी) को केवल 26 ms में पूर्ण होते देखें।',
        },
        {
          en: 'Switch to “2. Conscious Brain Detour (+120 ms Thinking Delay)”. Notice total latency jumps to 146 ms—saving 120 ms via the spinal cord prevents severe skin burns!',
          hi: '“2. मस्तिष्क विचार मार्ग” चुनें। देखें कि कुल समय बढ़कर 146 ms हो जाता है—मेरुरज्जु द्वारा बचाया गया 120 ms त्वचा को जलने से बचाता है!',
        },
        {
          en: 'In Panel 2, slide Blood Glucose from 180 mg/dL (Hyperglycemia → Pancreas secretes INSULIN) down to 90 mg/dL (Basal Homeostasis) and 55 mg/dL (Hypoglycemia → Insulin inhibited & GLUCAGON released).',
          hi: 'पैनल 2 में रक्त शर्करा को 180 mg/dL (इंसुलिन स्राव ↑) से घटाकर 90 mg/dL (सामान्य संतुलन) और फिर 55 mg/dL (इंसुलिन बंद व ग्लूकागॉन स्राव ↑) पर ले जाकर पुनर्भरण नियंत्रण देखें।',
        },
      ],
      observationCheck: {
        prompt: {
          en: 'Trace the exact sequence of a spinal reflex arc (NCERT Fig 6.2) when your hand touches a hot object, and identify what happens to pancreatic insulin secretion when blood glucose returns from 180 mg/dL back down to 90 mg/dL:',
          hi: 'गर्म वस्तु छूने पर प्रतिवर्ती चाप (NCERT चित्र 6.2) का सही क्रम क्या है, तथा रक्त शर्करा 180 mg/dL से घटकर सामान्य 90 mg/dL पर आने पर इंसुलिन स्राव में क्या परिवर्तन होता है?',
        },
        options: [
          {
            en: 'Reflex sequence: Heat Receptor in Skin → Sensory Neuron → Spinal Cord (Relay Neuron) → Motor Neuron → Effector Muscle; as blood sugar falls back to 90 mg/dL, negative feedback reduces insulin secretion.',
            hi: 'प्रतिवर्ती चाप क्रम: त्वचा में ऊष्मा ग्राही → संवेदी तंत्रिका → मेरुरज्जु (रिले न्यूरॉन) → प्रेरक तंत्रिका → कार्यकर पेशी; शर्करा 90 mg/dL पर सामान्य होते ही पुनर्भरण क्रियाविधि इंसुलिन स्राव को घटा देती है।',
          },
          {
            en: 'Reflex sequence: Effector Muscle → Motor Neuron → Brain → Sensory Neuron → Receptor; insulin secretion increases when blood sugar falls.',
            hi: 'क्रम: पेशी → प्रेरक तंत्रिका → मस्तिष्क → संवेदी तंत्रिका; शर्करा घटने पर इंसुलिन स्राव और अधिक बढ़ जाता है।',
          },
          {
            en: 'Reflex arcs do not involve the spinal cord at all.',
            hi: 'प्रतिवर्ती चाप में मेरुरज्जु की कोई भूमिका नहीं होती।',
          },
        ],
        correctIndex: 0,
        explanation: {
          en: 'Sensory neurons carry impulses from receptors TO the spinal cord; relay neurons pass them to motor neurons, which command the effector muscle. In hormonal negative feedback, once the response restores normal blood glucose, the stimulus stops and hormone secretion is turned down.',
          hi: 'संवेदी न्यूरॉन ग्राही से मेरुरज्जु तक आवेग ले जाते हैं और प्रेरक न्यूरॉन मेरुरज्जु से पेशी तक आदेश लाते हैं। पुनर्भरण क्रियाविधि में शर्करा सामान्य होते ही इंसुलिन का अतिरिक्त स्राव बंद हो जाता है।',
        },
      },
    },
    discoveryNotes: {
      physicalMeaning: {
        en: 'Animals use two complementary coordination systems: (1) Electrical nerve impulses travel rapidly along axons and cross chemical synapses via neurotransmitters, ideal for split-second localized actions; (2) Endocrine hormones travel via blood to reach every cell in the body for sustained growth, metabolism, and homeostasis.',
        hi: 'जंतुओं में समन्वय की दो पूरक प्रणालियाँ हैं: (1) तंत्रिका तंत्र विद्युत आवेगों और सिनेप्स के रसायनों द्वारा अति-तीव्र एवं स्थानीय प्रतिक्रिया देता है; (2) अंतःस्रावी हार्मोन रक्त द्वारा शरीर की प्रत्येक कोशिका तक पहुँचकर दीर्घकालिक वृद्धि, उपापचय और समस्थापन नियंत्रित करते हैं।',
      },
      scalingRule: {
        en: '1. One-Way Synapse Rule: Dendrite receives → Cell body → Axon → Nerve ending releases chemical neurotransmitter across synapse → Next dendrite.  2. Negative Feedback Rule: Change in variable X triggers hormone H that opposes ΔX.',
        hi: '1. एकदिशिक सिनेप्स नियम: द्रुमिका (Dendrite) → कोशिका काय → तंत्रिकाक्ष (Axon) → सिनेप्स में रसायन मुक्त होना → अगला न्यूरॉन।  2. ऋणात्मक पुनर्भरण: शर्करा बढ़ने पर इंसुलिन उसे घटाता है।',
      },
      siUnitRule: {
        en: 'Nerve impulse latencies are measured in milliseconds (1 ms = 10⁻³ s). Fasting human blood glucose is normally maintained around 70–110 mg/dL.',
        hi: 'तंत्रिका प्रतिक्रिया समय मिलीसेकंड (1 ms = 10⁻³ s) में तथा रक्त शर्करा स्तर mg/dL में मापा जाता है।',
      },
    },
    workedNumerical: {
      title: {
        en: 'NCERT Class 10 Ch 6 · Comparing Reflex Arc vs Fore-Brain Conduction & Processing Time',
        hi: 'NCERT कक्षा 10 अध्याय 6 · मेरुरज्जु प्रतिवर्ती चाप बनाम मस्तिष्क प्रतिक्रिया समय की गणना',
      },
      problem: {
        en: 'A sensory receptor in the hand is 0.80 m from the spinal cord. Assume nerve impulses travel at 100 m/s along both sensory and motor neurons and crossing the spinal relay synapse takes 10 ms. (a) Calculate the total time taken for the spinal reflex arc to trigger the arm muscle. (b) If routing through the fore-brain adds 120 ms of cortical thinking time, how many times faster is the spinal reflex?',
        hi: 'हाथ के ग्राही से मेरुरज्जु की दूरी 0.80 m है। मान लीजिए संवेदी व प्रेरक तंत्रिकाओं में आवेग की चाल 100 m/s है और मेरुरज्जु सिनेप्स पार करने में 10 ms लगते हैं। (a) मेरुरज्जु प्रतिवर्ती चाप का कुल समय ज्ञात कीजिए। (b) यदि मस्तिष्क से सोचने में 120 ms अतिरिक्त लगते हैं, तो प्रतिवर्ती चाप कितने गुना तेज़ है?',
      },
      given: [
        { en: 'One-way arm nerve length L = 0.80 m (Round-trip 2L = 1.60 m)', hi: 'एकतरफा दूरी L = 0.80 m (आने-जाने की दूरी 2L = 1.60 m)' },
        { en: 'Impulse speed v = 100 m/s, Spinal synapse delay = 10 ms, Brain thinking delay = +120 ms', hi: 'चाल v = 100 m/s, सिनेप्स समय = 10 ms, मस्तिष्क विचार समय = +120 ms' },
      ],
      formula: 't_reflex = (2L / v) × 1000 ms + t_synapse  |  t_brain = t_reflex + 120 ms',
      substitution: 't_reflex = (1.60 / 100) × 1000 + 10 = 16 ms + 10 ms = 26 ms  |  t_brain = 26 + 120 = 146 ms (146 / 26 = 5.6× faster!)',
      answer: {
        en: 'Spinal reflex takes only 26 ms vs 146 ms via the thinking brain (5.6× faster response!).',
        hi: 'प्रतिवर्ती चाप में केवल 26 ms लगते हैं जबकि मस्तिष्क मार्ग में 146 ms (5.6 गुना अधिक तेज़ सुरक्षा!)।',
      },
      unitTrapNote: {
        en: 'Remember that a reflex arc is a round-trip from receptor to spinal cord (+L) AND from spinal cord back to the effector muscle (+L)!',
        hi: 'ध्यान रखें कि प्रतिवर्ती चाप में आवेग ग्राही से मेरुरज्जु तक जाता है (+L) और मेरुरज्जु से वापस पेशी तक आता है (+L)!',
      },
    },
    contrastTrap: {
      trapTitle: {
        en: 'Swapping Sensory vs Motor Neurons or Confusing Dendrite (Input) With Axon Terminal (Output)',
        hi: 'संवेदी व प्रेरक तंत्रिका की दिशा उलट देना या द्रुमिका (इनपुट) व एक्सॉन सिरे (आउटपुट) में भ्रम करना',
      },
      commonMistake: {
        en: 'Drawing the arrow in a reflex arc from the Spinal Cord to the Receptor via the Sensory Neuron, or saying electrical impulses jump directly across the synaptic cleft without chemicals.',
        hi: 'प्रतिवर्ती चाप में मेरुरज्जु से संवेदी तंत्रिका द्वारा ग्राही की ओर तीर बना देना, या यह लिखना कि सिनेप्स में विद्युत आवेग बिना रसायनों के सीधे कूद जाता है।',
      },
      correctPhysics: {
        en: '1. SENSORY neurons always carry signals FROM sense organs/receptors TO the CNS (spinal cord/brain); MOTOR neurons always carry commands FROM the CNS TO effector muscles/glands! 2. At the synapse gap between two neurons, the electrical impulse is converted into CHEMICAL neurotransmitters released from the axon ending to trigger the next neuron’s dendrite.',
        hi: '1. संवेदी न्यूरॉन सदैव ग्राही (त्वचा) से मेरुरज्जु की ओर संदेश ले जाते हैं, जबकि प्रेरक न्यूरॉन मेरुरज्जु से पेशी (Effector) तक आदेश लाते हैं! 2. दो न्यूरॉनों के बीच सिनेप्स (दरार) में विद्युत आवेग रासायनिक संकेतों में बदलकर अगले न्यूरॉन की द्रुमिका तक पहुँचता है।',
      },
      checkRule: {
        en: 'S-R-M Mnemonic: Sensory (In) → Relay (Spinal Cord) → Motor (Out to Muscle)!',
        hi: 'S-R-M सूत्र याद रखें: संवेदी (अंदर) → रिले (मेरुरज्जु) → प्रेरक (पेशी की ओर बाहर)!',
      },
    },
    hotsReasoningTask: {
      title: {
        en: 'HOTS Endocrine & Plant Coordination: Adrenaline Fight-or-Flight Cascade vs Auxin Phototropism',
        hi: 'उच्च स्तरीय समन्वय विश्लेषण: एड्रीनेलिन (लड़ो या भागो हार्मोन) एवं पादपों में ऑक्सिन द्वारा प्रकाशानुवर्तन',
      },
      prompt: {
        en: 'Explain scientifically: (a) How the secretion of Adrenaline into the blood prepares the human body for an emergency “fight or flight” situation; (b) How Auxin hormone causes a plant shoot tip to bend towards unilateral light (positive phototropism).',
        hi: 'वैज्ञानिक कारण स्पष्ट कीजिए: (a) रुधिर में एड्रीनेलिन हार्मोन का स्राव होने पर हमारे शरीर में आपातकालीन स्थिति का सामना करने के लिए क्या अनुक्रिया होती है? (b) ऑक्सिन हार्मोन पादप प्ररोह (तनाव) को एकदिशिक प्रकाश की ओर कैसे झुकाता है?',
      },
      claimOptions: [
        {
          en: '(a) Adrenaline increases heart beat, breathing rate (rib/diaphragm contraction), and diverts blood from skin/digestive system to skeletal muscles to supply more O₂. (b) When light falls from one side, Auxin diffuses to the SHADED side of the shoot, stimulating cells on the shaded side to grow longer so the shoot bends towards light.',
          hi: '(a) एड्रीनेलिन हृदय की धड़कन व श्वसन दर बढ़ाता है तथा पाचन तंत्र/त्वचा से रुधिर को कंकाल पेशियों की ओर मोड़कर अधिक ऑक्सीजन पहुँचाता है। (b) एक ओर से प्रकाश पड़ने पर ऑक्सिन प्ररोह के छाया वाले (अंधेरे) भाग में विसरित हो जाता है और वहाँ की कोशिकाओं की लंबाई में वृद्धि कर तने को प्रकाश की ओर मोड़ देता है।',
        },
        {
          en: 'Adrenaline slows down the heart beat, and Auxin concentrates on the sunny side of the shoot to shrink cells.',
          hi: 'एड्रीनेलिन हृदय की धड़कन धीमी करता है और ऑक्सिन धूप वाले हिस्से में जमा होकर कोशिकाओं को सिकोड़ता है।',
        },
      ],
      correctClaimIndex: 0,
      claimExplanation: {
        en: 'Adrenaline acts directly on the heart, arterioles, and diaphragm to maximize oxygen delivery to skeletal muscles. In plant shoots, Auxin accumulates on the shaded side away from light, elongating shaded cells faster than lit cells and curving the stem towards the light source.',
        hi: 'एड्रीनेलिन हृदय, श्वसन और रुधिर प्रवाह को नियंत्रित कर पेशियों को तुरंत अधिक ऑक्सीजन उपलब्ध कराता है। पादप प्ररोह में ऑक्सिन छाया वाले भाग में एकत्र होकर वहाँ की कोशिकाओं को अधिक लंबा करता है जिससे प्ररोह प्रकाश की ओर झुक जाता है।',
      },
      rubricPoints: [
        {
          en: 'Explains Adrenaline cardiovascular effect: heart beats faster and blood is diverted from digestive system/skin to skeletal muscles.',
          hi: 'एड्रीनेलिन का प्रभाव लिखता है: हृदय की धड़कन तेज़ होती है और रुधिर पाचन तंत्र/त्वचा से कंकाल पेशियों की ओर मुड़ जाता है।',
        },
        {
          en: 'Explains Adrenaline respiratory effect: breathing rate increases due to faster contraction of diaphragm and rib muscles, supplying more O₂.',
          hi: 'श्वसन प्रभाव बताता है: डायाफ्राम तथा पसलियों की पेशियों के संकुचन से श्वसन दर बढ़कर अधिक ऑक्सीजन मिलती है।',
        },
        {
          en: 'Explains Auxin phototropism mechanism: Auxin diffuses to the SHADED side of the shoot tip and stimulates those cells to grow longer, bending the shoot towards light.',
          hi: 'ऑक्सिन प्रकाशानुवर्तन स्पष्ट करता है: ऑक्सिन प्ररोह के छाया वाले भाग में विसरित होकर वहाँ की कोशिकाओं की लंबाई बढ़ाता है जिससे तना प्रकाश की ओर मुड़ता है।',
        },
      ],
    },
  },

  'mendelian-punnett-heredity': {
    ncertSection: 'NCERT Class 10 Chapter 8: Heredity (Sec 8.2 — Rules for the Inheritance of Traits: Mendel’s Contributions & Sex Determination)',
    openingQuestion: {
      en: '“Why did crossing a pure tall pea plant (TT) with a pure dwarf pea plant (tt) never produce a medium-sized plant—and how did the dwarf trait reappear intact in one-fourth of the grandchildren (F₂)?”',
      hi: '“शुद्ध लंबे मटर के पौधे (TT) और शुद्ध बौने पौधे (tt) के संकरण से कभी भी मध्यम ऊँचाई का पौधा क्यों नहीं बना—और F₂ पीढ़ी के एक-चौथाई पौधों में वही बौना लक्षण बिल्कुल सुरक्षित कैसे वापस आ गया?”',
    },
    experimentProtocol: {
      goal: {
        en: 'Use the 2×2 Punnett Square generator to compare Mendel’s F₁ cross (TT × tt), F₂ self-cross (Tt × Tt), and Test cross (Tt × tt), distinguishing Phenotype ratios from underlying Genotype ratios.',
        hi: '2×2 पनेट वर्ग की सहायता से मेंडल के F₁ संकरण (TT × tt), F₂ स्वपरागण (Tt × Tt) तथा परीक्षार्थ संकरण (Tt × tt) की तुलना करें और लक्षणप्ररूप (Phenotype) तथा जीनप्ररूप (Genotype) अनुपात में अंतर समझें।',
      },
      steps: [
        {
          en: 'Click “1. F₁ Cross (TT × tt → 100% Tt Tall)”. Observe in the 2×2 Punnett Square that every cell receives T from Parent 1 and t from Parent 2, producing 100% Tt plants that all look Tall!',
          hi: '“1. F₁ संकरण (TT × tt)” पर क्लिक करें। पनेट वर्ग में देखें कि प्रत्येक खाने में एक T और एक t आने से 100% Tt (सभी लंबे) पौधे बनते हैं!',
        },
        {
          en: 'Click “2. F₂ Self-Cross (Tt × Tt)” with Sample Size N = 400 plants. Observe that the 4 Punnett cells split into 1 TT : 2 Tt : 1 tt (Genotype 1:2:1), while TT and Tt both look Tall giving 300 Tall : 100 Dwarf (Phenotype 3:1)!',
          hi: 'N = 400 पौधों के साथ “2. F₂ स्वपरागण (Tt × Tt)” चुनें। देखें कि पनेट वर्ग में 1 TT : 2 Tt : 1 tt (जीनप्ररूप 1:2:1) बनता है, जबकि TT व Tt दोनों लंबे होने से 300 लंबे : 100 बौने (लक्षणप्ररूप 3:1) मिलते हैं!',
        },
        {
          en: 'Click “3. Test Cross (Tt × tt → 1:1)”. Notice that crossing a heterozygous Tt plant with a recessive tt plant yields 50% Tt (Tall) and 50% tt (Dwarf) — the standard test to prove an unknown tall plant is Tt rather than TT!',
          hi: '“3. परीक्षार्थ संकरण (Tt × tt)” चुनें। देखें कि 50% लंबे (Tt) और 50% बौने (tt) पौधे (1:1 अनुपात) मिलते हैं, जिससे सिद्ध होता है कि लंबा जनक विषमयुग्मजी (Tt) है!',
        },
      ],
      observationCheck: {
        prompt: {
          en: 'In Mendel’s F₂ generation (Tt × Tt) on the Punnett Square bench, what fraction of the TALL F₂ plants are actually heterozygous (Tt) carriers of the hidden recessive dwarf allele?',
          hi: 'पनेट वर्ग बेंच पर मेंडल की F₂ पीढ़ी (Tt × Tt) में प्राप्त कुल लंबे (Tall) पौधों में से कितने भाग पौधे वास्तव में विषमयुग्मजी (Tt) होते हैं जिनमें बौनेपन का अप्रभावी जीन छिपा रहता है?',
        },
        options: [
          {
            en: '2/3 of the tall plants (Out of 3 tall cells—1 TT and 2 Tt—two are Tt; or 2/4 = 50% of all F₂ plants).',
            hi: 'लंबे पौधों का 2/3 भाग (3 लंबे खानों—1 TT तथा 2 Tt—में से 2 खाने Tt हैं; अर्थात कुल F₂ पौधों का 50%)।',
          },
          {
            en: '0% of the tall plants (all tall plants are pure TT).',
            hi: '0% (सभी लंबे पौधे शुद्ध TT होते हैं)।',
          },
          {
            en: '100% of the tall plants are Tt.',
            hi: '100% लंबे पौधे Tt होते हैं।',
          },
        ],
        correctIndex: 0,
        explanation: {
          en: 'In the 1 TT : 2 Tt : 1 tt F₂ grid, 3 out of 4 squares produce Tall plants (1 TT + 2 Tt). Therefore 1/3 of the tall plants are pure homozygous (TT) and 2/3 of the tall plants are heterozygous (Tt)!',
          hi: '1 TT : 2 Tt : 1 tt में से 3 खाने लंबे पौधे देते हैं (1 TT + 2 Tt)। अतः लंबे पौधों में से 1/3 शुद्ध (TT) और 2/3 विषमयुग्मजी (Tt) होते हैं!',
        },
      },
    },
    discoveryNotes: {
      physicalMeaning: {
        en: 'Cellular DNA is the information source for making proteins (enzymes). The dominant allele T codes for an active enzyme that synthesizes plenty of plant growth hormone (leading to Tall height even with one copy in Tt). The mutated recessive allele t codes for a non-functional/less-efficient enzyme, so a plant is Dwarf only when it lacks T completely (tt).',
        hi: 'कोशिका का DNA प्रोटीन (एंजाइम) संश्लेषण की सूचना देता है। प्रभावी विकल्पी T दक्ष एंजाइम बनाता है जो पर्याप्त वृद्धि हार्मोन उत्पन्न कर पौधे को लंबा बनाता है (Tt में एक प्रति भी पर्याप्त है)। अप्रभावी विकल्पी t कम दक्ष एंजाइम बनाता है, इसलिए केवल tt अवस्था में ही पौधा बौना रहता है।',
      },
      scalingRule: {
        en: '1. Monohybrid F₂ (Tt × Tt): Phenotype = 3 : 1; Genotype = 1 : 2 : 1.  2. Dihybrid F₂ (RrYy × RrYy, Independent Assortment): Phenotype = 9 : 3 : 3 : 1.  3. Human Sex Determination (XX × XY): 1 XX (Girl) : 1 XY (Boy) = 50% : 50%.',
        hi: '1. एकसंकर F₂ (Tt × Tt): लक्षणप्ररूप = 3 : 1; जीनप्ररूप = 1 : 2 : 1।  2. द्विसंकर F₂ (RrYy × RrYy, स्वतंत्र अपव्यूहन): लक्षणप्ररूप = 9 : 3 : 3 : 1।  3. मानव लिंग निर्धारण (XX × XY): 50% लड़की (XX) : 50% लड़का (XY)।',
      },
      siUnitRule: {
        en: 'Each diploid somatic cell carries 2 copies of each chromosome (2n = 46 in humans); gametes (sperm/egg) are haploid (n = 23) carrying exactly 1 allele per gene.',
        hi: 'मानव की कायिक कोशिका में 23 जोड़े (46) गुणसूत्र होते हैं, जबकि युग्मक (शुक्राणु/अंडाणु) में आधी संख्या (23 गुणसूत्र, प्रत्येक जीन का 1 विकल्पी) होती है।',
      },
    },
    workedNumerical: {
      title: {
        en: 'NCERT Class 10 Ch 8 · Dihybrid Independent Assortment Count in 1600 Pea Seeds',
        hi: 'NCERT कक्षा 10 अध्याय 8 · द्विसंकर संकरण (9:3:3:1) में 1600 बीजों का वितरण',
      },
      problem: {
        en: 'Mendel crossed pea plants having Round Yellow seeds (RRYY) with Wrinkled Green seeds (rryy). All F₁ seeds were Round Yellow (RrYy). When F₁ plants were self-pollinated, 1,600 F₂ seeds were collected. Using the 9 : 3 : 3 : 1 Law of Independent Assortment, calculate how many seeds of each of the 4 phenotypes were obtained.',
        hi: 'मेंडल ने गोल-पीले बीजों (RRYY) वाले मटर के पौधे का झुर्रीदार-हरे बीजों (rryy) वाले पौधे से संकरण कराया। F₁ के सभी बीज गोल-पीले (RrYy) थे। F₁ के स्वपरागण से कुल 1,600 F₂ बीज प्राप्त हुए। 9 : 3 : 3 : 1 स्वतंत्र अपव्यूहन नियम से चारों प्रकार के बीजों की संख्या ज्ञात कीजिए।',
      },
      given: [
        { en: 'Total F₂ seeds N = 1,600', hi: 'कुल F₂ बीज N = 1,600' },
        { en: 'Dihybrid phenotypic ratio = 9 : 3 : 3 : 1 (Total parts = 9 + 3 + 3 + 1 = 16 parts)', hi: 'द्विसंकर अनुपात = 9 : 3 : 3 : 1 (कुल भाग = 16)' },
      ],
      formula: 'Count of phenotype = (Ratio Part / 16) × Total Seeds N',
      substitution: '1 part = 1600 / 16 = 100 seeds ⇒ Round Yellow (9) = 900; Round Green (3) = 300; Wrinkled Yellow (3) = 300; Wrinkled Green (1) = 100',
      answer: {
        en: '900 Round Yellow : 300 Round Green : 300 Wrinkled Yellow : 100 Wrinkled Green.',
        hi: '900 गोल-पीले : 300 गोल-हरे : 300 झुर्रीदार-पीले : 100 झुर्रीदार-हरे बीज।',
      },
      unitTrapNote: {
        en: 'Notice that the two new recombinant combinations (Round Green 3/16 and Wrinkled Yellow 3/16) prove that seed shape (R/r) and seed colour (Y/y) are inherited INDEPENDENTLY of each other!',
        hi: 'दो नए संयोजनों (गोल-हरे 3/16 तथा झुर्रीदार-पीले 3/16) का बनना सिद्ध करता है कि बीज के आकार और रंग के लक्षण एक-दूसरे से स्वतंत्र रूप से वंशानुगत होते हैं!',
      },
    },
    contrastTrap: {
      trapTitle: {
        en: 'Confusing the 3:1 Phenotypic Ratio With the 1:2:1 Genotypic Ratio or Thinking Acquired Traits Are Inherited',
        hi: '3:1 लक्षणप्ररूप अनुपात और 1:2:1 जीनप्ररूप अनुपात में भ्रम करना या उपार्जित लक्षणों को वंशानुगत मान लेना',
      },
      commonMistake: {
        en: 'Writing “1:2:1” when asked for the F₂ phenotypic ratio (Tall : Dwarf), or claiming that cutting the tails of mice for several generations will produce tail-less baby mice.',
        hi: 'F₂ का लक्षणप्ररूप (Phenotypic) अनुपात पूछे जाने पर “1:2:1” लिख देना, या यह सोचना कि चूहों की पूँछ काटने से अगली पीढ़ी में बिना पूँछ वाले चूहे पैदा होंगे।',
      },
      correctPhysics: {
        en: '1. Phenotype is external observable appearance (3 Tall : 1 Dwarf = 3:1); Genotype is the internal allele code (1 TT : 2 Tt : 1 tt = 1:2:1). 2. Acquired traits during an individual’s lifetime (like a cut tail or muscle size) only affect non-reproductive somatic tissues and do NOT alter the DNA of germ cells (gametes), so they cannot be passed to offspring!',
        hi: '1. लक्षणप्ररूप बाह्य दिखाई देने वाला गुण है (3 लंबे : 1 बौना = 3:1), जबकि जीनप्ररूप आंतरिक जीन संरचना है (1 TT : 2 Tt : 1 tt = 1:2:1)। 2. जीवनकाल में उपार्जित लक्षण कायिक ऊतकों तक सीमित रहते हैं और जनन कोशिकाओं के DNA में परिवर्तन नहीं करते, इसलिए वंशानुगत नहीं होते!',
      },
      checkRule: {
        en: 'Phenotype = Physical appearance (3 : 1). Genotype = Genetic letters (1 TT : 2 Tt : 1 tt)!',
        hi: 'लक्षणप्ररूप (Phenotype) = बाह्य रूप (3 : 1)। जीनप्ररूप (Genotype) = जीन अक्षर (1 TT : 2 Tt : 1 tt)!',
      },
    },
    hotsReasoningTask: {
      title: {
        en: 'HOTS Human Genetics: How Sex of a Child is Determined in Human Beings (XX vs XY)',
        hi: 'उच्च स्तरीय मानव आनुवंशिकी: मानव में बच्चे का लिंग निर्धारण कैसे होता है? (XX बनाम XY)',
      },
      prompt: {
        en: 'In human beings, the statistical probability of a baby being a boy or a girl is 50% : 50%. Explain scientifically using a Punnett cross of human sex chromosomes (Mother XX × Father XY) why the sex of a child is determined solely by the chromosome inherited from the father.',
        hi: 'मानव में लड़का या लड़की होने की सांख्यिकीय प्रायिकता 50% : 50% होती है। लिंग गुणसूत्रों (माता XX × पिता XY) के आरेख द्वारा वैज्ञानिक रूप से स्पष्ट कीजिए कि बच्चे का लिंग इस बात पर क्यों निर्भर करता है कि उसे पिता से किस प्रकार का गुणसूत्र प्राप्त हुआ है।',
      },
      claimOptions: [
        {
          en: 'Women have a perfect pair of sex chromosomes (XX), so all eggs carry an X chromosome. Men have a mismatched pair (XY), producing 50% X-sperm and 50% Y-sperm. Fertilization by an X-sperm yields a girl (XX, 50%), while fertilization by a Y-sperm yields a boy (XY, 50%).',
          hi: 'स्त्रियों में लिंग गुणसूत्रों का पूर्ण युग्म (XX) होता है इसलिए सभी अंडाणुओं में X गुणसूत्र होता है। पुरुषों में (XY) होने से 50% शुक्राणु X तथा 50% शुक्राणु Y वाले होते हैं। पिता से X मिलने पर लड़की (XX, 50%) तथा Y मिलने पर लड़का (XY, 50%) होता है।',
        },
        {
          en: 'Mother produces both X and Y eggs while father produces only X sperm.',
          hi: 'माता X और Y दोनों अंडाणु बनाती है जबकि पिता केवल X शुक्राणु बनाता है।',
        },
      ],
      correctClaimIndex: 0,
      claimExplanation: {
        en: 'All children inherit an X chromosome from their mother regardless of whether they are boys or girls. Thus, the sex of the child is determined by whether the father’s sperm contributes an X chromosome (forming XX, female) or a Y chromosome (forming XY, male).',
        hi: 'सभी बच्चे अपनी माता से सदैव X गुणसूत्र ही प्राप्त करते हैं। अतः बच्चे का लिंग पिता से मिलने वाले शुक्राणु के गुणसूत्र (X मिलने पर XX लड़की, Y मिलने पर XY लड़का) द्वारा निर्धारित होता है।',
      },
      rubricPoints: [
        {
          en: 'States human sex chromosome pairs: Mother is homogametic (XX, all ova carry X) and Father is heterogametic (XY, 50% X-sperm and 50% Y-sperm).',
          hi: 'माता के लिंग गुणसूत्र (XX, सभी अंडाणुओं में X) तथा पिता के गुणसूत्र (XY, 50% X-शुक्राणु व 50% Y-शुक्राणु) का उल्लेख करता है।',
        },
        {
          en: 'Shows the zygote combinations: Egg (X) + Sperm (X) → XX (Female/Girl, 50%); Egg (X) + Sperm (Y) → XY (Male/Boy, 50%).',
          hi: 'युग्मनज संयोजन दर्शाता है: X + X → XX (लड़की, 50%) तथा X + Y → XY (लड़का, 50%)।',
        },
        {
          en: 'Concludes that since the mother always contributes an X chromosome, the child’s sex depends on whether it inherits an X or Y chromosome from the father.',
          hi: 'निष्कर्ष निकालता है कि माता सदैव X देती है, अतः लिंग निर्धारण पिता से प्राप्त होने वाले गुणसूत्र (X या Y) पर निर्भर करता है।',
        },
      ],
    },
  },

  'trophic-energy-magnification': {
    ncertSection: 'NCERT Class 10 Chapter 13: Our Environment (Sec 13.1 — Eco-systems, Food Chains, 10% Energy Law & Biological Magnification)',
    openingQuestion: {
      en: '“Why does usable energy shrink by 10 times at every step up a food chain, while non-biodegradable pesticides like DDT multiply in concentration up the exact same food chain?”',
      hi: '“आहार श्रृंखला में ऊपर जाते समय प्रत्येक चरण में उपयोगी ऊर्जा 10 गुना घटती जाती है, जबकि उसी आहार श्रृंखला में DDT जैसे अजैव-निम्निकरणीय कीटनाशकों की सांद्रता ऊपर की ओर क्यों बढ़ती जाती है?”',
    },
    experimentProtocol: {
      goal: {
        en: 'Trace energy flow from Incident Sunlight (1% capture by leaves) through T₁ → T₂ → T₃ → T₄ (Lindeman’s 10% Law) alongside the inverted Biological Magnification pyramid of persistent pesticides.',
        hi: 'आपतित सौर ऊर्जा (पत्तियों द्वारा 1% ग्रहण) से T₁ → T₂ → T₃ → T₄ तक 10% ऊर्जा स्थानांतरण नियम तथा अजैव-निम्निकरणीय कीटनाशकों के उल्टे जैव-आवर्धन पिरामिड का तुलनात्मक परीक्षण करें।',
      },
      steps: [
        {
          en: 'Set Incident Solar Energy on Leaves = 1,000,000 J (10⁶ J). Observe in Panel 1 that T₁ Green Plants capture 1% of sunlight = 10,000 J.',
          hi: 'पत्तियों पर आपतित सौर ऊर्जा = 10,00,000 J (10⁶ J) रखें। पैनल 1 में देखें कि T₁ हरे पौधे सौर ऊर्जा का 1% भाग = 10,000 J खाद्य ऊर्जा में बदलते हैं।',
        },
        {
          en: 'Follow the 10% consumer steps upward: T₂ Grasshopper gets 1,000 J (9,000 J lost as heat!), T₃ Snake gets 100 J, and T₄ Hawk gets only 10 J—leaving too little energy to support a 5th or 6th trophic level!',
          hi: '10% नियम के अनुसार ऊपर देखें: T₂ टिड्डे को 1,000 J (9,000 J ऊष्मा हानि!), T₃ साँप को 100 J और T₄ बाज को केवल 10 J ऊर्जा मिलती है—इसीलिए चौथे स्तर के बाद पर्याप्त ऊर्जा नहीं बचती!',
        },
        {
          en: 'In Panel 2, set Persistent Pesticide at T₁ = 0.02 ppm. Observe how DDT concentrates 10-fold at each step up to 20.0 ppm in the T₄ Top Predator (Biological Magnification)!',
          hi: 'पैनल 2 में T₁ पर कीटनाशक सांद्रता 0.02 ppm रखें। देखें कि प्रत्येक स्तर पर DDT संचित होते हुए T₄ शीर्ष उपभोक्ता में बढ़कर 20.0 ppm हो जाता है (जैव-आवर्धन)!',
        },
      ],
      observationCheck: {
        prompt: {
          en: 'On the Trophic Energy Pyramid bench, when 500,000 J of solar energy falls on green plant leaves, how much energy is captured by T₁ Producers and how much reaches T₃ Secondary Consumers?',
          hi: 'जब हरे पौधों की पत्तियों पर 5,00,000 J सौर ऊर्जा पड़ती है, तो T₁ उत्पादकों द्वारा कितनी ऊर्जा संचित की जाती है और T₃ द्वितीयक उपभोक्ताओं तक कितनी ऊर्जा पहुँचती है?',
        },
        options: [
          {
            en: 'T₁ Producers capture 1% of 500,000 J = 5,000 J; T₂ gets 10% = 500 J; and T₃ Secondary Consumers receive 10% of 500 J = 50 J.',
            hi: 'T₁ उत्पादक 5,00,000 J का 1% = 5,000 J पकड़ते हैं; T₂ को 10% = 500 J तथा T₃ द्वितीयक उपभोक्ता को 10% = 50 J ऊर्जा मिलती है।',
          },
          {
            en: 'T₁ captures 50,000 J (10% of sunlight) and T₃ gets 500 J.',
            hi: 'T₁ 50,000 J पकड़ता है और T₃ को 500 J मिलता है।',
          },
          {
            en: 'T₃ receives more energy than T₁ due to biological magnification.',
            hi: 'जैव-आवर्धन के कारण T₃ को T₁ से अधिक ऊर्जा मिलती है।',
          },
        ],
        correctIndex: 0,
        explanation: {
          en: 'Sun → T₁ uses the 1% rule (0.01 × 500,000 = 5,000 J). T₁ → T₂ → T₃ uses the 10% rule twice (5,000 × 0.1 × 0.1 = 50 J).',
          hi: 'सूर्य → T₁ पर 1% नियम (5,00,000 का 1% = 5,000 J) तथा T₁ → T₂ → T₃ पर दो बार 10% नियम (5,000 → 500 → 50 J) लागू होता है।',
        },
      },
    },
    discoveryNotes: {
      physicalMeaning: {
        en: 'At every trophic level, organisms spend ~90% of their ingested food energy on respiration, movement, digestion, and heat loss to the environment. Only ~10% is converted into new body biomass available to be eaten by the next trophic level. Non-biodegradable toxins, however, dissolve in body fat and cannot be broken down, so a predator eating 10 herbivores ingests all 10 doses of toxin!',
        hi: 'प्रत्येक पोषी स्तर पर जीव अपनी ऊर्जा का ~90% भाग श्वसन, गति व ऊष्मा में खर्च कर देते हैं और केवल ~10% ऊर्जा ही जैव-मात्रा के रूप में अगले स्तर को मिलती है। परंतु अजैव-निम्निकरणीय विष (DDT) विघटित न होने के कारण प्रत्येक उच्च स्तर के जीवों के वसा ऊतकों में जमा होते जाते हैं!',
      },
      scalingRule: {
        en: '1. Solar Capture (Sun → T₁): E₁ = 0.01 × E_sun (1%).  2. Consumer Transfer (T₁ → T₂ → T₃ → T₄): E_n = 0.10 × E_(n−1) (10% Law).  3. Direction: Energy flow is strictly UNIDIRECTIONAL (never returns to Sun or lower levels).',
        hi: '1. सौर ग्रहण (सूर्य → T₁): E₁ = 1% × E_सूर्य।  2. उपभोक्ता स्थानांतरण (T₁ → T₂ → T₃ → T₄): E_n = 10% × E_(n−1)।  3. ऊर्जा प्रवाह सदैव एकदिशिक (Unidirectional) होता है।',
      },
      siUnitRule: {
        en: 'Energy across trophic levels is measured in Joules (J) or kilojoules (kJ). Pesticide/toxin concentration in biological magnification is measured in parts per million (ppm).',
        hi: 'पोषी स्तरों की ऊर्जा जूल (J) या किलोजूल (kJ) में तथा जैव-आवर्धन में रसायनों की सांद्रता ppm (parts per million) में मापी जाती है।',
      },
    },
    workedNumerical: {
      title: {
        en: 'NCERT Class 10 Ch 13 · Comparing Direct Vegetarian Diet vs 4-Step Carnivore Chain Efficiency',
        hi: 'NCERT कक्षा 10 अध्याय 13 · 2-स्तरीय बनाम 4-स्तरीय आहार श्रृंखला में मानव को प्राप्त ऊर्जा',
      },
      problem: {
        en: 'Suppose green crop plants in a field store 20,000 J of food energy at T₁. Compare how much energy reaches Human Beings in Chain A (Plants T₁ → Humans T₂) versus Chain B (Plants T₁ → Insects T₂ → Fish T₃ → Humans T₄).',
        hi: 'मान लीजिए खेत के हरे पौधों (T₁) में 20,000 J खाद्य ऊर्जा संचित है। तुलना कीजिए कि श्रृंखला A (पौधे T₁ → मनुष्य T₂) बनाम श्रृंखला B (पौधे T₁ → कीट T₂ → मछली T₃ → मनुष्य T₄) में मनुष्य को कितनी ऊर्जा प्राप्त होगी?',
      },
      given: [
        { en: 'Energy at Producer level T₁ = 20,000 J', hi: 'उत्पादक स्तर T₁ पर ऊर्जा = 20,000 J' },
        { en: 'Chain A places Humans at T₂ (1 step); Chain B places Humans at T₄ (3 steps)', hi: 'श्रृंखला A में मनुष्य T₂ पर है; श्रृंखला B में मनुष्य T₄ पर है' },
      ],
      formula: 'E_n = E₁ × (0.1)^(n − 1)',
      substitution: 'Chain A (Humans at T₂): 20,000 × 0.1 = 2,000 J  |  Chain B (Humans at T₄): 20,000 × (0.1)³ = 20 J (100× less energy and 100× more DDT!)',
      answer: {
        en: 'Humans receive 2,000 J in Chain A vs only 20 J in Chain B (100× more energy in the shorter food chain!).',
        hi: 'श्रृंखला A में मनुष्य को 2,000 J ऊर्जा मिलती है जबकि श्रृंखला B में केवल 20 J (छोटी श्रृंखला से 100 गुना अधिक ऊर्जा मिलती है!)।',
      },
      unitTrapNote: {
        en: 'Read carefully whether the given energy is “incident sunlight on leaves” (apply 1% first to get T₁!) or “energy already present at producer T₁” (apply 10% directly to get T₂)!',
        hi: 'प्रश्न में ध्यान से पढ़ें कि दी गई ऊर्जा “पत्तियों पर पड़ने वाली सौर ऊर्जा” है (तब T₁ के लिए पहले 1% लगाएं!) या “उत्पादक पौधों T₁ में संचित ऊर्जा” है (तब T₂ के लिए सीधे 10% लगाएं)!',
      },
    },
    contrastTrap: {
      trapTitle: {
        en: 'Applying the 10% Rule to Incident Sunlight (Instead of 1%) or Thinking Decomposers Recycle Energy Back to Plants',
        hi: 'आपतित सौर ऊर्जा पर 1% के बजाय 10% नियम लगा देना या यह सोचना कि अपघटक ऊर्जा को वापस पौधों में चक्रित करते हैं',
      },
      commonMistake: {
        en: 'When given 100,000 J of sunlight falling on leaves, taking 10% (10,000 J) as producer energy instead of 1% (1,000 J), or stating that energy is cyclically recycled in an ecosystem like carbon and nitrogen.',
        hi: 'पत्तियों पर पड़ने वाली 1,00,000 J सौर ऊर्जा का 10% (10,000 J) उत्पादक ऊर्जा ले लेना (जबकि पौधे केवल 1% = 1,000 J पकड़ते हैं), या यह लिखना कि पारितंत्र में ऊर्जा का चक्रीय प्रवाह होता है।',
      },
      correctPhysics: {
        en: '1. Green plants capture only 1% of incident solar energy (NCERT Sec 13.1.1); the 10% rule applies ONLY from T₁ Producers to T₂ Consumers and upward! 2. Matter/nutrients (C, N, P) are recycled by decomposers, but ENERGY flow is strictly UNIDIRECTIONAL—lost heat can never be reused by plants for photosynthesis!',
        hi: '1. हरे पौधे पत्तियों पर पड़ने वाली सौर ऊर्जा का केवल 1% भाग पकड़ते हैं; 10% नियम केवल एक पोषी स्तर से अगले उपभोक्ता स्तर (T₁ → T₂ → T₃) के बीच लगता है! 2. पोषक तत्वों का पुनर्चक्रण होता है, परंतु ऊर्जा का प्रवाह सदैव एकदिशिक (Unidirectional) होता है!',
      },
      checkRule: {
        en: 'Sun → Green Plant T₁ = 1% (÷100).  T₁ → T₂ → T₃ → T₄ = 10% (÷10 each step)!',
        hi: 'सूर्य → हरे पौधे (T₁) = 1% (÷100)।  T₁ → T₂ → T₃ → T₄ = 10% (प्रत्येक चरण में ÷10)!',
      },
    },
    hotsReasoningTask: {
      title: {
        en: 'HOTS Environmental Science: Stratospheric Ozone (O₃) Formation, CFC Depletion & Why Food Chains Have Only 3–4 Levels',
        hi: 'उच्च स्तरीय पर्यावरण विज्ञान: ओज़ोन परत (O₃) का निर्माण व क्षय तथा आहार श्रृंखला में सीमित पोषी स्तर',
      },
      prompt: {
        en: 'Explain scientifically: (a) Why food chains generally consist of only three or four steps (trophic levels); (b) How ozone (O₃) is formed in the upper atmosphere by UV radiation and why CFCs (chlorofluorocarbons) cause ozone depletion.',
        hi: 'वैज्ञानिक कारण स्पष्ट कीजिए: (a) किसी आहार श्रृंखला में सामान्यतः केवल तीन या चार चरण (पोषी स्तर) ही क्यों होते हैं? (b) वायुमंडल के उच्चतर स्तर पर पराबैंगनी (UV) विकिरण से ओज़ोन (O₃) कैसे बनती है और CFC इसका क्षय क्यों करते हैं?',
      },
      claimOptions: [
        {
          en: '(a) Because 90% of energy is lost at each step and only 10% reaches the next level, the usable energy left after 4 levels is too small to support another population. (b) High-energy UV splits O₂ into free O atoms (O₂ → O + O), which combine with O₂ to form Ozone (O + O₂ → O₃); chlorine from CFC refrigerants catalytically destroys O₃, letting harmful UV cause skin cancer.',
          hi: '(a) प्रत्येक चरण में 90% ऊर्जा की हानि होने और केवल 10% आगे जाने के कारण चौथे पोषी स्तर के बाद इतनी कम ऊर्जा बचती है कि अगले स्तर का पोषण संभव नहीं होता। (b) UV विकिरण O₂ को स्वतंत्र O परमाणुओं में तोड़ता है (O₂ → O + O) जो O₂ से जुड़कर ओज़ोन (O + O₂ → O₃) बनाते हैं; CFC ओज़ोन परत को नष्ट करते हैं।',
        },
        {
          en: 'Food chains stop at 4 levels because animals run out of space, and ozone is formed by green plants.',
          hi: 'स्थान की कमी से आहार श्रृंखला 4 स्तरों पर रुकती है और ओज़ोन हरे पौधों द्वारा बनती है।',
        },
      ],
      correctClaimIndex: 0,
      claimExplanation: {
        en: 'A 10³ reduction from T₁ to T₄ leaves only 0.1% of T₁’s energy at T₄. In the stratosphere, UV splits O₂ into atomic oxygen O, forming O₃ (O + O₂ → O₃), which shields Earth from UV radiation.',
        hi: 'T₁ से T₄ तक पहुँचते-पहुँचते केवल 0.1% ऊर्जा बचती है। समतापमंडल में UV किरणें O₂ को तोड़कर O₃ बनाती हैं जो पृथ्वी की UV विकिरण से रक्षा करती है।',
      },
      rubricPoints: [
        {
          en: 'Explains the 3–4 trophic level limit using the 10% Law: 90% energy loss at each step leaves negligible usable energy after 4 levels.',
          hi: '10% नियम के आधार पर स्पष्ट करता है कि प्रत्येक चरण में 90% ऊर्जा हानि के कारण चौथे स्तर के बाद अत्यंत कम उपयोगी ऊर्जा बचती है।',
        },
        {
          en: 'Writes the 2-step photochemical formation of Ozone: (1) O₂ + UV → O + O; (2) O + O₂ → O₃ (Ozone).',
          hi: 'ओज़ोन निर्माण के दोनों समीकरण लिखता है: (1) O₂ + UV → O + O; (2) O + O₂ → O₃ (ओज़ोन)।',
        },
        {
          en: 'Explains the role of the ozone shield (absorbs harmful UV that causes skin cancer) and notes that synthetic CFCs deplete stratospheric O₃.',
          hi: 'ओज़ोन परत द्वारा हानिकारक UV विकिरण (त्वचा कैंसर का कारण) से सुरक्षा तथा CFC द्वारा ओज़ोन क्षय का उल्लेख करता है।',
        },
      ],
    },
  },
}
