"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { LuUsers } from "react-icons/lu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LuPlus, LuPencil, LuTrash2 } from "react-icons/lu";
import EmptyTableState from "@/components/common/EmptyTableState";

type GradeGroup = {
  grade_group_id: string;
  name: string;
  description?: string;
};

export default function GradeGroupsPage() {
  const [gradeGroups, setGradeGroups] = useState<GradeGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<GradeGroup | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchGradeGroups = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/grade-groups`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error();

      const data = await res.json();
      setGradeGroups(data);
    } catch {
      toast.error("Failed to fetch grade groups");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGradeGroups();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      setActionLoading(id);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/grade-groups/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error();

      toast.success("Grade group deleted");
      fetchGradeGroups();
    } catch {
      toast.error("Delete failed");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="py-6 px-6 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[18px] font-bold text-[#0f1535]">
            Grade Groups
          </h1>
          <p className="text-sm text-[#7b82a8] mt-1">
            Organize students into structured grade levels.
          </p>
        </div>

        <Button
          onClick={() => {
            setEditData(null);
            setShowModal(true);
          }}
          className="bg-[#3749a9] hover:bg-[#2d3b8e] text-white gap-2"
        >
          <LuPlus size={14} />
          Add Grade Group
        </Button>
      </div>

      {/* Content Card */}
      <div className="bg-white rounded-2xl border border-[#e4e6f0] overflow-hidden">

        {loading ? (
          <div className="p-10 text-center text-[#7b82a8]">
            Loading grade groups...
          </div>
        ) : gradeGroups.length === 0 ? (
          <div className="p-10 text-center space-y-4">
            <p className="text-sm text-[#7b82a8]">
              No grade group available.
            </p>
            <Button
              onClick={() => setShowModal(true)}
              className="bg-[#3749a9] hover:bg-[#2d3b8e] text-white gap-2"
            >
              <LuPlus size={14} />
              Add Grade Group
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right pr-6 w-[140px]">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {gradeGroups.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3}>
                    <EmptyTableState
                      icon={LuUsers}
                      title="No grade groups found"
                      description="Grade groups will appear here once added."
                      actionLabel="Add Grade Group"
                      onAction={() => setShowModal(true)}
                    />
                  </TableCell>
                </TableRow>
              ) : (
                         
              gradeGroups.map((g) => (
                <TableRow key={g.grade_group_id}>
                  <TableCell className="pl-6 font-semibold text-[#0f1535]">
                    {g.name}
                  </TableCell>

                  <TableCell className="text-[#6c7393]">
                    {g.description || "No description provided"}
                  </TableCell>

                  <TableCell className="text-right pr-6">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          setEditData(g);
                          setShowModal(true);
                        }}
                      >
                        <LuPencil size={15} />
                      </Button>

                      <Button
                        size="icon"
                        variant="ghost"
                        disabled={actionLoading === g.grade_group_id}
                        className="text-red-600"
                        onClick={() =>
                          handleDelete(g.grade_group_id)
                        }
                      >
                        {actionLoading === g.grade_group_id ? (
                          <span className="animate-spin h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full" />
                        ) : (
                          <LuTrash2 size={15} />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
            </TableBody>
          </Table>
        )}
      </div>

      {showModal && (
        <GradeGroupModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            fetchGradeGroups();
          }}
          editData={editData}
        />
      )}
    </div>
  );
}

function GradeGroupModal({
  onClose,
  onSuccess,
  editData,
}: any) {
  const [form, setForm] = useState({
    name: editData?.name || "",
    description: editData?.description || "",
  });
  const [loading, setLoading] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      setLoading(true);

      const url = editData
        ? `${process.env.NEXT_PUBLIC_API_URL}/grade-groups/${editData.grade_group_id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/grade-groups`;

      const method = editData ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();

      toast.success(
        editData ? "Grade group updated" : "Grade group created"
      );

      onSuccess();
    } catch {
      toast.error("Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-[440px] p-8 space-y-6 shadow-xl">

        <div>
          <h2 className="text-lg font-bold text-[#0f1535]">
            {editData ? "Edit Grade Group" : "Add Grade Group"}
          </h2>
          <p className="text-sm text-[#7b82a8] mt-1">
            Create structured grade levels for organizing students.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#7b82a8] uppercase">
              Grade Name
            </label>
            <input
              placeholder="e.g. P1"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              required
              className="w-full border border-[#e4e6f0] rounded-xl px-4 py-2.5 bg-[#f7f8fc] focus:bg-white focus:border-[#3749a9] outline-none transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#7b82a8] uppercase">
              Description
            </label>
            <textarea
              placeholder="Optional description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full border border-[#e4e6f0] rounded-xl px-4 py-2.5 bg-[#f7f8fc] focus:bg-white focus:border-[#3749a9] outline-none transition-all"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#f0f1f7]">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="bg-[#3749a9] hover:bg-[#2d3b8e] text-white"
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}