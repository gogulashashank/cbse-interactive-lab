import * as THREE from 'three'
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

// Deterministic PRNG & 2D Perlin noise from Every Joule (main.js)
export function createSeededRandom(seed = 1): () => number {
  let s = seed >>> 0 || 1
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

export function createPerlin2D(seed = 1, period = 0): (x: number, y: number) => number {
  const rng = createSeededRandom(seed * 977 + 13)
  const perm = new Uint8Array(512)
  const p = Array.from({ length: 256 }, (_, idx) => idx)
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    const tmp = p[i]
    p[i] = p[j]
    p[j] = tmp
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255]
  const gx = new Float32Array(256)
  const gy = new Float32Array(256)
  for (let i = 0; i < 256; i++) {
    const a = rng() * Math.PI * 2
    gx[i] = Math.cos(a)
    gy[i] = Math.sin(a)
  }
  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10)
  const wrap = period > 0 ? period : 256

  return (x: number, y: number) => {
    const xi = Math.floor(x)
    const yi = Math.floor(y)
    const xf = x - xi
    const yf = y - yi
    const X0 = ((xi % wrap) + wrap) % wrap
    const Y0 = ((yi % wrap) + wrap) % wrap
    const X1 = (X0 + 1) % wrap
    const Y1 = (Y0 + 1) % wrap
    const hash = (i: number, j: number) => perm[(perm[i & 255] + j) & 255]
    const grad = (h: number, dx: number, dy: number) => gx[h] * dx + gy[h] * dy
    const u = fade(xf)
    const v = fade(yf)
    const n00 = grad(hash(X0, Y0), xf, yf)
    const n10 = grad(hash(X1, Y0), xf - 1, yf)
    const n01 = grad(hash(X0, Y1), xf, yf - 1)
    const n11 = grad(hash(X1, Y1), xf - 1, yf - 1)
    const nx0 = n00 + (n10 - n00) * u
    const nx1 = n01 + (n11 - n01) * u
    return (nx0 + (nx1 - nx0) * v) * 1.41
  }
}

export function fbm2D(
  noise: (x: number, y: number) => number,
  x: number,
  y: number,
  octaves = 4,
  gain = 0.5
): number {
  let sum = 0
  let amp = 1
  let freq = 1
  let norm = 0
  for (let i = 0; i < octaves; i++) {
    sum += noise(x * freq, y * freq) * amp
    norm += amp
    amp *= gain
    freq *= 2
  }
  return sum / norm
}

export function heightToNormalData(
  height: Float32Array,
  w: number,
  h: number,
  scale: number,
  wrap = true
): Uint8Array {
  const out = new Uint8Array(w * h * 4)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const xm = wrap ? (x - 1 + w) % w : Math.max(0, x - 1)
      const xp = wrap ? (x + 1) % w : Math.min(w - 1, x + 1)
      const ym = wrap ? (y - 1 + h) % h : Math.max(0, y - 1)
      const yp = wrap ? (y + 1) % h : Math.min(h - 1, y + 1)
      const dx = (height[y * w + xm] - height[y * w + xp]) * scale
      const dy = (height[ym * w + x] - height[yp * w + x]) * scale
      const len = Math.hypot(dx, dy, 1)
      const idx = (y * w + x) * 4
      out[idx] = Math.round(((dx / len) * 0.5 + 0.5) * 255)
      out[idx + 1] = Math.round(((dy / len) * 0.5 + 0.5) * 255)
      out[idx + 2] = Math.round(((1 / len) * 0.5 + 0.5) * 255)
      out[idx + 3] = 255
    }
  }
  return out
}

// Procedural room environment for realistic paper/cloth lighting
export function createBookEnvironment(renderer: THREE.WebGLRenderer): THREE.Texture {
  const envScene = new THREE.Scene()
  const mat = (r: number, g: number, b: number, side: THREE.Side = THREE.BackSide) => {
    const m = new THREE.MeshBasicMaterial({ side, toneMapped: false })
    m.color.setRGB(r, g, b)
    return m
  }
  const sz = 3000
  const room = new THREE.Mesh(new THREE.BoxGeometry(2 * sz, 2 * sz, 2 * sz), [
    mat(0.44, 0.44, 0.45),
    mat(0.4, 0.4, 0.42),
    mat(0.62, 0.63, 0.66),
    mat(0.26, 0.23, 0.2),
    mat(0.36, 0.36, 0.38),
    mat(0.46, 0.47, 0.49),
  ])
  envScene.add(room)

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(4000, 4000), mat(0.4, 0.36, 0.3, THREE.DoubleSide))
  floor.rotation.x = -Math.PI / 2
  floor.position.y = -40
  envScene.add(floor)

  const winDir = new THREE.Vector3(-0.6, 0.66, -0.48).normalize()
  const winGroup = new THREE.Group()
  winGroup.position.copy(winDir).multiplyScalar(2400)
  winGroup.lookAt(0, 0, 0)
  envScene.add(winGroup)

  const mw = 1500
  const mh = 1900
  const bar = 70
  for (const [bx, by] of [
    [-1, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
  ]) {
    const pane = new THREE.Mesh(
      new THREE.PlaneGeometry(mw / 2 - bar, mh / 2 - bar),
      mat(3.2, 3.4, 3.8, THREE.DoubleSide)
    )
    pane.position.set((bx * mw) / 4, (by * mh) / 4, 0)
    winGroup.add(pane)
  }

  const fill = new THREE.Mesh(new THREE.PlaneGeometry(1100, 1000), mat(1.5, 1.44, 1.34, THREE.DoubleSide))
  fill.position.copy(new THREE.Vector3(0.62, 0.5, -0.61).normalize().multiplyScalar(2600))
  fill.lookAt(0, 0, 0)
  envScene.add(fill)

  const pmrem = new THREE.PMREMGenerator(renderer)
  const target = pmrem.fromScene(envScene, 0.02, 10, 20000)
  pmrem.dispose()
  return target.texture
}

