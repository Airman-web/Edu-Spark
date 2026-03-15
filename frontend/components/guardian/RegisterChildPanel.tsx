"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { LuCopy, LuEye, LuEyeOff, LuLink } from "react-icons/lu";

import {
  LuUser,
  LuTag,
  LuCalendar,
  LuAccessibility,
  LuLock,
  LuImage,
  LuUsers,
  LuX,
} from "react-icons/lu";

type GradeGroup = {
  grade_group_id: string;
  name: string;
};

function FormField({
  label,
  icon: Icon,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  description,
}: any) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-semibold uppercase tracking-wider text-[#7b82a8]">
        {label}
      </label>

      <div className="relative">
        <Icon
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ba3c7]"
        />

        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="w-full rounded-xl border border-[#e4e6f0] bg-[#f7f8fc] px-4 py-2.5 pl-10 text-[13px] text-[#0f1535] placeholder:text-[#b0b7d3] outline-none focus:border-[#3749a9] focus:bg-white focus:ring-2 focus:ring-[#3749a9]/10 transition-all"
        />
      </div>

      {description && (
        <p className="text-xs text-[#9ba3c7]">{description}</p>
      )}
    </div>
  );
}

function PasswordToast({
  loginUrl,
  username,
  password,
}: {
  loginUrl: string;
  username: string;
  password: string;
}) {
  const [visible, setVisible] = React.useState(false);

  return (
    <div className="bg-white border border-[#e4e6f0] rounded-xl shadow-lg p-5 w-[360px] space-y-3">

      <div className="text-sm font-semibold text-[#0f1535]">
        Student Registered Successfully 🎉
      </div>

      <div className="text-xs text-[#7b82a8]">
        Your child can now log in using the credentials below:
      </div>

      <div className="bg-[#f7f8fc] p-3 rounded-lg space-y-3 text-xs">

        {/* Login Link */}
        <div>
          <span className="text-[#9ba3c7]">Login Link:</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[#3749a9] truncate">
              {loginUrl}
            </span>
            <button
              onClick={() => navigator.clipboard.writeText(loginUrl)}
              className="text-[#3749a9]"
            >
              <LuCopy size={14} />
            </button>
          </div>
        </div>

        {/* Username */}
        <div>
          <span className="text-[#9ba3c7]">Username:</span>
          <div className="font-medium text-[#0f1535]">
            {username}
          </div>
        </div>

        {/* Password with Reveal */}
        <div>
          <span className="text-[#9ba3c7]">Password:</span>
          <div className="flex items-center justify-between mt-1">
            <span className="font-medium text-[#0f1535]">
              {visible ? password : "••••••••"}
            </span>

            <button
              type="button"
              onClick={() => setVisible(!visible)}
              className="text-[#3749a9]"
            >
              {visible ? <LuEyeOff size={14} /> : <LuEye size={14} />}
            </button>
          </div>
        </div>

      </div>

      <div className="text-[11px] text-[#9ba3c7]">
        Please keep these credentials safe. The password can be changed after first login.
      </div>
    </div>
  );
}

export default function RegisterChildPanel({
  onSuccess,
  onCancel,
}: {
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    grade_group_id: "",
    full_name: "",
    display_name: "",
    date_of_birth: "",
    disability_info: "",
    password: "",
    profile_image_url: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
   const [visible, setVisible] = React.useState(false);

  const [gradeGroups, setGradeGroups] = useState<GradeGroup[]>([]);
  const [loading, setLoading] = useState(false);

  const removeImage = () => {
    setImagePreview(null);

    setForm((prev) => ({
        ...prev,
        profile_image_url: "",
    }));
    };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();

    reader.onloadend = () => {
        const base64String = reader.result as string;

        setImagePreview(base64String);

        // Saving the base64 image into form
        setForm((prev) => ({
        ...prev,
        profile_image_url: base64String,
        }));
    };

    reader.readAsDataURL(file);
    };

  // Fetch Grade Groups
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

        if (!res.ok) throw new Error();

        const data = await res.json();
        setGradeGroups(data);
      } catch {
        toast.error("Could not load grade groups");
      }
    };

    fetchGradeGroups();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submittedPassword = form.password;
    const submittedDisplayName = form.display_name;

    try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/students`,
        {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(form), // now includes base64
        }
        );

        if (!res.ok) throw new Error("Failed to register child");

        toast.custom((t) => {
            const loginUrl = `${window.location.origin}/login`;

            return (
                <PasswordToast
                loginUrl={loginUrl}
                username={submittedDisplayName}
                password={submittedPassword}
                />
            );
            });
        onSuccess();
    } catch (err: any) {
        toast.error(err.message);
    } finally {
        setLoading(false);
    }
    };

  return (
    <div className="bg-white rounded-2xl border border-[#e4e6f0] shadow-sm overflow-hidden">

      {/* Header */}
      <div className="bg-[#3749a9] px-8 py-6">
        <h2 className="text-white text-lg font-semibold">
          Register My Child
        </h2>
        <p className="text-white/70 text-sm mt-1">
          Enter your child’s information below
        </p>
      </div>

      <form onSubmit={handleSubmit} className="px-8 py-8 grid gap-6">

        {/* Name Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            label="Full Name"
            icon={LuUser}
            value={form.full_name}
            onChange={(v: string) =>
              setForm({ ...form, full_name: v })
            }
            placeholder="e.g. Junior Doe"
            required
          />

          <FormField
            label="Display Name"
            icon={LuTag}
            value={form.display_name}
            onChange={(v: string) =>
              setForm({ ...form, display_name: v })
            }
            placeholder="e.g. Junior"
            required
          />
        </div>

        {/* Grade + DOB */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Grade Dropdown */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold uppercase tracking-wider text-[#7b82a8]">
              Grade Group
            </label>

            <div className="relative">
              <LuUsers
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ba3c7]"
              />

              <select
                value={form.grade_group_id}
                onChange={(e) =>
                  setForm({ ...form, grade_group_id: e.target.value })
                }
                required
                className="w-full rounded-xl border border-[#e4e6f0] bg-[#f7f8fc] px-4 py-2.5 pl-10 text-[13px] text-[#0f1535] outline-none focus:border-[#3749a9] focus:bg-white focus:ring-2 focus:ring-[#3749a9]/10 transition-all"
              >
                <option value="">Select Grade</option>
                {gradeGroups.map((g) => (
                  <option key={g.grade_group_id} value={g.grade_group_id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <FormField
            label="Date of Birth"
            icon={LuCalendar}
            type="date"
            value={form.date_of_birth}
            onChange={(v: string) =>
              setForm({ ...form, date_of_birth: v })
            }
          />
        </div>

        {/* Disability and Password Info */}
        <div className="grid md:grid-cols-2 gap-6">

            <FormField
                label="Disability Information"
                icon={LuAccessibility}
                value={form.disability_info}
                onChange={(v: string) =>
                setForm({ ...form, disability_info: v })
                }
                placeholder="Optional"
                description="If your child has any special learning needs, please describe briefly."
            />

            <FormField
                label="Password"
                icon={LuLock}
                type="password"
                value={form.password}
                onChange={(v: string) =>
                setForm({ ...form, password: v })
                }
                placeholder="••••••••"
                required
            />
            </div>

        {/* Profile Image Upload */}
            <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-semibold uppercase tracking-wider text-[#7b82a8]">
                Profile Image
            </label>

            <div className="border border-dashed border-[#e4e6f0] rounded-xl p-6 text-center bg-[#f7f8fc] hover:bg-white transition-all">

                <input
                type="file"
                accept="image/*"
                id="profileUpload"
                className="hidden"
                onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                    handleImageUpload(e.target.files[0]);
                    }
                }}
                />

                <label
                htmlFor="profileUpload"
                className="cursor-pointer flex flex-col items-center gap-3"
                >
                <LuImage size={28} className="text-[#9ba3c7]" />

                <span className="text-sm text-[#4b5281]">
                    Click to upload image
                </span>

                <span className="text-xs text-[#9ba3c7]">
                    PNG, JPG up to 5MB
                </span>
                </label>
            </div>

            {/* Preview */}
            {imagePreview && (
                <div className="flex justify-center mt-4 relative w-fit mx-auto">
                    <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-28 h-28 rounded-xl object-cover border border-[#e4e6f0] shadow-sm"
                    />

                    {/* Remove Button */}
                    <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white text-xs flex items-center justify-center shadow-md transition-all"
                    >
                    <LuX size={14} />
                    </button>
                </div>
                )}
            </div>


        {/* Footer */}
        <div className="flex justify-end gap-3 pt-4 border-t border-[#f0f1f7]">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="border-[#e4e6f0] text-[#4b5281] hover:bg-[#f7f8fc]"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={loading}
            className="bg-[#3749a9] hover:bg-[#2d3b8e] text-white flex items-center gap-2"
          >
            {loading && (
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            )}
            Register Child
          </Button>
        </div>
      </form>
    </div>
  );
}