export interface DemoStep {
  number: number
  label: string
}

export type DemoStepNumber = 1 | 2 | 3 | 4

export interface DemoDimension {
  label: string
  value: string
}

export interface DemoDesign {
  title: string
  downloadFilename: string
  steps: DemoStep[]
  currentStep: DemoStepNumber
  version: string
  prompt: DemoPrompt
  progress: DemoProgressCopy
  sketchCard: DemoSketchCardCopy
  result: DemoResultCopy
  dimensions: DemoDimension[]
  sketch: {
    ariaLabel: string
    cabinetLabel: string
  }
  model: {
    cardTitle: string
    viewportAriaLabel: string
    wardrobeLabel: string
    pendingLabel: string
    errorLabel: string
    loadingLabel: string
    loadErrorLabel: string
  }
  summary: DemoSummary
}

export interface DemoSummary {
  eyebrow: string
  heading: string
  description: string
  budget: {
    label: string
    note: string
  }
  fields: DemoSummaryField[]
  shareLabel: string
  downloadLabel: string
  downloadFilename: string
  feedback: DemoFeedbackCopy
  preview: {
    twoDLabel: string
    threeDLabel: string
    twoDMeta: string
    threeDMeta: string
    approvedLabel: string
    enlargeLabel: string
    interactionHint: string
    resetViewLabel: string
    tablistLabel: string
  }
}

export interface DemoPrompt {
  heading: string
  formLabel: string
  attachmentLabel: string
  attachmentSrLabel: string
  placeholder: string
  submitLabel: string
  helpLabel: string
  attachmentHint: string
  attachmentSelectedPrefix: string
  pendingLabel: string
  errorLabel: string
  examplePrompts: string[]
}

export interface DemoProgressCopy {
  ariaLabel: string
}

export interface DemoSketchCardCopy {
  title: string
  dimensionsTitle: string
  previousLabel: string
  nextLabel: string
  downloadLabel: string
  fullscreenLabel: string
  editLabel: string
  editTitle: string
  editFeedback: string
}

export interface DemoResultCopy {
  editTitleLabel: string
  editButtonLabel: string
  unavailableLabel: string
}

export interface DemoFeedbackCopy {
  shareSuccess: string
  shareCancelled: string
  shareDenied: string
  clipboardSuccess: string
  clipboardFailure: string
  unsupported: string
  downloadSuccess: string
  downloadUnavailable: string
}

export interface DemoSummaryField {
  label: string
  value: string
}
