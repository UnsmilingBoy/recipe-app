# Saved Recipes Migration Guide

## Database Migration

To enable saved recipes functionality with Supabase, run the following migration:

```bash
psql $DATABASE_URL < migrations/add_saved_recipes.sql
```

Or in Supabase SQL Editor, run the contents of `migrations/add_saved_recipes.sql`.

## What This Migration Does

1. **Creates `saved_recipes` table**:

   - `id`: Primary key
   - `user_id`: Foreign key to users table
   - `recipe_data`: JSONB field storing the complete recipe object
   - `created_at`: Timestamp when recipe was saved
   - `updated_at`: Timestamp of last update
   - **Unique constraint**: Prevents duplicate saves (same user + recipe title)

2. **Creates indexes**:

   - `idx_saved_recipes_user_id`: Fast lookups by user
   - `idx_saved_recipes_title`: Fast searches by recipe title

3. **Creates trigger**:
   - Automatically updates `updated_at` timestamp on modifications

## API Endpoints

### GET `/api/saved-recipes`

- Returns all saved recipes for authenticated user
- **Auth**: Required (JWT token in cookies)
- **Response**: `{ recipes: Recipe[] }`

### POST `/api/saved-recipes`

- Save a new recipe for authenticated user
- **Auth**: Required (JWT token in cookies)
- **Body**: `{ recipe: Recipe }`
- **Response**: `{ message: string, recipe: Recipe }`
- **Status codes**:
  - 201: Created successfully
  - 409: Recipe already saved
  - 401: Unauthorized
  - 400: Invalid recipe data

### DELETE `/api/saved-recipes?title={recipeTitle}`

- Delete a saved recipe
- **Auth**: Required (JWT token in cookies)
- **Query param**: `title` - Recipe title to delete
- **Response**: `{ message: string }`
- **Status codes**:
  - 200: Deleted successfully
  - 404: Recipe not found
  - 401: Unauthorized

## Frontend Changes

### Updated Components

1. **SavedRecipesContext** (`app/context/SavedRecipesContext.tsx`):

   - Now uses API calls instead of localStorage
   - Fetches recipes from database on mount
   - Provides async save/unsave methods
   - Includes `isLoading` state
   - Includes `refetch()` method for manual reload

2. **RecipeView** (`app/components/RecipeView.tsx`):

   - Save button now handles async operations
   - Shows loading state during save/unsave
   - Displays error toast on failure
   - Success toast on save

3. **SavedRecipesPage** (`app/saved-recipes/page.tsx`):
   - Handles async delete operations
   - Shows loading indicator during deletion
   - Proper error handling

## Testing

1. **Create a recipe** and click the save button
2. **Navigate to Saved Recipes** from the menu
3. **Verify the recipe appears** in the list
4. **Delete a recipe** and verify it's removed
5. **Refresh the page** - recipes should persist (from database)
6. **Log out and log in** - recipes should still be there

## Migration Steps

1. Run the SQL migration:

   ```bash
   psql $DATABASE_URL < migrations/add_saved_recipes.sql
   ```

2. Restart your Next.js dev server:

   ```bash
   npm run dev
   ```

3. Test the functionality:

   - Log in to the app
   - Generate a recipe
   - Save it using the bookmark button
   - Navigate to "Saved Recipes" in the menu
   - Verify the recipe appears

4. Check database:
   ```sql
   SELECT * FROM saved_recipes;
   ```

## Data Migration (if needed)

If users already have saved recipes in localStorage, they will lose them after this migration. To preserve them, you could create a one-time migration script to:

1. Read from localStorage
2. POST each recipe to `/api/saved-recipes`

This can be done with a small client-side script or manually.

## Rollback

To rollback this migration:

```sql
DROP TABLE IF EXISTS saved_recipes CASCADE;
DROP FUNCTION IF EXISTS update_saved_recipes_updated_at() CASCADE;
```

## Security Considerations

- ✅ All endpoints require authentication
- ✅ Users can only access their own saved recipes
- ✅ JSONB validation prevents SQL injection
- ✅ Unique constraint prevents duplicate saves
- ✅ Foreign key cascade ensures cleanup on user deletion
