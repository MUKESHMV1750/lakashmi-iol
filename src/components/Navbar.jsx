import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  ShoppingCart, Heart, Search, Sun, Moon, Menu, X,
  User, LogOut, Package, ChevronDown, Droplets, LayoutDashboard
} from 'lucide-react';
import { toggleTheme } from '../redux/slices/themeSlice';
import { logout } from '../redux/slices/authSlice';
import { selectCartCount } from '../redux/slices/cartSlice';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/products', label: 'Products' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useSelector((state) => state.theme);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const cartCount = useSelector(selectCartCount);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setIsOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsProfileOpen(false);
    setIsOpen(false);
    try {
      await dispatch(logout()).unwrap();
    } catch (err) {
      // Fallback cleanup
    }
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] transition-all duration-300">
      {/* Main Luxury Navigation Bar */}
      <div
        className={`transition-all duration-300 ${
          isScrolled
            ? 'bg-forest-green/95 dark:bg-gray-950/95 backdrop-blur-xl shadow-2xl py-2.5 border-b border-amber-500/20'
            : 'bg-forest-green/90 dark:bg-gray-950/90 backdrop-blur-md py-3 sm:py-3.5 border-b border-green-800/30'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-3 sm:px-4 flex items-center justify-between text-white">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-warm-brown to-terracotta rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-all duration-300 border border-amber-400/30">
              <Droplets size={18} className="text-amber-200 fill-amber-200/20 animate-pulse sm:w-5 sm:h-5" />
              <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-amber-400 rounded-full border-2 border-forest-green" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-base sm:text-xl md:text-2xl tracking-tight text-white flex items-center gap-1">
                Oil<span className="text-amber-400 font-extrabold">Business</span>
              </span>
              <span className="text-[8px] sm:text-[10px] text-amber-200/80 uppercase tracking-widest font-semibold -mt-1">
                Pure Cold-Pressed
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <ul className="hidden md:flex items-center gap-1 bg-white/5 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-inner">
            {navLinks.map(({ to, label }) => {
              const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
              return (
                <li key={to}>
                  <Link
                    to={to}
                    className={`relative px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-amber-400 text-forest-green font-bold shadow-md'
                        : 'text-white/90 hover:text-amber-300 hover:bg-white/10'
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Expanded Search Bar (Desktop) */}
            <div className="hidden md:block">
              {isSearchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center gap-1.5 animate-slide-down">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search oils..."
                      autoFocus
                      className="w-48 sm:w-64 px-4 py-1.5 pr-8 text-sm border border-amber-400/50 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-400 bg-forest-green/90 text-white placeholder-amber-200/60 shadow-lg"
                    />
                    <Search size={14} className="absolute right-3 top-2.5 text-amber-300 pointer-events-none" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="p-1 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                  >
                    <X size={16} />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 text-white/90 hover:text-amber-300 hover:bg-white/10 rounded-full transition-all duration-200"
                  title="Search oils"
                >
                  <Search size={20} />
                </button>
              )}
            </div>

            {/* Theme Toggle (Desktop) */}
            <button
              onClick={() => dispatch(toggleTheme())}
              className="hidden md:flex p-2 text-white/90 hover:text-amber-300 hover:bg-white/10 rounded-full transition-all duration-200"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} />}
            </button>

            {/* Wishlist Link (Desktop) */}
            <Link
              to="/wishlist"
              className="hidden md:flex p-2 text-white/90 hover:text-amber-300 hover:bg-white/10 rounded-full transition-all duration-200 relative"
              title="Wishlist"
            >
              <Heart size={20} />
            </Link>

            {/* Cart Link with Badge (Desktop & Mobile) */}
            <Link
              to="/cart"
              className="relative flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 h-8 sm:h-9 bg-warm-brown hover:bg-terracotta text-white rounded-full transition-all duration-200 shadow-lg font-bold text-xs border border-amber-400/30"
              title="View Cart"
            >
              <ShoppingCart size={16} className="sm:w-4 sm:h-4" />
              <span className="hidden sm:inline font-bold">Cart</span>
              {cartCount > 0 && (
                <span className="bg-amber-400 text-forest-green text-[10px] sm:text-xs font-black w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-sm">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* Profile / Auth Menu (Desktop) */}
            {isAuthenticated ? (
              <div className="relative hidden md:block" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-full transition-all duration-200"
                >
                  <div className="w-7 h-7 bg-amber-400 text-forest-green rounded-full flex items-center justify-center font-bold text-xs shadow-sm">
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-xs font-semibold max-w-24 truncate">{user?.name?.split(' ')[0]}</span>
                  <ChevronDown size={14} className={`transition-transform duration-200 text-amber-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-amber-500/20 py-2 animate-slide-down text-gray-800 dark:text-gray-100 z-[110]">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 rounded-t-2xl">
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Signed in as</p>
                      <p className="text-sm font-bold text-forest-green dark:text-emerald-400 truncate">{user?.name}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-[10px] font-bold rounded-full uppercase">
                        {user?.role || 'Customer'}
                      </span>
                    </div>

                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-emerald-50 dark:hover:bg-gray-800 text-forest-green dark:text-emerald-400 font-semibold transition-colors"
                      >
                        <LayoutDashboard size={16} /> Admin Panel
                      </Link>
                    )}

                    <Link
                      to="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 transition-colors"
                    >
                      <User size={16} className="text-amber-600" /> My Profile
                    </Link>

                    <Link
                      to="/orders"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 transition-colors"
                    >
                      <Package size={16} className="text-emerald-600" /> My Orders
                    </Link>

                    <hr className="my-1 border-gray-100 dark:border-gray-800" />

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 w-full text-left font-medium transition-colors"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:flex items-center justify-center px-4 py-1.5 h-9 bg-amber-400 text-forest-green text-xs font-bold rounded-full hover:bg-amber-300 transition-all duration-200 shadow-md border border-amber-300/40"
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Hamburger Button (ALWAYS VISIBLE ON MOBILE ON THE FAR RIGHT) */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-amber-400 bg-white/10 hover:bg-white/20 active:scale-95 rounded-full transition-all duration-200 ml-1 border border-amber-400/30"
              aria-label="Toggle navigation"
            >
              {isOpen ? <X size={20} className="text-amber-400" /> : <Menu size={20} className="text-amber-400" />}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div className="md:hidden bg-forest-green/98 dark:bg-gray-950/98 backdrop-blur-2xl border-t border-amber-500/20 shadow-2xl animate-slide-down">
            <div className="px-4 pt-4 pb-6 space-y-4">
              {/* User Header on Mobile */}
              {isAuthenticated ? (
                <div className="p-3 bg-white/10 rounded-2xl flex items-center justify-between border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-400 text-forest-green rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                      {user?.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white leading-tight">{user?.name}</p>
                      <p className="text-[10px] text-amber-200 font-semibold uppercase">{user?.role || 'Customer'}</p>
                    </div>
                  </div>
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className="px-3 py-1 bg-amber-400 text-forest-green text-xs font-bold rounded-lg shadow-sm"
                    >
                      Admin
                    </Link>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full py-2.5 text-center bg-amber-400 text-forest-green font-bold text-sm rounded-xl shadow-md"
                >
                  Login / Register
                </Link>
              )}

              {/* Mobile Search Form */}
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search groundnut, sesame, coconut oil..."
                  className="w-full px-4 py-2.5 text-xs border border-amber-400/40 rounded-xl bg-white/10 text-white placeholder-amber-200/60 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <button type="submit" className="absolute right-3 top-3 text-amber-300">
                  <Search size={16} />
                </button>
              </form>

              {/* Main Nav Links */}
              <ul className="space-y-1">
                {navLinks.map(({ to, label }) => {
                  const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
                  return (
                    <li key={to}>
                      <Link
                        to={to}
                        onClick={() => setIsOpen(false)}
                        className={`block px-4 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                          isActive
                            ? 'bg-amber-400 text-forest-green font-bold'
                            : 'text-white hover:bg-white/10 hover:text-amber-300'
                        }`}
                      >
                        {label}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {/* Mobile Quick Utility Actions (Wishlist & Theme Toggle) */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                <Link
                  to="/wishlist"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 p-2.5 bg-white/10 text-white rounded-xl text-xs font-semibold hover:bg-white/20 transition-all"
                >
                  <Heart size={16} className="text-amber-400" /> Wishlist
                </Link>
                <button
                  onClick={() => dispatch(toggleTheme())}
                  className="flex items-center justify-center gap-2 p-2.5 bg-white/10 text-white rounded-xl text-xs font-semibold hover:bg-white/20 transition-all"
                >
                  {theme === 'dark' ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} />}
                  <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
              </div>

              {/* User Account Quick Links on Mobile */}
              {isAuthenticated && (
                <div className="pt-2 border-t border-white/10 space-y-1">
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-white/90 hover:bg-white/10 rounded-xl font-medium"
                  >
                    <User size={16} className="text-amber-400" /> My Profile
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-white/90 hover:bg-white/10 rounded-xl font-medium"
                  >
                    <Package size={16} className="text-amber-400" /> My Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-red-300 hover:bg-red-500/20 w-full text-left rounded-xl font-medium"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
