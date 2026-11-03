import { describe, expect, it } from 'vitest'
import {
  SAFETY_DISCOVERIES,
  SAFETY_MISCONCEPTIONS,
  SAFETY_PRACTICE_QUESTIONS,
  SAFETY_WORKED_EXAMPLES,
  getInitialCircuitInput,
} from './safetyContent'
import { simulateDomesticCircuit } from './safetyModel'
import { parseFuseRating, validateFormDraft } from './safetyInputValidation'
import { DEFAULT_APPLIANCES } from './safetyLimits'

describe('safetyContent — Guided Discoveries & Concept Validity', () => {
  it('has 3 guided discoveries matching core pedagogical themes', () => {
    expect(SAFETY_DISCOVERIES.length).toBe(3)
    const [disc1, disc2, disc3] = SAFETY_DISCOVERIES

    expect(disc1.id).toBe('disc-1')
    expect(disc1.title).toContain('Overloading')
    expect(disc2.id).toBe('disc-2')
    expect(disc2.title).toContain('Short Circuit')
    expect(disc3.id).toBe('disc-3')
    expect(disc3.title).toContain('Earthing')
  })

  it('verifies Discovery 1 preset produces overload and trips fuse', () => {
    const disc1 = SAFETY_DISCOVERIES[0]
    const appliances = DEFAULT_APPLIANCES.map((app) => ({
      ...app,
      enabled: !!disc1.preset.appliances[app.id],
    }))

    const result = simulateDomesticCircuit({
      appliances,
      fuseRatingA: disc1.preset.fuseRatingA,
      faultMode: disc1.preset.faultMode,
      earthingConnected: disc1.preset.earthingConnected,
      userTouchingChassis: disc1.preset.userTouchingChassis,
    })

    expect(result.fuseStatus).toBe('BLOWN')
    expect(result.fuseTripReason).toBe('OVERLOAD')
  })

  it('verifies Discovery 2 preset creates a short circuit and blows fuse', () => {
    const disc2 = SAFETY_DISCOVERIES[1]
    const appliances = DEFAULT_APPLIANCES.map((app) => ({
      ...app,
      enabled: !!disc2.preset.appliances[app.id],
    }))

    const result = simulateDomesticCircuit({
      appliances,
      fuseRatingA: disc2.preset.fuseRatingA,
      faultMode: disc2.preset.faultMode,
      earthingConnected: disc2.preset.earthingConnected,
      userTouchingChassis: disc2.preset.userTouchingChassis,
    })

    expect(result.fuseStatus).toBe('BLOWN')
    expect(result.fuseTripReason).toBe('SHORT_CIRCUIT')
    expect(result.isShortCircuited).toBe(true)
  })

  it('verifies Discovery 3 ungrounded preset creates shock hazard without blowing fuse', () => {
    const disc3 = SAFETY_DISCOVERIES[2]
    const appliances = DEFAULT_APPLIANCES.map((app) => ({
      ...app,
      enabled: !!disc3.preset.appliances[app.id],
    }))

    const result = simulateDomesticCircuit({
      appliances,
      fuseRatingA: disc3.preset.fuseRatingA,
      faultMode: disc3.preset.faultMode,
      earthingConnected: disc3.preset.earthingConnected,
      userTouchingChassis: disc3.preset.userTouchingChassis,
    })

    expect(result.fuseStatus).toBe('INTACT')
    expect(result.chassisVoltageV).toBe(220)
    expect(result.shockRiskLevel).toBe('LETHAL')
    expect(result.humanShockCurrentA).toBeCloseTo(0.22, 2)
  })

  it('contains comprehensive debunking of standard NCERT misconceptions', () => {
    expect(SAFETY_MISCONCEPTIONS.length).toBe(3)
    const [m1, m2, m3] = SAFETY_MISCONCEPTIONS
    expect(m1.myth).toContain('high melting point')
    expect(m1.reality).toContain('LOW melting point')
    expect(m2.myth).toContain('replace it with a 15 A fuse')
    expect(m2.reality).toContain('Extremely hazardous')
    expect(m3.myth).toContain('saves electricity')
  })

  it('verifies worked examples match NCERT calculations accurately', () => {
    expect(SAFETY_WORKED_EXAMPLES.length).toBe(2)
    const [ex1, ex2] = SAFETY_WORKED_EXAMPLES

    // Ex 1: 1 kW iron on 220 V
    expect(ex1.conclusion).toContain('5 A fuse must be used')
    expect(ex1.steps[0].result).toContain('4.55')

    // Ex 2: 2 kW heater on 5 A circuit
    expect(ex2.conclusion).toContain('No, the 2 kW electric heater cannot be operated')
    expect(ex2.steps[0].result).toContain('9.09 A')
  })

  it('includes 6 levels in practice questions ladder', () => {
    expect(SAFETY_PRACTICE_QUESTIONS.length).toBe(6)
    const levels = SAFETY_PRACTICE_QUESTIONS.map((q) => q.level)
    expect(levels).toEqual([
      'Foundation',
      'Foundation',
      'Standard',
      'Advanced',
      'Exemplar',
      'Challenge',
    ])

    // Verify all practice questions have exactly one correct answer
    SAFETY_PRACTICE_QUESTIONS.forEach((q) => {
      const correctCount = q.options.filter((o) => o.correct).length
      expect(correctCount).toBe(1)
      expect(q.solutionSteps.length).toBeGreaterThan(0)
    })
  })

  it('verifies input validation and draft parsing', () => {
    expect(parseFuseRating('5').value).toBe(5)
    expect(parseFuseRating('15').value).toBe(15)
    expect(parseFuseRating('25').error).toBeDefined()

    const validDraft = {
      fuseRatingA: '5',
      faultMode: 'none' as const,
      earthingConnected: true,
      userTouchingChassis: false,
      applianceStates: {},
    }
    expect(validateFormDraft(validDraft).fuseRatingError).toBeUndefined()

    const invalidDraft = {
      ...validDraft,
      fuseRatingA: '99',
    }
    expect(validateFormDraft(invalidDraft).fuseRatingError).toBeDefined()
  })

  it('initializes default domestic circuit correctly', () => {
    const initialInput = getInitialCircuitInput()
    expect(initialInput.fuseRatingA).toBe(5)
    expect(initialInput.earthingConnected).toBe(true)
    expect(initialInput.faultMode).toBe('none')

    const initialResult = simulateDomesticCircuit(initialInput)
    expect(initialResult.fuseStatus).toBe('INTACT')
    expect(initialResult.totalActivePowerW).toBeGreaterThan(0)
  })
})
