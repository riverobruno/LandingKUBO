import { Outlet } from 'react-router-dom'

function ClienteLayout() {
  return (
    <div className="min-h-svh bg-[var(--color-surface)] text-[var(--color-ink)]">
      <Outlet />
    </div>
  )
}

export default ClienteLayout
