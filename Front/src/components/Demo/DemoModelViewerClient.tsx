import '@google/model-viewer'
import { useEffect, useRef, useState } from 'react'
import type { ModelViewerElement } from '@google/model-viewer'
import type { DemoModelViewerProps } from './DemoModelViewer'

const MODEL_POSTER_URL = '/ropero-propuesta.webp'

type ModelLoadState = 'loading' | 'loaded' | 'error'

function DemoModelViewerClient({ glbUrl, ariaLabel, loadingLabel, errorLabel, resetSignal, className = '' }: DemoModelViewerProps) {
  const viewerRef = useRef<ModelViewerElement>(null)
  const [loadState, setLoadState] = useState<ModelLoadState>('loading')

  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer) return

    setLoadState('loading')
    const handleLoad = () => setLoadState('loaded')
    const handleError = () => setLoadState('error')
    viewer.addEventListener('load', handleLoad)
    viewer.addEventListener('error', handleError)

    if (viewer.loaded) setLoadState('loaded')

    return () => {
      viewer.removeEventListener('load', handleLoad)
      viewer.removeEventListener('error', handleError)
    }
  }, [glbUrl])

  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer || resetSignal === undefined) return

    viewer.cameraOrbit = 'auto auto auto'
    viewer.cameraTarget = 'auto auto auto'
    viewer.fieldOfView = 'auto'
    viewer.jumpCameraToGoal()
  }, [resetSignal])

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      <model-viewer
        ref={viewerRef}
        className="block size-full min-h-0"
        src={glbUrl}
        poster={MODEL_POSTER_URL}
        alt={ariaLabel}
        camera-controls
        interaction-prompt="none"
        loading="eager"
        reveal="auto"
        shadow-intensity="1"
        camera-orbit="auto auto auto"
        camera-target="auto auto auto"
        field-of-view="auto"
        aria-busy={loadState === 'loading'}
        aria-hidden={loadState === 'error' ? true : undefined}
      />
      {loadState === 'loading' && (
        <p className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/85 px-4 py-2 text-xs font-medium text-stone-600 shadow-sm" role="status" aria-live="polite">
          {loadingLabel}
        </p>
      )}
      {loadState === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#f4efe8] px-6 py-8 text-center">
          <img className="h-full max-h-[16rem] w-full object-contain" src={MODEL_POSTER_URL} alt={ariaLabel} />
          <p className="rounded-full bg-white/90 px-4 py-2 text-xs font-medium text-red-800 shadow-sm" role="alert" aria-live="assertive">
            {errorLabel}
          </p>
        </div>
      )}
    </div>
  )
}

export default DemoModelViewerClient
