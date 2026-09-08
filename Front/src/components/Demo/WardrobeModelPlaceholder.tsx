import type { DemoTexture } from './types'

interface WardrobeModelPlaceholderProps {
  ariaLabel: string
  wardrobeLabel: string
  texture: DemoTexture
}

function WardrobeModelPlaceholder({ ariaLabel, wardrobeLabel, texture }: WardrobeModelPlaceholderProps) {
  return (
    <svg viewBox="0 0 760 520" role="img" aria-label={ariaLabel} className="h-auto w-full max-w-3xl" xmlns="http://www.w3.org/2000/svg">
      <title>{wardrobeLabel}</title>
      <defs>
        <linearGradient id="model-front" x1="0" x2="1" y1="0" y2="1"><stop stopColor={texture.top} /><stop offset="1" stopColor={texture.front} /></linearGradient>
        <linearGradient id="model-side" x1="0" x2="1"><stop stopColor={texture.side} /><stop offset="1" stopColor={texture.side} /></linearGradient>
        <linearGradient id="model-top" x1="0" x2="0.8" y1="0" y2="1"><stop stopColor={texture.top} /><stop offset="1" stopColor={texture.front} /></linearGradient>
        <filter id="model-shadow" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="13" /></filter>
      </defs>
      <ellipse cx="384" cy="448" rx="245" ry="25" fill="#a89d90" opacity=".28" filter="url(#model-shadow)" />
      <g stroke="#b8afa5" strokeLinejoin="round">
        <path d="M170 96 267 51l354 39-89 50-362-44Z" fill="url(#model-top)" strokeWidth="3" />
        <path d="m170 96 362 44v290l-362-34V96Z" fill="url(#model-front)" strokeWidth="4" />
        <path d="m532 140 89-50v296l-89 44V140Z" fill="url(#model-side)" strokeWidth="4" />
        <path d="m186 113 330 39v250l-330-31V113Z" fill={texture.front} stroke="#cbc3b9" strokeWidth="2" />
        <path d="m351 132 165 20v250l-165-16V132Z" fill="#eee9e2" stroke="#c6beb5" strokeWidth="2" />
        <path d="M186 315h330M186 353h330M351 132v234" fill="none" stroke="#d1c9bf" strokeWidth="3" />
        <path d="M198 151h138M198 204h138M365 166h136M365 219h136" fill="none" stroke="#d8d0c7" strokeWidth="3" />
        <path d="M206 145v120M326 159v113M375 160v118M493 174v115" fill="none" stroke="#d0c8be" strokeWidth="2" />
        <path d="M218 269h98v39h-98zM218 319h98v38h-98zM382 278h102v39H382zM382 328h102v39H382z" fill="#e5dfd7" stroke="#c2bab1" strokeWidth="3" />
        <path d="M263 288h9M263 338h9M428 297h9M428 347h9" stroke="#a69b90" strokeLinecap="round" strokeWidth="7" />
        <path d="M225 145h105M225 202h105M390 161h95M390 217h95" fill="none" stroke="#d4ccc2" strokeWidth="6" />
        <path d="M548 174 603 143M548 224l55-31M548 274l55-31M548 324l55-31M548 374l55-31" fill="none" stroke="#b1a79c" strokeWidth="3" />
        <path d="M170 426 532 460l89-44" fill="none" stroke="#aaa096" strokeWidth="5" />
      </g>
    </svg>
  )
}

export default WardrobeModelPlaceholder
