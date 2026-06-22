import Link from "next/link";

import { getGroups } from "@/lib/docs";

import { Sidebar } from "./sidebar";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const groups = getGroups();
  return (
    <div className="mx-auto max-w-6xl px-6">
      <header className="flex items-center justify-between border-b border-neutral-900 py-5">
        <Link href="/docs" className="font-semibold tracking-tight">
          <span className="text-white">Softeneers</span>
          <span className="text-indigo-400"> Docs</span>
        </Link>
        <a
          href="https://github.com/tunder007/monolith_demo"
          className="text-sm text-neutral-400 hover:text-white"
        >
          GitHub
        </a>
      </header>
      <div className="flex gap-10 py-10">
        <aside className="hidden w-56 shrink-0 md:block">
          <div className="sticky top-10">
            <Sidebar groups={groups} />
          </div>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
