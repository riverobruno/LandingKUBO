import DemoModelViewer from './DemoModelViewer'
import type { DemoDesign } from './types'

interface DemoModelCardProps {
  design: DemoDesign
  glbUrl: string
}

function DemoModelCard({ design, glbUrl }: DemoModelCardProps) {
  return (
    <article className="rounded-[1.75rem] bg-white p-5 shadow-[0_1.5rem_4rem_rgba(68,46,31,0.14)] sm:p-8">
      <h2 className="text-xl font-medium tracking-tight">{design.model.cardTitle}</h2>
      <div className="mt-6 flex min-h-[22rem] items-center justify-center overflow-hidden rounded-[1.5rem] bg-[#f4efe8] px-4 py-10 sm:min-h-[31rem] sm:px-10">
        <DemoModelViewer glbUrl={glbUrl} ariaLabel={design.model.viewportAriaLabel} loadingLabel={design.model.loadingLabel} errorLabel={design.model.loadErrorLabel} className="h-[22rem] max-w-3xl sm:h-[31rem]" />
      </div>
    </article>
  )
}

export default DemoModelCard
