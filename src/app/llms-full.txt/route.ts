import { buildGeoArtifacts, textHeaders } from "@/lib/geo-artifacts";

export const dynamic = "force-static";
export const revalidate = 3600;

export async function GET() {
  const { llmsFull } = await buildGeoArtifacts();
  return new Response(llmsFull, { headers: textHeaders("text/plain; charset=utf-8") });
}
