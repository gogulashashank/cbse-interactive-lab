import { DEFAULT_APPLIANCES, type FuseRating } from './safetyLimits'
import type { DomesticCircuitInput } from './safetyModel'

export interface PredictionItem {
  id: string
  prompt: string
  options: { id: string; label: string; isCorrect: boolean; explanation: string }[]
  testedInBench: string
}

export interface GuidedDiscovery {
  id: string
  title: string
  objective: string
  preset: {
    fuseRatingA: FuseRating
    appliances: Record<string, boolean>
    faultMode: 'none' | 'short_circuit' | 'chassis_leakage'
    earthingConnected: boolean
    userTouchingChassis: boolean
  }
  question: string
  options: { id: string; text: string; correct: boolean; feedback: string }[]
  keyTakeaway: string
}

export interface MisconceptionItem {
  id: string
  myth: string
  reality: string
  explanation: string
  ncertReference: string
}

export interface WorkedExample {
  id: string
  title: string
  problemStatement: string
  givenData: { label: string; value: string }[]
  steps: { stepTitle: string; formula: string; calculation: string; result: string }[]
  conclusion: string
  ncertProblemRef: string
}

export interface PracticeQuestion {
  id: string
  level: 'Foundation' | 'Standard' | 'Advanced' | 'Exemplar' | 'Challenge' | 'Board-Special'
  title: string
  question: string
  options: { id: string; text: string; correct: boolean }[]
  hint: string
  commonTrap: string
  solutionSteps: string[]
}

export const SAFETY_PREDICTIONS: readonly PredictionItem[] = [
  {
    id: 'pred-1',
    prompt:
      'In a domestic household circuit supplied at 220 V, what happens to the total current drawn from the mains when you switch ON more appliances simultaneously?',
    options: [
      {
        id: 'opt-a',
        label: 'Current stays constant because voltage is fixed at 220 V.',
        isCorrect: false,
        explanation: 'Incorrect. While voltage is fixed, each parallel branch draws its own current I = P/V, so total current increases.',
      },
      {
        id: 'opt-b',
        label: 'Total current increases linearly with each additional appliance (I_total = sum of branch currents).',
        isCorrect: true,
        explanation: 'Correct! In parallel, each appliance operates at full 220 V independently. The total current entering from the main line is the sum of all individual branch currents.',
      },
      {
        id: 'opt-c',
        label: 'Total current decreases because total resistance increases.',
        isCorrect: false,
        explanation: 'Incorrect. In parallel, adding more resistors actually decreases the equivalent resistance (1/R_eq = sum(1/R_i)), causing total current to increase.',
      },
    ],
    testedInBench: 'Toggle on the Geyser (2000 W) and Iron (1000 W) in the interactive circuit bench and watch the main line ammeter.',
  },
  {
    id: 'pred-2',
    prompt:
      'What is the primary physical function of a safety fuse wire placed in the Live wire of a domestic installation?',
    options: [
      {
        id: 'opt-a',
        label: 'To increase the voltage when high-power appliances are switched on.',
        isCorrect: false,
        explanation: 'Incorrect. Fuses do not step up voltage; they are series safety elements that melt under excessive current.',
      },
      {
        id: 'opt-b',
        label: 'To melt via Joule heating when current exceeds its rating, breaking the circuit before wires catch fire.',
        isCorrect: true,
        explanation: 'Correct! The fuse element is made of an alloy with a specific low melting point. Excessive current generates heat H = I^2 R t, melting the wire and isolating the circuit.',
      },
      {
        id: 'opt-c',
        label: 'To absorb leakage current and redirect it into the earth plate.',
        isCorrect: false,
        explanation: 'Incorrect. Draining leakage current to the ground is the function of the Earth wire, not the fuse.',
      },
    ],
    testedInBench: 'Select a 5 A fuse and turn on both the Iron (1000 W) and Geyser (2000 W). Watch the fuse cartridge wire melt.',
  },
  {
    id: 'pred-3',
    prompt:
      'Why is the metallic body of heavy electrical appliances (like an electric iron or refrigerator) connected to the Earth wire?',
    options: [
      {
        id: 'opt-a',
        label: 'To reduce electricity consumption and lower the monthly power bill.',
        isCorrect: false,
        explanation: 'Incorrect. Earthing does not alter the power rating or energy consumed by the appliance during normal use.',
      },
      {
        id: 'opt-b',
        label: 'To provide a low-resistance path to ground, so fault current safely blows the fuse rather than electrocuting a user.',
        isCorrect: true,
        explanation: 'Correct! If live insulation chafes against the metal chassis, earthing keeps the body near 0 V and channels huge fault current to blow the fuse immediately.',
      },
      {
        id: 'opt-c',
        label: 'To balance alternating current cycles between positive and negative half-cycles.',
        isCorrect: false,
        explanation: 'Incorrect. AC cycle alternation is governed by the generator at the power station; earth is a 0 V ground reference.',
      },
    ],
    testedInBench: 'Enable "Insulation Leakage Fault", toggle Earth wire ON vs OFF, and touch the chassis in the simulation.',
  },
]

