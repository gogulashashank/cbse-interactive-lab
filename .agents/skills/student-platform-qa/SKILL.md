---
name: student-platform-qa
description: Execute quality assurance checks, automated tests, accessibility checks, and verification reporting for the CBSE Interactive Lab. Use when testing features, validating builds, or reporting verification status.
---

# Student Platform QA

Use this skill when verifying code changes, writing or running test suites, auditing UI behaviour, and reporting QA findings.

## Core Requirements

1. **Comprehensive Functional Testing**:
   - Test scientific calculations, input validation rules, assessment marking logic, local state persistence, and reset behaviour.

2. **Accessibility & Layout Verification**:
   - Check keyboard navigation order, focus visibility, dual slider/numeric input synchronisation, reduced-motion handling, and responsive layouts across small and large viewports.

3. **Strict Reporting Integrity**:
   - Report every check explicitly as **passed**, **failed**, or **not run**.
   - **Never claim a test passed without actually executing it** in the current environment and inspecting the output.
   - Clearly distinguish between **automated checks** (e.g., Vitest unit tests, TypeScript compiler checks, Vite production builds) and **manual review** items.
