/**
 * Google tag (gtag.js) for this site's Google account. Rendered first inside <head> of every public
 * page (site layout + global 404) — never in the CMS admin. Exactly one tag per page.
 */
export const GOOGLE_TAG_ID = "G-RD6TKZMRKK";

export function GoogleTag() {
  return (
    <>
      {/* Google tag (gtag.js) */}
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TAG_ID}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', '${GOOGLE_TAG_ID}');`,
        }}
      />
    </>
  );
}
