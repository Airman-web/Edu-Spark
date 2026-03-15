"use client";

import React, { useEffect, useState } from "react";
import {
  LuUsers,
  LuUserCheck,
  LuAccessibility,
  LuCalendarPlus,
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
  type Student,
  ViewStudentModal,
  AddEditStudentModal,
  DeleteStudentModal,
} from "@/components/modals/StudentModals";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { toast } from "sonner";

type BackendStudent = {
  student_id: string;
  full_name: string;
  grade_group: {
    name: string;
  };
  guardian: {
    full_name: string;
  };
  created_at: string;
};



const formatDate = (dateString?: string) => {
  if (!dateString) return "";

  const date = new Date(dateString);

  if (isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-GB"); 
};


export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewStudent, setViewStudent] = useState<Student | null>(null);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [deleteStudent, setDeleteStudent] = useState<Student | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns: ColumnDef<Student>[] = [
    {
      accessorKey: "full_name",
      header: "Name",
      cell: ({ row }) => (
        <span className="font-semibold text-[#0f1535]">
          {row.original.full_name}
        </span>
      ),
    },
    {
      accessorKey: "display_name",
      header: "Display Name",
      cell: ({ row }) => (
        <Badge variant="secondary" className="font-mono text-[11px]">
          {row.original.display_name}
        </Badge>
      ),
    },
    {
      accessorKey: "grade_group",
      header: "Grade",
    },
    {
      accessorKey: "date_of_birth",
      header: "Date of Birth",
      cell: ({ row }) => formatDate(row.original.date_of_birth),
    },
    {
      accessorKey: "created_at",
      header: "Created At",
    },
  ];

  const table = useReactTable({
    data: students,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/students`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch students");

        const data: BackendStudent[] = await res.json();

        const formattedStudents = data.map((s: any) => ({
          student_id: s.student_id,
          full_name: s.full_name,
          display_name: s.display_name ?? "",
          grade_group: s.grade_group?.name ?? "",
          date_of_birth: s.date_of_birth,
          disability_info: s.disability_info ?? "",
          guardian_name: s.guardian?.full_name ?? "",
          created_at: formatDate(s.created_at),
        }));

        setStudents(formattedStudents);
      } catch (err) {
        console.error(err);
        toast.error("Could not load students");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) {
    return (
      <div className="py-10 flex flex-col items-center gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#3749a9] border-t-transparent" />
        <p className="text-sm text-[#7b82a8]">Loading students...</p>
      </div>
    );
  }

  // calculating stats from actual student data

  const totalStudents = students.length;

  // under 6 years old
  const now = new Date();

  const underSix = students.filter((s) => {
    if (!s.date_of_birth) return false;

    const dob = new Date(s.date_of_birth);
    if (isNaN(dob.getTime())) return false;

    const age =
      now.getFullYear() -
      dob.getFullYear() -
      (now < new Date(now.getFullYear(), dob.getMonth(), dob.getDate()) ? 1 : 0);

    return age < 6;
  }).length;

  // students with disabilities
  const withDisabilities = students.filter(
    (s) => s.disability_info && s.disability_info.trim() !== ""
  ).length;

  // new this month
  const newThisMonth = students.filter((s) => {
    if (!s.created_at) return false;

    const created = new Date(s.created_at);
    if (isNaN(created.getTime())) return false;

    return (
      created.getMonth() === now.getMonth() &&
      created.getFullYear() === now.getFullYear()
    );
  }).length;

  const stats = [
    {
      label: "Total Students",
      value: totalStudents,
      icon: LuUsers,
      color: "#131b46",
    },
    {
      label: "Under 6 Years",
      value: underSix,
      icon: LuUserCheck,
      color: "#1b9e5a",
    },
    {
      label: "With Disabilities",
      value: withDisabilities,
      icon: LuAccessibility,
      color: "#5b2d8a",
    },
    {
      label: "New This Month",
      value: newThisMonth,
      icon: LuCalendarPlus,
      color: "#3749a9",
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
          <h2 className="text-[16px] font-bold text-[#0f1535]">Students</h2>
          <input
            type="text"
            placeholder="Search students..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-64 border border-[#e4e6f0] rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="bg-[#f7f8fc] border-b border-[#e4e6f0]"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#7b82a8] cursor-pointer"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHead>
                  ))}
                  <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#7b82a8] w-[80px]">
                    Actions
                  </TableHead>
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-b border-[#f0f1f7] hover:bg-[#f7f8fc] transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="px-6 py-4 text-[13px] text-[#4b5281]"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}

                  {/* Actions */}
                  <TableCell className="px-6 py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <LuEllipsis size={16} />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end" className="min-w-[160px]">
                        <DropdownMenuItem
                          onClick={() => setViewStudent(row.original)}
                        >
                          <LuEye size={14} className="mr-2" />
                          View Details
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() =>
                            navigator.clipboard.writeText(
                              row.original.student_id
                            )
                          }
                        >
                          <LuCopy size={14} className="mr-2" />
                          Copy ID
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          onClick={() => setEditStudent(row.original)}
                        >
                          <LuPencil size={14} className="mr-2" />
                          Edit
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => setDeleteStudent(row.original)}
                        >
                          <LuTrash2 size={14} className="mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between px-6 py-4 border-t border-[#e4e6f0]">
            <div className="text-sm text-[#7b82a8]">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ViewStudentModal
        open={!!viewStudent}
        onClose={() => setViewStudent(null)}
        student={viewStudent}
      />
      <AddEditStudentModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        student={null}
        onSave={(data) => console.log("Add student:", data)}
      />
      <AddEditStudentModal
        open={!!editStudent}
        onClose={() => setEditStudent(null)}
        student={editStudent}
        onSave={(data) => console.log("Edit student:", data)}
      />
      <DeleteStudentModal
        open={!!deleteStudent}
        onClose={() => setDeleteStudent(null)}
        student={deleteStudent}
        onConfirm={() => console.log("Delete:", deleteStudent?.student_id)}
      />
    </div>
  );
}
