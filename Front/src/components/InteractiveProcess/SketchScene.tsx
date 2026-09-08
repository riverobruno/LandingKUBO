import DeskSketch from '@/components/InteractiveProcess/DeskSketch'
import type { PromptInputBounds } from '@/components/InteractiveProcess/PromptScene'

interface DeskProgress {
  cabinetDivider: number
  legDetails: number
  lowerDrawer: number
  topDetails: number
  upperDrawer: number
}

interface SketchSceneProps {
  deskProgress: DeskProgress
  inputBounds: PromptInputBounds | null
  isAccessible: boolean
  segmentTransformProgress: number
  sourceCornersExitProgress: number
  sourceContourProgress: number
}

interface Point {
  x: number
  y: number
}

interface LineGeometry {
  end: Point
  start: Point
}

interface CornerGeometry {
  collapse: Point
  control1: Point
  control2: Point
  end: Point
  start: Point
}

const circleControlRatio = 0.5522847498

const canonicalTargetSegments = {
  top: { start: { x: 430, y: 300 }, end: { x: 1170, y: 300 } },
  bottom: { start: { x: 980, y: 415 }, end: { x: 420, y: 415 } },
  left: { start: { x: 400, y: 600 }, end: { x: 400, y: 330 } },
  right: { start: { x: 1200, y: 330 }, end: { x: 1200, y: 600 } },
} satisfies Record<string, LineGeometry>

function lerp(start: number, end: number, progress: number) {
  return start + (end - start) * progress
}

function interpolateLine(
  source: LineGeometry,
  target: LineGeometry,
  progress: number,
) {
  return {
    x1: lerp(source.start.x, target.start.x, progress),
    y1: lerp(source.start.y, target.start.y, progress),
    x2: lerp(source.end.x, target.end.x, progress),
    y2: lerp(source.end.y, target.end.y, progress),
  }
}

function calculateDeskTransform(viewportWidth: number, viewportHeight: number) {
  const scale = Math.min(viewportWidth / 1600, viewportHeight / 900)

  return {
    offsetX: (viewportWidth - 1600 * scale) / 2,
    offsetY: (viewportHeight - 900 * scale) / 2,
    scale,
  }
}

function transformPoint(
  point: Point,
  transform: ReturnType<typeof calculateDeskTransform>,
) {
  return {
    x: transform.offsetX + point.x * transform.scale,
    y: transform.offsetY + point.y * transform.scale,
  }
}

function createSourceGeometry(bounds: PromptInputBounds) {
  const radius = Math.min(bounds.radius, bounds.width / 2, bounds.height / 2)
  const controlOffset = radius * circleControlRatio
  const left = bounds.x
  const right = bounds.x + bounds.width
  const top = bounds.y
  const bottom = bounds.y + bounds.height

  const segments = {
    top: { start: { x: left + radius, y: top }, end: { x: right - radius, y: top } },
    bottom: {
      start: { x: right - radius, y: bottom },
      end: { x: left + radius, y: bottom },
    },
    left: {
      start: { x: left, y: bottom - radius },
      end: { x: left, y: top + radius },
    },
    right: {
      start: { x: right, y: top + radius },
      end: { x: right, y: bottom - radius },
    },
  } satisfies Record<string, LineGeometry>
  const corners: CornerGeometry[] = [
    {
      start: segments.top.start,
      control1: { x: left + radius - controlOffset, y: top },
      control2: { x: left, y: top + radius - controlOffset },
      end: segments.left.end,
      collapse: { x: left + radius / 2, y: top + radius / 2 },
    },
    {
      start: segments.left.start,
      control1: { x: left, y: bottom - radius + controlOffset },
      control2: { x: left + radius - controlOffset, y: bottom },
      end: segments.bottom.end,
      collapse: { x: left + radius / 2, y: bottom - radius / 2 },
    },
    {
      start: segments.bottom.start,
      control1: { x: right - radius + controlOffset, y: bottom },
      control2: { x: right, y: bottom - radius + controlOffset },
      end: segments.right.end,
      collapse: { x: right - radius / 2, y: bottom - radius / 2 },
    },
    {
      start: segments.right.start,
      control1: { x: right, y: top + radius - controlOffset },
      control2: { x: right - radius + controlOffset, y: top },
      end: segments.top.end,
      collapse: { x: right - radius / 2, y: top + radius / 2 },
    },
  ]

  return { corners, segments }
}

