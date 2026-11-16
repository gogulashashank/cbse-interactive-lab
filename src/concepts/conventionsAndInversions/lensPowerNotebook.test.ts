import { describe, expect, it } from 'vitest'
import {
  BENCH_SVG_GEOMETRY,
  calculateLensPowerModel,
  evaluateRulerMeasurement,
  formatSignedValue,
  LENS_POWER_LIMITS,
  validateFocalLengthCmInput,
} from './lensPowerModel'
import {
  computeStageTransition,
  countCompletedPractice,
  evaluateInitialPrediction,
  evaluateLensPowerPractice,
  INITIAL_PREDICTION_OPTIONS,
  INITIAL_PRACTICE_ATTEMPT,
  LENS_POWER_PRACTICE_QUESTIONS,
  PRESET_LENSES,
  type PracticeAttemptState,
  type PracticeQuestionId,
} from './lensPowerContent'

describe('Lens Power Scientific Model & Ray Geometry', () => {
  it('computes P = 1 / f(m) = 100 / f(cm) accurately for converging convex lenses', () => {
    const lensA = calculateLensPowerModel({ focalLengthCm: 20 })
    expect(lensA.focalLengthCm).toBe(20)
    expect(lensA.focalLengthMetres).toBe(0.2)
    expect(lensA.powerDioptres).toBe(5)
    expect(lensA.unconvertedCmTrapPower).toBe(0.05)
    expect(lensA.lensNature).toBe('converging')
    expect(lensA.principalFocusPoint).toEqual({ xCm: 20, yCm: 0, label: 'F₂' })

    const lens25 = calculateLensPowerModel({ focalLengthCm: 25 })
    expect(lens25.focalLengthMetres).toBe(0.25)
    expect(lens25.powerDioptres).toBe(4)
  })

  it('computes negative power and virtual focus F1 for diverging concave lenses', () => {
    const concave = calculateLensPowerModel({ focalLengthCm: -25 })
    expect(concave.focalLengthCm).toBe(-25)
    expect(concave.focalLengthMetres).toBe(-0.25)
    expect(concave.powerDioptres).toBe(-4)
    expect(concave.absPowerDioptres).toBe(4)
    expect(concave.lensNature).toBe('diverging')
    expect(concave.principalFocusPoint).toEqual({ xCm: -25, yCm: 0, label: 'F₁' })
  })

  it('generates parallel incident rays that pass through (+f, 0) for convex and diverge from (-|f|, 0) for concave while staying inside the optical corridor', () => {
    const convex = calculateLensPowerModel({ focalLengthCm: 20 })
    const topRayConvex = convex.parallelRays[0] // y0 = +6 cm
    expect(topRayConvex.incidentStart.yCm).toBe(6)
    expect(topRayConvex.lensHit).toEqual({ xCm: 0, yCm: 6 })
    expect(topRayConvex.backwardExtensionEnd).toBeNull()
    // Slope = -6 / 20 = -0.3. Hits corridor bound y = -7.6 cm at x = ( -7.6 - 6 ) / -0.3 = 45.3333 cm
    expect(topRayConvex.refractedEnd.yCm).toBeCloseTo(-7.6, 4)
    expect(topRayConvex.refractedEnd.xCm).toBeCloseTo(45.3333, 3)

    // Verify central ray (y0 = 0 cm) passes undeviated
    const centralRay = convex.parallelRays[2]
    expect(centralRay.incidentStart.yCm).toBe(0)
    expect(centralRay.refractedEnd).toEqual({ xCm: 52, yCm: 0 })
    expect(centralRay.deflectionAngleDeg).toBe(0)

    const concave = calculateLensPowerModel({ focalLengthCm: -25 })
    const topRayConcave = concave.parallelRays[0] // y0 = +6 cm
    expect(topRayConcave.backwardExtensionEnd).toEqual({ xCm: -25, yCm: 0 })
    // Diverges upward on right: slope = -6 / (-25) = +0.24; clipped cleanly at corridor y = +7.6 cm
    expect(topRayConcave.refractedEnd.yCm).toBeCloseTo(7.6, 4)

    // Verify extreme short focal lengths (+10 cm and -10 cm) never exceed |y| <= 7.6 cm
    for (const f of [10, 15, -10, -15]) {
      const m = calculateLensPowerModel({ focalLengthCm: f })
      for (const ray of m.parallelRays) {
        expect(Math.abs(ray.refractedEnd.yCm)).toBeLessThanOrEqual(7.6001)
      }
    }
  })

  it('distinguishes learner ruler measurement from true lens focal length via evaluateRulerMeasurement', () => {
    const lensA = calculateLensPowerModel({ focalLengthCm: 20 })

    // Unaligned ruler at +10 cm
    const unaligned = evaluateRulerMeasurement(10, lensA)
    expect(unaligned.isAlignedWithFocus).toBe(false)
    expect(unaligned.rulerPositionCm).toBe(10)
    expect(unaligned.rulerPositionMetres).toBe(0.1)
    expect(unaligned.measuredPowerDioptres).toBe(10)
    expect(unaligned.trueFocalLengthCm).toBe(20)
    expect(unaligned.truePowerDioptres).toBe(5)
    expect(unaligned.measurementErrorCm).toBe(-10)
    expect(unaligned.statusMessage).toContain(
      'an unaligned ruler position is not the focal length'
    )

    // Aligned ruler at +20 cm
    const aligned = evaluateRulerMeasurement(20, lensA)
    expect(aligned.isAlignedWithFocus).toBe(true)
    expect(aligned.measuredPowerDioptres).toBe(5)
    expect(aligned.truePowerDioptres).toBe(5)
    expect(aligned.statusMessage).toContain('aligned with principal focus F₂')

    // Zero-division guard at 0 cm
    const atZero = evaluateRulerMeasurement(0, lensA)
    expect(atZero.isAlignedWithFocus).toBe(false)
    expect(atZero.measuredPowerDioptres).toBeNull()
  })

  it('verifies all four focal-length and ruler boundary cases (+10 cm, +50 cm, -10 cm, -50 cm) stay inside the symmetric calibrated ruler and SVG viewBox', () => {
    const boundaryCases = [
      { fCm: 10, fM: 0.1, powerD: 10, label: 'F₂' as const },
      { fCm: 50, fM: 0.5, powerD: 2, label: 'F₂' as const },
      { fCm: -10, fM: -0.1, powerD: -10, label: 'F₁' as const },
      { fCm: -50, fM: -0.5, powerD: -2, label: 'F₁' as const },
    ]

    expect(LENS_POWER_LIMITS.rulerCm.min).toBe(-50)
    expect(LENS_POWER_LIMITS.rulerCm.max).toBe(50)
    expect(BENCH_SVG_GEOMETRY.RULER_MIN_CM).toBe(-50)
    expect(BENCH_SVG_GEOMETRY.RULER_MAX_CM).toBe(50)

    const rulerBarLeftPx = BENCH_SVG_GEOMETRY.toSvgX(BENCH_SVG_GEOMETRY.RULER_BAR_LEFT_CM)
    const rulerBarRightPx = BENCH_SVG_GEOMETRY.toSvgX(BENCH_SVG_GEOMETRY.RULER_BAR_RIGHT_CM)
    expect(rulerBarLeftPx).toBeGreaterThanOrEqual(40)
    expect(rulerBarRightPx).toBeLessThanOrEqual(BENCH_SVG_GEOMETRY.SVG_W - 40)

    for (const bc of boundaryCases) {
      // 1. Input validation accepts the boundary value
      const valRes = validateFocalLengthCmInput(Math.abs(bc.fCm), '+')
      expect(valRes.isValid).toBe(true)

      // 2. Model computes exact metre and dioptre values
      const model = calculateLensPowerModel({ focalLengthCm: bc.fCm })
      expect(model.focalLengthCm).toBe(bc.fCm)
      expect(model.focalLengthMetres).toBe(bc.fM)
      expect(model.powerDioptres).toBe(bc.powerD)
      expect(model.principalFocusPoint).toEqual({ xCm: bc.fCm, yCm: 0, label: bc.label })

      // 3. Focus coordinate is inside calibrated ruler bounds [-50, +50]
      expect(bc.fCm).toBeGreaterThanOrEqual(LENS_POWER_LIMITS.rulerCm.min)
      expect(bc.fCm).toBeLessThanOrEqual(LENS_POWER_LIMITS.rulerCm.max)

      // 4. Focus SVG pixel coordinate and 124px caliper badge [-62, +62] stay strictly inside viewBox [0, 880]
      const focusPx = BENCH_SVG_GEOMETRY.toSvgX(bc.fCm)
      expect(focusPx).toBeGreaterThanOrEqual(80)
      expect(focusPx).toBeLessThanOrEqual(BENCH_SVG_GEOMETRY.SVG_W - 80)
      expect(focusPx - 62).toBeGreaterThanOrEqual(16)
      expect(focusPx + 62).toBeLessThanOrEqual(BENCH_SVG_GEOMETRY.SVG_W - 16)

      // 5. Measurement handle reaches and aligns with the focus at the boundary
      const rulerAtBoundary = evaluateRulerMeasurement(bc.fCm, model)
      expect(rulerAtBoundary.isAlignedWithFocus).toBe(true)
      expect(rulerAtBoundary.rulerPositionCm).toBe(bc.fCm)
      expect(rulerAtBoundary.rulerPositionMetres).toBe(bc.fM)
      expect(rulerAtBoundary.measuredPowerDioptres).toBe(bc.powerD)
    }
  })

  it('validates input bounds, rejects zero denominator, and checks sign expectations', () => {
    expect(validateFocalLengthCmInput('').isValid).toBe(false)
    expect(validateFocalLengthCmInput('abc').isValid).toBe(false)
    expect(validateFocalLengthCmInput(Number.NaN).isValid).toBe(false)
    expect(validateFocalLengthCmInput(Number.POSITIVE_INFINITY).isValid).toBe(false)

    const zeroRes = validateFocalLengthCmInput(0)
    expect(zeroRes.isValid).toBe(false)
    expect(zeroRes.errorMessage).toContain('cannot be 0 cm')

    const outOfRange = validateFocalLengthCmInput(5)
    expect(outOfRange.isValid).toBe(false)
    expect(outOfRange.errorMessage).toContain('between 10 cm and 50 cm')

    const signMismatch = validateFocalLengthCmInput(-20, '+')
    expect(signMismatch.isValid).toBe(false)
    expect(signMismatch.errorMessage).toContain('positive focal length')

    const valid = validateFocalLengthCmInput('25', '+')
    expect(valid.isValid).toBe(true)
    expect(valid.parsedFocalLengthCm).toBe(25)
  })

  it('formats signed numbers cleanly without -0', () => {
    expect(formatSignedValue(4, 1)).toBe('+4')
    expect(formatSignedValue(-2.5, 2)).toBe('-2.5')
    expect(formatSignedValue(-0, 2)).toBe('0')
  })
})

