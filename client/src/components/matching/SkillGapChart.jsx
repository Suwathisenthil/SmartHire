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

export default function SkillGapChart({ skillsData = [] }) {
  if (!skillsData || skillsData.length === 0) {
    return (
      <div className="py-8 text-center text-xs text-slate-400">
        No skill gap metrics available.
      </div>
    );
  }

  const chartData = skillsData.slice(0, 8).map(item => ({
    name: item.skill,
    demand: item.demandCount || item.demandPercentage || 0,
    percentage: item.demandPercentage || 0
  }));

  const COLORS = ['#4f46e5', '#6366f1', '#818cf8', '#3b82f6', '#0ea5e9', '#06b6d4', '#14b8a6', '#10b981'];

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 20, left: -20, bottom: 25 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: '#64748b' }}
            angle={-25}
            textAnchor="end"
            interval={0}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#64748b' }}
            allowDecimals={false}
          />
          <Tooltip
            formatter={(value, name, props) => [`${value} jobs (${props.payload.percentage}%)`, 'Market Demand']}
            contentStyle={{
              backgroundColor: '#1e293b',
              borderRadius: '8px',
              border: 'none',
              color: '#fff',
              fontSize: '12px'
            }}
            itemStyle={{ color: '#818cf8' }}
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
