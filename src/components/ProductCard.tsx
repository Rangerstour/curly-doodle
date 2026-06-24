import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ShoppingCart, Heart, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import StarRating from './StarRating';
import type { Product } from '../types';

interface Props {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: Props) {
  const addItem = useStore((state) => state.addItem);
  const isInWishlist = useStore((state) => state.isInWishlist);
  const addToWishlist = useStore((state) => state.addToWishlist);
  const removeFromWishlist = useStore((state) => state.removeFromWishlist);
  const [added, setAdded] = useState(false);

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  const discount = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link to={`/product/${product.id}`} className="group block">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-xl dark:hover:shadow-gray-900/50 transition-all duration-300 hover:-translate-y-1">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            {discount > 0 && (
              <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                -{discount}%
              </span>
            )}
            {product.best_seller && (
              <span className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                Best Seller
              </span>
            )}
            <button
              onClick={handleWishlist}
              className="absolute bottom-3 right-3 p-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-full shadow-md hover:scale-110 transition-transform"
            >
              <Heart className={`w-4 h-4 ${inWishlist ? 'text-red-500 fill-red-500' : 'text-gray-600 dark:text-gray-400'}`} />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
              {product.category}
            </p>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {product.name}
            </h3>
            <div className="mb-2">
              <StarRating rating={product.rating} size={14} showValue reviewCount={product.review_count} />
            </div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                ${product.price.toFixed(2)}
              </span>
              {product.compare_price && (
                <span className="text-sm text-gray-500 line-through">
                  ${product.compare_price.toFixed(2)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium px-2 py-1 rounded ${
                product.stock > 20
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                  : product.stock > 0
                  ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                  : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
              }`}>
                {product.stock > 20 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
              </span>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0 || added}
              className={`mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-sm transition-all ${
                added
                  ? 'bg-green-600 text-white'
                  : product.stock <= 0
                  ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" /> Added
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" /> Add to Cart
                </>
              )}
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
