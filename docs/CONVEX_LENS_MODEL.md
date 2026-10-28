# Scientific Model Specification: Ideal Thin Convex Lens

**Module:** `src/features/lens/convexLensModel.ts`  
**Status:** Provisional — educator and curriculum review pending.

---

## 1. Physical System & Idealizations

This model describes paraxial geometric optics for a **thin symmetrical biconvex converging lens** in air, with an extended upright arrow/candle object placed perpendicular to the principal axis on the left side of the lens and a movable vertical paper projection screen on the right side of the lens.

### 1.1 Documented Assumptions
1. **Ideal Thin Lens Approximation:** The thickness of the lens is negligible compared to the object distance $|u|$, image distance $|v|$, and focal length $f$. All refraction is modelled as occurring at a single vertical principal plane $x = 0$ passing through the optical centre $O(0, 0)$.
2. **Paraxial Rays:** All light rays make small angles with the principal axis ($\sin\theta \approx \tan\theta \approx \theta$), so all rays from a single object point converge to (or diverge from) a single ideal image point without spherical aberration, coma, or astigmatism.
3. **Monochromatic / Achromatic Idealization:** Dispersion (chromatic aberration, where focal length varies slightly with wavelength) is excluded; a single focal length $f > 0$ applies.
4. **Homogeneous Surrounding Medium:** The lens is surrounded by air of uniform refractive index ($n \approx 1$) on both sides, so the first and second principal focal distances are equal in magnitude ($|F_1O| = |OF_2| = f$).

### 1.2 Documented Limitations
- Real glass lenses of finite thickness exhibit **spherical aberration** (marginal rays focus slightly closer to the lens than paraxial rays) and **chromatic aberration** (blue light focuses slightly closer than red light).
- The model excludes Fresnel surface reflections, glass absorption losses, and diffraction limits.

---

## 2. Units & New Cartesian Sign Convention

All optical-bench lengths are expressed in **centimetres ($\text{cm}$)** and optical power is expressed in **dioptres ($\text{D} = \text{m}^{-1}$)**, matching standard NCERT Class 10 Science conventions:

1. **Origin at Optical Centre $O$:** The optical centre $O$ of the lens is the origin $(x, y) = (0, 0)$, with the principal axis along the horizontal $x$-axis.
2. **Direction of Incident Light ($+x$):** The object is always placed to the **left** of the lens, so incident light travels from **left to right** (along the $+x$ direction).
3. **Horizontal Distances ($x$-coordinates):**
   - Distances measured in the direction of incident light ($+x$, to the right of $O$) are **positive ($+$)**.
   - Distances measured against the direction of incident light ($-x$, to the left of $O$) are **negative ($-$)**.
   - Therefore:
     - **Object coordinate:** $u = -d_o < 0$, where $d_o = |u| > 0$ is the unsigned ruler distance from the object to the lens.
     - **Primary focus $F_1$ (object side):** $x_{F_1} = -f < 0$.
     - **Secondary focus $F_2$ (principal focus, image side):** $x_{F_2} = +f > 0$. So for a converging convex lens, **focal length $f > 0$**.
     - **Image coordinate $v$:**
       - $v > 0$ indicates a **real image** formed to the right of the lens (where refracted rays physically intersect).
       - $v < 0$ indicates a **virtual image** formed to the left of the lens (where diverging refracted rays appear to intersect when extended backward).
4. **Vertical Heights ($y$-coordinates):**
   - Heights measured upward perpendicular to the principal axis ($+y$) are **positive ($+$)**.
   - Heights measured downward perpendicular to the principal axis ($-y$) are **negative ($-$)**.
   - Therefore:
     - **Object height:** $h_o > 0$ (upright object).
     - **Image height $h'$:** $h' < 0$ for an **inverted** image; $h' > 0$ for an **erect (upright)** image.

---

## 3. Governing Equations

### 3.1 Thin-Lens Formula
$$\frac{1}{v} - \frac{1}{u} = \frac{1}{f}$$

Solving for the signed image coordinate $v$ (in $\text{cm}$):
$$\frac{1}{v} = \frac{1}{f} + \frac{1}{u} = \frac{u + f}{u \cdot f} \implies v = \frac{u \cdot f}{u + f}$$

Substituting $u = -d_o$ (with $d_o > 0, f > 0$):
$$v = \frac{-d_o \cdot f}{f - d_o} = \frac{d_o \cdot f}{d_o - f}$$

### 3.2 Focal-Boundary Singularity Handling ($d_o = f$, i.e. $u = -f$)
When $|u + f| \le \epsilon$ (with $\epsilon = 10^{-9}\text{ cm}$):
- The denominator $u + f = 0$.
- Physically, rays emerging from the lens are strictly parallel with slope $-\frac{h_o}{f}$.
- The model does **not** divide by zero or return `NaN`. Instead, it sets:
  - `isAtFocus = true`
  - `vCm = null`
  - `magnification = null`
  - `imageHeightCm = null`
  - `regime = 'at_f'`
  - `imageNature = 'at_infinity'`
  - `relativeSize = 'infinitely_large'`
  - `canCatchOnScreen = false`

