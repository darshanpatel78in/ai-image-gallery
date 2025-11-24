"use client";

import { useCallback, useState } from "react";
import { nanoid } from "nanoid";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/lib/types/supabase";

export function useUpload() {
  const [uploading, setUploading] = useState(false);
  const supabase = createClientComponentClient<Database>();

  const uploadFiles = useCallback(async (files: FileList, onSuccess?: () => void) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) throw userError ?? new Error("Not authenticated");

      for (const file of Array.from(files)) {
        const id = nanoid();
        const basePath = `user-images/${user.id}`;
        const originalPath = `${basePath}/original/${id}`;

        const { error: uploadError } = await supabase.storage
          .from("user-images")
          .upload(originalPath, file, {
            contentType: file.type,
          });
        if (uploadError) throw uploadError;

        const { data: originalPublic } = supabase.storage
          .from("user-images")
          .getPublicUrl(originalPath);

        const { data: imageRow, error: insertError } = await supabase
          .from("images")
          .insert({
            user_id: user.id,
            filename: file.name,
            original_path: originalPath,
            thumbnail_path: originalPath,
            size_bytes: file.size,
            content_type: file.type,
          })
          .select("id")
          .single();

        if (insertError) throw insertError;

        const { error: metaError } = await supabase
          .from("image_metadata")
          .insert({
            image_id: imageRow.id,
            user_id: user.id,
            ai_processing_status: "pending",
          });

        if (metaError) throw metaError;
      }
      // Best-effort trigger of background AI processing for pending images.
      // This keeps the UX smooth without requiring manual calls in dev.
      try {
        await fetch("/api/ai/process-pending", { method: "POST" });
      } catch {
        // Ignore worker trigger errors; upload itself already succeeded.
      }
      
      // Call success callback to refresh gallery
      if (onSuccess) {
        onSuccess();
      }
    } finally {
      setUploading(false);
    }
  }, []);

  return { uploading, uploadFiles };
}
