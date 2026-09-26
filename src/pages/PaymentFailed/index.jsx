import { Link } from 'react-router-dom';
import { XCircle, RefreshCw } from 'lucide-react';

export default function PaymentFailed() {
  return (
    <div className="min-h-screen bg-bg dark:bg-gray-950 pt-24 flex items-center justify-center px-4">
      <div className="card max-w-md w-full p-10 text-center">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle size={50} className="text-red-500" />
        </div>
        <h1 className="text-3xl font-display font-bold text-terracotta mb-3">Payment Failed</h1>
        <p className="text-gray-500 mb-8">Your payment could not be processed. Please try again.</p>
        <div className="flex flex-col gap-3">
          <Link to="/cart" className="btn-primary py-3 flex items-center justify-center gap-2 bg-terracotta hover:bg-red-700">
            <RefreshCw size={18} /> Try Again
          </Link>
          <Link to="/" className="btn-ghost">Go Home</Link>
        </div>
      </div>
    </div>
  );
}
