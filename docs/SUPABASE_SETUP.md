# Setting Up PostgreSQL with Supabase

This guide will walk you through setting up your PostgreSQL database in Supabase and connecting it to your Next.js user management system.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click **"New Project"**
4. Fill in the details:
   - **Name**: `recipe-app` (or any name you prefer)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the closest region to your users
   - **Pricing Plan**: Free tier is perfect for development
5. Click **"Create new project"**
6. Wait 2-3 minutes for the project to be provisioned

## Step 2: Get Your Database Connection String

### Option A: Connection Pooler (Recommended for Production)

1. In your Supabase project dashboard, go to **Settings** → **Database**
2. Scroll down to **"Connection string"**
3. Select **"Connection pooling"** tab
4. Copy the **URI** connection string (it looks like this):
   ```
   postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```
5. Replace `[PASSWORD]` with your actual database password

### Option B: Direct Connection (For Development)

1. In the same section, select **"Direct connection"** tab
2. Copy the **URI** connection string:
   ```
   postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```
3. Replace `[PASSWORD]` with your actual database password

**💡 Tip**: Use Connection Pooler for production, Direct Connection for development.

## Step 3: Configure Your Environment Variables

1. In your project root, create `.env.local`:

   ```powershell
   # Copy from .env.example
   cp .env.example .env.local
   ```

2. Open `.env.local` and update it:

   ```env
   # Supabase PostgreSQL Connection
   DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres

   # JWT Secret (Generate a secure one)
   JWT_SECRET=your-super-secret-jwt-key-change-this

   # Environment
   NODE_ENV=development
   ```

3. Generate a secure JWT secret:
   ```powershell
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Copy the output and replace `JWT_SECRET` value.

## Step 4: Set Up the Database Schema

You have **two options** to create the users table:

### Option A: Using Supabase SQL Editor (Easiest)

1. In your Supabase dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. Copy and paste the contents of `scripts/setup-db.sql`:

```sql
-- User Management Database Setup Script

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Create a function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

4. Click **"Run"** or press `Ctrl+Enter`
5. You should see "Success. No rows returned"

### Option B: Using psql Command Line

```powershell
# Set your DATABASE_URL
$env:DATABASE_URL = "your-connection-string-here"

# Run the setup script
psql $env:DATABASE_URL -f scripts/setup-db.sql
```

## Step 5: Verify Database Setup

1. In Supabase dashboard, go to **"Table Editor"**
2. You should see a `users` table with columns:
   - `id` (int8, primary key)
   - `email` (varchar)
   - `password_hash` (varchar)
   - `name` (varchar)
   - `created_at` (timestamptz)
   - `updated_at` (timestamptz)

## Step 6: Test Your Connection

1. Start your Next.js development server:

   ```powershell
   npm run dev
   ```

2. Test the registration endpoint using your browser console or a tool like Postman:

   ```javascript
   fetch("http://localhost:3000/api/users/register", {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({
       email: "test@example.com",
       password: "password123",
       name: "Test User",
     }),
     credentials: "include",
   })
     .then((r) => r.json())
     .then(console.log);
   ```

3. Check if the user was created:
   - Go to Supabase **Table Editor** → **users**
   - You should see your test user!

## Step 7: Security Best Practices

### Enable Row Level Security (RLS) - Optional

Since you're using your own API routes (not Supabase Auth), you can choose to:

**Option 1: Disable RLS** (Your API handles all security):

```sql
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
```

**Option 2: Keep RLS Enabled** but allow service role access:

- Your connection string uses the service role key
- This bypasses RLS automatically
- Good for additional security layer

### Recommended Supabase Settings

1. **API Settings**: Go to **Settings** → **API**

   - Note: You're NOT using Supabase Auth, so you don't need to configure auth settings
   - Your JWT tokens are completely separate from Supabase's auth

2. **Database Settings**: Go to **Settings** → **Database**
   - ✅ Connection pooling is enabled by default
   - ✅ SSL is enabled by default

## Troubleshooting

### Connection Issues

**Error: "Connection timeout"**

- Make sure you're using the Connection Pooler string
- Check if your IP is allowed (Supabase Free tier allows all IPs)

**Error: "Password authentication failed"**

- Double-check your database password
- Make sure you replaced `[PASSWORD]` in the connection string
- Password is URL-encoded (special characters might need encoding)

**Error: "SSL required"**

- Supabase requires SSL by default
- The code already handles this (`ssl: { rejectUnauthorized: false }`)

### Supabase Free Tier Limits

- **Database Size**: 500 MB
- **Bandwidth**: 2 GB
- **Active Connections**: 60 simultaneous connections (pooler helps with this)
- **Pausing**: Projects pause after 7 days of inactivity (just visit dashboard to wake up)

## Production Deployment

When deploying to production (Vercel, Netlify, etc.):

1. Add environment variables in your hosting platform:

   ```
   DATABASE_URL=your-supabase-connection-string
   JWT_SECRET=your-secure-jwt-secret
   NODE_ENV=production
   ```

2. Use the **Connection Pooler** URL (not direct connection)

3. Consider upgrading to Supabase Pro for:
   - No pausing
   - More storage
   - Better performance
   - Daily backups

## Next Steps

✅ Database is set up!  
✅ Connection is configured!  
✅ Schema is created!

Now you can:

1. Test all API endpoints (see `docs/USER_MANAGEMENT.md`)
2. Build your frontend UI
3. Integrate with your recipe app features

## Useful Supabase Features

Even though you're not using Supabase Auth, you can still use:

- **Table Editor**: Visual database browser
- **SQL Editor**: Run queries and scripts
- **Database Logs**: Monitor queries and errors
- **Backups**: Automatic backups (Pro plan)
- **Extensions**: Enable PostgreSQL extensions
- **Realtime**: Add real-time subscriptions to your tables (if needed later)

---

Need help? Check:

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Connection Strings](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING)
- Your `docs/USER_MANAGEMENT.md` for API documentation
