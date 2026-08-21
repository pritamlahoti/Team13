import { useState, useEffect } from 'react';
import { Users, Plus, UserPlus, AlertCircle, ShieldAlert } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { teamsService } from '../services/teamsService';
import { adminService } from '../services/adminService';

export default function Teams() {
  const { user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [newTeamName, setNewTeamName] = useState('');
  const [memberToAdd, setMemberToAdd] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);
  const [addingMember, setAddingMember] = useState(false);

  useEffect(() => {
    Promise.all([adminService.getStudents(), adminService.getMentors()])
      .then(([students, mentors]) => setMembers([...students, ...mentors]))
      .catch(() => setMembers([]));
  }, []);

  const loadTeam = (id) => {
    setSelectedTeamId(id);
    setLoading(true);
    setError(null);
    teamsService.getTeam(id)
      .then(setSelectedTeam)
      .catch(err => setError(err.message || 'Failed to load team'))
      .finally(() => setLoading(false));
  };

  if (user?.role !== 'KATALYST_MANAGEMENT') {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-12">
        <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 shadow-sm border border-rose-100">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="font-display font-bold text-2xl text-theme-plum">Access Restricted</h2>
        <p className="text-sm text-slate-500 max-w-md font-sans">
          Only program mentors can manage teams here.
        </p>
      </div>
    );
  }

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    setCreating(true);
    setError(null);
    try {
      const team = await teamsService.createTeam(newTeamName.trim());
      setTeams(prev => [...prev, team]);
      setNewTeamName('');
      loadTeam(team.id);
    } catch (err) {
      setError(err.message || 'Failed to create team');
    } finally {
      setCreating(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!memberToAdd || !selectedTeamId) return;
    setAddingMember(true);
    setError(null);
    try {
      await teamsService.addMember(selectedTeamId, memberToAdd);
      const refreshed = await teamsService.getTeam(selectedTeamId);
      setSelectedTeam(refreshed);
      setMemberToAdd('');
    } catch (err) {
      setError(err.message || 'Failed to add member');
    } finally {
      setAddingMember(false);
    }
  };

  const existingMemberIds = new Set((selectedTeam?.members || []).map(m => m.userId));
  const availableMembers = members.filter(m => !existingMemberIds.has(m.id));

  return (
    <div className="space-y-8 pb-12">
      <div>
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-theme-berry" />
          <span className="text-xs font-bold font-display uppercase tracking-widest text-theme-berry">
            Team Panel
          </span>
        </div>
        <h1 className="font-display font-black text-3xl text-theme-plum mt-1">Teams</h1>
        <p className="text-xs text-slate-500 mt-1">Create project teams and assign scholars or mentors to them.</p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-800 text-xs font-sans flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create + team list */}
        <div className="lg:col-span-1 space-y-4">
          <form onSubmit={handleCreateTeam} className="glass-panel p-5 rounded-2xl space-y-3">
            <h2 className="font-display font-bold text-sm text-theme-plum">New Team</h2>
            <input
              type="text"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              placeholder="Team name"
              className="w-full p-3 bg-white/60 border border-theme-plum/10 rounded-xl focus:outline-none focus:border-theme-berry transition-all text-xs"
            />
            <button
              type="submit"
              disabled={creating || !newTeamName.trim()}
              className="w-full py-2.5 bg-theme-plum hover:bg-theme-berry disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              {creating ? 'Creating...' : 'Create Team'}
            </button>
          </form>

          <div className="glass-panel rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-theme-plum/5 flex items-center gap-2">
              <Users className="w-4 h-4 text-theme-plum/40" />
              <h2 className="font-display font-bold text-sm text-theme-plum">Teams This Session</h2>
            </div>
            {teams.length === 0 ? (
              <p className="p-6 text-center text-xs text-slate-500 font-sans">No teams yet — create one to get started.</p>
            ) : (
              <ul className="divide-y divide-theme-plum/5">
                {teams.map(team => (
                  <li key={team.id}>
                    <button
                      onClick={() => loadTeam(team.id)}
                      className={`w-full text-left px-5 py-3 text-xs font-bold font-sans transition-all cursor-pointer ${
                        selectedTeamId === team.id ? 'bg-theme-berry/10 text-theme-berry' : 'text-theme-plum/70 hover:bg-white/40'
                      }`}
                    >
                      {team.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Selected team detail */}
        <div className="lg:col-span-2 glass-panel rounded-2xl overflow-hidden">
          {!selectedTeamId ? (
            <p className="p-12 text-center text-xs text-slate-500 font-sans">Select or create a team to manage its members.</p>
          ) : loading ? (
            <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
              <div className="w-8 h-8 rounded-full border-2 border-theme-berry border-t-transparent animate-spin"></div>
              <p className="text-xs text-slate-500 font-sans">Loading team...</p>
            </div>
          ) : selectedTeam ? (
            <div className="p-5 md:p-6 space-y-5">
              <h2 className="font-display font-black text-lg text-theme-plum">{selectedTeam.name}</h2>

              <form onSubmit={handleAddMember} className="flex gap-2">
                <select
                  value={memberToAdd}
                  onChange={(e) => setMemberToAdd(e.target.value)}
                  className="flex-1 p-3 bg-white/60 border border-theme-plum/10 rounded-xl focus:outline-none focus:border-theme-berry transition-all text-xs font-semibold appearance-none"
                >
                  <option value="">Select a member to add...</option>
                  {availableMembers.map(m => (
                    <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
                  ))}
                </select>
                <button
                  type="submit"
                  disabled={addingMember || !memberToAdd}
                  className="px-4 py-2.5 bg-theme-berry/10 text-theme-berry hover:bg-theme-berry/20 disabled:opacity-50 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shrink-0"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Add
                </button>
              </form>

              {selectedTeam.members.length === 0 ? (
                <p className="text-xs text-slate-500 font-sans text-center py-6">No members yet.</p>
              ) : (
                <ul className="divide-y divide-theme-plum/5 border border-theme-plum/5 rounded-xl overflow-hidden">
                  {selectedTeam.members.map(m => (
                    <li key={m.id} className="flex items-center justify-between px-4 py-3 text-xs font-sans">
                      <div>
                        <div className="font-bold text-theme-plum">{m.user.name}</div>
                        <div className="text-[11px] text-slate-500">{m.user.email}</div>
                      </div>
                      <span className="px-2 py-1 bg-theme-plum/5 text-theme-plum rounded text-[10px] font-bold">{m.user.role}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
