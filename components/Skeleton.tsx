import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`animate-pulse bg-slate-200 rounded ${className}`}></div>
  );
};

export const TripCardSkeleton: React.FC = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-[340px]">
            <div className="h-48 bg-slate-200 animate-pulse" />
            <div className="p-4 space-y-3">
                <div className="h-6 w-3/4 bg-slate-200 animate-pulse rounded" />
                <div className="h-4 w-1/2 bg-slate-200 animate-pulse rounded" />
                <div className="pt-4 flex justify-between items-center mt-auto">
                    <div className="h-4 w-24 bg-slate-200 animate-pulse rounded" />
                    <div className="h-8 w-8 bg-slate-200 animate-pulse rounded-full" />
                </div>
            </div>
        </div>
    );
};