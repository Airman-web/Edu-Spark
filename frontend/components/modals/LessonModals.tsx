"use client";

import React, { useState, useEffect } from "react";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  LuFileText,
  LuVideo,
  LuBookOpen,
  LuStar,
  LuTriangleAlert,
} from "react-icons/lu";

// Lesson interface used across the lesson modals.
export interface Lesson {
  lesson_id: string;
  title: string;
  content_type: "video" | "reading";
  content: string;
  points_reward: number;
  course_title: string;
  course_id: string;
  created_at: string;
}

// Shared form field component for lesson modals.
function FormField({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
  icon: Icon,
  options,
}: {
  id: string;
  label: string;
  type?: "text" | "select" | "number";
  placeholder?: string;
  value: string | number;
  onChange: (v: any) => void;
  required?: boolean;
  icon: React.ElementType;
  options?: { label: string; value: string }[];
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-[12px] font-semibold uppercase tracking-wider text-[#7b82a8]"
      >
        {label}
      </label>

      <div className="relative">
        <Icon
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ba3c7] pointer-events-none"
        />

        {type === "select" ? (
          <select
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            className="w-full rounded-lg border border-[#e4e6f0] bg-[#f7f8fc] px-3 py-2.5 pl-9 text-[13px] text-[#0f1535] outline-none focus:border-[#3749a9] focus:bg-white focus:ring-2 focus:ring-[#3749a9]/10 transition-all appearance-none"
          >
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={id}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={(e) =>
              type === "number"
                ? onChange(Number(e.target.value))
                : onChange(e.target.value)
            }
            required={required}
            className="w-full rounded-lg border border-[#e4e6f0] bg-[#f7f8fc] px-3 py-2.5 pl-9 text-[13px] text-[#0f1535] placeholder:text-[#b0b7d3] outline-none focus:border-[#3749a9] focus:bg-white focus:ring-2 focus:ring-[#3749a9]/10 transition-all"
          />
        )}
      </div>
    </div>
  );
}

/* modal for rendering all lesson details */

interface ViewLessonModalProps {
  open: boolean;
  onClose: () => void;
  lesson: Lesson | null;
}

