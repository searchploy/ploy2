import type { EmployeeWithCategory } from "@/lib/data/live-marketplace";

/** Raw answers collected by the 5-step report wizard. */
export interface ReportInput {
  business_name: string;
  website: string;
  industry: string;
  description: string;
  employee_count: string;
  revenue_range: string;
  departments: string[];
  current_software: string[];
  pain_points: string[];
  pain_extra: string;
  goals: string[];
  goals_extra: string;
}

export interface RoadmapItem {
  period: string;
  action: string;
}

export interface RecommendedEmployee {
  employee_id: string;
  priority: number;
  name: string;
  role: string;
  reason: string;
  roi_percent: number;
  monthly_savings: number;
}

export interface ScoredReport {
  ai_readiness_score: number;
  automation_score: number;
  growth_score: number;
  estimated_annual_savings: number;
  estimated_hours_saved_monthly: number;
  estimated_monthly_investment: number;
  estimated_roi_percent: number;
  biggest_bottlenecks: string[];
  recommendations: RecommendedEmployee[];
  roadmap_30: RoadmapItem[];
  roadmap_90: RoadmapItem[];
  roadmap_year: RoadmapItem[];
}

// ── Lookup tables ────────────────────────────────────────────────────────

const TEAM_SIZE_READINESS: Record<string, number> = {
  "Just me (1)": 40,
  "2–10": 55,
  "11–50": 65,
  "51–200": 72,
  "201–500": 78,
  "500+": 82,
};

const TEAM_SIZE_VOLUME_MULTIPLIER: Record<string, number> = {
  "Just me (1)": 0.6,
  "2–10": 1.0,
  "11–50": 1.8,
  "51–200": 3.2,
  "201–500": 5.5,
  "500+": 8.5,
};

const REVENUE_READINESS_BONUS: Record<string, number> = {
  "Under $100K": 0,
  "$100K – $500K": 3,
  "$500K – $1M": 6,
  "$1M – $5M": 10,
  "$5M – $20M": 13,
  "$20M+": 15,
};

/** Rough blended fully-loaded hourly labor cost by revenue bucket. */
const REVENUE_HOURLY_COST: Record<string, number> = {
  "Under $100K": 28,
  "$100K – $500K": 32,
  "$500K – $1M": 36,
  "$1M – $5M": 42,
  "$5M – $20M": 48,
  "$20M+": 55,
};

/** How automatable each pain point is with AI today (out of ~100 combined). */
const PAIN_AUTOMATION_WEIGHT: Record<string, number> = {
  "Too much manual data entry": 18,
  "High customer support volume": 16,
  "Not enough leads": 14,
  "Missed follow-ups": 14,
  "Slow response times": 13,
  "Bookkeeping errors": 15,
  "Inconsistent content output": 12,
  "Overwhelmed with emails": 13,
  "Slow hiring process": 11,
  "Poor visibility into data": 10,
  "High operational costs": 9,
  "Scaling is expensive": 8,
};

const GOAL_GROWTH_WEIGHT: Record<string, number> = {
  "Increase revenue": 16,
  "Reduce operating costs": 12,
  "Scale without hiring": 15,
  "Improve customer experience": 12,
  "Speed up operations": 11,
  "Free up founder time": 9,
  "Improve data and reporting": 8,
  "Hire faster": 8,
};

const BOTTLENECK_COPY: Record<string, string> = {
  "Not enough leads": "Your pipeline depends on inconsistent, manual lead generation instead of a repeatable system.",
  "Slow response times": "Slow first-response times are costing you deals and customer trust.",
  "Too much manual data entry": "Hours are lost every week on data entry that could run itself.",
  "High customer support volume": "Support volume is outpacing your team's capacity to respond quickly.",
  "Slow hiring process": "Hiring drags on long enough that strong candidates take other offers.",
  "Bookkeeping errors": "Manual bookkeeping is introducing errors that cost time to catch and fix.",
  "Inconsistent content output": "Content output is inconsistent because no one owns it full-time.",
  "Missed follow-ups": "Deals and leads are slipping through the cracks from missed follow-ups.",
  "Overwhelmed with emails": "Inbox management alone is eating a significant share of the week.",
  "Poor visibility into data": "Decisions are being made without reliable, up-to-date visibility into the numbers.",
  "High operational costs": "Operational costs are climbing faster than the business is scaling.",
  "Scaling is expensive": "Every increment of growth currently requires proportional headcount.",
};

