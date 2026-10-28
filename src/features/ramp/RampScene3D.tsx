import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import type { RampModelResult } from './rampModel'
import {
  createBookEnvironment,
  createDeskStage,
  createEveryJouleBook,
  createHingedFlap3D,
  type EveryJouleBook,
} from './everyJouleBook'
import { createRampComparisonPopout } from './everyJoulePopout'
import {
  drawContentsBookPage,
  drawLeftBookPage,
  drawRightBookPage,
  type ApplyAnswerIndex,
  type BookPageHitRegion,
  type BookPageReadRegion,
  type BookPageRenderState,
  type PredictionOptionIndex,
} from './bookPageRenderer'

export interface HoverLensState {
  visible: boolean
  x: number
  y: number
  kicker: string
  title: string
  bodyHtml: string
}

export interface WatchTourState {
  active: boolean
  stepIndex: number
  totalSteps: number
  captionTitle: string
  captionBody: string
}

export interface RampScene3DProps {
  result: RampModelResult
  demoProgress: number
  demoStatus: 'idle' | 'playing' | 'paused' | 'completed'
  stillMode: boolean
  prediction: PredictionOptionIndex
  flapOpen: boolean
  applyAnswer: ApplyAnswerIndex
  stampEarned: boolean
  spreadIndex: number
  watchTrigger: number
  onSpreadChange: (nextSpread: number) => void
  onSelectPrediction: (idx: 0 | 1 | 2) => void
  onToggleFlap: () => void
  onSelectApplyAnswer: (idx: 0 | 1) => void
  onScrubProgress: (nextProgress: number) => void
  onDragRampLength: (nextLengthM: number) => void
  onTriggerPlay: () => void
  onHoverLensChange: (lens: HoverLensState | null) => void
  onWatchStateChange: (state: WatchTourState) => void
  onOpenLensLesson?: () => void
}

interface GuidedShot {
  duration: number
  title: string
  body: string
  posOffset: [number, number, number]
  lookOffset: [number, number, number]
  onEnter?: () => void
}

