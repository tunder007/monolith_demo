"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { DocMeta } from "@/lib/docs";

export function Sidebar({ groups }: { groups: { group: string; docs: DocMeta[] }[] }) {
  const pathname = usePathname();
  return (
    <nav className="text-sm">
      <Link href="/" className="mb-6 block text-neutral-500 hover:text-white">
        ← Home
      </Link>
      {groups.map(({ group, docs }) => (
        <div key={group} className="mb-6">
          <p className="mb-2 text-xs font-semibold tracking-wider text-neutral-500 uppercase">
            {group}
          </p>
          <ul className="space-y-1">
            {docs.map((d) => {
              const href = `/docs/${d.slug}`;
              const active = pathname === href;
              return (
                <li key={d.slug}>
                  <Link
                    href={href}
                    className={
                      active
                        ? "block rounded-md bg-indigo-500/15 px-2 py-1 font-medium text-indigo-300"
                        : "block rounded-md px-2 py-1 text-neutral-400 hover:bg-neutral-900 hover:text-neutral-100"
                    }
                  >
                    {d.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
