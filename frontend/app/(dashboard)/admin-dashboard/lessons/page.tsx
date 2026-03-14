"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  LuFileText,
  LuVideo,
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
  type Lesson,
  ViewLessonModal,
  AddEditLessonModal,
  DeleteLessonModal,
} from "@/components/modals/LessonModals";
import { useRouter } from "next/navigation";

type BackendLesson = {
  lesson_id: string;
  title: string;
  content_type: "video" | "reading";
  content: string;
  points_reward: number;
  course: {
    course_id: string;
    title: string;
  };
  created_at: string;
};

const statsTemplate = (lessons: Lesson[]) => [
  {
    label: "Total Lessons",
    value: lessons.length,
    icon: LuFileText,
    color: "#3749a9",
  },
  {
    label: "Video Lessons",
    value: lessons.filter((l) => l.content_type === "video").length,
    icon: LuVideo,
    color: "#1b9e5a",
  },
];

export default function LessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewLesson, setViewLesson] = useState<Lesson | null>(null);
  const [editLesson, setEditLesson] = useState<Lesson | null>(null);
  const [deleteLesson, setDeleteLesson] = useState<Lesson | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const stats = statsTemplate(lessons);

  const fetchLessons = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/lessons`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch lessons");

      const data = await res.json();

      const formatted: Lesson[] = data.map((l: BackendLesson) => ({
        lesson_id: l.lesson_id,
        title: l.title,
        content_type: l.content_type,
        content: l.content,
        points_reward: l.points_reward,
        course_title: l.course?.title || "",
        course_id: l.course?.course_id || "",
        created_at: new Date(l.created_at).toLocaleDateString(),
      }));

      setLessons(formatted);
    } catch (err) {
      console.error(err);
      toast.error("Could not load lessons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  const handleAddLesson = async (form: any) => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/lessons`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      }
    );

    if (!res.ok) throw new Error("Failed to create lesson");

    toast.success("Lesson created");
    fetchLessons();
  };

  const handleEditLesson = async (form: any) => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/lessons/${form.lesson_id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      }
    );

    if (!res.ok) throw new Error("Failed to update lesson");

    toast.success("Lesson updated");
    fetchLessons();
  };

  const handleDeleteLesson = async () => {
    if (!deleteLesson) return;

    setDeleting(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/lessons/${deleteLesson.lesson_id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Delete failed");

      setLessons((prev) =>
        prev.filter((l) => l.lesson_id !== deleteLesson.lesson_id)
      );

      toast.success("Lesson deleted");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-6 flex justify-center items-center">
        Loading lessons...
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        {stats.map((s) => (
          <StatsCard key={s.label} {...s} />
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-[#e4e6f0] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e4e6f0]">
          <h2 className="text-[16px] font-bold text-[#0f1535]">Lessons</h2>
          <Button
            size="sm"
            onClick={() => setShowAdd(true)}
            className="gap-1.5 bg-[#2d3b8e] hover:bg-[#233180] text-white"
          >
            <LuPlus size={15} /> Add Lesson
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[60px]">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {lessons.map((l) => (
              <TableRow key={l.lesson_id}>
                <TableCell>{l.title}</TableCell>
                <TableCell>{l.course_title}</TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {l.content_type}
                  </Badge>
                </TableCell>
                <TableCell>{l.points_reward}</TableCell>
                <TableCell>{l.created_at}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <LuEllipsis size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setViewLesson(l)}>
                        <LuEye size={14} className="mr-2" /> View
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                            router.push(`/admin-dashboard/lessons/${l.lesson_id}/quiz`)
                        }
                        >
                        <LuFileText size={14} className="mr-2" /> Create Quiz
                        </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          navigator.clipboard.writeText(l.lesson_id)
                        }
                      >
                        <LuCopy size={14} className="mr-2" /> Copy ID
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setEditLesson(l)}>
                        <LuPencil size={14} className="mr-2" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => setDeleteLesson(l)}
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

      <ViewLessonModal
        open={!!viewLesson}
        onClose={() => setViewLesson(null)}
        lesson={viewLesson}
      />

      <AddEditLessonModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        lesson={null}
        onSave={handleAddLesson}
      />

      <AddEditLessonModal
        open={!!editLesson}
        onClose={() => setEditLesson(null)}
        lesson={editLesson}
        onSave={handleEditLesson}
      />

      <DeleteLessonModal
        open={!!deleteLesson}
        onClose={() => setDeleteLesson(null)}
        lesson={deleteLesson}
        onConfirm={async () => {
          await handleDeleteLesson();
          setDeleteLesson(null);
        }}
      />
    </div>
  );
}