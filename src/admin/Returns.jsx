import { useState, useEffect } from 'react';
import { RotateCcw, Check, X, Clock, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function Returns() {
  const [returnsList, setReturnsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReturns = async () => {
    setLoading(true);
    try {
      const res = await api.get('/returns/admin/all');
      setReturnsList(res.data.returns || []);
    } catch (err) {
      toast.error('Failed to load return requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/returns/${id}/status`, { status });
      toast.success(`Return status set to ${status}`);
      setReturnsList(returnsList.map((r) => (r._id === id ? { ...r, status } : r)));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update return');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-forest-green dark:text-white">
            Return Requests
          </h1>
          <p className="text-gray-500 text-sm mt-1">Review product return requests and process refunds.</p>
        </div>
        <button
          onClick={fetchReturns}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 shadow-sm"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading returns...</div>
        ) : returnsList.length === 0 ? (
          <div className="p-12 text-center text-gray-400 space-y-2">
            <RotateCcw size={40} className="mx-auto text-gray-300" />
            <p className="text-base font-semibold">No return requests active</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 text-gray-500 font-semibold">
                <tr>
                  <th className="py-3.5 px-6">Return ID</th>
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-4">Reason</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {returnsList.map((r) => (
                  <tr key={r._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                    <td className="py-4 px-6 font-semibold text-gray-900 dark:text-white">
                      #{r._id.slice(-6)}
                    </td>
                    <td className="py-4 px-4 font-medium text-gray-700 dark:text-gray-300">
                      #{r.order?.orderNumber || r.order?._id?.slice(-6) || 'Order'}
                    </td>
                    <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                      {r.reason || 'No reason specified'}
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-700 capitalize">
                        {r.status || 'requested'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleUpdateStatus(r._id, 'approved')}
                        className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-medium hover:bg-emerald-700 inline-flex items-center gap-1"
                      >
                        <Check size={14} /> Approve
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(r._id, 'rejected')}
                        className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 inline-flex items-center gap-1"
                      >
                        <X size={14} /> Reject
                      </button>
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
