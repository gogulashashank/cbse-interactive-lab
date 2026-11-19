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

  'momentum-impulse-cushion': {
    hook: {
      en: 'Why does a seasoned cricket fielder always pull their hands backwards while catching a fast-moving ball?',
      hi: 'क्रिकेट का एक अनुभवी खिलाड़ी तेज़ आती हुई गेंद को लपकते समय अपने हाथ पीछे की ओर क्यों खींचता है?',
    },
    predictQuestion: {
      en: 'A 0.15 kg cricket ball arriving at 20 m/s is brought to rest. If the fielder increases the stopping time Δt from 0.05 s to 0.25 s (5× longer), what happens to the momentum change Δp and the average impact force F?',
      hi: '20 m/s से आती 0.15 kg की गेंद को रोका जाता है। यदि खिलाड़ी रोकने का समय Δt = 0.05 s से बढ़ाकर 0.25 s (5 गुना) कर दे, तो संवेग परिवर्तन Δp और औसत बल F पर क्या प्रभाव पड़ेगा?',
    },
    predictOptions: [
      {
        en: 'Δp stays fixed at 3 kg·m/s, so impact force F drops to 1/5th (from 60 N to 12 N).',
        hi: 'Δp = 3 kg·m/s स्थिर रहता है, इसलिए चोट का बल F घटकर 1/5 (60 N से 12 N) रह जाता है।',
      },
      {
        en: 'Both Δp and impact force F decrease to 1/5th.',
        hi: 'Δp और बल F दोनों घटकर 1/5 हो जाते हैं।',
      },
      {
        en: 'Impact force F stays 60 N regardless of stopping time.',
        hi: 'रोकने के समय से स्वतंत्र, बल F हमेशा 60 N रहता है।',
      },
    ],
    predictCorrectIndex: 0,
    predictExplanation: {
      en: 'Whether caught with stiff hands or cushioned hands, the ball goes from 20 m/s to 0 m/s, so Δp = m(u − 0) = 3 kg·m/s is HELD FIXED. By F = Δp/Δt, multiplying stopping time Δt by 5 divides the impact force F by 5!',
      hi: 'गेंद 20 m/s से 0 m/s तक रुकती है, इसलिए संवेग परिवर्तन Δp = 3 kg·m/s स्थिर रहता है। F = Δp/Δt के अनुसार समय Δt को 5 गुना बढ़ाने पर बल F घटकर पाँचवाँ हिस्सा (12 N) रह जाता है!',
    },
    insightFormula: 'F = Δp / Δt  (Δp = m·u held fixed ⇒ F ∝ 1/Δt)',
    insightTerm: {
      en: 'Second Law of Motion & Impulse (NCERT Ch 8.4)',
      hi: 'गति का द्वितीय नियम एवं आवेग (NCERT 8.4)',
    },
    insightSummary: {
      en: 'Force equals the rate of change of momentum (F = Δp/Δt). When a fixed momentum Δp must be stopped, extending contact time Δt inversely reduces peak force.',
      hi: 'बल संवेग परिवर्तन की दर के बराबर होता है (F = Δp/Δt)। जब निश्चित संवेग Δp को रोकना हो, तो समय Δt बढ़ाने से बल व्युत्क्रमानुपाती रूप से घटता है।',
    },
    examQuestions: [
      {
        title: {
          en: 'NCERT Class 9 Example 8.4 · Cricket Ball Stopping Force',
          hi: 'NCERT कक्षा 9 · क्रिकेट गेंद को रोकने का बल',
        },
        prompt: {
          en: 'A cricket ball of mass 150 g (0.15 kg) travelling at 30 m/s is brought to rest by a player in 0.15 s. Calculate the magnitude of the average force applied by the player’s hands.',
          hi: '150 g (0.15 kg) द्रव्यमान की एक क्रिकेट गेंद 30 m/s के वेग से चल रही है। एक खिलाड़ी इसे 0.15 s में विराम में लाता है। खिलाड़ी के हाथों द्वारा लगाए गए औसत बल का परिमाण ज्ञात कीजिए।',
        },
        options: [
          { en: '30 N (Δp = 4.5 kg·m/s ÷ 0.15 s)', hi: '30 N (Δp = 4.5 kg·m/s ÷ 0.15 s)' },
          { en: '4.5 N', hi: '4.5 N' },
          { en: '300 N', hi: '300 N' },
          { en: '0.675 N', hi: '0.675 N' },
        ],
        correctIndex: 0,
        hint: {
          en: 'First convert 150 g to 0.15 kg. Then compute Δp = m × u and divide by Δt = 0.15 s.',
          hi: 'पहले 150 g को 0.15 kg में बदलें। फिर Δp = m × u निकालकर Δt = 0.15 s से भाग दें।',
        },
        steps: [
          {
            label: { en: 'Given in SI Units', hi: 'SI मात्रकों में मान' },
            content: { en: 'm = 150 g = 0.15 kg, u = 30 m/s, v = 0, Δt = 0.15 s', hi: 'm = 0.15 kg, u = 30 m/s, v = 0, Δt = 0.15 s' },
          },
          {
            label: { en: 'Momentum Change Δp', hi: 'संवेग परिवर्तन Δp' },
            content: { en: 'Δp = m × u = 0.15 × 30 = 4.5 kg·m/s', hi: 'Δp = m × u = 0.15 × 30 = 4.5 kg·m/s' },
          },
          {
            label: { en: 'Average Force F', hi: 'औसत बल F' },
            content: { en: 'F = Δp / Δt = 4.5 / 0.15 = 30 N', hi: 'F = Δp / Δt = 4.5 / 0.15 = 30 N' },
          },
        ],
        finalAnswer: { en: 'Average Stopping Force F = 30 N', hi: 'औसत अवरोधक बल F = 30 N' },
      },
    ],
  },

  'motor-force-flemings-rule': {
    hook: {
      en: 'An aluminium rod suspended between the poles of a horseshoe magnet suddenly kicks sideways when current is switched on! What happens if you flip BOTH the battery terminals AND the magnet poles at the same time?',
      hi: 'नाल चुंबक के ध्रुवों के बीच लटकी एल्युमिनियम की छड़ में धारा प्रवाहित करते ही वह अचानक एक ओर झटका खाती है! यदि आप बैटरी के सिरे और चुंबक के ध्रुव दोनों एक साथ पलट दें तो क्या होगा?',
    },
    predictQuestion: {
      en: 'A current-carrying rod placed perpendicular (θ = 90°) to a magnetic field B experiences an upward force (+Z). What happens to the force if you (a) rotate the rod parallel to the magnetic field (θ = 0°), or (b) keep θ = 90° and reverse BOTH the current I and the magnetic field B simultaneously?',
      hi: 'चुंबकीय क्षेत्र B के लंबवत (θ = 90°) रखी धारावाही छड़ पर ऊपर की ओर (+Z) बल लगता है। बल पर क्या प्रभाव पड़ेगा यदि (a) छड़ को चुंबकीय क्षेत्र के समानांतर (θ = 0°) रख दिया जाए, या (b) θ = 90° रखते हुए धारा I और चुंबकीय क्षेत्र B दोनों की दिशा एक साथ पलट दी जाए?',
    },
    predictOptions: [
      {
        en: '(a) Force becomes ZERO at θ = 0°; (b) Force remains UPWARD (+Z) because two reversals cancel out!',
        hi: '(a) θ = 0° पर बल शून्य हो जाता है; (b) बल ऊपर की ओर (+Z) ही रहता है क्योंकि दो बार उलटने का प्रभाव निरस्त हो जाता है!',
      },
      {
        en: '(a) Force is maximum at θ = 0°; (b) Force reverses downward.',
        hi: '(a) θ = 0° पर बल अधिकतम होता है; (b) बल नीचे की ओर उलट जाता है।',
      },
      {
        en: 'Force stays identical at every angle θ from 0° to 90°.',
        hi: '0° से 90° तक प्रत्येक कोण θ पर बल समान रहता है।',
      },
    ],
    predictCorrectIndex: 0,
    predictExplanation: {
      en: 'By F = B·I·L·sin(θ), when the conductor is parallel to the field (θ = 0°), sin(0°) = 0 so magnetic force vanishes! Under Fleming’s Left-Hand Rule, reversing current flips force (−1), and reversing field flips it again (−1 × −1 = +1), keeping the force in the original upward direction!',
      hi: 'F = B·I·L·sin(θ) के अनुसार समानांतर स्थिति (θ = 0°) में sin(0°) = 0 होने से बल शून्य हो जाता है! फ्लेमिंग के वाम-हस्त नियम से केवल एक (I या B) को पलटने पर बल उलटता है, परंतु दोनों को एक साथ पलटने (−1 × −1 = +1) पर बल की दिशा अपरिवर्तित रहती है!',
    },
    insightFormula: 'F = B · I · L · sin(θ)  |  Max at θ = 90°, Zero at θ = 0°',
    insightTerm: {
      en: 'Magnetic Force & Fleming’s Left-Hand Rule (NCERT Ch 12.3)',
      hi: 'धारावाही चालक पर बल एवं फ्लेमिंग का वाम-हस्त नियम (NCERT 12.3)',
    },
    insightSummary: {
      en: 'Stretch the thumb, forefinger, and middle finger of your left hand mutually perpendicular: Forefinger = Magnetic Field (B), Middle Finger = Current (I, direction of + charge flow), Thumb = Force/Motion (F). Force is maximum at 90° and zero when parallel (0°).',
      hi: 'बाएँ हाथ की तर्जनी (चुंबकीय क्षेत्र B), मध्यमा (विद्युत धारा I, धन आवेश की दिशा) और अंगूठे (बल F) को परस्पर लंबवत फैलाएं। बल 90° पर अधिकतम और समानांतर (0°) होने पर शून्य होता है।',
    },
    examQuestions: [
      {
        title: {
          en: 'NCERT Class 10 Example 12.2 · Electron Beam Entering a Magnetic Field',
          hi: 'NCERT कक्षा 10 उदाहरण 12.2 · चुंबकीय क्षेत्र में इलेक्ट्रॉन पर बल',
        },
        prompt: {
          en: 'An electron enters a magnetic field at right angles to it: the magnetic field points towards the right (+X) and the electron moves vertically downward (−Y). What will be the direction of force acting on the electron?',
          hi: 'कोई इलेक्ट्रॉन किसी चुंबकीय क्षेत्र में क्षेत्र के लंबवत प्रवेश करता है: चुंबकीय क्षेत्र दाईं ओर (+X) है और इलेक्ट्रॉन नीचे की ओर (−Y) गति कर रहा है। इलेक्ट्रॉन पर आरोपित बल की दिशा क्या होगी?',
        },
        options: [
          {
            en: 'Into the page (because conventional current I is UPWARD, opposite to negative electron motion)',
            hi: 'कागज के भीतर की ओर (क्योंकि विद्युत धारा I की दिशा इलेक्ट्रॉन की गति के विपरीत ऊपर की ओर है)',
          },
          {
            en: 'Out of the page',
            hi: 'कागज से बाहर की ओर',
          },
          {
            en: 'To the right (parallel to magnetic field)',
            hi: 'दाईं ओर (चुंबकीय क्षेत्र की दिशा में)',
          },
          {
            en: 'No force acts on the electron',
            hi: 'इलेक्ट्रॉन पर कोई बल नहीं लगेगा',
          },
        ],
        correctIndex: 0,
        hint: {
          en: 'Convention trap: conventional electric current I is OPPOSITE to the motion of negative electrons! Point your left middle finger UPWARD (+Y) and forefinger RIGHT (+X).',
          hi: 'ध्यान दें: विद्युत धारा I की दिशा ऋणावेशित इलेक्ट्रॉन की गति के विपरीत (ऊपर की ओर +Y) ली जाती है! अब फ्लेमिंग का वाम-हस्त नियम लगाएं।',
        },
        steps: [
          {
            label: { en: 'Step 1: Find Conventional Current I', hi: 'चरण 1: विद्युत धारा I की दिशा' },
            content: { en: 'Since the negatively charged electron moves vertically downward, conventional current I points vertically UPWARD.', hi: 'इलेक्ट्रॉन नीचे की ओर जा रहा है, अतः विद्युत धारा I की दिशा ऊर्ध्वाधर ऊपर की ओर होगी।' },
          },
          {
            label: { en: 'Step 2: Apply Fleming’s Left-Hand Rule', hi: 'चरण 2: फ्लेमिंग का वाम-हस्त नियम' },
            content: { en: 'Forefinger (Field B) points Right; Middle finger (Current I) points Upward ⇒ Thumb (Force F) points INTO the page.', hi: 'तर्जनी (B) दाईं ओर तथा मध्यमा (I) ऊपर की ओर रखने पर अंगूठा (बल F) कागज के भीतर की ओर इंगित करता है।' },
          },
        ],
        finalAnswer: {
          en: 'Force acts INTO the page.',
          hi: 'बल की दिशा कागज के भीतर की ओर होगी।',
        },
      },
    ],
  },

  'metal-reactivity-displacement': {
    hook: {
      en: 'Dip an iron nail into blue copper sulphate solution and it turns pale green with a reddish copper coat—yet dip a copper strip into pale green iron sulphate and nothing happens at all! Why is this a one-way street?',
      hi: 'नीले कॉपर सल्फेट विलयन में लोहे की कील डुबोने पर विलयन हल्का हरा हो जाता है और कील पर भूरा तांबा जम जाता है—किंतु आयरन सल्फेट में तांबे की पट्टी डुबोने पर कुछ भी नहीं होता! यह अभिक्रिया एकतरफा क्यों है?',
    },
    predictQuestion: {
      en: 'Using the NCERT Reactivity Series (Mg > Zn > Fe > Cu > Ag), predict which of the following metal-in-solution combinations will undergo a single-displacement reaction:',
      hi: 'NCERT सक्रियता श्रेणी (Mg > Zn > Fe > Cu > Ag) के आधार पर बताइए कि निम्नलिखित में से किस युग्म में विस्थापन अभिक्रिया संपन्न होगी:',
    },
    predictOptions: [
      {
        en: 'Zinc strip dipped in Blue CuSO₄(aq) → colourless ZnSO₄(aq) + reddish-brown Cu(s) deposit (because Zn is higher than Cu).',
        hi: 'नीले CuSO₄(aq) में जिंक (Zn) की पट्टी → रंगहीन ZnSO₄(aq) + लाल-भूरा Cu निक्षेप (क्योंकि Zn, Cu से अधिक अभिक्रियाशील है)।',
      },
      {
        en: 'Copper strip dipped in ZnSO₄(aq) → CuSO₄ + Zn.',
        hi: 'ZnSO₄(aq) में तांबे (Cu) की पट्टी → CuSO₄ + Zn।',
      },
      {
        en: 'Silver strip dipped in FeSO₄(aq) → Ag₂SO₄ + Fe.',
        hi: 'FeSO₄(aq) में चाँदी (Ag) की पट्टी → Ag₂SO₄ + Fe।',
      },
    ],
    predictCorrectIndex: 0,
    predictExplanation: {
      en: 'A single-displacement reaction A(s) + BC(aq) → AC(aq) + B(s) occurs IF AND ONLY IF metal A stands HIGHER in the reactivity series than metal B. Since Zn > Fe > Cu > Ag, Zinc easily displaces Cu²⁺ from CuSO₄, whereas Cu cannot displace Zn²⁺ and Ag cannot displace Fe²⁺!',
      hi: 'विस्थापन अभिक्रिया A + BC → AC + B तभी होती है जब धातु A सक्रियता श्रेणी में धातु B से ऊपर स्थित हो। चूँकि Zn > Fe > Cu > Ag है, इसलिए जिंक CuSO₄ से कॉपर को विस्थापित कर देता है!',
    },
    insightFormula: 'A(s) + BSO₄(aq) → ASO₄(aq) + B(s)↓  ⇔  Reactivity(A) > Reactivity(B)',
    insightTerm: {
      en: 'The Reactivity Series & Single Displacement (NCERT Ch 3.2.5)',
      hi: 'सक्रियता श्रेणी एवं एकल विस्थापन अभिक्रिया (NCERT 3.2.5)',
    },
    insightSummary: {
      en: 'Reactivity order: K > Na > Ca > Mg > Al > Zn > Fe > Pb > [H] > Cu > Hg > Ag > Au. Any metal higher in the list loses electrons more readily and displaces any metal below it from its aqueous salt solution.',
      hi: 'सक्रियता क्रम: K > Na > Ca > Mg > Al > Zn > Fe > Pb > [H] > Cu > Hg > Ag > Au। श्रेणी में ऊपर स्थित अधिक अभिक्रियाशील धातु अपने से नीचे स्थित कम अभिक्रियाशील धातु को उसके लवण विलयन से विस्थापित कर देती है।',
    },
    examQuestions: [
      {
        title: {
          en: 'NCERT Class 10 Ch 3 · Iron Nail in Copper Sulphate Colour Change',
          hi: 'NCERT कक्षा 10 अध्याय 3 · कॉपर सल्फेट में लोहे की कील डालने पर रंग परिवर्तन',
        },
        prompt: {
          en: 'Why does the deep blue colour of aqueous copper sulphate (CuSO₄) solution fade to pale green when an iron nail is immersed in it for 20 minutes?',
          hi: 'जब लोहे की कील को कॉपर सल्फेट (CuSO₄) के नीले जलीय विलयन में 20 मिनट तक डुबोया जाता है, तो विलयन का नीला रंग मलीन (हल्का हरा) क्यों पड़ जाता है?',
        },
        options: [
          {
            en: 'Iron is more reactive than copper (Fe > Cu), so it displaces Cu²⁺ ions to form pale-green aqueous iron(II) sulphate (FeSO₄) and deposits reddish-brown Cu metal.',
            hi: 'लोहा तांबे से अधिक अभिक्रियाशील है (Fe > Cu), इसलिए वह CuSO₄ से कॉपर को विस्थापित कर हल्के हरे रंग का आयरन सल्फेट (FeSO₄) बनाता है।',
          },
          {
            en: 'Copper is more reactive than iron and dissolves the nail.',
            hi: 'तांबा लोहे से अधिक अभिक्रियाशील है और कील को घोल लेता है।',
          },
          {
            en: 'Iron absorbs blue light without any chemical reaction.',
            hi: 'बिना किसी रासायनिक अभिक्रिया के लोहा नीला रंग सोख लेता है।',
          },
          {
            en: 'Water evaporates leaving green copper oxide.',
            hi: 'पानी वाष्पित होकर हरा कॉपर ऑक्साइड छोड़ता है।',
          },
        ],
        correctIndex: 0,
        hint: {
          en: 'Compare the positions of Fe and Cu in the Reactivity Series and recall the colour of aqueous FeSO₄.',
          hi: 'सक्रियता श्रेणी में Fe तथा Cu की स्थिति की तुलना करें और FeSO₄(aq) का रंग याद करें।',
        },
        steps: [
          {
            label: { en: 'Reactivity Comparison', hi: 'सक्रियता की तुलना' },
            content: { en: 'Iron lies above Copper in the reactivity series (Fe > Cu).', hi: 'सक्रियता श्रेणी में आयरन (Fe), कॉपर (Cu) से ऊपर स्थित है।' },
          },
          {
            label: { en: 'Displacement Equation', hi: 'विस्थापन समीकरण' },
            content: { en: 'Fe(s) + CuSO₄(aq, Blue) → FeSO₄(aq, Pale Green) + Cu(s, Red-Brown)↓', hi: 'Fe(s) + CuSO₄(aq, नीला) → FeSO₄(aq, हल्का हरा) + Cu(s, लाल-भूरा)↓' },
          },
        ],
        finalAnswer: {
          en: 'Fe displaces Cu from blue CuSO₄ to form pale-green FeSO₄(aq).',
          hi: 'Fe नीले CuSO₄ से Cu को विस्थापित कर हल्का हरा FeSO₄(aq) बनाता है।',
        },
      },
    ],
  },

  'reflex-arc-hormone-feedback': {
    hook: {
      en: 'When your fingers accidentally touch a scorching pan, why does your arm jerk back BEFORE your brain even feels the pain—and how does your pancreas automatically keep blood sugar steady after a sweet meal?',
      hi: 'गर्म तवे को छूते ही मस्तिष्क को दर्द का अहसास होने से पहले ही आपका हाथ पीछे क्यों हट जाता है—और मिठाई खाने के बाद अग्नाशय (Pancreas) रक्त शर्करा को स्वतः संतुलित कैसे रखता है?',
    },
    predictQuestion: {
      en: 'Why are reflex arcs wired directly through the Spinal Cord (Receptor → Sensory Neuron → Spinal Relay Neuron → Motor Neuron → Effector Muscle) rather than routing the emergency decision through the thinking fore-brain?',
      hi: 'आपातकालीन प्रतिवर्ती चाप (Reflex Arc) को सोचने वाले अग्र-मस्तिष्क से गुजारने के बजाय सीधे मेरुरज्जु (Spinal Cord) के माध्यम से क्यों जोड़ा गया है?',
    },
    predictOptions: [
      {
        en: 'Conscious thinking in the brain’s dense neural network is too slow (+120 ms delay); the spinal reflex arc shortcuts the path to pull the hand back in ~26 ms before tissue burns, while also sending a message to the brain!',
        hi: 'मस्तिष्क की जटिल विचार प्रक्रिया में अधिक समय (+120 ms) लगता है; मेरुरज्जु प्रतिवर्ती चाप ~26 ms में तुरंत हाथ पीछे खींचकर जलने से बचाता है और साथ ही मस्तिष्क को सूचना भी भेजता है!',
      },
      {
        en: 'The spinal cord has no connection to the brain.',
        hi: 'मेरुरज्जु का मस्तिष्क से कोई संबंध नहीं होता।',
      },
      {
        en: 'Hormones from the pancreas travel faster than electrical nerve impulses.',
        hi: 'अग्नाशय के हार्मोन तंत्रिका के विद्युत आवेगों से अधिक तेज़ चलते हैं।',
      },
    ],
    predictCorrectIndex: 0,
    predictExplanation: {
      en: 'Thinking requires complex interaction of many neuron impulses in the fore-brain. For urgent survival threats (like touching a flame), the input sensory nerve and output motor nerve meet at their first junction—the Spinal Cord—triggering immediate withdrawal while informing the brain in parallel.',
      hi: 'सोचने की प्रक्रिया में मस्तिष्क के अनेक न्यूरॉनों की जटिल क्रिया शामिल होती है। जलने जैसी आपात स्थिति में संवेदी तंत्रिका और प्रेरक तंत्रिका सीधे मेरुरज्जु (Spinal Cord) में जुड़कर तुरंत प्रतिक्रिया कराती हैं।',
    },
    insightFormula: 'Reflex Arc: Receptor → Sensory → Spinal Relay → Motor → Effector  |  Feedback: ΔGlucose ↔ Insulin/Glucagon',
    insightTerm: {
      en: 'Spinal Reflex Arc & Hormone Negative-Feedback Loop (NCERT Ch 6.1 & 6.3)',
      hi: 'प्रतिवर्ती चाप एवं हार्मोन पुनर्भरण क्रियाविधि (NCERT 6.1 व 6.3)',
    },
    insightSummary: {
      en: 'Electrical nerve impulses deliver ultra-fast, point-to-point emergency responses (Spinal Reflex Arc), while chemical hormones secreted into blood regulate body-wide homeostasis via Negative Feedback (e.g., high blood sugar triggers pancreatic Insulin; falling sugar switches off Insulin).',
      hi: 'विद्युत तंत्रिका आवेग अति-तीव्र आपातकालीन प्रतिक्रिया (प्रतिवर्ती चाप) देते हैं, जबकि रक्त में स्रावित रासायनिक हार्मोन पुनर्भरण क्रियाविधि (Feedback mechanism) द्वारा पूरे शरीर का संतुलन बनाए रखते हैं (जैसे रक्त शर्करा बढ़ने पर इंसुलिन का स्राव)।',
    },
    examQuestions: [
      {
        title: {
          en: 'NCERT Class 10 Ch 6 · Synapse & Pancreatic Insulin Regulation',
          hi: 'NCERT कक्षा 10 अध्याय 6 · सिनेप्स एवं मधुमेह में इंसुलिन की भूमिका',
        },
        prompt: {
          en: 'Why are some patients of diabetes treated by giving injections of insulin, and what regulates the timing and amount of insulin secreted in a healthy person?',
          hi: 'मधुमेह (Diabetes) के कुछ रोगियों की चिकित्सा इंसुलिन का इंजेक्शन देकर क्यों की जाती है, तथा स्वस्थ व्यक्ति में स्रावित इंसुलिन की मात्रा और समय का नियंत्रण किस क्रियाविधि से होता है?',
        },
        options: [
          {
            en: 'Insulin (from the pancreas) regulates blood sugar levels by promoting glucose uptake; a negative-feedback mechanism senses rising blood glucose to increase insulin secretion and inhibits it when sugar falls.',
            hi: 'अग्नाशय से स्रावित इंसुलिन रक्त शर्करा स्तर का नियमन करता है; पुनर्भरण क्रियाविधि (Feedback mechanism) रक्त में शर्करा बढ़ने पर इंसुलिन स्राव बढ़ाती है और शर्करा सामान्य होने पर स्राव घटा देती है।',
          },
          {
            en: 'Insulin is secreted by the thyroid gland and increases blood sugar.',
            hi: 'इंसुलिन अवटु (थायरॉइड) ग्रंथि से निकलता है और रक्त शर्करा बढ़ाता है।',
          },
          {
            en: 'Insulin is an electrical impulse produced by the spinal cord.',
            hi: 'इंसुलिन मेरुरज्जु द्वारा उत्पन्न एक विद्युत आवेग है।',
          },
          {
            en: 'Insulin is secreted at a constant high rate even during fasting.',
            hi: 'उपवास के दौरान भी इंसुलिन निरंतर उच्च दर से स्रावित होता रहता है।',
          },
        ],
        correctIndex: 0,
        hint: {
          en: 'Recall NCERT Section 6.3: the pancreas detects blood sugar rises and responds via a feedback mechanism.',
          hi: 'NCERT अनुभाग 6.3 याद करें: अग्नाशय की कोशिकाएं रक्त शर्करा स्तर को पहचानकर पुनर्भरण क्रियाविधि द्वारा इंसुलिन स्रावित करती हैं।',
        },
        steps: [
          {
            label: { en: 'Role of Insulin', hi: 'इंसुलिन का कार्य' },
            content: { en: 'Insulin hormone secreted by the pancreas lowers high blood glucose by helping cells absorb and store glucose.', hi: 'अग्नाशय द्वारा स्रावित इंसुलिन रक्त में शर्करा के स्तर को नियंत्रित (कम) करता है।' },
          },
          {
            label: { en: 'Feedback Mechanism', hi: 'पुनर्भरण क्रियाविधि (Feedback)' },
            content: { en: 'When blood sugar rises, pancreatic cells detect it and secrete more insulin; as blood sugar falls back to normal, insulin secretion is automatically reduced.', hi: 'रक्त में शर्करा बढ़ने पर अधिक इंसुलिन स्रावित होता है और स्तर सामान्य होने पर स्राव घट जाता है।' },
          },
        ],
        finalAnswer: {
          en: 'Pancreatic insulin lowers blood glucose and is regulated by a negative-feedback mechanism.',
          hi: 'अग्नाशय का इंसुलिन रक्त शर्करा नियंत्रित करता है और पुनर्भरण क्रियाविधि द्वारा नियमित होता है।',
        },
      },
    ],
  },
}
