// Build step: copy the monorepo templates into the CLI package so the published
// artifact is self-contained. Excludes deps/build output so the payload is clean.
import { cpSync, existsSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const pkgRoot = resolve(here, "..");
const monorepoTemplates = resolve(pkgRoot, "..", "..", "templates");
const dest = resolve(pkgRoot, "templates");

const EXCLUDE = new Set([
  "node_modules",
  ".next",
  "out",
  "build",
  "dist",
  ".turbo",
  "package-lock.json",
  "pnpm-lock.yaml",
  "yarn.lock",
]);

if (!existsSync(monorepoTemplates)) {
  console.error(`copy-templates: source not found at ${monorepoTemplates}`);
  process.exit(1);
}

rmSync(dest, { recursive: true, force: true });
cpSync(monorepoTemplates, dest, {
  recursive: true,
  filter: (src) => {
    const name = src.split(/[\\/]/).pop() ?? "";
    if (EXCLUDE.has(name)) return false;
    if (name.endsWith(".log")) return false;
    if (name === ".env" || (name.startsWith(".env.") && name !== ".env.example")) return false;
    return true;
  },
});
console.log(`copy-templates: bundled templates → ${dest}`);
