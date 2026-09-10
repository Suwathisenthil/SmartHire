import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  FileText,
  User,
  Sparkles,
  Send,
  Calendar,
  Layers,
  BarChart3,
  Briefcase,
  Users,
  Building2,
  Settings,
  Bell,
  CheckCircle,
  TrendingUp
} from 'lucide-react';

export default function Sidebar() {
  const { user, isCandidate, isEmployer, isAdmin } = useAuth();

  const candidateLinks = [
    { label: 'Overview', to: '/candidate/dashboard', icon: LayoutDashboard },
    { label: 'My Profile & Skills', to: '/candidate/profile', icon: User },
    { label: 'Upload Resume', to: '/candidate/resume', icon: FileText },
    { label: 'Job Recommendations', to: '/candidate/recommendations', icon: Sparkles },
    { label: 'My Applications', to: '/candidate/applications', icon: Send },
    { label: 'Skill Gap Analysis', to: '/candidate/skill-gap', icon: Layers },
    { label: 'Interviews', to: '/candidate/interviews', icon: Calendar },
    { label: 'Notifications', to: '/notifications', icon: Bell }
  ];

  const employerLinks = [
    { label: 'Recruitment Hub', to: '/employer/dashboard', icon: LayoutDashboard },
    { label: 'Company Profile', to: '/employer/company', icon: Building2 },
    { label: 'Post a New Job', to: '/employer/jobs/create', icon: Briefcase },
    { label: 'Manage Jobs', to: '/employer/jobs', icon: FileText },
    { label: 'Scheduled Interviews', to: '/employer/interviews', icon: Calendar },
    { label: 'Candidate Analytics', to: '/employer/analytics', icon: BarChart3 },
    { label: 'Notifications', to: '/notifications', icon: Bell }
  ];

  const adminLinks = [
    { label: 'Admin Command', to: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'User Management', to: '/admin/users', icon: Users },
    { label: 'Company Moderation', to: '/admin/companies', icon: Building2 },
    { label: 'Job Moderation', to: '/admin/jobs', icon: Briefcase },
    { label: 'All Applications', to: '/admin/applications', icon: Send },
    { label: 'Platform Reports', to: '/admin/reports', icon: TrendingUp },
    { label: 'System Settings', to: '/settings', icon: Settings }
  ];

  const links = isAdmin ? adminLinks : isEmployer ? employerLinks : candidateLinks;

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between">
      <div className="space-y-6">
        {/* User Card */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-xs flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-slate-900 truncate">{user?.name}</p>
            <span className="inline-block mt-0.5 px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-indigo-100 text-indigo-700">
              {user?.role}
            </span>
          </div>
        </div>

        {/* Links Navigation */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Navigation
          </p>
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Bottom Settings Link */}
      <div className="pt-4 border-t border-slate-100">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
              isActive
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`
          }
        >
          <Settings className="w-4 h-4" />
          <span>Account Settings</span>
        </NavLink>
      </div>
    </aside>
  );
}
