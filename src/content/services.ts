import type { ProductSlug } from "./products";

export type ServiceSlug =
  | "product-development"
  | "material-trims-sourcing"
  | "merchandising-support"
  | "quality-assurance"
  | "production-monitoring"
  | "logistics-support";

export interface Service {
  /** Explicit, stable slug — read at render time, never derived from the title. */
  slug: ServiceSlug;
  title: string;
  /** lucide-react icon name. */
  icon: string;
  /** One-line card summary. */
  summary: string;
  /** Lead paragraph for the detail page. */
  intro: string;
  /** "What it covers" bullets. */
  covers: string[];
  /** "How ABD does it" bullets. */
  how: string[];
  /** Cross-links to related product categories. */
  relatedCategories: ProductSlug[];
}

export const services: Service[] = [
  {
    slug: "product-development",
    title: "Product Development",
    icon: "Lightbulb",
    summary:
      "From tech pack and reference to a sealed sample your buyers approve — fast, accurate, repeatable.",
    intro:
      "We turn a sketch, reference garment, or tech pack into a production-ready sample. Working hand-in-hand with our partner factories' sample rooms, we manage fit, fabric, and trim development so the first physical sample lands close to your intent.",
    covers: [
      "Tech-pack interpretation and spec sheets",
      "Fabric and trim development with mill options",
      "Fit, proto, and SMS sample rounds",
      "Print, embroidery, and wash development",
      "Counter-sample and sealed-sample management",
    ],
    how: [
      "We brief the factory sample room directly and track every round to closure.",
      "Each sample ships with measurement and fabric notes so feedback is unambiguous.",
      "We flag cost or feasibility risks early, before they reach bulk.",
    ],
    relatedCategories: ["knitwear", "woven-wear", "activewear-performance-wear"],
  },
  {
    slug: "material-trims-sourcing",
    title: "Material & Trims Sourcing",
    icon: "Spool",
    summary:
      "Yarn, fabric, and trims sourced to the right quality, certification, and price point.",
    intro:
      "The right fabric and trims decide both the price and the pass rate. We source greige and finished fabric, yarn, and full trim packages from a vetted base of Bangladeshi and regional mills — including recycled and organic-certified inputs.",
    covers: [
      "Knit and woven fabric sourcing to target GSM and composition",
      "Recycled, organic, and OEKO-TEX / GOTS / GRS certified inputs",
      "Trims: labels, zippers, drawcords, buttons, and packaging",
      "Lab-dip and bulk-dye shade approval",
      "Material cost comparison across suppliers",
    ],
    how: [
      "We match composition and certification to your market's compliance needs.",
      "Shade and hand-feel are approved against a physical standard before bulk.",
      "We hold suppliers to delivery dates that protect the production calendar.",
    ],
    relatedCategories: ["knitwear", "outerwear", "workwear"],
  },
  {
    slug: "merchandising-support",
    title: "Merchandising Support",
    icon: "ClipboardList",
    summary:
      "A single point of contact owning your order from costing to confirmed shipment date.",
    intro:
      "Our merchandising team is your day-to-day partner on the ground. We manage costing, order placement, the critical-path timeline, and the constant communication that keeps a buyer confident an order is on track.",
    covers: [
      "Open-cost and target-cost negotiation",
      "Order placement and PO management",
      "Time-and-action (critical path) planning",
      "Sample tracking and approval follow-up",
      "Daily order-status reporting to the buyer",
    ],
    how: [
      "One merchandiser owns your account end to end — no handoffs, no lost context.",
      "We work to your time zone and reply quickly, in clear English.",
      "Every milestone is tracked against the T&A so slippage surfaces early.",
    ],
    relatedCategories: ["knitwear", "woven-wear", "activewear-performance-wear"],
  },
  {
    slug: "quality-assurance",
    title: "Quality Assurance",
    icon: "ShieldCheck",
    summary:
      "A 7-step QC gate from fabric to shipment approval, with AQL final inspection.",
    intro:
      "Quality is verified at every stage, not just at the end. Our QC team runs a seven-step process from fabric inspection through to shipment approval, so problems are caught while they are still cheap to fix.",
    covers: [
      "Fabric inspection (shade, GSM, width, defects)",
      "PP sample approval against the sealed spec",
      "Inline and mid-line inspections during sewing",
      "AQL-based final random inspection",
      "Packing and pre-shipment approval",
    ],
    how: [
      "We follow the same seven gates on every order — fabric, PP, inline, mid-line, final, packing, shipment.",
      "Inspections are AQL-based and documented with photos for the buyer.",
      "Shipment is released only after every gate passes.",
    ],
    relatedCategories: ["knitwear", "woven-wear", "outerwear", "workwear"],
  },
  {
    slug: "production-monitoring",
    title: "Production Monitoring",
    icon: "Activity",
    summary:
      "Eyes on the line — daily output tracking against the plan so ship dates hold.",
    intro:
      "We monitor bulk production at the factory floor against the agreed plan. From line loading to finishing, we track output, flag bottlenecks, and keep the order moving toward its confirmed shipment date.",
    covers: [
      "Line-loading and capacity confirmation",
      "Daily / weekly output tracking vs. plan",
      "Bottleneck and risk escalation",
      "Finishing and packing progress",
      "On-time-shipment management",
    ],
    how: [
      "We visit the floor and report real output, not just factory promises.",
      "Risks to the ship date are escalated to the buyer with a recovery plan.",
      "We coordinate finishing and packing so nothing stalls at the last step.",
    ],
    relatedCategories: ["activewear-performance-wear", "workwear", "woven-wear"],
  },
  {
    slug: "logistics-support",
    title: "Logistics Support",
    icon: "Truck",
    summary:
      "Documentation, freight coordination, and shipment to your six core markets.",
    intro:
      "Once goods clear final inspection, we coordinate documentation and freight so the order reaches your warehouse cleanly. We work with established forwarders serving our buyers across Europe and North America.",
    covers: [
      "Export documentation and compliance papers",
      "Freight booking coordination (sea / air)",
      "TT and LC payment-term handling",
      "Carton and shipping-mark verification",
      "Shipment tracking to destination",
    ],
    how: [
      "Documentation is prepared to match your import requirements.",
      "We support both TT and LC terms through Commercial Bank of Ceylon PLC.",
      "Shipment status is shared until goods reach your market.",
    ],
    relatedCategories: ["knitwear", "woven-wear", "outerwear"],
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
