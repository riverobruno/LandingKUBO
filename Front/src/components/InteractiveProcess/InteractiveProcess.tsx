import Hero from '@/components/Hero/Hero'
import HeroHeader from '@/components/Hero/HeroHeader'
import PromptScene, {
  type PromptInputBounds,
} from '@/components/InteractiveProcess/PromptScene'
import SketchScene from '@/components/InteractiveProcess/SketchScene'
import { calculateDeskLayout } from '@/components/InteractiveProcess/deskLayout'
import promptSceneImage from '@/assets/promptScene.jpeg'
import { lazy, Suspense, useEffect, useRef, useState } from 'react'

const ModelScene = lazy(
  () => import('@/components/InteractiveProcess/ModelScene'),
)

const prompt =
  'Quiero un escritorio minimalista de madera clara, con bordes redondeados y dos cajones en el lateral derecho.'

const timelineLength = 1950

function timelineRange(start: number, end: number) {
  return [start / timelineLength, end / timelineLength] as const
}

const ranges = {
  heroContent: timelineRange(60, 125),
  promptReveal: timelineRange(90, 250),
  title: timelineRange(175, 235),
  subtitle: timelineRange(215, 275),
  input: timelineRange(265, 330),
  typing: timelineRange(315, 395),
  promptTitleExit: timelineRange(500, 545),
  promptContentExit: timelineRange(530, 575),
  promptSurfaceExit: timelineRange(560, 610),
  sourceContour: timelineRange(565, 610),
  segmentTransform: timelineRange(590, 725),
  sourceCornersExit: timelineRange(590, 725),
  principalHandoff: timelineRange(725, 745),
  deskTopDetails: timelineRange(745, 780),
  deskLegDetails: timelineRange(760, 800),
  deskCabinetDivider: timelineRange(780, 820),
  deskUpperDrawer: timelineRange(805, 840),
  deskLowerDrawer: timelineRange(830, 855),
  deskHold: timelineRange(855, 890),
  dimensionGuides: timelineRange(890, 930),
  dimensionLabels: timelineRange(930, 965),
  calloutArrows: timelineRange(965, 1015),
  calloutLabels: timelineRange(995, 1040),
  sketchNarrative: timelineRange(1040, 1100),
  technicalHold: timelineRange(1100, 1200),
  measurementExit: timelineRange(1200, 1260),
  cleanDeskHold: timelineRange(1260, 1310),
  modelReveal: timelineRange(1310, 1430),
  modelTurn: timelineRange(1370, 1450),
  finalHold: timelineRange(1450, 1600),
  explodedTransition: timelineRange(1640, 1760),
  explodedHold: timelineRange(1760, 1950),
} as const

const reducedMotionPromptProgress = 450 / timelineLength
const reducedMotionTechnicalProgress = 1150 / timelineLength

function clamp(value: number) {
  return Math.min(Math.max(value, 0), 1)
}

function progressInRange(progress: number, range: readonly [number, number]) {
  return clamp((progress - range[0]) / (range[1] - range[0]))
}

function easedProgressInRange(progress: number, range: readonly [number, number]) {
  const linearProgress = progressInRange(progress, range)
  return linearProgress * linearProgress * (3 - 2 * linearProgress)
}

