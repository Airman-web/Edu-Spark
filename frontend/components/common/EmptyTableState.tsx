"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface EmptyTableStateProps {
  icon?: React.ElementType;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyTableState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyTableStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center space-y-4">

      {Icon && (
        <div className="w-12 h-12 rounded-full bg-[#f0f2fa] flex items-center justify-center">
          <Icon size={20} className="text-[#7b82a8]" />
        </div>
      )}

      <div>
        <p className="text-sm font-semibold text-[#0f1535]">
          {title}
        </p>

        {description && (
          <p className="text-xs text-[#9ba3c7] mt-1">
            {description}
          </p>
        )}
      </div>

      {actionLabel && onAction && (
        <Button
          size="sm"
          onClick={onAction}
          className="bg-[#3749a9] hover:bg-[#2d3b8e] text-white"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}