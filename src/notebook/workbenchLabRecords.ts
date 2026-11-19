import type { Localized } from '../kit/i18n'
import type { StandaloneRouteId } from '../platform/routeRegistry'

export type WorkbenchRouteId = Exclude<StandaloneRouteId, 'learn' | 'revision'>

export const WORKBENCH_ROUTE_IDS: readonly WorkbenchRouteId[] = [
  'alternative',
  'electricity',
  'series-parallel',
  'resistivity',
  'power-heating',
  'billing',
  'safety',
]

export interface WorkbenchLabRecord {
  routeId: WorkbenchRouteId
  ncertActivityRef: string
  labTitle: Localized
  aim: Localized
  apparatusRequired: Localized
  governingEquation: string
  procedureSteps: readonly Localized[]
  observationCheck: {
    prompt: Localized
    options: readonly Localized[]
    correctIndex: number
    explanation: Localized
  }
  vivaVoceTrap: {
    question: Localized
    commonMistake: Localized
    correctAnswer: Localized
  }
  hotsClaimAndRubric: {
    title: Localized
    prompt: Localized
    claimOptions: readonly Localized[]
    correctClaimIndex: number
    claimExplanation: Localized
    rubricPoints: readonly [Localized, Localized, Localized]
  }
}

export const WORKBENCH_LAB_RECORDS: Record<WorkbenchRouteId, WorkbenchLabRecord> = {
  alternative: {
    routeId: 'alternative',
    ncertActivityRef: 'NCERT Class 10 Chapter 9 · Activity 9.12 (Convex Lens Optical Bench Practical)',
    labTitle: {
      en: 'Practical Record 1: Image Formation & Focal Crossover by a Convex Lens',
      hi: 'प्रायोगिक अभिलेख 1: उत्तल लेंस द्वारा प्रतिबिंब निर्माण एवं फोकस संक्रमण',
    },
    aim: {
      en: 'To determine the image position v, nature, and magnification m = v/u of a convex lens for object positions beyond 2F, at 2F, between F and 2F, and inside F.',
      hi: 'उत्तल लेंस के सामने 2F से परे, 2F पर, F तथा 2F के बीच एवं F के भीतर रखे बिंब के लिए प्रतिबिंब स्थिति v, प्रकृति तथा आवर्धन m = v/u ज्ञात करना।',
    },
    apparatusRequired: {
      en: 'Optical bench with centimetre scale, converging (convex) lens, illuminated object candle/arrow, and movable screen.',
      hi: 'सेमी पैमाने युक्त प्रकाशिक बेंच, उत्तल लेंस, प्रदीप्त बिंब (मोमबत्ती/तीर) तथा चल पर्दा।',
    },
    governingEquation: '1/v − 1/u = 1/f  |  m = hᵢ / hₒ = v / u',
    procedureSteps: [
      {
        en: 'Step 1: Set focal length f = +15 cm and place the object at 2F (u = −30 cm). Verify on the ray bench that a real, inverted, same-size image forms at v = +30 cm (m = −1.0).',
        hi: 'चरण 1: फोकस दूरी f = +15 cm रखें और बिंब को 2F (u = −30 cm) पर रखें। सत्यापित करें कि v = +30 cm पर वास्तविक, उल्टा व समान आकार (m = −1.0) का प्रतिबिंब बनता है।',
      },
      {
        en: 'Step 2: Move the object between F and 2F (e.g. u = −20 cm). Observe that the real inverted image moves beyond 2F (v = +60 cm) and enlarges (m = −3.0).',
        hi: 'चरण 2: बिंब को F और 2F के बीच (जैसे u = −20 cm) लाएं। देखें कि वास्तविक प्रतिबिंब 2F से परे (v = +60 cm) चला जाता है और आवर्धित (m = −3.0) हो जाता है।',
      },
      {
        en: 'Step 3: Move the object inside F (e.g. u = −10 cm). Observe that refracted rays diverge on the right and trace back to form a virtual, erect, magnified image on the same side (v = −30 cm, m = +3.0).',
        hi: 'चरण 3: बिंब को F के भीतर (जैसे u = −10 cm) रखें। देखें कि किरणें अपसरित होती हैं और पीछे बढ़ाने पर उसी ओर आभासी, सीधा व बड़ा प्रतिबिंब (v = −30 cm, m = +3.0) बनता है।',
      },
    ],
    observationCheck: {
      prompt: {
        en: 'On the Convex Lens Workbench with f = +15 cm, as you move the object from u = −30 cm (at 2F) to u = −20 cm (between F and 2F), how do image position v and magnification m change?',
        hi: 'f = +15 cm वाले उत्तल लेंस बेंच पर जब आप बिंब को u = −30 cm (2F) से u = −20 cm (F व 2F के बीच) ले जाते हैं, तो प्रतिबिंब स्थिति v और आवर्धन m कैसे बदलते हैं?',
      },
      options: [
        {
          en: 'Image moves farther right from v = +30 cm to v = +60 cm, and magnification changes from m = −1.0 to m = −3.0 (enlarged & inverted).',
          hi: 'प्रतिबिंब v = +30 cm से दूर v = +60 cm पर चला जाता है, और आवर्धन m = −1.0 से m = −3.0 (बड़ा व उल्टा) हो जाता है।',
        },
        {
          en: 'Image moves closer to the lens and becomes diminished.',
          hi: 'प्रतिबिंब लेंस के पास आ जाता है और छोटा हो जाता है।',
        },
        {
          en: 'Image immediately becomes virtual and erect at u = −20 cm.',
          hi: 'u = −20 cm पर प्रतिबिंब तुरंत आभासी और सीधा हो जाता है।',
        },
      ],
      correctIndex: 0,
      explanation: {
        en: 'By 1/v = 1/f + 1/u = 1/15 − 1/20 = +1/60 cm⁻¹, v = +60 cm (beyond 2F₂) and m = v/u = +60/(−20) = −3.0.',
        hi: '1/v = 1/15 − 1/20 = +1/60 से v = +60 cm तथा आवर्धन m = +60/(−20) = −3.0 प्राप्त होता है।',
      },
    },
    vivaVoceTrap: {
      question: {
        en: 'Why can a virtual image formed by a convex lens (when |u| < f) NEVER be captured on a cardboard screen placed behind the lens?',
        hi: 'जब बिंब फोकस के भीतर (|u| < f) होता है, तो उत्तल लेंस द्वारा बने आभासी प्रतिबिंब को पर्दे पर क्यों नहीं प्राप्त किया जा सकता?',
      },
      commonMistake: {
        en: 'Saying the screen is too small or too close to the lens.',
        hi: 'यह कहना कि पर्दा छोटा है या लेंस के बहुत पास रखा है।',
      },
      correctAnswer: {
        en: 'When |u| < f, the refracted rays emerging on the right side of the convex lens physically DIVERGE from one another and never intersect on a screen; only the human eye/brain projects them backward to a virtual intersection point on the object side.',
        hi: 'जब |u| < f होता है, तो लेंस से अपवर्तन के पश्चात किरणें वास्तव में फैलती (अपसरित होती) हैं और किसी पर्दे पर नहीं मिलतीं; केवल हमारी आँख उन्हें पीछे बढ़ाकर आभासी बिंदु पर देखती है।',
      },
    },
    hotsClaimAndRubric: {
      title: {
        en: 'Practical HOTS Conclusion: Half-Covered Convex Lens Experiment',
        hi: 'प्रायोगिक उच्च स्तरीय निष्कर्ष: आधे ढके उत्तल लेंस से प्रतिबिंब निर्माण',
      },
      prompt: {
        en: 'During the optical bench practical, a student covers the lower half of the convex lens with black opaque paper while focusing a real image of a candle on the screen. What happens to the completeness and brightness of the image on the screen? Explain using ray tracing.',
        hi: 'प्रकाशिक बेंच प्रयोग के दौरान एक छात्र उत्तल लेंस के निचले आधे भाग को काले अपारदर्शी कागज से ढक देता है। पर्दे पर बनने वाले वास्तविक प्रतिबिंब के आकार/पूर्णता और चमक पर क्या प्रभाव पड़ेगा? किरण आरेख के आधार पर स्पष्ट कीजिए।',
      },
      claimOptions: [
        {
          en: 'A FULL, complete image of the candle is still formed at the exact same screen position, but its brightness (intensity) decreases to roughly half.',
          hi: 'पर्दे पर उसी स्थान पर मोमबत्ती का पूरा (पूर्ण) प्रतिबिंब बनेगा, किंतु उसकी चमक (तीव्रता) लगभग आधी रह जाएगी।',
        },
        {
          en: 'Only the top half of the candle will appear on the screen, while the bottom half disappears.',
          hi: 'पर्दे पर केवल आधी मोमबत्ती दिखाई देगी और निचला आधा भाग गायब हो जाएगा।',
        },
        {
          en: 'No image will form on the screen at all.',
          hi: 'पर्दे पर कोई प्रतिबिंब नहीं बनेगा।',
        },
      ],
      correctClaimIndex: 0,
      claimExplanation: {
        en: 'Every point on the candle sends light rays in all directions across the entire lens aperture. Rays passing through the uncovered upper half still refract and converge to form the full image, but since half the light rays are blocked, image brightness drops.',
        hi: 'बिंब के प्रत्येक बिंदु से असंख्य किरणें निकलती हैं जो लेंस के खुले ऊपरी आधे भाग से अपवर्तित होकर पूरा प्रतिबिंब बनाती हैं। किंतु आधी किरणें रुक जाने से प्रतिबिंब की तीव्रता (चमक) घट जाती है।',
      },
      rubricPoints: [
        {
          en: 'States clearly that a complete (full) image of the object is formed at the same position v.',
          hi: 'स्पष्ट लिखता है कि पर्दे पर उसी स्थिति v पर वस्तु का पूरा (पूर्ण) प्रतिबिंब बनता है।',
        },
        {
          en: 'Explains that rays from every point of the object still pass through the uncovered upper half of the lens to converge at the image plane.',
          hi: 'कारण बताता है कि वस्तु के प्रत्येक बिंदु से आने वाली किरणें लेंस के खुले ऊपरी भाग से अपवर्तित होकर प्रतिबिंब बनाती हैं।',
        },
        {
          en: 'States that the brightness/intensity of the image decreases because half the light-gathering area is blocked.',
          hi: 'बताता है कि आधी प्रकाश किरणें रुक जाने के कारण प्रतिबिंब की चमक (तीव्रता) कम हो जाती है।',
        },
      ],
    },
  },

  electricity: {
    routeId: 'electricity',
    ncertActivityRef: 'NCERT Class 10 Chapter 11 (Old Ch 12) · Activity 12.1 (Ohm’s Law V–I Characteristic)',
    labTitle: {
      en: 'Practical Record 2: Verification of Ohm’s Law (V = I × R) & V–I Slope Analysis',
      hi: 'प्रायोगिक अभिलेख 2: ओम के नियम (V = I × R) का सत्यापन एवं V–I ग्राफ ढाल',
    },
    aim: {
      en: 'To study the dependence of potential difference (V) across a resistor on the electric current (I) passing through it and determine its resistance from the V–I graph.',
      hi: 'किसी प्रतिरोधक के सिरों के बीच विभवांतर (V) तथा प्रवाहित विद्युत धारा (I) के बीच संबंध का अध्ययन करना और V–I ग्राफ से प्रतिरोध ज्ञात करना।',
    },
    apparatusRequired: {
      en: 'DC battery eliminator, nichrome resistor coil, ammeter (in series), voltmeter (in parallel), rheostat, plug key, and connecting wires.',
      hi: 'बैटरी, नाइक्रोम प्रतिरोधक तार, एमीटर (श्रेणीक्रम में), वोल्टमीटर (पार्श्वक्रम में), धारा नियंत्रक (रियोस्टेट) तथा कुंजी।',
    },
    governingEquation: 'V = I × R  ⇒  R = V / I = Constant (at constant temperature)',
    procedureSteps: [
      {
        en: 'Step 1: Set resistance R = 10 Ω on the Ohm’s Law workbench and vary battery voltage V from 2 V to 6 V, then 10 V. Log each (V, I) reading into the data table.',
        hi: 'चरण 1: प्रतिरोध R = 10 Ω रखें और वोल्टेज V को 2 V, 6 V तथा 10 V पर बदलकर प्रत्येक (V, I) पाठ्यांक को सारणी में दर्ज करें।',
      },
      {
        en: 'Step 2: Inspect the plotted V–I graph. Verify that all data points lie on a straight line passing through the origin (0, 0) with constant ratio V/I = 10 Ω.',
        hi: 'चरण 2: V–I ग्राफ का निरीक्षण करें। सत्यापित करें कि सभी बिंदु मूल बिंदु (0, 0) से गुजरने वाली सीधी रेखा पर हैं जिनका अनुपात V/I = 10 Ω स्थिर है।',
      },
      {
        en: 'Step 3: Double the resistance to R = 20 Ω at fixed V = 10 V. Verify that the ammeter current halves from 1.0 A to 0.5 A.',
        hi: 'चरण 3: स्थिर V = 10 V पर प्रतिरोध दोगुना (R = 20 Ω) करें। सत्यापित करें कि एमीटर धारा 1.0 A से घटकर आधी (0.5 A) हो जाती है।',
      },
    ],
    observationCheck: {
      prompt: {
        en: 'In the Ohm’s Law practical with a fixed 15 Ω resistor, when you increase potential difference V from 3.0 V to 9.0 V (3×), what happens to the ammeter reading I and the ratio V/I?',
        hi: '15 Ω के स्थिर प्रतिरोधक में जब विभवांतर V को 3.0 V से बढ़ाकर 9.0 V (3 गुना) किया जाता है, तो धारा I और अनुपात V/I पर क्या प्रभाव पड़ता है?',
      },
      options: [
        {
          en: 'Current I triples from 0.20 A to 0.60 A, while the resistance ratio V/I stays constant at 15 Ω.',
          hi: 'धारा I तीन गुनी (0.20 A से 0.60 A) हो जाती है, जबकि अनुपात V/I = 15 Ω स्थिर रहता है।',
        },
        {
          en: 'Both current I and resistance R triple.',
          hi: 'धारा I और प्रतिरोध R दोनों तीन गुने हो जाते हैं।',
        },
        {
          en: 'Current I drops to one-third.',
          hi: 'धारा I घटकर एक-तिहाई रह जाती है।',
        },
      ],
      correctIndex: 0,
      explanation: {
        en: 'At constant temperature, R = V/I = 15 Ω is a material/geometric constant of the resistor. Tripling V triples I (3.0/15 = 0.20 A → 9.0/15 = 0.60 A).',
        hi: 'नियत ताप पर प्रतिरोध R = V/I = 15 Ω स्थिर रहता है। अतः विभवांतर 3 गुना करने पर धारा भी 3 गुनी (0.20 A से 0.60 A) हो जाती है।',
      },
    },
    vivaVoceTrap: {
      question: {
        en: 'Why must an ammeter always be connected in SERIES and a voltmeter always in PARALLEL across the resistor?',
        hi: 'परिपथ में एमीटर को सदैव श्रेणीक्रम में और वोल्टमीटर को सदैव पार्श्वक्रम (समानांतर) में क्यों जोड़ा जाता है?',
      },
      commonMistake: {
        en: 'Saying it is just an arbitrary convention that does not affect the circuit.',
        hi: 'यह कहना कि यह केवल एक परंपरा है और उल्टा जोड़ने से कोई फर्क नहीं पड़ता।',
      },
      correctAnswer: {
        en: 'An ammeter has very LOW resistance so it measures the full series current without dropping voltage; a voltmeter has very HIGH resistance so it measures potential difference across two points in parallel without diverting current away from the resistor.',
        hi: 'एमीटर का प्रतिरोध अत्यंत कम होता है ताकि श्रेणीक्रम में जुड़ने पर वह धारा को कम न करे; वोल्टमीटर का प्रतिरोध अत्यंत उच्च होता है ताकि पार्श्वक्रम में जुड़ने पर वह मुख्य धारा को अपनी ओर न खींचे।',
      },
    },
    hotsClaimAndRubric: {
      title: {
        en: 'Practical HOTS Conclusion: Comparing Two Resistors on an I–V vs V–I Graph',
        hi: 'प्रायोगिक उच्च स्तरीय निष्कर्ष: I–V बनाम V–I ग्राफ में दो प्रतिरोधकों की तुलना',
      },
      prompt: {
        en: 'A student plots a graph with Current (I) on the vertical Y-axis and Potential Difference (V) on the horizontal X-axis for two nichrome wires R₁ and R₂. Line R₁ makes a smaller angle (30°) with the V-axis while Line R₂ makes a steeper angle (60°) with the V-axis. Which resistor has the greater resistance, and why?',
        hi: 'एक छात्र दो प्रतिरोधकों R₁ और R₂ के लिए ऊर्ध्वाधर Y-अक्ष पर धारा (I) तथा क्षैतिज X-अक्ष पर विभवांतर (V) लेकर ग्राफ खींचता है। रेखा R₁, V-अक्ष के साथ 30° का कोण बनाती है जबकि रेखा R₂, V-अक्ष के साथ 60° का कोण बनाती है। किस प्रतिरोधक का प्रतिरोध अधिक है और क्यों?',
      },
      claimOptions: [
        {
          en: 'R₁ has the GREATER resistance! On an I-vs-V graph, slope = ΔI/ΔV = 1/R (conductance), so a gentler slope (lower I for the same V) means higher resistance R.',
          hi: 'R₁ का प्रतिरोध अधिक है! I बनाम V ग्राफ में ढाल = ΔI/ΔV = 1/R होती है, इसलिए कम ढाल (समान V पर कम धारा I) का अर्थ अधिक प्रतिरोध R है।',
        },
        {
          en: 'R₂ has the greater resistance because its line is steeper.',
          hi: 'R₂ का प्रतिरोध अधिक है क्योंकि उसकी रेखा की ढाल अधिक है।',
        },
        {
          en: 'Both have equal resistance.',
          hi: 'दोनों का प्रतिरोध बराबर है।',
        },
      ],
      correctClaimIndex: 0,
      claimExplanation: {
        en: 'Watch the axes carefully! When V is on the horizontal axis and I is on the vertical axis, slope = I/V = 1/R. For any fixed voltage V, R₁ carries less current I than R₂, proving R₁ > R₂.',
        hi: 'अक्षों को ध्यान से देखें! जब X-अक्ष पर V और Y-अक्ष पर I हो, तो ढाल = I/V = 1/R होती है। किसी निश्चित विभवांतर V के लिए R₁ में धारा I कम है, अतः R₁ > R₂।',
      },
      rubricPoints: [
        {
          en: 'Checks axis labels first: notes that I is plotted on the Y-axis and V on the X-axis.',
          hi: 'सबसे पहले अक्षों की जाँच करता है: Y-अक्ष पर धारा I तथा X-अक्ष पर विभवांतर V है।',
        },
        {
          en: 'Writes the slope relation for an I–V graph: Slope = ΔI / ΔV = 1 / R (inverse of resistance).',
          hi: 'I–V ग्राफ की ढाल का संबंध लिखता है: ढाल = ΔI / ΔV = 1 / R (प्रतिरोध का व्युत्क्रम)।',
        },
        {
          en: 'Concludes that R₁ (smaller slope on I–V graph, smaller current for same V) has the larger resistance (R₁ > R₂).',
          hi: 'निष्कर्ष निकालता है कि कम ढाल वाले R₁ का प्रतिरोध अधिक है (R₁ > R₂)।',
        },
      ],
    },
  },

  'series-parallel': {
    routeId: 'series-parallel',
    ncertActivityRef: 'NCERT Class 10 Chapter 11 (Old Ch 12) · Activities 12.4–12.6 (Series & Parallel Combinations)',
    labTitle: {
      en: 'Practical Record 3: Equivalent Resistance in Series (R_s) vs Parallel (R_p)',
      hi: 'प्रायोगिक अभिलेख 3: श्रेणीक्रम (R_s) एवं पार्श्वक्रम (R_p) में समतुल्य प्रतिरोध',
    },
    aim: {
      en: 'To determine the equivalent resistance of two resistors connected in (a) series (R_s = R₁ + R₂) and (b) parallel (1/R_p = 1/R₁ + 1/R₂), and verify which quantity (I or V) stays constant in each topology.',
      hi: 'दो प्रतिरोधकों को (a) श्रेणीक्रम (R_s = R₁ + R₂) तथा (b) पार्श्वक्रम (1/R_p = 1/R₁ + 1/R₂) में जोड़कर समतुल्य प्रतिरोध ज्ञात करना तथा देखना कि किसमें धारा I और किसमें विभवांतर V समान रहता है।',
    },
    apparatusRequired: {
      en: 'Two standard resistors R₁ and R₂, DC battery supply, ammeter, voltmeter, switch, and connecting leads.',
      hi: 'दो प्रतिरोधक R₁ व R₂, डीसी बैटरी, एमीटर, वोल्टमीटर, स्विच तथा संयोजक तार।',
    },
    governingEquation: 'Series: R_s = R₁ + R₂ (same I)  |  Parallel: R_p = (R₁·R₂)/(R₁ + R₂) (same V)',
    procedureSteps: [
      {
        en: 'Step 1: Set V = 12 V, R₁ = 4 Ω, and R₂ = 6 Ω on the Series & Parallel workbench. In Series mode, verify R_s = 10 Ω, current I = 1.2 A through both, and voltage divides as V₁ = 4.8 V + V₂ = 7.2 V = 12 V.',
        hi: 'चरण 1: V = 12 V, R₁ = 4 Ω और R₂ = 6 Ω रखें। श्रेणीक्रम में सत्यापित करें कि R_s = 10 Ω, धारा I = 1.2 A समान है, तथा विभवांतर V₁ = 4.8 V + V₂ = 7.2 V = 12 V में बँटता है।',
      },
      {
        en: 'Step 2: Switch to Parallel mode with the same 4 Ω and 6 Ω resistors. Verify that equivalent resistance drops to R_p = 2.4 Ω (less than the smallest 4 Ω resistor!).',
        hi: 'चरण 2: उन्हीं 4 Ω और 6 Ω प्रतिरोधकों के साथ पार्श्वक्रम चुनें। सत्यापित करें कि समतुल्य प्रतिरोध घटकर R_p = 2.4 Ω (सबसे छोटे 4 Ω से भी कम!) हो जाता है।',
      },
      {
        en: 'Step 3: Check branch currents in Parallel: both branches receive the full 12 V, drawing I₁ = 12/4 = 3.0 A and I₂ = 12/6 = 2.0 A for a total main-line current I = 5.0 A.',
        hi: 'चरण 3: पार्श्वक्रम में शाखाओं की धारा जाँचें: दोनों को पूरा 12 V मिलता है, जिससे I₁ = 3.0 A तथा I₂ = 2.0 A और कुल मुख्य धारा I = 5.0 A होती है।',
      },
    ],
    observationCheck: {
      prompt: {
        en: 'When two resistors R₁ = 3 Ω and R₂ = 6 Ω are switched from Series to Parallel across a 6 V battery, how does the equivalent resistance change?',
        hi: 'जब R₁ = 3 Ω और R₂ = 6 Ω के दो प्रतिरोधकों को 6 V बैटरी के साथ श्रेणीक्रम से पार्श्वक्रम में बदला जाता है, तो समतुल्य प्रतिरोध कैसे बदलता है?',
      },
      options: [
        {
          en: 'Equivalent resistance drops from R_s = 9 Ω in series to R_p = 2 Ω in parallel (smaller than even the 3 Ω resistor!).',
          hi: 'समतुल्य प्रतिरोध श्रेणीक्रम में R_s = 9 Ω से घटकर पार्श्वक्रम में R_p = 2 Ω (3 Ω से भी कम!) हो जाता है।',
        },
        {
          en: 'Equivalent resistance increases from 4.5 Ω to 9 Ω.',
          hi: 'समतुल्य प्रतिरोध 4.5 Ω से बढ़कर 9 Ω हो जाता है।',
        },
        {
          en: 'Equivalent resistance stays 9 Ω in both connections.',
          hi: 'दोनों संयोजनों में समतुल्य प्रतिरोध 9 Ω रहता है।',
        },
      ],
      correctIndex: 0,
      explanation: {
        en: 'In series, R_s = 3 + 6 = 9 Ω. In parallel, 1/R_p = 1/3 + 1/6 = 3/6 = 1/2 ⇒ R_p = 2 Ω.',
        hi: 'श्रेणीक्रम में R_s = 3 + 6 = 9 Ω तथा पार्श्वक्रम में 1/R_p = 1/3 + 1/6 = 1/2 ⇒ R_p = 2 Ω।',
      },
    },
    vivaVoceTrap: {
      question: {
        en: 'Why is the equivalent resistance of a parallel combination ALWAYS smaller than the smallest individual resistor in the group?',
        hi: 'पार्श्वक्रम संयोजन का समतुल्य प्रतिरोध समूह के सबसे छोटे प्रतिरोधक से भी कम क्यों होता है?',
      },
      commonMistake: {
        en: 'Forgetting to invert 1/R_p at the end of the fraction addition and reporting 1/R_p as R_p.',
        hi: 'भिन्नों को जोड़ने के बाद अंत में 1/R_p का व्युत्क्रम (उल्टा) करना भूल जाना।',
      },
      correctAnswer: {
        en: 'Adding a parallel branch opens an extra conducting pathway for charges to flow (just like opening a second toll booth on a highway), which increases total current I for the same voltage V and acts like a wider total cross-section.',
        hi: 'पार्श्वक्रम में प्रत्येक नई शाखा धारा के प्रवाह के लिए एक अतिरिक्त मार्ग खोलती है, जिससे समान वोल्टेज V पर कुल धारा I बढ़ जाती है और कुल प्रभावी प्रतिरोध सबसे छोटे प्रतिरोधक से भी कम हो जाता है।',
      },
    },
    hotsClaimAndRubric: {
      title: {
        en: 'Practical HOTS Conclusion: Maximum to Minimum Resistance Ratio of n Identical Resistors',
        hi: 'प्रायोगिक उच्च स्तरीय निष्कर्ष: समान प्रतिरोधकों के अधिकतम व न्यूनतम प्रतिरोध का अनुपात',
      },
      prompt: {
        en: 'You are given three identical resistors, each of resistance R = 6 Ω. Find (a) the maximum equivalent resistance R_max you can obtain by combining all three, (b) the minimum equivalent resistance R_min you can obtain, and (c) the ratio R_max : R_min.',
        hi: 'आपको R = 6 Ω प्रतिरोध के तीन समान प्रतिरोधक दिए गए हैं। तीनों को जोड़कर प्राप्त किया जा सकने वाला (a) अधिकतम समतुल्य प्रतिरोध R_max, (b) न्यूनतम समतुल्य प्रतिरोध R_min, तथा (c) अनुपात R_max : R_min ज्ञात कीजिए।',
      },
      claimOptions: [
        {
          en: 'R_max = 18 Ω (all 3 in series), R_min = 2 Ω (all 3 in parallel), and R_max : R_min = 9 : 1 (which equals n² : 1 for n = 3).',
          hi: 'R_max = 18 Ω (तीनों श्रेणीक्रम में), R_min = 2 Ω (तीनों पार्श्वक्रम में), तथा अनुपात R_max : R_min = 9 : 1 (अर्थात n² : 1)।',
        },
        {
          en: 'R_max = 18 Ω, R_min = 6 Ω, and ratio is 3 : 1.',
          hi: 'R_max = 18 Ω, R_min = 6 Ω तथा अनुपात 3 : 1 है।',
        },
        {
          en: 'R_max = 6 Ω, R_min = 2 Ω, and ratio is 3 : 1.',
          hi: 'R_max = 6 Ω, R_min = 2 Ω तथा अनुपात 3 : 1 है।',
        },
      ],
      correctClaimIndex: 0,
      claimExplanation: {
        en: 'For n identical resistors of value R: Series gives R_max = n·R = 3 × 6 = 18 Ω; Parallel gives R_min = R / n = 6 / 3 = 2 Ω. Their ratio is R_max / R_min = n² = 9 : 1.',
        hi: 'n समान प्रतिरोधकों के लिए श्रेणीक्रम में R_max = nR = 18 Ω तथा पार्श्वक्रम में R_min = R/n = 2 Ω होता है। अतः अनुपात R_max / R_min = n² = 9 : 1 होगा।',
      },
      rubricPoints: [
        {
          en: 'Calculates maximum resistance by connecting all three in series: R_max = 6 + 6 + 6 = 18 Ω.',
          hi: 'तीनों को श्रेणीक्रम में जोड़कर अधिकतम प्रतिरोध निकालता है: R_max = 6 + 6 + 6 = 18 Ω।',
        },
        {
          en: 'Calculates minimum resistance by connecting all three in parallel: 1/R_min = 1/6 + 1/6 + 1/6 = 3/6 ⇒ R_min = 2 Ω.',
          hi: 'तीनों को पार्श्वक्रम में जोड़कर न्यूनतम प्रतिरोध निकालता है: R_min = 6 / 3 = 2 Ω।',
        },
        {
          en: 'Computes the ratio R_max : R_min = 18 : 2 = 9 : 1 (n² : 1).',
          hi: 'अनुपात की गणना करता है: R_max : R_min = 18 : 2 = 9 : 1।',
        },
      ],
    },
  },

  resistivity: {
    routeId: 'resistivity',
    ncertActivityRef: 'NCERT Class 10 Chapter 11 (Old Ch 12) · Activity 12.3 (Factors Affecting Resistance R = ρL/A)',
    labTitle: {
      en: 'Practical Record 4: Dependence of Resistance on Length, Area, Diameter & Material Resistivity',
      hi: 'प्रायोगिक अभिलेख 4: तार की लंबाई, क्षेत्रफल, व्यास एवं पदार्थ की प्रतिरोधकता पर प्रतिरोध की निर्भरता',
    },
    aim: {
      en: 'To verify how the electrical resistance R of a metal wire depends on its length L, cross-sectional area A = πd²/4, and material resistivity ρ.',
      hi: 'सत्यापित करना कि किसी चालक तार का प्रतिरोध R उसकी लंबाई L, अनुप्रस्थ काट क्षेत्रफल A = πd²/4 तथा पदार्थ की प्रतिरोधकता ρ पर कैसे निर्भर करता है।',
    },
    apparatusRequired: {
      en: 'Test wires of Copper, Nichrome, and Constantan of varying lengths L and diameters d, micrometer screw gauge, metre scale, ammeter, and DC cell.',
      hi: 'विभिन्न लंबाई L व व्यास d के तांबे, नाइक्रोम व कांसटेंटन के तार, स्क्रू गेज, मीटर पैमाना, एमीटर तथा सेल।',
    },
    governingEquation: 'R = ρ · (L / A) = (4 · ρ · L) / (π · d²)',
    procedureSteps: [
      {
        en: 'Step 1: Keep material and diameter fixed on the Resistivity workbench and double wire length L. Verify that resistance R doubles (R ∝ L).',
        hi: 'चरण 1: पदार्थ और व्यास स्थिर रखकर तार की लंबाई L दोगुनी करें। सत्यापित करें कि प्रतिरोध R दोगुना हो जाता है (R ∝ L)।',
      },
      {
        en: 'Step 2: Keep length L fixed and double the wire diameter d (or radius r). Verify that cross-sectional area A quadruples (4×) and resistance R drops to one-fourth (R/4)!',
        hi: 'चरण 2: लंबाई L स्थिर रखकर तार का व्यास d दोगुना करें। सत्यापित करें कि क्षेत्रफल A चार गुना (4×) हो जाता है और प्रतिरोध R घटकर एक-चौथाई (R/4) रह जाता है!',
      },
      {
        en: 'Step 3: Switch the wire material from Copper to Nichrome alloy at the exact same L and A. Notice that resistance jumps ~60× because resistivity ρ is an intrinsic material property.',
        hi: 'चरण 3: समान L व A पर पदार्थ को तांबे से नाइक्रोम मिश्रधातु में बदलें। देखें कि प्रतिरोध ~60 गुना बढ़ जाता है क्योंकि प्रतिरोधकता ρ पदार्थ का आंतरिक गुण है।',
      },
    ],
    observationCheck: {
      prompt: {
        en: 'On the Resistivity workbench, if a wire of resistance R has its length halved (L/2) AND its diameter doubled (2d) while keeping the same material, what becomes its new resistance?',
        hi: 'यदि समान पदार्थ के R प्रतिरोध वाले तार की लंबाई आधी (L/2) कर दी जाए और उसका व्यास दोगुना (2d) कर दिया जाए, तो नया प्रतिरोध कितना हो जाएगा?',
      },
      options: [
        {
          en: 'R / 8 (Halving length gives 1/2, and doubling diameter quadruples area giving another 1/4: (1/2) × (1/4) = 1/8).',
          hi: 'R / 8 (लंबाई आधी होने से 1/2 तथा व्यास दोगुना होने से क्षेत्रफल 4 गुना होकर 1/4 देता है: (1/2) × (1/4) = 1/8)।',
        },
        {
          en: 'R / 4',
          hi: 'R / 4',
        },
        {
          en: 'Remains unchanged at R',
          hi: 'अपरिवर्तित (R) रहता है',
        },
      ],
      correctIndex: 0,
      explanation: {
        en: 'R_new / R = (L_new / L) × (A / A_new) = (1/2) × (d / 2d)² = (1/2) × (1/4) = 1/8.',
        hi: 'R_नया / R = (L_नया / L) × (d / d_नया)² = (1/2) × (1/2)² = (1/2) × (1/4) = 1/8।',
      },
    },
    vivaVoceTrap: {
      question: {
        en: 'If a copper wire is stretched to double its length, does its resistance R change? Does its resistivity ρ change?',
        hi: 'यदि तांबे के तार को खींचकर उसकी लंबाई दोगुनी कर दी जाए, तो क्या उसका प्रतिरोध R बदलेगा? क्या उसकी प्रतिरोधकता ρ बदलेगी?',
      },
      commonMistake: {
        en: 'Saying that both resistance R and resistivity ρ increase when the wire is stretched.',
        hi: 'यह कहना कि तार को खींचने पर प्रतिरोध R और प्रतिरोधकता ρ दोनों बढ़ जाते हैं।',
      },
      correctAnswer: {
        en: 'Resistance R increases 4 times (since length doubles and area halves at constant volume), bit RESISTIVITY ρ remains 100% UNCHANGED because ρ depends only on the material (copper) and temperature, never on wire dimensions!',
        hi: 'प्रतिरोध R चार गुना (4R) हो जाता है, किंतु प्रतिरोधकता ρ बिल्कुल अपरिवर्तित रहती है क्योंकि ρ केवल पदार्थ की प्रकृति और ताप पर निर्भर करती है, तार की लंबाई या मोटाई पर नहीं!',
      },
    },
    hotsClaimAndRubric: {
      title: {
        en: 'Practical HOTS Conclusion: Why Alloys Like Nichrome Are Used in Heating Elements Instead of Pure Copper',
        hi: 'प्रायोगिक उच्च स्तरीय निष्कर्ष: तापन अवयवों में शुद्ध तांबे के बजाय नाइक्रोम मिश्रधातु का उपयोग क्यों होता है?',
      },
      prompt: {
        en: 'Compare the resistivity ρ of copper (~1.68 × 10⁻⁸ Ω·m) and nichrome alloy (~1.10 × 10⁻⁶ Ω·m) on the workbench. Give two scientific reasons why alloys like nichrome are chosen for electric irons and toasters while copper is chosen for connecting cords.',
        hi: 'बेंच पर तांबे (~1.68 × 10⁻⁸ Ω·m) और नाइक्रोम मिश्रधातु (~1.10 × 10⁻⁶ Ω·m) की प्रतिरोधकता की तुलना करें। दो वैज्ञानिक कारण लिखिए कि विद्युत प्रेस व टोस्टर के तापन अवयव नाइक्रोम के क्यों बनाए जाते हैं जबकि संयोजक तार तांबे के।',
      },
      claimOptions: [
        {
          en: '(1) Nichrome has ~65× higher resistivity than copper so a compact coil produces large Joule heat; (2) Nichrome has a high melting point and does not oxidise (burn) easily at red-hot temperatures.',
          hi: '(1) नाइक्रोम की प्रतिरोधकता तांबे से ~65 गुना अधिक होती है जिससे छोटा तार भी पर्याप्त ऊष्मा देता है; (2) उच्च ताप पर नाइक्रोम का शीघ्र ऑक्सीकरण (दहन) नहीं होता और गलनांक उच्च होता है।',
        },
        {
          en: 'Nichrome has lower resistivity than copper and melts at a very low temperature.',
          hi: 'नाइक्रोम की प्रतिरोधकता तांबे से कम होती है और यह कम ताप पर पिघल जाता है।',
        },
      ],
      correctClaimIndex: 0,
      claimExplanation: {
        en: 'Heating elements need high resistance in a reasonable length (high ρ) plus resistance to oxidation at 800 °C. Connecting cords need negligible heat loss (very low ρ of copper).',
        hi: 'तापन अवयवों के लिए उच्च प्रतिरोधकता (ρ) तथा उच्च ताप पर ऑक्सीकरण (जलने) से बचाव आवश्यक है, जबकि संयोजक तारों में ऊर्जा हानि रोकने के लिए तांबे की निम्न प्रतिरोधकता आवश्यक है।',
      },
      rubricPoints: [
        {
          en: 'States that alloys like nichrome have much higher resistivity (ρ) than pure metals like copper.',
          hi: 'बताता है कि नाइक्रोम जैसी मिश्रधातुओं की प्रतिरोधकता (ρ) शुद्ध धातुओं से बहुत अधिक होती है।',
        },
        {
          en: 'States that alloys do not oxidise (burn) readily at high red-hot operating temperatures and have high melting points.',
          hi: 'लिखता है कि मिश्रधातुओं का उच्च ताप पर शीघ्र ऑक्सीकरण (दहन) नहीं होता और इनका गलनांक उच्च होता है।',
        },
        {
          en: 'Contrasts with copper connecting wires, whose very low resistivity prevents unwanted heating in the supply cord.',
          hi: 'तांबे के संयोजक तारों से तुलना करता है जिनकी अति निम्न प्रतिरोधकता तार को गर्म होने से बचाती है।',
        },
      ],
    },
  },

  'power-heating': {
    routeId: 'power-heating',
    ncertActivityRef: 'NCERT Class 10 Chapter 11 (Old Ch 12) · Sec 12.7–12.8 (Joule’s Law of Heating H = I²Rt & Electric Power)',
    labTitle: {
      en: 'Practical Record 5: Verification of Joule’s Law of Heating (H = I²Rt)',
      hi: 'प्रायोगिक अभिलेख 5: जूल के तापन नियम (H = I²Rt) एवं विद्युत शक्ति का सत्यापन',
    },
    aim: {
      en: 'To investigate how the heat H produced in a resistor scales with the square of current (I²), resistance (R), and time (t), and compare P = I²R vs P = V²/R.',
      hi: 'किसी प्रतिरोधक में उत्पन्न ऊष्मा H की धारा के वर्ग (I²), प्रतिरोध (R) तथा समय (t) पर निर्भरता का अध्ययन करना।',
    },
    apparatusRequired: {
      en: 'Calorimeter/heating coil bench, variable DC source, ammeter, voltmeter, timer, and digital joulemeter.',
      hi: 'तापन कुंडली बेंच, परिवर्ती डीसी स्रोत, एमीटर, वोल्टमीटर, घड़ी तथा जूल-मापी।',
    },
    governingEquation: 'H = V · I · t = I² · R · t = (V² / R) · t  |  P = H / t',
    procedureSteps: [
      {
        en: 'Step 1: Set a fixed resistor R and fixed time t on the Power & Heating workbench, then double the current I. Verify that the thermal energy H quadruples (4×) because H ∝ I².',
        hi: 'चरण 1: प्रतिरोध R और समय t स्थिर रखकर धारा I को दोगुना करें। सत्यापित करें कि उत्पन्न ऊष्मा H चार गुनी (4×) हो जाती है क्योंकि H ∝ I² है।',
      },
      {
        en: 'Step 2: Keep current I and resistance R fixed and double the operating time t. Verify that total heat H doubles linearly (H ∝ t) while power P stays constant.',
        hi: 'चरण 2: धारा I और प्रतिरोध R स्थिर रखकर समय t दोगुना करें। सत्यापित करें कि कुल ऊष्मा H दोगुनी हो जाती है (H ∝ t) जबकि शक्ति P स्थिर रहती है।',
      },
      {
        en: 'Step 3: Compare two heaters across fixed 220 V mains using P = V²/R: verify that the lower resistance coil draws higher current and generates MORE heat per second.',
        hi: 'चरण 3: स्थिर 220 V मेन्स पर P = V²/R से तुलना करें: सत्यापित करें कि कम प्रतिरोध वाली कुंडली अधिक धारा लेती है और प्रति सेकंड अधिक ऊष्मा उत्पन्न करती है।',
      },
    ],
    observationCheck: {
      prompt: {
        en: 'According to Joule’s Law of Heating (H = I²Rt), if the current I through a heating element is tripled (3I) for the same resistance R and duration t, by what factor does the heat generated increase?',
        hi: 'जूल के तापन नियम (H = I²Rt) के अनुसार, यदि समान प्रतिरोध R और समान समय t के लिए धारा I को तीन गुना (3I) कर दिया जाए, तो उत्पन्न ऊष्मा कितने गुना बढ़ जाएगी?',
      },
      options: [
        {
          en: '9 times (because H ∝ I², and 3² = 9).',
          hi: '9 गुना (क्योंकि H ∝ I² होता है, और 3² = 9)।',
        },
        {
          en: '3 times.',
          hi: '3 गुना।',
        },
        {
          en: '6 times.',
          hi: '6 गुना।',
        },
      ],
      correctIndex: 0,
      explanation: {
        en: 'Doubling or tripling current increases both voltage drop (V = IR) and charge flow rate (I), so heating power P = VI = I²R scales with the square of current: (3)² = 9×.',
        hi: 'H = I²Rt के अनुसार धारा को 3 गुना करने पर ऊष्मा (3)² = 9 गुना हो जाती है।',
      },
    },
    vivaVoceTrap: {
      question: {
        en: 'When a 100 W, 220 V bulb and a 60 W, 220 V bulb are connected in SERIES across a 220 V supply, why does the 60 W bulb glow brighter than the 100 W bulb?',
        hi: 'जब 100 W, 220 V और 60 W, 220 V के दो बल्बों को 220 V सप्लाई के साथ श्रेणीक्रम (Series) में जोड़ा जाता है, तो 60 W वाला बल्ब 100 W वाले से अधिक तेज क्यों चमकता है?',
      },
      commonMistake: {
        en: 'Assuming a 100 W bulb always glows brighter than a 60 W bulb regardless of whether they are wired in series or parallel.',
        hi: 'यह मान लेना कि 100 W का बल्ब श्रेणीक्रम हो या पार्श्वक्रम, हमेशा 60 W से अधिक चमकेगा।',
      },
      correctAnswer: {
        en: 'By R = V²_rated / P_rated, the 60 W bulb has HIGHER filament resistance (807 Ω) than the 100 W bulb (484 Ω). In a SERIES circuit, the exact same current I flows through both bulbs, so by P_actual = I²R, the higher-resistance 60 W bulb dissipates more power and glows brighter!',
        hi: 'R = V²/P से 60 W बल्ब का प्रतिरोध (807 Ω), 100 W बल्ब (484 Ω) से अधिक होता है। श्रेणीक्रम में दोनों में समान धारा I बहती है, इसलिए P = I²R के अनुसार अधिक प्रतिरोध वाला 60 W का बल्ब अधिक शक्ति व्यय करता है और अधिक चमकता है!',
      },
    },
    hotsClaimAndRubric: {
      title: {
        en: 'Practical HOTS Conclusion: Two Conducting Wires Connected First in Series and Then in Parallel Across the Same Voltage V',
        hi: 'प्रायोगिक उच्च स्तरीय निष्कर्ष: समान तारों को श्रेणीक्रम तथा पार्श्वक्रम में जोड़ने पर उत्पन्न ऊष्माओं का अनुपात',
      },
      prompt: {
        en: 'NCERT Ch 11 Q4: Two conducting wires of the same material and of equal lengths and equal diameters (each of resistance R) are first connected in SERIES and then in PARALLEL in a circuit across the same potential difference V. Find the ratio of heat produced in series to parallel combinations (H_series : H_parallel) in the same time t.',
        hi: 'NCERT प्रश्न: समान पदार्थ, समान लंबाई तथा समान व्यास के दो चालक तारों (प्रत्येक का प्रतिरोध R) को किसी विद्युत परिपथ में समान विभवांतर V के आड़े पहले श्रेणीक्रम में और फिर पार्श्वक्रम में जोड़ा जाता है। समान समय t में श्रेणीक्रम तथा पार्श्वक्रम में उत्पन्न ऊष्माओं का अनुपात (H_श्रेणी : H_पार्श्व) ज्ञात कीजिए।',
      },
      claimOptions: [
        {
          en: 'H_series : H_parallel = 1 : 4 (Since V is held constant across the source, use H = (V² / R_eq) · t with R_s = 2R and R_p = R/2).',
          hi: 'H_श्रेणी : H_पार्श्व = 1 : 4 (चूँकि स्रोत का विभवांतर V समान है, इसलिए H = (V²/R_eq)·t का प्रयोग करें जहाँ R_s = 2R तथा R_p = R/2 है)।',
        },
        {
          en: 'H_series : H_parallel = 4 : 1',
          hi: 'H_श्रेणी : H_पार्श्व = 4 : 1',
        },
        {
          en: 'H_series : H_parallel = 1 : 2',
          hi: 'H_श्रेणी : H_पार्श्व = 1 : 2',
        },
      ],
      correctClaimIndex: 0,
      claimExplanation: {
        en: 'Because both combinations are connected across the SAME potential difference V, use H = (V²/R_eq)·t. Here R_series = 2R and R_parallel = R/2, so H_series / H_parallel = R_parallel / R_series = (R/2) / (2R) = 1 / 4 (1 : 4).',
        hi: 'दोनों संयोजनों पर विभवांतर V समान है, अतः H = (V²/R_eq)·t से H ∝ 1/R_eq। चूँकि R_श्रेणी = 2R तथा R_पार्श्व = R/2 है, अतः H_श्रेणी / H_पार्श्व = (R/2) / (2R) = 1 : 4 होगा।',
      },
      rubricPoints: [
        {
          en: 'Finds equivalent resistances: R_series = R + R = 2R and R_parallel = R / 2.',
          hi: 'समतुल्य प्रतिरोध लिखता है: R_श्रेणी = 2R तथा R_पार्श्व = R / 2।',
        },
        {
          en: 'Selects H = (V² / R_eq) × t because the potential difference V across both combinations is held constant.',
          hi: 'समान विभवांतर V होने के कारण सूत्र H = (V² / R_eq) × t का चयन करता है।',
        },
        {
          en: 'Computes the ratio H_series / H_parallel = R_parallel / R_series = (R/2) / (2R) = 1 : 4.',
          hi: 'अनुपात की गणना करता है: H_श्रेणी : H_पार्श्व = (R/2) / (2R) = 1 : 4।',
        },
      ],
    },
  },

  billing: {
    routeId: 'billing',
    ncertActivityRef: 'NCERT Class 10 Chapter 11 (Old Ch 12) · Sec 12.8 (Commercial Unit of Electrical Energy: kWh & Household Tariff Audit)',
    labTitle: {
      en: 'Practical Record 6: Household Electrical Energy Audit & Monthly kWh Tariff Calculation',
      hi: 'प्रायोगिक अभिलेख 6: घरेलू विद्युत ऊर्जा ऑडिट एवं मासिक यूनिट (kWh) बिल की गणना',
    },
    aim: {
      en: 'To audit the monthly commercial electrical energy consumption (in kWh / Units) of household appliances and verify 1 Unit = 1 kWh = 3.6 × 10⁶ J.',
      hi: 'घरेलू उपकरणों के मासिक व्यावसायिक विद्युत ऊर्जा उपभोग (kWh / यूनिट में) की गणना करना तथा 1 यूनिट = 1 kWh = 3.6 × 10⁶ J सत्यापित करना।',
    },
    apparatusRequired: {
      en: 'Household energy meter simulator, appliance load schedule (wattage W × daily hours h × 30 days), and slab tariff chart.',
      hi: 'घरेलू ऊर्जा मीटर सिम्युलेटर, उपकरण लोड तालिका (W × दैनिक घंटे × 30 दिन) तथा टैरिफ दर तालिका।',
    },
    governingEquation: 'Units (kWh) = [ Power (W) × Hours/day × Days ] / 1000  |  1 kWh = 3.6 × 10⁶ J',
    procedureSteps: [
      {
        en: 'Step 1: Add or inspect a high-wattage heating appliance (e.g. 2000 W Geyser/AC) and a low-wattage lighting load (e.g. 10 W LED bulb) on the kWh Billing workbench.',
        hi: 'चरण 1: kWh बिलिंग बेंच पर उच्च शक्ति वाले तापन उपकरण (जैसे 2000 W गीज़र/AC) और कम शक्ति वाले प्रकाश उपकरण (10 W LED) का निरीक्षण करें।',
      },
      {
        en: 'Step 2: Adjust daily operating hours and verify how the workbench divides Watt-hours (Wh) by 1000 to compute monthly Units (kWh).',
        hi: 'चरण 2: दैनिक उपयोग के घंटे बदलें और सत्यापित करें कि वाट-घंटे (Wh) को 1000 से भाग देकर मासिक यूनिट (kWh) कैसे निकाली जाती है।',
      },
      {
        en: 'Step 3: Compare the monthly cost across tariff rates and verify how replacing filament/halogens with LEDs or trimming AC/geyser hours cuts the bill.',
        hi: 'चरण 3: टैरिफ दर से मासिक बिल की गणना करें और देखें कि तापन उपकरणों के समय में थोड़ी बचत भी बिल को कितना कम करती है।',
      },
    ],
    observationCheck: {
      prompt: {
        en: 'If a household runs two 50 W ceiling fans for 10 hours every day and one 1000 W electric iron for 1 hour every day for 30 days, what is the total monthly energy consumed in commercial Units (kWh)?',
        hi: 'यदि किसी घर में प्रतिदिन दो 50 W के पंखे 10 घंटे और एक 1000 W की विद्युत प्रेस 1 घंटा 30 दिनों तक चलाई जाती है, तो कुल मासिक ऊर्जा खपत कितनी यूनिट (kWh) होगी?',
      },
      options: [
        {
          en: '60 Units (Fans: 2 × 50 × 10 × 30 / 1000 = 30 kWh; Iron: 1000 × 1 × 30 / 1000 = 30 kWh; Total = 60 kWh).',
          hi: '60 यूनिट (पंखे: 30 kWh + प्रेस: 30 kWh = कुल 60 kWh)।',
        },
        {
          en: '60,000 Units (forgot to divide Watt-hours by 1000).',
          hi: '60,000 यूनिट (वाट-घंटे को 1000 से भाग देना भूल गए)।',
        },
        {
          en: '2 Units.',
          hi: '2 यूनिट।',
        },
      ],
      correctIndex: 0,
      explanation: {
        en: 'Daily energy = (2 × 50 W × 10 h) + (1000 W × 1 h) = 1000 Wh + 1000 Wh = 2000 Wh/day = 2.0 kWh/day. Over 30 days: 2.0 × 30 = 60 kWh = 60 Units.',
        hi: 'दैनिक खपत = (2 × 50 × 10) + (1000 × 1) = 2000 Wh = 2 kWh/दिन। 30 दिनों में: 2 × 30 = 60 kWh = 60 यूनिट।',
      },
    },
    vivaVoceTrap: {
      question: {
        en: 'Is “kilowatt-hour (kWh)” a unit of electric POWER or electrical ENERGY? Why don’t electricity bills use Joules directly?',
        hi: 'क्या “किलोवाट-घंटा (kWh)” विद्युत शक्ति का मात्रक है या विद्युत ऊर्जा का? बिजली के बिल में सीधे जूल (Joule) का प्रयोग क्यों नहीं किया जाता?',
      },
      commonMistake: {
        en: 'Seeing the word “kilowatt” inside “kilowatt-hour” and calling kWh a unit of electric power.',
        hi: '“किलोवाट-घंटा” में “वाट” शब्द देखकर इसे विद्युत शक्ति (Power) का मात्रक बता देना।',
      },
      correctAnswer: {
        en: 'kWh is a unit of ENERGY (Power × Time = kW × h). Because 1 Joule (1 W·s) is tiny compared to household monthly consumption (1 kWh = 3,600,000 J), billing in Joules would require awkward 9-digit numbers!',
        hi: 'kWh विद्युत ऊर्जा (शक्ति × समय = kW × h) का मात्रक है! चूँकि 1 जूल (1 W·s) घरेलू खपत की तुलना में अत्यंत छोटा मात्रक है (1 kWh = 36,00,000 जूल), इसलिए सुविधा के लिए व्यावसायिक मात्रक kWh (यूनिट) का प्रयोग होता है।',
      },
    },
    hotsClaimAndRubric: {
      title: {
        en: 'Practical HOTS Conclusion: Converting Commercial Meter Units Into SI Joules & Current Draw',
        hi: 'प्रायोगिक उच्च स्तरीय निष्कर्ष: बिजली बिल की यूनिट को जूल (J) तथा धारा (A) में बदलना',
      },
      prompt: {
        en: 'A household electricity meter records 250 Units of energy consumed during a month. (a) Express this 250-Unit consumption in SI Joules (J). (b) If a 2.2 kW water heater in that house operates on a 220 V mains line, calculate the current I drawn by the heater and its hot resistance R.',
        hi: 'किसी घर में एक महीने में ऊर्जा की 250 यूनिटें व्यय हुईं। (a) यह ऊर्जा जूल (J) में कितनी होगी? (b) यदि उस घर में 2.2 kW का गीज़र 220 V मेन्स लाइन पर चलता है, तो गीज़र द्वारा ली गई धारा I तथा उसका प्रतिरोध R ज्ञात कीजिए।',
      },
      claimOptions: [
        {
          en: '(a) Energy = 250 × 3.6 × 10⁶ J = 9.0 × 10⁸ J; (b) Current I = 2200 W / 220 V = 10 A, and Resistance R = 220 V / 10 A = 22 Ω.',
          hi: '(a) ऊर्जा = 250 × 3.6 × 10⁶ J = 9.0 × 10⁸ जूल; (b) धारा I = 2200 W / 220 V = 10 A तथा प्रतिरोध R = 220 / 10 = 22 Ω।',
        },
        {
          en: '(a) Energy = 250 × 1000 J; (b) Current I = 0.01 A.',
          hi: '(a) ऊर्जा = 250 × 1000 जूल; (b) धारा I = 0.01 A।',
        },
      ],
      correctClaimIndex: 0,
      claimExplanation: {
        en: '1 Unit = 1 kWh = 3.6 × 10⁶ J, so 250 Units = 9.0 × 10⁸ J. For the 2.2 kW (2200 W) heater at 220 V: I = P/V = 2200/220 = 10 A and R = V/I = 220/10 = 22 Ω.',
        hi: '1 यूनिट = 3.6 × 10⁶ J से 250 यूनिट = 9 × 10⁸ J। 2.2 kW = 2200 W गीज़र के लिए I = P/V = 2200/220 = 10 A तथा R = V/I = 22 Ω।',
      },
      rubricPoints: [
        {
          en: 'Converts 250 Units (kWh) to Joules using 1 kWh = 3.6 × 10⁶ J: E = 250 × 3.6 × 10⁶ = 9.0 × 10⁸ J.',
          hi: '1 kWh = 3.6 × 10⁶ J का प्रयोग कर 250 यूनिट को 9.0 × 10⁸ जूल में बदलता है।',
        },
        {
          en: 'Converts 2.2 kW to 2200 W and calculates current I = P / V = 2200 / 220 = 10 A.',
          hi: '2.2 kW को 2200 W में बदलकर धारा I = 2200 / 220 = 10 A निकालता है।',
        },
        {
          en: 'Calculates operating resistance R = V / I = 220 V / 10 A = 22 Ω.',
          hi: 'गीज़र का प्रतिरोध R = V / I = 220 / 10 = 22 Ω ज्ञात करता है।',
        },
      ],
    },
  },

  safety: {
    routeId: 'safety',
    ncertActivityRef: 'NCERT Class 10 Chapter 12 (Old Ch 13) · Sec 13.4 (Domestic Electric Circuits, Fuse Rating & Earthing)',
    labTitle: {
      en: 'Practical Record 7: Domestic Circuit Overload, Fuse Sizing & Earth-Wire Shock Protection',
      hi: 'प्रायोगिक अभिलेख 7: घरेलू विद्युत परिपथ अतिभारण (Overload), फ़्यूज़ चयन एवं भूसंपर्कन सुरक्षा',
    },
    aim: {
      en: 'To determine the safe fuse rating for a 220 V domestic circuit (5 A lighting vs 15 A power line), test overloading/short-circuit fault clearing, and verify how the green Earth wire prevents electric shock.',
      hi: '220 V घरेलू परिपथ (5 A बनाम 15 A लाइन) के लिए उपयुक्त फ़्यूज़ रेटिंग ज्ञात करना, अतिभारण (Overloading) का परीक्षण करना तथा हरे भूसंपर्क तार (Earth wire) द्वारा विद्युत आघात से सुरक्षा सत्यापित करना।',
    },
    apparatusRequired: {
      en: '220 V domestic distribution board simulator (Live red, Neutral black, Earth green wires), 5 A & 15 A fuse elements, and metal-body appliance.',
      hi: '220 V घरेलू वितरण बोर्ड सिम्युलेटर (विद्युन्मय लाल, उदासीन काला, भूसंपर्क हरा तार), 5 A व 15 A फ़्यूज़ तथा धात्विक आवरण वाला उपकरण।',
    },
    governingEquation: 'I_load = P_total / V_mains  |  Fuse melts when I_load > I_fuse_rated (H = I²Rt)',
    procedureSteps: [
      {
        en: 'Step 1: On the Domestic Safety workbench, connect a 2000 W (2 kW) electric oven/geyser to a 220 V circuit fitted with a 5 A lighting fuse. Observe that I = 2000/220 = 9.09 A > 5 A, causing the 5 A fuse to melt immediately!',
        hi: 'चरण 1: घरेलू सुरक्षा बेंच पर 5 A फ़्यूज़ वाले 220 V परिपथ में 2000 W (2 kW) का ओवन/गीज़र जोड़ें। देखें कि धारा I = 2000/220 = 9.09 A (> 5 A) होने से 5 A का फ़्यूज़ तुरंत पिघलकर परिपथ तोड़ देता है!',
      },
      {
        en: 'Step 2: Upgrade the circuit to the 15 A heavy-power line. Verify that the 9.09 A load operates safely below the 15 A limit.',
        hi: 'चरण 2: अब परिपथ में 15 A का पावर फ़्यूज़ लगाएं। सत्यापित करें कि 9.09 A की धारा 15 A सीमा के भीतर सुरक्षित रूप से प्रवाहित होती है।',
      },
      {
        en: 'Step 3: Simulate a Live-to-Metal-Case insulation fault with Earthing ON vs OFF. Observe how the green low-resistance Earth wire diverts fault current to ground and blows the fuse before anyone touching the appliance can be shocked.',
        hi: 'चरण 3: धात्विक आवरण में विद्युन्मय तार के स्पर्श (Fault) का परीक्षण भूसंपर्कन (Earthing) चालू व बंद करके करें। देखें कि हरा भूसंपर्क तार दोष धारा को भूमि में भेजकर फ़्यूज़ उड़ा देता है और प्राणघातक झटके से बचाता है।',
      },
    ],
    observationCheck: {
      prompt: {
        en: 'NCERT Class 10 Example 12.3: An electric oven of 2 kW power rating is operated in a domestic electric circuit (220 V) that has a current rating of 5 A. What result do you expect on the safety bench?',
        hi: 'NCERT उदाहरण: 2 kW शक्ति अनुमतांक का एक विद्युत तंदूर किसी घरेलू विद्युत परिपथ (220 V) में प्रचालित किया जाता है जिसका धारा अनुमतांक 5 A है। इससे आप किस परिणाम की अपेक्षा करते हैं?',
      },
      options: [
        {
          en: 'The oven draws I = 2000 / 220 = 9.09 A, which exceeds the 5 A rating, so the fuse melts (blows) due to Joule heating and opens the circuit to prevent fire.',
          hi: 'तंदूर I = 2000 / 220 = 9.09 A धारा लेता है जो 5 A से अधिक है; अतः अतिभारण से फ़्यूज़ तार पिघलकर परिपथ को भंग कर देगा और आग लगने से बचाएगा।',
        },
        {
          en: 'The oven runs normally because 2 kW is less than 5 A.',
          hi: 'तंदूर सामान्य रूप से चलता रहेगा क्योंकि 2 kW, 5 A से कम है।',
        },
        {
          en: 'The voltage drops to zero while the fuse remains intact.',
          hi: 'फ़्यूज़ सुरक्षित रहेगा और वोल्टेज शून्य हो जाएगा।',
        },
      ],
      correctIndex: 0,
      explanation: {
        en: 'Required current I = P / V = 2000 W / 220 V = 9.09 A. Since 9.09 A > 5 A, excessive Joule heating (H = I²Rt) melts the fuse wire and disconnects the live wire.',
        hi: 'आवश्यक धारा I = P / V = 2000 / 220 = 9.09 A है। चूँकि 9.09 A > 5 A है, इसलिए अत्यधिक जूल तापन से फ़्यूज़ पिघल जाएगा।',
      },
    },
    vivaVoceTrap: {
      question: {
        en: 'Should a safety fuse wire have a HIGH melting point or a LOW melting point, and should it be connected in the Live wire or the Neutral wire?',
        hi: 'सुरक्षा फ़्यूज़ तार का गलनांक उच्च होना चाहिए या निम्न, और इसे विद्युन्मय (Live) तार में लगाना चाहिए या उदासीन (Neutral) तार में?',
      },
      commonMistake: {
        en: 'Confusing a fuse wire with a heater/bulb filament and saying a fuse wire has a “high melting point”, or putting the fuse in the neutral wire.',
        hi: 'फ़्यूज़ तार को बल्ब के तंतु (टंगस्टन) जैसा समझकर उसका गलनांक “उच्च” बता देना, या फ़्यूज़ को उदासीन तार में लगा देना।',
      },
      correctAnswer: {
        en: 'A fuse wire (lead-tin alloy) must have moderate resistance and a LOW melting point so it melts promptly during overload! It MUST be placed in series in the LIVE wire so that when it blows, the appliance is completely disconnected from the 220 V potential.',
        hi: 'फ़्यूज़ तार (सीसा-टिन मिश्रधातु) की प्रतिरोधकता उपयुक्त तथा गलनांक कम (Low melting point) होना चाहिए ताकि अतिभारण होते ही वह तुरंत पिघल जाए! इसे सदैव विद्युन्मय (Live) तार के श्रेणीक्रम में लगाया जाता है ताकि फ़्यूज़ उड़ने पर उपकरण 220 V के उच्च विभव से पूरी तरह कट जाए।',
      },
    },
    hotsClaimAndRubric: {
      title: {
        en: 'Practical HOTS Conclusion: Maximum Number of 100 W Bulbs Safe on a 220 V, 5 A Fuse Line',
        hi: 'प्रायोगिक उच्च स्तरीय निष्कर्ष: 220 V, 5 A फ़्यूज़ लाइन पर 100 W के अधिकतम सुरक्षित बल्बों की संख्या',
      },
      prompt: {
        en: 'A domestic lighting circuit operating at 220 V is protected by a 5 A fuse. How many 100 W, 220 V electric bulbs can be safely operated in PARALLEL on this circuit simultaneously without blowing the 5 A fuse? Show your calculation.',
        hi: '220 V पर कार्यरत एक घरेलू प्रकाश परिपथ 5 A के फ़्यूज़ द्वारा सुरक्षित है। इस परिपथ में 100 W, 220 V के अधिकतम कितने बल्ब एक साथ पार्श्वक्रम (समानांतर) में सुरक्षित रूप से जलाए जा सकते हैं ताकि 5 A का फ़्यूज़ न उड़े? गणना दर्शाइए।',
      },
      claimOptions: [
        {
          en: '11 bulbs maximum (Maximum safe power P_max = 220 V × 5 A = 1100 W ⇒ n = 1100 W / 100 W = 11 bulbs; adding a 12th bulb draws 5.45 A > 5 A and blows the fuse).',
          hi: 'अधिकतम 11 बल्ब (अधिकतम सुरक्षित शक्ति P_max = 220 V × 5 A = 1100 W ⇒ n = 1100 / 100 = 11 बल्ब; 12वाँ बल्ब जोड़ने पर धारा 5.45 A > 5 A हो जाएगी)।',
        },
        {
          en: '22 bulbs.',
          hi: '22 बल्ब।',
        },
        {
          en: '5 bulbs.',
          hi: '5 बल्ब।',
        },
      ],
      correctClaimIndex: 0,
      claimExplanation: {
        en: 'Each 100 W bulb at 220 V draws I₁ = 100/220 = 0.4545 A. For n bulbs in parallel, total current n × (100/220) ≤ 5 A ⇒ n ≤ (220 × 5) / 100 = 11 bulbs.',
        hi: 'प्रत्येक 100 W बल्ब I₁ = 100/220 A धारा लेता है। n बल्बों के लिए कुल शक्ति n × 100 ≤ 220 × 5 (1100 W) ⇒ n ≤ 11 बल्ब।',
      },
      rubricPoints: [
        {
          en: 'Calculates maximum safe power allowed by the 5 A fuse at 220 V: P_max = V × I_max = 220 × 5 = 1100 W (or current per bulb I₁ = 100/220 A).',
          hi: '5 A फ़्यूज़ द्वारा 220 V पर अनुमत अधिकतम सुरक्षित शक्ति निकालता है: P_max = 220 × 5 = 1100 W।',
        },
        {
          en: 'Uses parallel additive power P_total = n × 100 W ≤ 1100 W to find n = 1100 / 100 = 11 bulbs.',
          hi: 'पार्श्वक्रम में कुल शक्ति n × 100 ≤ 1100 W से अधिकतम संख्या n = 11 बल्ब ज्ञात करता है।',
        },
        {
          en: 'Notes that connecting a 12th bulb would draw 1200 W / 220 V = 5.45 A (> 5 A), causing overloading and melting the fuse.',
          hi: 'स्पष्ट करता है कि 11 से अधिक (जैसे 12) बल्ब जलाने पर धारा 5.45 A (> 5 A) हो जाएगी और अतिभारण से फ़्यूज़ पिघल जाएगा।',
        },
      ],
    },
  },
}

