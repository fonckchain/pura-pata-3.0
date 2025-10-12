-- Migration: Remove address column from users table
-- Date: 2025-10-12
-- Description: Removes the address field from users table to match the new location handling pattern

ALTER TABLE users DROP COLUMN IF EXISTS address;
