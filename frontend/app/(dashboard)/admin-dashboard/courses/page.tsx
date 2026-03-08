"use client";

import React, { useState } from "react";
import {
  LuBookOpen,
  LuFileText,
  LuActivity,
  LuLayers,
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
  type Course,
  ViewCourseModal,
  AddEditCourseModal,
  DeleteCourseModal,
} from "@/components/modals/CourseModals";

const stats = [
  { label: "Total Courses", value: 18, icon: LuBookOpen, color: "#3749a9" },
  { label: "Total Lessons", value: 142, icon: LuFileText, color: "#131b46" },
  { label: "Active Courses", value: 15, icon: LuActivity, color: "#1b9e5a" },
  { label: "Grade Groups", value: 3, icon: LuLayers, color: "#5b2d8a" },
];

const sampleCourses: Course[] = [
  {
    course_id: "c1a2b3c4",
    title: "Mathematics 101",
    description: "Basic arithmetic and number concepts",
    grade_group: "P1",
    lessons_count: 12,
    created_at: "2026-01-10",
  },
  {
    course_id: "c2d3e4f5",
    title: "English Reading",
    description: "Phonics and early reading skills",
    grade_group: "P1",
    lessons_count: 15,
    created_at: "2026-01-15",
  },
  {
    course_id: "c3g4h5i6",
    title: "Science Basics",
    description: "Introduction to the natural world",
    grade_group: "P2",
    lessons_count: 10,
    created_at: "2026-02-01",
  },
  {
    course_id: "c4j5k6l7",
    title: "Social Studies",
    description: "Community and civic awareness",
    grade_group: "P2",
    lessons_count: 8,
    created_at: "2026-02-10",
  },
  {
    course_id: "c5m6n7o8",
    title: "Creative Arts",
    description: "Drawing, painting, and music fundamentals",
    grade_group: "P3",
    lessons_count: 6,
    created_at: "2026-03-01",
  },
];

export default function CoursesPage() {
  const [courses] = useState<Course[]>(sampleCourses);
  const [viewCourse, setViewCourse] = useState<Course | null>(null);
  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const [deleteCourse, setDeleteCourse] = useState<Course | null>(null);
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
          <h2 className="text-[16px] font-bold text-[#0f1535]">Courses</h2>
          <Button
            size="sm"
            onClick={() => setShowAdd(true)}
            className="gap-1.5 bg-[#2d3b8e] hover:bg-[#233180] text-white"
          >
            <LuPlus size={15} /> Add Course
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#f7f8fc] border-b border-[#e4e6f0]">
                <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#7b82a8]">
                  Title
                </TableHead>
                <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#7b82a8]">
                  Grade
                </TableHead>
                <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#7b82a8] hidden md:table-cell">
                  Description
                </TableHead>
                <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#7b82a8]">
                  Lessons
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
              {courses.map((c) => (
                <TableRow
                  key={c.course_id}
                  className="border-b border-[#f0f1f7] hover:bg-[#f7f8fc] transition-colors"
                >
                  <TableCell className="px-6 py-4 font-semibold text-[#0f1535] text-[13.5px]">
                    {c.title}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge variant="secondary">{c.grade_group}</Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-[13px] text-[#7b82a8] hidden md:table-cell max-w-[200px] truncate">
                    {c.description || "—"}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-[13px] text-[#4b5281]">
                    {c.lessons_count}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-[12.5px] text-[#9ba3c7] hidden lg:table-cell">
                    {c.created_at}
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
                        <DropdownMenuItem onClick={() => setViewCourse(c)}>
                          <LuEye size={14} className="mr-2" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            navigator.clipboard.writeText(c.course_id)
                          }
                        >
                          <LuCopy size={14} className="mr-2" /> Copy ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setEditCourse(c)}>
                          <LuPencil size={14} className="mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => setDeleteCourse(c)}
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
      <ViewCourseModal
        open={!!viewCourse}
        onClose={() => setViewCourse(null)}
        course={viewCourse}
      />
      <AddEditCourseModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        course={null}
        onSave={(data) => console.log("Add course:", data)}
      />
      <AddEditCourseModal
        open={!!editCourse}
        onClose={() => setEditCourse(null)}
        course={editCourse}
        onSave={(data) => console.log("Edit course:", data)}
      />
      <DeleteCourseModal
        open={!!deleteCourse}
        onClose={() => setDeleteCourse(null)}
        course={deleteCourse}
        onConfirm={() => console.log("Delete:", deleteCourse?.course_id)}
      />
    </div>
  );
}
