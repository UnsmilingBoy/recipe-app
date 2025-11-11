# User Management API Documentation

A clean and secure user management system built with Next.js API routes and PostgreSQL.

## Features

- ✅ User registration with email and password
- ✅ Secure password hashing with bcrypt
- ✅ JWT-based authentication with HTTP-only cookies
- ✅ User login and logout
- ✅ Get current user profile
- ✅ Update user profile (name, email, password)
- ✅ Delete user account
- ✅ Input validation with Zod
- ✅ TypeScript support
- ✅ Clean separation of concerns

## Setup

### 1. Install Dependencies

All required dependencies are already installed:

- `pg` - PostgreSQL client
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT token generation
- `cookie` - Cookie parsing
- `zod` - Schema validation

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and update with your database credentials:

```bash
cp .env.example .env.local
```

Update the values in `.env.local`:

```env
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

**Generate a secure JWT secret:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Setup PostgreSQL Database

Run the SQL script to create the users table:

```bash
psql $DATABASE_URL -f scripts/setup-db.sql
```

Or manually execute the SQL in your database client:

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
```

### 4. Start Development Server

```bash
npm run dev
```

## API Endpoints

### Base URL

All endpoints are prefixed with `/api/users`

---

### 1. Register User

**POST** `/api/users/register`

Create a new user account.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "name": "John Doe"
}
```

**Success Response (201):**

```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "created_at": "2025-11-11T10:00:00.000Z",
    "updated_at": "2025-11-11T10:00:00.000Z"
  }
}
```

**Error Responses:**

- `400` - Validation failed
- `409` - Email already exists
- `500` - Internal server error

**Sets Cookie:** `auth_token` (HTTP-only, 7-day expiry)

---

### 2. Login

**POST** `/api/users/login`

Authenticate user and receive auth token.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Success Response (200):**

```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "created_at": "2025-11-11T10:00:00.000Z",
    "updated_at": "2025-11-11T10:00:00.000Z"
  }
}
```

**Error Responses:**

- `400` - Validation failed
- `401` - Invalid email or password
- `500` - Internal server error

**Sets Cookie:** `auth_token` (HTTP-only, 7-day expiry)

---

### 3. Logout

**POST** `/api/users/logout`

Clear authentication cookie.

**Success Response (200):**

```json
{
  "message": "Logout successful"
}
```

**Clears Cookie:** `auth_token`

---

### 4. Get Current User

**GET** `/api/users/me`

Get authenticated user's profile.

**Requires:** Valid `auth_token` cookie

**Success Response (200):**

```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "created_at": "2025-11-11T10:00:00.000Z",
    "updated_at": "2025-11-11T10:00:00.000Z"
  }
}
```

**Error Responses:**

- `401` - Authentication required / Invalid token
- `500` - Internal server error

---

### 5. Update User Profile

**PUT** `/api/users/me`

Update authenticated user's profile.

**Requires:** Valid `auth_token` cookie

**Request Body (all fields optional):**

```json
{
  "name": "Jane Doe",
  "email": "newemail@example.com",
  "currentPassword": "oldpassword",
  "newPassword": "newsecurepassword123"
}
```

**Notes:**

- To change password, both `currentPassword` and `newPassword` are required
- Email must be unique (not used by another user)

**Success Response (200):**

```json
{
  "message": "User updated successfully",
  "user": {
    "id": 1,
    "email": "newemail@example.com",
    "name": "Jane Doe",
    "created_at": "2025-11-11T10:00:00.000Z",
    "updated_at": "2025-11-11T12:30:00.000Z"
  }
}
```

**Error Responses:**

- `400` - Validation failed
- `401` - Authentication required / Current password incorrect
- `409` - Email already in use
- `500` - Internal server error

---

### 6. Delete Account

**DELETE** `/api/users/me`

Permanently delete authenticated user's account.

**Requires:** Valid `auth_token` cookie

**Success Response (200):**

```json
{
  "message": "Account deleted successfully"
}
```

**Error Responses:**

- `401` - Authentication required
- `500` - Internal server error

**Clears Cookie:** `auth_token`

---

## Usage Examples

### Using Fetch API

**Register:**

```javascript
const response = await fetch("/api/users/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "user@example.com",
    password: "securepassword123",
    name: "John Doe",
  }),
  credentials: "include", // Important: include cookies
});

