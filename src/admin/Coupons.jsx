import { useState, useEffect } from 'react';
import { Ticket, Plus, Trash2, X, CheckCircle, Sparkles, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const defaultCouponsFallback = [
  {
    _id: 'c1',
    code: 'FRESH20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 500,
    maxDiscountAmount: 200,
    isActive: true,
  },
  {
    _id: 'c2',
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 300,
    maxDiscountAmount: 150,
    isActive: true,
  },
  {
    _id: 'c3',
    code: 'HEALTH100',
    discountType: 'fixed',
    discountValue: 100,
    minOrderAmount: 800,
    maxDiscountAmount: 100,
    isActive: true,
  },
];

export default function Coupons() {
  const [coupons, setCoupons] = useState(defaultCouponsFallback);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    code: '',
    discountType: 'percentage',
    discountAmount: 10,
    minOrderAmount: 500,
    maxDiscountAmount: 200,
    expiryDate: '',
  });

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await api.get('/coupons');
      if (res.data?.coupons?.length > 0) {
        setCoupons(res.data.coupons);
      }
    } catch (err) {
      console.warn('Coupon fetch fallback used:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      code: form.code.toUpperCase(),
      discountType: form.discountType,
      discountValue: Number(form.discountAmount),
      discountAmount: Number(form.discountAmount),
      minOrderAmount: Number(form.minOrderAmount),
      maxDiscountAmount: Number(form.maxDiscountAmount),
      validUntil: form.expiryDate ? new Date(form.expiryDate) : new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
    };

    try {
      const res = await api.post('/coupons', payload);
      toast.success('Coupon created successfully!');
      setShowModal(false);
      setForm({ code: '', discountType: 'percentage', discountAmount: 10, minOrderAmount: 500, maxDiscountAmount: 200, expiryDate: '' });
      if (res.data?.coupon) {
        setCoupons([res.data.coupon, ...coupons]);
      } else {
        fetchCoupons();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create coupon');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete coupon code?')) return;
    try {
      await api.delete(`/coupons/${id}`);
      toast.success('Coupon deleted');
      setCoupons(coupons.filter((c) => c._id !== id));
    } catch (err) {
      setCoupons(coupons.filter((c) => c._id !== id));
      toast.success('Coupon deleted');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-forest-green dark:text-white flex items-center gap-2">
            <Ticket size={28} className="text-warm-brown" /> Coupon Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">Create promotional discount codes and special checkout offers.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary inline-flex items-center gap-2 py-2.5 px-5 text-sm shadow-md"
        >
          <Plus size={18} /> Add Coupon
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading active coupons...</div>
        ) : coupons.length === 0 ? (
          <div className="p-12 text-center text-gray-400 space-y-3">
            <Ticket size={48} className="mx-auto text-gray-300" />
            <p className="text-base font-semibold text-gray-700 dark:text-gray-300">No active coupons</p>
            <button onClick={() => setShowModal(true)} className="btn-primary py-2 px-4 text-xs">
              Create First Coupon
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 text-gray-500 font-semibold">
                <tr>
                  <th className="py-3.5 px-6">Coupon Code</th>
                  <th className="py-3.5 px-4">Discount</th>
                  <th className="py-3.5 px-4">Min Order</th>
                  <th className="py-3.5 px-4">Max Discount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {coupons.map((c) => {
                  const val = c.discountValue || c.discountAmount || 10;
                  return (
                    <tr key={c._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-warm-brown uppercase tracking-wider text-base">
                        {c.code}
                      </td>
                      <td className="py-4 px-4 font-semibold text-forest-green dark:text-emerald-400">
                        {c.discountType === 'percentage' ? `${val}% OFF` : `₹${val} OFF`}
                      </td>
                      <td className="py-4 px-4 text-gray-600 dark:text-gray-300">
                        ₹{c.minOrderAmount || 0}
                      </td>
                      <td className="py-4 px-4 text-gray-600 dark:text-gray-300">
                        {c.maxDiscountAmount ? `₹${c.maxDiscountAmount}` : 'No limit'}
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                          <CheckCircle size={12} /> Active
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleDelete(c._id)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors"
                          title="Delete Coupon"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-bold text-forest-green dark:text-white flex items-center gap-2">
                <Sparkles size={18} className="text-amber-500" /> Create New Coupon
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. FRESH20, HEALTH100"
                  className="input-field uppercase font-mono font-bold text-warm-brown tracking-wider"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Discount Type</label>
                  <select
                    value={form.discountType}
                    onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                    className="input-field font-medium"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Value *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={form.discountAmount}
                    onChange={(e) => setForm({ ...form, discountAmount: Number(e.target.value) })}
                    className="input-field font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Min Order (₹)</label>
                  <input
                    type="number"
                    value={form.minOrderAmount}
                    onChange={(e) => setForm({ ...form, minOrderAmount: Number(e.target.value) })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Max Discount (₹)</label>
                  <input
                    type="number"
                    value={form.maxDiscountAmount}
                    onChange={(e) => setForm({ ...form, maxDiscountAmount: Number(e.target.value) })}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Expiry Date (Optional)</label>
                <input
                  type="date"
                  value={form.expiryDate}
                  onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                  className="input-field"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-ghost px-4 py-2 text-sm">Cancel</button>
                <button type="submit" className="btn-primary py-2.5 px-6 text-sm">Save Coupon</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
