import { useRef, useState } from 'react'
import { generateDemoDesign, type DemoDesignResponse } from '@/API/Cliente/generateDemoDesign'
import { generateDemoModel } from '@/API/Cliente/generateDemoModel'
import DemoSection from '@/components/Demo/DemoSection'
import DemoResult from '@/components/Demo/DemoResult'
import DemoSummaryScreen from '@/components/Demo/DemoSummaryScreen'
import HeroHeader from '@/components/Hero/HeroHeader'
import demoBackground from '@/assets/fondo.jpeg'
import demoDesign from '@/data/demo-design.json'
import type { DemoDesign, DemoDimension, DemoStepNumber } from '@/components/Demo/types'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function isDemoStepNumber(value: unknown): value is DemoStepNumber {
  return value === 1 || value === 2 || value === 3 || value === 4
}

function hasNonEmptyStrings(record: Record<string, unknown>, keys: string[]) {
  return keys.every((key) => isNonEmptyString(record[key]))
}

function isDemoDesign(value: unknown): value is DemoDesign {
  if (!isRecord(value) || !isNonEmptyString(value.title) || !isNonEmptyString(value.status) || !isNonEmptyString(value.downloadFilename) || !isNonEmptyString(value.description) || !isDemoStepNumber(value.currentStep) || !isNonEmptyString(value.version) || !isRecord(value.prompt) || !isRecord(value.progress) || !isRecord(value.sketchCard) || !isRecord(value.result) || !Array.isArray(value.steps) || !Array.isArray(value.dimensions) || !isRecord(value.sketch) || !isRecord(value.model)) {
    return false
  }

  const validSteps = value.steps.length === 4 && value.steps.every((step, index) => isRecord(step) && step.number === index + 1 && isNonEmptyString(step.label) && isNonEmptyString(step.status) && isNonEmptyString(step.currentStatus))
  const validCurrentStep = value.steps.some((step) => isRecord(step) && step.number === value.currentStep)
  const validDimensions = value.dimensions.every((dimension) => isRecord(dimension) && isNonEmptyString(dimension.label) && isNonEmptyString(dimension.value))

  if (!isRecord(value.summary) || !isRecord(value.summary.budget) || !isRecord(value.summary.preview) || !isRecord(value.summary.feedback) || !Array.isArray(value.summary.fields)) return false
  const summary = value.summary
  const budget = summary.budget as Record<string, unknown>
  const preview = summary.preview as Record<string, unknown>
  const feedback = summary.feedback as Record<string, unknown>
  const fields = summary.fields as unknown[]
  const prompt = value.prompt as Record<string, unknown>
  const progress = value.progress as Record<string, unknown>
  const sketchCard = value.sketchCard as Record<string, unknown>
  const result = value.result as Record<string, unknown>
  const validFields = fields.length === 3 && fields.every((field) => isRecord(field) && isNonEmptyString(field.label) && isNonEmptyString(field.value))
   const validSummary = hasNonEmptyStrings(summary, ['eyebrow', 'heading', 'description', 'quoteLabel', 'quoteUnavailableNote', 'shareLabel', 'downloadLabel', 'downloadFilename']) && hasNonEmptyStrings(budget, ['label', 'value', 'note']) && hasNonEmptyStrings(preview, ['twoDLabel', 'threeDLabel', 'twoDMeta', 'threeDMeta', 'approvedLabel', 'enlargeLabel', 'interactionHint', 'resetViewLabel', 'tablistLabel']) && hasNonEmptyStrings(feedback, ['shareSuccess', 'shareCancelled', 'shareDenied', 'clipboardSuccess', 'clipboardFailure', 'unsupported', 'downloadSuccess', 'downloadUnavailable'])
    const validPrompt = hasNonEmptyStrings(prompt, ['heading', 'formLabel', 'attachmentLabel', 'attachmentSrLabel', 'placeholder', 'submitLabel', 'helpLabel', 'attachmentHint', 'attachmentSelectedPrefix', 'pendingLabel', 'errorLabel']) && Array.isArray(prompt.examplePrompts) && prompt.examplePrompts.length === 4 && prompt.examplePrompts.every(isNonEmptyString)
   const validUiCopy = hasNonEmptyStrings(progress, ['ariaLabel', 'completedLabel']) && hasNonEmptyStrings(sketchCard, ['title', 'dimensionsTitle', 'nextLabel', 'downloadLabel', 'fullscreenLabel', 'editLabel', 'editTitle', 'editFeedback']) && hasNonEmptyStrings(result, ['editTitleLabel', 'editButtonLabel', 'unavailableLabel'])
  return validSteps && validCurrentStep && validDimensions && validSummary && validPrompt && validUiCopy && validFields && isNonEmptyString(value.sketch.ariaLabel) && isNonEmptyString(value.sketch.cabinetLabel) && hasNonEmptyStrings(value.model as Record<string, unknown>, ['status', 'cardTitle', 'viewportAriaLabel', 'wardrobeLabel', 'pendingLabel', 'errorLabel', 'loadingLabel', 'loadErrorLabel'])
}

