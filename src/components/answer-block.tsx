import { cn } from "@/lib/utils";

/**
 * The page's short factual answer (40–60 words, plain prose). It must contain
 * nothing but the paragraph — OmniRank counts every word inside `.answer-block`
 * and rejects list markup — and it must be in the initial server HTML.
 * `data-speakable` + `.answer-block` are what the page's `speakable` JSON-LD points at.
 */
export function AnswerBlock({ text, className }: { text: string; className?: string }) {
  return (
    <div
      className={cn(
        "answer-block relative max-w-3xl rounded-2xl border border-border/70 bg-card/85 py-4 pl-6 pr-5 text-base leading-relaxed text-foreground/85 sm:text-[1.0625rem]",
        "before:absolute before:inset-y-3 before:left-2.5 before:w-1 before:rounded-full before:bg-gradient-to-b before:from-primary before:to-accent",
        className,
      )}
      data-speakable
    >
      <p>{text}</p>
    </div>
  );
}
