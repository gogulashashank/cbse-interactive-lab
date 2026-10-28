import * as THREE from 'three'
import type { RampModelResult } from './rampModel'
import { formatDisplayNumber } from './rampInputValidation'
import type { EveryJouleBook } from './everyJouleBook'

// ---------------------------------------------------------------------------
// 1. Pop-Out Vertex Unfolding GLSL & Cross-Hatched Paper Material
//    Exact port of cutaway-Dhzn16cq.js (ht, Ut, Dt)
// ---------------------------------------------------------------------------

const POP_WORLD_GLSL = /* glsl */ `
uniform mat4 uPopFrame;
uniform mat4 uPopFrameInv;
uniform float uLiftAll;
uniform float uAnchorZ;
vec3 popWorld(vec3 w, float lift){
  vec3 L = (uPopFrameInv * vec4(w, 1.0)).xyz;
  float k = clamp(lift * uLiftAll, 0.0, 1.0);
  float c = mix(0.28, 1.0, k);
  float dz = L.z - uAnchorZ;
  vec3 F = vec3(
    L.x,
    L.y * k + max(0.0, L.y) * (1.0 - k) * 0.03,
    uAnchorZ + dz * c - L.y * (1.0 - k) * 0.58
  );
  return (uPopFrame * vec4(F, 1.0)).xyz;
}
`

export interface PopoutSharedUniforms {
  uTime: { value: number }
  uClock: { value: number }
  uDrawSpan: { value: number }
  uFillAlpha: { value: number }
  uResolution: { value: THREE.Vector2 }
  uPopFrame: { value: THREE.Matrix4 }
  uPopFrameInv: { value: THREE.Matrix4 }
  uLiftAll: { value: number }
  uAnchorZ: { value: number }
}

export function createPopoutSharedUniforms(): PopoutSharedUniforms {
  return {
    uTime: { value: 0 },
    uClock: { value: 100 },
    uDrawSpan: { value: 0.14 },
    uFillAlpha: { value: 1 },
    uResolution: { value: new THREE.Vector2(1280, 800) },
    uPopFrame: { value: new THREE.Matrix4() },
    uPopFrameInv: { value: new THREE.Matrix4() },
    uLiftAll: { value: 1 },
    uAnchorZ: { value: 0 },
  }
}

export function createPaperMaterial(
  shared: PopoutSharedUniforms,
  tintHex: string | number = 0xf4ecdc,
  hatchStrength = 0.2,
  lift = 1
): THREE.ShaderMaterial {
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: shared.uTime,
      uFillAlpha: shared.uFillAlpha,
      uTint: { value: new THREE.Color(tintHex) },
      uHatch: { value: hatchStrength },
      uPopFrame: shared.uPopFrame,
      uPopFrameInv: shared.uPopFrameInv,
      uLiftAll: shared.uLiftAll,
      uAnchorZ: shared.uAnchorZ,
      uLift: { value: lift },
    },
    vertexShader: /* glsl */ `
      uniform float uLift;
      ${POP_WORLD_GLSL}
      varying vec3 vWorld;
      varying vec3 vNormalW;
      void main(){
        vec4 w = modelMatrix * vec4(position, 1.0);
        vec3 pw = popWorld(w.xyz, uLift);
        vWorld = pw;
        vNormalW = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * viewMatrix * vec4(pw, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uTint;
      uniform float uFillAlpha;
      uniform float uHatch;
      varying vec3 vWorld;
      varying vec3 vNormalW;
      float hash(vec2 p){
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }
      void main(){
        vec3 L = normalize(vec3(-0.35, 0.8, 0.45));
        float ndl = clamp(dot(vNormalW, L), 0.0, 1.0);
        float shade = 0.68 + 0.34 * ndl;
        vec3 col = uTint * shade;
        float grain = (hash(floor(gl_FragCoord.xy * 0.7)) - 0.5) * 0.035;
        col += grain;
        float dark = 1.0 - ndl;
        if(uHatch > 0.01 && dark > 0.32){
          float s = gl_FragCoord.x + gl_FragCoord.y;
          float h1 = step(0.82, fract(s * 0.16));
          float h2 = dark > 0.6 ? step(0.84, fract((gl_FragCoord.x - gl_FragCoord.y) * 0.14)) : 0.0;
          float h = clamp(h1 + h2, 0.0, 1.0) * uHatch * smoothstep(0.32, 0.85, dark);
          col = mix(col, vec3(0.11, 0.14, 0.20), h * 0.55);
        }
        gl_FragColor = vec4(col, uFillAlpha);
      }
    `,
    transparent: true,
    depthWrite: true,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 2,
  })
  return mat
}

// ---------------------------------------------------------------------------
// 2. Screen-Space Mitered 3D Ink Line Engine & PenScheduler
//    Exact port of cutaway-Dhzn16cq.js (Ft, U, Xt)
// ---------------------------------------------------------------------------

export class PenScheduler {
  t = 0
  take(dur = 0.06, gap = 0.008): number {
    const start = this.t
    this.t += dur * 0.55 + gap
    return start
  }
  mark(): number {
    return this.t
  }
}

const INK_VERTEX_SHADER = /* glsl */ `
attribute vec3 aPrev;
attribute vec3 aCurr;
attribute vec3 aNext;
attribute float aSide;
attribute float aArc;
attribute float aTotalLen;
attribute float aBorn;
attribute float aWeight;
attribute float aLift;

uniform vec2 uResolution;
uniform float uTime;
uniform float uClock;
uniform float uDrawSpan;
uniform float uBaseWidth;
${POP_WORLD_GLSL}

varying float vSide;
varying float vProgress;
varying float vLocalProg;
varying float vSeed;

float hash1(float x){ return fract(sin(x * 91.7) * 43758.5453); }

vec4 toClip(vec3 p){
  vec4 w = modelMatrix * vec4(p, 1.0);
  vec3 pw = popWorld(w.xyz, aLift);
  return projectionMatrix * viewMatrix * vec4(pw, 1.0);
}

void main(){
  float localProg = clamp((uClock - aBorn) / max(0.0001, uDrawSpan), 0.0, 1.0);
  vLocalProg = localProg;
  float u = aTotalLen > 0.0001 ? aArc / aTotalLen : 0.0;
  vProgress = u - localProg;
  vSide = aSide;
  vSeed = aBorn * 13.7 + aArc * 0.17;

  vec4 cPrev = toClip(aPrev);
  vec4 cCurr = toClip(aCurr);
  vec4 cNext = toClip(aNext);

  vec2 sPrev = (cPrev.xy / max(0.0001, cPrev.w)) * uResolution * 0.5;
  vec2 sCurr = (cCurr.xy / max(0.0001, cCurr.w)) * uResolution * 0.5;
  vec2 sNext = (cNext.xy / max(0.0001, cNext.w)) * uResolution * 0.5;

  vec2 d1 = sCurr - sPrev;
  vec2 d2 = sNext - sCurr;
  float l1 = length(d1);
  float l2 = length(d2);
  d1 = l1 > 0.0001 ? d1 / l1 : vec2(1.0, 0.0);
  d2 = l2 > 0.0001 ? d2 / l2 : d1;
  if(l1 <= 0.0001) d1 = d2;

  vec2 n1 = vec2(-d1.y, d1.x);
  vec2 n2 = vec2(-d2.y, d2.x);
  vec2 miter = normalize(n1 + n2);
  float denom = max(0.38, dot(miter, n1));
  float miterLen = min(2.2, 1.0 / denom);

  float taper = sin(clamp(u, 0.0, 1.0) * 3.14159265);
  taper = mix(0.62, 1.0, pow(taper, 0.45));
  float grain = 0.90 + 0.22 * sin(aArc * 0.55 + aBorn * 19.0)
                    + 0.10 * sin(aArc * 1.9 + aBorn * 7.3);
  float tip = smoothstep(0.0, 0.09, localProg - u);

  float px = uBaseWidth * aWeight * taper * grain * mix(0.35, 1.0, tip);
  vec2 offsetPx = miter * (aSide * px * 0.5 * miterLen);

  float boil = 0.35 * sin(uTime * 2.3 + aArc * 0.25 + hash1(aBorn) * 6.28);
  offsetPx += n1 * boil * 0.25;

  vec4 clip = cCurr;
  clip.xy += (offsetPx / (uResolution * 0.5)) * clip.w;
  clip.z -= 0.00035 * clip.w;
  gl_Position = clip;
}
`

