import { STANDARD_APPLIANCES } from './billingLimits'
import type { HouseholdBillingInput } from './billingModel'

export type BillingPresentationMode = 'reading' | 'immersive'
export type BillingQuestionId =
  | 'bill-q1'
  | 'bill-q2'
  | 'bill-q3'
  | 'bill-q4'
  | 'bill-q5'
  | 'bill-q6'

/* ------------------------------ Source Metadata ------------------------------ */

export const BILLING_SOURCE_METADATA = {
  reviewStatus: 'Provisional — educator and curriculum review pending',
  ncertReference:
    'NCERT Class 10 Science, Chapter “Electricity”, Section 12.8 (Electric Power and Commercial Unit of Electrical Energy: 1 kWh = 3.6 × 10⁶ J), Example 12.12 and Example 12.13.',
  secondaryReference:
    'OpenStax University Physics Vol. 2, Section 9.5 (Electrical Energy, Household Circuits, and Utility Metering).',
  modelAssumptions:
    'Standard AC sinusoidal mains voltage (220 V RMS in India), unity power factor (real power P = VI assumed for all household resistive and motor appliances), uniform tariff rate without slab tiered progressive billing, constant daily usage hours across billing cycle.',
  displayNotice:
    'Energy consumed is expressed in Board of Trade Units (1 unit = 1 kWh) and Joules. The utility energy meter simulates both cumulative kilowatt-hour counter dials and live active power demand.',
  questionOrigin:
    'All conceptual questions, numerical problems, and guided discoveries are aligned with NCERT Class 10 syllabus standards and CBSE Board examinations.',
} as const

/* ------------------------------ Predictions ------------------------------ */

export interface BillingPrediction {
  id: 'unit-definition-prediction' | 'power-vs-duration-prediction' | 'what-utility-bills-prediction'
  heading: string
  prompt: string
  options: readonly string[]
  correctOptionIndex: number
}

export const BILLING_PREDICTIONS: readonly BillingPrediction[] = [
  {
    id: 'what-utility-bills-prediction',
    heading: 'Prediction 1 · What Does the Electricity Board Bill Us For?',
    prompt:
      'When your family receives an electricity bill at the end of the month, what physical electrical quantity is actually being measured and billed?',
    options: [
      'Total Electrical Energy consumed (measured in kilowatt-hours, kWh).',
      'The electric current delivered to our home (measured in Amperes).',
      'The electric power of our appliances (measured in Watts or kilowatts).',
    ],
    correctOptionIndex: 0,
  },
  {
    id: 'power-vs-duration-prediction',
    heading: 'Prediction 2 · The 1000 W Iron vs the 100 W TV',
    prompt:
      'An electric iron is rated at 1000 W and used for 1 hour every day. A television is rated at 100 W and left on for 12 hours every day. Over a 30-day billing month, which appliance adds more cost to the bill?',
    options: [
      'The 100 W TV consumes more energy and costs more (36 kWh vs 30 kWh).',
      'The 1000 W iron costs 10 times more because its power rating is 10 times higher.',
      'Both cost the same because the total product of power and hours is always balanced by the meter.',
    ],
    correctOptionIndex: 0,
  },
  {
    id: 'unit-definition-prediction',
    heading: 'Prediction 3 · The Commercial "Unit"',
    prompt:
      'Your domestic electricity meter advances by "1 Unit". How many Joules of energy does this 1 commercial unit represent?',
    options: [
      '3,600,000 Joules (3.6 × 10⁶ J = 1 kWh = 1000 W × 3600 s).',
      '1,000 Joules (since 1 kW = 1000 W).',
      '3,600 Joules (since 1 hour = 3600 seconds).',
    ],
    correctOptionIndex: 0,
  },
]

/* ------------------------------ Guided Discoveries ------------------------------ */

