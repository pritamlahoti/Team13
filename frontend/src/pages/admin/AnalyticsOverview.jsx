import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Activity, Target } from 'lucide-react';
import { adminService } from '../../services/adminService';

export default function AnalyticsOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    adminService.getAnalyticsOverview()
      .then(res => {
        setData(res.data || res);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full w-full py-20">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-12 text-center text-rose-500 font-medium">
        Error loading analytics: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display font-black text-3xl text-slate-800">Analytics Overview</h1>
        <p className="text-slate-500 mt-1">Platform usage, engagement trends, and completion metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-slate-500">Total Active Users</p>
          </div>
          <h3 className="text-3xl font-black text-slate-800">{data?.totalActiveUsers || 0}</h3>
          <p className="text-xs text-emerald-600 font-bold mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +12% this month
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-slate-500">Avg Session Duration</p>
          </div>
          <h3 className="text-3xl font-black text-slate-800">{data?.avgSessionDuration || '0m'}</h3>
          <p className="text-xs text-emerald-600 font-bold mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +5% this week
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-slate-500">Course Completion Rate</p>
          </div>
          <h3 className="text-3xl font-black text-slate-800">{data?.completionRate || 0}%</h3>
          <p className="text-xs text-emerald-600 font-bold mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +2% this month
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-slate-500">Total XP Earned</p>
          </div>
          <h3 className="text-3xl font-black text-slate-800">{data?.totalXpEarned || 0}</h3>
          <p className="text-xs text-slate-500 font-medium mt-2">Across all scholars</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center text-slate-500">
        <BarChart3 className="w-16 h-16 mx-auto mb-4 text-slate-300" />
        <h3 className="text-xl font-bold text-slate-700 mb-2">Detailed Charts Coming Soon</h3>
        <p className="max-w-md mx-auto">
          The analytics data is currently being aggregated. In a future update, you will see detailed time-series charts for engagement, activity completion, and mentor interaction.
        </p>
      </div>
    </div>
  );
}
