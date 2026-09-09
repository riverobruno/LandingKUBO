import { ArrowLeft, ArrowRight, Pencil } from 'lucide-react'
import { useState } from 'react'
import DemoModelCard from './DemoModelCard'
import DemoSketchCard from './DemoSketchCard'
import type { DemoDesign, DemoStepNumber } from './types'

interface DemoResultProps {
  design: DemoDesign
  sketchImage: string
  glbUrl: string
  currentStep: DemoStepNumber
  title: string
  onTitleChange: (title: string) => void
  onPrevious: () => void
  onAdvance: () => void | Promise<void>
  isModelSubmitting: boolean
  modelError: string
}

function DemoResult({ design, sketchImage, glbUrl, currentStep, title, onTitleChange, onPrevious, onAdvance, isModelSubmitting, modelError }: DemoResultProps) {
  const [editingTitle, setEditingTitle] = useState(false)
  const isSketchStep = currentStep === 2
  const isViewportConstrainedStep = currentStep === 2 || currentStep === 3
  const desktopViewportClasses = isViewportConstrainedStep ? 'lg:h-[100dvh] lg:min-h-svh lg:pb-[clamp(1.5rem,3dvh,2.25rem)] lg:pt-[clamp(6.5rem,11dvh,8rem)]' : ''

  function renderStageContent() {
    switch (currentStep) {
      case 2:
        return <DemoSketchCard design={design} sketchImage={sketchImage} />
      case 3:
        return <DemoModelCard design={design} glbUrl={glbUrl} />
      default:
         return <p className="rounded-2xl bg-white p-6 text-sm text-stone-600" role="status">{design.result.unavailableLabel}</p>
    }
  }

  return (
    <section className={`mx-auto w-full px-5 sm:px-8 lg:px-0 ${isSketchStep ? 'pb-8 pt-24 sm:pb-8 sm:pt-28' : 'pb-12 pt-28 sm:pt-36'} ${desktopViewportClasses}`} aria-labelledby="result-title">
      <div className="grid min-h-0 gap-y-5 lg:h-full lg:grid-cols-[minmax(12rem,1fr)_minmax(0,64rem)_minmax(12rem,1fr)] lg:grid-rows-[auto_minmax(0,1fr)_auto] lg:gap-y-[clamp(0.75rem,2dvh,1.25rem)]">
        <div className="min-w-0 lg:col-start-2 lg:row-start-1 lg:translate-x-6">
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            <h1 id="result-title" aria-label={title} className="min-w-0 flex-1 break-words text-4xl font-medium tracking-[-0.04em] [overflow-wrap:anywhere] sm:text-6xl lg:text-5xl">
              {editingTitle ? <input className="block min-w-0 w-full max-w-sm rounded-lg border border-stone-300 bg-white px-3 py-2 text-3xl font-medium outline-none focus-visible:ring-2 focus-visible:ring-stone-900" value={title} onChange={(event) => onTitleChange(event.target.value)} onBlur={() => setEditingTitle(false)} autoFocus aria-label={design.result.editTitleLabel} /> : title}
            </h1>
            <button className="flex size-10 items-center justify-center rounded-full text-stone-700 outline-none hover:bg-white/40 focus-visible:ring-2 focus-visible:ring-stone-900" type="button" onClick={() => setEditingTitle(true)} aria-label={design.result.editButtonLabel} title={design.sketchCard.editTitle}><Pencil size={17} aria-hidden="true" /></button>
          </div>
        </div>
        <div className="min-h-0 min-w-0 lg:col-start-2 lg:row-start-2 lg:translate-x-6">{renderStageContent()}</div>
        {(currentStep === 2 || currentStep === 3) && <div className="flex flex-col items-end gap-3 lg:col-start-2 lg:row-start-3 lg:translate-x-6">
          {currentStep === 2 && <p id="model-transition-status" className={`min-h-5 text-right text-xs ${modelError ? 'text-red-800' : 'text-stone-700'}`} role={modelError ? 'alert' : 'status'} aria-live={modelError ? 'assertive' : 'polite'} aria-busy={isModelSubmitting}>
            {isModelSubmitting ? design.model.pendingLabel : modelError}
          </p>}
          <div className="flex w-full items-center justify-between gap-3">
            <button className="inline-flex min-h-12 items-center gap-3 rounded-full bg-white px-6 text-sm font-medium text-stone-900 shadow-[0_0.75rem_2rem_rgba(68,46,31,0.12)] outline-none transition-transform motion-reduce:transition-none hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2 focus-visible:ring-offset-[#b89c82] disabled:cursor-wait disabled:opacity-60" type="button" onClick={onPrevious} aria-label={design.sketchCard.previousLabel} aria-describedby={currentStep === 2 ? 'model-transition-status' : undefined} aria-busy={isModelSubmitting} disabled={isModelSubmitting}><ArrowLeft size={18} aria-hidden="true" />{design.sketchCard.previousLabel}</button>
            <button className="inline-flex min-h-12 items-center gap-3 rounded-full bg-white px-6 text-sm font-medium text-stone-900 shadow-[0_0.75rem_2rem_rgba(68,46,31,0.12)] outline-none transition-transform motion-reduce:transition-none hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2 focus-visible:ring-offset-[#b89c82] disabled:cursor-wait disabled:opacity-60" type="button" onClick={() => void onAdvance()} aria-label={design.sketchCard.nextLabel} aria-describedby={currentStep === 2 ? 'model-transition-status' : undefined} aria-busy={currentStep === 2 && isModelSubmitting} disabled={currentStep === 2 && isModelSubmitting}>{design.sketchCard.nextLabel} <ArrowRight size={18} aria-hidden="true" /></button>
          </div>
        </div>}
      </div>
    </section>
  )
}

export default DemoResult
