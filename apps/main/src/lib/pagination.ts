export const DEFAULT_PAGE_SIZE = 4;

/** Bounds URL input and slices any collection without dropping older entries. */
export function paginate<T>(
  items: readonly T[],
  requestedPage: string | undefined,
  pageSize = DEFAULT_PAGE_SIZE,
) {
  if (!Number.isInteger(pageSize) || pageSize < 1)
    throw new RangeError('Page size must be a positive integer');
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const parsed =
    requestedPage && /^\d+$/.test(requestedPage) ? Number(requestedPage) : 1;
  const page = Number.isSafeInteger(parsed)
    ? Math.min(pageCount, Math.max(1, parsed))
    : 1;
  return {
    page,
    pageCount,
    items: items.slice((page - 1) * pageSize, page * pageSize),
  };
}
