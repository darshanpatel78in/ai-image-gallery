interface PaginationProps {
  page: number;
  totalPages: number;
  totalCount?: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, totalCount, onPageChange }: PaginationProps) {
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="flex items-center justify-between gap-2 text-xs text-slate-300">
      {totalCount !== undefined && (
        <span className="text-slate-400">
          Total: <span className="font-medium text-slate-300">{totalCount}</span> {totalCount === 1 ? 'image' : 'images'}
        </span>
      )}
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="rounded border border-slate-700 px-2 py-1 disabled:opacity-40"
          disabled={!canPrev}
          onClick={() => canPrev && onPageChange(page - 1)}
        >
          Previous
        </button>
        <span className="px-2 py-1">Page {page} of {totalPages}</span>
        <button
          type="button"
          className="rounded border border-slate-700 px-2 py-1 disabled:opacity-40"
          disabled={!canNext}
          onClick={() => canNext && onPageChange(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
