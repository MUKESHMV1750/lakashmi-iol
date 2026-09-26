import { useState, useEffect } from 'react';
import { ShoppingBag, Search, Eye, RefreshCw, CheckCircle, Truck, Package, Clock, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const statusColors = {
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  confirmed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  processing: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  shipped: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  delivered: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/orders?status=${statusFilter}`);
      setOrders(res.data.orders || []);
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
      setOrders(orders.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o)));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const filteredOrders = orders.filter((o) => {
    const term = search.toLowerCase();
    return o.orderNumber?.toLowerCase().includes(term) ||
      o.user?.name?.toLowerCase().includes(term) ||
      o.user?.email?.toLowerCase().includes(term);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-forest-green dark:text-white">
            Order Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">Review customer orders, update tracking, and manage fulfillment.</p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 shadow-sm"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh Orders
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search size={18} className="absolute left-3.5 top-3 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order #, customer name..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {['', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl capitalize transition-all whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-dark-olive text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              {st || 'All Orders'}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading order records...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-gray-400 space-y-2">
            <ShoppingBag size={40} className="mx-auto text-gray-300" />
            <p className="text-base font-semibold">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 text-gray-500 font-semibold">
                <tr>
                  <th className="py-3.5 px-6">Order ID</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Total Amount</th>
                  <th className="py-3.5 px-4">Current Status</th>
                  <th className="py-3.5 px-6 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredOrders.map((o) => (
                  <tr key={o._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                    <td className="py-4 px-6 font-bold text-gray-900 dark:text-white">
                      #{o.orderNumber || o._id.slice(-6)}
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-semibold text-gray-800 dark:text-gray-200">{o.user?.name || 'Guest'}</p>
                      <p className="text-xs text-gray-400">{o.user?.email || 'N/A'}</p>
                    </td>
                    <td className="py-4 px-4 text-gray-500 dark:text-gray-400 text-xs">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 font-bold text-forest-green dark:text-emerald-400">
                      ₹{(o.totalAmount || 0).toLocaleString()}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${statusColors[o.status] || 'bg-gray-100'}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <select
                        value={o.status}
                        onChange={(e) => handleStatusChange(o._id, e.target.value)}
                        className="px-3 py-1.5 text-xs font-medium border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