export const SAFETY_DISCOVERIES: readonly GuidedDiscovery[] = [
  {
    id: 'disc-1',
    title: 'Discovery 1: Overloading the 5 A Lighting Circuit',
    objective:
      'Demonstrate how simultaneous operation of high-power appliances causes overloading and trips the fuse.',
    preset: {
      fuseRatingA: 5,
      appliances: {
        bulb: true,
        fan: true,
        tv: false,
        refrigerator: true,
        iron: true,
        geyser: false,
      },
      faultMode: 'none',
      earthingConnected: true,
      userTouchingChassis: false,
    },
    question:
      'With a 5 A fuse installed, turning on the Bulb (60 W), Fan (75 W), Refrigerator (250 W), and Iron (1000 W) yields a total power of 1385 W. Why does the fuse wire melt?',
    options: [
      {
        id: 'd1-a',
        text: 'The total current drawn is I = 1385 W / 220 V ≈ 6.30 A, which exceeds the 5 A rated capacity.',
        correct: true,
        feedback:
          'Exactly! At 6.30 A, Joule heating in the fuse alloy wire exceeds its melting threshold, safely severing the circuit.',
      },
      {
        id: 'd1-b',
        text: 'The voltage drops to zero immediately whenever an iron is switched on.',
        correct: false,
        feedback:
          'Incorrect. The domestic mains voltage remains at 220 V; it is the current demand that exceeds the fuse limit.',
      },
      {
        id: 'd1-c',
        text: 'The refrigerator compressor creates a reverse magnetic field that blows the fuse.',
        correct: false,
        feedback: 'Incorrect. The tripping is purely thermal due to excessive resistive Joule heating ($I^2 R t$).',
      },
    ],
    keyTakeaway:
      'Overloading occurs when too many appliances draw current at the same time, causing total current to exceed the safe carrying capacity of the circuit wiring and fuse.',
  },
  {
    id: 'disc-2',
    title: 'Discovery 2: Short Circuit Current Spike',
    objective:
      'Observe what happens when Live wire touches Neutral wire directly without load resistance.',
    preset: {
      fuseRatingA: 15,
      appliances: {
        bulb: false,
        fan: false,
        tv: false,
        refrigerator: false,
        iron: false,
        geyser: false,
      },
      faultMode: 'short_circuit',
      earthingConnected: true,
      userTouchingChassis: false,
    },
    question:
      'When the Live wire directly contacts the Neutral wire (short circuit), why does the current surge to hundreds of amperes?',
    options: [
      {
        id: 'd2-a',
        text: 'The resistance of the circuit drops to near zero ($R \\to 0$), so by Ohm\'s law $I = V / R$ shoots up violently.',
        correct: true,
        feedback:
          'Spot on! Bypassing all appliance loads leaves only the minimal wire resistance (fraction of an ohm), creating an immense current spike that instantly blows the fuse.',
      },
      {
        id: 'd2-b',
        text: 'The power plant pumps extra voltage into the house during an accidental touch.',
        correct: false,
        feedback: 'Incorrect. The supply voltage stays 220 V; current surges because circuit resistance plummets.',
      },
      {
        id: 'd2-c',
        text: 'The neutral wire generates electrical charges on its own.',
        correct: false,
        feedback: 'Incorrect. The neutral wire simply completes the return path at 0 V potential.',
      },
    ],
    keyTakeaway:
      'A short circuit is an unintended zero-resistance path between Live and Neutral. Without load resistance, current spikes immediately, creating intense sparks and fire hazard if not stopped by a fuse.',
  },
  {
    id: 'disc-3',
    title: 'Discovery 3: The Lifesaving Role of Earthing',
    objective:
      'Contrast what happens to a human touching a faulted appliance with vs. without an Earth wire connection.',
    preset: {
      fuseRatingA: 15,
      appliances: {
        bulb: false,
        fan: false,
        tv: false,
        refrigerator: false,
        iron: true,
        geyser: false,
      },
      faultMode: 'chassis_leakage',
      earthingConnected: false,
      userTouchingChassis: true,
    },
    question:
      'When insulation fails and Live touches the metal casing WITHOUT earthing, why does a human get a lethal shock while the 15 A fuse remains intact?',
    options: [
      {
        id: 'd3-a',
        text: 'Human body current is 220 V / 1000 Ω = 0.22 A (220 mA). This is fatal to humans (>50 mA), but far below the 15 A fuse threshold, so the fuse never trips!',
        correct: true,
        feedback:
          'Brilliant insight! Fuses protect wires from overloading (amperes), but a mere fraction of an ampere (0.22 A) can stop a human heart. Earthing is essential because it draws a huge surge (~220 A) that actually blows the fuse!',
      },
      {
        id: 'd3-b',
        text: 'The human body has zero electrical resistance, causing fuse electrons to freeze.',
        correct: false,
        feedback: 'Incorrect. Human body resistance is around 1000 - 1500 ohms, limiting current to 220 mA.',
      },
      {
        id: 'd3-c',
        text: 'The 15 A fuse is defective and only responds to direct lightning strikes.',
        correct: false,
        feedback: 'Incorrect. The fuse is working as rated; 0.22 A is simply 1.5% of its 15 A trip threshold.',
      },
    ],
    keyTakeaway:
      'Earthing keeps appliance casings at 0 V. When a live fault occurs, earthing provides an ultra-low resistance path (~1 Ω), drawing >200 A which blows the fuse instantly and protects human life.',
  },
]

