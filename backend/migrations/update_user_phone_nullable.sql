-- Migration: Make phone nullable and remove location field
-- Date: 2025-10-11

-- Make phone column nullable
ALTER TABLE users
ALTER COLUMN phone DROP NOT NULL;

-- Drop location column if it exists (replaced by province, canton, address)
ALTER TABLE users
DROP COLUMN IF EXISTS location;
