"use client";

import React from "react";
import { LuHeadphones } from "react-icons/lu";

export default function StudentSupportPage() {
  return (
    <div className="py-6">
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-[#0f1535]">Support</h1>
        <p className="text-[13px] text-[#7b82a8] mt-0.5">
          Get help and contact the support team.
        </p>
      </div>

      <div
        className="bg-white rounded-2xl border border-[#e4e6f0] flex flex-col items-center justify-center py-20"
        style={{ boxShadow: "0 2px 12px rgba(19,27,70,0.06)" }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
          style={{ background: "#1b9e5a14" }}
        >
          <LuHeadphones size={26} color="#1b9e5a" />
        </div>
        <p className="text-[15px] font-semibold text-[#0f1535]">
          Support coming soon
        </p>
        <p className="text-[13px] text-[#7b82a8] mt-1">
          This section is under development.
        </p>
      </div>
    </div>
  );
}