// Procedural oak desk + linoleum pad textures
export function createDeskStage(
  scene: THREE.Scene,
  deskTop = -12.65
): {
  keyLight: THREE.SpotLight
  hemiLight: THREE.HemisphereLight
  spillLights: THREE.PointLight[]
} {
  scene.background = new THREE.Color('#b9b0a2')
  const winDir = new THREE.Vector3(-0.6, 0.66, -0.48).normalize()

  const keyLight = new THREE.SpotLight(new THREE.Color('#f3f7ff'), 4.2, 0, 0.36, 0.35, 0)
  keyLight.position.copy(winDir).multiplyScalar(2300)
  keyLight.target.position.set(0, deskTop, 20)
  keyLight.castShadow = true
  keyLight.shadow.mapSize.set(2048, 2048)
  keyLight.shadow.camera.near = 1400
  keyLight.shadow.camera.far = 3300
  keyLight.shadow.bias = -0.0002
  keyLight.shadow.normalBias = 0.8
  keyLight.shadow.radius = 2.4
  scene.add(keyLight, keyLight.target)

  const hemiLight = new THREE.HemisphereLight(new THREE.Color('#dce7f6'), new THREE.Color('#c9ad8a'), 0.48)
  scene.add(hemiLight)

  const spillLights = [0, 1, 2].map(() => {
    const pt = new THREE.PointLight(0xffffff, 0, 0, 2)
    pt.castShadow = false
    scene.add(pt)
    return pt
  })

  const padThick = 2.5
  const oakY = deskTop - padThick

  // Oak desk surface
  const oakW = 512
  const oakH = 512
  const n1 = createPerlin2D(5)
  const n2 = createPerlin2D(16)
  const oakColor = new Uint8Array(oakW * oakH * 4)
  for (let y = 0; y < oakH; y++) {
    for (let x = 0; x < oakW; x++) {
      const u = x / oakW
      const v = y / oakH
      const ring = Math.sin((v * 18 + n1(u * 4, v * 12) * 0.8) * Math.PI * 2) * 0.5 + 0.5
      const fine = n2(u * 40, v * 8) * 0.5 + 0.5
      const k = ring * 0.65 + fine * 0.35
      const idx = (y * oakW + x) * 4
      oakColor[idx] = Math.round(186 + k * 32)
      oakColor[idx + 1] = Math.round(170 + k * 28)
      oakColor[idx + 2] = Math.round(145 + k * 24)
      oakColor[idx + 3] = 255
    }
  }
  const oakTex = new THREE.DataTexture(oakColor, oakW, oakH, THREE.RGBAFormat)
  oakTex.wrapS = oakTex.wrapT = THREE.RepeatWrapping
  oakTex.repeat.set(6, 6)
  oakTex.colorSpace = THREE.SRGBColorSpace
  oakTex.needsUpdate = true

  const deskMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(8000, 8000),
    new THREE.MeshStandardMaterial({ map: oakTex, roughness: 0.88, metalness: 0 })
  )
  deskMesh.rotation.x = -Math.PI / 2
  deskMesh.position.y = oakY
  deskMesh.receiveShadow = true
  scene.add(deskMesh)

  // Linoleum desk pad (640 mm x 430 mm)
  const padW = 640
  const padD = 430
  const r = 7
  const bev = 0.5
  const shape = new THREE.Shape()
  const x0 = -padW / 2 + bev
  const x1 = padW / 2 - bev
  const y0 = -padD / 2 + bev
  const y1 = padD / 2 - bev
  shape.moveTo(x0 + r, y0)
  shape.lineTo(x1 - r, y0)
  shape.quadraticCurveTo(x1, y0, x1, y0 + r)
  shape.lineTo(x1, y1 - r)
  shape.quadraticCurveTo(x1, y1, x1 - r, y1)
  shape.lineTo(x0 + r, y1)
  shape.quadraticCurveTo(x0, y1, x0, y1 - r)
  shape.lineTo(x0, y0 + r)
  shape.quadraticCurveTo(x0, y0, x0 + r, y0)

  const padGeo = new THREE.ExtrudeGeometry(shape, {
    depth: padThick - 2 * bev,
    bevelEnabled: true,
    bevelThickness: bev,
    bevelSize: bev,
    bevelSegments: 2,
    curveSegments: 5,
  })
  padGeo.translate(0, 0, bev)
  padGeo.rotateX(-Math.PI / 2)

  const linoMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#8f9a8c'),
    roughness: 0.86,
    metalness: 0,
  })
  const edgeMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#6f6a5d'),
    roughness: 0.9,
  })
  const padMesh = new THREE.Mesh(padGeo, [linoMat, edgeMat])
  padMesh.position.set(0, oakY, 12)
  padMesh.receiveShadow = true
  padMesh.castShadow = true
  scene.add(padMesh)

  return { keyLight, hemiLight, spillLights }
}

// Book Elastica & Deformable Page Block Engine (Or from Every Joule main.js)
const NS = 60

export interface BookDimensions {
  W: number
  D: number
  N: number
  L: number
  B: number
  F: number
  T: number
  BOARD: number
  OVER: number
  JOINT: number
  CX: number
  BULGE: number
  HOLLOW: number
  SPINE: number
  CURL: number
  CURL_Z: number
  DIP_N: number
  DROOP: number
  Yb: number
  BW: number
  BD: number
  S: Float64Array
}

export function createBookDims(nSpreads = 2): BookDimensions {
  const W = 190
  const D = 250
  const N = nSpreads
  // Keep total spine thickness T = 19.15 mm (> 2 * CX = 18.9 mm) just like Every Joule (14 spreads * 0.55 + 12 = 19.15)
  // so both left and right page blocks arch 6–10 mm ABOVE the hardcover boards (Yb = -9.575 mm).
  const L = 0.65
  const B = 12.0
  const F = 6.5
  const T = B + Math.max(1, N - 1) * L + F
  const BOARD = 3
  const OVER = 4
  const JOINT = 4
  const S = new Float64Array(NS + 1)
  for (let i = 0; i <= NS; i++) {
    const t = i / NS
    S[i] = W * (0.3 * t + 0.7 * t * t)
  }
  return {
    W,
    D,
    N,
    L,
    B,
    F,
    T,
    BOARD,
    OVER,
    JOINT,
    CX: 9.45,
    BULGE: 1.6,
    HOLLOW: 1.2,
    SPINE: 1.3,
    CURL: 0.3,
    CURL_Z: 0.5,
    DIP_N: 2.5,
    DROOP: 0.002,
    Yb: -T / 2,
    BW: W + OVER - JOINT,
    BD: D + 2 * OVER,
    S,
  }
}

const sigmaAtSpread = (d: BookDimensions, k: number) => d.B + (d.N - k) * d.L

function leafSigmaBounds(d: BookDimensions, idx: number): [number, number] {
  if (idx === 0) return [sigmaAtSpread(d, 1), d.T]
  if (idx >= d.N) return [0, d.B]
  return [sigmaAtSpread(d, idx + 1), sigmaAtSpread(d, idx)]
}

function spreadFaceInfo(d: BookDimensions, k: number, side: 'left' | 'right') {
  if (side === 'right') {
    return { unit: k >= d.N ? d.N : k, face: 'b' as const, sigma: sigmaAtSpread(d, k) }
  }
  return { unit: k - 1, face: 'a' as const, sigma: sigmaAtSpread(d, k) }
}

