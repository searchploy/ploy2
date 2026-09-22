export interface Faq {
  question: string;
  answer: string;
}

export const homeFaqs: Faq[] = [
  {
    question: "What exactly is an AI tool?",
    answer:
      "On Ploy, an AI tool is any AI-powered product built to take on part of how a business runs — from a single task to an ongoing role. Listings cover AI agents, assistants, automations and AI employees. They are grouped by the problem they solve rather than by which label the provider uses, because that is the comparison that actually helps you choose.",
  },
  {
    question: "What is the difference between an AI tool and an AI employee?",
    answer:
      "An AI employee is one kind of AI tool — one built to run an ongoing job function, like an SDR, support agent or bookkeeper, rather than handle a single task. It is connected to your systems and works continuously. Both appear in the same marketplace, because what matters when comparing is what a product does and what it connects to.",
  },
  {
    question: "Who builds and supports the AI tools?",
    answer:
      "Independent agencies build, train, and support every AI tool listed on Ploy. Ploy only handles discovery and comparison — once you've found the right fit, you go directly to the agency's own website to sign up. They handle pricing, billing, implementation, and ongoing support from there.",
  },
  {
    question: "How long does deployment take?",
    answer:
      "It varies by product and by how complex your integrations are — some tools run within days, others take longer. Each listing shows typical setup time and required software access, and deployment happens on the agency's side.",
  },
  {
    question: "How does pricing work?",
    answer:
      "Each AI tool has pricing set by the agency behind it, typically billed monthly. You can see the starting price on every listing before you click through to their site. Because pricing models differ — flat, per-seat, and usage-based are all common — check what a month looks like at your own volume.",
  },
  {
    question: "What if the AI tool doesn't fit our workflow?",
    answer:
      "Every listing shows features, reviews, and pricing so you can evaluate fit before reaching out. If it's not right, keep comparing — there's no obligation until you sign up directly with an agency. Because the agreement is between you and that agency, their terms and refund policy are the ones that apply.",
  },
  {
    question: "Does Ploy check the listings on the marketplace?",
    answer:
      "Every listing is reviewed by our team before it appears on the marketplace, and any edit to a live listing goes back through review. That review is for inclusion on Ploy — it isn't a certification, and it doesn't verify that a provider's product performs as described or audit their security. Providers are responsible for the accuracy of their own listings, and you should evaluate any provider independently before buying. If something looks wrong, use 'Report this listing' on the listing page.",
  },
];
