import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ProvenanceBadge, type Provenance } from "@/components/ui/badge";
import { VerdictBadge } from "./outcome-badge";
import type { ReconciliationVerdict } from "./format";

export type ReconciliationRow = {
  crm_stated_reason: string | null;
  crm_loss_reason_raw: string | null;
  seller_reason: string | null;
  seller_quote: string | null;
  customer_reason: string | null;
  customer_quote: string | null;
  verdict: ReconciliationVerdict | null;
  final_reason: string | null;
  rationale: string | null;
};

type PerspectiveColumnProps = {
  title: string;
  provenance: Provenance;
  reason: string | null;
  quote: string | null;
  fallback: string | null;
};

function PerspectiveColumn({ title, provenance, reason, quote, fallback }: PerspectiveColumnProps) {
  const displayReason = reason ?? fallback;
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-slate-100 bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{title}</p>
        <ProvenanceBadge provenance={provenance} />
      </div>
      <p className="text-sm font-medium text-slate-900">{displayReason ?? "No reason recorded"}</p>
      {quote ? (
        <blockquote className="border-l-2 border-slate-300 pl-3 text-sm italic text-slate-600">
          &ldquo;{quote}&rdquo;
        </blockquote>
      ) : (
        <p className="text-xs text-slate-400">No quote captured.</p>
      )}
    </div>
  );
}

type ReconciliationCardProps = {
  reconciliation: ReconciliationRow | null;
};

export function ReconciliationCard({ reconciliation }: ReconciliationCardProps) {
  return (
    <Card>
      <CardHeader
        title="Seller view vs customer view"
        description="How the CRM-stated reason compares with what the customer actually said."
        actions={reconciliation?.verdict ? <VerdictBadge verdict={reconciliation.verdict} /> : null}
      />
      <CardContent>
        {reconciliation === null ? (
          <p className="text-sm text-slate-500">
            No reconciliation yet. Add seller notes and a customer interview for this deal to compare
            both perspectives.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <PerspectiveColumn
                title="Seller said"
                provenance="seller_stated"
                reason={reconciliation.seller_reason}
                quote={reconciliation.seller_quote}
                fallback={reconciliation.crm_stated_reason ?? reconciliation.crm_loss_reason_raw}
              />
              <PerspectiveColumn
                title="Customer said"
                provenance="customer_stated"
                reason={reconciliation.customer_reason}
                quote={reconciliation.customer_quote}
                fallback={null}
              />
            </div>
            <div className="rounded-lg border border-slate-200 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Final reason</p>
              <p className="mt-1 text-sm font-medium text-slate-900">
                {reconciliation.final_reason ?? "Not determined"}
              </p>
              {reconciliation.rationale ? (
                <p className="mt-2 text-sm text-slate-600">{reconciliation.rationale}</p>
              ) : null}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
