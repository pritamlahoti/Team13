import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Search, UserMinus, UserPlus } from 'lucide-react';

export default function MentorManagement() {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  const loadMentors = () => {
    adminService.getMentors()
      .then(res => {
        setMentors(Array.isArray(res) ? res : (res?.data || []));
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadMentors();
  }, []);

  const handleUnassign = async (mentorId, studentId) => {
    if (!window.confirm('Are you sure you want to unassign this student?')) return;
    setActionLoading(`${mentorId}-${studentId}`);
    try {
      await adminService.removeMentorAssignment(mentorId, studentId);
      loadMentors(); // Refresh data
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredMentors = mentors.filter(m => 
    m.name?.toLowerCase().includes(search.toLowerCase()) || 
    m.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display font-black text-3xl text-slate-800">Mentors</h1>
        <p className="text-slate-500 mt-1">Manage mentor assignments and availability.</p>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200">
        <div className="p-4 border-b border-slate-100">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search mentors..."
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
          <div className="p-12 text-center text-rose-500 font-medium">
            Error: {error}
          </div>
        ) : filteredMentors.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            No mentors found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-6">Mentor</th>
                  <th className="py-3 px-6">Specialization</th>
                  <th className="py-3 px-6">Assigned Students</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {filteredMentors.map((mentor) => (
                  <tr key={mentor.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                        {mentor.name?.[0] || 'M'}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">{mentor.name}</div>
                        <div className="text-xs text-slate-500">{mentor.email}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium">
                        {mentor.specialization || 'General'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {mentor.students && mentor.students.length > 0 ? (
                        <div className="flex flex-col gap-1">
                          {mentor.students.map(s => (
                            <div key={s.id} className="flex items-center justify-between group text-xs bg-slate-50 px-2 py-1 rounded border border-slate-100">
                              <span>{s.name}</span>
                              <button 
                                onClick={() => handleUnassign(mentor.id, s.id)}
                                disabled={actionLoading === `${mentor.id}-${s.id}`}
                                className="text-rose-500 hover:text-rose-700 opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Unassign"
                              >
                                {actionLoading === `${mentor.id}-${s.id}` ? '...' : <UserMinus className="w-3 h-3" />}
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">No students assigned</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button 
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors"
                        onClick={() => alert(`Open assignment modal for ${mentor.name}`)}
                      >
                        <UserPlus className="w-3.5 h-3.5" /> Assign
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
