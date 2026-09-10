import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { getScoreBadgeColor } from '../../utils/constants';

export default function MatchScoreBadge({ score, size = 'md', showLabel = true }) {
  const color = getScoreBadgeColor(score);

  if (size === 'lg') {
    return (
      <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-xl border ${color.light} shadow-sm`}>
        <div className="relative flex items-center justify-center">
          <svg className="w-12 h-12 transform -rotate-90">
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke="currentColor"
              strokeWidth="4"
              className="text-slate-200"
              fill="transparent"
            />
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke="currentColor"
              strokeWidth="4"
              strokeDasharray={125.6}
              strokeDashoffset={125.6 - (125.6 * score) / 100}
              strokeLinecap="round"
              className={color.text}
              fill="transparent"
            />
          </svg>
          <span className={`absolute font-bold text-sm ${color.text}`}>{score}%</span>
        </div>
        {showLabel && (
          <div>
            <div className="flex items-center gap-1 font-semibold text-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Job Match</span>
            </div>
            <p className="text-xs opacity-80">
              {score >= 80 ? 'Strong Fit' : score >= 60 ? 'Moderate Fit' : 'Skill Gap'}
            </p>
          </div>
        )}
      </div>
    );
  }

  // Default compact pill badge
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${color.light} shadow-xs`}
    >
      <span className={`w-2 h-2 rounded-full ${color.bg}`} />
      <span>{score}% Match</span>
    </span>
  );
}