/** Maps a pain point / department / goal to the problem-oriented category slugs it should surface. */
const SIGNAL_TO_CATEGORY: Record<string, string[]> = {
  // pain points
  "Not enough leads": ["generate-more-leads", "increase-revenue"],
  "Slow response times": ["improve-customer-support"],
  "Too much manual data entry": ["automate-admin-work"],
  "High customer support volume": ["improve-customer-support"],
  "Slow hiring process": ["improve-recruiting"],
  "Bookkeeping errors": ["automate-admin-work"],
  "Inconsistent content output": ["create-marketing-content"],
  "Missed follow-ups": ["generate-more-leads", "increase-revenue"],
  "Overwhelmed with emails": ["automate-admin-work"],
  "Poor visibility into data": ["automate-admin-work"],
  "High operational costs": ["automate-admin-work"],
  "Scaling is expensive": ["increase-revenue"],
  // departments
  Sales: ["generate-more-leads", "increase-revenue"],
  "Customer Support": ["improve-customer-support"],
  Marketing: ["create-marketing-content"],
  "Finance / Accounting": ["automate-admin-work"],
  "HR / Recruiting": ["improve-recruiting"],
  Operations: ["automate-admin-work"],
  "Product / Engineering": ["automate-admin-work"],
  "Executive / Admin": ["automate-admin-work"],
  // goals
  "Increase revenue": ["increase-revenue", "generate-more-leads"],
  "Reduce operating costs": ["automate-admin-work"],
  "Scale without hiring": ["automate-admin-work", "increase-revenue"],
  "Improve customer experience": ["improve-customer-support"],
  "Speed up operations": ["automate-admin-work"],
  "Free up founder time": ["automate-admin-work"],
  "Improve data and reporting": ["automate-admin-work"],
  "Hire faster": ["improve-recruiting"],
};

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, Math.round(n)));

function scoreAiReadiness(input: ReportInput): number {
  const base = TEAM_SIZE_READINESS[input.employee_count] ?? 50;
  const revenueBonus = REVENUE_READINESS_BONUS[input.revenue_range] ?? 0;
  const deptBonus = Math.min(input.departments.length * 2, 10);
  const painBonus = Math.min(input.pain_points.length * 1.5, 12);
  const softwareBonus = input.current_software.length > 0 ? 5 : -5;
  return clamp(base + revenueBonus + deptBonus + painBonus + softwareBonus, 0, 100);
}

function scoreAutomation(input: ReportInput): number {
  const sum = input.pain_points.reduce((s, p) => s + (PAIN_AUTOMATION_WEIGHT[p] ?? 6), 0);
  return clamp(30 + sum, 0, 100);
}

function scoreGrowth(input: ReportInput): number {
  const sum = input.goals.reduce((s, g) => s + (GOAL_GROWTH_WEIGHT[g] ?? 6), 0);
  const revenueBonus = Math.round((REVENUE_READINESS_BONUS[input.revenue_range] ?? 0) / 2);
  return clamp(35 + sum + revenueBonus, 0, 100);
}

function estimateHoursSavedMonthly(input: ReportInput): number {
  const multiplier = TEAM_SIZE_VOLUME_MULTIPLIER[input.employee_count] ?? 1;
  const painCount = Math.max(input.pain_points.length, 1);
  return Math.max(20, Math.round(painCount * 14 * multiplier));
}

function estimateAnnualSavings(hoursSavedMonthly: number, revenueRange: string): number {
  const hourlyCost = REVENUE_HOURLY_COST[revenueRange] ?? 32;
  const raw = hoursSavedMonthly * hourlyCost * 12;
  return Math.round(raw / 1000) * 1000;
}

function biggestBottlenecks(input: ReportInput): string[] {
  const ranked = [...input.pain_points].sort(
    (a, b) => (PAIN_AUTOMATION_WEIGHT[b] ?? 0) - (PAIN_AUTOMATION_WEIGHT[a] ?? 0)
  );
  const sentences = ranked.slice(0, 4).map((p) => BOTTLENECK_COPY[p] ?? p);
  if (input.pain_extra.trim()) sentences.push(input.pain_extra.trim());
  return sentences.slice(0, 4);
}

