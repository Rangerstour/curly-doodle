import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Package, ArrowRight, ShoppingBag, Home } from 'lucide-react';

export default function OrderSuccess() {
  const location = useLocation();
  const orderId = location.state?.orderId || 'N/A';

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="w-full max-w-md text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <Check className="w-12 h-12 text-green-600" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Order Placed!</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Thank you for your purchase. Your order has been successfully placed.
          </p>

          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-5 h-5 text-blue-600" />
              <div className="text-left">
                <p className="text-sm text-gray-500 dark:text-gray-500">Order Number</p>
                <p className="font-semibold text-gray-900 dark:text-white">#{orderId.slice(-8)}</p>
              </div>
            </div>
            <div className="text-left text-sm text-gray-600 dark:text-gray-400">
              <p>You will receive a confirmation email shortly with your order details and tracking information.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" /> Continue Shopping
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Home className="w-4 h-4" /> Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
