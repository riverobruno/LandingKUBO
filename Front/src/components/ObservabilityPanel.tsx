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
  const [backendNode, setBackendNode] = useState(getLatestBackendNode())
  const [backendStats, setBackendStats] = useState<NodeStats[]>([])
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => subscribeToBackendNode(setBackendNode), [])

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
      className="fixed right-4 top-4 z-[100] w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-stone-300/80 bg-[#fffaf3]/95 text-stone-900 shadow-2xl backdrop-blur"
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      aria-label="Panel de observabilidad"
    >
      <div id="observability-panel-handle" className="cursor-grab border-b border-stone-200 px-4 py-3 active:cursor-grabbing" style={{ touchAction: 'none' }}>
        <p className="m-0 text-sm font-semibold">En vivo</p>
      </div>
      <div className="space-y-3 px-4 py-3 text-xs">
        <div className="space-y-1">
          <div className="flex justify-between gap-3"><span>Backend que respondió</span><strong>{backendNode || 'sin respuesta'}</strong></div>
        </div>
        <ul className="m-0 max-h-52 list-none overflow-y-auto border-t border-stone-200 p-0">
          {backendStats.map((stats) => <StatusRow key={stats.nodeName} stats={stats} />)}
        </ul>
      </div>
    </aside>
  )
}

export default ObservabilityPanel
