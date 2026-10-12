import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge, ProvenanceBadge, type Provenance } from "@/components/ui/badge";
import { CONFIDENCE_META, PERSPECTIVE_LABEL, type ConfidenceLevel, type Perspective } from "./format";

export type ExtractedReasonRow = {
  id: string;
  perspective: Perspective;
  provenance: Provenance;
  verbatim_quote: string;
  summary: string | null;
  confidence: ConfidenceLevel;
  loss_reason: { name: string } | null;
};

type ExtractedReasonsListProps = {
  reasons: ExtractedReasonRow[];
};

export function ExtractedReasonsList({ reasons }: ExtractedReasonsListProps) {
  return (
    <Card>
      <CardHeader
        title="Extracted reasons"
        description="Every reason pulled from sources linked to this deal, with its origin."
      />
      <CardContent>
        {reasons.length === 0 ? (
          <p className="text-sm text-slate-500">
            No reasons extracted yet. Upload seller notes, call recordings or interviews for this deal.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {reasons.map((reason) => {
              const confidence = CONFIDENCE_META[reason.confidence];
              return (
                <li key={reason.id} className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      {PERSPECTIVE_LABEL[reason.perspective]}
                    </span>
                    <ProvenanceBadge provenance={reason.provenance} />
                    <Badge tone={confidence.tone}>{confidence.label}</Badge>
                    {reason.loss_reason ? (
                      <span className="text-xs text-slate-500">· {reason.loss_reason.name}</span>
                    ) : null}
                  </div>
                  <blockquote className="border-l-2 border-slate-300 pl-3 text-sm italic text-slate-700">
                    &ldquo;{reason.verbatim_quote}&rdquo;
                  </blockquote>
                  {reason.summary ? <p className="text-sm text-slate-600">{reason.summary}</p> : null}
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
