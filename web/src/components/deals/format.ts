import type { BadgeTone } from "@/components/ui/badge";
import type { Database } from "@/types/database";

export type DealOutcome = Database["public"]["Enums"]["deal_outcome"];
export type DealSegment = Database["public"]["Enums"]["deal_segment"];
export type ReconciliationVerdict = Database["public"]["Enums"]["reconciliation_verdict"];
export type Perspective = Database["public"]["Enums"]["perspective"];
export type ConfidenceLevel = Database["public"]["Enums"]["confidence_level"];

type Meta = { label: string; tone: BadgeTone };

export const OUTCOME_META: Record<DealOutcome, Meta> = {
  won: { label: "Won", tone: "green" },
  lost: { label: "Lost", tone: "red" },
  no_decision: { label: "No decision", tone: "neutral" },
  open: { label: "Open", tone: "blue" },
};

export const VERDICT_META: Record<ReconciliationVerdict, Meta> = {
  aligned: { label: "Aligned", tone: "green" },
  partially_aligned: { label: "Partially aligned", tone: "amber" },
  conflicting: { label: "Conflicting", tone: "red" },
  insufficient_data: { label: "Insufficient data", tone: "neutral" },
};

export const CONFIDENCE_META: Record<ConfidenceLevel, Meta> = {
  high: { label: "High confidence", tone: "green" },
  medium: { label: "Medium confidence", tone: "amber" },
  low: { label: "Low confidence", tone: "neutral" },
};

export const SEGMENT_LABEL: Record<DealSegment, string> = {
  smb: "SMB",
  mid_market: "Mid-market",
  enterprise: "Enterprise",
};

export const PERSPECTIVE_LABEL: Record<Perspective, string> = {
  seller: "Seller",
  customer: "Customer",
  competitor: "Competitor",
  analyst: "Analyst",
  internal: "Internal",
};

const OUTCOME_VALUES: readonly DealOutcome[] = ["open", "won", "lost", "no_decision"];

export function isDealOutcome(value: string): value is DealOutcome {
  return (OUTCOME_VALUES as readonly string[]).includes(value);
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isUuid(value: string): boolean {
  return UUID_PATTERN.test(value);
}

// Formats an amount in the deal's own currency. Falls back to a plain
// "amount CODE" string when the CRM stored a code Intl does not recognise.
export function formatCurrency(amount: number | null, currency: string): string {
  if (amount === null) return "—";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${amount.toLocaleString("en-US", { maximumFractionDigits: 0 })} ${currency}`;
  }
}

export function formatDate(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export function formatPercent(fraction: number): string {
  return `${Math.round(fraction * 100)}%`;
}
