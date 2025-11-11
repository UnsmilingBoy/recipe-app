export default function LoginLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 px-4 pt-20">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-8 animate-pulse">
          {/* Header skeleton */}
          <div className="text-center mb-8">
            <div className="h-8 bg-gray-200 dark:bg-zinc-700 rounded w-3/4 mx-auto mb-2" />
            <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-1/2 mx-auto" />
          </div>

          {/* Form skeleton */}
          <div className="space-y-5">
            <div>
              <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-1/4 mb-2" />
              <div className="h-12 bg-gray-200 dark:bg-zinc-700 rounded" />
            </div>
            <div>
              <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-1/4 mb-2" />
              <div className="h-12 bg-gray-200 dark:bg-zinc-700 rounded" />
            </div>
            <div className="h-12 bg-gray-200 dark:bg-zinc-700 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
