import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { FiGrid, FiUsers, FiAward, FiBook, FiMessageSquare, FiLogOut, FiMenu } from 'react-icons/fi'
import useAdminStore from '../store/adminAuthStore'

const menuItems = [
  { icon: FiGrid, label: 'Dashboard', path: '/' },
  { icon: FiUsers, label: 'Students', path: '/students' },
  { icon: FiBook, label: 'Schools', path: '/schools' },
  { icon: FiAward, label: 'Olympiads', path: '/olympiads' },
  { icon: FiMessageSquare, label: 'Announcements', path: '/announcements' },
]

export default function AdminLayout() {
  const { pathname } = useLocation()
  const { admin, logout } = useAdminStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#001F5E] text-white flex flex-col h-full flex-shrink-0">
        <div className="h-16 flex items-center px-6 font-bold text-xl tracking-wide border-b border-white/10">
          BAIO Admin
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                    pathname === item.path 
                      ? 'bg-white/10 text-[#FF8C00] font-semibold border-r-4 border-[#FF8C00]' 
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-[#FF8C00] flex items-center justify-center font-bold">
              {admin?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <p className="text-sm font-semibold truncate">{admin?.name}</p>
              <p className="text-xs text-white/50 capitalize">{admin?.role}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-white/5 rounded-lg transition-colors"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header (Mobile menu placeholder if needed) */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 flex-shrink-0 lg:hidden">
          <button className="text-gray-500">
            <FiMenu size={24} />
          </button>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