export interface WorkbenchStudentState {
  observationChoice?: number
  observationLocked?: boolean
  claimChoice?: number
  claimLocked?: boolean
  writtenConclusion?: string
  rubricChecked?: readonly boolean[]
}

export interface WorkbenchScoreSummary {
  observationCorrect: boolean
  claimCorrect: boolean
  autoGradedScore: number
  autoGradedPossible: 2
  selfAssessedRubricScore: number
  selfAssessedRubricPossible: 3
}

/**
 * Evaluates a student's progress on a standalone chapter workbench practical record,
 * strictly separating the 2 deterministic Auto-Graded items from the 3 Self-Assessed
 * written conclusion rubric checkpoints.
 */
export function evaluateWorkbenchLabRecord(
  record: WorkbenchLabRecord,
  state: WorkbenchStudentState
): WorkbenchScoreSummary {
  const observationCorrect =
    Boolean(state.observationLocked) &&
    state.observationChoice === record.observationCheck.correctIndex

  const claimCorrect =
    Boolean(state.claimLocked) &&
    state.claimChoice === record.hotsClaimAndRubric.correctClaimIndex

  const autoGradedScore = (observationCorrect ? 1 : 0) + (claimCorrect ? 1 : 0)
  const selfAssessedRubricScore = state.rubricChecked
    ? state.rubricChecked.filter(Boolean).length
    : 0

  return {
    observationCorrect,
    claimCorrect,
    autoGradedScore,
    autoGradedPossible: 2,
    selfAssessedRubricScore,
    selfAssessedRubricPossible: 3,
  }
}
