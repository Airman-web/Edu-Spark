'use client';

import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import React, { useState, useEffect } from 'react';

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [autoCollapsed, setAutoCollapsed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "student") {
      localStorage.clear();
      window.location.href = "/login";
    }
    
    const handleResize = () => {
      const width = window.innerWidth;
      const mobile = width < 768;
      setIsMobile(mobile);
      if (!mobile && width < 1024) {
        setAutoCollapsed(true);
      } else {
        setAutoCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isCollapsed = collapsed || autoCollapsed;

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setCollapsed(!collapsed);
      setAutoCollapsed(false);
    }
  };

  const sidebarWidth = isCollapsed ? 68 : 210;

  return (
    <div className="flex min-h-screen bg-[#f7f8fc] dark:bg-[#0b0f24]">
      <Sidebar
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        collapsed={isCollapsed}
        onToggleCollapse={() => {
          setCollapsed(!isCollapsed);
          setAutoCollapsed(false);
        }}
      />

      <div
        className="flex flex-1 flex-col overflow-hidden transition-[margin-left] duration-200"
        style={{ marginLeft: isMobile ? 0 : sidebarWidth }}
      >
        <Header onMenuClick={handleDrawerToggle} sidebarWidth={isMobile ? 0 : sidebarWidth} />

        <main className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6 pt-[68px] bg-[#f7f8fc] dark:bg-[#0b0f24]">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
