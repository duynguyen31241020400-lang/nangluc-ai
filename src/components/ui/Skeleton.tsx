"use client";

export default function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-slate-200 rounded-md ${className}`} />
  );
}

export function ChatSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <div className="flex items-start gap-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-16 w-48 rounded-2xl" />
      </div>
      <div className="flex items-start gap-3 flex-row-reverse">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-12 w-32 rounded-2xl" />
      </div>
      <div className="flex items-start gap-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-24 w-64 rounded-2xl" />
      </div>
    </div>
  );
}
