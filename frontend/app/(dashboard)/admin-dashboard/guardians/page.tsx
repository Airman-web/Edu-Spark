"use client";

import React, { useEffect, useState } from "react";
import {
  LuShieldCheck,
  LuBadgeCheck,
  LuCalendarPlus,
  LuUsers,
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

import {
  type Guardian,
  ViewGuardianModal,
  DeleteGuardianModal,
} from "@/components/modals/GuardianModals";

import { toast } from "sonner";



import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";



export default function GuardiansPage() {
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewGuardian, setViewGuardian] = useState<Guardian | null>(null);
  const [deleteGuardian, setDeleteGuardian] = useState<Guardian | null>(null);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns: ColumnDef<Guardian>[] = [
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
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone_number",
      header: "Phone",
    },
    {
      accessorKey: "students_count",
      header: "Students",
    },
    {
      accessorKey: "created_at",
      header: "Created At",
    },
  ];

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data: guardians,
    columns,
    state: {
      globalFilter,
      pagination,
    },
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  useEffect(() => {
    const fetchGuardians = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/guardians`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch guardians");

        const data = await res.json();

        setGuardians(data);
      } catch (err) {
        console.error(err);
        toast.error("Could not load guardians");
      } finally {
        setLoading(false);
      }
    };

    fetchGuardians();
  }, []);

  if (loading) {
    return (
      <div className="py-10 flex flex-col items-center gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#3749a9] border-t-transparent" />
        <p className="text-sm text-[#7b82a8]">Loading guardians...</p>
      </div>
    );
  }

  // calculating stats from actual guardian data

  const totalGuardians = guardians.length;

  const activeGuardians = guardians.filter(
    (g) => (g.students_count || 0) > 0
  ).length;

  const totalChildren = guardians.reduce(
    (sum, g) => sum + (g.students_count || 0),
    0
  );

  const now = new Date();
  const newThisMonth = guardians.filter((g) => {
    if (!g.created_at) return false;
    const created = new Date(g.created_at);
    return (
      created.getMonth() === now.getMonth() &&
      created.getFullYear() === now.getFullYear()
    );
  }).length;

  const stats = [
    {
      label: "Total Guardians",
      value: totalGuardians,
      icon: LuShieldCheck,
      color: "#3749a9",
    },
    {
      label: "Active Guardians",
      value: activeGuardians,
      icon: LuBadgeCheck,
      color: "#1b9e5a",
    },
    {
      label: "New This Month",
      value: newThisMonth,
      icon: LuCalendarPlus,
      color: "#5b2d8a",
    },
    {
      label: "Total Children",
      value: totalChildren,
      icon: LuUsers,
      color: "#131b46",
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
          <h2 className="text-[16px] font-bold text-[#0f1535]">Guardians</h2>
        <div className="px-6 py-4 border-b border-[#e4e6f0] flex justify-between items-center">
          <input
            type="text"
            placeholder="Search guardians..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-64 border border-[#e4e6f0] rounded-lg px-3 py-2 text-sm"
          />
        </div>
        </div>
        <div className="overflow-x-auto">
          
          <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
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
                    <TableHead>Actions</TableHead>
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
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <LuEllipsis size={16} />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end" className="min-w-[160px]">
                        <DropdownMenuItem onClick={() => setViewGuardian(row.original)}>
                          <LuEye size={14} className="mr-2" />
                          View Details
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() =>
                            navigator.clipboard.writeText(row.original.guardian_id)
                          }
                        >
                          <LuCopy size={14} className="mr-2" />
                          Copy ID
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => setDeleteGuardian(row.original)}
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
      <ViewGuardianModal
        open={!!viewGuardian}
        onClose={() => setViewGuardian(null)}
        guardian={viewGuardian}
      />
      <DeleteGuardianModal
        open={!!deleteGuardian}
        onClose={() => setDeleteGuardian(null)}
        guardian={deleteGuardian}
        onConfirm={async () => {
          try {
            const token = localStorage.getItem("token");

            const res = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/admin/guardians/${deleteGuardian?.guardian_id}`,
              {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (!res.ok) throw new Error("Delete failed");

            setGuardians((prev) =>
              prev.filter((g) => g.guardian_id !== deleteGuardian?.guardian_id)
            );

            toast.success("Guardian deleted");
          } catch (err: any) {
            toast.error(err.message);
          }
        }}
      />
    </div>
  );
}
