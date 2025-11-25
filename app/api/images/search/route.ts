import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabaseServer";
import { overallSimilarity } from "@/lib/search/similarity";

const PAGE_SIZE = 20;

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const color = url.searchParams.get("color") ?? undefined;
  const similarTo = url.searchParams.get("similarTo");
  const pageParam = url.searchParams.get("page") ?? "1";
  const page = Math.max(
    1,
    Number.isNaN(Number(pageParam)) ? 1 : Number(pageParam)
  );

  const supabase = getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let query = supabase
    .from("image_metadata")
    .select(
      "id,image_id,description,tags,colors,ai_processing_status,images(original_path,thumbnail_path)",
      { count: "exact" }
    )
    .eq("user_id", user.id);

  if (q) {
    // Simple text search over description and tags
    query = query.or(`description.ilike.%${q}%,tags.cs.{${q.toLowerCase()}}`);
  }

  if (color) {
    query = query.contains("colors", [color.toLowerCase()]);
  }

  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, count, error } = await query.range(from, to);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let rows = data ?? [];

  // Similarity re-ranking if requested
  if (similarTo) {
    const baseId = Number(similarTo);
    if (!Number.isNaN(baseId)) {
      const { data: base } = await supabase
        .from("image_metadata")
        .select("tags,colors,image_id,user_id")
        .eq("user_id", user.id)
        .eq("image_id", baseId)
        .maybeSingle();

      if (base && base.tags && base.colors) {
        const scored = rows.map((row) => ({
          row,
          score: overallSimilarity(
            base.tags ?? [],
            (row.tags as string[]) ?? [],
            base.colors ?? [],
            (row.colors as string[]) ?? []
          ),
        }));

        scored.sort((a, b) => b.score - a.score);
        rows = scored.map((s) => s.row);
      }
    }
  }

  const totalPages = count ? Math.max(1, Math.ceil(count / PAGE_SIZE)) : 1;
  const totalCount = count ?? 0;

  // Build public URLs for thumbnails/originals via storage API
  const images = await Promise.all(
    rows.map(async (row: any) => {
      const image = row.images?.[0] ?? row.images; // handle joined shape
      const originalPath = image?.original_path as string | undefined;
      const thumbnailPath = image?.thumbnail_path as string | undefined;

      let original_url: string | null = null;
      let thumbnail_url: string | null = null;

      if (originalPath) {
        const { data: pub } = supabase.storage
          .from("user-images")
          .getPublicUrl(originalPath);
        original_url = pub.publicUrl;
      }

      if (thumbnailPath) {
        const { data: pubThumb } = supabase.storage
          .from("user-images")
          .getPublicUrl(thumbnailPath);
        thumbnail_url = pubThumb.publicUrl;
      }

      return {
        id: row.id,
        image_id: row.image_id,
        description: row.description,
        tags: row.tags ?? [],
        colors: row.colors ?? [],
        ai_processing_status: row.ai_processing_status,
        original_url,
        thumbnail_url: thumbnail_url ?? original_url,
      };
    })
  );

  return NextResponse.json({ images, page, totalPages, totalCount });
}