export interface BillingDiscovery {
  id: 'disc-duration-vs-power' | 'disc-tariff-scaling' | 'disc-joules-conversion'
  title: string
  subtitle: string
  fixedCondition: string
  actionLabel: string
  setupAppliances: { id: string; hoursPerDay: number; enabled: boolean }[]
  billingDays: number
  tariffRate: number
  beforeSummary: string
  afterSummary: string
  expectedDiscovery: string
  physicalReason: string
}

export const BILLING_DISCOVERIES: readonly BillingDiscovery[] = [
  {
    id: 'disc-duration-vs-power',
    title: 'Discovery 1 · High Power vs Long Duration',
    subtitle: 'Compare a 2000 W geyser used briefly with a 200 W refrigerator running 24 hours.',
    fixedCondition: '30 days billing period, tariff ₹6 / unit',
    actionLabel: 'Compare Geyser (1 hr/day) vs Refrigerator (24 hr/day)',
    setupAppliances: [
      { id: 'geyser', hoursPerDay: 1, enabled: true },
      { id: 'electric-iron', hoursPerDay: 0, enabled: false },
      { id: 'refrigerator', hoursPerDay: 24, enabled: true },
      { id: 'ceiling-fan', hoursPerDay: 0, enabled: false },
      { id: 'led-bulb', hoursPerDay: 0, enabled: false },
      { id: 'television', hoursPerDay: 0, enabled: false },
    ],
    billingDays: 30,
    tariffRate: 6.0,
    beforeSummary: 'Geyser: 2000 W × 1 h/day × 30 days = 60 kWh (₹360)',
    afterSummary: 'Refrigerator: 200 W × 24 h/day × 30 days = 144 kWh (₹864)',
    expectedDiscovery:
      'The 200 W refrigerator consumes 2.4 times MORE energy (144 kWh vs 60 kWh) and costs 2.4× more than the 2000 W geyser!',
    physicalReason:
      'Energy E = P × t. Even though the geyser has 10× higher power, the refrigerator runs 24× longer. Total energy depends on the product of power and duration.',
  },
  {
    id: 'disc-tariff-scaling',
    title: 'Discovery 2 · How Tariff Rate Affects Your Monthly Bill',
    subtitle: 'See how bill amount scales directly with state electricity regulatory board tariff rates.',
    fixedCondition: 'Entire house setup with 30-day consumption fixed at ~273 kWh',
    actionLabel: 'Double Tariff from ₹5/unit to ₹10/unit',
    setupAppliances: [
      { id: 'geyser', hoursPerDay: 1, enabled: true },
      { id: 'electric-iron', hoursPerDay: 0.5, enabled: true },
      { id: 'refrigerator', hoursPerDay: 24, enabled: true },
      { id: 'ceiling-fan', hoursPerDay: 10, enabled: true },
      { id: 'led-bulb', hoursPerDay: 6, enabled: true },
      { id: 'television', hoursPerDay: 4, enabled: true },
    ],
    billingDays: 30,
    tariffRate: 10.0,
    beforeSummary: 'Tariff at ₹5 / unit: 30-day bill for 283.5 units = ₹1,417.50',
    afterSummary: 'Tariff at ₹10 / unit: 30-day bill for 283.5 units = ₹2,835.00',
    expectedDiscovery:
      'Doubling the tariff rate exactly doubles the total electricity bill, while total energy units consumed remain unchanged.',
    physicalReason:
      'Cost = Energy (kWh) × Tariff Rate (₹/kWh). Financial cost is directly proportional to tariff rate for a fixed energy consumption.',
  },
  {
    id: 'disc-joules-conversion',
    title: 'Discovery 3 · The Enormous Scale of the Joule',
    subtitle: 'Why power utilities use kilowatt-hours (kWh) instead of SI Joules.',
    fixedCondition: 'Single 1000 W Electric Iron used 1 hour per day for 30 days',
    actionLabel: 'View Iron 30-day Energy in Joules',
    setupAppliances: [
      { id: 'geyser', hoursPerDay: 0, enabled: false },
      { id: 'electric-iron', hoursPerDay: 1, enabled: true },
      { id: 'refrigerator', hoursPerDay: 0, enabled: false },
      { id: 'ceiling-fan', hoursPerDay: 0, enabled: false },
      { id: 'led-bulb', hoursPerDay: 0, enabled: false },
      { id: 'television', hoursPerDay: 0, enabled: false },
    ],
    billingDays: 30,
    tariffRate: 6.0,
    beforeSummary: 'Energy in commercial units: 30 kWh (30 units)',
    afterSummary: 'Energy in SI Joules: 30 × 3,600,000 J = 108,000,000 Joules (108 Megajoules)',
    expectedDiscovery:
      'A modest 30-unit bill represents 108 million Joules of energy. A 300-unit monthly household bill exceeds 1 billion Joules!',
    physicalReason:
      '1 Joule is a very tiny amount of energy (1 Watt for 1 second). Domestic consumption involves thousands of Watts for hundreds of hours, making the kilowatt-hour (1 kWh = 3.6 × 10⁶ J) the practical commercial unit.',
  },
]

