import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import type { Provenance } from "@/components/ui/badge";
import { BattlecardCard } from "@/components/battlecards/battlecard-card";
import type { ProvenanceCounts } from "@/components/battlecards/provenance-mix-bar";

export const dynamic = "force-dynamic";

export default async function BattlecardsPage() {
  const supabase = await createClient();

  const [battlecardsResult, mixResult] = await Promise.all([
    supabase
      .from("battlecards")
      .select("id, title, version, status, competitor_id, published_at, updated_at")
      .order("updated_at", { ascending: false }),
    supabase
      .from("v_battlecard_provenance_mix")
      .select("battlecard_id, provenance, statement_count"),
  ]);

  if (battlecardsResult.error) {
    throw new Error(`Failed to load battlecards: ${battlecardsResult.error.message}`);
  }
  if (mixResult.error) {
    throw new Error(`Failed to load battlecard provenance mix: ${mixResult.error.message}`);
  }

  const battlecards = battlecardsResult.data;

  const competitorIds = Array.from(new Set(battlecards.map((card) => card.competitor_id)));
  const competitorNames = new Map<string, string>();
  if (competitorIds.length > 0) {
    const competitorsResult = await supabase
      .from("competitors")
      .select("id, name")
      .in("id", competitorIds);
    if (competitorsResult.error) {
      throw new Error(`Failed to load competitors: ${competitorsResult.error.message}`);
    }
    for (const competitor of competitorsResult.data) {
      competitorNames.set(competitor.id, competitor.name);
    }
  }

  const mixByBattlecard = new Map<string, ProvenanceCounts>();
  for (const row of mixResult.data) {
    if (!row.battlecard_id || !row.provenance) continue;
    const counts = mixByBattlecard.get(row.battlecard_id) ?? {};
    const provenance: Provenance = row.provenance;
    counts[provenance] = (counts[provenance] ?? 0) + (row.statement_count ?? 0);
    mixByBattlecard.set(row.battlecard_id, counts);
  }

  return (
    <div>
      <PageHeader
        title="Battlecards"
        description="Agent-generated battlecards. Every statement carries a provenance label."
      />

      {battlecards.length === 0 ? (
        <Card className="px-6 py-12 text-center">
          <p className="text-sm font-medium text-slate-900">No battlecards yet.</p>
          <p className="mt-1 text-sm text-slate-500">
            Run an analysis to generate the first one.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {battlecards.map((card) => (
            <BattlecardCard
              key={card.id}
              id={card.id}
              title={card.title}
              competitorName={competitorNames.get(card.competitor_id) ?? "Unknown competitor"}
              version={card.version}
              status={card.status}
              publishedAt={card.published_at}
              provenanceCounts={mixByBattlecard.get(card.id) ?? {}}
            />
          ))}
        </div>
      )}
    </div>
  );
}
