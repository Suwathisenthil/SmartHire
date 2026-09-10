import React from 'react';
import { Check, X, Star } from 'lucide-react';

export default function SkillChip({ skill, variant = 'neutral', onRemove, size = 'md' }) {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  const variants = {
    matched: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-500/20',
    missing: 'bg-rose-50 text-rose-700 border-rose-200 ring-1 ring-rose-500/20',
    preferred: 'bg-purple-50 text-purple-700 border-purple-200 ring-1 ring-purple-500/20',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border transition-colors ${variants[variant] || variants.neutral} ${sizeClasses}`}
    >
      {variant === 'matched' && <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />}
      {variant === 'missing' && <X className="w-3.5 h-3.5 text-rose-600 stroke-[2.5]" />}
      {variant === 'preferred' && <Star className="w-3.5 h-3.5 text-purple-600 fill-purple-600/30" />}
      <span>{skill}</span>
      {onRemove && (
        <button
          type="button"
          onClick={() => onRemove(skill)}
          className="ml-1 text-slate-400 hover:text-slate-700 rounded-full p-0.5 focus:outline-none"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
}