const integralCache = new Map<number, Float64Array>()
function getDipTable(n: number): Float64Array {
  let tab = integralCache.get(n)
  if (tab) return tab
  tab = new Float64Array(513)
  for (let i = 0; i <= 512; i++) {
    const psi = (Math.PI * i) / 512
    let sum = 0
    const m = 128
    for (let j = 0; j <= m; j++) {
      const u = j / m
      const w = j === 0 || j === m ? 1 : j % 2 ? 4 : 2
      sum += w * Math.sin(psi * Math.pow(u, n))
    }
    tab[i] = sum / (3 * m)
  }
  integralCache.set(n, tab)
  return tab
}

function evalDipIntegral(psi: number, n: number): number {
  const tab = getDipTable(n)
  const x = (Math.min(Math.PI, Math.abs(psi)) / Math.PI) * 512
  const idx = Math.min(511, Math.floor(x))
  const f = x - idx
  return tab[idx] * (1 - f) + tab[idx + 1] * f
}

const smoothstep = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)))
  return t * t * (3 - 2 * t)
}

const wrapAngle = (a: number) => {
  while (a > Math.PI) a -= 2 * Math.PI
  while (a <= -Math.PI) a += 2 * Math.PI
  return a
}

interface FamilyParams {
  cx: number
  cy: number
  ex: number
  ey: number
  flat: number
  root: number
  psi: number
  n: number
  I: number
}

function makeFamily(
  cx: number,
  cy: number,
  ex: number,
  ey: number,
  flat: number,
  n: number
): FamilyParams {
  const r = Math.atan2(ey, ex)
  const i = wrapAngle(r + Math.PI / 2)
  const h = wrapAngle(r - Math.PI / 2)
  const root = Math.abs(wrapAngle(i - flat)) <= Math.abs(wrapAngle(h - flat)) ? i : h
  const psi = wrapAngle(root - flat)
  return { cx, cy, ex, ey, flat, root, psi, n, I: evalDipIntegral(psi, n) }
}

interface SpineKinematics {
  split: number
  omega: number
  t0: number
  flat0: number
  betaR: number
  betaL: number
  A: [number, number]
  CR: [number, number]
  RT: [number, number]
  famR: FamilyParams
  famL: FamilyParams
  tau: Float64Array
}

function solveSpineKinematics(d: BookDimensions, tau: Float64Array): SpineKinematics {
  const { T, F, L, N, CX, Yb } = d
  let turnedLeaves = 0
  for (let i = 1; i < N; i++) turnedLeaves += tau[i]
  const split = T - F - L * turnedLeaves
  const t0 = Math.min(1, Math.max(0, tau[0]))
  const m = split
  const g = T - split
  const y = 2 * CX
  const c = (g * g - m * m + y * y) / (2 * y)
  const u = Math.sqrt(Math.max(0, g * g - c * c))
  const vx = -CX + c
  const vy = Yb + u
  const b = Math.atan2(vy - Yb, vx - CX)
  let M = Math.atan2(Yb - vy, -CX - vx)
  if (M < 0) M += 2 * Math.PI
  const omega = smoothstep(0.35, 1, t0)
  const flat0 = Math.PI * t0
  const betaR = Math.PI / 2 + omega * (b - Math.PI / 2)
  const kx = CX + split * Math.cos(betaR)
  const ky = Yb + split * Math.sin(betaR)
  const T_ang = omega * (1.5 * Math.PI - M)
  const betaL = flat0 - T_ang + Math.PI / 2
  const Cx = kx + (T - split) * Math.cos(betaL)
  const Cy = ky + (T - split) * Math.sin(betaL)
  const famR = makeFamily(CX, Yb, Math.cos(betaR), Math.sin(betaR), 0, d.DIP_N)
  const famL = makeFamily(Cx, Cy, -Math.cos(betaL), -Math.sin(betaL), flat0, d.DIP_N)
  return {
    split,
    omega,
    t0,
    flat0,
    betaR,
    betaL,
    A: [kx, ky],
    CR: [CX, Yb],
    RT: [Cx, Cy],
    famR,
    famL,
    tau,
  }
}

function dipSpan(fam: FamilyParams, sigma: number): number {
  const n = sigma * (1 - Math.cos(fam.psi))
  return fam.I > 1e-7 ? n / fam.I : 0
}

function evalFamilyAngle(fam: FamilyParams, span: number, s: number, droop = 0, W = 1): number {
  const dr = droop && s > span ? (droop * (s - span)) / Math.max(1, W - span) : 0
  if (s >= span || span <= 0) return fam.flat + dr
  const r = 1 - s / span
  return fam.flat + fam.psi * Math.pow(r, fam.n)
}

function spinePointAtSigma(
  kin: SpineKinematics,
  _d: BookDimensions,
  sigma: number,
  out: [number, number] = [0, 0]
): [number, number] {
  if (sigma <= kin.split) {
    out[0] = kin.CR[0] + sigma * Math.cos(kin.betaR)
    out[1] = kin.CR[1] + sigma * Math.sin(kin.betaR)
  } else {
    out[0] = kin.A[0] + (sigma - kin.split) * Math.cos(kin.betaL)
    out[1] = kin.A[1] + (sigma - kin.split) * Math.sin(kin.betaL)
  }
  return out
}

export interface PageProfile {
  x: Float64Array
  y: Float64Array
  a: Float64Array
}

