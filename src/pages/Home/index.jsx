import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import {
  ChevronRight, Leaf, Award, Truck, Shield, Star,
  ArrowRight, Droplets, Flame, Heart, ShoppingBag, Sparkles, Filter
} from 'lucide-react';
import { fetchProducts, fetchFeatured, fetchBestSellers } from '../../redux/slices/productSlice';
import ProductCard from '../../components/ProductCard';
import api from '../../services/api';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

// Fallback high quality hero slides
const defaultHeroSlides = [
  {
    title: 'Cold Pressed',
    highlight: 'Groundnut Oil',
    desc: 'Pure, natural flavour extracted through traditional wood pressing. Rich in Vitamin E and antioxidants.',
    cta: 'Shop Groundnut Oil',
    link: '/products?keyword=groundnut',
    bg: 'from-black/50 via-black/20 to-transparent',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1920&q=80',
    badge: '100% Natural & Pure',
  },
  {
    title: 'Pure Premium',
    highlight: 'Sesame Gingelly Oil',
    desc: 'Ancient wisdom meets modern health. Our gingelly oil is loaded with lignans, minerals and healthy fats.',
    cta: 'Shop Sesame Oil',
    link: '/products?keyword=sesame',
    bg: 'from-black/50 via-black/20 to-transparent',
    image: 'https://images.unsplash.com/photo-1559181567-c3190bfa4614?auto=format&fit=crop&w=1920&q=80',
    badge: 'Traditional Recipe',
  },
  {
    title: 'Organic Virgin',
    highlight: 'Coconut Oil',
    desc: 'Hand-picked coconuts, cold-pressed to preserve every nutrient. Perfect for cooking, skin and hair.',
    cta: 'Shop Coconut Oil',
    link: '/products?keyword=coconut',
    bg: 'from-black/50 via-black/20 to-transparent',
    image: 'https://images.unsplash.com/photo-1621517948804-5a7cbcff8935?auto=format&fit=crop&w=1920&q=80',
    badge: 'FSSAI Certified',
  },
];

