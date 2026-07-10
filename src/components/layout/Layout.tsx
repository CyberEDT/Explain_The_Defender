import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { CILBanner } from './CILBanner';

export default function Layout() {
  return (
    <div className="flex h-screen overflow-hidden bg-bg-primary print:h-auto print:overflow-visible print:bg-white print:block">
      <div className="print:hidden h-full">
        <Sidebar />
      </div>
      <div className="flex flex-col flex-1 overflow-hidden print:overflow-visible print:block">
        <div className="print:hidden">
          <Topbar />
        </div>
        {/* CyberEDT Intelligence Layer — shows when session is active */}
        <div className="print:hidden">
          <CILBanner />
        </div>
        <main className="flex-1 overflow-y-auto print:overflow-visible print:p-0">
          <div className="p-6 animate-fade-in print:p-0 print:animate-none">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

