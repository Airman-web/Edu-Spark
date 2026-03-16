"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
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
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchStudents();
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

  return (
    <div className="min-h-screen bg-[#f7f8fc] px-6 py-8">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Total Children */}
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

          {/* Below 6 Years */}
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

        {/* Age Distribution Chart */}
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

        {/* Performance Section  */}
        <div className="bg-white rounded-2xl border border-[#e4e6f0] shadow-sm p-8">
          <h2 className="text-lg font-semibold text-[#0f1535] mb-3">
            Performance Overview
          </h2>
          <p className="text-sm text-[#7b82a8]">
            Performance graph will appear here once student performance endpoint
            for guardians is available.
          </p>

          <div className="mt-6 h-56 bg-[#f7f8fc] rounded-xl flex items-center justify-center text-[#9ba3c7] text-sm">
            Performance graph coming soon...
          </div>
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