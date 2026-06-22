import Link from "next/link";

const REPO = "https://github.com/tunder007/monolith_demo";

const PACKAGES: { name: string; tag: string; desc: string }[] = [
  {
    name: "create-softeneers-app",
    tag: "CLI",
    desc: "Scaffold a full project from a template in one command — npm or pnpm, with prompts or --yes.",
  },
  {
    name: "@softeneers/config",
    tag: "config",
    desc: "Shared TypeScript, ESLint, and Prettier presets so every project lints and types the same.",
  },
  {
    name: "@softeneers/env",
    tag: "env",
    desc: "Fail-fast environment validation with Zod — a typed, frozen env object or a readable error.",
  },
  {
    name: "@softeneers/db",
    tag: "database",
    desc: "A configured Sequelize/MySQL factory plus connection helpers. Pairs with the Docker recipe.",
  },
  {
    name: "@softeneers/auth",
    tag: "auth",
    desc: "Authentication on better-auth — a server instance, session helpers, and Express adapters.",
  },
  {
    name: "@softeneers/email",
    tag: "email",
    desc: "Transactional email with Resend and ready-made React Email templates.",
  },
  {
    name: "@softeneers/storage",
    tag: "storage",
    desc: "S3-compatible object storage for AWS S3, Cloudflare R2, and MinIO.",
  },
];

const STACK = [
  "Next.js",
  "Express",
  "Sequelize",
  "MySQL",
  "better-auth",
  "Resend",
  "S3 / R2",
  "Docker",
  "Turborepo",
  "TypeScript",
];

function Logo() {
  return (
    <span className="font-semibold tracking-tight">
      <span className="text-white">Softeneers</span>
      <span className="text-indigo-400"> Framework</span>
    </span>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Nav */}
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <Logo />
        <nav className="flex items-center gap-6 text-sm text-neutral-400">
          <a href="#packages" className="hover:text-white">
            Packages
          </a>
          <Link href="/docs" className="hover:text-white">
            Docs
          </Link>
          <a
            href={REPO}
            className="rounded-md border border-neutral-700 px-3 py-1.5 text-neutral-200 hover:border-neutral-500 hover:text-white"
          >
            GitHub
          </a>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-[-10rem] mx-auto h-[28rem] max-w-3xl rounded-full bg-indigo-600/20 blur-3xl"
        />
        <div className="mx-auto max-w-3xl px-6 pt-16 pb-12 text-center">
          <span className="inline-block rounded-full border border-neutral-800 bg-neutral-900/60 px-3 py-1 text-xs text-neutral-400">
            modular fullstack project generator
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Ship a fullstack app
            <br />
            in <span className="text-indigo-400">one command</span>.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-400">
            Softeneers Framework scaffolds a Next.js&nbsp;+&nbsp;Express&nbsp;+&nbsp;MySQL monorepo —
            with auth, email, storage, and Docker — from reusable, standardized packages. Works with
            npm or pnpm.
          </p>

          <div className="mx-auto mt-8 flex max-w-xl items-center justify-between gap-4 rounded-lg border border-neutral-800 bg-neutral-900/70 px-4 py-3 font-mono text-sm text-neutral-200">
            <span>
              <span className="text-neutral-500">$ </span>
              npx create-softeneers-app@latest my-app
            </span>
            <span className="shrink-0 text-xs text-neutral-600">npm · pnpm</span>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <a
              href={REPO}
              className="rounded-md bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-400"
            >
              Get started
            </a>
            <Link
              href="/docs"
              className="rounded-md border border-neutral-700 px-5 py-2.5 text-sm font-medium text-neutral-200 hover:border-neutral-500 hover:text-white"
            >
              Read the docs
            </Link>
          </div>
        </div>
      </section>

      {/* Packages */}
      <section id="packages" className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-2xl font-semibold tracking-tight text-white">Batteries included</h2>
        <p className="mt-2 max-w-2xl text-neutral-400">
          The CLI ships a working template; the <code className="text-indigo-300">@softeneers/*</code>{" "}
          packages give you the pieces, standardized.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PACKAGES.map((p) => (
            <div
              key={p.name}
              className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5 transition hover:border-neutral-700"
            >
              <div className="flex items-center justify-between">
                <code className="text-sm font-medium text-white">{p.name}</code>
                <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[11px] text-indigo-300">
                  {p.tag}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-neutral-400">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stack */}
      <section className="mx-auto max-w-5xl px-6 pb-16">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-white">
            Built on tools you already trust
          </h2>
          <p className="mt-2 max-w-2xl text-neutral-400">
            Not a from-scratch framework — a layer for organization, productivity, and
            standardization on top of established technology.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {STACK.map((s) => (
              <li
                key={s}
                className="rounded-md border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-sm text-neutral-300"
              >
                {s}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto max-w-5xl px-6 py-10 text-sm text-neutral-500">
        <div className="flex flex-col items-center justify-between gap-3 border-t border-neutral-900 pt-8 sm:flex-row">
          <Logo />
          <div className="flex gap-6">
            <a href={REPO} className="hover:text-neutral-300">
              GitHub
            </a>
            <Link href="/docs" className="hover:text-neutral-300">
              Docs
            </Link>
            <a href={`${REPO}/blob/main/LICENSE`} className="hover:text-neutral-300">
              MIT License
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
