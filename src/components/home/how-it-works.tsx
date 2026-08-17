import { ClipboardList, Brain, ShoppingCart, TrendingUp } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";

const steps = [
  {
    icon: ClipboardList,
    title: "Describe your business",
    description: "Tell us your industry, team size, pain points, and goals. Takes under 5 minutes.",
  },
  {
    icon: Brain,
    title: "Get your AI Report",
    description: "Receive a personalized report showing your AI readiness, biggest bottlenecks, and ROI estimates.",
  },
  {
    icon: ShoppingCart,
    title: "Hire AI employees",
    description: "Every recommendation links directly to a marketplace listing. Compare, demo, and purchase in one place.",
  },
  {
    icon: TrendingUp,
    title: "Grow your business",
    description: "Your AI employees go to work immediately. Track time saved, money saved, and revenue gained.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24">
      <div className="container flex flex-col gap-16">
        <SectionHeading eyebrow="How Ploy works" title="From business problem to hired AI employee" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="group relative flex flex-col gap-4 rounded-2xl border border-border bg-card p-8 transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="absolute right-6 top-6 text-4xl font-bold text-muted-foreground/15">
                0{i + 1}
              </span>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground text-background">
                <step.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
