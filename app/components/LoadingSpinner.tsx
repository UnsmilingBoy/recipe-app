"use client";

export default function LoadingSpinner({
  size = "default",
}: {
  size?: "small" | "default" | "large";
}) {
  const sizeClasses = {
    small: "h-8 w-8",
    default: "h-12 w-12",
    large: "h-16 w-16",
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div
        className={`animate-spin rounded-full border-b-2 border-primary ${sizeClasses[size]}`}
      ></div>
    </div>
  );
}
