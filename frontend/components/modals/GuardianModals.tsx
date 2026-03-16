"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LuUser, LuMail, LuPhone, LuLock, LuShieldCheck, LuTriangleAlert } from "react-icons/lu";

export interface Guardian {
  guardian_id: string;
  full_name: string;
  email: string;
  phone_number: string;
  students_count: number;
  created_at: string;
  _count: {
    students: number;
  };
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
      <label htmlFor={id} className="text-[12px] font-semibold uppercase tracking-wider text-[#7b82a8]">
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

interface ViewGuardianModalProps {
  open: boolean;
  onClose: () => void;
  guardian: Guardian | null;
}

export function ViewGuardianModal({ open, onClose, guardian }: ViewGuardianModalProps) {
  if (!guardian) return null;

  const fields = [
    { label: "Full Name", value: guardian.full_name },
    { label: "Email", value: guardian.email },
    { label: "Phone", value: guardian.phone_number || "—" },
    { label: "Students", value: String(guardian._count?.students ?? 0) },
    {
      label: "Created At",
      value: guardian.created_at
        ? new Date(guardian.created_at).toLocaleDateString("en-GB")
        : "—",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-2xl border border-[#e4e6f0]">
        {/* Coloured header */}
        <div className="bg-[#131b46] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <LuShieldCheck size={18} className="text-white" />
            </div>
            <div>
              <DialogTitle className="text-white text-[15px] font-semibold leading-tight">
                Guardian Details
              </DialogTitle>
              <DialogDescription className="text-white/60 text-[12px] mt-0.5">
                Viewing guardian information
              </DialogDescription>
            </div>
          </div>
        </div>

        {/* Fields */}
        <div className="px-6 py-5 grid gap-3">
          {fields.map((f) => (
            <div key={f.label} className="flex items-start justify-between py-2 border-b border-[#f0f1f7] last:border-0">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9ba3c7] w-28 shrink-0">
                {f.label}
              </span>
              <span className="text-[13px] font-medium text-[#0f1535] text-right">{f.value}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
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

// Add/Edit Guardian Modal
interface AddEditGuardianModalProps {
  open: boolean;
  onClose: () => void;
  guardian: Guardian | null;
  onSave: (data: Record<string, string>) => void;
}

export function AddEditGuardianModal({ open, onClose, guardian, onSave }: AddEditGuardianModalProps) {
  const [form, setForm] = useState({ full_name: "", email: "", phone_number: "", password: "" });

  useEffect(() => {
    if (guardian) {
      setForm({ full_name: guardian.full_name, email: guardian.email, phone_number: guardian.phone_number, password: "" });
    } else {
      setForm({ full_name: "", email: "", phone_number: "", password: "" });
    }
  }, [guardian, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  const isEdit = !!guardian;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-2xl border border-[#e4e6f0]">
        {/* Coloured header */}
        <div className="bg-[#3749a9] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <LuShieldCheck size={18} className="text-white" />
            </div>
            <div>
              <DialogTitle className="text-white text-[15px] font-semibold leading-tight">
                {isEdit ? "Edit Guardian" : "Add Guardian"}
              </DialogTitle>
              <DialogDescription className="text-white/60 text-[12px] mt-0.5">
                {isEdit ? "Update guardian information below" : "Fill in the details to add a new guardian"}
              </DialogDescription>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 grid gap-4">
          <FormField
            id="g_full_name"
            label="Full Name"
            placeholder="e.g. Alice Mukamana"
            value={form.full_name}
            onChange={(v) => setForm({ ...form, full_name: v })}
            required
            icon={LuUser}
          />
          <FormField
            id="g_email"
            label="Email Address"
            type="email"
            placeholder="e.g. alice@example.com"
            value={form.email}
            onChange={(v) => setForm({ ...form, email: v })}
            required
            icon={LuMail}
          />
          <FormField
            id="g_phone"
            label="Phone Number"
            placeholder="+250 7XX XXX XXX"
            value={form.phone_number}
            onChange={(v) => setForm({ ...form, phone_number: v })}
            icon={LuPhone}
          />
          <FormField
            id="g_password"
            label={isEdit ? "New Password (leave blank to keep)" : "Password"}
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(v) => setForm({ ...form, password: v })}
            required={!isEdit}
            icon={LuLock}
          />

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#f0f1f7]">
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
              {isEdit ? "Save Changes" : "Add Guardian"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Delete Guardian Modal
interface DeleteGuardianModalProps {
  open: boolean;
  onClose: () => void;
  guardian: Guardian | null;
  onConfirm: () => void;
}

export function DeleteGuardianModal({ open, onClose, guardian, onConfirm }: DeleteGuardianModalProps) {
  if (!guardian) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm p-0 overflow-hidden rounded-2xl border border-[#e4e6f0]">
        {/* Body */}
        <div className="px-6 pt-7 pb-2 flex flex-col items-center text-center">
          {/* Warning icon circle */}
          <div className="w-14 h-14 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mb-4">
            <LuTriangleAlert size={26} className="text-red-500" />
          </div>
          <DialogTitle className="text-[16px] font-bold text-[#0f1535] mb-1">
            Delete Guardian
          </DialogTitle>
          <DialogDescription className="text-[13px] text-[#7b82a8] leading-relaxed">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-[#0f1535]">{guardian.full_name}</span>?{" "}
            This action <span className="text-red-500 font-medium">cannot be undone</span>.
          </DialogDescription>
        </div>

        {/* Footer */}
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
            onClick={() => { onConfirm(); onClose(); }}
          >
            Delete Guardian
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
