"use client"

import { ToastProvider, ToastViewport } from "./toast"

export function Toaster() {
  return (
    <ToastProvider>
      <ToastViewport className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-96 max-w-[100vw]" />
    </ToastProvider>
  )
}