import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OutcomeBadge } from "./outcome-badge";
import { SEGMENT_LABEL, formatCurrency, formatDate, type DealOutcome, type DealSegment } from "./format";

export type DealListRow = {
  id: string;
  name: string;
  account_name: string | null;
  segment: DealSegment | null;
  acv: number | null;
  currency: string;
  outcome: DealOutcome;
  close_date: string | null;
  fiscal_quarter: string | null;
  crm_loss_reason_raw: string | null;
  winning_competitor_id: string | null;
  winning_competitor: { name: string } | null;
  crm_loss_reason: { name: string } | null;
};

type DealsTableProps = {
  deals: DealListRow[];
  emptyMessage: string;
};

const COLUMN_COUNT = 9;

export function DealsTable({ deals, emptyMessage }: DealsTableProps) {
  return (
    <Table>
      <TableHeader>
        <tr>
          <TableHead>Deal</TableHead>
          <TableHead>Account</TableHead>
          <TableHead>Segment</TableHead>
          <TableHead className="text-right">ACV</TableHead>
          <TableHead>Outcome</TableHead>
          <TableHead>Close date</TableHead>
          <TableHead>Quarter</TableHead>
          <TableHead>Winning competitor</TableHead>
          <TableHead>CRM loss reason</TableHead>
        </tr>
      </TableHeader>
      <TableBody>
        {deals.length === 0 ? (
          <TableEmpty colSpan={COLUMN_COUNT}>{emptyMessage}</TableEmpty>
        ) : (
          deals.map((deal) => (
            <TableRow key={deal.id}>
              <TableCell>
                <Link
                  href={`/deals/${deal.id}`}
                  className="font-medium text-slate-900 underline-offset-2 hover:underline"
                >
                  {deal.name}
                </Link>
              </TableCell>
              <TableCell>{deal.account_name ?? "—"}</TableCell>
              <TableCell>{deal.segment ? SEGMENT_LABEL[deal.segment] : "—"}</TableCell>
              <TableCell className="text-right tabular-nums">
                {formatCurrency(deal.acv, deal.currency)}
              </TableCell>
              <TableCell>
                <OutcomeBadge outcome={deal.outcome} />
              </TableCell>
              <TableCell className="whitespace-nowrap">{formatDate(deal.close_date)}</TableCell>
              <TableCell className="whitespace-nowrap">{deal.fiscal_quarter ?? "—"}</TableCell>
              <TableCell>{deal.winning_competitor?.name ?? "—"}</TableCell>
              <TableCell>
                {deal.crm_loss_reason?.name ?? deal.crm_loss_reason_raw ?? "—"}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
