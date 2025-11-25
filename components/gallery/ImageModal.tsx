"use client";

import Button from "@/components/ui/Button";

interface ImageModalProps {
  image: any | null;
  open: boolean;
  onClose: () => void;
  onFindSimilar: (imageId: number) => void;
  onFilterByTag: (tag: string) => void;
  onFilterByColor: (color: string) => void;
  onDelete: (imageId: number) => void;
}

export default function ImageModal({
  image,
  open,
  onClose,
  onFindSimilar,
  onFilterByTag,
  onFilterByColor,
  onDelete,
}: ImageModalProps) {
  if (!open || !image) return null;

  const tags: string[] = image.tags ?? [];
  const colors: string[] = image.colors ?? [];

  const handleRetry = async () => {
    await fetch("/api/ai/retry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageId: image.image_id }),
    });
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-lg border border-slate-700 bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2 text-xs text-slate-300">
          <span className="truncate">
            {image.description ?? "Image details"}
          </span>
          <button
            type="button"
            className="rounded px-2 py-1 text-slate-400 hover:bg-slate-800"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="grid gap-4 p-4 md:grid-cols-[2fr,1fr]">
          <div className="flex items-center justify-center bg-slate-950">
            {/* Use thumbnail or original url */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.original_url ?? image.thumbnail_url}
              alt={image.description ?? "Image"}
              className="max-h-[60vh] w-auto max-w-full rounded"
            />
          </div>
          <div className="flex flex-col gap-3 text-xs text-slate-200">
            <div>
              <div className="mb-1 text-[11px] uppercase tracking-wide text-slate-400">
                Tags
              </div>
              <div className="flex flex-wrap gap-1">
                {tags.length === 0 && (
                  <span className="text-slate-500">No tags yet.</span>
                )}
                {tags.map((tag: string) => (
                  <button
                    key={tag}
                    type="button"
                    className="rounded bg-slate-800 px-2 py-0.5 text-[11px] text-slate-100 hover:bg-slate-700"
                    onClick={() => onFilterByTag(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-1 text-[11px] uppercase tracking-wide text-slate-400">
                Colors
              </div>
              <div className="flex flex-wrap gap-2">
                {colors.length === 0 && (
                  <span className="text-slate-500">No colors yet.</span>
                )}
                {colors.map((color: string) => (
                  <button
                    key={color}
                    type="button"
                    className="flex items-center gap-1 text-[11px] text-slate-100"
                    onClick={() => onFilterByColor(color)}
                  >
                    <span
                      className="h-3 w-3 rounded-full border border-slate-700"
                      style={{ backgroundColor: color }}
                    />
                    {color}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-auto flex flex-wrap gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onFindSimilar(image.image_id)}
              >
                Find similar
              </Button>
              <Button type="button" variant="ghost" onClick={handleRetry}>
                Retry AI
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="text-red-400 hover:bg-red-950 border-red-700"
                onClick={() => {
                  if (confirm('Delete this image permanently?')) {
                    onDelete(image.image_id);
                    onClose();
                  }
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
