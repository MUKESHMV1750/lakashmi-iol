import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  LayoutDashboard, Package, Tags, ShoppingBag, Users, ShieldCheck,
  RotateCcw, Ticket, Image, Star, BarChart2, Settings,
  LogOut, ChevronRight, Droplets, Globe, ExternalLink
} from 'lucide-react';
import { logout } from '../redux/slices/authSlice';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/admin/products', icon: Package, label: 'Products' },
  { to: '/admin/categories', icon: Tags, label: 'Categories' },
  { to: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
  { to: '/admin/customers', icon: Users, label: 'Customers' },
  { to: '/admin/users', icon: ShieldCheck, label: 'User & Admin Manage' },
  { to: '/admin/returns', icon: RotateCcw, label: 'Returns' },
  { to: '/admin/coupons', icon: Ticket, label: 'Coupons' },
  { to: '/admin/banners', icon: Image, label: 'Banners' },
  { to: '/admin/reviews', icon: Star, label: 'Reviews' },
  { to: '/admin/reports', icon: BarChart2, label: 'Reports' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    if (e) e.preventDefault();
    try {
      await dispatch(logout()).unwrap();
    } catch {
      // Ignore
    }
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-bg-secondary dark:bg-gray-950">
      {/* Sidebar */}
      <aside className="w-64 bg-forest-green text-white flex flex-col shadow-2xl fixed h-full z-50">
        <div className="p-6 border-b border-green-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-warm-brown rounded-xl flex items-center justify-center">
              <Droplets size={22} className="text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg">Oil Business</h1>
              <p className="text-green-300 text-xs">Admin Panel</p>
            </div>
          </div>

          {/* View Live Site Quick Action */}
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-green-800/80 hover:bg-warm-brown text-white text-xs font-bold transition-all shadow-sm group"
          >
            <div className="flex items-center gap-2">
              <Globe size={15} className="text-amber-300 group-hover:text-white" />
              <span>View Storefront</span>
            </div>
            <ExternalLink size={13} className="opacity-70 group-hover:opacity-100" />
          </Link>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-dark-olive text-white border-r-4 border-warm-brown'
                    : 'text-green-200 hover:bg-green-700/40 hover:text-white'
                }`
              }
            >
              <Icon size={18} className="flex-shrink-0" />
              <span>{label}</span>
              <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-green-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-300 hover:text-red-200 hover:bg-red-900/20 rounded-xl transition-all duration-200"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
