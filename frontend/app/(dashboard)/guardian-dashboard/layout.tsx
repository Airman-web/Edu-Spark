'use client';

import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [autoCollapsed, setAutoCollapsed] = useState(false);
  const lastTotalsRef = useRef<Record<string, number>>({});

  // play a short alarm sound
const playAlarm = () => {
  const audio = new Audio("/sounds/alarm.mp3");
  audio.volume = 0.8;
  audio.play();

  // Stop after 7 seconds 
  setTimeout(() => {
    audio.pause();
    audio.currentTime = 0;
  }, 7000);
};


  useEffect(() => {
  const checkSessions = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // get children
    const studentsRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/students`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    

    if (!studentsRes.ok) return;

    const children = await studentsRes.json();
    console.log(children);

    for (const child of children) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/sessions/child/${child.student_id}/total-time`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) continue;

      const data = await res.json();
      const newTotal = Number(data.total_seconds) || 0;

      const previousTotal =
        lastTotalsRef.current[child.student_id] ?? null;
        console.log(child.full_name, previousTotal, newTotal);

      // If we already have a previous value and it increased
      if (
        previousTotal !== null &&
        newTotal !== previousTotal
      ) {
        const delta = newTotal - previousTotal;

        if (delta > 0) {
          const minutes = Math.floor(delta / 60);

          toast.custom((t) => (
          <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-2xl shadow-xl border border-yellow-200 w-[360px] animate-in slide-in-from-right duration-300">

            {/* Child Avatar */}
            <div className="relative">
              {child.profile_image_url ? (
                <img
                  src={child.profile_image_url}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-yellow-400 animate-pulse"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#3749a9] text-white flex items-center justify-center font-bold text-sm ring-2 ring-yellow-400 animate-pulse">
                  {child.full_name?.charAt(0)}
                </div>
              )}

              {/* Warning dot */}
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping"></span>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full"></span>
            </div>

            {/* Text Content */}
            <div className="flex-1">
              <p className="font-semibold text-[#92400e] text-sm">
                ⚠ Study Activity Alert
              </p>

              <p className="text-xs text-[#7c2d12] mt-1 leading-relaxed">
                <span className="font-semibold text-[#0f1535]">
                  {child.full_name}
                </span>{" "}
                was active for{" "}
                <span className="font-bold text-[#b45309]">
                  {minutes} minute{minutes !== 1 ? "s" : ""}
                </span>{" "}
                and just exited the learning platform.
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => toast.dismiss(t)}
              className="text-xs text-yellow-700 hover:text-yellow-900 transition"
            >
              ✕
            </button>

          </div>
        ), { duration: 5000 });

          playAlarm();
        }
      };

      // Update stored total
      lastTotalsRef.current[child.student_id] = newTotal;
    }
  };

  const interval = setInterval(checkSessions, 5000);

  return () => clearInterval(interval);
}, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "guardian") {
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
    <div className="flex min-h-screen bg-[#f7f8fc]">
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

        <main className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6 pt-[68px] bg-[#f7f8fc]">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
