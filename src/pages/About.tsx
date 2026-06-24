import { motion } from 'framer-motion';
import { Zap, Shield, Truck, Headphones, Award, Users, Target, Globe, Factory, ThumbsUp, Check } from 'lucide-react';

const stats = [
  { value: '50K+', label: 'Happy Customers' },
  { value: '200+', label: 'Products' },
  { value: '15+', label: 'Years Experience' },
  { value: '99.9%', label: 'Satisfaction Rate' },
];

const values = [
  {
    icon: Target,
    title: 'Quality First',
    description: 'Every product undergoes rigorous testing to meet industry standards. We never compromise on quality.',
  },
  {
    icon: Shield,
    title: 'Customer Trust',
    description: 'Our lifetime warranty and 30-day returns policy reflect our confidence in our products.',
  },
  {
    icon: Factory,
    title: 'Innovation',
    description: 'We stay ahead of technology trends, offering the latest USB-C, HDMI 2.1, and GaN charging solutions.',
  },
  {
    icon: Globe,
    title: 'Global Reach',
    description: 'We serve customers worldwide with fast shipping and local support in multiple languages.',
  },
];

export default function About() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-full mb-6">
              <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-400">Our Story</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Connecting the World with{' '}
              <span className="text-blue-600">Premium Quality</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Strong Multicables was founded with a simple mission: to provide professionals and consumers with the highest quality cables and charging solutions on the market.
            </p>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 text-center"
            >
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">{stat.value}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Our Story */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Story</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              Founded in 2010, Strong Multicables began as a small team of engineers frustrated with the poor quality of cables available on the market. We saw cables failing, devices not charging properly, and data transfers corrupted.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              We decided to change that. Starting with our flagship USB-C cable, we built a reputation for products that simply work — every time, all the time.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Today, we serve over 50,000 customers across 40 countries, with a product line spanning USB cables, HDMI cables, charging adapters, power cables, audio cables, and network cables.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-blue-500/10 rounded-3xl blur-2xl" />
            <img
              src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Our team"
              className="relative rounded-2xl shadow-xl w-full aspect-[4/3] object-cover"
            />
          </motion.div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Our Values</h2>
            <p className="text-gray-600 dark:text-gray-400">The principles that guide everything we do</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6"
              >
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{value.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Certifications & Standards</h2>
            <p className="text-gray-600 dark:text-gray-400">Our products meet the highest industry standards</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {['MFi Certified', 'USB-IF Certified', 'HDMI Premium', 'UL Listed', 'CE Marked', 'RoHS Compliant', 'FCC Approved', 'ISO 9001'].map((cert) => (
              <div key={cert} className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{cert}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
