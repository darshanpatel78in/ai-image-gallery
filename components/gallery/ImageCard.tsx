interface ImageCardProps {
  image: any;
  onFindSimilar: (imageId: number) => void;
  onOpen: () => void;
  onDelete: (imageId: number) => void;
}

export default function ImageCard({
  image,
  onFindSimilar,
  onOpen,
  onDelete,
}: ImageCardProps) {
  const status = image.ai_processing_status as string | undefined;

  return (
    <div className="overflow-hidden rounded border border-slate-800 bg-slate-900/60">
      <button
        type="button"
        className="block w-full cursor-pointer"
        onClick={onOpen}
      >
        <div className="aspect-video bg-slate-800 relative overflow-hidden">
          {image.thumbnail_url ? (
            <img
              src={image.thumbnail_url}
              alt={image.description || "Image"}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-500 text-sm">
              No preview
            </div>
          )}
        </div>
      </button>
      <div className="flex items-center justify-between gap-2 p-2 text-xs text-slate-300">
        <div className="flex-1 truncate">
          {status === "pending"
            ? "Processing…"
            : status === "error"
            ? "AI processing failed"
            : image?.description ?? ""}
        </div>
        {status && (
          <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-300">
            {status}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between gap-2 px-2 pb-2 text-[11px]">
        <button
          type="button"
          className="rounded border border-slate-700 px-2 py-0.5 text-xs text-red-400 hover:bg-red-950 hover:border-red-700"
          onClick={() => {
            if (confirm('Delete this image?')) {
              onDelete(image.image_id);
            }
          }}
        >
          Delete
        </button>
        <button
          type="button"
          className="rounded border border-slate-700 px-2 py-0.5 text-xs text-slate-200 hover:bg-slate-800"
          onClick={() => onFindSimilar(image.image_id)}
        >
          Find similar
        </button>
      </div>
    </div>
  );
}
