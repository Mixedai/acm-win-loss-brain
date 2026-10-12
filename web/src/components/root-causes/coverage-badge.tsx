import type { Database } from "@/types/database";
import { Badge, type BadgeTone } from "@/components/ui/badge";

export type CoverageLevel = Database["public"]["Enums"]["coverage_level"];

const COVERAGE_META: Record<CoverageLevel, { label: string; tone: BadgeTone }> = {
  none: { label: "No coverage", tone: "red" },
  partial: { label: "Partial", tone: "amber" },
  full: { label: "Full", tone: "green" },
};

export function CoverageBadge({ coverage }: { coverage: CoverageLevel | null }) {
  if (!coverage) {
    return <Badge tone="neutral">Unknown</Badge>;
  }
  const { label, tone } = COVERAGE_META[coverage];
  return <Badge tone={tone}>{label}</Badge>;
}
