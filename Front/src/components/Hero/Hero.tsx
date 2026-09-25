import heroImage from '@/assets/hero.png'
import { ArrowDown, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

interface HeroProps {
  contentOpacity: number
  exitProgress: number
  isHidden: boolean
}

const linkFocus =
  'rounded-sm outline-none transition-opacity hover:opacity-75 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-transparent'

function Hero({ contentOpacity, exitProgress, isHidden }: HeroProps) {
  return (
    <section
      className="absolute inset-0 flex overflow-hidden text-white"
      aria-labelledby="hero-title"
      aria-hidden={isHidden}
      inert={isHidden}
      style={{ transform: `translate3d(0, ${exitProgress * -100}%, 0)` }}
    >
      <div className="absolute inset-0">
        <img
          className="absolute inset-0 size-full object-cover object-[58%_center] sm:object-center"
          src={heroImage}
          alt=""
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(13,9,6,0.72)_0%,rgba(20,13,8,0.43)_33%,rgba(22,15,10,0.08)_70%),linear-gradient(180deg,rgba(13,9,6,0.45)_0%,transparent_31%,rgba(10,7,5,0.15)_100%)]"
          aria-hidden="true"
        />
      </div>

      <div className="absolute inset-0" style={{ opacity: contentOpacity }}>
        <div className="flex size-full items-center px-6 pb-24 pt-28 sm:px-10 sm:pb-28 lg:px-[7.4vw] lg:pt-32">
          <div className="max-w-[43rem]">
            <h1
              id="hero-title"
              className="text-[clamp(3.25rem,5vw,5.1rem)] font-light leading-[0.98] tracking-[-0.055em] text-balance"
            >
              De una idea
              <br />a un mueble real.
            </h1>
            <p className="mt-6 max-w-[38rem] text-base font-light leading-relaxed text-white/95 sm:mt-8 sm:text-xl lg:text-[1.35rem]">
              KUBO te ayuda a transformar tus ideas
              <br className="hidden sm:block" /> en un diseño 3D y lo lleva hasta sus piezas.
            </p>
            <Link
              className="mt-8 inline-flex items-center gap-5 rounded-full border border-white/90 px-6 py-3.5 text-sm font-medium outline-none transition-colors hover:bg-white hover:text-stone-900 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-transparent sm:mt-10 sm:px-7 sm:py-4 sm:text-base"
              to="/demo">
              Diseñar con KUBO
              <ArrowRight aria-hidden="true" size={19} strokeWidth={1.6} />
            </Link>
          </div>
        </div>

        <a
          className={`absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 whitespace-nowrap border-b border-white/80 pb-1 text-xs sm:bottom-8 sm:text-sm ${linkFocus}`}
          href="#como-funciona"
        >
          <span>Descubrí cómo funciona</span>
          <ArrowDown aria-hidden="true" size={17} strokeWidth={1.5} />
        </a>
      </div>
    </section>
  )
}

export default Hero
