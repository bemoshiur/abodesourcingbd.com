/**
 * Single source of truth for ABD Sourcing Bangladesh identity + facts.
 * Every figure shown on the site is computed from these arrays (.length),
 * so counts can never drift from reality. Do not invent or "correct" facts.
 */

export const site = {
  name: "ABD Sourcing Bangladesh",
  tagline: "Delivering Apparel. Building Trust.",
  oneLiner:
    "Bangladesh-based garments buying & sourcing office for global fashion brands — knitwear, woven, sportswear, outerwear, and customized apparel.",
  // Keep the "o" — abOdesourcingbd.com is the exact registered domain.
  domain: "abodesourcingbd.com",
  url: "https://www.abodesourcingbd.com",
  address: {
    line1: "4th Floor (Lift-03), House-06, Road-10",
    line2: "Sector-04, Uttara",
    city: "Dhaka-1230",
    country: "Bangladesh",
    // Approx. geo for Uttara Sector-04, Dhaka — used for LocalBusiness JSON-LD.
    geo: { lat: 23.8759, lng: 90.3795 },
  },
  emails: ["info@abodesourcingbd.com"],
  payment:
    "Payment terms: TT or LC. Bank: USD A/C, Commercial Bank of Ceylon PLC, Bangladesh.",
} as const;

export const mission =
  "Reliable, ethical, cost-effective apparel sourcing while maintaining the highest standards of quality and customer satisfaction.";

export const vision =
  "Become a globally trusted garments buying office through professionalism, transparency, innovation, and long-term relationships.";

// 9 differentiators — reused as a band across Home / About / Contact.
export const whyChooseUs = [
  { title: "Professional sourcing support", icon: "Headset" },
  { title: "Strong factory network", icon: "Factory" },
  { title: "Competitive pricing", icon: "BadgeDollarSign" },
  { title: "On-time shipment", icon: "Truck" },
  { title: "Strict quality control", icon: "ShieldCheck" },
  { title: "Quick communication", icon: "MessagesSquare" },
  { title: "Product development support", icon: "Lightbulb" },
  { title: "Flexible MOQs", icon: "Scaling" },
  { title: "Ethical sourcing", icon: "Leaf" },
] as const;

// 6 export markets.
export const exportMarkets = [
  { name: "Sweden", code: "SE" },
  { name: "United Kingdom", code: "GB" },
  { name: "Denmark", code: "DK" },
  { name: "Germany", code: "DE" },
  { name: "Netherlands", code: "NL" },
  { name: "USA", code: "US" },
] as const;

// Certifications held across our partner factories.
export const certifications = [
  { name: "BSCI", full: "Business Social Compliance Initiative" },
  { name: "SEDEX", full: "Supplier Ethical Data Exchange" },
  { name: "WRAP", full: "Worldwide Responsible Accredited Production" },
  { name: "ISO", full: "International Organization for Standardization" },
  { name: "OEKO-TEX", full: "Confidence in Textiles standard" },
  { name: "Recycled OEKO-TEX", full: "Recycled-content OEKO-TEX certification" },
  { name: "Organic OEKO-TEX", full: "Organic-content OEKO-TEX certification" },
  { name: "OEKO-TEX STeP", full: "Sustainable Textile Production" },
  { name: "GOTS", full: "Global Organic Textile Standard" },
  { name: "OCS", full: "Organic Content Standard" },
  { name: "GRS", full: "Global Recycled Standard" },
  { name: "Higg Index", full: "Sustainable Apparel Coalition impact assessment suite" },
  { name: "Friends of ZDHC", full: "Zero Discharge of Hazardous Chemicals programme" },
  { name: "BCI Chain of Custody", full: "Better Cotton Initiative chain of custody" },
] as const;

// 7-step QC process.
export const qcSteps = [
  { step: "Fabric Inspection", detail: "Incoming greige and finished fabric checked for shade, GSM, width, and defects before cutting." },
  { step: "PP Sample Approval", detail: "Pre-production sample signed off against the approved spec, trims, and measurements." },
  { step: "Inline Inspection", detail: "Sewing lines audited during production to catch construction issues early." },
  { step: "Mid-line Inspection", detail: "Mid-run check to confirm the line stays within tolerance as volume scales." },
  { step: "Final Random Inspection", detail: "AQL-based final random inspection on finished, packed goods." },
  { step: "Packing Inspection", detail: "Cartons, polybags, labelling, and assortment verified against the packing list." },
  { step: "Shipment Approval", detail: "Final clearance issued only when every gate has passed." },
] as const;

// End-to-end production flow.
export const productionFlow = [
  "Development",
  "Costing",
  "Order Confirmation",
  "Order Placement",
  "Sample Approval",
  "Bulk Production",
  "Inspection",
  "Packing",
  "Shipment",
] as const;
