import { ArrowLeft, Download, Pencil, Share2 } from 'lucide-react'
import { useState } from 'react'
import type { DemoModelBudget } from '@/API/Cliente/generateDemoModel'
import DesignPreview from './DesignPreview'
import ProposalSummary from './ProposalSummary'
import type { DemoDesign } from './types'

interface DemoSummaryScreenProps {
  design: DemoDesign
  sketchImage: string
  glbUrl: string
  modelBudget: DemoModelBudget
  title: string
  onTitleChange: (title: string) => void
  onPrevious: () => void
}

function formatBudget(budget: DemoModelBudget) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: budget.currency, minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(budget.amount)
}

function DemoSummaryScreen({ design, sketchImage, glbUrl, modelBudget, title, onTitleChange, onPrevious }: DemoSummaryScreenProps) {
  const [editingTitle, setEditingTitle] = useState(false)
  const [feedback, setFeedback] = useState('')
  const summary = design.summary
  const budgetValue = formatBudget(modelBudget)
  const [previewLabel, setPreviewLabel] = useState(summary.preview.twoDLabel)

  async function shareProposal() {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: summary.heading, url: window.location.href })
        setFeedback(summary.feedback.shareSuccess)
      } catch {
        return
      }
      return
    }
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(`${title}\n\n${summary.description}\n\n${window.location.href}`)
        setFeedback(summary.feedback.clipboardSuccess)
      } catch {
        setFeedback(summary.feedback.clipboardFailure)
      }
      return
    }
    setFeedback(summary.feedback.unsupported)
  }

  function downloadProposal() {
    const fields = Object.fromEntries(summary.fields.map((field) => [field.label, field.value]))
    const proposal = {
      title,
      description: summary.description,
      estimatedBudget: budgetValue,
      type: fields.Tipo ?? '',
      style: fields.Estilo ?? '',
      dimensions: fields.Medidas ?? '',
      currentPreviewLabel: previewLabel,
    }
    const blob = new Blob([JSON.stringify(proposal, null, 2)], { type: 'application/json;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    try {
      link.href = url
      link.download = summary.downloadFilename
      document.body.appendChild(link)
      link.click()
      setFeedback(summary.feedback.downloadSuccess)
    } catch {
      setFeedback(summary.feedback.downloadUnavailable)
    } finally {
      link.remove()
      window.setTimeout(() => URL.revokeObjectURL(url), 0)
    }
  }

  return (
    <section className="mx-auto w-full px-5 pb-12 pt-28 text-stone-900 sm:px-8 sm:pt-36 lg:px-0 lg:h-[100dvh] lg:min-h-svh lg:pb-[clamp(1.5rem,3dvh,2.25rem)] lg:pt-[clamp(6.5rem,11dvh,8rem)]" aria-labelledby="summary-title">
      <div className="grid min-h-0 gap-y-5 lg:h-full lg:grid-cols-[minmax(12rem,1fr)_minmax(0,64rem)_minmax(12rem,1fr)] lg:grid-rows-[auto_minmax(0,1fr)_auto] lg:gap-y-[clamp(0.75rem,2dvh,1.25rem)]">
        <div className="min-w-0 lg:col-start-2 lg:row-start-1 lg:translate-x-6">
          <div className="relative">
            <div className="flex min-w-0 flex-wrap items-center gap-3">
              <h1 id="summary-title" aria-label={title} className="min-w-0 flex-1 break-words text-4xl font-medium tracking-[-0.04em] [overflow-wrap:anywhere] sm:text-6xl lg:text-5xl">
                {editingTitle ? <input className="block min-w-0 w-full max-w-sm rounded-lg border border-stone-300 bg-white px-3 py-2 text-3xl font-medium outline-none focus-visible:ring-2 focus-visible:ring-stone-900" value={title} onChange={(event) => onTitleChange(event.target.value)} onBlur={() => setEditingTitle(false)} autoFocus aria-label={design.result.editTitleLabel} /> : title}
              </h1>
              <button className="flex size-10 items-center justify-center rounded-full text-stone-700 outline-none hover:bg-white/40 focus-visible:ring-2 focus-visible:ring-stone-900" type="button" onClick={() => setEditingTitle(true)} aria-label={design.result.editButtonLabel} title={design.sketchCard.editTitle}><Pencil size={17} aria-hidden="true" /></button>
            </div>
            <div className="absolute right-0 top-0 flex flex-wrap gap-2">
              <button className="inline-flex min-h-12 items-center gap-2 rounded-full border border-stone-300 bg-white/60 px-5 text-sm font-medium outline-none hover:bg-white focus-visible:ring-2 focus-visible:ring-stone-900" type="button" onClick={() => void shareProposal()}><Share2 size={17} aria-hidden="true" />{summary.shareLabel}</button>
              <button className="flex size-12 items-center justify-center rounded-full border border-stone-300 bg-white/60 text-stone-700 outline-none hover:bg-white focus-visible:ring-2 focus-visible:ring-stone-900" type="button" onClick={downloadProposal} aria-label={summary.downloadLabel} title={summary.downloadLabel}><Download size={18} aria-hidden="true" /></button>
            </div>
          </div>
        </div>
        <div className="min-h-0 min-w-0 lg:col-start-2 lg:row-start-2 lg:translate-x-6">
          <p className="sr-only" role="status" aria-live="polite">{feedback}</p>
          <div className="mt-2 grid items-start gap-6 lg:mt-0 lg:gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(20rem,1fr)]">
            <DesignPreview design={design} sketchImage={sketchImage} glbUrl={glbUrl} onPreviewLabelChange={setPreviewLabel} />
            <ProposalSummary summary={summary} budgetValue={budgetValue} />
          </div>
        </div>
        <div className="flex justify-start lg:col-start-2 lg:row-start-3 lg:translate-x-6">
          <button className="inline-flex min-h-12 items-center gap-3 rounded-full bg-white px-6 text-sm font-medium text-stone-900 shadow-[0_0.75rem_2rem_rgba(68,46,31,0.12)] outline-none transition-transform motion-reduce:transition-none hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2 focus-visible:ring-offset-[#b89c82]" type="button" onClick={onPrevious} aria-label={design.sketchCard.previousLabel}><ArrowLeft size={18} aria-hidden="true" />{design.sketchCard.previousLabel}</button>
        </div>
      </div>
    </section>
  )
}

export default DemoSummaryScreen
