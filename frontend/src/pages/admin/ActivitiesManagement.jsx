import { useState, useEffect } from 'react';
import { Target, Search, Plus, Edit2, Play, Pause, AlertTriangle } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { useNavigate } from 'react-router-dom';

export default function ActivitiesManagement() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = () => {
    setLoading(true);
    adminService.getActivities()
      .then(res => {
        setActivities(Array.isArray(res) ? res : (res?.data || []));
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'DRAFT': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'COMPLETED': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const filteredActivities = activities.filter(a => 
    a.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-black text-3xl text-slate-800">Activities</h1>
          <p className="text-slate-500 mt-1">Manage learning modules and challenges.</p>
        </div>
        <button 
          onClick={() => navigate('/admin/activities/new')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm shadow hover:bg-blue-700 transition-all"
        >
          <Plus className="w-4 h-4" />
          Create Activity
        </button>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200">
        <div className="p-4 border-b border-slate-100 flex gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search activities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 flex justify-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="p-12 text-center text-rose-500 flex flex-col items-center">
            <AlertTriangle className="w-8 h-8 mb-2" />
            <p>{error}</p>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            No activities found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-6">Activity</th>
                  <th className="py-3 px-6">Type</th>
                  <th className="py-3 px-6">XP Reward</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {filteredActivities.map((act) => (
                  <tr key={act.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-800">{act.title}</div>
                      <div className="text-xs text-slate-500 mt-0.5">Difficulty: {act.difficulty}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md font-medium text-xs">
                        {act.type}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-emerald-600">
                      +{act.xpReward} XP
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(act.status)}`}>
                        {act.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button 
                        onClick={() => navigate(`/admin/activities/${act.id}`)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit / Details"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
