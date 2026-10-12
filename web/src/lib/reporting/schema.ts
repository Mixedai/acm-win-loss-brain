import { z } from "zod";

// Enum values mirror public.provenance_type, confidence_level and battlecard_section_type.
export const PROVENANCE_VALUES = [
  "crm_outcome",
  "customer_stated",
  "seller_stated",
  "competitor_claim",
  "third_party",
  "internal_hypothesis",
] as const;

export const CONFIDENCE_VALUES = ["low", "medium", "high"] as const;

export const SECTION_VALUES = [
  "overview",
  "competitor_claims",
  "what_deals_show",
  "why_we_win",
  "why_we_lose",
  "root_causes",
  "objection_handling",
  "landmines",
  "pricing_positioning",
  "recommended_plays",
] as const;

const Statement = z.object({
  statement: z.string(),
  provenance: z.enum(PROVENANCE_VALUES),
  confidence: z.enum(CONFIDENCE_VALUES),
  // Ids of deals from the context that back this statement (empty when none).
  evidence_deal_ids: z.array(z.string()),
});

const Section = z.object({
  section_type: z.enum(SECTION_VALUES),
  heading: z.string(),
  body: z.string(),
  statements: z.array(Statement),
});

export const ReportSchema = z.object({
  headline: z.string(),
  executive_summary: z.string(),
  top_loss_reasons: z.array(
    z.object({
      reason: z.string(),
      deal_count: z.number(),
      lost_acv: z.number(),
      provenance: z.enum(PROVENANCE_VALUES),
      evidence_quote: z.string(),
    }),
  ),
  seller_vs_customer_gap: z.string(),
  claims_vs_reality: z.array(
    z.object({
      claim: z.string(),
      verdict: z.enum(["supported", "contradicted", "mixed", "unverified"]),
      evidence: z.string(),
    }),
  ),
  root_causes: z.array(
    z.object({
      name: z.string(),
      deal_count: z.number(),
      lost_acv: z.number(),
      addressability: z.string(),
      recommendation: z.enum(["no_change", "reprioritize", "add", "descope"]),
    }),
  ),
  investment_case: z.string(),
  plan: z.array(
    z.object({
      action: z.string(),
      owner: z.string(),
      timeframe: z.string(),
    }),
  ),
  battlecard: z.object({
    title: z.string(),
    summary: z.string(),
    sections: z.array(Section),
  }),
});

export type Report = z.infer<typeof ReportSchema>;
