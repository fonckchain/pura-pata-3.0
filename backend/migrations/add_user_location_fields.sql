-- Migration: Add location fields to users table
-- Date: 2025-10-11

-- Add new location columns to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS province VARCHAR(100),
ADD COLUMN IF NOT EXISTS canton VARCHAR(100),
ADD COLUMN IF NOT EXISTS address VARCHAR(255),
ADD COLUMN IF NOT EXISTS latitude FLOAT,
ADD COLUMN IF NOT EXISTS longitude FLOAT;

-- Add indexes for location-based queries (optional but recommended)
CREATE INDEX IF NOT EXISTS idx_users_province ON users(province);
CREATE INDEX IF NOT EXISTS idx_users_canton ON users(canton);
