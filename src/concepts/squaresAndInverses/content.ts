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
}
