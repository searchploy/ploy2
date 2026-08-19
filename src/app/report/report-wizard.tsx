"use client";

import { useEffect, useState, useTransition } from "react";
import { ArrowLeft, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChipSelect } from "@/components/report/chip-select";
import { ProgressSteps } from "@/components/report/progress-steps";
import { generateReportAction } from "@/app/report/actions";
import type { ReportInput } from "@/lib/report/scoring";

const INDUSTRIES = [
  "E-commerce",
  "Real Estate",
  "SaaS / Software",
  "Healthcare",
  "Finance / Accounting",
  "Marketing Agency",
  "Logistics / Supply Chain",
  "Retail",
  "Hospitality",
  "Construction",
  "Legal",
  "Education",
  "Other",
];

const EMPLOYEE_COUNTS = ["Just me (1)", "2–10", "11–50", "51–200", "201–500", "500+"];
const REVENUE_RANGES = ["Under $100K", "$100K – $500K", "$500K – $1M", "$1M – $5M", "$5M – $20M", "$20M+"];

const DEPARTMENTS = [
  "Sales",
  "Customer Support",
  "Marketing",
  "Finance / Accounting",
  "HR / Recruiting",
  "Operations",
  "Product / Engineering",
  "Executive / Admin",
  "Other",
];

const PAIN_POINTS = [
  "Not enough leads",
  "Slow response times",
  "Too much manual data entry",
  "High customer support volume",
  "Slow hiring process",
  "Bookkeeping errors",
  "Inconsistent content output",
  "Missed follow-ups",
  "Overwhelmed with emails",
  "Poor visibility into data",
  "High operational costs",
  "Scaling is expensive",
  "Other",
];

const GOALS = [
  "Increase revenue",
  "Reduce operating costs",
  "Scale without hiring",
  "Improve customer experience",
  "Speed up operations",
  "Free up founder time",
  "Improve data and reporting",
  "Hire faster",
  "Other",
];

const LOADING_MESSAGES = [
  "Reading your business profile…",
  "Identifying bottlenecks…",
  "Calculating ROI estimates…",
  "Matching AI employees…",
  "Building your roadmap…",
  "Finalizing report…",
];

const initialData: ReportInput = {
  business_name: "",
  website: "",
  industry: "",
  description: "",
  employee_count: "",
  revenue_range: "",
  departments: [],
  current_software: [],
  pain_points: [],
  pain_extra: "",
  goals: [],
  goals_extra: "",
};

