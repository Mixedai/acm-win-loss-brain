import type { ReactNode } from "react";
import type { Database } from "@/types/database";

export type BadgeTone = "neutral" | "blue" | "green" | "amber" | "red" | "purple" | "slate";

const TONE_CLASSES: Record<BadgeTone, string> = {
  neutral: "bg-slate-100 text-slate-700 ring-slate-200",
  slate: "bg-slate-800 text-white ring-slate-800",
  blue: "bg-blue-50 text-blue-700 ring-blue-200",
  green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  amber: "bg-amber-50 text-amber-800 ring-amber-200",
  red: "bg-red-50 text-red-700 ring-red-200",
  purple: "bg-violet-50 text-violet-700 ring-violet-200",
};

type BadgeProps = {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
};

export function Badge({ children, tone = "neutral", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${TONE_CLASSES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export type Provenance = Database["public"]["Enums"]["provenance_type"];

type ProvenanceMeta = {
  label: string;
  tone: BadgeTone;
};

// Maps each provenance label to a distinct color so competitor marketing is never
// visually confused with hard deal evidence.
export const PROVENANCE_META: Record<Provenance, ProvenanceMeta> = {
  crm_outcome: { label: "Deal evidence", tone: "slate" },
  customer_stated: { label: "Customer said", tone: "green" },
  seller_stated: { label: "Seller said", tone: "blue" },
  competitor_claim: { label: "Competitor claim", tone: "red" },
  third_party: { label: "Third party", tone: "purple" },
  internal_hypothesis: { label: "Hypothesis", tone: "amber" },
};

type ProvenanceBadgeProps = {
  provenance: Provenance;
  className?: string;
};

export function ProvenanceBadge({ provenance, className }: ProvenanceBadgeProps) {
  const { label, tone } = PROVENANCE_META[provenance];
  return (
    <Badge tone={tone} className={className}>
      {label}
    </Badge>
  );
}
