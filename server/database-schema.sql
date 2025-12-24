-- Trámites Express MX - Supabase Database Schema
-- Execute this SQL in Supabase Dashboard → SQL Editor

-- Table: orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_number TEXT UNIQUE NOT NULL,
  service_type TEXT NOT NULL,
  service_price INTEGER NOT NULL,
  curp TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  receipt_url TEXT,
  status TEXT DEFAULT 'Pendiente' CHECK (status IN ('Pendiente', 'Pagado')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_reference ON orders(reference_number);
CREATE INDEX IF NOT EXISTS idx_orders_curp ON orders(curp);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Table: admins
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default admin user (password: admin123)
-- Password hash generated with bcrypt, 10 rounds
INSERT INTO admins (username, password) 
VALUES ('admin', '$2a$10$YQr5KLZH0z7LzZ8jQx3yYeK9vXh.mBr9kYXFfGKX8VzQJ0jZxNE2m')
ON CONFLICT (username) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- RLS Policies for orders
CREATE POLICY "Allow anonymous inserts on orders" ON orders
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous reads on orders" ON orders
  FOR SELECT TO anon
  USING (true);

CREATE POLICY "Allow anonymous updates on orders" ON orders
  FOR UPDATE TO anon
  USING (true);

-- RLS Policies for admins
CREATE POLICY "Allow anonymous selects on admins" ON admins
  FOR SELECT TO anon
  USING (true);

-- Storage Bucket for payment receipts
-- This needs to be created in Supabase Dashboard → Storage
-- Bucket name: payment-receipts
-- Public: true
-- File size limit: 5MB
-- Allowed MIME types: image/jpeg, image/png, application/pdf
