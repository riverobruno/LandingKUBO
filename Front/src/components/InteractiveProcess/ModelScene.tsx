import DeskModel from '@/components/InteractiveProcess/DeskModel'
import {
  deskModelViewportBounds,
  modelViewportHeightRatio,
  type DeskLayout,
} from '@/components/InteractiveProcess/deskLayout'
import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense, type Dispatch, type SetStateAction } from 'react'

interface ModelSceneProps {
  deskLayout: DeskLayout | null
  explodedProgress: number
  isInteractive: boolean
  isVisible: boolean
  modelOpacity: number
  onExplodedReady: Dispatch<SetStateAction<boolean>>
  onReady: Dispatch<SetStateAction<boolean>>
  rotationY: number
}

function ModelScene({
  deskLayout,
  explodedProgress,
  isInteractive,
  isVisible,
  modelOpacity,
  onExplodedReady,
  onReady,
  rotationY,
}: ModelSceneProps) {
  if (!deskLayout) return null

  const bounds = deskModelViewportBounds(deskLayout)

  return (
    <div
      className="isolate absolute z-[31]"
      aria-describedby="desk-model-description"
      aria-hidden={!isVisible}
      inert={!isVisible}
      role={isVisible ? 'group' : undefined}
      style={{
        height: bounds.height,
        left: bounds.left,
        pointerEvents: isInteractive ? 'auto' : 'none',
        top: bounds.top,
        width: bounds.width,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden="true"
        style={{
          WebkitMaskImage:
            'radial-gradient(ellipse at center, black 36%, rgba(0, 0, 0, 0.68) 66%, transparent 90%)',
          backdropFilter: 'blur(10px)',
          background:
            'radial-gradient(ellipse at 50% 48%, rgba(255, 246, 236, 0.3) 0%, rgba(252, 232, 216, 0.2) 46%, rgba(245, 213, 191, 0.08) 72%, transparent 92%)',
          filter: 'blur(18px)',
          maskImage:
            'radial-gradient(ellipse at center, black 36%, rgba(0, 0, 0, 0.68) 66%, transparent 90%)',
          opacity: modelOpacity,
          transform: 'scale(0.96)',
        }}
      />
      <Canvas
        aria-hidden="true"
        camera={{ position: [0, 0, 5], zoom: 100 }}
        dpr={[1, 1.75]}
        fallback={<div aria-hidden="true" />}
        frameloop="demand"
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        orthographic
        style={{
          background: 'transparent',
          pointerEvents: isInteractive ? 'auto' : 'none',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <ambientLight intensity={1.25} />
        <directionalLight color="#fff4df" intensity={2.1} position={[-3, 4, 5]} />
        <directionalLight color="#d7e2e6" intensity={0.75} position={[4, 2, 3]} />
        <Suspense fallback={null}>
          <DeskModel
            explodedProgress={explodedProgress}
            fitHeightRatio={1 / modelViewportHeightRatio}
            opacity={modelOpacity}
            onExplodedReady={onExplodedReady}
            onReady={onReady}
            rotationY={rotationY}
          />
        </Suspense>
        <OrbitControls
          dampingFactor={0.08}
          enabled={isInteractive}
          enableDamping
          enablePan={false}
          enableZoom={false}
          target={[0, 0, 0]}
        />
      </Canvas>
      <p id="desk-model-description" className="sr-only">
        {explodedProgress >= 0.5
          ? 'Modelo 3D del escritorio de madera clara separado en sus componentes. Arrastrá para rotarlo horizontal y verticalmente; la página sigue desplazándose con la rueda o el gesto vertical.'
          : 'Modelo 3D del escritorio de madera clara ensamblado. Arrastrá para rotarlo horizontal y verticalmente; la página sigue desplazándose con la rueda o el gesto vertical.'}
      </p>
    </div>
  )
}

export default ModelScene
