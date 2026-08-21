import { useState, useEffect } from 'react';
import { AlertTriangle, Calendar, Check, ChevronRight } from 'lucide-react';
import { notificationService } from '../../services/notificationService';
import EscalationDetail from './EscalationDetail';

export default function EscalationFeed({ audience }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchItems();
  }, [audience]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await notificationService.getNotifications(audience);
      setItems(data);
    } catch (err) {
      console.error('Failed to load notifications', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, status: newStatus } : item
    ));
  };

  if (loading) {
    return (
      <div className="p-12 text-center flex flex-col items-center justify-center space-y-3 bg-white/40 rounded-2xl border border-theme-plum/5">
        <div className="w-8 h-8 rounded-full border-2 border-theme-berry border-t-transparent animate-spin"></div>
        <p className="text-xs text-slate-500 font-sans">Loading notifications...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="p-12 text-center bg-white/40 rounded-2xl border border-theme-plum/5">
        <Check className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
        <p className="text-xs font-bold text-theme-plum font-sans">All caught up!</p>
        <p className="text-[11px] text-slate-400 font-sans mt-0.5">No new notifications or escalations.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => {
          const isEscalation = item.type === 'escalation';
          const isUnread = item.status === 'unread';

          return (
            <div 
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className={`glass-panel p-5 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col justify-between gap-4 border ${
                isUnread 
                  ? isEscalation ? 'border-rose-200 shadow-sm bg-rose-50/30' : 'border-theme-berry/30 shadow-sm'
                  : 'border-slate-200/50 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isEscalation ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                    }`}>
                      {isEscalation ? <AlertTriangle className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                    </div>
                    <div>
                      <span className={`text-[9px] font-black uppercase font-sans tracking-wide ${
                        isEscalation ? 'text-rose-500' : 'text-slate-500'
                      }`}>
                        {item.type}
                      </span>
                      <h3 className="font-display font-bold text-sm text-theme-plum leading-tight">
                        {item.relatedStudentName}
                      </h3>
                    </div>
                  </div>
                  {isUnread && (
                    <div className="w-2.5 h-2.5 rounded-full bg-theme-berry animate-pulse shrink-0 mt-1" />
                  )}
                </div>

                <div className="text-xs text-slate-600 line-clamp-2 font-sans">
                  {item.message}
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-100 pt-3 mt-auto">
                <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                <span className="flex items-center gap-1 font-bold text-theme-plum group-hover:text-theme-berry transition-colors">
                  View Details <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {selectedItem && (
        <EscalationDetail 
          item={selectedItem} 
          onClose={() => setSelectedItem(null)} 
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}
