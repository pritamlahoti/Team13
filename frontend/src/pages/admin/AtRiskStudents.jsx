import { useState, useEffect } from 'react';
import { AlertTriangle, ChevronRight, Mail, CheckCircle2 } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { useNavigate } from 'react-router-dom';

export default function AtRiskStudents() {
  const [atRisk, setAtRisk] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    adminService.getAtRiskStudents()
      .then(res => {
        setAtRisk(Array.isArray(res) ? res : (res?.data || []));
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display font-black text-3xl text-slate-800 flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-rose-500" />
            At-Risk Students
          </h1>
          <p className="text-slate-500 mt-1">Scholars identified as needing immediate support based on engagement and progress metrics.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="p-12 text-center text-rose-500 font-medium">
            Error: {error}
          </div>
        ) : atRisk.length === 0 ? (
          <div className="p-12 text-center text-emerald-600 font-medium flex flex-col items-center">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            No at-risk students currently identified. Great job!
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {atRisk.map((student) => (
              <div key={student.id} className="p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center hover:bg-slate-50 transition-colors">
                <div className="flex-1 flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-lg shrink-0">
                    {student.name?.[0] || 'S'}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">{student.name}</h3>
                    <p className="text-sm text-slate-500">{student.email}</p>
                    
                    <div className="mt-3 flex flex-wrap gap-2">
                      {student.riskFactors?.map((factor, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-100 rounded text-xs font-semibold">
                          {factor}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button 
                    onClick={() => window.location.href = `mailto:${student.email}`}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold transition-colors"
                  >
                    <Mail className="w-4 h-4" /> Contact
                  </button>
                  <button 
                    onClick={() => navigate(`/admin/students/${student.id}`)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-bold transition-colors"
                  >
                    Details <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
