import type { ConceptCardContent } from '../rateVsTotal/content'

export const SQUARES_AND_INVERSES_CONTENT: Record<string, ConceptCardContent> = {
  'inverse-area-scaling': {
    hook: {
      en: 'Why is it easier for water to flow through a thick hose pipe than a thin straw?',
      hi: 'पतली नली के मुकाबले मोटे पाइप से पानी बहना ज्यादा आसान क्यों होता है?',
    },
    predictQuestion: {
      en: 'A wire has resistance R. If you replace it with another wire of the same material and length, but twice the cross-sectional area (2A), what is the new resistance?',
      hi: 'एक तार का प्रतिरोध R है। यदि उसी धातु और लंबाई का दूसरा तार लें, जिसका अनुप्रस्थ काट क्षेत्रफल दोगुना (2A) हो, तो उसका प्रतिरोध कितना होगा?',
    },
    predictOptions: [
      { en: 'Resistance halves (R / 2) because wider wire gives charges more room to flow.', hi: 'प्रतिरोध आधा (R / 2) हो जाएगा क्योंकि चौड़ा तार इलेक्ट्रॉनों को अधिक जगह देता है।' },
      { en: 'Resistance doubles (2R) because there is more material.', hi: 'प्रतिरोध दोगुना (2R) हो जाएगा क्योंकि धातु बढ़ गई है।' },
      { en: 'Resistance stays unchanged.', hi: 'प्रतिरोध में कोई बदलाव नहीं होगा।' },
    ],
    predictCorrectIndex: 0,
    predictExplanation: {
      en: 'Resistance is inversely proportional to cross-sectional area (R ∝ 1/A). Doubling the area cuts resistance in half.',
      hi: 'प्रतिरोध अनुप्रस्थ काट के क्षेत्रफल के व्युत्क्रमानुपाती होता है (R ∝ 1/A)। क्षेत्रफल दोगुना करने पर प्रतिरोध आधा हो जाता है।',
    },
    insightFormula: 'R ∝ 1 / A',
    insightTerm: { en: 'Inverse Proportionality (NCERT 12.5)', hi: 'व्युत्क्रमानुपाती संबंध (NCERT 12.5)' },
    insightSummary: {
      en: 'When the denominator doubles, the result halves! Thicker wires offer less electrical resistance.',
      hi: 'जब हर (Denominator) दोगुना होता है, तो मान आधा हो जाता है! मोटा तार विद्युत धारा को कम रुकावट देता है।',
    },
    examQuestions: [
      {
        title: { en: 'Class 10 Board Standard · Wire Thickness & Resistance', hi: 'कक्षा 10 बोर्ड प्रश्न · तार की मोटाई और प्रतिरोध' },
        prompt: {
          en: 'A cylindrical wire has resistance of 12 Ω. Another wire of the same length and material has 3 times the cross-sectional area. What is its resistance?',
          hi: 'एक बेलनाकार तार का प्रतिरोध 12 Ω है। उसी लंबाई व पदार्थ के एक अन्य तार का अनुप्रस्थ काट क्षेत्रफल 3 गुना है। उसका प्रतिरोध क्या होगा?',
        },
        options: [
          { en: '4 Ω (12 Ω ÷ 3)', hi: '4 Ω (12 Ω ÷ 3)' },
          { en: '36 Ω (12 Ω × 3)', hi: '36 Ω (12 Ω × 3)' },
          { en: '6 Ω', hi: '6 Ω' },
          { en: '12 Ω', hi: '12 Ω' },
        ],
        correctIndex: 0,
        hint: {
          en: 'Since R ∝ 1/A, tripling the area divides the resistance by 3: R₂ = R₁ / 3.',
          hi: 'चूंकि R ∝ 1/A है, क्षेत्रफल 3 गुना करने पर प्रतिरोध 3 से विभाजित हो जाता है: R₂ = R₁ / 3।',
        },
        steps: [
          { label: { en: 'Given', hi: 'दिया है' }, content: { en: 'R₁ = 12 Ω, A₂ = 3 A₁', hi: 'R₁ = 12 Ω, A₂ = 3 A₁' } },
          { label: { en: 'Formula', hi: 'सूत्र' }, content: { en: 'R ∝ 1/A ⇒ R₂ / R₁ = A₁ / A₂', hi: 'R ∝ 1/A ⇒ R₂ / R₁ = A₁ / A₂' } },
          { label: { en: 'Substitution', hi: 'मान रखने पर' }, content: { en: 'R₂ = 12 Ω × (A₁ / 3A₁) = 12 / 3', hi: 'R₂ = 12 Ω × (A₁ / 3A₁) = 12 / 3' } },
        ],
        finalAnswer: { en: 'New Resistance R₂ = 4 Ω', hi: 'नया प्रतिरोध R₂ = 4 Ω' },
      },
    ],
  },

  'diameter-trap': {
    hook: {
      en: 'Exam Trap Alert: If a wire’s diameter doubles, does its resistance halve or become one-quarter?',
      hi: 'बोर्ड परीक्षा का सबसे बड़ा जाल: तार का व्यास (Diameter) दोगुना करने पर प्रतिरोध आधा होगा या एक-चौथाई?',
    },
    predictQuestion: {
      en: 'A wire has resistance R. If its diameter d is doubled while length and material stay identical, what is its new resistance?',
      hi: 'एक तार का प्रतिरोध R है। यदि लंबाई और धातु समान रखते हुए उसका व्यास (d) दोगुना कर दिया जाए, तो नया प्रतिरोध क्या होगा?',
    },
    predictOptions: [
      { en: 'Resistance becomes ONE-QUARTER (R / 4), NOT half!', hi: 'प्रतिरोध घटकर एक-चौथाई (R / 4) हो जाएगा, आधा नहीं!' },
      { en: 'Resistance halves (R / 2).', hi: 'प्रतिरोध आधा (R / 2) हो जाएगा।' },
      { en: 'Resistance doubles (2R).', hi: 'प्रतिरोध दोगुना (2R) हो जाएगा।' },
    ],
    predictCorrectIndex: 0,
    predictExplanation: {
      en: 'Area depends on diameter SQUARED: A = πd²/4. Doubling d quadruples the area (2² = 4×), which cuts resistance to R/4!',
      hi: 'क्षेत्रफल व्यास के वर्ग पर निर्भर करता है: A = πd²/4। व्यास दोगुना करने पर क्षेत्रफल 4 गुना (2² = 4) बढ़ जाता है, जिससे प्रतिरोध R/4 रह जाता है!',
    },
    insightFormula: 'A = πd² / 4 ⇒ R ∝ 1 / d²',
    insightTerm: { en: 'The Diameter Squared Rule', hi: 'व्यास का वर्ग नियम (Diameter Squared Rule)' },
    insightSummary: {
      en: 'Doubling diameter quadruples area (4×) and quarters resistance (1/4×). Tripling diameter makes resistance 1/9th!',
      hi: 'व्यास दोगुना करने पर क्षेत्रफल 4 गुना और प्रतिरोध 1/4 रह जाता है। व्यास तीन गुना करने पर प्रतिरोध 1/9 हो जाएगा!',
    },
    examQuestions: [
      {
        title: { en: 'CBSE 2020 Question Paper · Diameter Scaling', hi: 'CBSE बोर्ड प्रश्न · व्यास परिवर्तन और प्रतिरोध' },
        prompt: {
          en: 'A copper wire of resistance 20 Ω is replaced with another copper wire of the same length but half the diameter. What is the resistance of the new wire?',
          hi: '20 Ω प्रतिरोध वाले तांबे के तार को उसी लंबाई लेकिन आधे व्यास (Half diameter) वाले तार से बदला जाता है। नए तार का प्रतिरोध क्या होगा?',
        },
        options: [
          { en: '80 Ω (4 times larger)', hi: '80 Ω (4 गुना बढ़ जाएगा)' },
          { en: '40 Ω (doubled)', hi: '40 Ω (दोगुना)' },
          { en: '10 Ω (halved)', hi: '10 Ω (आधा)' },
          { en: '5 Ω (quartered)', hi: '5 Ω (एक-चौथाई)' },
        ],
        correctIndex: 0,
        hint: {
          en: 'Halving diameter d cuts area by (1/2)² = 1/4. Since R ∝ 1/A, resistance multiplies by 4!',
          hi: 'व्यास आधा करने पर क्षेत्रफल (1/2)² = 1/4 रह जाता है। चूंकि R ∝ 1/A है, इसलिए प्रतिरोध 4 गुना बढ़ जाएगा!',
        },
        steps: [
          { label: { en: 'Given', hi: 'दिया है' }, content: { en: 'R₁ = 20 Ω, d₂ = d₁ / 2', hi: 'R₁ = 20 Ω, d₂ = d₁ / 2' } },
          { label: { en: 'Area Relation', hi: 'क्षेत्रफल संबंध' }, content: { en: 'A₂ = π(d₁/2)²/4 = A₁ / 4', hi: 'A₂ = π(d₁/2)²/4 = A₁ / 4' } },
          { label: { en: 'New Resistance', hi: 'नया प्रतिरोध' }, content: { en: 'R₂ = R₁ × (A₁ / A₂) = 20 Ω × 4', hi: 'R₂ = R₁ × (A₁ / A₂) = 20 Ω × 4' } },
        ],
        finalAnswer: { en: 'R₂ = 80 Ω', hi: 'नया प्रतिरोध R₂ = 80 Ω' },
      },
    ],
  },

  'voltage-squared-power': {
    hook: {
      en: 'If you plug an electric heater designed for 110 V into a 220 V socket, does the heat double or quadruple?',
      hi: 'यदि 110 V पर चलने वाले हीटर को 220 V के सॉकेट में लगा दें, तो गर्मी दोगुनी होगी या चार गुनी?',
    },
    predictQuestion: {
      en: 'A heating element of fixed resistance consumes 100 W at 110 V. If voltage is doubled to 220 V, what is its new power consumption?',
      hi: 'एक हीटर 110 V पर 100 W शक्ति लेता है। यदि वोल्टेज दोगुनी (220 V) कर दी जाए, तो उसकी नई शक्ति क्या होगी?',
    },
    predictOptions: [
      { en: '400 W (Power quadruples because P ∝ V²)', hi: '400 W (शक्ति 4 गुना बढ़ जाती है क्योंकि P ∝ V²)' },
      { en: '200 W (Power doubles)', hi: '200 W (शक्ति दोगुनी होगी)' },
      { en: '100 W (Power stays the same)', hi: '100 W (शक्ति समान रहेगी)' },
    ],
    predictCorrectIndex: 0,
    predictExplanation: {
      en: 'Both voltage AND current double! P = V × I = V × (V/R) = V²/R. Doubling V multiplies power by 2² = 4 times!',
      hi: 'वोल्टेज और धारा दोनों दोगुनी हो जाती हैं! P = V × I = V²/R। इसलिए वोल्टेज दोगुनी करने पर शक्ति 2² = 4 गुना हो जाती है!',
    },
    insightFormula: 'P = V² / R ⇒ P ∝ V²',
    insightTerm: { en: 'Voltage Squared Power Law (NCERT 12.8)', hi: 'वोल्टेज वर्ग शक्ति नियम (NCERT 12.8)' },
    insightSummary: {
      en: 'At constant resistance, doubling voltage quadruples both power and the rate of heat generation.',
      hi: 'स्थिर प्रतिरोध पर वोल्टेज दोगुनी करने पर शक्ति और ऊष्मा उत्पन्न होने की दर दोनों 4 गुना हो जाती हैं।',
    },
    examQuestions: [
      {
        title: { en: 'NCERT Textbook Exercise Q14 · Power at Half Voltage', hi: 'NCERT अभ्यास प्रश्न 14 · आधे वोल्टेज पर शक्ति' },
        prompt: {
          en: 'An electric bulb is rated 220 V and 100 W. When it is operated on 110 V, what will be the power consumed?',
          hi: 'एक विद्युत बल्ब पर 220 V तथा 100 W अंकित है। जब इसे 110 V पर प्रचालित करते हैं, तब इसके द्वारा उपभुक्त शक्ति कितनी होगी?',
        },
        options: [
          { en: '25 W (Quarter of 100 W)', hi: '25 W (100 W का एक-चौथाई)' },
          { en: '50 W (Half)', hi: '50 W (आधा)' },
          { en: '75 W', hi: '75 W' },
          { en: '100 W', hi: '100 W' },
        ],
        correctIndex: 0,
        hint: {
          en: 'Voltage is halved (110 V = 220/2 V). Since P ∝ V², power reduces by (1/2)² = 1/4th: 100 W / 4 = 25 W.',
          hi: 'वोल्टेज आधी कर दी गई है (110 V = 220/2)। चूंकि P ∝ V² है, शक्ति (1/2)² = 1/4 रह जाएगी: 100 W / 4 = 25 W।',
        },
        steps: [
          { label: { en: 'Bulb Resistance R', hi: 'बल्ब का प्रतिरोध R' }, content: { en: 'R = V²/P = (220)² / 100 = 484 Ω', hi: 'R = V²/P = (220)² / 100 = 484 Ω' } },
          { label: { en: 'Power at 110 V', hi: '110 V पर नई शक्ति' }, content: { en: 'P = V_new² / R = (110)² / 484', hi: 'P = V_new² / R = (110)² / 484' } },
          { label: { en: 'Calculation', hi: 'गणना' }, content: { en: '12100 / 484 = 25 W', hi: '12100 / 484 = 25 W' } },
        ],
        finalAnswer: { en: 'Power Consumed = 25 W', hi: 'उपभुक्त शक्ति = 25 W' },
      },
    ],
  },

  'gravity-inverse-square': {
    hook: {
      en: 'If you travel twice as far from Earth’s center into space, how strong is Earth’s gravity?',
      hi: 'यदि आप पृथ्वी के केंद्र से दोगुनी दूरी पर अंतरिक्ष में चले जाएँ, तो गुरुत्वाकर्षण बल कितना रह जाएगा?',
    },
    predictQuestion: {
      en: 'The gravitational force between two masses at distance r is 100 N. If distance is doubled to 2r, what is the new force?',
      hi: 'दूरी r पर दो पिंडों के बीच गुरुत्वाकर्षण बल 100 N है। यदि दूरी को दोगुना (2r) कर दिया जाए, तो नया बल कितना होगा?',
    },
    predictOptions: [
      { en: '25 N (Force drops to 1/4th)', hi: '25 N (बल घटकर 1/4 रह जाएगा)' },
      { en: '50 N (Force drops to 1/2)', hi: '50 N (बल आधा रह जाएगा)' },
      { en: '10 N', hi: '10 N' },
    ],
    predictCorrectIndex: 0,
    predictExplanation: {
      en: 'Universal Gravitation is an INVERSE-SQUARE law: F ∝ 1/r². Doubling distance divides the force by 2² = 4!',
      hi: 'गुरुत्वाकर्षण का सार्वत्रिक नियम व्युत्क्रम-वर्ग (Inverse-Square) नियम है: F ∝ 1/r²। दूरी दोगुनी करने पर बल 2² = 4 से विभाजित हो जाता है!',
    },
    insightFormula: 'F = G m₁ m₂ / r² ⇒ F ∝ 1 / r²',
    insightTerm: { en: 'Universal Inverse-Square Law (Class 9 Ch 10)', hi: 'सार्वत्रिक व्युत्क्रम-वर्ग नियम (Class 9 Ch 10)' },
    insightSummary: {
      en: 'Gravitation, light brightness, and electrostatic force all weaken with the square of distance (1/r²).',
      hi: 'गुरुत्वाकर्षण, प्रकाश की चमक और स्थिर वैद्युत बल सभी दूरी के वर्ग के व्युत्क्रमानुपाती होते हैं (1/r²)।',
    },
    examQuestions: [
      {
        title: { en: 'Class 9 Gravitation · Distance Scaling', hi: 'कक्षा 9 गुरुत्वाकर्षण · दूरी और गुरुत्वीय बल' },
        prompt: {
          en: 'What happens to the gravitational force between two objects if the distance between them is tripled (3r)?',
          hi: 'यदि दो वस्तुओं के बीच की दूरी को तीन गुना (3r) कर दिया जाए, तो उनके बीच गुरुत्वाकर्षण बल पर क्या प्रभाव पड़ेगा?',
        },
        options: [
          { en: 'Force becomes 1/9th of initial value', hi: 'बल प्रारंभिक मान का 1/9 हो जाएगा' },
          { en: 'Force becomes 1/3rd of initial value', hi: 'बल प्रारंभिक मान का 1/3 हो जाएगा' },
          { en: 'Force triples (3 times larger)', hi: 'बल 3 गुना बढ़ जाएगा' },
          { en: 'Force becomes 1/6th', hi: 'बल 1/6 हो जाएगा' },
        ],
        correctIndex: 0,
        hint: {
          en: 'Use Newton’s law: F ∝ 1/r². If r becomes 3r, the denominator becomes (3)² = 9.',
          hi: 'न्यूटन का नियम लगाएं: F ∝ 1/r²। यदि r बढ़कर 3r हो जाए, तो हर (3)² = 9 हो जाएगा।',
        },
        steps: [
          { label: { en: 'Law of Gravitation', hi: 'गुरुत्वाकर्षण का नियम' }, content: { en: 'F₁ = G m₁ m₂ / r²', hi: 'F₁ = G m₁ m₂ / r²' } },
          { label: { en: 'With Tripled Distance', hi: 'दूरी 3r करने पर' }, content: { en: 'F₂ = G m₁ m₂ / (3r)² = G m₁ m₂ / (9r²)', hi: 'F₂ = G m₁ m₂ / (3r)² = G m₁ m₂ / (9r²)' } },
          { label: { en: 'Ratio', hi: 'अनुपात' }, content: { en: 'F₂ = F₁ / 9', hi: 'F₂ = F₁ / 9' } },
        ],
        finalAnswer: { en: 'Force becomes 1/9th', hi: 'बल 1/9 रह जाएगा' },
      },
    ],
  },

  'sound-echo-wave-speed': {
    hook: {
      en: 'When you shout across a valley and hear your echo 0.5 seconds later, why must you divide the sound travel distance by 2 to find the cliff’s distance?',
      hi: 'जब आप घाटी में चिल्लाते हैं और 0.5 सेकंड बाद प्रतिध्वनि सुनते हैं, तो चट्टान की दूरी निकालने के लिए कुल ध्वनि दूरी को 2 से भाग क्यों देना पड़ता है?',
    },
    predictQuestion: {
      en: 'A sound wave travels in air at v = 340 m/s. If you double its frequency from f = 170 Hz to 340 Hz in the same air, what happens to its wavelength λ and its speed v?',
      hi: 'वायु में ध्वनि तरंग v = 340 m/s की चाल से चलती है। यदि उसी वायु में आवृत्ति f = 170 Hz से दोगुनी (340 Hz) कर दी जाए, तो तरंगदैर्घ्य λ और चाल v पर क्या प्रभाव पड़ेगा?',
    },
    predictOptions: [
      {
        en: 'Wave speed v stays 340 m/s (fixed by the medium), so wavelength λ halves from 2 m to 1 m.',
        hi: 'चाल v = 340 m/s स्थिर रहती है (माध्यम द्वारा निर्धारित), इसलिए तरंगदैर्घ्य λ आधी (2 m से 1 m) हो जाती है।',
      },
      {
        en: 'Wave speed v doubles to 680 m/s and wavelength stays 2 m.',
        hi: 'चाल v दोगुनी (680 m/s) हो जाती है और तरंगदैर्घ्य 2 m रहती है।',
      },
      {
        en: 'Both wavelength λ and speed v double.',
        hi: 'तरंगदैर्घ्य λ और चाल v दोनों दोगुने हो जाते हैं।',
      },
    ],
    predictCorrectIndex: 0,
    predictExplanation: {
      en: 'Wave speed v depends only on the medium (air temperature/density), NOT the frequency! Since v = f × λ is constant in the same air, doubling frequency f forces wavelength λ = v/f to halve.',
      hi: 'ध्वनि की चाल v केवल माध्यम (वायु) पर निर्भर करती है! चूँकि v = f × λ स्थिर है, आवृत्ति f दोगुनी करने पर तरंगदैर्घ्य λ = v/f आधी रह जाती है।',
    },
    insightFormula: 'λ = v / f  |  Echo Round-Trip: 2d = v × t',
    insightTerm: {
      en: 'Sound Wave Equation & Echo Ranging (NCERT Ch 11.2–11.3)',
      hi: 'ध्वनि तरंग समीकरण एवं प्रतिध्वनि (NCERT 11.2–11.3)',
    },
    insightSummary: {
      en: 'In a uniform medium, wavelength is inversely proportional to frequency (λ = v/f). For an echo or SONAR pulse, the wave travels to the reflector and back, so total distance is 2d = v × t.',
      hi: 'समान माध्यम में तरंगदैर्घ्य आवृत्ति के व्युत्क्रमानुपाती होती है (λ = v/f)। प्रतिध्वनि या सोनार में ध्वनि जाकर वापस लौटती है, इसलिए कुल दूरी 2d = v × t होती है।',
    },
    examQuestions: [
      {
        title: {
          en: 'NCERT Class 9 Example 11.2 · Cliff Echo Distance',
          hi: 'NCERT कक्षा 9 उदाहरण 11.2 · प्रतिध्वनि से चट्टान की दूरी',
        },
        prompt: {
          en: 'A person claps their hands near a cliff and hears the echo after 2 seconds. What is the distance of the cliff from the person if the speed of sound v is taken as 346 m/s?',
          hi: 'एक मनुष्य किसी खड़ी चट्टान के पास ताली बजाता है और उसकी प्रतिध्वनि 2 सेकंड पश्चात सुनता है। यदि ध्वनि की चाल 346 m/s हो, तो चट्टान से मनुष्य की दूरी कितनी होगी?',
        },
        options: [
          { en: '346 m (2d = 692 m ⇒ d = 346 m)', hi: '346 m (2d = 692 m ⇒ d = 346 m)' },
          { en: '692 m (Forgot to divide round-trip by 2)', hi: '692 m (2 से भाग देना भूल गए)' },
          { en: '173 m', hi: '173 m' },
          { en: '1,384 m', hi: '1,384 m' },
        ],
        correctIndex: 0,
        hint: {
          en: 'Remember the sound travels to the cliff and back: 2d = v × t, so d = (v × t) / 2.',
          hi: 'ध्वनि चट्टान तक जाती है और वापस आती है: 2d = v × t, अतः d = (v × t) / 2।',
        },
        steps: [
          {
            label: { en: 'Given', hi: 'दिया है' },
            content: { en: 'Speed v = 346 m/s, Echo time t = 2 s', hi: 'चाल v = 346 m/s, प्रतिध्वनि समय t = 2 s' },
          },
          {
            label: { en: 'Round-Trip Formula', hi: 'द्विमार्गी सूत्र' },
            content: { en: '2d = v × t = 346 × 2 = 692 m', hi: '2d = v × t = 346 × 2 = 692 m' },
          },
          {
            label: { en: 'One-Way Cliff Distance d', hi: 'चट्टान की दूरी d' },
            content: { en: 'd = 692 / 2 = 346 m', hi: 'd = 692 / 2 = 346 m' },
          },
        ],
        finalAnswer: { en: 'Cliff Distance d = 346 m', hi: 'चट्टान की दूरी d = 346 m' },
      },
    ],
  },

  'magnetic-field-solenoid': {
    hook: {
      en: 'When Oersted passed electric current through a wire, a nearby compass needle suddenly jumped! How does that invisible magnetic field change as you move farther from the wire or wind the wire into a solenoid coil?',
      hi: 'जब ओर्स्टेड ने तार में विद्युत धारा प्रवाहित की, तो पास रखी दिक्सूची (कंपास) की सुई अचानक घूम गई! तार से दूर जाने पर या तार को परिनालिका (Solenoid) के रूप में लपेटने पर यह चुंबकीय क्षेत्र कैसे बदलता है?',
    },
    predictQuestion: {
      en: 'A straight wire carries a steady current of 4 A upward. If you move a magnetic compass from r = 2 cm away to r = 6 cm away (3× farther), what happens to the magnetic field strength B and the concentric field direction?',
      hi: 'एक सीधे तार में ऊपर की ओर 4 A की धारा बह रही है। यदि आप चुंबकीय सुई को तार से r = 2 cm से हटाकर r = 6 cm (3 गुना दूर) ले जाएं, तो चुंबकीय क्षेत्र B के परिमाण और दिशा पर क्या प्रभाव पड़ेगा?',
    },
    predictOptions: [
      {
        en: 'Field strength B drops to 1/3rd (B ∝ I/r), while the concentric field loops remain anticlockwise (↺) by the Right-Hand Thumb Rule.',
        hi: 'चुंबकीय क्षेत्र B घटकर 1/3 रह जाता है (B ∝ I/r), और दक्षिण-हस्त अंगुष्ठ नियम से क्षेत्र रेखाएं वामावर्त (↺) ही रहती हैं।',
      },
      {
        en: 'Field strength B triples and reverses to clockwise.',
        hi: 'चुंबकीय क्षेत्र B 3 गुना बढ़ जाता है और दिशा दक्षिणावर्त हो जाती है।',
      },
      {
        en: 'Field strength B stays identical at all distances around a straight wire.',
        hi: 'सीधे तार के चारों ओर सभी दूरियों पर चुंबकीय क्षेत्र B समान रहता है।',
      },
    ],
    predictCorrectIndex: 0,
    predictExplanation: {
      en: 'Around a straight current-carrying conductor, magnetic field lines form concentric circles whose strength decreases inversely with radial distance (B ∝ I/r). Since the upward current direction has not changed, the Right-Hand Thumb Rule keeps the field sense anticlockwise (↺).',
      hi: 'सीधे धारावाही चालक के चारों ओर चुंबकीय क्षेत्र रेखाएं संकेंद्री वृत्त बनाती हैं और दूरी r बढ़ने पर क्षेत्र की तीव्रता व्युत्क्रमानुपाती रूप से घटती है (B ∝ I/r)। धारा ऊपर की ओर ही रहने से दिशा वामावर्त (↺) रहती है।',
    },
    insightFormula: 'Straight Wire: B ∝ I / r  |  Solenoid Core: B ∝ N · I (Uniform)',
    insightTerm: {
      en: 'Right-Hand Thumb Rule & Solenoid Electromagnet (NCERT Ch 12.2)',
      hi: 'दक्षिण-हस्त अंगुष्ठ नियम एवं परिनालिका (NCERT 12.2)',
    },
    insightSummary: {
      en: 'Outside a straight wire, concentric magnetic circles weaken with distance (B ∝ I/r). Winding the wire into a cylindrical solenoid of N turns packs those loops together, creating a nearly UNIFORM parallel magnetic field inside (B ∝ N·I) that acts like a bar magnet!',
      hi: 'सीधे तार के बाहर चुंबकीय क्षेत्र दूरी के साथ घटता है (B ∝ I/r)। तार को N फेरों वाली परिनालिका में लपेटने पर भीतर समानांतर रेखाओं वाला एकसमान चुंबकीय क्षेत्र (B ∝ N·I) बनता है जो छड़ चुंबक की तरह कार्य करता है!',
    },
    examQuestions: [
      {
        title: {
          en: 'NCERT Class 10 Ch 12 · Magnetic Field Inside a Long Solenoid',
          hi: 'NCERT कक्षा 10 अध्याय 12 · परिनालिका के भीतर चुंबकीय क्षेत्र',
        },
        prompt: {
          en: 'The magnetic field inside a long straight solenoid carrying electric current:',
          hi: 'किसी विद्युत धारावाही सीधी लंबी परिनालिका के भीतर चुंबकीय क्षेत्र:',
        },
        options: [
          {
            en: 'Is the same at all points (uniform parallel field lines)',
            hi: 'सभी बिंदुओं पर समान होता है (समानांतर क्षेत्र रेखाएं)',
          },
          {
            en: 'Is zero',
            hi: 'शून्य होता है',
          },
          {
            en: 'Decreases as we move towards its end',
            hi: 'इसके सिरे की ओर जाने पर घटता है',
          },
          {
            en: 'Increases as we move towards its end',
            hi: 'इसके सिरे की ओर जाने पर बढ़ता है',
          },
        ],
        correctIndex: 0,
        hint: {
          en: 'Look at the field lines inside the solenoid coil on the bench: they are parallel, equally spaced straight lines.',
          hi: 'परिनालिका के भीतर की क्षेत्र रेखाएं देखें: वे परस्पर समानांतर और समदूरस्थ सीधी रेखाएं होती हैं।',
        },
        steps: [
          {
            label: { en: 'Field Line Geometry Inside Solenoid', hi: 'परिनालिका के भीतर क्षेत्र रेखाएं' },
            content: { en: 'Inside a long solenoid, the magnetic field lines are parallel straight lines.', hi: 'परिनालिका के भीतर चुंबकीय क्षेत्र रेखाएं समानांतर सरल रेखाओं के भाँति होती हैं।' },
          },
          {
            label: { en: 'Physical Interpretation', hi: 'भौतिक निष्कर्ष' },
            content: { en: 'Parallel, equally spaced field lines indicate that the magnetic field strength B is uniform (the same at all interior points).', hi: 'यह निर्दिष्ट करता है कि परिनालिका के भीतर सभी बिंदुओं पर चुंबकीय क्षेत्र समान (एकसमान) होता है।' },
          },
        ],
        finalAnswer: {
          en: 'The magnetic field is uniform (the same at all points inside the solenoid).',
          hi: 'परिनालिका के भीतर सभी बिंदुओं पर चुंबकीय क्षेत्र समान होता है।',
        },
      },
    ],
  },

  'ph-scale-exponential-acid': {
    hook: {
      en: 'If tomato juice has a pH of 4 and lemon juice has a pH of 2, is lemon juice just “twice as acidic” as tomato juice—or 100 times more acidic?',
      hi: 'यदि टमाटर के रस का pH 4 है और नींबू के रस का pH 2 है, तो क्या नींबू का रस टमाटर के रस से केवल “दोगुना अम्लीय” है—या 100 गुना अधिक अम्लीय?',
    },
    predictQuestion: {
      en: 'Because pH is a negative base-10 logarithm ([H⁺] = 10⁻ᵖᴴ mol/L), what happens to the hydrogen ion concentration [H⁺] when a solution’s pH drops by 3 units from pH 5 to pH 2?',
      hi: 'चूँकि pH आधार-10 का ऋणात्मक लघुगणक है ([H⁺] = 10⁻ᵖᴴ mol/L), जब किसी विलयन का pH मान 5 से घटकर 2 (3 इकाई कम) हो जाता है, तो [H⁺] आयन सांद्रता पर क्या प्रभाव पड़ता है?',
    },
    predictOptions: [
      {
        en: '[H⁺] increases 1,000 times (10³×, from 10⁻⁵ M to 10⁻² M), making the solution 1,000× more acidic!',
        hi: '[H⁺] सांद्रता 1,000 गुना (10³×, 10⁻⁵ M से 10⁻² M) बढ़ जाती है!',
      },
      {
        en: '[H⁺] increases by 3 times.',
        hi: '[H⁺] सांद्रता केवल 3 गुना बढ़ती है।',
      },
      {
        en: '[H⁺] decreases by 1,000 times because 2 is smaller than 5.',
        hi: '[H⁺] सांद्रता 1,000 गुना घट जाती है क्योंकि 2, 5 से छोटा है।',
      },
    ],
    predictCorrectIndex: 0,
    predictExplanation: {
      en: 'On the pH scale, LOWER pH means HIGHER [H⁺] concentration (inverse relationship), and each 1-unit drop multiplies [H⁺] by 10! A 3-unit drop from pH 5 to pH 2 multiplies [H⁺] by 10 × 10 × 10 = 1,000×.',
      hi: 'pH स्केल पर कम pH का अर्थ अधिक [H⁺] सांद्रता (व्युत्क्रम संबंध) है, और प्रत्येक 1 इकाई की कमी [H⁺] को 10 गुना बढ़ाती है! अतः pH 5 से 2 (3 इकाई कमी) होने पर [H⁺] सांद्रता 10³ = 1,000 गुना बढ़ जाती है।',
    },
    insightFormula: '[H⁺] = 10⁻ᵖᴴ mol/L  |  Ratio [H⁺]₁ / [H⁺]₂ = 10^(pH₂ − pH₁)',
    insightTerm: {
      en: 'pH Logarithmic Scale & Biological Thresholds (NCERT Ch 2.3)',
      hi: 'pH स्केल का घातांकी नियम एवं दैनिक जीवन में महत्व (NCERT 2.3)',
    },
    insightSummary: {
      en: 'pH < 7 is acidic, pH = 7 is neutral, and pH > 7 is basic/alkaline. Every 1-unit decrease in pH represents a 10-fold increase in [H⁺](aq). Tooth enamel (calcium hydroxyapatite) begins to corrode when mouth pH falls below 5.5.',
      hi: 'pH < 7 अम्लीय, pH = 7 उदासीन तथा pH > 7 क्षारकीय होता है। pH में प्रत्येक 1 इकाई की कमी [H⁺] आयन सांद्रता में 10 गुना वृद्धि दर्शाती है। मुँह का pH 5.5 से कम होने पर दंत-क्षय प्रारंभ हो जाता है।',
    },
    examQuestions: [
      {
        title: {
          en: 'NCERT Class 10 Ch 2 Q8 · Comparing Five Solutions by pH Values',
          hi: 'NCERT कक्षा 10 अध्याय 2 · पाँच विलयनों के pH मानों की तुलना',
        },
        prompt: {
          en: 'Five solutions A, B, C, D, and E when tested with universal indicator showed pH as 4, 1, 11, 7, and 9 respectively. Which solution is (i) neutral, (ii) strongly alkaline, and (iii) strongly acidic, and what is their order of increasing [H⁺] ion concentration?',
          hi: 'पाँच विलयनों A, B, C, D तथा E की सार्वत्रिक सूचक से जाँच करने पर pH मान क्रमशः 4, 1, 11, 7 एवं 9 प्राप्त हुए। कौन-सा विलयन (i) उदासीन, (ii) प्रबल क्षारीय, तथा (iii) प्रबल अम्लीय है? इन्हें [H⁺] सांद्रता के बढ़ते क्रम में व्यवस्थित कीजिए।',
        },
        options: [
          {
            en: '(i) D (pH 7), (ii) C (pH 11), (iii) B (pH 1); Increasing [H⁺] order: C (11) < E (9) < D (7) < A (4) < B (1).',
            hi: '(i) D (pH 7), (ii) C (pH 11), (iii) B (pH 1); [H⁺] का बढ़ता क्रम: C (11) < E (9) < D (7) < A (4) < B (1)।',
          },
          {
            en: 'Increasing [H⁺] order: B (1) < A (4) < D (7) < E (9) < C (11).',
            hi: '[H⁺] का बढ़ता क्रम: B (1) < A (4) < D (7) < E (9) < C (11)।',
          },
          {
            en: 'A (pH 4) is strongly alkaline and C (pH 11) is strongly acidic.',
            hi: 'A (pH 4) प्रबल क्षारीय है और C (pH 11) प्रबल अम्लीय है।',
          },
          {
            en: 'All solutions have the same [H⁺] concentration.',
            hi: 'सभी विलयनों में [H⁺] सांद्रता समान है।',
          },
        ],
        correctIndex: 0,
        hint: {
          en: 'Remember that [H⁺] = 10⁻ᵖᴴ varies INVERSELY with pH: the highest pH (11) has the lowest [H⁺] (10⁻¹¹ M), and the lowest pH (1) has the highest [H⁺] (10⁻¹ M)!',
          hi: '[H⁺] = 10⁻ᵖᴴ होने से उच्चतम pH (11) में न्यूनतम [H⁺] तथा न्यूनतम pH (1) में अधिकतम [H⁺] होती है!',
        },
        steps: [
          {
            label: { en: 'Classify Each pH', hi: 'प्रत्येक pH का वर्गीकरण' },
            content: { en: 'D (pH 7) = Neutral; C (pH 11) = Strongly alkaline; B (pH 1) = Strongly acidic; A (pH 4) = Weakly acidic; E (pH 9) = Weakly alkaline.', hi: 'D (7) = उदासीन; C (11) = प्रबल क्षारीय; B (1) = प्रबल अम्लीय; A (4) = दुर्बल अम्लीय; E (9) = दुर्बल क्षारीय।' },
          },
          {
            label: { en: 'Order by Increasing [H⁺]', hi: '[H⁺] के बढ़ते क्रम में' },
            content: { en: 'Higher pH → Lower [H⁺]: C (10⁻¹¹ M) < E (10⁻⁹ M) < D (10⁻⁷ M) < A (10⁻⁴ M) < B (10⁻¹ M).', hi: 'C (pH 11) < E (pH 9) < D (pH 7) < A (pH 4) < B (pH 1)।' },
          },
        ],
        finalAnswer: {
          en: 'Neutral: D (7), Strongly Alkaline: C (11), Strongly Acidic: B (1); [H⁺] order: C < E < D < A < B.',
          hi: 'उदासीन: D, प्रबल क्षारीय: C, प्रबल अम्लीय: B; [H⁺] का बढ़ता क्रम: C < E < D < A < B।',
        },
      },
    ],
  },
}
