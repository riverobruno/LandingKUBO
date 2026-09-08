import { Maximize2, RotateCcw } from 'lucide-react'
import { useRef, useState } from 'react'
import WardrobeModelPlaceholder from './WardrobeModelPlaceholder'
import WardrobeSketch from './WardrobeSketch'
import type { DemoDesign, DemoTexture } from './types'

interface DesignPreviewProps {
  design: DemoDesign
  onPreviewLabelChange: (label: string) => void
  onFeedback: (message: string) => void
}

function DesignPreview({ design, onPreviewLabelChange, onFeedback }: DesignPreviewProps) {
  const [tab, setTab] = useState<'2d' | '3d'>('2d')
  const [textureIndex, setTextureIndex] = useState(0)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [scale, setScale] = useState(1)
  const pointerStart = useRef<{ x: number; y: number } | null>(null)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const fullscreenRef = useRef<HTMLDivElement>(null)
  const texture: DemoTexture = design.summary.textures[textureIndex]
  const preview = design.summary.preview

  function selectTab(nextTab: '2d' | '3d', focus = false) {
    setTab(nextTab)
    onPreviewLabelChange(nextTab === '2d' ? preview.twoDLabel : preview.threeDLabel)
    if (focus) tabRefs.current[nextTab === '2d' ? 0 : 1]?.focus()
  }

  function handleTabKey(event: React.KeyboardEvent<HTMLButtonElement>, currentTab: '2d' | '3d') {
    const tabs: Array<'2d' | '3d'> = ['2d', '3d']
    const index = tabs.indexOf(currentTab)
    let nextIndex: number | null = null
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = tabs.length - 1
    if (nextIndex === null) return
    event.preventDefault()
    selectTab(tabs[nextIndex], true)
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (tab !== '3d') return
    pointerStart.current = { x: event.clientX, y: event.clientY }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!pointerStart.current || tab !== '3d') return
    const deltaX = event.clientX - pointerStart.current.x
    const deltaY = event.clientY - pointerStart.current.y
    pointerStart.current = { x: event.clientX, y: event.clientY }
    setRotation((current) => ({ x: Math.max(-18, Math.min(18, current.x - deltaY * 0.35)), y: current.y + deltaX * 0.35 }))
  }

  function clearPointerInteraction(event?: React.PointerEvent<HTMLDivElement>) {
    pointerStart.current = null
    if (event?.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
  }

  function resetView() {
    setRotation({ x: 0, y: 0 })
    setScale(1)
  }

  function handleWheel(event: React.WheelEvent<HTMLDivElement>) {
    if (tab !== '3d') return
    event.preventDefault()
    setScale((current) => Math.max(0.8, Math.min(1.25, current - event.deltaY * 0.001)))
  }

  return (
    <article className="overflow-hidden rounded-[1.75rem] border border-stone-200 bg-[#fcfaf7]">
      <header className="flex flex-wrap items-center justify-between gap-4 bg-[#eee5db] px-4 py-4 sm:px-6">
        <div className="flex min-h-11 rounded-full bg-white/65 p-1" role="tablist" aria-label={preview.tablistLabel}>
          <button ref={(element) => { tabRefs.current[0] = element }} className={`min-h-11 rounded-full px-4 text-sm font-medium outline-none transition-colors motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-stone-900 ${tab === '2d' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-white'}`} type="button" role="tab" aria-selected={tab === '2d'} aria-controls="design-panel-2d" id="design-tab-2d" tabIndex={tab === '2d' ? 0 : -1} onClick={() => selectTab('2d')} onKeyDown={(event) => handleTabKey(event, '2d')}>
            {preview.twoDLabel}
          </button>
          <button ref={(element) => { tabRefs.current[1] = element }} className={`min-h-11 rounded-full px-4 text-sm font-medium outline-none transition-colors motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-stone-900 ${tab === '3d' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-white'}`} type="button" role="tab" aria-selected={tab === '3d'} aria-controls="design-panel-3d" id="design-tab-3d" tabIndex={tab === '3d' ? 0 : -1} onClick={() => selectTab('3d')} onKeyDown={(event) => handleTabKey(event, '3d')}>
            {preview.threeDLabel}
          </button>
        </div>
        <span className="text-xs font-medium text-stone-500 sm:text-sm">{tab === '2d' ? preview.twoDMeta : preview.threeDMeta}</span>
      </header>

      {tab === '2d' ? (
        <div ref={fullscreenRef} className="relative flex min-h-[28rem] items-center justify-center bg-[#fcfaf7] px-5 py-14 sm:min-h-[38rem] sm:px-12" role="tabpanel" id="design-panel-2d" aria-labelledby="design-tab-2d">
          <span className="absolute left-5 top-5 rounded-full bg-[#ded0c1] px-3 py-1.5 text-[0.62rem] font-bold tracking-[0.16em] text-stone-700 sm:left-7">{preview.approvedLabel}</span>
          <button className="absolute right-5 top-4 inline-flex min-h-11 items-center gap-2 rounded-full border border-stone-300 bg-white/70 px-4 text-xs font-medium text-stone-700 outline-none hover:bg-white focus-visible:ring-2 focus-visible:ring-stone-900 sm:right-7" type="button" onClick={() => { if (fullscreenRef.current && document.fullscreenEnabled) void fullscreenRef.current.requestFullscreen().catch(() => undefined) }}>
            <Maximize2 size={15} aria-hidden="true" />{preview.enlargeLabel}
          </button>
           <div className="w-full max-w-3xl"><WardrobeSketch ariaLabel={design.sketch.ariaLabel} cabinetLabel={design.sketch.cabinetLabel} /></div>
        </div>
      ) : (
         <div ref={fullscreenRef} className="relative flex min-h-[28rem] touch-none select-none items-center justify-center overflow-hidden bg-[#eee5db] px-5 py-14 sm:min-h-[38rem] sm:px-12" role="tabpanel" id="design-panel-3d" aria-labelledby="design-tab-3d" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={clearPointerInteraction} onPointerCancel={clearPointerInteraction} onLostPointerCapture={clearPointerInteraction} onWheel={handleWheel}>
          <button className="absolute right-5 top-4 z-[1] inline-flex min-h-11 items-center gap-2 rounded-full border border-stone-300 bg-white/70 px-4 text-xs font-medium text-stone-700 outline-none hover:bg-white focus-visible:ring-2 focus-visible:ring-stone-900 sm:right-7" type="button" onClick={() => { const nextIndex = (textureIndex + 1) % design.summary.textures.length; setTextureIndex(nextIndex); onFeedback(`${preview.textureFeedback}: ${design.summary.textures[nextIndex].name}.`) }}>
            {preview.textureLabel}
          </button>
           <div className="w-full max-w-3xl" style={{ transform: `perspective(900px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${scale})` }}><WardrobeModelPlaceholder ariaLabel={design.model.viewportAriaLabel} wardrobeLabel={design.model.wardrobeLabel} texture={texture} /></div>
          <div className="absolute bottom-5 flex flex-wrap items-center justify-center gap-2"><span className="rounded-full bg-white/75 px-4 py-2 text-xs text-stone-600">{preview.interactionHint}</span><button className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white/80 px-4 text-xs font-medium text-stone-700 outline-none hover:bg-white focus-visible:ring-2 focus-visible:ring-stone-900" type="button" onClick={resetView}><RotateCcw size={14} aria-hidden="true" />{preview.resetViewLabel}</button></div>
        </div>
      )}
    </article>
  )
}

export default DesignPreview
