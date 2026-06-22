import { existsSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export interface TemplateInfo {
  slug: string;
  label: string;
  hint: string;
  /** false → shown in the wizard but not yet generatable. */
  available: boolean;
}

/**
 * The template registry. Only `next-fullstack` is generatable today; the rest
 * are advertised so the wizard reflects the intended menu (docs/CLI-SPEC.md)
 * and light up as they land.
 */
export const TEMPLATES: TemplateInfo[] = [
  {
    slug: "next-fullstack",
    label: "Fullstack (Next.js + Express + Sequelize + MySQL)",
    hint: "web + server monorepo, Docker MySQL",
    available: true,
  },
  { slug: "tanstack-start", label: "TanStack Start", hint: "coming soon", available: false },
  { slug: "hono-api", label: "Hono API only", hint: "coming soon", available: false },
  { slug: "express-api", label: "Express API only", hint: "coming soon", available: false },
  { slug: "minimal", label: "Minimal", hint: "coming soon", available: false },
];

export const DEFAULT_TEMPLATE = "next-fullstack";

export function findTemplate(slug: string): TemplateInfo | undefined {
  return TEMPLATES.find((t) => t.slug === slug);
}

/**
 * Resolve the on-disk directory for a template, in priority order:
 *   1. bundled with the package  (<pkg>/templates/<slug>)  — published layout
 *   2. the monorepo templates dir (<pkg>/../../templates/<slug>) — local dev
 * Returns the first that exists, or undefined.
 */
export function resolveTemplateDir(slug: string): string | undefined {
  const here = dirname(fileURLToPath(import.meta.url)); // src/ (tsx) or dist/ (built)
  const pkgRoot = resolve(here, ".."); // apps/cli
  const candidates = [
    resolve(pkgRoot, "templates", slug),
    resolve(pkgRoot, "..", "..", "templates", slug),
  ];
  return candidates.find((dir) => existsSync(dir) && statSync(dir).isDirectory());
}
