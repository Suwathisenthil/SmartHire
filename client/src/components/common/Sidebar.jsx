import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
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
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Award,
  ShieldCheck,
  BookOpenCheck
} from 'lucide-react';

export default function Sidebar() {
  const { user, isCandidate, isEmployer, isAdmin } = useAuth();
  const { unreadCount } = useNotifications();
  const [collapsed, setCollapsed] = useState(false);

  const candidateLinks = [
    { label: 'Overview', to: '/candidate/dashboard', icon: LayoutDashboard },
    { label: 'My Profile & Skills', to: '/candidate/profile', icon: User },
    { label: 'Resume', to: '/candidate/resume', icon: FileText },
    { label: 'Job Recommendations', to: '/candidate/recommendations', icon: Sparkles },
    { label: 'Applications', to: '/candidate/applications', icon: Send },
    { label: 'Skill Gap', to: '/candidate/skill-gap', icon: Layers },
    { label: 'Learning Roadmap', to: '/candidate/learning', icon: BookOpenCheck },
    { label: 'Assessments', to: '/candidate/assessments', icon: ShieldCheck },
    { label: 'Interviews', to: '/candidate/interviews', icon: Calendar },
    { label: 'Notifications', to: '/notifications', icon: Bell, badge: unreadCount > 0 ? unreadCount : null }
  ];

  const employerLinks = [
    { label: 'Recruitment Hub', to: '/employer/dashboard', icon: LayoutDashboard },
    { label: 'Company Profile', to: '/employer/company', icon: Building2 },
    { label: 'Post Job', to: '/employer/jobs/create', icon: Briefcase },
    { label: 'Manage Jobs', to: '/employer/jobs', icon: FileText },
    { label: 'Interviews', to: '/employer/interviews', icon: Calendar },
    { label: 'Analytics', to: '/employer/analytics', icon: BarChart3 },
    { label: 'Notifications', to: '/notifications', icon: Bell, badge: unreadCount > 0 ? unreadCount : null }
  ];

  const adminLinks = [
    { label: 'Command Center', to: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Users', to: '/admin/users', icon: Users },
    { label: 'Companies', to: '/admin/companies', icon: Building2 },
    { label: 'Jobs', to: '/admin/jobs', icon: Briefcase },
    { label: 'Applications', to: '/admin/applications', icon: Send },
    { label: 'Analytics', to: '/admin/reports', icon: TrendingUp },
    { label: 'Notifications', to: '/notifications', icon: Bell, badge: unreadCount > 0 ? unreadCount : null }
  ];

  const links = isAdmin ? adminLinks : isEmployer ? employerLinks : candidateLinks;

  return (
    <aside
      className={`${
        collapsed ? 'w-20' : 'w-64'
      } flex-shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between transition-all duration-300 relative select-none`}
    >
      {/* Collapse Toggle Floating Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 z-10 transition hover:scale-110"
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      <div className="space-y-6">
        {/* User Card */}
        <div
          className={`p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center ${
            collapsed ? 'justify-center' : 'gap-3'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white font-bold flex items-center justify-center text-sm shadow-xs flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          {!collapsed && (
            <div className="overflow-hidden min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{user?.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {user?.role}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Links Navigation */}
        <div className="space-y-1">
          {!collapsed && (
            <p className="px-3 text-[10px] font-extrabold text-slate-400 dark:text-slate-400 uppercase tracking-widest mb-2.5">
              Platform Menu
            </p>
          )}
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                title={collapsed ? link.label : undefined}
                className={({ isActive }) =>
                  `group flex items-center ${
                    collapsed ? 'justify-center px-2 py-3' : 'justify-between px-3.5 py-2.5'
                  } rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 dark:shadow-indigo-950 font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/70'
                  }`
                }
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {!collapsed && <span className="truncate">{link.label}</span>}
                </div>
                {!collapsed && link.badge && (
                  <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-rose-500 text-white">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Bottom Settings Link */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
        <NavLink
          to="/settings"
          title={collapsed ? 'Account Settings' : undefined}
          className={({ isActive }) =>
            `flex items-center ${
              collapsed ? 'justify-center p-2.5' : 'gap-3 px-3.5 py-2.5'
            } rounded-xl text-xs font-medium transition ${
              isActive
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60'
            }`
          }
        >
          <Settings className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Account Settings</span>}
        </NavLink>
      </div>
    </aside>
  );
}
