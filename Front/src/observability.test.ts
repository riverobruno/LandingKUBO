import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  BACKEND_NODES,
  fetchNodeStats,
  getLatestBackendNode,
  observeBackendResponse,
} from './observability'

describe('observability backend allowlist', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('accepts only allowlisted backend response headers', () => {
    observeBackendResponse(new Response(null, { headers: { 'X-Backend-Node': ' backend-2 ' } }))
    expect(getLatestBackendNode()).toBe('backend-2')

    observeBackendResponse(new Response(null, { headers: { 'X-Backend-Node': 'unknown-node' } }))
    expect(getLatestBackendNode()).toBe('backend-2')
  })

  it('rejects empty headers and stats requests outside the allowlist', async () => {
    observeBackendResponse(new Response(null, { headers: { 'X-Backend-Node': 'backend-2' } }))
    observeBackendResponse(new Response(null, { headers: { 'X-Backend-Node': '   ' } }))
    expect(getLatestBackendNode()).toBe('backend-2')

    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    await expect(fetchNodeStats('unknown-node')).rejects.toThrow('Invalid backend node: unknown-node')
    expect(fetchMock).not.toHaveBeenCalled()
    expect(BACKEND_NODES).toEqual(['backend-1', 'backend-2', 'backend-3'])
  })
})
