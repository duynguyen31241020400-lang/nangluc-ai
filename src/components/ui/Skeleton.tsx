"use client";

export default function Skeleton({ className }: { className?: string }) {
  return (
    <div classname="{`animate-pulse" bg-slate-200="" rounded-md="" ${classname}`}=""/>
  );
}

export function ChatSkeleton() {
  return (
    <div classname="space-y-4 p-4">
      <div classname="flex items-start gap-3">
        <skeleton classname="h-8 w-8 rounded-full"/>
        <skeleton classname="h-16 w-48 rounded-2xl"/>
      </div>
      <div classname="flex items-start gap-3 flex-row-reverse">
        <skeleton classname="h-8 w-8 rounded-full"/>
        <skeleton classname="h-12 w-32 rounded-2xl"/>
      </div>
      <div classname="flex items-start gap-3">
        <skeleton classname="h-8 w-8 rounded-full"/>
        <skeleton classname="h-24 w-64 rounded-2xl"/>
      </div>
    </div>
  );
}
