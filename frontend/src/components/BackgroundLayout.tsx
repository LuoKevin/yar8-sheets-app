import { Outlet } from 'react-router-dom'
import GradientBackground from './GradientBackground'

const Layout = () => {
  return (
    <div className="min-h-screen w-screen overflow-x-visible relative">
      <GradientBackground />
      <div className="relative z-10 p-4">
        <Outlet />
      </div>
    </div>
  )
}

export default Layout