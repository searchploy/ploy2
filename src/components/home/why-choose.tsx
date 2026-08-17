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
    title: "ROI you can defend",
    description: "Every recommendation comes with an estimated savings, hours-saved, and ROI number — not a hunch.",
  },
  {
    icon: Workflow,
    title: "Implementation, not just ideas",
    description: "A 30/90/1-year roadmap tells you what to do this week, not just what's theoretically possible.",
  },
  {
    icon: Users,
    title: "Vetted AI employees, ready to hire",
    description: "Skip the DIY prompt engineering. Every recommendation links to a production-ready AI employee built by a vetted agency.",
  },
  {
    icon: ShieldCheck,
    title: "Built by people who implement AI daily",
    description: "Ploy's recommendations are grounded in a real marketplace of AI employees already deployed across hundreds of businesses.",
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
