import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { processImageFromUrl } from "@/lib/ai/processImage";

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
      
      const { error: updateError } = await supabase
        .from("image_metadata")
        // @ts-ignore - Supabase type inference issue with generic Database type
        .update({
          description: meta.description,
          tags: meta.tags,
          colors: meta.colors,
          ai_processing_status: "completed",
          ai_error: null,
        })
        .eq("id", (row as any).id);
      if (updateError) throw updateError;
      processed += 1;
    } catch (err: any) {
      await supabase
        .from("image_metadata")
        // @ts-ignore - Supabase type inference issue with generic Database type
        .update({
          ai_processing_status: "error",
          ai_error: err?.message ?? String(err),
        })
        .eq("id", (row as any).id);
    }
  }

  return NextResponse.json({ processed });
}
