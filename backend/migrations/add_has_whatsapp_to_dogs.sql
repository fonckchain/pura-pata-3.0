-- Migration: Add has_whatsapp field to dogs table
-- Date: 2025-10-11

-- Add has_whatsapp column to dogs table
ALTER TABLE dogs
ADD COLUMN IF NOT EXISTS has_whatsapp BOOLEAN DEFAULT FALSE;