### 3.3 Linear Magnification ($m$) and Image Height ($h'$)
For all non-focal positions ($|u + f| > \epsilon$):
$$m = \frac{h'}{h_o} = \frac{v}{u}$$
$$h' = m \cdot h_o$$

- When $d_o > f$ ($|u| > f$): $v > 0$ and $u < 0 \implies m < 0$ and $h' < 0$ (**real and inverted**).
  - $d_o > 2f$: $|m| < 1$ (**diminished**, $f < v < 2f$).
  - $|d_o - 2f| \le 10^{-7}$: $m = -1$ (**same size**, $v = 2f$, $h' = -h_o$).
  - $f < d_o < 2f$: $|m| > 1$ (**enlarged**, $v > 2f$).
- When $d_o < f$ ($|u| < f$): $v < 0$ and $u < 0 \implies m > 1$ and $h' > h_o > 0$ (**virtual, erect, and enlarged**, formed on the same side as the object at $|v| > d_o$).

### 3.4 Optical Power ($P$)
Optical power in dioptres ($\text{D} = \text{m}^{-1}$) is defined as the reciprocal of focal length in metres:
$$P = \frac{1}{f_{\text{m}}} = \frac{100}{f_{\text{cm}}}\text{ D}$$

For a convex lens ($f_{\text{cm}} > 0$), $P > 0$ (positive dioptres).

### 3.5 Screen Catchability & Blur Radius Model
A movable white projection screen is placed on the right side of the lens at $x = d_s > 0$:
- **Real image case ($v > 0$):**
  - The screen catches a **sharp** inverted image when $|d_s - v| \le \Delta_{\text{sharp}}$ (where $\Delta_{\text{sharp}} = 0.5\text{ cm}$ is the depth-of-focus tolerance on the classroom optical bench).
  - When $d_s \neq v$, the cone of rays from a lens of semi-aperture $R_{\text{lens}}$ converging toward $(v, h')$ intercepts the screen at $x = d_s$ with a normalized blur score:
    $$\text{blurFraction} = \min\!\left(1,\; \frac{|d_s - v|}{v}\right)$$
    and projected height on the screen:
    $$h_{\text{screen}} = h' \cdot \frac{d_s}{v}$$
- **Focal or Virtual image case ($v \le 0$ or $v = \text{null}$):**
  - Refracted rays on the $+x$ side are either parallel ($d_o = f$) or diverging ($d_o < f$).
  - `canCatchOnScreen = false`, `isSharpOnScreen = false`, and only an unfocused illuminated patch appears on the screen at any $d_s > 0$.

### 3.6 Three Principal Rays (Exact 2D/3D Coordinates)
From the object tip $A(u, h_o)$ with $u < 0, h_o > 0$:
1. **Ray 1 (Parallel to Principal Axis $\rightarrow$ Through $F_2$):**
   - Incident segment: $(u, h_o) \rightarrow (0, h_o)$.
   - Refracted direction: passes through $(0, h_o)$ and $F_2(f, 0)$, with slope $s_1 = -\frac{h_o}{f}$.
   - At any $x \ge 0$: $y_1(x) = h_o - \frac{h_o}{f} x = h_o \left(1 - \frac{x}{f}\right)$.
2. **Ray 2 (Through Optical Centre $O(0,0)$ Undeviated):**
   - Incident & refracted line passes straight through $(u, h_o)$ and $(0, 0)$, with slope $s_2 = \frac{h_o}{u}$.
   - At any $x$: $y_2(x) = \frac{h_o}{u} x$.
3. **Ray 3 (Through Primary Focus $F_1(-f, 0)$ $\rightarrow$ Parallel to Principal Axis):**
   - Line through $A(u, h_o)$ and $F_1(-f, 0)$ has slope $s_3 = \frac{h_o}{u + f}$ (defined for $u \neq -f$).
   - Hits the lens plane $x = 0$ at height $y_{\text{lens},3} = h_o - s_3 \cdot u = \frac{h_o \cdot f}{u + f} = h'$.
   - Refracted segment for $x \ge 0$ travels parallel to the principal axis at constant height $y_3(x) = h'$.

*Consistency Check:* At $x = v = \frac{u f}{u + f}$, all three ray equations evaluate to the exact same image-tip height:
$$y_1(v) = y_2(v) = y_3(v) = \frac{h_o f}{u + f} = m \cdot h_o = h'$$

---

## 4. Scientific & Curriculum References

1. **NCERT Class 10 Science** — Chapter 9 (Rationalised) / Chapter 10 (Legacy), *Light – Reflection and Refraction*, Sections 9.3.3–9.3.8 & Table 9.4, pp. 149–158. National Council of Educational Research and Training (NCERT), New Delhi.
   - Reference URL: https://ncert.nic.in/textbook.php?jesc1=9-13
2. **OpenStax University Physics Volume 3** — Chapter 2: *Geometric Optics and Image Formation*, Section 2.4 *Thin Lenses*.
   - Reference URL: https://openstax.org/books/university-physics-volume-3/pages/2-4-thin-lenses
