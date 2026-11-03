import type { ConceptCardContent } from '../rateVsTotal/content'

export const CONTROLLED_EXPERIMENTS_CONTENT: Record<string, ConceptCardContent> = {
  'fixed-voltage-vs-current': {
    hook: {
      en: 'Does higher resistance create more heat or less heat? Both formulas exist: P = I²R and P = V²/R!',
      hi: 'अधिक प्रतिरोध से ऊष्मा ज्यादा बनेगी या कम? दोनों सूत्र हैं: P = I²R और P = V²/R!',
    },
    predictQuestion: {
      en: 'In household 220 V wiring (fixed voltage), which appliance dissipates more power as heat: a 40 Ω geyser or a 400 Ω bulb?',
      hi: 'घरेलू 220 V वायरिंग (स्थिर वोल्टेज) में कौन सा उपकरण अधिक ऊष्मा व शक्ति लेगा: 40 Ω का गीज़र या 400 Ω का बल्ब?',
    },
    predictOptions: [
      { en: 'The 40 Ω geyser (lower resistance draws more current and gives 10× more power).', hi: '40 Ω का गीज़र (कम प्रतिरोध होने से अधिक धारा खींचेगा और 10 गुना ज्यादा शक्ति देगा)।' },
      { en: 'The 400 Ω bulb (higher resistance creates more friction).', hi: '400 Ω का बल्ब (ज्यादा प्रतिरोध ज्यादा रुकावट पैदा करता है)।' },
      { en: 'Both produce equal power because voltage is identical.', hi: 'दोनों बराबर शक्ति देंगे क्योंकि वोल्टेज समान है।' },
    ],
    predictCorrectIndex: 0,
    predictExplanation: {
      en: 'At FIXED VOLTAGE (household mains), use P = V²/R: lower resistance produces MORE power! Use P = I²R only when CURRENT is fixed (series circuits).',
      hi: 'स्थिर वोल्टेज (घरेलू वायरिंग) पर P = V²/R लगाएं: कम प्रतिरोध अधिक शक्ति देता है! P = I²R केवल तब उपयोग करें जब विद्युत धारा स्थिर हो (श्रेणीक्रम)।',
    },
    insightFormula: 'Fixed V: P = V² / R | Fixed I: P = I² R',
    insightTerm: { en: 'The Controlled Quantity Rule', hi: 'स्थिर राशि का नियम (Controlled Quantity Rule)' },
    insightSummary: {
      en: 'Always check: Is voltage constant (parallel/mains) or is current constant (series)? The governing equation reverses!',
      hi: 'हमेशा देखें: क्या वोल्टेज स्थिर है (पार्श्वक्रम/घरेलू लाइन) या धारा स्थिर है (श्रेणीक्रम)? नियम पूरी तरह उलट जाता है!',
    },
    examQuestions: [
      {
        title: { en: 'Class 10 Board Standard · Resistor Comparison', hi: 'कक्षा 10 बोर्ड प्रश्न · प्रतिरोध तुलना' },
        prompt: {
          en: 'Two resistors of 2 Ω and 4 Ω are connected in parallel to a 6 V battery. Which resistor consumes more power and by what factor?',
          hi: '2 Ω और 4 Ω के दो प्रतिरोधक 6 V की बैटरी से पार्श्वक्रम (समानांतर) में जुड़े हैं। कौन सा प्रतिरोधक अधिक शक्ति लेगा और कितने गुना?',
        },
        options: [
          { en: 'The 2 Ω resistor consumes 2 times more power (18 W vs 9 W).', hi: '2 Ω का प्रतिरोधक 2 गुना अधिक शक्ति लेगा (18 W बनाम 9 W)।' },
          { en: 'The 4 Ω resistor consumes 2 times more power.', hi: '4 Ω का प्रतिरोधक 2 गुना अधिक शक्ति लेगा।' },
          { en: 'Both consume 12 W.', hi: 'दोनों 12 W शक्ति लेंगे।' },
          { en: 'The 2 Ω resistor consumes 4 times more power.', hi: '2 Ω का प्रतिरोधक 4 गुना अधिक शक्ति लेगा।' },
        ],
        correctIndex: 0,
        hint: {
          en: 'In parallel, voltage across both resistors is the same (6 V). Use P = V² / R.',
          hi: 'पार्श्वक्रम में दोनों पर वोल्टेज समान (6 V) होता है। सूत्र P = V² / R का प्रयोग करें।',
        },
        steps: [
          { label: { en: 'Parallel Condition', hi: 'पार्श्वक्रम स्थिति' }, content: { en: 'V = 6 V for both resistors', hi: 'दोनों प्रतिरोधकों पर V = 6 V' } },
          { label: { en: 'Power for 2 Ω', hi: '2 Ω की शक्ति P₁' }, content: { en: 'P₁ = V² / R₁ = 6² / 2 = 36 / 2 = 18 W', hi: 'P₁ = V² / R₁ = 6² / 2 = 36 / 2 = 18 W' } },
          { label: { en: 'Power for 4 Ω', hi: '4 Ω की शक्ति P₂' }, content: { en: 'P₂ = V² / R₂ = 6² / 4 = 36 / 4 = 9 W', hi: 'P₂ = V² / R₂ = 6² / 4 = 36 / 4 = 9 W' } },
        ],
        finalAnswer: { en: '2 Ω resistor consumes 18 W (2× more than 9 W)', hi: '2 Ω का प्रतिरोधक 18 W लेगा (9 W से 2 गुना अधिक)' },
      },
    ],
  },

  'stretching-vs-comparing': {
    hook: {
      en: 'A wire is stretched to double its length. Does its resistance double or become 4 times larger?',
      hi: 'एक तार को खींचकर उसकी लंबाई दोगुनी कर दी जाती है। उसका प्रतिरोध दोगुना होगा या 4 गुना?',
    },
    predictQuestion: {
      en: 'If a wire of resistance R is physically STRETCHED so its length becomes 2L, what happens to its resistance?',
      hi: 'यदि R प्रतिरोध वाले तार को खींचकर (Stretched) उसकी लंबाई 2L कर दी जाए, तो उसका नया प्रतिरोध क्या होगा?',
    },
    predictOptions: [
      { en: 'Resistance becomes 4R (quadrupled)! Stretching makes it longer AND thinner.', hi: 'प्रतिरोध 4R (चार गुना) हो जाएगा! खींचने से तार लंबा भी होता है और पतला भी।' },
      { en: 'Resistance doubles (2R).', hi: 'प्रतिरोध दोगुना (2R) होगा।' },
      { en: 'Resistance stays R because the volume is constant.', hi: 'प्रतिरोध R ही रहेगा क्योंकि आयतन स्थिर है।' },
    ],
    predictCorrectIndex: 0,
    predictExplanation: {
      en: 'Volume is constant (V = L × A). When length doubles (2L), area automatically halves (A/2)! R_new = ρ(2L)/(A/2) = 4 × (ρL/A) = 4R.',
      hi: 'आयतन स्थिर रहता है (V = L × A)। लंबाई 2L होने पर क्षेत्रफल आधा (A/2) हो जाता है! नया प्रतिरोध = ρ(2L)/(A/2) = 4R होता है।',
    },
    insightFormula: 'Stretching to nL ⇒ R_new = n² × R',
    insightTerm: { en: 'Volume Conservation in Stretching', hi: 'तार खींचने में आयतन संरक्षण (Volume Conservation)' },
    insightSummary: {
      en: 'Comparing two different wires: length doubles ⇒ 2R. Stretching ONE wire: length doubles ⇒ 4R (n² rule)!',
      hi: 'दो अलग तारों की तुलना: लंबाई दोगुनी ⇒ 2R। एक ही तार को खींचना: लंबाई दोगुनी ⇒ 4R (n² नियम)!',
    },
    examQuestions: [
      {
        title: { en: 'NCERT Exemplar · Wire Stretching', hi: 'NCERT एग्जेंपलर · तार खींचने का प्रश्न' },
        prompt: {
          en: 'A wire of resistance 5 Ω is drawn out (stretched) to triple its original length. Find the resistance of the wire in the new situation.',
          hi: '5 Ω प्रतिरोध के एक तार को खींचकर उसकी मूल लंबाई का तीन गुना (3L) कर दिया जाता है। नई स्थिति में तार का प्रतिरोध ज्ञात कीजिए।',
        },
        options: [
          { en: '45 Ω (3² × 5 Ω = 9 × 5 Ω)', hi: '45 Ω (3² × 5 Ω = 9 × 5 Ω)' },
          { en: '15 Ω (3 × 5 Ω)', hi: '15 Ω (3 × 5 Ω)' },
          { en: '25 Ω', hi: '25 Ω' },
          { en: '5 Ω', hi: '5 Ω' },
        ],
        correctIndex: 0,
        hint: {
          en: 'Use the n² formula: R_new = n² × R_initial, where n = 3.',
          hi: 'सूत्र R_new = n² × R का उपयोग करें, जहाँ n = 3 है।',
        },
        steps: [
          { label: { en: 'Volume Conservation', hi: 'आयतन संरक्षण' }, content: { en: 'L₂ = 3L₁ ⇒ A₂ = A₁ / 3', hi: 'L₂ = 3L₁ ⇒ A₂ = A₁ / 3' } },
          { label: { en: 'New Resistance Formula', hi: 'नया प्रतिरोध सूत्र' }, content: { en: 'R₂ = ρ(L₂ / A₂) = ρ(3L₁ / (A₁/3)) = 9 × ρ(L₁/A₁)', hi: 'R₂ = ρ(L₂ / A₂) = ρ(3L₁ / (A₁/3)) = 9 × ρ(L₁/A₁)' } },
          { label: { en: 'Calculation', hi: 'गणना' }, content: { en: 'R₂ = 9 × 5 Ω = 45 Ω', hi: 'R₂ = 9 × 5 Ω = 45 Ω' } },
        ],
        finalAnswer: { en: 'New Resistance R₂ = 45 Ω', hi: 'नया प्रतिरोध R₂ = 45 Ω' },
      },
    ],
  },

  'constant-temp-ohmic': {
    hook: {
      en: 'Why does Ohm’s Law strictly state: “At constant temperature...”? What happens if temperature rises?',
      hi: 'ओम के नियम में यह शर्त क्यों है: “यदि भौतिक अवस्थाएं विशेषकर ताप स्थिर रहे...”? ताप बढ़ने पर क्या होता है?',
    },
    predictQuestion: {
      en: 'As current flows through a light bulb filament and it glows white-hot, does its resistance stay constant or increase?',
      hi: 'जब बल्ब के फिलामेंट से धारा बहती है और वह अत्यधिक गर्म हो जाता है, तो उसका प्रतिरोध स्थिर रहता है या बढ़ जाता है?',
    },
    predictOptions: [
      { en: 'Resistance INCREASES as temperature rises, so the V-I graph bends!', hi: 'ताप बढ़ने पर प्रतिरोध बढ़ जाता है, जिससे V-I ग्राफ मुड़ जाता है!' },
      { en: 'Resistance decreases because heat makes electrons faster.', hi: 'प्रतिरोध घटता है क्योंकि गर्मी से इलेक्ट्रॉन तेज़ हो जाते हैं।' },
      { en: 'Resistance stays strictly constant according to Ohm’s Law.', hi: 'प्रतिरोध स्थिर रहता है।' },
    ],
    predictCorrectIndex: 0,
    predictExplanation: {
      en: 'Metals have positive temperature coefficient of resistance. Lattice ions vibrate vigorously with heat, scattering electrons more. The V-I graph curves upward!',
      hi: 'धातुओं का ताप बढ़ने पर धातु के आयनों का कंपन बढ़ जाता है, जिससे इलेक्ट्रॉनों से टक्करें बढ़ती हैं और प्रतिरोध बढ़ जाता है। V-I ग्राफ वक्र बन जाता है!',
    },
    insightFormula: 'Ohmic: V ∝ I (Straight) | Filament: R rises with T (Curved)',
    insightTerm: { en: 'Ohmic vs Non-Ohmic Conductors', hi: 'ओमीय बनाम अन-ओमीय चालक (Ohmic vs Non-Ohmic)' },
    insightSummary: {
      en: 'Ohm’s law holds only when temperature is constant. Real incandescent bulbs are non-ohmic because they heat up.',
      hi: 'ओम का नियम केवल स्थिर ताप पर लागू होता है। गर्म होने वाले बल्ब अन-ओमीय चालक होते हैं।',
    },
    examQuestions: [
      {
        title: { en: 'Board Conceptual · V-I Graph of a Filament Lamp', hi: 'बोर्ड वैचारिक प्रश्न · फिलामेंट बल्ब का V-I ग्राफ' },
        prompt: {
          en: 'Why does the V-I graph of an incandescent torch bulb curve instead of being a straight line passing through the origin?',
          hi: 'टॉर्च के बल्ब के फिलामेंट का V-I ग्राफ मूल बिंदु से गुजरने वाली सीधी रेखा होने के बजाय मुड़ा हुआ (वक्र) क्यों होता है?',
        },
        options: [
          { en: 'Because heating increases the resistance of the metal filament.', hi: 'क्योंकि गर्म होने पर धातु के तंतु का प्रतिरोध बढ़ जाता है।' },
          { en: 'Because the battery runs out of voltage.', hi: 'क्योंकि बैटरी की वोल्टेज खत्म हो जाती है।' },
          { en: 'Because the current leaks out of the glass.', hi: 'क्योंकि कांच से धारा बाहर रिस जाती है।' },
          { en: 'Because the bulb is defective.', hi: 'क्योंकि बल्ब खराब है।' },
        ],
        correctIndex: 0,
        hint: {
          en: 'Recall that Ohm’s Law requires constant temperature. A glowing filament gets very hot.',
          hi: 'याद रखें कि ओम का नियम स्थिर ताप पर निर्भर करता है। जलता हुआ बल्ब बहुत गर्म हो जाता है।',
        },
        steps: [
          { label: { en: 'Reason', hi: 'कारण' }, content: { en: 'Current produces Joule heating in the filament (H = I²Rt).', hi: 'विद्युत धारा तंतु में जूल तापन उत्पन्न करती है।' } },
          { label: { en: 'Effect on Metal', hi: 'धातु पर प्रभाव' }, content: { en: 'Higher temperature increases collision frequency of electrons, increasing resistance.', hi: 'उच्च ताप पर इलेक्ट्रॉनों की टक्करें बढ़ती हैं जिससे प्रतिरोध बढ़ जाता है।' } },
          { label: { en: 'Conclusion', hi: 'निष्कर्ष' }, content: { en: 'Since R is not constant, the V-I characteristic becomes non-linear (non-ohmic).', hi: 'प्रतिरोध स्थिर न रहने के कारण V-I ग्राफ सीधी रेखा नहीं रहता।' } },
        ],
        finalAnswer: { en: 'Resistance increases with temperature, causing a non-linear curve.', hi: 'ताप बढ़ने से प्रतिरोध बढ़ता है, जिससे वक्र मुड़ जाता है।' },
      },
    ],
  },

  'series-parallel-failure': {
    hook: {
      en: 'Why does one fused bulb shut down the whole Diwali fairy-light string, while your home lights stay on?',
      hi: 'दिवाली की लड़ी का एक बल्ब फ्यूज होने पर पूरी लड़ी क्यों बंद हो जाती है, जबकि घर की अन्य लाइटें जलती रहती हैं?',
    },
    predictQuestion: {
      en: 'Three bulbs are connected in SERIES. If the middle bulb burns out (open circuit), what happens to the remaining two bulbs?',
      hi: 'तीन बल्ब श्रेणीक्रम (Series) में जुड़े हैं। यदि बीच का बल्ब फ्यूज (Open Circuit) हो जाए, तो बाकी दोनों बल्बों का क्या होगा?',
    },
    predictOptions: [
      { en: 'Both go completely dark! Series circuit has only ONE single path for current.', hi: 'दोनों तुरंत बुझ जाएंगे! श्रेणीक्रम में धारा बहने का केवल एक ही मार्ग होता है।' },
      { en: 'Both get brighter because voltage is shared among fewer bulbs.', hi: 'दोनों और तेज़ जलेंगे।' },
      { en: 'Only the broken bulb goes off; others continue glowing.', hi: 'केवल खराब बल्ब बुझेगा, अन्य जलते रहेंगे।' },
    ],
    predictCorrectIndex: 0,
    predictExplanation: {
      en: 'In a series circuit, current must pass through every component sequentially. If one component fails, the entire circuit is broken (I = 0).',
      hi: 'श्रेणीक्रम में धारा को सभी घटकों से होकर क्रमबद्ध बहना पड़ता है। यदि एक घटक टूट जाए, तो पूरा परिपथ टूट जाता है (I = 0)।',
    },
    insightFormula: 'Series: 1 Break ⇒ All Dark | Parallel: Independent Branches',
    insightTerm: { en: 'Single Path vs Independent Branches', hi: 'एकल मार्ग बनाम स्वतंत्र शाखाएं (Single Path vs Branches)' },
    insightSummary: {
      en: 'Household wiring is parallel so each appliance has its own switch and failure in one branch does not affect others.',
      hi: 'घरेलू वायरिंग पार्श्वक्रम (समानांतर) में की जाती है ताकि प्रत्येक उपकरण का अलग स्विच हो और एक खराब होने पर दूसरे बंद न हों।',
    },
    examQuestions: [
      {
        title: { en: 'CBSE Board Question · Domestic Parallel Wiring', hi: 'CBSE बोर्ड प्रश्न · घरेलू समानांतर वायरिंग के लाभ' },
        prompt: {
          en: 'Why is a parallel circuit arrangement preferred over a series circuit for domestic electrical wiring in our homes?',
          hi: 'हमारे घरों में घरेलू विद्युत वायरिंग के लिए श्रेणीक्रम की तुलना में पार्श्वक्रम (समानांतर) व्यवस्था को प्राथमिकता क्यों दी जाती है?',
        },
        options: [
          { en: 'Each appliance operates at full 220 V independently; failure in one does not break the others.', hi: 'प्रत्येक उपकरण को स्वतंत्र रूप से पूरा 220 V मिलता है; एक के खराब होने पर अन्य बंद नहीं होते।' },
          { en: 'Parallel wiring uses less wire.', hi: 'पार्श्वक्रम वायरिंग में कम तार लगता है।' },
          { en: 'Parallel wiring eliminates resistance completely.', hi: 'पार्श्वक्रम वायरिंग प्रतिरोध को शून्य कर देती है।' },
          { en: 'Because power supplies in India cannot support series wiring.', hi: 'क्योंकि भारत में श्रेणीक्रम संभव नहीं है।' },
        ],
        correctIndex: 0,
        hint: {
          en: 'Think about independent switching and constant 220 V voltage across each device.',
          hi: 'स्वतंत्र स्विचिंग और प्रत्येक उपकरण पर मिलने वाले 220 V वोल्टेज के बारे में सोचें।',
        },
        steps: [
          { label: { en: 'Advantage 1: Voltage', hi: 'लाभ 1: वोल्टेज' }, content: { en: 'Every branch gets the full mains potential difference (220 V).', hi: 'प्रत्येक शाखा को पूरा 220 V विभवांतर मिलता है।' } },
          { label: { en: 'Advantage 2: Independent Path', hi: 'लाभ 2: स्वतंत्र मार्ग' }, content: { en: 'If one device is switched off or fails, other appliances continue running normally.', hi: 'यदि एक उपकरण बंद हो या खराब हो जाए, तो अन्य सामान्य रूप से चलते रहते हैं।' } },
          { label: { en: 'Advantage 3: Total Resistance', hi: 'लाभ 3: कुल प्रतिरोध' }, content: { en: 'Total equivalent resistance decreases, allowing sufficient current for high-power loads.', hi: 'कुल समतुल्य प्रतिरोध घटता है जिससे उच्च शक्ति वाले उपकरण पर्याप्त धारा ले सकते हैं।' } },
        ],
        finalAnswer: { en: 'Independent operation, constant 220 V, and failure isolation.', hi: 'स्वतंत्र संचालन, स्थिर 220 V वोल्टेज और दोष पृथक्करण।' },
      },
    ],
  },
}
