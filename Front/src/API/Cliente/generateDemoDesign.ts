import mockResponse from './demo-design-response.json'

export interface DemoDesignRequest {
  prompt: string
}

export interface DemoMeasurement {
  label: string
  value: number
  unit: string
}

export interface DemoDesignResponse {
  name: string
  sketchImage: string
  measurements: DemoMeasurement[]
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function isDemoMeasurement(value: unknown): value is DemoMeasurement {
  return isRecord(value) && isNonEmptyString(value.label) && typeof value.value === 'number' && Number.isFinite(value.value) && value.value > 0 && isNonEmptyString(value.unit)
}

function parseMockResponse(value: unknown): DemoDesignResponse {
  if (!isRecord(value) || !isNonEmptyString(value.name) || !isNonEmptyString(value.sketchImage) || !Array.isArray(value.measurements) || value.measurements.length === 0 || !value.measurements.every(isDemoMeasurement)) {
    throw new Error('Invalid demo design response')
  }

  return {
    name: value.name.trim(),
    sketchImage: value.sketchImage.trim(),
    measurements: value.measurements.map((measurement) => ({
      label: measurement.label.trim(),
      value: measurement.value,
      unit: measurement.unit.trim(),
    })),
  }
}

export async function generateDemoDesign(request: DemoDesignRequest): Promise<DemoDesignResponse> {
  if (!isRecord(request) || !isNonEmptyString(request.prompt)) {
    throw new Error('A non-empty demo prompt is required')
  }

  return parseMockResponse(mockResponse)
}