describe('Stage A Zero-Leakage & Stage Transition Integrity', () => {
  it('ensures Stage A unrevealed labels and prediction choices contain zero numerical focal lengths or dioptre values', () => {
    expect(PRESET_LENSES['lens-a'].unrevealedLabel).not.toMatch(/20|40|\+5|\+2\.5|cm|D/)
    expect(PRESET_LENSES['lens-b'].unrevealedLabel).not.toMatch(/20|40|\+5|\+2\.5|cm|D/)
    for (const option of INITIAL_PREDICTION_OPTIONS) {
      expect(option.label).not.toMatch(/20|40|\+5|\+2\.5|cm|dioptre/i)
    }
  })

  it('transitions cleanly across Predict -> Experiment -> Discover -> Calculate -> Contrast -> Apply and prevents stale negative concave state on convex stages', () => {
    const startState = {
      activeStage: 'predict' as const,
      activePresetId: 'lens-a' as const,
      focalLengthCm: 20,
      focalDraft: '20',
      compareOverlayActive: false,
    }

    // Predict -> Experiment keeps Lens A (+20 cm)
    const expState = computeStageTransition(startState, 'experiment')
    expect(expState.activeStage).toBe('experiment')
    expect(expState.focalLengthCm).toBe(20)

    // Experiment -> Discover
    const discState = computeStageTransition(expState, 'discover')
    expect(discState.activeStage).toBe('discover')
    expect(discState.focalLengthCm).toBe(20)

    // Discover -> Contrast switches to Concave C (-25 cm) and clears compareOverlayActive
    const contrastState = computeStageTransition(
      { ...discState, compareOverlayActive: true },
      'contrast'
    )
    expect(contrastState.activeStage).toBe('contrast')
    expect(contrastState.activePresetId).toBe('concave-c')
    expect(contrastState.focalLengthCm).toBe(-25)
    expect(contrastState.compareOverlayActive).toBe(false)

    // Returning from Contrast (-25 cm) to Discover, Experiment, or Predict restores Lens A (+20 cm)
    for (const target of ['predict', 'experiment', 'discover'] as const) {
      const restored = computeStageTransition(contrastState, target)
      expect(restored.focalLengthCm).toBe(20)
      expect(restored.activePresetId).toBe('lens-a')
    }

    // Returning from Contrast (-25 cm) to Calculate restores +25 cm convex
    const backToCalc = computeStageTransition(contrastState, 'calculate')
    expect(backToCalc.focalLengthCm).toBe(25)
    expect(backToCalc.activePresetId).toBe('custom')
  })
})