const data = await response.json();
```

**Login:**

```javascript
const response = await fetch("/api/users/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "user@example.com",
    password: "securepassword123",
  }),
  credentials: "include",
});

const data = await response.json();
```

**Get Current User:**

```javascript
const response = await fetch("/api/users/me", {
  credentials: "include",
});

const data = await response.json();
```

**Update Profile:**

```javascript
const response = await fetch("/api/users/me", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Jane Doe",
    email: "newemail@example.com",
  }),
  credentials: "include",
});

const data = await response.json();
```

**Logout:**

```javascript
const response = await fetch("/api/users/logout", {
  method: "POST",
  credentials: "include",
});

const data = await response.json();
```

**Delete Account:**

```javascript
const response = await fetch("/api/users/me", {
  method: "DELETE",
  credentials: "include",
});

const data = await response.json();
```

---

## Architecture

### File Structure

```
recipe-app/
├── app/
│   └── api/
│       └── users/
│           ├── register/route.ts    # POST /api/users/register
│           ├── login/route.ts       # POST /api/users/login
│           ├── logout/route.ts      # POST /api/users/logout
│           └── me/route.ts          # GET, PUT, DELETE /api/users/me
├── lib/
│   ├── db.ts                        # PostgreSQL connection pool
│   ├── auth.ts                      # JWT utilities & cookie management
│   ├── middleware.ts                # Authentication middleware
│   └── userSchema.ts                # Zod schemas & types
├── scripts/
│   └── setup-db.sql                 # Database initialization
└── .env.example                     # Environment variables template
```

### Security Features

1. **Password Hashing**: Passwords are hashed with bcrypt (10 rounds) before storage
2. **JWT Tokens**: Signed tokens with 7-day expiry
3. **HTTP-Only Cookies**: Tokens stored in HTTP-only cookies (prevents XSS)
4. **Secure Flag**: Cookies marked secure in production (HTTPS only)
5. **SameSite**: Cookies use `lax` SameSite policy (CSRF protection)
6. **Input Validation**: All inputs validated with Zod schemas
7. **Email Uniqueness**: Enforced at database level
8. **SQL Injection Protection**: Parameterized queries used throughout

### Database Schema

```sql
Table: users
+---------------+------------------------+
| Column        | Type                   |
+---------------+------------------------+
| id            | SERIAL PRIMARY KEY     |
| email         | VARCHAR(255) UNIQUE    |
| password_hash | VARCHAR(255)           |
| name          | VARCHAR(100)           |
| created_at    | TIMESTAMP WITH TZ      |
| updated_at    | TIMESTAMP WITH TZ      |
+---------------+------------------------+

Indexes:
- idx_users_email (email)
- idx_users_created_at (created_at)
```

---

## Testing with cURL

**Register:**

```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}' \
  -c cookies.txt
```

**Login:**

```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt
```

**Get Profile:**

```bash
curl -X GET http://localhost:3000/api/users/me \
  -b cookies.txt
```

**Update Profile:**

```bash
curl -X PUT http://localhost:3000/api/users/me \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Name"}' \
  -b cookies.txt
```

**Logout:**

```bash
curl -X POST http://localhost:3000/api/users/logout \
  -b cookies.txt \
  -c cookies.txt
```

---

## Production Considerations

1. **Environment Variables**:

   - Use strong, randomly generated `JWT_SECRET`
   - Set `NODE_ENV=production`
   - Use SSL for database connection

2. **Database**:

   - Enable SSL/TLS for PostgreSQL connection
   - Use connection pooling (already configured)
   - Regular backups
   - Monitor connection limits

3. **Security**:

   - Use HTTPS in production (required for secure cookies)
   - Implement rate limiting on login/register endpoints
   - Consider adding email verification
   - Consider adding password reset functionality
   - Implement session management if needed

4. **Monitoring**:
   - Log authentication failures
   - Monitor database performance
   - Track API usage

---

## Future Enhancements

- [ ] Email verification
- [ ] Password reset via email
- [ ] OAuth integration (Google, GitHub, etc.)
- [ ] Two-factor authentication (2FA)
- [ ] Rate limiting
- [ ] Session management
- [ ] User roles and permissions
- [ ] Account activity log
- [ ] Profile pictures

---

## License

This user management system is part of the recipe-app project.
