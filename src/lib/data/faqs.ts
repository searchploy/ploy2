export interface Faq {
  question: string;
  answer: string;
}

export const homeFaqs: Faq[] = [
  {
    question: "What exactly is an AI Employee?",
    answer:
      "An AI Employee is an AI agent built by an independent agency to perform a specific job function — like an SDR, support agent, or bookkeeper. It's built for that role and gets customized to your workflows and software during onboarding by the agency that provides it.",
  },
  {
    question: "Who builds and supports the AI Employees?",
    answer:
      "AI agencies build, train, and support every AI employee listed on Ploy. Ploy only handles discovery and comparison — once you've found the right fit, you go directly to the agency's own website to sign up. They handle pricing, billing, implementation, and ongoing support from there.",
  },
  {
    question: "How long does deployment take?",
    answer:
      "Most AI employees are live within 3-10 business days of signing up, depending on the complexity of your integrations. Each listing shows typical setup time and required software access — deployment happens on the agency's side.",
  },
  {
    question: "How does pricing work?",
    answer:
      "Each AI employee has transparent tiered pricing set by the agency, typically billed monthly. You can see starting price on every listing before you click through to their site.",
  },
  {
    question: "What if the AI employee doesn't fit our workflow?",
    answer:
      "Every listing shows features, reviews, and pricing so you can evaluate fit before reaching out. If it's not right, keep comparing — there's no obligation until you sign up directly with an agency. Because the agreement is between you and that agency, their terms and refund policy are the ones that apply.",
  },
  {
    question: "Does Ploy check the listings on the marketplace?",
    answer:
      "Every listing is reviewed by our team before it appears on the marketplace, and any edit to a live listing goes back through review. That review is for inclusion on Ploy — it isn't a certification, and it doesn't verify that a provider's product performs as described or audit their security. Providers are responsible for the accuracy of their own listings, and you should evaluate any provider independently before buying. If something looks wrong, use 'Report this listing' on the listing page.",
  },
];
