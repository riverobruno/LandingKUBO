import { Component, lazy, Suspense, type ReactNode } from 'react'

const MODEL_POSTER_URL = '/ropero-propuesta.webp'

export interface DemoModelViewerProps {
  glbUrl: string
  ariaLabel: string
  loadingLabel: string
  errorLabel: string
  resetSignal?: number
  className?: string
}

interface ModelViewerPosterFallbackProps {
  ariaLabel: string
  message: string
  className: string
  isError: boolean
}

interface ModelViewerErrorBoundaryProps {
  ariaLabel: string
  errorLabel: string
  className: string
  children: ReactNode
}

interface ModelViewerErrorBoundaryState {
  hasError: boolean
}

function ModelViewerPosterFallback({ ariaLabel, message, className, isError }: ModelViewerPosterFallbackProps) {
  return (
    <div className={`relative flex w-full items-center justify-center overflow-hidden bg-[#f4efe8] ${className}`} aria-busy={!isError}>
      <img className="absolute inset-0 size-full object-contain p-8" src={MODEL_POSTER_URL} alt={ariaLabel} />
      <p className={`relative rounded-full bg-white/85 px-4 py-2 text-xs font-medium shadow-sm ${isError ? 'text-red-800' : 'text-stone-600'}`} role={isError ? 'alert' : 'status'} aria-live={isError ? 'assertive' : 'polite'}>
        {message}
      </p>
    </div>
  )
}

class ModelViewerErrorBoundary extends Component<ModelViewerErrorBoundaryProps, ModelViewerErrorBoundaryState> {
  state: ModelViewerErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ModelViewerErrorBoundaryState {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return <ModelViewerPosterFallback ariaLabel={this.props.ariaLabel} message={this.props.errorLabel} className={this.props.className} isError />
    }

    return this.props.children
  }
}

const DemoModelViewerClient = lazy(() => import('./DemoModelViewerClient'))

function DemoModelViewer({ ariaLabel, loadingLabel, errorLabel, className = '', ...props }: DemoModelViewerProps) {
  return (
    <ModelViewerErrorBoundary ariaLabel={ariaLabel} errorLabel={errorLabel} className={className}>
      <Suspense fallback={<ModelViewerPosterFallback ariaLabel={ariaLabel} message={loadingLabel} className={className} isError={false} />}>
        <DemoModelViewerClient ariaLabel={ariaLabel} loadingLabel={loadingLabel} errorLabel={errorLabel} className={className} {...props} />
      </Suspense>
    </ModelViewerErrorBoundary>
  )
}

export default DemoModelViewer
