import { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  CheckCircle2,
  Clock,
  Truck,
  Home as HomeIcon,
  AlertTriangle,
  Printer,
  ArrowLeft,
  Copy,
  ExternalLink,
  ShieldCheck,
  HelpCircle,
  X,
  RotateCcw,
  FileText,
  MapPin,
  CreditCard,
  Building,
  Phone,
  User,
  Calendar,
  ChevronRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchOrder, cancelOrder, clearOrder } from '../../redux/slices/orderSlice';

const STEPS = [
  { id: 'placed', label: 'Order Placed', desc: 'We have received your order', icon: FileText },
  { id: 'confirmed', label: 'Order Confirmed', desc: 'Order verified & sent to warehouse', icon: CheckCircle2 },
  { id: 'processing', label: 'Processing & Packed', desc: 'Items packed securely with care', icon: Package },
  { id: 'shipped', label: 'Shipped', desc: 'Handed over to courier partner', icon: Truck },
  { id: 'out_for_delivery', label: 'Out for Delivery', desc: 'Executive is delivering your package', icon: Clock },
  { id: 'delivered', label: 'Delivered', desc: 'Package delivered to address', icon: HomeIcon },
];

export default function OrderTracking() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { order, loading, error, cancelling } = useSelector((state) => state.orders);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const printableRef = useRef(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchOrder(id));
    }
    return () => {
      dispatch(clearOrder());
    };
  }, [dispatch, id]);

  const handleCopyTracking = (trackingNum) => {
    navigator.clipboard.writeText(trackingNum);
    toast.success('Tracking number copied to clipboard!');
  };

  const handleCancelSubmit = (e) => {
    e.preventDefault();
    const finalReason = cancelReason === 'Other' ? customReason : cancelReason;
    if (!finalReason) {
      toast.error('Please select or enter a reason for cancellation');
      return;
    }
    dispatch(cancelOrder({ id: order._id, reason: finalReason })).then((res) => {
      if (!res.error) {
        setShowCancelModal(false);
      }
    });
  };

  const handlePrint = () => {
    window.print();
  };

  // Determine active step index
  const getStepStatus = (stepId, index) => {
    if (!order) return 'pending';
    const statusMap = {
      pending: 0,
      confirmed: 1,
      processing: 2,
      shipped: 3,
      out_for_delivery: 4,
      delivered: 5,
    };

    if (order.status === 'cancelled' || order.status === 'returned') return 'cancelled';

    const currentStepIndex = statusMap[order.status] !== undefined ? statusMap[order.status] : 0;
    if (index < currentStepIndex) return 'completed';
    if (index === currentStepIndex) return 'current';
    return 'upcoming';
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400',
    confirmed: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400',
    processing: 'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-900/30 dark:text-indigo-400',
    shipped: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-400',
    out_for_delivery: 'bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-900/30 dark:text-teal-400',
    delivered: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400',
    cancelled: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400',
    return_requested: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400',
    returned: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg dark:bg-gray-950 pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center py-20">
          <div className="spinner mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Fetching order tracking details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-bg dark:bg-gray-950 pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto card p-8 text-center my-8">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="text-red-600 dark:text-red-400" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Order Not Found</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {error || "We couldn't find the order details for the requested ID."}
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/orders" className="btn-primary">
              <ArrowLeft size={18} /> View My Orders
            </Link>
            <Link to="/products" className="btn-secondary">
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isCancellable = ['pending', 'confirmed', 'processing'].includes(order.status);
  const isReturnable = order.status === 'delivered';

  return (
    <div className="min-h-screen bg-bg dark:bg-gray-950 pt-20 md:pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/orders"
            className="inline-flex items-center gap-2 text-sm font-medium text-dark-olive dark:text-sage-green hover:underline"
          >
            <ArrowLeft size={16} /> Back to My Orders
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowInvoiceModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 transition-all"
            >
              <Printer size={14} /> Print Invoice
            </button>
            <Link
              to="/contact"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 transition-all"
            >
              <HelpCircle size={14} /> Help & Support
            </Link>
          </div>
        </div>

        {/* Order Header Summary Card */}
        <div className="card p-6 mb-8 border border-gray-100 dark:border-gray-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-gray-700">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-display font-bold text-forest-green dark:text-white">
                  Order #{order.orderNumber}
                </h1>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[order.status]}`}>
                  {order.status.replace(/_/g, ' ').toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-gray-400 flex items-center gap-2 mt-1">
                <Calendar size={14} /> Placed on{' '}
                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {isCancellable && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="px-4 py-2 text-sm font-semibold rounded-xl text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-900/50 transition-all"
                >
                  Cancel Order
                </button>
              )}
              {isReturnable && (
                <Link
                  to={`/orders/${order._id}/return`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl text-warm-brown bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300 transition-all"
                >
                  <RotateCcw size={16} /> Return / Replace
                </Link>
              )}
              <div className="text-right pl-4 border-l border-gray-200 dark:border-gray-700">
                <span className="text-xs text-gray-400 block">Total Amount</span>
                <span className="text-2xl font-bold text-forest-green dark:text-white">₹{order.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Cancellation Alert Banner if Cancelled */}
          {order.status === 'cancelled' && (
            <div className="mt-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 flex items-start gap-3">
              <AlertTriangle size={20} className="text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-red-800 dark:text-red-300">This order was cancelled</h4>
                <p className="text-xs text-red-700 dark:text-red-400 mt-1">
                  Reason: {order.cancellationReason || 'Cancelled by customer'}
                </p>
                {order.cancelledAt && (
                  <p className="text-xs text-red-500 mt-0.5">
                    Cancelled on {new Date(order.cancelledAt).toLocaleString('en-IN')}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Return Alert Banner if Returned */}
          {(order.status === 'return_requested' || order.status === 'returned') && (
            <div className="mt-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 flex items-start gap-3">
              <RotateCcw size={20} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-amber-800 dark:text-amber-300">Return Request Status</h4>
                <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                  Status: {order.status.replace(/_/g, ' ')}. Our support team will update you shortly regarding pickup.
                </p>
              </div>
            </div>
          )}

          {/* Interactive Stepper Visualizer (Only if not cancelled) */}
          {order.status !== 'cancelled' && (
            <div className="mt-8 pt-4">
              <h3 className="text-base font-bold text-gray-800 dark:text-white mb-6 flex items-center justify-between">
                <span>Order Status Tracker</span>
                {order.tracking?.estimatedDelivery && (
                  <span className="text-xs font-normal text-dark-olive dark:text-sage-green bg-sage-green/10 px-3 py-1 rounded-full">
                    Est. Delivery: {new Date(order.tracking.estimatedDelivery).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                  </span>
                )}
              </h3>

              {/* Desktop Stepper Horizontal */}
              <div className="hidden md:block relative mb-8">
                {/* Connecting Progress Line */}
                <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 bg-gray-200 dark:bg-gray-700 z-0 rounded-full" />
                
                {/* Filled Line Calculation */}
                {(() => {
                  const statusMap = { pending: 0, confirmed: 1, processing: 2, shipped: 3, out_for_delivery: 4, delivered: 5 };
                  const idx = statusMap[order.status] ?? 0;
                  const percent = Math.min((idx / (STEPS.length - 1)) * 100, 100);
                  return (
                    <div
                      className="absolute top-1/2 left-0 -translate-y-1/2 h-1 bg-dark-olive dark:bg-sage-green z-0 transition-all duration-700 rounded-full"
                      style={{ width: `${percent}%` }}
                    />
                  );
                })()}

                <div className="relative z-10 flex justify-between">
                  {STEPS.map((step, index) => {
                    const status = getStepStatus(step.id, index);
                    const StepIcon = step.icon;
                    const isDone = status === 'completed';
                    const isCurrent = status === 'current';

                    return (
                      <div key={step.id} className="flex flex-col items-center max-w-[130px] text-center group">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                            isDone
                              ? 'bg-dark-olive text-white shadow-md'
                              : isCurrent
                              ? 'bg-forest-green text-white ring-4 ring-dark-olive/20 animate-pulse'
                              : 'bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-400'
                          }`}
                        >
                          {isDone ? <CheckCircle2 size={22} /> : <StepIcon size={20} />}
                        </div>
                        <span
                          className={`text-xs font-semibold mt-3 ${
                            isDone || isCurrent ? 'text-forest-green dark:text-white' : 'text-gray-400'
                          }`}
                        >
                          {step.label}
                        </span>
                        <span className="text-[11px] text-gray-400 leading-tight mt-0.5 line-clamp-2">
                          {step.desc}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Stepper Vertical */}
              <div className="md:hidden space-y-6 relative pl-6 border-l-2 border-gray-200 dark:border-gray-700 ml-3 my-4">
                {STEPS.map((step, index) => {
                  const status = getStepStatus(step.id, index);
                  const StepIcon = step.icon;
                  const isDone = status === 'completed';
                  const isCurrent = status === 'current';

                  return (
                    <div key={step.id} className="relative flex items-start gap-4">
                      <div
                        className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center ${
                          isDone
                            ? 'bg-dark-olive text-white'
                            : isCurrent
                            ? 'bg-forest-green text-white ring-2 ring-dark-olive/20'
                            : 'bg-white dark:bg-gray-800 border-2 border-gray-300 text-gray-400'
                        }`}
                      >
                        {isDone ? <CheckCircle2 size={14} /> : <StepIcon size={12} />}
                      </div>
                      <div>
                        <h4
                          className={`text-sm font-semibold ${
                            isDone || isCurrent ? 'text-forest-green dark:text-white' : 'text-gray-400'
                          }`}
                        >
                          {step.label}
                        </h4>
                        <p className="text-xs text-gray-400">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Courier & Tracking Details Card (If Shipped / Available) */}
        {order.tracking?.trackingNumber && (
          <div className="card p-6 mb-8 bg-gradient-to-r from-dark-olive/5 to-sage-green/10 dark:from-dark-olive/20 dark:to-gray-800 border border-dark-olive/20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-dark-olive text-white flex items-center justify-center shrink-0">
                  <Truck size={24} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Courier Partner</h4>
                  <p className="text-lg font-bold text-forest-green dark:text-white">
                    {order.tracking.courier || 'Express Delivery Logistics'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700">
                  <span className="text-[11px] text-gray-400 block uppercase font-mono">AWB / Tracking ID</span>
                  <span className="text-sm font-mono font-bold text-forest-green dark:text-white">
                    {order.tracking.trackingNumber}
                  </span>
                </div>
                <button
                  onClick={() => handleCopyTracking(order.tracking.trackingNumber)}
                  className="p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:text-dark-olive transition-all"
                  title="Copy Tracking Number"
                >
                  <Copy size={18} />
                </button>
                {order.tracking.trackingUrl && (
                  <a
                    href={order.tracking.trackingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary py-2 px-4 text-xs flex items-center gap-1.5"
                  >
                    Live Track <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column: Items List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-bold text-forest-green dark:text-white mb-4 flex items-center gap-2">
                <Package size={20} className="text-dark-olive dark:text-sage-green" /> Ordered Items ({order.items?.length || 0})
              </h3>
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-bg-secondary dark:bg-gray-700 overflow-hidden shrink-0 border border-gray-100 dark:border-gray-600">
                        <img
                          src={item.image || (item.product?.images?.[0]?.url) || 'https://via.placeholder.com/100'}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-800 dark:text-white hover:text-dark-olive transition-colors">
                          {item.product?.slug ? (
                            <Link to={`/products/${item.product.slug}`}>{item.name}</Link>
                          ) : (
                            item.name
                          )}
                        </h4>
                        {item.size && (
                          <span className="inline-block text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300 mt-1">
                            Size: {item.size}
                          </span>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          ₹{item.price} × {item.quantity} unit{item.quantity > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-bold text-forest-green dark:text-white">
                        ₹{item.total || item.price * item.quantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Status History Timeline Log */}
            {order.statusHistory?.length > 0 && (
              <div className="card p-6">
                <h3 className="text-lg font-bold text-forest-green dark:text-white mb-4 flex items-center gap-2">
                  <Clock size={20} className="text-dark-olive dark:text-sage-green" /> Status Activity History
                </h3>
                <div className="space-y-4 pl-3 border-l-2 border-gray-100 dark:border-gray-700 ml-2">
                  {order.statusHistory.map((history, hIdx) => (
                    <div key={hIdx} className="relative pl-6">
                      <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-dark-olive border-2 border-white dark:border-gray-800" />
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold capitalize text-gray-800 dark:text-white">
                          {history.status.replace(/_/g, ' ')}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(history.timestamp || order.createdAt).toLocaleString('en-IN', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      {history.note && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{history.note}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Side Column: Shipping Address & Payment Summary */}
          <div className="space-y-6">
            {/* Delivery Address Card */}
            <div className="card p-6">
              <h3 className="text-base font-bold text-forest-green dark:text-white mb-4 flex items-center gap-2">
                <MapPin size={18} className="text-dark-olive dark:text-sage-green" /> Shipping Address
              </h3>
              {order.shippingAddress ? (
                <div className="text-xs space-y-2 text-gray-600 dark:text-gray-300">
                  <p className="font-bold text-sm text-gray-800 dark:text-white flex items-center gap-1.5">
                    <User size={14} className="text-gray-400" /> {order.shippingAddress.name}
                  </p>
                  <p className="leading-relaxed pl-5">{order.shippingAddress.address}</p>
                  <p className="pl-5">
                    {order.shippingAddress.city}, {order.shippingAddress.state} -{' '}
                    <strong className="font-mono text-gray-800 dark:text-white">{order.shippingAddress.pincode}</strong>
                  </p>
                  <p className="pl-5 pt-1 text-gray-500 flex items-center gap-1.5">
                    <Phone size={13} className="text-gray-400" /> +91 {order.shippingAddress.mobile}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-gray-400">No shipping address recorded.</p>
              )}
            </div>

            {/* Payment & Bill Details */}
            <div className="card p-6">
              <h3 className="text-base font-bold text-forest-green dark:text-white mb-4 flex items-center gap-2">
                <CreditCard size={18} className="text-dark-olive dark:text-sage-green" /> Payment & Billing
              </h3>

              <div className="p-3 rounded-xl bg-bg-secondary dark:bg-gray-700/50 mb-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-gray-400 uppercase font-semibold block">Method</span>
                  <span className="text-xs font-bold text-gray-800 dark:text-white uppercase">
                    {order.payment?.method || 'Cash On Delivery'}
                  </span>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize ${
                    order.payment?.status === 'completed'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300'
                  }`}
                >
                  {order.payment?.status || 'Pending'}
                </span>
              </div>

              {order.payment?.razorpayPaymentId && (
                <div className="mb-4 text-xs font-mono text-gray-500">
                  <span className="text-gray-400 block text-[10px]">Payment Ref ID</span>
                  {order.payment.razorpayPaymentId}
                </div>
              )}

              <div className="space-y-2.5 text-xs border-t border-gray-100 dark:border-gray-700 pt-4">
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Items Subtotal</span>
                  <span>₹{order.itemsTotal || order.totalAmount}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-400 font-semibold">
                    <span>Discount ({order.coupon?.code})</span>
                    <span>-₹{order.discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Shipping Charges</span>
                  <span>{order.shippingCharge === 0 ? <strong className="text-green-600">FREE</strong> : `₹${order.shippingCharge}`}</span>
                </div>
                {order.taxAmount > 0 && (
                  <div className="flex justify-between text-gray-600 dark:text-gray-300">
                    <span>Taxes (GST)</span>
                    <span>₹{order.taxAmount}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm font-bold text-forest-green dark:text-white border-t border-gray-100 dark:border-gray-700 pt-3 mt-2">
                  <span>Grand Total</span>
                  <span>₹{order.totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Need Help Banner */}
            <div className="card p-5 bg-sage-green/10 border border-sage-green/30 text-center">
              <ShieldCheck size={32} className="mx-auto text-dark-olive dark:text-sage-green mb-2" />
              <h4 className="text-sm font-bold text-forest-green dark:text-white">Have questions about your order?</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 my-2">
                Our support team is available 24/7 to assist with tracking and delivery updates.
              </p>
              <Link to="/contact" className="inline-flex items-center gap-1 text-xs font-bold text-dark-olive dark:text-sage-green hover:underline">
                Contact Customer Support <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Order Modal */}
      <AnimatePresence>
        {showCancelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="card max-w-md w-full p-6 relative bg-white dark:bg-gray-800"
            >
              <button
                onClick={() => setShowCancelModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white"
              >
                <X size={20} />
              </button>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 flex items-center justify-center">
                  <AlertTriangle size={20} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Cancel Order</h3>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Are you sure you want to cancel order <strong className="font-mono">#{order.orderNumber}</strong>? Please let us know the reason.
              </p>

              <form onSubmit={handleCancelSubmit} className="space-y-3">
                {[
                  'Ordered by mistake',
                  'Expected delivery date is too late',
                  'Price reduced on item',
                  'Need to change shipping address',
                  'Other',
                ].map((reason) => (
                  <label
                    key={reason}
                    className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <input
                      type="radio"
                      name="cancelReason"
                      value={reason}
                      checked={cancelReason === reason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      className="accent-dark-olive"
                    />
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-200">{reason}</span>
                  </label>
                ))}

                {cancelReason === 'Other' && (
                  <textarea
                    rows={2}
                    placeholder="Specify reason..."
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    className="input-field text-xs mt-2"
                  />
                )}

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCancelModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 rounded-xl"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={cancelling}
                    className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl flex items-center gap-2"
                  >
                    {cancelling && <span className="spinner w-3 h-3 border-2 border-white border-t-transparent" />}
                    Confirm Cancellation
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Invoice Modal Preview / Printable Component */}
      <AnimatePresence>
        {showInvoiceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white text-gray-900 max-w-2xl w-full rounded-2xl p-8 shadow-2xl relative my-8"
            >
              <div className="flex justify-between items-center pb-4 mb-6 border-b border-gray-200 no-print">
                <h3 className="text-lg font-bold text-forest-green flex items-center gap-2">
                  <FileText size={20} /> Order Invoice
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrint}
                    className="btn-primary py-1.5 px-4 text-xs flex items-center gap-1.5"
                  >
                    <Printer size={14} /> Print / Save PDF
                  </button>
                  <button
                    onClick={() => setShowInvoiceModal(false)}
                    className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Printable Invoice Container */}
              <div ref={printableRef} className="print-area">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-forest-green font-display">PureOil E-Store</h2>
                    <p className="text-xs text-gray-500">Premium Organic & Cold-Pressed Oils</p>
                    <p className="text-xs text-gray-500 mt-1">GSTIN: 33AAAAA0000A1Z5</p>
                  </div>
                  <div className="text-right">
                    <h4 className="text-lg font-bold uppercase text-gray-700">TAX INVOICE</h4>
                    <p className="text-xs font-mono font-bold text-dark-olive">#{order.orderNumber}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Date: {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-gray-50 mb-6 text-xs">
                  <div>
                    <span className="font-bold block text-gray-700 mb-1">Billed & Shipped To:</span>
                    <p className="font-semibold">{order.shippingAddress?.name}</p>
                    <p>{order.shippingAddress?.address}</p>
                    <p>
                      {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                    </p>
                    <p>Mobile: +91 {order.shippingAddress?.mobile}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold block text-gray-700 mb-1">Payment Information:</span>
                    <p className="capitalize">Method: {order.payment?.method || 'COD'}</p>
                    <p className="capitalize">Status: {order.payment?.status || 'Pending'}</p>
                    {order.payment?.razorpayPaymentId && <p className="font-mono text-[10px]">Ref: {order.payment.razorpayPaymentId}</p>}
                  </div>
                </div>

                <table className="w-full text-xs text-left mb-6 border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-300 text-gray-600">
                      <th className="py-2">Item Description</th>
                      <th className="py-2 text-center">Qty</th>
                      <th className="py-2 text-right">Price</th>
                      <th className="py-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {order.items?.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-2 font-medium">
                          {item.name} {item.size && `(${item.size})`}
                        </td>
                        <td className="py-2 text-center">{item.quantity}</td>
                        <td className="py-2 text-right">₹{item.price}</td>
                        <td className="py-2 text-right font-bold">₹{item.total || item.price * item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="flex justify-end text-xs">
                  <div className="w-64 space-y-1.5 border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal:</span>
                      <span>₹{order.itemsTotal || order.totalAmount}</span>
                    </div>
                    {order.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount ({order.coupon?.code}):</span>
                        <span>-₹{order.discount}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping:</span>
                      <span>₹{order.shippingCharge || 0}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>GST (Tax):</span>
                      <span>₹{order.taxAmount || 0}</span>
                    </div>
                    <div className="flex justify-between font-bold text-sm text-forest-green border-t border-gray-300 pt-2 mt-2">
                      <span>Total Paid:</span>
                      <span>₹{order.totalAmount}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 text-center text-[10px] text-gray-400 border-t border-gray-100 pt-4">
                  Thank you for shopping with PureOil! For invoice support, email support@pureoil.com
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
