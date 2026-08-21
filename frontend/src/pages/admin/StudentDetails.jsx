import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, UserCheck, Activity, Award, CheckCircle2 } from 'lucide-react';
import { adminService } from '../../services/adminService';

export default function StudentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [student, setStudent] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      adminService.getStudentDetails(id),
      adminService.getStudentProgress(id)
    ])
      .then(([studentRes, progressRes]) => {
        setStudent(studentRes.data || studentRes);
        setProgress(progressRes.data || progressRes);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="p-12 text-center text-rose-500 font-medium">
        Error loading student details: {error || 'Not found'}
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6 animate-fade-in">
      <button 
        onClick={() => navigate('/admin/students')}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Students
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col md:flex-row gap-8 items-start">
        <div className="w-24 h-24 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black text-4xl shrink-0">
          {student.name?.[0] || 'S'}
        </div>
        <div className="flex-1">
          <h1 className="font-display font-black text-3xl text-slate-800">{student.name}</h1>
          <p className="text-slate-500">{student.email}</p>
          
          <div className="flex flex-wrap gap-4 mt-6">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-sm">
              <span className="text-slate-500 font-medium">Cohort:</span>
              <span className="font-bold text-slate-800">{student.cohortYear || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-sm">
              <UserCheck className="w-4 h-4 text-slate-400" />
              <span className="text-slate-500 font-medium">Mentor:</span>
              <span className="font-bold text-slate-800">{student.mentor?.name || student.mentor || 'Unassigned'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100">
            <Activity className="w-5 h-5 text-blue-500" />
            <h2 className="font-bold text-slate-800">Learning Progress</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-slate-600">Overall Course Completion</span>
                <span className="font-bold text-slate-800">{progress?.overallProgress || student.progress || 0}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${progress?.overallProgress || student.progress || 0}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-xs text-slate-500 font-semibold uppercase">Total XP</p>
                <p className="text-2xl font-black text-emerald-600 mt-1">{progress?.xp || student.xp || 0}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-xs text-slate-500 font-semibold uppercase">Current Level</p>
                <p className="text-2xl font-black text-purple-600 mt-1">{progress?.level || 1}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <h2 className="font-bold text-slate-800">Completed Activities</h2>
          </div>
          
          {progress?.completedActivities?.length > 0 ? (
            <ul className="space-y-3">
              {progress.completedActivities.map((act, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm">
                  <Award className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="text-slate-700 font-medium">{act.title || act}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500 italic text-center py-4">No completed activities yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
