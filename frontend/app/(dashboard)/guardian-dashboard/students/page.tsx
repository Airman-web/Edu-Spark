"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import RegisterChildPanel from "@/components/guardian/RegisterChildPanel";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { LuPlus, LuPencil } from "react-icons/lu";
import type { Student } from "@/components/modals/StudentModals";

export default function GuardianStudentsPage() {
  const [showForm, setShowForm] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const calculateAge = (dob?: string) => {
    if (!dob) return "—";
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

      if (!res.ok) throw new Error("Failed to fetch students");

      const data = await res.json();

      const formatted = data.map((s: any) => ({
        ...s,
        grade_group: s.grade_group?.name || "",
      }));

      setStudents(formatted);
    } catch {
      toast.error("Could not load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  if (loading) {
    return <div className="py-10 text-center">Loading students...</div>;
  }

  const getGradeBadgeStyle = (grade: string) => {
    if (!grade) return "bg-gray-100 text-gray-600";

    const normalized = grade.toLowerCase();

    if (normalized.includes("p1") || normalized.includes("p2")) {
      return "bg-blue-100 text-blue-700";
    }

    if (normalized.includes("p3") || normalized.includes("p4")) {
      return "bg-emerald-100 text-emerald-700";
    }

    if (normalized.includes("p5") || normalized.includes("p6")) {
      return "bg-purple-100 text-purple-700";
    }

    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="min-h-screen bg-[#f7f8fc] px-6 py-8">
      <div className="max-w-6xl mx-auto">

        {showForm ? (
          <div className="bg-white rounded-2xl border border-[#e4e6f0] shadow-sm p-8">
            <RegisterChildPanel
              student={selectedStudent}
              onSuccess={() => {
                setShowForm(false);
                setSelectedStudent(null);
                fetchStudents();
              }}
              onCancel={() => {
                setShowForm(false);
                setSelectedStudent(null);
              }}
            />
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-[#0f1535]">
                  My Children
                </h1>
                <p className="text-sm text-[#7b82a8] mt-1">
                  Track your children's progress and manage their profiles
                </p>

                {/* Adding count for students */}
                <div className="mt-4 inline-flex items-center gap-3 bg-white border border-[#e4e6f0] rounded-xl px-5 py-3 shadow-sm">
                  <span className="text-2xl font-bold text-[#3749a9]">
                    {students.length}
                  </span>
                  <span className="text-sm text-[#7b82a8]">
                    {students.length === 1 ? "Child Registered" : "Children Registered"}
                  </span>
                </div>
              </div>

              <Button
                onClick={() => {
                  setSelectedStudent(null);
                  setShowForm(true);
                }}
                className="bg-[#3749a9] text-white gap-2 px-5"
              >
                <LuPlus size={15} />
                Register My Child
              </Button>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-2xl border border-[#e4e6f0] shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#f7f8fc]">
                    <TableHead className="px-6 py-4">Student</TableHead>
                    <TableHead className="px-6 py-4">Grade</TableHead>
                    <TableHead className="px-6 py-4">Age</TableHead>
                    <TableHead className="px-6 py-4">Date of Birth</TableHead>
                    <TableHead className="px-6 py-4">Created</TableHead>
                    <TableHead className="px-6 py-4 w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {students.map((s) => (
                    <TableRow key={s.student_id} className="hover:bg-[#f7f8fc] transition-all">

                      {/* Profile and Name */}
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={
                              (s as any).profile_image_url ||
                              "https://ui-avatars.com/api/?name=" +
                                encodeURIComponent(s.full_name) +
                                "&background=3749a9&color=fff"
                            }
                            alt="Profile"
                            className="w-12 h-12 rounded-full object-cover border border-[#e4e6f0]"
                          />

                          <div>
                            <div className="font-semibold text-[#0f1535]">
                              {s.full_name}
                            </div>
                            <div className="text-sm text-[#7b82a8]">
                              @{s.display_name}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Grade Tag */}
                      <TableCell className="px-6 py-4">
                        <Badge
                          className={`font-medium px-3 py-1 rounded-full ${getGradeBadgeStyle(
                            s.grade_group
                          )}`}
                        >
                          {s.grade_group}
                        </Badge>
                      </TableCell>

                      {/* Age */}
                      <TableCell className="px-6 py-4 font-medium text-[#0f1535]">
                        {calculateAge(s.date_of_birth)}
                      </TableCell>

                      {/* DOB */}
                      <TableCell className="px-6 py-4 text-[#4b5281]">
                        {s.date_of_birth
                          ? new Date(s.date_of_birth).toLocaleDateString("en-GB")
                          : "—"}
                      </TableCell>

                      {/* Created */}
                      <TableCell className="px-6 py-4 text-[#4b5281]">
                        {new Date(s.created_at).toLocaleDateString("en-GB")}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="px-6 py-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedStudent(s);
                            setShowForm(true);
                          }}
                        >
                          <LuPencil size={16} />
                        </Button>
                      </TableCell>

                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {students.length === 0 && (
                <div className="text-center py-12 text-sm text-[#7b82a8]">
                  No children registered yet.
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}