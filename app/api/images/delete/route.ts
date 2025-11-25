import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";

export async function DELETE(req: NextRequest) {
  const supabase = getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { imageId } = body;

  if (!imageId) {
    return NextResponse.json({ error: "imageId is required" }, { status: 400 });
  }

  // First get the image paths from the images table
  const { data: imageData, error: imageFetchError } = await supabase
    .from("images")
    .select("original_path, thumbnail_path, user_id")
    .eq("id", imageId)
    .eq("user_id", user.id)
    .single();

  if (imageFetchError || !imageData) {
    return NextResponse.json(
      { error: "Image not found or unauthorized" },
      { status: 404 }
    );
  }

  // Delete from storage
  const filesToDelete = [];
  if (imageData.original_path) filesToDelete.push(imageData.original_path);
  if (imageData.thumbnail_path) filesToDelete.push(imageData.thumbnail_path);

  if (filesToDelete.length > 0) {
    const { error: storageError } = await supabase.storage
      .from("user-images")
      .remove(filesToDelete);

    if (storageError) {
      console.error("Storage deletion error:", storageError);
      // Continue anyway to delete database records
    }
  }

  // Delete from image_metadata table (cascade should handle this, but explicit is better)
  const { error: metadataError } = await supabase
    .from("image_metadata")
    .delete()
    .eq("image_id", imageId)
    .eq("user_id", user.id);

  if (metadataError) {
    console.error("Metadata deletion error:", metadataError);
  }

  // Delete from images table
  const { error: imageDeleteError } = await supabase
    .from("images")
    .delete()
    .eq("id", imageId)
    .eq("user_id", user.id);

  if (imageDeleteError) {
    return NextResponse.json(
      { error: imageDeleteError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
