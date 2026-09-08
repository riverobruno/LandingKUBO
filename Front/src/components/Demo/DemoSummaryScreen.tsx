import { Download, Pencil, Share2 } from 'lucide-react'
import { useState } from 'react'
import DesignPreview from './DesignPreview'
import ProposalSummary from './ProposalSummary'
import type { DemoDesign } from './types'

interface DemoSummaryScreenProps {
  design: DemoDesign
  sketchImage: string
  glbUrl: string
  title: string
  onTitleChange: (title: string) => void
}

function DemoSummaryScreen({ design, sketchImage, glbUrl, title, onTitleChange }: DemoSummaryScreenProps) {
  const [editingTitle, setEditingTitle] = useState(false)
  const [feedback, setFeedback] = useState('')
  const summary = design.summary
  const [previewLabel, setPreviewLabel] = useState(summary.preview.twoDLabel)

  async function shareProposal() {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: summary.heading, url: window.location.href })
        setFeedback(summary.feedback.shareSuccess)
      } catch (error) {
        const name = error instanceof DOMException ? error.name : ''
        setFeedback(name === 'AbortError' ? summary.feedback.shareCancelled : name === 'NotAllowedError' ? summary.feedback.shareDenied : summary.feedback.shareDenied)
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
      estimatedBudget: summary.budget.value,
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
    <section className="mx-auto w-full max-w-[90rem] px-5 pb-12 pt-32 text-stone-900 sm:px-8 sm:pt-40 lg:px-12" aria-labelledby="summary-title">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="flex min-w-0 items-center gap-2">
           <h1 id="summary-title" className="truncate text-4xl font-medium tracking-[-0.05em] sm:text-6xl">{editingTitle ? <input className="w-full max-w-sm rounded-lg border border-stone-300 bg-white px-3 py-2 text-3xl font-medium outline-none focus-visible:ring-2 focus-visible:ring-stone-900 sm:text-4xl" value={title} onChange={(event) => onTitleChange(event.target.value)} onBlur={() => setEditingTitle(false)} autoFocus aria-label={design.result.editTitleLabel} /> : title}</h1>
           <button className="flex size-11 shrink-0 items-center justify-center rounded-full text-stone-700 outline-none hover:bg-stone-200 focus-visible:ring-2 focus-visible:ring-stone-900" type="button" onClick={() => setEditingTitle(true)} aria-label={design.result.editButtonLabel}><Pencil size={17} aria-hidden="true" /></button>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="inline-flex min-h-12 items-center gap-2 rounded-full border border-stone-300 bg-white/60 px-5 text-sm font-medium outline-none hover:bg-white focus-visible:ring-2 focus-visible:ring-stone-900" type="button" onClick={() => void shareProposal()}><Share2 size={17} aria-hidden="true" />{summary.shareLabel}</button>
          <button className="flex size-12 items-center justify-center rounded-full border border-stone-300 bg-white/60 text-stone-700 outline-none hover:bg-white focus-visible:ring-2 focus-visible:ring-stone-900" type="button" onClick={downloadProposal} aria-label={summary.downloadLabel} title={summary.downloadLabel}><Download size={18} aria-hidden="true" /></button>
        </div>
      </div>
      <p className="sr-only" role="status" aria-live="polite">{feedback}</p>
      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(20rem,1fr)]">
         <DesignPreview design={design} sketchImage={sketchImage} glbUrl={glbUrl} onPreviewLabelChange={setPreviewLabel} />
        <ProposalSummary summary={summary} />
      </div>
    </section>
  )
}

export default DemoSummaryScreen
