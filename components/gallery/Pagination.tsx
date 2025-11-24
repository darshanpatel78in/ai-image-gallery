interface PaginationProps {
  page: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, onPageChange }: PaginationProps) {
  const canPrev = page > 1;

  return (
    <div className="flex items-center justify-end gap-2 text-xs text-slate-300">
      <button
        type="button"
        className="rounded border border-slate-700 px-2 py-1 disabled:opacity-40"
        disabled={!canPrev}
        onClick={() => canPrev && onPageChange(page - 1)}
      >
        Previous
      </button>
      <span className="px-2 py-1">Page {page}</span>
      <button
        type="button"
        className="rounded border border-slate-700 px-2 py-1"
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
}
