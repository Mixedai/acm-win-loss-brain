"use client";

import { useState, useTransition, type FormEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { CATEGORY_OPTIONS, type CompanyCategory } from "@/components/companies/category";

type CompanyFiltersProps = {
  query: string;
  category: CompanyCategory | null;
};

export function CompanyFilters({ query, category }: CompanyFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [q, setQ] = useState(query);
  const [cat, setCat] = useState<string>(category ?? "");

  const hasFilters = query.length > 0 || category !== null;

  function navigate(nextQ: string, nextCat: string) {
    const params = new URLSearchParams();
    const trimmed = nextQ.trim();
    if (trimmed) params.set("q", trimmed);
    if (nextCat) params.set("category", nextCat);
    const search = params.toString();
    startTransition(() => {
      router.push(search ? `${pathname}?${search}` : pathname);
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigate(q, cat);
  }

  function handleCategoryChange(value: string) {
    setCat(value);
    navigate(q, value);
  }

  function handleReset() {
    setQ("");
    setCat("");
    navigate("", "");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-3" role="search">
      <label className="relative flex-1 min-w-[220px]">
        <span className="sr-only">Search companies</span>
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
        <input
          type="search"
          name="q"
          value={q}
          onChange={(event) => setQ(event.target.value)}
          placeholder="Search by name or tagline"
          className="w-full rounded-md border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none"
        />
      </label>
      <label>
        <span className="sr-only">Category</span>
        <select
          name="category"
          value={cat}
          onChange={(event) => handleCategoryChange(event.target.value)}
          className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
        >
          <option value="">All categories</option>
          {CATEGORY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
      >
        Search
      </button>
      {hasFilters ? (
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
          Clear
        </button>
      ) : null}
    </form>
  );
}
