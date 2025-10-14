-- Sync auth.users and public.users tables
-- This migration sets up automatic synchronization between Supabase Auth and your public users table

-- 1. Create a function to handle user deletion from auth.users
CREATE OR REPLACE FUNCTION public.handle_auth_user_deleted()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete corresponding user from public.users when auth.users is deleted
  DELETE FROM public.users WHERE id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create a trigger on auth.users that fires when a user is deleted
DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;
CREATE TRIGGER on_auth_user_deleted
  AFTER DELETE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_auth_user_deleted();

-- 3. Create a function to handle user deletion from public.users
-- Note: Deleting from public.users should NOT delete from auth.users automatically
-- because auth.users is the source of truth. Users should be deleted from auth.users first.
-- However, we'll add a constraint to prevent orphaned public.users records

-- 4. Ensure public.users.id references auth.users.id
-- First, check if the foreign key constraint exists
DO $$
BEGIN
  -- Drop the existing primary key if it exists
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'users_pkey' AND conrelid = 'public.users'::regclass
  ) THEN
    ALTER TABLE public.users DROP CONSTRAINT users_pkey;
  END IF;

  -- Drop existing id column default if it exists
  ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;

  -- Add foreign key constraint to reference auth.users
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'users_id_fkey' AND conrelid = 'public.users'::regclass
  ) THEN
    ALTER TABLE public.users
    ADD CONSTRAINT users_id_fkey
    FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;

  -- Re-add primary key
  ALTER TABLE public.users ADD PRIMARY KEY (id);
END $$;

-- 5. Create a function to automatically create public.users when auth.users is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, phone)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Create a trigger to auto-create public.users on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 7. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- Notes:
-- - Now when you delete a user from auth.users (via Supabase Dashboard or API),
--   the corresponding record in public.users will be automatically deleted
-- - When a new user signs up via auth, a record will be automatically created in public.users
-- - The foreign key constraint ensures data integrity