/* ------------------------------ Misconceptions ------------------------------ */

export interface BillingMisconception {
  title: string
  badIntuition: string
  correctPhysics: string
  takeaway: string
}

export const BILLING_MISCONCEPTIONS: readonly BillingMisconception[] = [
  {
    title: 'Misconception 1: “The electricity board charges us for electric current or power”',
    badIntuition:
      'People often say “we pay for the current coming into our house” or “we pay for the Watts”.',
    correctPhysics:
      'Electric current (Amperes) is the rate of flow of charge, and electric charges are not consumed (every electron that enters through the live wire returns through the neutral wire). Electric power (Watts) is the rate of doing work. What you pay for is electrical ENERGY: E = P × t. The electricity board supplies energy that does work in your appliances.',
    takeaway:
      'You do NOT pay for current or power. You pay for electrical ENERGY (kWh = Kilowatt-Hours).',
  },
  {
    title: 'Misconception 2: “A high-power appliance always costs more than a low-power appliance”',
    badIntuition:
      '“A 2000 W geyser must always contribute more to the monthly bill than a 200 W refrigerator.”',
    correctPhysics:
      'Energy equals power multiplied by time (E = P × t). A 2000 W geyser run for 30 minutes a day consumes 1.0 kWh/day (30 kWh/month). A 200 W refrigerator running 24 hours a day consumes 4.8 kWh/day (144 kWh/month)—nearly FIVE TIMES more energy and cost than the geyser!',
    takeaway:
      'Low-power appliances running continuously (refrigerators, Wi-Fi routers, fans) often dominate domestic bills over high-power appliances used briefly.',
  },
  {
    title: 'Misconception 3: “1 Unit = 1 Watt” or “1 Unit = 1 Kilowatt”',
    badIntuition:
      'Students frequently confuse the commercial unit with a unit of power: “My meter recorded 10 units, so I used 10 kilowatts.”',
    correctPhysics:
      'A Watt and a Kilowatt are units of POWER (energy per second). The commercial “Unit” (Board of Trade Unit) is a unit of ENERGY: 1 Unit = 1 Kilowatt-hour (kWh). It means using energy at the rate of 1000 Watts continuously for 1 full hour (3600 seconds), equivalent to 3,600,000 Joules.',
    takeaway:
      '1 Unit = 1 kWh = 1000 W × 3600 s = 3.6 × 10⁶ Joules. Never confuse power (kW) with energy (kWh).',
  },
]

/* ------------------------------ Worked Examples ------------------------------ */

export interface BillingWorkedExample {
  id: string
  title: string
  context: string
  given: Record<string, string>
  steps: readonly { step: string; formula: string; calc: string; result: string }[]
  finalAnswer: string
  setupAppliances?: { id: string; hoursPerDay: number; enabled: boolean }[]
  billingDays?: number
  tariffRate?: number
}

