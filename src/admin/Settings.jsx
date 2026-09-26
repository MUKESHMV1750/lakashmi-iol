import { useState } from 'react';
import { Settings as SettingsIcon, Save, Store, Mail, Phone, MapPin, Truck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Settings() {
  const [form, setForm] = useState({
    storeName: 'Oil Business',
    supportEmail: 'support@oilbusiness.com',
    supportPhone: '+91 98765 43210',
    address: '123 Heritage Mill Road, Madurai, Tamil Nadu - 625020',
    freeShippingThreshold: 500,
    currencySymbol: '₹',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Store settings saved successfully!');
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-forest-green dark:text-white">
          Store Settings
        </h1>
        <p className="text-gray-500 text-sm mt-1">Configure general store details, contact info, and shipping thresholds.</p>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Store size={20} className="text-dark-olive" /> General Information
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Store Brand Name</label>
              <input
                type="text"
                required
                value={form.storeName}
                onChange={(e) => setForm({ ...form, storeName: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Currency Symbol</label>
              <input
                type="text"
                required
                value={form.currencySymbol}
                onChange={(e) => setForm({ ...form, currencySymbol: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Support Email</label>
              <input
                type="email"
                required
                value={form.supportEmail}
                onChange={(e) => setForm({ ...form, supportEmail: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Support Phone / WhatsApp</label>
              <input
                type="text"
                required
                value={form.supportPhone}
                onChange={(e) => setForm({ ...form, supportPhone: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Store Address</label>
            <textarea
              rows={2}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="input-field resize-none"
            />
          </div>

          <div className="border-t border-gray-100 dark:border-gray-800 pt-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
              <Truck size={20} className="text-dark-olive" /> Shipping & Fulfillment
            </h3>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                Free Shipping Order Threshold (₹)
              </label>
              <input
                type="number"
                value={form.freeShippingThreshold}
                onChange={(e) => setForm({ ...form, freeShippingThreshold: Number(e.target.value) })}
                className="input-field max-w-xs"
              />
              <p className="text-xs text-gray-400 mt-1">Orders with total above this amount will automatically qualify for free shipping.</p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary py-3 px-6 text-sm flex items-center gap-2"
            >
              <Save size={18} /> {loading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
