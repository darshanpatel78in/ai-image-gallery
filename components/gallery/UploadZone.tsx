"use client";

import { useState, useCallback, useRef } from "react";
import type { ChangeEvent } from "react";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import { useUpload } from "@/hooks/useUpload";

interface UploadZoneProps {
  onUploadComplete?: () => void;
}

export default function UploadZone({ onUploadComplete }: UploadZoneProps) {
  const { uploading, uploadFiles } = useUpload();
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    // Clean up old preview URLs before creating new ones
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    
    setSelectedFiles(files);
    
    // Create preview URLs for selected images
    const urls: string[] = [];
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      urls.push(url);
    });
    setPreviewUrls(urls);
  }, [previewUrls]);

  const handleUpload = useCallback(async () => {
    if (!selectedFiles || selectedFiles.length === 0) return;
    
    await uploadFiles(selectedFiles, onUploadComplete);
    
    // Clean up preview URLs after upload
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setPreviewUrls([]);
    setSelectedFiles(null);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [selectedFiles, uploadFiles, onUploadComplete, previewUrls]);

  const handleClear = useCallback(() => {
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setPreviewUrls([]);
    setSelectedFiles(null);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [previewUrls]);

  return (
    <section className="flex flex-col gap-3 rounded border border-dashed border-slate-700 bg-slate-900/40 p-4">
      <div className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded border border-slate-700 bg-slate-900/60 p-6 text-center text-sm text-slate-300">
        <p className="font-medium">Choose images to upload</p>
        <p className="text-xs text-slate-400">
          PNG or JPEG up to 10MB. Multiple files allowed.
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg"
          multiple
          className="mt-3 text-xs"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleFileSelect(e.target.files)
          }
          disabled={uploading}
        />
      </div>
      
      {/* Preview or Upload Progress Section - maintains consistent height */}
      {(previewUrls.length > 0 || uploading) && (
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {uploading ? (
            // Show skeleton loaders during upload
            Array.from({ length: selectedFiles?.length || 4 }).map((_, idx) => (
              <Skeleton key={idx} className="aspect-video w-full" />
            ))
          ) : (
            // Show preview images
            previewUrls.map((url, idx) => (
              <div key={idx} className="relative aspect-video overflow-hidden rounded border border-slate-700 bg-slate-800">
                <img
                  src={url}
                  alt={`Preview ${idx + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
            ))
          )}
        </div>
      )}
      
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>
          {uploading 
            ? `Uploading ${selectedFiles?.length || 0} file(s)…` 
            : selectedFiles 
            ? `${selectedFiles.length} file(s) selected` 
            : "No files selected"}
        </span>
        <div className="flex gap-2">
          {selectedFiles && !uploading && (
            <Button 
              variant="ghost" 
              type="button" 
              onClick={handleClear}
            >
              Clear
            </Button>
          )}
          <Button 
            variant="ghost" 
            type="button" 
            disabled={!selectedFiles || uploading}
            onClick={handleUpload}
          >
            {uploading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
               
              </span>
            ) : (
              "Upload"
            )}
          </Button>
        </div>
      </div>
    </section>
  );
}