export const BILLING_WORKED_EXAMPLES: readonly BillingWorkedExample[] = [
  {
    id: 'we-ncert-refrigerator-12-12',
    title: 'Worked Example 1 · NCERT Example 12.12 (Electric Refrigerator Bill)',
    context:
      'An electric refrigerator rated 400 W operates 8 hours/day. What is the cost of the energy to operate it for 30 days at ₹ 3.00 per kW h?',
    given: {
      'Power rating': 'P = 400 W',
      'Daily usage': 't = 8 hours/day',
      'Time period': '30 days',
      'Tariff rate': '₹ 3.00 per kWh',
    },
    steps: [
      {
        step: '1. Calculate total energy consumed in 30 days',
        formula: 'E = P × t × days / 1000',
        calc: '400 W × 8 h/day × 30 days = 96,000 W·h',
        result: '96 kWh (96 units)',
      },
      {
        step: '2. Convert to commercial units',
        formula: '1 kWh = 1 Unit',
        calc: '96,000 W·h / 1000',
        result: '96 kWh',
      },
      {
        step: '3. Calculate total cost',
        formula: 'Cost = Total Energy (kWh) × Tariff Rate',
        calc: '96 kWh × ₹ 3.00 / kWh',
        result: '₹ 288.00',
      },
    ],
    finalAnswer:
      'The total energy consumed is 96 kWh (96 units) and the cost to operate the refrigerator for 30 days is ₹ 288.00.',
    setupAppliances: [
      { id: 'geyser', hoursPerDay: 0, enabled: false },
      { id: 'electric-iron', hoursPerDay: 0, enabled: false },
      { id: 'refrigerator', hoursPerDay: 8, enabled: true },
      { id: 'ceiling-fan', hoursPerDay: 0, enabled: false },
      { id: 'led-bulb', hoursPerDay: 0, enabled: false },
      { id: 'television', hoursPerDay: 0, enabled: false },
    ],
    billingDays: 30,
    tariffRate: 3.0,
  },
  {
    id: 'we-multi-appliance-household',
    title: 'Worked Example 2 · Multi-Appliance Monthly Domestic Bill',
    context:
      'In a household, two 60 W bulbs are operated for 4 hours/day, three 75 W fans are operated for 10 hours/day, and a 1000 W electric heater is operated for 2 hours/day. Find the total energy consumed in the month of June (30 days) and the total electricity bill at ₹ 6.50 per unit.',
    given: {
      'Bulbs (2)': '2 × 60 W = 120 W, 4 h/day',
      'Fans (3)': '3 × 75 W = 225 W, 10 h/day',
      'Heater (1)': '1 × 1000 W = 1000 W, 2 h/day',
      'Period & Rate': '30 days (June), ₹ 6.50 / kWh',
    },
    steps: [
      {
        step: '1. Calculate daily energy for bulbs',
        formula: 'E_bulbs = (2 × 60 W × 4 h) / 1000',
        calc: '480 Wh / 1000',
        result: '0.48 kWh/day',
      },
      {
        step: '2. Calculate daily energy for fans',
        formula: 'E_fans = (3 × 75 W × 10 h) / 1000',
        calc: '2,250 Wh / 1000',
        result: '2.25 kWh/day',
      },
      {
        step: '3. Calculate daily energy for heater',
        formula: 'E_heater = (1000 W × 2 h) / 1000',
        calc: '2,000 Wh / 1000',
        result: '2.00 kWh/day',
      },
      {
        step: '4. Sum total daily energy',
        formula: 'E_daily = 0.48 + 2.25 + 2.00',
        calc: '0.48 + 2.25 + 2.00',
        result: '4.73 kWh/day',
      },
      {
        step: '5. Total monthly energy for 30 days',
        formula: 'E_total = 4.73 kWh/day × 30 days',
        calc: '4.73 × 30',
        result: '141.9 kWh (141.9 units)',
      },
      {
        step: '6. Calculate total bill at ₹ 6.50/unit',
        formula: 'Cost = 141.9 kWh × ₹ 6.50',
        calc: '141.9 × 6.50',
        result: '₹ 922.35',
      },
    ],
    finalAnswer:
      'Total energy consumed is 141.9 units (141.9 kWh) and the total monthly bill is ₹ 922.35.',
  },
]

