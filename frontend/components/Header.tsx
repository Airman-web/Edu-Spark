"use client";

import React, { useState, useRef, useEffect } from "react";
import { LuSearch, LuMenu, LuBell, LuX, LuCheck } from "react-icons/lu";

interface HeaderProps {
  onMenuClick: () => void;
  sidebarWidth: number;
}

// function to generate welcome message based on role and name
function getWelcomeContent(role: string, firstName: string) {
  const name = firstName || "User";

  switch (role?.toLowerCase()) {
    case "admin":
      return {
        title: `${getGreeting()}, ${name} 👋`,
        subtitle:
          "Manage students, guardians, courses and system performance.",
      };

    case "guardian":
      return {
        title: `${getGreeting()}, ${name} 👋`,
        subtitle:
          "Track your children's progress and stay updated on their learning journey.",
      };

    case "student":
      return {
        title: `${getGreeting()}, ${name} 👋`,
        subtitle:
          "Continue your learning and climb the leaderboard.",
      };

    default:
      return {
        title: `Welcome back, ${name} 👋`,
        subtitle: "",
      };
  }
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function Header({ onMenuClick, sidebarWidth }: HeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const unreadCount = 0;

  const [userInfo, setUserInfo] = useState({
    firstName: "",
    role: "",
  });


  // Close panel on outside click
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
    const user = JSON.parse(storedUser);

    const firstName =
      user?.full_name?.split(" ")[0] ||
      user?.profile?.firstName ||
      user?.email ||
      "";
      setUserInfo({
        firstName,
        role: user?.role || "",
      });
    }
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    if (notifOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [notifOpen]);

  const { title, subtitle } = getWelcomeContent(
    userInfo.role,
    userInfo.firstName
  );

  return (
    <>
      <div
        className="fixed top-0 right-0 h-16 z-[1100] flex items-center gap-2 sm:gap-4 px-3 sm:px-6 bg-white border-b border-[#e4e6f0] transition-[left,width] duration-200"
        style={{
          left: sidebarWidth,
          width: `calc(100% - ${sidebarWidth}px)`,
          boxShadow: "0 1px 4px rgba(19,27,70,0.06)",
        }}
      >
        {/* Hamburger */}
        <button
          onClick={onMenuClick}
          className="w-9 h-9 flex items-center justify-center rounded-xl text-[#3d4566] hover:bg-[#f0f2fa] border border-[#e4e6f0] transition-colors shrink-0 focus:outline-none"
          aria-label="Toggle sidebar"
        >
          <LuMenu size={18} />
        </button>

        {/* Search - icon only on mobile, full bar on sm+ */}
        <button
          className="sm:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-[#f0f2fa] border border-[#e4e6f0] hover:border-[#b8bde8] transition-colors shrink-0 focus:outline-none"
          aria-label="Search"
        >
          <LuSearch size={16} color="#7b82a8" />
        </button>

       <div className="flex flex-col">
        <span className="text-sm font-semibold text-[#0f1535]">
          {title}
        </span>
        {subtitle && (
          <span className="text-xs text-[#7b82a8]">
            {subtitle}
          </span>
        )}
      </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right actions */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setNotifOpen((o) => !o)}
            className="relative w-10 h-10 flex items-center justify-center rounded-xl border border-[#e4e6f0] text-[#3d4566] hover:bg-[#f0f2fa] transition-colors focus:outline-none"
            aria-label="Notifications"
          >
            <LuBell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-[17px] h-[17px] rounded-full bg-red-500 text-white text-[8px] font-bold flex items-center justify-center leading-none border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Notification slide-in panel */}
      {/* Overlay */}
      <div
        onClick={() => setNotifOpen(false)}
        className={`fixed inset-0 z-[1300] bg-black/30 transition-opacity duration-300 ${
          notifOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className={`fixed top-0 right-0 h-screen w-[340px] max-w-[85vw] z-[1400] bg-white flex flex-col transition-transform duration-300 ${
          notifOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ boxShadow: "-4px 0 24px rgba(19,27,70,0.12)" }}
      >
        {/* Panel header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-[#e4e6f0] shrink-0">
          <div className="flex items-center gap-2">
            <LuBell size={18} color="#3749a9" />
            <h2 className="text-[15px] font-bold text-[#0f1535]">Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={() => setNotifOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#f0f2fa] transition-colors focus:outline-none"
            aria-label="Close notifications"
          >
            <LuX size={18} color="#7b82a8" />
          </button>
        </div>

        {/* Notification list */}
       <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <LuBell size={36} className="text-[#c2c7e6] mb-3" />
          <p className="text-[14px] font-semibold text-[#0f1535]">
            No notifications yet
          </p>
          <p className="text-[12px] text-[#7b82a8] mt-1">
            Notifications will appear here once activity is available.
          </p>
        </div>

        {/* Panel footer */}
        <div className="shrink-0 px-5 py-4 border-t border-[#e4e6f0] text-center">
          <p className="text-[12px] text-[#9da5c8]">
            Notification system coming soon
          </p>
        </div>
      </div>
    </>
  );
}
