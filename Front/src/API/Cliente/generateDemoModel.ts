
export interface DemoModelRequest {
  name: string
  image2D: string
}

export interface DemoModelBudget {
  amount: number
  currency: string
}

export interface DemoModelResponse {
  glbUrl: string
  budget: DemoModelBudget
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function isCurrencyCode(value: unknown): value is string {
  return isNonEmptyString(value) && /^[A-Z]{3}$/.test(value.trim().toUpperCase())
}

function isDemoModelBudget(value: unknown): value is DemoModelBudget {
  return isRecord(value) && typeof value.amount === 'number' && Number.isFinite(value.amount) && value.amount > 0 && isCurrencyCode(value.currency)
}

function parseMockResponse(value: unknown): DemoModelResponse {
  if (!isRecord(value) || !isNonEmptyString(value.glbUrl) || !isDemoModelBudget(value.budget)) {
    throw new Error('Invalid demo model response')
  }

  return {
    glbUrl: value.glbUrl.trim(),
    budget: {
      amount: value.budget.amount,
      currency: value.budget.currency.trim().toUpperCase(),
    },
  }
}

export async function generateDemoModel(request: DemoModelRequest): Promise<DemoModelResponse> {
  if (!isRecord(request) || !isNonEmptyString(request.name) || !isNonEmptyString(request.image2D)) {
    throw new Error('A non-empty demo model name and 2D image are required')
  }

  const params = new URLSearchParams({ name: request.name })

  const response = await fetch(`/api/demo/model?${params.toString()}`)
  if (!response.ok) {
    throw new Error(`Failed to generate demo model: ${response.status}`)
  }

  const data: unknown = await response.json()
  return parseMockResponse(data)
}
