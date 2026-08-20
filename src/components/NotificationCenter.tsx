import React, { useState } from 'react';
import { 
  Bell, X, CheckCircle2, UserCheck, ShieldAlert, DollarSign, MessageSquare, 
  ArrowRight, Sparkles, Clock, CheckCheck, Trash2, Eye 
} from 'lucide-react';
import { AppNotification, TabType, UserRole } from '../types';

interface NotificationCenterProps {
  notifications: AppNotification[];
  role: UserRole;
  onSelectNotification: (notification: AppNotification) => void;
  onMarkAllAsRead: () => void;
  onClearNotifications: () => void;
  onDeleteNotification: (id: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  role,
  onSelectNotification,
  onMarkAllAsRead,
  onClearNotifications,
  onDeleteNotification
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filterTab, setFilterTab] = useState<'all' | 'unread'>('all');

  // Filter notifications relevant to current role or 'both'
  const relevantNotifications = notifications.filter(
    n => n.roleTarget === 'both' || n.roleTarget === role
  );

  const unreadCount = relevantNotifications.filter(n => !n.read).length;

  const displayList = relevantNotifications.filter(n => 
    filterTab === 'all' ? true : !n.read
  );

  const getIconForType = (type: AppNotification['type']) => {
    switch (type) {
      case 'APPLICANT':
        return <UserCheck className="w-4 h-4 text-blue-600" />;
      case 'VERIFICATION':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'PAYMENT':
        return <DollarSign className="w-4 h-4 text-amber-600" />;
      case 'CHAT':
        return <MessageSquare className="w-4 h-4 text-purple-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <>
      {/* Floating Notification Trigger Bubble */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          id="notification-floating-bubble"
          onClick={() => setIsOpen(!isOpen)}
          className={`relative p-3.5 sm:p-4 rounded-full shadow-2xl transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer border ${
            isOpen
              ? 'bg-slate-900 text-white border-slate-800 ring-4 ring-slate-900/20'
              : unreadCount > 0
              ? 'bg-[#1E3A8A] text-white border-blue-400/40 shadow-blue-900/40 hover:bg-blue-900'
              : 'bg-white text-slate-700 border-slate-200 shadow-slate-900/10 hover:bg-slate-50'
          }`}
          title={`${unreadCount} unread notifications (${role === 'employer' ? 'Employer' : 'Worker'} feed)`}
        >
          <Bell className="w-5 h-5 sm:w-6 sm:h-6" />

          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 bg-red-500 text-white text-[11px] font-mono font-black rounded-full flex items-center justify-center border-2 border-white animate-bounce shadow-md">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Floating Notification Popover Drawer */}
      {isOpen && (
        <div className="fixed bottom-22 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 max-h-[580px] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center border border-blue-500/30">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm leading-tight text-white flex items-center gap-1.5">
                    <span>Notifications</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-sm uppercase tracking-wider font-mono font-bold bg-white/15 text-blue-200">
                      {role === 'employer' ? 'Employer' : 'Worker'}
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-300">
                    {unreadCount > 0 ? `${unreadCount} unread alerts` : 'All caught up'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filter Tabs & Quick Actions */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10 text-xs">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setFilterTab('all')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                    filterTab === 'all'
                      ? 'bg-white text-slate-950 shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  All ({relevantNotifications.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterTab('unread')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                    filterTab === 'unread'
                      ? 'bg-white text-slate-950 shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  Unread ({unreadCount})
                </button>
              </div>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={onMarkAllAsRead}
                  className="text-[11px] text-emerald-300 hover:text-emerald-200 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark all read</span>
                </button>
              )}
            </div>
          </div>

          {/* List of Notifications */}
          <div className="p-2 sm:p-3 overflow-y-auto flex-1 divide-y divide-slate-100 max-h-[380px]">
            {displayList.length === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                  <Bell className="w-6 h-6 opacity-40" />
                </div>
                <p className="text-xs font-semibold text-slate-600">No notifications found</p>
                <p className="text-[11px] text-slate-400 max-w-[200px] mx-auto">
                  {filterTab === 'unread' ? 'You have read all pending notifications.' : 'Activity updates will appear here.'}
                </p>
              </div>
            ) : (
              displayList.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectNotification(item);
                    setIsOpen(false);
                  }}
                  className={`p-3 rounded-2xl transition-all flex items-start gap-3 cursor-pointer group hover:bg-slate-50 ${
                    !item.read ? 'bg-blue-50/40 border border-blue-100/60' : 'bg-transparent'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center mt-0.5 ${
                    !item.read ? 'bg-white shadow-xs border border-blue-200' : 'bg-slate-100'
                  }`}>
                    {getIconForType(item.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h5 className={`text-xs truncate ${!item.read ? 'font-extrabold text-slate-900' : 'font-semibold text-slate-700'}`}>
                        {item.title}
                      </h5>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0">
                        {item.timestamp}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5 leading-relaxed">
                      {item.message}
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100/80">
                      <span className="text-[10px] font-bold text-blue-900 group-hover:underline flex items-center gap-1">
                        <span>View Details</span>
                        <ArrowRight className="w-2.5 h-2.5" />
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteNotification(item.id);
                        }}
                        className="text-slate-300 hover:text-red-500 transition-colors p-1 cursor-pointer"
                        title="Delete notification"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Bar */}
          <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
            <span className="font-mono text-[10px]">
              {role === 'employer' ? 'Employer Hub' : 'Worker Feed'}
            </span>
            {displayList.length > 0 && (
              <button
                type="button"
                onClick={onClearNotifications}
                className="text-slate-400 hover:text-slate-700 font-semibold cursor-pointer transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};
