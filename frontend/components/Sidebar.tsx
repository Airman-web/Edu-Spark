"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import {
  LuLayoutDashboard,
  LuUsers,
  LuSettings,
  LuHeadphones,
  LuChevronRight,
  LuBookOpen,
  LuShieldCheck,
  LuGraduationCap,
  LuMessageSquare,
  LuTrophy,
  LuTrendingUp,
  LuCalendar,
  LuBell,
  LuFileText,
  LuUser,
  LuBook,
} from "react-icons/lu";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { toast } from "sonner";

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
}

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const adminRoute = "/admin-dashboard";
const guardianRoute = "/guardian-dashboard";
const studentRoute = "/student-dashboard";

const adminMain: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LuLayoutDashboard,
    path: adminRoute,
  },
  {
    id: "guardians",
    label: "Guardians",
    icon: LuShieldCheck,
    path: `${adminRoute}/guardians`,
  },
  {
    id: "students",
    label: "Students",
    icon: LuUsers,
    path: `${adminRoute}/students`,
  },
  {
    id: "grade-groups",
    label: "Grade Groups",
    icon: LuUsers,
    path: `${adminRoute}/grade-groups`,
  },
  {
    id: "courses",
    label: "Courses",
    icon: LuBookOpen,
    path: `${adminRoute}/courses`,
  },

  {
    id: "lessons",
    label: "Lessons",
    icon: LuFileText,
    path: `${adminRoute}/lessons`,
  },
  {
    id: "quizzes",
    label: "Quizzes",
    icon: LuFileText, 
    path: `${adminRoute}/quizzes`,
  },
  {
    id: "leaderboard",
    label: "Leaderboard",
    icon: LuTrophy,
    path: `${adminRoute}/leaderboard`,
  },
];



// Guardian nav
const guardianMain: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LuLayoutDashboard,
    path: guardianRoute,
  },
  {
    id: "students",
    label: "My Children",
    icon: LuGraduationCap,
    path: `${guardianRoute}/students`,
  },
  {
    id: "progress",
    label: "Progress",
    icon: LuTrendingUp,
    path: `${guardianRoute}/progress`,
  },
   {
    id: "courses",
    label: "Find Courses",
    icon: LuBook,
    path: `../courses`,
  },
  {
    id: "leaderboard",
    label: "Leaderboard",
    icon: LuTrophy,
    path: `${guardianRoute}/leaderboard`,
  },
];


// Student nav
const studentMain: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LuLayoutDashboard,
    path: studentRoute,
  },
  {
    id: "courses",
    label: "My Courses",
    icon: LuBookOpen,
    path: `${studentRoute}/courses`,
  },
  {
    id: "student-courses",
    label: "Other Courses",
    icon: LuBook,
    path: `../courses`,
  },
  {
    id: "leaderboard",
    label: "Leaderboard",
    icon: LuTrophy,
    path: `${studentRoute}/leaderboard`,
  },
  {
    id: "profile",
    label: "Profile",
    icon: LuUser,
    path: `${studentRoute}/profile`,
  },
];


function usePortal(pathname: string) {
  if (pathname.startsWith(guardianRoute))
    return {
      main: guardianMain,
      base: guardianRoute,
      role: "Guardian",
    };
  if (pathname.startsWith(studentRoute))
    return {
      main: studentMain,
      base: studentRoute,
      role: "Student",
    };
  return {
    main: adminMain,
    base: adminRoute,
    role: "Admin",
  };
}

