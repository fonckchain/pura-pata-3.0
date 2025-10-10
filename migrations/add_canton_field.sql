-- Migration: Add canton column and make color/contact_phone optional
-- Run this in Supabase SQL Editor

-- Add canton column
ALTER TABLE dogs ADD COLUMN IF NOT EXISTS canton VARCHAR(50);

-- Make color nullable
ALTER TABLE dogs ALTER COLUMN color DROP NOT NULL;

-- Make contact_phone nullable
ALTER TABLE dogs ALTER COLUMN contact_phone DROP NOT NULL;
