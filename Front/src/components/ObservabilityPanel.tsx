import { useEffect, useState } from 'react'
import {
  fetchNodeStats,
  getFrontendNodeName,
  getLatestBackendNode,
  subscribeToBackendNode,
  type NodeStats,
} from '@/observability'

const frontendNodes = ['frontend-1', 'frontend-2', 'frontend-3']
const backendNodes = ['backend-1', 'backend-2', 'backend-3']

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
  const frontendNode = getFrontendNodeName()
  const [backendNode, setBackendNode] = useState(getLatestBackendNode())
  const [frontendStats, setFrontendStats] = useState<NodeStats | null>(null)
  const [backendStats, setBackendStats] = useState<NodeStats | null>(null)
  const [otherStats, setOtherStats] = useState<NodeStats[]>([])
  const [showOthers, setShowOthers] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => subscribeToBackendNode(setBackendNode), [])

  useEffect(() => {
    let active = true

    async function refreshCurrent() {
      const [frontend, backend] = await Promise.allSettled([
        fetchNodeStats(frontendNode),
        backendNode ? fetchNodeStats(backendNode) : Promise.resolve(null),
      ])
      if (!active) return
      setFrontendStats(frontend.status === 'fulfilled' ? frontend.value : null)
      setBackendStats(backend.status === 'fulfilled' ? backend.value : null)
    }

    void refreshCurrent()
    const timer = window.setInterval(() => void refreshCurrent(), 5000)
    return () => {
      active = false
      window.clearInterval(timer)
    }
  }, [backendNode, frontendNode])

  useEffect(() => {
    if (!showOthers) return
    let active = true
    const nodes = [...frontendNodes, ...backendNodes].filter((node) => node !== frontendNode && node !== backendNode)

    async function refreshOthers() {
      const results = await Promise.all(nodes.map(async (node) => {
        try {
          return await fetchNodeStats(node)
        } catch {
          return { nodeName: node, status: 'down', health: 'unknown', cpu: null, memory: null } as NodeStats
        }
      }))
      if (active) setOtherStats(results)
    }

    void refreshOthers()
    const timer = window.setInterval(() => void refreshOthers(), 5000)
    return () => {
      active = false
      window.clearInterval(timer)
    }
  }, [backendNode, frontendNode, showOthers])

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
        <p className="m-0 text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500">Demo de resiliencia</p>
        <p className="m-0 mt-1 text-sm font-semibold">Observabilidad en vivo</p>
      </div>
      <div className="space-y-3 px-4 py-3 text-xs">
        <div className="space-y-1">
          <div className="flex justify-between gap-3"><span>Backend que respondió</span><strong>{backendNode || 'sin respuesta'}</strong></div>
          <div className="flex justify-between gap-3 text-stone-600"><span>CPU · RAM</span><Metric stats={backendStats} /></div>
          <div className="flex justify-between gap-3"><span>Frontend actual</span><strong>{frontendNode}</strong></div>
          <div className="flex justify-between gap-3 text-stone-600"><span>CPU · RAM</span><Metric stats={frontendStats} /></div>
        </div>
        <button
          type="button"
          className="w-full border-t border-stone-200 pt-3 text-left text-xs font-semibold lowercase text-stone-700 hover:text-stone-950"
          onClick={() => setShowOthers((current) => !current)}
          aria-expanded={showOthers}
        >
          ver estado de los demas contenedores
        </button>
        {showOthers && (
          <ul className="m-0 max-h-52 list-none overflow-y-auto p-0">
            {otherStats.map((stats) => <StatusRow key={stats.nodeName} stats={stats} />)}
          </ul>
        )}
      </div>
    </aside>
  )
}

export default ObservabilityPanel
