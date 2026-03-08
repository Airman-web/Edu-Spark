"use client";

import React, { useState } from "react";
import {
  LuUsers,
  LuUserCheck,
  LuAccessibility,
  LuCalendarPlus,
  LuPlus,
  LuEllipsis,
  LuEye,
  LuCopy,
  LuPencil,
  LuTrash2,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  type Student,
  ViewStudentModal,
  AddEditStudentModal,
  DeleteStudentModal,
} from "@/components/modals/StudentModals";

const stats = [
  { label: "Total Students", value: 340, icon: LuUsers, color: "#131b46" },
  { label: "Active Students", value: 275, icon: LuUserCheck, color: "#1b9e5a" },
  {
    label: "With Disabilities",
    value: 12,
    icon: LuAccessibility,
    color: "#5b2d8a",
  },
  {
    label: "New This Month",
    value: 28,
    icon: LuCalendarPlus,
    color: "#3749a9",
  },
];

const sampleStudents: Student[] = [
  {
    student_id: "s1a2b3c4",
    full_name: "Uwimana Jean",
    display_name: "jean_u",
    grade_group: "P1",
    date_of_birth: "2018-03-12",
    disability_info: "",
    guardian_name: "Alice Mukamana",
    created_at: "2026-02-15",
  },
  {
    student_id: "s2d3e4f5",
    full_name: "Habimana Grace",
    display_name: "grace_h",
    grade_group: "P2",
    date_of_birth: "2017-07-22",
    disability_info: "Visual impairment",
    guardian_name: "Jean Habimana",
    created_at: "2026-02-20",
  },
  {
    student_id: "s3g4h5i6",
    full_name: "Niyonzima Patrick",
    display_name: "patrick_n",
    grade_group: "P1",
    date_of_birth: "2018-11-05",
    disability_info: "",
    guardian_name: "Grace Uwimana",
    created_at: "2026-03-01",
  },
  {
    student_id: "s4j5k6l7",
    full_name: "Ingabire Diane",
    display_name: "diane_i",
    grade_group: "P3",
    date_of_birth: "2016-01-18",
    disability_info: "",
    guardian_name: "Patrick Niyonzima",
    created_at: "2026-03-03",
  },
  {
    student_id: "s5m6n7o8",
    full_name: "Mugisha Eric",
    display_name: "eric_m",
    grade_group: "P2",
    date_of_birth: "2017-09-30",
    disability_info: "Hearing impairment",
    guardian_name: "Diane Ingabire",
    created_at: "2026-03-05",
  },
];

export default function StudentsPage() {
  const [students] = useState<Student[]>(sampleStudents);
  const [viewStudent, setViewStudent] = useState<Student | null>(null);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [deleteStudent, setDeleteStudent] = useState<Student | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="py-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((s) => (
          <StatsCard key={s.label} {...s} />
        ))}
      </div>

      {/* Table */}
      <div
        className="bg-white rounded-2xl border border-[#e4e6f0] overflow-hidden"
        style={{ boxShadow: "0 2px 12px rgba(19,27,70,0.06)" }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e4e6f0]">
          <h2 className="text-[16px] font-bold text-[#0f1535]">Students</h2>
          <Button
            size="sm"
            onClick={() => setShowAdd(true)}
            className="gap-1.5 bg-[#2d3b8e] hover:bg-[#233180] text-white"
          >
            <LuPlus size={15} /> Add Student
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#f7f8fc] border-b border-[#e4e6f0]">
                <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#7b82a8]">
                  Name
                </TableHead>
                <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#7b82a8]">
                  Display Name
                </TableHead>
                <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#7b82a8]">
                  Grade
                </TableHead>
                <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#7b82a8] hidden md:table-cell">
                  Date of Birth
                </TableHead>
                <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#7b82a8] hidden lg:table-cell">
                  Created At
                </TableHead>
                <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#7b82a8] w-[60px]">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((s) => (
                <TableRow
                  key={s.student_id}
                  className="border-b border-[#f0f1f7] hover:bg-[#f7f8fc] transition-colors"
                >
                  <TableCell className="px-6 py-4 font-semibold text-[#0f1535] text-[13.5px]">
                    {s.full_name}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge
                      variant="secondary"
                      className="font-mono text-[11px]"
                    >
                      {s.display_name}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-[13px] text-[#4b5281]">
                    {s.grade_group}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-[13px] text-[#4b5281] hidden md:table-cell">
                    {s.date_of_birth}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-[12.5px] text-[#9ba3c7] hidden lg:table-cell">
                    {s.created_at}
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <LuEllipsis size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="min-w-[160px]"
                      >
                        <DropdownMenuItem onClick={() => setViewStudent(s)}>
                          <LuEye size={14} className="mr-2" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            navigator.clipboard.writeText(s.student_id)
                          }
                        >
                          <LuCopy size={14} className="mr-2" /> Copy ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setEditStudent(s)}>
                          <LuPencil size={14} className="mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => setDeleteStudent(s)}
                        >
                          <LuTrash2 size={14} className="mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modals */}
      <ViewStudentModal
        open={!!viewStudent}
        onClose={() => setViewStudent(null)}
        student={viewStudent}
      />
      <AddEditStudentModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        student={null}
        onSave={(data) => console.log("Add student:", data)}
      />
      <AddEditStudentModal
        open={!!editStudent}
        onClose={() => setEditStudent(null)}
        student={editStudent}
        onSave={(data) => console.log("Edit student:", data)}
      />
      <DeleteStudentModal
        open={!!deleteStudent}
        onClose={() => setDeleteStudent(null)}
        student={deleteStudent}
        onConfirm={() => console.log("Delete:", deleteStudent?.student_id)}
      />
    </div>
  );
}
