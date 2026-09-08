interface DeskSketchProps {
  cabinetDividerProgress: number
  deskOffsetX: number
  deskOffsetY: number
  deskScale: number
  isAccessible: boolean
  legDetailsProgress: number
  lowerDrawerProgress: number
  topDetailsProgress: number
  upperDrawerProgress: number
  viewportHeight: number
  viewportWidth: number
}

function strokeStyle(progress: number) {
  return {
    strokeDasharray: 1,
    strokeDashoffset: 1 - progress,
  }
}

function DeskSketch({
  cabinetDividerProgress,
  deskOffsetX,
  deskOffsetY,
  deskScale,
  isAccessible,
  legDetailsProgress,
  lowerDrawerProgress,
  topDetailsProgress,
  upperDrawerProgress,
  viewportHeight,
  viewportWidth,
}: DeskSketchProps) {
  const deskTransform = `translate(${deskOffsetX} ${deskOffsetY}) scale(${deskScale})`

  return (
    <svg
      className="absolute inset-0 size-full"
      viewBox={`0 0 ${viewportWidth} ${viewportHeight}`}
      preserveAspectRatio="none"
      fill="none"
      stroke="#4A3528"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="Boceto lineal de un escritorio con dos cajones laterales"
      aria-hidden={!isAccessible}
      focusable="false"
    >
      <g id="desk-top-details" style={strokeStyle(topDetailsProgress)} transform={deskTransform}>
        <path
          id="desk-top-left-corner"
          d="M 400 330 Q 400 300 430 300"
          pathLength="1"
        />
        <path
          id="desk-top-right-corner"
          d="M 1170 300 Q 1200 300 1200 330"
          pathLength="1"
        />
        <path id="desk-top-inner" d="M 420 340 H 1180" pathLength="1" />
      </g>
      <g id="desk-leg-details" style={strokeStyle(legDetailsProgress)} transform={deskTransform}>
        <path id="desk-left-leg-return" d="M 400 600 H 420 V 340" pathLength="1" />
        <path id="desk-right-leg-return" d="M 1200 600 H 1180 V 340" pathLength="1" />
      </g>
      <path
        id="desk-drawer-divider"
        d="M 980 340 V 510"
        pathLength="1"
        style={strokeStyle(cabinetDividerProgress)}
        transform={deskTransform}
      />
      <path
        id="desk-upper-drawer-bottom"
        d="M 980 420 H 1180"
        pathLength="1"
        style={strokeStyle(upperDrawerProgress)}
        transform={deskTransform}
      />
      <path
        id="desk-lower-drawer-bottom"
        d="M 980 510 H 1180"
        pathLength="1"
        style={strokeStyle(lowerDrawerProgress)}
        transform={deskTransform}
      />
    </svg>
  )
}

export default DeskSketch
