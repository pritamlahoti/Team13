import { useState, useEffect } from 'react';
import { FileText, Download, Filter } from 'lucide-react';
import { adminService } from '../../services/adminService';

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    adminService.getReports()
      .then(res => {
        setReports(Array.isArray(res) ? res : (res?.data || []));
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleDownload = (report) => {
    // In a real app, this would trigger a download from a URL or generate a CSV
    alert(`Downloading ${report.name}...`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-black text-3xl text-slate-800">Reports</h1>
          <p className="text-slate-500 mt-1">Export system data, progress reports, and engagement metrics.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-bold text-sm hover:bg-slate-200 transition-colors">
          <Filter className="w-4 h-4" /> Filter Reports
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="p-12 text-center text-rose-500 font-medium">
            Error: {error}
          </div>
        ) : reports.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            No reports available for export.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {reports.map((report) => (
              <div key={report.id} className="p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center hover:bg-slate-50 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800">{report.name}</h3>
                  <p className="text-sm text-slate-500 mt-0.5">{report.description}</p>
                  <p className="text-xs text-slate-400 mt-2 font-medium uppercase tracking-wider">
                    Format: {report.format} • Generated: {new Date(report.generatedAt).toLocaleDateString()}
                  </p>
                </div>
                <button 
                  onClick={() => handleDownload(report)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-sm font-bold transition-colors w-full sm:w-auto justify-center mt-2 sm:mt-0"
                >
                  <Download className="w-4 h-4" /> Download
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
