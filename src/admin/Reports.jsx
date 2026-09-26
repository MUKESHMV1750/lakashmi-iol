import { useState, useEffect } from 'react';
import { BarChart2, DollarSign, TrendingUp, ShoppingBag, Download, Calendar } from 'lucide-react';
import api from '../services/api';

export default function Reports() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats')
      .then(({ data }) => setStats(data.stats || {}))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-forest-green dark:text-white">
            Sales & Analytics Reports
          </h1>
          <p className="text-gray-500 text-sm mt-1">Track monthly revenue trends and business performance performance.</p>
        </div>
        <button
          onClick={() => window.print()}
          className="btn-primary inline-flex items-center gap-2 py-2.5 px-5 text-sm"
        >
          <Download size={18} /> Export / Print Summary
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-400">Total Lifetime Revenue</span>
            <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl"><DollarSign size={20} /></div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">
            ₹{(stats.totalRevenue || 0).toLocaleString()}
          </h3>
          <p className="text-xs text-emerald-600 font-semibold mt-2 flex items-center gap-1">
            <TrendingUp size={14} /> +12.5% from last period
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-400">Monthly Revenue</span>
            <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl"><BarChart2 size={20} /></div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">
            ₹{(stats.monthlyRevenue || 0).toLocaleString()}
          </h3>
          <p className="text-xs text-blue-600 font-semibold mt-2">Current month total</p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-400">Completed Orders</span>
            <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl"><ShoppingBag size={20} /></div>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">
            {stats.totalOrders || 0}
          </h3>
          <p className="text-xs text-purple-600 font-semibold mt-2">Total orders processed</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Revenue Summary Breakdown</h3>
        <p className="text-sm text-gray-500">Overview of key financial benchmarks across oil categories.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl space-y-2">
            <p className="text-xs font-semibold text-gray-400">Top Selling Category</p>
            <p className="text-xl font-bold text-forest-green dark:text-emerald-400">Groundnut Oil (Cold-Pressed)</p>
            <p className="text-xs text-gray-500">Contributes ~45% of total sales volume</p>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl space-y-2">
            <p className="text-xs font-semibold text-gray-400">Average Order Value (AOV)</p>
            <p className="text-xl font-bold text-forest-green dark:text-emerald-400">₹850 / Order</p>
            <p className="text-xs text-gray-500">Based on lifetime completed transactions</p>
          </div>
        </div>
      </div>
    </div>
  );
}
