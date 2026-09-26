import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { User, Mail, Phone, MapPin, Package, Shield, Key, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

export default function Profile() {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('details');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
  });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/users/profile', formData);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await api.put('/users/password', passwords);
      toast.success('Password changed successfully!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg dark:bg-gray-950 pt-20 md:pt-24">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header Profile Info */}
        <div className="bg-gradient-to-r from-forest-green to-dark-olive text-white rounded-3xl p-8 mb-8 shadow-xl flex flex-col md:flex-row items-center gap-6">
          <div className="w-20 h-20 bg-warm-brown text-white text-3xl font-bold rounded-2xl flex items-center justify-center border-4 border-white/20 shadow-lg">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="text-2xl md:text-3xl font-display font-bold">{user?.name}</h1>
            <p className="text-amber-200 text-sm">{user?.email}</p>
            <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
              <span className="badge bg-amber-400 text-forest-green font-bold text-xs uppercase">
                {user?.role || 'Customer'}
              </span>
              <span className="badge bg-emerald-500/30 text-emerald-200 text-xs">
                Verified Account
              </span>
            </div>
          </div>
        </div>

        {/* Tabs & Settings Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-2">
            {[
              { id: 'details', label: 'Personal Details', icon: User },
              { id: 'security', label: 'Security & Password', icon: Key },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-sm transition-all ${
                  activeTab === id
                    ? 'bg-dark-olive text-white shadow-md'
                    : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Icon size={18} /> {label}
              </button>
            ))}
          </div>

          <div className="lg:col-span-3">
            {activeTab === 'details' && (
              <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-8 shadow-sm">
                <h2 className="text-xl font-bold text-forest-green dark:text-white mb-6">Personal Details</h2>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Email Address</label>
                    <input
                      type="email"
                      disabled
                      value={formData.email}
                      className="input-field bg-gray-100 dark:bg-gray-800 cursor-not-allowed text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Mobile Number</label>
                    <input
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary py-3 px-8 mt-2">
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-8 shadow-sm">
                <h2 className="text-xl font-bold text-forest-green dark:text-white mb-6">Change Password</h2>
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Current Password</label>
                    <input
                      type="password"
                      required
                      value={passwords.currentPassword}
                      onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">New Password</label>
                    <input
                      type="password"
                      required
                      value={passwords.newPassword}
                      onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      value={passwords.confirmPassword}
                      onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary py-3 px-8 mt-2">
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
