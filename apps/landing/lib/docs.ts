import { readFileSync } from "node:fs";
import { join } from "node:path";

import { marked } from "marked";

const CONTENT = join(process.cwd(), "content");
const GH = "https://github.com/tunder007/monolith_demo/blob/main/";

export interface DocMeta {
  slug: string;
  title: string;
  group: string;
}

export function getManifest(): DocMeta[] {
  return JSON.parse(readFileSync(join(CONTENT, "manifest.json"), "utf8")) as DocMeta[];
}

export function getGroups(): { group: string; docs: DocMeta[] }[] {
  const order = ["Guides", "Reference", "Packages"];
  const manifest = getManifest();
  return order
    .map((group) => ({ group, docs: manifest.filter((d) => d.group === group) }))
    .filter((g) => g.docs.length > 0);
}

/** Rewrite a Markdown link target to the in-site docs route (or GitHub fallback). */
function resolveHref(href: string): string {
  if (/^(https?:|mailto:|#)/.test(href)) return href;
  const [pathPart, frag] = href.split("#");
  const hash = frag ? `#${frag}` : "";
  const path = pathPart.split("?")[0];

  const pkg = path.match(/(?:^|\/)(config|env|db|auth|email|storage)\/README\.md$/);
  if (pkg) return `/docs/pkg-${pkg[1]}${hash}`;

  const base = path.split("/").pop() ?? "";
  const map: Record<string, string> = {
    "ARCHITECTURE.md": "/docs/architecture",
    "ROADMAP.md": "/docs/roadmap",
    "CLI-SPEC.md": "/docs/cli",
    "PACKAGES.md": "/docs/packages",
    "DECISIONS.md": "/docs/decisions",
    "PUBLISHING.md": "/docs/publishing",
    "CONTRIBUTING.md": "/docs/contributing",
  };
  if (map[base]) return map[base] + hash;
  if (base === "README.md") return (path.includes("docs/") ? "/docs" : "/docs/overview") + hash;

  // Unknown repo file (TODO, LICENSE, benchmark, generated site, …) → GitHub.
  if (path.endsWith(".md") || /LICENSE|BENCHMARK|MANIFEST|TODO/i.test(base)) {
    return GH + path.replace(/^\.\//, "").replace(/^(\.\.\/)+/, "");
  }
  return href;
}

marked.use({
  gfm: true,
  walkTokens(token) {
    if (token.type === "link") token.href = resolveHref(token.href);
  },
});

export function getDoc(slug: string): { meta: DocMeta; html: string } | null {
  const meta = getManifest().find((d) => d.slug === slug);
  if (!meta) return null;
  const md = readFileSync(join(CONTENT, `${slug}.md`), "utf8");
  const html = marked.parse(md, { async: false }) as string;
  return { meta, html };
}
