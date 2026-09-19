import type { FaqView, SiteInfo } from "@/lib/payload";

/**
 * Fallback FAQs built only from facts the site already states (services,
 * certifications, QC steps, markets, payment terms). CMS FAQs, when present,
 * replace these. No invented MOQs, prices or lead times.
 */
interface Ctx {
  site: SiteInfo;
  categories: string[];
  services: string[];
  certifications: string[];
  markets: string[];
  qcSteps: number;
  factoryCount: number;
}

const list = (xs: string[]) =>
  xs.length <= 1 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`;

export function homeFaqs(c: Ctx): FaqView[] {
  return [
    {
      question: "What does ABD Sourcing Bangladesh do?",
      answer: `${c.site.name} is a garments buying and sourcing office in Uttara, Dhaka. The team develops, sources, monitors and ships apparel for brands in ${list(c.markets.slice(0, 3))} and beyond, working through a vetted network of ${c.factoryCount} compliant partner factories.`,
    },
    {
      question: "Which garment categories can you source from Bangladesh?",
      answer: `We source ${list(c.categories.map((x) => x.toLowerCase()))}. Each style on the site lists its style reference, fibre composition and fabric weight.`,
    },
    {
      question: "Which certifications do your partner factories hold?",
      answer: `Across our partner factories the certifications include ${list(c.certifications)}. Certifications are held by the factories, and every order also passes our ${c.qcSteps}-step quality control process.`,
    },
    {
      question: "Which countries do you ship to?",
      answer: `We ship to buyers in ${list(c.markets)}. The team coordinates documentation and freight with established forwarders so orders arrive cleanly.`,
    },
    {
      question: "How do I request a quotation?",
      answer:
        "Send a tech pack or reference garment with your target quantity and market through the contact form, or add styles to your inquiry list and send them together. The team replies within 24 hours with a clear next step.",
    },
    {
      question: "What payment terms do you work with?",
      answer:
        "Orders are settled by telegraphic transfer (TT) or letter of credit (LC). Full payment details are shared with the quotation.",
    },
  ];
}

export function complianceFaqs(c: Ctx): FaqView[] {
  return [
    {
      question: "Which social and environmental standards do your factories meet?",
      answer: `Our partner factories hold ${list(c.certifications)}. These cover social compliance, ethical trade data, responsible production, quality management, chemical safety and recycled or organic content.`,
    },
    {
      question: "Does ABD Sourcing Bangladesh hold these certifications itself?",
      answer:
        "The certifications are held across our partner factories, not by the buying office itself. We only place orders with factories that maintain international social and technical standards, and we verify quality at every stage.",
    },
    {
      question: "What is your quality control process?",
      answer: `Every order passes a ${c.qcSteps}-step process: fabric inspection, pre-production sample approval, inline inspection, mid-line inspection, final random inspection, packing inspection and shipment approval. Goods ship only after every gate has passed.`,
    },
    {
      question: "Can you source recycled or organic garments?",
      answer:
        "Yes. Our partner factories work with recycled and organic-certified inputs, including GRS, GOTS, OCS and OEKO-TEX programmes, wherever a program allows it. Tell us your requirement in the quotation request.",
    },
  ];
}

export function productsFaqs(c: Ctx): FaqView[] {
  return [
    {
      question: "How do I get a quote for the styles I like?",
      answer:
        "Tap “Add to inquiry” on any style, then send your inquiry list from the contact form. We quote all selected styles together and reply within 24 hours.",
    },
    {
      question: "What does the style reference mean?",
      answer:
        "Each style carries an ABD reference such as ABD-2101. Quote it in your message and the team will know exactly which garment, fabric composition and weight you mean.",
    },
    {
      question: "Can you develop a style from my own tech pack?",
      answer:
        "Yes. Product development is one of our core services. Send a tech pack or a reference garment and the team develops samples with the right partner factory.",
    },
    {
      question: "Which product categories do you cover?",
      answer: `${list(c.categories)} — each with its own range of running styles and fabric options.`,
    },
  ];
}

export function servicesFaqs(c: Ctx): FaqView[] {
  return [
    {
      question: "Which sourcing services do you provide?",
      answer: `${list(c.services)}. Together they cover an order from tech pack to shipment.`,
    },
    {
      question: "Can I use only one service, such as quality assurance?",
      answer:
        "Yes. The services can be combined or used individually depending on where your programme needs support. Describe your situation in the contact form and we will suggest the right scope.",
    },
    {
      question: "How quickly will I hear back after I send a brief?",
      answer:
        "The team replies within 24 hours with a clear next step, whether that is sample development, a quotation or a request for missing specifications.",
    },
  ];
}

export function factoriesFaqs(c: Ctx): FaqView[] {
  return [
    {
      question: "Which countries are your partner factories in?",
      answer:
        "Our partner factories are in Bangladesh and India. The Bangladesh units are our core knit and woven base, close to the Dhaka office, and the Indian units add capacity for programmes that call for an Indian production base. Each style is matched to the right unit by product type.",
    },
    {
      question: "How do you choose partner factories?",
      answer: `We work only with compliant factories that maintain international social and technical standards. Our network of ${c.factoryCount} units is vetted before receiving orders and matched to each style by product type.`,
    },
    {
      question: "Can I visit the partner factories?",
      answer:
        "Factory visits can be arranged through our Dhaka office. Ask the team when you send your inquiry and we will coordinate timing with the unit.",
    },
    {
      question: "Which product types do the factories run?",
      answer: `Between them the partner factories run ${list(c.categories.map((x) => x.toLowerCase()))}, including knit sportswear, activewear, polos, tees, jackets and woven garments.`,
    },
  ];
}

interface CategoryFaqInput {
  title: string;
  subItems: string[];
  productNames: string[];
  compositions: string[];
}

export function categoryFaqs(c: CategoryFaqInput): FaqView[] {
  const sample = c.productNames.slice(0, 4).join(", ");
  const fabrics = [...new Set(c.compositions.filter(Boolean))].slice(0, 4).join("; ");
  return [
    {
      question: `Which ${c.title.toLowerCase()} styles do you source?`,
      answer: `Running ${c.title.toLowerCase()} styles${sample ? ` include ${sample}` : ""}. The category covers ${c.subItems.join(", ").toLowerCase()}.`,
    },
    ...(fabrics
      ? [
          {
            question: `What fabrics are used for ${c.title.toLowerCase()}?`,
            answer: `Listed compositions include ${fabrics}. Each style page shows its exact fibre content, fabric weight and construction.`,
          },
        ]
      : []),
    {
      question: `Can you make a ${c.title.toLowerCase()} style that is not listed?`,
      answer:
        "Yes. Product development is a core service: send a tech pack or a reference garment and the team develops samples with the right partner factory.",
    },
    {
      question: `How do I request a quote for ${c.title.toLowerCase()}?`,
      answer:
        "Add styles to your inquiry list and send them together from the contact form, or quote the style references directly. The team replies within 24 hours.",
    },
  ];
}

interface ProductFaqInput {
  name: string;
  styleNumber?: string;
  spec: string;
  certifications: string[];
}

export function productFaqs(p: ProductFaqInput): FaqView[] {
  const ref = p.styleNumber ? `style ${p.styleNumber}` : "this style";
  return [
    {
      question: `How do I order ${p.name}?`,
      answer: `Add it to your inquiry list, or quote ${ref} in the contact form with your target quantity and delivery market. The team replies within 24 hours with a quotation and next steps.`,
    },
    ...(p.spec
      ? [
          {
            question: `What is ${ref} made from?`,
            answer: `${p.name} is listed as ${p.spec}. Ask the team if you need a different fibre blend or weight.`,
          },
        ]
      : []),
    {
      question: "Can this style be customised?",
      answer:
        "Yes. Tell us what you would change — fabric, trims, colours, labels or fit — and the team develops a sample with the partner factory that runs this style.",
    },
    {
      question: "Which certifications are available?",
      answer: `Certifications are held across our partner factories, including ${list(p.certifications.slice(0, 6))}. Name the ones you need when you send your inquiry.`,
    },
  ];
}