// Fallback products when database has 0 products
const fallbackProducts = [
  {
    _id: 'p1',
    name: 'Pure Cold Pressed Groundnut Oil (Marachekku)',
    slug: 'pure-cold-pressed-groundnut-oil',
    price: 320,
    discount: 15,
    ratings: 4.8,
    numReviews: 124,
    stock: 50,
    category: { name: 'Groundnut Oil' },
    images: [{ url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80' }],
    isFeatured: true,
    isBestSeller: true,
  },
  {
    _id: 'p2',
    name: 'Traditional Wood Pressed Sesame Oil (Gingelly)',
    slug: 'traditional-wood-pressed-sesame-oil',
    price: 450,
    discount: 10,
    ratings: 4.9,
    numReviews: 98,
    stock: 35,
    category: { name: 'Sesame Oil' },
    images: [{ url: 'https://images.unsplash.com/photo-1559181567-c3190bfa4614?auto=format&fit=crop&w=600&q=80' }],
    isFeatured: true,
    isBestSeller: true,
  },
  {
    _id: 'p3',
    name: 'Virgin Organic Coconut Oil (Unrefined)',
    slug: 'virgin-organic-coconut-oil',
    price: 380,
    discount: 20,
    ratings: 4.7,
    numReviews: 86,
    stock: 40,
    category: { name: 'Coconut Oil' },
    images: [{ url: 'https://images.unsplash.com/photo-1621517948804-5a7cbcff8935?auto=format&fit=crop&w=600&q=80' }],
    isFeatured: true,
    isBestSeller: false,
  },
  {
    _id: 'p4',
    name: 'Kachi Ghani Cold Pressed Mustard Oil',
    slug: 'kachi-ghani-cold-pressed-mustard-oil',
    price: 290,
    discount: 12,
    ratings: 4.6,
    numReviews: 62,
    stock: 25,
    category: { name: 'Mustard Oil' },
    images: [{ url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80' }],
    isFeatured: true,
    isBestSeller: true,
  },
  {
    _id: 'p5',
    name: 'Extra Virgin Spanish Olive Oil (100% Organic)',
    slug: 'extra-virgin-spanish-olive-oil',
    price: 890,
    discount: 18,
    ratings: 4.9,
    numReviews: 142,
    stock: 20,
    category: { name: 'Olive Oil' },
    images: [{ url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80' }],
    isFeatured: true,
    isBestSeller: false,
  },
  {
    _id: 'p6',
    name: 'Cold Pressed Sunflower Cooking Oil',
    slug: 'cold-pressed-sunflower-cooking-oil',
    price: 260,
    discount: 8,
    ratings: 4.5,
    numReviews: 45,
    stock: 30,
    category: { name: 'Sunflower Oil' },
    images: [{ url: 'https://images.unsplash.com/photo-1559181567-c3190bfa4614?auto=format&fit=crop&w=600&q=80' }],
    isFeatured: true,
    isBestSeller: false,
  },
  {
    _id: 'p7',
    name: 'Organic Black Sesame (Til) Cold Pressed Oil',
    slug: 'organic-black-sesame-til-cold-pressed-oil',
    price: 490,
    discount: 15,
    ratings: 4.8,
    numReviews: 78,
    stock: 15,
    category: { name: 'Sesame Oil' },
    images: [{ url: 'https://images.unsplash.com/photo-1559181567-c3190bfa4614?auto=format&fit=crop&w=600&q=80' }],
    isFeatured: true,
    isBestSeller: true,
  },
  {
    _id: 'p8',
    name: 'Pure Wood Pressed Castor Oil',
    slug: 'pure-wood-pressed-castor-oil',
    price: 220,
    discount: 10,
    ratings: 4.7,
    numReviews: 53,
    stock: 45,
    category: { name: 'Specialty Oil' },
    images: [{ url: 'https://images.unsplash.com/photo-1621517948804-5a7cbcff8935?auto=format&fit=crop&w=600&q=80' }],
    isFeatured: true,
    isBestSeller: false,
  },
];

const categories = [
  { name: 'Groundnut Oil', icon: '🥜', color: 'bg-amber-50 border-amber-200', hoverColor: 'hover:bg-amber-100', count: '12 Products' },
  { name: 'Sesame Oil', icon: '✨', color: 'bg-yellow-50 border-yellow-200', hoverColor: 'hover:bg-yellow-100', count: '8 Products' },
  { name: 'Coconut Oil', icon: '🥥', color: 'bg-green-50 border-green-200', hoverColor: 'hover:bg-green-100', count: '10 Products' },
  { name: 'Mustard Oil', icon: '🌼', color: 'bg-orange-50 border-orange-200', hoverColor: 'hover:bg-orange-100', count: '6 Products' },
  { name: 'Olive Oil', icon: '🫒', color: 'bg-lime-50 border-lime-200', hoverColor: 'hover:bg-lime-100', count: '5 Products' },
  { name: 'Sunflower Oil', icon: '🌻', color: 'bg-yellow-50 border-yellow-200', hoverColor: 'hover:bg-yellow-100', count: '4 Products' },
];

const whyUs = [
  { icon: Leaf, title: 'Certified Organic', desc: 'All our oils are FSSAI certified and organically sourced from verified farms.' },
  { icon: Droplets, title: 'Cold Pressed', desc: 'Traditional wood pressing preserves natural nutrients, flavour and aroma.' },
  { icon: Award, title: 'Award Winning', desc: 'Recognized as the best organic oil brand in Tamil Nadu for 3 consecutive years.' },
  { icon: Truck, title: 'Fast Delivery', desc: 'Free delivery on orders above ₹500. 2-4 day express delivery pan India.' },
  { icon: Shield, title: 'Quality Assured', desc: 'Every batch is lab-tested for purity, authenticity and zero adulteration.' },
  { icon: Heart, title: 'Farmer Friendly', desc: 'Direct farm-to-table. We support 200+ local farmers across Tamil Nadu.' },
];

const testimonials = [
  { name: 'Priya Ramesh', location: 'Chennai', rating: 5, text: 'The groundnut oil is absolutely pure! You can smell the difference. My family has switched completely to Oil Business products.' },
  { name: 'Arjun Sharma', location: 'Mumbai', rating: 5, text: 'Excellent quality sesame oil. I use it for cooking and oil pulling. Fast delivery and beautiful packaging.' },
  { name: 'Meena Krishnamurthy', location: 'Coimbatore', rating: 5, text: 'The coconut oil is divine! Cold pressed and pure. My hair and skin have never been better. Highly recommend!' },
  { name: 'Ravi Kumar', location: 'Bangalore', rating: 4, text: 'Great quality oils. The price is a bit premium but completely worth it for the purity and taste you get.' },
];

export default function Home() {
  const dispatch = useDispatch();
  const { products, featuredProducts, bestSellers, loading } = useSelector((state) => state.products);
  const [heroSlideData, setHeroSlideData] = useState(defaultHeroSlides);
  const [selectedCatFilter, setSelectedCatFilter] = useState('All');

  useEffect(() => {
    dispatch(fetchProducts({ limit: 12 }));
    dispatch(fetchFeatured());
    dispatch(fetchBestSellers());

    // Fetch admin banners
    api.get('/banners').then(({ data }) => {
      if (data.banners?.length > 0) {
        const activeBanners = data.banners.filter((b) => b.isActive !== false);
        if (activeBanners.length > 0) {
          const formatted = activeBanners.map((b) => ({
            title: b.subtitle || '100% Pure Organic',
            highlight: b.title || 'Wood-Pressed Oil',
            desc: b.description || 'Cold-pressed traditional oils preserving essential nutrients.',
            cta: b.buttonText || 'Explore Now',
            link: b.link || '/products',
            bg: 'from-amber-950/80 via-amber-900/60 to-transparent',
            image: b.image?.url || defaultHeroSlides[0].image,
            badge: 'Featured Special',
          }));
          setHeroSlideData(formatted);
        }
      }
    }).catch(() => {});
  }, [dispatch]);

  // Compute products to render
  const effectiveAllProducts = products?.length > 0 ? products : fallbackProducts;
  const effectiveFeatured = featuredProducts?.length > 0 ? featuredProducts : effectiveAllProducts.slice(0, 8);
  const effectiveBestSellers = bestSellers?.length > 0 ? bestSellers : effectiveAllProducts.slice(0, 4);

  // Filtered products for section tab
  const filteredProducts = selectedCatFilter === 'All'
    ? effectiveAllProducts
    : effectiveAllProducts.filter((p) =>
        p.category?.name?.toLowerCase().includes(selectedCatFilter.toLowerCase()) ||
        p.name?.toLowerCase().includes(selectedCatFilter.toLowerCase())
      );

  return (
    <div className="overflow-x-hidden">
      {/* ===== HERO CAROUSEL ===== */}
      <section className="relative w-full bg-forest-green overflow-hidden">
        <Swiper
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation
          loop
          className="h-screen min-h-[650px] w-full relative overflow-hidden"
        >
          {heroSlideData.map((slide, idx) => (
            <SwiperSlide key={idx}>
              <div className="relative w-full h-full bg-forest-green overflow-hidden">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover object-center"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultHeroSlides[idx % defaultHeroSlides.length].image;
                  }}
                />
                {/* Light gradient overlay for text readability without dimming image */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent pointer-events-none" />

                {/* Content Container */}
                <div className="absolute inset-0 flex items-center pt-20 md:pt-24">
                  <div className="max-w-7xl mx-auto px-6 w-full">
                    <div className="max-w-xl text-white animate-slide-up drop-shadow-md">
                      <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-amber-400 text-forest-green font-bold text-xs rounded-full mb-4 shadow-md uppercase tracking-wider">
                        <Sparkles size={13} /> {slide.badge}
                      </span>
                      <h2 className="text-lg font-bold text-amber-300 mb-2 drop-shadow-sm">{slide.title}</h2>
                      <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold mb-4 leading-tight drop-shadow-lg">
                        {slide.highlight}
                      </h1>
                      <p className="text-white text-base md:text-lg mb-8 leading-relaxed font-medium drop-shadow-md">{slide.desc}</p>
                      <div className="flex flex-wrap gap-4">
                        <Link to={slide.link} className="btn-primary bg-warm-brown hover:bg-terracotta text-white px-8 py-4 text-base shadow-xl flex items-center gap-2">
                          {slide.cta} <ArrowRight size={18} />
                        </Link>
                        <Link to="/about" className="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-forest-green transition-all duration-200 backdrop-blur-md shadow-md">
                          Our Story
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-white/70 pointer-events-none">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-0.5 h-8 bg-white/50 animate-pulse" />
        </div>
      </section>

      {/* ===== TRUST BADGES ===== */}
      <section className="bg-gradient-to-r from-forest-green via-dark-olive to-forest-green text-white py-6 border-y border-amber-500/20 shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: '🏆', text: 'Award Winning Quality', sub: 'Traditional Marachekku' },
              { icon: '🌿', text: 'FSSAI Certified', sub: '100% Organic Seeds' },
              { icon: '🚚', text: 'Free Delivery ₹500+', sub: 'Express Shipping' },
              { icon: '↩️', text: '7-Day Easy Returns', sub: 'Guaranteed Purity' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-center gap-3">
                <span className="text-3xl">{item.icon}</span>
                <div className="text-left">
                  <p className="text-sm font-bold leading-snug">{item.text}</p>
                  <p className="text-xs text-amber-200/80 font-light">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED CATEGORIES ===== */}
      <section className="section">
        <div className="text-center mb-10">
          <p className="text-warm-brown font-bold text-xs uppercase tracking-widest mb-2">Explore Pure Oils</p>
          <h2 className="section-title">Our Oil Collection</h2>
          <p className="section-subtitle">Premium cold-pressed & wood-pressed oils for health & taste</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/products?keyword=${encodeURIComponent(cat.name)}`}
              className={`${cat.color} ${cat.hoverColor} border-2 rounded-2xl p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover group`}
            >
              <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">{cat.icon}</div>
              <h3 className="text-sm font-bold text-forest-green mb-1">{cat.name}</h3>
              <p className="text-xs text-gray-500">{cat.count}</p>
            </Link>
          ))}
        </div>
      </section>



      {/* ===== PROMO BANNER ===== */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-forest-green via-dark-olive to-forest-green rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 text-white relative overflow-hidden shadow-2xl border border-amber-500/20">
          <div className="absolute inset-0 bg-hero-pattern opacity-10" />
          <div className="relative z-10">
            <span className="inline-block px-3 py-1 bg-amber-400 text-forest-green font-bold text-xs rounded-full mb-3 uppercase tracking-wider">
              Special Discount
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">
              Get 20% OFF on Your<br />First Order!
            </h2>
            <p className="text-amber-100 text-base mb-4">Use code <strong className="text-amber-300 text-xl font-black bg-white/10 px-3 py-1 rounded-lg">FRESH20</strong> at checkout</p>
          </div>
          <div className="relative z-10 text-center">
            <div className="text-7xl mb-4 animate-bounce-soft">🛢️</div>
            <Link to="/products" className="inline-block px-8 py-3.5 bg-amber-400 text-forest-green font-bold rounded-xl hover:bg-amber-300 transition-all duration-200 shadow-xl text-base">
              Shop Discount Now
            </Link>
          </div>
        </div>
      </section>

      {/* ===== BEST SELLERS SECTION ===== */}
      {effectiveBestSellers.length > 0 && (
        <section className="section">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-warm-brown font-bold text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
                <Flame size={16} className="text-amber-500 fill-amber-500" /> Customer Favorites
              </p>
              <h2 className="section-title">Best Sellers</h2>
            </div>
            <Link to="/products?sort=bestseller" className="hidden md:flex items-center gap-2 text-dark-olive font-bold hover:gap-3 transition-all duration-200">
              View All Best Sellers <ChevronRight size={18} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {effectiveBestSellers.slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* ===== WHY CHOOSE US ===== */}
      <section className="section bg-bg-secondary dark:bg-gray-900/50 px-4 py-16 border-t border-gray-200/50 dark:border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-warm-brown font-bold text-xs uppercase tracking-widest mb-2">Why Oil Business</p>
            <h2 className="section-title">Quality & Purity You Can Trust</h2>
            <p className="section-subtitle">From certified organic farms directly to your kitchen</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyUs.map(({ icon: Icon, title, desc }, i) => (
              <div key={i} className="card p-6 hover:-translate-y-1 transition-transform duration-300 group">
                <div className="w-12 h-12 bg-dark-olive/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-dark-olive group-hover:text-white transition-all duration-300">
                  <Icon size={22} className="text-dark-olive group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-display font-semibold text-lg text-forest-green dark:text-white mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CUSTOMER REVIEWS ===== */}
      <section className="section">
        <div className="text-center mb-12">
          <p className="text-warm-brown font-bold text-xs uppercase tracking-widest mb-2">Real Reviews</p>
          <h2 className="section-title">What Our Customers Say</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="card p-5 hover:-translate-y-1 transition-all duration-300">
              <div className="flex mb-3">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} size={14} className={j < t.rating ? 'star-filled' : 'star-empty'} />
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-sage-green to-dark-olive rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {t.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-sm text-forest-green dark:text-white">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== NEWSLETTER ===== */}
      <section className="bg-gradient-to-r from-warm-brown via-terracotta to-warm-brown text-white py-16 shadow-xl">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <p className="text-amber-200 font-bold text-xs uppercase tracking-widest mb-2">Stay Healthy</p>
          <h2 className="font-display text-3xl font-bold mb-4">Join Our Pure Health Community</h2>
          <p className="text-white/90 mb-8 font-light">Get exclusive discount codes, recipes, and health tips delivered directly to your inbox.</p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-5 py-3.5 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:border-white text-sm"
            />
            <button type="submit" className="px-6 py-3.5 bg-white text-warm-brown font-bold rounded-xl hover:bg-amber-50 transition-colors text-sm shadow-md">
              Subscribe
            </button>
          </form>
          <p className="text-white/70 text-xs mt-3">No spam. Unsubscribe anytime.</p>
        </div>
      </section>
    </div>
  );
}
