import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Package, ShoppingBag, Users, Star, TrendingUp, DollarSign,
  ChevronDown, ArrowUp, ArrowDown, Edit2, Trash2, Plus, X, Check, AlertCircle,
  Search, BarChart3, Boxes, CircleDollarSign
} from 'lucide-react';
import type { Product, Order } from '../types';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalCustomers: number;
  recentOrders: Order[];
  topProducts: Product[];
}

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'reviews', label: 'Reviews', icon: Star },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCustomers: 0,
    recentOrders: [],
    topProducts: [],
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '', description: '', price: 0, compare_price: 0, category: '', stock: 0, sku: '',
    image_url: '', featured: false, best_seller: false,
  });
  const [orderFilter, setOrderFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [perPage] = useState(10);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [formError, setFormError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const user = useStore((state) => state.user);

  const fetchData = async () => {
    setLoading(true);
    const [productsData, ordersData, customersData, reviewsData] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
      supabase.from('users').select('id, email, created_at'),
      supabase.from('reviews').select('*, product:product_id(name, image_url)').order('created_at', { ascending: false }),
    ]);
    const prods = productsData.data || [];
    const ords = ordersData.data || [];
    const custs = customersData.data || [];
    const revs = reviewsData.data || [];
    setProducts(prods);
    setOrders(ords);
    setCustomers(custs);
    setReviews(revs);
    setStats({
      totalOrders: ords.length,
      totalRevenue: ords.reduce((sum, o) => sum + (o.total || 0), 0),
      totalProducts: prods.length,
      totalCustomers: custs.length,
      recentOrders: ords.slice(0, 5),
      topProducts: prods.sort((a, b) => b.review_count - a.review_count).slice(0, 5),
    });
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveProduct = async () => {
    setFormError('');
    if (!productForm.name?.trim() || !productForm.price || !productForm.sku?.trim()) {
      setFormError('Name, price, and SKU are required.');
      return;
    }
    const payload = {
      ...productForm,
      price: Number(productForm.price),
      compare_price: Number(productForm.compare_price) || null,
      stock: Number(productForm.stock) || 0,
    };
    if (editingProduct) {
      const { error } = await supabase.from('products').update(payload).eq('id', editingProduct.id);
      if (error) setFormError(error.message);
      else setSaveSuccess(true);
    } else {
      const { error } = await supabase.from('products').insert(payload);
      if (error) setFormError(error.message);
      else setSaveSuccess(true);
    }
    if (saveSuccess || !formError) {
      setShowProductModal(false);
      setEditingProduct(null);
      setProductForm({ name: '', description: '', price: 0, compare_price: 0, category: '', stock: 0, sku: '', image_url: '', featured: false, best_seller: false });
      fetchData();
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    await supabase.from('products').delete().eq('id', id);
    setDeleteConfirm(null);
    fetchData();
  };

  const handleUpdateOrderStatus = async (id: string, status: string) => {
    await supabase.from('orders').update({ status }).eq('id', id);
    fetchData();
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredOrders = orderFilter === 'all' ? orders : orders.filter((o) => o.status === orderFilter);

  const paginatedProducts = filteredProducts.slice(page * perPage, (page + 1) * perPage);
  const totalPages = Math.ceil(filteredProducts.length / perPage);

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' },
          { label: 'Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'bg-green-100 dark:bg-green-900/30 text-green-600' },
          { label: 'Products', value: stats.totalProducts, icon: Package, color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600' },
          { label: 'Customers', value: stats.totalCustomers, icon: Users, color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {stats.recentOrders.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No orders yet</p>
            ) : (
              stats.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">#{order.id.slice(-8)}</p>
                    <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">${order.total.toFixed(2)}</p>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                      order.status === 'delivered' ? 'bg-green-100 dark:bg-green-900/30 text-green-700' :
                      order.status === 'shipped' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700' :
                      order.status === 'cancelled' ? 'bg-red-100 dark:bg-red-900/30 text-red-700' :
                      'bg-amber-100 dark:bg-amber-900/30 text-amber-700'
                    }`}>{order.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Top Products</h3>
          <div className="space-y-3">
            {stats.topProducts.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No products yet</p>
            ) : (
              stats.topProducts.map((product, i) => (
                <div key={product.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</span>
                  <img src={product.image_url} alt={product.name} className="w-10 h-10 object-cover rounded-lg" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.review_count} reviews</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">${product.price.toFixed(2)}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => { setEditingProduct(null); setProductForm({ name: '', description: '', price: 0, compare_price: 0, category: '', stock: 0, sku: '', image_url: '', featured: false, best_seller: false }); setFormError(''); setShowProductModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Product</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">SKU</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Price</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Stock</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {paginatedProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={product.image_url} alt={product.name} className="w-10 h-10 object-cover rounded-lg" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{product.sku}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-medium">${product.price.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{product.stock}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      product.stock > 0 ? 'bg-green-100 dark:bg-green-900/30 text-green-700' : 'bg-red-100 dark:bg-red-900/30 text-red-700'
                    }`}>
                      {product.stock > 0 ? 'Active' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => { setEditingProduct(product); setProductForm(product); setFormError(''); setShowProductModal(true); }}
                        className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(product.id)}
                        className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-800">
            <p className="text-sm text-gray-500">Showing {page * perPage + 1} to {Math.min((page + 1) * perPage, filteredProducts.length)} of {filteredProducts.length}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0} className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-lg text-sm disabled:opacity-50">Previous</button>
              <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1} className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-lg text-sm disabled:opacity-50">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <select
          value={orderFilter}
          onChange={(e) => setOrderFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Order</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Customer</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Date</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Total</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Payment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">#{order.id.slice(-8)}</p>
                    <p className="text-xs text-gray-500">{order.items?.length || 0} items</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{order.shipping_address?.first_name} {order.shipping_address?.last_name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">${order.total.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                      className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer ${
                        order.status === 'delivered' ? 'bg-green-100 dark:bg-green-900/30 text-green-700' :
                        order.status === 'shipped' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700' :
                        order.status === 'cancelled' ? 'bg-red-100 dark:bg-red-900/30 text-red-700' :
                        'bg-amber-100 dark:bg-amber-900/30 text-amber-700'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      order.payment_status === 'paid' ? 'bg-green-100 dark:bg-green-900/30 text-green-700' : 'bg-red-100 dark:bg-red-900/30 text-red-700'
                    }`}>
                      {order.payment_status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCustomers = () => (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Email</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Joined</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Orders</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {customers.map((customer) => {
              const customerOrders = orders.filter((o) => o.user_id === customer.id);
              return (
                <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{customer.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{new Date(customer.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{customerOrders.length}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderReviews = () => (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Product</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Customer</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Rating</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Review</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {reviews.map((review) => (
              <tr key={review.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={review.product?.image_url} alt="" className="w-8 h-8 object-cover rounded-lg" />
                    <span className="text-sm text-gray-900 dark:text-white truncate max-w-[150px]">{review.product?.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{review.user_email}</td>
                <td className="px-4 py-3">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={`text-sm ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 max-w-[250px] truncate">{review.title}</td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{new Date(review.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your store</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" /> {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            {loading ? (
              <div className="space-y-4">
                <div className="animate-pulse h-32 bg-gray-200 dark:bg-gray-800 rounded-xl" />
                <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-800 rounded-xl" />
              </div>
            ) : (
              <>
                {activeTab === 'dashboard' && renderDashboard()}
                {activeTab === 'products' && renderProducts()}
                {activeTab === 'orders' && renderOrders()}
                {activeTab === 'customers' && renderCustomers()}
                {activeTab === 'reviews' && renderReviews()}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </h2>
              <button onClick={() => setShowProductModal(false)} className="p-2 text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            {formError && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {formError}
              </div>
            )}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
                  <input
                    type="text"
                    value={productForm.name || ''}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">SKU *</label>
                  <input
                    type="text"
                    value={productForm.sku || ''}
                    onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  value={productForm.description || ''}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price *</label>
                  <input
                    type="number"
                    value={productForm.price || ''}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Compare Price</label>
                  <input
                    type="number"
                    value={productForm.compare_price || ''}
                    onChange={(e) => setProductForm({ ...productForm, compare_price: Number(e.target.value) || 0 })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stock *</label>
                  <input
                    type="number"
                    value={productForm.stock || ''}
                    onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <select
                    value={productForm.category || ''}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="USB Cables">USB Cables</option>
                    <option value="HDMI Cables">HDMI Cables</option>
                    <option value="Charging Adapters">Charging Adapters</option>
                    <option value="Power Cables">Power Cables</option>
                    <option value="Audio Cables">Audio Cables</option>
                    <option value="Network Cables">Network Cables</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
                  <input
                    type="text"
                    value={productForm.image_url || ''}
                    onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={productForm.featured || false}
                    onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Featured</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={productForm.best_seller || false}
                    onChange={(e) => setProductForm({ ...productForm, best_seller: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Best Seller</span>
                </label>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSaveProduct}
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
                <button
                  onClick={() => setShowProductModal(false)}
                  className="px-6 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Delete Product?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">This action cannot be undone. The product will be permanently removed.</p>
            <div className="flex gap-4">
              <button
                onClick={() => handleDeleteProduct(deleteConfirm)}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
