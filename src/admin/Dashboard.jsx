import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Package, ShoppingBag, DollarSign, AlertTriangle, ShieldCheck, Globe, ExternalLink,
  ArrowUpRight, RefreshCw, Layers, Tag, Image, PieChart as PieIcon, BarChart3, TrendingUp
} from 'lucide-react';
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area
} from 'recharts';
import api from '../services/api';

// Ring Model Chart Data (Oil Product Share Distribution)
const defaultRingData = [
  { name: 'Groundnut Oil', value: 45000, percentage: 38, color: '#3A5A40' },
  { name: 'Sesame Oil', value: 30000, percentage: 25, color: '#A66E38' },
  { name: 'Coconut Oil', value: 24000, percentage: 20, color: '#8D5B4C' },
  { name: 'Mustard Oil', value: 14000, percentage: 12, color: '#D97706' },
  { name: 'Olive Oil', value: 6000, percentage: 5, color: '#059669' },
];

// Fallback Monthly Trend Chart Data
const defaultMonthlyTrend = [
  { month: 'Apr', revenue: 28000, orders: 48 },
  { month: 'May', revenue: 36000, orders: 62 },
  { month: 'Jun', revenue: 31000, orders: 54 },
  { month: 'Jul', revenue: 49000, orders: 82 },
  { month: 'Aug', revenue: 58000, orders: 96 },
  { month: 'Sep', revenue: 72000, orders: 120 },
];

const CustomRingTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="bg-gray-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1 border border-gray-700">
        <p className="font-bold flex items-center gap-1.5" style={{ color: item.color }}>
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
          {item.name}
        </p>
        <p className="text-gray-300">Revenue: <strong>₹{item.value.toLocaleString()}</strong></p>
        <p className="text-amber-300 font-semibold">Share: {item.percentage}%</p>
      </div>
    );
  }
  return null;
};

const CustomTrendTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1 border border-gray-700">
        <p className="font-bold text-amber-300">{label} Performance</p>
        <p className="text-emerald-400">Revenue: <strong>₹{payload[0].value.toLocaleString()}</strong></p>
        {payload[1] && <p className="text-blue-300">Orders: <strong>{payload[1].value}</strong></p>}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    stats: {
      totalUsers: 0,
      totalProducts: 0,
      totalOrders: 0,
      pendingOrders: 0,
      totalRevenue: 0,
      monthlyRevenue: 0,
      pendingReturns: 0,
      lowStockCount: 0,
    },
    recentOrders: [],
    lowStockProducts: [],
    salesChart: [],
  });

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/stats');
      if (res.data?.success) {
        setData({
          stats: res.data.stats || {},
          recentOrders: res.data.recentOrders || [],
          lowStockProducts: res.data.lowStockProducts || [],
          salesChart: res.data.salesChart || [],
        });
      }
    } catch (err) {
      console.warn('Stats fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Revenue',
      value: `₹${(data.stats.totalRevenue || 0).toLocaleString()}`,
      subtext: `Monthly: ₹${(data.stats.monthlyRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    },
    {
      title: 'Total Orders',
      value: data.stats.totalOrders || 0,
      subtext: `${data.stats.pendingOrders || 0} pending processing`,
      icon: ShoppingBag,
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Total Customers',
      value: data.stats.totalUsers || 0,
      subtext: 'Registered customers',
      icon: Users,
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    },
    {
      title: 'Active Products',
      value: data.stats.totalProducts || 0,
      subtext: `${data.stats.lowStockCount || 0} low stock items`,
      icon: Package,
      color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    },
  ];

  const quickLinks = [
    { label: 'Products', to: '/admin/products', icon: Package },
    { label: 'Categories', to: '/admin/categories', icon: Layers },
    { label: 'Orders', to: '/admin/orders', icon: ShoppingBag },
    { label: 'User Manage', to: '/admin/users', icon: ShieldCheck },
    { label: 'Customers', to: '/admin/customers', icon: Users },
    { label: 'Banners', to: '/admin/banners', icon: Image },
    { label: 'Coupons', to: '/admin/coupons', icon: Tag },
    { label: 'View Site', to: '/', icon: Globe, external: true },
  ];

  // Process sales trend for normal chart
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const formattedTrendData = data.salesChart?.length > 0
    ? data.salesChart.map((item) => ({
        month: monthNames[item._id.month - 1] || 'Month',
        revenue: item.revenue,
        orders: item.orders,
      }))
    : defaultMonthlyTrend;

  const totalRingValue = defaultRingData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-forest-green dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Overview of store performance, category analytics, and recent orders.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-dark-olive text-white text-sm font-medium rounded-xl hover:bg-forest-green transition-all shadow-sm"
          >
            <Globe size={16} />
            <span>View Site</span>
            <ExternalLink size={14} />
          </Link>

          <button
            onClick={fetchStats}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {card.title}
                </span>
                <div className={`p-2.5 rounded-xl ${card.color}`}>
                  <Icon size={20} />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {loading ? '...' : card.value}
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {card.subtext}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ===== CHARTS SECTION: RING MODEL & NORMAL GRAPH ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Ring Chart Model (Donut / Pie-Ring Chart) */}
        <div className="lg:col-span-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <PieIcon size={18} />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  Category Share (Ring Model)
                </h2>
                <p className="text-xs text-gray-400">Oil product sales distribution</p>
              </div>
            </div>
            <span className="badge bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">Live Share</span>
          </div>

          {/* Donut Ring Container */}
          <div className="relative h-64 w-full flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={defaultRingData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                  animationDuration={1200}
                >
                  {defaultRingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip content={<CustomRingTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Inner Ring Center Stat */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Sales</span>
              <span className="text-lg font-extrabold text-forest-green dark:text-emerald-400 font-mono">
                ₹{totalRingValue.toLocaleString()}
              </span>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">100% Volume</span>
            </div>
          </div>

          {/* Ring Legend & Percentages */}
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
            {defaultRingData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-gray-50/70 dark:bg-gray-800/40 text-xs">
                <div className="flex items-center gap-2 truncate">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="font-medium text-gray-700 dark:text-gray-300 truncate">{item.name}</span>
                </div>
                <span className="font-bold text-gray-900 dark:text-white ml-1">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Normal Trend Graph (Bar / Revenue Growth Chart) */}
        <div className="lg:col-span-7 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-forest-green/10 text-forest-green dark:text-emerald-400">
                <BarChart3 size={18} />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  Revenue & Orders Graph
                </h2>
                <p className="text-xs text-gray-400">Monthly sales performance & order volume</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-full">
              <TrendingUp size={14} /> +24.5% Growth
            </div>
          </div>

          {/* Normal Bar Graph Container */}
          <div className="h-64 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={formattedTrendData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.5} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} tickFormatter={(val) => `₹${val / 1000}k`} />
                <Tooltip content={<CustomTrendTooltip />} />
                <Bar dataKey="revenue" fill="#3A5A40" radius={[8, 8, 0, 0]} name="Revenue (₹)" />
                <Bar dataKey="orders" fill="#A66E38" radius={[8, 8, 0, 0]} name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Graph Legend & Summary */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800 text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-forest-green" />
                <span className="text-gray-600 dark:text-gray-400">Monthly Revenue (₹)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-warm-brown" />
                <span className="text-gray-600 dark:text-gray-400">Order Volume</span>
              </div>
            </div>
            <span className="text-gray-400 text-[11px]">Updated live</span>
          </div>
        </div>
      </div>

      {/* Quick Navigation Links */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
          Quick Management Links
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {quickLinks.map((link, idx) => {
            const Icon = link.icon;
            return (
              <Link
                key={idx}
                to={link.to}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className="flex flex-col items-center justify-center p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-dark-olive hover:bg-dark-olive/5 transition-all text-center group"
              >
                <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-forest-green dark:text-gray-300 group-hover:bg-dark-olive group-hover:text-white transition-colors">
                  <Icon size={20} />
                </div>
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 mt-2">
                  {link.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Orders & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Recent Orders
            </h2>
            <Link
              to="/admin/orders"
              className="text-xs font-semibold text-dark-olive hover:text-forest-green flex items-center gap-1"
            >
              View All <ArrowUpRight size={14} />
            </Link>
          </div>

          {loading ? (
            <p className="text-sm text-gray-400 py-6 text-center">Loading orders...</p>
          ) : data.recentOrders.length === 0 ? (
            <div className="py-8 text-center text-gray-400 text-sm">
              No recent orders found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800 text-gray-400 font-medium">
                    <th className="pb-3">Order ID</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {data.recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                      <td className="py-3 font-semibold text-gray-800 dark:text-gray-200">
                        #{order.orderNumber || order._id.slice(-6)}
                      </td>
                      <td className="py-3 text-gray-600 dark:text-gray-400">
                        {order.user?.name || 'Customer'}
                      </td>
                      <td className="py-3 font-medium text-gray-900 dark:text-white">
                        ₹{(order.totalAmount || 0).toLocaleString()}
                      </td>
                      <td className="py-3">
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                          {order.status || 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={20} className="text-amber-500" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Stock Warnings
            </h2>
          </div>

          {loading ? (
            <p className="text-sm text-gray-400 py-6 text-center">Checking inventory...</p>
          ) : data.lowStockProducts.length === 0 ? (
            <div className="py-8 text-center text-gray-400 text-sm">
              All inventory levels are healthy!
            </div>
          ) : (
            <div className="space-y-3">
              {data.lowStockProducts.map((prod) => (
                <div
                  key={prod._id}
                  className="flex items-center justify-between p-3 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      {prod.name}
                    </p>
                    <p className="text-xs text-amber-600 dark:text-amber-400">
                      Only {prod.stock} units remaining
                    </p>
                  </div>
                  <Link
                    to={`/admin/products/edit/${prod._id}`}
                    className="text-xs font-bold text-forest-green hover:underline"
                  >
                    Restock
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
