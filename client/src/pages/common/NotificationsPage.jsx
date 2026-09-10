import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import { Bell, Check, ExternalLink, Calendar, Send, FileText } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, loading } = useNotifications();
  const navigate = useNavigate();

  if (loading) return <LoadingSpinner fullScreen text="Loading notification feed..." />;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Notification Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time updates regarding application status changes, shortlists, and scheduled interviews.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Mark All Read</span>
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="All caught up!"
          description="You don't have any notifications at the moment."
        />
      ) : (
        <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden divide-y divide-slate-100 shadow-xs">
          {notifications.map((notif) => (
            <div
              key={notif._id}
              onClick={() => {
                if (!notif.isRead) markAsRead(notif._id);
                if (notif.link) navigate(notif.link);
              }}
              className={`p-5 cursor-pointer hover:bg-slate-50 transition flex items-start gap-4 ${
                !notif.isRead ? 'bg-indigo-50/20' : ''
              }`}
            >
              <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${!notif.isRead ? 'bg-indigo-600 ring-4 ring-indigo-100' : 'bg-slate-200'}`} />

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm">{notif.title}</h4>
                  <span className="text-[10px] text-slate-400">
                    {new Date(notif.createdAt).toLocaleDateString()} {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{notif.message}</p>
                {notif.link && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:underline pt-1">
                    <span>View associated record</span>
                    <ExternalLink className="w-3 h-3" />
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
