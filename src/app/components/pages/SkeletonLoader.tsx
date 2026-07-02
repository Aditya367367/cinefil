export function Skeleton({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      {...props}
    />
  );
}

export function SkeletonText({ lines = 3, className = "" }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 ${i === lines - 1 ? "w-3/4" : "w-full"}`}
        />
      ))}
    </div>
  );
}

export function SkeletonTitle({ className = "" }: { className?: string }) {
  return <Skeleton className={`h-8 w-1/2 mb-4 ${className}`} />;
}

export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-200 p-6 ${className}`}>
      <Skeleton className="h-6 w-3/4 mb-4" />
      <SkeletonText lines={3} />
    </div>
  );
}

export function SkeletonImage({ className = "" }: { className?: string }) {
  return <Skeleton className={`aspect-square w-full ${className}`} />;
}

export function SkeletonButton({ className = "" }: { className?: string }) {
  return <Skeleton className={`h-10 w-32 rounded-full ${className}`} />;
}

export function SkeletonAvatar({ className = "" }: { className?: string }) {
  return <Skeleton className={`h-12 w-12 rounded-full ${className}`} />;
}
