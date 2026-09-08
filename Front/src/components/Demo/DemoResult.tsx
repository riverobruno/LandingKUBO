import { ArrowRight, Pencil } from 'lucide-react'
import { useState } from 'react'
import DemoProgress from './DemoProgress'
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
  onAdvance: () => void | Promise<void>
  isModelSubmitting: boolean
  modelError: string
}

function DemoResult({ design, sketchImage, glbUrl, currentStep, title, onTitleChange, onAdvance, isModelSubmitting, modelError }: DemoResultProps) {
  const [editingTitle, setEditingTitle] = useState(false)
  const currentStepData = design.steps.find((step) => step.number === currentStep)

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
    <section className="mx-auto w-full max-w-6xl px-5 pb-12 pt-28 sm:px-8 sm:pt-36 lg:px-12" aria-labelledby="result-title">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
             <div className="flex flex-wrap items-center gap-3">
               <h1 id="result-title" aria-label={title} className="text-4xl font-medium tracking-[-0.04em] sm:text-6xl">
                  {editingTitle ? <input className="w-56 rounded-lg border border-stone-300 bg-white px-3 py-2 text-3xl font-medium outline-none focus-visible:ring-2 focus-visible:ring-stone-900" value={title} onChange={(event) => onTitleChange(event.target.value)} onBlur={() => setEditingTitle(false)} autoFocus aria-label={design.result.editTitleLabel} /> : title}
               </h1>
               <button className="flex size-10 items-center justify-center rounded-full text-stone-700 outline-none hover:bg-white/40 focus-visible:ring-2 focus-visible:ring-stone-900" type="button" onClick={() => setEditingTitle(true)} aria-label={design.result.editButtonLabel} title={design.sketchCard.editTitle}><Pencil size={17} aria-hidden="true" /></button>
            </div>
               {currentStepData && <p className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-xs font-medium text-stone-700 shadow-sm" role="status" aria-live="polite">{currentStep === 2 ? design.status : design.model.status}</p>}
             {currentStep === 2 && <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-700 sm:text-base">{design.description}</p>}
          </div>
        </div>
        <div className="mt-12 overflow-x-auto sm:mt-16"><DemoProgress steps={design.steps} currentStep={currentStep} copy={design.progress} /></div>
        <div className="mt-6">{renderStageContent()}</div>
          {(currentStep === 2 || currentStep === 3) && <div className="mt-6 flex flex-col items-end gap-3">
            {currentStep === 2 && <p id="model-transition-status" className={`min-h-5 text-right text-xs ${modelError ? 'text-red-800' : 'text-stone-700'}`} role={modelError ? 'alert' : 'status'} aria-live={modelError ? 'assertive' : 'polite'} aria-busy={isModelSubmitting}>
              {isModelSubmitting ? design.model.pendingLabel : modelError}
            </p>}
            <button className="inline-flex min-h-12 items-center gap-3 rounded-full bg-white px-6 text-sm font-medium text-stone-900 shadow-[0_0.75rem_2rem_rgba(68,46,31,0.12)] outline-none transition-transform motion-reduce:transition-none hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2 focus-visible:ring-offset-[#b89c82] disabled:cursor-wait disabled:opacity-60" type="button" onClick={() => void onAdvance()} aria-describedby={currentStep === 2 ? 'model-transition-status' : undefined} aria-busy={currentStep === 2 && isModelSubmitting} disabled={currentStep === 2 && isModelSubmitting}>{design.sketchCard.nextLabel} <ArrowRight size={18} aria-hidden="true" /></button>
          </div>}
      </div>
    </section>
  )
}

export default DemoResult
