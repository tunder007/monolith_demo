#!/usr/bin/env node
import { createRequire } from "node:module";
import { basename, resolve } from "node:path";

import { intro, log, note, outro, spinner } from "@clack/prompts";

import { CliError, HELP_TEXT, parseArgs } from "./args.js";
import { promptProjectName, promptTemplate } from "./prompts.js";
import {
  assertTargetUsable,
  copyTemplate,
  gitInit,
  installDeps,
  toPackageName,
  transform,
} from "./scaffold.js";
import { DEFAULT_TEMPLATE, findTemplate, resolveTemplateDir } from "./templates.js";

function version(): string {
  try {
    const require = createRequire(import.meta.url);
    return (require("../package.json") as { version: string }).version;
  } catch {
    return "0.0.0";
  }
}

async function main(): Promise<void> {
  const opts = parseArgs(process.argv.slice(2));

  if (opts.help) {
    console.log(HELP_TEXT);
    return;
  }
  if (opts.version) {
    console.log(version());
    return;
  }

  intro("create-softeneers-app");

  // 1. Project name + target directory. "." (or any path resolving to cwd) scaffolds in place.
  const rawTarget = opts.targetDir ?? (opts.yes ? "my-app" : await promptProjectName());
  const targetDir = resolve(process.cwd(), rawTarget);
  const inCurrentDir = targetDir === process.cwd();
  const projectName = basename(targetDir);

  // 2. Template.
  const slug = opts.template ?? (opts.yes ? DEFAULT_TEMPLATE : await promptTemplate());
  const template = findTemplate(slug);
  if (!template) {
    throw new CliError(`Unknown template "${slug}".`);
  }
  if (!template.available) {
    throw new CliError(`Template "${slug}" is not available yet. Try "next-fullstack".`);
  }
  const templateDir = resolveTemplateDir(slug);
  if (!templateDir) {
    throw new CliError(`Could not locate template files for "${slug}".`);
  }

  // 3. Generate.
  assertTargetUsable(targetDir);
  const pkgName = toPackageName(targetDir);

  const s = spinner();
  s.start(`Creating ${projectName}`);
  copyTemplate(templateDir, targetDir);
  transform(targetDir, projectName, pkgName, opts.packageManager);
  s.stop(`Created ${projectName}`);

  if (opts.git) {
    if (gitInit(targetDir)) log.success("Initialized a git repository.");
    else log.warn("Skipped git init (git not available).");
  }

  if (opts.install) {
    const inst = spinner();
    inst.start(`Installing dependencies with ${opts.packageManager}`);
    if (installDeps(targetDir, opts.packageManager)) {
      inst.stop("Installed dependencies.");
    } else {
      inst.stop("Dependency install failed — run it manually.");
    }
  }

  // 4. Next steps.
  const pm = opts.packageManager;
  const steps = [
    ...(inCurrentDir ? [] : [`cd ${rawTarget}`]),
    ...(opts.install ? [] : [`${pm} install`]),
    "docker compose up -d        # start MySQL",
    `${pm} run db:migrate`,
    `${pm} run db:seed`,
    `${pm} run dev`,
  ].join("\n");
  note(steps, "Next steps");
  outro("Web: http://localhost:3000   API: http://localhost:4000");
}

main().catch((err: unknown) => {
  if (err instanceof CliError) {
    console.error(`\nError: ${err.message}`);
    process.exitCode = 1;
  } else {
    console.error("\nUnexpected error:", err);
    process.exitCode = 2;
  }
});
