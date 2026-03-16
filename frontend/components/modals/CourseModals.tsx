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
import { LuBookOpen, LuLayers, LuFileText, LuTriangleAlert } from "react-icons/lu";

// Defining the Course interface to ensure consistent data structure across modals
export interface Course {
  course_id: string;
  title: string;
  description: string;
  grade_group: string; 
  grade_group_id?: string; // 
  lessons_count: number;
  created_at: string;
}

// Shared styled input component for add/edit forms
function FormField({
  id, label, type = "text", placeholder, value, onChange, required, icon: Icon,options,
}: {
  id: string; label: string; type?: "text" | "select";  placeholder?: string;
  value: string; onChange: (v: string) => void; required?: boolean; icon: React.ElementType; options?: { label: string; value: string }[];
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[12px] font-semibold uppercase tracking-wider text-[#7b82a8]">
        {label}
      </label>
      <div className="relative">
        <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ba3c7] pointer-events-none" />
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
          id={id} type={type} placeholder={placeholder} value={value}
          onChange={(e) => onChange(e.target.value)} required={required}
          className="w-full rounded-lg border border-[#e4e6f0] bg-[#f7f8fc] px-3 py-2.5 pl-9 text-[13px] text-[#0f1535] placeholder:text-[#b0b7d3] outline-none focus:border-[#3749a9] focus:bg-white focus:ring-2 focus:ring-[#3749a9]/10 transition-all"
        />)}
      </div>
    </div>
  );
}

//The view Course Modal 
interface ViewCourseModalProps { open: boolean; onClose: () => void; course: Course | null; }

export function ViewCourseModal({ open, onClose, course }: ViewCourseModalProps) {
  if (!course) return null;
  const fields = [
    { label: "Title", value: course.title },
    { label: "Grade Group", value: course.grade_group },
    { label: "Description", value: course.description || "—" },
    { label: "Lessons", value: String(course.lessons_count) },
    { label: "Created At", value: course.created_at },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-2xl border border-[#e4e6f0]">
        <div className="bg-[#131b46] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <LuBookOpen size={18} className="text-white" />
            </div>
            <div>
              <DialogTitle className="text-white text-[15px] font-semibold leading-tight">Course Details</DialogTitle>
              <DialogDescription className="text-white/60 text-[12px] mt-0.5">Viewing course information</DialogDescription>
            </div>
          </div>
        </div>
        <div className="px-6 py-5 grid gap-3">
          {fields.map((f) => (
            <div key={f.label} className="flex items-start justify-between py-2 border-b border-[#f0f1f7] last:border-0">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9ba3c7] w-28 shrink-0">{f.label}</span>
              <span className="text-[13px] font-medium text-[#0f1535] text-right">{f.value}</span>
            </div>
          ))}
        </div>
        <div className="px-6 pb-5 flex justify-end">
          <Button variant="outline" onClick={onClose} className="border-[#e4e6f0] text-[#4b5281] hover:bg-[#f7f8fc]">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// The Add/Edit Course Modal
interface AddEditCourseModalProps {
  open: boolean; onClose: () => void; course: Course | null;
  onSave: (data: any) => void;
}

export function AddEditCourseModal({ open, onClose, course, onSave }: AddEditCourseModalProps) {
  const [form, setForm] = useState({ title: "", description: "", grade_group: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [gradeGroups, setGradeGroups] = useState<
  { grade_group_id: string; name: string; description: string }[]
  >([]);

  useEffect(() => {
  const fetchGradeGroups = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/grade-groups`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch grade groups");

      const data = await res.json();
      setGradeGroups(data);
    } catch (err) {
      console.error(err);
    }
  };

  fetchGradeGroups();
}, []);

  useEffect(() => {
    if (course) {
      setForm({ title: course.title, 
        description: course.description,
        grade_group: course.grade_group_id || "",
      });
    } else {
      setForm({ title: "", description: "", grade_group: "" });
    }
  }, [course, open]);

  // adding/editing course uses the same modal, we can differentiate by checking if course prop is null or not
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    setLoading(true);

    if (isEdit && course) {
      await onSave({
        ...form,
        course_id: course.course_id,
      });
      toast.success("Course updated successfully");
    } else {
      await onSave(form);
      toast.success("Course added successfully");
    }

    onClose();
  } catch (err: any) {
    toast.error(err.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};
  const isEdit = !!course;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-2xl border border-[#e4e6f0]transition-all duration-200">
        <div className="bg-[#3749a9] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <LuBookOpen size={18} className="text-white" />
            </div>
            <div>
              <DialogTitle className="text-white text-[15px] font-semibold leading-tight">
                {isEdit ? "Edit Course" : "Add Course"}
              </DialogTitle>
              <DialogDescription className="text-white/60 text-[12px] mt-0.5">
                {isEdit ? "Update course information below" : "Fill in the details to add a new course"}
              </DialogDescription>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 grid gap-4">
          <FormField id="c_title" label="Title" placeholder="e.g. Mathematics 101"
            value={form.title} onChange={(v) => setForm({ ...form, title: v })} required icon={LuBookOpen} />
         <FormField
            id="c_grade_group"
            label="Grade Group"
            type="select"
            value={form.grade_group}
            onChange={(v) => setForm({ ...form, grade_group: v })}
            required
            icon={LuLayers}
            options={[
              { label: "Select Grade Group", value: "" },
              ...gradeGroups.map((gg) => ({
                label: gg.name,
                value: gg.grade_group_id,
              })),
            ]}
          />
          <FormField id="c_description" label="Description" placeholder="Optional — brief summary of the course"
            value={form.description} onChange={(v) => setForm({ ...form, description: v })} icon={LuFileText} />
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#f0f1f7]">
              <Button type="button" variant="outline" onClick={onClose} className="border-[#e4e6f0] text-[#4b5281] hover:bg-[#f7f8fc]">
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                    Processing...
                  </>
                ) : (
                  isEdit ? "Update Course" : "Add Course"
                )}
              </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// The Delete Course Modal
interface DeleteCourseModalProps { open: boolean; onClose: () => void; course: Course | null; onConfirm: () => void; }

export function DeleteCourseModal({ open, onClose, course, onConfirm }: DeleteCourseModalProps) {
  if (!course) return null;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm p-0 overflow-hidden rounded-2xl border border-[#e4e6f0]">
        <div className="px-6 pt-7 pb-2 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mb-4">
            <LuTriangleAlert size={26} className="text-red-500" />
          </div>
          <DialogTitle className="text-[16px] font-bold text-[#0f1535] mb-1">Delete Course</DialogTitle>
          <DialogDescription className="text-[13px] text-[#7b82a8] leading-relaxed">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-[#0f1535]">{course.title}</span>?{" "}
            This action <span className="text-red-500 font-medium">cannot be undone</span>.
          </DialogDescription>
        </div>
        <div className="px-6 py-5 flex items-center justify-center gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1 border-[#e4e6f0] text-[#4b5281] hover:bg-[#f7f8fc]">
            Cancel
          </Button>
          <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            onClick={() => { onConfirm(); onClose(); }}>
            Delete Course
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
