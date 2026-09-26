import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddCat, setShowAddCat] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [creatingCat, setCreatingCat] = useState(false);

  const [form, setForm] = useState({
    name: '',
    category: '',
    price: '',
    originalPrice: '',
    stock: 0,
    volume: '1L',
    description: '',
    imageUrl: '',
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          api.get('/categories'),
          api.get(`/products/${id}`),
        ]);
        setCategories(catRes.data.categories || []);
        const p = prodRes.data.product;
        if (p) {
          setForm({
            name: p.name || '',
            category: p.category?._id || p.category || '',
            price: p.price || 0,
            originalPrice: p.originalPrice || p.price || 0,
            stock: p.stock || 0,
            volume: p.volume || '1L',
            description: p.description || '',
            imageUrl: p.images?.[0]?.url || '',
          });
        }
      } catch (err) {
        toast.error('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleQuickAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setCreatingCat(true);
    try {
      const { data } = await api.post('/categories', { name: newCatName.trim() });
      toast.success(`Category "${newCatName}" created!`);
      const newCat = data.category;
      setCategories((prev) => [...prev, newCat]);
      setForm((f) => ({ ...f, category: newCat._id }));
      setNewCatName('');
      setShowAddCat(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create category');
    } finally {
      setCreatingCat(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        originalPrice: Number(form.originalPrice),
        stock: Number(form.stock),
        images: [{ url: form.imageUrl }],
      };
      await api.put(`/products/${id}`, payload);
      toast.success('Product updated successfully');
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-12 text-center text-gray-400">Loading product details...</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link to="/admin/products" className="p-2 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 text-gray-600">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-forest-green dark:text-white">
            Edit Product
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Update inventory, pricing, or product information.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Product Title *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-field"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block">Category *</label>
                <button
                  type="button"
                  onClick={() => setShowAddCat(!showAddCat)}
                  className="text-xs font-semibold text-dark-olive hover:text-forest-green flex items-center gap-1"
                >
                  <Plus size={14} /> Quick Add Category
                </button>
              </div>
              <select
                required
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="input-field"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Volume</label>
              <input
                type="text"
                value={form.volume}
                onChange={(e) => setForm({ ...form, volume: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          {showAddCat && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl space-y-3 animate-slide-down">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                  Create New Category
                </h4>
                <button type="button" onClick={() => setShowAddCat(false)}>
                  <X size={16} className="text-emerald-700" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Extra Virgin Olive Oil"
                  className="input-field py-1.5 text-sm"
                />
                <button
                  type="button"
                  onClick={handleQuickAddCategory}
                  disabled={creatingCat || !newCatName.trim()}
                  className="px-4 py-2 bg-emerald-700 text-white font-semibold text-xs rounded-xl hover:bg-emerald-800 whitespace-nowrap disabled:opacity-50"
                >
                  {creatingCat ? 'Adding...' : 'Save & Select'}
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Price (₹) *</label>
              <input
                type="number"
                required
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Original MRP (₹)</label>
              <input
                type="number"
                value={form.originalPrice}
                onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Stock *</label>
              <input
                type="number"
                required
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Image URL</label>
            <input
              type="url"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              className="input-field"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Description</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input-field resize-none"
            />
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3">
            <Link to="/admin/products" className="px-5 py-2.5 border rounded-xl text-sm font-medium text-gray-600">Cancel</Link>
            <button type="submit" disabled={saving} className="btn-primary py-2.5 px-6 text-sm flex items-center gap-2">
              <Save size={18} /> {saving ? 'Saving...' : 'Update Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
