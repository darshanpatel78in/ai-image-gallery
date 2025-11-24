"use client";

import { useCallback } from "react";
import type { ChangeEvent } from "react";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import { useUpload } from "@/hooks/useUpload";

interface UploadZoneProps {
  onUploadComplete?: () => void;
}

export default function UploadZone({ onUploadComplete }: UploadZoneProps) {
  const { uploading, uploadFiles } = useUpload();

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      void uploadFiles(files, onUploadComplete);
    },
    [uploadFiles, onUploadComplete]
  );

  return (
    <section className="flex flex-col gap-3 rounded border border-dashed border-slate-700 bg-slate-900/40 p-4">
      <div className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded border border-slate-700 bg-slate-900/60 p-6 text-center text-sm text-slate-300">
        <p className="font-medium">Drag and drop images here</p>
        <p className="text-xs text-slate-400">
          PNG or JPEG up to 10MB. Multiple files allowed.
        </p>
        <input
          type="file"
          accept="image/png,image/jpeg"
          multiple
          className="mt-3 text-xs"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleFiles(e.target.files)
          }
        />
      </div>
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>{uploading ? "Uploading…" : "Ready for upload"}</span>
        <Button variant="ghost" type="button" disabled={uploading}>
          {uploading ? "Uploading…" : "Upload"}
        </Button>
      </div>
      {uploading && (
        <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton key={idx} className="h-32 w-full" />
          ))}
        </div>
      )}
    </section>
  );
}