function computePageProfile(
  d: BookDimensions,
  kin: SpineKinematics,
  sigma: number,
  turn: number,
  zNorm = 0,
  stiff = false
): PageProfile {
  const S = d.S
  const len = S.length
  const out: PageProfile = {
    x: new Float64Array(len),
    y: new Float64Array(len),
    a: new Float64Array(len),
  }
  const famR = kin.famR
  const famL = kin.famL
  const spanR = dipSpan(famR, sigma)
  const spanL = dipSpan(famL, d.T - sigma)

  let x0: number
  let y0: number
  if (turn <= 0) {
    x0 = famR.cx + sigma * famR.ex
    y0 = famR.cy + sigma * famR.ey
    const k = kin.split > 0 ? Math.min(1, sigma / kin.split) : 0
    const w = (1 - kin.omega) * (1 - kin.omega)
    const bulge = d.BULGE * 4 * k * (1 - k) * w
    x0 -= bulge * Math.cos(famR.root)
    y0 -= bulge * Math.sin(famR.root)
  } else if (turn >= 1) {
    x0 = famL.cx + (d.T - sigma) * famL.ex
    y0 = famL.cy + (d.T - sigma) * famL.ey
  } else {
    const pt = spinePointAtSigma(kin, d, sigma)
    x0 = pt[0]
    y0 = pt[1]
  }

  const u = Math.min(1, Math.max(0, turn))
  const curl =
    stiff || u <= 0 || u >= 1 ? 0 : d.CURL * Math.sin(2 * Math.PI * u) * (1 + d.CURL_Z * zNorm)
  const droopR = -d.DROOP * sigma * kin.omega
  const droopL = d.DROOP * (d.T - sigma) * kin.omega * Math.sign(-famL.psi || 1)

  const angleAt = (s: number) => {
    let ang: number
    if (u <= 0) ang = evalFamilyAngle(famR, spanR, s, droopR, d.W)
    else if (u >= 1) ang = evalFamilyAngle(famL, spanL, s, droopL, d.W)
    else {
      ang =
        (1 - u) * evalFamilyAngle(famR, spanR, s, droopR, d.W) +
        u * evalFamilyAngle(famL, spanL, s, droopL, d.W)
    }
    if (curl !== 0) ang += curl * Math.pow(s / d.W, 1.6)
    return ang
  }

  let px = x0
  let py = y0
  let aPrev = angleAt(0)
  out.x[0] = px
  out.y[0] = py
  out.a[0] = aPrev

  for (let i = 1; i < len; i++) {
    const s0 = S[i - 1]
    const s1 = S[i]
    const ds = s1 - s0
    const aMid = angleAt((s0 + s1) / 2)
    const aNext = angleAt(s1)
    px += (ds / 6) * (Math.cos(aPrev) + 4 * Math.cos(aMid) + Math.cos(aNext))
    py += (ds / 6) * (Math.sin(aPrev) + 4 * Math.sin(aMid) + Math.sin(aNext))
    out.x[i] = px
    out.y[i] = py
    out.a[i] = aNext
    aPrev = aNext
  }
  return out
}

function sampleProfileAtS(
  d: BookDimensions,
  prof: PageProfile,
  sTarget: number,
  out: [number, number, number] = [0, 0, 0]
): [number, number, number] {
  const S = d.S
  const s = Math.min(d.W, Math.max(0, sTarget))
  let lo = 0
  let hi = S.length - 1
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1
    if (S[mid] <= s) lo = mid
    else hi = mid
  }
  const t = (s - S[lo]) / (S[hi] - S[lo] || 1)
  out[0] = prof.x[lo] + (prof.x[hi] - prof.x[lo]) * t
  out[1] = prof.y[lo] + (prof.y[hi] - prof.y[lo]) * t
  out[2] = prof.a[lo] + (prof.a[hi] - prof.a[lo]) * t
  return out
}

class PageBlockMesh {
  ns: number
  nz: number
  nsig: number
  W: number
  D: number
  offB: number
  offA: number
  offH: number
  offT: number
  offE: number
  pos: THREE.BufferAttribute
  uv: THREE.BufferAttribute
  geometry: THREE.BufferGeometry
  mesh: THREE.Mesh

  constructor(opts: {
    ns: number
    nz: number
    nsig: number
    W: number
    D: number
    materials: THREE.Material[]
  }) {
    this.ns = opts.ns
    this.nz = opts.nz
    this.nsig = opts.nsig
    this.W = opts.W
    this.D = opts.D

    const i = (this.ns + 1) * (this.nz + 1)
    const h = (this.ns + 1) * (this.nsig + 1)
    const l = (this.nsig + 1) * (this.nz + 1)
    this.offB = 0
    this.offA = i
    this.offH = 2 * i
    this.offT = 2 * i + h
    this.offE = 2 * i + 2 * h
    const totalVerts = 2 * i + 2 * h + l

    const geo = new THREE.BufferGeometry()
    this.pos = new THREE.BufferAttribute(new Float32Array(totalVerts * 3), 3)
    this.pos.setUsage(THREE.DynamicDrawUsage)
    this.uv = new THREE.BufferAttribute(new Float32Array(totalVerts * 2), 2)
    this.uv.setUsage(THREE.DynamicDrawUsage)
    geo.setAttribute('position', this.pos)
    geo.setAttribute('uv', this.uv)
    geo.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(totalVerts * 3), 3))

    const indices: number[] = []
    const addGrid = (offset: number, cols: number, rows: number, flip: boolean) => {
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const v0 = offset + r * (cols + 1) + c
          const v1 = v0 + 1
          const v2 = v0 + cols + 1
          const v3 = v2 + 1
          if (flip) indices.push(v0, v2, v1, v1, v2, v3)
          else indices.push(v0, v1, v2, v1, v3, v2)
        }
      }
    }
    addGrid(this.offB, this.ns, this.nz, true)
    const countB = indices.length
    addGrid(this.offA, this.ns, this.nz, false)
    const countA = indices.length - countB
    addGrid(this.offH, this.ns, this.nsig, true)
    addGrid(this.offT, this.ns, this.nsig, false)
    addGrid(this.offE, this.nsig, this.nz, false)

    geo.setIndex(indices)
    geo.addGroup(0, countB, 0)
    geo.addGroup(countB, countA, 1)
    geo.addGroup(countB + countA, indices.length - countB - countA, 2)

    this.geometry = geo
    this.mesh = new THREE.Mesh(geo, opts.materials)
    this.mesh.castShadow = true
    this.mesh.receiveShadow = true
  }

  update(
    S: Float64Array,
    sig0: number,
    sig1: number,
    profileFn: (sigIdx: number, zIdx: number) => PageProfile
  ) {
    const { ns, nz, nsig, W, D } = this
    const posArr = this.pos.array as Float32Array
    const uvArr = this.uv.array as Float32Array
    const zAt = (zIdx: number) => -D / 2 + (D * zIdx) / nz
    const setVert = (idx: number, x: number, y: number, z: number, u: number, v: number) => {
      posArr[idx * 3] = x
      posArr[idx * 3 + 1] = y
      posArr[idx * 3 + 2] = z
      uvArr[idx * 2] = u
      uvArr[idx * 2 + 1] = v
    }

    for (let zIdx = 0; zIdx <= nz; zIdx++) {
      const z = zAt(zIdx)
      const profTop = profileFn(nsig, zIdx)
      const profBot = profileFn(0, zIdx)
      const vCoord = (z + D / 2) / D
      for (let sIdx = 0; sIdx <= ns; sIdx++) {
        setVert(
          this.offB + zIdx * (ns + 1) + sIdx,
          profTop.x[sIdx],
          profTop.y[sIdx],
          z,
          S[sIdx] / W,
          1 - vCoord
        )
        setVert(
          this.offA + zIdx * (ns + 1) + sIdx,
          profBot.x[sIdx],
          profBot.y[sIdx],
          z,
          (W - S[sIdx]) / W,
          1 - vCoord
        )
      }
    }

    for (let sigIdx = 0; sigIdx <= nsig; sigIdx++) {
      const sig = sig0 + ((sig1 - sig0) * sigIdx) / nsig
      const profHead = profileFn(sigIdx, 0)
      const profTail = profileFn(sigIdx, nz)
      for (let sIdx = 0; sIdx <= ns; sIdx++) {
        setVert(
          this.offH + sigIdx * (ns + 1) + sIdx,
          profHead.x[sIdx],
          profHead.y[sIdx],
          -D / 2,
          S[sIdx],
          sig
        )
        setVert(
          this.offT + sigIdx * (ns + 1) + sIdx,
          profTail.x[sIdx],
          profTail.y[sIdx],
          D / 2,
          S[sIdx],
          sig
        )
      }
      for (let zIdx = 0; zIdx <= nz; zIdx++) {
        const profEdge = profileFn(sigIdx, zIdx)
        setVert(
          this.offE + zIdx * (nsig + 1) + sigIdx,
          profEdge.x[ns],
          profEdge.y[ns],
          zAt(zIdx),
          zAt(zIdx),
          sig
        )
      }
    }

    this.pos.needsUpdate = true
    this.uv.needsUpdate = true
    this.geometry.computeVertexNormals()
    this.geometry.computeBoundingSphere()
  }
}

