"use client";

import { useState, useEffect } from "react";

interface SearchBarProps {
  q: string;
  color: string;
  onChange: (q: string, color: string) => void;
}

export default function SearchBar({ q, color, onChange }: SearchBarProps) {
  const [localQ, setLocalQ] = useState(q);
  const [localColor, setLocalColor] = useState(color);

  useEffect(() => {
    setLocalQ(q);
    setLocalColor(color);
  }, [q, color]);

  return (
    <div className="flex flex-wrap items-center gap-2 rounded border border-slate-800 bg-slate-900/60 p-3 text-sm">
      <input
        type="text"
        placeholder="Search by description or tags"
        className="flex-1 min-w-[200px] rounded border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 outline-none focus:border-primary"
        value={localQ}
        onChange={(e) => {
          const next = e.target.value;
          setLocalQ(next);
          onChange(next, localColor);
        }}
      />
      <input
        type="text"
        placeholder="Color hex (e.g. #ff0000)"
        className="w-full sm:w-48 rounded border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 outline-none focus:border-primary"
        value={localColor}
        onChange={(e) => {
          const next = e.target.value;
          setLocalColor(next);
          onChange(localQ, next);
        }}
      />
    </div>
  );
}
