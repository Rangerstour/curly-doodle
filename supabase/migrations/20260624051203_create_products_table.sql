/*
# Create Products and Categories Tables

1. New Tables
- `categories` - product categories with slug, description, and image
- `products` - full product catalog with pricing, stock, ratings, and metadata
2. Indexes
- `products_category_idx` for category filtering
- `products_featured_idx` for featured products queries
- `products_best_seller_idx` for best sellers queries
- `products_slug_idx` for product lookup by SKU
3. Security
- RLS enabled on both tables
- Public read access for products and categories (all users can browse)
- Only authenticated users can manage (admin) via separate admin policies
*/

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  image_url text,
  product_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price numeric(10,2) NOT NULL,
  compare_price numeric(10,2),
  category text NOT NULL,
  subcategory text,
  image_url text NOT NULL,
  images jsonb DEFAULT '[]',
  rating numeric(2,1) DEFAULT 0,
  review_count integer DEFAULT 0,
  stock integer NOT NULL DEFAULT 0,
  sku text NOT NULL UNIQUE,
  featured boolean DEFAULT false,
  best_seller boolean DEFAULT false,
  tags jsonb DEFAULT '[]',
  specs jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS products_category_idx ON products(category);
CREATE INDEX IF NOT EXISTS products_featured_idx ON products(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS products_best_seller_idx ON products(best_seller) WHERE best_seller = true;
CREATE INDEX IF NOT EXISTS products_slug_idx ON products(sku);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "categories_select_all" ON categories;
CREATE POLICY "categories_select_all" ON categories FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "products_select_all" ON products;
CREATE POLICY "products_select_all" ON products FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "products_admin_insert" ON products;
CREATE POLICY "products_admin_insert" ON products FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "products_admin_update" ON products;
CREATE POLICY "products_admin_update" ON products FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "products_admin_delete" ON products;
CREATE POLICY "products_admin_delete" ON products FOR DELETE
  TO authenticated USING (true);

DROP POLICY IF EXISTS "categories_admin_insert" ON categories;
CREATE POLICY "categories_admin_insert" ON categories FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "categories_admin_update" ON categories;
CREATE POLICY "categories_admin_update" ON categories FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "categories_admin_delete" ON categories;
CREATE POLICY "categories_admin_delete" ON categories FOR DELETE
  TO authenticated USING (true);
