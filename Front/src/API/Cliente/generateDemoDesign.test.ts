import { afterEach, describe, expect, it, vi } from 'vitest'
import { generateDemoDesign } from './generateDemoDesign'

describe('generateDemoDesign', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('requests a design and normalizes the response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({
      name: '  Placard  ',
      sketchImage: ' /placard-sketch.svg ',
      measurements: [{ label: ' Ancho ', value: 120, unit: ' cm ' }],
    }), { status: 200 })))

    await expect(generateDemoDesign({ prompt: 'un placard' })).resolves.toEqual({
      name: 'Placard',
      sketchImage: '/placard-sketch.svg',
      measurements: [{ label: 'Ancho', value: 120, unit: 'cm' }],
    })
    expect(fetch).toHaveBeenCalledWith('/api/demo/design?prompt=un+placard')
  })

  it('rejects invalid input before making a request', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    await expect(generateDemoDesign({ prompt: '   ' })).rejects.toThrow('A non-empty demo prompt is required')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('reports HTTP failures and malformed responses', async () => {
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce(new Response(null, { status: 503 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ name: 'Placard' }), { status: 200 })))

    await expect(generateDemoDesign({ prompt: 'escritorio' })).rejects.toThrow('Failed to generate demo design: 503')
    await expect(generateDemoDesign({ prompt: 'escritorio' })).rejects.toThrow('Invalid demo design response')
  })
})
