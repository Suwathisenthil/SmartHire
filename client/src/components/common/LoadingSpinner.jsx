import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ text = 'Analyzing recruitment data...', fullScreen = false }) {
  if (fullScreen) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3.5">
        <div className="relative">
          <Loader2 className="w-10 h-10 text-indigo-600 dark:text-indigo-400 animate-spin" />
        </div>
        <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">{text}</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2.5 py-8 text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-semibold">
      <Loader2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-spin" />
      <span>{text}</span>
    </div>
  );
}
