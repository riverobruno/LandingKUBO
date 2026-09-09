interface WardrobeSketchProps {
  imageSrc: string
  ariaLabel: string
  cabinetLabel: string
}

function WardrobeSketch({ imageSrc, ariaLabel, cabinetLabel }: WardrobeSketchProps) {
  return <img src={imageSrc} role="img" aria-label={ariaLabel} title={cabinetLabel} alt={ariaLabel} className="block h-auto max-h-full min-h-0 w-full max-w-3xl object-contain" />
}

export default WardrobeSketch
