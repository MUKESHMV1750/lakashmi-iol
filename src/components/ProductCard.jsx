import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Eye, Tag } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import toast from 'react-hot-toast';
import api from '../services/api';

const RatingStars = ({ rating, numReviews }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        size={12}
        className={star <= Math.round(rating) ? 'star-filled' : 'star-empty'}
      />
    ))}
    {numReviews !== undefined && (
      <span className="text-xs text-gray-400 ml-1">({numReviews})</span>
    )}
  </div>
);

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart({ product, quantity: 1 }));
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error('Please login to add to wishlist'); return; }
    try {
      await api.post(`/users/wishlist/${product._id}`);
      toast.success('Wishlist updated!');
    } catch { toast.error('Failed to update wishlist'); }
  };

  const discountedPrice = product.salePrice || (product.discount ? product.price - (product.price * product.discount / 100) : product.price);
  const hasDiscount = product.discount > 0 || (product.salePrice && product.salePrice < product.price);

  return (
    <Link to={`/products/${product.slug || product._id}`} className="product-card block">
      <div className="relative overflow-hidden">
        {/* Image */}
        <div className="aspect-square bg-bg-secondary overflow-hidden">
          <img
            src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80'}
            alt={product.name}
            className="product-image w-full h-full object-cover transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80';
            }}
          />
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.discount > 0 && (
            <span className="badge bg-warm-brown text-white">
              <Tag size={10} className="mr-1" />{product.discount}% OFF
            </span>
          )}
          {product.isNew && <span className="badge bg-dark-olive text-white">NEW</span>}
          {product.isBestSeller && <span className="badge bg-terracotta text-white">🔥 Best Seller</span>}
          {product.stock === 0 && <span className="badge bg-gray-500 text-white">Out of Stock</span>}
        </div>

        {/* Quick actions overlay */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
          <button
            onClick={handleWishlist}
            className="w-9 h-9 bg-white rounded-xl shadow-md flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all duration-200"
            title="Add to Wishlist"
          >
            <Heart size={16} />
          </button>
          <Link
            to={`/products/${product.slug || product._id}`}
            className="w-9 h-9 bg-white rounded-xl shadow-md flex items-center justify-center hover:bg-dark-olive hover:text-white transition-all duration-200"
            title="Quick View"
          >
            <Eye size={16} />
          </Link>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-sage-green font-medium mb-1">{product.category?.name || 'Oil'}</p>
        <h3 className="font-semibold text-text-dark dark:text-white text-sm mb-2 line-clamp-2 leading-snug">
          {product.name}
        </h3>

        <RatingStars rating={product.ratings} numReviews={product.numReviews} />

        {/* Price */}
        <div className="flex items-center gap-2 mt-2 mb-3">
          <span className="text-lg font-bold text-forest-green dark:text-sage-green">
            ₹{Math.round(discountedPrice)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">₹{product.price}</span>
          )}
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`w-full py-2.5 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 ${
            product.stock === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-dark-olive text-white hover:bg-forest-green shadow-md hover:shadow-lg'
          }`}
        >
          <ShoppingCart size={15} />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </Link>
  );
}
