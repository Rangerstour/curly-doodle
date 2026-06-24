import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useStore } from '../store/useStore';
import StarRating from '../components/StarRating';
import type { Product, Review } from '../types';
import {
  ShoppingCart, Heart, Minus, Plus, Check, ArrowLeft, Truck, Shield, RotateCcw, Star, AlertCircle
} from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', content: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const addItem = useStore((state) => state.addItem);
  const isInWishlist = useStore((state) => state.isInWishlist);
  const addToWishlist = useStore((state) => state.addToWishlist);
  const removeFromWishlist = useStore((state) => state.removeFromWishlist);
  const user = useStore((state) => state.user);
  const inWishlist = isInWishlist(id || '');

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      const { data: productData } = await supabase.from('products').select('*').eq('id', id).single();
      const { data: reviewsData } = await supabase.from('reviews').select('*').eq('product_id', id).order('created_at', { ascending: false });
      setProduct(productData);
      setReviews(reviewsData || []);
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product && product.stock > 0) {
      addItem(product, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const handleWishlist = () => {
    if (!id) return;
    if (inWishlist) {
      removeFromWishlist(id);
    } else {
      addToWishlist(id);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setReviewError('Please sign in to submit a review.');
      return;
    }
    if (!reviewForm.title.trim() || !reviewForm.content.trim()) {
      setReviewError('Please fill in all fields.');
      return;
    }
    setSubmittingReview(true);
    setReviewError('');
    const { error } = await supabase.from('reviews').insert({
      product_id: id,
      user_id: user.id,
      user_email: user.email,
      rating: reviewForm.rating,
      title: reviewForm.title,
      content: reviewForm.content,
    });
    if (error) {
      setReviewError(error.message);
    } else {
      setReviewSuccess(true);
      setReviewForm({ rating: 5, title: '', content: '' });
      const { data: newReviews } = await supabase.from('reviews').select('*').eq('product_id', id).order('created_at', { ascending: false });
      setReviews(newReviews || []);
      setTimeout(() => setReviewSuccess(false), 3000);
    }
    setSubmittingReview(false);
  };

  const averageRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-2xl h-96" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Product Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The product you are looking for does not exist.</p>
          <Link to="/shop" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const discount = product.compare_price ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100) : 0;

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-8">
          <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-blue-600 transition-colors">Shop</Link>
          <span>/</span>
          <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-blue-600 transition-colors">{product.category}</Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white truncate max-w-[200px]">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Image */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="relative">
            <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
              <img src={product.image_url} alt={product.name} className="w-full aspect-square object-cover" />
            </div>
            {discount > 0 && (
              <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-lg">
                -{discount}%
              </span>
            )}
          </motion.div>

          {/* Details */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">
                {product.category}
              </p>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <StarRating rating={averageRating || product.rating} size={20} showValue reviewCount={reviews.length || product.review_count} />
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">${product.price.toFixed(2)}</span>
              {product.compare_price && (
                <span className="text-xl text-gray-500 line-through">${product.compare_price.toFixed(2)}</span>
              )}
            </div>

            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{product.description}</p>

            {/* Quantity and Add to Cart */}
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0 || added}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold transition-all ${
                  added
                    ? 'bg-green-600 text-white'
                    : product.stock <= 0
                    ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/25'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5" /> Added to Cart
                  </>
                ) : product.stock <= 0 ? (
                  'Out of Stock'
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" /> Add to Cart
                  </>
                )}
              </button>
              <button
                onClick={handleWishlist}
                className={`p-3.5 rounded-xl border transition-all ${
                  inWishlist
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-800'
                    : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'text-red-500 fill-red-500' : 'text-gray-600 dark:text-gray-400'}`} />
              </button>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${product.stock > 20 ? 'bg-green-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-red-500'}`} />
              <span className={`text-sm font-medium ${
                product.stock > 20 ? 'text-green-600 dark:text-green-400' : product.stock > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {product.stock > 20 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left in stock` : 'Out of Stock'}
              </span>
            </div>

            {/* Shipping Info */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Truck className="w-4 h-4 text-blue-600" />
                Free Shipping $50+
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Shield className="w-4 h-4 text-blue-600" />
                Lifetime Warranty
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <RotateCcw className="w-4 h-4 text-blue-600" />
                30-Day Returns
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="flex border-b border-gray-200 dark:border-gray-800">
            {(['description', 'specs', 'reviews'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 text-sm font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {tab}
                {tab === 'reviews' && ` (${reviews.length})`}
              </button>
            ))}
          </div>

          <div className="p-6 lg:p-8">
            {activeTab === 'description' && (
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{product.description}</p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                  Built with premium materials and engineered for maximum performance, this {product.category.toLowerCase()} delivers reliable connectivity and exceptional durability. Whether you are a professional or a home user, this product meets the highest standards.
                </p>
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Key Features</h4>
                  <ul className="space-y-2">
                    {product.tags?.map((tag) => (
                      <li key={tag} className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Check className="w-4 h-4 text-green-500" />
                        {tag.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Technical Specifications</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {product.specs && Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <span className="font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">{key}</span>
                      <span className="text-gray-600 dark:text-gray-400">{value}</span>
                    </div>
                  ))}
                  <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">SKU</span>
                    <span className="text-gray-600 dark:text-gray-400">{product.sku}</span>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="font-medium text-gray-700 dark:text-gray-300 min-w-[120px]">Stock</span>
                    <span className="text-gray-600 dark:text-gray-400">{product.stock} units</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-8">
                {/* Rating Summary */}
                <div className="flex items-center gap-8 mb-8">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-gray-900 dark:text-white">{averageRating.toFixed(1)}</p>
                    <StarRating rating={averageRating} size={18} />
                    <p className="text-sm text-gray-500 mt-1">{reviews.length} reviews</p>
                  </div>
                  <div className="flex-1 space-y-1">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count = reviews.filter((r) => r.rating === rating).length;
                      const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                      return (
                        <div key={rating} className="flex items-center gap-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400 w-3">{rating}</span>
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-sm text-gray-500 w-8 text-right">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Review Form */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Write a Review</h4>
                  {reviewError && (
                    <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" /> {reviewError}
                    </div>
                  )}
                  {reviewSuccess && (
                    <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-sm flex items-center gap-2">
                      <Check className="w-4 h-4" /> Review submitted successfully!
                    </div>
                  )}
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rating</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                            className="p-1 hover:scale-110 transition-transform"
                          >
                            <Star className={`w-6 h-6 ${star <= reviewForm.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-300'}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
                      <input
                        type="text"
                        value={reviewForm.title}
                        onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Summarize your experience"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Review</label>
                      <textarea
                        value={reviewForm.content}
                        onChange={(e) => setReviewForm({ ...reviewForm, content: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Share your experience with this product"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                  {reviews.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Star className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No reviews yet. Be the first to review!</p>
                    </div>
                  ) : (
                    reviews.map((review) => (
                      <div key={review.id} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                                {review.user_email.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white text-sm">{review.user_email.split('@')[0]}</p>
                              <p className="text-xs text-gray-500">{new Date(review.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <StarRating rating={review.rating} size={14} />
                        </div>
                        <h5 className="font-semibold text-gray-900 dark:text-white mb-1">{review.title}</h5>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{review.content}</p>
                        {review.verified_purchase && (
                          <span className="inline-flex items-center gap-1 mt-2 text-xs text-green-600 dark:text-green-400 font-medium">
                            <Check className="w-3 h-3" /> Verified Purchase
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
