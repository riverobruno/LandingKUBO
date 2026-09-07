import ClienteLayout from '@/layout/ClienteLayout'
import Home from '@/pages/public/Home'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ClienteLayout />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
