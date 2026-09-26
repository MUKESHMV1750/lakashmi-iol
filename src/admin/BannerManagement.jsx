import { useState, useEffect } from 'react';
import { Image as ImageIcon, Plus, Trash2, Edit3, X, Link as LinkIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function BannerManagement() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', link: '', imageUrl: '' });

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await api.get('/banners');
      setBanners(res.data.banners || []);
    } catch (err) {
      toast.error('Failed to load banners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/banners', form);
      toast.success('Banner created successfully');
      setShowModal(false);
      setForm({ title: '', link: '', imageUrl: '' });
      fetchBanners();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create banner');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete banner?')) return;
    try {
      await api.delete(`/banners/${id}`);
      toast.success('Banner deleted');
      setBanners(banners.filter((b) => b._id !== id));
    } catch (err) {
      toast.error('Failed to delete banner');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-forest-green dark:text-white">
            Banner Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage promotional banners for the home hero carousel.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary inline-flex items-center gap-2 py-2.5 px-5 text-sm"
        >
          <Plus size={18} /> Add Banner
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading banners...</div>
        ) : banners.length === 0 ? (
          <div className="p-12 text-center text-gray-400 space-y-2">
            <ImageIcon size={40} className="mx-auto text-gray-300" />
            <p className="text-base font-semibold">No custom banners created</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 text-gray-500 font-semibold">
              <tr>
                <th className="py-3.5 px-6">Preview</th>
                <th className="py-3.5 px-4">Title</th>
                <th className="py-3.5 px-4">Target Link</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {banners.map((b) => (
                <tr key={b._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                  <td className="py-4 px-6">
                    <div className="w-24 h-14 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden border">
                      <img src={b.image?.url || b.imageUrl} alt={b.title} className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="py-4 px-4 font-semibold text-gray-900 dark:text-white">
                    {b.title}
                  </td>
                  <td className="py-4 px-4 text-gray-500 font-mono text-xs">
                    {b.link || '/products'}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button onClick={() => handleDelete(b._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Add Hero Banner</h3>
              <button onClick={() => setShowModal(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Banner Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Organic Cold Pressed Gingelly Oil"
                  className="input-field"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Image URL *</label>
                <input
                  type="url"
                  required
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="input-field"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Target Link</label>
                <input
                  type="text"
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  placeholder="/products?keyword=groundnut"
                  className="input-field"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-xl text-sm">Cancel</button>
                <button type="submit" className="btn-primary py-2 px-5 text-sm">Create Banner</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
