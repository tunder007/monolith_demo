import { cancel, isCancel, select, text } from "@clack/prompts";

import { DEFAULT_TEMPLATE, TEMPLATES } from "./templates.js";

function bail<T>(value: T | symbol): T {
  if (isCancel(value)) {
    cancel("Cancelled.");
    process.exit(0);
  }
  return value as T;
}

export async function promptProjectName(initial?: string): Promise<string> {
  const value = await text({
    message: "Project name:",
    placeholder: "my-app",
    initialValue: initial,
    validate: (v) => (v.trim().length === 0 ? "Please enter a project name." : undefined),
  });
  return bail(value).trim();
}

export async function promptTemplate(): Promise<string> {
  const value = await select({
    message: "What type of project do you want?",
    initialValue: DEFAULT_TEMPLATE,
    options: TEMPLATES.map((t) => ({
      value: t.slug,
      label: t.label,
      hint: t.available ? t.hint : `${t.hint} — not available yet`,
    })),
  });
  return bail(value);
}
