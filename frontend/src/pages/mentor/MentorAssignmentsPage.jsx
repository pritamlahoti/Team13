import { ClipboardList, Filter } from 'lucide-react';

export default function MentorAssignmentsPage() {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black font-display text-theme-plum">Mentor Assignments</h1>
          <p className="text-slate-500">View tasks and students assigned to you by Katalyst Management.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white text-theme-plum border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 transition shadow-sm flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </header>
      
      <div className="bg-white/60 backdrop-blur p-12 rounded-3xl border border-theme-plum/10 shadow-sm text-center">
        <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-theme-plum mb-2">No matching assignments.</h3>
        <p className="text-slate-500 text-sm max-w-md mx-auto">
          There are currently no specific management assignments or required compliance tasks waiting for your action. Try changing your filters if you're looking for something specific.
        </p>
      </div>
    </div>
  );
}