/* ------------------------------ Practice Questions ------------------------------ */

export interface BillingPracticeQuestion {
  id: BillingQuestionId
  title: string
  difficulty: 'Foundation' | 'Developing' | 'Board Standard' | 'Challenge'
  prompt: string
  options: readonly string[]
  correctIndex: number
  hint: string
  trapExplanation: string
  solutionSteps: readonly string[]
  setupAppliances?: { id: string; hoursPerDay: number; enabled: boolean }[]
  billingDays?: number
  tariffRate?: number
}

export const BILLING_PRACTICE_QUESTIONS: readonly BillingPracticeQuestion[] = [
  {
    id: 'bill-q1',
    title: 'Question 1 · Commercial Unit to Joules Conversion',
    difficulty: 'Foundation',
    prompt:
      'An electricity consumer uses 5 units of electrical energy on a Sunday. How many Joules of energy does this correspond to?',
    options: ['1.8 × 10⁷ J', '1.8 × 10⁴ J', '5 × 10³ J', '3.6 × 10⁶ J'],
    correctIndex: 0,
    hint: '1 unit = 1 kWh = 3.6 × 10⁶ J. Multiply 5 units by 3.6 × 10⁶.',
    trapExplanation:
      'Do not confuse 1 kW (1000 W) with 1 kWh (3,600,000 J). 5 × 3,600,000 = 18,000,000 J = 1.8 × 10⁷ J.',
    solutionSteps: [
      '1 commercial unit = 1 kWh = 1000 W × 3600 s = 3.6 × 10⁶ J',
      'For 5 units: Energy = 5 × 3.6 × 10⁶ J',
      'Energy = 18.0 × 10⁶ J = 1.8 × 10⁷ Joules',
    ],
  },
  {
    id: 'bill-q2',
    title: 'Question 2 · Single Appliance Energy & Cost',
    difficulty: 'Foundation',
    prompt:
      'An electric toaster of power 1200 W is operated for 30 minutes (0.5 hour) every morning. Calculate the electrical energy consumed by the toaster in 30 days in kWh.',
    options: ['18 kWh', '36 kWh', '600 kWh', '1.8 kWh'],
    correctIndex: 0,
    hint: 'Energy (kWh) = (Power in Watts × Hours/day × Days) / 1000.',
    trapExplanation:
      'Ensure duration is converted to hours! 30 minutes = 0.5 hours. 1200 W × 0.5 h × 30 days / 1000 = 18 kWh.',
    solutionSteps: [
      'Given: P = 1200 W, t = 0.5 h/day, days = 30',
      'Formula: E = (P × t × days) / 1000',
      'Calculation: E = (1200 × 0.5 × 30) / 1000 = 18,000 / 1000 = 18 kWh',
    ],
  },
  {
    id: 'bill-q3',
    title: 'Question 3 · Comparing Two Different Appliances',
    difficulty: 'Developing',
    prompt:
      'Which uses more energy: a 250 W TV set in 1 hour, or a 1200 W toaster in 10 minutes?',
    options: [
      'The TV set uses more energy (250 Wh vs 200 Wh for the toaster).',
      'The toaster uses more energy (1200 Wh vs 250 Wh).',
      'Both use the exact same energy.',
      'The toaster uses 6 times more energy because of its wattage rating.',
    ],
    correctIndex: 0,
    hint: 'Compute E = P × t for each in Watt-hours (Wh). 10 minutes = 10/60 hour = 1/6 hour.',
    trapExplanation:
      'High power alone does not guarantee higher energy consumption! Toaster: 1200 W × (1/6) h = 200 Wh. TV: 250 W × 1 h = 250 Wh. The TV uses more energy.',
    solutionSteps: [
      'Energy used by TV: E_TV = 250 W × 1 h = 250 Wh (0.25 kWh)',
      'Energy used by toaster: 10 min = 10/60 h = 1/6 h',
      'E_toaster = 1200 W × (1/6) h = 200 Wh (0.20 kWh)',
      'Comparing: 250 Wh > 200 Wh. Therefore, the TV uses more energy.',
    ],
    setupAppliances: [
      { id: 'geyser', hoursPerDay: 0, enabled: false },
      { id: 'electric-iron', hoursPerDay: 0.17, enabled: true },
      { id: 'refrigerator', hoursPerDay: 0, enabled: false },
      { id: 'ceiling-fan', hoursPerDay: 0, enabled: false },
      { id: 'led-bulb', hoursPerDay: 0, enabled: false },
      { id: 'television', hoursPerDay: 1, enabled: true },
    ],
    billingDays: 1,
    tariffRate: 6.0,
  },
  {
    id: 'bill-q4',
    title: 'Question 4 · CBSE Board Standard Monthly Bill',
    difficulty: 'Board Standard',
    prompt:
      'A domestic consumer uses four 40 W tube lights for 5 hours/day, two 100 W fans for 10 hours/day, and a 1000 W geyser for 1 hour/day. Calculate the total bill for 30 days at ₹ 5.00 per unit.',
    options: ['₹ 570.00', '₹ 114.00', '₹ 850.00', '₹ 450.00'],
    correctIndex: 0,
    hint: 'Sum daily energy: Tube lights (4 × 40 × 5) + Fans (2 × 100 × 10) + Geyser (1 × 1000 × 1). Then multiply by 30 days and ₹ 5/unit.',
    trapExplanation:
      'Remember to include the quantity of each device (4 tubes, 2 fans)! Total daily Wh = 800 + 2000 + 1000 = 3800 Wh = 3.8 kWh.',
    solutionSteps: [
      'Daily energy of 4 tube lights = 4 × 40 W × 5 h = 800 Wh',
      'Daily energy of 2 fans = 2 × 100 W × 10 h = 2000 Wh',
      'Daily energy of 1 geyser = 1 × 1000 W × 1 h = 1000 Wh',
      'Total daily energy = 800 + 2000 + 1000 = 3800 Wh = 3.8 kWh/day',
      'Total energy for 30 days = 3.8 × 30 = 114 kWh (114 units)',
      'Total cost = 114 units × ₹ 5.00 = ₹ 570.00',
    ],
    setupAppliances: [
      { id: 'geyser', hoursPerDay: 1, enabled: true },
      { id: 'electric-iron', hoursPerDay: 0, enabled: false },
      { id: 'refrigerator', hoursPerDay: 0, enabled: false },
      { id: 'ceiling-fan', hoursPerDay: 10, enabled: true },
      { id: 'led-bulb', hoursPerDay: 5, enabled: true },
      { id: 'television', hoursPerDay: 0, enabled: false },
    ],
    billingDays: 30,
    tariffRate: 5.0,
  },
  {
    id: 'bill-q5',
    title: 'Question 5 · Reversing Cost to Find Operating Hours',
    difficulty: 'Board Standard',
    prompt:
      'A 500 W room heater operates on a 220 V supply. The cost of running it for 30 days at ₹ 6.00 per unit is ₹ 360.00. For how many hours was the heater operated each day?',
    options: ['4 hours/day', '2 hours/day', '6 hours/day', '8 hours/day'],
    correctIndex: 0,
    hint: 'Work backward: Total energy = Cost / Tariff = ₹360 / ₹6 = 60 units (kWh). Daily energy = 60 / 30 = 2 kWh/day.',
    trapExplanation:
      'Do not divide 500 W directly by voltage. Energy E = P × t. 2 kWh/day = 2000 Wh/day. t = 2000 Wh / 500 W = 4 hours/day.',
    solutionSteps: [
      'Step 1: Calculate total energy from cost: E_total = Cost / Tariff = ₹ 360 / ₹ 6.00 = 60 kWh',
      'Step 2: Daily energy consumed: E_daily = 60 kWh / 30 days = 2.0 kWh/day = 2000 Wh/day',
      'Step 3: Solve for daily hours: t = E_daily / Power = 2000 Wh / 500 W = 4 hours/day',
    ],
  },
  {
    id: 'bill-q6',
    title: 'Question 6 · Energy Audit & Efficiency Challenge',
    difficulty: 'Challenge',
    prompt:
      'A school hostel replaces ten 100 W incandescent lamps with ten 10 W LED bulbs. All 10 lamps run for 6 hours every night. How much money is saved over a 60-day billing cycle if the tariff is ₹ 7.50 per unit?',
    options: ['₹ 2,430.00', '₹ 2,700.00', '₹ 270.00', '₹ 4,860.00'],
    correctIndex: 0,
    hint: 'Power saved per lamp = 100 W - 10 W = 90 W. Total power saved for 10 lamps = 900 W.',
    trapExplanation:
      'Compute the difference directly or calculate both bills. 900 W × 6 h/day × 60 days / 1000 = 324 kWh saved. 324 × ₹7.50 = ₹2,430.00.',
    solutionSteps: [
      'Power saved per bulb = 100 W - 10 W = 90 W',
      'Total power saved for 10 bulbs = 10 × 90 W = 900 W (0.9 kW)',
      'Daily energy saved = 0.9 kW × 6 h/day = 5.4 kWh/day',
      'Total energy saved in 60 days = 5.4 kWh/day × 60 days = 324 kWh (324 units)',
      'Total monetary savings = 324 units × ₹ 7.50 = ₹ 2,430.00',
    ],
  },
]

