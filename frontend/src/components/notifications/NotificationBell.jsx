import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { notificationService } from '../../services/notificationService';

export default function NotificationBell({ audience }) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let active = true;

    const fetchCounts = async () => {
      try {
        const notifications = await notificationService.getNotifications(audience);
        if (active) {
          const unread = notifications.filter(n => n.status === 'unread').length;
          setUnreadCount(unread);
        }
      } catch (err) {
        console.error('Failed to fetch notification counts', err);
      }
    };

    fetchCounts();
    
    // Poll for updates (mock real-time)
    const interval = setInterval(fetchCounts, 5000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [audience]);

  return (
    <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer group">
      <Bell className="w-5 h-5 text-slate-600 group-hover:text-slate-800 transition-colors" />
      {unreadCount > 0 && (
        <div className="absolute top-0 right-0 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-rose-500 rounded-full text-[10px] font-bold text-white shadow-sm border border-white transform translate-x-1/4 -translate-y-1/4">
          {unreadCount > 99 ? '99+' : unreadCount}
        </div>
      )}
    </div>
  );
}
