import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import InteractiveProcess from './InteractiveProcess'

vi.mock('@/components/Hero/Hero', () => ({
  default: () => <div data-testid="hero" />,
}))

vi.mock('@/components/Hero/HeroHeader', () => ({
  default: () => <div data-testid="hero-header" />,
}))

vi.mock('@/components/InteractiveProcess/PromptScene', () => ({
  default: () => <div data-testid="prompt-scene" />,
}))

vi.mock('@/components/InteractiveProcess/SketchScene', () => ({
  default: () => <div data-testid="sketch-scene" />,
}))

vi.mock('@/assets/promptScene.jpeg', () => ({
  default: '/prompt-scene.jpeg',
}))

describe('InteractiveProcess', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('does not let the prompt scene image intercept pointer input', () => {
    vi.stubGlobal('matchMedia', () => ({
      addEventListener: vi.fn(),
      matches: false,
      removeEventListener: vi.fn(),
    }))

    render(<InteractiveProcess />)

    expect(
      screen
        .getByRole('presentation', { hidden: true })
        .classList.contains('pointer-events-none'),
    ).toBe(true)
  })
})