const INK_FRAGMENT_SHADER = /* glsl */ `
uniform vec3 uInkColor;
uniform float uOpacity;
varying float vSide;
varying float vProgress;
varying float vLocalProg;
varying float vSeed;

float hash(vec2 p){
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main(){
  if(vLocalProg <= 0.001) discard;
  if(vProgress > 0.0) discard;
  float d = abs(vSide);
  float n = (hash(floor(gl_FragCoord.xy * 0.85) + vSeed) - 0.5) * 0.28;
  float alpha = 1.0 - smoothstep(0.55 + n * 0.35, 1.0, d);
  float tipFade = smoothstep(0.0, -0.06, vProgress);
  alpha *= mix(0.65, 1.0, tipFade);
  if(alpha < 0.05) discard;
  gl_FragColor = vec4(uInkColor, alpha * uOpacity);
}
`

export interface PolylineEntry {
  pts: number[][]
  born: number
  weight: number
  lift: number
}

export class InkLineSet {
  shared: PopoutSharedUniforms
  polylines: PolylineEntry[] = []
  mesh: THREE.Mesh
  material: THREE.ShaderMaterial

  constructor(
    shared: PopoutSharedUniforms,
    opts: { color?: string | number; baseWidth?: number; opacity?: number } = {}
  ) {
    this.shared = shared
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uResolution: shared.uResolution,
        uTime: shared.uTime,
        uClock: shared.uClock,
        uDrawSpan: shared.uDrawSpan,
        uPopFrame: shared.uPopFrame,
        uPopFrameInv: shared.uPopFrameInv,
        uLiftAll: shared.uLiftAll,
        uAnchorZ: shared.uAnchorZ,
        uBaseWidth: { value: opts.baseWidth ?? 2.3 },
        uInkColor: { value: new THREE.Color(opts.color ?? '#1c2433') },
        uOpacity: { value: opts.opacity ?? 0.96 },
      },
      vertexShader: INK_VERTEX_SHADER,
      fragmentShader: INK_FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    })
    this.mesh = new THREE.Mesh(new THREE.BufferGeometry(), this.material)
    this.mesh.frustumCulled = false
    this.mesh.renderOrder = 2
  }

  clear(): void {
    this.polylines.length = 0
  }

  addPolyline(
    pts: (THREE.Vector3 | number[])[],
    opts: { born?: number; weight?: number; lift?: number } = {}
  ): void {
    if (!pts || pts.length < 2) return
    const born = opts.born ?? 0
    const weight = opts.weight ?? 1
    const lift = opts.lift ?? 1
    const clean = pts.map((p) => (Array.isArray(p) ? [p[0], p[1], p[2]] : [p.x, p.y, p.z]))
    this.polylines.push({ pts: clean, born, weight, lift })
  }

  addSegment(
    a: THREE.Vector3 | number[],
    b: THREE.Vector3 | number[],
    opts: { born?: number; weight?: number; lift?: number; subdiv?: number } = {}
  ): void {
    const p0 = Array.isArray(a) ? a : [a.x, a.y, a.z]
    const p1 = Array.isArray(b) ? b : [b.x, b.y, b.z]
    const n = opts.subdiv ?? 6
    const pts: number[][] = []
    for (let i = 0; i <= n; i++) {
      const t = i / n
      pts.push([p0[0] + (p1[0] - p0[0]) * t, p0[1] + (p1[1] - p0[1]) * t, p0[2] + (p1[2] - p0[2]) * t])
    }
    this.addPolyline(pts, opts)
  }

  addLoop(
    pts: (THREE.Vector3 | number[])[],
    opts: { born?: number; weight?: number; lift?: number; subdivPerEdge?: number } = {}
  ): void {
    if (pts.length < 2) return
    const sub = opts.subdivPerEdge ?? 4
    const clean = pts.map((p) => (Array.isArray(p) ? p : [p.x, p.y, p.z]))
    const closed = [...clean, clean[0]]
    const expanded: number[][] = []
    for (let i = 0; i < closed.length - 1; i++) {
      const a = closed[i]
      const b = closed[i + 1]
      const steps = i === closed.length - 2 ? sub : sub - 1
      for (let s = 0; s <= steps; s++) {
        const t = s / sub
        expanded.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t])
      }
    }
    this.addPolyline(expanded, opts)
  }

  addCircleXZ(
    cx: number,
    y: number,
    cz: number,
    r: number,
    segs = 28,
    opts: { born?: number; weight?: number; lift?: number } = {}
  ): void {
    const pts: number[][] = []
    for (let i = 0; i <= segs; i++) {
      const a = (i / segs) * Math.PI * 2
      pts.push([cx + Math.cos(a) * r, y, cz + Math.sin(a) * r])
    }
    this.addPolyline(pts, opts)
  }

  addBoxEdges(
    cx: number,
    cy: number,
    cz: number,
    sx: number,
    sy: number,
    sz: number,
    pen: PenScheduler,
    opts: { weight?: number; lift?: number; dur?: number } = {}
  ): void {
    const hx = sx * 0.5
    const hy = sy * 0.5
    const hz = sz * 0.5
    const c = [
      [cx - hx, cy - hy, cz - hz],
      [cx + hx, cy - hy, cz - hz],
      [cx + hx, cy - hy, cz + hz],
      [cx - hx, cy - hy, cz + hz],
      [cx - hx, cy + hy, cz - hz],
      [cx + hx, cy + hy, cz - hz],
      [cx + hx, cy + hy, cz + hz],
      [cx - hx, cy + hy, cz + hz],
    ]
    const edges = [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
      [4, 5],
      [5, 6],
      [6, 7],
      [7, 4],
      [0, 4],
      [1, 5],
      [2, 6],
      [3, 7],
    ]
    const w = opts.weight ?? 1
    const lift = opts.lift ?? 1
    const dur = opts.dur ?? 0.045
    for (const [i, j] of edges) {
      this.addSegment(c[i], c[j], { born: pen.take(dur, 0.004), weight: w, lift })
    }
  }

  build(): THREE.Mesh {
    let totalVerts = 0
    let totalIndices = 0
    for (const poly of this.polylines) {
      const n = poly.pts.length
      totalVerts += n * 2
      totalIndices += (n - 1) * 6
    }
    const aPrev = new Float32Array(totalVerts * 3)
    const aCurr = new Float32Array(totalVerts * 3)
    const aNext = new Float32Array(totalVerts * 3)
    const aSide = new Float32Array(totalVerts)
    const aArc = new Float32Array(totalVerts)
    const aTotalLen = new Float32Array(totalVerts)
    const aBorn = new Float32Array(totalVerts)
    const aWeight = new Float32Array(totalVerts)
    const aLift = new Float32Array(totalVerts)
    const indices = new Uint32Array(totalIndices)

    let vCursor = 0
    let iCursor = 0
    for (const poly of this.polylines) {
      const pts = poly.pts
      const n = pts.length
      const arcs = new Float32Array(n)
      let acc = 0
      for (let i = 1; i < n; i++) {
        const dx = pts[i][0] - pts[i - 1][0]
        const dy = pts[i][1] - pts[i - 1][1]
        const dz = pts[i][2] - pts[i - 1][2]
        acc += Math.hypot(dx, dy, dz)
        arcs[i] = acc
      }
      const total = Math.max(0.0001, acc)
      const baseVertex = vCursor

      for (let i = 0; i < n; i++) {
        const prev = pts[Math.max(0, i - 1)]
        const curr = pts[i]
        const next = pts[Math.min(n - 1, i + 1)]
        for (let s = 0; s < 2; s++) {
          const side = s === 0 ? -1 : 1
          const v3 = vCursor * 3
          aPrev[v3] = prev[0]
          aPrev[v3 + 1] = prev[1]
          aPrev[v3 + 2] = prev[2]
          aCurr[v3] = curr[0]
          aCurr[v3 + 1] = curr[1]
          aCurr[v3 + 2] = curr[2]
          aNext[v3] = next[0]
          aNext[v3 + 1] = next[1]
          aNext[v3 + 2] = next[2]
          aSide[vCursor] = side
          aArc[vCursor] = arcs[i]
          aTotalLen[vCursor] = total
          aBorn[vCursor] = poly.born
          aWeight[vCursor] = poly.weight
          aLift[vCursor] = poly.lift
          vCursor++
        }
      }
      for (let i = 0; i < n - 1; i++) {
        const k = baseVertex + i * 2
        indices[iCursor++] = k
        indices[iCursor++] = k + 1
        indices[iCursor++] = k + 2
        indices[iCursor++] = k + 1
        indices[iCursor++] = k + 3
        indices[iCursor++] = k + 2
      }
    }

    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(aCurr, 3))
    g.setAttribute('aPrev', new THREE.BufferAttribute(aPrev, 3))
    g.setAttribute('aCurr', new THREE.BufferAttribute(aCurr, 3))
    g.setAttribute('aNext', new THREE.BufferAttribute(aNext, 3))
    g.setAttribute('aSide', new THREE.BufferAttribute(aSide, 1))
    g.setAttribute('aArc', new THREE.BufferAttribute(aArc, 1))
    g.setAttribute('aTotalLen', new THREE.BufferAttribute(aTotalLen, 1))
    g.setAttribute('aBorn', new THREE.BufferAttribute(aBorn, 1))
    g.setAttribute('aWeight', new THREE.BufferAttribute(aWeight, 1))
    g.setAttribute('aLift', new THREE.BufferAttribute(aLift, 1))
    g.setIndex(new THREE.BufferAttribute(indices, 1))

    this.mesh.geometry.dispose()
    this.mesh.geometry = g
    return this.mesh
  }
}

