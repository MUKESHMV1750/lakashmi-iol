import { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Tags, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/categories');
      setCategories(res.data.categories || []);
    } catch (err) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editCategory) {
        await api.put(`/categories/${editCategory._id}`, form);
        toast.success('Category updated successfully');
      } else {
        await api.post('/categories', form);
        toast.success('Category created successfully');
      }
      setShowModal(false);
      setEditCategory(null);
      setForm({ name: '', description: '' });
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success('Category deleted');
      setCategories(categories.filter((c) => c._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete category');
    }
  };

  const openEdit = (cat) => {
    setEditCategory(cat);
    setForm({ name: cat.name, description: cat.description || '' });
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-forest-green dark:text-white">
            Category Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">Organize your products into categories.</p>
        </div>
        <button
          onClick={() => { setEditCategory(null); setForm({ name: '', description: '' }); setShowModal(true); }}
          className="btn-primary inline-flex items-center gap-2 py-2.5 px-5 text-sm"
        >
          <Plus size={18} /> Add Category
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center text-gray-400 space-y-2">
            <Tags size={40} className="mx-auto text-gray-300" />
            <p className="text-base font-semibold">No categories yet</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 text-gray-500 font-semibold">
              <tr>
                <th className="py-3.5 px-6">Category Name</th>
                <th className="py-3.5 px-6">Description</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {categories.map((c) => (
                <tr key={c._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                  <td className="py-4 px-6 font-semibold text-gray-900 dark:text-white flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-dark-olive/10 flex items-center justify-center text-dark-olive font-bold">
                      {c.name[0]}
                    </div>
                    {c.name}
                  </td>
                  <td className="py-4 px-6 text-gray-500 dark:text-gray-400 max-w-md truncate">
                    {c.description || 'No description'}
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button onClick={() => openEdit(c)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Edit3 size={16} />
                    </button>
                    <button onClick={() => handleDelete(c._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
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
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {editCategory ? 'Edit Category' : 'Create New Category'}
              </h3>
              <button onClick={() => setShowModal(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Category Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Groundnut Oil"
                  className="input-field"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Brief summary of products in this category..."
                  className="input-field resize-none"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-xl text-sm">Cancel</button>
                <button type="submit" className="btn-primary py-2 px-5 text-sm">{editCategory ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
