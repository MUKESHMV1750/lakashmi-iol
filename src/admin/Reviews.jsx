import { useState, useEffect } from 'react';
import { Star, Trash2, MessageSquare, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await api.get('/products?limit=50');
      const allReviews = (res.data.products || []).flatMap((p) =>
        (p.reviews || []).map((r) => ({ ...r, productName: p.name, productId: p._id }))
      );
      setReviews(allReviews);
    } catch (err) {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete review?')) return;
    try {
      await api.delete(`/reviews/${id}`);
      toast.success('Review removed');
      setReviews(reviews.filter((r) => r._id !== id));
    } catch (err) {
      toast.error('Failed to delete review');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-forest-green dark:text-white">
            Customer Reviews
          </h1>
          <p className="text-gray-500 text-sm mt-1">Moderate customer ratings and feedback on your oils.</p>
        </div>
        <button
          onClick={fetchReviews}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 shadow-sm"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading customer reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="p-12 text-center text-gray-400 space-y-2">
            <MessageSquare size={40} className="mx-auto text-gray-300" />
            <p className="text-base font-semibold">No customer reviews yet</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 text-gray-500 font-semibold">
              <tr>
                <th className="py-3.5 px-6">Product</th>
                <th className="py-3.5 px-4">Rating</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-6">Comment</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {reviews.map((r) => (
                <tr key={r._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                  <td className="py-4 px-6 font-semibold text-gray-900 dark:text-white">
                    {r.productName || 'Oil Product'}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={14} fill={i < (r.rating || 5) ? 'currentColor' : 'none'} className={i < (r.rating || 5) ? 'text-amber-400' : 'text-gray-300'} />
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-700 dark:text-gray-300 font-medium">
                    {r.name || r.user?.name || 'Verified Customer'}
                  </td>
                  <td className="py-4 px-6 text-gray-500 dark:text-gray-400 max-w-sm">
                    "{r.comment || 'Great quality!'}"
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button onClick={() => handleDelete(r._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
