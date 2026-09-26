import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';

export default function PaymentSuccess() {
  const { state } = useLocation();
  return (
    <div className="min-h-screen bg-bg dark:bg-gray-950 pt-24 flex items-center justify-center px-4">
      <div className="card max-w-md w-full p-10 text-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-soft">
          <CheckCircle size={50} className="text-green-500" />
        </div>
        <h1 className="text-3xl font-display font-bold text-forest-green mb-3">Order Placed! 🎉</h1>
        <p className="text-gray-500 mb-2">Thank you for your order.</p>
        {state?.orderNumber && <p className="text-sm font-mono bg-bg-secondary dark:bg-gray-800 px-4 py-2 rounded-xl inline-block mb-6">Order #{state.orderNumber}</p>}
        <p className="text-sm text-gray-500 mb-8">You will receive a confirmation email shortly.</p>
        <div className="flex flex-col gap-3">
          <Link to={`/orders/${state?.orderId}`} className="btn-primary py-3 flex items-center justify-center gap-2">
            <Package size={18} /> Track Your Order
          </Link>
          <Link to="/products" className="btn-ghost">Continue Shopping <ArrowRight size={16} /></Link>
        </div>
      </div>
    </div>
  );
}
