interface WardrobeSketchProps {
  ariaLabel: string
  cabinetLabel: string
}

function WardrobeSketch({ ariaLabel, cabinetLabel }: WardrobeSketchProps) {
  return (
    <svg viewBox="0 0 720 430" role="img" aria-label={ariaLabel} className="h-auto w-full max-w-3xl text-stone-800" xmlns="http://www.w3.org/2000/svg">
      <title>{cabinetLabel}</title>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3">
        <rect x="112" y="34" width="496" height="354" rx="2" strokeWidth="7" />
        <path d="M132 54h456v314H132zM288 54v314M446 54v314" />
        <path d="M132 220h156M446 220h142M132 272h156M446 272h142M132 320h156M446 320h142" strokeWidth="2" />
        <path d="M151 107h117M466 107h120M151 169h117M466 169h120" />
        <path d="M151 84v130M268 84v130M466 84v130M586 84v130" strokeWidth="2" />
        <path d="M156 120h106M471 120h110" strokeWidth="5" />
        <path d="M182 120v16l-12 14m12-14 12 14M224 120v16l-12 14m12-14 12 14M500 120v16l-12 14m12-14 12 14M548 120v16l-12 14m12-14 12 14" strokeWidth="2" />
        <path d="m170 150 12 28 12-28 11 28 12-28M488 150l12 28 12-28 11 28 12-28M536 150l12 28 12-28 11 28 12-28" strokeWidth="2" />
        <path d="M172 274h76v34h-76zM172 322h76v34h-76zM462 274h108v82H462z" />
        <path d="M208 291h4M208 339h4M514 313h4" strokeWidth="4" />
        <path d="M145 378h430" strokeWidth="2" />
      </g>
    </svg>
  )
}

export default WardrobeSketch
