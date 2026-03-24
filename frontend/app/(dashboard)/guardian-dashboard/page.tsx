"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
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
import type { Student } from "@/components/modals/StudentModals";

import { LuUsers, LuHeart, LuBaby } from "react-icons/lu";

export default function GuardianDashboardHome() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [performance, setPerformance] = useState<any[]>([]);

  const switchToChild = async (studentId: string) => {
  try {
    const guardianToken = localStorage.getItem("token");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/switch-to-child/${studentId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${guardianToken}`,
        },
      }
    );

    if (!res.ok) {
      toast.error("Switch failed");
      return;
    }

    const data = await res.json();

    // Save guardian session
    localStorage.setItem("guardian_token", guardianToken || "");
    localStorage.setItem("guardian_user", localStorage.getItem("user") || "");

    // Replace with student session
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("role", data.user.role); // if you still use it

    // Go to student dashboard
    router.push("/student-dashboard");

  } catch (err) {
    console.error("Switch error:", err);
  }
};

  const calculateAge = (dob?: string) => {
    if (!dob) return 0;
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/students`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error();

      const data = await res.json();
      setStudents(data);
    } catch {
      toast.error("Could not load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const fetchPerformance = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/guardians/students/performance`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error();

      const data = await res.json();

      console.log("Guardian Performance Data:", data); 

      setPerformance(data || []);
    } catch (err) {
      console.error("Performance fetch failed", err);
    }
  };



  const topPerformer =
  performance.length > 0
    ? performance.reduce((prev, current) =>
        current.total_points > prev.total_points ? current : prev
      )
    : null;

  useEffect(() => {
    fetchStudents();
    fetchPerformance();
    
  }, []);

  if (loading) {
    return <div className="py-12 text-center">Loading dashboard...</div>;
  }

  // Stats calculations
  const totalChildren = students.length;

  const specialNeedsCount = students.filter(
    (s) => s.disability_info && s.disability_info.trim() !== ""
  ).length;

  const belowSixCount = students.filter(
    (s) => calculateAge(s.date_of_birth) < 6
  ).length;

  const averageAge =
    totalChildren > 0
      ? Math.round(
          students.reduce(
            (sum, s) => sum + calculateAge(s.date_of_birth),
            0
          ) / totalChildren
        )
      : 0;
  const performanceMap = new Map(
    performance.map((p) => [p.student_id, Number(p.total_points)])
  );

  return (
    <div className="min-h-screen bg-[#f7f8fc] px-6 py-8">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Total Childrenfor this guardian */}
          <StatCard
            icon={LuUsers}
            label="Total Children"
            value={totalChildren}
            bg="bg-blue-100"
            text="text-blue-700"
          />

          {/* Special Needs */}
          <StatCard
            icon={LuHeart}
            label="Special Needs"
            value={specialNeedsCount}
            bg="bg-rose-100"
            text="text-rose-700"
          />

          {/* Children Below 6 Years */}
          <StatCard
            icon={LuBaby}
            label="Below 6 Years"
            value={belowSixCount}
            bg="bg-emerald-100"
            text="text-emerald-700"
          />

          {/* Average Age */}
          <StatCard
            icon={LuUsers}
            label="Average Age"
            value={averageAge}
            bg="bg-purple-100"
            text="text-purple-700"
          />

        </div>

        {/* GUARDIAN CHILDREN SWITCHER */}
              <div className="bg-white rounded-2xl border border-[#e4e6f0] shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-[#1b2561]">
                       My Children
                    </h2>
                    <p className="text-sm text-[#7b82a8]">
                      Switch into your child's learning portal
                    </p>
                  </div>
                </div>
        
                {students.length === 0 ? (
                  <p className="text-sm text-gray-400">
                    No linked students yet.
                  </p>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {students.map((child: any) => (
                      <div
                        key={child.student_id}
                        className="flex items-center justify-between p-4 rounded-xl border hover:border-[#3749a9] transition cursor-pointer bg-[#f9f9ff]"
                        onClick={() => switchToChild(child.student_id)}
                      >
                        <div className="flex items-center gap-3">
                          {child.profile_image_url ? (
                            <img
                              src={child.profile_image_url}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-[#3749a9] text-white flex items-center justify-center font-bold">
                              {child.full_name?.charAt(0)}
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-sm">
                              {child.full_name}
                            </p>
                            <p className="text-xs text-gray-400">
                              {performanceMap.get(child.student_id) || 0} points
                            </p>
                          </div>
                        </div>
        
                        <button className="px-3 py-1 text-xs bg-[#3749a9] text-white rounded-lg">
                          Switch
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

        {/*  Chart showing children age distribution */}
        <div className="bg-white rounded-2xl border border-[#e4e6f0] shadow-sm p-8">
          <h2 className="text-lg font-semibold text-[#0f1535] mb-6">
            Children Age Overview
          </h2>

          {students.length === 0 ? (
            <div className="h-56 flex items-center justify-center text-[#9ba3c7] text-sm">
              No data available.
            </div>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={students.map((s) => ({
                    name: s.display_name,
                    age: calculateAge(s.date_of_birth),
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#eef1f7" />
                  <XAxis dataKey="name" stroke="#7b82a8" />
                  <YAxis stroke="#7b82a8" />
                  <Tooltip />
                  <Bar dataKey="age" fill="#3749a9" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
        {topPerformer && (
          <div className="mb-6 p-4 bg-[#f7f8fc] rounded-xl">
            <p className="text-sm text-[#7b82a8]">Top Performer</p>
            <p className="text-lg font-bold text-[#0f1535]">
              {topPerformer.display_name} — {topPerformer.total_points} points
            </p>
          </div>
        )}

        {/* children Performance Section */}
          <div className="bg-white rounded-2xl border border-[#e4e6f0] shadow-sm p-8">
            <h2 className="text-lg font-semibold text-[#0f1535] mb-6">
              Performance Overview
            </h2>

            {performance.length === 0 ? (
              <div className="h-56 flex items-center justify-center text-[#9ba3c7] text-sm">
                No performance data available yet.
              </div>
            ) : (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={performance.map((s) => ({
                      name: s.display_name,
                      points: Number(s.total_points) || 0,
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#eef1f7" />
                    <XAxis dataKey="name" stroke="#7b82a8" />
                    <YAxis stroke="#7b82a8" />
                    <Tooltip />
                    <Bar
                      dataKey="points"
                      fill="#3749a9"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  bg,
  text,
}: {
  icon: any;
  label: string;
  value: number;
  bg: string;
  text: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#e4e6f0] shadow-sm p-6 hover:shadow-md transition-all">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg}`}>
        <Icon className={`w-6 h-6 ${text}`} />
      </div>

      <div className="mt-5">
        <div className="text-2xl font-bold text-[#0f1535]">
          {value}
        </div>
        <div className="text-sm text-[#7b82a8] mt-1">
          {label}
        </div>
      </div>
    </div>
  );
}