import React from 'react';
import { cn } from '@/lib/utils';

export function AdSlot({
  type = 'responsive',
  className,
}: {
  type?: 'banner' | 'sidebar' | 'responsive';
  className?: string;
}) {
  return (
    <div
      className={cn(
        'relative bg-muted/10 border border-dashed border-muted flex items-center justify-center overflow-hidden my-6',
        type === 'banner' && 'w-full max-w-[728px] h-[90px] mx-auto',
        type === 'sidebar' && 'w-[300px] h-[250px]',
        type === 'responsive' && 'w-full min-h-[100px]',
        className
      )}
    >
      <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
        Advertisement
      </span>
    </div>
  );
}
