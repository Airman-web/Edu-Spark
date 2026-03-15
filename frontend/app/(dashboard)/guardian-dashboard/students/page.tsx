"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import RegisterChildPanel from "@/components/guardian/RegisterChildPanel";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  LuPlus,
  LuPencil,
  LuEllipsis,
} from "react-icons/lu";
import {
  AddEditStudentModal,
  type Student,
} from "@/components/modals/StudentModals";


export default function GuardianStudentsPage() {
  const router = useRouter();
  const [showRegister, setShowRegister] = useState(false);

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [editStudent, setEditStudent] = useState<Student | null>(null);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/students`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch students");

      const data = await res.json();

      setStudents(data);
    } catch (err) {
      toast.error("Could not load students");
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleEditStudent = async (form: any) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/students/${editStudent?.student_id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) throw new Error("Failed to update student");

      toast.success("Student updated");

      fetchStudents();
      setEditStudent(null);
    } catch (err: any) {
      toast.error(err.message);
      throw err;
    }
  };

  if (loading) {
    return <div className="py-10 text-center">Loading students...</div>;
  }

    return (
    <div className="min-h-screen bg-[#f7f8fc] px-6 py-8">
        <div className="max-w-6xl mx-auto">

        {showRegister ? (
            <div className="bg-white rounded-2xl border border-[#e4e6f0] shadow-sm p-8">
            <RegisterChildPanel
                onSuccess={() => {
                setShowRegister(false);
                fetchStudents();
                }}
                onCancel={() => setShowRegister(false)}
            />
            </div>
        ) : (
            <>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                <h1 className="text-xl font-bold text-[#0f1535]">
                    My Children
                </h1>
                <p className="text-sm text-[#7b82a8] mt-1">
                    Manage and view your registered children
                </p>
                </div>

                <Button
                onClick={() => setShowRegister(true)}
                className="bg-[#3749a9] hover:bg-[#2d3b8e] text-white gap-2 px-5"
                >
                <LuPlus size={15} />
                Register My Child
                </Button>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-2xl border border-[#e4e6f0] shadow-sm overflow-hidden">
                <Table>
                <TableHeader>
                    <TableRow className="bg-[#f7f8fc]">
                    <TableHead>Name</TableHead>
                    <TableHead>Display Name</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {students.map((s) => (
                    <TableRow key={s.student_id}>
                        <TableCell className="font-medium text-[#0f1535]">
                        {s.full_name}
                        </TableCell>

                        <TableCell>
                        <Badge variant="secondary">
                            {s.display_name}
                        </Badge>
                        </TableCell>

                        <TableCell>{s.grade_group}</TableCell>

                        <TableCell>
                        {s.created_at
                            ? new Date(s.created_at).toLocaleDateString("en-GB")
                            : "—"}
                        </TableCell>

                        <TableCell>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditStudent(s)}
                        >
                            <LuPencil size={15} />
                        </Button>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>

                {students.length === 0 && (
                <div className="text-center py-10 text-sm text-[#7b82a8]">
                    No children registered yet.
                </div>
                )}
            </div>
            </>
        )}
        </div>
    </div>
    );
}