/* ------------------------------ Practice Answer Helpers ------------------------------ */

export interface BillingPracticeAnswer {
  selectedOption: number | null
  checked: boolean
  showHint: boolean
  showTrap: boolean
  showSolution: boolean
}

export const EMPTY_BILLING_ANSWER: BillingPracticeAnswer = {
  selectedOption: null,
  checked: false,
  showHint: false,
  showTrap: false,
  showSolution: false,
}

export function evaluateBillingPracticeAnswer(
  q: BillingPracticeQuestion,
  ans: BillingPracticeAnswer
): { status: 'unanswered' | 'correct' | 'incorrect'; feedback: string } {
  if (ans.selectedOption === null) {
    return { status: 'unanswered', feedback: 'Select an option to check your answer.' }
  }
  if (ans.selectedOption === q.correctIndex) {
    return {
      status: 'correct',
      feedback: `Correct! ${q.solutionSteps[q.solutionSteps.length - 1]}`,
    }
  }
  return {
    status: 'incorrect',
    feedback: `Not quite. Review the hint or trap: ${q.trapExplanation}`,
  }
}

/* ------------------------------ Experiment State Helpers ------------------------------ */

export interface BillingExperimentState {
  household: HouseholdBillingInput
  selectedQuestionId: BillingQuestionId
}

