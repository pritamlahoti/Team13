import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { ArrowLeft, Edit2, Play, Pause, Save, CheckCircle2 } from 'lucide-react';

export default function ActivityDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [activity, setActivity] = useState({
    title: '',
    description: '',
    type: 'Course',
    difficulty: 'Beginner',
    xpReward: 100,
    status: 'Draft'
  });

  useEffect(() => {
    if (!isNew) {
      adminService.getActivityDetails(id)
        .then(res => {
          setActivity(res.data || res);
          setLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [id, isNew]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setActivity(prev => ({ ...prev, [name]: name === 'xpReward' ? Number(value) : value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      if (isNew) {
        await adminService.createActivity(activity);
        setSuccess('Activity created successfully!');
        setTimeout(() => navigate('/admin/activities'), 1500);
      } else {
        await adminService.updateActivity(id, activity);
        setSuccess('Activity updated successfully!');
        setLoading(false);
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await adminService.updateActivityStatus(id, newStatus);
      setActivity(prev => ({ ...prev, status: newStatus }));
      setSuccess(`Status updated to ${newStatus}`);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading && !isNew && !activity.title) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6 animate-fade-in">
      <button 
        onClick={() => navigate('/admin/activities')}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Activities
      </button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-black text-3xl text-slate-800">
            {isNew ? 'Create Activity' : 'Edit Activity'}
          </h1>
          {!isNew && <p className="text-sm text-slate-500 mt-1">ID: {id}</p>}
        </div>
        {!isNew && (
          <div className="flex gap-2">
            {activity.status === 'Draft' ? (
              <button 
                type="button"
                onClick={() => handleStatusChange('Active')}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg font-bold text-sm transition-colors"
              >
                <Play className="w-4 h-4" /> Publish
              </button>
            ) : (
              <button 
                type="button"
                onClick={() => handleStatusChange('Draft')}
                className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-lg font-bold text-sm transition-colors"
              >
                <Pause className="w-4 h-4" /> Pause
              </button>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 bg-rose-50 text-rose-600 rounded-lg border border-rose-100 text-sm font-medium">
          {error}
        </div>
      )}
      
      {success && (
        <div className="p-4 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100 text-sm font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> {success}
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
        
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Title</label>
          <input 
            type="text" 
            name="title"
            required
            value={activity.title}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="e.g. React Basics Bootcamp"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Description</label>
          <textarea 
            name="description"
            rows="4"
            value={activity.description || ''}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Detailed description of the activity..."
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Type</label>
            <select 
              name="type"
              value={activity.type}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="Course">Course</option>
              <option value="Challenge">Challenge</option>
              <option value="Quiz">Quiz</option>
              <option value="Event">Event</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Difficulty</label>
            <select 
              name="difficulty"
              value={activity.difficulty}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="Beginner">Beginner</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">XP Reward</label>
            <input 
              type="number" 
              name="xpReward"
              min="0"
              required
              value={activity.xpReward}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {isNew && (
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Initial Status</label>
              <select 
                name="status"
                value={activity.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="Draft">Draft</option>
                <option value="Active">Active</option>
              </select>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button 
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow hover:bg-blue-700 transition-all disabled:opacity-50"
          >
            {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save className="w-4 h-4" />}
            {isNew ? 'Create Activity' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
