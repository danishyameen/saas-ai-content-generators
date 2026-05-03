import { useState } from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  Search,
  Megaphone,
  Lightbulb,
  Share2,
  BarChart3,
  History,
  CreditCard,
  Users,
  Settings,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Crown,
} from 'lucide-react';
import useAuthStore from '../store/authStore';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Package, label: 'Product Generator', path: '/dashboard/product' },
  { icon: Search, label: 'SEO Generator', path: '/dashboard/seo' },
  { icon: Megaphone, label: 'Ads Generator', path: '/dashboard/ads' },
  { icon: Lightbulb, label: 'Business Ideas', path: '/dashboard/business-ideas' },
  { icon: Share2, label: 'Social Content', path: '/dashboard/social' },
  { icon: BarChart3, label: 'Competitor Analysis', path: '/dashboard/competitor' },
  { icon: Megaphone, label: 'Marketing Campaign', path: '/dashboard/campaign' },
  { icon: History, label: 'History', path: '/dashboard/history' },
  { icon: CreditCard, label: 'Billing', path: '/dashboard/billing' },
  { icon: Users, label: 'Affiliate Program', path: '/dashboard/affiliate' },
  { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
];

const adminNavItems = [
  { icon: LayoutDashboard, label: 'Admin Dashboard', path: '/admin' },
  { icon: Users, label: 'Users', path: '/admin/users' },
  { icon: CreditCard, label: 'Payments', path: '/admin/payments' },
  { icon: BarChart3, label: 'AI Requests', path: '/admin/ai-requests' },
  { icon: Users, label: 'Affiliates', path: '/admin/affiliates' },
  { icon: History, label: 'Activity Logs', path: '/admin/logs' },
];

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuthStore();

  if (!user) return <Navigate to="/login" />;

  const isAdmin = location.pathname.startsWith('/admin');
  const items = isAdmin ? adminNavItems : navItems;

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-dark-900 border-r border-dark-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-dark-700">
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
              className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center"
            >
              <span className="text-white font-bold text-sm">AI</span>
            </motion.div>
            <span className="text-white font-bold group-hover:text-primary-400 transition-colors">Genifai</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-dark-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100%-140px)] custom-scrollbar">
          {items.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={isActive ? 'sidebar-link-active' : 'sidebar-link'}
                >
                  <Icon size={20} />
                  <span className="text-sm">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute left-0 w-1 h-6 bg-primary-500 rounded-r-full"
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* User section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-dark-700 bg-dark-900/50 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center border-2 border-primary-500/20 shadow-lg"
            >
              <span className="text-white font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </motion.div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-dark-400 truncate">{user?.email}</p>
            </div>
            <div className="flex items-center gap-1">
              {user?.plan === 'pro' && (
                <span className="px-2 py-0.5 bg-primary-600/20 text-primary-400 text-[10px] uppercase font-bold rounded-full border border-primary-500/20">
                  Pro
                </span>
              )}
              {user?.plan === 'enterprise' && (
                <span className="px-2 py-0.5 bg-purple-600/20 text-purple-400 text-[10px] uppercase font-bold rounded-full border border-purple-500/20">
                  Ent
                </span>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-dark-900/80 backdrop-blur-md border-b border-dark-700">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-dark-400 hover:text-white transition-colors"
            >
              <Menu size={24} />
            </button>

            <div className="flex items-center gap-4 ml-auto">
              {user?.plan === 'free' && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to="/dashboard/billing" className="btn-primary text-sm shadow-lg shadow-primary-500/20">
                    <Crown size={16} className="inline mr-1" />
                    Upgrade
                  </Link>
                </motion.div>
              )}

              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 text-dark-300 hover:text-white transition-all p-1 rounded-full hover:bg-dark-800"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-sm">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: userMenuOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={16} />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-dark-800 border border-dark-700 rounded-xl shadow-2xl py-1 overflow-hidden"
                    >
                      <Link
                        to="/dashboard/settings"
                        className="block px-4 py-2 text-sm text-dark-300 hover:bg-dark-700 hover:text-white transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Settings
                      </Link>
                      <Link
                        to="/dashboard/billing"
                        className="block px-4 py-2 text-sm text-dark-300 hover:bg-dark-700 hover:text-white transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Billing
                      </Link>
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-sm text-primary-400 hover:bg-dark-700 hover:text-primary-300 transition-colors font-medium"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Admin Panel
                        </Link>
                      )}
                      <div className="h-px bg-dark-700 my-1 mx-2" />
                      <button
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-400/10 hover:text-red-300 transition-colors"
                      >
                        <LogOut size={16} className="inline mr-2" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6 min-h-[calc(100vh-65px)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