function InteractiveProcess() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [promptInputBounds, setPromptInputBounds] = useState<PromptInputBounds | null>(
    null,
  )
  const [modelReady, setModelReady] = useState(false)
  const [explodedReady, setExplodedReady] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let animationFrame = 0
    const updateProgress = () => {
      animationFrame = 0
      const scrollDistance = track.offsetHeight - window.innerHeight
      const nextProgress = clamp(-track.getBoundingClientRect().top / scrollDistance)
      setScrollProgress((current) =>
        Math.abs(current - nextProgress) < 0.001 ? current : nextProgress,
      )
    }
    const requestUpdate = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(updateProgress)
    }

    requestUpdate()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      window.cancelAnimationFrame(animationFrame)
    }
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = (event: MediaQueryListEvent) =>
      setPrefersReducedMotion(event.matches)

    mediaQuery.addEventListener('change', updatePreference)
    return () => mediaQuery.removeEventListener('change', updatePreference)
  }, [])

  const progress = prefersReducedMotion
    ? scrollProgress > 0.7
      ? 1
      : scrollProgress > 0.35
        ? reducedMotionTechnicalProgress
        : scrollProgress > 0.04
          ? reducedMotionPromptProgress
          : 0
    : scrollProgress
  const heroContentOpacity = 1 - progressInRange(progress, ranges.heroContent)
  const promptRevealProgress = easedProgressInRange(progress, ranges.promptReveal)
  const heroExitProgress = clamp((promptRevealProgress - 0.2) / 0.8)
  const titleProgress = progressInRange(progress, ranges.title)
  const subtitleProgress = progressInRange(progress, ranges.subtitle)
  const inputProgress = progressInRange(progress, ranges.input)
  const typedCharacters = Math.floor(
    prompt.length * progressInRange(progress, ranges.typing),
  )
  const promptTitleExitProgress = easedProgressInRange(progress, ranges.promptTitleExit)
  const promptContentExitProgress = easedProgressInRange(
    progress,
    ranges.promptContentExit,
  )
  const promptSurfaceExitProgress = easedProgressInRange(
    progress,
    ranges.promptSurfaceExit,
  )
  const sourceContourProgress = easedProgressInRange(progress, ranges.sourceContour)
  const segmentTransformProgress = easedProgressInRange(
    progress,
    ranges.segmentTransform,
  )
  const principalHandoffProgress = easedProgressInRange(
    progress,
    ranges.principalHandoff,
  )
  const sourceCornersExitProgress = easedProgressInRange(
    progress,
    ranges.sourceCornersExit,
  )
  const deskProgress = {
    cabinetDivider: easedProgressInRange(progress, ranges.deskCabinetDivider),
    legDetails: easedProgressInRange(progress, ranges.deskLegDetails),
    lowerDrawer: easedProgressInRange(progress, ranges.deskLowerDrawer),
    topDetails: easedProgressInRange(progress, ranges.deskTopDetails),
    upperDrawer: easedProgressInRange(progress, ranges.deskUpperDrawer),
  }
  const technicalProgress = {
    calloutArrows: easedProgressInRange(progress, ranges.calloutArrows),
    calloutLabels: easedProgressInRange(progress, ranges.calloutLabels),
    dimensionGuides: easedProgressInRange(progress, ranges.dimensionGuides),
    dimensionLabels: easedProgressInRange(progress, ranges.dimensionLabels),
    narrative: easedProgressInRange(progress, ranges.sketchNarrative),
  }
  const measurementExitProgress = easedProgressInRange(progress, ranges.measurementExit)
  const modelRevealProgress = easedProgressInRange(progress, ranges.modelReveal)
  const modelTurnProgress = easedProgressInRange(progress, ranges.modelTurn)
  const explodedTimelineProgress = easedProgressInRange(
    progress,
    ranges.explodedTransition,
  )
  const effectiveExplodedProgress = explodedReady ? explodedTimelineProgress : 0
  const modelOpacity = modelReady ? modelRevealProgress : 0
  const sketchNarrativeExitProgress = modelOpacity
  const modelNarrativeProgress = modelOpacity
  const sketchOpacity = modelReady ? 1 - modelRevealProgress : 1
  const modelIsVisible = modelReady && modelOpacity > 0.05
  const promptSceneImageClassName =
    'pointer-events-none absolute inset-0 z-10 size-full object-cover'
  const modelIsInteractive = modelReady && progress >= ranges.finalHold[0]
  const shouldLoadModel = progress >= ranges.technicalHold[0]
  const deskLayout = promptInputBounds
    ? calculateDeskLayout(promptInputBounds.viewportWidth, promptInputBounds.viewportHeight)
    : null
  const promptIsAccessible =
    titleProgress > 0.05 && promptContentExitProgress < 0.95
  const sketchNarrativeIsAccessible =
    technicalProgress.narrative > 0.05 && modelNarrativeProgress < 0.5
  const modelNarrativeIsAccessible =
    modelNarrativeProgress >= 0.5 && effectiveExplodedProgress < 0.5
  const explodedNarrativeIsAccessible =
    modelNarrativeProgress >= 0.5 && effectiveExplodedProgress >= 0.5
  const sketchIsAccessible =
    sketchNarrativeIsAccessible ||
    modelNarrativeIsAccessible ||
    explodedNarrativeIsAccessible
  const revealEdge = 112 - promptRevealProgress * 124
  const promptMask = `linear-gradient(to bottom, transparent 0, transparent calc(${revealEdge}% - 12svh), black calc(${revealEdge}% + 12svh), black 100%)`

  return (
    <div ref={trackRef} className="relative h-[2050svh] motion-reduce:h-[300svh]">
      <span
        id="como-funciona"
        className="absolute top-[250svh] motion-reduce:top-[30svh]"
        aria-hidden="true"
      />
      <span
        id="demo"
        className="absolute top-[354svh] motion-reduce:top-[80svh]"
        aria-hidden="true"
      />

      <div className="sticky top-0 h-svh overflow-hidden bg-[var(--color-surface)]">
        <Hero
          contentOpacity={heroContentOpacity}
          exitProgress={heroExitProgress}
          isHidden={heroContentOpacity <= 0.05}
        />
        <img
          className={promptSceneImageClassName}
          src={promptSceneImage}
          alt=""
          aria-hidden="true"
          style={{
            WebkitMaskImage: promptMask,
            maskImage: promptMask,
          }}
        />
        <PromptScene
          inputProgress={inputProgress}
          isAccessible={promptIsAccessible}
          onInputBoundsChange={setPromptInputBounds}
          outlineHandoffProgress={sourceContourProgress}
          promptContentExitProgress={promptContentExitProgress}
          promptText={prompt}
          revealProgress={promptRevealProgress}
          surfaceExitProgress={promptSurfaceExitProgress}
          subtitleProgress={subtitleProgress}
          titleExitProgress={promptTitleExitProgress}
          titleProgress={titleProgress}
          visiblePromptText={prompt.slice(0, typedCharacters)}
        />
        <SketchScene
          deskProgress={deskProgress}
          explodedNarrativeIsAccessible={explodedNarrativeIsAccessible}
          explodedNarrativeProgress={effectiveExplodedProgress}
          inputBounds={promptInputBounds}
          isAccessible={sketchIsAccessible}
          measurementOpacity={1 - measurementExitProgress}
          modelNarrativeIsAccessible={modelNarrativeIsAccessible}
          modelNarrativeProgress={modelNarrativeProgress}
          modelIsAccessible={modelIsVisible}
          principalHandoffProgress={principalHandoffProgress}
          segmentTransformProgress={segmentTransformProgress}
          sourceCornersExitProgress={sourceCornersExitProgress}
          sourceContourProgress={sourceContourProgress}
          sketchOpacity={sketchOpacity}
          sketchNarrativeExitProgress={sketchNarrativeExitProgress}
          sketchNarrativeIsAccessible={sketchNarrativeIsAccessible}
          technicalProgress={technicalProgress}
        />
        {shouldLoadModel && (
          <Suspense fallback={null}>
            <ModelScene
              deskLayout={deskLayout}
              explodedProgress={effectiveExplodedProgress}
              isInteractive={modelIsInteractive}
              isVisible={modelIsVisible}
              modelOpacity={modelOpacity}
              onExplodedReady={setExplodedReady}
              onReady={setModelReady}
              rotationY={modelTurnProgress * -0.24}
            />
          </Suspense>
        )}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-40 h-36 bg-gradient-to-b from-[#24170f]/35 via-[#24170f]/15 to-transparent"
          aria-hidden="true"
        />
        <HeroHeader />
      </div>
    </div>
  )
}

export default InteractiveProcess
