import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { processImageFromUrl } from "@/lib/ai/processImage";
import type { Database } from "@/lib/types/supabase";

const BATCH_SIZE = 10;

export async function POST() {
  const supabase = getSupabaseAdminClient();

  const { data: pending, error } = await supabase
    .from("image_metadata")
    .select("id,image_id,user_id,ai_processing_status,images(original_path)")
    .eq("ai_processing_status", "pending")
    .limit(BATCH_SIZE);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let processed = 0;

  for (const row of pending ?? []) {
    const image = (row as any).images?.[0] ?? (row as any).images;
    const originalPath = image?.original_path as string | undefined;
    if (!originalPath) continue;

    const { data: pub } = supabase.storage
      .from("user-images")
      .getPublicUrl(originalPath);

    const publicUrl = pub.publicUrl;

    try {
      const meta = await processImageFromUrl(publicUrl);
      
      const updateData: Database['public']['Tables']['image_metadata']['Update'] = {
        description: meta.description,
        tags: meta.tags,
        colors: meta.colors,
        ai_processing_status: "completed",
        ai_error: null,
      };
      
      const { error: updateError } = await supabase
        .from("image_metadata")
        .update(updateData)
        .eq("id", row.id);
      if (updateError) throw updateError;
      processed += 1;
    } catch (err: any) {
      const errorUpdate: Database['public']['Tables']['image_metadata']['Update'] = {
        ai_processing_status: "error",
        ai_error: err?.message ?? String(err),
      };
      
      await supabase
        .from("image_metadata")
        .update(errorUpdate)
        .eq("id", row.id);
    }
  }

  return NextResponse.json({ processed });
}
