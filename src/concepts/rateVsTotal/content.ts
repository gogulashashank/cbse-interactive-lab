import type { Localized } from '../../kit/i18n'

export interface ConceptCardContent {
  hook: Localized
  predictQuestion: Localized
  predictOptions: readonly Localized[]
  predictCorrectIndex: number
  predictExplanation: Localized
  insightFormula: string
  insightTerm: Localized
  insightSummary: Localized
  examQuestions: readonly {
    title: Localized
    prompt: Localized
    options: readonly Localized[]
    correctIndex: number
    hint: Localized
    steps: readonly { label: Localized; content: Localized }[]
    finalAnswer: Localized
  }[]
}

export const RATE_VS_TOTAL_CONTENT: Record<string, ConceptCardContent> = {
  'rate-vs-total-intro': {
    hook: {
      en: 'A tap pours 5 litres every minute. How much water will be in the bucket after 4 minutes?',
      hi: 'एक नल से हर मिनट 5 लीटर पानी गिरता है। 4 मिनट बाद बाल्टी में कुल कितना पानी होगा?',
    },
    predictQuestion: {
      en: 'If you double the water flow rate from the tap, what happens to the time needed to fill a 20-litre bucket?',
      hi: 'यदि आप नल से पानी के बहने की दर (Flow Rate) दोगुनी कर दें, तो 20 लीटर की बाल्टी भरने में कितना समय लगेगा?',
    },
    predictOptions: [
      { en: 'Time required will be cut in half (Time halves).', hi: 'भरने में आधा समय लगेगा (समय आधा हो जाएगा)।' },
      { en: 'Time required will also double.', hi: 'भरने में दोगुना समय लगेगा।' },
      { en: 'Time required stays exactly the same.', hi: 'समय में कोई बदलाव नहीं होगा।' },
    ],
    predictCorrectIndex: 0,
    predictExplanation: {
      en: 'Because Total = Rate × Time, higher rate fills the fixed capacity faster: Time = Total ÷ Rate.',
      hi: 'क्योंकि कुल = दर × समय होता है। इसलिए दर बढ़ने पर बाल्टी भरने का समय घट जाता है: समय = कुल ÷ दर।',
    },
    insightFormula: 'Total = Rate × Time',
    insightTerm: { en: 'Rate vs Accumulated Total', hi: 'दर (Rate) बनाम कुल संचित मात्रा (Total)' },
    insightSummary: {
      en: 'A rate tells you "how fast per second or minute". The total is the accumulated amount over time.',
      hi: 'दर बताती है "प्रति सेकंड या मिनट में कितना"। कुल मात्रा समय के साथ जमा हुई कुल राशि होती है।',
    },
    examQuestions: [
      {
        title: { en: 'Class 9 Foundation · Flow Rate Calculation', hi: 'कक्षा 9 · प्रवाह दर की गणना' },
        prompt: {
          en: 'A water pump delivers water at a uniform rate of 25 litres per minute. Calculate the total volume of water pumped into an overhead tank in 12 minutes.',
          hi: 'एक पानी का पंप 25 लीटर प्रति मिनट की एकसमान दर से पानी देता है। 12 मिनट में छत की टंकी में भरे गए पानी का कुल आयतन ज्ञात कीजिए।',
        },
        options: [
          { en: '300 litres', hi: '300 लीटर' },
          { en: '2.08 litres', hi: '2.08 लीटर' },
          { en: '37 litres', hi: '37 लीटर' },
          { en: '3,000 litres', hi: '3,000 लीटर' },
        ],
        correctIndex: 0,
        hint: {
          en: 'Multiply flow rate (litres/min) by elapsed time in minutes: Total = Rate × Time.',
          hi: 'बहाव की दर को समय (मिनट) से गुणा करें: कुल = दर × समय।',
        },
        steps: [
          { label: { en: 'Given', hi: 'दिया है' }, content: { en: 'Rate = 25 L/min, Time t = 12 min', hi: 'दर = 25 लीटर/मिनट, समय t = 12 मिनट' } },
          { label: { en: 'Formula', hi: 'सूत्र' }, content: { en: 'Total Volume = Rate × Time', hi: 'कुल आयतन = दर × समय' } },
          { label: { en: 'Substitution', hi: 'मान रखने पर' }, content: { en: 'V = 25 × 12', hi: 'V = 25 × 12' } },
        ],
        finalAnswer: { en: 'Total Volume = 300 Litres', hi: 'कुल आयतन = 300 लीटर' },
      },
    ],
  },

  'current-vs-charge': {
    hook: {
      en: 'Does an electric bulb "eat up" electric current, so less current comes out the other end?',
      hi: 'क्या बल्ब विद्युत धारा को "खा" जाता है, जिससे तार के दूसरे सिरे से कम धारा निकलती है?',
    },
    predictQuestion: {
      en: 'A steady current of 1.5 A flows through a circuit for 10 seconds. How much electric charge passes through the wire cross-section?',
      hi: 'एक परिपथ में 1.5 A की विद्युत धारा 10 सेकंड तक बहती है। तार के अनुप्रस्थ काट से कितना विद्युत आवेश गुजरेगा?',
    },
    predictOptions: [
      { en: '15 Coulombs (Q = 1.5 A × 10 s)', hi: '15 कूलॉम (Q = 1.5 A × 10 s)' },
      { en: '0.15 Coulombs', hi: '0.15 कूलॉम' },
      { en: '1.5 Coulombs', hi: '1.5 कूलॉम' },
    ],
    predictCorrectIndex: 0,
    predictExplanation: {
      en: 'Electric current is the rate of flow of charge: I = Q/t, so Q = I × t = 1.5 × 10 = 15 C. Electric charge is never consumed!',
      hi: 'विद्युत धारा आवेश के प्रवाह की दर है: I = Q/t, इसलिए Q = I × t = 1.5 × 10 = 15 कूलॉम। आवेश कभी नष्ट नहीं होता!',
    },
    insightFormula: 'Q = I × t',
    insightTerm: { en: 'Electric Current & Charge (NCERT 12.1)', hi: 'विद्युत धारा एवं आवेश (NCERT 12.1)' },
    insightSummary: {
      en: 'Ampere (A) = Coulombs per second. Current is the rate of charge passing by, just like traffic speed.',
      hi: 'एम्पीयर (A) = कूलॉम प्रति सेकंड। विद्युत धारा प्रति सेकंड गुजरने वाले आवेश की दर है।',
    },
    examQuestions: [
      {
        title: { en: 'NCERT In-text Example 12.1 · Charge Flow', hi: 'NCERT उदाहरण 12.1 · आवेश प्रवाह' },
        prompt: {
          en: 'A current of 0.5 A is drawn by a filament of an electric bulb for 10 minutes. Find the amount of electric charge that flows through the circuit.',
          hi: 'किसी विद्युत बल्ब के तंतु में से 0.5 A विद्युत धारा 10 मिनट के लिए प्रवाहित होती है। परिपथ से प्रवाहित विद्युत आवेश का परिमाण ज्ञात कीजिए।',
        },
        options: [
          { en: '300 Coulombs (300 C)', hi: '300 कूलॉम (300 C)' },
          { en: '5 Coulombs (5 C)', hi: '5 कूलॉम (5 C)' },
          { en: '50 Coulombs (50 C)', hi: '50 कूलॉम (50 C)' },
          { en: '600 Coulombs (600 C)', hi: '600 कूलॉम (600 C)' },
        ],
        correctIndex: 0,
        hint: {
          en: 'Always convert time into SI units (seconds) first! 10 minutes = 10 × 60 = 600 s.',
          hi: 'समय को हमेशा पहले SI मात्रक (सेकंड) में बदलें! 10 मिनट = 10 × 60 = 600 सेकंड।',
        },
        steps: [
          { label: { en: 'Given', hi: 'दिया है' }, content: { en: 'Current I = 0.5 A, Time t = 10 min = 600 s', hi: 'धारा I = 0.5 A, समय t = 10 मिनट = 600 s' } },
          { label: { en: 'Formula', hi: 'सूत्र' }, content: { en: 'Q = I × t', hi: 'Q = I × t' } },
          { label: { en: 'Substitution', hi: 'मान रखने पर' }, content: { en: 'Q = 0.5 A × 600 s', hi: 'Q = 0.5 A × 600 s' } },
        ],
        finalAnswer: { en: 'Q = 300 Coulombs (C)', hi: 'Q = 300 कूलॉम (C)' },
      },
    ],
  },

  'power-vs-energy': {
    hook: {
      en: 'Does a 1000 W electric iron always use more electricity than a 100 W bulb?',
      hi: 'क्या 1000 W की प्रेस हमेशा 100 W के बल्ब से ज्यादा बिजली खर्च करेगी?',
    },
    predictQuestion: {
      en: 'If you leave a 100 W bulb ON for 20 hours, and use a 1000 W iron for only 30 minutes (0.5 hour), which transfers more total electrical energy?',
      hi: 'यदि 100 W का बल्ब 20 घंटे जले और 1000 W की प्रेस केवल 30 मिनट (0.5 घंटा) चले, तो किसमें अधिक कुल ऊर्जा खर्च होगी?',
    },
    predictOptions: [
      { en: 'The 100 W bulb uses 4× MORE energy (2000 Wh vs 500 Wh)!', hi: '100 W का बल्ब 4 गुना अधिक ऊर्जा लेगा (2000 Wh बनाम 500 Wh)!' },
      { en: 'The 1000 W iron uses more energy because its power rating is higher.', hi: '1000 W की प्रेस अधिक ऊर्जा लेगी क्योंकि उसकी शक्ति अधिक है।' },
      { en: 'Both consume identical electrical energy.', hi: 'दोनों में बराबर ऊर्जा खर्च होगी।' },
    ],
    predictCorrectIndex: 0,
    predictExplanation: {
      en: 'Bulb: 100 W × 20 h = 2000 Wh. Iron: 1000 W × 0.5 h = 500 Wh. Total energy depends on BOTH power and time (E = P × t)!',
      hi: 'बल्ब: 100 W × 20 h = 2000 Wh। प्रेस: 1000 W × 0.5 h = 500 Wh। कुल ऊर्जा शक्ति और समय दोनों के गुणनफल पर निर्भर करती है (E = P × t)!',
    },
    insightFormula: 'E = P × t',
    insightTerm: { en: 'Electric Power & Energy (NCERT 12.8)', hi: 'विद्युत शक्ति एवं ऊर्जा (NCERT 12.8)' },
    insightSummary: {
      en: 'Power (Watts) is Joules per second (the rate). Energy (Joules or Wh) is the total work done over time.',
      hi: 'शक्ति (Watts) जूल प्रति सेकंड है (दर)। ऊर्जा (Joules या Wh) समय के साथ किया गया कुल कार्य है।',
    },
    examQuestions: [
      {
        title: { en: 'Class 10 Board Standard · Energy Transferred', hi: 'कक्षा 10 बोर्ड प्रश्न · कुल ऊर्जा' },
        prompt: {
          en: 'An electric toaster of power 750 W is operated for 2 minutes. Calculate the total electrical energy consumed in Joules.',
          hi: '750 W का एक टोस्टर 2 मिनट के लिए चलाया जाता है। जूल (Joules) में कुल विद्युत ऊर्जा की गणना कीजिए।',
        },
        options: [
          { en: '90,000 Joules (90 kJ)', hi: '90,000 जूल (90 kJ)' },
          { en: '1,500 Joules', hi: '1,500 जूल' },
          { en: '375 Joules', hi: '375 जूल' },
          { en: '15,000 Joules', hi: '15,000 जूल' },
        ],
        correctIndex: 0,
        hint: {
          en: 'Convert time to seconds: 2 minutes = 120 s. Energy in Joules = Watts × seconds.',
          hi: 'समय को सेकंड में बदलें: 2 मिनट = 120 सेकंड। जूल = वाट × सेकंड।',
        },
        steps: [
          { label: { en: 'Given', hi: 'दिया है' }, content: { en: 'Power P = 750 W, Time t = 2 min = 120 s', hi: 'शक्ति P = 750 W, समय t = 2 मिनट = 120 s' } },
          { label: { en: 'Formula', hi: 'सूत्र' }, content: { en: 'E = P × t', hi: 'E = P × t' } },
          { label: { en: 'Substitution', hi: 'मान रखने पर' }, content: { en: 'E = 750 W × 120 s', hi: 'E = 750 W × 120 s' } },
        ],
        finalAnswer: { en: 'E = 90,000 J (90 kJ)', hi: 'E = 90,000 जूल (90 kJ)' },
      },
    ],
  },

  'units-on-the-bill': {
    hook: {
      en: 'Why is the winter electricity bill high even if the geyser runs for only 30 minutes a day?',
      hi: 'सर्दियों में सिर्फ 30 मिनट गीज़र चलाने पर भी बिजली का बिल इतना अधिक क्यों आता है?',
    },
    predictQuestion: {
      en: 'The electricity company bills us in "Units". What physical quantity is 1 Unit?',
      hi: 'बिजली बोर्ड हमें "यूनिट" के हिसाब से बिल भेजता है। 1 यूनिट वास्तव में क्या है?',
    },
    predictOptions: [
      { en: '1 Unit = 1 Kilowatt-hour (kWh) = 3.6 × 10⁶ Joules of ENERGY', hi: '1 यूनिट = 1 किलोवाट-घंटा (kWh) = 3.6 × 10⁶ जूल ऊर्जा' },
      { en: '1 Unit = 1 Watt of electric power', hi: '1 यूनिट = 1 वाट विद्युत शक्ति' },
      { en: '1 Unit = 1 Ampere of electric current', hi: '1 यूनिट = 1 एम्पीयर विद्युत धारा' },
    ],
    predictCorrectIndex: 0,
    predictExplanation: {
      en: 'Commercial electricity meters measure total ENERGY consumed in kilowatt-hours (kWh). 1 kWh = 1000 W × 3600 s = 3,600,000 J = 1 Unit.',
      hi: 'बिजली मीटर किलोवाट-घंटे (kWh) में कुल ऊर्जा मापता है। 1 kWh = 1000 W × 3600 s = 36,00,000 जूल = 1 यूनिट।',
    },
    insightFormula: '1 Unit = 1 kWh = 3.6 × 10⁶ J',
    insightTerm: { en: 'Commercial Unit of Energy (NCERT 12.9)', hi: 'ऊर्जा का व्यावसायिक मात्रक (NCERT 12.9)' },
    insightSummary: {
      en: 'Total Bill (₹) = Units (kWh) × Tariff Rate (₹/unit). High-power heating draws lots of units fast!',
      hi: 'कुल बिल (₹) = यूनिट (kWh) × दर (₹/यूनिट)। हीटिंग उपकरण बहुत तेज़ी से यूनिट बढ़ाते हैं!',
    },
    examQuestions: [
      {
        title: { en: 'NCERT Example 12.12 · Refrigerator Monthly Bill', hi: 'NCERT उदाहरण 12.12 · रेफ्रिजरेटर का मासिक बिल' },
        prompt: {
          en: 'An electric refrigerator rated 400 W operates 8 hours/day. What is the cost of the energy to operate it for 30 days at ₹ 3.00 per kWh?',
          hi: '400 W का एक रेफ्रिजरेटर 8 घंटे/दिन चलाया जाता है। ₹ 3.00 प्रति kWh की दर से इसे 30 दिन तक चलाने के लिए ऊर्जा का मूल्य क्या होगा?',
        },
        options: [
          { en: '₹ 288.00 (96 kWh × ₹ 3)', hi: '₹ 288.00 (96 kWh × ₹ 3)' },
          { en: '₹ 96.00', hi: '₹ 96.00' },
          { en: '₹ 384.00', hi: '₹ 384.00' },
          { en: '₹ 120.00', hi: '₹ 120.00' },
        ],
        correctIndex: 0,
        hint: {
          en: 'Calculate total energy in kWh first: (400 W × 8 h × 30 days) / 1000. Then multiply by ₹ 3.',
          hi: 'पहले kWh में कुल ऊर्जा निकालें: (400 W × 8 h × 30 दिन) / 1000। फिर ₹ 3 से गुणा करें।',
        },
        steps: [
          { label: { en: 'Energy in 30 days', hi: '30 दिन में कुल ऊर्जा' }, content: { en: '400 W × 8 h/day × 30 days = 96,000 Wh = 96 kWh', hi: '400 W × 8 घंटे × 30 दिन = 96,000 Wh = 96 kWh' } },
          { label: { en: 'Units consumed', hi: 'उपभुक्त यूनिट' }, content: { en: '96 kWh = 96 Units', hi: '96 kWh = 96 यूनिट' } },
          { label: { en: 'Cost calculation', hi: 'मूल्य की गणना' }, content: { en: '96 Units × ₹ 3.00/unit', hi: '96 यूनिट × ₹ 3.00/यूनिट' } },
        ],
        finalAnswer: { en: 'Total Cost = ₹ 288.00', hi: 'कुल मूल्य = ₹ 288.00' },
      },
    ],
  },
}
