import ClienteLayout from '@/layout/ClienteLayout'
import Demo from '@/pages/public/Demo'
import Home from '@/pages/public/Home'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ClienteLayout />}>
          <Route index element={<Home />} />
          <Route path="demo" element={<Demo />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
