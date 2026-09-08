import mockResponse from './demo-model-response.json'

export interface DemoModelRequest {
  name: string
  image2D: string
}

export interface DemoModelResponse {
  glbUrl: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function parseMockResponse(value: unknown): DemoModelResponse {
  if (!isRecord(value) || !isNonEmptyString(value.glbUrl)) {
    throw new Error('Invalid demo model response')
  }

  return { glbUrl: value.glbUrl.trim() }
}

export async function generateDemoModel(request: DemoModelRequest): Promise<DemoModelResponse> {
  if (!isRecord(request) || !isNonEmptyString(request.name) || !isNonEmptyString(request.image2D)) {
    throw new Error('A non-empty demo model name and 2D image are required')
  }

  return parseMockResponse(mockResponse)
}
