# Supabase Setup Guide - Pura Pata

This guide will help you set up real Supabase credentials for your production deployment.

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click **"New Project"**
4. Fill in:
   - **Name**: `pura-pata` (or any name you prefer)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to Costa Rica (e.g., `us-east-1` or `us-west-1`)
5. Click **"Create new project"**
6. Wait 2-3 minutes for the project to initialize

## Step 2: Get Your Credentials

Once your project is ready:

### 2.1 Get API Keys
1. In your Supabase dashboard, click **Settings** (gear icon in sidebar)
2. Click **API** in the settings menu
3. You'll see:
   - **Project URL** → This is your `SUPABASE_URL`
   - **Project API keys**:
     - `anon` `public` → This is your `SUPABASE_KEY` (for frontend)
     - `service_role` `secret` → This is your `SUPABASE_SERVICE_KEY` (for backend)

### 2.2 Get JWT Secret
1. Still in **Settings** → **API**
2. Scroll down to **JWT Settings**
3. Copy **JWT Secret** → This is your `SUPABASE_JWT_SECRET`

**Important:** The `service_role` key bypasses Row Level Security (RLS) - only use it on the backend!

## Step 3: Set Up Database Schema

### Option A: Using Supabase SQL Editor (Recommended)

1. In Supabase dashboard, click **SQL Editor** (in sidebar)
2. Click **"New query"**
3. Copy the contents of `/home/fonck/Documents/Development/pura-pata-3.0/init.sql`
4. Paste into the SQL editor
5. Click **Run** or press `Ctrl+Enter`
6. Verify tables were created by going to **Table Editor** in sidebar

### Option B: Using Docker PostgreSQL Connection

```bash
# From your project root
docker exec -i pura-pata-postgres psql -U pura_pata -d pura_pata_db < init.sql
```

## Step 4: Set Up Storage for Dog Photos

1. In Supabase dashboard, click **Storage** (in sidebar)
2. Click **"Create a new bucket"**
3. Fill in:
   - **Name**: `dog-photos`
   - **Public bucket**: ✅ Yes (so photos are publicly accessible)
4. Click **"Create bucket"**

### Configure Storage Policies

1. Click on the `dog-photos` bucket
2. Click **"New policy"**
3. Select **"For full customization"**
4. Create a policy for public read access:
   ```sql
   -- Policy name: Public read access
   -- Allowed operation: SELECT

   CREATE POLICY "Public read access"
   ON storage.objects FOR SELECT
   TO public
   USING ( bucket_id = 'dog-photos' );
   ```
5. Click **"Review"** → **"Save policy"**

6. Create another policy for authenticated uploads:
   ```sql
   -- Policy name: Authenticated users can upload
   -- Allowed operation: INSERT

   CREATE POLICY "Authenticated users can upload"
   ON storage.objects FOR INSERT
   TO authenticated
   WITH CHECK ( bucket_id = 'dog-photos' );
   ```
7. Click **"Review"** → **"Save policy"**

## Step 5: Configure Environment Variables

### 5.1 Backend (Railway)

1. Go to your Railway project: [https://railway.app](https://railway.app)
2. Click on your **backend service**
3. Go to **Variables** tab
4. Update these variables with your real Supabase credentials:

```bash
# Replace with your actual values from Step 2
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eHh4eHh4eHgiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjk0NTY3ODkwLCJleHAiOjIwMTAxNDM4OTB9.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SUPABASE_JWT_SECRET=your-jwt-secret-here

# Keep these as is
DATABASE_URL=your-existing-database-url
SECRET_KEY=your-existing-secret-key
ALGORITHM=HS256
```

**Important Notes:**
- For `SUPABASE_KEY`, use the **service_role** key (not the anon key)
- Don't add quotes around the values
- Click **"Deploy"** or wait for auto-redeploy after saving

### 5.2 Frontend (Vercel)

When you deploy to Vercel:

1. Go to your Vercel project
2. Go to **Settings** → **Environment Variables**
3. Add these variables:

```bash
# Use the anon (public) key for frontend
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eHh4eHh4eHgiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY5NDU2Nzg5MCwiZXhwIjoyMDEwMTQzODkwfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_API_URL=https://your-railway-backend-url.railway.app
```

**Important:** Use the **anon** key for frontend (not service_role)!

## Step 6: Verify Setup

### Test Backend Connection

1. After Railway redeploys, check the deployment logs
2. You should see: `✅ Supabase configured successfully`
3. No more "Invalid API key" errors

### Test in Supabase Dashboard

1. Go to **Table Editor** in Supabase
2. You should see tables: `users`, `dogs`, `dog_status_history`
3. Check if demo dogs (Max, Luna, Rocky) were inserted

### Test Storage

1. Go to **Storage** → `dog-photos` bucket
2. Try uploading a test image manually
3. Click on the image to get its public URL
4. The URL should work: `https://xxxxxxxxxxxxx.supabase.co/storage/v1/object/public/dog-photos/test.jpg`

## Step 7: Update Local Development (Optional)

If you want to test locally with real Supabase:

```bash
# backend/.env
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_KEY=eyJhbG... (service_role key)
SUPABASE_JWT_SECRET=your-jwt-secret
```

```bash
# frontend/.env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG... (anon key)
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Troubleshooting

### "Invalid API key" Error
- ✅ Make sure you're using **service_role** key for backend
- ✅ Make sure you're using **anon** key for frontend
- ✅ Check there are no extra spaces or quotes around the keys
- ✅ Verify the keys are from the same project

### "relation does not exist" Error
- ✅ Run the SQL schema from Step 3
- ✅ Check in **Table Editor** that tables exist

### Storage Upload Fails
- ✅ Verify the `dog-photos` bucket exists
- ✅ Check the storage policies are created
- ✅ Make sure bucket is marked as **Public**

### Still Getting Errors?
1. Check Railway deployment logs
2. Verify all environment variables are set correctly
3. Try redeploying the service
4. Check Supabase logs: **Logs** tab in sidebar

## Security Best Practices

1. ✅ **Never commit** real credentials to git
2. ✅ Use **service_role** key ONLY on backend (it bypasses RLS)
3. ✅ Use **anon** key on frontend (it respects RLS policies)
4. ✅ Enable Row Level Security (RLS) on tables for production
5. ✅ Rotate keys if they're ever exposed

## Next Steps

After Supabase is configured:

1. ✅ Verify Railway backend is working
2. ✅ Deploy frontend to Vercel
3. ✅ Configure domain `pura-pata.fast-blocks.xyz` in Cloudflare
4. ✅ Point domain to Vercel
5. ✅ Test end-to-end: Sign up → Upload dog → View on map

---

## Quick Reference

**Supabase Dashboard:** https://app.supabase.com/project/YOUR_PROJECT_ID

**Key Differences:**
- `anon` key = Frontend (public, limited access)
- `service_role` key = Backend (full access, keep secret!)
- `JWT secret` = Used to verify tokens

**Storage URL Format:**
```
https://YOUR_PROJECT_ID.supabase.co/storage/v1/object/public/dog-photos/FILENAME
```

**Need Help?**
- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
