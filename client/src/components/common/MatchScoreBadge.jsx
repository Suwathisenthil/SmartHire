import React from 'react';
import { Sparkles, CheckCircle2, Zap } from 'lucide-react';
import { getScoreBadgeColor } from '../../utils/constants';

export default function MatchScoreBadge({ score, size = 'md', showLabel = true }) {
  const color = getScoreBadgeColor(score);

  if (size === 'lg') {
    return (
      <div className={`inline-flex items-center gap-3.5 px-4 py-2.5 rounded-2xl border ${color.light} backdrop-blur-sm shadow-sm transition-all`}>
        <div className="relative flex items-center justify-center">
          <svg className="w-14 h-14 transform -rotate-90">
            <circle
              cx="28"
              cy="28"
              r="23"
              stroke="currentColor"
              strokeWidth="4.5"
              className="text-slate-200 dark:text-slate-800"
              fill="transparent"
            />
            <circle
              cx="28"
              cy="28"
              r="23"
              stroke="currentColor"
              strokeWidth="4.5"
              strokeDasharray={144.5}
              strokeDashoffset={144.5 - (144.5 * Math.min(100, Math.max(0, score))) / 100}
              strokeLinecap="round"
              className={color.text}
              fill="transparent"
            />
          </svg>
          <span className={`absolute font-extrabold text-sm ${color.text}`}>{score}%</span>
        </div>
        {showLabel && (
          <div>
            <div className="flex items-center gap-1 font-bold text-xs uppercase tracking-wider opacity-90">
              <Zap className="w-3.5 h-3.5" />
              <span>Match Engine</span>
            </div>
            <p className={`text-xs font-extrabold mt-0.5 ${color.text}`}>
              {color.tier}
            </p>
          </div>
        )}
      </div>
    );
  }

  // Default compact pill badge
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${color.light} transition-all`}
    >
      <span className={`w-2 h-2 rounded-full ${color.bg} animate-pulse`} />
      <span>{score}% Match</span>
    </span>
  );
}
