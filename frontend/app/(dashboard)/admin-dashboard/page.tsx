"use client";

import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LuShieldCheck,
  LuUsers,
  LuBookOpen,
  LuUserCheck,
} from "react-icons/lu";
import StatsCard from "@/components/StatsCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// adding recharts for the graph
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const stats = [
  {
    label: "Total Guardians",
    value: 120,
    icon: LuShieldCheck,
    color: "#3749a9",
  },
  { label: "Total Students", value: 340, icon: LuUsers, color: "#131b46" },
  { label: "Total Courses", value: 18, icon: LuBookOpen, color: "#5b2d8a" },
  { label: "Active Students", value: 275, icon: LuUserCheck, color: "#1b9e5a" },
];


export default function AdminPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [recentGuardians, setRecentGuardians] = useState<any[]>([]);
  const [loadingGuardians, setLoadingGuardians] = useState(true);
  const [registrationData, setRegistrationData] = useState<any[]>([]);

  const [dashboardStats, setDashboardStats] = useState<{
    totalStudents: number;
    totalGuardians: number;
    totalCourses: number;
    activeStudents: number;
  } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "admin") {
      router.replace("/login");
      return;
    }

    setAuthorized(true);

    const fetchData = async () => {
      try {

      // fetch dashboard stats

      const resStats = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!resStats.ok) throw new Error("Failed to fetch stats");

      const statsData = await resStats.json();

      setDashboardStats(statsData);
      
        // fetch ALL guardians for analytics

        const resAll = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/guardians`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!resAll.ok) throw new Error("Failed to fetch guardians");

        const allGuardians = await resAll.json();

        // building the monthly registration data for the chart

        const monthlyMap: Record<string, number> = {};

        allGuardians.forEach((g: any) => {
          if (!g.created_at) return;

          const date = new Date(g.created_at);
          const key = `${date.getFullYear()}-${date.getMonth()}`;

          monthlyMap[key] = (monthlyMap[key] || 0) + 1;
        });

        const sortedChartData = Object.entries(monthlyMap)
          .sort(([a], [b]) => {
            const [yearA, monthA] = a.split("-").map(Number);
            const [yearB, monthB] = b.split("-").map(Number);
            return yearA === yearB
              ? monthA - monthB
              : yearA - yearB;
          })
          .map(([key, count]) => {
            const [year, month] = key.split("-").map(Number);
            const date = new Date(year, month);

            return {
              month: date.toLocaleString("en-GB", {
                month: "short",
                year: "numeric",
              }),
              count,
            };
          });

        setRegistrationData(sortedChartData);

        // fetch recent guardians for the table

        const resRecent = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/recent-guardians`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!resRecent.ok) throw new Error("Failed to fetch recent guardians");

        const recentData = await resRecent.json();

        // limiting to 5 most recent guardians for the table

        const sortedGuardians = [...recentData].sort(
          (a: any, b: any) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
        );

        const limited = sortedGuardians.slice(0, 5);

        const formatted = limited.map((g: any) => ({
          name: g.full_name,
          phone: g.phone_number,
          email: g.email,
          createdAt: g.created_at
            ? g.created_at.split("T")[0]
            : "",
        }));

        setRecentGuardians(formatted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingGuardians(false);
      }
    };
    

    fetchData();
  }, []);

  if (!authorized) return null;

  if (!dashboardStats) {
    return (
      <div className="py-10 flex justify-center">
        Loading dashboard...
      </div>
    );
  }

  const stats = dashboardStats
  ? [
      {
        label: "Total Guardians",
        value: dashboardStats.totalGuardians,
        icon: LuShieldCheck,
        color: "#3749a9",
      },
      {
        label: "Total Students",
        value: dashboardStats.totalStudents,
        icon: LuUsers,
        color: "#131b46",
      },
      {
        label: "Total Courses",
        value: dashboardStats.totalCourses,
        icon: LuBookOpen,
        color: "#5b2d8a",
      },
      {
        label: "Active Students",
        value: dashboardStats.activeStudents,
        icon: LuUserCheck,
        color: "#1b9e5a",
      },
    ]
  : [];
  return (
    <div className="py-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((s) => (
          <StatsCard key={s.label} {...s} />
        ))}
      </div>

        <div
          className="bg-white rounded-2xl border border-[#e4e6f0] p-6 mb-8"
          style={{ boxShadow: "0 2px 12px rgba(19,27,70,0.06)" }}
        >
          <h2 className="text-[16px] font-bold text-[#0f1535] mb-4">
            Guardian Registrations Per Month
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={registrationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3749a9" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      {/* Recent Guardians Table */}
      <div
        className="bg-white rounded-2xl border border-[#e4e6f0] overflow-hidden"
        style={{ boxShadow: "0 2px 12px rgba(19,27,70,0.06)" }}
      >
        <div className="px-6 py-4 border-b border-[#e4e6f0]">
          <h2 className="text-[16px] font-bold text-[#0f1535]">
            Recent Guardians
          </h2>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#f7f8fc] border-b border-[#e4e6f0]">
                <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#7b82a8]">
                  Name
                </TableHead>
                <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#7b82a8] hidden sm:table-cell">
                  Phone
                </TableHead>
                <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#7b82a8]">
                  Email
                </TableHead>
                <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#7b82a8] hidden md:table-cell">
                  Created At
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingGuardians ? (
                <TableRow>
                  <TableCell colSpan={4} className="px-6 py-6 text-center text-sm text-[#7b82a8]">
                    Loading recent guardians...
                  </TableCell>
                </TableRow>
              ) : recentGuardians.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="px-6 py-6 text-center text-sm text-[#7b82a8]">
                    No recent guardians found
                  </TableCell>
                </TableRow>
              ) : (
                  recentGuardians.map((g, i) => (
                    <TableRow
                      key={i}
                      className="border-b border-[#f0f1f7] hover:bg-[#f7f8fc] transition-colors"
                    >
                      <TableCell className="px-6 py-4 font-semibold text-[#0f1535] text-[13.5px]">
                        {g.name}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-[13px] text-[#4b5281] hidden sm:table-cell">
                        {g.phone}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-[13px] text-[#4b5281]">
                        {g.email}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-[12.5px] text-[#9ba3c7] hidden md:table-cell">
                        {g.createdAt}
                      </TableCell>
                    </TableRow>
                  ))
                )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
