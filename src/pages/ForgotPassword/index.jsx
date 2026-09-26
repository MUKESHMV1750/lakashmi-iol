import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      toast.success('OTP sent to your email!');
      navigate('/verify-otp', { state: { userId: data.userId, isPasswordReset: true } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally { setLoading(false); }
  };

  return (
    <div className="p-8">
      <div className="mb-8 text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h2 className="text-2xl font-display font-bold text-forest-green dark:text-white">Forgot Password?</h2>
        <p className="text-gray-500 text-sm mt-2">Enter your email and we'll send you an OTP to reset your password.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Email Address</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com" className="input-field" />
        </div>
        <button type="submit" disabled={loading} className="w-full btn-primary py-3.5 text-base disabled:opacity-60">
          {loading ? 'Sending OTP...' : 'Send OTP'}
        </button>
      </form>
    </div>
  );
}
