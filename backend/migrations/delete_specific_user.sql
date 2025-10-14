-- Delete specific user from auth.users
-- This will also cascade to public.users if triggers are set up correctly
-- Execute this in Supabase SQL Editor

-- First, verify the user exists
SELECT id, email, created_at
FROM auth.users
WHERE email = 'ops@fast-blocks.xyz';

-- Delete the user from auth.users
-- Note: This must be run by a service_role or in Supabase dashboard SQL editor
DELETE FROM auth.users
WHERE email = 'ops@fast-blocks.xyz';

-- Verify deletion
SELECT id, email
FROM auth.users
WHERE email = 'ops@fast-blocks.xyz';

-- Also check if the user still exists in public.users
SELECT id, email
FROM public.users
WHERE email = 'ops@fast-blocks.xyz';

-- If the user still exists in public.users, delete it manually
DELETE FROM public.users
WHERE email = 'ops@fast-blocks.xyz';
