import type { ConceptContentItem } from '../energyConservation/content'

export const CONVENTIONS_AND_INVERSIONS_CONTENT: Record<string, ConceptContentItem> = {
  'cartesian-sign-trap': {
    hook: {
      en: 'Why do 70% of students lose marks in lens & mirror numericals? Because of ONE missing minus sign!',
      hi: 'लेंस और दर्पण के सवालों में 70% छात्र अंक क्यों गंवाते हैं? केवल एक माइनस (-) चिह्न भूलने के कारण!',
    },
    predictQuestion: {
      en: 'An object is placed 25 cm in front of a concave mirror of focal length 15 cm. What are the correct signs of u and f?',
      hi: 'एक वस्तु 15 cm फोकस दूरी वाले अवतल दर्पण के सामने 25 cm पर रखी है। u और f के सही चिह्न क्या होंगे?',
    },
    predictOptions: [
      { en: 'u = -25 cm, f = -15 cm (Both negative)', hi: 'u = -25 cm, f = -15 cm (दोनों ऋणात्मक)' },
      { en: 'u = +25 cm, f = -15 cm', hi: 'u = +25 cm, f = -15 cm' },
      { en: 'u = -25 cm, f = +15 cm', hi: 'u = -25 cm, f = +15 cm' },
      { en: 'u = +25 cm, f = +15 cm (Both positive)', hi: 'u = +25 cm, f = +15 cm (दोनों धनात्मक)' },
    ],
    predictCorrectIndex: 0,
    predictExplanation: {
      en: 'By New Cartesian Sign Convention: Object is always placed to the left, so u is ALWAYS negative (-25 cm). A concave mirror converges light in front (left), so its focus f is ALSO negative (-15 cm)!',
      hi: 'नई कार्तीय चिह्न परिपाटी के अनुसार: वस्तु हमेशा बाईं ओर रखी जाती है, इसलिए u सदैव ऋणात्मक (-25 cm) होता है। अवतल दर्पण का मुख्य फोकस सामने (बाईं ओर) होता है, इसलिए f भी ऋणात्मक (-15 cm) होता है!',
    },
    insightSummary: {
      en: 'Golden Sign Rule: (1) Object distance u is ALWAYS negative (-). (2) Convex Lens & Convex Mirror have POSITIVE f (+). (3) Concave Lens & Concave Mirror have NEGATIVE f (-).',
      hi: 'स्वर्ण चिह्न नियम: (1) बिंब की दूरी u सदैव ऋणात्मक (-) होती है। (2) उत्तल लेंस और उत्तल दर्पण की फोकस दूरी धनात्मक (+) होती है। (3) अवतल लेंस और अवतल दर्पण की फोकस दूरी ऋणात्मक (-) होती है।',
    },
    insightFormula: 'Lens: 1/v - 1/u = 1/f  |  Mirror: 1/v + 1/u = 1/f',
    insightTerm: {
      en: 'New Cartesian Sign Convention (नई कार्तीय चिह्न परिपाटी)',
      hi: 'नई कार्तीय चिह्न परिपाटी (New Cartesian Sign Convention)',
    },
    examQuestions: [
      {
        title: {
          en: 'CBSE Class 10 Board Numerical (3 Marks)',
          hi: 'सीबीएसई कक्षा 10 बोर्ड संख्यात्मक प्रश्न (3 अंक)',
        },
        prompt: {
          en: 'An object is placed at a distance of 30 cm from a concave lens of focal length 15 cm. Find the nature and position of the image.',
          hi: '15 cm फोकस दूरी के किसी अवतल लेंस से कोई बिंब 30 cm दूरी पर रखा है। प्रतिबिंब की स्थिति तथा प्रकृति ज्ञात कीजिए।',
        },
        options: [
          { en: 'v = -10 cm (Virtual and Erect on the same side)', hi: 'v = -10 cm (आभासी तथा सीधा, बिंब की ही ओर)' },
          { en: 'v = +10 cm (Real and Inverted)', hi: 'v = +10 cm (वास्तविक तथा उल्टा)' },
          { en: 'v = -30 cm (Same position)', hi: 'v = -30 cm (उसी स्थान पर)' },
          { en: 'v = +30 cm (Real and Same size)', hi: 'v = +30 cm (वास्तविक तथा समान आकार)' },
        ],
        correctIndex: 0,
        hint: {
          en: 'For a concave lens, both u and f are negative: u = -30 cm, f = -15 cm. Use 1/v - 1/u = 1/f.',
          hi: 'अवतल लेंस के लिए u और f दोनों ऋणात्मक हैं: u = -30 cm, f = -15 cm। लेंस सूत्र 1/v - 1/u = 1/f लगाएं।',
        },
        steps: [
          {
            label: { en: 'Step 1: Write values with signs', hi: 'चरण 1: चिह्न सहित मान लिखें' },
            content: { en: 'u = -30 cm, f = -15 cm (Concave lens).', hi: 'u = -30 cm, f = -15 cm (अवतल लेंस)।' },
          },
          {
            label: { en: 'Step 2: Apply Lens Formula', hi: 'चरण 2: लेंस सूत्र का प्रयोग' },
            content: { en: '1/v = 1/f + 1/u = 1/(-15) + 1/(-30) = (-2 - 1)/30 = -3/30 = -1/10.', hi: '1/v = 1/f + 1/u = -1/15 - 1/30 = -3/30 = -1/10।' },
          },
          {
            label: { en: 'Step 3: Interpret v sign', hi: 'चरण 3: चिह्न से प्रकृति पहचानें' },
            content: { en: 'v = -10 cm. Negative v for a lens means the image is Virtual, Erect, and 10 cm on the same side as the object.', hi: 'v = -10 cm। ऋणात्मक चिह्न दर्शाता है कि प्रतिबिंब आभासी, सीधा और बिंब की ओर 10 cm पर बनता है।' },
          },
        ],
        finalAnswer: {
          en: 'Image is formed at v = -10 cm (virtual, erect, diminished).',
          hi: 'प्रतिबिंब v = -10 cm पर बनता है (आभासी, सीधा और छोटा)।',
        },
      },
    ],
  },

  'real-vs-virtual-switch': {
    hook: {
      en: 'A convex lens projects an upside-down movie on a wall, yet the SAME lens acts as an upright magnifying glass when held close!',
      hi: 'एक उत्तल लेंस दीवार पर उल्टा चित्र बनाता है, लेकिन पास रखने पर वही लेंस सीधा आवर्धक लेंस (मैग्नीफाइंग ग्लास) बन जाता है! कैसे?',
    },
    predictQuestion: {
      en: 'A convex lens has focal length f = +20 cm. At which object distance will it form a VIRTUAL and ERECT image?',
      hi: 'एक उत्तल लेंस की फोकस दूरी f = +20 cm है। वस्तु को कितनी दूरी पर रखने से आभासी और सीधा प्रतिबिंब बनेगा?',
    },
    predictOptions: [
      { en: '12 cm (Inside the focus: |u| < f)', hi: '12 cm (फोकस के भीतर: |u| < f)' },
      { en: '20 cm (At the focus F)', hi: '20 cm (फोकस F पर)' },
      { en: '30 cm (Between F and 2F)', hi: '30 cm (F और 2F के बीच)' },
      { en: '40 cm (At 2F)', hi: '40 cm (2F पर)' },
    ],
    predictCorrectIndex: 0,
    predictExplanation: {
      en: 'The Focal Point F is the critical tipping boundary! When the object is outside F (|u| > 20 cm), rays converge to a REAL, INVERTED image. Once the object crosses inside F (|u| < 20 cm, e.g., 12 cm), rays diverge and appear to come from a VIRTUAL, ERECT, MAGNIFIED image!',
      hi: 'मुख्य फोकस F ही वह सीमा है! जब वस्तु F के बाहर होती है (|u| > 20 cm), तो किरणें मिलकर वास्तविक व उल्टा प्रतिबिंब बनाती हैं। जैसे ही वस्तु F के अंदर आती है (जैसे 12 cm), आभासी, सीधा और बड़ा प्रतिबिंब बनता है!',
    },
    insightSummary: {
      en: 'For any converging system (convex lens or concave mirror), the focal length f is the phase transition point: |u| > f produces Real & Inverted images; |u| < f produces Virtual, Erect & Magnified images.',
      hi: 'किसी भी अभिसारी तंत्र (उत्तल लेंस या अवतल दर्पण) के लिए फोकस बिंदु F एक सीमा रेखा है: |u| > f होने पर वास्तविक व उल्टा प्रतिबिंब बनता है; |u| < f होने पर आभासी, सीधा व आवर्धित प्रतिबिंब बनता है।',
    },
    insightFormula: '|u| > f → Real (m < 0)  |  |u| < f → Virtual & Magnified (m > +1)',
    insightTerm: {
      en: 'Focal Crossover Boundary (फोकस संक्रमण सीमा)',
      hi: 'फोकस संक्रमण सीमा (Real-to-Virtual Crossover)',
    },
    examQuestions: [
      {
        title: {
          en: 'CBSE Board HOTS Conceptual (2 Marks)',
          hi: 'सीबीएसई बोर्ड वैचारिक प्रश्न (2 अंक)',
        },
        prompt: {
          en: 'A palmist wants to use a convex lens of focal length 10 cm as a magnifying glass to read palm lines. Where should he hold the palm relative to the lens?',
          hi: 'एक ज्योतिषी हथेली की रेखाएं देखने के लिए 10 cm फोकस दूरी के उत्तल लेंस का आवर्धक लेंस के रूप में उपयोग करना चाहता है। उसे हथेली लेंस से कितनी दूरी पर रखनी चाहिए?',
        },
        options: [
          { en: 'Less than 10 cm from the lens (Between optical centre O and focus F)', hi: 'लेंस से 10 cm से कम दूरी पर (प्रकाशिक केंद्र O और फोकस F के बीच)' },
          { en: 'At exactly 10 cm', hi: 'ठीक 10 cm की दूरी पर' },
          { en: 'Between 10 cm and 20 cm', hi: '10 cm और 20 cm के बीच' },
          { en: 'At 20 cm (At 2F)', hi: '20 cm पर (2F पर)' },
        ],
        correctIndex: 0,
        hint: {
          en: 'A magnifying glass requires a virtual, erect, and enlarged image.',
          hi: 'आवर्धक लेंस के लिए आभासी, सीधा और बड़ा प्रतिबिंब आवश्यक है।',
        },
        steps: [
          {
            label: { en: 'Step 1: Identify desired image type', hi: 'चरण 1: आवश्यक प्रतिबिंब पहचानें' },
            content: { en: 'To read palm lines comfortably, the image must be erect (upright) and magnified (virtual).', hi: 'रेखाएं स्पष्ट पढ़ने के लिए प्रतिबिंब सीधा (आभासी) और बड़ा होना चाहिए।' },
          },
          {
            label: { en: 'Step 2: Apply position rule', hi: 'चरण 2: स्थिति नियम लागू करें' },
            content: { en: 'A convex lens forms a virtual, erect, magnified image only when the object is placed within the focal length (between O and F, i.e., distance < 10 cm).', hi: 'उत्तल लेंस तभी आभासी और सीधा प्रतिबिंब बनाता है जब बिंब प्रकाशिक केंद्र O और फोकस F के बीच (अर्थात 10 cm से कम दूरी पर) रखा हो।' },
          },
        ],
        finalAnswer: {
          en: 'At a distance of less than 10 cm from the convex lens.',
          hi: 'उत्तल लेंस से 10 cm से कम दूरी पर।',
        },
      },
    ],
  },

  'magnification-code': {
    hook: {
      en: 'If a question states "Magnification m = -0.5" or "m = +2.0", you can decode the ENTIRE optical setup in 3 seconds!',
      hi: 'यदि प्रश्न में केवल "आवर्धन m = -0.5" या "m = +2.0" दिया हो, तो आप 3 सेकंड में पूरे प्रतिबिंब का रहस्य खोल सकते हैं!',
    },
    predictQuestion: {
      en: 'The magnification produced by a spherical lens is m = +0.4. What is the nature of the image and the type of lens?',
      hi: 'किसी गोलीय लेंस द्वारा उत्पन्न आवर्धन m = +0.4 है। प्रतिबिंब की प्रकृति और लेंस का प्रकार क्या है?',
    },
    predictOptions: [
      { en: 'Virtual, erect, diminished image — Concave Lens', hi: 'आभासी, सीधा, छोटा प्रतिबिंब — अवतल लेंस' },
      { en: 'Virtual, erect, diminished image — Convex Lens', hi: 'आभासी, सीधा, छोटा प्रतिबिंब — उत्तल लेंस' },
      { en: 'Real, inverted, diminished image — Concave Lens', hi: 'वास्तविक, उल्टा, छोटा प्रतिबिंब — अवतल लेंस' },
      { en: 'Real, inverted, magnified image — Convex Lens', hi: 'वास्तविक, उल्टा, बड़ा प्रतिबिंब — उत्तल लेंस' },
    ],
    predictCorrectIndex: 0,
    predictExplanation: {
      en: 'Two-Part Decode: (1) The PLUS (+) sign means Erect & Virtual. (2) The magnitude 0.4 (< 1) means Diminished (smaller than object). A convex lens only makes MAGNIFIED virtual images (m > +1); only a CONCAVE lens makes diminished virtual images (0 < m < +1)!',
      hi: 'दो-चरण में पहचानें: (1) धन (+) चिह्न का अर्थ है सीधा और आभासी। (2) मान 0.4 (1 से कम) का अर्थ है छोटा प्रतिबिंब। उत्तल लेंस केवल बड़ा आभासी प्रतिबिंब (m > +1) बनाता है; केवल अवतल लेंस ही छोटा आभासी प्रतिबिंब (0 < m < +1) बनाता है!',
    },
    insightSummary: {
      en: 'Magnification m = hᵢ/hₒ has two independent pieces of information: The SIGN of m tells orientation (- = Real & Inverted, + = Virtual & Erect), while the MAGNITUDE |m| tells relative size (|m| < 1 diminished, |m| = 1 equal, |m| > 1 magnified).',
      hi: 'आवर्धन m = hᵢ/hₒ में दो स्वतंत्र जानकारियाँ छिपी हैं: m का चिह्न प्रकृति बताता है (- = वास्तविक व उल्टा, + = आभासी व सीधा), और परिमाण |m| आकार बताता है (|m| < 1 छोटा, |m| = 1 बराबर, |m| > 1 बड़ा)।',
    },
    insightFormula: 'm = hᵢ / hₒ  |  Sign(m) → Orientation  |  |m| → Size Ratio',
    insightTerm: {
      en: 'Magnification Dual Code (आवर्धन का दोहरा संकेत)',
      hi: 'आवर्धन का दोहरा संकेत (Magnification Sign vs Magnitude)',
    },
    examQuestions: [
      {
        title: {
          en: 'CBSE Class 10 Board Question (2 Marks)',
          hi: 'सीबीएसई कक्षा 10 बोर्ड प्रश्न (2 अंक)',
        },
        prompt: {
          en: 'What is meant by the statement: "The magnification produced by a plane mirror is +1"?',
          hi: 'इस कथन का क्या अर्थ है कि "समतल दर्पण द्वारा उत्पन्न आवर्धन +1 है"?',
        },
        options: [
          { en: 'The "+" sign indicates the image is virtual and erect; "1" indicates the image size equals the object size.', hi: '"+" चिह्न दर्शाता है कि प्रतिबिंब आभासी और सीधा है; "1" दर्शाता है कि प्रतिबिंब का आकार वस्तु के आकार के बराबर है।' },
          { en: 'The image is formed 1 m behind the mirror.', hi: 'प्रतिबिंब दर्पण के पीछे 1 मीटर पर बनता है।' },
          { en: 'The image is real and of unit height.', hi: 'प्रतिबिंब वास्तविक और इकाई ऊंचाई का है।' },
          { en: 'The focal length of the plane mirror is +1 cm.', hi: 'समतल दर्पण की फोकस दूरी +1 cm है।' },
        ],
        correctIndex: 0,
        hint: {
          en: 'Break m = +1 into its sign (+) and its numerical value (1).',
          hi: 'm = +1 को उसके चिह्न (+) और संख्यात्मक मान (1) में विभाजित करें।',
        },
        steps: [
          {
            label: { en: 'Step 1: Decode the positive (+) sign', hi: 'चरण 1: धन (+) चिह्न का अर्थ' },
            content: { en: 'Positive sign shows that the image is erect (upright) and therefore virtual.', hi: 'धनात्मक चिह्न बताता है कि प्रतिबिंब सीधा और आभासी है।' },
          },
          {
            label: { en: 'Step 2: Decode the magnitude (1)', hi: 'चरण 2: परिमाण (1) का अर्थ' },
            content: { en: '|m| = hᵢ/hₒ = 1 means hᵢ = hₒ: the height of the image is exactly equal to the height of the object.', hi: '|m| = hᵢ/hₒ = 1 का अर्थ है hᵢ = hₒ: प्रतिबिंब का आकार बिंब के आकार के ठीक बराबर है।' },
          },
        ],
        finalAnswer: {
          en: 'Virtual & erect image (+) of the exact same size as the object (1).',
          hi: 'आभासी व सीधा प्रतिबिंब (+) जो आकार में वस्तु के ठीक बराबर है (1)।',
        },
      },
    ],
  },

  'lens-power-dioptre': {
    hook: {
      en: 'An eye doctor writes "+2.0 D" or "-1.5 D" on your spectacles prescription. What does "D" mean, and where is the centimetre trap?',
      hi: 'आंखों का डॉक्टर चश्मे के पर्चे पर "+2.0 D" या "-1.5 D" लिखता है। इस "D" का क्या अर्थ है और सेंटीमीटर की गलती कहाँ होती है?',
    },
    predictQuestion: {
      en: 'A convex lens has a focal length of 25 cm. What is its power in Dioptres (D)?',
      hi: 'एक उत्तल लेंस की फोकस दूरी 25 cm है। डाइऑप्टर (D) में इसकी क्षमता क्या होगी?',
    },
    predictOptions: [
      { en: '+4.0 D (Convert 25 cm to 0.25 m first: P = 100/25 = +4 D)', hi: '+4.0 D (पहले 25 cm को 0.25 m में बदलें: P = 100/25 = +4 D)' },
      { en: '+0.04 D (Directly dividing 1/25 without unit conversion)', hi: '+0.04 D (बिना मीटर में बदले सीधे 1/25 भाग देना)' },
      { en: '-4.0 D', hi: '-4.0 D' },
      { en: '+25 D', hi: '+25 D' },
    ],
    predictCorrectIndex: 0,
    predictExplanation: {
      en: '1 Dioptre is defined as the power of a lens of focal length 1 METRE (not 1 cm!). So f = 25 cm = 0.25 m, giving P = 1 / 0.25 = +4.0 D (or always use P = 100 / f(in cm)).',
      hi: '1 डाइऑप्टर उस लेंस की क्षमता है जिसकी फोकस दूरी 1 मीटर हो (1 सेमी नहीं!)। अतः f = 25 cm = 0.25 m, जिससे P = 1 / 0.25 = +4.0 D (या सीधे P = 100 / f(सेमी में) सूत्र लगाएं)।',
    },
    insightSummary: {
      en: 'Power of a lens P = 1 / f(in metres) = 100 / f(in cm) checks how strongly a lens converges (+) or diverges (-) light. Shorter focal length means sharper bending and HIGHER power (inverse relationship).',
      hi: 'लेंस की क्षमता P = 1 / f(मीटर में) = 100 / f(सेमी में) बताती है कि लेंस प्रकाश किरणों को कितना अधिक मोड़ता है। कम फोकस दूरी का अर्थ है अधिक मोड़ और अधिक क्षमता (व्युत्क्रमानुपाती संबंध)।',
    },
    insightFormula: 'P (Dioptre) = 1 / f (m) = 100 / f (cm)  |  P_net = P₁ + P₂',
    insightTerm: {
      en: 'Dioptre & Metre Conversion Trap (लेंस क्षमता और डाइऑप्टर)',
      hi: 'लेंस की क्षमता एवं मीटर रूपांतरण नियम (Power of a Lens)',
    },
    examQuestions: [
      {
        title: {
          en: 'CBSE Class 10 Board Numerical (3 Marks)',
          hi: 'सीबीएसई कक्षा 10 बोर्ड संख्यात्मक प्रश्न (3 अंक)',
        },
        prompt: {
          en: 'A doctor has prescribed a corrective lens of power -2.5 D. Find the focal length of the lens in cm. Is the prescribed lens diverging or converging?',
          hi: 'किसी डॉक्टर ने -2.5 D क्षमता का संशोधक लेंस निर्धारित किया है। लेंस की फोकस दूरी (सेमी में) ज्ञात कीजिए। क्या निर्धारित लेंस अपसारी है अथवा अभिसारी?',
        },
        options: [
          { en: 'f = -40 cm (Diverging / Concave lens)', hi: 'f = -40 cm (अपसारी / अवतल लेंस)' },
          { en: 'f = +40 cm (Converging / Convex lens)', hi: 'f = +40 cm (अभिसारी / उत्तल लेंस)' },
          { en: 'f = -0.4 cm (Diverging lens)', hi: 'f = -0.4 cm (अपसारी लेंस)' },
          { en: 'f = -25 cm (Diverging lens)', hi: 'f = -25 cm (अपसारी लेंस)' },
        ],
        correctIndex: 0,
        hint: {
          en: 'Use f(in cm) = 100 / P. Negative sign indicates a concave (diverging) lens.',
          hi: 'f(सेमी में) = 100 / P का उपयोग करें। ऋणात्मक चिह्न अवतल (अपसारी) लेंस दर्शाता है।',
        },
        steps: [
          {
            label: { en: 'Step 1: Calculate focal length in metres', hi: 'चरण 1: मीटर में फोकस दूरी निकालें' },
            content: { en: 'f = 1 / P = 1 / (-2.5 D) = -0.4 m.', hi: 'f = 1 / P = 1 / (-2.5) = -0.4 मीटर।' },
          },
          {
            label: { en: 'Step 2: Convert metres to centimetres', hi: 'चरण 2: सेंटीमीटर में बदलें' },
            content: { en: 'f = -0.4 × 100 = -40 cm.', hi: 'f = -0.4 × 100 = -40 cm।' },
          },
          {
            label: { en: 'Step 3: Identify lens nature', hi: 'चरण 3: लेंस की प्रकृति' },
            content: { en: 'Since power P and focal length f are negative, it is a diverging (concave) lens (used for myopia/short-sightedness).', hi: 'चूंकि क्षमता और फोकस दूरी ऋणात्मक हैं, यह एक अपसारी (अवतल) लेंस है (निकट-दृष्टि दोष के लिए)।' },
          },
        ],
        finalAnswer: {
          en: 'f = -40 cm; the lens is diverging (concave).',
          hi: 'f = -40 cm; यह एक अपसारी (अवतल) लेंस है।',
        },
      },
    ],
  },

  'eye-defects-correction': {
    hook: {
      en: 'One student’s spectacles carry a −1.25 D prescription to read the classroom blackboard, while their grandfather wears +3.0 D glasses to read the morning newspaper. Why do the signs and lens shapes flip?',
      hi: 'एक छात्र ब्लैकबोर्ड पढ़ने के लिए −1.25 D का चश्मा पहनता है, जबकि उसके दादाजी अखबार पढ़ने के लिए +3.0 D का चश्मा लगाते हैं। इन दोनों में चिह्न और लेंस के प्रकार क्यों बदल जाते हैं?',
    },
    predictQuestion: {
      en: 'A myopic person cannot see objects clearly beyond 80 cm (their far point d_F = 80 cm). What focal length f and power P of spectacle lens will bring distant objects (u = −∞) into sharp focus on their retina?',
      hi: 'निकट-दृष्टि दोष (Myopia) से पीड़ित एक व्यक्ति 80 cm से अधिक दूर की वस्तुओं को स्पष्ट नहीं देख सकता (दूर बिंदु d_F = 80 cm)। दूरस्थ वस्तुओं (u = −∞) को रेटिना पर फोकस करने के लिए किस फोकस दूरी f और क्षमता P का लेंस चाहिए?',
    },
    predictOptions: [
      {
        en: 'Concave lens with f = −80 cm and Power P = −1.25 D',
        hi: 'अवतल लेंस जिसकी फोकस दूरी f = −80 cm तथा क्षमता P = −1.25 D हो',
      },
      {
        en: 'Convex lens with f = +80 cm and Power P = +1.25 D',
        hi: 'उत्तल लेंस जिसकी फोकस दूरी f = +80 cm तथा क्षमता P = +1.25 D हो',
      },
      {
        en: 'Concave lens with f = −25 cm and Power P = −4.0 D',
        hi: 'अवतल लेंस जिसकी फोकस दूरी f = −25 cm तथा क्षमता P = −4.0 D हो',
      },
    ],
    predictCorrectIndex: 0,
    predictExplanation: {
      en: 'In myopia, parallel rays from infinity focus IN FRONT of the retina. A diverging (concave) lens must form a virtual image of distant objects (u = −∞) at the person’s far point (v = −80 cm). By 1/f = 1/v − 1/u, f = −80 cm = −0.8 m, so P = 1/(−0.8) = −1.25 D!',
      hi: 'निकट-दृष्टि दोष में अनंत से आने वाली किरणें रेटिना के सामने फोकस हो जाती हैं। अवतल लेंस अनंत की वस्तु (u = −∞) का आभासी प्रतिबिंब व्यक्ति के दूर बिंदु (v = −80 cm) पर बनाता है। अतः f = −80 cm = −0.8 m तथा क्षमता P = −1.25 D होगी!',
    },
    insightFormula: 'Myopia: f = −d_F (−D)  |  Hypermetropia: 1/f = 1/25 − 1/d_N (+D)',
    insightTerm: {
      en: 'Defects of Vision & Their Correction (NCERT Ch 10.2)',
      hi: 'दृष्टि दोष तथा उनका संशोधन (NCERT 10.2)',
    },
    insightSummary: {
      en: 'Myopia (near-sightedness) focuses distant light in front of the retina → correct with a Concave (−D) lens of f = −d_F. Hypermetropia (far-sightedness) focuses near light behind the retina → correct with a Convex (+D) lens.',
      hi: 'निकट-दृष्टि दोष (Myopia) में दूर का प्रकाश रेटिना के आगे मिलता है → अवतल लेंस (−D, f = −d_F) लगाएं। दीर्घ-दृष्टि दोष (Hypermetropia) में पास का प्रकाश रेटिना के पीछे मिलता है → उत्तल लेंस (+D) लगाएं।',
    },
    examQuestions: [
      {
        title: {
          en: 'NCERT Class 10 Ch 10 Q6 · Hypermetropic Near-Point Correction',
          hi: 'NCERT कक्षा 10 अध्याय 10 · दीर्घ-दृष्टि दोष का संशोधन',
        },
        prompt: {
          en: 'The near point of a hypermetropic eye is 1 m (100 cm). What is the power of the lens required to correct this defect? Assume that the near point of the normal eye is 25 cm.',
          hi: 'किसी दीर्घ-दृष्टि दोष से पीड़ित व्यक्ति का निकट बिंदु 1 m (100 cm) है। इस दोष को संशोधित करने के लिए आवश्यक लेंस की क्षमता क्या होगी? मान लीजिए कि सामान्य नेत्र का निकट बिंदु 25 cm है।',
        },
        options: [
          { en: '+3.0 D (Convex lens with f = +33.3 cm)', hi: '+3.0 D (उत्तल लेंस, f = +33.3 cm)' },
          { en: '−3.0 D (Concave lens with f = −33.3 cm)', hi: '−3.0 D (अवतल लेंस, f = −33.3 cm)' },
          { en: '+1.0 D (Convex lens with f = +100 cm)', hi: '+1.0 D (उत्तल लेंस, f = +100 cm)' },
          { en: '+4.0 D (Convex lens with f = +25 cm)', hi: '+4.0 D (उत्तल लेंस, f = +25 cm)' },
        ],
        correctIndex: 0,
        hint: {
          en: 'The lens must take an object at u = −25 cm and form its virtual image at v = −100 cm. Use 1/f = 1/v − 1/u.',
          hi: 'लेंस को u = −25 cm पर रखी वस्तु का आभासी प्रतिबिंब v = −100 cm पर बनाना है। 1/f = 1/v − 1/u लगाएं।',
        },
        steps: [
          {
            label: { en: 'Given with Cartesian Signs', hi: 'कार्तीय चिह्नों सहित मान' },
            content: { en: 'u = −25 cm (normal near point), v = −100 cm (defective near point)', hi: 'u = −25 cm, v = −100 cm' },
          },
          {
            label: { en: 'Lens Formula 1/f = 1/v − 1/u', hi: 'लेंस सूत्र 1/f = 1/v − 1/u' },
            content: { en: '1/f = 1/(−100) − 1/(−25) = −1/100 + 4/100 = +3/100 cm⁻¹ ⇒ f = +33.33 cm = +1/3 m', hi: '1/f = −1/100 + 1/25 = +3/100 cm⁻¹ ⇒ f = +1/3 m' },
          },
          {
            label: { en: 'Power P = 1 / f(m)', hi: 'क्षमता P = 1 / f(m)' },
            content: { en: 'P = 1 / (1/3 m) = +3.0 D (Convex lens)', hi: 'P = +3.0 D (उत्तल लेंस)' },
          },
        ],
        finalAnswer: { en: 'Power P = +3.0 D (Convex / Converging lens)', hi: 'लेंस की क्षमता P = +3.0 D (उत्तल लेंस)' },
      },
    ],
  },

  'prism-dispersion-scattering': {
    hook: {
      en: 'Why does violet light bend the sharpest inside a glass prism and scatter to paint the daytime sky blue, while red light bends the least and serves as the universal danger signal through fog?',
      hi: 'काँच के प्रिज्म में बैंगनी प्रकाश सबसे अधिक क्यों मुड़ता है और आकाश को नीला बनाता है, जबकि लाल प्रकाश सबसे कम मुड़ता है और कोहरे में खतरे के संकेत के रूप में क्यों चुना जाता है?',
    },
    predictQuestion: {
      en: 'When a narrow beam of white light passes through a triangular glass prism, which colour travels the slowest inside the glass, bends through the largest deviation angle δ, and what happens if an identical inverted prism is placed right behind it?',
      hi: 'जब श्वेत प्रकाश की किरण काँच के प्रिज्म से गुजरती है, तो कौन-सा रंग काँच में सबसे धीमा चलता है और सबसे अधिक कोण δ पर मुड़ता है, तथा पीछे एक उल्टा प्रिज्म रखने पर क्या होता है?',
    },
    predictOptions: [
      {
        en: 'Violet (shortest λ ≈ 400 nm) travels slowest in glass and bends the most; an inverted second prism recombines the spectrum back into white light.',
        hi: 'बैंगनी (सबसे कम λ ≈ 400 nm) काँच में सबसे धीमा चलता है व सबसे अधिक मुड़ता है; उल्टा दूसरा प्रिज्म स्पेक्ट्रम को पुनः श्वेत प्रकाश में मिला देता है।',
      },
      {
        en: 'Red (longest λ ≈ 700 nm) bends the most, and a second prism splits the colours into 14 bands.',
        hi: 'लाल रंग सबसे अधिक मुड़ता है और दूसरा प्रिज्म रंगों को 14 पट्टियों में बाँट देता है।',
      },
      {
        en: 'All colours travel at the exact same speed inside glass, but bend differently only due to prism thickness.',
        hi: 'काँच में सभी रंग समान चाल से चलते हैं, केवल प्रिज्म की मोटाई से अलग मुड़ते हैं।',
      },
    ],
    predictCorrectIndex: 0,
    predictExplanation: {
      en: 'In glass, refractive index n increases as wavelength λ decreases. Violet (λ ≈ 400 nm) experiences the highest refractive index n, travels slowest in glass (v = c/n), and bends the most. Placing a second identical prism upside-down cancels the angular dispersion and recombines the 7 colours into white light (Newton’s experiment)!',
      hi: 'काँच में तरंगदैर्घ्य λ कम होने पर अपवर्तनांक n अधिक होता है। बैंगनी रंग (λ ≈ 400 nm) काँच में सबसे धीमा चलता है और सबसे अधिक झुकता है। दूसरा समान प्रिज्म उल्टा रखने पर कोणीय विक्षेपण निरस्त हो जाता है और पुनः श्वेत प्रकाश प्राप्त होता है!',
    },
    insightFormula: 'λ_violet < λ_red ⇒ n_violet > n_red ⇒ δ_violet > δ_red  |  I_scatter ∝ 1/λ⁴',
    insightTerm: {
      en: 'Prism Dispersion, Recombination & Scattering (NCERT Ch 10.3–10.6)',
      hi: 'प्रिज्म द्वारा वर्ण-विक्षेपण, पुनर्योजन एवं प्रकीर्णन (NCERT 10.3–10.6)',
    },
    insightSummary: {
      en: 'Shorter wavelength (Violet/Blue) has higher refractive index in glass (bends most in prism) and scatters ~6–9× more strongly off fine air molecules (I ∝ 1/λ⁴ → blue sky). Longer wavelength (Red) bends least and scatters least (travels farthest through fog/smoke).',
      hi: 'छोटी तरंगदैर्घ्य (बैंगनी/नीला) का काँच में अपवर्तनांक अधिक होता है (प्रिज्म में सर्वाधिक विचलन) और वायु के सूक्ष्म कणों द्वारा ~6–9 गुना अधिक प्रकीर्णित होती है (I ∝ 1/λ⁴ → नीला आकाश)। लाल रंग (बड़ी λ) सबसे कम मुड़ता और सबसे कम प्रकीर्णित होता है।',
    },
    examQuestions: [
      {
        title: {
          en: 'CBSE Class 10 Board Question · Danger Signals & Rayleigh Scattering',
          hi: 'सीबीएसई कक्षा 10 बोर्ड प्रश्न · खतरे के संकेत लाल क्यों होते हैं?',
        },
        prompt: {
          en: 'Why are danger signal lights red in colour, and how does the wavelength of red light compare to blue/violet light?',
          hi: 'खतरे के संकेत (Danger signals) का प्रकाश लाल रंग का क्यों होता है, तथा लाल प्रकाश की तरंगदैर्घ्य नीले/बैंगनी प्रकाश की तुलना में कैसी होती है?',
        },
        options: [
          {
            en: 'Red light has the longest visible wavelength (~1.8× blue), so it is scattered the least by fog or smoke (I ∝ 1/λ⁴) and remains visible from afar.',
            hi: 'लाल प्रकाश की तरंगदैर्घ्य सबसे अधिक (नीले से ~1.8 गुना) होती है, इसलिए कोहरे या धुएँ द्वारा इसका प्रकीर्णन सबसे कम (I ∝ 1/λ⁴) होता है।',
          },
          {
            en: 'Red light has the shortest wavelength and scatters the most in fog.',
            hi: 'लाल प्रकाश की तरंगदैर्घ्य सबसे कम होती है और यह कोहरे में सबसे अधिक फैलता है।',
          },
          {
            en: 'Red light bends the most when passing through a glass prism.',
            hi: 'लाल प्रकाश काँच के प्रिज्म से गुजरने पर सबसे अधिक मुड़ता है।',
          },
          {
            en: 'Red light travels faster than blue light in outer-space vacuum.',
            hi: 'निर्वात में लाल प्रकाश नीले प्रकाश से अधिक चाल से चलता है।',
          },
        ],
        correctIndex: 0,
        hint: {
          en: 'Recall Rayleigh’s scattering rule: shorter wavelengths scatter strongly, while the longest visible wavelength (Red, ~700 nm) passes through fog/smoke with minimal scattering.',
          hi: 'प्रकीर्णन नियम याद करें: बड़ी तरंगदैर्घ्य (लाल ~700 nm) का कोहरे या धुएँ द्वारा सबसे कम प्रकीर्णन होता है।',
        },
        steps: [
          {
            label: { en: 'Wavelength Comparison', hi: 'तरंगदैर्घ्य की तुलना' },
            content: { en: 'Red light has the longest wavelength in the visible spectrum (λ_red ≈ 1.8 × λ_blue).', hi: 'दृश्य प्रकाश में लाल रंग की तरंगदैर्घ्य सबसे अधिक होती है (λ_लाल ≈ 1.8 × λ_नीला)।' },
          },
          {
            label: { en: 'Scattering Effect in Fog/Smoke', hi: 'कोहरे या धुएँ में प्रकीर्णन' },
            content: { en: 'Because scattering decreases steeply with wavelength (I ∝ 1/λ⁴), red light is scattered the least and penetrates farthest without losing intensity.', hi: 'चूँकि बड़ी तरंगदैर्घ्य का प्रकीर्णन सबसे कम होता है, लाल प्रकाश लंबी दूरी से भी स्पष्ट दिखाई देता है।' },
          },
        ],
        finalAnswer: {
          en: 'Longest wavelength → least scattered by fog/smoke.',
          hi: 'सर्वाधिक तरंगदैर्घ्य → कोहरे या धुएँ में न्यूनतम प्रकीर्णन।',
        },
      },
    ],
  },
}
