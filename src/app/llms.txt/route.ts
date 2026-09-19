import { buildGeoArtifacts, textHeaders } from "@/lib/geo-artifacts";

// Generated from the CMS; revalidated on every CMS save (see payload hooks).
export const dynamic = "force-static";
export const revalidate = 3600;

export async function GET() {
  const { llmsTxt } = await buildGeoArtifacts();
  return new Response(llmsTxt, { headers: textHeaders("text/plain; charset=utf-8") });
}
