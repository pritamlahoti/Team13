import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout() {
  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto h-full">
        <div className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
