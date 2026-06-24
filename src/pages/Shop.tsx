import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import ProductCard from '../components/ProductCard';
import { useStore } from '../store/useStore';
import type { Product, SortOption } from '../types';
import {
  SlidersHorizontal, Grid3X3, LayoutList, ChevronDown, X, Heart, Search
} from 'lucide-react';

const categories = ['All', 'USB Cables', 'HDMI Cables', 'Charging Adapters', 'Power Cables', 'Audio Cables', 'Network Cables'];

const sortOptions: { label: string; value: SortOption }[] = [
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Most Popular', value: 'popularity' },
  { label: 'Newest', value: 'newest' },
  { label: 'Highest Rated', value: 'rating' },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [minRating, setMinRating] = useState(0);
  const wishlist = useStore((state) => state.wishlist);
  const wishlistMode = searchParams.get('wishlist') === 'true';

  const selectedCategory = searchParams.get('category') || 'All';
  const searchQuery = searchParams.get('search') || '';
  const sortBy = (searchParams.get('sort') as SortOption) || 'popularity';

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      let query = supabase.from('products').select('*');

      if (selectedCategory !== 'All') {
        query = query.eq('category', selectedCategory);
      }
      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,tags.cs.{${searchQuery}}`);
      }
      if (wishlistMode && wishlist.length > 0) {
        query = query.in('id', wishlist);
      }
      if (minRating > 0) {
        query = query.gte('rating', minRating);
      }
      if (priceRange[0] > 0) {
        query = query.gte('price', priceRange[0]);
      }
      if (priceRange[1] < 200) {
        query = query.lte('price', priceRange[1]);
      }

      // Sorting
      switch (sortBy) {
        case 'price-asc':
          query = query.order('price', { ascending: true });
          break;
        case 'price-desc':
          query = query.order('price', { ascending: false });
          break;
        case 'popularity':
          query = query.order('review_count', { ascending: false });
          break;
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'rating':
          query = query.order('rating', { ascending: false });
          break;
        default:
          query = query.order('review_count', { ascending: false });
      }

      const { data } = await query;
      setProducts(data || []);
      setLoading(false);
    };
    fetchProducts();
  }, [selectedCategory, searchQuery, sortBy, wishlistMode, wishlist, minRating, priceRange]);

  const updateSearchParam = useCallback(
    (key: string, value: string | null) => {
      const newParams = new URLSearchParams(searchParams);
      if (value === null || value === 'All') {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams]
  );

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
    setPriceRange([0, 200]);
    setMinRating(0);
  };

  const hasFilters = selectedCategory !== 'All' || searchQuery || minRating > 0 || priceRange[0] > 0 || priceRange[1] < 200;

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {wishlistMode ? 'Your Wishlist' : searchQuery ? `Search: "${searchQuery}"` : selectedCategory !== 'All' ? selectedCategory : 'All Products'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {products.length} {products.length === 1 ? 'product' : 'products'} found
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {hasFilters && (
                <span className="w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                  !
                </span>
              )}
            </button>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 transition-colors"
              >
                <X className="w-4 h-4" /> Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => updateSearchParam('sort', e.target.value)}
                className="appearance-none px-4 py-2 pr-10 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>

            {/* View toggle */}
            <div className="flex border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
              >
                <LayoutList className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters Sidebar */}
        <div className="flex gap-8">
          {showFilters && (
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-64 flex-shrink-0 hidden lg:block"
            >
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-6">
                {/* Categories */}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Categories</h4>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => updateSearchParam('category', cat === 'All' ? null : cat)}
                        className={`block text-sm w-full text-left py-1 px-2 rounded transition-colors ${
                          selectedCategory === cat
                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Price Range</h4>
                  <div className="flex items-center gap-2 mb-3">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="w-20 px-2 py-1 text-sm bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-20 px-2 py-1 text-sm bg-gray-100 dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-700"
                    />
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Minimum Rating</h4>
                  <div className="space-y-2">
                    {[4, 3, 2, 1].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setMinRating(minRating === rating ? 0 : rating)}
                        className={`flex items-center gap-2 text-sm py-1 px-2 rounded transition-colors w-full ${
                          minRating === rating
                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                      >
                        <span className="text-yellow-400">{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</span>
                        <span>& Up</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.aside>
          )}

          {/* Products */}
          <div className="flex-1">
            {loading ? (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-2xl h-96" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No products found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Try adjusting your filters or search terms.</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {products.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
