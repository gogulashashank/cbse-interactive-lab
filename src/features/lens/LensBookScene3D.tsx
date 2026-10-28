import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import type { ConvexLensResult } from './convexLensModel'
import { formatLensNumber, formatSignedCm, LENS_UI_LIMITS } from './lensInputValidation'
import {
  drawContentsBookPage,
  getPageArchHeightMm,
  type BookPageHitRegion,
  type PredictionOptionIndex,
} from '../ramp/bookPageRenderer'
import {
  createBookEnvironment,
  createDeskStage,
  createEveryJouleBook,
  createHingedFlap3D,
  type EveryJouleBook,
} from '../ramp/everyJouleBook'
import {
  createPaperMaterial,
  createPopoutSharedUniforms,
  DashedTargetRing3D,
  InkLineSet,
  PaperTag3D,
} from '../ramp/everyJoulePopout'
import {
  drawLensLeftBookPage,
  drawLensRightBookPage,
  type LensBookPageRenderState,
} from './lensBookPageRenderer'

export interface LensBookScene3DProps {
  result: ConvexLensResult
  spreadIndex: number
  prediction: PredictionOptionIndex
  flapOpen: boolean
  stillMode: boolean
  onSpreadChange: (nextSpread: number) => void
  onSelectPrediction: (idx: 0 | 1 | 2) => void
  onToggleFlap: () => void
  onOpenWorkedMath: () => void
  onSelectPresetFactor: (factorOfF: number) => void
  onSnapScreenToImage: () => void
  onChangeObjectDistance: (nextDistanceCm: number) => void
  onChangeScreenDistance: (nextScreenCm: number) => void
  onOpenRampLesson?: () => void
  onWebglUnavailable?: () => void
}

// Enlarged Optical Bench spanning across the open 2-page spread:
// Optical centre O(0,0) sits at x = +25 mm on the right page, z = -35 mm (page v = 90 mm).
// The 280 mm rail spans from x = -125 mm on the left page to x = +155 mm on the right page.
const BENCH_CENTER_X_MM = 25
const BENCH_CENTER_Z_MM = -35
const MM_PER_CM = 1.9
const BENCH_AXIS_HEIGHT_ABOVE_PAGE_MM = 32
const Y_MM_PER_CM = 4.5

