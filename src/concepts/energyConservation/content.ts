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

  'archimedes-buoyancy-float': {
    hook: {
      en: 'A heavy stone feels much lighter while submerged in a bucket of water, and a wooden block floats effortlessly on top. Where does the "missing" weight go?',
      hi: 'पानी की बाल्टी में डूबा हुआ पत्थर हाथ में हल्का लगता है, और लकड़ी का गुटका ऊपर तैरता रहता है। पत्थर का यह "गायब" भार कहाँ चला जाता है?',
    },
    predictQuestion: {
      en: 'A solid metal block of volume 400 cm³ and weight 10 N in air is completely submerged in water (density 1 g/cm³, g = 10 m/s²). It displaces 400 cm³ (0.4 kg) of water weighing 4 N. What will the spring balance read?',
      hi: '400 cm³ आयतन और वायु में 10 N भार वाला एक धातु का गुटका पानी (घनत्व 1 g/cm³, g = 10 m/s²) में पूर्णतः डुबोया जाता है। यह 4 N भार का 400 cm³ (0.4 kg) पानी विस्थापित करता है। कमानीदार तुला का पाठ्यांक क्या होगा?',
    },
    predictOptions: [
      {
        en: '6 N (Apparent weight = 10 N − 4 N upward buoyant force)',
        hi: '6 N (आभासी भार = 10 N − 4 N उत्प्लावन बल)',
      },
      {
        en: '10 N (Weight never changes in water)',
        hi: '10 N (पानी में पाठ्यांक नहीं बदलता)',
      },
      {
        en: '4 N (Equal to the weight of displaced water)',
        hi: '4 N (विस्थापित पानी के भार के बराबर)',
      },
    ],
    predictCorrectIndex: 0,
    predictExplanation: {
      en: 'By Archimedes’ Principle, the upward buoyant force F_B equals the weight of the displaced water (4 N). Therefore the apparent weight on the spring scale is W_air − F_B = 10 N − 4 N = 6 N!',
      hi: 'आर्किमिडीज के सिद्धांत के अनुसार ऊपर की ओर लगने वाला उत्प्लावन बल F_B विस्थापित पानी के भार (4 N) के बराबर होता है। अतः आभासी भार = 10 N − 4 N = 6 N होगा!',
    },
    insightSummary: {
      en: 'Archimedes’ Principle: Any body immersed in a fluid experiences an upward buoyant force equal to the weight of the fluid it displaces (F_B = W_displaced). Objects with ρ_obj ≤ ρ_fluid float; objects with ρ_obj > ρ_fluid sink.',
      hi: 'आर्किमिडीज का सिद्धांत: जब किसी वस्तु को तरल में डुबोया जाता है, तो उस पर ऊपर की ओर उत्प्लावन बल लगता है जो वस्तु द्वारा हटाए गए तरल के भार के बराबर होता है (F_B = W_विस्थापित)। यदि ρ_वस्तु ≤ ρ_तरल हो तो वस्तु तैरती है।',
    },
    insightFormula: 'F_B = W_displaced = ρ_fluid · V_disp · g  |  W_app = W_air − F_B',
    insightTerm: {
      en: 'Archimedes’ Principle & Floatation (NCERT Ch 9.5–9.6)',
      hi: 'आर्किमिडीज का सिद्धांत एवं प्लवन (NCERT 9.5–9.6)',
    },
    examQuestions: [
      {
        title: {
          en: 'NCERT Class 9 Gravitation · Sealed Packet Floatation Test',
          hi: 'NCERT कक्षा 9 · बंद पैकेट का तैरना या डूबना',
        },
        prompt: {
          en: 'The volume of a 500 g sealed packet is 350 cm³. Will the packet float or sink in water if the density of water is 1 g/cm³? What will be the mass of the water displaced by this packet?',
          hi: '500 g के एक मोहरबंद पैकेट का आयतन 350 cm³ है। पैकेट <1 g/cm³ घनत्व वाले पानी में तैरेगा या डूबेगा? इस पैकेट द्वारा विस्थापित पानी का द्रव्यमान कितना होगा?',
        },
        options: [
          {
            en: 'It will SINK (ρ = 1.43 g/cm³ > 1 g/cm³) and displace 350 g of water.',
            hi: 'यह डूबेगा (ρ = 1.43 g/cm³ > 1 g/cm³) और 350 g पानी विस्थापित करेगा।',
          },
          {
            en: 'It will FLOAT and displace 500 g of water.',
            hi: 'यह तैरेगा और 500 g पानी विस्थापित करेगा।',
          },
          {
            en: 'It will SINK and displace 500 g of water.',
            hi: 'यह डूबेगा और 500 g पानी विस्थापित करेगा।',
          },
          {
            en: 'It will FLOAT and displace 350 g of water.',
            hi: 'यह तैरेगा और 350 g पानी विस्थापित करेगा।',
          },
        ],
        correctIndex: 0,
        hint: {
          en: 'First find the packet’s density ρ = Mass / Volume = 500 g / 350 cm³. Since it sinks completely, displaced water volume equals the packet’s full 350 cm³ volume.',
          hi: 'पहले पैकेट का घनत्व ρ = 500 / 350 निकालें। चूँकि यह डूबता है, विस्थापित पानी का आयतन 350 cm³ होगा।',
        },
        steps: [
          {
            label: { en: 'Step 1: Packet Density', hi: 'चरण 1: पैकेट का घनत्व' },
            content: {
              en: 'ρ_packet = 500 g / 350 cm³ = 1.43 g/cm³. Since 1.43 > 1.0 g/cm³, the packet sinks.',
              hi: 'ρ_पैकेट = 500 g / 350 cm³ = 1.43 g/cm³ > 1.0 g/cm³, अतः पैकेट डूब जाएगा।',
            },
          },
          {
            label: { en: 'Step 2: Mass of Displaced Water', hi: 'चरण 2: विस्थापित पानी का द्रव्यमान' },
            content: {
              en: 'Fully submerged volume V_disp = 350 cm³. Mass of water = 350 cm³ × 1 g/cm³ = 350 g.',
              hi: 'पूर्णतः डूबा आयतन V_disp = 350 cm³। विस्थापित पानी का द्रव्यमान = 350 × 1 = 350 g।',
            },
          },
        ],
        finalAnswer: {
          en: 'Packet sinks (ρ = 1.43 g/cm³) and displaces 350 g of water.',
          hi: 'पैकेट डूबेगा (ρ = 1.43 g/cm³) और 350 g पानी विस्थापित करेगा।',
        },
      },
    ],
  },

  'chemical-equation-mass-balance': {
    hook: {
      en: 'When red-hot iron reacts with steam (Fe + H₂O → Fe₃O₄ + H₂), why can’t you just erase the subscript “3” in Fe₃O₄ to balance the iron atoms?',
      hi: 'जब तप्त लोहा भाप से अभिक्रिया करता है (Fe + H₂O → Fe₃O₄ + H₂), तो आयरन परमाणुओं को संतुलित करने के लिए आप Fe₃O₄ के पादांक (subscript) “3” को क्यों नहीं मिटा सकते?',
    },
    predictQuestion: {
      en: 'To obey Lavoisier’s Law of Conservation of Mass in the skeletal equation c₁Fe + c₂H₂O → c₃Fe₃O₄ + c₄H₂, what stoichiometric coefficients (c₁ : c₂ : c₃ : c₄) balance every atom and make the total reactant mass equal the total product mass (240 g = 240 g)?',
      hi: 'कंकाली समीकरण c₁Fe + c₂H₂O → c₃Fe₃O₄ + c₄H₂ में द्रव्यमान संरक्षण के नियम का पालन करने के लिए कौन-से गुणांक (c₁ : c₂ : c₃ : c₄) सभी परमाणुओं और कुल द्रव्यमान (240 g = 240 g) को संतुलित करते हैं?',
    },
    predictOptions: [
      {
        en: '3Fe + 4H₂O → 1Fe₃O₄ + 4H₂ (3 Fe, 8 H, 4 O on both sides; 240 g LHS = 240 g RHS)',
        hi: '3Fe + 4H₂O → 1Fe₃O₄ + 4H₂ (दोनों ओर 3 Fe, 8 H, 4 O; 240 g LHS = 240 g RHS)',
      },
      {
        en: '1Fe + 4H₂O → 1Fe₃O₄ + 4H₂',
        hi: '1Fe + 4H₂O → 1Fe₃O₄ + 4H₂',
      },
      {
        en: '3Fe + 1H₂O → 1Fe₃O₄ + 1H₂',
        hi: '3Fe + 1H₂O → 1Fe₃O₄ + 1H₂',
      },
    ],
    predictCorrectIndex: 0,
    predictExplanation: {
      en: 'Fe₃O₄ contains 3 Fe atoms and 4 O atoms. Putting coefficient 4 in front of H₂O supplies 4 O atoms and 8 H atoms; putting 3 in front of Fe and 4 in front of H₂ balances all atoms (3 Fe, 8 H, 4 O) and conserves mass: (3×56) + (4×18) = 240 g = 232 + (4×2)!',
      hi: 'Fe₃O₄ में 3 Fe तथा 4 O परमाणु हैं। H₂O के आगे 4 लगाने से 4 O और 8 H मिलते हैं; Fe के आगे 3 और H₂ के आगे 4 लगाने से दोनों पक्षों में (3 Fe, 8 H, 4 O) तथा कुल द्रव्यमान 240 g = 240 g संतुलित हो जाता है!',
    },
    insightSummary: {
      en: 'Law of Conservation of Mass: Mass can neither be created nor destroyed in a chemical reaction. Balancing an equation means adjusting stoichiometric coefficients (front multipliers) while keeping chemical subscripts inside boxes untouched so LHS atom counts equal RHS atom counts.',
      hi: 'द्रव्यमान संरक्षण का नियम: किसी भी रासायनिक अभिक्रिया में द्रव्यमान का न तो निर्माण होता है न विनाश। रासायनिक सूत्र के पादांक (subscripts) बदले बिना केवल आगे के गुणांकों को समायोजित कर दोनों पक्षों के परमाणुओं की संख्या बराबर की जाती है।',
    },
    insightFormula: '3Fe(s) + 4H₂O(g) → Fe₃O₄(s) + 4H₂(g)  |  ∑ Mass_LHS = ∑ Mass_RHS',
    insightTerm: {
      en: 'Stoichiometric Balancing & Conservation of Mass (NCERT Ch 1.1)',
      hi: 'रासायनिक समीकरण संतुलन एवं द्रव्यमान संरक्षण (NCERT 1.1)',
    },
    examQuestions: [
      {
        title: {
          en: 'NCERT Class 10 Ch 1 · Balancing Barium Chloride + Aluminium Sulphate',
          hi: 'NCERT कक्षा 10 अध्याय 1 · बेरियम क्लोराइड एवं ऐलुमिनियम सल्फेट का संतुलन',
        },
        prompt: {
          en: 'Balance the double-displacement precipitation reaction: c₁ BaCl₂(aq) + c₂ Al₂(SO₄)₃(aq) → c₃ BaSO₄(s)↓ + c₄ AlCl₃(aq). What are the smallest whole-number coefficients (c₁, c₂, c₃, c₄)?',
          hi: 'द्विविस्थापन अवक्षेपण अभिक्रिया को संतुलित कीजिए: c₁ BaCl₂(aq) + c₂ Al₂(SO₄)₃(aq) → c₃ BaSO₄(s)↓ + c₄ AlCl₃(aq)। न्यूनतम पूर्णांक गुणांक (c₁, c₂, c₃, c₄) क्या होंगे?',
        },
        options: [
          { en: '3, 1, 3, 2 (3BaCl₂ + Al₂(SO₄)₃ → 3BaSO₄↓ + 2AlCl₃)', hi: '3, 1, 3, 2 (3BaCl₂ + Al₂(SO₄)₃ → 3BaSO₄↓ + 2AlCl₃)' },
          { en: '1, 1, 1, 1', hi: '1, 1, 1, 1' },
          { en: '2, 1, 2, 2', hi: '2, 1, 2, 2' },
          { en: '3, 2, 3, 2', hi: '3, 2, 3, 2' },
        ],
        correctIndex: 0,
        hint: {
          en: 'Start with the compound containing the most polyatomic groups: 1 Al₂(SO₄)₃ has 2 Al atoms and 3 SO₄²⁻ ions.',
          hi: 'सबसे अधिक परमाणु समूह वाले यौगिक Al₂(SO₄)₃ से प्रारंभ करें: इसमें 2 Al परमाणु और 3 SO₄²⁻ आयन हैं।',
        },
        steps: [
          {
            label: { en: 'Step 1: Balance Al and SO₄ groups', hi: 'चरण 1: Al तथा SO₄ समूहों को संतुलित करें' },
            content: { en: '1 Al₂(SO₄)₃ on LHS requires 2 AlCl₃ (for 2 Al) and 3 BaSO₄ (for 3 SO₄) on RHS.', hi: '1 Al₂(SO₄)₃ के लिए RHS पर 2 AlCl₃ तथा 3 BaSO₄ आवश्यक हैं।' },
          },
          {
            label: { en: 'Step 2: Balance Ba and Cl atoms', hi: 'चरण 2: Ba तथा Cl परमाणुओं को संतुलित करें' },
            content: { en: '3 BaSO₄ and 2 AlCl₃ on RHS contain 3 Ba and 6 Cl, which are supplied by 3 BaCl₂ on LHS.', hi: 'RHS के 3 Ba और 6 Cl को संतुलित करने के लिए LHS पर 3 BaCl₂ रखें।' },
          },
        ],
        finalAnswer: {
          en: '3BaCl₂(aq) + Al₂(SO₄)₃(aq) → 3BaSO₄(s)↓ + 2AlCl₃(aq)',
          hi: '3BaCl₂(aq) + Al₂(SO₄)₃(aq) → 3BaSO₄(s)↓ + 2AlCl₃(aq)',
        },
      },
    ],
  },

  'trophic-energy-magnification': {
    hook: {
      en: 'Why do terrestrial food chains almost never have more than 4 trophic levels—and why does a fish-eating hawk at the very top end up with 1,000 times more toxic DDT pesticide per gram of tissue than the plants at the bottom?',
      hi: 'आहार श्रृंखला में सामान्यतः 3 या 4 से अधिक पोषी स्तर क्यों नहीं होते—और सबसे ऊपर स्थित बाज या मनुष्य के शरीर में नीचे के पौधों की तुलना में 1,000 गुना अधिक विषैला DDT कीटनाशक कैसे जमा हो जाता है?',
    },
    predictQuestion: {
      en: 'In a terrestrial ecosystem, 1,000,000 J (10⁶ J) of sunlight falls on green leaves. Given that green plants capture 1% of incident sunlight and consumers transfer 10% of energy to the next trophic level, how much energy reaches (a) T₁ Producers, (b) T₂ Herbivores, and (c) T₄ Top Carnivores?',
      hi: 'किसी स्थलीय पारितंत्र में हरी पत्तियों पर 10,00,000 J (10⁶ J) सौर ऊर्जा आपतित होती है। यदि हरे पौधे सूर्य की ऊर्जा का 1% खाद्य ऊर्जा में बदलते हैं और आगे प्रत्येक पोषी स्तर पर 10% नियम लागू होता है, तो (a) T₁ उत्पादक, (b) T₂ शाकाहारी, तथा (c) T₄ शीर्ष मांसाहारी को कितनी ऊर्जा मिलेगी?',
    },
    predictOptions: [
      {
        en: '(a) T₁ Producers = 10,000 J (1% of 10⁶ J); (b) T₂ Herbivores = 1,000 J (10% of T₁); (c) T₄ Top Carnivores = 10 J (after T₃ = 100 J).',
        hi: '(a) T₁ उत्पादक = 10,000 J (10⁶ J का 1%); (b) T₂ शाकाहारी = 1,000 J (T₁ का 10%); (c) T₄ शीर्ष मांसाहारी = 10 J (T₃ = 100 J का 10%)।',
      },
      {
        en: '(a) T₁ = 100,000 J (applying 10% to sunlight instead of 1%); (b) T₂ = 10,000 J; (c) T₄ = 100 J.',
        hi: '(a) T₁ = 1,00,000 J (सूर्य की ऊर्जा पर 1% के बजाय 10% लगाने की भूल); (b) T₂ = 10,000 J।',
      },
      {
        en: 'All trophic levels receive the full 10,000 J because energy is conserved.',
        hi: 'सभी पोषी स्तरों को पूरे 10,000 J मिलते हैं।',
      },
    ],
    predictCorrectIndex: 0,
    predictExplanation: {
      en: 'Crucial NCERT distinction: Green plants capture only 1% of incident sunlight (1% of 1,000,000 J = 10,000 J at T₁)! Thereafter, Lindeman’s 10% Law applies between trophic levels: T₂ gets 10% of 10,000 = 1,000 J; T₃ gets 100 J; and T₄ gets just 10 J (with 90% dissipated as metabolic heat at every step)!',
      hi: 'महत्वपूर्ण NCERT नियम: हरे पौधे पत्तियों पर पड़ने वाली सौर ऊर्जा का केवल 1% भाग (10,00,000 J का 1% = 10,000 J) ग्रहण करते हैं! उसके बाद पोषी स्तरों के बीच 10% नियम लगता है: T₂ = 1,000 J, T₃ = 100 J तथा T₄ = केवल 10 J (प्रत्येक चरण में 90% ऊष्मा के रूप में व्यय हो जाती है)!',
    },
    insightSummary: {
      en: 'Energy flow in an ecosystem is UNIDIRECTIONAL and diminishes 10-fold at each consumer step (10% Law, 90% lost as metabolic heat), limiting food chains to 3–4 trophic levels. Conversely, non-biodegradable chemicals (DDT, mercury) cannot be digested and accumulate progressively up the chain (Biological Magnification).',
      hi: 'पारितंत्र में ऊर्जा का प्रवाह एकदिशिक होता है और प्रत्येक पोषी स्तर पर केवल 10% ऊर्जा आगे जाती है (90% ऊष्मा के रूप में पर्यावरण में चली जाती है), जिससे आहार श्रृंखला 3–4 स्तरों तक सीमित रहती है। इसके विपरीत अजैव-निम्निकरणीय रसायन (DDT) ऊपर के स्तरों में संचित होते जाते हैं (जैव-आवर्धन)।',
    },
    insightFormula: 'T₁ = 1% × E_sun  |  T_n = 10% × T_(n−1)  |  Biomagnification: [Toxin] increases ↑',
    insightTerm: {
      en: 'Lindeman’s 10% Energy Law & Biological Magnification (NCERT Ch 13.1)',
      hi: '10% ऊर्जा स्थानांतरण नियम एवं जैव-आवर्धन (NCERT 13.1)',
    },
    examQuestions: [
      {
        title: {
          en: 'CBSE Class 10 Board Numerical · 4-Level Food Chain Energy Transfer',
          hi: 'सीबीएसई कक्षा 10 बोर्ड संख्यात्मक प्रश्न · आहार श्रृंखला में ऊर्जा गणना',
        },
        prompt: {
          en: 'In the food chain Grass (T₁) → Grasshopper (T₂) → Frog (T₃) → Snake (T₄), if 5 J of energy is available to the Snake (T₄), how much energy was originally available in the Grass (T₁)?',
          hi: 'आहार श्रृंखला घास (T₁) → टिड्डा (T₂) → मेंढक (T₃) → साँप (T₄) में यदि चौथे पोषी स्तर के साँप (T₄) को 5 J ऊर्जा उपलब्ध है, तो उत्पादक घास (T₁) के पास कुल कितनी ऊर्जा उपलब्ध थी?',
        },
        options: [
          { en: '5,000 J (Multiply by 10 for each step backward: 5 → 50 → 500 → 5,000 J)', hi: '5,000 J (पीछे जाने पर प्रत्येक चरण में 10 से गुणा: 5 → 50 → 500 → 5,000 J)' },
          { en: '500 J', hi: '500 J' },
          { en: '50,000 J', hi: '50,000 J' },
          { en: '0.005 J', hi: '0.005 J' },
        ],
        correctIndex: 0,
        hint: {
          en: 'Moving UP the chain divides energy by 10 per step (×0.1), so moving DOWN from T₄ to T₁ multiplies energy by 10 three times (×10³ = ×1,000)!',
          hi: 'ऊपर जाने पर ऊर्जा 10 से भाग होती है, इसलिए T₄ से T₁ तक 3 कदम नीचे आने पर 10³ = 1,000 से गुणा करें!',
        },
        steps: [
          {
            label: { en: 'Step 1: Energy at T₃ (Frog)', hi: 'चरण 1: मेंढक (T₃) पर ऊर्जा' },
            content: { en: 'T₃ = 10 × T₄ = 10 × 5 J = 50 J.', hi: 'T₃ = 10 × 5 J = 50 J।' },
          },
          {
            label: { en: 'Step 2: Energy at T₂ (Grasshopper) and T₁ (Grass)', hi: 'चरण 2: टिड्डा (T₂) तथा घास (T₁) पर ऊर्जा' },
            content: { en: 'T₂ = 10 × 50 J = 500 J ⇒ T₁ (Grass) = 10 × 500 J = 5,000 J.', hi: 'T₂ = 500 J ⇒ T₁ (घास) = 10 × 500 J = 5,000 J।' },
          },
        ],
        finalAnswer: {
          en: 'Energy available in Grass (T₁) = 5,000 J.',
          hi: 'उत्पादक घास (T₁) में उपलब्ध ऊर्जा = 5,000 J।',
        },
      },
    ],
  },
}
