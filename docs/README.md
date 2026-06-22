# Softeneers Framework — Documentation

The docs are organized in **three layers**, from "just get it running" to "every
package explained as standalone software." Read as deep as you need.

## The three layers

| Layer | For | Start here |
| ----- | --- | ---------- |
| **0 — Quickstart** | Spin up and run a new project in any combination. Nothing else. | [layer-0-quickstart.md](./layer-0-quickstart.md) |
| **1 — Packages & combinations** | What the `@softeneers/*` packages do and how each template/toggle combination uses them. | [layer-1-packages.md](./layer-1-packages.md) |
| **2 — Reference** | Each package as a separate piece of software: full API, usage, internals. | [layer-2-reference/](./layer-2-reference/README.md) |

Most people start at Layer 0, dip into Layer 1 to understand the building blocks,
and consult Layer 2 when integrating a specific package.

## Supporting docs

These cut across the layers:

- [ARCHITECTURE.md](./ARCHITECTURE.md) — the monorepo layout and the
  package-vs-template distinction.
- [DECISIONS.md](./DECISIONS.md) — authoritative decisions / tiebreakers. **When
  two docs seem to conflict, this file wins.**
- [CLI-SPEC.md](./CLI-SPEC.md) — the full `create-softeneers-app` contract
  (flags, prompts, the toggle/fragment engine).
- [ROADMAP.md](./ROADMAP.md) — sprints and current status.
- [PUBLISHING.md](./PUBLISHING.md) — how the packages get to npm.

Related at the repo root: [`../README.md`](../README.md) (overview),
[`../CONTRIBUTING.md`](../CONTRIBUTING.md) (setup), [`../CLAUDE.md`](../CLAUDE.md)
(agent entry contract).

## Conventions

- **Markdown is the single source of truth** (AI-optimized). There is no second
  copy in the repo — the human-readable view is the deployed landing site, which
  renders these same `.md` files (see [DECISIONS.md](./DECISIONS.md) D-07).
- Status claims live in `ROADMAP.md`; other docs link to it rather than
  duplicating status.
- Every relative link must resolve (checked in CI via the docs-link test).
- [`MANIFEST.json`](./MANIFEST.json) is the machine-readable index of this folder.

The human-readable docs + marketing site is live at
<https://softeneers-landing.vercel.app> (source in `apps/landing`, generated from
this Markdown).
