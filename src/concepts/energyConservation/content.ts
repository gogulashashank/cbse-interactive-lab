import type { Localized } from '../../kit/i18n'

export interface ConceptContentItem {
  hook: Localized
  predictQuestion: Localized
  predictOptions: Localized[]
  predictCorrectIndex: number
  predictExplanation: Localized
  insightSummary: Localized
  insightFormula: string
  insightTerm: Localized
  examQuestions: {
    title: Localized
    prompt: Localized
    options: Localized[]
    correctIndex: number
    hint: Localized
    steps: { label: Localized; content: Localized }[]
    finalAnswer: Localized
  }[]
}

export const ENERGY_CONSERVATION_CONTENT: Record<string, ConceptContentItem> = {
  'electrical-energy-transfer': {
    hook: {
      en: 'A 1000 W immersion rod heats water for 15 minutes. Where does electrical energy go, and how is it measured?',
      hi: '1000 W का पानी गर्म करने वाला हीटर 15 मिनट चलता है। विद्युत ऊर्जा कहाँ जाती है और इसकी गणना कैसे की जाती है?',
    },
    predictQuestion: {
      en: 'If a 2 kW water heater runs for 30 minutes, how much electrical energy is transferred into thermal heat?',
      hi: 'यदि 2 kW का वॉटर हीटर 30 मिनट तक चलता है, तो कितनी विद्युत ऊर्जा ऊष्मा में परिवर्तित होती है?',
    },
    predictOptions: [
      { en: '1 kWh (3.6 × 10⁶ J)', hi: '1 kWh (3.6 × 10⁶ जूल)' },
      { en: '60 kWh (2.16 × 10⁸ J)', hi: '60 kWh (2.16 × 10⁸ जूल)' },
      { en: '2 kWh (7.2 × 10⁶ J)', hi: '2 kWh (7.2 × 10⁶ जूल)' },
      { en: '0.5 kWh (1.8 × 10⁶ J)', hi: '0.5 kWh (1.8 × 10⁶ जूल)' },
    ],
    predictCorrectIndex: 0,
    predictExplanation: {
      en: 'Energy = Power × Time. 2 kW × 0.5 hours = 1 kWh = 1,000 W × 1,800 s = 3,600,000 Joules (3.6 MJ). Energy is strictly conserved into heat!',
      hi: 'ऊर्जा = शक्ति × समय। 2 kW × 0.5 घंटे = 1 kWh = 1,000 W × 1,800 सेकंड = 3.6 × 10⁶ जूल। ऊर्जा नष्ट नहीं होती, शत-प्रतिशत ऊष्मा में बदलती है!',
    },
    insightSummary: {
      en: 'Electrical work done W = V × Q = V × (I × t) = I²Rt = (V²/R)t. Energy cannot be destroyed; in pure resistors, 100% turns into thermal internal energy (Joule heating).',
      hi: 'विद्युत कार्य W = V × Q = V × I × t = I²Rt = (V²/R)t। ऊर्जा कभी नष्ट नहीं होती; शुद्ध प्रतिरोधकों में यह पूरी तरह तापीय ऊर्जा (जूल तापन) में बदलती है।',
    },
    insightFormula: 'E = V · I · t = I² · R · t = P · t',
    insightTerm: {
      en: 'First Law of Thermodynamics in Circuits (ऊर्जा संरक्षण नियम)',
      hi: 'परिपथ में ऊर्जा संरक्षण का प्रथम नियम (First Law)',
    },
    examQuestions: [
      {
        title: {
          en: 'CBSE Class 10 Board Numerical (3 Marks)',
          hi: 'सीबीएसई कक्षा 10 बोर्ड संख्यात्मक प्रश्न (3 अंक)',
        },
        prompt: {
          en: 'An electric iron of resistance 20 Ω takes a current of 5 A. Calculate the heat developed in 30 seconds.',
          hi: '20 Ω प्रतिरोध का एक विद्युत हीटर 5 A की धारा लेता है। 30 सेकंड में उत्पन्न ऊष्मा परिकलित कीजिए।',
        },
        options: [
          { en: '15,000 J', hi: '15,000 जूल' },
          { en: '3,000 J', hi: '3,000 जूल' },
          { en: '750 J', hi: '750 जूल' },
          { en: '30,000 J', hi: '30,000 जूल' },
        ],
        correctIndex: 0,
        hint: {
          en: 'Apply Joule’s Law of Heating: H = I² · R · t.',
          hi: 'जूल का तापन नियम प्रयोग करें: H = I² · R · t।',
        },
        steps: [
          {
            label: { en: 'Step 1: Identify given quantities', hi: 'चरण 1: दिए गए मान लिखें' },
            content: { en: 'Current I = 5 A, Resistance R = 20 Ω, Time t = 30 s.', hi: 'धारा I = 5 A, प्रतिरोध R = 20 Ω, समय t = 30 सेकंड।' },
          },
          {
            label: { en: 'Step 2: Apply formula', hi: 'चरण 2: सूत्र का प्रयोग' },
            content: { en: 'H = I²Rt = (5 A)² × 20 Ω × 30 s = 25 × 20 × 30 J.', hi: 'H = I²Rt = (5)² × 20 × 30 = 25 × 600 जूल।' },
          },
          {
            label: { en: 'Step 3: Calculate value', hi: 'चरण 3: अंतिम उत्तर' },
            content: { en: 'H = 15,000 J (or 15 kJ).', hi: 'H = 15,000 जूल (या 15 kJ)।' },
          },
        ],
        finalAnswer: {
          en: 'Heat developed is 15,000 Joules (1.5 × 10⁴ J).',
          hi: 'उत्पन्न ऊष्मा 15,000 जूल (15 kJ) है।',
        },
      },
    ],
  },

  'charge-conservation-junction': {
    hook: {
      en: 'When water pipes split into a T-junction, does water vanish? How does electric current behave at a circuit junction?',
      hi: 'जब पानी का पाइप टी-जंक्शन पर दो हिस्सों में बंटता है, क्या पानी गायब होता है? परिपथ के जोड़ पर विद्युत धारा कैसे व्यवहार करती है?',
    },
    predictQuestion: {
      en: 'If 5 A enters a parallel junction and 2 A flows into branch 1, how much current MUST flow into branch 2?',
      hi: 'यदि एक समानांतर जंक्शन में 5 A धारा प्रवेश करती है और शाखा 1 में 2 A जाती है, तो शाखा 2 में कितनी धारा जाएगी?',
    },
    predictOptions: [
      { en: '3 A (Exact conservation: 5 - 2 = 3 A)', hi: '3 A (पूर्ण संरक्षण: 5 - 2 = 3 A)' },
      { en: '2.5 A (Current divides equally regardless of resistance)', hi: '2.5 A (प्रतिरोध की परवाह किए बिना बराबर बंटती है)' },
      { en: '5 A (Current is duplicated in every branch)', hi: '5 A (हर शाखा में पूरी धारा जाती है)' },
      { en: '1 A (Energy is lost at the joint)', hi: '1 A (जोड़ पर ऊर्जा का नुकसान होता है)' },
    ],
    predictCorrectIndex: 0,
    predictExplanation: {
      en: 'Electric charge cannot accumulate or vanish at a wire junction. Total rate of charge entering must equal total rate of charge leaving: I_total = I₁ + I₂. 5 A - 2 A = 3 A.',
      hi: 'तार के जोड़ पर आवेश न तो जमा हो सकता है न नष्ट हो सकता है। प्रवेश करने वाली कुल धारा बाहर निकलने वाली कुल धारा के बराबर होनी चाहिए: I_कुल = I₁ + I₂। 5 A - 2 A = 3 A।',
    },
    insightSummary: {
      en: 'Charge is strictly conserved. At every junction in an electric circuit, the sum of incoming currents equals the sum of outgoing currents (Σ I_in = Σ I_out). Current is NEVER "consumed" by resistors.',
      hi: 'आवेश पूर्णतः संरक्षित रहता है। परिपथ के किसी भी जंक्शन (जोड़) पर आने वाली धाराओं का योग जाने वाली धाराओं के योग के बराबर होता है (Σ I_in = Σ I_out)। प्रतिरोधक कभी करंट को "खा" नहीं जाते।',
    },
    insightFormula: 'Σ I_in = Σ I_out (Kirchhoff’s Current Law / Charge Conservation)',
    insightTerm: {
      en: 'Conservation of Electric Charge (आवेश संरक्षण नियम)',
      hi: 'आवेश संरक्षण का नियम (Conservation of Charge)',
    },
    examQuestions: [
      {
        title: {
          en: 'CBSE Board Conceptual Question (2 Marks)',
          hi: 'सीबीएसई बोर्ड सैद्धांतिक प्रश्न (2 अंक)',
        },
        prompt: {
          en: 'A student says: "Resistors consume electric current, so the current leaving a resistor is less than the current entering it." Is the student correct? Explain.',
          hi: 'एक छात्र कहता है: "प्रतिरोधक विद्युत धारा का उपभोग करते हैं, इसलिए प्रतिरोधक से निकलने वाली धारा उसमें प्रवेश करने वाली धारा से कम होती है।" क्या छात्र सही है? कारण स्पष्ट कीजिए।',
        },
        options: [
          { en: 'No: Resistors consume electrical potential energy (voltage), NOT electric current. Current is conserved.', hi: 'नहीं: प्रतिरोधक विद्युत ऊर्जा (विभवांतर) का उपभोग करते हैं, विद्युत धारा का नहीं। धारा संरक्षित रहती है।' },
          { en: 'Yes: Some current is converted into heat.', hi: 'हाँ: कुछ धारा ऊष्मा में बदल जाती है।' },
          { en: 'Yes: Only superconductors conserve current.', hi: 'हाँ: केवल अतिचालक ही धारा संरक्षित रखते हैं।' },
          { en: 'No: Resistors actually increase current.', hi: 'नहीं: प्रतिरोधक धारा को बढ़ा देते हैं।' },
        ],
        correctIndex: 0,
        hint: {
          en: 'Think of current as rate of electron flow. Do electrons disappear when they pass through a resistor?',
          hi: 'धारा को इलेक्ट्रॉनों के प्रवाह की दर मानें। क्या प्रतिरोधक से गुजरने पर इलेक्ट्रॉन गायब हो जाते हैं?',
        },
        steps: [
          {
            label: { en: 'Step 1: Direct statement', hi: 'चरण 1: सीधा उत्तर' },
            content: { en: 'The student is INCORRECT.', hi: 'छात्र का कथन गलत (असत्य) है।' },
          },
          {
            label: { en: 'Step 2: Physics reason', hi: 'चरण 2: वैज्ञानिक कारण' },
            content: { en: 'Current represents the rate of flow of charge (I = Q/t). Charges are not destroyed. Resistors drop potential energy per coulomb (V), converting electrical energy into heat, while the rate of charge leaving equals the rate entering.', hi: 'धारा आवेश प्रवाह की दर (I = Q/t) है। आवेश नष्ट नहीं होता। प्रतिरोधक केवल प्रति कूलॉम ऊर्जा (विभव) को ऊष्मा में बदलते हैं, जबकि धारा दोनों सिरों पर समान रहती है।' },
          },
        ],
        finalAnswer: {
          en: 'Incorrect. Resistors dissipate energy, not charge. Current entering equals current leaving.',
          hi: 'असत्य। प्रतिरोधक ऊर्जा खर्च करते हैं, आवेश नहीं। आने वाली धारा जाने वाली धारा के बराबर होती है।',
        },
      },
    ],
  },

  'circuit-power-balance': {
    hook: {
      en: 'If a battery provides 60 W of electrical power to two bulbs, can the bulbs consume 70 W or 50 W?',
      hi: 'यदि एक बैटरी दो बल्बों को कुल 60 W विद्युत शक्ति प्रदान करती है, तो क्या दोनों बल्ब मिलकर 70 W या 50 W खर्च कर सकते हैं?',
    },
    predictQuestion: {
      en: 'A 12 V battery delivers 5 A to a parallel network of two resistors. If resistor 1 dissipates 24 W, what power MUST resistor 2 dissipate?',
      hi: 'एक 12 V बैटरी दो समानांतर प्रतिरोधकों को 5 A कुल धारा देती है। यदि प्रतिरोधक 1 में 24 W खर्च होता है, तो प्रतिरोधक 2 में कितनी शक्ति खर्च होगी?',
    },
    predictOptions: [
      { en: '36 W (Total power 60 W - 24 W = 36 W)', hi: '36 W (कुल शक्ति 60 W - 24 W = 36 W)' },
      { en: '24 W (Both must dissipate equal power)', hi: '24 W (दोनों को बराबर शक्ति खर्च करनी होगी)' },
      { en: '60 W (Each branch gets the total power)', hi: '60 W (प्रत्येक शाखा को पूरी शक्ति मिलती है)' },
      { en: '12 W (Power halves across branches)', hi: '12 W (शाखाओं में शक्ति आधी हो जाती है)' },
    ],
    predictCorrectIndex: 0,
    predictExplanation: {
      en: 'Total power supplied by source P_source = V × I = 12 V × 5 A = 60 W. By conservation of energy, P_total = P₁ + P₂. Therefore P₂ = 60 W - 24 W = 36 W.',
      hi: 'स्रोत द्वारा दी गई कुल शक्ति P_स्रोत = V × I = 12 V × 5 A = 60 W। ऊर्जा संरक्षण से P_कुल = P₁ + P₂। अतः P₂ = 60 W - 24 W = 36 W।',
    },
    insightSummary: {
      en: 'The Total Power Balance: In ANY complete circuit (series, parallel, or complex), total power delivered by the electrical source EQUALS the sum of powers dissipated by all individual circuit components (P_battery = Σ P_loads).',
      hi: 'संपूर्ण शक्ति संतुलन (Power Balance): किसी भी परिपथ (श्रेणीक्रम, पार्श्वक्रम या मिश्रित) में स्रोत द्वारा दी गई कुल विद्युत शक्ति सभी उपकरणों द्वारा खर्च की गई शक्ति के योग के ठीक बराबर होती है (P_बैटरी = Σ P_लोड)।',
    },
    insightFormula: 'P_source = V_battery · I_total = Σ P_components',
    insightTerm: {
      en: 'Circuit Power Balance Principle (परिपथ शक्ति संतुलन)',
      hi: 'परिपथ शक्ति संतुलन सिद्धांत (Circuit Power Conservation)',
    },
    examQuestions: [
      {
        title: {
          en: 'CBSE Class 10 Board Calculation (3 Marks)',
          hi: 'सीबीएसई कक्षा 10 बोर्ड गणना प्रश्न (3 अंक)',
        },
        prompt: {
          en: 'Two lamps rated 100 W at 220 V and 60 W at 220 V are connected in parallel to an electric mains supply of 220 V. What is the total power drawn from the mains?',
          hi: '220 V पर 100 W तथा 220 V पर 60 W अनुमत दो विद्युत लैम्प 220 V मेन्स के साथ पार्श्वक्रम में जुड़े हैं। मेन्स से कुल कितनी शक्ति ली जाती है?',
        },
        options: [
          { en: '160 W', hi: '160 W' },
          { en: '37.5 W', hi: '37.5 W' },
          { en: '40 W', hi: '40 W' },
          { en: '220 W', hi: '220 W' },
        ],
        correctIndex: 0,
        hint: {
          en: 'Both lamps are connected in parallel at their rated voltage (220 V). Power adds up directly.',
          hi: 'दोनों लैम्प अपने रेटेड वोल्टेज (220 V) पर पार्श्वक्रम में जुड़े हैं। शक्तियाँ सीधे जुड़ती हैं।',
        },
        steps: [
          {
            label: { en: 'Step 1: Identify operating voltage', hi: 'चरण 1: कार्यकारी वोल्टेज पहचानें' },
            content: { en: 'Mains voltage = 220 V, which equals the rated voltage for both lamps. Hence each lamp operates at its rated wattage.', hi: 'सप्लाई वोल्टेज 220 V है, जो दोनों लैम्पों का रेटेड वोल्टेज है। अतः प्रत्येक लैम्प अपनी पूरी शक्ति पर कार्य करेगा।' },
          },
          {
            label: { en: 'Step 2: Sum total power', hi: 'चरण 2: कुल शक्ति का योग' },
            content: { en: 'P_total = P₁ + P₂ = 100 W + 60 W = 160 W.', hi: 'P_कुल = P₁ + P₂ = 100 W + 60 W = 160 W।' },
          },
        ],
        finalAnswer: {
          en: 'Total power drawn is 160 Watts.',
          hi: 'मेन्स से ली गई कुल शक्ति 160 वाट है।',
        },
      },
    ],
  },

  'mechanical-ramp-conservation': {
    hook: {
      en: 'A ball sits at the top of a 10 m high ramp. As it rolls down without friction, does energy vanish?',
      hi: 'एक गेंद 10 मीटर ऊंचे आनत तल (रैंप) के शीर्ष पर रखी है। बिना घर्षण के नीचे लुढ़कते हुए क्या ऊर्जा गायब हो जाती है?',
    },
    predictQuestion: {
      en: 'A 2 kg cart has 196 J of potential energy at the top of a ramp. Halfway down (5 m), what is its kinetic energy (frictionless)?',
      hi: 'एक 2 kg की ट्रॉली की शीर्ष पर स्थितिज ऊर्जा 196 जूल है। आधी ऊंचाई (5 m) पर पहुँचने पर उसकी गतिज ऊर्जा कितनी होगी (घर्षणहीन)?',
    },
    predictOptions: [
      { en: '98 J (Exactly half of PE is converted to KE)', hi: '98 जूल (स्थितिज ऊर्जा की ठीक आधी गतिज ऊर्जा में बदल जाती है)' },
      { en: '196 J (KE is already maximum)', hi: '196 जूल (गतिज ऊर्जा पहले से अधिकतम हो चुकी है)' },
      { en: '0 J (It is still only falling)', hi: '0 जूल (यह अभी केवल गिर रही है)' },
      { en: '49 J (Quarter due to square root)', hi: '49 जूल (वर्गमूल के कारण चौथाई)' },
    ],
    predictCorrectIndex: 0,
    predictExplanation: {
      en: 'Total Mechanical Energy E = PE + KE = constant. At halfway, height is halved, so PE = mgh = 98 J. The lost 98 J of PE has transformed completely into KE = 98 J. Total remains 196 J!',
      hi: 'कुल यांत्रिक ऊर्जा E = स्थितिज ऊर्जा (PE) + गतिज ऊर्जा (KE) = स्थिर। आधी ऊंचाई पर PE = 98 J रह जाती है। लुप्त हुई 98 J स्थितिज ऊर्जा पूरी तरह KE = 98 J में बदल जाती है। कुल योग 196 J ही रहता है!',
    },
    insightSummary: {
      en: 'Mechanical Energy Conservation: In the absence of dissipative friction, the sum of Potential Energy (PE = mgh) and Kinetic Energy (KE = ½mv²) remains constant at every point along the descent: E_total = PE + KE = const.',
      hi: 'यांत्रिक ऊर्जा संरक्षण: घर्षण की अनुपस्थिति में आनत तल पर गति के प्रत्येक बिंदु पर स्थितिज ऊर्जा (PE = mgh) और गतिज ऊर्जा (KE = ½mv²) का योग हमेशा स्थिर रहता है: E_कुल = PE + KE = स्थिर।',
    },
    insightFormula: 'E_total = m·g·h + ½·m·v² = constant',
    insightTerm: {
      en: 'Conservation of Mechanical Energy (यांत्रिक ऊर्जा संरक्षण)',
      hi: 'यांत्रिक ऊर्जा संरक्षण का नियम (Conservation of Mechanical Energy)',
    },
    examQuestions: [
      {
        title: {
          en: 'CBSE Class 9 Board Question (3 Marks)',
          hi: 'सीबीएसई कक्षा 9 बोर्ड प्रश्न (3 अंक)',
        },
        prompt: {
          en: 'An object of mass 2 kg is dropped from a height of 10 m. Calculate its kinetic energy when it hits the ground. (Take g = 9.8 m/s²)',
          hi: '2 kg द्रव्यमान की एक वस्तु को 10 m की ऊंचाई से गिराया जाता है। जमीन से टकराते समय इसकी गतिज ऊर्जा परिकलित कीजिए। (g = 9.8 m/s² लें)',
        },
        options: [
          { en: '196 J', hi: '196 जूल' },
          { en: '98 J', hi: '98 जूल' },
          { en: '392 J', hi: '392 जूल' },
          { en: '19.6 J', hi: '19.6 जूल' },
        ],
        correctIndex: 0,
        hint: {
          en: 'By conservation of energy, the kinetic energy at ground level equals the initial potential energy at the top.',
          hi: 'ऊर्जा संरक्षण के अनुसार, जमीन पर गतिज ऊर्जा शीर्ष पर प्रारंभिक स्थितिज ऊर्जा के बराबर होगी।',
        },
        steps: [
          {
            label: { en: 'Step 1: Calculate initial potential energy', hi: 'चरण 1: प्रारंभिक स्थितिज ऊर्जा की गणना' },
            content: { en: 'PE_initial = m × g × h = 2 kg × 9.8 m/s² × 10 m = 196 J.', hi: 'PE_प्रारंभिक = m × g × h = 2 × 9.8 × 10 = 196 जूल।' },
          },
          {
            label: { en: 'Step 2: Apply energy conservation', hi: 'चरण 2: ऊर्जा संरक्षण लागू करें' },
            content: { en: 'At ground level, height h = 0, so PE = 0. All potential energy has converted to kinetic energy: KE_ground = PE_initial = 196 J.', hi: 'जमीन पर h = 0 होने से PE = 0 हो जाती है। समस्त स्थितिज ऊर्जा गतिज ऊर्जा में बदल जाती है: KE_जमीन = 196 जूल।' },
          },
        ],
        finalAnswer: {
          en: 'Kinetic energy at ground level is 196 Joules.',
          hi: 'जमीन पर टकराते समय गतिज ऊर्जा 196 जूल होगी।',
        },
      },
    ],
  },
}
