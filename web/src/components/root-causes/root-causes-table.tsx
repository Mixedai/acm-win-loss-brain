import type { Database } from "@/types/database";
import { Badge, type BadgeTone } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CoverageBadge, type CoverageLevel } from "@/components/root-causes/coverage-badge";
import { formatCompactCurrency, formatMonths, formatNumber } from "@/components/battlecards/format";

type ActionStatus = Database["public"]["Enums"]["action_status"];

export type RootCauseRow = {
  rootCauseId: string;
  name: string;
  dealCount: number;
  lostAcv: number;
  weightedLostAcv: number;
  bestCoverage: CoverageLevel | null;
  onRoadmap: boolean | null;
  earliestTargetQuarter: string | null;
  recommendations: string | null;
  estimatedCost: number | null;
  expectedAnnualUplift: number | null;
  paybackMonths: number | null;
  investmentStatus: ActionStatus | null;
  planCount: number | null;
  activePlanCount: number | null;
};

const INVESTMENT_STATUS_META: Record<ActionStatus, { label: string; tone: BadgeTone }> = {
  proposed: { label: "Proposed", tone: "neutral" },
  approved: { label: "Approved", tone: "blue" },
  in_progress: { label: "In progress", tone: "amber" },
  done: { label: "Done", tone: "green" },
  dropped: { label: "Dropped", tone: "slate" },
};

const COLUMN_COUNT = 9;

export function RootCausesTable({ rows }: { rows: RootCauseRow[] }) {
  return (
    <Table>
      <TableHeader>
        <tr>
          <TableHead>Root cause</TableHead>
          <TableHead className="text-right">Deals</TableHead>
          <TableHead className="text-right">Lost ACV</TableHead>
          <TableHead className="text-right">Weighted ACV</TableHead>
          <TableHead>Coverage</TableHead>
          <TableHead>Roadmap</TableHead>
          <TableHead>Investment</TableHead>
          <TableHead className="text-right">Cost / Uplift</TableHead>
          <TableHead className="text-right">Payback</TableHead>
        </tr>
      </TableHeader>
      <TableBody>
        {rows.length === 0 ? (
          <TableEmpty colSpan={COLUMN_COUNT}>
            <p className="font-medium text-slate-900">No root causes yet.</p>
            <p className="mt-1">
              Root causes are extracted from lost deals during analysis. Import deals and run an
              analysis to populate this view.
            </p>
          </TableEmpty>
        ) : (
          rows.map((row) => (
            <TableRow key={row.rootCauseId}>
              <TableCell>
                <p className="font-medium text-slate-900">{row.name}</p>
                {row.recommendations ? (
                  <p className="mt-1 max-w-md text-xs text-slate-500">{row.recommendations}</p>
                ) : null}
              </TableCell>
              <TableCell className="text-right tabular-nums">{formatNumber(row.dealCount)}</TableCell>
              <TableCell className="text-right tabular-nums">{formatCompactCurrency(row.lostAcv)}</TableCell>
              <TableCell className="text-right font-medium tabular-nums text-slate-900">
                {formatCompactCurrency(row.weightedLostAcv)}
              </TableCell>
              <TableCell>
                <CoverageBadge coverage={row.bestCoverage} />
              </TableCell>
              <TableCell>
                {row.onRoadmap ? (
                  <div>
                    <p className="text-slate-900">On roadmap</p>
                    <p className="text-xs text-slate-500">
                      {row.earliestTargetQuarter ? `Target ${row.earliestTargetQuarter}` : "No target quarter"}
                    </p>
                  </div>
                ) : (
                  <span className="text-slate-400">Not on roadmap</span>
                )}
              </TableCell>
              <TableCell>
                {row.investmentStatus ? (
                  <div className="space-y-1">
                    <Badge tone={INVESTMENT_STATUS_META[row.investmentStatus].tone}>
                      {INVESTMENT_STATUS_META[row.investmentStatus].label}
                    </Badge>
                    <p className="text-xs text-slate-500">
                      {formatNumber(row.activePlanCount ?? 0)} of {formatNumber(row.planCount ?? 0)} plans active
                    </p>
                  </div>
                ) : (
                  <span className="text-slate-400">No case</span>
                )}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {row.estimatedCost === null && row.expectedAnnualUplift === null ? (
                  <span className="text-slate-400">—</span>
                ) : (
                  <span>
                    {formatCompactCurrency(row.estimatedCost)}
                    <span className="text-slate-400"> / </span>
                    {formatCompactCurrency(row.expectedAnnualUplift)}
                  </span>
                )}
              </TableCell>
              <TableCell className="text-right tabular-nums">{formatMonths(row.paybackMonths)}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
