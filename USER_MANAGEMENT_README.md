# User Management Quick Start

A production-ready user management system has been implemented for your recipe app! 🎉

## What's Included

✅ **Complete API Routes:**

- `POST /api/users/register` - User registration
- `POST /api/users/login` - User authentication
- `POST /api/users/logout` - Clear session
- `GET /api/users/me` - Get current user
- `PUT /api/users/me` - Update profile
- `DELETE /api/users/me` - Delete account

✅ **Security Features:**

- Bcrypt password hashing (10 rounds)
- JWT tokens with HTTP-only cookies
- Secure cookie flags for production
- Input validation with Zod
- SQL injection protection
- Email uniqueness enforcement

✅ **Clean Architecture:**

- Separation of concerns
- Reusable middleware
- TypeScript throughout
- Connection pooling
- Error handling

## Setup Steps

### 1. Configure Database

Copy environment variables template:

```powershell
cp .env.example .env.local
```

Edit `.env.local` with your PostgreSQL credentials:

```env
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=<generate-a-secure-secret>
NODE_ENV=development
```

Generate a secure JWT secret:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Initialize Database

Run the setup script on your PostgreSQL database:

```powershell
# Using psql
$env:DATABASE_URL = "postgresql://username:password@host:port/database"
psql $env:DATABASE_URL -f scripts/setup-db.sql

# Or manually run scripts/setup-db.sql in your database client
```

### 3. Test the API

Start the dev server:

```powershell
npm run dev
```

Test with your browser or tools like Postman, Insomnia, or cURL.

## 📚 Full Documentation

See **[docs/USER_MANAGEMENT.md](docs/USER_MANAGEMENT.md)** for:

- Complete API documentation
- Usage examples (fetch, cURL)
- Security considerations
- Production deployment guide
- Architecture overview

## Quick Test Examples

**Register a user:**

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

**Login:**

```javascript
fetch("http://localhost:3000/api/users/login", {
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

**Get profile:**

```javascript
fetch("http://localhost:3000/api/users/me", {
  credentials: "include",
})
  .then((r) => r.json())
  .then(console.log);
```

## File Structure

```
recipe-app/
├── app/api/users/
│   ├── register/route.ts    # Registration endpoint
│   ├── login/route.ts       # Login endpoint
│   ├── logout/route.ts      # Logout endpoint
│   └── me/route.ts          # Profile management (GET/PUT/DELETE)
├── lib/
│   ├── db.ts               # PostgreSQL connection pool
│   ├── auth.ts             # JWT & cookie utilities
│   ├── middleware.ts       # Auth middleware
│   └── userSchema.ts       # Zod schemas & types
├── scripts/
│   └── setup-db.sql        # Database initialization
├── docs/
│   └── USER_MANAGEMENT.md  # Full documentation
└── .env.example            # Environment template
```

## Next Steps

1. ✅ Set up your PostgreSQL database
2. ✅ Configure `.env.local`
3. ✅ Run database setup script
4. ✅ Test the endpoints
5. 🚀 Build your frontend!

## Support

For detailed information, troubleshooting, and production deployment:
👉 See **[docs/USER_MANAGEMENT.md](docs/USER_MANAGEMENT.md)**

---

**Note about the npm warning:** The `node-domexception` deprecation warning is from `@google/genai` dependency chain. It's safe to ignore - it doesn't affect user management functionality. To resolve it, you can update `@google/genai` when they release a version with updated dependencies.
