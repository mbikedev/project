/*
  # Update reservations capacity to 22 people

  1. Changes
    - Update guests check constraint to allow 1-22 people
    - Add 'pending' status to reservation status options
    - Update default status logic based on guest count

  2. Security
    - Maintain existing RLS policies
    - No changes to existing data
*/

-- Update the guests check constraint to allow 1-22 people
ALTER TABLE reservations DROP CONSTRAINT IF EXISTS reservations_guests_check;
ALTER TABLE reservations ADD CONSTRAINT reservations_guests_check 
  CHECK (guests >= 1 AND guests <= 22);

-- Update the status check constraint to include 'pending'
ALTER TABLE reservations DROP CONSTRAINT IF EXISTS reservations_status_check;
ALTER TABLE reservations ADD CONSTRAINT reservations_status_check 
  CHECK (status IN ('confirmed', 'cancelled', 'completed', 'pending'));

-- Update the default status to be conditional based on guest count
-- Note: This will be handled in the application logic since PostgreSQL 
-- doesn't support conditional defaults based on other column values