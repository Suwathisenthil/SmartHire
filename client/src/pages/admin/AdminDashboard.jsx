import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useTheme } from '../../context/ThemeContext';
import {
  Users,
  Building2,
  Briefcase,
  Send,
  CheckCircle2,
  TrendingUp,
  Award,
  Sparkles,
  ShieldCheck,
  Cpu,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function AdminDashboard() {
  const { isDark } = useTheme();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/dashboard');
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen text="Loading platform command metrics..." />;

  const counts = stats?.counts || {};
  const topSkills = stats?.topSkills || [];
  const statusDist = stats?.statusDistribution || [];

  const PIE_COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#64748b'];

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Admin Hero Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-purple-500/10 blur-3xl rounded-full" />
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/60 border border-purple-500/50 text-purple-200 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
            <span>Platform Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            SmartHire System Operations
          </h1>
          <p className="text-xs sm:text-sm text-purple-200 max-w-xl leading-relaxed">
            Real-time telemetry, user management, company verification, and aggregated recruitment matching analytics.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 text-center relative z-10">
          <span className="text-[10px] uppercase font-bold text-purple-200 block">Avg. Platform Match</span>
          <span className="text-2xl font-black text-white">{counts.averageMatchScore || 82}%</span>
        </div>
      </div>

      {/* 2. Platform KPI Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Total Users</span>
            <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{counts.totalUsers || 0}</p>
          <p className="text-[11px] text-slate-400">
            {counts.candidatesCount || 0} Candidates • {counts.employersCount || 0} Employers
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Active Jobs</span>
            <Briefcase className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{counts.activeJobs || 0}</p>
          <p className="text-[11px] text-slate-400">{counts.totalJobs || 0} total created</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Organizations</span>
            <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{counts.totalCompanies || 0}</p>
          <p className="text-[11px] text-slate-400">{counts.approvedCompanies || 0} Verified</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Applications</span>
            <Send className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{counts.totalApplications || 0}</p>
          <p className="text-[11px] text-slate-400">{counts.interviewsCount || 0} Interviews scheduled</p>
        </div>
      </div>

      {/* 3. Analytics Charts (Application Pipeline & Top Demanded Skills) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Demanded Skills Chart */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Top Skills In Demand (Database Aggregation)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Aggregated directly from requiredSkills in active job listings
            </p>
          </div>

          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topSkills} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#1e293b' : '#f1f5f9'} />
                <XAxis dataKey="skill" tick={{ fontSize: 10, fill: isDark ? '#94a3b8' : '#64748b' }} angle={-20} textAnchor="end" />
                <YAxis tick={{ fontSize: 10, fill: isDark ? '#94a3b8' : '#64748b' }} allowDecimals={false} />
                <Tooltip
                  formatter={(val) => [`${val} job postings`, 'Required By']}
                  contentStyle={{
                    backgroundColor: isDark ? '#0f172a' : '#ffffff',
                    borderRadius: '12px',
                    border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
                    color: isDark ? '#f8fafc' : '#0f172a',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Application Pipeline Distribution */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 transition-colors">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <Send className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Application Pipeline Distribution</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Candidate status progression across the hiring funnel
            </p>
          </div>

          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDist}
                  dataKey="count"
                  nameKey="_id"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={45}
                  paddingAngle={3}
                >
                  {statusDist.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val, name) => [`${val} candidates`, name]}
                  contentStyle={{
                    backgroundColor: isDark ? '#0f172a' : '#ffffff',
                    borderRadius: '12px',
                    border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
                    color: isDark ? '#f8fafc' : '#0f172a',
                    fontSize: '12px'
                  }}
                />
                <Legend
                  formatter={(value) => (
                    <span style={{ fontSize: '11px', color: isDark ? '#94a3b8' : '#64748b' }}>
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. Quick Moderation & Command Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/admin/users"
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-md transition flex items-center justify-between group"
        >
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">User Moderation</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Manage candidate & employer roles</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition" />
        </Link>

        <Link
          to="/admin/companies"
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-md transition flex items-center justify-between group"
        >
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Company Verifications</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Approve/reject partner profiles</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition" />
        </Link>

        <Link
          to="/admin/jobs"
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-md transition flex items-center justify-between group"
        >
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Job Moderation</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Review open listings and status</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition" />
        </Link>

        <Link
          to="/admin/applications"
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-md transition flex items-center justify-between group"
        >
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">All Applications</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Inspect candidate match scores</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition" />
        </Link>
      </div>
    </div>
  );
}
