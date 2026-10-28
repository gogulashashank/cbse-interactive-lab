# Scientific Model Specification: Ideal Frictionless Ramp

> **Review Status:** Prototype — CBSE curriculum alignment and educator scientific review remain pending.

## 1. Physical Scenario & System Description

This model describes the mechanics of lifting a rigid object of mass $m$ to a vertical height $h$ using a **straight, ideal frictionless ramp** (inclined plane) of length $L$, and compares it directly against lifting the same object straight up vertically by height $h$.

### Core Modelling Assumptions
1. **Straight, Ideal Frictionless Ramp:** The inclined plane is perfectly planar and rigid, with zero surface friction ($\mu = 0$).
2. **Constant-Speed Motion:** The object is pulled uphill along the ramp at a constant speed ($v = \text{constant}$, acceleration $a = 0$).
3. **Parallel Pulling Force:** The applied pulling (effort) force $F_{\text{pull}}$ acts parallel to the ramp surface in the uphill direction.
4. **No Losses or Kinetic Energy Change:** There is no surface friction, no air resistance, no rotational kinetic energy, and no change in translational kinetic energy ($\Delta K = 0$).
5. **Steady-State Motion (No Transients):** The model strictly describes steady movement along the ramp and excludes the brief starting and stopping force transients required to initiate or halt motion.
6. **Uniform Gravitational Field:** Gravitational acceleration is fixed at the standard value $g = 9.81\text{ m/s}^2$ downward.
7. **Full Numerical Precision:** All calculations retain full IEEE 754 double-precision floating-point accuracy in the model layer; any rounding or formatting is deferred strictly to the presentation layer.

---

## 2. Inputs & Validation Rules

| Input Property | Symbol | Unit | Validation Constraint |
| :--- | :---: | :---: | :--- |
| `massKg` | $m$ | $\text{kg}$ | Finite number, $m > 0$ |
| `heightM` | $h$ | $\text{m}$ | Finite number, $h > 0$ |
| `rampLengthM` | $L$ | $\text{m}$ | Finite number, $L \ge h$ |

* **Strict Error Handling:** Inputs that are `NaN`, `Infinity`, `-Infinity`, non-positive ($m \le 0$ or $h \le 0$), or geometrically impossible ($L < h$) are rejected with an explicit `RampModelValidationError`.
* **No Silent Clamping:** The model never silently clamps values, substitutes fallback defaults, or hides invalid states.
* **Overflow Protection:** If otherwise-valid inputs produce non-finite computed outputs (e.g., due to extreme floating-point overflow), the model throws an error rather than returning `Infinity` or `NaN`.

---

## 3. Governing Equations & Derived Outputs

Given valid inputs $(m, h, L)$ and gravitational acceleration $g = 9.81\text{ m/s}^2$:

1. **Gravitational Weight (`weightN`):**
   $$W_g = m \cdot g \quad [\text{N}]$$

2. **Ramp Inclination Angle (`rampAngleRadians`, `rampAngleDegrees`):**
   $$\theta_{\text{rad}} = \arcsin\!\left(\frac{h}{L}\right) \quad [\text{rad}]$$
   $$\theta_{\text{deg}} = \theta_{\text{rad}} \cdot \frac{180}{\pi} \quad [^\circ]$$

3. **Horizontal Run (`horizontalRunM`):**
   Computed in factored form for numerical stability near $L = h$:
   $$x = \sqrt{(L - h)(L + h)} \quad [\text{m}]$$

4. **Applied Pulling Force Along Ramp (`pullingForceN`):**
   Because motion is at constant speed ($a = 0$) along a frictionless incline, the uphill pulling force balances the downhill component of gravity ($W_g \sin\theta = W_g \frac{h}{L}$):
   $$F_{\text{pull}} = W_g \cdot \frac{h}{L} \quad [\text{N}]$$

5. **Distance Moved Along Ramp (`distanceAlongRampM`):**
   $$d_{\text{ramp}} = L \quad [\text{m}]$$

