export interface Faq {
  question: string;
  answer: string;
}

export const homeFaqs: Faq[] = [
  {
    question: "What exactly is an AI Employee?",
    answer:
      "An AI Employee is a production-ready AI agent built by a vetted agency to perform a specific job function — like an SDR, support agent, or bookkeeper. It's pre-trained on best practices for that role and gets customized to your workflows and software during onboarding.",
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
      "Every listing shows detailed features, reviews, and pricing so you can evaluate fit before reaching out. If it's not right, keep comparing — there's no obligation until you sign up directly with an agency.",
  },
  {
    question: "How does Ploy vet agencies?",
    answer:
      "Agencies go through an application and review process before their listings go live, including verification of their track record, sample deployments, and support capabilities. Verified badges highlight agencies that have completed enhanced vetting.",
  },
];
