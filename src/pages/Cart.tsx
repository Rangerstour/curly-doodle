import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, ArrowLeft } from 'lucide-react';

export default function Cart() {
  const items = useStore((state) => state.items);
  const removeItem = useStore((state) => state.removeItem);
  const updateQuantity = useStore((state) => state.updateQuantity);
  const getSubtotal = useStore((state) => state.getSubtotal);
  const getTax = useStore((state) => state.getTax);
  const getShipping = useStore((state) => state.getShipping);
  const getTotal = useStore((state) => state.getTotal);
  const clearCart = useStore((state) => state.clearCart);

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <ShoppingBag className="w-20 h-20 text-gray-300 dark:text-gray-700 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Your Cart is Empty</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Looks like you haven't added any items yet.</p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" /> Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={item.product_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 flex gap-4"
              >
                <img
                  src={item.product.image_url}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded-lg bg-gray-100 dark:bg-gray-800"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Link
                        to={`/product/${item.product_id}`}
                        className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">{item.product.category}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.product_id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-semibold text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 dark:text-white">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">${item.product.price.toFixed(2)} each</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            <div className="flex items-center justify-between pt-4">
              <Link
                to="/shop"
                className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Continue Shopping
              </Link>
              <button
                onClick={clearCart}
                className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 sticky top-24">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h3>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="text-gray-900 dark:text-white font-medium">${getSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                  <span className={`font-medium ${getShipping() === 0 ? 'text-green-600' : 'text-gray-900 dark:text-white'}`}>
                    {getShipping() === 0 ? 'FREE' : `$${getShipping().toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Tax (8%)</span>
                  <span className="text-gray-900 dark:text-white font-medium">${getTax().toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-800 pt-3 flex justify-between">
                  <span className="font-semibold text-gray-900 dark:text-white">Total</span>
                  <span className="font-bold text-lg text-gray-900 dark:text-white">${getTotal().toFixed(2)}</span>
                </div>
              </div>
              <Link
                to="/checkout"
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25"
              >
                Proceed to Checkout <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-xs text-center text-gray-500 dark:text-gray-500 mt-4">
                Shipping is free on orders over $50
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
