interface DeskSketchProps {
  cabinetDividerProgress: number
  deskOffsetX: number
  deskOffsetY: number
  deskScaleX: number
  deskScaleY: number
  legDetailsProgress: number
  lowerDrawerProgress: number
  opacity: number
  principalHandoffProgress: number
  topDetailsProgress: number
  upperDrawerProgress: number
  viewportHeight: number
  viewportWidth: number
}

function strokeStyle(progress: number) {
  return {
    opacity: progress,
    strokeDasharray: 1,
    strokeDashoffset: 1 - progress,
  }
}

function DeskSketch({
  cabinetDividerProgress,
  deskOffsetX,
  deskOffsetY,
  deskScaleX,
  deskScaleY,
  legDetailsProgress,
  lowerDrawerProgress,
  opacity,
  principalHandoffProgress,
  topDetailsProgress,
  upperDrawerProgress,
  viewportHeight,
  viewportWidth,
}: DeskSketchProps) {
  const deskTransform = `translate(${deskOffsetX} ${deskOffsetY}) scale(${deskScaleX} ${deskScaleY})`

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
      aria-hidden="true"
      focusable="false"
      style={{ opacity }}
    >
      <g
        id="desk-principal-geometry"
        opacity={principalHandoffProgress >= 1 ? 1 : 0}
        transform={deskTransform}
      >
        <path id="desk-top-principal" d="M 430 300 H 1170" pathLength="1" />
        <path id="desk-apron-bottom" d="M 420 415 H 980" pathLength="1" />
        <path id="desk-left-leg-outer" d="M 400 330 V 600" pathLength="1" />
        <path id="desk-right-leg-outer" d="M 1200 330 V 600" pathLength="1" />
      </g>
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
