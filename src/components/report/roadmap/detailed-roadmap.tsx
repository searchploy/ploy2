import Link from "next/link";
import {
  ArrowRight,
  Bot,
  CalendarClock,
  CheckCircle2,
  Gauge,
  Layers,
  ListChecks,
  Plug,
  ShieldCheck,
  Target,
  TriangleAlert,
  UserRound,
  Workflow,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PloyProBadge } from "@/components/marketplace/ploy-pro-badge";
import { GenerateRoadmapButton } from "@/components/report/roadmap/generate-roadmap-button";
import { RoadmapDisclosure } from "@/components/legal/disclosures";
import { formatUsd, type DetailedRoadmap, type IntegrationNeed, type Kpi, type NextAction, type Risk, type RoadmapWorkflow } from "@/lib/report/roadmap";

export type RoadmapListingLinks = Record<string, { slug: string; isProBoosted: boolean }>;

const DIFFICULTY_VARIANT = { easy: "success", moderate: "gold", advanced: "warning" } as const;

function range(low: number | null, high: number | null, format: (n: number) => string): string | null {
  if (low == null || high == null) return null;
  return low === high ? format(high) : `${format(low)}–${format(high)}`;
}

const hours = (n: number) => `${n} hrs`;

function SectionHeading({ icon: Icon, eyebrow, title }: { icon: typeof Target; eyebrow: string; title: string }) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-ploy-gold">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <p className="label-micro">{eyebrow}</p>
        <h3 className="text-lg font-bold tracking-tight">{title}</h3>
      </div>
    </div>
  );
}

