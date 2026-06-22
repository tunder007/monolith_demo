import Link from "next/link";

import { getGroups } from "@/lib/docs";

export const metadata = { title: "Documentation — Softeneers Framework" };

export default function DocsIndex() {
  const groups = getGroups();
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-white">Documentation</h1>
      <p className="mt-3 text-neutral-400">
        Everything about Softeneers Framework — generated from the repository&apos;s canonical
        Markdown. New here? Start with{" "}
        <Link href="/docs/getting-started" className="text-indigo-400 hover:underline">
          Getting Started
        </Link>
        .
      </p>
      <div className="mt-10 space-y-10">
        {groups.map(({ group, docs }) => (
          <section key={group}>
            <h2 className="text-sm font-semibold tracking-wider text-neutral-500 uppercase">
              {group}
            </h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {docs.map((d) => (
                <Link
                  key={d.slug}
                  href={`/docs/${d.slug}`}
                  className="rounded-lg border border-neutral-800 bg-neutral-900/40 px-4 py-3 text-neutral-200 transition hover:border-neutral-700 hover:text-white"
                >
                  {d.title}
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
