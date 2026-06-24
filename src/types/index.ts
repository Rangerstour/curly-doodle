export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  compare_price?: number;
  category: string;
  subcategory: string;
  image_url: string;
  images?: string[];
  rating: number;
  review_count: number;
  stock: number;
  sku: string;
  featured: boolean;
  best_seller: boolean;
  created_at: string;
  updated_at: string;
  tags?: string[];
  specs?: Record<string, string>;
}

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: Product;
}

export interface Cart {
  id: string;
  user_id?: string;
  items: CartItem[];
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  user_email: string;
  rating: number;
  title: string;
  content: string;
  verified_purchase: boolean;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  type: 'shipping' | 'billing';
  first_name: string;
  last_name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
  is_default: boolean;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
  id: string;
  user_id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method: string;
  shipping_address: Address;
  billing_address: Address;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  coupon_code?: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  product_count: number;
}

export type SortOption = 'price-asc' | 'price-desc' | 'popularity' | 'newest' | 'rating';
