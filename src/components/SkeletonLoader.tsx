import React from 'react';

export const AppCardSkeleton: React.FC = () => {
  return (
    <div className="w-[170px] sm:w-[190px] shrink-0 p-3 rounded-2xl bg-[#14151a] border border-[#22252c] flex flex-col gap-2.5">
      <div className="w-full aspect-square rounded-xl skeleton-pulse" />
      <div className="h-4 w-3/4 rounded skeleton-pulse" />
      <div className="h-3 w-1/2 rounded skeleton-pulse" />
      <div className="flex items-center justify-between pt-1">
        <div className="h-3 w-10 rounded skeleton-pulse" />
        <div className="h-3 w-12 rounded skeleton-pulse" />
      </div>
    </div>
  );
};

export const HeroSkeleton: React.FC = () => {
  return (
    <div className="w-full h-64 md:h-80 rounded-3xl skeleton-pulse border border-[#22252c] p-6 flex flex-col justify-end gap-3">
      <div className="h-6 w-1/4 rounded skeleton-pulse" />
      <div className="h-4 w-1/2 rounded skeleton-pulse" />
      <div className="h-10 w-32 rounded-xl skeleton-pulse" />
    </div>
  );
};

export const AppRowSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 my-6">
      <div className="flex items-center justify-between">
        <div className="h-5 w-48 rounded skeleton-pulse" />
        <div className="h-4 w-16 rounded skeleton-pulse" />
      </div>
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <AppCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};
