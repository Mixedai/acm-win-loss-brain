import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { buildReportContext } from "@/lib/reporting/context";
import { generateReport } from "@/lib/reporting/agent";
import { persistReport } from "@/lib/reporting/persist";

// Report generation can take a few minutes on a large quarter.
export const maxDuration = 300;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const QUARTER = /^\d{4}-Q[1-4]$/;

function readString(body: unknown, key: string): string {
  if (typeof body !== "object" || body === null) throw new Error("Request body must be a JSON object.");
  const value = (body as Record<string, unknown>)[key];
  if (typeof value !== "string" || value.length === 0) throw new Error(`Missing field "${key}".`);
  return value;
}

export async function POST(request: Request) {
  const startedAt = new Date().toISOString();
  try {
    const body: unknown = await request.json();
    const clientId = readString(body, "clientId");
    const competitorId = readString(body, "competitorId");
    const fiscalQuarter = readString(body, "fiscalQuarter");
    if (!UUID.test(clientId) || !UUID.test(competitorId)) throw new Error("Ids must be UUIDs.");
    if (!QUARTER.test(fiscalQuarter)) throw new Error('Quarter must look like "2026-Q3".');

    const db = await createClient();
    const context = await buildReportContext(db, { clientId, competitorId, fiscalQuarter });
    const run = await generateReport(context);
    const saved = await persistReport(db, context, run, startedAt);

    return NextResponse.json({ report: run.report, usage: run.usage, model: run.model, saved });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
