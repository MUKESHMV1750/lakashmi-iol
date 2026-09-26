import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { register, googleLogin, clearError } from '../../redux/slices/authSlice';
import GoogleAuthModal from '../../components/GoogleAuthModal';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '620945522299-pei533scgh7apvhevvqocoj0jchqddep.apps.googleusercontent.com';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const { loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ name: '', email: '', mobile: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    dispatch(clearError());

    // Check if redirected back with id_token in hash (fallback)
    const hash = window.location.hash;
    if (hash && hash.includes('id_token=')) {
      const idToken = new URLSearchParams(hash.substring(1)).get('id_token');
      if (idToken) {
        try {
          const payload = JSON.parse(decodeURIComponent(escape(atob(idToken.split('.')[1]))));
          dispatch(
            googleLogin({
              email: payload.email,
              name: payload.name || payload.given_name || payload.email.split('@')[0],
              googleId: payload.sub,
              avatar: payload.picture,
            })
          ).then((res) => {
            if (!res.error) {
              window.history.replaceState(null, '', window.location.pathname);
              toast.success(`Account created for ${payload.name || payload.email}!`);
              navigate(redirect);
            }
          });
        } catch (e) {
          console.error('Failed to parse Google ID token:', e);
        }
      }
    }
  }, [dispatch, navigate, redirect]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email) e.email = 'Email is required';
    if (form.mobile && !/^[0-9]{10}$/.test(form.mobile)) e.mobile = 'Enter valid 10-digit mobile';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    dispatch(clearError());
    const result = await dispatch(register({ name: form.name.trim(), email: form.email.trim(), mobile: form.mobile, password: form.password }));
    if (!result.error) navigate(redirect);
  };

  const handleDirectGoogleLogin = () => {
    setGoogleLoading(true);

    // 1. Try Google Identity Services Token Client Popup (Prevents redirect_uri_mismatch)
    if (window.google?.accounts?.oauth2) {
      try {
        const tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: 'openid email profile',
          callback: async (tokenResponse) => {
            if (tokenResponse.access_token) {
              try {
                const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });
                const userInfo = await userInfoRes.json();

                const res = await dispatch(
                  googleLogin({
                    email: userInfo.email,
                    name: userInfo.name || userInfo.given_name || userInfo.email.split('@')[0],
                    googleId: userInfo.sub || `google_${Date.now()}`,
                    avatar: userInfo.picture,
                  })
                ).unwrap();

                if (res?.token) {
                  toast.success(`Account created for ${userInfo.name || userInfo.email}!`);
                  navigate(redirect);
                }
              } catch (fetchErr) {
                console.error('Failed to fetch Google user profile:', fetchErr);
                setIsGoogleModalOpen(true);
              } finally {
                setGoogleLoading(false);
              }
            } else {
              setGoogleLoading(false);
            }
          },
          error_callback: (err) => {
            console.warn('Google OAuth Token Client Error:', err);
            setGoogleLoading(false);
            setIsGoogleModalOpen(true);
          },
        });

        tokenClient.requestAccessToken({ prompt: 'select_account' });
        return;
      } catch (err) {
        console.warn('GSI initTokenClient warning:', err);
      }
    }

    // 2. Try GSI Standard ID Prompt
    if (window.google?.accounts?.id) {
      try {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: async (response) => {
            if (response.credential) {
              const base64Url = response.credential.split('.')[1];
              const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
              const payload = JSON.parse(decodeURIComponent(escape(atob(base64))));
              const res = await dispatch(
                googleLogin({
                  email: payload.email,
                  name: payload.name || payload.given_name || payload.email.split('@')[0],
                  googleId: payload.sub,
                  avatar: payload.picture,
                })
              ).unwrap();
              if (res?.token) {
                toast.success(`Account created for ${payload.name || payload.email}!`);
                navigate(redirect);
              }
            }
            setGoogleLoading(false);
          },
        });

        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            setGoogleLoading(false);
            setIsGoogleModalOpen(true);
          }
        });
        return;
      } catch (e) {
        console.warn('GSI id.initialize warning:', e);
      }
    }

    // Fallback to custom Google modal
    setGoogleLoading(false);
    setIsGoogleModalOpen(true);
  };

  const fields = [
    { key: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
    { key: 'email', label: 'Email Address', type: 'email', placeholder: 'your@email.com' },
    { key: 'mobile', label: 'Mobile Number', type: 'tel', placeholder: '9876543210' },
  ];

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-display font-bold text-forest-green dark:text-white">Create Account</h2>
        <p className="text-gray-500 text-sm mt-1">Join our community of health-conscious customers</p>
      </div>

      {error && (
        <div className="mb-4 p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-2xl text-xs font-medium text-red-600 dark:text-red-400 flex items-center gap-2.5 animate-fade-in shadow-sm">
          <AlertCircle size={16} className="shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map(({ key, label, type, placeholder }) => (
          <div key={key}>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">{label}</label>
            <input type={type} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              placeholder={placeholder} className={`input-field ${errors[key] ? 'border-red-400 focus:ring-red-300' : ''}`} />
            {errors[key] && <p className="text-xs text-red-500 mt-1">{errors[key]}</p>}
          </div>
        ))}

        {/* Password */}
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Password</label>
          <div className="relative">
            <input type={showPass ? 'text' : 'password'} value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Minimum 6 characters" className={`input-field pr-12 ${errors.password ? 'border-red-400' : ''}`} />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3.5 text-gray-400">
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Confirm Password</label>
          <input type="password" value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            placeholder="Re-enter password" className={`input-field ${errors.confirmPassword ? 'border-red-400' : ''}`} />
          {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
        </div>

        <p className="text-xs text-gray-400">By creating an account, you agree to our <Link to="/terms" className="text-dark-olive">Terms</Link> and <Link to="/privacy-policy" className="text-dark-olive">Privacy Policy</Link>.</p>

        <button type="submit" disabled={loading}
          className="w-full btn-primary py-3.5 text-base disabled:opacity-60 disabled:cursor-not-allowed">
          {loading ? 'Creating Account...' : 'Create Account'} {!loading && <ArrowRight size={18} />}
        </button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-gray-700" /></div>
        <div className="relative flex justify-center"><span className="px-4 bg-white dark:bg-gray-900 text-sm text-gray-500">or sign up with</span></div>
      </div>

      <div>
        <button
          type="button"
          disabled={googleLoading}
          onClick={handleDirectGoogleLogin}
          className="w-full border-2 border-gray-200 dark:border-gray-700 py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-3 hover:bg-emerald-50/50 dark:hover:bg-gray-800 transition-all cursor-pointer shadow-sm hover:border-dark-olive text-gray-800 dark:text-gray-200 disabled:opacity-60"
        >
          <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          {googleLoading ? 'Opening Google Sign In...' : 'Sign up with Google'}
        </button>
      </div>

      <p className="text-center text-sm text-gray-500 mt-6">
        Already have an account?{' '}
        <Link to={`/login${redirect !== '/' ? `?redirect=${encodeURIComponent(redirect)}` : ''}`} className="font-semibold text-dark-olive hover:text-forest-green">Sign in</Link>
      </p>

      {/* Google Auth Modal Fallback / Demo Account Selector */}
      <GoogleAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSuccess={() => navigate(redirect)}
      />
    </div>
  );
}



