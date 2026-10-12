import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import type { Provenance } from "@/components/ui/badge";
import { BattlecardStatusBadge } from "@/components/battlecards/status-badge";
import { SectionBlock, type SectionStatement } from "@/components/battlecards/section-block";
import { EvidenceMixCard } from "@/components/battlecards/evidence-mix-card";
import type { ProvenanceCounts } from "@/components/battlecards/provenance-mix-bar";
import { formatDate } from "@/components/battlecards/format";

export const dynamic = "force-dynamic";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function BattlecardDetailPage({ params }: PageProps) {
  const { id } = await params;
  if (!UUID_PATTERN.test(id)) {
    notFound();
  }

  const supabase = await createClient();

  const battlecardResult = await supabase
    .from("battlecards")
    .select("id, title, version, status, summary, competitor_id, published_at")
    .eq("id", id)
    .maybeSingle();

  if (battlecardResult.error) {
    throw new Error(`Failed to load battlecard: ${battlecardResult.error.message}`);
  }
  const battlecard = battlecardResult.data;
  if (!battlecard) {
    notFound();
  }

  const [competitorResult, sectionsResult] = await Promise.all([
    supabase.from("competitors").select("id, name").eq("id", battlecard.competitor_id).maybeSingle(),
    supabase
      .from("battlecard_sections")
      .select("id, heading, body, section_type, sort_order")
      .eq("battlecard_id", battlecard.id)
      .order("sort_order", { ascending: true }),
  ]);

  if (competitorResult.error) {
    throw new Error(`Failed to load competitor: ${competitorResult.error.message}`);
  }
  if (sectionsResult.error) {
    throw new Error(`Failed to load battlecard sections: ${sectionsResult.error.message}`);
  }

  const sections = sectionsResult.data;
  const sectionIds = sections.map((section) => section.id);

  const statementsBySection = new Map<string, SectionStatement[]>();
  const provenanceCounts: ProvenanceCounts = {};

  if (sectionIds.length > 0) {
    const statementsResult = await supabase
      .from("battlecard_statements")
      .select("id, section_id, statement, provenance, confidence, deal_count, acv_total, sort_order")
      .in("section_id", sectionIds)
      .order("sort_order", { ascending: true });

    if (statementsResult.error) {
      throw new Error(`Failed to load battlecard statements: ${statementsResult.error.message}`);
    }

    for (const row of statementsResult.data) {
      const list = statementsBySection.get(row.section_id) ?? [];
      list.push({
        id: row.id,
        statement: row.statement,
        provenance: row.provenance,
        confidence: row.confidence,
        deal_count: row.deal_count,
        acv_total: row.acv_total,
      });
      statementsBySection.set(row.section_id, list);
      const provenance: Provenance = row.provenance;
      provenanceCounts[provenance] = (provenanceCounts[provenance] ?? 0) + 1;
    }
  }

  const competitorName = competitorResult.data?.name ?? "Unknown competitor";

  return (
    <div>
      <Link
        href="/battlecards"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to battlecards
      </Link>

      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{battlecard.title}</h1>
          <BattlecardStatusBadge status={battlecard.status} />
        </div>
        <p className="mt-1 text-sm text-slate-500">
          vs. {competitorName} · v{battlecard.version}
          {battlecard.published_at ? ` · Published ${formatDate(battlecard.published_at)}` : " · Not published"}
        </p>
        {battlecard.summary ? (
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-700">{battlecard.summary}</p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-4">
          {sections.length === 0 ? (
            <Card className="px-6 py-12 text-center">
              <p className="text-sm font-medium text-slate-900">This battlecard has no sections yet.</p>
              <p className="mt-1 text-sm text-slate-500">
                Sections and statements appear here once the analysis run completes.
              </p>
            </Card>
          ) : (
            sections.map((section) => (
              <SectionBlock
                key={section.id}
                heading={section.heading}
                body={section.body}
                statements={statementsBySection.get(section.id) ?? []}
              />
            ))
          )}
        </div>
        <div>
          <EvidenceMixCard counts={provenanceCounts} />
        </div>
      </div>
    </div>
  );
}
