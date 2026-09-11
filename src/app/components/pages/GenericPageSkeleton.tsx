import { Skeleton, SkeletonText, SkeletonCard, SkeletonButton } from "./SkeletonLoader";

export function GenericPageSkeleton() {
  return (
    <div className="min-h-screen py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#f4f5f7" }}>
      {/* Header */}
      <div className="rounded-[4px] border border-slate-200/80 bg-white p-6 mb-6 shadow-xs">
        <Skeleton className="h-4 w-24 mb-2 rounded-[3px]" />
        <Skeleton className="h-9 w-64 mb-2 rounded-[3px]" />
        <Skeleton className="h-4 w-96 rounded-[3px]" />
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
        <div className="rounded-[4px] border border-slate-200/80 bg-white p-6 shadow-xs">
          <Skeleton className="h-6 w-48 mb-6 rounded-[3px]" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 border border-slate-200/80 rounded-[4px]">
                <Skeleton className="h-10 w-10 rounded-[3px]" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-48 mb-2 rounded-[3px]" />
                  <Skeleton className="h-3 w-32 rounded-[3px]" />
                </div>
                <SkeletonButton />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

