import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { MapPin, CreditCard, Wallet, Smartphone, ChevronRight, Plus, CheckCircle, BookmarkCheck, Pencil, Trash2, X } from 'lucide-react';
import { createOrder } from '../../redux/slices/orderSlice';
import { clearCart, selectCartTotal } from '../../redux/slices/cartSlice';
import { updateUserAddresses } from '../../redux/slices/authSlice';
import api from '../../services/api';
import toast from 'react-hot-toast';

const paymentMethods = [
  { id: 'razorpay', label: 'Razorpay', desc: 'UPI, Card, Wallet, Netbanking', icon: '💳' },
  { id: 'stripe', label: 'Stripe', desc: 'International Cards', icon: '🌐' },
  { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when delivered', icon: '💵' },
];

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const cartTotal = useSelector(selectCartTotal);
  const { order, loading } = useSelector((state) => state.orders);

  const [step, setStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [couponCode, setCouponCode] = useState('');
  const [couponData, setCouponData] = useState(null);
  const [newAddress, setNewAddress] = useState({
    name: user?.name || '', mobile: user?.mobile || '', address: '', city: '', state: '', pincode: '',
  });
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [saveAddressOption, setSaveAddressOption] = useState(true);
  const [addressType, setAddressType] = useState('home');
  const [savingAddress, setSavingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);

  const shippingCharge = cartTotal > 500 ? 0 : 50;
  const gst = Math.round(cartTotal * 0.05);
  const discount = couponData?.discount || 0;
  const finalTotal = cartTotal + shippingCharge + gst - discount;

  useEffect(() => {
    if (user?.addresses?.length > 0) {
      const defaultAddr = user.addresses.find((a) => a.isDefault) || user.addresses[0];
      setSelectedAddress(defaultAddr);
    } else {
      setShowNewAddress(true);
    }
  }, [user]);

  const handleStartEditAddress = (addr) => {
    setEditingAddressId(addr._id);
    setNewAddress({
      name: addr.name || '',
      mobile: addr.mobile || '',
      address: addr.address || '',
      city: addr.city || '',
      state: addr.state || '',
      pincode: addr.pincode || '',
    });
    setAddressType(addr.type || 'home');
    setShowNewAddress(true);
  };

  const handleCancelEdit = () => {
    setEditingAddressId(null);
    setNewAddress({
      name: user?.name || '',
      mobile: user?.mobile || '',
      address: '',
      city: '',
      state: '',
      pincode: '',
    });
    setAddressType('home');
    if (user?.addresses?.length > 0) {
      setShowNewAddress(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      const { data } = await api.delete(`/users/addresses/${addressId}`);
      if (data?.addresses) {
        dispatch(updateUserAddresses(data.addresses));
        toast.success('Address deleted successfully');
        if (selectedAddress?._id === addressId) {
          const remaining = data.addresses[0] || null;
          setSelectedAddress(remaining);
          if (data.addresses.length === 0) {
            setShowNewAddress(true);
          }
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete address');
    }
  };

  const handleContinueToPayment = async () => {
    if (showNewAddress) {
      if (!newAddress.name?.trim() || !newAddress.mobile?.trim() || !newAddress.address?.trim() || !newAddress.city?.trim() || !newAddress.pincode?.trim()) {
        toast.error('Please fill in all required address fields');
        return;
      }

      if (editingAddressId && user) {
        setSavingAddress(true);
        try {
          const addressData = {
            ...newAddress,
            type: addressType,
          };
          const { data } = await api.put(`/users/addresses/${editingAddressId}`, addressData);
          if (data?.addresses) {
            dispatch(updateUserAddresses(data.addresses));
            const updated = data.addresses.find((a) => a._id === editingAddressId) || data.addresses[0];
            setSelectedAddress(updated);
            toast.success('Address updated successfully!');
            setEditingAddressId(null);
            setShowNewAddress(false);
          }
        } catch (err) {
          toast.error(err.response?.data?.message || 'Failed to update address');
        } finally {
          setSavingAddress(false);
        }
      } else if (saveAddressOption && user) {
        setSavingAddress(true);
        try {
          const addressData = {
            ...newAddress,
            type: addressType,
            isDefault: user?.addresses?.length === 0,
          };
          const { data } = await api.post('/users/addresses', addressData);
          if (data?.addresses) {
            dispatch(updateUserAddresses(data.addresses));
            const newlySaved = data.addresses[data.addresses.length - 1];
            if (newlySaved) {
              setSelectedAddress(newlySaved);
            }
            toast.success('Address saved to profile!');
          }
        } catch (err) {
          console.warn('Failed to save address to profile:', err);
        } finally {
          setSavingAddress(false);
        }
      }
    } else if (!selectedAddress) {
      toast.error('Please select or add a delivery address');
      return;
    }

    setStep(2);
  };

  const handlePlaceOrder = async () => {
    const address = showNewAddress ? newAddress : selectedAddress;
    if (!address?.address || !address?.city || !address?.pincode) {
      toast.error('Please fill in complete delivery address');
      return;
    }

    const orderData = {
      items: items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        size: item.size,
      })),
      shippingAddress: address,
      payment: { method: paymentMethod },
      couponCode: couponData?.code,
    };

    const result = await dispatch(createOrder(orderData));
    if (!result.payload) return;

    const createdOrder = result.payload;

    if (paymentMethod === 'cod') {
      dispatch(clearCart());
      navigate('/payment/success', { state: { orderId: createdOrder._id, orderNumber: createdOrder.orderNumber } });
      return;
    }

    if (paymentMethod === 'razorpay') {
      try {
        const { data } = await api.post(`/orders/${createdOrder._id}/razorpay`);
        const options = {
          key: data.keyId,
          amount: data.razorpayOrder.amount,
          currency: 'INR',
          name: 'Oil Business',
          description: `Order #${createdOrder.orderNumber}`,
          order_id: data.razorpayOrder.id,
          handler: async (response) => {
            await api.post(`/orders/${createdOrder._id}/razorpay/verify`, response);
            dispatch(clearCart());
            navigate('/payment/success', { state: { orderId: createdOrder._id, orderNumber: createdOrder.orderNumber } });
          },
          prefill: { name: user.name, email: user.email, contact: user.mobile },
          theme: { color: '#3A5A40' },
          modal: { ondismiss: () => toast.error('Payment cancelled') },
        };
        const razorpayInstance = new window.Razorpay(options);
        razorpayInstance.open();
      } catch { toast.error('Failed to initialize payment'); }
    }

    if (paymentMethod === 'stripe') {
      try {
        const { data } = await api.post(`/orders/${createdOrder._id}/stripe`);
        navigate('/payment', { state: { clientSecret: data.clientSecret, orderId: createdOrder._id } });
      } catch { toast.error('Failed to initialize Stripe payment'); }
    }
  };

  return (
    <div className="min-h-screen bg-bg dark:bg-gray-950 pt-20 md:pt-24">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-display font-bold text-forest-green dark:text-white mb-8">Checkout</h1>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-8">
          {['Delivery Address', 'Payment', 'Review Order'].map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                step === i + 1 ? 'bg-dark-olive text-white' :
                step > i + 1 ? 'bg-sage-green text-white' : 'bg-bg-secondary text-gray-500'
              }`}>
                {step > i + 1 ? <CheckCircle size={14} /> : <span>{i + 1}</span>}
                <span className="hidden md:block">{s}</span>
              </div>
              {i < 2 && <ChevronRight size={14} className="text-gray-300 mx-1" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Address */}
            {step === 1 && (
              <div className="card p-6 animate-fade-in">
                <h2 className="font-semibold text-lg text-forest-green dark:text-white mb-4 flex items-center gap-2">
                  <MapPin size={20} className="text-dark-olive" /> Delivery Address
                </h2>
                {/* Saved addresses */}
                {user?.addresses?.length > 0 && (
                  <div className="space-y-3 mb-4">
                    {user.addresses.map((addr, i) => (
                      <div
                        key={addr._id || i}
                        className={`p-4 border-2 rounded-xl transition-all ${
                          (selectedAddress?._id === addr._id || selectedAddress === addr) && !showNewAddress
                            ? 'border-dark-olive bg-dark-olive/5 shadow-sm'
                            : 'border-gray-200 dark:border-gray-700 hover:border-sage-green'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <label
                            className="flex items-start gap-3 cursor-pointer flex-1"
                            onClick={() => {
                              setSelectedAddress(addr);
                              setShowNewAddress(false);
                              setEditingAddressId(null);
                            }}
                          >
                            <input
                              type="radio"
                              name="address"
                              checked={(selectedAddress?._id === addr._id || selectedAddress === addr) && !showNewAddress}
                              readOnly
                              className="accent-dark-olive mt-0.5 cursor-pointer"
                            />
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-sm text-gray-900 dark:text-white">{addr.name}</span>
                                <span className={`badge ${addr.type === 'home' ? 'badge-green' : 'badge-blue'} text-xs capitalize`}>
                                  {addr.type}
                                </span>
                                {addr.isDefault && <span className="badge badge-yellow text-xs">Default</span>}
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{addr.address}, {addr.city}, {addr.state} - {addr.pincode}</p>
                              <p className="text-sm text-gray-500 mt-0.5">📱 {addr.mobile}</p>
                            </div>
                          </label>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              title="Edit Address"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartEditAddress(addr);
                              }}
                              className="p-1.5 text-gray-500 hover:text-dark-olive hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
                            >
                              <Pencil size={14} /> Edit
                            </button>
                            <button
                              type="button"
                              title="Delete Address"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteAddress(addr._id);
                              }}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
                            >
                              <Trash2 size={14} /> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* New/Edit Address Form Toggle */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => {
                      if (editingAddressId) {
                        handleCancelEdit();
                      } else {
                        setShowNewAddress(!showNewAddress);
                        if (!showNewAddress) setSelectedAddress(null);
                      }
                    }}
                    className="flex items-center gap-2 text-sm text-dark-olive font-semibold hover:underline"
                  >
                    <Plus size={16} />{' '}
                    {editingAddressId
                      ? 'Cancel Editing'
                      : showNewAddress
                      ? 'Use Saved Address'
                      : 'Add New Address'}
                  </button>

                  {editingAddressId && (
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-900/40">
                      Editing Address
                    </span>
                  )}
                </div>

                {showNewAddress && (
                  <div className="space-y-4 animate-fade-in border-t border-gray-100 dark:border-gray-800 pt-4 mt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { key: 'name', label: 'Full Name *', placeholder: 'John Doe', col: 1 },
                        { key: 'mobile', label: 'Mobile Number *', placeholder: '9876543210', col: 1 },
                        { key: 'address', label: 'Address Line *', placeholder: 'House No, Street, Area', col: 2 },
                        { key: 'city', label: 'City *', placeholder: 'Chennai', col: 1 },
                        { key: 'state', label: 'State *', placeholder: 'Tamil Nadu', col: 1 },
                        { key: 'pincode', label: 'Pincode *', placeholder: '600001', col: 1 },
                      ].map(({ key, label, placeholder, col }) => (
                        <div key={key} className={col === 2 ? 'md:col-span-2' : ''}>
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">{label}</label>
                          <input
                            type="text"
                            placeholder={placeholder}
                            value={newAddress[key]}
                            onChange={(e) => setNewAddress({ ...newAddress, [key]: e.target.value })}
                            className="input-field"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Address Type Tag */}
                    <div>
                      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Address Tag</label>
                      <div className="flex gap-2">
                        {['home', 'work', 'other'].map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setAddressType(type)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all border ${
                              addressType === type
                                ? 'bg-dark-olive text-white border-dark-olive shadow-sm'
                                : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-dark-olive'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Save Address Option */}
                    {user && !editingAddressId && (
                      <div className="pt-2">
                        <label className="flex items-center gap-2.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={saveAddressOption}
                            onChange={(e) => setSaveAddressOption(e.target.checked)}
                            className="w-4 h-4 rounded text-dark-olive accent-dark-olive cursor-pointer"
                          />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                            <BookmarkCheck size={16} className="text-dark-olive" /> Save this address to my profile for future orders
                          </span>
                        </label>
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={handleContinueToPayment}
                  disabled={savingAddress}
                  className="btn-primary mt-6 py-3 px-8 disabled:opacity-50 flex items-center gap-2"
                >
                  {savingAddress
                    ? editingAddressId
                      ? 'Updating Address...'
                      : 'Saving Address...'
                    : 'Continue to Payment'}{' '}
                  <ChevronRight size={18} />
                </button>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="card p-6 animate-fade-in">
                <h2 className="font-semibold text-lg text-forest-green dark:text-white mb-4 flex items-center gap-2">
                  <CreditCard size={20} className="text-dark-olive" /> Payment Method
                </h2>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <label key={method.id} className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      paymentMethod === method.id ? 'border-dark-olive bg-dark-olive/5' : 'border-gray-200 dark:border-gray-700 hover:border-sage-green'
                    }`}>
                      <input type="radio" name="payment" value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={() => setPaymentMethod(method.id)}
                        className="accent-dark-olive" />
                      <div className="text-2xl">{method.icon}</div>
                      <div>
                        <p className="font-semibold text-sm">{method.label}</p>
                        <p className="text-xs text-gray-500">{method.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {/* UPI Options under Razorpay */}
                {paymentMethod === 'razorpay' && (
                  <div className="mt-4 p-4 bg-bg-secondary dark:bg-gray-800 rounded-xl">
                    <p className="text-xs text-gray-500 mb-2">Supported methods via Razorpay:</p>
                    <div className="flex flex-wrap gap-2">
                      {['UPI', 'Google Pay', 'PhonePe', 'Paytm', 'Debit Card', 'Credit Card', 'Net Banking'].map((m) => (
                        <span key={m} className="px-3 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full text-xs">{m}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(1)} className="btn-ghost px-6">← Back</button>
                  <button onClick={() => setStep(3)} className="btn-primary py-3 px-8">
                    Review Order <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="card p-6 animate-fade-in">
                <h2 className="font-semibold text-lg text-forest-green dark:text-white mb-4">Review Your Order</h2>
                <div className="space-y-3 mb-6">
                  {items.map((item) => (
                    <div key={item.key} className="flex items-center gap-3">
                      <img src={item.product?.images?.[0]?.url} alt={item.product?.name}
                        className="w-12 h-12 rounded-xl object-cover bg-bg-secondary" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.product?.name}</p>
                        {item.size && <p className="text-xs text-gray-400">Size: {item.size}</p>}
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-forest-green">₹{Math.round(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="btn-ghost px-6">← Back</button>
                  <button onClick={handlePlaceOrder} disabled={loading} className="btn-primary py-3 px-8 flex-1 disabled:opacity-50">
                    {loading ? 'Placing Order...' : `Place Order (₹${Math.round(finalTotal)})`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Price Summary Sidebar */}
          <div>
            <div className="card p-5 sticky top-24">
              <h3 className="font-semibold text-forest-green dark:text-white mb-4">Price Summary</h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Items Total</span><span>₹{Math.round(cartTotal)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span className={shippingCharge === 0 ? 'text-green-600' : ''}>{shippingCharge === 0 ? 'FREE' : `₹${shippingCharge}`}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">GST (5%)</span><span>₹{gst}</span></div>
                {discount > 0 && <div className="flex justify-between"><span className="text-green-600">Coupon</span><span className="text-green-600">-₹{Math.round(discount)}</span></div>}
                <div className="flex justify-between font-bold text-base border-t pt-2.5 border-gray-200 dark:border-gray-700">
                  <span className="text-forest-green dark:text-white">Grand Total</span>
                  <span className="text-forest-green dark:text-white">₹{Math.round(finalTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
