/*
# Fix RLS Admin Policies for products and categories

1. Create a helper function `is_admin()` that checks if the authenticated user has an `admin` role in their `raw_app_meta_data`.
2. Replace the overly permissive `categories_admin_insert`, `categories_admin_update`, `categories_admin_delete` policies with ones that use `is_admin()`.
3. Replace the overly permissive `products_admin_insert`, `products_admin_update`, `products_admin_delete` policies with ones that use `is_admin()`.
4. Drop the old always-true policies before creating the new ones.
*/

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    false
  );
$$;

-- Categories
DROP POLICY IF EXISTS "categories_admin_insert" ON categories;
DROP POLICY IF EXISTS "categories_admin_update" ON categories;
DROP POLICY IF EXISTS "categories_admin_delete" ON categories;

CREATE POLICY "categories_admin_insert" ON categories FOR INSERT
  TO authenticated WITH CHECK (is_admin());

CREATE POLICY "categories_admin_update" ON categories FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "categories_admin_delete" ON categories FOR DELETE
  TO authenticated USING (is_admin());

-- Products
DROP POLICY IF EXISTS "products_admin_insert" ON products;
DROP POLICY IF EXISTS "products_admin_update" ON products;
DROP POLICY IF EXISTS "products_admin_delete" ON products;

CREATE POLICY "products_admin_insert" ON products FOR INSERT
  TO authenticated WITH CHECK (is_admin());

CREATE POLICY "products_admin_update" ON products FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "products_admin_delete" ON products FOR DELETE
  TO authenticated USING (is_admin());
