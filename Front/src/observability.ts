export interface NodeStats {
  nodeName: string
  status: 'up' | 'down'
  health: string
  cpu: { percent: number } | null
  memory: { usageBytes: number; limitBytes: number; percent: number | null } | null
}

export const BACKEND_NODES = ['backend-1', 'backend-2', 'backend-3'] as const
export type BackendNode = typeof BACKEND_NODES[number]

export function isBackendNode(value: string): value is BackendNode {
  return BACKEND_NODES.includes(value as BackendNode)
}

const backendNodeEvent = new EventTarget()
let latestBackendNode: string | null = null

export function getLatestBackendNode() {
  return latestBackendNode
}

export function observeBackendResponse(response: Response) {
  const nodeName = response.headers.get('X-Backend-Node')?.trim()
  if (!nodeName || !isBackendNode(nodeName)) return

  latestBackendNode = nodeName
  backendNodeEvent.dispatchEvent(new CustomEvent('backend-node', { detail: nodeName }))
}

export function subscribeToBackendNode(listener: (nodeName: string) => void) {
  const handler = (event: Event) => listener((event as CustomEvent<string>).detail)
  backendNodeEvent.addEventListener('backend-node', handler)
  return () => backendNodeEvent.removeEventListener('backend-node', handler)
}

function isNodeStats(value: unknown): value is NodeStats {
  if (typeof value !== 'object' || value === null) return false
  const stats = value as Record<string, unknown>
  return typeof stats.nodeName === 'string'
    && (stats.status === 'up' || stats.status === 'down')
    && typeof stats.health === 'string'
}

export async function fetchNodeStats(nodeName: string): Promise<NodeStats> {
  if (!isBackendNode(nodeName)) {
    throw new Error(`Invalid backend node: ${nodeName}`)
  }

  const response = await fetch(`/stats/${encodeURIComponent(nodeName)}`)
  const data: unknown = await response.json().catch(() => null)
  if (!response.ok || !isNodeStats(data)) {
    throw new Error(`Failed to read stats for ${nodeName}`)
  }

  return data
}
