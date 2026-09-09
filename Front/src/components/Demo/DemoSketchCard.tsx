import { Download, Maximize2 } from 'lucide-react'
import { useRef } from 'react'
import WardrobeSketch from './WardrobeSketch'
import type { DemoDesign } from './types'

interface DemoSketchCardProps {
  design: DemoDesign
  sketchImage: string
}

function DemoSketchCard({ design, sketchImage }: DemoSketchCardProps) {
  const sketchRef = useRef<HTMLDivElement>(null)

  function downloadSketch() {
    const link = document.createElement('a')
    link.href = sketchImage
    link.download = design.downloadFilename
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  async function openFullscreen() {
    const element = sketchRef.current
    if (!element || !document.fullscreenEnabled) return
    await element.requestFullscreen().catch(() => undefined)
  }

  return (
    <article className="overflow-hidden rounded-[1.75rem] bg-white shadow-[0_1.5rem_4rem_rgba(68,46,31,0.14)] lg:grid lg:h-full lg:min-h-0 lg:grid-rows-[auto_minmax(0,1fr)_auto]">
      <header className="flex items-center justify-between border-b border-stone-100 px-5 py-4 sm:px-8">
        <div>
          <p className="text-[0.65rem] font-semibold tracking-[0.2em] text-stone-400">{design.version}</p>
           <h2 className="mt-1 text-xl font-medium tracking-tight">{design.sketchCard.title}</h2>
        </div>
        <div className="flex gap-2">
           <button className="flex size-11 items-center justify-center rounded-full text-stone-600 outline-none transition-colors motion-reduce:transition-none hover:bg-stone-100 focus-visible:ring-2 focus-visible:ring-stone-900" type="button" onClick={downloadSketch} aria-label={design.sketchCard.downloadLabel}>
            <Download size={19} aria-hidden="true" />
          </button>
           <button className="flex size-11 items-center justify-center rounded-full text-stone-600 outline-none transition-colors motion-reduce:transition-none hover:bg-stone-100 focus-visible:ring-2 focus-visible:ring-stone-900" type="button" onClick={() => void openFullscreen()} aria-label={design.sketchCard.fullscreenLabel}>
            <Maximize2 size={19} aria-hidden="true" />
          </button>
        </div>
      </header>
      <div ref={sketchRef} className="flex min-h-[15rem] items-center justify-center px-4 py-6 sm:min-h-[21rem] sm:px-12 lg:min-h-0 lg:py-4">
        <div className="flex size-full min-h-0 max-w-2xl items-center justify-center"><WardrobeSketch imageSrc={sketchImage} ariaLabel={design.sketch.ariaLabel} cabinetLabel={design.sketch.cabinetLabel} /></div>
      </div>
      <footer className="flex flex-wrap items-end justify-between gap-5 border-t border-stone-100 px-5 py-6 sm:px-8 lg:py-4">
        <div>
           <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">{design.sketchCard.dimensionsTitle}</h3>
          <dl className="mt-3 flex flex-wrap gap-x-7 gap-y-2">
            {design.dimensions.map((dimension) => <div key={dimension.label}><dt className="inline text-sm text-stone-500">{dimension.label} </dt><dd className="inline text-sm font-medium">{dimension.value}</dd></div>)}
          </dl>
        </div>
         <button className="flex size-11 items-center justify-center rounded-full border border-stone-200 text-stone-700 outline-none transition-colors motion-reduce:transition-none hover:bg-stone-100 focus-visible:ring-2 focus-visible:ring-stone-900" type="button" aria-label={design.sketchCard.editLabel} title={design.sketchCard.editTitle} onClick={() => window.alert(design.sketchCard.editFeedback)}>✎</button>
      </footer>
    </article>
  )
}

export default DemoSketchCard
