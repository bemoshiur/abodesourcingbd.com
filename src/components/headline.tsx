import { Fragment } from "react";

const COUNTRIES = /\b(Bangladesh|India)\b/g;

/**
 * The Home H1 with its two country names styled: Bangladesh gets an animated colour sweep and a
 * drawn underline, India keeps the brand gradient. The text stays one continuous heading for
 * crawlers and screen readers, and the styling follows whatever wording the CMS holds.
 */
export function Headline({ text }: { text: string }) {
  const parts = text.split(COUNTRIES); // odd indexes are the matched country names
  return (
    <>
      {parts.map((part, i) => {
        if (i % 2 === 0) return <Fragment key={i}>{part}</Fragment>;
        if (part === "Bangladesh")
          return (
            <span key={i} className="word-bd-wrap">
              <span className="word-bd">{part}</span>
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
