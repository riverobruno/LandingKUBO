import DemoModelViewer from './DemoModelViewer'
import type { DemoDesign } from './types'

interface DemoModelCardProps {
  design: DemoDesign
  glbUrl: string
}

function DemoModelCard({ design, glbUrl }: DemoModelCardProps) {
  return (
    <article className="rounded-[1.75rem] bg-white p-5 shadow-[0_1.5rem_4rem_rgba(68,46,31,0.14)] sm:p-8 lg:flex lg:h-full lg:min-h-0 lg:flex-col">
      <h2 className="shrink-0 text-xl font-medium tracking-tight">{design.model.cardTitle}</h2>
      <div className="mt-6 flex min-h-[22rem] flex-1 items-center justify-center overflow-hidden rounded-[1.5rem] bg-[#f4efe8] px-4 py-10 sm:min-h-[31rem] sm:px-10 lg:mt-4 lg:min-h-0 lg:py-4">
        <DemoModelViewer glbUrl={glbUrl} ariaLabel={design.model.viewportAriaLabel} loadingLabel={design.model.loadingLabel} errorLabel={design.model.loadErrorLabel} className="h-[22rem] min-h-0 max-w-3xl sm:h-[31rem] lg:h-full" />
      </div>
    </article>
  )
}

export default DemoModelCard
