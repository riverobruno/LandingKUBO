import { FileText } from 'lucide-react'

interface SketchNarrativeProps {
  explodedIsAccessible: boolean
  explodedProgress: number
  isCompactLandscape: boolean
  modelIsAccessible: boolean
  modelProgress: number
  sketchExitProgress: number
  sketchIsAccessible: boolean
  sketchProgress: number
}

const prompt =
  'Quiero un escritorio minimalista de madera clara, con bordes redondeados y dos cajones en el lateral derecho.'

const narrativeClassName =
  'pointer-events-none absolute left-6 right-6 top-24 z-10 text-[#4a3528] sm:left-10 sm:right-auto sm:top-32 sm:w-[38vw] lg:left-[7vw] lg:top-[25%] lg:w-[30vw]'

function SketchNarrative({
  explodedIsAccessible,
  explodedProgress,
  isCompactLandscape,
  modelIsAccessible,
  modelProgress,
  sketchExitProgress,
  sketchIsAccessible,
  sketchProgress,
}: SketchNarrativeProps) {
  const sketchOpacity = sketchProgress * (1 - sketchExitProgress)

  return (
    <>
      <article
        className={narrativeClassName}
        aria-labelledby="sketch-scene-title"
        aria-hidden={!sketchIsAccessible}
        inert={!sketchIsAccessible}
        style={{
          height: isCompactLandscape ? 140 : undefined,
          opacity: sketchOpacity,
          transform: `translate3d(${(1 - sketchProgress) * -24 - sketchExitProgress * 18}px, ${isCompactLandscape ? 0 : (1 - sketchProgress) * 10}px, 0)`,
        }}
      >
        <div className="flex items-center gap-4 text-xs font-medium uppercase tracking-[0.22em] sm:text-sm">
          <span>Paso 2</span>
          <span className="h-px w-16 bg-[#4a3528]/55 sm:w-24" aria-hidden="true" />
        </div>

        <h2
          id="sketch-scene-title"
          className="mt-2 font-serif text-[2.2rem] font-normal leading-[0.92] tracking-[-0.045em] sm:mt-5 sm:text-[clamp(2.5rem,4.4vw,4.8rem)]"
        >
          Tu idea
          <br />
          toma forma.
        </h2>
        <p className="mt-3 max-w-[31rem] text-xs leading-normal text-[#59473b]/90 sm:mt-6 sm:text-base sm:leading-relaxed lg:text-lg">
          KUBO interpreta tu descripción y genera una primera visualización 2D del
          mueble, lista para seguir iterando.
        </p>

        <div
          className={`${isCompactLandscape ? 'hidden' : 'flex'} mt-3 max-w-[32rem] items-start gap-2 rounded-2xl border border-[#765f4f]/25 bg-[#fffaf3]/65 p-3 shadow-[0_14px_40px_rgba(72,48,31,0.08)] backdrop-blur-sm sm:mt-8 sm:gap-4 sm:p-5`}
        >
          <FileText
            className="mt-0.5 shrink-0 text-[#806858]"
            aria-hidden="true"
            size={21}
            strokeWidth={1.5}
          />
          <p className="text-[0.68rem] leading-snug text-[#59473b] sm:text-sm sm:leading-relaxed">
            {prompt}
          </p>
        </div>
      </article>

      <article
        className={narrativeClassName}
        aria-labelledby="model-scene-title"
        aria-hidden={!modelIsAccessible}
        inert={!modelIsAccessible}
        style={{
          height: isCompactLandscape ? 140 : undefined,
          opacity: modelProgress * (1 - explodedProgress),
          transform: `translate3d(${(1 - modelProgress) * -24 - explodedProgress * 18}px, ${isCompactLandscape ? 0 : (1 - modelProgress) * 10}px, 0)`,
        }}
      >
        <div className="flex items-center gap-4 text-xs font-medium uppercase tracking-[0.22em] sm:text-sm">
          <span>PASO 3</span>
          <span className="h-px w-16 bg-[#4a3528]/55 sm:w-24" aria-hidden="true" />
        </div>
        <h2
          id="model-scene-title"
          className="mt-2 font-serif text-[2.2rem] font-normal leading-[0.92] tracking-[-0.045em] sm:mt-5 sm:text-[clamp(2.5rem,4.4vw,4.8rem)]"
        >
          Tu diseño se vuelve real.
        </h2>
        <p className="mt-3 max-w-[31rem] text-xs leading-normal text-[#59473b]/90 sm:mt-6 sm:text-base sm:leading-relaxed lg:text-lg">
          KUBO transforma tu idea en un modelo 3D interactivo para que puedas explorar
          proporciones, detalles y terminaciones mediante la rotación del mueble antes
          de avanzar.
        </p>
      </article>

      <article
        className={narrativeClassName}
        aria-labelledby="exploded-model-scene-title"
        aria-hidden={!explodedIsAccessible}
        inert={!explodedIsAccessible}
        style={{
          height: isCompactLandscape ? 140 : undefined,
          opacity: modelProgress * explodedProgress,
          transform: `translate3d(${(1 - explodedProgress) * -24}px, ${isCompactLandscape ? 0 : (1 - explodedProgress) * 10}px, 0)`,
        }}
      >
        <div className="flex items-center gap-4 text-xs font-medium uppercase tracking-[0.22em] sm:text-sm">
          <span>PASO 4</span>
          <span className="h-px w-16 bg-[#4a3528]/55 sm:w-24" aria-hidden="true" />
        </div>
        <h2
          id="exploded-model-scene-title"
          className="mt-2 font-serif text-[2.2rem] font-normal leading-[0.92] tracking-[-0.045em] sm:mt-5 sm:text-[clamp(2.5rem,4.4vw,4.8rem)]"
        >
          Cada pieza
          <br />
          encuentra su lugar.
        </h2>
        <p className="mt-3 max-w-[31rem] text-xs leading-normal text-[#59473b]/90 sm:mt-6 sm:text-base sm:leading-relaxed lg:text-lg">
          KUBO identifica y separa cada componente del mueble, permitiéndote visualizar
          su estructura, distribución y relación dentro del diseño final.
        </p>
      </article>
    </>
  )
}

export default SketchNarrative