export function LensBookScene3D({
  result,
  spreadIndex,
  prediction,
  flapOpen,
  stillMode,
  onSpreadChange,
  onSelectPrediction,
  onToggleFlap,
  onOpenWorkedMath,
  onSelectPresetFactor,
  onSnapScreenToImage,
  onChangeObjectDistance,
  onChangeScreenDistance,
  onOpenRampLesson,
  onWebglUnavailable,
}: LensBookScene3DProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const bookRef = useRef<EveryJouleBook | null>(null)

  const propsRef = useRef({
    result,
    spreadIndex,
    prediction,
    flapOpen,
    stillMode,
    onSpreadChange,
    onSelectPrediction,
    onToggleFlap,
    onOpenWorkedMath,
    onSelectPresetFactor,
    onSnapScreenToImage,
    onChangeObjectDistance,
    onChangeScreenDistance,
    onOpenRampLesson,
    onWebglUnavailable,
  })

  useEffect(() => {
    propsRef.current = {
      result,
      spreadIndex,
      prediction,
      flapOpen,
      stillMode,
      onSpreadChange,
      onSelectPrediction,
      onToggleFlap,
      onOpenWorkedMath,
      onSelectPresetFactor,
      onSnapScreenToImage,
      onChangeObjectDistance,
      onChangeScreenDistance,
      onOpenRampLesson,
      onWebglUnavailable,
    }
  })

  const updateSceneRef = useRef<(() => void) | null>(null)

  // Synchronise external spreadIndex changes (e.g. Return to Contents / Open Lesson II buttons)
  useEffect(() => {
    const book = bookRef.current
    if (!book) return
    if (Math.round(book.position) !== spreadIndex) {
      if (stillMode) {
        book.setPosition(spreadIndex)
      } else {
        book.goTo(spreadIndex, 0.95)
      }
      updateSceneRef.current?.()
    }
  }, [spreadIndex, stillMode])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
    } catch {
      propsRef.current.onWebglUnavailable?.()
      return
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.03
    renderer.outputColorSpace = THREE.SRGBColorSpace

    container.innerHTML = ''
    container.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#ddd4c2')
    try {
      scene.environment = createBookEnvironment(renderer)
      scene.environmentIntensity = 0.35
    } catch {
      // Fallback if PMREM fails in restricted environments
    }

    // Camera framed closely so the open 380x250 mm book fills the usable scene with minimal desk border
    const camera = new THREE.PerspectiveCamera(28, 16 / 10, 10, 3500)
    const camTarget = new THREE.Vector3(2, 16, -6)

    function frameCameraForAspect(aspect: number) {
      const fovRad = THREE.MathUtils.degToRad(camera.fov)
      const halfTan = Math.tan(fovRad * 0.5)
      // Open book is 380 mm wide; foreshortened depth + 3D bench is ~205 mm tall
      const targetWorldWidth = 398
      const targetWorldHeight = 206
      const distForHeight = (targetWorldHeight * 0.5) / halfTan
      const distForWidth = (targetWorldWidth * 0.5) / (halfTan * Math.max(0.85, Math.min(1.85, aspect)))
      const dist = Math.max(distForHeight, distForWidth)
      // Elevation angle ~53 degrees so both the book spread and vertical 3D candle/lens/rays are clear
      const elevRad = THREE.MathUtils.degToRad(53)
      camera.position.set(
        camTarget.x,
        camTarget.y + dist * Math.sin(elevRad),
        camTarget.z + dist * Math.cos(elevRad)
      )
      camera.lookAt(camTarget)
    }
    frameCameraForAspect(1.55)

    createDeskStage(scene, -19.15 * 0.5)

    const pageHitRegions = new Map<string, BookPageHitRegion[]>()

    const getRenderState = (): LensBookPageRenderState => ({
      result: propsRef.current.result,
      prediction: propsRef.current.prediction,
      flapOpen: propsRef.current.flapOpen,
    })

    const book = createEveryJouleBook({
      nSpreads: 2,
      drawPage: (k, side, ctx, pxPerMm) => {
        const pageCanvas = ctx.canvas
        if (k === 1) {
          const { hits } = drawContentsBookPage(pageCanvas, side, pxPerMm)
          pageHitRegions.set(`1:${side}`, hits)
        } else if (k === 2) {
          const st = getRenderState()
          if (side === 'left') {
            const { hits } = drawLensLeftBookPage(pageCanvas, st, pxPerMm)
            pageHitRegions.set('2:left', hits)
          } else {
            const { hits } = drawLensRightBookPage(pageCanvas, st, pxPerMm)
            pageHitRegions.set('2:right', hits)
          }
        }
      },
    })
    book.setPosition(propsRef.current.spreadIndex)
    book.update(0.016)
    scene.add(book.group)
    bookRef.current = book

    if (typeof document !== 'undefined' && 'fonts' in document && document.fonts?.ready) {
      document.fonts.ready.then(() => {
        book.markPageDirty(1, 'left')
        book.markPageDirty(1, 'right')
        book.markPageDirty(2, 'left')
        book.markPageDirty(2, 'right')
      })
    }

    // 3D Hinged Paper Explanation Flap on Left Page of Spread 2
    const flap3D = createHingedFlap3D(book, 2, {
      u0: 54,
      v0: 185,
      u1: 176,
      v1: 235,
    })
    scene.add(flap3D.group)

    const shared = createPopoutSharedUniforms()
    shared.uLiftAll.value = 1
    shared.uClock.value = 100
    shared.uFillAlpha.value = 1

    // Enlarged Pop-Out 3D Optical Bench spanning across Spread 2
    const benchGroup = new THREE.Group()
    scene.add(benchGroup)

    const woodMat = createPaperMaterial(shared, '#9c6635', 0.25, 1)
    const brassMat = createPaperMaterial(shared, '#d9a441', 0.18, 1)
    const darkFrameMat = createPaperMaterial(shared, '#334155', 0.22, 1)
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#93c5fd'),
      transparent: true,
      opacity: 0.72,
      roughness: 0.1,
      metalness: 0.05,
      transmission: 0.58,
      thickness: 4.5,
    })
    const screenBoardMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#ffffff'),
      roughness: 0.82,
    })

    // Enlarged 280 mm optical bench rail spanning from -145 mm to +135 mm relative to BENCH_CENTER_X_MM (+25 mm)
    const railGeo = new THREE.BoxGeometry(280, 4.2, 11)
    const railMesh = new THREE.Mesh(railGeo, woodMat)
    railMesh.position.set(-5, 0, 0)
    railMesh.castShadow = true
    railMesh.receiveShadow = true
    benchGroup.add(railMesh)

    // Enlarged Center Biconvex Lens + Brass Stand at local x = 0
    const lensGroup = new THREE.Group()
    const standBase = new THREE.Mesh(new THREE.BoxGeometry(14, 4.5, 16), brassMat)
    standBase.position.y = 2.2
    lensGroup.add(standBase)

    const standPost = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 2.5, 28, 16), brassMat)
    standPost.position.y = 14
    lensGroup.add(standPost)

    const lensRadius = 25
    const lensMesh = new THREE.Mesh(new THREE.SphereGeometry(lensRadius, 32, 24), glassMat)
    lensMesh.scale.set(0.24, 1, 1)
    lensMesh.position.y = BENCH_AXIS_HEIGHT_ABOVE_PAGE_MM
    lensGroup.add(lensMesh)

    const lensRim = new THREE.Mesh(
      new THREE.TorusGeometry(lensRadius, 1.4, 14, 42),
      brassMat
    )
    lensRim.rotation.y = Math.PI / 2
    lensRim.position.y = BENCH_AXIS_HEIGHT_ABOVE_PAGE_MM
    lensGroup.add(lensRim)
    benchGroup.add(lensGroup)

    // Enlarged Object Candle Rider on left (-x)
    const objectRiderGroup = new THREE.Group()
    const objBase = new THREE.Mesh(new THREE.BoxGeometry(13, 5, 15), brassMat)
    objBase.position.y = 2.5
    objectRiderGroup.add(objBase)

    const candleBody = new THREE.Mesh(
      new THREE.CylinderGeometry(3.1, 3.4, 14, 20),
      createPaperMaterial(shared, '#fff3d6', 0.14, 1)
    )
    objectRiderGroup.add(candleBody)

    const flameOuter = new THREE.Mesh(
      new THREE.ConeGeometry(3.8, 8.5, 18),
      new THREE.MeshBasicMaterial({ color: '#ea580c' })
    )
    objectRiderGroup.add(flameOuter)

    const flameInner = new THREE.Mesh(
      new THREE.ConeGeometry(2.1, 5.2, 14),
      new THREE.MeshBasicMaterial({ color: '#fde047' })
    )
    objectRiderGroup.add(flameInner)

    const objRing = new DashedTargetRing3D(shared, [0, 1, 0], 11, '#d97706')
    objectRiderGroup.add(objRing.group)
    benchGroup.add(objectRiderGroup)

    // Enlarged Movable Paper Screen Rider on right (+x)
    const screenRiderGroup = new THREE.Group()
    const scrBase = new THREE.Mesh(new THREE.BoxGeometry(13, 5, 16), brassMat)
    scrBase.position.y = 2.5
    screenRiderGroup.add(scrBase)

    const screenFrame = new THREE.Mesh(new THREE.BoxGeometry(2.4, 54, 42), darkFrameMat)
    screenFrame.position.y = BENCH_AXIS_HEIGHT_ABOVE_PAGE_MM
    screenRiderGroup.add(screenFrame)

    const screenCard = new THREE.Mesh(new THREE.BoxGeometry(2.8, 50, 38), screenBoardMat)
    screenCard.position.y = BENCH_AXIS_HEIGHT_ABOVE_PAGE_MM
    screenCard.castShadow = true
    screenRiderGroup.add(screenCard)

    // Projected real inverted candle + flame on screen face
    const projectedImageGroup = new THREE.Group()
    const projCandleStem = new THREE.Mesh(
      new THREE.CylinderGeometry(2.2, 2.4, 10, 14),
      new THREE.MeshBasicMaterial({ color: '#fca5a5', transparent: true, opacity: 0.92 })
    )
    projCandleStem.position.y = 5
    projectedImageGroup.add(projCandleStem)

    const projFlameCone = new THREE.Mesh(
      new THREE.ConeGeometry(3.4, 7.5, 16),
      new THREE.MeshBasicMaterial({ color: '#dc2626', transparent: true, opacity: 0.95 })
    )
    projFlameCone.rotation.z = Math.PI // inverted downward
    projFlameCone.position.y = -3.2
    projectedImageGroup.add(projFlameCone)
    screenRiderGroup.add(projectedImageGroup)

    const scrRing = new DashedTargetRing3D(shared, [0, 1, 0], 11, '#2563eb')
    screenRiderGroup.add(scrRing.group)
    benchGroup.add(screenRiderGroup)

    // 3D Virtual Image Upright Ghost Candle on object side when |u| < f
    const virtualImageGroup = new THREE.Group()
    const virtCandleStem = new THREE.Mesh(
      new THREE.CylinderGeometry(2.8, 3.0, 14, 16),
      new THREE.MeshBasicMaterial({ color: '#a855f7', transparent: true, opacity: 0.5 })
    )
    virtualImageGroup.add(virtCandleStem)

    const virtFlameCone = new THREE.Mesh(
      new THREE.ConeGeometry(3.6, 8.0, 16),
      new THREE.MeshBasicMaterial({ color: '#7c3aed', transparent: true, opacity: 0.78 })
    )
    virtualImageGroup.add(virtFlameCone)
    benchGroup.add(virtualImageGroup)

    // 3D Principal Rays using InkLineSet (driven strictly by result.rays without recalculating optics)
    const ray1Lines = new InkLineSet(shared, { color: '#d97706', baseWidth: 3.2 })
    const ray2Lines = new InkLineSet(shared, { color: '#1d4ed8', baseWidth: 3.2 })
    const ray3Lines = new InkLineSet(shared, { color: '#15803d', baseWidth: 3.0 })
    const virtLines = new InkLineSet(shared, { color: '#7c3aed', baseWidth: 2.5 })
    benchGroup.add(ray1Lines.mesh, ray2Lines.mesh, ray3Lines.mesh, virtLines.mesh)

    // Compact 3D Paper Tags (castShadow disabled so they never darken the rays below)
    const lensTag = new PaperTag3D([0, BENCH_AXIS_HEIGHT_ABOVE_PAGE_MM + 31, 0], { width: 42 })
    const objTag = new PaperTag3D([-40, BENCH_AXIS_HEIGHT_ABOVE_PAGE_MM + 26, 0], { width: 44 })
    const scrTag = new PaperTag3D([45, BENCH_AXIS_HEIGHT_ABOVE_PAGE_MM + 31, 0], { width: 48 })
    lensTag.mesh.castShadow = false
    objTag.mesh.castShadow = false
    scrTag.mesh.castShadow = false
    benchGroup.add(lensTag.mesh, objTag.mesh, scrTag.mesh)

    function sync3DFromState() {
      const { result: res, flapOpen: isFlapOpen, spreadIndex: spIdx } = propsRef.current
      book.markPageDirty(1, 'left')
      book.markPageDirty(1, 'right')
      book.markPageDirty(2, 'left')
      book.markPageDirty(2, 'right')

      const onLessonSpread = Math.round(book.position) === 2 && spIdx === 2
      benchGroup.visible = onLessonSpread
      flap3D.group.visible = onLessonSpread

      const pageArchY = getPageArchHeightMm(BENCH_CENTER_X_MM)
      benchGroup.position.set(BENCH_CENTER_X_MM, pageArchY + 2.5, BENCH_CENTER_Z_MM)

      const axisY = BENCH_AXIS_HEIGHT_ABOVE_PAGE_MM
      const clampXMm = (xCm: number) => Math.max(-140, Math.min(132, xCm * MM_PER_CM))
      const toYMm = (yCm: number) => axisY + Math.max(-25, Math.min(25, yCm * Y_MM_PER_CM))

      const uMm = clampXMm(res.rays.objectBase.xCm)
      const objTipY = toYMm(res.rays.objectTip.yCm)
      const hObjMm = Math.max(6, objTipY - axisY)
      const scrMm = clampXMm(res.rays.screenIntersections.screenXCm)

      // Position object candle rider
      objectRiderGroup.position.set(uMm, 0, 0)
      const stemH = Math.max(5, hObjMm - 5.5)
      candleBody.scale.set(1, stemH / 14, 1)
      candleBody.position.y = axisY + stemH * 0.5
      flameOuter.position.y = objTipY - 2.2
      flameInner.position.y = objTipY - 2.6

      // Position movable paper screen rider and projected real image
      screenRiderGroup.position.set(scrMm, 0, 0)
      if (res.canCatchOnScreen && res.imageHeightCm !== null) {
        projectedImageGroup.visible = true
        const absImgMm = Math.min(22, Math.max(4, Math.abs(res.imageHeightCm) * Y_MM_PER_CM))
        const scaleY = absImgMm / 14
        const blurSpread = res.isSharpOnScreen ? 1 : 1 + res.screenBlurFraction * 1.65
        projectedImageGroup.scale.set(blurSpread, scaleY, blurSpread)
        projectedImageGroup.position.set(
          -1.6,
          toYMm(res.rays.screenIntersections.beamCenterYCm) + absImgMm * 0.35,
          0
        )
        const opacity = res.isSharpOnScreen
          ? 0.96
          : Math.max(0.24, 0.78 - res.screenBlurFraction * 0.52)
        ;(projCandleStem.material as THREE.MeshBasicMaterial).opacity = opacity * 0.88
        ;(projFlameCone.material as THREE.MeshBasicMaterial).opacity = opacity
      } else {
        projectedImageGroup.visible = false
      }

      // Position 3D virtual upright ghost image when |u| < f
      const vExt1 = res.rays.ray1ParallelToF2.virtualExtensionEnd
      if (res.imageNature === 'virtual_erect' && vExt1) {
        virtualImageGroup.visible = true
        const vMm = clampXMm(vExt1.xCm)
        const vTipY = toYMm(vExt1.yCm)
        const vHeightMm = Math.max(8, vTipY - axisY)
        const vStemH = Math.max(5, vHeightMm - 5.5)
        virtualImageGroup.position.set(vMm, 0, 0)
        virtCandleStem.scale.set(1, vStemH / 14, 1)
        virtCandleStem.position.y = axisY + vStemH * 0.5
        virtFlameCone.position.y = vTipY - 2.2
      } else {
        virtualImageGroup.visible = false
      }

      // Update 3D Principal Rays strictly from result.rays (no optics formulas in renderer)
      const objTip3D = new THREE.Vector3(uMm, objTipY, 0)
      const lensHit1 = new THREE.Vector3(0, toYMm(res.rays.ray1ParallelToF2.lensHit.yCm), 0)
      const lensCenter = new THREE.Vector3(0, toYMm(res.rays.ray2ThroughOpticalCentre.lensHit.yCm), 0)

      const r1Screen3D = new THREE.Vector3(
        scrMm,
        toYMm(res.rays.screenIntersections.ray1YCm),
        0
      )
      const r2Screen3D = new THREE.Vector3(
        scrMm,
        toYMm(res.rays.screenIntersections.ray2YCm),
        0
      )

      ray1Lines.clear()
      ray1Lines.addSegment(objTip3D, lensHit1)
      ray1Lines.addSegment(lensHit1, r1Screen3D)
      ray1Lines.build()

      ray2Lines.clear()
      ray2Lines.addSegment(objTip3D, lensCenter)
      ray2Lines.addSegment(lensCenter, r2Screen3D)
      ray2Lines.build()

      if (res.rays.ray3ThroughF1ToParallel && res.rays.screenIntersections.ray3YCm !== null) {
        const lensHit3 = new THREE.Vector3(
          0,
          toYMm(res.rays.ray3ThroughF1ToParallel.lensHit.yCm),
          0
        )
        const r3Screen3D = new THREE.Vector3(
          scrMm,
          toYMm(res.rays.screenIntersections.ray3YCm),
          0
        )
        ray3Lines.clear()
        ray3Lines.addSegment(objTip3D, lensHit3)
        ray3Lines.addSegment(lensHit3, r3Screen3D)
        ray3Lines.build()
        ray3Lines.mesh.visible = true
      } else {
        ray3Lines.mesh.visible = false
      }

      if (res.imageNature === 'virtual_erect' && vExt1) {
        const virtTip = new THREE.Vector3(clampXMm(vExt1.xCm), toYMm(vExt1.yCm), 0)
        virtLines.clear()
        virtLines.addSegment(lensHit1, virtTip)
        virtLines.addSegment(lensCenter, virtTip)
        virtLines.build()
        virtLines.mesh.visible = true
      } else {
        virtLines.mesh.visible = false
      }

      // Update Paper Tags
      lensTag.setText(
        `Lens f = +${formatLensNumber(res.fCm)} cm`,
        `P = +${formatLensNumber(res.opticalPowerDioptre, 1)} D`
      )
      lensTag.mesh.position.set(0, axisY + 31, 0)

      objTag.setText(
        `Candle u = ${formatSignedCm(res.uCm)}`,
        `h = +${formatLensNumber(res.objectHeightCm)} cm`
      )
      objTag.mesh.position.set(uMm, objTipY + 11, 0)

      scrTag.setText(
        res.isSharpOnScreen
          ? `Sharp (+${formatLensNumber(res.screenDistanceCm)} cm)`
          : `Screen (+${formatLensNumber(res.screenDistanceCm)} cm)`,
        res.canCatchOnScreen ? 'Real Image Side' : 'No Screen Catch'
      )
      scrTag.mesh.position.set(scrMm, axisY + 31, 0)

      // Update 3D Hinged Paper Flap
      flap3D.setOpen(isFlapOpen)
    }

    updateSceneRef.current = sync3DFromState
    sync3DFromState()

    // Pointer interaction for 3D riders, 3D hinged flap, and 2D book page hit regions
    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()
    const dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -24)
    const hitPoint = new THREE.Vector3()
    let activeDrag: 'object' | 'screen' | null = null

    function updatePointer(e: PointerEvent) {
      const rect = renderer.domElement.getBoundingClientRect()
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(pointer, camera)
    }

    function onPointerDown(e: PointerEvent) {
      updatePointer(e)

      if (Math.round(book.position) === 2) {
        const objHits = raycaster.intersectObjects(objectRiderGroup.children, true)
        if (objHits.length > 0) {
          activeDrag = 'object'
          renderer.domElement.style.cursor = 'ew-resize'
          return
        }
        const scrHits = raycaster.intersectObjects(screenRiderGroup.children, true)
        if (scrHits.length > 0) {
          activeDrag = 'screen'
          renderer.domElement.style.cursor = 'ew-resize'
          return
        }
        const flapHits = raycaster.intersectObject(flap3D.mesh, true)
        if (flapHits.length > 0) {
          propsRef.current.onToggleFlap()
          return
        }
      }

      // Check closed cover click
      if (Math.round(book.position) === 0) {
        propsRef.current.onSpreadChange(1)
        if (propsRef.current.stillMode) {
          book.setPosition(1)
        } else {
          book.goTo(1, 0.95)
        }
        return
      }

      // Check 2D page hit regions
      const pageHit = book.hitTest(raycaster)
      if (!pageHit) return
      const key = `${pageHit.k}:${pageHit.side}`
      const hits = pageHitRegions.get(key) ?? []
      const matched = hits.find(
        (r) =>
          pageHit.u >= r.u0 &&
          pageHit.u <= r.u1 &&
          pageHit.v >= r.v0 &&
          pageHit.v <= r.v1
      )
      if (!matched) return

      if (matched.id === 'open:lesson1') {
        propsRef.current.onOpenRampLesson?.()
      } else if (matched.id === 'open:lesson2') {
        propsRef.current.onSpreadChange(2)
        if (propsRef.current.stillMode) {
          book.setPosition(2)
        } else {
          book.goTo(2, 0.95)
        }
      } else if (matched.id === 'open:contents') {
        propsRef.current.onSpreadChange(1)
        if (propsRef.current.stillMode) {
          book.setPosition(1)
        } else {
          book.goTo(1, 0.95)
        }
      } else if (matched.id.startsWith('predict:')) {
        const idx = Number(matched.id.split(':')[1]) as 0 | 1 | 2
        propsRef.current.onSelectPrediction(idx)
      } else if (matched.id === 'flap') {
        propsRef.current.onToggleFlap()
      } else if (matched.id === 'open:worked-math') {
        propsRef.current.onOpenWorkedMath()
      } else if (matched.id === 'snap:screen') {
        propsRef.current.onSnapScreenToImage()
      } else if (matched.id.startsWith('preset:')) {
        const factor = Number(matched.id.split(':')[1])
        if (Number.isFinite(factor)) {
          propsRef.current.onSelectPresetFactor(factor)
        }
      }
    }

    function onPointerMove(e: PointerEvent) {
      updatePointer(e)
      if (activeDrag) {
        if (raycaster.ray.intersectPlane(dragPlane, hitPoint)) {
          const localMm = hitPoint.x - BENCH_CENTER_X_MM
          const cm = localMm / MM_PER_CM
          if (activeDrag === 'object') {
            const nextObj =
              Math.round(
                Math.max(
                  LENS_UI_LIMITS.objectDistanceCm.min,
                  Math.min(LENS_UI_LIMITS.objectDistanceCm.max, -cm)
                ) * 2
              ) / 2
            propsRef.current.onChangeObjectDistance(nextObj)
          } else if (activeDrag === 'screen') {
            const nextScr =
              Math.round(
                Math.max(
                  LENS_UI_LIMITS.screenDistanceCm.min,
                  Math.min(LENS_UI_LIMITS.screenDistanceCm.max, cm)
                ) * 2
              ) / 2
            propsRef.current.onChangeScreenDistance(nextScr)
          }
        }
        return
      }

      // Update cursor on hover over interactive targets
      if (Math.round(book.position) === 2) {
        if (
          raycaster.intersectObjects(objectRiderGroup.children, true).length > 0 ||
          raycaster.intersectObjects(screenRiderGroup.children, true).length > 0
        ) {
          renderer.domElement.style.cursor = 'ew-resize'
          return
        }
        if (raycaster.intersectObject(flap3D.mesh, true).length > 0) {
          renderer.domElement.style.cursor = 'pointer'
          return
        }
      }
      const pageHit = book.hitTest(raycaster)
      if (pageHit) {
        const hits = pageHitRegions.get(`${pageHit.k}:${pageHit.side}`) ?? []
        const isHit = hits.some(
          (r) =>
            pageHit.u >= r.u0 &&
            pageHit.u <= r.u1 &&
            pageHit.v >= r.v0 &&
            pageHit.v <= r.v1
        )
        renderer.domElement.style.cursor = isHit ? 'pointer' : 'default'
        return
      }
      renderer.domElement.style.cursor = 'default'
    }

    function onPointerUp() {
      activeDrag = null
    }

    renderer.domElement.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)

    function handleResize() {
      if (!container) return
      const w = Math.max(320, container.clientWidth)
      const h = Math.max(300, container.clientHeight)
      const aspect = w / h
      camera.aspect = aspect
      frameCameraForAspect(aspect)
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      shared.uResolution.value.set(w, h)
      renderer.render(scene, camera)
    }
    handleResize()
    window.addEventListener('resize', handleResize)

    let rafId = 0
    function animate() {
      rafId = requestAnimationFrame(animate)
      const dt = propsRef.current.stillMode ? 0 : 0.016
      shared.uTime.value += dt
      book.update(propsRef.current.stillMode ? 0.001 : 0.016)
      flap3D.update(propsRef.current.stillMode ? 1.0 : 0.016)
      const onLessonSpread = Math.round(book.position) === 2
      benchGroup.visible = onLessonSpread
      flap3D.group.visible = onLessonSpread
      objRing.update()
      scrRing.update()
      renderer.render(scene, camera)
    }

    rafId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(rafId)
      renderer.domElement.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
    }
  }, [])

  useEffect(() => {
    updateSceneRef.current?.()
  }, [result, prediction, flapOpen, spreadIndex, stillMode])

  return (
    <div className="lens-book-3d-wrapper">
      <div
        ref={containerRef}
        className="lens-book-3d-canvas"
        role="img"
        aria-label={`Interactive 3D Physics Book — Spread ${spreadIndex}: How a convex lens forms an image. Object at u = ${formatSignedCm(result.uCm)}, Convex Lens f = +${formatLensNumber(result.fCm)} cm. ${result.screenStatusText}`}
      />
    </div>
  )
}
