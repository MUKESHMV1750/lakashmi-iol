import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronDown, LayoutGrid, List } from 'lucide-react';
import { fetchProducts, setFilters, clearFilters } from '../../redux/slices/productSlice';
import ProductCard from '../../components/ProductCard';
import api from '../../services/api';

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'bestseller', label: 'Best Sellers' },
];

const priceRanges = [
  { label: 'Under ₹200', min: 0, max: 200 },
  { label: '₹200 - ₹500', min: 200, max: 500 },
  { label: '₹500 - ₹1000', min: 500, max: 1000 },
  { label: 'Above ₹1000', min: 1000, max: '' },
];

export default function Products() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, loading, pagination, filters } = useSelector((state) => state.products);
  const [categories, setCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [page, setPage] = useState(1);

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data.categories)).catch(() => {});
  }, []);

  useEffect(() => {
    const keyword = searchParams.get('keyword') || '';
    const category = searchParams.get('category') || '';
    if (keyword || category) {
      dispatch(setFilters({ keyword, category }));
    }
  }, [searchParams]);

  useEffect(() => {
    dispatch(fetchProducts({ ...filters, page, limit: 12 }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [filters, page, dispatch]);

  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value }));
    setPage(1);
  };

  const handlePriceRange = (range) => {
    dispatch(setFilters({ minPrice: range.min, maxPrice: range.max }));
    setPage(1);
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setPage(1);
    setSearchParams({});
  };

  const activeFilterCount = Object.values(filters).filter((v) => v && v !== 'newest').length;

  return (
    <div className="min-h-screen bg-bg dark:bg-gray-950 pt-20 md:pt-24">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-forest-green dark:text-white">
              {filters.keyword ? `Results for "${filters.keyword}"` : 'All Products'}
            </h1>
            <p className="text-gray-500 text-sm mt-1">{pagination.total} products found</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 border-2 border-dark-olive text-dark-olive font-medium rounded-xl hover:bg-dark-olive hover:text-white transition-all duration-200"
            >
              <SlidersHorizontal size={17} />
              Filters
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 bg-warm-brown text-white text-xs rounded-full flex items-center justify-center">{activeFilterCount}</span>
              )}
            </button>
            {/* Sort */}
            <div className="relative">
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="appearance-none pl-4 pr-9 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-dark-olive/30"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
            </div>
            {/* View mode */}
            <div className="hidden md:flex border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
              <button onClick={() => setViewMode('grid')} className={`p-2.5 ${viewMode === 'grid' ? 'bg-dark-olive text-white' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                <LayoutGrid size={18} />
              </button>
              <button onClick={() => setViewMode('list')} className={`p-2.5 ${viewMode === 'list' ? 'bg-dark-olive text-white' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          {showFilters && (
            <aside className="w-72 flex-shrink-0 animate-slide-up">
              <div className="card p-5 space-y-6 sticky top-24">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-forest-green dark:text-white">Filters</h3>
                  {activeFilterCount > 0 && (
                    <button onClick={handleClearFilters} className="text-xs text-warm-brown hover:text-terracotta flex items-center gap-1">
                      <X size={12} /> Clear All
                    </button>
                  )}
                </div>

                {/* Category */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Category</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="category" value="" checked={!filters.category}
                        onChange={() => handleFilterChange('category', '')} className="accent-dark-olive" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">All Categories</span>
                    </label>
                    {categories.map((cat) => (
                      <label key={cat._id} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="category" value={cat._id}
                          checked={filters.category === cat._id}
                          onChange={() => handleFilterChange('category', cat._id)} className="accent-dark-olive" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{cat.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Price Range</h4>
                  <div className="space-y-2">
                    {priceRanges.map((range) => (
                      <button key={range.label} onClick={() => handlePriceRange(range)}
                        className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-all ${
                          filters.minPrice === range.min && filters.maxPrice === range.max
                            ? 'bg-dark-olive text-white'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-bg-secondary dark:hover:bg-gray-700'
                        }`}>
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Minimum Rating</h4>
                  <div className="space-y-2">
                    {[4, 3, 2, 1].map((r) => (
                      <button key={r} onClick={() => handleFilterChange('rating', filters.rating === r ? '' : r)}
                        className={`w-full text-left text-sm px-3 py-2 rounded-lg flex items-center gap-2 transition-all ${
                          filters.rating === r ? 'bg-dark-olive text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-bg-secondary dark:hover:bg-gray-700'
                        }`}>
                        {'⭐'.repeat(r)} & above
                      </button>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Availability</h4>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={filters.inStock === 'true'}
                      onChange={(e) => handleFilterChange('inStock', e.target.checked ? 'true' : '')}
                      className="accent-dark-olive" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">In Stock Only</span>
                  </label>
                </div>
              </div>
            </aside>
          )}

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="spinner" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🛢️</div>
                <h3 className="text-xl font-semibold text-forest-green mb-2">No products found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters or search term</p>
                <button onClick={handleClearFilters} className="btn-primary">Clear Filters</button>
              </div>
            ) : (
              <>
                <div className={`grid gap-5 ${
                  viewMode === 'grid'
                    ? showFilters ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                    : 'grid-cols-1'
                }`}>
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-10">
                    <button disabled={page === 1} onClick={() => setPage(page - 1)}
                      className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium disabled:opacity-40 hover:border-dark-olive hover:text-dark-olive transition-all">
                      Previous
                    </button>
                    {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                      const p = i + Math.max(1, page - 2);
                      if (p > pagination.pages) return null;
                      return (
                        <button key={p} onClick={() => setPage(p)}
                          className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                            page === p ? 'bg-dark-olive text-white' : 'border border-gray-200 dark:border-gray-700 hover:border-dark-olive hover:text-dark-olive'
                          }`}>
                          {p}
                        </button>
                      );
                    })}
                    <button disabled={page === pagination.pages} onClick={() => setPage(page + 1)}
                      className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium disabled:opacity-40 hover:border-dark-olive hover:text-dark-olive transition-all">
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
