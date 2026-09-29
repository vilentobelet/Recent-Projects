import type { CSSProperties } from "react";
import type { ViewMode } from "../model";

function Bone({ className, style }: { className?: string; style?: CSSProperties }) {
  return <div className={`animate-pulse rounded-md bg-white/[0.07] ${className ?? ""}`} style={style} />;
}

export function ProjectCardSkeleton({
  viewMode = "cards",
}: {
  viewMode?: ViewMode;
}) {
  return (
    <article
      aria-hidden="true"
      className={`relative w-full overflow-hidden border border-white/[0.09] bg-[#202020] shadow-[0_18px_55px_rgba(0,0,0,.22)] ${viewMode === "cards" ? "rounded-[1.4rem]" : "rounded-2xl"}`}
    >
      <div className="absolute inset-y-0 left-0 w-1 bg-orange-500/35" />
      {viewMode === "compact" ? (
        <div className="grid grid-cols-1 items-start gap-3 p-3 sm:p-3.5 md:grid-cols-[minmax(0,1fr)_minmax(17rem,22rem)] md:items-center">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <Bone className="size-10 shrink-0 rounded-xl" />
            <div className="min-w-0 flex-1">
              <Bone className="h-4 w-40" />
              <Bone className="mt-2 h-3 w-full max-w-md" />
              <Bone className="mt-1.5 h-3 w-2/3 max-w-xs" />
              <div className="mt-2 flex gap-1.5">
                <Bone className="h-4 w-10 rounded" />
                <Bone className="h-4 w-14 rounded" />
              </div>
            </div>
          </div>
          <div className="flex min-w-0 w-full flex-col gap-2">
            <div className="flex min-w-0 w-full items-center gap-2">
              <div className="flex min-w-0 flex-1 items-center gap-2.5 rounded-xl border border-white/[0.07] bg-black/20 p-2">
                <Bone className="size-8 shrink-0 rounded-lg" />
                <Bone className="h-3 flex-1" />
                <Bone className="hidden h-7 w-14 shrink-0 rounded-lg sm:block" />
              </div>
              <Bone className="h-9 w-[4.5rem] shrink-0 rounded-xl bg-orange-500/25" />
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 sm:p-[1.125rem]">
          <div className="mb-3.5 flex items-center gap-3">
            <Bone className="size-9 shrink-0 rounded-xl" />
            <div className="min-w-0 flex-1">
              <Bone className="mb-1.5 h-3.5 w-16 rounded" />
              <Bone className="h-[1.125rem] w-44 max-w-[70%]" />
            </div>
          </div>
          <Bone className="mb-2 h-2.5 w-20" />
          <Bone className="mb-1.5 h-3 w-[92%]" />
          <Bone className="mb-1.5 h-3 w-[84%]" />
          <Bone className="mb-2.5 h-3 w-[62%]" />
          <div className="mb-3.5 flex gap-1.5">
            <Bone className="h-4 w-10 rounded" />
            <Bone className="h-4 w-16 rounded" />
          </div>
          <div className="flex min-w-0 items-center gap-2.5 rounded-xl border border-white/[0.07] bg-black/20 p-2.5">
            <Bone className="size-8 shrink-0 rounded-lg" />
            <Bone className="h-3 flex-1" />
            <Bone className="h-4 w-10 shrink-0 rounded" />
            <Bone className="hidden h-8 w-14 shrink-0 rounded-xl sm:block" />
            <Bone className="h-9 w-[4.5rem] shrink-0 rounded-xl bg-orange-500/25" />
          </div>
        </div>
      )}
    </article>
  );
}

export function ProjectCardSkeletonGrid({
  viewMode = "cards",
  count = 4,
}: {
  viewMode?: ViewMode;
  count?: number;
}) {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <ProjectCardSkeleton key={index} viewMode={viewMode} />
      ))}
    </>
  );
}
