import { Target, LineChart, Users, ShieldCheck, Workflow, Rocket } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";

const reasons = [
  {
    icon: Target,
    title: "A plan, not a blank prompt box",
    description: "ChatGPT gives you generic answers. Ploy analyzes your actual business and tells you exactly what to automate first.",
  },
  {
    icon: LineChart,
    title: "Numbers you can interrogate",
    description: "Every recommendation comes with estimated savings, hours saved and ROI — shown with the assumptions behind them, so you can check the maths.",
  },
  {
    icon: Workflow,
    title: "Implementation, not just ideas",
    description: "A 30/90/1-year roadmap tells you what to do this week, not just what's theoretically possible.",
  },
  {
    icon: Users,
    title: "Real products, ready to hire",
    description: "Skip the DIY prompt engineering. Every recommendation links to a working AI tool from an agency you can go and evaluate yourself.",
  },
  {
    icon: ShieldCheck,
    title: "Every listing is reviewed",
    description: "Listings are reviewed before they reach the marketplace. Review is for inclusion, not a guarantee of a provider's performance or results.",
  },
  {
    icon: Rocket,
    title: "A team, not a solo project",
    description: "Consultants and agencies on Ploy can implement your roadmap for you — you don't have to figure it out alone.",
  },
];

export function WhyChoose() {
  return (
    <section className="py-24">
      <div className="container flex flex-col gap-12">
        <SectionHeading
          eyebrow="Why Ploy"
          title="Why businesses choose Ploy instead of starting with ChatGPT"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason) => (
            <div
              key={reason.title}
              className="group flex flex-col gap-3 rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-foreground text-background">
                <reason.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">{reason.title}</h3>
              <p className="text-sm text-muted-foreground">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