describe('Lens Power Prediction & Targeted Misconception Assessment', () => {
  const getQ = (id: PracticeQuestionId) =>
    LENS_POWER_PRACTICE_QUESTIONS.find((q) => q.id === id)!

  it('evaluates Stage A initial prediction accurately', () => {
    expect(evaluateInitialPrediction('lens-a-closer').isCorrect).toBe(true)
    expect(evaluateInitialPrediction('lens-b-closer').isCorrect).toBe(false)
    expect(evaluateInitialPrediction('both-same').isCorrect).toBe(false)
  })

  it('handles blank input and invalid/non-finite input across choice and numeric questions', () => {
    const q1 = getQ('q1')
    expect(evaluateLensPowerPractice(q1, INITIAL_PRACTICE_ATTEMPT).status).toBe('empty')

    const q2 = getQ('q2')
    const emptyNum = evaluateLensPowerPractice(q2, {
      ...INITIAL_PRACTICE_ATTEMPT,
      numericDraft: '   ',
    })
    expect(emptyNum.status).toBe('empty')
    expect(emptyNum.headline).toContain('Enter a numerical value')

    const alphaNum = evaluateLensPowerPractice(q2, {
      ...INITIAL_PRACTICE_ATTEMPT,
      numericDraft: 'abc',
    })
    expect(alphaNum.status).toBe('empty')
    expect(alphaNum.headline).toContain('Invalid number format')

    const infNum = evaluateLensPowerPractice(q2, {
      ...INITIAL_PRACTICE_ATTEMPT,
      numericDraft: 'Infinity',
    })
    expect(infNum.status).toBe('empty')
    expect(infNum.headline).toContain('Invalid number format')

    const nanNum = evaluateLensPowerPractice(q2, {
      ...INITIAL_PRACTICE_ATTEMPT,
      numericDraft: 'NaN',
    })
    expect(nanNum.status).toBe('empty')
    expect(nanNum.headline).toContain('Invalid number format')
  })

  it('accepts values within rounding tolerance and rejects values outside tolerance', () => {
    const q3 = getQ('q3') // target 4, tolerance 0.05
    expect(
      evaluateLensPowerPractice(q3, {
        ...INITIAL_PRACTICE_ATTEMPT,
        numericDraft: '3.98',
        followUpChoiceIndex: 0,
        submitted: true,
      }).status
    ).toBe('correct')
    expect(
      evaluateLensPowerPractice(q3, {
        ...INITIAL_PRACTICE_ATTEMPT,
        numericDraft: '4.2',
        followUpChoiceIndex: 0,
        submitted: true,
      }).status
    ).toBe('misconception')
  })

  it('diagnoses specific misconceptions across all 6 practice questions (unit conversion, missing negative sign, right number with wrong reasoning, and structured explanation rubric)', () => {
    // Q1: Compare lens powers
    const q1 = getQ('q1')
    expect(
      evaluateLensPowerPractice(q1, { ...INITIAL_PRACTICE_ATTEMPT, choiceIndex: 0, submitted: true })
        .status
    ).toBe('correct')
    const q1Wrong = evaluateLensPowerPractice(q1, {
      ...INITIAL_PRACTICE_ATTEMPT,
      choiceIndex: 1,
      submitted: true,
    })
    expect(q1Wrong.status).toBe('misconception')
    expect(q1Wrong.suggestReplayComparison).toBe(true)

    // Q2: Convert cm to m
    const q2 = getQ('q2')
    expect(
      evaluateLensPowerPractice(q2, {
        ...INITIAL_PRACTICE_ATTEMPT,
        numericDraft: '0.25',
        submitted: true,
      }).status
    ).toBe('correct')
    expect(
      evaluateLensPowerPractice(q2, {
        ...INITIAL_PRACTICE_ATTEMPT,
        numericDraft: '2500',
        submitted: true,
      }).headline
    ).toContain('multiplied by 100')

    // Q3: Calculate Power + Follow-up reasoning check
    const q3 = getQ('q3')
    const q3Trap = evaluateLensPowerPractice(q3, {
      ...INITIAL_PRACTICE_ATTEMPT,
      numericDraft: '0.04',
      submitted: true,
    })
    expect(q3Trap.status).toBe('misconception')
    expect(q3Trap.headline).toContain('Centimetre Trap')

    const q3RightNumNoReason = evaluateLensPowerPractice(q3, {
      ...INITIAL_PRACTICE_ATTEMPT,
      numericDraft: '4',
      followUpChoiceIndex: null,
      submitted: true,
    })
    expect(q3RightNumNoReason.status).toBe('needs-reasoning')

    const q3RightNumWrongReason = evaluateLensPowerPractice(q3, {
      ...INITIAL_PRACTICE_ATTEMPT,
      numericDraft: '4',
      followUpChoiceIndex: 1,
      submitted: true,
    })
    expect(q3RightNumWrongReason.status).toBe('needs-reasoning')

    const q3Complete = evaluateLensPowerPractice(q3, {
      ...INITIAL_PRACTICE_ATTEMPT,
      numericDraft: '4',
      followUpChoiceIndex: 0,
      submitted: true,
    })
    expect(q3Complete.status).toBe('correct')

    // Q4: Focal length from negative power
    const q4 = getQ('q4')
    expect(
      evaluateLensPowerPractice(q4, {
        ...INITIAL_PRACTICE_ATTEMPT,
        numericDraft: '-40',
        submitted: true,
      }).status
    ).toBe('correct')
    expect(
      evaluateLensPowerPractice(q4, {
        ...INITIAL_PRACTICE_ATTEMPT,
        numericDraft: '40',
        submitted: true,
      }).headline
    ).toContain('Missing Negative Sign')
    expect(
      evaluateLensPowerPractice(q4, {
        ...INITIAL_PRACTICE_ATTEMPT,
        numericDraft: '-0.4',
        submitted: true,
      }).headline
    ).toContain('centimetres')

    // Q5: Sign vs magnitude
    const q5 = getQ('q5')
    expect(
      evaluateLensPowerPractice(q5, {
        ...INITIAL_PRACTICE_ATTEMPT,
        choiceIndex: 1,
        submitted: true,
      }).headline
    ).toContain('Sign vs Magnitude Trap')

    // Q6: Structured explanation + self-check rubric (entering written text alone never marks Q6 correct without Part A claim)
    const q6 = getQ('q6')
    expect(q6.kind).toBe('structured-explanation')
    expect(q6.selfCheckRubric?.length).toBe(3)
    expect(
      evaluateLensPowerPractice(q6, {
        ...INITIAL_PRACTICE_ATTEMPT,
        choiceIndex: null,
        writtenExplanationDraft: 'Some student prose without selecting Part A claim.',
        submitted: true,
      }).status
    ).toBe('empty')
    expect(
      evaluateLensPowerPractice(q6, {
        ...INITIAL_PRACTICE_ATTEMPT,
        choiceIndex: 1,
        writtenExplanationDraft: 'Some student prose with an incorrect Part A claim.',
        submitted: true,
      }).status
    ).toBe('misconception')
    expect(
      evaluateLensPowerPractice(q6, {
        ...INITIAL_PRACTICE_ATTEMPT,
        choiceIndex: 0,
        writtenExplanationDraft:
          'Lens A bends parallel rays to meet at +20 cm instead of +40 cm, so its shorter focal length gives higher power (+5 D vs +2.5 D).',
        submitted: true,
      }).status
    ).toBe('correct')
  })

  it('tracks hint progression, worked-solution reveal, and preserves submitted practice answers across bench changes', () => {
    const q3 = getQ('q3')
    expect(q3.hints).toHaveLength(2)
    let attempt: PracticeAttemptState = { ...INITIAL_PRACTICE_ATTEMPT }

    // Progressive hints 1 -> 2 -> capped at max
    attempt = {
      ...attempt,
      revealedHintCount: Math.min(2, attempt.revealedHintCount + 1) as 0 | 1 | 2,
    }
    expect(attempt.revealedHintCount).toBe(1)
    attempt = {
      ...attempt,
      revealedHintCount: Math.min(2, attempt.revealedHintCount + 1) as 0 | 1 | 2,
    }
    expect(attempt.revealedHintCount).toBe(2)

    // Worked solution reveal
    attempt = { ...attempt, solutionRevealed: true }
    expect(attempt.solutionRevealed).toBe(true)

    // Submit correct answer and verify countCompletedPractice remains stable regardless of bench transitions
    const map: Record<PracticeQuestionId, PracticeAttemptState> = {
      q1: { ...INITIAL_PRACTICE_ATTEMPT, choiceIndex: 0, submitted: true },
      q2: { ...INITIAL_PRACTICE_ATTEMPT, numericDraft: '0.25', submitted: true },
      q3: {
        ...attempt,
        numericDraft: '4',
        followUpChoiceIndex: 0,
        submitted: true,
      },
      q4: INITIAL_PRACTICE_ATTEMPT,
      q5: INITIAL_PRACTICE_ATTEMPT,
      q6: INITIAL_PRACTICE_ATTEMPT,
    }
    expect(countCompletedPractice(map)).toBe(3)
  })
})
