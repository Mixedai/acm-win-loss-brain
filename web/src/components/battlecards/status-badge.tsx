import type { Database } from "@/types/database";
import { Badge, type BadgeTone } from "@/components/ui/badge";

export type BattlecardStatus = Database["public"]["Enums"]["battlecard_status"];

const STATUS_META: Record<BattlecardStatus, { label: string; tone: BadgeTone }> = {
  draft: { label: "Draft", tone: "neutral" },
  in_review: { label: "In review", tone: "amber" },
  published: { label: "Published", tone: "green" },
  archived: { label: "Archived", tone: "slate" },
};

export function BattlecardStatusBadge({ status }: { status: BattlecardStatus }) {
  const { label, tone } = STATUS_META[status];
  return <Badge tone={tone}>{label}</Badge>;
}