function createBoardGeometry(W: number, D: number, thick: number): THREE.BufferGeometry {
  const bev = 0.5
  const r = 2
  const shape = new THREE.Shape()
  const x0 = bev
  const x1 = W - bev
  const y0 = -D / 2 + bev
  const y1 = D / 2 - bev
  shape.moveTo(x0 + r, y0)
  shape.lineTo(x1 - r, y0)
  shape.quadraticCurveTo(x1, y0, x1, y0 + r)
  shape.lineTo(x1, y1 - r)
  shape.quadraticCurveTo(x1, y1, x1 - r, y1)
  shape.lineTo(x0 + r, y1)
  shape.quadraticCurveTo(x0, y1, x0, y1 - r)
  shape.lineTo(x0, y0 + r)
  shape.quadraticCurveTo(x0, y0, x0 + r, y0)

  let geo: THREE.BufferGeometry = new THREE.ExtrudeGeometry(shape, {
    depth: thick - 2 * bev,
    bevelEnabled: true,
    bevelThickness: bev,
    bevelSize: bev,
    bevelSegments: 3,
    curveSegments: 6,
  })
  geo.translate(0, 0, bev)
  geo.rotateX(-Math.PI / 2)
  geo = mergeVertices(geo, Math.PI / 5)
  geo.clearGroups()
  geo.computeBoundingSphere()
  return geo
}

// Cover Plate Canvas (Every Joule cover artwork adapted for CBSE Interactive Lab)
function createCoverPlateTexture(wMm: number, hMm: number, px = 10): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(wMm * px)
  canvas.height = Math.round(hMm * px)
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.scale(px, px)
    ctx.fillStyle = '#f6efe0'
    ctx.fillRect(0, 0, wMm, hMm)
    ctx.strokeStyle = '#9a3b2a'
    ctx.lineWidth = 0.6
    ctx.strokeRect(3.5, 3.5, wMm - 7, hMm - 7)
    ctx.strokeStyle = '#1c2433'
    ctx.lineWidth = 0.25
    ctx.strokeRect(5, 5, wMm - 10, hMm - 10)

    ctx.fillStyle = '#9a3b2a'
    ctx.textAlign = 'center'
    ctx.font = '600 4.0px "Source Serif 4 Variable", Georgia, serif'
    ctx.fillText('CBSE INTERACTIVE LAB · PROTOTYPE', wMm / 2, 18)

    ctx.fillStyle = '#1c2433'
    ctx.font = '700 8.5px "Source Serif 4 Variable", Georgia, serif'
    ctx.fillText('Science Notebook', wMm / 2, 31)

    ctx.fillStyle = '#4b5466'
    ctx.font = 'italic 400 4.2px "Source Serif 4 Variable", Georgia, serif'
    ctx.fillText('Provisional Interactive Physics Edition', wMm / 2, 40)

    // Ramp & Glowing Jar emblem
    ctx.strokeStyle = '#1c2433'
    ctx.lineWidth = 0.65
    ctx.beginPath()
    ctx.moveTo(16, 78)
    ctx.lineTo(56, 78)
    ctx.lineTo(16, 56)
    ctx.closePath()
    ctx.fillStyle = '#e7dcc6'
    ctx.fill()
    ctx.stroke()

    // Glowing jar on cover
    ctx.fillStyle = 'rgba(138, 77, 255, 0.35)'
    ctx.fillRect(62, 60, 14, 18)
    ctx.strokeStyle = '#1c2433'
    ctx.strokeRect(62, 54, 14, 24)

    ctx.fillStyle = '#273463'
    ctx.font = '600 5.5px "Caveat Variable", cursive'
    ctx.fillText('Less force · More distance · Same 98.1 J', wMm / 2, 92)
  }
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

export interface BookHitResult {
  k: number
  side: 'left' | 'right'
  u: number
  v: number
  point: THREE.Vector3
}

export interface EveryJouleBook {
  group: THREE.Group
  dims: BookDimensions
  nSpreads: number
  readonly position: number
  readonly turning: boolean
  readonly openSpread: number | null
  setPosition: (pos: number) => void
  goTo: (targetSpread: number, duration?: number) => void
  update: (dt: number) => void
  pageToWorld: (
    k: number,
    side: 'left' | 'right',
    u: number,
    v: number,
    target?: THREE.Vector3
  ) => THREE.Vector3
  hitTest: (raycaster: THREE.Raycaster) => BookHitResult | null
  getPageCanvas: (k: number, side: 'left' | 'right') => HTMLCanvasElement | null
  markPageDirty: (k: number, side: 'left' | 'right') => void
  computeSpreadFrame: (k: number, u0?: number, v0?: number) => THREE.Matrix4
}

