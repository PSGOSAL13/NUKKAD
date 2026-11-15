import { PLACEHOLDER_VALUES } from "../content/placeholders";

/**
 * Lists every content value that is still a placeholder: any text containing
 * "PLACEHOLDER", or one of the known dummy values (phone, Instagram URL).
 * Called once per build from next.config.ts.
 */
export function findPlaceholders(files: Record<string, unknown>): string[] {
  const found: string[] = [];
  const walk = (value: unknown, path: string) => {
    if (typeof value === "string") {
      if (value.includes("PLACEHOLDER") || PLACEHOLDER_VALUES.includes(value)) found.push(path);
    } else if (Array.isArray(value)) {
      value.forEach((v, i) => walk(v, `${path}[${i}]`));
    } else if (value && typeof value === "object") {
      for (const [k, v] of Object.entries(value)) walk(v, path ? `${path}.${k}` : k);
    }
  };
  for (const [file, data] of Object.entries(files)) walk(data, `content/${file}.ts → `);
  return found.map((p) => p.replace("→ .", "→ ").replace(/→ $/, ""));
}

export function printPlaceholderReport(files: Record<string, unknown>) {
  // next.config is evaluated more than once per build (worker processes
  // inherit this variable), so print the report only the first time.
  if (process.env.NUKKAD_PLACEHOLDER_REPORT_DONE) return;
  process.env.NUKKAD_PLACEHOLDER_REPORT_DONE = "1";
  const found = findPlaceholders(files);
  if (found.length === 0) return;
  const lines = found.slice(0, 40).map((p) => `   • ${p}`);
  if (found.length > 40) lines.push(`   … and ${found.length - 40} more`);
  console.warn(
    `\n⚠  ${found.length} placeholder value(s) still in content/ — replace before launch:\n${lines.join("\n")}\n`,
  );
}
