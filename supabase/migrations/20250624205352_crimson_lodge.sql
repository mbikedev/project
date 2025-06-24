/*
  # Admin-Only Reservation Management

  1. Security Updates
    - Restrict reservation status updates to admin users only
    - Maintain public access for creating reservations
    - Allow admins to view and manage all reservations
    - Regular users cannot update reservation status

  2. Admin Role Requirements
    - Only users with admin role can update reservation status
    - Admin role should be managed through Supabase Auth metadata or custom claims
*/

-- Drop existing admin policies to recreate with proper role-based access
DROP POLICY IF EXISTS "Allow admin to update reservations" ON reservations;
DROP POLICY IF EXISTS "Allow admin to read all reservations" ON reservations;
DROP POLICY IF EXISTS "Allow admin to delete reservations" ON reservations;

-- Create admin-only policies for reservation management

-- Allow only admin users to read all reservations
CREATE POLICY "Allow admin to read all reservations"
  ON reservations
  FOR SELECT
  TO authenticated
  USING (
    -- Check if user has admin role in auth.users metadata
    (auth.jwt() ->> 'role' = 'admin') OR
    -- Alternative: Check custom user_metadata
    (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin') OR
    -- Alternative: Check app_metadata (set by admin)
    (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
  );

-- Allow only admin users to update reservations (especially status field)
CREATE POLICY "Allow admin to update reservations"
  ON reservations
  FOR UPDATE
  TO authenticated
  USING (
    -- Check if user has admin role in auth.users metadata
    (auth.jwt() ->> 'role' = 'admin') OR
    -- Alternative: Check custom user_metadata
    (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin') OR
    -- Alternative: Check app_metadata (set by admin)
    (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
  )
  WITH CHECK (
    -- Same check for updates
    (auth.jwt() ->> 'role' = 'admin') OR
    (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin') OR
    (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
  );

-- Allow only admin users to delete reservations if needed
CREATE POLICY "Allow admin to delete reservations"
  ON reservations
  FOR DELETE
  TO authenticated
  USING (
    -- Check if user has admin role in auth.users metadata
    (auth.jwt() ->> 'role' = 'admin') OR
    -- Alternative: Check custom user_metadata
    (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin') OR
    -- Alternative: Check app_metadata (set by admin)
    (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
  );

-- Update cancellations policies for admin-only access
DROP POLICY IF EXISTS "Allow admin to manage cancellations" ON cancellations;
DROP POLICY IF EXISTS "Allow admin to read all cancellations" ON cancellations;

-- Allow only admin users to read all cancellations
CREATE POLICY "Allow admin to read all cancellations"
  ON cancellations
  FOR SELECT
  TO authenticated
  USING (
    -- Check if user has admin role
    (auth.jwt() ->> 'role' = 'admin') OR
    (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin') OR
    (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
  );

-- Allow only admin users to manage cancellations
CREATE POLICY "Allow admin to manage cancellations"
  ON cancellations
  FOR ALL
  TO authenticated
  USING (
    -- Check if user has admin role
    (auth.jwt() ->> 'role' = 'admin') OR
    (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin') OR
    (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
  )
  WITH CHECK (
    -- Same check for inserts/updates
    (auth.jwt() ->> 'role' = 'admin') OR
    (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin') OR
    (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
  );

-- Create a function to help check admin status (optional utility)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN (
    (auth.jwt() ->> 'role' = 'admin') OR
    (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin') OR
    (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;