// ---------------------------------------------------------------------------
// 3. 3D Glowing Glass Energy Store Jar (Exact port of Ht from cutaway-Dhzn16cq.js)
// ---------------------------------------------------------------------------

export interface EnergyJarOptions {
  radius?: number
  height?: number
  maxJoules?: number
  colorHex?: string
  label?: string
  sublabel?: string
  initialFill?: number
}

export class EnergyJar3D {
  shared: PopoutSharedUniforms
  radius: number
  height: number
  maxJoules: number
  color: THREE.Color
  label: string
  sublabel: string
  fill: number
  targetFill: number
  displayedJoules = -1
  group: THREE.Group
  liquidMesh: THREE.Mesh
  liquidMat: THREE.ShaderMaterial
  glassMesh: THREE.Mesh
  cardCanvas: HTMLCanvasElement
  cardCtx: CanvasRenderingContext2D | null
  cardTex: THREE.CanvasTexture

  constructor(
    shared: PopoutSharedUniforms,
    pen: PenScheduler,
    ink: InkLineSet,
    localOrigin: [number, number, number],
    opts: EnergyJarOptions = {}
  ) {
    this.shared = shared
    this.radius = opts.radius ?? 9.5
    this.height = opts.height ?? 25
    this.maxJoules = opts.maxJoules ?? 100
    this.color = new THREE.Color(opts.colorHex ?? '#8a4dff')
    this.label = opts.label ?? 'Gravitational'
    this.sublabel = opts.sublabel ?? 'Ep · Store'
    this.fill = opts.initialFill ?? 0.04
    this.targetFill = this.fill

    this.group = new THREE.Group()
    this.group.position.set(localOrigin[0], localOrigin[1], localOrigin[2])

    const r = this.radius
    const h = this.height
    const [ox, oy, oz] = localOrigin

    // Ink rings & vertical ribs around the glass jar
    ink.addCircleXZ(ox, oy + 0.3, oz, r * 1.04, 28, {
      born: pen.take(0.06),
      weight: 1.35,
    })
    ink.addCircleXZ(ox, oy + h, oz, r * 0.96, 28, {
      born: pen.take(0.06),
      weight: 1.25,
    })
    ink.addCircleXZ(ox, oy + h + 1.5, oz, r * 0.78, 24, {
      born: pen.take(0.05),
      weight: 1.15,
    })
    for (const ang of [-2.45, -0.7, 0.7, 2.45]) {
      const x = ox + Math.cos(ang) * r
      const z = oz + Math.sin(ang) * r
      ink.addSegment([x, oy + 0.3, z], [x, oy + h, z], {
        born: pen.take(0.04),
        weight: 0.9,
      })
    }
    // Measurement graduation ticks along the front-right glass wall
    for (let i = 1; i <= 4; i++) {
      const y = oy + (h * i) / 5
      const a0 = 0.25
      const a1 = i === 2 || i === 4 ? 0.62 : 0.45
      ink.addSegment(
        [ox + Math.cos(a0) * r * 1.01, y, oz + Math.sin(a0) * r * 1.01],
        [ox + Math.cos(a1) * r * 1.01, y, oz + Math.sin(a1) * r * 1.01],
        { born: pen.take(0.02, 0.002), weight: 0.7 }
      )
    }

    // Glowing swirling liquid cylinder inside jar
    const liqGeo = new THREE.CylinderGeometry(r * 0.88, r * 0.9, h * 0.9, 28, 16, false)
    liqGeo.translate(0, (h * 0.9) * 0.5 + 0.6, 0)
    this.liquidMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: shared.uTime,
        uFillAlpha: shared.uFillAlpha,
        uPopFrame: shared.uPopFrame,
        uPopFrameInv: shared.uPopFrameInv,
        uLiftAll: shared.uLiftAll,
        uAnchorZ: shared.uAnchorZ,
        uFill: { value: this.fill },
        uMaxH: { value: h * 0.9 },
        uColor: { value: this.color },
      },
      vertexShader: /* glsl */ `
        uniform float uTime;
        uniform float uFill;
        uniform float uMaxH;
        ${POP_WORLD_GLSL}
        varying vec3 vLocal;
        varying vec3 vNormalL;
        varying float vRelY;
        void main(){
          float f = clamp(uFill, 0.02, 1.0);
          vec3 p = position;
          float relY = clamp((p.y - 0.6) / max(0.001, uMaxH), 0.0, 1.0);
          p.y = 0.6 + relY * uMaxH * f;
          if(relY > 0.85){
            float slosh = sin(uTime * 3.1 + p.x * 0.35) * 0.32
                        + cos(uTime * 2.4 + p.z * 0.35) * 0.24;
            p.y += slosh * smoothstep(0.02, 0.15, f);
          }
          vLocal = p;
          vRelY = relY;
          vNormalL = normalize(normal);
          vec4 w = modelMatrix * vec4(p, 1.0);
          vec3 pw = popWorld(w.xyz, 1.0);
          gl_Position = projectionMatrix * viewMatrix * vec4(pw, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor;
        uniform float uTime;
        uniform float uFillAlpha;
        uniform float uFill;
        varying vec3 vLocal;
        varying vec3 vNormalL;
        varying float vRelY;
        void main(){
          if(uFill < 0.015) discard;
          float fres = pow(1.0 - abs(dot(vNormalL, vec3(0.0, 0.2, 0.98))), 1.6);
          float topCap = step(0.6, vNormalL.y);
          float depth = mix(0.65, 1.15, vRelY);
          vec3 col = uColor * depth;
          col += uColor * 0.55 * fres;
          col = mix(col, mix(uColor * 1.35, vec3(1.0, 0.98, 0.9), 0.35), topCap * 0.75);
          float b1 = smoothstep(1.2, 0.0, length(vec2(vLocal.x - sin(uTime*1.7)*2.5, mod(vLocal.y - uTime*7.0, 14.0) - 7.0)));
          float b2 = smoothstep(0.9, 0.0, length(vec2(vLocal.z + cos(uTime*2.1)*2.5, mod(vLocal.y - uTime*9.5 + 5.0, 14.0) - 7.0)));
          col += vec3(0.9, 0.95, 1.0) * (b1 + b2) * 0.35;
          float a = mix(0.74, 0.9, fres) * uFillAlpha * smoothstep(0.01, 0.05, uFill);
          gl_FragColor = vec4(col, a);
        }
      `,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    })
    this.liquidMesh = new THREE.Mesh(liqGeo, this.liquidMat)
    this.liquidMesh.renderOrder = 1
    this.group.add(this.liquidMesh)

    // Translucent glass shell
    const glassGeo = new THREE.CylinderGeometry(r * 0.96, r, h, 28, 1, true)
    glassGeo.translate(0, h * 0.5, 0)
    const glassMat = new THREE.ShaderMaterial({
      uniforms: {
        uFillAlpha: shared.uFillAlpha,
        uPopFrame: shared.uPopFrame,
        uPopFrameInv: shared.uPopFrameInv,
        uLiftAll: shared.uLiftAll,
        uAnchorZ: shared.uAnchorZ,
      },
      vertexShader: /* glsl */ `
        ${POP_WORLD_GLSL}
        varying vec3 vNormalW;
        varying vec3 vViewDir;
        void main(){
          vec4 w = modelMatrix * vec4(position, 1.0);
          vec3 pw = popWorld(w.xyz, 1.0);
          vNormalW = normalize(mat3(modelMatrix) * normal);
          vViewDir = normalize(cameraPosition - pw);
          gl_Position = projectionMatrix * viewMatrix * vec4(pw, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uFillAlpha;
        varying vec3 vNormalW;
        varying vec3 vViewDir;
        void main(){
          float rim = pow(1.0 - clamp(abs(dot(vNormalW, vViewDir)), 0.0, 1.0), 2.2);
          vec3 col = mix(vec3(0.95, 0.93, 0.87), vec3(1.0, 0.99, 0.95), rim);
          float a = (0.08 + 0.32 * rim) * uFillAlpha;
          gl_FragColor = vec4(col, a);
        }
      `,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    })
    this.glassMesh = new THREE.Mesh(glassGeo, glassMat)
    this.glassMesh.renderOrder = 2
    this.group.add(this.glassMesh)

    // Paper base disc
    const baseGeo = new THREE.CylinderGeometry(r * 1.04, r * 1.06, 0.7, 24)
    baseGeo.translate(0, 0.35, 0)
    const baseMesh = new THREE.Mesh(baseGeo, createPaperMaterial(shared, 0xe8dec8, 0.25))
    this.group.add(baseMesh)

    // Tilted paper label card in front of the jar
    this.cardCanvas = document.createElement('canvas')
    this.cardCanvas.width = 256
    this.cardCanvas.height = 112
    this.cardCtx = this.cardCanvas.getContext('2d')
    this.cardTex = new THREE.CanvasTexture(this.cardCanvas)
    this.cardTex.colorSpace = THREE.SRGBColorSpace
    this.cardTex.anisotropy = 4

    const cardW = r * 2.15
    const cardH = cardW * (112 / 256)
    const cardGeo = new THREE.PlaneGeometry(cardW, cardH)
    const cardMat = new THREE.MeshBasicMaterial({
      map: this.cardTex,
      transparent: true,
      depthWrite: false,
    })
    const cardMesh = new THREE.Mesh(cardGeo, cardMat)
    cardMesh.position.set(0, -1.8, r + 4.4)
    cardMesh.rotation.x = -0.78
    cardMesh.renderOrder = 3
    this.group.add(cardMesh)

    this.redrawCard(0)
  }

  setJoules(joules: number, immediate = false): void {
    const f = Math.max(0, Math.min(1, joules / this.maxJoules))
    this.targetFill = f
    if (immediate) this.fill = f
    const rounded = Math.round(joules * 10) / 10
    if (rounded !== this.displayedJoules) {
      this.displayedJoules = rounded
      this.redrawCard(rounded)
    }
  }

  redrawCard(joules: number): void {
    const ctx = this.cardCtx
    if (!ctx) return
    const W = this.cardCanvas.width
    const H = this.cardCanvas.height
    ctx.clearRect(0, 0, W, H)

    ctx.fillStyle = '#f3ead6'
    ctx.strokeStyle = '#1c2433'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.roundRect(6, 6, W - 12, H - 12, 8)
    ctx.fill()
    ctx.stroke()

    // Coloured energy swatch bar on left
    ctx.fillStyle = `#${this.color.getHexString()}`
    ctx.fillRect(14, 14, 10, H - 28)

    // Store title
    ctx.fillStyle = '#1c2433'
    ctx.font = '600 22px "Source Serif 4 Variable", Georgia, serif'
    ctx.textBaseline = 'top'
    ctx.fillText(this.label, 34, 14)

    // Subtitle
    ctx.fillStyle = '#4b5466'
    ctx.font = 'italic 400 17px "Source Serif 4 Variable", Georgia, serif'
    ctx.fillText(this.sublabel, 34, 42)

    // Live Joules in Caveat
    ctx.fillStyle = '#273463'
    ctx.font = '700 31px "Caveat Variable", cursive'
    ctx.textAlign = 'right'
    ctx.fillText(`${formatDisplayNumber(joules)} J`, W - 18, 60)
    ctx.textAlign = 'left'

    this.cardTex.needsUpdate = true
  }

  update(dt: number): void {
    this.fill += (this.targetFill - this.fill) * (1 - Math.exp(-dt * 7))
    this.liquidMat.uniforms.uFill.value = this.fill
  }
}

