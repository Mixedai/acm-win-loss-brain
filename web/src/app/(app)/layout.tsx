import type { ReactNode } from "react";
import { SidebarNav } from "@/components/shell/sidebar-nav";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-slate-200 bg-white px-4 py-6 md:flex">
        <div className="mb-8 px-3">
          <p className="text-sm font-semibold tracking-tight text-slate-900">ACM Brain</p>
          <p className="text-xs text-slate-500">Win/Loss Intelligence</p>
        </div>
        <SidebarNav />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-6">
          <div className="md:hidden">
            <p className="text-sm font-semibold text-slate-900">ACM Brain</p>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <span className="text-sm text-slate-600">Internal workspace</span>
          </div>
        </header>

        <main className="flex-1 px-6 py-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
