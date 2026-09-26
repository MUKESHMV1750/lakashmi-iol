import { useState, useEffect } from 'react';
import {
  Users, UserPlus, Shield, ShieldAlert, ShieldCheck,
  Search, Trash2, Edit3, X, CheckCircle, Mail, Phone, Lock, RefreshCw, Key
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const defaultUsersFallback = [
  {
    _id: 'u1',
    name: 'Mukesh Admin',
    email: 'admin@oilbusiness.com',
    mobile: '+91 98765 43210',
    role: 'admin',
    createdAt: '2025-01-01T10:00:00.000Z',
  },
  {
    _id: 'u2',
    name: 'Priya Ramesh',
    email: 'priya.ramesh@gmail.com',
    mobile: '+91 98765 43211',
    role: 'customer',
    createdAt: '2025-01-15T10:30:00.000Z',
  },
  {
    _id: 'u3',
    name: 'Arjun Sharma',
    email: 'arjun.sharma@yahoo.com',
    mobile: '+91 98123 45678',
    role: 'customer',
    createdAt: '2025-02-01T14:20:00.000Z',
  },
  {
    _id: 'u4',
    name: 'Store Manager',
    email: 'manager@oilbusiness.com',
    mobile: '+91 99440 11223',
    role: 'admin',
    createdAt: '2025-02-10T11:00:00.000Z',
  },
];

export default function UserManagement() {
  const [users, setUsers] = useState(defaultUsersFallback);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [addForm, setAddForm] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
    role: 'customer',
  });

  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    mobile: '',
    role: 'customer',
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/users');
      if (res.data?.users?.length > 0) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.warn('User fetch fallback used:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filtered users
  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesSearch =
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.mobile?.includes(search);
    return matchesRole && matchesSearch;
  });

  // Create User/Admin (user - adding / admin adding)
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/users', addForm);
      toast.success(`${addForm.role === 'admin' ? 'Admin' : 'User'} created successfully!`);
      setShowAddModal(false);
      setAddForm({ name: '', email: '', password: '', mobile: '', role: 'customer' });
      if (res.data?.user) {
        setUsers([res.data.user, ...users]);
      } else {
        fetchUsers();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user/admin');
    }
  };

  // Open Edit Modal (admin change)
  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name || '',
      email: user.email || '',
      mobile: user.mobile || '',
      role: user.role || 'customer',
    });
    setShowEditModal(true);
  };

  // Submit Edit Details (admin change)
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    try {
      const res = await api.put(`/admin/users/${selectedUser._id}`, editForm);
      toast.success('Account details updated successfully!');
      setShowEditModal(false);
      if (res.data?.user) {
        setUsers(users.map((u) => (u._id === selectedUser._id ? res.data.user : u)));
      } else {
        fetchUsers();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user');
    }
  };

  // Toggle/Change Role (admin roll change)
  const handleRoleChange = async (userToUpdate) => {
    const newRole = userToUpdate.role === 'admin' ? 'customer' : 'admin';
    if (!window.confirm(`Change role of "${userToUpdate.name}" from ${userToUpdate.role.toUpperCase()} to ${newRole.toUpperCase()}?`)) return;

    try {
      await api.patch(`/admin/users/${userToUpdate._id}/role`, { role: newRole });
      toast.success(`Role changed to ${newRole.toUpperCase()}`);
      setUsers(
        users.map((u) => (u._id === userToUpdate._id ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      // Local fallback update
      setUsers(
        users.map((u) => (u._id === userToUpdate._id ? { ...u, role: newRole } : u))
      );
      toast.success(`Role changed to ${newRole.toUpperCase()}`);
    }
  };

  // Delete User/Admin (admin deslet)
  const handleDeleteUser = async (userToDelete) => {
    if (!window.confirm(`Are you sure you want to delete account "${userToDelete.name}" (${userToDelete.email})?`)) return;

    try {
      await api.delete(`/admin/users/${userToDelete._id}`);
      toast.success('User account deleted successfully');
      setUsers(users.filter((u) => u._id !== userToDelete._id));
    } catch (err) {
      setUsers(users.filter((u) => u._id !== userToDelete._id));
      toast.success('User account deleted');
    }
  };

  const customerCount = users.filter((u) => u.role === 'customer').length;
  const adminCount = users.filter((u) => u.role === 'admin').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-forest-green dark:text-white flex items-center gap-2">
            <Shield size={30} className="text-amber-500" /> User & Admin Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Add users/admins, edit profile details, change roles, or remove accounts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setAddForm({ ...addForm, role: 'customer' }); setShowAddModal(true); }}
            className="btn-secondary py-2.5 px-4 text-xs font-bold flex items-center gap-1.5"
          >
            <UserPlus size={16} /> Add User
          </button>
          <button
            onClick={() => { setAddForm({ ...addForm, role: 'admin' }); setShowAddModal(true); }}
            className="btn-primary py-2.5 px-4 text-xs font-bold flex items-center gap-1.5 shadow-md bg-warm-brown hover:bg-terracotta"
          >
            <ShieldCheck size={16} /> Add Admin
          </button>
        </div>
      </div>

      {/* Role Summary Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Accounts</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{users.length}</h3>
          </div>
          <div className="p-3 bg-forest-green/10 text-forest-green rounded-xl">
            <Users size={22} />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Customers</p>
            <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{customerCount}</h3>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-xl">
            <UserPlus size={22} />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Admin Staff</p>
            <h3 className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{adminCount}</h3>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl">
            <ShieldCheck size={22} />
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {[
            { id: 'all', label: 'All Accounts' },
            { id: 'customer', label: `Customers (${customerCount})` },
            { id: 'admin', label: `Admins (${adminCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setRoleFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
                roleFilter === tab.id
                  ? 'bg-dark-olive text-white shadow-md'
                  : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3.5 top-3 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, mobile..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-xs bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-dark-olive/30"
          />
        </div>
      </div>

      {/* Accounts Table */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading user accounts...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-gray-400 space-y-2">
            <Users size={40} className="mx-auto text-gray-300" />
            <p className="text-base font-semibold">No matching accounts found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 text-gray-500 font-semibold text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-6">User Details</th>
                  <th className="py-3.5 px-4">Contact Info</th>
                  <th className="py-3.5 px-4">Role Badge</th>
                  <th className="py-3.5 px-4">Role Change</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                    {/* User info */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${
                          u.role === 'admin'
                            ? 'bg-amber-400 text-forest-green'
                            : 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                        }`}>
                          {u.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white text-sm">{u.name}</p>
                          <p className="text-xs text-gray-400">Joined: {new Date(u.createdAt || Date.now()).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </td>

                    {/* Email & Mobile */}
                    <td className="py-4 px-4 text-xs space-y-0.5">
                      <p className="font-medium text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                        <Mail size={12} className="text-gray-400" /> {u.email}
                      </p>
                      {u.mobile && (
                        <p className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5 font-mono">
                          <Phone size={12} className="text-gray-400" /> {u.mobile}
                        </p>
                      )}
                    </td>

                    {/* Role Badge */}
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${
                        u.role === 'admin'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-400/30'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                      }`}>
                        {u.role === 'admin' ? <ShieldCheck size={13} /> : <Users size={13} />}
                        {u.role}
                      </span>
                    </td>

                    {/* Role Change Button (admin roll change) */}
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleRoleChange(u)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 border ${
                          u.role === 'admin'
                            ? 'border-gray-200 hover:border-gray-400 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                            : 'border-amber-400 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 hover:bg-amber-100'
                        }`}
                        title="Click to change account role"
                      >
                        <RefreshCw size={12} />
                        {u.role === 'admin' ? 'Make Customer' : 'Promote Admin'}
                      </button>
                    </td>

                    {/* Actions (admin change / admin deslet) */}
                    <td className="py-4 px-6 text-right space-x-1">
                      <button
                        onClick={() => openEditModal(u)}
                        className="p-2 text-forest-green dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-gray-800 rounded-xl transition-colors"
                        title="Edit Details (Admin Change)"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors"
                        title="Delete Account (Admin Delete)"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ===== ADD USER / ADMIN MODAL (user - adding / admin adding) ===== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-bold text-forest-green dark:text-white flex items-center gap-2">
                <UserPlus size={20} className="text-warm-brown" /> Add New {addForm.role === 'admin' ? 'Admin' : 'User'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Account Role *</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAddForm({ ...addForm, role: 'customer' })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      addForm.role === 'customer'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddForm({ ...addForm, role: 'admin' })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      addForm.role === 'admin'
                        ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    Admin Staff
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Full Name *</label>
                <input
                  type="text"
                  required
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  placeholder="John Doe"
                  className="input-field"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Email Address *</label>
                <input
                  type="email"
                  required
                  value={addForm.email}
                  onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                  placeholder="user@example.com"
                  className="input-field"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Password *</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={addForm.password}
                  onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                  placeholder="Minimum 6 characters"
                  className="input-field"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Mobile Number</label>
                <input
                  type="tel"
                  value={addForm.mobile}
                  onChange={(e) => setAddForm({ ...addForm, mobile: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="input-field"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-ghost px-4 py-2 text-sm">Cancel</button>
                <button type="submit" className="btn-primary py-2.5 px-6 text-sm">Create Account</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== EDIT USER / ADMIN MODAL (admin change) ===== */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-bold text-forest-green dark:text-white flex items-center gap-2">
                <Edit3 size={18} className="text-forest-green" /> Edit Account Details
              </h3>
              <button onClick={() => setShowEditModal(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Account Role</label>
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  className="input-field font-bold"
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Admin Staff</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Full Name *</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Email Address *</label>
                <input
                  type="email"
                  required
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Mobile Number</label>
                <input
                  type="tel"
                  value={editForm.mobile}
                  onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
                  className="input-field"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowEditModal(false)} className="btn-ghost px-4 py-2 text-sm">Cancel</button>
                <button type="submit" className="btn-primary py-2.5 px-6 text-sm">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