// ---------------------------------------------------------------------------
// 4. 3D Glowing Energy Stream + Travelling Light Beads
//    Exact port of stream-D0IaxomV.js (Z)
// ---------------------------------------------------------------------------

export interface EnergyStreamOptions {
  radius?: number
  beads?: number
  beadRadius?: number
  hueStart?: number
  hueEnd?: number
  speed?: number
}

export class EnergyStream3D {
  shared: PopoutSharedUniforms
  group: THREE.Group
  curve: THREE.Curve<THREE.Vector3>
  radius: number
  beadCount: number
  beadRadius: number
  speed: number
  intensity = 0
  targetIntensity = 0
  phase = 0
  tubeMat: THREE.ShaderMaterial
  tubeMesh: THREE.Mesh
  beadMat: THREE.ShaderMaterial
  beads: THREE.InstancedMesh
  private dummy = new THREE.Object3D()
  private tmpPos = new THREE.Vector3()

  constructor(
    shared: PopoutSharedUniforms,
    points: [number, number, number][],
    opts: EnergyStreamOptions = {}
  ) {
    this.shared = shared
    this.group = new THREE.Group()
    this.radius = opts.radius ?? 0.9
    this.beadCount = opts.beads ?? 14
    this.beadRadius = opts.beadRadius ?? this.radius * 1.45
    this.speed = opts.speed ?? 0.65

    const vecs = points.map((p) => new THREE.Vector3(p[0], p[1], p[2]))
    this.curve =
      vecs.length === 3
        ? new THREE.QuadraticBezierCurve3(vecs[0], vecs[1], vecs[2])
        : new THREE.CatmullRomCurve3(vecs)

    const tubeGeo = new THREE.TubeGeometry(this.curve, 44, this.radius, 10, false)
    this.tubeMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: shared.uTime,
        uPopFrame: shared.uPopFrame,
        uPopFrameInv: shared.uPopFrameInv,
        uLiftAll: shared.uLiftAll,
        uAnchorZ: shared.uAnchorZ,
        uIntensity: { value: 0 },
        uPhase: { value: 0 },
        uHueStart: { value: opts.hueStart ?? 0.11 },
        uHueEnd: { value: opts.hueEnd ?? 0.76 },
      },
      vertexShader: /* glsl */ `
        ${POP_WORLD_GLSL}
        varying vec2 vUv;
        varying vec3 vNormalW;
        varying vec3 vViewDir;
        void main(){
          vUv = uv;
          vec4 w = modelMatrix * vec4(position, 1.0);
          vec3 pw = popWorld(w.xyz, 1.0);
          vNormalW = normalize(mat3(modelMatrix) * normal);
          vViewDir = normalize(cameraPosition - pw);
          gl_Position = projectionMatrix * viewMatrix * vec4(pw, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uTime;
        uniform float uIntensity;
        uniform float uPhase;
        uniform float uHueStart;
        uniform float uHueEnd;
        varying vec2 vUv;
        varying vec3 vNormalW;
        varying vec3 vViewDir;

        vec3 hsv2rgb(vec3 c){
          vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
          vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
          return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
        }

        void main(){
          if(uIntensity <= 0.01) discard;
          float u = vUv.x;
          float hue = mix(uHueStart, uHueEnd, u);
          vec3 base = hsv2rgb(vec3(fract(hue), 0.78, 1.0));
          float core = pow(clamp(abs(dot(vNormalW, vViewDir)), 0.0, 1.0), 0.7);
          float pulse = 0.65 + 0.35 * sin((u * 5.0 - uPhase * 3.5) * 6.2831853);
          float ends = smoothstep(0.0, 0.08, u) * smoothstep(1.0, 0.92, u);
          vec3 col = mix(base, vec3(1.0, 0.98, 0.9), core * 0.55) * (0.85 + 0.35 * pulse);
          float a = core * ends * clamp(uIntensity, 0.0, 1.2) * 0.78;
          if(a < 0.02) discard;
          gl_FragColor = vec4(col, a);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    })
    this.tubeMesh = new THREE.Mesh(tubeGeo, this.tubeMat)
    this.tubeMesh.renderOrder = 3
    this.group.add(this.tubeMesh)

    const beadGeo = new THREE.SphereGeometry(this.beadRadius, 10, 8)
    this.beadMat = new THREE.ShaderMaterial({
      uniforms: {
        uPopFrame: shared.uPopFrame,
        uPopFrameInv: shared.uPopFrameInv,
        uLiftAll: shared.uLiftAll,
        uAnchorZ: shared.uAnchorZ,
        uIntensity: { value: 0 },
        uHueStart: { value: opts.hueStart ?? 0.11 },
        uHueEnd: { value: opts.hueEnd ?? 0.76 },
      },
      vertexShader: /* glsl */ `
        attribute float aU;
        ${POP_WORLD_GLSL}
        varying float vU;
        varying vec3 vNormalL;
        void main(){
          vU = aU;
          vNormalL = normal;
          vec4 w = modelMatrix * instanceMatrix * vec4(position, 1.0);
          vec3 pw = popWorld(w.xyz, 1.0);
          gl_Position = projectionMatrix * viewMatrix * vec4(pw, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uIntensity;
        uniform float uHueStart;
        uniform float uHueEnd;
        varying float vU;
        varying vec3 vNormalL;
        vec3 hsv2rgb(vec3 c){
          vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
          vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
          return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
        }
        void main(){
          if(uIntensity <= 0.02) discard;
          float hue = mix(uHueStart, uHueEnd, vU);
          vec3 col = mix(hsv2rgb(vec3(fract(hue), 0.7, 1.0)), vec3(1.0, 0.99, 0.92), 0.55);
          float ends = smoothstep(0.0, 0.08, vU) * smoothstep(1.0, 0.92, vU);
          float a = ends * clamp(uIntensity, 0.0, 1.2) * 0.95;
          gl_FragColor = vec4(col, a);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    this.beads = new THREE.InstancedMesh(beadGeo, this.beadMat, this.beadCount)
    this.beads.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    const uAttr = new Float32Array(this.beadCount)
    beadGeo.setAttribute('aU', new THREE.InstancedBufferAttribute(uAttr, 1))
    this.beads.renderOrder = 4
    this.group.add(this.beads)
  }

  rebuildCurve(points: [number, number, number][]): void {
    const vecs = points.map((p) => new THREE.Vector3(p[0], p[1], p[2]))
    this.curve =
      vecs.length === 3
        ? new THREE.QuadraticBezierCurve3(vecs[0], vecs[1], vecs[2])
        : new THREE.CatmullRomCurve3(vecs)
    const nextGeo = new THREE.TubeGeometry(this.curve, 44, this.radius, 10, false)
    this.tubeMesh.geometry.dispose()
    this.tubeMesh.geometry = nextGeo
  }

  setFlow(intensity: number, speed?: number): void {
    this.targetIntensity = Math.max(0, Math.min(1.3, intensity))
    if (speed !== undefined) this.speed = speed
  }

  update(dt: number): void {
    this.intensity += (this.targetIntensity - this.intensity) * (1 - Math.exp(-dt * 9))
    this.phase += dt * this.speed * (0.25 + 0.95 * this.intensity)
    this.tubeMat.uniforms.uIntensity.value = this.intensity
    this.tubeMat.uniforms.uPhase.value = this.phase
    this.beadMat.uniforms.uIntensity.value = this.intensity

    const vis = this.intensity > 0.015 && this.shared.uLiftAll.value > 0.5
    this.group.visible = vis
    if (!vis) return

    const uAttr = this.beads.geometry.getAttribute('aU') as THREE.InstancedBufferAttribute
    for (let i = 0; i < this.beadCount; i++) {
      const u = (((i / this.beadCount) + this.phase) % 1 + 1) % 1
      uAttr.setX(i, u)
      this.curve.getPoint(u, this.tmpPos)
      const s = (0.65 + 0.45 * Math.sin(u * Math.PI)) * Math.min(1.15, 0.5 + this.intensity * 0.7)
      this.dummy.position.copy(this.tmpPos)
      this.dummy.scale.setScalar(s)
      this.dummy.updateMatrix()
      this.beads.setMatrixAt(i, this.dummy.matrix)
    }
    uAttr.needsUpdate = true
    this.beads.instanceMatrix.needsUpdate = true
  }
}

// ---------------------------------------------------------------------------
// 5. Rotating Dashed Blue-Ink Interactive Target Ring & 3D Paper Tag
//    Exact port of marks-NmdeUtT4.js (J, F)
// ---------------------------------------------------------------------------

export class DashedTargetRing3D {
  shared: PopoutSharedUniforms
  group: THREE.Group
  mesh: THREE.Mesh
  mat: THREE.ShaderMaterial
  active = true

  constructor(
    shared: PopoutSharedUniforms,
    localPos: [number, number, number],
    radius = 6.5,
    colorHex = '#273463'
  ) {
    this.shared = shared
    this.group = new THREE.Group()
    this.group.position.set(localPos[0], localPos[1], localPos[2])

    const geo = new THREE.RingGeometry(radius * 0.78, radius * 1.12, 40)
    geo.rotateX(-Math.PI / 2)
    this.mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: shared.uTime,
        uFillAlpha: shared.uFillAlpha,
        uColor: { value: new THREE.Color(colorHex) },
        uActive: { value: 1 },
      },
      vertexShader: /* glsl */ `
        varying vec2 vPos;
        void main(){
          vPos = position.xz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uTime;
        uniform float uFillAlpha;
        uniform vec3 uColor;
        uniform float uActive;
        varying vec2 vPos;
        void main(){
          float ang = atan(vPos.y, vPos.x);
          float dash = step(0.15, sin(ang * 8.0 - uTime * 2.2));
          float pulse = 0.55 + 0.35 * sin(uTime * 3.0);
          float a = dash * pulse * uFillAlpha * uActive * 0.75;
          if(a < 0.05) discard;
          gl_FragColor = vec4(uColor, a);
        }
      `,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    })
    this.mesh = new THREE.Mesh(geo, this.mat)
    this.mesh.renderOrder = 3
    this.group.add(this.mesh)
  }

  setActive(active: boolean): void {
    this.active = active
  }

  update(): void {
    const target = this.active && this.shared.uLiftAll.value > 0.85 ? 1 : 0
    this.mat.uniforms.uActive.value += (target - this.mat.uniforms.uActive.value) * 0.15
  }
}