/** Ranks and scores catalog employees against the business's stated signals. */
function matchEmployees(input: ReportInput, catalog: EmployeeWithCategory[], limit: number): RecommendedEmployee[] {
  const signals = [...input.pain_points, ...input.departments, ...input.goals];
  const categoryScores = new Map<string, number>();
  for (const signal of signals) {
    for (const slug of SIGNAL_TO_CATEGORY[signal] ?? []) {
      categoryScores.set(slug, (categoryScores.get(slug) ?? 0) + 1);
    }
  }

  const scored = catalog
    .map((emp) => {
      const categorySlug = emp.category?.slug;
      const matchScore = categorySlug ? categoryScores.get(categorySlug) ?? 0 : 0;
      return { emp, matchScore };
    })
    // Relevance is a gate, not a weight: an employee that doesn't match the
    // business's stated signals is never recommended, Ploy Pro or not.
    .filter((e) => e.matchScore > 0)
    .sort((a, b) => {
      // Ranking within the relevant set: how well it matches, then Ploy Pro
      // visibility, then rating. Pro moves a listing up among employees that
      // already fit — it can't manufacture a fit that isn't there.
      if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
      const proDiff = Number(b.emp.is_pro_boosted ?? false) - Number(a.emp.is_pro_boosted ?? false);
      if (proDiff !== 0) return proDiff;
      return (b.emp.avg_rating ?? 0) - (a.emp.avg_rating ?? 0);
    });

  const picked = (scored.length > 0 ? scored.map((s) => s.emp) : catalog).slice(0, limit);

  return picked.map((emp, i) => {
    const primaryProblem = emp.business_problems?.[0];
    return {
      employee_id: emp.id,
      priority: i + 1,
      name: emp.name,
      role: emp.role,
      reason: primaryProblem
        ? `Matches your stated needs: "${primaryProblem}"`
        : `A strong fit based on your ${input.industry || "business"} profile and current bottlenecks.`,
      roi_percent: emp.avg_roi_percent ?? 250,
      monthly_savings: emp.expected_monthly_savings ?? 2000,
    };
  });
}

function buildRoadmap(recs: RecommendedEmployee[]): {
  roadmap_30: RoadmapItem[];
  roadmap_90: RoadmapItem[];
  roadmap_year: RoadmapItem[];
} {
  const first = recs[0]?.name ?? "your top recommended AI employee";
  const second = recs[1]?.name;
  const third = recs[2]?.name;

  const roadmap_30: RoadmapItem[] = [
    { period: "Week 1", action: `Sign up and configure ${first} for your highest-priority workflow.` },
    { period: "Week 2", action: `Connect your existing software and import historical data so ${first} has context.` },
    { period: "Week 3–4", action: `Run ${first} alongside your team and measure baseline time and cost savings.` },
  ];

  const roadmap_90: RoadmapItem[] = [
    {
      period: "Month 2",
      action: second
        ? `Fully hand off the workflow to ${first} and onboard ${second}.`
        : `Fully hand off the workflow to ${first} and expand its scope.`,
    },
    { period: "Month 3", action: `Review realized ROI against the estimate and adjust scope or add integrations.` },
  ];

  const roadmap_year: RoadmapItem[] = [
    {
      period: "Q2",
      action: third ? `Layer in ${third} to cover the next-highest-priority bottleneck.` : `Expand automation into a second department.`,
    },
    { period: "Q3", action: `Audit remaining manual workflows for further automation opportunities.` },
    { period: "Q4", action: `Set next year's AI adoption goals based on realized savings and ROI.` },
  ];

  return { roadmap_30, roadmap_90, roadmap_year };
}

/**
 * Deterministic scoring engine — no external API call. `catalog` should be
 * the live, published `employees` (optionally already joined to `category`)
 * so recommendations always resolve to real marketplace listings.
 */
export function generateReport(
  input: ReportInput,
  catalog: EmployeeWithCategory[],
  recommendationLimit = 6
): ScoredReport {
  const ai_readiness_score = scoreAiReadiness(input);
  const automation_score = scoreAutomation(input);
  const growth_score = scoreGrowth(input);
  const estimated_hours_saved_monthly = estimateHoursSavedMonthly(input);
  const estimated_annual_savings = estimateAnnualSavings(estimated_hours_saved_monthly, input.revenue_range);
  const recommendations = matchEmployees(input, catalog, recommendationLimit);

  const estimated_monthly_investment =
    recommendations.slice(0, 3).reduce((sum, r) => {
      const emp = catalog.find((e) => e.id === r.employee_id);
      return sum + (emp?.price_monthly ?? 120);
    }, 0) || 120;

  const monthlySavings = estimated_annual_savings / 12;
  const estimated_roi_percent = clamp(
    ((monthlySavings - estimated_monthly_investment) / estimated_monthly_investment) * 100,
    40,
    650
  );

  const { roadmap_30, roadmap_90, roadmap_year } = buildRoadmap(recommendations);

  return {
    ai_readiness_score,
    automation_score,
    growth_score,
    estimated_annual_savings,
    estimated_hours_saved_monthly,
    estimated_monthly_investment,
    estimated_roi_percent,
    biggest_bottlenecks: biggestBottlenecks(input),
    recommendations,
    roadmap_30,
    roadmap_90,
    roadmap_year,
  };
}
