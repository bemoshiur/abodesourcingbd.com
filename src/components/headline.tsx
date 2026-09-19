import { Fragment } from "react";

/** The brand name and the two country names are the three words that get styled. */
const HIGHLIGHTS = /\b(ABD Sourcing Bangladesh|ABD Sourcing|Bangladesh|India)\b/g;

/**
 * The Home H1 with its key words styled: the company name in the brand green and in capitals
 * (CSS only), Bangladesh with an animated colour sweep, India in the brand gradient. The text stays
 * one continuous heading for crawlers and screen readers, and the styling follows whatever wording
 * the CMS holds — so the owner can rewrite the headline in /admin without touching code.
 */
export function Headline({ text }: { text: string }) {
  const parts = text.split(HIGHLIGHTS); // odd indexes are the matched words
  return (
    <>
      {parts.map((part, i) => {
        if (i % 2 === 0) return <Fragment key={i}>{part}</Fragment>;
        if (part.startsWith("ABD Sourcing"))
          return (
            <span key={i} className="word-brand">
              {part}
            </span>
          );
        if (part === "Bangladesh")
          return (
            <span key={i} className="word-bd">
              {part}
            </span>
          );
        return (
          <span key={i} className="text-gradient">
            {part}
          </span>
        );
      })}
    </>
  );
}
