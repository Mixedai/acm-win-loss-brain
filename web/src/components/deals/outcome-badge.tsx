import { Badge } from "@/components/ui/badge";
import { OUTCOME_META, VERDICT_META, type DealOutcome, type ReconciliationVerdict } from "./format";

export function OutcomeBadge({ outcome }: { outcome: DealOutcome }) {
  const { label, tone } = OUTCOME_META[outcome];
  return <Badge tone={tone}>{label}</Badge>;
}

export function VerdictBadge({ verdict }: { verdict: ReconciliationVerdict }) {
  const { label, tone } = VERDICT_META[verdict];
  return <Badge tone={tone}>{label}</Badge>;
}
