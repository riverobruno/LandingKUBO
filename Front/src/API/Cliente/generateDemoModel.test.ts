import { afterEach, describe, expect, it, vi } from 'vitest'
import { generateDemoModel } from './generateDemoModel'

describe('generateDemoModel', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('requests a model and normalizes the response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({
      glbUrl: ' /ropero-propuesta.glb ',
      budget: { amount: 385000, currency: 'ars' },
    }), { status: 200 })))

    await expect(generateDemoModel({ name: 'Placard', image2D: '/placard.svg' })).resolves.toEqual({
      glbUrl: '/ropero-propuesta.glb',
      budget: { amount: 385000, currency: 'ARS' },
    })
    expect(fetch).toHaveBeenCalledWith('/api/demo/model?name=Placard')
  })

  it('rejects incomplete requests before making a request', async () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    await expect(generateDemoModel({ name: '', image2D: '/placard.svg' })).rejects.toThrow('A non-empty demo model name and 2D image are required')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('reports HTTP failures and invalid budget data', async () => {
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce(new Response(null, { status: 502 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ glbUrl: '/model.glb', budget: { amount: 0, currency: 'ARS' } }), { status: 200 })))

    await expect(generateDemoModel({ name: 'Placard', image2D: '/placard.svg' })).rejects.toThrow('Failed to generate demo model: 502')
    await expect(generateDemoModel({ name: 'Placard', image2D: '/placard.svg' })).rejects.toThrow('Invalid demo model response')
  })
})
