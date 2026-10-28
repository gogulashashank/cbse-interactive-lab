# Existing Project Audit & Evolution Plan

**Status:** Provisional architecture and audit document — educator and curriculum review pending.  
**Target Evolution:** Evolve the existing **CBSE Interactive Lab** into an original **Class 10 Physics learning platform** featuring a reusable lesson framework (`Explore`, `Study`, and `Practice` modes sharing live experiment state), a phone-first readable layout, the complete Class 10 lesson **“Can you catch an image?” (Convex-Lens Image Formation)**, and continued access to the existing **Ideal Frictionless Ramp** demonstration.

---

## 1. Audit of the Existing Codebase

### 1.1 Book Renderer & 3D Pop-Out Engine
- **Files Audited:**
  - `src/features/ramp/everyJouleBook.ts`
  - `src/features/ramp/everyJoulePopout.ts`
  - `src/features/ramp/bookPageRenderer.ts`
  - `src/features/ramp/RampScene3D.tsx`
- **Strengths & Reusable Capabilities:**
  - `everyJouleBook.ts` provides a physically proportioned 3D open-book stage (`createDeskStage`, `createBookEnvironment`, `createEveryJouleBook`, `getPageSurfaceHeightAt`, `getPageArchSlopeAt`) with realistic paper curvature, oak desk surface, linoleum mat, and cover turn animation.
  - `everyJoulePopout.ts` provides reusable non-photorealistic technical-illustration shaders and primitives (`createPaperMaterial`, `InkLineSet`, `PenScheduler`, `DashedTargetRing3D`, `PaperTag3D`, `EnergyFlowDots3D`) that give 3D apparatus a warm, tactile "living textbook" aesthetic.
- **Issues & Limitations Identified:**
  1. **Essential Reading Text Trapped in 3D Textures:** In the initial ramp spread, core explanations, prediction tick-boxes, and tables were painted primarily onto 2D HTML canvases mapped onto curved 3D page meshes (`bookPageRenderer.ts`). On phones or small viewports, 3D perspective foreshortening makes dense body text difficult to read and inaccessible to screen readers or browser text zoom unless duplicated in DOM.
  2. **Reference Branding & Mastery Claims:** `everyJouleBook.ts` and `bookPageRenderer.ts` previously included `"Every Joule"` cover/contents titles and a `"MASTERED"` ink stamp. Per project rules, reference branding must be replaced with a clearly provisional original title (**CBSE Interactive Lab — Illustrated Science Notebook (Provisional)**), and completion stamps must report `"COMPLETED"` rather than claiming mastery from completion alone.

### 1.2 Physics Calculation Code & Input Validation
- **Files Audited:**
  - `src/features/ramp/rampModel.ts`
  - `src/features/ramp/rampInputValidation.ts`
- **Strengths & Reusable Patterns:**
  - Pure TypeScript scientific calculation (`rampModel.ts`) with zero React, DOM, or WebGL imports.
  - Explicit domain error class (`RampModelValidationError`) that rejects `NaN`, `Infinity`, non-positive values, and geometric impossibilities ($L < h$) without silent clamping or fallback substitution.
  - Draft-preserving string validation (`rampInputValidation.ts`: `parseNumericDraft`, `formatDisplayNumber`) that keeps temporary user typing (`""`, `"2."`) intact in controlled `<input type="number">` fields while preventing invalid calls to the physics model.

### 1.3 Controls & Accessibility Features
- **Files Audited:**
  - `src/features/ramp/RampExperiment.tsx`
  - `src/features/ramp/RampDiagram.tsx`
  - `src/App.css`, `src/index.css`
- **Strengths:**
  - Synchronised native `<input type="range">` and `<input type="number">` controls with explicit `<label htmlFor>` bindings, `aria-invalid`, and `aria-describedby` error messages (`role="alert"`).
  - Support for `Still / Reduced Motion` mode and a 2D SVG schematic fallback (`RampDiagram.tsx`).
- **Gaps to Address in the New Framework:**
  - The full-viewport 3D canvas with floating HUD pills and a collapsible bottom sheet works well as an exploratory showcase on desktop, but students studying for Class 10 CBSE exams need:
    - **Phone-first readable typography** in semantic HTML DOM at all times.
    - Explicit **Explore**, **Study**, and **Practice** modes that share the exact same live experiment state (`u`, `f`, `h_o`, screen position) so changing a lens parameter in **Explore** immediately updates the worked sign-convention equations in **Study** and helps verify problems in **Practice**.

### 1.4 Automated Tests
- **Files Audited:**
  - `src/features/ramp/rampModel.test.ts` (14 unit tests)
  - `src/features/ramp/rampInputValidation.test.ts` (8 unit tests)
  - `src/test/smoke.test.ts` (1 test)
