import type { Database } from "@/types/database";

export type CompanyRow = Database["public"]["Tables"]["companies"]["Row"];

export type CompanyTrait = Pick<
  Database["public"]["Tables"]["company_traits"]["Row"],
  "id" | "company_id" | "kind" | "title" | "description" | "provenance" | "sort_order"
>;

export type GroupedTraits = {
  strengths: CompanyTrait[];
  weaknesses: CompanyTrait[];
};

export const EMPTY_TRAITS: GroupedTraits = { strengths: [], weaknesses: [] };

// Groups a flat trait list by company id and kind, preserving sort_order.
export function groupTraitsByCompany(traits: CompanyTrait[]): Map<string, GroupedTraits> {
  const grouped = new Map<string, GroupedTraits>();
  for (const trait of traits) {
    const entry = grouped.get(trait.company_id) ?? { strengths: [], weaknesses: [] };
    if (trait.kind === "strength") {
      entry.strengths.push(trait);
    } else {
      entry.weaknesses.push(trait);
    }
    grouped.set(trait.company_id, entry);
  }
  return grouped;
}
