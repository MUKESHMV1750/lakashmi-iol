import { Outlet, Link } from 'react-router-dom';
import { Droplets } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-green via-dark-olive to-forest-green flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-hero-pattern opacity-20" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center gap-2">
            <div className="w-16 h-16 bg-warm-brown rounded-2xl flex items-center justify-center shadow-xl">
              <Droplets size={32} className="text-white" />
            </div>
            <h1 className="text-white font-display font-bold text-2xl">Oil Business</h1>
            <p className="text-green-300 text-sm">Pure • Natural • Organic</p>
          </Link>
        </div>

        {/* Auth Card */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