export const SAFETY_MISCONCEPTIONS: readonly MisconceptionItem[] = [
  {
    id: 'misc-1',
    myth: 'A fuse wire should have high resistance and a very high melting point so it does not blow frequently.',
    reality:
      'A fuse wire MUST have high resistivity to generate heat quickly, but a LOW melting point so it melts before copper wires or appliances get damaged.',
    explanation:
      'If the fuse wire had a high melting point (like tungsten in a bulb), it would remain intact while household copper wiring got red hot and set the building on fire! An ideal fuse alloy (lead-tin or coated copper) has high resistivity to concentrate Joule heating ($H = I^2 R t$) in the cartridge and melts cleanly when current exceeds its rated limit.',
    ncertReference: 'NCERT Class 10 Science, Section 12.7 / 13.5: Electric Fuse',
  },
  {
    id: 'misc-2',
    myth: 'If a 5 A fuse blows repeatedly in a room, you can safely replace it with a 15 A fuse or thick copper wire to stop it from blowing.',
    reality:
      'Extremely hazardous! Using a 15 A fuse on 5 A rated wiring removes overload protection and creates an immediate house fire risk.',
    explanation:
      'Domestic circuits use two separate wiring circuits: a 5 A circuit with thinner copper wires for low-power loads (bulbs, fans, TV), and a 15 A circuit with thick copper wires for high-power heating loads (geyser, AC, room heater). If you put a 15 A fuse in a 5 A line, 10-14 A could flow without tripping the fuse. The thin wires will overheat, melt their PVC insulation, and ignite walls or ceilings.',
    ncertReference: 'NCERT Class 10 Science, Section 13.5: Domestic Electric Circuits - Overloading',
  },
  {
    id: 'misc-3',
    myth: 'Connecting an appliance to the Earth wire saves electricity and reduces your monthly electricity bill.',
    reality:
      'Earthing is strictly a personal safety mechanism to prevent fatal electric shocks; it draws zero power during normal operation.',
    explanation:
      'Under normal conditions, current circulates only between the Live wire (220 V) and Neutral wire (0 V). The Earth wire carries zero current during regular operation. It only conducts current in the rare event of a dangerous insulation fault where the live wire touches the metal casing, diverting the hazard safely into the ground.',
    ncertReference: 'NCERT Class 10 Science, Section 13.5: Earthing of Metallic Appliances',
  },
]