export function ReportWizard() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<ReportInput>(initialData);
  const [softwareText, setSoftwareText] = useState("");
  const [departmentsOther, setDepartmentsOther] = useState("");
  const [painPointsOther, setPainPointsOther] = useState("");
  const [goalsOther, setGoalsOther] = useState("");
  const [isPending, startTransition] = useTransition();
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);

  useEffect(() => {
    if (!isPending) return;
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % LOADING_MESSAGES.length;
      setLoadingMessage(LOADING_MESSAGES[i]);
    }, 1400);
    return () => clearInterval(interval);
  }, [isPending]);

  function update<K extends keyof ReportInput>(key: K, value: ReportInput[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  function canProceedStep1() {
    return data.business_name.trim() && data.industry && data.description.trim();
  }

  function canProceedStep2() {
    return data.employee_count && data.revenue_range && data.departments.length > 0;
  }

  function canProceedStep3() {
    return data.pain_points.length > 0 || painPointsOther.trim();
  }

  function canProceedStep4() {
    return data.goals.length > 0 || goalsOther.trim();
  }

  function next() {
    if (step === 1 && !canProceedStep1()) return;
    if (step === 2 && !canProceedStep2()) return;
    if (step === 3 && !canProceedStep3()) return;
    if (step === 4 && !canProceedStep4()) return;
    setStep((s) => Math.min(s + 1, 5));
  }

  function back() {
    setStep((s) => Math.max(s - 1, 1));
  }

  function submit() {
    const finalDepartments = [...data.departments];
    const finalPainPoints = [...data.pain_points];
    const finalGoals = [...data.goals];

    if (departmentsOther.trim()) finalDepartments.push(departmentsOther);
    if (painPointsOther.trim()) finalPainPoints.push(painPointsOther);
    if (goalsOther.trim()) finalGoals.push(goalsOther);

    const finalData: ReportInput = {
      ...data,
      departments: finalDepartments,
      pain_points: finalPainPoints,
      goals: finalGoals,
      current_software: softwareText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    startTransition(async () => {
      await generateReportAction(finalData);
    });
  }

  if (isPending) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-6 py-24 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-ploy-gold" />
        <div>
          <h1 className="font-display text-2xl font-bold">Analyzing your business…</h1>
          <p className="mt-2 text-muted-foreground">{loadingMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl py-12">
      <ProgressSteps current={step} />

      {step === 1 && (
        <div className="flex flex-col gap-6">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-wide text-ploy-gold">Step 1 of 5</p>
            <h1 className="font-display text-3xl font-bold">Tell us about your business</h1>
            <p className="mt-2 text-muted-foreground">
              We&apos;ll use this to personalize your AI Report and match you with the right AI employees.
            </p>
          </div>
          <Field label="Business name">
            <Input
              placeholder="e.g. Northwind Supply Co."
              value={data.business_name}
              onChange={(e) => update("business_name", e.target.value)}
              required
            />
          </Field>
          <Field label="Website" hint="optional">
            <Input
              type="url"
              placeholder="https://yourwebsite.com"
              value={data.website}
              onChange={(e) => update("website", e.target.value)}
            />
          </Field>
          <Field label="Industry">
            <Select value={data.industry} onValueChange={(v) => update("industry", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select your industry..." />
              </SelectTrigger>
              <SelectContent>
                {INDUSTRIES.map((i) => (
                  <SelectItem key={i} value={i}>
                    {i}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="What does your business do?" hint="1–2 sentences">
            <Textarea
              placeholder="e.g. We sell wholesale cleaning supplies to commercial clients across the midwest..."
              value={data.description}
              onChange={(e) => update("description", e.target.value)}
              required
            />
          </Field>
          <StepNav step={1} onNext={next} nextDisabled={!canProceedStep1()} />
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-6">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-wide text-ploy-gold">Step 2 of 5</p>
            <h1 className="font-display text-3xl font-bold">Your team and revenue</h1>
            <p className="mt-2 text-muted-foreground">
              This helps us estimate realistic savings and ROI for your specific size of business.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Number of employees">
              <Select value={data.employee_count} onValueChange={(v) => update("employee_count", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {EMPLOYEE_COUNTS.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Annual revenue">
              <Select value={data.revenue_range} onValueChange={(v) => update("revenue_range", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {REVENUE_RANGES.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
          <Field label="Which departments do you have?" hint="select all that apply">
            <ChipSelect options={DEPARTMENTS} selected={data.departments} onChange={(v) => {
              update("departments", v);
            }} />
            {data.departments.includes("Other") && (
              <Input
                placeholder="Please specify other departments..."
                value={departmentsOther}
                onChange={(e) => setDepartmentsOther(e.target.value)}
              />
            )}
          </Field>
          <Field label="What software do you currently use?" hint="optional">
            <Input
              placeholder="e.g. HubSpot, QuickBooks, Slack, Shopify..."
              value={softwareText}
              onChange={(e) => setSoftwareText(e.target.value)}
            />
          </Field>
          <StepNav step={2} onBack={back} onNext={next} nextDisabled={!canProceedStep2()} />
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col gap-6">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-wide text-ploy-gold">Step 3 of 5</p>
            <h1 className="font-display text-3xl font-bold">What&apos;s slowing you down?</h1>
            <p className="mt-2 text-muted-foreground">
              Select every pain point that applies. The more you share, the more specific your report will be.
            </p>
          </div>
          <Field label="Current pain points" hint="select all that apply">
            <ChipSelect options={PAIN_POINTS} selected={data.pain_points} onChange={(v) => {
              update("pain_points", v);
            }} />
            {data.pain_points.includes("Other") && (
              <Input
                placeholder="Please specify other pain points..."
                value={painPointsOther}
                onChange={(e) => setPainPointsOther(e.target.value)}
              />
            )}
          </Field>
          <Field label="Anything else we should know?" hint="optional">
            <Textarea
              placeholder="Describe any specific workflows that feel broken or take too much time..."
              value={data.pain_extra}
              onChange={(e) => update("pain_extra", e.target.value)}
            />
          </Field>
          <StepNav step={3} onBack={back} onNext={next} nextDisabled={!canProceedStep3()} />
        </div>
      )}

      {step === 4 && (
        <div className="flex flex-col gap-6">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-wide text-ploy-gold">Step 4 of 5</p>
            <h1 className="font-display text-3xl font-bold">What are you trying to achieve?</h1>
            <p className="mt-2 text-muted-foreground">Your goals shape the priority of recommendations in your report.</p>
          </div>
          <Field label="Primary goals" hint="select all that apply">
            <ChipSelect options={GOALS} selected={data.goals} onChange={(v) => {
              update("goals", v);
            }} />
            {data.goals.includes("Other") && (
              <Input
                placeholder="Please specify other goals..."
                value={goalsOther}
                onChange={(e) => setGoalsOther(e.target.value)}
              />
            )}
          </Field>
          <Field label="What's your biggest business priority right now?">
            <Textarea
              placeholder="e.g. We're trying to double our revenue this year without doubling headcount..."
              value={data.goals_extra}
              onChange={(e) => update("goals_extra", e.target.value)}
              required
            />
          </Field>
          <StepNav step={4} onBack={back} onNext={next} nextDisabled={!canProceedStep4()} />
        </div>
      )}

      {step === 5 && (
        <div className="flex flex-col gap-6">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-wide text-ploy-gold">Step 5 of 5</p>
            <h1 className="font-display text-3xl font-bold">Ready to generate your report</h1>
            <p className="mt-2 text-muted-foreground">
              Here&apos;s a summary of what we&apos;ll analyze. Your personalized AI Report will be ready in seconds.
            </p>
          </div>
          <div className="flex flex-col gap-2.5">
            {[
              ["Business", data.business_name || "—"],
              ["Industry", data.industry || "—"],
              ["Team size", data.employee_count || "—"],
              ["Revenue", data.revenue_range || "—"],
              ["Departments", data.departments.join(", ") || "—"],
              ["Pain points", data.pain_points.join(", ") || "—"],
              ["Goals", data.goals.join(", ") || "—"],
            ].map(([label, value]) => (
              <div key={label} className="flex gap-3 rounded-xl border border-border bg-secondary/30 px-4 py-3">
                <span className="w-28 shrink-0 text-sm text-muted-foreground">{label}</span>
                <span className="text-sm font-medium">{value}</span>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-ploy-gold/25 bg-secondary/40 p-5">
            <p className="mb-2.5 text-xs font-bold text-ploy-gold">Your report will include:</p>
            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              <span>✓ AI Readiness Score</span>
              <span>✓ Automation &amp; Growth Scores</span>
              <span>✓ Annual Savings Estimate</span>
              <span>✓ ROI Projections</span>
              <span>✓ Top Bottlenecks</span>
              <span>✓ Recommended AI Employees</span>
              <span>✓ 30/90/1-Year Roadmap</span>
              <span>✓ Implementation Priority</span>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-6">
            <Button variant="ghost" onClick={back}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Button size="lg" onClick={submit}>
              <Sparkles className="h-4 w-4" />
              Generate My AI Report
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-semibold">
        {label} {hint && <span className="font-normal text-muted-foreground">({hint})</span>}
      </span>
      {children}
    </label>
  );
}

function StepNav({
  step,
  onBack,
  onNext,
  nextDisabled,
}: {
  step: number;
  onBack?: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-t border-border pt-6">
      {onBack ? (
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      ) : (
        <span />
      )}
      <span className="font-mono text-xs text-muted-foreground">{step} / 5</span>
      <Button onClick={onNext} disabled={nextDisabled}>
        Continue
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
