import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

interface AdminLayoutProps { children: React.ReactNode; }

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg)' }}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar onToggleSidebar={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
