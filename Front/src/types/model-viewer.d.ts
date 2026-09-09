import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import type { ModelViewerElement } from '@google/model-viewer'

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': DetailedHTMLProps<HTMLAttributes<ModelViewerElement>, ModelViewerElement> & {
        src?: string
        poster?: string
        alt?: string
        'camera-controls'?: boolean
        'interaction-prompt'?: 'auto' | 'none'
        loading?: 'auto' | 'lazy' | 'eager'
        reveal?: 'auto' | 'manual'
        'shadow-intensity'?: number | string
        'camera-orbit'?: string
        'camera-target'?: string
        'field-of-view'?: string
      }
    }
  }
}

export {}