6. **Applied Work Along Ramp (`appliedWorkJ`):**
   $$W_{\text{applied}} = F_{\text{pull}} \cdot L \quad [\text{J}]$$

7. **Gravitational Potential Energy Gain (`potentialEnergyGainJ`):**
   $$\Delta U_g = W_g \cdot h \quad [\text{J}]$$

8. **Direct Vertical Lift Comparison (`verticalLiftForceN`, `verticalLiftDistanceM`, `verticalLiftWorkJ`):**
   $$F_{\text{lift}} = W_g \quad [\text{N}]$$
   $$d_{\text{lift}} = h \quad [\text{m}]$$
   $$W_{\text{lift}} = W_g \cdot h \quad [\text{J}]$$

9. **Ideal Mechanical Advantage (`idealMechanicalAdvantage`):**
   $$\text{IMA} = \frac{L}{h} \quad [\text{dimensionless}]$$

---

## 4. Crucial Conceptual Distinction: Applied Work vs. Net Work

A frequent source of confusion in introductory mechanics is the difference between the **applied work** done by the pulling force ($W_{\text{applied}}$) and the **net work** ($W_{\text{net}}$) done on the object:

* **Applied Work ($W_{\text{applied}} = F_{\text{pull}} \cdot L = mgh$):** This is the energy transferred *into* the object–Earth system by the external pulling agent acting parallel to the ramp over distance $L$.
* **Gravitational Work ($W_{\text{gravity}} = -mgh$):** As the object rises by vertical height $h$, gravity does an equal and opposite negative work of $-mgh$ (corresponding to the gain in gravitational potential energy $\Delta U_g = +mgh$).
* **Normal Force Work ($W_{\text{normal}} = 0$):** The ramp's normal force acts perpendicular to the displacement along the ramp and therefore does zero work.
* **Net Work ($W_{\text{net}} = 0$):** By the work–energy theorem, the net work on the object is the sum of work done by all forces:
  $$W_{\text{net}} = W_{\text{applied}} + W_{\text{gravity}} + W_{\text{normal}} = mgh - mgh + 0 = 0\text{ J}$$
  Because the object moves at **constant speed**, its kinetic energy does not change ($\Delta K = 0$), so the net work on the object is zero even though the pulling force performs positive applied work $W_{\text{applied}} = mgh$.

---

## 5. Real-World Limitations

* **Friction and Energy Losses:** Real ramps always exhibit surface friction (and minor air resistance or rolling resistance). Consequently, a real ramp requires a pulling force larger than $W_g \frac{h}{L}$ and **requires more total input work** ($W_{\text{input}} > mgh$) than an ideal frictionless ramp, reducing mechanical efficiency below $100\%$.
* **Starting and Stopping Transients:** In practice, initiating motion from rest requires momentarily exceeding the downhill gravitational component ($F > W_g \frac{h}{L}$), and stopping at the top requires momentarily reducing the force ($F < W_g \frac{h}{L}$). Over a start-to-rest trip, the positive kinetic energy added at the start is recovered at the stop, leaving total ideal work equal to $mgh$.
* **Pending Reviews:** Formal CBSE curriculum mapping and classroom educator sign-off have not yet been completed.

---

## 6. Scientific References & Verification Note

1. **OpenStax *Physics*, Section 9.3: Simple Machines**
   - URL: https://openstax.org/books/physics/pages/9-3-simple-machines
2. **OpenStax *Physics*, Chapter 9: Key Equations**
   - URL: https://openstax.org/books/physics/pages/9-key-equations

*Source Verification Note:* The URLs and relevant equations—specifically the ideal mechanical advantage of an inclined plane ($\text{IMA} = \frac{L}{h} = \frac{d_e}{d_r} = \frac{F_r}{F_e}$) and the equality of ideal input work ($W_i = F_i d_i$) and output work ($W_o = F_o d_o$) in the absence of friction—were verified via web search and HTTP checks against OpenStax *Physics* Chapter 9.