export function createEveryJouleBook(opts: {
  nSpreads?: number
  drawPage: (k: number, side: 'left' | 'right', ctx: CanvasRenderingContext2D, pxPerMm: number) => void
}): EveryJouleBook {
  const nSpreads = opts.nSpreads ?? 2
  const dims = createBookDims(nSpreads)
  const { W, D, N, T, Yb, BOARD } = dims
  const group = new THREE.Group()
  group.name = 'every-joule-book'

  const tau = new Float64Array(N)
  const invisibleMat = new THREE.MeshBasicMaterial({ visible: false })
  const edgeMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#efe7d6'),
    roughness: 0.9,
    metalness: 0,
  })
  const clothMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#223329'),
    roughness: 0.78,
    metalness: 0.08,
  })

  // Page materials & high-DPI canvases for each spread
  const pxPerMm = 5
  const pageData = new Map<
    string,
    { canvas: HTMLCanvasElement; tex: THREE.CanvasTexture; mat: THREE.MeshStandardMaterial; dirty: boolean }
  >()

  for (let k = 1; k <= N; k++) {
    for (const side of ['left', 'right'] as const) {
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(W * pxPerMm)
      canvas.height = Math.round(D * pxPerMm)
      const tex = new THREE.CanvasTexture(canvas)
      tex.colorSpace = THREE.SRGBColorSpace
      tex.anisotropy = 8
      const mat = new THREE.MeshStandardMaterial({
        map: tex,
        roughness: 0.86,
        metalness: 0,
      })
      pageData.set(`${k}:${side}`, { canvas, tex, mat, dirty: true })
    }
  }

  function redrawDirtyPages() {
    for (const [key, entry] of pageData.entries()) {
      if (!entry.dirty) continue
      entry.dirty = false
      const [kStr, side] = key.split(':')
      const ctx = entry.canvas.getContext('2d')
      if (ctx) {
        ctx.save()
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        opts.drawPage(Number(kStr), side as 'left' | 'right', ctx, pxPerMm)
        ctx.restore()
        entry.tex.needsUpdate = true
      }
    }
  }

  const rightBlock = new PageBlockMesh({
    ns: NS,
    nz: 3,
    nsig: 6,
    W,
    D,
    materials: [invisibleMat, invisibleMat, edgeMat],
  })
  const leftBlock = new PageBlockMesh({
    ns: NS,
    nz: 3,
    nsig: 6,
    W,
    D,
    materials: [invisibleMat, invisibleMat, edgeMat],
  })
  const frontBlock = new PageBlockMesh({
    ns: NS,
    nz: 3,
    nsig: 4,
    W,
    D,
    materials: [invisibleMat, invisibleMat, edgeMat],
  })
  group.add(rightBlock.mesh, leftBlock.mesh, frontBlock.mesh)

  const flyingPool: PageBlockMesh[] = []
  const getFlyingLeaf = (idx: number) => {
    while (flyingPool.length <= idx) {
      const leaf = new PageBlockMesh({
        ns: NS,
        nz: 10,
        nsig: 1,
        W,
        D,
        materials: [invisibleMat, invisibleMat, edgeMat],
      })
      leaf.mesh.visible = false
      flyingPool.push(leaf)
      group.add(leaf.mesh)
    }
    return flyingPool[idx]
  }

  // Back Board
  const backBoard = new THREE.Mesh(createBoardGeometry(dims.BW, dims.BD, BOARD), clothMat)
  backBoard.castShadow = true
  backBoard.receiveShadow = true
  backBoard.matrixAutoUpdate = false
  backBoard.matrix
    .makeBasis(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, -1, 0), new THREE.Vector3(0, 0, -1))
    .setPosition(dims.CX + dims.JOINT, Yb, 0)
  group.add(backBoard)

  // Front Board + Cover Plate
  const frontGroup = new THREE.Group()
  frontGroup.matrixAutoUpdate = false
  group.add(frontGroup)

  const frontBoard = new THREE.Mesh(createBoardGeometry(dims.BW, dims.BD, BOARD), clothMat)
  frontBoard.castShadow = true
  frontBoard.receiveShadow = true
  frontGroup.add(frontBoard)

  const plateMesh = new THREE.Mesh(
    new THREE.BoxGeometry(100, 0.35, 120),
    new THREE.MeshStandardMaterial({
      map: createCoverPlateTexture(100, 120),
      roughness: 0.84,
    })
  )
  plateMesh.position.set(dims.BW / 2, BOARD + 0.18, 0)
  frontGroup.add(plateMesh)

  let kin: SpineKinematics = solveSpineKinematics(dims, tau)
  let geomDirty = true
  let iRState = N
  let iLState = -1
  const profileCache = new Map<string, PageProfile>()

  const getCachedProfile = (sigma: number, turn: number, zNorm: number, stiff: boolean) => {
    const key = `${sigma.toFixed(4)}|${turn.toFixed(5)}|${zNorm.toFixed(3)}|${stiff ? 1 : 0}`
    let prof = profileCache.get(key)
    if (!prof) {
      prof = computePageProfile(dims, kin, sigma, turn, zNorm, stiff)
      profileCache.set(key, prof)
    }
    return prof
  }

  const profileForUnit = (unit: number, face: 'a' | 'b', zNorm = 0) => {
    const turn = unit >= N ? 0 : tau[unit]
    const [sigA, sigB] = leafSigmaBounds(dims, unit)
    const sigma = face === 'b' ? sigB : sigA
    if (unit === 0 && turn > 0 && turn < 1) {
      return getCachedProfile(sigma, 1, 0, true)
    }
    return getCachedProfile(sigma, turn, turn > 0 && turn < 1 ? zNorm : 0, unit === 0)
  }

  function rebuildBookGeometry() {
    redrawDirtyPages()
    kin = solveSpineKinematics(dims, tau)
    profileCache.clear()

    let iR = N
    while (iR - 1 >= 0 && tau[iR - 1] <= 0) iR--
    let iL = -1
    while (iL + 1 < N && tau[iL + 1] >= 1) iL++
    iRState = iR
    iLState = iL

    const S = dims.S
    // Right resting stack
    {
      const sigTop = leafSigmaBounds(dims, iR)[1]
      const profs: PageProfile[] = []
      for (let i = 0; i <= rightBlock.nsig; i++) {
        profs.push(getCachedProfile((sigTop * i) / rightBlock.nsig, 0, 0, false))
      }
      rightBlock.update(S, 0, sigTop, (sigIdx) => profs[sigIdx])
      const kRight = iR >= N ? N : iR
      const rMat = pageData.get(`${kRight}:right`)?.mat ?? invisibleMat
      rightBlock.mesh.material = [iR === 0 ? invisibleMat : rMat, invisibleMat, edgeMat]
    }

    // Left resting stack
    leftBlock.mesh.visible = iL >= 0
    if (iL >= 0) {
      const sigBot = leafSigmaBounds(dims, iL)[0]
      const profs: PageProfile[] = []
      for (let i = 0; i <= leftBlock.nsig; i++) {
        profs.push(
          getCachedProfile(sigBot + ((T - sigBot) * i) / leftBlock.nsig, 1, 0, false)
        )
      }
      leftBlock.update(S, sigBot, T, (sigIdx) => profs[sigIdx])
      const lMat = pageData.get(`${iL + 1}:left`)?.mat ?? invisibleMat
      leftBlock.mesh.material = [invisibleMat, lMat, edgeMat]
    }

    // Front cover block when opening cover
    frontBlock.mesh.visible = iL < 0 && iR > 0
    if (frontBlock.mesh.visible) {
      const [sig0] = leafSigmaBounds(dims, 0)
      const profs: PageProfile[] = []
      for (let i = 0; i <= frontBlock.nsig; i++) {
        profs.push(getCachedProfile(sig0 + ((T - sig0) * i) / frontBlock.nsig, 1, 0, true))
      }
      frontBlock.update(S, sig0, T, (sigIdx) => profs[sigIdx])
      const lMat = pageData.get('1:left')?.mat ?? invisibleMat
      frontBlock.mesh.material = [invisibleMat, lMat, edgeMat]
    }

    // Flying turning leaves
    let flyCount = 0
    for (let u = Math.max(1, iL + 1); u < iR; u++) {
      const leaf = getFlyingLeaf(flyCount++)
      const [sigA, sigB] = leafSigmaBounds(dims, u)
      const turn = tau[u]
      leaf.update(S, sigA, sigB, (sigIdx, zIdx) =>
        getCachedProfile(sigIdx ? sigB : sigA, turn, -1 + (2 * zIdx) / leaf.nz, false)
      )
      const rMat = pageData.get(`${u}:right`)?.mat ?? invisibleMat
      const lMat = pageData.get(`${u + 1}:left`)?.mat ?? invisibleMat
      leaf.mesh.material = [rMat, lMat, edgeMat]
      leaf.mesh.visible = true
    }
    for (let i = flyCount; i < flyingPool.length; i++) {
      flyingPool[i].mesh.visible = false
    }

    // Front board transform
    const flatAngle = kin.famL.flat
    const dx = Math.cos(flatAngle)
    const dy = Math.sin(flatAngle)
    const nx = -dy
    const ny = dx
    const ox = kin.RT[0] + dims.JOINT * dx
    const oy = kin.RT[1] + dims.JOINT * dy
    frontGroup.matrix
      .makeBasis(new THREE.Vector3(dx, dy, 0), new THREE.Vector3(nx, ny, 0), new THREE.Vector3(0, 0, 1))
      .setPosition(ox, oy, 0)
    frontGroup.matrixWorldNeedsUpdate = true

    geomDirty = false
  }

  // Page turn animation state
  let clock = 0
  let activeTurn: {
    entries: Array<{
      i: number
      from: number
      to: number
      t0: number
      dur: number
      ease: (t: number) => number
    }>
  } | null = null

  const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

  function currentPosition(): number {
    let sum = 0
    for (let i = 0; i < N; i++) sum += tau[i]
    return sum
  }

  function setPosition(pos: number) {
    const clamped = Math.min(N, Math.max(0, pos))
    activeTurn = null
    for (let i = 0; i < N; i++) {
      tau[i] = Math.min(1, Math.max(0, clamped - i))
    }
    geomDirty = true
  }

  function goTo(targetSpread: number, duration = 1.05) {
    const target = Math.min(N, Math.max(0, Math.round(targetSpread)))
    const entries: Array<{
      i: number
      from: number
      to: number
      t0: number
      dur: number
      ease: (t: number) => number
    }> = []
    for (let i = 0; i < N; i++) {
      const to = i < target ? 1 : 0
      if (Math.abs(tau[i] - to) > 1e-4) {
        entries.push({
          i,
          from: tau[i],
          to,
          t0: clock + entries.length * 0.12,
          dur: i === 0 ? duration * 1.15 : duration * 0.88,
          ease: easeInOutCubic,
        })
      }
    }
    if (entries.length > 0) {
      activeTurn = { entries }
    }
  }

  function pagePose(k: number, side: 'left' | 'right', u: number, v: number) {
    if (geomDirty) rebuildBookGeometry()
    const info = spreadFaceInfo(dims, k, side)
    const s = side === 'right' ? u : W - u
    const z = v - D / 2
    const prof = profileForUnit(info.unit, info.face, z / (D / 2))
    const sampled = sampleProfileAtS(dims, prof, s)
    return { x: sampled[0], y: sampled[1], z, a: sampled[2], face: info.face }
  }

  function pageToWorld(
    k: number,
    side: 'left' | 'right',
    u: number,
    v: number,
    target = new THREE.Vector3()
  ): THREE.Vector3 {
    const p = pagePose(k, side, u, v)
    return target.set(p.x, p.y, p.z).applyMatrix4(group.matrixWorld)
  }

  function computeSpreadFrame(k: number, u0 = 14, v0 = 212): THREE.Matrix4 {
    const pts: THREE.Vector3[] = []
    for (let u = u0 + 6; u <= Math.min(188, u0 + 166); u += 8) {
      pts.push(pageToWorld(k, 'right', u, v0))
    }
    const forward = pageToWorld(k, 'right', u0 + 60, v0)
      .sub(pageToWorld(k, 'right', u0 + 60, v0 - 60))
      .normalize()
    const n = pts.length
    const mx = pts.reduce((a, b) => a + b.x, 0) / n
    const my = pts.reduce((a, b) => a + b.y, 0) / n
    let sxx = 0
    let sxy = 0
    for (const p of pts) {
      sxx += (p.x - mx) ** 2
      sxy += (p.x - mx) * (p.y - my)
    }
    const slope = sxy / Math.max(1e-9, sxx)
    let clearance = 0
    for (const p of pts.slice(2)) {
      clearance = Math.max(clearance, p.y - (my + slope * (p.x - mx)))
    }
    const origin = pts[0].clone()
    origin.y = my + slope * (origin.x - mx) + clearance + 0.05
    const xAxis = new THREE.Vector3(
      1,
      slope,
      (pts[n - 1].z - pts[0].z) / Math.max(1e-9, pts[n - 1].x - pts[0].x)
    ).normalize()
    const yAxis = new THREE.Vector3().crossVectors(forward, xAxis).normalize()
    const zAxis = new THREE.Vector3().crossVectors(xAxis, yAxis).normalize()
    return new THREE.Matrix4().makeBasis(xAxis, yAxis, zAxis).setPosition(origin)
  }

  setPosition(0)
  rebuildBookGeometry()

  return {
    group,
    dims,
    nSpreads: N,
    get position() {
      return currentPosition()
    },
    get turning() {
      return Boolean(activeTurn)
    },
    get openSpread() {
      if (geomDirty) rebuildBookGeometry()
      return iRState === iLState + 1 && iRState >= 1 ? iRState : null
    },
    setPosition,
    goTo,
    update(dt = 1 / 60) {
      clock += dt
      if (activeTurn) {
        let allDone = true
        for (const entry of activeTurn.entries) {
          const prog = Math.min(1, Math.max(0, (clock - entry.t0) / entry.dur))
          if (prog < 1) allDone = false
          tau[entry.i] = entry.from + (entry.to - entry.from) * entry.ease(prog)
        }
        geomDirty = true
        if (allDone) activeTurn = null
      }
      if (geomDirty) rebuildBookGeometry()
      else redrawDirtyPages()
    },
    pageToWorld,
    hitTest(raycaster: THREE.Raycaster): BookHitResult | null {
      if (geomDirty) rebuildBookGeometry()
      const spread = iRState === iLState + 1 && iRState >= 1 ? iRState : null
      if (!spread) return null
      const hits = raycaster.intersectObjects([rightBlock.mesh, leftBlock.mesh], false)
      if (!hits.length) return null
      const hit = hits[0]
      const matIdx = hit.face?.materialIndex
      let side: 'left' | 'right' | null = null
      if (hit.object === rightBlock.mesh && matIdx === 0) side = 'right'
      else if (hit.object === leftBlock.mesh && matIdx === 1) side = 'left'
      if (!side || !hit.uv) return null
      return {
        k: spread,
        side,
        u: hit.uv.x * W,
        v: (1 - hit.uv.y) * D,
        point: hit.point.clone(),
      }
    },
    getPageCanvas(k: number, side: 'left' | 'right') {
      return pageData.get(`${k}:${side}`)?.canvas ?? null
    },
    markPageDirty(k: number, side: 'left' | 'right') {
      const entry = pageData.get(`${k}:${side}`)
      if (entry) entry.dirty = true
    },
    computeSpreadFrame,
  }
}

