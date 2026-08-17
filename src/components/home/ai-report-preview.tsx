import Link from "next/link";
import { BarChart3, DollarSign, CalendarRange } from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  {
    icon: BarChart3,
    title: "AI Readiness Score",
    description: "See how ready your business is for AI automation across every department.",
  },
  {
    icon: DollarSign,
    title: "ROI Estimates",
    description: "Get a breakdown of estimated time savings, cost savings, and revenue opportunity.",
  },
  {
    icon: CalendarRange,
    title: "Implementation Roadmap",
    description: "A 30-day, 90-day, and 1-year plan for building your AI workforce.",
  },
];

const scoreRows = [
  { label: "Automation Score", value: 78 },
  { label: "Growth Score", value: 86 },
];

const recommendations = [
  { name: "AI Sales Representative", roi: "420%" },
  { name: "AI Support Agent", roi: "380%" },
  { name: "AI Bookkeeper", roi: "290%" },
];

export function AiReportPreview() {
  return (
    <section id="report" className="border-y border-border bg-secondary/20 py-24">
      <div className="container grid gap-14 lg:grid-cols-2 lg:items-center">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <span className="text-xs font-bold uppercase tracking-wide text-ploy-blue">The AI Report</span>
            <h2 className="text-balance text-3xl font-bold tracking-tighter sm:text-4xl">
              Like hiring McKinsey — for your AI workforce
            </h2>
            <p className="max-w-xl text-balance text-muted-foreground sm:text-lg">
              We analyze your entire operation and tell you exactly which AI employees to hire, in what
              order, and what return to expect. Every recommendation links directly to a marketplace
              listing.
            </p>
          </div>
          <div className="flex flex-col gap-5">
            {benefits.map((b) => (
              <div key={b.title} className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-ploy-blue">
                  <b.icon className="h-4.5 w-4.5" />
                </span>
                <div>
                  <p className="font-semibold">{b.title}</p>
                  <p className="text-sm text-muted-foreground">{b.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <Button asChild size="lg">
              <Link href="/report">Generate My AI Report</Link>
            </Button>
            <span className="text-sm text-muted-foreground">Free on the basic plan</span>
          </div>
        </div>

        <div className="shadow-glow-card mx-auto w-full max-w-md rounded-2xl border border-border bg-card p-7">
          <div className="mb-5 flex items-start justify-between">
            <div>
              <p className="font-bold">Northwind Supply Co.</p>
              <p className="text-xs text-muted-foreground">Logistics · 42 employees</p>
            </div>
            <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-ploy-blue">
              Complete
            </span>
          </div>

          <div className="mb-4 flex items-center gap-4 rounded-xl bg-secondary/40 p-4">
            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
              <svg viewBox="0 0 100 100" className="h-20 w-20 -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" strokeWidth="9" className="stroke-border" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  strokeWidth="9"
                  strokeLinecap="round"
                  strokeDasharray="251"
                  strokeDashoffset="48"
                  className="stroke-ploy-blue"
                />
              </svg>
              <span className="absolute font-mono text-lg font-bold">81</span>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">AI Readiness Score</p>
              <p className="font-mono text-xl font-bold">
                81<span className="text-xs font-normal text-muted-foreground">/100</span>
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">Strong automation candidate</p>
            </div>
          </div>

          <div className="mb-4 flex flex-col gap-2.5">
            {scoreRows.map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-3 text-xs">
                <span className="w-28 shrink-0 text-muted-foreground">{row.label}</span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary/60">
                  <span
                    className="block h-full rounded-full bg-ploy-blue"
                    style={{ width: `${row.value}%` }}
                  />
                </span>
                <span className="w-8 shrink-0 text-right font-mono">{row.value}</span>
              </div>
            ))}
          </div>

          <div className="rounded-xl bg-secondary/40 p-4">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-ploy-blue">
              Top Recommended AI Employees
            </p>
            <div className="flex flex-col gap-1.5">
              {recommendations.map((rec) => (
                <div key={rec.name} className="flex items-center justify-between text-sm">
                  <span className="font-medium">{rec.name}</span>
                  <span className="font-mono text-xs text-ploy-blue">ROI {rec.roi}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
