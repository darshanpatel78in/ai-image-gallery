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

  // Get all images for this user
  const { data: userImages, error: fetchError } = await supabase
    .from("images")
    .select("id, original_path, thumbnail_path")
    .eq("user_id", user.id);

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  if (!userImages || userImages.length === 0) {
    return NextResponse.json({ success: true, deleted: 0 });
  }

  // Collect all file paths
  const filesToDelete: string[] = [];
  userImages.forEach((img) => {
    if (img.original_path) filesToDelete.push(img.original_path);
    if (img.thumbnail_path) filesToDelete.push(img.thumbnail_path);
  });

  // Delete from storage
  if (filesToDelete.length > 0) {
    const { error: storageError } = await supabase.storage
      .from("user-images")
      .remove(filesToDelete);

    if (storageError) {
      console.error("Storage deletion error:", storageError);
      // Continue anyway to delete database records
    }
  }

  // Delete all metadata records for this user
  const { error: metadataError } = await supabase
    .from("image_metadata")
    .delete()
    .eq("user_id", user.id);

  if (metadataError) {
    console.error("Metadata deletion error:", metadataError);
  }

  // Delete all images for this user
  const { error: imageDeleteError } = await supabase
    .from("images")
    .delete()
    .eq("user_id", user.id);

  if (imageDeleteError) {
    return NextResponse.json(
      { error: imageDeleteError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, deleted: userImages.length });
}