function contractCorner(corner: CornerGeometry, progress: number) {
  const point = (source: Point) => ({
    x: lerp(source.x, corner.collapse.x, progress),
    y: lerp(source.y, corner.collapse.y, progress),
  })
  const start = point(corner.start)
  const control1 = point(corner.control1)
  const control2 = point(corner.control2)
  const end = point(corner.end)

  return `M ${start.x} ${start.y} C ${control1.x} ${control1.y} ${control2.x} ${control2.y} ${end.x} ${end.y}`
}

function SketchScene({
  deskProgress,
  inputBounds,
  isAccessible,
  segmentTransformProgress,
  sourceCornersExitProgress,
  sourceContourProgress,
}: SketchSceneProps) {
  const sourceStrokeOpacity = 0.7
  const cornerOpacity =
    sourceStrokeOpacity * sourceContourProgress * (1 - sourceCornersExitProgress)
  if (!inputBounds) return null

  const deskTransform = calculateDeskTransform(
    inputBounds.viewportWidth,
    inputBounds.viewportHeight,
  )
  const sourceGeometry = createSourceGeometry(inputBounds)
  const targetSegments = Object.fromEntries(
    Object.entries(canonicalTargetSegments).map(([name, line]) => [
      name,
      {
        start: transformPoint(line.start, deskTransform),
        end: transformPoint(line.end, deskTransform),
      },
    ]),
  ) as Record<keyof typeof canonicalTargetSegments, LineGeometry>
  const segmentStrokeWidth = lerp(1, 4 * deskTransform.scale, segmentTransformProgress)
  const segmentOpacity =
    sourceContourProgress *
    lerp(sourceStrokeOpacity, 1, segmentTransformProgress)

  return (
    <section
      className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
      aria-hidden={!isAccessible}
    >
      <svg
        className="absolute inset-0 size-full"
        viewBox={`0 0 ${inputBounds.viewportWidth} ${inputBounds.viewportHeight}`}
        preserveAspectRatio="none"
        fill="none"
        stroke="#4A3528"
        strokeWidth={segmentStrokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {Object.keys(sourceGeometry.segments).map((name) => {
          const segmentName = name as keyof typeof sourceGeometry.segments
          const line = interpolateLine(
            sourceGeometry.segments[segmentName],
            targetSegments[segmentName],
            segmentTransformProgress,
          )

          return (
            <line
              key={segmentName}
              id={`input-${segmentName}-to-desk`}
              {...line}
              pathLength="1"
              opacity={segmentOpacity}
            />
          )
        })}
        {sourceGeometry.corners.map((corner, index) => (
          <path
            key={index}
            id={`input-corner-${index + 1}`}
            d={contractCorner(corner, sourceCornersExitProgress)}
            pathLength="1"
            opacity={cornerOpacity}
          />
        ))}
      </svg>

      <DeskSketch
        cabinetDividerProgress={deskProgress.cabinetDivider}
        deskOffsetX={deskTransform.offsetX}
        deskOffsetY={deskTransform.offsetY}
        deskScale={deskTransform.scale}
        isAccessible={isAccessible}
        legDetailsProgress={deskProgress.legDetails}
        lowerDrawerProgress={deskProgress.lowerDrawer}
        topDetailsProgress={deskProgress.topDetails}
        upperDrawerProgress={deskProgress.upperDrawer}
        viewportHeight={inputBounds.viewportHeight}
        viewportWidth={inputBounds.viewportWidth}
      />
    </section>
  )
}

export default SketchScene
