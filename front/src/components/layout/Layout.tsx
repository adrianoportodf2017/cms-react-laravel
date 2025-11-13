// src/components/public/Layout.tsx

import Header from './Header'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="w-full">
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 bg-gray-50">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}