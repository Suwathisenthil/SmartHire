import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';

export default function SkillGapChart({ skillsData = [] }) {
  const { isDark } = useTheme();

  if (!skillsData || skillsData.length === 0) {
    return (
      <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
        No skill gap metrics available for display.
      </div>
    );
  }

  const chartData = skillsData.slice(0, 8).map(item => ({
    name: item.skill,
    demand: item.demandCount || item.demandPercentage || 0,
    percentage: item.demandPercentage || 0
  }));

  const COLORS = ['#6366f1', '#4f46e5', '#3b82f6', '#0ea5e9', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'];

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 15, left: -20, bottom: 25 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={isDark ? '#1e293b' : '#f1f5f9'}
            vertical={false}
          />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: isDark ? '#94a3b8' : '#64748b' }}
            angle={-25}
            textAnchor="end"
            interval={0}
          />
          <YAxis
            tick={{ fontSize: 11, fill: isDark ? '#94a3b8' : '#64748b' }}
            allowDecimals={false}
          />
          <Tooltip
            formatter={(value, name, props) => [`${value} openings (${props.payload.percentage}%)`, 'Market Demand']}
            contentStyle={{
              backgroundColor: isDark ? '#0f172a' : '#ffffff',
              borderRadius: '12px',
              border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
              color: isDark ? '#f8fafc' : '#0f172a',
              fontSize: '12px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)'
            }}
            itemStyle={{ color: '#6366f1', fontWeight: 600 }}
          />
          <Bar dataKey="demand" radius={[6, 6, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
