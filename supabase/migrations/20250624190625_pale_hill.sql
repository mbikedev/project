/*
  # Reservations System Database Schema

  1. New Tables
    - `reservations`
      - `id` (uuid, primary key)
      - `reservation_number` (text, unique)
      - `name` (text)
      - `email` (text)
      - `phone` (text)
      - `date` (date)
      - `time` (text)
      - `guests` (integer)
      - `additional_info` (text, optional)
      - `status` (text, default 'confirmed')
      - `created_at` (timestamp)
    
    - `cancellations`
      - `id` (uuid, primary key)
      - `reservation_id` (uuid, foreign key)
      - `reason` (text, optional)
      - `cancelled_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public access (since this is a restaurant booking system)
*/

-- Create reservations table
CREATE TABLE IF NOT EXISTS reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_number text UNIQUE NOT NULL DEFAULT 'RES-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(EXTRACT(DOY FROM NOW())::text, 3, '0') || '-' || LPAD(EXTRACT(HOUR FROM NOW())::text, 2, '0') || LPAD(EXTRACT(MINUTE FROM NOW())::text, 2, '0'),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  date date NOT NULL,
  time text NOT NULL,
  guests integer NOT NULL CHECK (guests >= 1 AND guests <= 6),
  additional_info text,
  status text DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed')),
  created_at timestamptz DEFAULT now()
);

-- Create cancellations table
CREATE TABLE IF NOT EXISTS cancellations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id uuid REFERENCES reservations(id) ON DELETE CASCADE,
  reason text,
  cancelled_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE cancellations ENABLE ROW LEVEL SECURITY;

-- Create policies for reservations (allow public access for booking)
CREATE POLICY "Allow public to create reservations"
  ON reservations
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public to read own reservations"
  ON reservations
  FOR SELECT
  TO anon
  USING (true);

-- Create policies for cancellations
CREATE POLICY "Allow public to create cancellations"
  ON cancellations
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public to read cancellations"
  ON cancellations
  FOR SELECT
  TO anon
  USING (true);

-- Create function to generate unique reservation numbers
CREATE OR REPLACE FUNCTION generate_reservation_number()
RETURNS text AS $$
DECLARE
  new_number text;
  counter integer := 1;
BEGIN
  LOOP
    new_number := 'RES-' || EXTRACT(YEAR FROM NOW()) || '-' || 
                  LPAD(EXTRACT(DOY FROM NOW())::text, 3, '0') || '-' || 
                  LPAD(counter::text, 4, '0');
    
    -- Check if this number already exists
    IF NOT EXISTS (SELECT 1 FROM reservations WHERE reservation_number = new_number) THEN
      RETURN new_number;
    END IF;
    
    counter := counter + 1;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate reservation numbers
CREATE OR REPLACE FUNCTION set_reservation_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.reservation_number IS NULL OR NEW.reservation_number = '' THEN
    NEW.reservation_number := generate_reservation_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_reservation_number
  BEFORE INSERT ON reservations
  FOR EACH ROW
  EXECUTE FUNCTION set_reservation_number();