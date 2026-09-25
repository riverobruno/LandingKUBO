import { Send } from 'lucide-react'
import { useLayoutEffect, useRef } from 'react'

export interface PromptInputBounds {
  height: number
  radius: number
  viewportHeight: number
  viewportWidth: number
  width: number
  x: number
  y: number
}

interface PromptSceneProps {
  inputProgress: number
  isAccessible: boolean
  onInputBoundsChange: (bounds: PromptInputBounds) => void
  outlineHandoffProgress: number
  promptContentExitProgress: number
  promptText: string
  revealProgress: number
  surfaceExitProgress: number
  subtitleProgress: number
  titleExitProgress: number
  titleProgress: number
  visiblePromptText: string
}

function PromptScene({
  inputProgress,
  isAccessible,
  onInputBoundsChange,
  outlineHandoffProgress,
  promptContentExitProgress,
  promptText,
  revealProgress,
  surfaceExitProgress,
  subtitleProgress,
  titleExitProgress,
  titleProgress,
  visiblePromptText,
}: PromptSceneProps) {
  const inputLayoutRef = useRef<HTMLDivElement>(null)
  const inputSurfaceRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<HTMLElement>(null)
  const copyOpacity = 1 - titleExitProgress
  const promptContentOpacity = 1 - promptContentExitProgress
  const surfaceOpacity = 1 - surfaceExitProgress
  const outlineHandoffOpacity =
    outlineHandoffProgress >= 1
      ? 0
      : (1 - outlineHandoffProgress) / (1 - 0.7 * outlineHandoffProgress)
  const outlineOpacity =
    Math.min(surfaceExitProgress * 2, 1) * outlineHandoffOpacity
  const inputIsAccessible = inputProgress > 0.05 && promptContentOpacity > 0.05
  const controlsAreInteractive = inputProgress >= 1 && promptContentOpacity >= 0.999
  const copyContrastOpacity = Math.max(titleProgress, subtitleProgress) * copyOpacity
  const sceneClassName = `absolute inset-0 z-20 overflow-hidden text-white ${isAccessible ? '' : 'pointer-events-none'}`

  useLayoutEffect(() => {
    const inputLayout = inputLayoutRef.current
    const inputSurface = inputSurfaceRef.current
    const scene = sceneRef.current
    if (!inputLayout || !inputSurface || !scene) return

    let isActive = true
    const measure = () => {
      if (!isActive) return
      const inputRect = inputLayout.getBoundingClientRect()
      const sceneRect = scene.getBoundingClientRect()
      const radius = Number.parseFloat(getComputedStyle(inputSurface).borderTopLeftRadius)

      onInputBoundsChange({
        height: inputRect.height,
        radius,
        viewportHeight: sceneRect.height,
        viewportWidth: sceneRect.width,
        width: inputRect.width,
        x: inputRect.left - sceneRect.left,
        y: inputRect.top - sceneRect.top,
      })
    }
    const resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(inputLayout)
    resizeObserver.observe(scene)
    window.addEventListener('resize', measure)
    void document.fonts?.ready.then(measure)
    measure()

    return () => {
      isActive = false
      resizeObserver.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [onInputBoundsChange])

  return (
    <section
      ref={sceneRef}
      className={sceneClassName}
      aria-labelledby="prompt-scene-title"
      aria-hidden={!isAccessible}
      inert={!isAccessible}
    >
      <div
        className="pointer-events-none absolute inset-0 z-[5] bg-[radial-gradient(ellipse_52%_38%_at_center,rgba(55,34,23,0.46)_0%,rgba(55,34,23,0.2)_52%,transparent_82%)]"
        aria-hidden="true"
        style={{
          clipPath: `inset(${(1 - revealProgress) * 100}% 0 0)`,
          opacity: copyContrastOpacity,
        }}
      />

      <div
        className="relative z-10 flex size-full flex-col items-center justify-center px-5 py-16 text-center sm:px-10"
        style={{ clipPath: `inset(${(1 - revealProgress) * 100}% 0 0)` }}
      >
        <h2
          id="prompt-scene-title"
          className="font-serif text-[clamp(2.6rem,5vw,5rem)] font-normal leading-none tracking-[-0.035em] text-balance"
          style={{
            opacity: titleProgress * copyOpacity,
            transform: `translateY(${(1 - titleProgress) * 22 - titleExitProgress * 12}px)`,
          }}
        >
          Empezá con una idea
        </h2>
        <p
          className="mt-4 text-base font-light text-[#fff9f1]/90 sm:mt-5 sm:text-xl"
          aria-hidden={subtitleProgress <= 0.05}
          style={{
            opacity: subtitleProgress * copyOpacity,
            transform: `translateY(${(1 - subtitleProgress) * 14 - titleExitProgress * 8}px)`,
          }}
        >
          Describí el mueble que imaginás.
        </p>

        <div
          ref={inputLayoutRef}
          className="relative mt-8 min-h-20 w-full max-w-[58rem] sm:mt-10 sm:min-h-24"
        >
          <div
            ref={inputSurfaceRef}
            className="relative flex min-h-20 w-full items-center gap-3 rounded-[1.75rem] p-2 pl-5 text-left focus-within:ring-2 focus-within:ring-white focus-within:ring-offset-2 focus-within:ring-offset-transparent sm:min-h-24 sm:gap-5 sm:rounded-[2rem] sm:pl-7"
            aria-hidden={!inputIsAccessible}
            inert={!controlsAreInteractive}
            style={{
              opacity: inputProgress,
              transform: `scale(${0.96 + inputProgress * 0.04})`,
            }}
          >
            <span
              className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[#f5eee3] shadow-[0_20px_60px_rgba(65,38,21,0.22)]"
              aria-hidden="true"
              style={{ opacity: surfaceOpacity }}
            />
            <span
              className="pointer-events-none absolute inset-0 rounded-[inherit] border border-[#4a3528]/70"
              aria-hidden="true"
              style={{ opacity: outlineOpacity }}
            />
            <div className="relative min-w-0 flex-1 text-sm leading-relaxed text-[#56463a] sm:text-base">
              <span style={{ opacity: promptContentOpacity }}>
                <textarea
                  className="absolute inset-0 size-full resize-none overflow-hidden border-0 bg-transparent p-0 text-transparent caret-transparent outline-none"
                  value={promptText}
                  aria-label="Idea de mueble"
                  readOnly
                  tabIndex={controlsAreInteractive ? 0 : -1}
                />
                <span aria-hidden="true">{visiblePromptText}</span>
                <span
                  className="ml-px inline-block h-[1.15em] w-px translate-y-[0.15em] bg-[#756052]/70"
                  aria-hidden="true"
                />
              </span>
            </div>
            <button
              className="relative flex size-14 shrink-0 items-center justify-center rounded-full bg-[#8b6f5e] text-white outline-none transition-colors hover:bg-[#765c4d] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#8b6f5e] sm:size-16"
              type="button"
              aria-label="Enviar idea"
              aria-disabled="true"
              tabIndex={controlsAreInteractive ? 0 : -1}
              style={{ opacity: promptContentOpacity }}
            >
              <Send aria-hidden="true" size={24} strokeWidth={1.6} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PromptScene
