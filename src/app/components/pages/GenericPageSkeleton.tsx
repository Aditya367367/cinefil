import { Skeleton, SkeletonText, SkeletonCard, SkeletonButton, SkeletonImage } from "./SkeletonLoader";

export function GenericPageSkeleton() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f4f5f7" }}>
      {/* Header */}
      <div className="rounded-2xl border border-white bg-white p-5 sm:p-6 mb-6">
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-10 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* Stats/Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>

        {/* Main Content Area */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <Skeleton className="h-6 w-48 mb-6" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-48 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <SkeletonButton />
              </div>
            ))}
          </div>
        </div>

        {/* Secondary Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <SkeletonText lines={4} />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
