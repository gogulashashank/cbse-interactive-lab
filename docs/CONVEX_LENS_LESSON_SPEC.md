# Lesson Specification: “How a convex lens forms an image.”

**Platform Title:** CBSE Interactive Lab — Illustrated Science Notebook *(Provisional Prototype)*  
**Target Class & Subject:** CBSE Class 10 Science (Physics — Unit III: Natural Phenomena)  
**Curriculum Session & Review Status:** 2025–26 / 2026–27 Session · **Provisional — educator and curriculum review pending** *(Not an official NCERT or CBSE publication; no official endorsement is claimed).*

---

## 1. Verified NCERT & CBSE Curriculum Mapping

| Curriculum Reference | Section / Topic | Alignment in This Lesson |
| :--- | :--- | :--- |
| **NCERT Class 10 Science** (*Light – Reflection and Refraction*, Rationalised Chapter 9 / Legacy Chapter 10) | **Section 9.3.3 & 9.3.5** — Refraction by Spherical Lenses, Principal Focus ($F_1, F_2$), Optical Centre ($O$), Aperture, and Image Formation Using Ray Diagrams | Interactive 3D Illustrated Book & Precision 2D optical bench showing optical centre $O$, principal foci $F_1, F_2$, $2F_1, 2F_2$, and all three principal rays. |
| **NCERT Class 10 Science** | **Section 9.3.4 & Table 9.4** — Image Formation by Lenses (Nature, position, and relative size of image formed by a convex lens for various object positions) | Direct interactive exploration for all **5 finite object-distance rows** (`beyond_2f`, `at_2f`, `between_f_and_2f`, `at_f`, and `within_f`), plus a clearly labelled **reference row** for **Object at infinity ($|u| = \infty \rightarrow$ point-sized real image at $F_2$)**. |
| **NCERT Class 10 Science** | **Section 9.3.6** — Sign Convention for Spherical Lenses (New Cartesian Sign Convention) | Explicit coordinate sign rules ($u < 0$, $f > 0$, $v > 0$ for real right-side images, $v < 0$ for virtual left-side images) and live signed-value substitution. |
| **NCERT Class 10 Science** | **Section 9.3.7** — Lens Formula and Magnification ($\frac{1}{v} - \frac{1}{u} = \frac{1}{f}$, $m = \frac{h'}{h} = \frac{v}{u}$) | Live step-by-step worked calculation bound to student inputs plus targeted numerical practice problems. |
| **NCERT Class 10 Science** | **Section 9.3.8** — Power of a Lens ($P = \frac{1}{f\text{ (in m)}} = \frac{100}{f\text{ (in cm)}}$ in dioptres $\text{D}$) | Live dioptre readout (+D for converging convex lens) and application question connecting focal length to optical power. |

---

## 2. Learning Objectives

By the end of this interactive lesson spread, a Class 10 student will be able to:
1. **Distinguish real vs. virtual images experimentally:** Explain why a **real image** (formed where refracted rays physically converge on the $+x$ side when $|u| > f$) can be caught as a sharp picture on a paper screen, whereas a **virtual image** (formed when $|u| < f$ where refracted rays diverge and only appear to meet behind the object) **cannot** be caught on any screen.
2. **Trace the three principal rays** for a thin convex lens and explain how their convergence or divergence determines image position ($v$), orientation (inverted vs. erect), and size ($|m|$).
3. **Apply the New Cartesian Sign Convention, Lens Formula, Magnification, and Optical Power** ($\frac{1}{v} - \frac{1}{u} = \frac{1}{f}$, $m = \frac{v}{u} = \frac{h'}{h}$, $P = \frac{100}{f_{\text{cm}}}$) accurately with negative object distance ($u < 0$) and positive convex focal length ($f > 0$).

---

## 3. Book-First Learning Spread Architecture

- **Default Presentation (`3D Illustrated Book`):**
  - Opens directly to **Lesson II (Pages 6–7): “How a convex lens forms an image.”**
  - Clicking `‹ Contents` (or the on-page `‹ Return to Book Contents` link) turns the 3D book to **Spread 1 (Contents, Pages 2–3)**, where **Lesson I (Inclined Plane)** and **Lesson II (Convex Lens)** are both selectable on the 3D page and in an accessible HTML Contents card.
  - **Left Book Page (Page 6):** Editorial title, guiding screen-projection question, Principal Ray & Sign Convention rules with a clickable link to the worked equations, interactive Prediction tick-boxes, a **3D hinged paper flap** that lifts to reveal the live explanation for the current object regime, and live handwritten optical data notes.
  - **Right Book Page (Page 7):** 3D Pop-Out Optical Bench rising from the right page (movable candle, biconvex glass lens in brass mount, movable paper screen with sharp/blurred projection, and 3D ray tubes driven directly by `result.rays`), plus on-page NCERT Table 9.4 summary and 5 finite position preset buttons.
- **Precision 2D / Accessible View (`2D View`):**
  - Clearly labelled toggle in the top header and spread navigation bar (`Precision 2D / Accessible View`).
  - Shares the **exact same React state and `calculateConvexLens` scientific model** as the 3D book view.
  - Automatically activates if WebGL is unavailable (`onWebglUnavailable`).
- **Companion HTML Spread Cards:**
  - Provide complete keyboard- and screen-reader-accessible equivalents for the guiding question, prediction choices, revealable explanation (synchronized with the 3D paper flap), NCERT Table 9.4, and an expandable **Worked Calculation & Practice Questions** drawer.
