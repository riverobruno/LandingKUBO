import kuboLogo from '@/assets/LogoKubo.png'

const linkFocus =
  'rounded-sm outline-none transition-opacity hover:opacity-75 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-transparent'

function HeroHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-6 text-white drop-shadow-[0_1px_5px_rgba(35,22,14,0.65)] sm:px-10 sm:py-8 lg:px-[5.5vw] lg:py-10">
      <a
        className={`flex items-center gap-4 sm:gap-5 ${linkFocus}`}
        href="/"
        aria-label="KUBO, inicio"
      >
        <span className="text-[1.35rem] font-semibold leading-none tracking-[0.16em] sm:text-[1.6rem]">
          KUBO
        </span>
        <span className="h-8 w-px bg-white/65 sm:h-10" aria-hidden="true" />
        <img className="size-9 object-contain sm:size-11" src={kuboLogo} alt="" />
      </a>

      <nav aria-label="Navegación principal">
        <ul className="flex gap-5 text-sm sm:gap-9 sm:text-base">
          <li>
            <a className={`border-b border-white/80 pb-1 ${linkFocus}`} href="#demo">
              Demo
            </a>
          </li>
          <li>
            <span className="border-b border-white/80 pb-1" role="link" aria-disabled="true">
              Contacto
            </span>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default HeroHeader
