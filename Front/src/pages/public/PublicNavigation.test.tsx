import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Hero from '@/components/Hero/Hero'
import PromptScene from '@/components/InteractiveProcess/PromptScene'
import Home from './Home'

vi.mock('@/components/InteractiveProcess/InteractiveProcess', () => ({
  default: () => null,
}))

describe('public navigation and landing content', () => {
  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  it('routes the Hero CTA to the demo page', () => {
    render(
      <MemoryRouter>
        <Hero contentOpacity={1} exitProgress={0} isHidden={false} />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: /Diseñar con KUBO/ }).getAttribute('href')).toBe(
      '/demo',
    )
  })

  it('renders the requested Contacto names', () => {
    render(<Home />)

    expect(screen.getByRole('heading', { name: 'Contacto' })).toBeTruthy()
    for (const name of ['Joaquín', 'Yoel', 'Martín', 'Valentino', 'Bruno']) {
      expect(screen.getByText(name)).toBeTruthy()
    }
  })

  it('disables pointer events when the prompt scene is inaccessible', () => {
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        disconnect() {}
      },
    )

    const { container } = render(
      <PromptScene
        inputProgress={0}
        isAccessible={false}
        onInputBoundsChange={vi.fn()}
        outlineHandoffProgress={0}
        promptContentExitProgress={0}
        promptText=""
        revealProgress={1}
        surfaceExitProgress={0}
        subtitleProgress={1}
        titleExitProgress={0}
        titleProgress={1}
        visiblePromptText=""
      />,
    )

    expect(container.querySelector('section')?.classList.contains('pointer-events-none')).toBe(
      true,
    )
  })
})
