"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { useEffect } from "react";
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
  LuUsers,
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
import EmptyTableState from "@/components/common/EmptyTableState";

type BackendCourse = {
  course_id: string;
  title: string;
  description: string;
  grade_group: {
    grade_group_id: string;
    name: string;
    description: string;
  };
  _count: {
    lessons: number;
  };
  created_at: string;
};


export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewCourse, setViewCourse] = useState<Course | null>(null);
  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const [deleteCourse, setDeleteCourse] = useState<Course | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleAddCourse = async (form: any) => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/courses`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          grade_group_id: form.grade_group,
          title: form.title,
          description: form.description,
        }),
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to create course");
    }

    const data = await res.json();

    const formatted: Course = {
      course_id: data.course_id,
      title: data.title,
      description: data.description,
      grade_group: data.grade_group?.name || "",
      grade_group_id: data.grade_group?.grade_group_id || "",
      lessons_count: data._count?.lessons || 0,
      created_at: new Date(data.created_at).toLocaleDateString(),
    };

    setCourses((prev) => [formatted, ...prev]);
  };

  const handleEditCourse = async (form: any) => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/course/${form.course_id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          grade_group_id: form.grade_group,
          title: form.title,
          description: form.description,
        }),
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to update course");
    }

    const data = await res.json();
    console.log("Response status:", res.status);
    console.log("Response data:", data);

    const formatted: Course = {
      course_id: data.course_id,
      title: data.title,
      description: data.description,
      grade_group: data.grade_group?.name || "",
      grade_group_id: data.grade_group?.grade_group_id,
      lessons_count: data._count?.lessons || 0,
      created_at: new Date(data.created_at).toLocaleDateString(),
    };

    setCourses((prev) =>
      prev.map((c) =>
        c.course_id === formatted.course_id ? formatted : c
      )
    );
  };

  const handleDeleteCourse = async () => {
    if (!deleteCourse) return;

    setDeleting(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/course/${deleteCourse.course_id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete course");
      }

      // Remove from state
      setCourses((prev) =>
        prev.filter((c) => c.course_id !== deleteCourse.course_id)
      );

      toast.success("Course deleted successfully");

    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }

    finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/courses`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch courses");

        const data = await res.json();

        // Transforming backend response to match the Course interface
        const formatted: Course[] = data.map((c: {
        course_id: string;
        title: string;
        description: string;
        grade_group: {
          grade_group_id: string;
          name: string;
          description: string;
        };
        _count: {
          lessons: number;
        };
        created_at: string;
      }) => ({
        course_id: c.course_id,
        title: c.title,
        description: c.description,
        grade_group: c.grade_group?.name || "",
        grade_group_id: c.grade_group?.grade_group_id,
        lessons_count: c._count?.lessons || 0,
        created_at: new Date(c.created_at).toLocaleDateString(),
      }));

        setCourses(formatted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="py-6 flex justify-center items-center">
        Loading courses...
      </div>
    );
  }

  // calculating stats from actual course data from the backend

  const totalCourses = courses.length;

  const totalLessons = courses.reduce(
    (sum, c) => sum + (c.lessons_count || 0),
    0
  );

  const activeCourses = courses.filter(
    (c) => (c.lessons_count || 0) > 0
  ).length;

  const uniqueGradeGroups = new Set(
    courses.map((c) => c.grade_group_id)
  ).size;

  const stats = [
    {
      label: "Total Courses",
      value: totalCourses,
      icon: LuBookOpen,
      color: "#3749a9",
    },
    {
      label: "Total Lessons",
      value: totalLessons,
      icon: LuFileText,
      color: "#131b46",
    },
    {
      label: "Active Courses",
      value: activeCourses,
      icon: LuActivity,
      color: "#1b9e5a",
    },
    {
      label: "Grade Groups",
      value: uniqueGradeGroups,
      icon: LuLayers,
      color: "#5b2d8a",
    },
  ];

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
              {courses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <EmptyTableState
                      icon={LuBookOpen}
                      title="No courses found"
                      description="Courses will appear here once added."
                      actionLabel="Add Course"
                      onAction={() => setShowAdd(true)}
                    />
                  </TableCell>
                </TableRow>
              ) : (

                courses.map((c) => (
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
              ))
            )}
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
        onSave={handleAddCourse}
      />

      <AddEditCourseModal
        open={!!editCourse}
        onClose={() => setEditCourse(null)}
        course={editCourse}
        onSave={handleEditCourse}
      />
      <DeleteCourseModal
        open={!!deleteCourse}
        onClose={() => setDeleteCourse(null)}
        course={deleteCourse}
        onConfirm={async () => {
          await handleDeleteCourse();
          setDeleteCourse(null);
        }}
      />
    </div>
  );
}
