export const canonicalDeskBounds = {
  bottom: 600,
  left: 400,
  right: 1200,
  top: 300,
} as const

const canonicalDeskWidth = canonicalDeskBounds.right - canonicalDeskBounds.left
const canonicalDeskHeight = canonicalDeskBounds.bottom - canonicalDeskBounds.top
const modelDeskWidth = 1.4
const modelDeskHeight = 0.75

export const deskSketchWidthRatio =
  modelDeskWidth / modelDeskHeight / (canonicalDeskWidth / canonicalDeskHeight)
export const modelViewportHeightRatio = 2.5

export interface DeskLayout {
  offsetX: number
  offsetY: number
  scale: number
}

export interface DeskSketchTransform {
  offsetX: number
  offsetY: number
  scaleX: number
  scaleY: number
}

export function isCompactDeskLandscape(
  viewportWidth: number,
  viewportHeight: number,
) {
  return (
    viewportWidth < 640 &&
    viewportHeight <= 420 &&
    viewportWidth / viewportHeight > 1.4
  )
}

export function calculateDeskLayout(
  viewportWidth: number,
  viewportHeight: number,
): DeskLayout {
  if (isCompactDeskLandscape(viewportWidth, viewportHeight)) {
    const deskTop = 244
    const scale = Math.min(viewportWidth / 900, (viewportHeight - deskTop - 8) / 300)

    return {
      offsetX: viewportWidth / 2 - 800 * scale,
      offsetY: deskTop - 300 * scale,
      scale,
    }
  }

  if (viewportWidth < 640) {
    const scale = Math.min(viewportWidth / 900, viewportHeight / 1300)

    return {
      offsetX: viewportWidth / 2 - 800 * scale,
      offsetY: viewportHeight * 0.76 - 300 * scale,
      scale,
    }
  }

  if (viewportWidth < 1024) {
    const isShortLandscape = viewportWidth / viewportHeight > 1.2
    const scale = isShortLandscape
      ? Math.min((viewportWidth * 0.52) / 800, viewportHeight / 900)
      : Math.min(viewportWidth / 900, viewportHeight / 1300)

    return {
      offsetX: isShortLandscape
        ? viewportWidth * 0.72 - 800 * scale
        : viewportWidth / 2 - 800 * scale,
      offsetY: isShortLandscape
        ? (viewportHeight - 900 * scale) / 2
        : viewportHeight * 0.74 - 300 * scale,
      scale,
    }
  }

  const baseScale = Math.min(viewportWidth / 1600, viewportHeight / 900)
  const scale = baseScale * 0.94
  const rightEdge = (viewportWidth - 1600 * baseScale) / 2 + 1500 * baseScale

  return {
    offsetX: rightEdge - 1200 * scale,
    offsetY: viewportHeight / 2 - 450 * scale,
    scale,
  }
}

export function deskScreenBounds(layout: DeskLayout) {
  return {
    height: (canonicalDeskBounds.bottom - canonicalDeskBounds.top) * layout.scale,
    left: layout.offsetX + canonicalDeskBounds.left * layout.scale,
    top: layout.offsetY + canonicalDeskBounds.top * layout.scale,
    width: (canonicalDeskBounds.right - canonicalDeskBounds.left) * layout.scale,
  }
}

export function calculateDeskSketchTransform(
  layout: DeskLayout,
): DeskSketchTransform {
  const centerX = (canonicalDeskBounds.left + canonicalDeskBounds.right) / 2
  const scaleX = layout.scale * deskSketchWidthRatio

  return {
    offsetX: layout.offsetX + centerX * (layout.scale - scaleX),
    offsetY: layout.offsetY,
    scaleX,
    scaleY: layout.scale,
  }
}

export function deskModelViewportBounds(layout: DeskLayout) {
  const bounds = deskScreenBounds(layout)
  const height = bounds.height * modelViewportHeightRatio

  return {
    height,
    left: bounds.left,
    top: bounds.top - (height - bounds.height) / 2,
    width: bounds.width,
  }
}
