interface DeskMeasurementsProps {
  arrowProgress: number
  deskOffsetX: number
  deskOffsetY: number
  deskScaleX: number
  deskScaleY: number
  guideProgress: number
  labelProgress: number
  noteProgress: number
  opacity: number
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

function DeskMeasurements({
  arrowProgress,
  deskOffsetX,
  deskOffsetY,
  deskScaleX,
  deskScaleY,
  guideProgress,
  labelProgress,
  noteProgress,
  opacity,
  viewportHeight,
  viewportWidth,
}: DeskMeasurementsProps) {
  const deskTransform = `translate(${deskOffsetX} ${deskOffsetY}) scale(${deskScaleX} ${deskScaleY})`
  const noteStyle = { opacity: noteProgress }

  return (
    <svg
      className="absolute inset-0 hidden size-full lg:block"
      viewBox={`0 0 ${viewportWidth} ${viewportHeight}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      style={{ opacity }}
    >
      <defs>
        <marker
          id="desk-callout-arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10" fill="none" stroke="#725a4a" strokeWidth="1.4" />
        </marker>
      </defs>

      <g transform={deskTransform} fill="none" stroke="#725a4a" strokeWidth="2">
        <g id="desk-width-dimension">
          <path d="M 400 265 H 1200" pathLength="1" style={strokeStyle(guideProgress)} />
          <path
            d="M 400 252 V 278 M 1200 252 V 278"
            pathLength="1"
            style={strokeStyle(guideProgress)}
          />
          <circle
            cx="400"
            cy="265"
            r="4"
            fill="#725a4a"
            stroke="none"
            opacity={guideProgress}
          />
          <circle
            cx="1200"
            cy="265"
            r="4"
            fill="#725a4a"
            stroke="none"
            opacity={guideProgress}
          />
        </g>
        <text
          x="800"
          y="242"
          fill="#59473b"
          stroke="none"
          textAnchor="middle"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          fontSize="24"
          style={{ opacity: labelProgress }}
        >
          1400 mm
        </text>

        <g id="desk-height-dimension">
          <path d="M 350 300 V 600" pathLength="1" style={strokeStyle(guideProgress)} />
          <path
            d="M 337 300 H 363 M 337 600 H 363"
            pathLength="1"
            style={strokeStyle(guideProgress)}
          />
          <circle
            cx="350"
            cy="300"
            r="4"
            fill="#725a4a"
            stroke="none"
            opacity={guideProgress}
          />
          <circle
            cx="350"
            cy="600"
            r="4"
            fill="#725a4a"
            stroke="none"
            opacity={guideProgress}
          />
        </g>
        <text
          x="322"
          y="450"
          fill="#59473b"
          stroke="none"
          textAnchor="middle"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          fontSize="24"
          transform="rotate(-90 322 450)"
          style={{ opacity: labelProgress }}
        >
          750 mm
        </text>

        <g className="hidden lg:block">
          <path
            d="M 1050 205 Q 1135 215 1172 297"
            pathLength="1"
            markerEnd="url(#desk-callout-arrow)"
            style={{ ...strokeStyle(arrowProgress), opacity: arrowProgress }}
          />
          <text
            x="1015"
            y="185"
            fill="#59473b"
            stroke="none"
            fontFamily="cursive"
            fontSize="25"
            style={noteStyle}
          >
            Bordes redondeados
          </text>
        </g>

        <path
          d="M 1110 655 Q 1160 590 1100 485"
          pathLength="1"
          markerEnd="url(#desk-callout-arrow)"
          style={{ ...strokeStyle(arrowProgress), opacity: arrowProgress }}
        />
        <text
          x="850"
          y="690"
          fill="#59473b"
          stroke="none"
          fontFamily="cursive"
          fontSize="23"
          style={noteStyle}
        >
          Dos cajones en el lateral derecho
        </text>

        <g className="hidden lg:block">
          <path
            d="M 500 665 Q 525 585 585 520"
            pathLength="1"
            markerEnd="url(#desk-callout-arrow)"
            style={{ ...strokeStyle(arrowProgress), opacity: arrowProgress }}
          />
          <text
            x="390"
            y="700"
            fill="#59473b"
            stroke="none"
            fontFamily="cursive"
            fontSize="25"
            style={noteStyle}
          >
            Diseño minimalista
          </text>
        </g>
      </g>
    </svg>
  )
}

export default DeskMeasurements
