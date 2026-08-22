import { X, AlertTriangle, Calendar, Activity, CheckCircle2 } from 'lucide-react';
import { notificationService } from '../../services/notificationService';
import { useState } from 'react';

export default function EscalationDetail({ item, onClose, onStatusChange }) {
  const [updating, setUpdating] = useState(false);

  if (!item) return null;

  const isEscalation = item.type === 'escalation';
  const isUnread = item.status === 'unread';

  const handleMarkAcknowledged = async () => {
    setUpdating(true);
    try {
      await notificationService.updateStatus(item.id, 'acknowledged');
      onStatusChange(item.id, 'acknowledged');
      onClose();
    } catch (err) {
      console.error('Failed to update status', err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-theme-plum/20 backdrop-blur-xs z-50 cursor-pointer"
        onClick={onClose}
      />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white p-6 md:p-8 rounded-3xl border border-theme-plum/10 shadow-2xl z-50 space-y-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isEscalation 
                ? 'bg-rose-50 border border-rose-100 text-rose-500' 
                : 'bg-amber-50 border border-amber-100 text-amber-500'
            }`}>
              {isEscalation ? <AlertTriangle className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
            </div>
            <div>
              <span className={`text-[10px] font-black uppercase tracking-widest font-sans ${
                isEscalation ? 'text-rose-600' : 'text-amber-600'
              }`}>
                {isEscalation ? 'Escalation Alert' : 'Notification'}
              </span>
              <h2 className="font-display font-black text-xl text-theme-plum leading-tight mt-0.5">
                {item.triggerSource === 'due_date' ? 'Due Date Condition' : 'Scoring Threshold'}
              </h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 font-sans text-sm text-theme-plum leading-relaxed">
            {item.message}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 tracking-wider uppercase">Scholar</label>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-theme-berry/10 flex items-center justify-center text-[9px] text-theme-berry font-bold">
                  {item.relatedStudentName?.[0] || '?'}
                </div>
                <span className="text-sm font-bold text-theme-plum">{item.relatedStudentName}</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 tracking-wider uppercase">Activity</label>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-bold text-theme-plum truncate" title={item.relatedActivityName}>
                  {item.relatedActivityName}
                </span>
              </div>
            </div>
          </div>
          
          <div className="pt-2 flex justify-between items-center text-xs text-slate-500 font-sans border-t border-slate-100">
            <span>Generated: {new Date(item.createdAt).toLocaleString()}</span>
            <span className={`font-bold capitalize ${isUnread ? 'text-rose-500' : 'text-emerald-500'}`}>
              Status: {item.status}
            </span>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-white hover:bg-slate-50 text-slate-500 border border-slate-200 font-bold rounded-xl text-xs cursor-pointer transition-all"
          >
            Close
          </button>
          {isUnread && (
            <button
              onClick={handleMarkAcknowledged}
              disabled={updating}
              className="flex-1 py-3 bg-theme-plum hover:bg-theme-berry text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{updating ? 'Updating...' : 'Acknowledge'}</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
}