export function createInitialBillingState(): BillingExperimentState {
  return {
    household: {
      appliances: STANDARD_APPLIANCES.map((app) => ({
        id: app.id,
        name: app.name,
        powerW: app.defaultPowerW,
        hoursPerDay: app.defaultHoursPerDay,
        quantity: app.defaultQuantity,
        enabled: true,
      })),
      billingDays: 30,
      tariffRateRupeesPerKWh: 6.0,
    },
    selectedQuestionId: 'bill-q1',
  }
}

export function loadBillingSetup(
  state: BillingExperimentState,
  setup: {
    setupAppliances?: { id: string; hoursPerDay: number; enabled: boolean }[]
    billingDays?: number
    tariffRate?: number
  }
): BillingExperimentState {
  const updatedAppliances = state.household.appliances.map((app) => {
    if (!setup.setupAppliances) return app
    const match = setup.setupAppliances.find((s) => s.id === app.id)
    if (match) {
      return {
        ...app,
        hoursPerDay: match.hoursPerDay,
        enabled: match.enabled,
      }
    }
    return app
  })

  return {
    ...state,
    household: {
      appliances: updatedAppliances,
      billingDays: setup.billingDays ?? state.household.billingDays,
      tariffRateRupeesPerKWh: setup.tariffRate ?? state.household.tariffRateRupeesPerKWh,
    },
  }
}
