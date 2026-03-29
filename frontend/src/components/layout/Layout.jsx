import { Outlet } from 'react-router-dom'
import Header from './Header'

function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#080c14]">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
