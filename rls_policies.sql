-- rls_policies.sql
-- Note: Replace placeholders with exact column names if they differ slightly

-- ============================================================================
-- OPTIONAL: Run this block to drop ALL existing policies in the public schema
-- ============================================================================
/*
DO $$ 
DECLARE 
  r RECORD; 
END; $$;
*/
-- ============================================================================

-- 0. Schema Updates
-- Add missing factory_id column to customers table
ALTER TABLE customers ADD COLUMN IF NOT EXISTS factory_id int REFERENCES factories(id);

-- Add missing unit column to weighments table
ALTER TABLE weighments ADD COLUMN IF NOT EXISTS unit unit_enum NOT NULL DEFAULT 'kg';


-- 1. Helper functions to avoid multiple joins in RLS policies

-- Get current user's role from profiles
CREATE OR REPLACE FUNCTION current_user_role() RETURNS text AS $$
  SELECT role::text FROM profiles WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

-- Get current user's factory_id from either profiles or customers
CREATE OR REPLACE FUNCTION current_user_factory_id() RETURNS int AS $$
  SELECT COALESCE(
    (SELECT factory_id FROM profiles WHERE user_id = auth.uid() LIMIT 1),
    (SELECT factory_id FROM customers WHERE user_id = auth.uid() LIMIT 1)
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Get current customer's ID based on auth.uid()
CREATE OR REPLACE FUNCTION current_customer_id() RETURNS int AS $$
  SELECT id FROM customers WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

-- Get current user's email securely from auth.users (running as SECURITY DEFINER)
CREATE OR REPLACE FUNCTION get_user_email(u_id uuid) RETURNS text AS $$
  SELECT email::text FROM auth.users WHERE id = u_id LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.get_user_email(uuid) TO authenticated;

-- Get list of users from auth.users securely and isolated by factory (running as SECURITY DEFINER)
-- Only returns users who are registered in the system (have a profile or customer record).
-- Ghost auth accounts (no profile, no customer) are never returned.
-- super_admin and hardware role accounts are always excluded.
CREATE OR REPLACE FUNCTION get_users()
RETURNS TABLE (id uuid, email text) AS $$
BEGIN
  IF (SELECT public.current_user_role() = 'super_admin') THEN
    -- Super admin sees all registered users with non-excluded roles
    RETURN QUERY
    SELECT u.id, u.email::text
    FROM auth.users u
    WHERE EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = u.id
      AND p.role::text NOT IN ('super_admin', 'hardware')
    )
    OR EXISTS (
      SELECT 1 FROM public.customers c
      WHERE c.user_id = u.id
    );
  ELSE
    -- Non-super-admin sees only their factory's users (non-excluded roles)
    RETURN QUERY
    SELECT u.id, u.email::text
    FROM auth.users u
    WHERE (
      EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.user_id = u.id
        AND p.role::text NOT IN ('super_admin', 'hardware')
        AND p.factory_id = public.current_user_factory_id()
      )
      OR EXISTS (
        SELECT 1 FROM public.customers c
        WHERE c.user_id = u.id
        AND c.factory_id = public.current_user_factory_id()
      )
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.get_users() TO authenticated;


-- 2. Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_isolation_policy" ON profiles;
CREATE POLICY "profiles_isolation_policy" ON profiles
FOR ALL TO authenticated
USING (
  current_user_role() = 'super_admin'
  OR (
    factory_id = current_user_factory_id()
    AND (
      user_id = auth.uid()
      OR (
        current_user_role() = 'admin' AND role::text IN ('manager', 'operator', 'base')
      )
      OR (
        current_user_role() = 'manager' AND role::text IN ('operator', 'base')
      )
    )
  )
);


-- 3. Customers
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "customers_isolation_policy" ON customers;
CREATE POLICY "customers_isolation_policy" ON customers
FOR ALL TO authenticated
USING (
  current_user_role() = 'super_admin'
  OR factory_id = current_user_factory_id()
);


