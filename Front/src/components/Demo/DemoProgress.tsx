import { Check } from 'lucide-react'
import type { DemoStep } from './types'

interface DemoProgressProps {
  steps: DemoStep[]
  currentStep: number
  copy: { ariaLabel: string; completedLabel: string }
}

function DemoProgress({ steps, currentStep, copy }: DemoProgressProps) {
  return (
    <ol className="grid min-w-[42rem] grid-cols-4" aria-label={copy.ariaLabel}>
      {steps.map((step) => {
        const completed = step.number < currentStep
        const current = step.number === currentStep
        return (
          <li key={step.number} className="relative text-center">
            {step.number < steps.length && <span className="absolute left-[calc(50%+1rem)] right-[calc(-50%+1rem)] top-4 h-px bg-[#c8b9a9]" aria-hidden="true" />}
            <span className={`relative z-[1] mx-auto flex size-8 items-center justify-center rounded-full text-sm font-medium ${completed ? 'border border-[#cfc2b5] bg-white text-[#806955] shadow-[0_2px_7px_rgba(68,46,31,0.16)]' : current ? 'bg-[#967b65] text-white shadow-[0_2px_7px_rgba(68,46,31,0.18)]' : 'bg-white text-stone-800 shadow-[0_2px_7px_rgba(68,46,31,0.14)]'}`} aria-current={current ? 'step' : undefined}>
               {completed ? <><Check size={16} aria-hidden="true" /><span className="sr-only">{copy.completedLabel}</span></> : step.number}
            </span>
            <span className="mt-2 block">
              <strong className="block text-sm font-bold">{step.number}. {step.label}</strong>
              <span className="mt-0.5 block text-xs text-stone-500">{current ? step.currentStatus : step.status}</span>
            </span>
          </li>
        )
      })}
    </ol>
  )
}

export default DemoProgress
