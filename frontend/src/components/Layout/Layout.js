import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import './Layout.css';

/**
 * Main application shell wrapping Sidebar, Topbar, and content area.
 */
export default function Layout({ pageTitle, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <div className="layout-root">
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <div className="layout-main-wrapper">
        <Topbar pageTitle={pageTitle} onMenuToggle={toggleSidebar} />
        <main className="layout-content">
          <div className="layout-content-inner animate-fade">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