function parseDemoDesign(value: unknown): DemoDesign {
  if (!isDemoDesign(value)) {
    throw new Error('Invalid demo design data')
  }

  return value
}

function formatMeasurement(value: number, unit: string) {
  return `${value} ${unit}`
}

function createResultDesign(design: DemoDesign, response: DemoDesignResponse): DemoDesign {
  const dimensions: DemoDimension[] = response.measurements.map((measurement) => ({
    label: measurement.label,
    value: formatMeasurement(measurement.value, measurement.unit),
  }))
  const dimensionsSummary = dimensions.map((dimension) => dimension.value).join(' × ')

  return {
    ...design,
    title: response.name,
    dimensions,
    sketch: {
      ...design.sketch,
      cabinetLabel: response.name,
    },
    summary: {
      ...design.summary,
      fields: design.summary.fields.map((field) => field.label === 'Medidas' ? { ...field, value: dimensionsSummary } : field),
    },
  }
}

function Demo() {
  const [screen, setScreen] = useState<'prompt' | 'result'>('prompt')
  const typedDemoDesign: DemoDesign = parseDemoDesign(demoDesign)
  const [currentStep, setCurrentStep] = useState<DemoStepNumber | null>(null)
  const [title, setTitle] = useState(typedDemoDesign.title)
  const [generatedDesign, setGeneratedDesign] = useState<DemoDesignResponse | null>(null)
  const [modelGlbUrl, setModelGlbUrl] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isModelSubmitting, setIsModelSubmitting] = useState(false)
  const [modelError, setModelError] = useState('')
  const submissionInFlight = useRef(false)
  const modelSubmissionInFlight = useRef(false)

  async function handlePromptSubmit(prompt: string) {
    if (submissionInFlight.current) return

    submissionInFlight.current = true
    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const response = await generateDemoDesign({ prompt: prompt.trim() })
      setGeneratedDesign(response)
      setTitle(response.name)
      setCurrentStep(typedDemoDesign.currentStep)
      setScreen('result')
    } catch {
      setErrorMessage(typedDemoDesign.prompt.errorLabel)
    } finally {
      submissionInFlight.current = false
      setIsSubmitting(false)
    }
  }

  async function handleAdvance() {
    if (currentStep === 3) {
      setCurrentStep(4)
      return
    }

    if (currentStep !== 2 || !generatedDesign || modelSubmissionInFlight.current) return

    const modelName = title.trim()
    if (!modelName) {
      setModelError(typedDemoDesign.model.errorLabel)
      return
    }

    modelSubmissionInFlight.current = true
    setIsModelSubmitting(true)
    setModelError('')

    try {
      const response = await generateDemoModel({ name: modelName, image2D: generatedDesign.sketchImage })
      setModelGlbUrl(response.glbUrl)
      setCurrentStep(3)
    } catch {
      setModelError(typedDemoDesign.model.errorLabel)
    } finally {
      modelSubmissionInFlight.current = false
      setIsModelSubmitting(false)
    }
  }

  const isSummary = screen === 'result' && currentStep === 4
  const resultDesign = generatedDesign ? createResultDesign(typedDemoDesign, generatedDesign) : typedDemoDesign

  return (
    <main className={`relative isolate min-h-svh text-stone-900 ${isSummary ? '' : 'overflow-hidden bg-[#b89c82]'}`}>
      <img className="fixed inset-0 -z-20 size-full object-cover object-center" src={demoBackground} alt="" />
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(180deg,rgba(255,248,238,0.18),rgba(67,43,28,0.12))]" aria-hidden="true" />
      <HeroHeader variant="dark" surface="transparent" />
      {screen === 'prompt' ? <DemoSection onSubmit={handlePromptSubmit} copy={typedDemoDesign.prompt} isSubmitting={isSubmitting} errorMessage={errorMessage} /> : currentStep === 4 && generatedDesign ? <DemoSummaryScreen design={resultDesign} sketchImage={generatedDesign.sketchImage} glbUrl={modelGlbUrl ?? ''} title={title} onTitleChange={setTitle} /> : currentStep !== null && generatedDesign ? <DemoResult design={resultDesign} sketchImage={generatedDesign.sketchImage} glbUrl={modelGlbUrl ?? ''} currentStep={currentStep} title={title} onTitleChange={setTitle} onAdvance={handleAdvance} isModelSubmitting={isModelSubmitting} modelError={modelError} /> : null}
    </main>
  )
}

export default Demo
