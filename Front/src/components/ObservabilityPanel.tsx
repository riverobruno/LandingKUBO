import { useEffect, useState } from 'react'
import {
  BACKEND_NODES,
  fetchNodeStats,
  getLatestBackendNode,
  subscribeToBackendNode,
  type NodeStats,
} from '@/observability'

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return 'n/d'
  const units = ['B', 'KB', 'MB', 'GB']
  const unit = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  return `${(bytes / 1024 ** unit).toFixed(unit === 0 ? 0 : 1)} ${units[unit]}`
}

function Metric({ stats }: { stats: NodeStats | null }) {
  if (!stats) return <span className="text-stone-500">sin datos</span>
  if (stats.status === 'down') return <span className="font-medium text-red-700">caído</span>

  const cpu = stats.cpu ? `${stats.cpu.percent.toFixed(1)}%` : 'n/d'
  const memory = stats.memory ? formatBytes(stats.memory.usageBytes) : 'n/d'
  return <span>{cpu} CPU · {memory} RAM</span>
}

function StatusRow({ stats }: { stats: NodeStats }) {
  const isUp = stats.status === 'up'
  return (
    <li className="flex items-center justify-between gap-3 border-t border-stone-200/80 py-2 text-xs">
      <span className="font-medium">{stats.nodeName}</span>
      <span className={isUp ? 'text-emerald-700' : 'text-red-700'}>
        {isUp ? 'arriba' : 'caído'} · <Metric stats={stats} />
      </span>
    </li>
  )
}

function ObservabilityPanel() {
  const [isExpanded, setIsExpanded] = useState(true)
  const [backendNode, setBackendNode] = useState(getLatestBackendNode())
  const [backendStats, setBackendStats] = useState<NodeStats[]>([])
  const [overloadedNode, setOverloadedNode] = useState<string | null>(null)
  const [isOverloading, setIsOverloading] = useState(false)
  const [overloadError, setOverloadError] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => subscribeToBackendNode(setBackendNode), [])

  async function overloadBackend() {
    setIsOverloading(true)
    setOverloadError(false)
    try {
      const response = await fetch('/api/sobrecargar', { method: 'POST' })
      if (!response.ok) throw new Error('Failed to overload backend')
      setOverloadedNode(response.headers.get('X-Backend-Node') || 'desconocida')
    } catch {
      setOverloadError(true)
    } finally {
      setIsOverloading(false)
    }
  }

  useEffect(() => {
    let active = true
    const nodes = BACKEND_NODES

    async function refreshBackendStats() {
      const results = await Promise.all(nodes.map(async (node) => {
        try {
          return await fetchNodeStats(node)
        } catch {
          return { nodeName: node, status: 'down', health: 'unknown', cpu: null, memory: null } as NodeStats
        }
      }))
      if (active) setBackendStats(results)
    }

    void refreshBackendStats()
    const timer = window.setInterval(() => void refreshBackendStats(), 3000)
    return () => {
      active = false
      window.clearInterval(timer)
    }
  }, [backendNode])

  useEffect(() => {
    function move(event: PointerEvent) {
      if (event.buttons !== 1) return
      setPosition((current) => ({ x: current.x + event.movementX, y: current.y + event.movementY }))
    }

    function stop() {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', stop)
    }

    function start() {
      window.addEventListener('pointermove', move)
      window.addEventListener('pointerup', stop, { once: true })
    }

    const handle = document.getElementById('observability-panel-handle')
    handle?.addEventListener('pointerdown', start)
    return () => {
      handle?.removeEventListener('pointerdown', start)
      stop()
    }
  }, [])

  return (
    <aside
      className={`fixed right-4 top-4 z-[100] ${isExpanded ? 'w-[min(22rem,calc(100vw-2rem))]' : 'w-fit max-w-[calc(100vw-2rem)]'} overflow-hidden rounded-2xl border border-stone-300/80 bg-[#fffaf3]/95 text-stone-900 shadow-2xl backdrop-blur`}
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      aria-label="Panel de observabilidad"
    >
      <div className={`flex items-center ${isExpanded ? 'border-b border-stone-200' : ''}`}>
        <div id="observability-panel-handle" hidden={!isExpanded} className="min-w-0 flex-1 cursor-grab px-4 py-3 active:cursor-grabbing" style={{ touchAction: 'none' }}>
          <p className="m-0 text-sm font-semibold">En vivo</p>
        </div>
        <button
          type="button"
          className="min-h-11 rounded-xl px-4 py-3 text-xs font-semibold hover:bg-stone-200/60 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-stone-700"
          aria-label={isExpanded ? 'Minimize container information' : 'Expand container information'}
          aria-expanded={isExpanded}
          aria-controls="observability-panel-content"
          onClick={() => setIsExpanded((expanded) => !expanded)}
        >
          {isExpanded ? 'Minimize' : 'Container info'}
        </button>
      </div>
      <div id="observability-panel-content" hidden={!isExpanded} className="space-y-3 px-4 py-3 text-xs">
        <div className="flex justify-between gap-3"><span>Backend que respondió</span><strong>{backendNode || 'sin respuesta'}</strong></div>
        <ul className="m-0 max-h-52 list-none overflow-y-auto border-t border-stone-200 p-0">
          {backendStats.map((stats) => <StatusRow key={stats.nodeName} stats={stats} />)}
        </ul>
        <div className="space-y-2">
          <button
            type="button"
            className="w-full rounded-lg bg-red-700 px-3 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isOverloading}
            onClick={() => void overloadBackend()}
          >
            {isOverloading ? 'Sobrecargando…' : 'Sobrecargar'}
          </button>
          <p className={overloadError ? 'text-red-700' : 'text-stone-600'} aria-live="polite">
            {overloadError
              ? 'No se pudo sobrecargar la instancia.'
              : overloadedNode && `Instancia sobrecargada: ${overloadedNode}`}
          </p>
        </div>
      </div>
    </aside>
  )
}

export default ObservabilityPanel
