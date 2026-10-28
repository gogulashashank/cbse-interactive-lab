---
name: scientific-simulation-builder
description: Build and validate physics/science calculation models and interactive 2D/SVG visual simulations. Use when writing mathematical models, physics formulas, input validators, or simulation visualizations.
---

# Scientific Simulation Builder

Use this skill when implementing mathematical models, physics calculations, and interactive simulation graphics.

## Core Requirements

1. **Separation of Concerns**:
   - Keep pure scientific calculations strictly separate from UI state, React components, and rendering logic (e.g., in dedicated calculation modules).

2. **Documentation of Model Specifications**:
   - Document every governing equation, physical constant, unit of measurement (SI units by default), modelling assumption (e.g., point mass, uniform gravity, ideal frictionless surface), and valid input range in code comments and user-facing explanations.

3. **Test-First Scientific Verification**:
   - Write and run automated unit tests (using Vitest) for all mathematical calculations, edge cases, and boundary conditions **before** connecting them to visual graphics or UI controls.

4. **Rendering & Visual Fidelity**:
   - Prefer clean **SVG / 2D graphics** for the first lesson rather than complex 3D engines.
   - Clearly distinguish between an **illustrative animation** (schematic diagram or conceptual cue) and a **physical simulation** driven by real-time kinematic/dynamic equations.

5. **Honest Input Handling & Model Limitations**:
   - **Never silently clamp invalid inputs** or mask out-of-range values behind the scenes; surface clear validation feedback when inputs fall outside valid physical or model bounds.
   - **Never hide model limitations**; explicitly state idealisations (such as neglecting friction, air resistance, or rotational inertia).
