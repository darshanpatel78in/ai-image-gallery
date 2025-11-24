"use client";

import { useCallback, useState } from "react";

export interface ToastState {
  open: boolean;
  message: string;
}

export function useToast() {
  const [toast, setToast] = useState<ToastState>({ open: false, message: "" });

  const showToast = useCallback((message: string) => {
    setToast({ open: true, message });
    setTimeout(() => setToast({ open: false, message: "" }), 3000);
  }, []);

  return { toast, showToast };
}

interface ToastProps extends ToastState {}

export default function Toast({ open, message }: ToastProps) {
  if (!open) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded bg-slate-900 px-4 py-2 text-sm text-slate-50 shadow-lg">
      {message}
    </div>
  );
}
