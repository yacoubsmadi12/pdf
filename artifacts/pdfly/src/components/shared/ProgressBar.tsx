import React from 'react';
import { Progress } from '@/components/ui/progress';

interface ProgressBarProps {
  progress?: number;
  label?: string;
}

export function ProgressBar({ progress = 0, label = 'Processing...' }: ProgressBarProps) {
  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm font-medium">
        <span>{label}</span>
        <span>{progress}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}
