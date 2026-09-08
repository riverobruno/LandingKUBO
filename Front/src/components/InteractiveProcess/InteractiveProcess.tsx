import Hero from '@/components/Hero/Hero'
import PromptScene, {
  type PromptInputBounds,
} from '@/components/InteractiveProcess/PromptScene'
import SketchScene from '@/components/InteractiveProcess/SketchScene'
import promptSceneImage from '@/assets/promptScene.png'
import { useEffect, useRef, useState } from 'react'

const prompt =
  'Quiero un escritorio minimalista de madera clara, con bordes redondeados y dos cajones en el lateral derecho.'

const timelineLength = 900

function timelineRange(start: number, end: number) {
  return [start / timelineLength, end / timelineLength] as const
}

const ranges = {
  heroContent: timelineRange(42, 109),
  heroImage: timelineRange(84, 210),
  furnitureIn: timelineRange(105, 151),
  furnitureOut: timelineRange(185, 244),
  title: timelineRange(210, 260),
  subtitle: timelineRange(244, 294),
  input: timelineRange(277, 336),
  typing: timelineRange(319, 395),
  promptTitleExit: timelineRange(500, 545),
  promptContentExit: timelineRange(530, 575),
  promptSurfaceExit: timelineRange(560, 610),
  sourceContour: timelineRange(615, 655),
  segmentTransform: timelineRange(655, 755),
  sourceCornersExit: timelineRange(655, 700),
  deskTopDetails: timelineRange(690, 760),
  deskLegDetails: timelineRange(710, 785),
  deskCabinetDivider: timelineRange(745, 810),
  deskUpperDrawer: timelineRange(775, 825),
  deskLowerDrawer: timelineRange(805, 840),
} as const

const reducedMotionPromptProgress = 450 / timelineLength

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
    ? scrollProgress > 0.52
      ? 1
      : scrollProgress > 0.04
        ? reducedMotionPromptProgress
        : 0
    : scrollProgress
  const heroContentOpacity = 1 - progressInRange(progress, ranges.heroContent)
  const heroImageOpacity = 1 - progressInRange(progress, ranges.heroImage)
  const backgroundOpacity = progressInRange(progress, ranges.heroImage)
  const furnitureOpacity = prefersReducedMotion
    ? 0
    : progressInRange(progress, ranges.furnitureIn) *
      (1 - progressInRange(progress, ranges.furnitureOut)) *
      0.72
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
  const promptIsAccessible =
    titleProgress > 0.05 && promptContentExitProgress < 0.95
  const sketchIsAccessible =
    promptContentExitProgress >= 0.95 && segmentTransformProgress > 0.2

  return (
    <div ref={trackRef} className="relative h-[1000svh] motion-reduce:h-[200svh]">
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
          imageOpacity={heroImageOpacity}
          isHidden={heroContentOpacity <= 0.05}
        />
        <img
          className="absolute inset-0 size-full object-cover"
          src={promptSceneImage}
          alt=""
          aria-hidden="true"
          style={{ opacity: backgroundOpacity }}
        />
        <PromptScene
          furnitureOpacity={furnitureOpacity}
          inputProgress={inputProgress}
          isAccessible={promptIsAccessible}
          onInputBoundsChange={setPromptInputBounds}
          outlineHandoffProgress={sourceContourProgress}
          promptContentExitProgress={promptContentExitProgress}
          promptText={prompt}
          surfaceExitProgress={promptSurfaceExitProgress}
          subtitleProgress={subtitleProgress}
          titleExitProgress={promptTitleExitProgress}
          titleProgress={titleProgress}
          visiblePromptText={prompt.slice(0, typedCharacters)}
        />
        <SketchScene
          deskProgress={deskProgress}
          inputBounds={promptInputBounds}
          isAccessible={sketchIsAccessible}
          segmentTransformProgress={segmentTransformProgress}
          sourceCornersExitProgress={sourceCornersExitProgress}
          sourceContourProgress={sourceContourProgress}
        />
      </div>
    </div>
  )
}

export default InteractiveProcess
