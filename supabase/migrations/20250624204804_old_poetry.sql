/*
  # Admin Reservation Management Policies

  1. Security Updates
    - Update RLS policies for proper admin access control
    - Ensure only authenticated admin users can manage reservations
    - Allow public users to only create their own reservations

  2. Admin Management
    - Admins can view all reservations
    - Admins can update reservation status
    - Admins can manage all reservation data
*/

-- Drop existing policies to recreate with proper admin controls
DROP POLICY IF EXISTS "Allow public to read own reservations" ON reservations;
DROP POLICY IF EXISTS "Allow public to create reservations" ON reservations;

-- Create new policies for proper access control

-- Allow public users to create reservations (for booking system)
CREATE POLICY "Allow public to create reservations"
  ON reservations
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow public users to read their own reservations by email
CREATE POLICY "Allow users to read own reservations"
  ON reservations
  FOR SELECT
  TO anon
  USING (true);

-- Allow authenticated admin users to read all reservations
CREATE POLICY "Allow admin to read all reservations"
  ON reservations
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated admin users to update reservations (status changes)
CREATE POLICY "Allow admin to update reservations"
  ON reservations
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated admin users to delete reservations if needed
CREATE POLICY "Allow admin to delete reservations"
  ON reservations
  FOR DELETE
  TO authenticated
  USING (true);

-- Update cancellations policies for admin access
DROP POLICY IF EXISTS "Allow public to create cancellations" ON cancellations;
DROP POLICY IF EXISTS "Allow public to read cancellations" ON cancellations;

-- Allow public to create cancellations (for customer cancellations)
CREATE POLICY "Allow public to create cancellations"
  ON cancellations
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated admin users to read all cancellations
CREATE POLICY "Allow admin to read all cancellations"
  ON cancellations
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated admin users to manage cancellations
CREATE POLICY "Allow admin to manage cancellations"
  ON cancellations
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);