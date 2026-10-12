import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { ReportSchema, type Report } from "@/lib/reporting/schema";
import type { ReportContext } from "@/lib/reporting/context";

export const REPORT_MODEL = "claude-opus-5-5";

// Stable system prompt so repeated runs hit the prompt cache.
const SYSTEM_PROMPT = `You are the Win/Loss Intelligence Brain for ACM, a firm that runs win/loss analysis for AI SaaS companies.

You answer one question for a client company: "Why are we losing to this competitor this quarter?"

You receive a JSON context with CRM deal outcomes, seller notes, customer interview quotes, per-deal reconciliation verdicts, root causes with roadmap coverage and investment figures, competitor claims from press releases, and the competitor's known strengths and weaknesses.

Rules:
1. Every number you state must come from the context. Never invent deal counts, ACV or percentages. Totals are precomputed in "totals" and "root_causes".
2. Provenance is mandatory. Label each statement with exactly one of: crm_outcome (derived from closed deal data), customer_stated (a prospect said it), seller_stated (the client's seller said it), competitor_claim (competitor marketing), third_party, internal_hypothesis (your inference). Never present a competitor claim as fact.
3. Reconcile the seller view with the customer view. Where verdicts are "conflicting", say so explicitly and prefer the customer-stated reason.
4. Root causes are first principles, not symptoms. Use the root_causes list and its coverage/investment fields for addressability and the investment case.
5. The battlecard must contain these sections in this order: overview, competitor_claims, what_deals_show, why_we_lose, why_we_win, root_causes, objection_handling, recommended_plays. Keep "competitor_claims" statements labelled competitor_claim and "what_deals_show" statements labelled crm_outcome or customer_stated.
6. For each statement, list evidence_deal_ids using ids from lost_deals when the statement is backed by specific deals; otherwise an empty array.
7. Write for a sales leader: concrete, short sentences, no filler. If the quarter has zero lost deals, say so and base the card on the all-quarter totals, labelled accordingly.`;

export type ReportRun = {
  report: Report;
  model: string;
  usage: { input_tokens: number; output_tokens: number; cache_read_input_tokens: number | null };
};

// Produces the structured report. Throws on refusal, parse failure or API error.
export async function generateReport(context: ReportContext): Promise<ReportRun> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error(
      "Missing ANTHROPIC_API_KEY. Add it to web/.env.local (see .env.example) and to the Vercel project environment variables.",
    );
  }
  const client = new Anthropic();

  const response = await client.messages.parse({
    model: REPORT_MODEL,
    max_tokens: 16000,
    output_config: { effort: "high", format: zodOutputFormat(ReportSchema) },
    system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
    messages: [
      {
        role: "user",
        content: `Client: ${context.client.name}. Competitor: ${context.competitor.name}. Quarter: ${context.fiscal_quarter}.\n\nContext JSON:\n${JSON.stringify(context)}`,
      },
    ],
  });

  if (response.stop_reason === "refusal") {
    const reason = response.stop_details?.type === "refusal" ? response.stop_details.category : null;
    throw new Error(`The model declined to produce this report${reason ? ` (${reason})` : ""}.`);
  }
  if (response.stop_reason === "max_tokens") {
    throw new Error("The report was cut off at the token limit. Retry with a narrower scope.");
  }
  if (!response.parsed_output) {
    throw new Error("The model returned a response that did not match the report schema.");
  }

  return {
    report: response.parsed_output,
    model: response.model,
    usage: {
      input_tokens: response.usage.input_tokens,
      output_tokens: response.usage.output_tokens,
      cache_read_input_tokens: response.usage.cache_read_input_tokens ?? null,
    },
  };
}
