"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  LuUsers,
  LuUser,
  LuTag,
  LuCalendar,
  LuAccessibility,
  LuLock,
  LuTriangleAlert,
} from "react-icons/lu";

export interface Student {
  student_id: string;
  full_name: string;
  display_name: string;
  grade_group: string;
  date_of_birth: string;
  disability_info: string;
  guardian_name: string;
  created_at: string;
}

function FormField({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
  icon: Icon,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  icon: React.ElementType;
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
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="w-full rounded-lg border border-[#e4e6f0] bg-[#f7f8fc] px-3 py-2.5 pl-9 text-[13px] text-[#0f1535] placeholder:text-[#b0b7d3] outline-none focus:border-[#3749a9] focus:bg-white focus:ring-2 focus:ring-[#3749a9]/10 transition-all"
        />
      </div>
    </div>
  );
}

interface ViewStudentModalProps {
  open: boolean;
  onClose: () => void;
  student: Student | null;
}

export function ViewStudentModal({
  open,
  onClose,
  student,
}: ViewStudentModalProps) {
  if (!student) return null;
  const fields = [
    { label: "Full Name", value: student.full_name },
    { label: "Display Name", value: student.display_name },
    { label: "Grade Group", value: student.grade_group },
    { label: "Date of Birth", value: student.date_of_birth || "—" },
    { label: "Disability Info", value: student.disability_info || "None" },
    { label: "Guardian", value: student.guardian_name },
    { label: "Created At", value: student.created_at },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-2xl border border-[#e4e6f0]">
        <div className="bg-[#131b46] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <LuUsers size={18} className="text-white" />
            </div>
            <div>
              <DialogTitle className="text-white text-[15px] font-semibold leading-tight">
                Student Details
              </DialogTitle>
              <DialogDescription className="text-white/60 text-[12px] mt-0.5">
                Viewing student information
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
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9ba3c7] w-28 shrink-0">
                {f.label}
              </span>
              <span className="text-[13px] font-medium text-[#0f1535] text-right">
                {f.value}
              </span>
            </div>
          ))}
        </div>
        <div className="px-6 pb-5 flex justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-[#e4e6f0] text-[#4b5281] hover:bg-[#f7f8fc]"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}


interface AddEditStudentModalProps {
  open: boolean;
  onClose: () => void;
  student: Student | null;
  onSave: (data: Record<string, string>) => void;
}

export function AddEditStudentModal({
  open,
  onClose,
  student,
  onSave,
}: AddEditStudentModalProps) {
  const [form, setForm] = useState({
    full_name: "",
    display_name: "",
    grade_group: "",
    date_of_birth: "",
    disability_info: "",
    password: "",
  });

  useEffect(() => {
    if (student) {
      setForm({
        full_name: student.full_name,
        display_name: student.display_name,
        grade_group: student.grade_group,
        date_of_birth: student.date_of_birth,
        disability_info: student.disability_info,
        password: "",
      });
    } else {
      setForm({
        full_name: "",
        display_name: "",
        grade_group: "",
        date_of_birth: "",
        disability_info: "",
        password: "",
      });
    }
  }, [student, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };
  const isEdit = !!student;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-2xl border border-[#e4e6f0]">
        <div className="bg-[#3749a9] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <LuUsers size={18} className="text-white" />
            </div>
            <div>
              <DialogTitle className="text-white text-[15px] font-semibold leading-tight">
                {isEdit ? "Edit Student" : "Add Student"}
              </DialogTitle>
              <DialogDescription className="text-white/60 text-[12px] mt-0.5">
                {isEdit
                  ? "Update student information below"
                  : "Fill in the details to add a new student"}
              </DialogDescription>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="px-6 py-5 grid gap-4 overflow-y-auto max-h-[50vh]">
            <FormField
              id="s_full_name"
              label="Full Name"
              placeholder="e.g. Uwimana Jean"
              value={form.full_name}
              onChange={(v) => setForm({ ...form, full_name: v })}
              required
              icon={LuUser}
            />
            <FormField
              id="s_display_name"
              label="Display Name"
              placeholder="e.g. jean_u"
              value={form.display_name}
              onChange={(v) => setForm({ ...form, display_name: v })}
              required
              icon={LuTag}
            />
            <FormField
              id="s_grade_group"
              label="Grade Group"
              placeholder="e.g. P1, P2, P3"
              value={form.grade_group}
              onChange={(v) => setForm({ ...form, grade_group: v })}
              required
              icon={LuUsers}
            />
            <FormField
              id="s_dob"
              label="Date of Birth"
              type="date"
              value={form.date_of_birth}
              onChange={(v) => setForm({ ...form, date_of_birth: v })}
              icon={LuCalendar}
            />
            <FormField
              id="s_disability"
              label="Disability Info"
              placeholder="Optional"
              value={form.disability_info}
              onChange={(v) => setForm({ ...form, disability_info: v })}
              icon={LuAccessibility}
            />
            <FormField
              id="s_password"
              label={isEdit ? "New Password (leave blank to keep)" : "Password"}
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(v) => setForm({ ...form, password: v })}
              required={!isEdit}
              icon={LuLock}
            />
          </div>
          {/* Sticky footer */}
          <div className="px-6 py-4 flex items-center justify-end gap-3 border-t border-[#f0f1f7] bg-white">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-[#e4e6f0] text-[#4b5281] hover:bg-[#f7f8fc]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#3749a9] hover:bg-[#2d3b8e] text-white"
            >
              {isEdit ? "Save Changes" : "Add Student"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface DeleteStudentModalProps {
  open: boolean;
  onClose: () => void;
  student: Student | null;
  onConfirm: () => void;
}

export function DeleteStudentModal({
  open,
  onClose,
  student,
  onConfirm,
}: DeleteStudentModalProps) {
  if (!student) return null;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm p-0 overflow-hidden rounded-2xl border border-[#e4e6f0]">
        <div className="px-6 pt-7 pb-2 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mb-4">
            <LuTriangleAlert size={26} className="text-red-500" />
          </div>
          <DialogTitle className="text-[16px] font-bold text-[#0f1535] mb-1">
            Delete Student
          </DialogTitle>
          <DialogDescription className="text-[13px] text-[#7b82a8] leading-relaxed">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-[#0f1535]">
              {student.full_name}
            </span>
            ? This action{" "}
            <span className="text-red-500 font-medium">cannot be undone</span>.
          </DialogDescription>
        </div>
        <div className="px-6 py-5 flex items-center justify-center gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 border-[#e4e6f0] text-[#4b5281] hover:bg-[#f7f8fc]"
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
            Delete Student
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
