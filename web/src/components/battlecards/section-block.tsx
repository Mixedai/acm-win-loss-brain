import type { Database } from "@/types/database";
import { Card } from "@/components/ui/card";
import { Badge, ProvenanceBadge, type Provenance } from "@/components/ui/badge";
import { formatCompactCurrency, formatNumber } from "@/components/battlecards/format";

type Confidence = Database["public"]["Enums"]["confidence_level"];

export type SectionStatement = {
  id: string;
  statement: string;
  provenance: Provenance;
  confidence: Confidence;
  deal_count: number | null;
  acv_total: number | null;
};

export type SectionBlockProps = {
  heading: string;
  body: string | null;
  statements: SectionStatement[];
};

const CONFIDENCE_LABEL: Record<Confidence, string> = {
  low: "Low confidence",
  medium: "Medium confidence",
  high: "High confidence",
};

// Split body text into paragraphs on blank lines; no markdown rendering.
function toParagraphs(body: string | null): string[] {
  if (!body) return [];
  return body
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);
}

export function SectionBlock({ heading, body, statements }: SectionBlockProps) {
  const paragraphs = toParagraphs(body);

  return (
    <Card>
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-900">{heading}</h2>
        {paragraphs.length > 0 ? (
          <div className="mt-2 space-y-2 text-sm leading-relaxed text-slate-600">
            {paragraphs.map((paragraph, index) => (
              <p key={index} className="whitespace-pre-line">
                {paragraph}
              </p>
            ))}
          </div>
        ) : null}
      </div>
      {statements.length === 0 ? (
        <p className="px-5 py-4 text-sm text-slate-500">No statements in this section.</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {statements.map((statement) => (
            <li key={statement.id} className="px-5 py-4">
              <p className="text-sm text-slate-800">{statement.statement}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <ProvenanceBadge provenance={statement.provenance} />
                <Badge tone="neutral">{CONFIDENCE_LABEL[statement.confidence]}</Badge>
                {statement.provenance === "crm_outcome" ? (
                  <span className="text-xs text-slate-500">
                    {formatNumber(statement.deal_count ?? 0)} deals · {formatCompactCurrency(statement.acv_total ?? 0)} ACV
                  </span>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
