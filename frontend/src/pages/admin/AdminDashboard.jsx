import { useState, useEffect } from 'react';
import { Users, Target, Activity, AlertTriangle, BookOpen, UserCheck, TrendingUp } from 'lucide-react';
import { adminService } from '../../services/adminService';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    adminService.getDashboard()
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to load dashboard data');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full text-rose-500">
        <AlertTriangle className="w-12 h-12 mb-4" />
        <h2 className="text-xl font-bold">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  // Fallback defaults if API fields are missing
  const kpis = data?.kpis || { totalStudents: 0, activeStudents: 0, totalMentors: 0, completedActivities: 0, atRiskStudents: 0, avgProgress: 0 };
  const recentActivities = data?.recentActivities || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display font-black text-3xl text-slate-800">Admin Dashboard</h1>
        <p className="text-slate-500 mt-1">Platform overview and key performance metrics.</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Students</p>
            <h3 className="text-2xl font-bold text-slate-800">{kpis.totalStudents}</h3>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Active Students</p>
            <h3 className="text-2xl font-bold text-slate-800">{kpis.activeStudents}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Mentors</p>
            <h3 className="text-2xl font-bold text-slate-800">{kpis.totalMentors}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">At-Risk Students</p>
            <h3 className="text-2xl font-bold text-slate-800">{kpis.atRiskStudents}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Avg Progress</p>
            <h3 className="text-2xl font-bold text-slate-800">{kpis.avgProgress}%</h3>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Completed Activities</p>
            <h3 className="text-2xl font-bold text-slate-800">{kpis.completedActivities}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-500" />
            <h2 className="font-bold text-slate-800">Recent Activities</h2>
          </div>
          <div className="p-5">
            {recentActivities.length > 0 ? (
              <ul className="space-y-4">
                {recentActivities.map((act, i) => (
                  <li key={i} className="flex items-center justify-between pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{act.title}</p>
                      <p className="text-xs text-slate-500">{act.type} • {act.status}</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-600">+{act.xpReward} XP</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500 text-center py-4">No recent activities available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
