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
}
