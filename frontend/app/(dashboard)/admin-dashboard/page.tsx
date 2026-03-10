"use client";

import React from "react";
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

const recentGuardians = [
  {
    name: "Alice Mukamana",
    phone: "+250 788 123 456",
    email: "alice@example.com",
    createdAt: "2026-03-05",
  },
  {
    name: "Jean Habimana",
    phone: "+250 722 987 654",
    email: "jean@example.com",
    createdAt: "2026-03-04",
  },
  {
    name: "Grace Uwimana",
    phone: "+250 733 456 789",
    email: "grace@example.com",
    createdAt: "2026-03-03",
  },
  {
    name: "Patrick Niyonzima",
    phone: "+250 788 321 654",
    email: "patrick@example.com",
    createdAt: "2026-03-02",
  },
  {
    name: "Diane Ingabire",
    phone: "+250 722 111 222",
    email: "diane@example.com",
    createdAt: "2026-03-01",
  },
];

export default function AdminPage() {
  return (
    <div className="py-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((s) => (
          <StatsCard key={s.label} {...s} />
        ))}
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
              {recentGuardians.map((g, i) => (
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
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
