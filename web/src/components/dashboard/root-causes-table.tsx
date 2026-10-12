import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCount, formatCurrency } from "@/components/dashboard/format";
import type { RootCauseSummary } from "@/components/dashboard/queries";

type RootCausesTableProps = {
  rootCauses: RootCauseSummary[];
};

export function RootCausesTable({ rootCauses }: RootCausesTableProps) {
  return (
    <Card>
      <CardHeader
        title="Top root causes"
        description="Root causes ranked by the ACV of the lost deals they explain."
      />
      <CardContent>
        <Table>
          <TableHeader>
            <tr>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Root cause</TableHead>
              <TableHead className="text-right">Deals</TableHead>
              <TableHead className="text-right">Lost ACV</TableHead>
            </tr>
          </TableHeader>
          <TableBody>
            {rootCauses.length === 0 ? (
              <TableEmpty colSpan={4}>
                No root causes yet. Lost deals need to be analyzed before they show up here.
              </TableEmpty>
            ) : (
              rootCauses.map((rootCause, index) => (
                <TableRow key={rootCause.rootCauseName}>
                  <TableCell className="text-slate-400">{index + 1}</TableCell>
                  <TableCell className="font-medium text-slate-900">
                    {rootCause.rootCauseName}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatCount(rootCause.dealCount)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatCurrency(rootCause.lostAcv)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
