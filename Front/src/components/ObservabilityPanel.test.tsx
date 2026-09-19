import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { BACKEND_NODES, fetchNodeStats, subscribeToBackendNode } from '@/observability'
import ObservabilityPanel from './ObservabilityPanel'

vi.mock('@/observability', () => ({
  BACKEND_NODES: ['backend-1', 'backend-2', 'backend-3'],
  getLatestBackendNode: () => 'backend-1',
  fetchNodeStats: vi.fn(),
  subscribeToBackendNode: vi.fn(),
}))

describe('ObservabilityPanel visibility', () => {
  const unsubscribe = vi.fn()

  beforeEach(() => {
    vi.useFakeTimers()
    vi.mocked(subscribeToBackendNode).mockReturnValue(unsubscribe)
    vi.mocked(fetchNodeStats).mockImplementation(async (nodeName) => ({
      nodeName,
      status: 'up',
      health: 'healthy',
      cpu: { percent: 12.5 },
      memory: null,
    }))
  })

  afterEach(() => {
    cleanup()
    vi.useRealTimers()
    vi.resetAllMocks()
  })

  it('starts expanded and collapses to one native restore button without losing focus or data', async () => {
    await act(async () => { render(<ObservabilityPanel />) })
    const toggle = screen.getByRole('button', { name: 'Minimize container information' })
    const content = document.getElementById(toggle.getAttribute('aria-controls')!)!
    expect(toggle.tagName).toBe('BUTTON')
    expect(toggle.getAttribute('type')).toBe('button')
    expect(toggle.getAttribute('aria-expanded')).toBe('true')
    expect(content.hidden).toBe(false)
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
    const statsText = content.textContent

    toggle.focus()
    fireEvent.click(toggle)

    expect(screen.getByRole('button', { name: 'Expand container information' })).toBe(toggle)
    expect(toggle.getAttribute('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(toggle)
    expect(content.hidden).toBe(true)
    expect(document.getElementById('observability-panel-handle')!.hidden).toBe(true)
    expect(screen.getAllByRole('button')).toEqual([toggle])
    expect(screen.queryByRole('list')).toBeNull()
    expect(screen.getByRole('complementary').classList.contains('w-fit')).toBe(true)

    fireEvent.click(toggle)

    expect(toggle.getAttribute('aria-expanded')).toBe('true')
    expect(document.activeElement).toBe(toggle)
    expect(content.hidden).toBe(false)
    expect(content.textContent).toBe(statsText)
    expect(screen.getByRole('button', { name: 'Sobrecargar' })).toBeTruthy()
  })

  it('keeps a single polling timer and subscription through repeated toggles and cleans up', async () => {
    const { unmount } = await act(async () => render(<ObservabilityPanel />))
    const toggle = screen.getByRole('button', { name: 'Minimize container information' })

    for (let i = 0; i < 5; i++) fireEvent.click(toggle)
    expect(toggle.getAttribute('aria-expanded')).toBe('false')
    expect(fetchNodeStats).toHaveBeenCalledTimes(BACKEND_NODES.length)
    expect(subscribeToBackendNode).toHaveBeenCalledOnce()
    expect(unsubscribe).not.toHaveBeenCalled()
    expect(vi.getTimerCount()).toBe(1)

    await act(async () => { await vi.advanceTimersByTimeAsync(3000) })
    expect(fetchNodeStats).toHaveBeenCalledTimes(BACKEND_NODES.length * 2)
    fireEvent.click(toggle)
    expect(fetchNodeStats).toHaveBeenCalledTimes(BACKEND_NODES.length * 2)
    expect(subscribeToBackendNode).toHaveBeenCalledOnce()

    unmount()
    expect(unsubscribe).toHaveBeenCalledOnce()
    expect(vi.getTimerCount()).toBe(0)
  })
})