export const SAFETY_WORKED_EXAMPLES: readonly WorkedExample[] = [
  {
    id: 'example-1',
    title: 'NCERT In-Text Example: Fuse Selection for an Electric Iron',
    problemStatement:
      'An electric iron of 1 kW electric power is operated at 220 V. What rating of electric fuse must be used for this circuit?',
    givenData: [
      { label: 'Power rating of electric iron (P)', value: '1 kW = 1000 W' },
      { label: 'Domestic supply voltage (V)', value: '220 V AC' },
    ],
    steps: [
      {
        stepTitle: 'Step 1: Formula for current drawn in terms of P and V',
        formula: 'P = V \\times I \\implies I = \\frac{P}{V}',
        calculation: 'I = \\frac{1000\\text{ W}}{220\\text{ V}}',
        result: 'I = 4.545\\text{ A} \\approx 4.55\\text{ A}',
      },
      {
        stepTitle: 'Step 2: Select the next standard commercial fuse rating',
        formula: 'I_{\\text{fuse}} > I_{\\text{operating}}',
        calculation: 'Standard commercial ratings: 1 A, 2 A, 3 A, 5 A, 10 A, 15 A. 4.55 A < 5 A',
        result: 'A 5 A fuse rating must be used.',
      },
    ],
    conclusion:
      'Since the electric iron draws 4.55 A under normal operation, a 5 A fuse must be used. A 4 A or 3 A fuse would blow during normal use, while a 15 A fuse would offer insufficient overload protection.',
    ncertProblemRef: 'NCERT Class 10 Science Chapter 12 / 13 Example 12.12 / In-Text Exercise',
  },
  {
    id: 'example-2',
    title: 'Overloading Calculation: Simultaneous Use of Household Loads',
    problemStatement:
      'A domestic circuit has a 5 A fuse. Can an electric heater of rating 2 kW (2000 W) be operated safely on this circuit at 220 V? Explain with calculation.',
    givenData: [
      { label: 'Fuse rating', value: '5 A' },
      { label: 'Supply voltage (V)', value: '220 V' },
      { label: 'Appliance power (P)', value: '2 kW = 2000 W' },
    ],
    steps: [
      {
        stepTitle: 'Step 1: Calculate normal operating current of heater',
        formula: 'I = \\frac{P}{V}',
        calculation: 'I = \\frac{2000\\text{ W}}{220\\text{ V}} = 9.09\\text{ A}',
        result: 'Current drawn = 9.09 A',
      },
      {
        stepTitle: 'Step 2: Compare with fuse capacity',
        formula: 'I_{\\text{drawn}} \\text{ vs } I_{\\text{fuse}}',
        calculation: '9.09\\text{ A} > 5.0\\text{ A}',
        result: 'Overload factor = 9.09 / 5 = 1.82x rated capacity',
      },
    ],
    conclusion:
      'No, the 2 kW electric heater cannot be operated on this 5 A circuit. The 9.09 A current will cause severe overheating and immediately melt the 5 A fuse wire, interrupting the circuit. High power appliances like 2 kW heaters must be connected to a dedicated 15 A power circuit.',
    ncertProblemRef: 'NCERT Class 10 Science Chapter 13 End-of-Chapter Question 16',
  },
]

