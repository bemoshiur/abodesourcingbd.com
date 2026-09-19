import { buildGeoArtifacts, textHeaders } from "@/lib/geo-artifacts";

export const dynamic = "force-static";
export const revalidate = 3600;

export async function GET() {
  const { factsJson } = await buildGeoArtifacts();
  return new Response(factsJson, { headers: textHeaders("application/json; charset=utf-8") });
}
