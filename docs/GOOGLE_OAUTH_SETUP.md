# Google OAuth Setup Guide

This guide will walk you through setting up Google OAuth authentication for your Recipe App.

## Prerequisites

- A Google account
- Your app running locally or deployed

## Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click "Enable"

## Step 2: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. If prompted, configure the OAuth consent screen:
   - Choose "External" user type
   - Fill in app name: "Recipe Assistant"
   - Add your email as support email
   - Add authorized domains (e.g., `localhost` for development, your production domain)
   - Save and continue through the scopes (no additional scopes needed)
4. Back in "Create OAuth client ID":
   - Application type: "Web application"
   - Name: "Recipe App Web Client"
   - Authorized JavaScript origins:
     - `http://localhost:3000` (for development)
     - `https://yourdomain.com` (for production)
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/google/callback` (for development)
     - `https://yourdomain.com/api/auth/google/callback` (for production)
5. Click "Create"
6. Copy your Client ID and Client Secret

## Step 3: Update Environment Variables

Add these to your `.env.local` file:

```env
GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret-here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

For production, update `NEXT_PUBLIC_BASE_URL` to your actual domain:

```env
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

## Step 4: Run Database Migration

Run the SQL migration to add Google OAuth support to your database:

```bash
psql $DATABASE_URL < migrations/add_google_oauth.sql
```

Or manually run the SQL commands from `migrations/add_google_oauth.sql` in your database client.

## Step 5: Test the Integration

1. Restart your development server:

   ```bash
   npm run dev
   ```

2. Navigate to `/login`

3. Click "Continue with Google"

4. You should be redirected to Google's login page

5. After successful authentication, you'll be redirected back to your app and logged in

## Troubleshooting

### Redirect URI Mismatch Error

If you see "redirect_uri_mismatch" error:

- Double-check that your redirect URI in Google Console exactly matches: `http://localhost:3000/api/auth/google/callback`
- Make sure there are no trailing slashes
- Ensure the protocol (http/https) matches

### "Access blocked: This app's request is invalid"

- Make sure you've configured the OAuth consent screen
- Add test users if your app is in testing mode
- Check that required scopes are added

### OAuth State Error

- Clear your cookies and try again
- The state parameter is used for CSRF protection and expires after 10 minutes

### Database Errors

- Ensure the migration has been run successfully
- Check that the `google_id` column exists in your `users` table
- Verify `password_hash` is now nullable

## How It Works

1. **User clicks "Continue with Google"**

   - Redirects to `/api/auth/google`
   - Creates a random state parameter for CSRF protection
   - Redirects to Google's OAuth page

2. **User authenticates with Google**

   - Google validates the user
   - Redirects back to `/api/auth/google/callback` with an authorization code

3. **Callback processes the authentication**
   - Verifies the state parameter
   - Exchanges the code for access tokens
   - Fetches user info from Google
   - Checks if user exists in database:
     - If exists: Links Google account to existing user
     - If new: Creates new user account
   - Generates JWT token
   - Sets auth cookie
   - Redirects to home page

## Security Considerations

- OAuth state parameter prevents CSRF attacks
- Tokens are stored in HTTP-only cookies
- JWT tokens expire after 7 days
- Google IDs are stored in database for account linking
- Existing password-based accounts can be linked to Google accounts

## Production Deployment

Before deploying to production:

1. Update Google OAuth credentials:

   - Add production domain to authorized origins
   - Add production callback URL to authorized redirect URIs

2. Update environment variables:

   - Set `NEXT_PUBLIC_BASE_URL` to your production URL
   - Ensure `NODE_ENV=production`
   - Use secure secrets for `JWT_SECRET`

3. Enable HTTPS:
   - OAuth requires HTTPS in production
   - Update `secure` flag in cookie settings (already handled by `NODE_ENV` check)

## Support

If you encounter issues:

1. Check the browser console for errors
2. Check your server logs
3. Verify all environment variables are set correctly
4. Ensure database migration was successful