-- 4. Factories
-- Super Admins can do anything
-- Others can only read/update their own factory
ALTER TABLE factories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "factories_isolation_policy" ON factories;
CREATE POLICY "factories_isolation_policy" ON factories
FOR ALL TO authenticated
USING (
  current_user_role() = 'super_admin'
  OR id = current_user_factory_id()
)
WITH CHECK (
  current_user_role() = 'super_admin'
  OR (id = current_user_factory_id() AND current_user_role() = 'admin') -- Admin can edit
);


-- 5. Centers
ALTER TABLE centers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "centers_isolation_policy" ON centers;
CREATE POLICY "centers_isolation_policy" ON centers
FOR ALL TO authenticated
USING (
  current_user_role() = 'super_admin'
  OR factory_id = current_user_factory_id()
);


-- 6. Rates
ALTER TABLE rates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "rates_isolation_policy" ON rates;
CREATE POLICY "rates_isolation_policy" ON rates
FOR ALL TO authenticated
USING (
  current_user_role() = 'super_admin'
  OR factory_id = current_user_factory_id()
);


-- 7. Weighments
-- Linked to a center. Center is linked to factory.
-- Also check customer_id if logged-in user is a customer (profile role is null)
ALTER TABLE weighments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "weighments_isolation_policy" ON weighments;
CREATE POLICY "weighments_isolation_policy" ON weighments
FOR ALL TO authenticated
USING (
  current_user_role() = 'super_admin'
  OR current_user_role() = 'hardware'
  OR (
    center_id IN (SELECT id FROM centers WHERE factory_id = current_user_factory_id())
    AND
    (
      -- If the user has a role in profiles (not a customer), they see all factory weighments
      current_user_role() IS NOT NULL
      OR
      -- If they are a customer, they only see their own weighments
      customer_id = current_customer_id()
    )
  )
);


-- 8. Villages
-- Read: Anyone who is authenticated and has a profile/customer record (factory_id is not null) or SUPER_ADMIN
-- Write: SUPER_ADMIN only
ALTER TABLE villages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "villages_select_policy" ON villages;
CREATE POLICY "villages_select_policy" ON villages
FOR SELECT TO authenticated
USING (
  current_user_factory_id() IS NOT NULL
  OR current_user_role() = 'super_admin'
);

DROP POLICY IF EXISTS "villages_all_policy" ON villages;
CREATE POLICY "villages_all_policy" ON villages
FOR ALL TO authenticated
USING (current_user_role() = 'super_admin')
WITH CHECK (current_user_role() = 'super_admin');


-- 9. Commodities
-- Read: Anyone who is authenticated and has a profile/customer record or SUPER_ADMIN
-- Write: SUPER_ADMIN only
ALTER TABLE commodities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "commodities_select_policy" ON commodities;
CREATE POLICY "commodities_select_policy" ON commodities
FOR SELECT TO authenticated
USING (
  current_user_factory_id() IS NOT NULL
  OR current_user_role() = 'super_admin'
);

DROP POLICY IF EXISTS "commodities_all_policy" ON commodities;
CREATE POLICY "commodities_all_policy" ON commodities
FOR ALL TO authenticated
USING (current_user_role() = 'super_admin')
WITH CHECK (current_user_role() = 'super_admin');


-- ============================================================================
-- IMPORTANT FIX: Recreate the 'profiles_with_email' view WITHOUT security_invoker.
-- This allows it to run as Owner (Security Definer) so it has access to 'auth.users'
-- via the get_user_email SECURITY DEFINER function.
-- To keep it secure and enforce tenant isolation, we add the WHERE clause filter.
-- ============================================================================
DROP VIEW IF EXISTS profiles_with_email CASCADE;

CREATE OR REPLACE VIEW profiles_with_email AS
SELECT p.*, get_user_email(p.user_id) AS email
FROM profiles p
WHERE (
  current_user_role() = 'super_admin'
  OR (
    p.factory_id = current_user_factory_id()
    AND (
      p.user_id = auth.uid()
      OR (
        current_user_role() = 'admin' AND p.role::text IN ('manager', 'operator', 'base')
      )
      OR (
        current_user_role() = 'manager' AND p.role::text IN ('operator', 'base')
      )
    )
  )
);

GRANT SELECT ON public.profiles_with_email TO authenticated;
