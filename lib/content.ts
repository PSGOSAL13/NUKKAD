import "server-only";
import { z } from "zod";
import { menuData } from "@/content/menu";
import { menuSchema, siteSchema } from "@/content/schema";
import { siteData } from "@/content/site";

/**
 * Validated content. Parsing happens once at build time; any mistake in
 * /content stops the build with a readable error listing what is wrong.
 */
function load<T extends z.ZodType>(name: string, schema: T, data: unknown): z.infer<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(`Invalid content in content/${name}.ts:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

export const site = load("site", siteSchema, siteData);
export const menu = load("menu", menuSchema, menuData);
