import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge, ProvenanceBadge } from "@/components/ui/badge";
import type { Report } from "@/lib/reporting/schema";

type ReportViewProps = {
  report: Report;
  battlecardHref: string | null;
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

const VERDICT_TONE: Record<Report["claims_vs_reality"][number]["verdict"], "green" | "red" | "amber" | "neutral"> = {
  supported: "green",
  contradicted: "red",
  mixed: "amber",
  unverified: "neutral",
};

export function ReportView({ report, battlecardHref }: ReportViewProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardContent>
          <h2 className="text-lg font-semibold text-slate-900">{report.headline}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">{report.executive_summary}</p>
          {battlecardHref ? (
            <a
              href={battlecardHref}
              className="mt-4 inline-flex rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700"
            >
              Open updated battlecard
            </a>
          ) : null}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Top loss reasons" description="Ranked by lost ACV, with whose voice backs each one." />
          <CardContent className="space-y-3">
            {report.top_loss_reasons.map((r) => (
              <div key={r.reason} className="rounded-lg border border-slate-100 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-slate-900">{r.reason}</p>
                  <ProvenanceBadge provenance={r.provenance} />
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {r.deal_count} deals · {currency.format(r.lost_acv)}
                </p>
                {r.evidence_quote ? (
                  <p className="mt-2 border-l-2 border-slate-200 pl-3 text-sm italic text-slate-600">
                    “{r.evidence_quote}”
                  </p>
                ) : null}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Competitor claims vs reality" description="What they say, checked against deal evidence." />
          <CardContent className="space-y-3">
            {report.claims_vs_reality.length === 0 ? (
              <p className="text-sm text-slate-500">No competitor claims in the context.</p>
            ) : (
              report.claims_vs_reality.map((c) => (
                <div key={c.claim} className="rounded-lg border border-slate-100 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium text-slate-900">{c.claim}</p>
                    <Badge tone={VERDICT_TONE[c.verdict]}>{c.verdict}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{c.evidence}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader title="Seller view vs customer view" />
        <CardContent>
          <p className="text-sm leading-6 text-slate-700">{report.seller_vs_customer_gap}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Root causes and addressability" />
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="pb-2 pr-4">Root cause</th>
                <th className="pb-2 pr-4">Deals</th>
                <th className="pb-2 pr-4">Lost ACV</th>
                <th className="pb-2 pr-4">Addressability</th>
                <th className="pb-2">Recommendation</th>
              </tr>
            </thead>
            <tbody>
              {report.root_causes.map((rc) => (
                <tr key={rc.name} className="border-t border-slate-100 align-top">
                  <td className="py-2 pr-4 font-medium text-slate-900">{rc.name}</td>
                  <td className="py-2 pr-4 text-slate-700">{rc.deal_count}</td>
                  <td className="py-2 pr-4 text-slate-700">{currency.format(rc.lost_acv)}</td>
                  <td className="py-2 pr-4 text-slate-600">{rc.addressability}</td>
                  <td className="py-2">
                    <Badge tone="neutral">{rc.recommendation.replace("_", " ")}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Investment case" />
          <CardContent>
            <p className="text-sm leading-6 text-slate-700">{report.investment_case}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader title="Plan of action" />
          <CardContent>
            <ol className="space-y-2">
              {report.plan.map((step, i) => (
                <li key={`${i}-${step.action}`} className="flex gap-3 text-sm">
                  <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-slate-900 text-center text-xs font-semibold leading-5 text-white">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-medium text-slate-900">{step.action}</p>
                    <p className="text-xs text-slate-500">
                      {step.owner} · {step.timeframe}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