export const RampScene3D: React.FC<RampScene3DProps> = ({
  result,
  demoProgress,
  demoStatus,
  stillMode,
  prediction,
  flapOpen,
  applyAnswer,
  stampEarned,
  spreadIndex,
  watchTrigger,
  onSpreadChange,
  onSelectPrediction,
  onToggleFlap,
  onSelectApplyAnswer,
  onScrubProgress,
  onDragRampLength,
  onTriggerPlay,
  onHoverLensChange,
  onWatchStateChange,
  onOpenLensLesson,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null)

  // Keep latest props in a mutable ref so the 60fps requestAnimationFrame loop always reads fresh state
  const propsRef = useRef({
    result,
    demoProgress,
    demoStatus,
    stillMode,
    prediction,
    flapOpen,
    applyAnswer,
    stampEarned,
    spreadIndex,
    onSpreadChange,
    onSelectPrediction,
    onToggleFlap,
    onSelectApplyAnswer,
    onScrubProgress,
    onDragRampLength,
    onTriggerPlay,
    onHoverLensChange,
    onWatchStateChange,
    onOpenLensLesson,
  })
  useEffect(() => {
    propsRef.current = {
      result,
      demoProgress,
      demoStatus,
      stillMode,
      prediction,
      flapOpen,
      applyAnswer,
      stampEarned,
      spreadIndex,
      onSpreadChange,
      onSelectPrediction,
      onToggleFlap,
      onSelectApplyAnswer,
      onScrubProgress,
      onDragRampLength,
      onTriggerPlay,
      onHoverLensChange,
      onWatchStateChange,
      onOpenLensLesson,
    }
  })

  const bookRef = useRef<EveryJouleBook | null>(null)
  const watchCtrlRef = useRef<{ toggle: () => void; stop: () => void } | null>(null)

  // Trigger or stop 5-shot guided camera tour when watchTrigger increments
  useEffect(() => {
    if (watchTrigger > 0 && watchCtrlRef.current) {
      watchCtrlRef.current.toggle()
    }
  }, [watchTrigger])

  // Sync external spread navigation (e.g. ‹ / › capsule buttons)
  useEffect(() => {
    const book = bookRef.current
    if (!book) return
    if (Math.round(book.position) !== spreadIndex) {
      book.goTo(spreadIndex, propsRef.current.stillMode ? 0.01 : 1.05)
    }
  }, [spreadIndex])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // 1. WebGLRenderer, Scene & Camera (exact Every Joule main.js setup)
    const canvas = document.createElement('canvas')
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    canvas.style.display = 'block'
    canvas.style.touchAction = 'none'
    container.innerHTML = ''
    container.appendChild(canvas)

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        powerPreference: 'high-performance',
      })
    } catch {
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.03

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#1d1711')
    try {
      scene.environment = createBookEnvironment(renderer)
    } catch {
      // Fallback if PMREM fails in restricted environments
    }

    const camera = new THREE.PerspectiveCamera(32, 16 / 10, 10, 4000)
    createDeskStage(scene)

    // Store page hit/read regions for raycasting
    const pageHitRegions = new Map<string, BookPageHitRegion[]>()
    const pageReadRegions = new Map<string, BookPageReadRegion[]>()

    const getRenderState = (): BookPageRenderState => ({
      result: propsRef.current.result,
      prediction: propsRef.current.prediction,
      flapOpen: propsRef.current.flapOpen,
      applyAnswer: propsRef.current.applyAnswer,
      stampEarned: propsRef.current.stampEarned,
      demoProgress: propsRef.current.demoProgress,
      demoStatus: propsRef.current.demoStatus,
    })

    // 2. Deformable 3D Book (nSpreads: 2 => 0 = Cover, 1 = Contents, 2 = Lesson 1)
    const book = createEveryJouleBook({
      nSpreads: 2,
      drawPage: (k, side, ctx, pxPerMm) => {
        const pageCanvas = ctx.canvas
        if (k === 1) {
          const { hits, reads } = drawContentsBookPage(pageCanvas, side, pxPerMm)
          pageHitRegions.set(`1:${side}`, hits)
          pageReadRegions.set(`1:${side}`, reads)
        } else if (k === 2) {
          const st = getRenderState()
          if (side === 'left') {
            const { hits, reads } = drawLeftBookPage(pageCanvas, st, pxPerMm)
            pageHitRegions.set('2:left', hits)
            pageReadRegions.set('2:left', reads)
          } else {
            const { hits, reads } = drawRightBookPage(pageCanvas, st, pxPerMm)
            pageHitRegions.set('2:right', hits)
            pageReadRegions.set('2:right', reads)
          }
        }
      },
    })
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

    // 3. 3D Hinged Paper Flap on Left Page of Spread 2
    const flap3D = createHingedFlap3D(book, 2, {
      u0: 54,
      v0: 185,
      u1: 176,
      v1: 235,
    })
    scene.add(flap3D.group)

    // 4. 3D Pop-Out Side-by-Side Ramp & Direct Lift Apparatus on Right Page of Spread 2
    const popout = createRampComparisonPopout()
    scene.add(popout.root)

    // Popout unfolding state machine (hidden -> peel -> shade -> live)
    let popState: 'hidden' | 'peel' | 'shade' | 'live' = 'hidden'
    let popTimer = 0
    const beginPopoutReveal = (instant: boolean) => {
      if (instant) {
        popState = 'live'
        popout.shared.uLiftAll.value = 1
        popout.shared.uClock.value = popout.maxClock + 1
        popout.shared.uFillAlpha.value = 1
        popout.root.visible = true
      } else {
        popState = 'peel'
        popTimer = 0
        popout.shared.uLiftAll.value = 0.01
        popout.shared.uClock.value = 0
        popout.shared.uFillAlpha.value = 0.08
        popout.root.visible = true
      }
    }

    // Start closed (0) and smoothly open the book to Lesson 1 (2) on launch!
    let openTimer: number | null = null
    if (propsRef.current.stillMode) {
      book.setPosition(propsRef.current.spreadIndex)
      beginPopoutReveal(true)
    } else {
      book.setPosition(0)
      openTimer = window.setTimeout(() => {
        book.goTo(propsRef.current.spreadIndex, 1.3)
      }, 180)
    }

    // 5. Camera Framing & Orbit State (exact port of main-CpVTDnX_.js computeSpreadFrame + orbit)
    const camPos = new THREE.Vector3(0, 460, 310)
    const camLook = new THREE.Vector3(0, 12, 8)
    const targetPos = new THREE.Vector3(0, 460, 310)
    const targetLook = new THREE.Vector3(0, 12, 8)
    let camInitialized = false

    const orbit = {
      yaw: 0,
      pitch: 0,
      zoom: 1,
      panX: 0,
      panZ: 0,
    }

    // 6. 5-Shot Guided 3D Camera Tour (watchMode)
    let watchActive = false
    let watchStep = 0
    let watchStepElapsed = 0

    const guidedShots: GuidedShot[] = [
      {
        duration: 3.6,
        title: '1 · The Guiding Question',
        body: 'Lifting a 10 kg crate straight up 1.0 m needs 98.1 N of force. What changes when we slide it up a frictionless ramp instead?',
        posOffset: [-95, -135, 25],
        lookOffset: [-88, 6, -10],
      },
      {
        duration: 4.0,
        title: '2 · Both Crates Climb to 1.0 m',
        body: 'Watch both 10 kg crates climb to the exact same 1.0 m height! Direct Lift (left) pulls straight up with 98.1 N.',
        posOffset: [28, -155, 55],
        lookOffset: [42, 16, 12],
        onEnter: () => {
          propsRef.current.onTriggerPlay()
          popout.triggerRun()
        },
      },
      {
        duration: 4.2,
        title: '3 · Half the Force, Twice the Distance',
        body: 'On the 2.0 m ramp, the blue pulling-force arrow is half as tall (49.05 N = 2× easier), because the crate travels 2.0 m along the slope!',
        posOffset: [115, -185, 85],
        lookOffset: [92, 18, 16],
      },
      {
        duration: 4.2,
        title: '4 · Both Energy Jars Fill to 98.1 J',
        body: 'Follow the glowing energy streams into the two Gravitational Store jars at the back: both fill to the exact same 98.1 J!',
        posOffset: [95, -195, -5],
        lookOffset: [98, 22, -36],
      },
      {
        duration: 3.8,
        title: '5 · Lift the Flap & Try Dragging the Ramp',
        body: 'Work = Force × Distance (49.05 N × 2.0 m = 98.1 J). Now drag the orange ramp foot handle or crate yourself!',
        posOffset: [0, -35, 15],
        lookOffset: [0, 12, 0],
        onEnter: () => {
          if (!propsRef.current.flapOpen) {
            propsRef.current.onToggleFlap()
          }
        },
      },
    ]

    const emitWatchState = () => {
      const shot = guidedShots[watchStep] ?? guidedShots[0]
      propsRef.current.onWatchStateChange({
        active: watchActive,
        stepIndex: watchStep,
        totalSteps: guidedShots.length,
        captionTitle: shot.title,
        captionBody: shot.body,
      })
    }

    watchCtrlRef.current = {
      toggle: () => {
        if (watchActive) {
          watchActive = false
          emitWatchState()
        } else {
          if (Math.round(book.position) !== 2) {
            propsRef.current.onSpreadChange(2)
            book.goTo(2, 0.9)
          }
          watchActive = true
          watchStep = 0
          watchStepElapsed = 0
          if (guidedShots[0].onEnter) guidedShots[0].onEnter()
          emitWatchState()
        }
      },
      stop: () => {
        if (watchActive) {
          watchActive = false
          emitWatchState()
        }
      },
    }

    // Sizing helper
    const updateSize = () => {
      const rect = container.getBoundingClientRect()
      const w = Math.max(320, rect.width)
      const h = Math.max(260, rect.height)
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      popout.shared.uResolution.value.set(w, h)
    }
    updateSize()
    const resizeObs = new ResizeObserver(updateSize)
    resizeObs.observe(container)

    // 7. Raycasting, 3D Dragging, Camera Orbit & Reading Lens
    const raycaster = new THREE.Raycaster()
    const pointerNdc = new THREE.Vector2()
    const dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -14)
    const dragHitPoint = new THREE.Vector3()

    let activeDrag:
      | null
      | { type: 'crate' }
      | { type: 'foot' }
      | {
          type: 'orbit'
          startX: number
          startY: number
          startYaw: number
          startPitch: number
          moved: boolean
        } = null

    const setPointerFromEvent = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointerNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      pointerNdc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(pointerNdc, camera)
    }

    const findPopoutHit = () => {
      if (book.openSpread !== 2 || popState === 'hidden') return null
      for (const target of popout.hitTargets) {
        const hits = raycaster.intersectObject(target.mesh, true)
        if (hits.length > 0) {
          return { target, point: hits[0].point }
        }
      }
      return null
    }

    const onPointerDown = (e: PointerEvent) => {
      setPointerFromEvent(e)
      canvas.setPointerCapture(e.pointerId)

      // Check 3D popout interactive targets first (crate, ramp foot, start button, jars)
      const popHit = findPopoutHit()
      if (popHit) {
        if (watchActive) {
          watchActive = false
          emitWatchState()
        }
        if (popHit.target.id === 'crate') {
          dragPlane.setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 0, 1), popHit.point)
          activeDrag = { type: 'crate' }
          canvas.style.cursor = 'grabbing'
          return
        }
        if (popHit.target.id === 'foot') {
          dragPlane.setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 1, 0), popHit.point)
          activeDrag = { type: 'foot' }
          canvas.style.cursor = 'grabbing'
          return
        }
        if (popHit.target.id === 'start' || popHit.target.id === 'rigLift') {
          propsRef.current.onTriggerPlay()
          popout.triggerRun()
          return
        }
      }

      // Check 3D hinged paper flap on left page
      if (book.openSpread === 2) {
        const flapHits = raycaster.intersectObject(flap3D.mesh, true)
        if (flapHits.length > 0) {
          propsRef.current.onToggleFlap()
          return
        }
      }

      // Otherwise begin smooth camera orbit (if pointer does not move much, pointerup treats it as a page click!)
      activeDrag = {
        type: 'orbit',
        startX: e.clientX,
        startY: e.clientY,
        startYaw: orbit.yaw,
        startPitch: orbit.pitch,
        moved: false,
      }
    }

    const onPointerMove = (e: PointerEvent) => {
      setPointerFromEvent(e)
      const rect = canvas.getBoundingClientRect()
      const localX = e.clientX - rect.left
      const localY = e.clientY - rect.top

      if (activeDrag) {
        if (activeDrag.type === 'crate') {
          if (raycaster.ray.intersectPlane(dragPlane, dragHitPoint)) {
            const nextProg = popout.projectWorldToRampProgress(dragHitPoint)
            propsRef.current.onScrubProgress(nextProg)
          }
          return
        }
        if (activeDrag.type === 'foot') {
          if (raycaster.ray.intersectPlane(dragPlane, dragHitPoint)) {
            const nextLen = popout.projectWorldToRampLengthM(
              dragHitPoint,
              propsRef.current.result.heightM
            )
            propsRef.current.onDragRampLength(nextLen)
          }
          return
        }
        if (activeDrag.type === 'orbit') {
          const dx = e.clientX - activeDrag.startX
          const dy = e.clientY - activeDrag.startY
          if (Math.hypot(dx, dy) > 5) {
            activeDrag.moved = true
            if (watchActive) {
              watchActive = false
              emitWatchState()
            }
            orbit.yaw = Math.max(-0.62, Math.min(0.62, activeDrag.startYaw - dx * 0.0038))
            orbit.pitch = Math.max(-0.32, Math.min(0.42, activeDrag.startPitch + dy * 0.0032))
            canvas.style.cursor = 'grabbing'
          }
          return
        }
      }

      // Hover hit testing for 3D popout targets, 3D flap, and 2D book page regions
      const popHit = findPopoutHit()
      if (popHit) {
        canvas.style.cursor = popHit.target.cursor
        propsRef.current.onHoverLensChange({
          visible: true,
          x: localX,
          y: localY,
          kicker: popHit.target.lens.kicker,
          title: popHit.target.lens.title,
          bodyHtml: popHit.target.lens.bodyHtml,
        })
        return
      }

      if (book.openSpread === 2) {
        const flapHits = raycaster.intersectObject(flap3D.mesh, true)
        if (flapHits.length > 0) {
          canvas.style.cursor = 'pointer'
          propsRef.current.onHoverLensChange({
            visible: true,
            x: localX,
            y: localY,
            kicker: 'INTERACTIVE PAPER FLAP · WHY?',
            title: propsRef.current.flapOpen
              ? 'Click to Lower the Answer Flap'
              : 'Click to Lift the Answer Flap',
            bodyHtml:
              'Unfold the hinged paper flap to inspect the work equation W = F_pull × L = m g h and see why force and distance trade off.',
          })
          return
        }
      }

      const pageHit = book.hitTest(raycaster)
      if (pageHit) {
        const key = `${pageHit.k}:${pageHit.side}`
        const hits = pageHitRegions.get(key) ?? []
        const matchedHit = hits.find(
          (r) =>
            pageHit.u >= r.u0 &&
            pageHit.u <= r.u1 &&
            pageHit.v >= r.v0 &&
            pageHit.v <= r.v1
        )
        const reads = pageReadRegions.get(key) ?? []
        const matchedRead = reads.find(
          (r) =>
            pageHit.u >= r.u0 &&
            pageHit.u <= r.u1 &&
            pageHit.v >= r.v0 &&
            pageHit.v <= r.v1
        )
        canvas.style.cursor = matchedHit ? 'pointer' : 'grab'
        if (matchedRead) {
          propsRef.current.onHoverLensChange({
            visible: true,
            x: localX,
            y: localY,
            kicker: matchedRead.kicker,
            title: matchedRead.title,
            bodyHtml: matchedRead.lines.join('<br/>'),
          })
          return
        }
      }

      canvas.style.cursor = 'grab'
      propsRef.current.onHoverLensChange(null)
    }

    const onPointerUp = (e: PointerEvent) => {
      if (canvas.hasPointerCapture(e.pointerId)) {
        canvas.releasePointerCapture(e.pointerId)
      }
      const wasOrbitClick = activeDrag?.type === 'orbit' && !activeDrag.moved
      activeDrag = null
      canvas.style.cursor = 'grab'

      if (!wasOrbitClick) return

      setPointerFromEvent(e)
      // If closed cover (spread 0) is clicked, open the book to Lesson 1 (spread 2)
      if (Math.round(book.position) === 0) {
        propsRef.current.onSpreadChange(2)
        book.goTo(2, 1.25)
        return
      }

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
        propsRef.current.onSpreadChange(2)
        book.goTo(2, propsRef.current.stillMode ? 0.01 : 1.05)
      } else if (matched.id === 'open:lesson2') {
        propsRef.current.onOpenLensLesson?.()
      } else if (matched.id.startsWith('predict:')) {
        const idx = Number(matched.id.split(':')[1]) as 0 | 1 | 2
        propsRef.current.onSelectPrediction(idx)
      } else if (matched.id === 'flap') {
        propsRef.current.onToggleFlap()
      } else if (matched.id.startsWith('apply:')) {
        const idx = Number(matched.id.split(':')[1]) as 0 | 1
        propsRef.current.onSelectApplyAnswer(idx)
      } else if (matched.id.startsWith('preset:')) {
        const len = Number(matched.id.split(':')[1])
        if (Number.isFinite(len)) {
          propsRef.current.onDragRampLength(len)
        }
      }
    }

    const onDoubleClick = () => {
      orbit.yaw = 0
      orbit.pitch = 0
      orbit.zoom = 1
      orbit.panX = 0
      orbit.panZ = 0
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      orbit.zoom = Math.max(0.74, Math.min(1.36, orbit.zoom + e.deltaY * 0.0007))
    }

    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerup', onPointerUp)
    canvas.addEventListener('dblclick', onDoubleClick)
    canvas.addEventListener('wheel', onWheel, { passive: false })

    // 8. Continuous 60fps Animation Loop (Bo from Every Joule main.js)
    let rafId = 0
    let lastTime = performance.now()
    let lastStateSignature = ''
    const basePos = new THREE.Vector3()
    const baseLook = new THREE.Vector3()

    const animate = (now: number) => {
      rafId = window.requestAnimationFrame(animate)
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000))
      lastTime = now

      const st = propsRef.current

      // Check if 2D book page canvas textures need redrawing
      const sig = `${st.result.massKg}:${st.result.heightM}:${st.result.rampLengthM}:${st.prediction}:${st.flapOpen}:${st.applyAnswer}:${st.stampEarned}:${Math.round(st.demoProgress * 50)}:${st.demoStatus}`
      if (sig !== lastStateSignature) {
        lastStateSignature = sig
        book.markPageDirty(2, 'left')
        book.markPageDirty(2, 'right')
      }

      // Update deformable 3D book page-turn kinematics
      book.update(dt)

      // Update 3D hinged flap & 3D pop-out apparatus
      const onLessonSpread = book.openSpread === 2 && !book.turning
      flap3D.group.visible = onLessonSpread
      if (onLessonSpread) {
        flap3D.place()
        flap3D.setOpen(st.flapOpen)
        flap3D.update(dt)

        popout.placeOnPage(book, 2)
        popout.syncPhysics(st.result, st.demoProgress, st.demoStatus)
        if (popState === 'hidden') {
          beginPopoutReveal(st.stillMode)
        }
      } else {
        popState = 'hidden'
        popout.root.visible = false
      }

      // Advance popout unfolding & fountain-pen drawing state machine (peel -> shade -> live)
      if (popState === 'peel') {
        popTimer += dt
        const liftT = Math.min(1, popTimer / 0.44)
        const easeOut = 1 - Math.pow(1 - liftT, 3)
        popout.shared.uLiftAll.value = easeOut
        popout.shared.uClock.value = (popTimer / 0.82) * popout.maxClock
        popout.shared.uFillAlpha.value = 0.12 + 0.35 * liftT
        if (popTimer >= 0.82) {
          popState = 'shade'
          popTimer = 0
        }
      } else if (popState === 'shade') {
        popTimer += dt
        const shadeT = Math.min(1, popTimer / 0.32)
        popout.shared.uLiftAll.value = 1
        popout.shared.uClock.value = popout.maxClock + 1
        popout.shared.uFillAlpha.value = 0.47 + 0.53 * shadeT
        if (shadeT >= 1) {
          popState = 'live'
        }
      }

      if (popout.root.visible) {
        popout.update(dt)
      }

      // Compute camera framing (exact Every Joule framing for closed vs open spread)
      const openBlend = Math.min(1, Math.max(0, book.position))
      const closedX = book.dims.W * 0.46
      const fovRad = THREE.MathUtils.degToRad(camera.fov)
      const tanHalfFov = Math.tan(fovRad * 0.5)
      const fitW = (book.dims.W * 2.15) / (2 * tanHalfFov * Math.max(0.65, camera.aspect))
      const fitH = (book.dims.D * 1.25) / (2 * tanHalfFov)
      const dist = Math.max(410, Math.min(720, Math.max(fitW, fitH)))

      baseLook.set(closedX * (1 - openBlend), 12, 10)
      basePos.set(baseLook.x, dist * 0.82, dist * 0.56)

      if (watchActive) {
        watchStepElapsed += dt
        const shot = guidedShots[watchStep] ?? guidedShots[0]
        if (watchStepElapsed >= shot.duration) {
          watchStep++
          watchStepElapsed = 0
          if (watchStep >= guidedShots.length) {
            watchActive = false
            emitWatchState()
          } else {
            if (guidedShots[watchStep].onEnter) guidedShots[watchStep].onEnter!()
            emitWatchState()
          }
        }
        if (watchActive) {
          const curShot = guidedShots[watchStep]
          targetPos.set(
            basePos.x + curShot.posOffset[0],
            basePos.y + curShot.posOffset[1],
            basePos.z + curShot.posOffset[2]
          )
          targetLook.set(
            baseLook.x + curShot.lookOffset[0],
            baseLook.y + curShot.lookOffset[1],
            baseLook.z + curShot.lookOffset[2]
          )
        }
      }

      if (!watchActive) {
        const offset = basePos.clone().sub(baseLook).multiplyScalar(orbit.zoom)
        // Rotate camera offset by user orbit yaw & pitch
        const spherical = new THREE.Spherical().setFromVector3(offset)
        spherical.theta += orbit.yaw
        spherical.phi = Math.max(0.22, Math.min(1.38, spherical.phi - orbit.pitch))
        offset.setFromSpherical(spherical)

        targetLook.set(baseLook.x + orbit.panX, baseLook.y, baseLook.z + orbit.panZ)
        targetPos.copy(targetLook).add(offset)
      }

      if (!camInitialized) {
        camPos.copy(targetPos)
        camLook.copy(targetLook)
        camInitialized = true
      } else {
        const damp = 1 - Math.exp(-dt * (watchActive ? 4.2 : 7.5))
        camPos.lerp(targetPos, damp)
        camLook.lerp(targetLook, damp)
      }

      camera.position.copy(camPos)
      camera.lookAt(camLook)

      renderer.render(scene, camera)
    }

    rafId = window.requestAnimationFrame(animate)

    return () => {
      if (openTimer !== null) window.clearTimeout(openTimer)
      window.cancelAnimationFrame(rafId)
      resizeObs.disconnect()
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup', onPointerUp)
      canvas.removeEventListener('dblclick', onDoubleClick)
      canvas.removeEventListener('wheel', onWheel)
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="ej-stage-canvas-wrap"
      role="region"
      aria-label="Interactive 3D Every Joule textbook: Side-by-side Direct Vertical Lift and Frictionless Ramp apparatus with glowing Gravitational Energy Store jars"
    />
  )
}
