import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import {
  LayoutDashboard,
  FileText,
  Image,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';

import { useAuthStore } from '../../../auth/auth-store';

interface MenuItem {
  title: string;
  icon: React.ReactNode;
  path: string;
  badge?: string;
  children?: {
    title: string;
    path: string;
  }[];
}

export default function AdminSidebar() {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const menuItems: MenuItem[] = [
    {
      title: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      path: '/admin',
    },
    {
      title: 'Páginas',
      icon: <FileText className="w-5 h-5" />,
      path: '/admin/pages',
      badge: '3',
    },
      {
      title: 'Notícias',
      icon: <FileText className="w-5 h-5" />,
      path: '/admin/news',
    },
    {
      title: 'Mídia',
      icon: <Image className="w-5 h-5" />,
      path: '/admin/media',
    },
       {
      title: 'Associados',
      icon: <Users className="w-5 h-5" />,
      path: '/admin/associados',
    },
    {
      title: 'Usuários',
      icon: <Users className="w-5 h-5" />,
      path: '/admin/users',
    },
    {
      title: 'Configurações',
      icon: <Settings className="w-5 h-5" />,
      path: '/admin/settings',
    },
     {
      title: 'sair',
      icon: <LogOut className="w-5 h-5" />,
      path: '/logout',
    },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        {isMobileOpen ? (
          <X className="w-6 h-6 text-gray-600" />
        ) : (
          <Menu className="w-6 h-6 text-gray-600" />
        )}
      </button>

      {/* Overlay Mobile */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 z-40
          transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 border-b border-gray-200 px-4">
            <img
              src="/2023_04_10_NovaLogo_SEMSLOGAN.png"
              alt="Instituto Cooperforte"
              className="h-12 w-auto"
            />
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {menuItems.map((item) => (
              <div key={item.path}>
                {item.children ? (
                  // Menu com submenu
                  <div>
                    <button
                      onClick={() => toggleExpanded(item.title)}
                      className={`
                        w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium
                        transition-colors duration-150
                        ${
                          expandedItems.includes(item.title)
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.title}</span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          expandedItems.includes(item.title) ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {expandedItems.includes(item.title) && (
                      <div className="mt-1 ml-8 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.path}
                            to={child.path}
                            className={`
                              block px-3 py-2 rounded-lg text-sm
                              transition-colors duration-150
                              ${
                                isActive(child.path)
                                  ? 'bg-blue-50 text-blue-600 font-medium'
                                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                              }
                            `}
                            onClick={() => setIsMobileOpen(false)}
                          >
                            {child.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  // Menu simples
                  <Link
                    to={item.path}
                    className={`
                      flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium
                      transition-colors duration-150
                      ${
                        isActive(item.path)
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.title}</span>
                    </div>
                    {item.badge && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs font-semibold rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )}
              </div>
            ))}
          </nav>
 

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              © 2025 Instituto Cooperforte
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}