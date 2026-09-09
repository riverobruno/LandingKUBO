import type { DemoStep } from './types'

interface DemoProgressProps {
  steps: DemoStep[]
  currentStep: number
  copy: { ariaLabel: string }
}

function getAccessibleStatus(stepNumber: number, currentStep: number) {
  if (stepNumber < currentStep) return 'Completada'
  if (stepNumber === currentStep) return 'Actual'
  return 'Próximo'
}

function DemoProgress({ steps, currentStep, copy }: DemoProgressProps) {
  return (
    <ol className="flex w-full items-start lg:flex-col lg:items-stretch" aria-label={copy.ariaLabel}>
      {steps.map((step, index) => {
        const current = step.number === currentStep
        const accessibleStatus = getAccessibleStatus(step.number, currentStep)

        return (
          <li key={step.number} className="flex min-w-0 flex-1 flex-col items-center lg:grid lg:min-h-[4.5rem] lg:grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)] lg:flex-none lg:items-stretch" aria-current={current ? 'step' : undefined}>
            <div className="flex w-full items-center lg:col-start-2 lg:row-start-1 lg:w-8 lg:flex-col">
              <span className={`flex-1 h-px lg:h-auto lg:w-px ${index > 0 ? 'bg-white' : ''}`} aria-hidden="true" />
              <span aria-hidden="true" className={`relative z-[1] flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-medium transition-[background-color,border-color,color,opacity,transform] duration-300 ease-out motion-reduce:transition-none ${current ? 'scale-100 border-white bg-[#a48973] text-white opacity-100 shadow-[0_2px_7px_rgba(68,46,31,0.18)]' : 'scale-90 border-white bg-transparent text-transparent opacity-75'}`}>
                {step.number}
              </span>
              <span className={`flex-1 h-px lg:h-auto lg:w-px ${index < steps.length - 1 ? 'bg-white' : ''}`} aria-hidden="true" />
            </div>
            <span className={`mt-2 max-w-full break-words text-center text-xs font-medium text-white [overflow-wrap:anywhere] transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none lg:col-start-3 lg:row-start-1 lg:ml-3 lg:mt-0 lg:max-w-[min(8rem,calc(100%_-_0.75rem))] lg:self-center lg:text-left ${current ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-1 opacity-0'}`} aria-hidden="true">{step.label}</span>
            <span className="sr-only">{`${step.number}. ${step.label}. ${accessibleStatus}`}</span>
          </li>
        )
      })}
    </ol>
  )
}

export default DemoProgress