- **Status:** All 23 existing tests pass via Vitest (`npm test`).

---

## 2. What Will Be Reused vs. Newly Built

| Component / Layer | Reuse Strategy | Target Files |
| :--- | :--- | :--- |
| **3D Open-Book & Desk Stage** | **Reuse directly** (`createDeskStage`, `createBookEnvironment`, `createEveryJouleBook`, `createPaperMaterial`, `InkLineSet`, `PaperTag3D`) to power the 3D Optical Bench pop-out figure in the Convex Lens lesson. | `src/features/ramp/everyJouleBook.ts`, `src/features/ramp/everyJoulePopout.ts`, `src/features/lens/LensBookScene3D.tsx` |
| **Input Draft & Number Formatting Pattern** | **Reuse pattern** (`parseNumericDraft`, `formatDisplayNumber`, draft-preserving slider + number input sync) for optical bench inputs ($f$, $\|u\|$, $h_o$, screen distance $d_s$). | `src/features/lens/lensInputValidation.ts` |
| **Existing Ramp Demonstration** | **Preserve intact** and make selectable at any time from the top-level **Lesson Switcher**. | `src/features/ramp/RampExperiment.tsx` |
| **Convex Lens Thin-Lens Scientific Model** | **New pure TypeScript module** implementing the New Cartesian Sign Convention, all 6 NCERT object regimes, focal-boundary ($u = -f$) safety, screen-catching blur model, and 3 principal ray paths. | `src/features/lens/convexLensModel.ts`, `src/features/lens/convexLensModel.test.ts` |
| **Interactive 2D SVG Optical Bench & Ray Diagram** | **New high-precision SVG view** with draggable object & screen handles, colour + dash-coded principal rays, virtual traceback extensions, and live screen-projection inset. | `src/features/lens/LensRayDiagramSVG.tsx` |
| **Reusable Lesson Shell (`Explore` / `Study` / `Practice`)** | **New phone-first responsive shell** keeping essential text in semantic DOM, sharing experiment & 7-step inquiry state across all three modes, and providing a top-level lesson switcher. | `src/features/lens/ConvexLensLesson.tsx`, `src/App.tsx`, `src/App.css` |

---

## 3. Implementation Plan

1. **Phase A — Documentation & Specifications:**
   - Write `docs/PROJECT_AUDIT_AND_PLAN.md` (this document).
   - Write `docs/CONVEX_LENS_LESSON_SPEC.md` (7-step pedagogical design, NCERT Class 10 mapping, misconceptions, and mode structure).
   - Write `docs/CONVEX_LENS_MODEL.md` (thin-lens equations, New Cartesian Sign Convention, units, focal-boundary handling, and ray geometry).
2. **Phase B — Pure TypeScript Convex Lens Model & Unit Tests:**
   - Implement `src/features/lens/convexLensModel.ts` and `src/features/lens/lensInputValidation.ts`.
   - Write comprehensive Vitest suites in `src/features/lens/convexLensModel.test.ts` and `src/features/lens/lensInputValidation.test.ts` testing real-image cases, virtual-image cases, $u = -2f$ symmetry, $u = -f$ focal boundary (parallel rays / image at infinity), magnification, optical power in dioptres, screen catchability, and invalid input rejection.
3. **Phase C — Synchronized 2D Ray Diagram SVG & 3D Illustrated Book Optical Bench:**
   - Build `src/features/lens/LensRayDiagramSVG.tsx` for crisp, accessible 2D ray construction and screen-catching exploration.
   - Build `src/features/lens/LensBookScene3D.tsx` reusing the 3D illustrated open-book engine so the optical bench, glowing candle/arrow object, biconvex glass lens, 3D principal rays, and movable projection screen pop out of the notebook pages.
4. **Phase D — Complete 7-Step Lesson & `Explore` / `Study` / `Practice` Shell:**
   - Build `src/features/lens/ConvexLensLesson.tsx` implementing **Encounter → Predict → Investigate → Notice → Explain → Calculate → Independent application** across **Explore**, **Study**, and **Practice** modes sharing one unified state.
   - Wire `src/App.tsx` and `src/App.css` with a phone-first responsive layout and a top-level switcher between **Class 10 Optics: “Can you catch an image?” (Convex Lens)** and **Existing Demo: “Why does a ramp make lifting easier?” (Inclined Plane)**.
5. **Phase E — Quality Assurance & Accessibility Verification:**
   - Run `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build`.
   - Verify keyboard navigation, form error announcements, phone-first layout, and produce `docs/QA_AND_ACCESSIBILITY_REPORT.md`.
