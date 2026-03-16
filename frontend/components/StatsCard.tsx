"use client";

import React from "react";

interface StatsCardProps {
  label: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
}

export default function StatsCard({ label, value, icon: Icon, color }: StatsCardProps) {
  return (
    <div
      className="bg-white rounded-2xl p-5 border border-[#e4e6f0] flex items-center gap-4"
      style={{ boxShadow: "0 2px 12px rgba(19,27,70,0.06)" }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${color}14` }}
      >
        <Icon size={22} color={color} />
      </div>
      <div>
        <p className="text-[13px] font-medium text-[#7b82a8]">{label}</p>
        <p className="text-[20px] font-semibold text-[#0f1535]">{value}</p>
      </div>
    </div>
  );
}