export class PaperTag3D {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D | null
  tex: THREE.CanvasTexture
  mesh: THREE.Mesh
  lastText = ''

  constructor(
    localPos: [number, number, number],
    opts: { width?: number; height?: number; tiltX?: number } = {}
  ) {
    const wMm = opts.width ?? 42
    const hMm = opts.height ?? 11.5
    this.canvas = document.createElement('canvas')
    this.canvas.width = 360
    this.canvas.height = Math.round(360 * (hMm / wMm))
    this.ctx = this.canvas.getContext('2d')
    this.tex = new THREE.CanvasTexture(this.canvas)
    this.tex.colorSpace = THREE.SRGBColorSpace
    this.tex.anisotropy = 4

    const geo = new THREE.PlaneGeometry(wMm, hMm)
    const mat = new THREE.MeshBasicMaterial({
      map: this.tex,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    })
    this.mesh = new THREE.Mesh(geo, mat)
    this.mesh.position.set(localPos[0], localPos[1], localPos[2])
    this.mesh.rotation.x = opts.tiltX ?? -0.58
    this.mesh.renderOrder = 4
  }

  setText(line1: string, line2 = '', accentHex = '#273463'): void {
    const key = `${line1}|${line2}|${accentHex}`
    if (key === this.lastText) return
    this.lastText = key
    const ctx = this.ctx
    if (!ctx) return
    const W = this.canvas.width
    const H = this.canvas.height
    ctx.clearRect(0, 0, W, H)

    ctx.fillStyle = 'rgba(244, 236, 218, 0.95)'
    ctx.strokeStyle = 'rgba(28, 36, 51, 0.72)'
    ctx.lineWidth = 2.5
    ctx.beginPath()
    ctx.roundRect(4, 4, W - 8, H - 8, 7)
    ctx.fill()
    ctx.stroke()

    ctx.fillStyle = '#1c2433'
    ctx.font = '600 20px "Source Serif 4 Variable", Georgia, serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    if (line2) {
      ctx.fillText(line1, W * 0.5, H * 0.34)
      ctx.fillStyle = accentHex
      ctx.font = '700 23px "Caveat Variable", cursive'
      ctx.fillText(line2, W * 0.5, H * 0.72)
    } else {
      ctx.fillStyle = accentHex
      ctx.font = '700 24px "Caveat Variable", cursive'
      ctx.fillText(line1, W * 0.5, H * 0.52)
    }
    this.tex.needsUpdate = true
  }
}

// ---------------------------------------------------------------------------
// 6. Side-by-Side 3D Apparatus:
//    Rig A (Direct Vertical Lift) vs. Rig B (Interactive Frictionless Ramp)
//    + Two Glowing Glass Energy Store Jars + Flowing Energy Streams
// ---------------------------------------------------------------------------

