import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight, RotateCcw } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '../../redux/slices/orderSlice';

const statusColors = {
  pending: 'badge-yellow', confirmed: 'badge-blue', processing: 'badge-blue',
  shipped: 'badge-blue', out_for_delivery: 'badge-green', delivered: 'badge-green',
  cancelled: 'badge-red', return_requested: 'badge-yellow', returned: 'badge-yellow',
};

export default function Orders() {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.orders);
  const [filter, setFilter] = useState('all');

  useEffect(() => { dispatch(fetchOrders()); }, [dispatch]);

  const filteredOrders = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="min-h-screen bg-bg dark:bg-gray-950 pt-20 md:pt-24">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-display font-bold text-forest-green dark:text-white mb-6">My Orders</h1>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {['all', 'pending', 'confirmed', 'delivered', 'cancelled'].map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize flex-shrink-0 transition-all ${
                filter === s ? 'bg-dark-olive text-white' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 hover:border-dark-olive'
              }`}>
              {s === 'all' ? 'All Orders' : s}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="spinner" /></div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20">
            <Package size={64} className="mx-auto text-gray-200 mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No orders found</h3>
            <Link to="/products" className="btn-primary mt-4">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order._id} className="card p-5">
                <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
                  <div>
                    <p className="text-sm text-gray-500">Order # <strong className="font-mono text-forest-green dark:text-white">{order.orderNumber}</strong></p>
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'long' })}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`badge ${statusColors[order.status] || 'badge-yellow'} capitalize`}>{order.status.replace(/_/g, ' ')}</span>
                    <span className="font-bold text-forest-green dark:text-white">₹{order.totalAmount}</span>
                  </div>
                </div>

                {/* Items preview */}
                <div className="flex gap-3 mb-4 overflow-x-auto">
                  {order.items?.slice(0, 4).map((item, i) => (
                    <div key={i} className="flex-shrink-0 flex items-center gap-2">
                      <div className="w-12 h-12 rounded-xl bg-bg-secondary overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium truncate max-w-28">{item.name}</p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                  {order.items?.length > 4 && <p className="text-sm text-gray-400 self-center">+{order.items.length - 4} more</p>}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex gap-3">
                    <Link to={`/orders/${order._id}`} className="flex items-center gap-1 text-sm font-medium text-dark-olive hover:text-forest-green">
                      Track Order <ChevronRight size={14} />
                    </Link>
                    {order.status === 'delivered' && (
                      <Link to={`/orders/${order._id}/return`} className="flex items-center gap-1 text-sm text-gray-500 hover:text-warm-brown">
                        <RotateCcw size={14} /> Return/Replace
                      </Link>
                    )}
                  </div>
                  <Link to={`/orders/${order._id}`} className="text-xs text-gray-400 hover:text-dark-olive">View Invoice</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
