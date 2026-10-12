import type { Database } from "@/types/database";

export type CompanyCategory = Database["public"]["Enums"]["company_category"];

// Human-readable labels for the company_category enum. The Record type keeps this
// exhaustive, so adding an enum value without a label fails type-checking.
export const CATEGORY_LABELS: Record<CompanyCategory, string> = {
  llm_platform: "LLM platform",
  ai_agents: "AI agents",
  coding_assistant: "Coding assistant",
  customer_support_ai: "Customer support AI",
  sales_marketing_ai: "Sales & marketing AI",
  content_generation: "Content generation",
  voice_speech: "Voice & speech",
  vision_video: "Vision & video",
  data_analytics_ai: "Data analytics AI",
  search_knowledge: "Search & knowledge",
  ai_infrastructure: "AI infrastructure",
  security_governance: "Security & governance",
  vertical_ai: "Vertical AI",
  win_loss_intelligence: "Win/loss intelligence",
};

export const CATEGORY_OPTIONS = (Object.keys(CATEGORY_LABELS) as CompanyCategory[]).map(
  (value) => ({ value, label: CATEGORY_LABELS[value] }),
);

export function isCompanyCategory(value: string): value is CompanyCategory {
  return Object.prototype.hasOwnProperty.call(CATEGORY_LABELS, value);
}

export function humaniseCategory(category: CompanyCategory): string {
  return CATEGORY_LABELS[category];
}