function Bullets({ items, className = "" }: { items: string[]; className?: string }) {
  if (items.length === 0) return null;
  return (
    <ul className={`flex flex-col gap-2 ${className}`}>
      {items.map((item, i) => (
        <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
          <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-ploy-gold/60" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-secondary/20 p-4">
      <p className="label-micro mb-2.5">{title}</p>
      {children}
    </div>
  );
}

function RiskList({ risks }: { risks: Risk[] }) {
  if (risks.length === 0) return null;
  return (
    <div className="flex flex-col gap-2.5">
      {risks.map((r, i) => (
        <div key={i} className="rounded-xl border border-border bg-secondary/20 p-4">
          <p className="flex items-start gap-2 text-sm font-semibold">
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
            {r.risk}
          </p>
          <p className="mt-1.5 pl-6 text-sm text-muted-foreground">{r.mitigation}</p>
        </div>
      ))}
    </div>
  );
}

function IntegrationRow({ need }: { need: IntegrationNeed }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-secondary/30 px-3 py-2">
      <span className="text-sm">{need.name}</span>
      {need.status === "reported" ? (
        <Badge variant="success">In your stack: {need.matched}</Badge>
      ) : (
        <Badge variant="outline" className="text-muted-foreground">
          Confirm or set up
        </Badge>
      )}
    </div>
  );
}

function KpiList({ kpis }: { kpis: Kpi[] }) {
  if (kpis.length === 0) return null;
  return (
    <div className="flex flex-col gap-2">
      {kpis.map((k, i) => (
        <div key={i} className="rounded-xl border border-border bg-secondary/20 p-3.5">
          <p className="text-sm font-semibold">{k.name}</p>
          <dl className="mt-2 grid gap-2 sm:grid-cols-3">
            <div>
              <dt className="label-micro">Current</dt>
              <dd className="text-sm text-muted-foreground">{k.baseline}</dd>
            </div>
            <div>
              <dt className="label-micro">Directional target</dt>
              <dd className="text-sm text-muted-foreground">{k.target}</dd>
            </div>
            <div>
              <dt className="label-micro">Measured</dt>
              <dd className="text-sm text-muted-foreground">{k.frequency}</dd>
            </div>
          </dl>
        </div>
      ))}
    </div>
  );
}

function EmployeeLink({
  employeeId,
  listings,
  reportId,
  className = "",
}: {
  employeeId: string | null;
  listings: RoadmapListingLinks;
  reportId: string;
  className?: string;
}) {
  const listing = employeeId ? listings[employeeId] : undefined;
  if (!listing) return null;
  return (
    <Button asChild variant="outline" size="sm" className={className}>
      <Link href={`/marketplace/${listing.slug}?from_report=${reportId}`}>
        View AI Employee <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
      </Link>
    </Button>
  );
}

function WorkflowCard({
  workflow,
  listings,
  reportId,
}: {
  workflow: RoadmapWorkflow;
  listings: RoadmapListingLinks;
  reportId: string;
}) {
  const listing = listings[workflow.employeeId];
  const impact = workflow.impact;
  const hoursLabel = range(impact.hoursPerWeekLow, impact.hoursPerWeekHigh, (n) => `${n}`);

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="label-micro">
            {workflow.slotLabel} · {workflow.department}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <h4 className="text-base font-bold">{workflow.label}</h4>
            <Badge variant={DIFFICULTY_VARIANT[workflow.difficulty]}>{workflow.difficulty}</Badge>
          </div>
          {listing ? (
            <p className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <Bot className="h-4 w-4 text-ploy-gold" />
              <span className="font-medium text-foreground">{workflow.employeeName}</span>
              {workflow.employeeRole && <span>· {workflow.employeeRole}</span>}
              {listing.isProBoosted && <PloyProBadge />}
            </p>
          ) : (
            <p className="mt-1.5 text-sm text-muted-foreground">
              This AI employee is no longer listed on the marketplace. Rebuild the roadmap to match a current listing.
            </p>
          )}
        </div>
        <EmployeeLink employeeId={workflow.employeeId} listings={listings} reportId={reportId} />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Panel title="Business problem">
          <p className="text-sm leading-relaxed text-muted-foreground">{workflow.problem}</p>
        </Panel>
        <Panel title="Why it was selected">
          <p className="text-sm leading-relaxed text-muted-foreground">{workflow.whySelected}</p>
        </Panel>
      </div>

      <div className="mt-3">
        <Panel title="Why now, in this order">
          <p className="text-sm leading-relaxed text-muted-foreground">{workflow.sequencing}</p>
        </Panel>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Panel title="AI handles">
          <Bullets items={workflow.aiHandles} />
        </Panel>
        <Panel title="Your team handles">
          <Bullets items={workflow.humanHandles} />
        </Panel>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Panel title="Required integrations">
          <div className="flex flex-col gap-1.5">
            {workflow.integrations.map((need) => (
              <IntegrationRow key={need.name} need={need} />
            ))}
          </div>
          {workflow.listedIntegrations.length > 0 && (
            <p className="mt-2 text-xs text-muted-foreground">
              Listed by this AI employee: {workflow.listedIntegrations.join(", ")}
            </p>
          )}
        </Panel>
        <Panel title="Setup & ownership">
          <dl className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Difficulty</dt>
              <dd className="font-medium capitalize">{workflow.difficulty}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Estimated setup</dt>
              <dd className="font-medium">{workflow.setupTime}</dd>
            </div>
            {workflow.listingSetupTime && (
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Listing states</dt>
                <dd className="font-medium">{workflow.listingSetupTime}</dd>
              </div>
            )}
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Owner</dt>
              <dd className="text-right font-medium">{workflow.owner}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Est. time saved</dt>
              <dd className="font-medium">{hoursLabel ? `${hoursLabel} hrs/week` : "Insufficient information"}</dd>
            </div>
          </dl>
        </Panel>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Panel title="Dependencies">
          <Bullets items={workflow.dependencies} />
        </Panel>
        <Panel title="Information needed">
          <Bullets items={workflow.dataNeeded} />
        </Panel>
      </div>

      <div className="mt-4">
        <p className="label-micro mb-2">Success metrics</p>
        <KpiList kpis={workflow.kpis} />
      </div>

      {workflow.alternatives.length > 0 && (
        <div className="mt-4 rounded-xl border border-border bg-secondary/20 p-4">
          <p className="label-micro mb-2">Alternatives from your report</p>
          <div className="flex flex-col gap-2">
            {workflow.alternatives.map((alt) => {
              const altListing = listings[alt.employeeId];
              if (!altListing) return null;
              return (
                <div key={alt.employeeId} className="flex flex-wrap items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-sm">
                    {alt.employeeName}
                    {altListing.isProBoosted && <PloyProBadge />}
                  </span>
                  <EmployeeLink employeeId={alt.employeeId} listings={listings} reportId={reportId} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function NextActionCard({
  action,
  listings,
  reportId,
}: {
  action: NextAction | null;
  listings: RoadmapListingLinks;
  reportId: string;
}) {
  if (!action) return null;
  return (
    <div className="mt-5 rounded-2xl border border-ploy-gold/30 bg-ploy-gold/[0.06] p-5">
      <p className="label-micro">Next action</p>
      <h4 className="mt-1 text-base font-bold">{action.title}</h4>
      <p className="mt-1.5 text-sm text-muted-foreground">{action.detail}</p>
      <dl className="mt-3 grid gap-3 sm:grid-cols-3">
        {action.setupTime && (
          <div>
            <dt className="label-micro">Estimated setup</dt>
            <dd className="text-sm">{action.setupTime}</dd>
          </div>
        )}
        {action.requires.length > 0 && (
          <div>
            <dt className="label-micro">Required</dt>
            <dd className="text-sm">{action.requires.join(", ")}</dd>
          </div>
        )}
        {action.impact && (
          <div>
            <dt className="label-micro">Potential impact</dt>
            <dd className="text-sm">{action.impact}</dd>
          </div>
        )}
      </dl>
      <EmployeeLink employeeId={action.employeeId} listings={listings} reportId={reportId} className="mt-4" />
    </div>
  );
}

function TimelineItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <li className="relative pl-7 sm:pl-9">
      <span className="absolute left-0 top-1.5 h-3 w-3 -translate-x-1/2 rounded-full metal-surface" />
      <p className="label-micro mb-2.5">{label}</p>
      <div className="flex flex-col gap-3">{children}</div>
    </li>
  );
}

export function DetailedRoadmapView({
  roadmap,
  reportId,
  listings,
  canRegenerate,
  stale,
  preview,
}: {
  roadmap: DetailedRoadmap;
  reportId: string;
  listings: RoadmapListingLinks;
  canRegenerate: boolean;
  stale: boolean;
  preview: boolean;
}) {
  const byKey = (key: string | null) => roadmap.workflows.find((w) => w.key === key) ?? null;
  const week2 = byKey(roadmap.thirty.week2WorkflowKey);
  const expand = roadmap.ninety.expandKeys.map(byKey).filter((w): w is RoadmapWorkflow => Boolean(w));
  const connect = roadmap.ninety.connectKeys.map(byKey).filter((w): w is RoadmapWorkflow => Boolean(w));

  if (roadmap.workflows.length === 0) {
    return (
      <section className="mb-10">
        <SectionHeading icon={Target} eyebrow="Ploy Pro" title="AI Transformation Roadmap" />
        <div className="rounded-2xl border border-border bg-secondary/20 p-6">
          <p className="text-sm text-muted-foreground">
            Additional business information is needed to generate this section.
          </p>
          <Bullets items={roadmap.gaps} className="mt-3" />
          {canRegenerate && (
            <div className="mt-4">
              <GenerateRoadmapButton reportId={reportId} label="Rebuild roadmap" variant="outline" size="sm" />
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-10 flex flex-col gap-10">
      <div>
        <SectionHeading icon={Target} eyebrow="Ploy Pro" title="AI Transformation Roadmap" />

        <RoadmapDisclosure className="mb-5" />

        {(stale || preview) && (
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-warning/30 bg-warning-bg px-4 py-3">
            <p className="text-sm text-warning">
              {preview
                ? "Preview only — this roadmap isn't saved to your account."
                : "Your report or one of its recommended listings has changed since this roadmap was built."}
            </p>
            {canRegenerate && (
              <GenerateRoadmapButton reportId={reportId} label="Rebuild roadmap" variant="outline" size="sm" />
            )}
          </div>
        )}

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {roadmap.profile.businessName && (
              <span className="font-semibold">{roadmap.profile.businessName}</span>
            )}
            {roadmap.profile.industry && <span className="text-muted-foreground">{roadmap.profile.industry}</span>}
            {roadmap.profile.teamSize && (
              <span className="text-muted-foreground">{roadmap.profile.teamSize} people</span>
            )}
            {roadmap.profile.readiness != null && (
              <span className="text-muted-foreground">AI readiness {roadmap.profile.readiness}/100</span>
            )}
          </div>

          <p className="label-micro mt-5">Primary objective</p>
          <p className="mt-1.5 text-sm leading-relaxed">{roadmap.objective}</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {roadmap.targets.map((t) => (
              <div key={t.label} className="rounded-xl border border-border bg-secondary/20 p-4">
                <p className="text-xs text-muted-foreground">{t.label}</p>
                <p className="mt-1 font-mono text-lg font-bold">{t.value}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                  <Badge variant={t.basis === "estimate" ? "gold" : "outline"}>
                    {t.basis === "estimate" ? "Estimate" : "To measure"}
                  </Badge>
                  <span>{t.detail}</span>
                </div>
              </div>
            ))}
          </div>

          {roadmap.gaps.length > 0 && (
            <div className="mt-5 rounded-xl border border-border bg-secondary/20 p-4">
              <p className="label-micro mb-2">Information that would sharpen this plan</p>
              <Bullets items={roadmap.gaps} />
            </div>
          )}
        </div>
      </div>

      <div>
        <SectionHeading icon={CalendarClock} eyebrow="Phase 1 · 30 days" title="Foundation & quick wins" />
        <ol className="flex flex-col gap-7 border-l border-ploy-gold/25 pl-1">
          <TimelineItem label="Week 1 — Identify & prepare">
            <Panel title="Workflows to analyze">
              <Bullets items={roadmap.thirty.week1.workflows} />
            </Panel>
            <div className="grid gap-3 sm:grid-cols-2">
              <Panel title="Repetitive tasks to document">
                <Bullets items={roadmap.thirty.week1.repetitiveTasks} />
              </Panel>
              <Panel title="Information to gather">
                <Bullets items={roadmap.thirty.week1.dataNeeded} />
              </Panel>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Panel title="Systems to connect">
                <div className="flex flex-col gap-1.5">
                  {roadmap.thirty.week1.systems.map((need) => (
                    <IntegrationRow key={need.name} need={need} />
                  ))}
                </div>
              </Panel>
              <Panel title="AI rules to agree">
                <Bullets items={roadmap.thirty.week1.policies} />
              </Panel>
            </div>
          </TimelineItem>

          <TimelineItem label="Week 2 — Implement">
            {week2 ? (
              <WorkflowCard workflow={week2} listings={listings} reportId={reportId} />
            ) : (
              <p className="text-sm text-muted-foreground">Additional business information is needed for this step.</p>
            )}
          </TimelineItem>

          <TimelineItem label="Week 3 — Test">
            <div className="grid gap-3 sm:grid-cols-2">
              <Panel title="Test cases">
                <Bullets items={roadmap.thirty.week3.testCases} />
              </Panel>
              <Panel title="Human review">
                <Bullets items={roadmap.thirty.week3.humanReview} />
              </Panel>
              <Panel title="Output quality checks">
                <Bullets items={roadmap.thirty.week3.qualityChecks} />
              </Panel>
              <Panel title="Adjustments">
                <Bullets items={roadmap.thirty.week3.adjustments} />
              </Panel>
            </div>
          </TimelineItem>

          <TimelineItem label="Week 4 — Launch & measure">
            <Panel title="Launch checklist">
              <Bullets items={roadmap.thirty.week4.launchChecklist} />
            </Panel>
            <div>
              <p className="label-micro mb-2">Baseline & targets</p>
              <KpiList kpis={roadmap.thirty.week4.kpis} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Panel title="Monitoring">
                <Bullets items={roadmap.thirty.week4.monitoring} />
              </Panel>
              <Panel title="Human escalation">
                <Bullets items={roadmap.thirty.week4.escalation} />
              </Panel>
            </div>
          </TimelineItem>
        </ol>

        <div className="mt-6">
          <p className="label-micro mb-2.5">Risks in this phase</p>
          <RiskList risks={roadmap.thirty.risks} />
        </div>
        <NextActionCard action={roadmap.thirty.nextAction} listings={listings} reportId={reportId} />
      </div>

      <div>
        <SectionHeading icon={Workflow} eyebrow="Phase 2 · 90 days" title="Automation & scale" />
        <ol className="flex flex-col gap-7 border-l border-ploy-gold/25 pl-1">
          <TimelineItem label="Days 31–60 — Expand">
            {expand.length > 0 ? (
              expand.map((w) => <WorkflowCard key={w.key} workflow={w} listings={listings} reportId={reportId} />)
            ) : (
              <p className="text-sm text-muted-foreground">
                Your report recommends one workflow for this stage. Use these weeks to widen its scope and reduce review
                only where results hold.
              </p>
            )}
          </TimelineItem>

          <TimelineItem label="Days 61–90 — Connect & optimize">
            {connect.map((w) => (
              <WorkflowCard key={w.key} workflow={w} listings={listings} reportId={reportId} />
            ))}
            {roadmap.ninety.flows.map((flow) => (
              <Panel key={flow.name} title={`Connected workflow — ${flow.name}`}>
                <div className="flex flex-col gap-1.5">
                  {flow.steps.map((step, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${
                          step.type === "ai"
                            ? "bg-ploy-gold/15 text-ploy-gold"
                            : step.type === "human"
                              ? "bg-success-bg text-success"
                              : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {step.type === "ai" ? (
                          <Bot className="h-3.5 w-3.5" />
                        ) : step.type === "human" ? (
                          <UserRound className="h-3.5 w-3.5" />
                        ) : (
                          <Plug className="h-3.5 w-3.5" />
                        )}
                      </span>
                      <span className="text-sm">{step.label}</span>
                    </div>
                  ))}
                </div>
              </Panel>
            ))}
            <div className="grid gap-3 sm:grid-cols-2">
              <Panel title="Integrations across these workflows">
                <div className="flex flex-col gap-1.5">
                  {roadmap.ninety.integrations.map((need) => (
                    <IntegrationRow key={need.name} need={need} />
                  ))}
                </div>
              </Panel>
              <Panel title="Your team stays responsible for">
                <Bullets items={roadmap.ninety.humanResponsibilities} />
              </Panel>
            </div>
            {roadmap.ninety.dependencies.length > 0 && (
              <Panel title="Dependencies">
                <Bullets items={roadmap.ninety.dependencies} />
              </Panel>
            )}
            {roadmap.ninety.kpis.length > 0 && (
              <div>
                <p className="label-micro mb-2">Metrics for this phase</p>
                <KpiList kpis={roadmap.ninety.kpis} />
              </div>
            )}
          </TimelineItem>
        </ol>

        <div className="mt-6">
          <p className="label-micro mb-2.5">Risks in this phase</p>
          <RiskList risks={roadmap.ninety.risks} />
        </div>
        <NextActionCard action={roadmap.ninety.nextAction} listings={listings} reportId={reportId} />
      </div>

      <div>
        <SectionHeading icon={Layers} eyebrow="Phase 3 · 1 year" title="AI-powered operations" />
        <div className="grid gap-3 sm:grid-cols-2">
          {roadmap.year.quarters.map((q) => (
            <div key={q.label} className="rounded-2xl border border-border bg-card p-5">
              <p className="label-micro">{q.label}</p>
              <h4 className="mt-1 text-base font-bold">{q.title}</h4>
              <Bullets items={q.items} className="mt-3" />
            </div>
          ))}
        </div>
        <div className="mt-6">
          <p className="label-micro mb-2.5">Risks across the year</p>
          <RiskList risks={roadmap.year.risks} />
        </div>
        <NextActionCard action={roadmap.year.nextAction} listings={listings} reportId={reportId} />
      </div>

      <div>
        <SectionHeading icon={Bot} eyebrow="Deployment" title="AI employee deployment plan" />
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[760px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30 text-left">
                <th className="p-3 font-semibold">#</th>
                <th className="p-3 font-semibold">AI employee</th>
                <th className="p-3 font-semibold">Workflow / department</th>
                <th className="p-3 font-semibold">Timeline</th>
                <th className="p-3 font-semibold">Difficulty</th>
                <th className="p-3 font-semibold">Est. time saved</th>
                <th className="p-3 font-semibold" />
              </tr>
            </thead>
            <tbody>
              {roadmap.workflows.map((w) => {
                const listing = listings[w.employeeId];
                const h = range(w.impact.hoursPerWeekLow, w.impact.hoursPerWeekHigh, (n) => `${n}`);
                return (
                  <tr key={w.key} className="border-b border-border last:border-0 align-top">
                    <td className="p-3 font-mono text-muted-foreground">{w.reportPriority}</td>
                    <td className="p-3">
                      <span className="flex items-center gap-2 font-medium">
                        {listing ? w.employeeName : "No longer listed"}
                        {listing?.isProBoosted && <PloyProBadge />}
                      </span>
                      {w.employeeRole && <span className="text-xs text-muted-foreground">{w.employeeRole}</span>}
                    </td>
                    <td className="p-3">
                      {w.label}
                      <span className="block text-xs text-muted-foreground">{w.department}</span>
                    </td>
                    <td className="p-3 text-muted-foreground">{w.slotLabel}</td>
                    <td className="p-3">
                      <Badge variant={DIFFICULTY_VARIANT[w.difficulty]}>{w.difficulty}</Badge>
                      <span className="mt-1 block text-xs text-muted-foreground">{w.setupTime}</span>
                    </td>
                    <td className="p-3 text-muted-foreground">{h ? `${h} hrs/week` : "Insufficient information"}</td>
                    <td className="p-3">
                      <EmployeeLink employeeId={w.employeeId} listings={listings} reportId={reportId} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <SectionHeading icon={Gauge} eyebrow="Impact" title="Potential impact (estimates)" />
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30 text-left">
                <th className="p-3 font-semibold">Workflow</th>
                <th className="p-3 font-semibold">Est. hrs/week</th>
                <th className="p-3 font-semibold">Est. labor value/yr</th>
                <th className="p-3 font-semibold">AI investment/yr</th>
                <th className="p-3 font-semibold">Potential net/yr</th>
              </tr>
            </thead>
            <tbody>
              {roadmap.workflows.map((w) => {
                const i = w.impact;
                const h = range(i.hoursPerWeekLow, i.hoursPerWeekHigh, (n) => `${n}`);
                const value = range(i.annualValueLow, i.annualValueHigh, formatUsd);
                const net = range(i.netLow, i.netHigh, formatUsd);
                return (
                  <tr key={w.key} className="border-b border-border last:border-0 align-top">
                    <td className="p-3">
                      {w.label}
                      {i.relatedPains.length > 0 && (
                        <span className="block text-xs text-muted-foreground">{i.relatedPains.join(", ")}</span>
                      )}
                    </td>
                    <td className="p-3 font-mono">{h ?? "—"}</td>
                    <td className="p-3 font-mono">{value ?? "—"}</td>
                    <td className="p-3 font-mono">{i.annualInvestment != null ? formatUsd(i.annualInvestment) : "—"}</td>
                    <td className="p-3 font-mono">{net ?? "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {roadmap.workflows.some((w) => w.impact.notes.length > 0) && (
          <div className="mt-3">
            <Bullets items={roadmap.workflows.flatMap((w) => w.impact.notes.map((n) => `${w.label}: ${n}`))} />
          </div>
        )}

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {roadmap.impactByPhase.map((phase) => (
            <div key={phase.label} className="rounded-2xl border border-border bg-card p-5">
              <p className="label-micro">{phase.label}</p>
              <dl className="mt-3 flex flex-col gap-2 text-sm">
                <div className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">Potential hours</dt>
                  <dd className="font-mono">{range(phase.hoursLow, phase.hoursHigh, hours) ?? "—"}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">Potential value</dt>
                  <dd className="font-mono">{range(phase.valueLow, phase.valueHigh, formatUsd) ?? "—"}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">AI investment</dt>
                  <dd className="font-mono">{phase.investment != null ? formatUsd(phase.investment) : "—"}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-muted-foreground">Potential net</dt>
                  <dd className="font-mono">{range(phase.netLow, phase.netHigh, formatUsd) ?? "—"}</dd>
                </div>
              </dl>
              <p className="mt-3 text-xs text-muted-foreground">{phase.note}</p>
              {phase.investmentPartial && (
                <p className="mt-1.5 text-xs text-warning">
                  Net not shown: some listings in this window don't publish pricing.
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-2xl border border-border bg-secondary/20 p-5">
          <p className="label-micro mb-2">Assumptions behind these numbers</p>
          <Bullets items={roadmap.assumptions} />
          <p className="mt-3 text-xs text-muted-foreground">
            These are estimates and projections based on the information you provided, not guaranteed savings, revenue or
            results.
          </p>
        </div>
      </div>

      <div>
        <SectionHeading icon={ListChecks} eyebrow="Measurement" title="KPIs by workflow" />
        <div className="flex flex-col gap-4">
          {roadmap.workflows.map((w) => (
            <div key={w.key}>
              <p className="label-micro mb-2">{w.label}</p>
              <KpiList kpis={w.kpis} />
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionHeading icon={ShieldCheck} eyebrow="Governance" title="AI governance" />
        <div className="grid gap-3 sm:grid-cols-2">
          <Panel title="AI is allowed to">
            <Bullets items={roadmap.governance.allowed} />
          </Panel>
          <Panel title="Requires human approval">
            <Bullets items={roadmap.governance.needsApproval} />
          </Panel>
          <Panel title="Information AI can access">
            <Bullets items={roadmap.governance.dataAccess} />
          </Panel>
          <Panel title="Workflow owners">
            <Bullets items={roadmap.governance.owners} />
          </Panel>
          <Panel title="Performance review">
            <Bullets items={roadmap.governance.review} />
          </Panel>
          <Panel title="When AI gets something wrong">
            <Bullets items={roadmap.governance.onError} />
          </Panel>
          <Panel title="Updating a workflow">
            <Bullets items={roadmap.governance.updates} />
          </Panel>
        </div>
      </div>

      <div>
        <SectionHeading icon={CheckCircle2} eyebrow="Next" title="Your next actions" />
        <div className="flex flex-col gap-3">
          {[roadmap.thirty.nextAction, roadmap.ninety.nextAction, roadmap.year.nextAction]
            .filter((a): a is NextAction => Boolean(a))
            .map((action, i) => (
              <div key={i} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-5">
                <div className="min-w-0">
                  <p className="label-micro">{["Now", "Next 90 days", "This year"][i]}</p>
                  <p className="mt-1 font-semibold">{action.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{action.detail}</p>
                </div>
                <EmployeeLink employeeId={action.employeeId} listings={listings} reportId={reportId} />
              </div>
            ))}
        </div>
        {canRegenerate && (
          <div className="mt-6 flex justify-center">
            <GenerateRoadmapButton reportId={reportId} label="Rebuild roadmap" variant="outline" size="sm" />
          </div>
        )}
      </div>
    </section>
  );
}
