"use client";

import React, { useState } from "react";
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
  AddEditGuardianModal,
  DeleteGuardianModal,
} from "@/components/modals/GuardianModals";

const stats = [
  {
    label: "Total Guardians",
    value: 120,
    icon: LuShieldCheck,
    color: "#3749a9",
  },
  {
    label: "Verified Guardians",
    value: 98,
    icon: LuBadgeCheck,
    color: "#1b9e5a",
  },
  {
    label: "New This Month",
    value: 14,
    icon: LuCalendarPlus,
    color: "#5b2d8a",
  },
  { label: "Total Children", value: 340, icon: LuUsers, color: "#131b46" },
];

const sampleGuardians: Guardian[] = [
  {
    guardian_id: "g1a2b3c4",
    full_name: "Alice Mukamana",
    email: "alice@example.com",
    phone_number: "+250 788 123 456",
    students_count: 2,
    created_at: "2026-02-10",
  },
  {
    guardian_id: "g2d3e4f5",
    full_name: "Jean Habimana",
    email: "jean@example.com",
    phone_number: "+250 722 987 654",
    students_count: 1,
    created_at: "2026-02-15",
  },
  {
    guardian_id: "g3g4h5i6",
    full_name: "Grace Uwimana",
    email: "grace@example.com",
    phone_number: "+250 733 456 789",
    students_count: 3,
    created_at: "2026-02-20",
  },
  {
    guardian_id: "g4j5k6l7",
    full_name: "Patrick Niyonzima",
    email: "patrick@example.com",
    phone_number: "+250 788 321 654",
    students_count: 1,
    created_at: "2026-03-01",
  },
  {
    guardian_id: "g5m6n7o8",
    full_name: "Diane Ingabire",
    email: "diane@example.com",
    phone_number: "+250 722 111 222",
    students_count: 2,
    created_at: "2026-03-04",
  },
];

export default function GuardiansPage() {
  const [guardians] = useState<Guardian[]>(sampleGuardians);
  const [viewGuardian, setViewGuardian] = useState<Guardian | null>(null);
  const [editGuardian, setEditGuardian] = useState<Guardian | null>(null);
  const [deleteGuardian, setDeleteGuardian] = useState<Guardian | null>(null);
  const [showAdd, setShowAdd] = useState(false);

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
          <Button
            size="sm"
            onClick={() => setShowAdd(true)}
            className="gap-1.5 bg-[#2d3b8e] hover:bg-[#233180] text-white"
          >
            <LuPlus size={15} /> Add Guardian
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#f7f8fc] border-b border-[#e4e6f0]">
                <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#7b82a8]">
                  Name
                </TableHead>
                <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#7b82a8]">
                  Email
                </TableHead>
                <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#7b82a8] hidden md:table-cell">
                  Phone
                </TableHead>
                <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#7b82a8] hidden lg:table-cell">
                  Students
                </TableHead>
                <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#7b82a8] hidden lg:table-cell">
                  Created At
                </TableHead>
                <TableHead className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#7b82a8] w-[60px]">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {guardians.map((g) => (
                <TableRow
                  key={g.guardian_id}
                  className="border-b border-[#f0f1f7] hover:bg-[#f7f8fc] transition-colors"
                >
                  <TableCell className="px-6 py-4 font-semibold text-[#0f1535] text-[13.5px]">
                    {g.full_name}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-[13px] text-[#4b5281]">
                    {g.email}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-[13px] text-[#4b5281] hidden md:table-cell">
                    {g.phone_number}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-[13px] text-[#4b5281] hidden lg:table-cell">
                    {g.students_count}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-[12.5px] text-[#9ba3c7] hidden lg:table-cell">
                    {g.created_at}
                  </TableCell>
                  <TableCell className="px-4 py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <LuEllipsis size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="min-w-[160px]"
                      >
                        <DropdownMenuItem onClick={() => setViewGuardian(g)}>
                          <LuEye size={14} className="mr-2" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            navigator.clipboard.writeText(g.guardian_id)
                          }
                        >
                          <LuCopy size={14} className="mr-2" /> Copy ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setEditGuardian(g)}>
                          <LuPencil size={14} className="mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => setDeleteGuardian(g)}
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
      </div>

      {/* Modals */}
      <ViewGuardianModal
        open={!!viewGuardian}
        onClose={() => setViewGuardian(null)}
        guardian={viewGuardian}
      />
      <AddEditGuardianModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        guardian={null}
        onSave={(data) => console.log("Add guardian:", data)}
      />
      <AddEditGuardianModal
        open={!!editGuardian}
        onClose={() => setEditGuardian(null)}
        guardian={editGuardian}
        onSave={(data) => console.log("Edit guardian:", data)}
      />
      <DeleteGuardianModal
        open={!!deleteGuardian}
        onClose={() => setDeleteGuardian(null)}
        guardian={deleteGuardian}
        onConfirm={() => console.log("Delete:", deleteGuardian?.guardian_id)}
      />
    </div>
  );
}
