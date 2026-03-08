"use client";

import React, { useState, useRef, useEffect } from "react";
import { LuSearch, LuMenu, LuBell, LuX, LuCheck } from "react-icons/lu";

interface HeaderProps {
  onMenuClick: () => void;
  sidebarWidth: number;
}

const notifications = [
  { id: 1, title: "New student enrolled", desc: "Alice Mukamana registered a new student.", time: "2 min ago", read: false },
  { id: 2, title: "Course updated", desc: "Mathematics 101 syllabus was updated.", time: "1 hour ago", read: false },
  { id: 3, title: "Guardian request", desc: "Jean Habimana submitted an intent form.", time: "3 hours ago", read: false },
  { id: 4, title: "System update", desc: "Platform maintenance scheduled for tonight.", time: "Yesterday", read: true },
  { id: 5, title: "New course added", desc: "Science 201 has been added to the catalog.", time: "2 days ago", read: true },
];

export default function Header({ onMenuClick, sidebarWidth }: HeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close panel on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    if (notifOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [notifOpen]);

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

        <div className="hidden sm:block flex-1 max-w-lg">
          <button
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#f0f2fa] border border-[#e4e6f0] hover:border-[#b8bde8] transition-colors focus:outline-none"
            aria-label="Search"
          >
            <LuSearch size={15} color="#7b82a8" className="shrink-0" />
            <span className="text-[13px] text-[#7b82a8] font-medium select-none flex-1 text-left">
              Search students, courses…
            </span>
            <span className="hidden md:flex items-center text-[10px] font-bold text-[#9da5c8] bg-white border border-[#e4e6f0] rounded-md px-2 py-1 leading-none shrink-0">
              ⌘K
            </span>
          </button>
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
        <div className="flex-1 overflow-y-auto">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`px-5 py-4 border-b border-[#f0f2fa] hover:bg-[#f7f8fc] transition-colors cursor-pointer ${
                !notif.read ? "bg-[#f7f8fc]" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    !notif.read ? "bg-[#3749a9]" : "bg-transparent"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className={`text-[13px] leading-snug ${!notif.read ? "font-bold text-[#0f1535]" : "font-semibold text-[#3d4566]"}`}>
                    {notif.title}
                  </p>
                  <p className="text-[12px] text-[#7b82a8] mt-0.5 leading-relaxed">{notif.desc}</p>
                  <p className="text-[11px] text-[#9da5c8] mt-1">{notif.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Panel footer */}
        <div className="shrink-0 px-5 py-3 border-t border-[#e4e6f0]">
          <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#f0f2fa] hover:bg-[#e4e6f0] transition-colors text-[13px] font-semibold text-[#3d4566] focus:outline-none">
            <LuCheck size={14} />
            Mark all as read
          </button>
        </div>
      </div>
    </>
  );
}
