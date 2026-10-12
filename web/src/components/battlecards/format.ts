// Shared formatting helpers for battlecard and root cause views.

const compactCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

const wholeNumber = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

const dateFormat = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export function formatCompactCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return compactCurrency.format(value);
}

export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return wholeNumber.format(value);
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return dateFormat.format(date);
}

export function formatMonths(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return `${wholeNumber.format(value)} mo`;
}