export default function Sidebar({ open, onClose, collapsed }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const {
    main: mainNav,
    base: portalBase,
  } = usePortal(pathname);

  const [isMobile, setIsMobile] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: "User",
    role: "Admin",
    initials: "U",
  });
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const h = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node))
        setProfileOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      const first = u.profile?.firstName || "",
        last = u.profile?.lastName || "";
      const name =
        `${first} ${last}`.trim() || u.email?.split("@")[0] || "User";
      const initials =
        first && last
          ? `${first[0]}${last[0]}`.toUpperCase()
          : first
            ? first.slice(0, 2).toUpperCase()
            : "U";
      let formattedRole = "User";

      if (u.role) {
        formattedRole =
          u.role.toLowerCase() === "admin"
            ? "Admin"
            : u.role.toLowerCase() === "guardian"
            ? "Guardian"
            : u.role.toLowerCase() === "student"
            ? "Student"
            : u.role;
      }

      setUserProfile({
        name,
        role: formattedRole,
        initials,
      });
    } catch (err) {
      toast.error("Failed to load user profile", {
        description:
          err instanceof Error ? err.message : "An unexpected error occurred.",
      });
    }
  }, []);

  const navigate = (path: string) => {
    router.push(path);
    if (isMobile) onClose();
  };
  const user = userProfile;
  
    const handleLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setProfileOpen(false);

      router.replace("/login"); 
    };

  const NavBtn = ({
    item,
    exact = false,
  }: {
    item: NavItem;
    exact?: boolean;
  }) => {
    const active = exact
      ? pathname === item.path
      : pathname === item.path || pathname.startsWith(item.path + "/");
    const Icon = item.icon;


    return (
      <button
        onClick={() => navigate(item.path)}
        title={collapsed ? item.label : undefined}
        className={`
          w-full flex items-center rounded-lg transition-all duration-150 focus:outline-none mb-1
          ${collapsed ? "justify-center p-3" : "gap-3 px-3 py-3"}
        `}
        style={
          active
            ? {
                background: "linear-gradient(135deg, #1b2561 0%, #3749a9 100%)",
                boxShadow: "0 2px 8px rgba(55,73,169,0.25)",
                color: "#fff",
              }
            : undefined
        }
      >
        <Icon
          size={19}
          color={active ? "#fff" : "#7b82a8"}
          className="shrink-0"
          style={{ minWidth: 19 }}
        />
        {!collapsed && (
          <span
            className={`text-[13px] leading-snug tracking-tight ${
              active ? "font-semibold text-white" : "font-medium text-[#3d4566]"
            }`}
          >
            {item.label}
          </span>
        )}
      </button>
    );
  };

  const w = collapsed ? "w-[68px]" : "w-[210px]";

  const NavContent = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {/* Logo */}
      <div
        className={`flex items-center shrink-0 h-[68px] ${
          mobile || !collapsed ? "px-5 gap-3" : "justify-center px-4"
        }`}
        style={{ borderBottom: "1.5px solid #e4e6f0" }}
      >
        <Image
          src="/images/logo-nobg.png"
          alt="EduSpark"
          width={28}
          height={28}
          className="object-contain shrink-0"
        />
        {(mobile || !collapsed) && (
          <span className="font-extrabold text-[16px] tracking-tight text-[#131b46] whitespace-nowrap select-none">
            Edu<span style={{ color: "#3749a9" }}>Spark</span>
          </span>
        )}
      </div>

      {/* Main nav */}
      <nav
        className={`flex-1 overflow-y-auto overflow-x-hidden py-3 ${mobile || !collapsed ? "px-4" : "px-3"}`}
      >
        {mainNav.map((item) => (
          <NavBtn key={item.id} item={item} exact={item.id === "dashboard"} />
        ))}
      </nav>

      {/* Bottom nav */}
      <div
        className={`shrink-0 pt-2 pb-1 ${mobile || !collapsed ? "px-4" : "px-3"}`}
        style={{ borderTop: "1.5px solid #e4e6f0" }}
      >
      </div>

      {/* Profile */}
      <div
        className={`shrink-0 ${mobile || !collapsed ? "p-4" : "p-3"}`}
        style={{ borderTop: "1.5px solid #e4e6f0" }}
        ref={mobile ? undefined : profileRef}
      >
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className={`w-full flex items-center rounded-xl hover:bg-[#f0f2fa] transition-colors focus:outline-none ${
              mobile || !collapsed ? "gap-3 p-2.5" : "justify-center p-2"
            }`}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
              style={{
                background: "linear-gradient(135deg, #131b46 0%, #3749a9 100%)",
                boxShadow: "0 2px 8px rgba(55,73,169,0.25)",
              }}
            >
              {user.initials}
            </div>

            {(mobile || !collapsed) && (
              <>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center gap-1">
                    <span className="text-[13px] font-bold text-[#0f1535] truncate leading-snug">
                      {user.name}
                    </span>
                    <RiVerifiedBadgeFill
                      size={11}
                      color="#47C2FF"
                      className="shrink-0"
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-[#7b82a8] uppercase tracking-widest">
                    {user.role}
                  </span>
                </div>
                <LuChevronRight
                  size={13}
                  color="#7b82a8"
                  className="shrink-0"
                />
              </>
            )}
          </button>

          {profileOpen && (
            <div
              className="absolute bottom-full left-0 mb-1 w-44 bg-white rounded-xl border border-[#e4e6f0] py-1 z-50 overflow-hidden"
              style={{ boxShadow: "0 8px 24px rgba(19,27,70,0.12)" }}
            >
              <div className="h-px bg-[#e4e6f0] my-1 mx-3" />
              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center gap-2.5 px-3.5 py-2 text-[12px] font-medium text-red-500 hover:bg-red-50 transition-colors"
              >
                <span className="text-sm leading-none">⏻</span> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <>
        <div
          onClick={onClose}
          className={`fixed inset-0 z-[1199] bg-black/40 transition-opacity duration-300 ${
            open
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        />
        <div
          className={`w-[210px] h-screen flex flex-col bg-white fixed top-0 left-0 z-[1200] overflow-hidden transition-transform duration-300 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
          style={{ borderRight: "1.5px solid #e4e6f0" }}
          ref={profileRef}
        >
          <NavContent mobile />
        </div>
      </>
    );
  }

  return (
    <div className="shrink-0">
      <div
        className={`${w} h-screen flex flex-col bg-white fixed top-0 left-0 z-[1200] transition-[width] duration-200 overflow-hidden`}
        style={{ borderRight: "1.5px solid #e4e6f0" }}
      >
        <NavContent />
      </div>
    </div>
  );
}
