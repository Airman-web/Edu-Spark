"use client";

import { useRouter } from "next/navigation";
import { LuArrowLeft } from "react-icons/lu";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#f7f8fc] flex flex-col items-center justify-center px-6">
      {/* 404 Large Number */}
      <h1 className="text-[clamp(120px,25vw,200px)] font-extrabold leading-none tracking-tighter text-[#e4e6f0] select-none">
        404
      </h1>

      {/* Message */}
      <h2 className="text-[22px] font-bold text-[#0f1535] mt-2 mb-2">
        Page not found
      </h2>
      <p className="text-[15px] text-[#7b82a8] text-center max-w-sm leading-relaxed mb-8">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>

      {/* Actions */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#e4e6f0] bg-white text-[13px] font-semibold text-[#3d4566] hover:bg-[#f0f2fa] transition-colors"
      >
        <LuArrowLeft size={15} />
        Go back
      </button>
    </div>
  );
}