export function ViewLessonModal({
  open,
  onClose,
  lesson,
}: ViewLessonModalProps) {
  if (!lesson) return null;

  const fields = [
    { label: "Title", value: lesson.title },
    { label: "Course", value: lesson.course_title },
    { label: "Type", value: lesson.content_type },
    { label: "Points", value: String(lesson.points_reward) },
    { label: "Created At", value: lesson.created_at },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-2xl border border-[#e4e6f0]">
        <div className="bg-[#131b46] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <LuFileText size={18} className="text-white" />
            </div>
            <div>
              <DialogTitle className="text-white text-[15px] font-semibold">
                Lesson Details
              </DialogTitle>
              <DialogDescription className="text-white/60 text-[12px] mt-0.5">
                Viewing lesson information
              </DialogDescription>
            </div>
          </div>
        </div>

        <div className="px-6 py-5 grid gap-3">
          {fields.map((f) => (
            <div
              key={f.label}
              className="flex items-start justify-between py-2 border-b border-[#f0f1f7] last:border-0"
            >
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9ba3c7] w-28">
                {f.label}
              </span>
              <span className="text-[13px] font-medium text-[#0f1535] text-right">
                {f.value}
              </span>
            </div>
          ))}
        </div>

        <div className="px-6 pb-5 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// function to convert youtube url to embed url for iframe rendering in lesson view modal
function getYouTubeEmbedUrl(url: string) {
  if (!url) return null;

  try {
    const parsed = new URL(url);

    // normal youtube link
    if (parsed.hostname.includes("youtube.com")) {
      if (parsed.pathname === "/watch") {
        const videoId = parsed.searchParams.get("v");
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }

      // already embed
      if (parsed.pathname.startsWith("/embed/")) {
        return url;
      }
    }

    // short youtu.be link
    if (parsed.hostname.includes("youtu.be")) {
      const videoId = parsed.pathname.slice(1);
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    return null;
  } catch {
    return null;
  }
}

/* The add/edit lesson modal */

interface AddEditLessonModalProps {
  open: boolean;
  onClose: () => void;
  lesson: Lesson | null;
  onSave: (data: any) => Promise<void>;
}

export function AddEditLessonModal({
  open,
  onClose,
  lesson,
  onSave,
}: AddEditLessonModalProps) {
  const [form, setForm] = useState({
    title: "",
    content_type: "video" as "video" | "reading",
    content: "",
    points_reward: 10,
    course_id: "",
  });

  const [courses, setCourses] = useState<
    { course_id: string; title: string; grade_group: { name: string } }[]
  >([]);

  const [loading, setLoading] = useState(false);
  const isEdit = !!lesson;

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
        setCourses(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    if (lesson) {
      setForm({
        title: lesson.title,
        content_type: lesson.content_type,
        content: lesson.content,
        points_reward: lesson.points_reward,
        course_id: lesson.course_id,
      });
    } else {
      setForm({
        title: "",
        content_type: "video",
        content: "",
        points_reward: 10,
        course_id: "",
      });
    }
  }, [lesson, open]);

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
        setLoading(true);

        let contentToSave = form.content;

        if (form.content_type === "video") {
        const embedUrl = getYouTubeEmbedUrl(form.content);

        if (!embedUrl) {
            toast.error("Please enter a valid YouTube video link");
            setLoading(false);
            return;
        }

        contentToSave = embedUrl;
        }

        const payload = {
        ...form,
        content: contentToSave,
        };

        if (isEdit && lesson) {
        await onSave({
            ...payload,
            lesson_id: lesson.lesson_id,
        });
        toast.success("Lesson updated successfully");
        } else {
        await onSave(payload);
        toast.success("Lesson added successfully");
        }

        onClose();
    } catch (err: any) {
        toast.error(err.message || "Something went wrong");
    } finally {
        setLoading(false);
    }
    };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-2xl border border-[#e4e6f0]">
        <div className="bg-[#3749a9] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <LuFileText size={18} className="text-white" />
            </div>
            <div>
              <DialogTitle className="text-white text-[15px] font-semibold">
                {isEdit ? "Edit Lesson" : "Add Lesson"}
              </DialogTitle>
              <DialogDescription className="text-white/60 text-[12px] mt-0.5">
                {isEdit
                  ? "Update lesson details below"
                  : "Fill in the lesson information"}
              </DialogDescription>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 grid gap-4">
          <FormField
            id="l_title"
            label="Title"
            placeholder="Lesson title"
            value={form.title}
            onChange={(v) => setForm({ ...form, title: v })}
            required
            icon={LuBookOpen}
          />

          <FormField
            id="l_course"
            label="Course"
            type="select"
            value={form.course_id}
            onChange={(v) => setForm({ ...form, course_id: v })}
            required
            icon={LuBookOpen}
            options={[
              { label: "Select Course", value: "" },
              ...courses.map((c) => ({
                label: `${c.title} - ${c.grade_group?.name || ""}`,
                value: c.course_id,
              })),
            ]}
          />

          <FormField
            id="l_type"
            label="Content Type"
            type="select"
            value={form.content_type}
            onChange={(v) => setForm({ ...form, content_type: v })}
            required
            icon={LuVideo}
            options={[
              { label: "Video", value: "video" },
              { label: "Reading", value: "reading" },
            ]}
          />

          <FormField
            id="l_content"
            label="Content"
            placeholder="Video URL or text content"
            value={form.content}
            onChange={(v) => setForm({ ...form, content: v })}
            required
            icon={LuFileText}
          />

          <FormField
            id="l_points"
            label="Points Reward"
            type="number"
            value={form.points_reward}
            onChange={(v) => setForm({ ...form, points_reward: v })}
            required
            icon={LuStar}
          />

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#f0f1f7]">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>

            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                  Processing...
                </>
              ) : isEdit ? (
                "Update Lesson"
              ) : (
                "Add Lesson"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* The delete lesson modal */
interface DeleteLessonModalProps {
  open: boolean;
  onClose: () => void;
  lesson: Lesson | null;
  onConfirm: () => void;
}

export function DeleteLessonModal({
  open,
  onClose,
  lesson,
  onConfirm,
}: DeleteLessonModalProps) {
  if (!lesson) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm p-0 overflow-hidden rounded-2xl border border-[#e4e6f0]">
        <div className="px-6 pt-7 pb-2 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mb-4">
            <LuTriangleAlert size={26} className="text-red-500" />
          </div>

          <DialogTitle className="text-[16px] font-bold text-[#0f1535] mb-1">
            Delete Lesson
          </DialogTitle>

          <DialogDescription className="text-[13px] text-[#7b82a8] leading-relaxed">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-[#0f1535]">
              {lesson.title}
            </span>
            ? This action cannot be undone.
          </DialogDescription>
        </div>

        <div className="px-6 py-5 flex items-center justify-center gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>

          <Button
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Delete Lesson
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}