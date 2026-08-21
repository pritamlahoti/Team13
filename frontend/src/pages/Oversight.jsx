import { useState, useEffect } from 'react';
import { Activity, CheckCircle2, TrendingUp, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export default function Oversight() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.role !== 'HIGHER_MANAGEMENT') return;
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/dashboard/higher-management`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to load oversight metrics');
        return res.json();
      })
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [user]);

  if (user?.role !== 'HIGHER_MANAGEMENT') {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-12">
        <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 shadow-sm border border-rose-100">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="font-display font-bold text-2xl text-theme-plum">Access Restricted</h2>
        <p className="text-sm text-slate-500 max-w-md font-sans">
          Only program directors can view cohort oversight metrics here.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full py-24">
        <div className="w-8 h-8 border-4 border-theme-berry border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full text-rose-500 py-24">
        <AlertTriangle className="w-12 h-12 mb-4" />
        <h2 className="text-xl font-bold">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  const metrics = [
    { key: 'participation', label: 'Participation Rate', desc: 'Students with at least one submission', icon: Activity, color: 'blue' },
    { key: 'completion', label: 'Completion Rate', desc: 'Enrollments marked completed', icon: CheckCircle2, color: 'emerald' },
    { key: 'monthlyEngagement', label: 'Monthly Engagement', desc: 'Students active this calendar month', icon: TrendingUp, color: 'purple' },
  ];

  const empty = metrics.every(m => !data?.[m.key]?.denominator);

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="font-display font-black text-3xl text-theme-plum">Program Oversight</h1>
        <p className="text-xs text-slate-500 mt-1">Cohort-wide engagement metrics (FR028 / FR030).</p>
      </div>

      {empty ? (
        <div className="p-12 text-center bg-white/40 rounded-2xl border border-theme-plum/5">
          <p className="text-xs font-bold text-theme-plum font-sans">No cohort data yet</p>
          <p className="text-[11px] text-slate-400 font-sans mt-0.5">Metrics will populate once students enroll and submit work.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {metrics.map(({ key, label, desc, icon: Icon, color }) => {
            const m = data?.[key] || { rate: 0, numerator: 0, denominator: 0 };
            return (
              <div key={key} className="bg-white rounded-2xl p-6 shadow-sm border border-theme-plum/5 space-y-3">
                <div className={`w-12 h-12 rounded-xl bg-${color}-50 text-${color}-600 flex items-center justify-center`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">{label}</p>
                  <h3 className="text-3xl font-display font-black text-theme-plum">{Math.round(m.rate * 100)}%</h3>
                  <p className="text-[11px] text-slate-400 mt-1">{m.numerator} / {m.denominator} — {desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
