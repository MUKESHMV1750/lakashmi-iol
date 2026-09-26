import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import ProductCard from '../../components/ProductCard';
import api from '../../services/api';

export default function Wishlist() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      api.get('/users/wishlist')
        .then(({ data }) => setWishlistItems(data.wishlist || []))
        .catch(() => setWishlistItems([]))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-bg dark:bg-gray-950 pt-20 md:pt-24">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-red-50 dark:bg-red-950/30 text-red-500 rounded-2xl flex items-center justify-center">
            <Heart size={24} className="fill-red-500" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-forest-green dark:text-white">
              My Wishlist
            </h1>
            <p className="text-sm text-gray-500">Your saved organic cold-pressed oils</p>
          </div>
        </div>

        {!isAuthenticated ? (
          <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-8">
            <Heart size={48} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-forest-green dark:text-white mb-2">Please Login</h2>
            <p className="text-gray-500 mb-6">Sign in to save and view your favorite products across devices.</p>
            <Link to="/login" className="btn-primary">Login Now</Link>
          </div>
        ) : loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="spinner" />
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-8">
            <Heart size={48} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-bold text-forest-green dark:text-white mb-2">Your Wishlist is Empty</h2>
            <p className="text-gray-500 mb-6">Explore our pure oil selection and heart items to save them here.</p>
            <Link to="/products" className="btn-primary inline-flex items-center gap-2">
              <ShoppingBag size={18} /> Browse Products <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistItems.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
