---
name: accessible-student-ui
description: Build accessible, responsive, keyboard-friendly student user interfaces with semantic HTML and plain CSS. Use when creating or styling interactive controls, forms, SVG diagrams, and layout components.
---

# Accessible Student UI

Use this skill when building or styling user interface components, interactive controls, and visual outputs for students.

## Core Requirements

1. **Semantic HTML & Keyboard Focus**:
   - Use semantic HTML elements (`<main>`, `<header>`, `<section>`, `<fieldset>`, `<label>`, `<button>`, `<output>`, etc.).
   - Ensure every interactive control has an explicit, programmatically associated label and a clearly visible `:focus-visible` keyboard outline.

2. **Dual Input Controls & Non-Drag Interaction**:
   - Always provide direct **numeric inputs** (`<input type="number">`) alongside range sliders (`<input type="range">`) so students can enter exact values easily.
   - Make all essential interactions completely usable via keyboard and click/tap **without requiring pointer dragging**.

3. **Text & Numerical Alternatives**:
   - Provide live text and numerical readouts/tables alongside SVG graphics so the scientific state is fully understandable without relying solely on visual inspection.

4. **Responsive Layout & Reduced Motion**:
   - Support small screens (mobile and low-cost tablet viewports) with fluid layouts and comfortable touch targets.
   - Respect `prefers-reduced-motion: reduce` by disabling or simplifying non-essential transitions and providing step/instant controls for animations.

5. **Colour Independence**:
   - **Never communicate meaning through colour alone**; always pair colour coding with text labels, icons, patterns, or distinct vector markers (e.g., arrowheads and text labels on force vectors).
