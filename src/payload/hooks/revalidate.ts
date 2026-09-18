import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from "payload";

/**
 * Editors expect a saved change to show on the live site immediately, not
 * after the ISR window. Every content type revalidates the whole site tree
 * on save/delete (the site is small, so this is cheap).
 *
 * Outside a Next.js request (seed script, CLI) revalidatePath throws — that
 * is expected and swallowed.
 */
async function revalidateAll(context?: Record<string, unknown>) {
  if (context?.disableRevalidate) return;
  try {
    // Lazy import: the Payload CLI (migrate / generate:types) loads this file in
    // plain Node ESM, where a top-level "next/cache" import does not resolve.
    const { revalidatePath } = await import("next/cache");
    revalidatePath("/", "layout");
  } catch {
    // not running inside Next.js (seed script, CLI) — nothing to revalidate
  }
}

export const afterChangeRevalidate: CollectionAfterChangeHook = async ({ doc, context }) => {
  await revalidateAll(context);
  return doc;
};

export const afterDeleteRevalidate: CollectionAfterDeleteHook = async ({ doc, context }) => {
  await revalidateAll(context);
  return doc;
};

export const globalAfterChangeRevalidate: GlobalAfterChangeHook = async ({ doc, context }) => {
  await revalidateAll(context);
  return doc;
};

export const revalidateHooks = {
  afterChange: [afterChangeRevalidate],
  afterDelete: [afterDeleteRevalidate],
};
