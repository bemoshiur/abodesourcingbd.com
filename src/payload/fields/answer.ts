import type { Field } from "payload";

/** Same tokenisation OmniRank's audit uses: whitespace-separated words. */
export const wordCount = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;

export const ANSWER_MIN = 40;
export const ANSWER_MAX = 60;

/**
 * The "AnswerBlock": a short, factual, plain-prose answer rendered at the top of
 * every page so search snippets, voice assistants and AI answer engines can lift
 * it verbatim. OmniRank's audit requires 40–60 words and no list markup.
 */
export const answerField: Field = {
  name: "answer",
  type: "textarea",
  label: "Quick answer",
  admin: {
    description:
      "40–60 words of plain prose. Start with a subject–verb–object sentence that names the business once. Only facts already on the site — no superlatives, no invented numbers, no client names.",
  },
  validate: (value: unknown) => {
    if (!value || typeof value !== "string") return true;
    const n = wordCount(value);
    if (n < ANSWER_MIN || n > ANSWER_MAX) return `Must be ${ANSWER_MIN}–${ANSWER_MAX} words (currently ${n}).`;
    if (/^\s*([-*•]|\d+[.)])\s/m.test(value)) return "Write plain prose — no bullet or numbered lists.";
    return true;
  },
};
