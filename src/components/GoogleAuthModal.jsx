import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { X, Sparkles, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { googleLogin } from '../redux/slices/authSlice';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '620945522299-pei533scgh7apvhevvqocoj0jchqddep.apps.googleusercontent.com';

export default function GoogleAuthModal({ isOpen, onClose, onSuccess }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    // Load Google Identity Services script dynamically if not present
    if (!window.google && !document.getElementById('google-gsi-script')) {
      const script = document.createElement('script');
      script.id = 'google-gsi-script';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => initGoogleGSI();
      document.head.appendChild(script);
    } else if (window.google) {
      initGoogleGSI();
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const initGoogleGSI = () => {
    try {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleCredentialResponse,
        });
        const buttonDiv = document.getElementById('native-google-btn-container');
        if (buttonDiv) {
          buttonDiv.innerHTML = '';
          window.google.accounts.id.renderButton(buttonDiv, {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: 'continue_with',
            shape: 'pill',
          });
        }
      }
    } catch (err) {
      console.warn('Google GSI init warning:', err.message);
    }
  };

  const handleGoogleCredentialResponse = async (response) => {
    if (!response.credential) return;
    setLoading(true);
    try {
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const payload = JSON.parse(jsonPayload);

      const googleData = {
        email: payload.email,
        name: payload.name || payload.given_name || payload.email.split('@')[0],
        avatar: payload.picture,
        googleId: payload.sub,
      };

      const res = await dispatch(googleLogin(googleData)).unwrap();
      if (res?.token) {
        toast.success(`Welcome back, ${googleData.name}!`);
        onClose();
        if (onSuccess) onSuccess();
        else navigate('/');
      }
    } catch (err) {
      toast.error('Google OAuth authentication failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-md p-4 animate-fade-in transition-all"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-gray-900 border border-amber-500/20 dark:border-gray-800 rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl animate-slide-up transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-forest-green dark:text-white flex items-center gap-1.5">
                Google Social Sign In
                <Sparkles size={14} className="text-amber-500 animate-spin" />
              </h3>
              <p className="text-xs text-gray-400">Sign in securely using your Google Account</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Native Google GSI Render Button */}
        <div id="native-google-btn-container" className="w-full flex justify-center min-h-[42px] overflow-hidden rounded-xl"></div>

        <div className="pt-3 text-center text-[11px] text-gray-400 border-t border-gray-100 dark:border-gray-800 flex items-center justify-center gap-1.5">
          <ShieldCheck size={14} className="text-emerald-600" /> 256-Bit Encrypted Google OAuth 2.0 Integration
        </div>
      </div>
    </div>
  );
}