// 3D Hinged Paper Flap on Left Page (Lo from Every Joule main.js)
export interface HingedFlap3D {
  group: THREE.Group
  mesh: THREE.Mesh
  place: () => void
  setOpen: (open: boolean) => void
  snap: () => void
  update: (dt: number) => void
  readonly amount: number
}

export function createHingedFlap3D(
  book: EveryJouleBook,
  spread: number,
  rect: { u0: number; v0: number; u1: number; v1: number }
): HingedFlap3D {
  const wMm = rect.u1 - rect.u0
  const hMm = rect.v1 - rect.v0
  const px = 6
  const topCanvas = document.createElement('canvas')
  topCanvas.width = Math.round(wMm * px)
  topCanvas.height = Math.round(hMm * px)
  const tctx = topCanvas.getContext('2d')
  if (tctx) {
    tctx.scale(px, px)
    tctx.fillStyle = '#eee4cf'
    tctx.fillRect(0, 0, wMm, hMm)
    tctx.strokeStyle = 'rgba(28,36,51,0.35)'
    tctx.lineWidth = 0.3
    tctx.strokeRect(2.2, 2.2, wMm - 4.4, hMm - 4.4)
    const mid = hMm / 2
    tctx.fillStyle = '#9a3b2a'
    tctx.font = '700 4px "Source Serif 4 Variable", Georgia, serif'
    tctx.fillText('WHY?', 8, mid - 7.5)
    tctx.fillStyle = '#1c2433'
    tctx.font = '600 6px "Source Serif 4 Variable", Georgia, serif'
    tctx.fillText('Lift the flap to see the answer', 8, mid + 1.5)
    tctx.fillStyle = '#4b5466'
    tctx.font = 'italic 400 4.1px "Source Serif 4 Variable", Georgia, serif'
    tctx.fillText('…after you have made your prediction.', 8, mid + 8)
    tctx.fillStyle = '#273463'
    tctx.font = '600 5.4px "Caveat Variable", cursive'
    tctx.fillText('lift here ↗', wMm - 28, mid + 1.5)
  }
  const topTex = new THREE.CanvasTexture(topCanvas)
  topTex.colorSpace = THREE.SRGBColorSpace
  topTex.anisotropy = 8

  const underCanvas = document.createElement('canvas')
  underCanvas.width = topCanvas.width
  underCanvas.height = topCanvas.height
  const uctx = underCanvas.getContext('2d')
  if (uctx) {
    uctx.scale(px, px)
    uctx.fillStyle = '#f1e8d4'
    uctx.fillRect(0, 0, wMm, hMm)
    uctx.strokeStyle = 'rgba(154,59,42,0.55)'
    uctx.lineWidth = 0.35
    uctx.strokeRect(3, 3, wMm - 6, hMm - 6)
    uctx.fillStyle = 'rgba(154,59,42,0.85)'
    uctx.font = '600 8px "Source Serif 4 Variable", Georgia, serif'
    uctx.textAlign = 'center'
    uctx.textBaseline = 'middle'
    uctx.fillText('EJ · CBSE', wMm / 2, hMm / 2)
  }
  const underTex = new THREE.CanvasTexture(underCanvas)
  underTex.colorSpace = THREE.SRGBColorSpace
  underTex.anisotropy = 8

  const thick = 0.35
  const geo = new THREE.BoxGeometry(wMm, thick, hMm)
  geo.translate(wMm / 2, thick / 2, -hMm / 2)

  const edgeMat = new THREE.MeshStandardMaterial({ color: '#efe7d6', roughness: 0.9 })
  const topMat = new THREE.MeshStandardMaterial({ map: topTex, roughness: 0.88 })
  const underMat = new THREE.MeshStandardMaterial({ map: underTex, roughness: 0.9 })

  const mesh = new THREE.Mesh(geo, [edgeMat, edgeMat, topMat, underMat, edgeMat, edgeMat])
  mesh.castShadow = true
  mesh.receiveShadow = true

  const pivot = new THREE.Group()
  pivot.add(mesh)

  const group = new THREE.Group()
  group.add(pivot)
  group.matrixAutoUpdate = false

  function place() {
    const p00 = book.pageToWorld(spread, 'left', rect.u0, rect.v0)
    const p10 = book.pageToWorld(spread, 'left', rect.u1, rect.v0)
    const p01 = book.pageToWorld(spread, 'left', rect.u0, rect.v1)
    const xAxis = p10.clone().sub(p00).normalize()
    const zAxis = p01.clone().sub(p00).normalize()
    const yAxis = new THREE.Vector3().crossVectors(zAxis, xAxis).normalize()
    const zOrtho = new THREE.Vector3().crossVectors(xAxis, yAxis)
    group.matrix
      .makeBasis(xAxis, yAxis, zOrtho)
      .setPosition(p01.clone().addScaledVector(yAxis, 0.14))
    group.matrixWorldNeedsUpdate = true
  }

  let amount = 0
  let target = 0
  const maxAngle = 2.65

  return {
    group,
    mesh,
    place,
    setOpen(open: boolean) {
      target = open ? 1 : 0
    },
    snap() {
      amount = target
      pivot.rotation.x = maxAngle * amount
    },
    update(dt: number) {
      amount += (target - amount) * (1 - Math.exp(-dt * 7))
      pivot.rotation.x = maxAngle * amount
    },
    get amount() {
      return amount
    },
  }
}