export interface PopoutHitTarget {
  id: 'start' | 'crate' | 'foot' | 'jarRamp' | 'jarLift' | 'rigLift'
  mesh: THREE.Object3D
  cursor: 'pointer' | 'grab'
  lens: {
    kicker: string
    title: string
    bodyHtml: string
  }
}

export interface RampComparisonPopout {
  root: THREE.Group
  shared: PopoutSharedUniforms
  maxClock: number
  hitTargets: PopoutHitTarget[]
  placeOnPage: (book: EveryJouleBook, spread: number) => void
  syncPhysics: (
    result: RampModelResult,
    progress: number,
    status: 'idle' | 'playing' | 'paused' | 'completed'
  ) => void
  triggerRun: () => void
  projectWorldToRampProgress: (worldPoint: THREE.Vector3) => number
  projectWorldToRampLengthM: (worldPoint: THREE.Vector3, heightM: number) => number
  update: (dt: number) => void
}

export function createRampComparisonPopout(): RampComparisonPopout {
  const shared = createPopoutSharedUniforms()
  shared.uAnchorZ.value = -56

  const root = new THREE.Group()
  root.matrixAutoUpdate = false

  const pen = new PenScheduler()
  const ink = new InkLineSet(shared, { color: '#1c2433', baseWidth: 2.35 })
  const blueInk = new InkLineSet(shared, { color: '#273463', baseWidth: 2.6 })
  const redInk = new InkLineSet(shared, { color: '#b8412e', baseWidth: 2.6 })

  const paperBase = createPaperMaterial(shared, 0xeee4ce, 0.16, 1)
  const paperWarm = createPaperMaterial(shared, 0xf3ead7, 0.22, 1)
  const paperCrateRamp = createPaperMaterial(shared, 0xd8a15d, 0.28, 1)
  const paperCrateLift = createPaperMaterial(shared, 0xc78f52, 0.28, 1)
  const paperButton = createPaperMaterial(shared, 0xb8412e, 0.15, 1)

  // --- Baseplate & Rear Energy Store Shelf (fits cleanly in upper stage v = 24..142 mm) ---
  const baseGeo = new THREE.BoxGeometry(152, 2.2, 108)
  baseGeo.translate(0, 1.1, 0)
  const baseMesh = new THREE.Mesh(baseGeo, paperBase)
  root.add(baseMesh)
  ink.addBoxEdges(0, 1.1, 0, 152, 2.2, 108, pen, { weight: 1.4, dur: 0.04 })

  // Rear shelf holding the two Glowing Energy Store Jars (Ep · Direct Lift & Ep · Ramp Climb)
  const shelfGeo = new THREE.BoxGeometry(118, 3.6, 26)
  shelfGeo.translate(12, 1.8, -42)
  const shelfMesh = new THREE.Mesh(shelfGeo, paperWarm)
  root.add(shelfMesh)
  ink.addBoxEdges(12, 1.8, -42, 118, 3.6, 26, pen, { weight: 1.2, dur: 0.035 })

  // Two Glowing Glass Energy Store Jars on the rear shelf
  const jarLift = new EnergyJar3D(shared, pen, ink, [-18, 3.6, -42], {
    radius: 9.2,
    height: 25,
    maxJoules: 120,
    colorHex: '#8a4dff',
    label: 'Direct Lift Ep',
    sublabel: 'Vertical 1.0 m store',
    initialFill: 0.03,
  })
  root.add(jarLift.group)

  const jarRamp = new EnergyJar3D(shared, pen, ink, [40, 3.6, -42], {
    radius: 9.2,
    height: 25,
    maxJoules: 120,
    colorHex: '#8a4dff',
    label: 'Ramp Climb Ep',
    sublabel: 'Slope 1.0 m store',
    initialFill: 0.03,
  })
  root.add(jarRamp.group)

  // --- RIG A: Direct Vertical Lift Hoist (Front-Left) ---
  // Shows lifting the exact same crate straight up to h (default 1.0 m -> 22 mm in scene)
  const rigAX = -52
  const rigAZ = 14
  const pillarGeo = new THREE.BoxGeometry(4.2, 34, 4.2)
  pillarGeo.translate(rigAX - 9, 19.2, rigAZ)
  root.add(new THREE.Mesh(pillarGeo, paperWarm))
  ink.addBoxEdges(rigAX - 9, 19.2, rigAZ, 4.2, 34, 4.2, pen, { weight: 1.15 })

  const armGeo = new THREE.BoxGeometry(14, 2.6, 4.2)
  armGeo.translate(rigAX - 3.5, 35.5, rigAZ)
  root.add(new THREE.Mesh(armGeo, paperWarm))
  ink.addBoxEdges(rigAX - 3.5, 35.5, rigAZ, 14, 2.6, 4.2, pen, { weight: 1.15 })

  // Rig A Crate (Direct Lift) + vertical Force Arrow (F_lift = mg)
  const crateLiftGroup = new THREE.Group()
  crateLiftGroup.position.set(rigAX, 6.2, rigAZ)
  root.add(crateLiftGroup)

  const crateLiftGeo = new THREE.BoxGeometry(10.5, 8.2, 10.5)
  const crateLiftMesh = new THREE.Mesh(crateLiftGeo, paperCrateLift)
  crateLiftGroup.add(crateLiftMesh)

  // Vertical Force Arrow above Crate A (always full weight F = mg)
  const liftArrowGroup = new THREE.Group()
  liftArrowGroup.position.set(0, 4.5, 0)
  crateLiftGroup.add(liftArrowGroup)

  const liftShaftGeo = new THREE.CylinderGeometry(0.85, 0.85, 1, 10)
  liftShaftGeo.translate(0, 0.5, 0)
  const liftArrowMat = new THREE.MeshBasicMaterial({ color: '#b8412e' })
  const liftShaftMesh = new THREE.Mesh(liftShaftGeo, liftArrowMat)
  liftShaftMesh.scale.set(1, 18, 1)
  liftArrowGroup.add(liftShaftMesh)

  const liftConeGeo = new THREE.ConeGeometry(2.3, 4.5, 12)
  liftConeGeo.translate(0, 2.25, 0)
  const liftConeMesh = new THREE.Mesh(liftConeGeo, liftArrowMat)
  liftConeMesh.position.y = 18
  liftArrowGroup.add(liftConeMesh)

  const tagLift = new PaperTag3D([rigAX, 4.2, rigAZ + 22], { width: 46, height: 13 })
  tagLift.setText('Direct Lift (1.0 m)', 'F = 98.1 N · W = 98.1 J', '#b8412e')
  root.add(tagLift.mesh)

  // --- RIG B: Interactive Frictionless Ramp (Front-Center to Right) ---
  // Apex is at x = -22, z = 14; foot extends to +X based on rampLengthM!
  const rampApexX = -22
  const rampZ = 14
  const rampWidthZ = 18

  const rampDynamicGroup = new THREE.Group()
  root.add(rampDynamicGroup)

  // Dynamic wedge mesh for the inclined plane
  const rampWedgeMesh = new THREE.Mesh(new THREE.BufferGeometry(), paperWarm)
  rampDynamicGroup.add(rampWedgeMesh)

  // Dynamic ink lines for the ramp wedge, ruler ticks, height post & angle arc
  const rampDynamicInk = new InkLineSet(shared, { color: '#1c2433', baseWidth: 2.35 })
  root.add(rampDynamicInk.mesh)

  // Draggable Ramp Crate (Crate B) + proportional uphill Force Arrow (F_pull = mg sin θ)
  const crateRampGroup = new THREE.Group()
  root.add(crateRampGroup)

  const crateRampGeo = new THREE.BoxGeometry(11.5, 8.6, 11.5)
  const crateRampMesh = new THREE.Mesh(crateRampGeo, paperCrateRamp)
  crateRampGroup.add(crateRampMesh)

  // Uphill Force Arrow attached to front of Crate B (length scales with F_pull / mg!)
  const pullArrowGroup = new THREE.Group()
  pullArrowGroup.position.set(-6.2, 1.0, 0)
  // Points along -X in crate-local space (which is uphill along the ramp!)
  pullArrowGroup.rotation.z = Math.PI / 2
  crateRampGroup.add(pullArrowGroup)

  const pullArrowMat = new THREE.MeshBasicMaterial({ color: '#273463' })
  const pullShaftMesh = new THREE.Mesh(liftShaftGeo.clone(), pullArrowMat)
  const pullConeMesh = new THREE.Mesh(liftConeGeo.clone(), pullArrowMat)
  pullArrowGroup.add(pullShaftMesh)
  pullArrowGroup.add(pullConeMesh)

  // Floating Caveat label above Crate B showing live F_pull
  const crateForceTag = new PaperTag3D([0, 9.8, 0], { width: 38, height: 10.5, tiltX: -0.35 })
  crateRampGroup.add(crateForceTag.mesh)

  // Draggable Ramp Foot Handle at the bottom-right toe of the ramp
  const footHandleGroup = new THREE.Group()
  root.add(footHandleGroup)
  const footKnobGeo = new THREE.CylinderGeometry(4.2, 4.6, 3.2, 20)
  footKnobGeo.translate(0, 1.6, 0)
  const footKnobMesh = new THREE.Mesh(footKnobGeo, createPaperMaterial(shared, 0xd8a15d, 0.2, 1))
  footHandleGroup.add(footKnobMesh)

  const footRing = new DashedTargetRing3D(shared, [0, 0.4, 0], 6.4, '#273463')
  footHandleGroup.add(footRing.group)

  const crateRing = new DashedTargetRing3D(shared, [0, -3.8, 0], 8.2, '#273463')
  crateRampGroup.add(crateRing.group)

  const tagRamp = new PaperTag3D([18, 4.2, rampZ + 24], { width: 56, height: 13.5 })
  tagRamp.setText('2.0 m Ramp (2× easier)', 'F = 49.05 N · W = 98.1 J', '#273463')
  root.add(tagRamp.mesh)

  // --- 3D START / PULL Button on Front-Left of Baseplate ---
  const btnX = -54
  const btnZ = 42
  const btnGroup = new THREE.Group()
  btnGroup.position.set(btnX, 2.2, btnZ)
  root.add(btnGroup)

  const btnPlinthGeo = new THREE.CylinderGeometry(7.2, 7.8, 2.2, 24)
  btnPlinthGeo.translate(0, 1.1, 0)
  btnGroup.add(new THREE.Mesh(btnPlinthGeo, paperWarm))
  ink.addCircleXZ(btnX, 2.4, btnZ, 7.8, 24, { born: pen.take(0.04), weight: 1.2 })

  const btnCapGeo = new THREE.CylinderGeometry(5.4, 5.8, 2.6, 24)
  btnCapGeo.translate(0, 3.2, 0)
  const btnCapMesh = new THREE.Mesh(btnCapGeo, paperButton)
  btnGroup.add(btnCapMesh)
  redInk.addCircleXZ(btnX, 4.5, btnZ, 5.4, 24, { born: pen.take(0.04), weight: 1.3 })

  const btnRing = new DashedTargetRing3D(shared, [btnX, 2.5, btnZ], 9.2, '#273463')
  root.add(btnRing.group)

  const btnTag = new PaperTag3D([btnX + 20, 3.8, btnZ + 2], { width: 32, height: 10.5 })
  btnTag.setText('PULL CRATES', 'click or drag ↗', '#b8412e')
  root.add(btnTag.mesh)

  // --- Glowing Energy Streams from Both Rigs into their Energy Jars ---
  const streamLift = new EnergyStream3D(
    shared,
    [
      [rigAX, 16, rigAZ],
      [-36, 36, -14],
      [-18, 29, -42],
    ],
    { radius: 0.9, beads: 14, hueStart: 0.08, hueEnd: 0.76 }
  )
  root.add(streamLift.group)

  const streamRamp = new EnergyStream3D(
    shared,
    [
      [10, 14, rampZ],
      [28, 36, -14],
      [40, 29, -42],
    ],
    { radius: 0.95, beads: 16, hueStart: 0.12, hueEnd: 0.76 }
  )
  root.add(streamRamp.group)

  // Build static ink meshes
  root.add(ink.build())
  root.add(blueInk.build())
  root.add(redInk.build())

  const maxClock = pen.mark() + 0.25

  // State for geometry & animation
  let lastGeoKey = ''
  let currentHeightMm = 22
  let currentRunMm = 38
  let currentApexX = rampApexX
  let currentFootX = rampApexX + 38
  let currentSlopeAngle = Math.atan2(22, 38)
  let flowBoost = 0
  let lastProgress = 0

  function rebuildRampGeometry(result: RampModelResult): void {
    const key = `${result.heightM.toFixed(3)}:${result.rampLengthM.toFixed(3)}:${result.massKg.toFixed(1)}`
    if (key === lastGeoKey) return
    lastGeoKey = key

    // Scale physical metres into clear, readable mm on the 190×250 mm book page:
    // Height: 1.0 m -> 22 mm (clamped 12..34 mm)
    // Ramp horizontal run: scaled proportionally so 2 m ramp -> ~38 mm, 4 m ramp -> ~74 mm, 8 m ramp -> ~92 mm
    const hMm = Math.max(12, Math.min(34, result.heightM * 22))
    const rawRunMm = Math.max(8, result.horizontalRunM * 20)
    const runMm = Math.min(92, rawRunMm)

    currentHeightMm = hMm
    currentRunMm = runMm
    currentApexX = rampApexX
    currentFootX = rampApexX + runMm
    currentSlopeAngle = Math.atan2(hMm, runMm)

    // Rebuild 3D wedge geometry
    const halfZ = rampWidthZ * 0.5
    const shape = new THREE.Shape()
    shape.moveTo(currentApexX, 2.2)
    shape.lineTo(currentFootX, 2.2)
    shape.lineTo(currentApexX, 2.2 + hMm)
    shape.closePath()

    const extrudeGeo = new THREE.ExtrudeGeometry(shape, {
      depth: rampWidthZ,
      bevelEnabled: false,
    })
    extrudeGeo.translate(0, 0, rampZ - halfZ)
    rampWedgeMesh.geometry.dispose()
    rampWedgeMesh.geometry = extrudeGeo

    // Rebuild dynamic ink outlines + 0.5 m ruler ticks along slope
    rampDynamicInk.clear()
    const y0 = 2.2
    const yTop = 2.2 + hMm
    const zF = rampZ + halfZ
    const zB = rampZ - halfZ

    // Front & back triangles + cross edges
    rampDynamicInk.addLoop(
      [
        [currentApexX, y0, zF],
        [currentFootX, y0, zF],
        [currentApexX, yTop, zF],
      ],
      { born: 0.15, weight: 1.35 }
    )
    rampDynamicInk.addLoop(
      [
        [currentApexX, y0, zB],
        [currentFootX, y0, zB],
        [currentApexX, yTop, zB],
      ],
      { born: 0.18, weight: 1.25 }
    )
    rampDynamicInk.addSegment([currentApexX, yTop, zB], [currentApexX, yTop, zF], {
      born: 0.2,
      weight: 1.35,
    })
    rampDynamicInk.addSegment([currentFootX, y0, zB], [currentFootX, y0, zF], {
      born: 0.22,
      weight: 1.35,
    })

    // 0.5 m graduation ticks across the ramp surface
    const tickStepM = 0.5
    const numTicks = Math.floor(result.rampLengthM / tickStepM)
    for (let i = 1; i <= numTicks; i++) {
      const frac = (i * tickStepM) / result.rampLengthM
      if (frac >= 0.98) continue
      const tx = currentFootX - frac * runMm
      const ty = y0 + frac * hMm + 0.15
      const isWholeMetre = i % 2 === 0
      rampDynamicInk.addSegment(
        [tx, ty, zF - (isWholeMetre ? 5.5 : 3.2)],
        [tx, ty, zF],
        { born: 0.25, weight: isWholeMetre ? 1.2 : 0.85 }
      )
    }

    // Slope angle arc at the foot
    const arcR = Math.min(14, runMm * 0.35)
    const arcPts: number[][] = []
    for (let i = 0; i <= 12; i++) {
      const a = (i / 12) * currentSlopeAngle
      arcPts.push([
        currentFootX - Math.cos(a) * arcR,
        y0 + Math.sin(a) * arcR,
        zF + 0.4,
      ])
    }
    rampDynamicInk.addPolyline(arcPts, { born: 0.28, weight: 1.1 })
    rampDynamicInk.build()

    // Position the draggable foot handle at the ramp toe
    footHandleGroup.position.set(currentFootX + 3.5, 2.2, rampZ)
  }

  const hitTargets: PopoutHitTarget[] = [
    {
      id: 'start',
      mesh: btnCapMesh,
      cursor: 'pointer',
      lens: {
        kicker: 'ACTION · COMPARE BOTH PATHS',
        title: 'Pull Both Crates to the Same Shelf',
        bodyHtml:
          'Click to pull both crates up to the exact same height. Watch the force arrows and the two Gravitational Energy Store jars!',
      },
    },
    {
      id: 'crate',
      mesh: crateRampMesh,
      cursor: 'grab',
      lens: {
        kicker: 'DRAG ALONG SLOPE · RAMP CRATE',
        title: 'Slide the Crate Up & Down the Ramp',
        bodyHtml:
          'Drag the crate along the ramp. Notice how the pulling force arrow is shorter than the direct vertical lift arrow, yet fills the energy jar to the exact same Joules.',
      },
    },
    {
      id: 'foot',
      mesh: footKnobMesh,
      cursor: 'grab',
      lens: {
        kicker: 'DRAG LEFT / RIGHT · RAMP LENGTH',
        title: 'Stretch or Shorten the Ramp (L)',
        bodyHtml:
          'Drag the ramp foot left or right to make the slope gentler or steeper. A longer ramp shrinks the pulling force arrow in proportion!',
      },
    },
    {
      id: 'jarRamp',
      mesh: jarRamp.glassMesh,
      cursor: 'pointer',
      lens: {
        kicker: 'GRAVITATIONAL STORE · RAMP CLIMB',
        title: 'Energy Stored via the Ramp (W = F_pull × L)',
        bodyHtml:
          'Smaller pulling force multiplied by longer ramp distance stores the exact same gravitational potential energy (mgh) as lifting straight up.',
      },
    },
    {
      id: 'jarLift',
      mesh: jarLift.glassMesh,
      cursor: 'pointer',
      lens: {
        kicker: 'GRAVITATIONAL STORE · DIRECT LIFT',
        title: 'Energy Stored via Direct Vertical Lift (W = mg × h)',
        bodyHtml:
          'Lifting straight up requires the full weight force (mg) over the short vertical height (h), storing mgh Joules in the gravitational store.',
      },
    },
    {
      id: 'rigLift',
      mesh: crateLiftMesh,
      cursor: 'pointer',
      lens: {
        kicker: 'REFERENCE RIG · DIRECT VERTICAL LIFT',
        title: 'Lifting Straight Up Without a Ramp',
        bodyHtml:
          'Without a ramp, you must pull with 100% of the crate’s weight (mg) over the vertical height h.',
      },
    },
  ]

  return {
    root,
    shared,
    maxClock,
    hitTargets,
    placeOnPage(book: EveryJouleBook, spread: number) {
      const pCenter = book.pageToWorld(spread, 'right', 96, 84)
      const pRight = book.pageToWorld(spread, 'right', 97, 84)
      const pFront = book.pageToWorld(spread, 'right', 96, 85)
      const xAxis = pRight.clone().sub(pCenter).normalize()
      const zAxis = pFront.clone().sub(pCenter).normalize()
      const yAxis = new THREE.Vector3().crossVectors(zAxis, xAxis).normalize()
      const zOrtho = new THREE.Vector3().crossVectors(xAxis, yAxis).normalize()

      root.matrix.makeBasis(xAxis, yAxis, zOrtho).setPosition(pCenter)
      root.matrixWorldNeedsUpdate = true
      shared.uPopFrame.value.copy(root.matrix)
      shared.uPopFrameInv.value.copy(root.matrix).invert()
    },
    syncPhysics(
      result: RampModelResult,
      progress: number,
      status: 'idle' | 'playing' | 'paused' | 'completed'
    ) {
      rebuildRampGeometry(result)

      // When idle before a run, preview the crates at 32% up the climb so the apparatus looks alive;
      // when playing/paused/completed, follow the exact progress 0..1
      const effProg = status === 'idle' && progress === 0 ? 0.25 : Math.max(0, Math.min(1, progress))

      // 1. Update Rig A (Direct Vertical Lift crate & arrow)
      const liftY = 6.2 + effProg * currentHeightMm
      crateLiftGroup.position.set(rigAX, liftY, rigAZ)

      // Scale vertical force arrow (18 mm reference height for full weight)
      const fullArrowLen = 17.5
      liftShaftMesh.scale.set(1, fullArrowLen, 1)
      liftConeMesh.position.y = fullArrowLen

      // 2. Update Rig B (Ramp crate position along slope & proportional force arrow!)
      const normalX = Math.sin(currentSlopeAngle)
      const normalY = Math.cos(currentSlopeAngle)
      const slopeX = currentFootX - effProg * currentRunMm
      const slopeY = 2.2 + effProg * currentHeightMm
      crateRampGroup.position.set(
        slopeX + normalX * 4.4,
        slopeY + normalY * 4.4,
        rampZ
      )
      crateRampGroup.rotation.z = -currentSlopeAngle

      // Scale the uphill pulling force arrow strictly in proportion to F_pull / weightN (= sin θ)!
      const forceRatio = Math.max(0.12, Math.min(1, result.pullingForceN / result.weightN))
      const pullArrowLen = Math.max(3.2, fullArrowLen * forceRatio)
      pullShaftMesh.scale.set(1, pullArrowLen, 1)
      pullConeMesh.position.y = pullArrowLen

      // Update floating Caveat force tag above the ramp crate
      const maText =
        result.idealMechanicalAdvantage >= 1.05
          ? `${formatDisplayNumber(result.idealMechanicalAdvantage)}× easier`
          : 'vertical'
      crateForceTag.setText(
        `F_pull = ${formatDisplayNumber(result.pullingForceN)} N`,
        `(${maText})`,
        '#273463'
      )

      // Update front paper tags
      tagLift.setText(
        `Direct Lift · d = ${formatDisplayNumber(result.heightM)} m`,
        `F = ${formatDisplayNumber(result.verticalLiftForceN)} N · W = ${formatDisplayNumber(result.verticalLiftWorkJ)} J`,
        '#b8412e'
      )
      tagRamp.setText(
        `Ramp · L = ${formatDisplayNumber(result.rampLengthM)} m (${maText})`,
        `F = ${formatDisplayNumber(result.pullingForceN)} N · W = ${formatDisplayNumber(result.appliedWorkJ)} J`,
        '#273463'
      )

      // 3. Update both Glowing Energy Store Jars (both fill to the exact same mgh Joules!)
      const maxScaleJ = Math.max(100, result.appliedWorkJ * 1.18)
      jarLift.maxJoules = maxScaleJ
      jarRamp.maxJoules = maxScaleJ
      const currentJoules =
        status === 'idle' && progress === 0
          ? result.potentialEnergyGainJ
          : result.appliedWorkJ * effProg
      jarLift.setJoules(currentJoules)
      jarRamp.setJoules(currentJoules)

      // 4. Update Energy Stream curves & glowing bead flow intensity
      streamLift.rebuildCurve([
        [rigAX, liftY + 2, rigAZ],
        [-36, 36, -14],
        [-18, 29, -42],
      ])
      streamRamp.rebuildCurve([
        [crateRampGroup.position.x, crateRampGroup.position.y + 2, rampZ],
        [24, 36, -14],
        [40, 29, -42],
      ])

      const deltaProg = Math.abs(progress - lastProgress)
      lastProgress = progress
      if (deltaProg > 0.0005 || status === 'playing') {
        flowBoost = Math.min(1.25, flowBoost + 0.35)
      }
      const baseFlow = status === 'playing' ? 1.1 : flowBoost > 0.05 ? flowBoost : 0.28
      streamLift.setFlow(baseFlow, 0.7)
      streamRamp.setFlow(baseFlow, 0.7)
    },
    triggerRun() {
      flowBoost = 1.25
    },
    projectWorldToRampProgress(worldPoint: THREE.Vector3): number {
      const local = worldPoint.clone().applyMatrix4(shared.uPopFrameInv.value)
      const dx = currentFootX - local.x
      return Math.max(0, Math.min(1, dx / Math.max(1, currentRunMm)))
    },
    projectWorldToRampLengthM(worldPoint: THREE.Vector3, heightM: number): number {
      const local = worldPoint.clone().applyMatrix4(shared.uPopFrameInv.value)
      const desiredRunMm = Math.max(6, Math.min(92, local.x - currentApexX))
      const runM = desiredRunMm / 20
      const lenM = Math.hypot(heightM, runM)
      const snapped = Math.round(lenM * 10) / 10
      return Math.max(Math.max(0.5, heightM), Math.min(8.0, snapped))
    },
    update(dt: number) {
      shared.uTime.value += dt
      flowBoost = Math.max(0, flowBoost - dt * 0.85)
      jarLift.update(dt)
      jarRamp.update(dt)
      streamLift.update(dt)
      streamRamp.update(dt)
      footRing.update()
      crateRing.update()
      btnRing.update()
    },
  }
}
