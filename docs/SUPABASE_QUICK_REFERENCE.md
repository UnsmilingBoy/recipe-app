# Quick Supabase Reference Guide

## Where to Find Everything in Supabase

### Getting Your Connection String

```
Supabase Dashboard
└── Settings (left sidebar, bottom)
    └── Database
        └── Connection string
            └── [Tab] Connection pooling  ← Use this one!
                └── URI
                    └── Copy this: postgresql://postgres.xxxxx...
```

**What it looks like:**

```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
                      ↑              ↑
                      Your project   Replace with your
                      reference      actual password
```

### Running SQL Setup Script

```
Supabase Dashboard
└── SQL Editor (left sidebar)
    └── + New query
        └── [Paste your SQL from scripts/setup-db.sql]
        └── Click "Run" or Ctrl+Enter
```

### Viewing Your Users Table

```
Supabase Dashboard
└── Table Editor (left sidebar)
    └── users (should appear after running SQL script)
        └── Click to view all users
        └── You can manually add/edit/delete users here too
```

### Checking Database Logs (if needed)

```
Supabase Dashboard
└── Database (left sidebar)
    └── Logs
        └── See all queries and errors in real-time
```

---

## Your Connection String Components

Break down of what each part means:

```
postgresql://postgres.abcdefghij:mypassword@aws-0-us-east-1.pooler.supabase.com:6543/postgres
│            │                    │          │                                      │    │
│            │                    │          │                                      │    └─ Database name
│            │                    │          │                                      └────── Port (6543 for pooler)
│            │                    │          └───────────────────────────────────────────── Host (Supabase server)
│            │                    └──────────────────────────────────────────────────────── Your password
│            └───────────────────────────────────────────────────────────────────────────── Username (includes project ref)
└────────────────────────────────────────────────────────────────────────────────────────── Protocol
```

---

## Two Types of Connections

### 1. Connection Pooling (Recommended) ⭐

```
Port: 6543
URL: postgresql://postgres.xxx:pass@aws-0-region.pooler.supabase.com:6543/postgres

✅ Use for: Production, serverless functions
✅ Better for: Many concurrent connections
✅ Max connections: Up to 15,000 (managed by pooler)
```

### 2. Direct Connection

```
Port: 5432
URL: postgresql://postgres:pass@db.xxx.supabase.co:5432/postgres

✅ Use for: Development, admin tasks
✅ Better for: Long-running connections
⚠️ Max connections: 60 simultaneous
```

**For this project, use Connection Pooling (#1)**

---

## Environment Variables Setup

**Step 1:** Copy the example

```powershell
cp .env.example .env.local
```

**Step 2:** Edit `.env.local`

```env
DATABASE_URL=postgresql://postgres.abcdefghij:mypassword@aws-0-us-east-1.pooler.supabase.com:6543/postgres
JWT_SECRET=run-this-command-to-generate-see-below
NODE_ENV=development
```

**Step 3:** Generate JWT Secret

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output (looks like: `a1b2c3d4e5f6...`) and paste it as `JWT_SECRET` value.

---

## Testing Commands

### Test 1: Register a user

```javascript
// Open browser console on http://localhost:3000 and paste:
fetch("/api/users/register", {
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

**Expected result:**

```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "test@example.com",
    "name": "Test User",
    "created_at": "2025-11-11T...",
    "updated_at": "2025-11-11T..."
  }
}
```

### Test 2: Login

```javascript
fetch("/api/users/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "test@example.com",
    password: "password123",
  }),
  credentials: "include",
})
  .then((r) => r.json())
  .then(console.log);
```

### Test 3: Get current user

```javascript
fetch("/api/users/me", {
  credentials: "include",
})
  .then((r) => r.json())
  .then(console.log);
```

---

## Common Issues & Solutions

### ❌ "Connection timeout"

**Solution:**

- Check your internet connection
- Verify the connection string is correct
- Try the Direct Connection string instead

### ❌ "Password authentication failed"

**Solution:**

- Go back to Supabase Settings → Database
- Reset your database password
- Update `.env.local` with new password

### ❌ "relation 'users' does not exist"

**Solution:**

- You haven't run the SQL setup script yet
- Go to SQL Editor and run `scripts/setup-db.sql`

### ❌ "SSL required"

**Solution:**

- Already handled in the code!
- Check `lib/db.ts` line 7: `ssl: { rejectUnauthorized: false }`

---

## Quick Links

- 🔗 [Supabase Dashboard](https://supabase.com/dashboard)
- 📖 [Supabase Docs](https://supabase.com/docs)
- 🎓 [PostgreSQL Connection Strings](https://www.postgresql.org/docs/current/libpq-connect.html)

---

## Project Documentation

- `SUPABASE_CHECKLIST.md` ← You are here!
- `docs/SUPABASE_SETUP.md` - Detailed setup guide
- `docs/USER_MANAGEMENT.md` - API documentation
- `.env.example` - Environment template
