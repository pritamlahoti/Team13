import { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  UserMinus, 
  Search, 
  Sparkles, 
  ShieldAlert,
  ChevronDown,
  User,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { authService } from '../services/authService';
import { useAuth } from '../hooks/useAuth';
import { learningService } from '../services/learningService';

export default function Admin() {
  const { user } = useAuth();
  const [auditLogs, setAuditLogs] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch users and audit logs on mount
  useEffect(() => {
    let active = true;
    async function init() {
      try {
        const users = await authService.getUsers();
        const subs = await learningService.getSubmissions();
        if (active) {
          setUsersList(users);
          setAuditLogs(subs.filter(s => s.status === 'reviewed'));
          setLoading(false);
        }
      } catch (err) {
        console.error('Admin init failed', err);
        if (active) {
          setLoading(false);
        }
      }
    }
    init();
    return () => {
      active = false;
    };
  }, []);

  const handleAssignMentor = async (studentId, mentorId) => {
    try {
      await authService.assignMentor(studentId, mentorId);
      
      // Update local state to reflect change immediately
      const updatedData = await authService.getUsers();
      setUsersList(updatedData);
      
      // Show success toast
      const student = usersList.find(u => u.id === studentId);
      const mentor = usersList.find(u => u.id === mentorId);
      
      showToast({
        type: 'success',
        message: mentor 
          ? `Assigned ${mentor.name} as mentor for ${student?.name || 'student'}.`
          : `Removed mentor assignment for ${student?.name || 'student'}.`
      });
    } catch {
      showToast({
        type: 'error',
        message: 'Failed to assign mentor. Please try again.'
      });
    }
  };

  const showToast = (toastObj) => {
    setToast(toastObj);
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Derived lists
  const mentors = usersList.filter(u => u.role === 'KATALYST_MANAGEMENT' || u.role === 'HIGHER_MANAGEMENT');
  const students = usersList.filter(u => u.role === 'STUDENT');
  const unassignedStudents = students.filter(s => !s.mentor);

  // Search & Filtered List
  const filteredUsers = usersList.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = 
      roleFilter === 'ALL' || 
      u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  if (user?.role !== 'HIGHER_MANAGEMENT') {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-12">
        <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 shadow-sm border border-rose-100">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="font-display font-bold text-2xl text-theme-plum">Access Restricted</h2>
        <p className="text-sm text-slate-500 max-w-md font-sans">
          Only Higher Management (Directors) possess administrative rights to access this console. Mentor tools are available on the Mentor Dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 relative">
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg transition-all duration-300 transform translate-y-0 ${
          toast.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          )}
          <span className="text-xs font-bold font-sans">{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 text-slate-400 hover:text-slate-600 cursor-pointer">
            &times;
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-theme-berry animate-pulse" />
            <span className="text-xs font-bold font-display uppercase tracking-widest text-theme-berry">
              Director Console
            </span>
          </div>
          <h1 className="font-display font-black text-3xl text-theme-plum mt-1">
            Admin Console
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Oversee explorer accounts, audit standings, and pair students with program mentors.
          </p>
        </div>
      </div>

      {/* Stats Board */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="glass-panel p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-theme-plum/5 border border-theme-plum/10 flex items-center justify-center text-theme-plum">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider font-sans">
              Total Users
            </p>
            <h3 className="font-display font-black text-2xl text-theme-plum mt-0.5">
              {usersList.length}
            </h3>
          </div>
        </div>

        {/* Students */}
        <div className="glass-panel p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-theme-berry/5 border border-theme-berry/10 flex items-center justify-center text-theme-berry">
            <User className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider font-sans">
              Scholars
            </p>
            <h3 className="font-display font-black text-2xl text-theme-plum mt-0.5">
              {students.length}
            </h3>
          </div>
        </div>

        {/* Mentors */}
        <div className="glass-panel p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-theme-peach/10 border border-theme-peach/20 flex items-center justify-center text-theme-berry">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider font-sans">
              Active Mentors
            </p>
            <h3 className="font-display font-black text-2xl text-theme-plum mt-0.5">
              {mentors.length}
            </h3>
          </div>
        </div>

        {/* Unassigned */}
        <div className="glass-panel p-5 rounded-2xl flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${
            unassignedStudents.length > 0 
              ? 'bg-rose-50 border-rose-100 text-rose-600 animate-pulse'
              : 'bg-emerald-50 border-emerald-100 text-emerald-600'
          }`}>
            {unassignedStudents.length > 0 ? (
              <UserMinus className="w-5 h-5" />
            ) : (
              <UserCheck className="w-5 h-5" />
            )}
          </div>
          <div>
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider font-sans">
              Unassigned
            </p>
            <h3 className="font-display font-black text-2xl text-theme-plum mt-0.5">
              {unassignedStudents.length}
            </h3>
          </div>
        </div>
      </div>

      {/* Directory Section */}
      <div className="glass-panel rounded-2xl overflow-hidden shadow-sm border border-white/20">
        
        {/* Table Filters Header */}
        <div className="p-5 border-b border-theme-plum/5 bg-white/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="font-display font-bold text-lg text-theme-plum flex items-center gap-2">
            User Directory
            <span className="px-2 py-0.5 rounded-full bg-theme-plum/5 border border-theme-plum/10 text-[10px] font-sans font-bold text-theme-plum">
              {filteredUsers.length} shown
            </span>
          </h2>
          
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full pl-9 pr-4 py-2 bg-white/60 border border-theme-plum/10 rounded-xl text-xs text-theme-plum placeholder-slate-400 focus:outline-none focus:border-theme-berry transition-all font-sans"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 bg-theme-plum/5 p-1 rounded-xl w-full sm:w-auto">
              <button
                onClick={() => setRoleFilter('ALL')}
                className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-[10px] font-bold font-sans transition-all cursor-pointer ${
                  roleFilter === 'ALL' 
                    ? 'bg-theme-plum text-white shadow-sm' 
                    : 'text-theme-plum/70 hover:bg-white/40'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setRoleFilter('STUDENT')}
                className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-[10px] font-bold font-sans transition-all cursor-pointer ${
                  roleFilter === 'STUDENT' 
                    ? 'bg-theme-plum text-white shadow-sm' 
                    : 'text-theme-plum/70 hover:bg-white/40'
                }`}
              >
                Scholars
              </button>
              <button
                onClick={() => setRoleFilter('KATALYST_MANAGEMENT')}
                className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-[10px] font-bold font-sans transition-all cursor-pointer ${
                  roleFilter === 'KATALYST_MANAGEMENT' 
                    ? 'bg-theme-plum text-white shadow-sm' 
                    : 'text-theme-plum/70 hover:bg-white/40'
                }`}
              >
                Mentors
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 flex flex-col items-center justify-center space-y-3">
              <div className="w-8 h-8 rounded-full border-2 border-theme-berry border-t-transparent animate-spin"></div>
              <p className="text-xs text-slate-500 font-sans">Compiling directory database...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center">
              <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-bold text-theme-plum font-sans">No matching users found</p>
              <p className="text-[11px] text-slate-400 font-sans mt-0.5">Try adjusting your search criteria or role filters.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-theme-plum/5 border-b border-theme-plum/5 text-[10px] font-bold text-theme-plum/80 uppercase tracking-wider font-sans">
                  <th className="py-3.5 px-6">Explorer / Admin</th>
                  <th className="py-3.5 px-6">Email Address</th>
                  <th className="py-3.5 px-6">Role</th>
                  <th className="py-3.5 px-6">Class/Cohort</th>
                  <th className="py-3.5 px-6">Assigned Program Mentor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-theme-plum/5 text-xs text-theme-plum font-sans">
                {filteredUsers.map((userRow) => {
                  const isStudent = userRow.role === 'STUDENT';
                  return (
                    <tr key={userRow.id} className="hover:bg-white/30 transition-colors">
                      {/* Name */}
                      <td className="py-4 px-6 font-bold flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-theme-berry/10 to-theme-peach/10 flex items-center justify-center text-[10px] text-theme-berry font-bold border border-theme-berry/10">
                          {userRow.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                        </div>
                        <span>{userRow.name}</span>
                      </td>

                      {/* Email */}
                      <td className="py-4 px-6 text-slate-500">{userRow.email}</td>

                      {/* Role Badge */}
                      <td className="py-4 px-6">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                          isStudent 
                            ? 'bg-cyan-50 border-cyan-100 text-cyan-700' 
                            : userRow.role === 'HIGHER_MANAGEMENT'
                            ? 'bg-amber-50 border-amber-100 text-amber-700'
                            : 'bg-purple-50 border-purple-100 text-purple-700'
                        }`}>
                          {isStudent ? 'Scholar' : userRow.role === 'HIGHER_MANAGEMENT' ? 'Director' : 'Coach'}
                        </span>
                      </td>

                      {/* Cohort Year */}
                      <td className="py-4 px-6 font-bold">
                        {isStudent && userRow.cohortYear 
                          ? `Year ${new Date().getFullYear() - userRow.cohortYear + 1} (${userRow.cohortYear})` 
                          : 'N/A'}
                      </td>

                      {/* Mentor Selection / Details */}
                      <td className="py-4 px-6">
                        {isStudent ? (
                          <div className="relative inline-block w-full max-w-[200px]">
                            <select
                              value={userRow.mentor?.id || ''}
                              onChange={(e) => handleAssignMentor(userRow.id, e.target.value)}
                              className="w-full bg-white/60 hover:bg-white/90 border border-theme-plum/10 hover:border-theme-berry rounded-lg px-2.5 py-1.5 text-xs text-theme-plum font-semibold focus:outline-none transition-all cursor-pointer appearance-none pr-8"
                            >
                              <option value="">-- No Mentor Assigned --</option>
                              {mentors.map(m => (
                                <option key={m.id} value={m.id}>
                                  {m.name}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="w-3.5 h-3.5 text-theme-plum/50 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Self (Staff)</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Oversight & Grading Audit Log */}
      <div className="glass-panel p-6 rounded-2xl border border-white/20 space-y-4">
        <div>
          <h2 className="font-display font-bold text-lg text-theme-plum">Oversight & Grading Audit Log</h2>
          <p className="text-[11px] text-slate-500 mt-0.5">Read-only transaction log of quest grading and feedback issued by program coaches.</p>
        </div>

        <div className="overflow-hidden border border-theme-plum/5 rounded-xl bg-white/30">
          {auditLogs.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 italic font-sans">
              No graded submissions logged yet.
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs font-sans text-theme-plum">
              <thead>
                <tr className="bg-theme-plum/5 font-bold border-b border-theme-plum/5 text-[10px] text-theme-plum/70 uppercase">
                  <th className="py-2.5 px-4">Scholar</th>
                  <th className="py-2.5 px-4">Learning Quest</th>
                  <th className="py-2.5 px-4">XP Score</th>
                  <th className="py-2.5 px-4">Feedback Comments</th>
                  <th className="py-2.5 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-theme-plum/5">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-white/20 transition-colors">
                    <td className="py-3 px-4 font-bold">{log.userName}</td>
                    <td className="py-3 px-4">{log.moduleTitle}</td>
                    <td className="py-3 px-4"><span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold border border-emerald-100 rounded">+{log.xpAwarded} XP</span></td>
                    <td className="py-3 px-4 text-slate-600 font-normal italic max-w-xs truncate" title={log.feedbackText}>"{log.feedbackText}"</td>
                    <td className="py-3 px-4 text-slate-400">{new Date(log.reviewedAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