export const SAFETY_PRACTICE_QUESTIONS: readonly PracticeQuestion[] = [
  {
    id: 'q-1',
    level: 'Foundation',
    title: 'Q1: Voltage and Frequency of Indian Domestic Supply',
    question:
      'What are the standard potential difference (RMS voltage) and frequency of the alternating current supplied to Indian households?',
    options: [
      { id: 'q1-a', text: '110 V at 60 Hz', correct: false },
      { id: 'q1-b', text: '220 V at 50 Hz', correct: true },
      { id: 'q1-c', text: '440 V at 50 Hz', correct: false },
      { id: 'q1-d', text: '220 V direct current (DC)', correct: false },
    ],
    hint: 'India uses the 220 V / 50 Hz single-phase AC standard, whereas North America uses 120 V / 60 Hz.',
    commonTrap: 'Confusing industrial 3-phase 440 V supply with domestic single-phase 220 V supply.',
    solutionSteps: [
      'In India, electric power is distributed to residential homes as single-phase alternating current.',
      'The nominal RMS potential difference between Live and Neutral is 220 V.',
      'The alternating frequency is 50 Hz (cycles per second), meaning the current reverses direction 100 times every second.',
    ],
  },
  {
    id: 'q-2',
    level: 'Foundation',
    title: 'Q2: Colour Coding of Domestic Wiring',
    question:
      'According to the standard colour code convention for domestic electrical wiring in India, what colours are used for Live, Neutral, and Earth wires?',
    options: [
      { id: 'q2-a', text: 'Live: Red (or Brown), Neutral: Black (or Blue), Earth: Green (or Green/Yellow)', correct: true },
      { id: 'q2-b', text: 'Live: Green, Neutral: Red, Earth: Black', correct: false },
      { id: 'q2-c', text: 'Live: White, Neutral: Yellow, Earth: Red', correct: false },
      { id: 'q2-d', text: 'Live: Black, Neutral: Red, Earth: Blue', correct: false },
    ],
    hint: 'Red signals caution/danger (hot live wire), Green universally signals safe grounding into the earth.',
    commonTrap: 'Swapping Live and Neutral colors or confusing old UK vs. new international codes.',
    solutionSteps: [
      'Live wire (Hot): Red in traditional Indian coding (or Brown in modern international IEC standard). Carries 220 V AC.',
      'Neutral wire (Return): Black in traditional coding (or Light Blue in international standard). Stays at 0 V potential.',
      'Earth wire (Safety ground): Green in traditional coding (or Green with yellow stripes). Connected to earth pit.',
    ],
  },
  {
    id: 'q-3',
    level: 'Standard',
    title: 'Q3: Why Domestic Appliances are Arranged in Parallel',
    question:
      'Why are all electrical appliances in a household connected in parallel rather than in series?',
    options: [
      { id: 'q3-a', text: 'Parallel connection makes the total resistance very large, minimizing current draw.', correct: false },
      { id: 'q3-b', text: 'Each appliance receives the full 220 V mains voltage and can be switched ON/OFF independently without affecting others.', correct: true },
      { id: 'q3-c', text: 'Parallel circuits eliminate the need for a fuse or earth wire entirely.', correct: false },
      { id: 'q3-d', text: 'Series connection would make all bulbs glow with maximum brightness.', correct: false },
    ],
    hint: 'Think about what happens to decorative series fairy lights when a single tiny bulb burns out.',
    commonTrap: 'Assuming series saves electricity because total resistance is higher.',
    solutionSteps: [
      'In parallel, the potential difference across every branch is identical (220 V), allowing each device to operate at its rated power.',
      'If one appliance fails or is switched off, the other parallel branches remain complete and functional.',
      'In series, if one device switches off or fails, the whole circuit breaks and all appliances stop working.',
      'In series, voltage divides ($V_1 + V_2 + \\dots = 220\\text{ V}$), so appliances receive only a fraction of their operating voltage.',
    ],
  },
  {
    id: 'q-4',
    level: 'Advanced',
    title: 'Q4: Calculating Number of Bulbs on a 5 A Fuse',
    question:
      'How many 40 W incandescent lamps can be safely operated simultaneously across a 220 V domestic line protected by a 5 A fuse?',
    options: [
      { id: 'q4-a', text: '12 lamps', correct: false },
      { id: 'q4-b', text: '22 lamps', correct: false },
      { id: 'q4-c', text: '27 lamps', correct: true },
      { id: 'q4-d', text: '55 lamps', correct: false },
    ],
    hint: 'Maximum total power allowed = V * I_fuse = 220 V * 5 A = 1100 W.',
    commonTrap: 'Rounding up instead of down: 27.5 lamps means 28 lamps would draw 1120 W (>1100 W) and blow the fuse!',
    solutionSteps: [
      'Maximum safe power capacity: $P_{\\text{max}} = V \\times I_{\\text{fuse}} = 220\\text{ V} \\times 5\\text{ A} = 1100\\text{ W}$.',
      'Power of each lamp $P = 40\\text{ W}$.',
      'Number of lamps $n = \\frac{P_{\\text{max}}}{P} = \\frac{1100}{40} = 27.5$.',
      'Since you cannot connect half a lamp, the maximum integer number of lamps that can safely run without tripping is 27.',
      '27 lamps draw $27 \\times 40 = 1080\\text{ W}$, yielding $I = 1080 / 220 = 4.91\\text{ A} < 5\\text{ A}$.',
    ],
  },
  {
    id: 'q-5',
    level: 'Exemplar',
    title: 'Q5: Live Wire Contact with Chassis with Broken Earth',
    question:
      'An electric iron (1000 W) has a damaged power cord where the Live wire touches its metal chassis. The wall socket\'s earth pin is broken (disconnected). A person with 1000 Ω body resistance touches the iron while standing barefoot on the moist floor. What current flows through the person, and will the 15 A fuse blow?',
    options: [
      { id: 'q5-a', text: 'Current is 15 A; the fuse will blow immediately.', correct: false },
      { id: 'q5-b', text: 'Current is 0.22 A (220 mA); this lethal current will NOT blow the 15 A fuse!', correct: true },
      { id: 'q5-c', text: 'Zero current flows because human flesh is a perfect insulator.', correct: false },
      { id: 'q5-d', text: 'Current is 4.55 A; the iron soleplate absorbs the shock completely.', correct: false },
    ],
    hint: 'Calculate I_human = V / R_human = 220 V / 1000 Ω. Compare 0.22 A with the 15 A fuse rating.',
    commonTrap: 'Assuming that because a dangerous fault occurs, the fuse automatically blows. Fuses only trip on high current, not human-scale shock current!',
    solutionSteps: [
      'Without an Earth wire, the metal chassis rises to the full Live potential of 220 V.',
      'When the person touches the chassis, current passes through their body to ground: $I_{\\text{human}} = \\frac{V}{R_{\\text{human}}} = \\frac{220\\text{ V}}{1000\\ \\Omega} = 0.22\\text{ A} = 220\\text{ mA}$.',
      'According to physiological safety standards, currents above 50 mA cause ventricular fibrillation and fatal cardiac arrest.',
      'Because 0.22 A is vastly lower than the 15 A fuse rating ($0.22\\text{ A} \\ll 15\\text{ A}$), the fuse does NOT blow, keeping the shock active indefinitely until external disconnection.',
      'This illustrates why a functional third (Earth) pin is mandatory for all metal-clad appliances!',
    ],
  },
  {
    id: 'q-6',
    level: 'Challenge',
    title: 'Q6: Dual Circuit Separation (5 A Lighting vs 15 A Power Circuit)',
    question:
      'In modern house wiring, why are lighting/fans kept on a separate 5 A circuit while heating appliances (geysers, air conditioners) are on a separate 15 A circuit?',
    options: [
      { id: 'q6-a', text: 'To allow thinner (cheaper and more flexible) wires for lighting, while isolating high-draw heating surges so a heater fault doesn\'t leave the whole house in darkness.', correct: true },
      { id: 'q6-b', text: 'Because alternating current cannot flow through lights and heaters on the same meter.', correct: false },
      { id: 'q6-c', text: 'Because 5 A circuits supply 110 V while 15 A circuits supply 440 V.', correct: false },
      { id: 'q6-d', text: 'To prevent fans from spinning backwards when the water heater is switched on.', correct: false },
    ],
    hint: 'Think about both wire thickness (gauge/ampacity) safety and convenience when a fuse trips.',
    commonTrap: 'Thinking that 15 A circuits supply a higher voltage; both circuits operate at the same 220 V!',
    solutionSteps: [
      'Both the 5 A and 15 A circuits operate at the exact same 220 V mains voltage.',
      'Wire thickness (gauge) is chosen to match rated current safely without resistive overheating ($I^2 R$). 5 A wiring uses 1.5 sq mm copper, whereas 15 A wiring uses 4.0 sq mm copper.',
      'Separation prevents a tripping fault in a heavy appliance (e.g. geyser coil breakdown) from plunging all rooms into darkness.',
      'It also prevents users from accidentally overloading thin lighting wiring with high-current heating loads.',
    ],
  },
]

export function getInitialCircuitInput(): DomesticCircuitInput {
  return {
    appliances: DEFAULT_APPLIANCES.map((spec) => ({
      ...spec,
      enabled: spec.defaultEnabled,
    })),
    fuseRatingA: 5,
    earthingConnected: true,
    faultMode: 'none',
    userTouchingChassis: false,
  }
}
