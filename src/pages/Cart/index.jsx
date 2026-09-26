import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Trash2, Plus, Minus, Bookmark, ArrowRight, ShoppingBag, Tag } from 'lucide-react';
import { removeFromCart, updateQuantity, saveForLater, moveToCart, clearCart, selectCartTotal, selectCartCount } from '../../redux/slices/cartSlice';
import { useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, savedForLater } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const cartTotal = useSelector(selectCartTotal);
  const cartCount = useSelector(selectCartCount);

  const [couponCode, setCouponCode] = useState('');
  const [couponData, setCouponData] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const shippingCharge = cartTotal > 500 ? 0 : 50;
  const gst = Math.round(cartTotal * 0.05);
  const discount = couponData ? couponData.discount : 0;
  const finalTotal = cartTotal + shippingCharge + gst - discount;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    if (!isAuthenticated) { toast.error('Please login to apply coupon'); return; }
    setCouponLoading(true);
    try {
      const { data } = await api.post('/coupons/validate', { code: couponCode, orderAmount: cartTotal });
      setCouponData(data.coupon);
      toast.success(`Coupon applied! You saved ₹${Math.round(data.coupon.discount)}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-bg dark:bg-gray-950 pt-20 md:pt-24 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-8xl mb-6">🛒</div>
          <h2 className="text-2xl font-display font-bold text-forest-green dark:text-white mb-3">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't added any products yet.</p>
          <Link to="/products" className="btn-primary px-8 py-3">
            <ShoppingBag size={18} /> Explore Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg dark:bg-gray-950 pt-20 md:pt-24">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-display font-bold text-forest-green dark:text-white mb-8">
          Shopping Cart <span className="text-gray-400 text-xl font-sans font-normal">({cartCount} items)</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.key} className="card p-4 flex gap-4 group">
                <div className="w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden bg-bg-secondary">
                  <img src={item.product?.images?.[0]?.url} alt={item.product?.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs text-sage-green mb-0.5">{item.product?.category?.name}</p>
                      <h3 className="font-semibold text-forest-green dark:text-white text-sm mb-1 line-clamp-2">
                        <Link to={`/products/${item.product?.slug || item.product?._id}`} className="hover:text-warm-brown">
                          {item.product?.name}
                        </Link>
                      </h3>
                      {item.size && <p className="text-xs text-gray-500">Size: {item.size}</p>}
                    </div>
                    <p className="text-lg font-bold text-forest-green dark:text-white flex-shrink-0">
                      ₹{Math.round(item.price * item.quantity)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                    {/* Quantity */}
                    <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                      <button onClick={() => dispatch(updateQuantity({ key: item.key, quantity: item.quantity - 1 }))}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <Minus size={14} />
                      </button>
                      <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                      <button onClick={() => dispatch(updateQuantity({ key: item.key, quantity: item.quantity + 1 }))}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button onClick={() => dispatch(saveForLater(item.key))}
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-dark-olive transition-colors">
                        <Bookmark size={14} /> Save Later
                      </button>
                      <button onClick={() => dispatch(removeFromCart(item.key))}
                        className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 transition-colors">
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Saved For Later */}
            {savedForLater.length > 0 && (
              <div className="mt-8">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-4">Saved for Later ({savedForLater.length})</h3>
                {savedForLater.map((item) => (
                  <div key={item.key} className="card p-4 flex gap-4 opacity-70 hover:opacity-100 transition-opacity mb-3">
                    <div className="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-bg-secondary">
                      <img src={item.product?.images?.[0]?.url} alt={item.product?.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm text-forest-green dark:text-white">{item.product?.name}</h4>
                      <p className="text-sm font-bold text-warm-brown mt-1">₹{item.price}</p>
                    </div>
                    <button onClick={() => dispatch(moveToCart(item.key))} className="btn-secondary text-xs px-3 py-1.5">Move to Cart</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <div className="card p-6 sticky top-24">
              <h3 className="font-display font-semibold text-lg text-forest-green dark:text-white mb-5">Order Summary</h3>

              {/* Coupon */}
              <div className="mb-5">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <Tag size={15} className="text-dark-olive" /> Apply Coupon
                </p>
                {couponData ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 rounded-xl">
                    <span className="text-sm font-semibold text-green-700">{couponData.code} applied!</span>
                    <button onClick={() => setCouponData(null)} className="text-xs text-red-500 hover:text-red-700">Remove</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter coupon code"
                      className="flex-1 input-field text-sm py-2.5" />
                    <button onClick={handleApplyCoupon} disabled={couponLoading}
                      className="px-4 py-2.5 bg-dark-olive text-white text-sm font-medium rounded-xl hover:bg-forest-green transition-all disabled:opacity-50">
                      {couponLoading ? '...' : 'Apply'}
                    </button>
                  </div>
                )}
              </div>

              {/* Price breakdown */}
              <div className="space-y-3 border-t border-gray-100 dark:border-gray-700 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal ({cartCount} items)</span>
                  <span className="font-medium">₹{Math.round(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                  <span className={shippingCharge === 0 ? 'text-green-600 font-medium' : 'font-medium'}>
                    {shippingCharge === 0 ? 'FREE' : `₹${shippingCharge}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">GST (5%)</span>
                  <span className="font-medium">₹{gst}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Coupon Discount</span>
                    <span className="text-green-600 font-medium">-₹{Math.round(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg border-t border-gray-200 dark:border-gray-700 pt-3">
                  <span className="text-forest-green dark:text-white">Total</span>
                  <span className="text-forest-green dark:text-white">₹{Math.round(finalTotal)}</span>
                </div>
                {cartTotal <= 500 && (
                  <p className="text-xs text-warm-brown">Add ₹{500 - Math.round(cartTotal)} more for free shipping!</p>
                )}
              </div>

              <button
                onClick={() => isAuthenticated ? navigate('/checkout') : navigate('/login?redirect=/checkout')}
                className="w-full btn-primary mt-5 py-3.5 text-base"
              >
                {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
                <ArrowRight size={18} />
              </button>

              <Link to="/products" className="w-full btn-ghost mt-3 py-3 text-sm flex justify-center">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
