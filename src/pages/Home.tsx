import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useStore } from '../store/useStore';
import ProductCard from '../components/ProductCard';
import StarRating from '../components/StarRating';
import type { Product } from '../types';
import { ArrowRight, Truck, Shield, RotateCcw, Headphones, Check, ChevronLeft, ChevronRight, Zap, Cable, Battery, Wifi, Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Michael Chen',
    role: 'IT Professional',
    content: 'The 3-in-1 charging station from Strong Multicables is exceptional. I can charge my iPhone, Apple Watch, and AirPods all at once. Perfect for my desk.',
    rating: 5,
  },
  {
    name: 'Sarah Johnson',
    role: 'Content Creator',
    content: 'The GaN charger is a game-changer. So compact yet powerful enough to charge my MacBook Pro and phone simultaneously. Best charger I have ever purchased.',
    rating: 5,
  },
  {
    name: 'David Park',
    role: 'Software Engineer',
    content: 'I love the USB-C hub. 8 ports in one compact device. Expands my MacBook perfectly for all my peripherals. Build quality is premium.',
    rating: 5,
  },
  {
    name: 'Emily Rodriguez',
    role: 'Frequent Traveler',
    content: 'The travel charging kit was exactly what I needed for my trips. All international plugs and a GaN charger in one pouch. Perfect.',
    rating: 5,
  },
];

const whyChooseUs = [
  {
    icon: Shield,
    title: 'Lifetime Warranty',
    description: 'Every product comes with our unconditional lifetime warranty. If it breaks, we replace it.',
  },
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'Free shipping on all orders over $50. Express delivery available for urgent needs.',
  },
  {
    icon: RotateCcw,
    title: '30-Day Returns',
    description: 'Not satisfied? Return any product within 30 days for a full refund, no questions asked.',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Our expert support team is available around the clock to help with any questions.',
  },
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const theme = useStore((state) => state.theme);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data: featured } = await supabase
        .from('products')
        .select('*')
        .eq('featured', true)
        .limit(4);
      const { data: best } = await supabase
        .from('products')
        .select('*')
        .eq('best_seller', true)
        .limit(4);
      setFeaturedProducts(featured || []);
      setBestSellers(best || []);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-gray-900 to-blue-900 dark:from-blue-950 dark:via-gray-950 dark:to-blue-900">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-[120px]" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400 rounded-full blur-[150px]" />
          </div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full mb-6">
                <Zap className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-300">Premium Quality Cables & Accessories</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Power Your Devices with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-300">
                  Premium Charging
                </span>
              </h1>
              <p className="text-lg text-gray-300 mb-8 max-w-xl">
                Discover the difference quality makes. From GaN fast chargers to 3-in-1 charging stations, our products are engineered for professionals who demand the best.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25"
                >
                  Shop Now
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/10 transition-colors"
                >
                  Learn More
                </Link>
              </div>
              <div className="flex gap-8 mt-10">
                <div className="flex items-center gap-2 text-gray-400">
                  <Truck className="w-5 h-5" />
                  <span className="text-sm">Free Shipping $50+</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Shield className="w-5 h-5" />
                  <span className="text-sm">Lifetime Warranty</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <RotateCcw className="w-5 h-5" />
                  <span className="text-sm">30-Day Returns</span>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-blue-500/20 rounded-3xl blur-2xl" />
                <img
                  src="https://images.pexels.com/photos/4218883/pexels-photo-4218883.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Premium cables"
                  className="relative rounded-3xl shadow-2xl shadow-blue-900/50 w-full aspect-[4/3] object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Shop by Category</h2>
            <p className="text-gray-600 dark:text-gray-400">Find the perfect cable for your needs</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: '3-in-1 Stations', icon: Battery, image: 'https://images.pexels.com/photos/4041178/pexels-photo-4041178.jpeg?auto=compress&cs=tinysrgb&w=400' },
              { name: 'GaN Chargers', icon: Zap, image: 'https://images.pexels.com/photos/4202315/pexels-photo-4202315.jpeg?auto=compress&cs=tinysrgb&w=400' },
              { name: 'Magnetic Chargers', icon: Battery, image: 'https://images.pexels.com/photos/4218883/pexels-photo-4218883.jpeg?auto=compress&cs=tinysrgb&w=400' },
              { name: 'USB-C Hubs', icon: Cable, image: 'https://images.pexels.com/photos/4792728/pexels-photo-4792728.jpeg?auto=compress&cs=tinysrgb&w=400' },
              { name: 'Travel Kits', icon: Cable, image: 'https://images.pexels.com/photos/4041178/pexels-photo-4041178.jpeg?auto=compress&cs=tinysrgb&w=400' },
              { name: 'MagSafe Accessories', icon: Cable, image: 'https://images.pexels.com/photos/4202315/pexels-photo-4202315.jpeg?auto=compress&cs=tinysrgb&w=400' },
            ].map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Link
                  to={`/shop?category=${encodeURIComponent(cat.name === '3-in-1 Stations' ? '3-in-1 Charging Stations' : cat.name === 'GaN Chargers' ? 'GaN Fast Chargers' : cat.name === 'Magnetic Chargers' ? 'Magnetic Wireless Chargers' : cat.name === 'USB-C Hubs' ? 'USB-C Charging Hubs' : cat.name === 'Travel Kits' ? 'Travel Charging Kits' : cat.name === 'MagSafe Accessories' ? 'MagSafe Accessories' : cat.name)}`}
                  className="group block relative overflow-hidden rounded-2xl aspect-square"
                >
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white font-semibold text-sm">{cat.name}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Featured Products</h2>
              <p className="text-gray-600 dark:text-gray-400">Handpicked for quality and performance</p>
            </div>
            <Link to="/shop" className="hidden sm:flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-2xl h-96" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-20 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Best Sellers</h2>
              <p className="text-gray-600 dark:text-gray-400">Our most loved products by customers</p>
            </div>
            <Link to="/shop" className="hidden sm:flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-800 rounded-2xl h-96" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bestSellers.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Why Choose Us</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We are committed to delivering the highest quality products with exceptional customer service.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
                  <item.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-blue-950 to-gray-900 dark:from-blue-950 dark:to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">What Our Customers Say</h2>
            <p className="text-gray-400">Trusted by thousands of professionals worldwide</p>
          </div>
          <div className="max-w-3xl mx-auto">
            <motion.div
              key={testimonialIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center"
            >
              <div className="flex justify-center mb-4">
                <StarRating rating={testimonials[testimonialIndex].rating} size={24} />
              </div>
              <p className="text-lg text-gray-200 mb-6 italic">
                "{testimonials[testimonialIndex].content}"
              </p>
              <div>
                <p className="font-semibold text-white">{testimonials[testimonialIndex].name}</p>
                <p className="text-sm text-gray-400">{testimonials[testimonialIndex].role}</p>
              </div>
            </motion.div>
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTestimonialIndex(i)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    i === testimonialIndex ? 'bg-blue-500' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: '50K+', label: 'Happy Customers' },
              { value: '200+', label: 'Products' },
              { value: '4.9', label: 'Average Rating' },
              { value: '24/7', label: 'Support' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <p className="text-3xl lg:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-1">{stat.value}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
