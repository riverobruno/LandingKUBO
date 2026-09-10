import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import demoDesign from '@/data/demo-design.json'
import DemoSummaryScreen from './DemoSummaryScreen'
import type { DemoDesign } from './types'

vi.mock('./DesignPreview', () => ({ default: () => <div>Vista previa</div> }))
vi.mock('./ProposalSummary', () => ({ default: () => <div>Resumen de propuesta</div> }))

const design = demoDesign as DemoDesign
const modelBudget = { amount: 385000, currency: 'ARS' }

function renderSummary() {
  return render(
    <DemoSummaryScreen
      design={design}
      sketchImage="/placard.svg"
      glbUrl="/model.glb"
      modelBudget={modelBudget}
      title="Placard"
      onTitleChange={vi.fn()}
      onPrevious={vi.fn()}
    />,
  )
}

describe('DemoSummaryScreen sharing feedback', () => {
  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('shows success feedback after a successful share', async () => {
    vi.stubGlobal('navigator', { share: vi.fn().mockResolvedValue(undefined) })
    renderSummary()

    fireEvent.click(screen.getByRole('button', { name: design.summary.shareLabel }))

    expect((await screen.findByRole('status')).textContent).toBe(design.summary.feedback.shareSuccess)
  })

  it('shows denied feedback when sharing is rejected with NotAllowedError', async () => {
    vi.stubGlobal('navigator', { share: vi.fn().mockRejectedValue(new DOMException('Denied', 'NotAllowedError')) })
    renderSummary()

    fireEvent.click(screen.getByRole('button', { name: design.summary.shareLabel }))

    expect((await screen.findByRole('status')).textContent).toBe(design.summary.feedback.shareDenied)
  })

  it('shows cancelled feedback when sharing is aborted', async () => {
    vi.stubGlobal('navigator', { share: vi.fn().mockRejectedValue(new DOMException('Cancelled', 'AbortError')) })
    renderSummary()

    fireEvent.click(screen.getByRole('button', { name: design.summary.shareLabel }))

    expect((await screen.findByRole('status')).textContent).toBe(design.summary.feedback.shareCancelled)
  })

  it('uses the clipboard when sharing is unavailable', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', { clipboard: { writeText } })
    renderSummary()

    fireEvent.click(screen.getByRole('button', { name: design.summary.shareLabel }))

    expect((await screen.findByRole('status')).textContent).toBe(design.summary.feedback.clipboardSuccess)
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining('Placard'))
  })

  it('shows clipboard failure and unsupported feedback', async () => {
    vi.stubGlobal('navigator', { clipboard: { writeText: vi.fn().mockRejectedValue(new Error('Clipboard unavailable')) } })
    renderSummary()
    fireEvent.click(screen.getByRole('button', { name: design.summary.shareLabel }))
    expect((await screen.findByRole('status')).textContent).toBe(design.summary.feedback.clipboardFailure)

    vi.stubGlobal('navigator', {})
    fireEvent.click(screen.getByRole('button', { name: design.summary.shareLabel }))
    expect((await screen.findByRole('status')).textContent).toBe(design.summary.feedback.unsupported)
  })

  it('shows download success after preparing the proposal', async () => {
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn().mockReturnValue('blob:test'),
      revokeObjectURL: vi.fn(),
    })
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined)
    renderSummary()

    fireEvent.click(screen.getByRole('button', { name: design.summary.downloadLabel }))

    expect((await screen.findByRole('status')).textContent).toBe(design.summary.feedback.downloadSuccess)
  })
})
