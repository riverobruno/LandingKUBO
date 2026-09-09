import kuboLogo from '@/assets/LogoKubo.png'
import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const linkFocus =
  'rounded-sm outline-none transition-opacity hover:opacity-75'

interface HeroHeaderProps {
  variant?: 'light' | 'dark'
  surface?: 'solid' | 'transparent'
}

function HeroHeader({ variant = 'light', surface = 'solid' }: HeroHeaderProps) {
  const { hash, pathname } = useLocation()
  const contactHref = pathname === '/' ? '#contacto' : '/#contacto'
  const isContactCurrent = pathname === '/' && hash === '#contacto'
  const isHomeCurrent = pathname === '/' && !isContactCurrent
  const isDemoCurrent = pathname === '/demo'
  const isDarkVariant = variant === 'dark'
  const textColor = isDarkVariant ? 'text-stone-950' : 'text-white'
  const dividerColor = isDarkVariant ? 'bg-stone-950/65' : 'bg-white/65'
  const borderColor = isDarkVariant ? 'border-stone-950/80' : 'border-white/80'
  const inactiveBorderColor = isDarkVariant ? 'border-transparent hover:border-stone-950/45' : 'border-transparent hover:border-white/45'
  const homeIndicatorColor = isDarkVariant ? 'after:bg-stone-950/80' : 'after:bg-white/80'
  const focusColor = isDarkVariant ? 'focus-visible:ring-stone-950' : 'focus-visible:ring-white'
  const focusOffset = isDarkVariant ? 'focus-visible:ring-offset-[var(--color-surface)]' : 'focus-visible:ring-offset-transparent'
  const headerSurface = isDarkVariant && surface === 'solid' ? 'bg-[var(--color-surface)]/95 backdrop-blur-sm' : ''
  const navLinkClass = (isCurrent: boolean) =>
    `border-b-2 pb-1 ${isCurrent ? `${borderColor} font-medium` : inactiveBorderColor} ${linkFocus} focus-visible:ring-2 focus-visible:ring-offset-4 ${focusOffset} ${focusColor}`

  useEffect(() => {
    if (hash === '#contacto') {
      document.getElementById('contacto')?.scrollIntoView()
    }
  }, [hash, pathname])

  return (
    <header className={`absolute inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-6 sm:px-10 sm:py-8 lg:px-[5.5vw] lg:py-10 ${textColor} ${headerSurface} ${isDarkVariant ? '' : 'drop-shadow-[0_1px_5px_rgba(35,22,14,0.65)]'}`}>
      <Link
        className={`relative flex items-center gap-4 sm:gap-5 ${linkFocus} focus-visible:ring-2 focus-visible:ring-offset-4 ${focusOffset} ${focusColor} ${isHomeCurrent ? `after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-full ${homeIndicatorColor}` : ''}`}
        to="/"
        aria-label="KUBO, inicio"
        aria-current={isHomeCurrent ? 'page' : undefined}
      >
        <span className="text-[1.35rem] font-semibold leading-none tracking-[0.16em] sm:text-[1.6rem]">
          KUBO
        </span>
        <span className={`h-8 w-px sm:h-10 ${dividerColor}`} aria-hidden="true" />
        <img className={`size-9 object-contain sm:size-11 ${isDarkVariant ? 'brightness-0' : ''}`} src={kuboLogo} alt="" />
      </Link>

      <nav aria-label="Navegación principal">
        <ul className="flex gap-5 text-sm sm:gap-9 sm:text-base">
          <li>
            <Link className={navLinkClass(isDemoCurrent)} to="/demo" aria-current={isDemoCurrent ? 'page' : undefined}>
              Demo
            </Link>
          </li>
          <li>
            <Link
              className={navLinkClass(isContactCurrent)}
              to={contactHref}
              aria-current={isContactCurrent ? 'location' : undefined}
            >
              Contacto
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default HeroHeader
