import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Star, ShoppingCart, Heart, Share2, Shield, Truck, RotateCcw, Package, ChevronLeft, ChevronRight, Plus, Minus } from 'lucide-react';
import { fetchProduct } from '../../redux/slices/productSlice';
import { addToCart } from '../../redux/slices/cartSlice';
import ProductCard from '../../components/ProductCard';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function ProductDetails() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { product, loading } = useSelector((state) => state.products);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    dispatch(fetchProduct(slug));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug, dispatch]);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes?.[0]?.size || '');
      // Fetch reviews
      api.get(`/reviews/product/${product._id}`).then(({ data }) => setReviews(data.reviews)).catch(() => {});
      // Fetch related
      api.get('/products', { params: { category: product.category?._id, limit: 4 } })
        .then(({ data }) => setRelatedProducts(data.products.filter((p) => p._id !== product._id).slice(0, 4)))
        .catch(() => {});
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;
    if (product.sizes?.length > 0 && !selectedSize) { toast.error('Please select a size'); return; }
    dispatch(addToCart({ product, quantity, size: selectedSize }));
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) { toast.error('Please login to add to wishlist'); return; }
    try {
      await api.post(`/users/wishlist/${product._id}`);
      toast.success('Wishlist updated!');
    } catch { toast.error('Failed to update wishlist'); }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg dark:bg-gray-950 pt-20 md:pt-24 flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center"><h2 className="text-2xl font-bold">Product not found</h2></div>
      </div>
    );
  }

  const discountedPrice = product.salePrice || (product.discount ? product.price - (product.price * product.discount / 100) : product.price);

  return (
    <div className="min-h-screen bg-bg dark:bg-gray-950 pt-20 md:pt-24">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <a href="/" className="hover:text-dark-olive">Home</a>
          <ChevronRight size={14} />
          <a href="/products" className="hover:text-dark-olive">Products</a>
          <ChevronRight size={14} />
          <span className="text-forest-green font-medium line-clamp-1">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* ===== IMAGE GALLERY ===== */}
          <div>
            {/* Main Image */}
            <div
              className="relative rounded-3xl overflow-hidden bg-bg-secondary aspect-square cursor-zoom-in mb-4"
              onClick={() => setIsZoomed(!isZoomed)}
            >
              <img
                src={product.images?.[selectedImage]?.url}
                alt={product.name}
                className={`w-full h-full object-cover transition-transform duration-300 ${isZoomed ? 'scale-150' : 'scale-100'}`}
              />
              {product.discount > 0 && (
                <div className="absolute top-4 left-4 bg-warm-brown text-white px-3 py-1 rounded-full text-sm font-bold">
                  {product.discount}% OFF
                </div>
              )}
              {/* Navigation */}
              {product.images?.length > 1 && (
                <>
                  <button onClick={(e) => { e.stopPropagation(); setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length); }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all">
                    <ChevronLeft size={18} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); setSelectedImage((prev) => (prev + 1) % product.images.length); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-all">
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>
            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button key={idx} onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${idx === selectedImage ? 'border-dark-olive' : 'border-transparent hover:border-sage-green'}`}>
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ===== PRODUCT INFO ===== */}
          <div className="space-y-5">
            <div>
              <p className="text-sm font-medium text-sage-green mb-1">{product.category?.name}</p>
              <h1 className="text-3xl font-display font-bold text-forest-green dark:text-white mb-2">{product.name}</h1>
              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={16} className={s <= Math.round(product.ratings) ? 'star-filled' : 'star-empty'} />
                  ))}
                </div>
                <span className="text-sm text-gray-500">({product.numReviews} reviews)</span>
                {product.extractionMethod && (
                  <span className="badge badge-green">{product.extractionMethod.replace('-', ' ')}</span>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-forest-green dark:text-sage-green">₹{Math.round(discountedPrice)}</span>
              {product.discount > 0 && (
                <>
                  <span className="text-xl text-gray-400 line-through">₹{product.price}</span>
                  <span className="text-warm-brown font-semibold">Save ₹{Math.round(product.price - discountedPrice)}</span>
                </>
              )}
            </div>

            {/* Stock */}
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
              {product.stock > 0 ? `In Stock (${product.stock} left)` : 'Out of Stock'}
            </div>

            {/* Size Selection */}
            {product.sizes?.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Select Size:</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button key={s.size} onClick={() => setSelectedSize(s.size)}
                      className={`px-4 py-2 border-2 rounded-xl text-sm font-medium transition-all ${
                        selectedSize === s.size
                          ? 'border-dark-olive bg-dark-olive text-white'
                          : 'border-gray-200 hover:border-sage-green text-gray-700 dark:text-gray-300 dark:border-gray-600'
                      }`}>
                      {s.size}
                      {s.salePrice && <span className="ml-1 text-xs">(₹{s.salePrice})</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Quantity:</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center font-semibold text-forest-green dark:text-white">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-3 pt-2">
              <button onClick={handleAddToCart} disabled={product.stock === 0}
                className="flex-1 btn-secondary py-3 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
                <ShoppingCart size={18} /> Add to Cart
              </button>
              <button onClick={handleBuyNow} disabled={product.stock === 0}
                className="flex-1 btn-primary py-3 disabled:opacity-40 disabled:cursor-not-allowed">
                Buy Now
              </button>
              <button onClick={handleWishlist} className="p-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-red-400 hover:text-red-500 transition-all">
                <Heart size={20} />
              </button>
              <button className="p-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-dark-olive hover:text-dark-olive transition-all">
                <Share2 size={20} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { icon: Truck, text: 'Free delivery on ₹500+' },
                { icon: Shield, text: 'Secure payment' },
                { icon: RotateCcw, text: '7-day returns' },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex flex-col items-center gap-1 p-3 bg-bg-secondary dark:bg-gray-800 rounded-xl text-center">
                  <Icon size={18} className="text-dark-olive" />
                  <span className="text-xs text-gray-500">{text}</span>
                </div>
              ))}
            </div>

            {/* Certifications */}
            {product.certifications?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.certifications.map((cert) => (
                  <span key={cert} className="badge badge-green">{cert}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ===== PRODUCT TABS ===== */}
        <div className="mt-14">
          <div className="flex border-b border-gray-200 dark:border-gray-700 mb-8 gap-1">
            {['description', 'ingredients', 'nutrition', 'reviews'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-sm font-semibold capitalize border-b-2 transition-all duration-200 ${
                  activeTab === tab
                    ? 'border-dark-olive text-dark-olive'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}>
                {tab === 'nutrition' ? 'Nutrition Info' : tab}
                {tab === 'reviews' && reviews.length > 0 && <span className="ml-1 text-xs">({reviews.length})</span>}
              </button>
            ))}
          </div>

          {activeTab === 'description' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-forest-green dark:text-white mb-3">About This Product</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{product.description}</p>
                {product.usageInstructions && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Usage Instructions</h4>
                    <p className="text-gray-500 text-sm">{product.usageInstructions}</p>
                  </div>
                )}
              </div>
              {product.benefits?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-forest-green dark:text-white mb-3">Key Benefits</h3>
                  <ul className="space-y-2">
                    {product.benefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="text-dark-olive mt-1">✓</span> {b}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'ingredients' && product.ingredients?.length > 0 && (
            <div>
              <h3 className="font-semibold text-forest-green dark:text-white mb-4">Ingredients</h3>
              <div className="flex flex-wrap gap-2">
                {product.ingredients.map((ing, i) => (
                  <span key={i} className="px-3 py-1.5 bg-sage-green/10 text-forest-green dark:text-sage-green rounded-full text-sm font-medium">{ing}</span>
                ))}
              </div>
              <div className="mt-4 text-sm text-gray-500 grid grid-cols-2 md:grid-cols-3 gap-3">
                {product.shelfLife && <div><strong>Shelf Life:</strong> {product.shelfLife}</div>}
                {product.storageInstructions && <div><strong>Storage:</strong> {product.storageInstructions}</div>}
                {product.countryOfOrigin && <div><strong>Origin:</strong> {product.countryOfOrigin}</div>}
              </div>
            </div>
          )}

          {activeTab === 'nutrition' && product.nutritionInfo && (
            <div className="max-w-md">
              <h3 className="font-semibold text-forest-green dark:text-white mb-4">Nutrition Information (per 100ml)</h3>
              <div className="card overflow-hidden">
                <div className="bg-forest-green text-white p-4">
                  <p className="text-sm">Nutrition Facts</p>
                  <p className="text-2xl font-bold">{product.nutritionInfo.calories || 0} Kcal</p>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {Object.entries(product.nutritionInfo)
                    .filter(([k]) => k !== 'calories')
                    .map(([k, v]) => v && (
                      <div key={k} className="flex justify-between px-4 py-2.5 text-sm">
                        <span className="text-gray-600 dark:text-gray-400 capitalize">{k.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="font-medium text-forest-green dark:text-white">{v}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              {reviews.length === 0 ? (
                <div className="text-center py-10">
                  <Star size={40} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review._id} className="card p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-sage-green to-dark-olive rounded-full flex items-center justify-center text-white font-bold">
                            {review.user?.name?.[0]}
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-forest-green dark:text-white">{review.user?.name}</p>
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <Star key={s} size={12} className={s <= review.rating ? 'star-filled' : 'star-empty'} />
                                ))}
                              </div>
                              {review.isVerifiedPurchase && <span className="badge badge-green text-xs">Verified Purchase</span>}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                      {review.title && <p className="font-medium text-sm mb-1">{review.title}</p>}
                      <p className="text-sm text-gray-600 dark:text-gray-400">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ===== RELATED PRODUCTS ===== */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="section-title mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
