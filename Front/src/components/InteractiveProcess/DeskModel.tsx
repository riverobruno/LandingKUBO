import deskModelUrl from '@/assets/escritorio_madera_clara.glb?url'
import explodedDeskModelUrl from '@/assets/escritorio_madera_clara_descompuesto.glb?url'
import { useGLTF } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import {
  Suspense,
  type Dispatch,
  type SetStateAction,
  useEffect,
  useLayoutEffect,
  useMemo,
} from 'react'
import { Box3, type Material, type Mesh, type Object3D, Vector3 } from 'three'

interface DeskModelProps {
  explodedProgress: number
  fitHeightRatio: number
  opacity: number
  onExplodedReady: Dispatch<SetStateAction<boolean>>
  onReady: Dispatch<SetStateAction<boolean>>
  rotationY: number
}

interface PreparedModelProps {
  opacity: number
  onReady: Dispatch<SetStateAction<boolean>>
  scene: Object3D
}

function cloneModel(scene: Object3D) {
  const model = scene.clone(true)
  const materials: Material[] = []

  model.traverse((object) => {
    const mesh = object as Mesh
    if (!mesh.isMesh) return

    const sourceMaterials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
    const materialCopies = sourceMaterials.map((material) => {
      const copy = material.clone()
      copy.transparent = true
      materials.push(copy)
      return copy
    })
    mesh.material = Array.isArray(mesh.material) ? materialCopies : materialCopies[0]
  })

  return { materials, model }
}

function PreparedModel({ opacity, onReady, scene }: PreparedModelProps) {
  const { invalidate } = useThree()
  const { materials, model } = useMemo(() => cloneModel(scene), [scene])

  useLayoutEffect(() => {
    materials.forEach((material) => {
      material.opacity = opacity
      material.depthWrite = opacity >= 0.999
    })
    invalidate()
  }, [invalidate, materials, opacity])

  useEffect(() => {
    onReady(true)
    return () => {
      onReady(false)
      materials.forEach((material) => material.dispose())
    }
  }, [materials, onReady])

  return <primitive object={model} />
}

interface ExplodedModelProps {
  opacity: number
  onReady: Dispatch<SetStateAction<boolean>>
}

function ExplodedModel({ opacity, onReady }: ExplodedModelProps) {
  const { scene } = useGLTF(explodedDeskModelUrl)

  return <PreparedModel opacity={opacity} onReady={onReady} scene={scene} />
}

function DeskModel({
  explodedProgress,
  fitHeightRatio,
  opacity,
  onExplodedReady,
  onReady,
  rotationY,
}: DeskModelProps) {
  const { scene } = useGLTF(deskModelUrl)
  const { viewport } = useThree()
  const { center, normalizationScale } = useMemo(() => {
    scene.updateMatrixWorld(true)
    const bounds = new Box3().setFromObject(scene)
    const center = bounds.getCenter(new Vector3())
    const size = bounds.getSize(new Vector3())

    return {
      center: center.multiplyScalar(-1).toArray(),
      normalizationScale: 1 / size.y,
    }
  }, [scene])
  const fittedScale = viewport.height * fitHeightRatio * normalizationScale

  return (
    <group rotation={[0, rotationY, 0]} scale={fittedScale}>
      <group position={center}>
        <PreparedModel
          opacity={opacity * (1 - explodedProgress)}
          onReady={onReady}
          scene={scene}
        />
        <Suspense fallback={null}>
          <ExplodedModel
            opacity={opacity * explodedProgress}
            onReady={onExplodedReady}
          />
        </Suspense>
      </group>
    </group>
  )
}

useGLTF.preload(deskModelUrl)
useGLTF.preload(explodedDeskModelUrl)

export default DeskModel
