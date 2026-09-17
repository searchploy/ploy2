import { BOTTLENECK_COPY, PAIN_AUTOMATION_WEIGHT, REVENUE_HOURLY_COST } from "@/lib/report/scoring";

/**
 * Detailed Ploy Pro implementation roadmap. Deterministic like the report it
 * extends: built only from the wizard answers, the report's own estimates and
 * the recommended listings' published data. Unknowns are labelled, not filled.
 */

export const ROADMAP_ENGINE_VERSION = 1;

export type Difficulty = "easy" | "moderate" | "advanced";
export type WorkflowSlot = "week2" | "days31_60" | "days61_90" | "months4_6" | "months7_9";

export interface RoadmapListing {
  id: string;
  name: string;
  role: string | null;
  categorySlug: string | null;
  integrations: string[];
  setupTime: string | null;
  primaryTasks: string[];
  businessProblems: string[];
  priceMonthly: number | null;
}

export interface RoadmapSource {
  businessName: string | null;
  industry: string | null;
  employeeCount: string | null;
  revenueRange: string | null;
  departments: string[];
  currentSoftware: string[];
  painPoints: string[];
  goals: string[];
  aiReadinessScore: number | null;
  hoursSavedMonthly: number | null;
  annualSavings: number | null;
  recommendations: { priority: number; listing: RoadmapListing }[];
}

export interface Kpi {
  name: string;
  baseline: string;
  target: string;
  frequency: string;
}

export interface Risk {
  risk: string;
  mitigation: string;
}

export interface IntegrationNeed {
  name: string;
  examples: string[];
  /** "reported" only when the business listed a matching tool in the wizard. */
  status: "reported" | "to_confirm";
  matched: string | null;
}

export interface WorkflowImpact {
  relatedPains: string[];
  hoursPerWeekLow: number | null;
  hoursPerWeekHigh: number | null;
  hourlyRate: number | null;
  annualValueLow: number | null;
  annualValueHigh: number | null;
  annualInvestment: number | null;
  netLow: number | null;
  netHigh: number | null;
  notes: string[];
}

export interface RoadmapWorkflow {
  key: string;
  label: string;
  department: string;
  employeeId: string;
  employeeName: string;
  employeeRole: string | null;
  alternatives: { employeeId: string; employeeName: string }[];
  reportPriority: number;
  slot: WorkflowSlot;
  slotLabel: string;
  whySelected: string;
  problem: string;
  sequencing: string;
  aiHandles: string[];
  humanHandles: string[];
  integrations: IntegrationNeed[];
  listedIntegrations: string[];
  difficulty: Difficulty;
  setupTime: string;
  listingSetupTime: string | null;
  owner: string;
  dependencies: string[];
  dataNeeded: string[];
  kpis: Kpi[];
  risks: Risk[];
  testCases: string[];
  impact: WorkflowImpact;
}

export interface TargetArea {
  label: string;
  value: string;
  basis: "estimate" | "baseline";
  detail: string;
}

export interface FlowStep {
  label: string;
  type: "ai" | "system" | "human";
}

export interface ConnectedFlow {
  name: string;
  steps: FlowStep[];
}

export interface PhaseImpact {
  label: string;
  hoursLow: number | null;
  hoursHigh: number | null;
  valueLow: number | null;
  valueHigh: number | null;
  investment: number | null;
  investmentPartial: boolean;
  netLow: number | null;
  netHigh: number | null;
  note: string;
}

export interface NextAction {
  title: string;
  detail: string;
  setupTime: string | null;
  requires: string[];
  impact: string | null;
  employeeId: string | null;
}

export interface Governance {
  allowed: string[];
  needsApproval: string[];
  dataAccess: string[];
  owners: string[];
  review: string[];
  onError: string[];
  updates: string[];
}

export interface DetailedRoadmap {
  version: number;
  profile: {
    businessName: string | null;
    industry: string | null;
    teamSize: string | null;
    readiness: number | null;
  };
  objective: string;
  targets: TargetArea[];
  workflows: RoadmapWorkflow[];
  thirty: {
    week1: {
      workflows: string[];
      repetitiveTasks: string[];
      dataNeeded: string[];
      systems: IntegrationNeed[];
      policies: string[];
    };
    week2WorkflowKey: string | null;
    week3: { testCases: string[]; humanReview: string[]; qualityChecks: string[]; adjustments: string[] };
    week4: { launchChecklist: string[]; kpis: Kpi[]; monitoring: string[]; escalation: string[] };
    risks: Risk[];
    nextAction: NextAction | null;
  };
  ninety: {
    expandKeys: string[];
    connectKeys: string[];
    flows: ConnectedFlow[];
    integrations: IntegrationNeed[];
    dependencies: string[];
    humanResponsibilities: string[];
    kpis: Kpi[];
    risks: Risk[];
    nextAction: NextAction | null;
  };
  year: {
    quarters: { label: string; title: string; items: string[] }[];
    risks: Risk[];
    nextAction: NextAction | null;
  };
  governance: Governance;
  impactByPhase: PhaseImpact[];
  assumptions: string[];
  gaps: string[];
}

// ── Workflow knowledge ───────────────────────────────────────────────────

type KindKey =
  | "bookkeeping"
  | "assistant"
  | "support"
  | "lead_gen"
  | "sales"
  | "marketing"
  | "social"
  | "recruiting"
  | "operations";

type FlowGroup = "revenue" | "service" | "backoffice" | "people";

interface KindTemplate {
  label: string;
  department: string;
  departments: string[];
  pains: string[];
  goals: string[];
  aiHandles: string[];
  humanHandles: string[];
  integrations: { name: string; examples: string[] }[];
  difficulty: Difficulty;
  dependsOn: KindKey[];
  dependencyReason?: string;
  prerequisites: string[];
  dataNeeded: string[];
  kpis: Kpi[];
  risks: Risk[];
  testCases: string[];
  customerFacing: boolean;
  flowGroup: FlowGroup;
  flowRank: number;
  target: { label: string; detail: string };
}

const kpi = (name: string, target: string, frequency: string): Kpi => ({
  name,
  baseline: "Baseline to establish",
  target,
  frequency,
});

const CRM = { name: "CRM", examples: ["HubSpot", "Salesforce", "Pipedrive", "Zoho", "Close"] };
const EMAIL = { name: "Email", examples: ["Gmail", "Google Workspace", "Outlook", "Microsoft 365"] };
const CALENDAR = { name: "Calendar", examples: ["Google Calendar", "Outlook Calendar", "Calendly"] };

const KINDS: Record<KindKey, KindTemplate> = {
  bookkeeping: {
    label: "Bookkeeping & reconciliation",
    department: "Finance / Accounting",
    departments: ["Finance / Accounting"],
    pains: ["Bookkeeping errors", "Too much manual data entry"],
    goals: ["Reduce operating costs", "Improve data and reporting"],
    aiHandles: [
      "Categorizing transactions",
      "Matching receipts and invoices to payments",
      "Flagging unreconciled or unusual entries",
      "Drafting month-end summaries",
    ],
    humanHandles: [
      "Approving entries and adjustments",
      "Reviewing flagged anomalies",
      "Tax filings and accountant communication",
      "Final sign-off on the monthly close",
    ],
    integrations: [
      { name: "Accounting software", examples: ["QuickBooks", "Xero", "FreshBooks", "Wave", "Sage", "NetSuite"] },
      { name: "Bank & payment feeds", examples: ["Stripe", "PayPal", "Square", "Plaid"] },
    ],
    difficulty: "moderate",
    dependsOn: [],
    prerequisites: ["Chart of accounts reviewed and current", "Read-only access to bank and payment feeds"],
    dataNeeded: ["3–6 months of categorized transactions", "Chart of accounts", "Vendor and customer lists"],
    kpis: [
      kpi("Hours on bookkeeping per week", "Estimated 30–50% below baseline", "Weekly"),
      kpi("Entries corrected after review", "Falling month over month", "Monthly"),
      kpi("Days to close the month", "Shorter than baseline", "Monthly"),
    ],
    risks: [
      { risk: "Miscategorized entries reach the books", mitigation: "Human approval on every posted entry for the first 30 days" },
      { risk: "Over-broad financial access", mitigation: "Read-only access where possible; the AI never initiates payments" },
    ],
    testCases: [
      "Run last month's transactions through and compare with the existing books",
      "Include refunds, split payments and duplicate charges",
      "Confirm unmatched items are flagged rather than guessed",
    ],
    customerFacing: false,
    flowGroup: "backoffice",
    flowRank: 3,
    target: { label: "Bookkeeping accuracy", detail: "Corrections needed after human review" },
  },
  assistant: {
    label: "Inbox & scheduling",
    department: "Executive / Admin",
    departments: ["Executive / Admin", "Operations"],
    pains: ["Overwhelmed with emails", "Slow response times"],
    goals: ["Free up founder time", "Speed up operations"],
    aiHandles: [
      "Triaging and labelling incoming email",
      "Drafting replies to routine messages",
      "Scheduling and rescheduling meetings",
      "Preparing a daily agenda summary",
    ],
    humanHandles: [
      "Sending sensitive or high-stakes replies",
      "Setting priorities and declining requests",
      "Relationship-critical conversations",
    ],
    integrations: [EMAIL, CALENDAR],
    difficulty: "easy",
    dependsOn: [],
    prerequisites: [
      "Email and calendar access limited to the accounts in use",
      "Written rules for what may be sent without review",
    ],
    dataNeeded: [
      "Common email types and preferred responses",
      "Availability and meeting-booking rules",
      "Contacts that always need a human reply",
    ],
    kpis: [
      kpi("Hours on email and scheduling per week", "Estimated 30–50% below baseline", "Weekly"),
      kpi("Reply time for routine email", "Faster than baseline", "Weekly"),
      kpi("Messages exchanged per booked meeting", "Fewer than baseline", "Monthly"),
    ],
    risks: [
      { risk: "An inappropriate reply is sent", mitigation: "Draft-only mode until reply quality has been reviewed" },
      { risk: "Access to private mail", mitigation: "Exclude confidential folders and limit access scopes" },
    ],
    testCases: [
      "Replay a week of real inbound email in draft mode",
      "Test double-booking and time-zone edge cases",
      "Confirm priority contacts are routed to a person",
    ],
    customerFacing: true,
    flowGroup: "backoffice",
    flowRank: 1,
    target: { label: "Time on email & scheduling", detail: "Hours per week spent triaging and booking" },
  },
  support: {
    label: "Customer support",
    department: "Customer Support",
    departments: ["Customer Support"],
    pains: ["High customer support volume", "Slow response times"],
    goals: ["Improve customer experience"],
    aiHandles: [
      "Answering routine questions from approved knowledge",
      "Tagging and routing tickets",
      "Collecting order or account details before handoff",
      "Drafting responses for agent review",
    ],
    humanHandles: [
      "Refunds, complaints and exceptions",
      "Upset or at-risk customers",
      "Final answers on policy questions",
      "Keeping the knowledge base current",
    ],
    integrations: [
      {
        name: "Help desk or live chat",
        examples: ["Zendesk", "Intercom", "Freshdesk", "Gorgias", "Help Scout", "HubSpot"],
      },
      EMAIL,
      { name: "Knowledge base / FAQ", examples: ["Notion", "Confluence", "Google Docs", "Help Center"] },
    ],
    difficulty: "moderate",
    dependsOn: [],
    prerequisites: ["An up-to-date FAQ or knowledge base", "A defined escalation path to a human agent"],
    dataNeeded: ["Top 20 customer questions with approved answers", "Refund and returns policy", "Recent ticket history"],
    kpis: [
      kpi("First response time", "Faster than baseline", "Weekly"),
      kpi("Tickets resolved without human handling", "Gradual increase while satisfaction holds", "Weekly"),
      kpi("Escalation rate", "Stable or lower", "Weekly"),
      kpi("Customer satisfaction", "No decline from baseline", "Monthly"),
    ],
    risks: [
      {
        risk: "Incorrect answers given to customers",
        mitigation: "Limit answers to approved knowledge; human review during the pilot",
      },
      { risk: "Customers can't reach a person", mitigation: "Always offer a clear path to a human" },
    ],
    testCases: [
      "Answer the top 20 historical questions and grade against approved answers",
      "Test angry, ambiguous and out-of-scope messages",
      "Verify escalations reach a person with full context",
    ],
    customerFacing: true,
    flowGroup: "service",
    flowRank: 1,
    target: { label: "Customer support workload", detail: "Tickets needing human handling" },
  },
  lead_gen: {
    label: "Lead generation",
    department: "Sales",
    departments: ["Sales", "Marketing"],
    pains: ["Not enough leads"],
    goals: ["Increase revenue"],
    aiHandles: [
      "Researching prospects that fit your customer profile",
      "Enriching lead records",
      "Drafting personalized first-touch outreach",
      "Logging activity to the CRM",
    ],
    humanHandles: [
      "Defining the ideal customer profile",
      "Approving outreach messaging",
      "Taking qualified conversations forward",
    ],
    integrations: [CRM, EMAIL],
    difficulty: "moderate",
    dependsOn: [],
    prerequisites: ["Ideal customer profile written down", "CRM with defined lead stages"],
    dataNeeded: ["Ideal customer profile", "Examples of your best past customers", "Approved outreach messaging"],
    kpis: [
      kpi("New leads per week", "Higher than baseline", "Weekly"),
      kpi("Qualified leads per week", "Higher than baseline", "Weekly"),
      kpi("Outreach reply rate", "Maintain or improve", "Weekly"),
    ],
    risks: [
      { risk: "Off-target or low-quality leads", mitigation: "Review a sample of every batch against the customer profile" },
      { risk: "Deliverability or email-compliance problems", mitigation: "Warm up sending domains and honour opt-outs" },
    ],
    testCases: [
      "Generate a 25-lead test list and score fit by hand",
      "Review 10 outreach drafts for accuracy and tone",
      "Confirm each lead is logged to the CRM exactly once",
    ],
    customerFacing: true,
    flowGroup: "revenue",
    flowRank: 2,
    target: { label: "Lead flow", detail: "Qualified leads per week" },
  },
  sales: {
    label: "Sales follow-up",
    department: "Sales",
    departments: ["Sales"],
    pains: ["Missed follow-ups", "Slow response times", "Scaling is expensive"],
    goals: ["Increase revenue", "Scale without hiring"],
    aiHandles: [
      "Following up on open leads on a set cadence",
      "Answering early-stage questions",
      "Booking meetings onto the sales calendar",
      "Updating deal stages and notes",
    ],
    humanHandles: [
      "Discovery and closing conversations",
      "Pricing and contract negotiation",
      "Deciding which deals to prioritize",
    ],
    integrations: [CRM, EMAIL, CALENDAR],
    difficulty: "moderate",
    dependsOn: ["lead_gen"],
    dependencyReason: "follow-up only pays off once there is a steady flow of leads to work",
    prerequisites: ["CRM configured with lead stages", "Follow-up cadence and messaging agreed"],
    dataNeeded: ["Current pipeline and lead stages", "Follow-up templates that have worked", "Common objections and answers"],
    kpis: [
      kpi("Lead response time", "Faster than baseline", "Weekly"),
      kpi("Follow-ups sent on schedule", "Nearly all scheduled follow-ups sent", "Weekly"),
      kpi("Meetings booked", "Higher than baseline", "Weekly"),
      kpi("Lead-to-customer conversion rate", "Maintain or improve", "Monthly"),
    ],
    risks: [
      { risk: "Prospects are over-contacted", mitigation: "Cap touches per lead and stop the sequence on any reply" },
      {
        risk: "Wrong pricing or terms are communicated",
        mitigation: "The AI never quotes pricing or terms without approval",
      },
    ],
    testCases: [
      "Run the cadence end to end on internal test leads",
      "Check that a reply stops the sequence immediately",
      "Confirm booked meetings land on the right calendar",
    ],
    customerFacing: true,
    flowGroup: "revenue",
    flowRank: 3,
    target: { label: "Lead response time", detail: "Time from inquiry to first reply" },
  },
  marketing: {
    label: "Marketing content",
    department: "Marketing",
    departments: ["Marketing"],
    pains: ["Inconsistent content output"],
    goals: ["Increase revenue"],
    aiHandles: [
      "Drafting blog posts, emails and campaign copy",
      "Repurposing content across channels",
      "Maintaining the content calendar",
      "Summarizing content performance",
    ],
    humanHandles: ["Brand voice and final approval", "Claims, offers and legal review", "Campaign strategy"],
    integrations: [
      { name: "Website / CMS", examples: ["WordPress", "Webflow", "Shopify", "Squarespace", "Wix"] },
      { name: "Email marketing", examples: ["Mailchimp", "Klaviyo", "HubSpot", "ConvertKit"] },
    ],
    difficulty: "easy",
    dependsOn: [],
    prerequisites: ["Brand voice and style guidelines", "An approval step before anything is published"],
    dataNeeded: ["Brand guidelines with on-brand examples", "Target audience and key offers", "Publishing goals"],
    kpis: [
      kpi("Pieces published per month", "A consistent, planned cadence", "Monthly"),
      kpi("Time from brief to published", "Shorter than baseline", "Monthly"),
      kpi("Leads or signups from content", "Higher than baseline", "Monthly"),
    ],
    risks: [
      { risk: "Off-brand or inaccurate content", mitigation: "Human approval before anything is published" },
      { risk: "Generic content that doesn't perform", mitigation: "Build briefs from real customer questions and results" },
    ],
    testCases: [
      "Produce 3 drafts from real briefs and compare with your best past content",
      "Fact-check every statistic and claim",
      "Run drafts through the approval step",
    ],
    customerFacing: true,
    flowGroup: "revenue",
    flowRank: 1,
    target: { label: "Content consistency", detail: "Planned vs. published pieces" },
  },
  social: {
    label: "Social media",
    department: "Marketing",
    departments: ["Marketing"],
    pains: ["Inconsistent content output"],
    goals: ["Increase revenue", "Improve customer experience"],
    aiHandles: [
      "Drafting and scheduling posts",
      "Adapting content for each platform",
      "Flagging comments that need a reply",
      "Weekly engagement summaries",
    ],
    humanHandles: ["Approving posts", "Replying to complaints or sensitive comments", "Campaign and partnership decisions"],
    integrations: [
      { name: "Social accounts", examples: ["Instagram", "Facebook", "LinkedIn", "TikTok"] },
      { name: "Post scheduler", examples: ["Buffer", "Hootsuite", "Later", "Sprout Social"] },
    ],
    difficulty: "easy",
    dependsOn: [],
    prerequisites: ["Brand voice guidelines", "Admin access to the social accounts"],
    dataNeeded: ["Brand guidelines", "Examples of top-performing posts", "Posting goals per platform"],
    kpis: [
      kpi("Posts published per week", "A consistent, planned cadence", "Weekly"),
      kpi("Engagement rate", "Maintain or improve", "Weekly"),
      kpi("Inquiries from social", "Higher than baseline", "Monthly"),
    ],
    risks: [
      { risk: "A public posting mistake", mitigation: "Approval queue before anything goes live" },
      {
        risk: "Scheduled posts land badly during a sensitive moment",
        mitigation: "Pause the queue during incidents",
      },
    ],
    testCases: [
      "Draft two weeks of posts and review before scheduling",
      "Check formatting and links on each platform",
      "Confirm flagged comments reach a person",
    ],
    customerFacing: true,
    flowGroup: "revenue",
    flowRank: 1,
    target: { label: "Social presence", detail: "Planned vs. published posts" },
  },
  recruiting: {
    label: "Recruiting & hiring",
    department: "HR / Recruiting",
    departments: ["HR / Recruiting"],
    pains: ["Slow hiring process"],
    goals: ["Hire faster"],
    aiHandles: [
      "Writing and posting job descriptions",
      "Screening applications against must-have criteria",
      "Scheduling interviews",
      "Sending candidate status updates",
    ],
    humanHandles: ["Shortlisting and every hiring decision", "Interviews and reference checks", "Offers and compensation"],
    integrations: [
      { name: "Applicant tracking", examples: ["Greenhouse", "Lever", "Workable", "BambooHR"] },
      { name: "Job boards", examples: ["LinkedIn", "Indeed"] },
      CALENDAR,
    ],
    difficulty: "moderate",
    dependsOn: [],
    prerequisites: ["Clear must-have criteria for each role", "Screening rules reviewed for fairness"],
    dataNeeded: ["Role scorecards", "Past job descriptions", "Interviewer availability"],
    kpis: [
      kpi("Days to first interview", "Shorter than baseline", "Per role"),
      kpi("Days to hire", "Shorter than baseline", "Per role"),
      kpi("Hiring manager hours per role", "Lower than baseline", "Per role"),
    ],
    risks: [
      { risk: "Biased or unfair screening", mitigation: "A person reviews every rejection; audit criteria for bias" },
      { risk: "Candidate data privacy", mitigation: "Limit access to and retention of applicant data" },
    ],
    testCases: [
      "Screen a past applicant pool and compare with the actual shortlist",
      "Check every rejection is reviewed by a person",
      "Test interview scheduling across time zones",
    ],
    customerFacing: true,
    flowGroup: "people",
    flowRank: 1,
    target: { label: "Time to hire", detail: "Days from posting to accepted offer" },
  },
  operations: {
    label: "Operations & admin workflows",
    department: "Operations",
    departments: ["Operations", "Executive / Admin", "Product / Engineering"],
    pains: ["Too much manual data entry", "Poor visibility into data", "High operational costs", "Scaling is expensive"],
    goals: ["Speed up operations", "Reduce operating costs", "Improve data and reporting", "Scale without hiring"],
    aiHandles: [
      "Moving data between tools",
      "Tracking tasks and deadlines",
      "Compiling recurring status reports",
      "Flagging blocked or overdue work",
    ],
    humanHandles: ["Setting priorities and owners", "Resolving blockers and exceptions", "Approving process changes"],
    integrations: [
      { name: "Project management", examples: ["Asana", "Trello", "Monday", "ClickUp", "Jira", "Notion"] },
      { name: "Spreadsheets / database", examples: ["Google Sheets", "Excel", "Airtable"] },
      { name: "Team chat", examples: ["Slack", "Microsoft Teams"] },
    ],
    difficulty: "moderate",
    dependsOn: [],
    prerequisites: ["The target workflow's steps documented", "One source of truth for task and status data"],
    dataNeeded: [
      "Step-by-step description of the target workflow",
      "Where that workflow's data lives today",
      "The report formats people already rely on",
    ],
    kpis: [
      kpi("Hours of manual data handling per week", "Estimated 30–50% below baseline", "Weekly"),
      kpi("Data-entry errors found", "Lower than baseline", "Monthly"),
      kpi("Recurring reports delivered on time", "Consistently on time", "Weekly"),
    ],
    risks: [
      { risk: "Automating a broken process", mitigation: "Fix and document the process before automating it" },
      { risk: "Silent sync failures between tools", mitigation: "A daily exception report reviewed by the owner" },
    ],
    testCases: [
      "Run the workflow alongside the manual process for one week",
      "Compare outputs field by field",
      "Break an input on purpose and confirm it is flagged",
    ],
    customerFacing: false,
    flowGroup: "backoffice",
    flowRank: 2,
    target: { label: "Operational efficiency", detail: "Manual hours in the target workflow" },
  },
};

const ROLE_RULES: [RegExp, KindKey][] = [
  [/book|account|financ|invoice|ledger|payroll|billing/i, "bookkeeping"],
  [/recruit|talent|hiring|\bhr\b|people ops/i, "recruiting"],
  [/social/i, "social"],
  [/\bsdr\b|lead|prospect|outreach|business development/i, "lead_gen"],
  [/sales|closer|follow.?up|appointment|setter|revenue|account exec/i, "sales"],
  [/support|service|customer|help ?desk|success|concierge|reception/i, "support"],
  [/assistant|executive|inbox|schedul|secretary/i, "assistant"],
  [/content|writer|copy|marketing|seo|blog|newsletter/i, "marketing"],
  [/project|operation|\bops\b|coordinator|admin|data entry|analyst/i, "operations"],
];

const CATEGORY_KIND: Record<string, KindKey> = {
  "automate-admin-work": "operations",
  "improve-customer-support": "support",
  "generate-more-leads": "lead_gen",
  "increase-revenue": "sales",
  "create-marketing-content": "marketing",
  "improve-recruiting": "recruiting",
};

const PAIN_OBJECTIVE: Record<string, string> = {
  "Not enough leads": "build a more consistent lead pipeline",
  "Slow response times": "respond to customers and prospects faster",
  "Too much manual data entry": "cut repetitive manual data entry",
  "High customer support volume": "absorb growing support volume",
  "Slow hiring process": "shorten the hiring process",
  "Bookkeeping errors": "reduce bookkeeping errors",
  "Inconsistent content output": "publish content consistently",
  "Missed follow-ups": "stop leads slipping through missed follow-ups",
  "Overwhelmed with emails": "take routine email and scheduling off the team's plate",
  "Poor visibility into data": "get reliable visibility into business data",
  "High operational costs": "bring operational costs under control",
  "Scaling is expensive": "grow without costs rising at the same rate",
};

const GOAL_OBJECTIVE: Record<string, string> = {
  "Increase revenue": "increase revenue",
  "Reduce operating costs": "lower operating costs",
  "Scale without hiring": "scale without proportional increases in headcount",
  "Improve customer experience": "improve the customer experience",
  "Speed up operations": "speed up day-to-day operations",
  "Free up founder time": "free up the founder's time",
  "Improve data and reporting": "improve data and reporting",
  "Hire faster": "hire faster",
};

const REGULATED_INDUSTRIES = ["Healthcare", "Finance / Accounting", "Legal", "Education"];

const SLOTS: { slot: WorkflowSlot; label: string; startWeek: number; launchWeek: number }[] = [
  { slot: "week2", label: "30 days · Week 2", startWeek: 1, launchWeek: 3.3 },
  { slot: "days31_60", label: "90 days · Days 31–60", startWeek: 4.3, launchWeek: 8 },
  { slot: "days61_90", label: "90 days · Days 61–90", startWeek: 8.7, launchWeek: 12 },
  { slot: "months4_6", label: "1 year · Months 4–6", startWeek: 13, launchWeek: 20 },
  { slot: "months7_9", label: "1 year · Months 7–9", startWeek: 26, launchWeek: 32 },
];

const SETUP_BANDS: Record<Difficulty, string> = {
  easy: "Approx. 1–3 hours",
  moderate: "Approx. 1–3 days",
  advanced: "Approx. 1–4+ weeks",
};

const FLOW_META: Record<FlowGroup, { name: string; entry: string; exit: string }> = {
  revenue: {
    name: "Revenue pipeline",
    entry: "New prospects and inbound interest",
    exit: "Your sales team: qualified conversations and closing",
  },
  service: {
    name: "Customer service",
    entry: "Customer inquiry by email or chat",
    exit: "Your support team: exceptions, refunds and sensitive issues",
  },
  backoffice: {
    name: "Back office",
    entry: "Incoming email, documents and transactions",
    exit: "Workflow owner: approvals and exceptions",
  },
  people: {
    name: "Hiring",
    entry: "Open role and incoming applications",
    exit: "Hiring manager: interviews and final decisions",
  },
};

// ── Helpers ──────────────────────────────────────────────────────────────

const WEEKS_PER_MONTH = 4.33;

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "");
/** Rounds down to a half hour, so allocated hours never exceed the report's estimate. */
const half = (n: number) => Math.floor(n * 2) / 2;
const roundTo = (n: number, step: number) => Math.round(n / step) * step;
const quoteList = (items: string[]) => items.map((i) => `“${i}”`).join(", ");
const unique = <T,>(items: T[]) => [...new Set(items)];

function joinPhrases(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function detectKind(listing: RoadmapListing): KindKey {
  for (const text of [listing.role ?? "", listing.name]) {
    const hit = ROLE_RULES.find(([pattern]) => pattern.test(text));
    if (hit) return hit[1];
  }
  return CATEGORY_KIND[listing.categorySlug ?? ""] ?? "operations";
}

/** Only a tool the business itself reported counts as "in your stack". */
function findReported(examples: string[], software: string[]): string | null {
  for (const raw of software) {
    const s = norm(raw);
    if (s.length < 2) continue;
    for (const example of examples) {
      const e = norm(example);
      if (s === e || (e.length >= 4 && s.includes(e)) || (s.length >= 4 && e.startsWith(s))) return raw.trim();
    }
  }
  return null;
}

/** Listing setup times are free text; bare numbers carry no unit and are ignored. */
function difficultyFromListing(setupTime: string | null): Difficulty | null {
  if (!setupTime || /^\s*\d+(\.\d+)?\s*$/.test(setupTime)) return null;
  const t = setupTime.toLowerCase();
  if (/same day|hour|minute|instant/.test(t)) return "easy";
  if (/month|[2-9]\s*(\+|-|–)?\s*\d*\s*weeks/.test(t)) return "advanced";
  if (/day|week/.test(t)) return "moderate";
  return null;
}

export function formatUsd(n: number) {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}

function hoursRange(low: number | null, high: number | null): string | null {
  if (low == null || high == null) return null;
  return low === high ? `Est. ${high} hrs/week` : `Est. ${low}–${high} hrs/week`;
}

// ── Builder ──────────────────────────────────────────────────────────────

interface Group {
  kind: KindKey;
  recs: RoadmapSource["recommendations"];
}

function sequenceGroups(groups: Group[]): { group: Group; pulledForwardFor: KindKey | null }[] {
  const present = new Map(groups.map((g) => [g.kind, g]));
  const placed = new Set<KindKey>();
  const out: { group: Group; pulledForwardFor: KindKey | null }[] = [];

  const place = (group: Group, pulledForwardFor: KindKey | null) => {
    if (placed.has(group.kind)) return;
    placed.add(group.kind);
    for (const dep of KINDS[group.kind].dependsOn) {
      const depGroup = present.get(dep);
      if (depGroup) place(depGroup, group.kind);
    }
    out.push({ group, pulledForwardFor });
  };

  for (const group of groups) place(group, null);
  return out.slice(0, SLOTS.length);
}

export function buildDetailedRoadmap(source: RoadmapSource): DetailedRoadmap {
  const knownPains = source.painPoints.filter((p) => p in PAIN_AUTOMATION_WEIGHT);
  const customPains = source.painPoints.filter((p) => !(p in PAIN_AUTOMATION_WEIGHT));
  const recs = [...source.recommendations].sort((a, b) => a.priority - b.priority);
  const soloOperator = source.employeeCount === "Just me (1)";
  const hourlyRate = source.revenueRange ? (REVENUE_HOURLY_COST[source.revenueRange] ?? null) : null;
  const reportHours = source.hoursSavedMonthly && source.hoursSavedMonthly > 0 ? source.hoursSavedMonthly : null;

  const groupsByKind = new Map<KindKey, Group>();
  for (const rec of recs) {
    const kind = detectKind(rec.listing);
    const existing = groupsByKind.get(kind);
    if (existing) existing.recs.push(rec);
    else groupsByKind.set(kind, { kind, recs: [rec] });
  }
  const sequenced = sequenceGroups([...groupsByKind.values()]);

  // A pain point several workflows address is split between them, so the
  // per-workflow hours never add up to more than the report's own estimate.
  const painClaims = new Map<string, number>();
  for (const { group } of sequenced) {
    for (const pain of knownPains.filter((p) => KINDS[group.kind].pains.includes(p))) {
      painClaims.set(pain, (painClaims.get(pain) ?? 0) + 1);
    }
  }
  const totalPainWeight = knownPains.reduce((sum, p) => sum + PAIN_AUTOMATION_WEIGHT[p], 0);

  const workflows: RoadmapWorkflow[] = [];
  sequenced.forEach(({ group, pulledForwardFor }, index) => {
    const t = KINDS[group.kind];
    const primary = group.recs[0];
    const listing = primary.listing;
    const slot = SLOTS[index];

    const painsMatched = knownPains.filter((p) => t.pains.includes(p));
    const goalsMatched = source.goals.filter((g) => t.goals.includes(g));
    const deptMatched = source.departments.find((d) => t.departments.includes(d)) ?? null;

    const integrations: IntegrationNeed[] = t.integrations.map((need) => {
      const matched = findReported(need.examples, source.currentSoftware);
      return { name: need.name, examples: need.examples, status: matched ? "reported" : "to_confirm", matched };
    });
    const unconfirmed = integrations.filter((i) => i.status === "to_confirm");

    let difficulty = difficultyFromListing(listing.setupTime) ?? t.difficulty;
    if (difficulty === "easy" && unconfirmed.length >= 2) difficulty = "moderate";

    const owner = soloOperator
      ? "You (owner-operator)"
      : deptMatched
        ? `${deptMatched} lead`
        : `Assign an owner (no ${t.department} team was reported)`;

    const forWhat = painsMatched.length
      ? ` for ${quoteList(painsMatched)}`
      : goalsMatched.length
        ? ` for your goal ${quoteList(goalsMatched.slice(0, 1))}`
        : deptMatched
          ? ` for your ${deptMatched} team`
          : "";
    let whySelected = `Ranked #${primary.priority} of ${recs.length} in your AI Report${forWhat}.`;
    if (listing.businessProblems[0]) {
      whySelected += ` The listing describes its purpose as “${listing.businessProblems[0]}”.`;
    }
    if (!painsMatched.length && !goalsMatched.length && !deptMatched) {
      whySelected += " Your report didn't tie it to a specific pain point, so confirm the fit before deploying.";
    }

    const problem = painsMatched.length
      ? (BOTTLENECK_COPY[painsMatched[0]] ?? painsMatched[0])
      : goalsMatched.length
        ? `Supports your goal to ${GOAL_OBJECTIVE[goalsMatched[0]] ?? goalsMatched[0].toLowerCase()}.`
        : "No specific pain point in your report maps to this workflow.";

    const earlierDependency = workflows.find((w) => t.dependsOn.includes(w.key as KindKey));
    let sequencing: string;
    if (pulledForwardFor) {
      // This workflow outranks its report position because something the
      // report ranked higher can't run until this one is producing output.
      const dependant = KINDS[pulledForwardFor];
      sequencing = `${index === 0 ? "Deployed first" : "Placed ahead"} of its report rank (#${primary.priority}) because ${dependant.label.toLowerCase()} depends on it${
        dependant.dependencyReason ? `: ${dependant.dependencyReason}` : ""
      }.`;
    } else if (index === 0) {
      sequencing = `Deployed first because it is the top-ranked match in your report${
        painsMatched.length ? ` and targets your most automatable pain point, ${quoteList(painsMatched.slice(0, 1))}` : ""
      }${difficulty === "easy" ? ", and its light setup makes it a practical quick win" : ""}.`;
    } else if (earlierDependency) {
      sequencing = `Comes after ${earlierDependency.label.toLowerCase()} because ${
        t.dependencyReason ?? "it relies on that workflow's output"
      }.`;
    } else {
      const previous = workflows[index - 1];
      const shared = integrations.filter((i) => previous.integrations.some((p) => p.name === i.name)).map((i) => i.name);
      sequencing = `Ranked #${primary.priority} in your report. Starting it once ${previous.label.toLowerCase()} is stable keeps human review manageable${
        shared.length ? ` and reuses integrations already set up (${joinPhrases(shared)})` : ""
      }.`;
    }

    const dependencies = [
      ...(earlierDependency ? [`${earlierDependency.label} live and producing reliable output`] : []),
      ...t.prerequisites,
      ...integrations.map((i) =>
        i.status === "reported"
          ? `${i.name} access granted (you reported using ${i.matched})`
          : `${i.name} connected (e.g. ${i.examples.slice(0, 3).join(", ")})`
      ),
      ...(index > 0 && !earlierDependency ? [`${workflows[index - 1].label} stable, so review capacity is free`] : []),
    ];

    const notes: string[] = [];
    let hoursPerWeekLow: number | null = null;
    let hoursPerWeekHigh: number | null = null;
    const weight = painsMatched.reduce((sum, p) => sum + PAIN_AUTOMATION_WEIGHT[p] / (painClaims.get(p) ?? 1), 0);
    if (reportHours && totalPainWeight > 0 && weight > 0) {
      const weekly = (reportHours * (weight / totalPainWeight)) / WEEKS_PER_MONTH;
      hoursPerWeekHigh = Math.max(0.5, half(weekly));
      hoursPerWeekLow = Math.max(0.5, half(weekly * 0.6));
    } else {
      notes.push("Insufficient information to estimate hours: no pain point in your report maps to this workflow.");
    }
    const annualValueLow = hoursPerWeekLow != null && hourlyRate ? roundTo(hoursPerWeekLow * hourlyRate * 52, 100) : null;
    const annualValueHigh = hoursPerWeekHigh != null && hourlyRate ? roundTo(hoursPerWeekHigh * hourlyRate * 52, 100) : null;
    if (hoursPerWeekHigh != null && !hourlyRate) notes.push("Labor value not estimated: no revenue range was provided.");
    const annualInvestment = listing.priceMonthly != null ? Math.round(listing.priceMonthly * 12) : null;
    if (annualInvestment == null) notes.push("AI investment not estimated: the listing doesn't publish pricing.");

    workflows.push({
      key: group.kind,
      label: t.label,
      department: t.department,
      employeeId: listing.id,
      employeeName: listing.name,
      employeeRole: listing.role,
      alternatives: group.recs.slice(1, 3).map((r) => ({ employeeId: r.listing.id, employeeName: r.listing.name })),
      reportPriority: primary.priority,
      slot: slot.slot,
      slotLabel: slot.label,
      whySelected,
      problem,
      sequencing,
      aiHandles: listing.primaryTasks.length ? listing.primaryTasks.slice(0, 5) : t.aiHandles,
      humanHandles: t.humanHandles,
      integrations,
      listedIntegrations: listing.integrations,
      difficulty,
      setupTime: SETUP_BANDS[difficulty],
      listingSetupTime: difficultyFromListing(listing.setupTime) ? listing.setupTime : null,
      owner,
      dependencies,
      dataNeeded: t.dataNeeded,
      kpis: t.kpis,
      risks: t.risks,
      testCases: t.testCases,
      impact: {
        relatedPains: painsMatched,
        hoursPerWeekLow,
        hoursPerWeekHigh,
        hourlyRate,
        annualValueLow,
        annualValueHigh,
        annualInvestment,
        netLow: annualValueLow != null && annualInvestment != null ? annualValueLow - annualInvestment : null,
        netHigh: annualValueHigh != null && annualInvestment != null ? annualValueHigh - annualInvestment : null,
        notes,
      },
    });
  });

  const gaps: string[] = [];
  if (workflows.length === 0) {
    gaps.push("Your report has no recommended AI employees that are currently listed on the marketplace.");
  }
  if (!source.revenueRange) gaps.push("No revenue range was provided, so labor value isn't estimated.");
  if (source.currentSoftware.length === 0) {
    gaps.push("No current software was reported, so integrations can't be matched to your existing tools.");
  }
  if (source.departments.length === 0) gaps.push("No departments were reported, so workflow owners can't be suggested.");
  for (const pain of customPains) {
    gaps.push(`“${pain}” isn't mapped to a specific workflow. Check whether a recommended AI employee covers it.`);
  }

  const first = workflows[0] ?? null;
  const inSlots = (slots: WorkflowSlot[]) => workflows.filter((w) => slots.includes(w.slot));
  const expand = inSlots(["days31_60"]);
  const connectNew = inSlots(["days61_90"]);
  const firstNinety = inSlots(["week2", "days31_60", "days61_90"]);

  return {
    version: ROADMAP_ENGINE_VERSION,
    profile: {
      businessName: source.businessName,
      industry: source.industry,
      teamSize: source.employeeCount,
      readiness: source.aiReadinessScore,
    },
    objective: buildObjective(source, knownPains),
    targets: buildTargets(source, workflows, reportHours),
    workflows,
    thirty: buildThirty(source, workflows, soloOperator),
    ninety: {
      expandKeys: expand.map((w) => w.key),
      connectKeys: connectNew.map((w) => w.key),
      flows: buildFlows(firstNinety.length ? firstNinety : workflows),
      integrations: mergeIntegrations(firstNinety),
      dependencies: [...expand, ...connectNew].flatMap((w) => w.dependencies.slice(0, 3).map((d) => `${w.label}: ${d}`)),
      humanResponsibilities: unique(firstNinety.flatMap((w) => w.humanHandles.slice(0, 2).map((h) => `${w.label}: ${h}`))),
      kpis: [...expand, ...connectNew].flatMap((w) =>
        w.kpis.slice(0, 2).map((k) => ({ ...k, name: `${w.label}: ${k.name}` }))
      ),
      risks: ninetyRisks(firstNinety),
      nextAction: expand[0]
        ? deployAction(expand[0])
        : first
          ? {
              title: `Connect and measure ${first.label.toLowerCase()}`,
              detail: "Compare live KPIs with the Week 1 baseline and reduce human review only where results hold.",
              setupTime: null,
              requires: ["KPI baselines recorded in Week 1"],
              impact: null,
              employeeId: null,
            }
          : null,
    },
    year: buildYear(source, workflows, knownPains, soloOperator),
    governance: buildGovernance(workflows),
    impactByPhase: [
      phaseImpact(
        "First 30 days",
        4.3,
        workflows,
        hourlyRate,
        "The first workflow goes live around week 4, so savings in this window are small by design."
      ),
      phaseImpact(
        "First 90 days",
        13,
        workflows,
        hourlyRate,
        "Includes workflows launched in days 31–90 for the weeks they are live."
      ),
      phaseImpact(
        "First year",
        52,
        workflows,
        hourlyRate,
        "Assumes each workflow stays live from its launch week through month 12."
      ),
    ],
    assumptions: buildAssumptions(source, knownPains, reportHours, hourlyRate),
    gaps,
  };
}

function deployAction(w: RoadmapWorkflow): NextAction {
  return {
    title: `Deploy ${w.employeeName}`,
    detail: `${w.label}: ${w.problem}`,
    setupTime: w.setupTime,
    requires: w.integrations.map((i) => i.name),
    impact: hoursRange(w.impact.hoursPerWeekLow, w.impact.hoursPerWeekHigh),
    employeeId: w.employeeId,
  };
}

function buildObjective(source: RoadmapSource, knownPains: string[]): string {
  const topPains = [...knownPains]
    .sort((a, b) => PAIN_AUTOMATION_WEIGHT[b] - PAIN_AUTOMATION_WEIGHT[a])
    .slice(0, 2)
    .map((p) => PAIN_OBJECTIVE[p]);
  const goal = source.goals[0];
  const goalPhrase = goal ? (GOAL_OBJECTIVE[goal] ?? `work toward “${goal}”`) : null;
  const who = source.businessName || "the business";

  if (!topPains.length && !goalPhrase) {
    return `Put a first, well-measured AI workflow in place at ${who}, then expand only where results are proven.`;
  }
  const lead = topPains.length ? capitalize(joinPhrases(topPains)) : capitalize(goalPhrase!);
  const tail = topPains.length && goalPhrase ? `, so ${who} can ${goalPhrase}` : "";
  return `${lead}${tail}, with AI employees taking on repetitive work while your team keeps ownership of decisions and customer relationships.`;
}

function buildTargets(source: RoadmapSource, workflows: RoadmapWorkflow[], reportHours: number | null): TargetArea[] {
  const targets: TargetArea[] = [];
  if (reportHours) {
    targets.push({
      label: "Repetitive work that could be reduced",
      value: `≈ ${reportHours} hrs/month`,
      basis: "estimate",
      detail: "From your AI Report's estimate",
    });
  }
  if (source.annualSavings && source.revenueRange) {
    targets.push({
      label: "Potential annual labor value",
      value: formatUsd(source.annualSavings),
      basis: "estimate",
      detail: "Before AI costs",
    });
  }
  for (const w of workflows) {
    const t = KINDS[w.key as KindKey];
    if (targets.some((x) => x.label === t.target.label)) continue;
    targets.push({ label: t.target.label, value: "Baseline to establish", basis: "baseline", detail: t.target.detail });
  }
  const prices = workflows.map((w) => w.impact.annualInvestment);
  if (workflows.length && prices.every((p) => p != null)) {
    const monthly = prices.reduce<number>((sum, p) => sum + (p ?? 0), 0) / 12;
    targets.push({
      label: "AI investment at full rollout",
      value: `${formatUsd(monthly)}/mo`,
      basis: "estimate",
      detail: "From published listing prices",
    });
  }
  return targets.slice(0, 6);
}

function buildThirty(
  source: RoadmapSource,
  workflows: RoadmapWorkflow[],
  soloOperator: boolean
): DetailedRoadmap["thirty"] {
  const first = workflows[0];
  if (!first) {
    return {
      week1: { workflows: [], repetitiveTasks: [], dataNeeded: [], systems: [], policies: [] },
      week2WorkflowKey: null,
      week3: { testCases: [], humanReview: [], qualityChecks: [], adjustments: [] },
      week4: { launchChecklist: [], kpis: [], monitoring: [], escalation: [] },
      risks: [],
      nextAction: null,
    };
  }
  const customerFacing = workflows.some((w) => KINDS[w.key as KindKey].customerFacing);
  const firstFacing = KINDS[first.key as KindKey].customerFacing;
  const reviewer = soloOperator ? "You" : first.owner;

  const policies = [
    `Decide what ${first.label.toLowerCase()} output may go out without review (start with nothing)`,
    "Name one accountable owner for each AI workflow",
    "List information the AI must never access, such as payroll, personal records and credentials",
  ];
  if (customerFacing) policies.push("Make sure customers can always reach a person");
  if (source.industry && REGULATED_INDUSTRIES.includes(source.industry)) {
    policies.push(
      `Confirm which privacy and record-keeping rules apply in ${source.industry} before connecting client data`
    );
  }

  const risks: Risk[] = [...first.risks];
  if (source.currentSoftware.length === 0) {
    risks.push({
      risk: "Business data is scattered or not ready",
      mitigation: "Inventory the tools and data the workflow needs in Week 1 before connecting anything",
    });
  }
  risks.push(
    soloOperator
      ? {
          risk: "Review time competes with day-to-day work",
          mitigation: "Block a fixed daily slot to review AI output during the pilot",
        }
      : {
          risk: "Low team adoption",
          mitigation: "Brief the team on what the AI handles and what they still own before launch",
        }
  );

  return {
    week1: {
      workflows: workflows.slice(0, 3).map((w) => `${w.label}: ${w.problem}`),
      repetitiveTasks: first.aiHandles,
      dataNeeded: [
        ...first.dataNeeded,
        ...(source.currentSoftware.length === 0 ? ["A list of every tool the team uses today (none were reported)"] : []),
      ],
      systems: first.integrations,
      policies,
    },
    week2WorkflowKey: first.key,
    week3: {
      testCases: first.testCases,
      humanReview: [
        "Review every AI output for the first two weeks",
        firstFacing
          ? `${reviewer} approves customer-facing output before it is sent`
          : `${reviewer} approves output before it changes records`,
        "Keep a log of each correction and why it was needed",
      ],
      qualityChecks: [
        "Accuracy against source data or approved answers",
        "Tone and consistency with how your business communicates",
        "Correct handoff to a person when the AI is unsure",
      ],
      adjustments: [
        "Tighten instructions and templates for recurring mistakes",
        "Narrow the scope of any task that keeps producing errors",
        "Re-run the failed test cases after each change",
      ],
    },
    week4: {
      launchChecklist: [
        `Integrations connected and tested: ${first.integrations.map((i) => i.name).join(", ")}`,
        "Escalation path documented and tested end to end",
        soloOperator
          ? "Your review routine written down so it survives busy weeks"
          : "Team briefed on what the AI handles and what they still own",
        "Baseline recorded for every KPI below",
        "Review level agreed for after launch (for example, spot-check 20% after a clean test week)",
      ],
      kpis: first.kpis,
      monitoring: [
        `${reviewer} reviews exceptions daily for two weeks, then weekly`,
        "Weekly KPI check against the baseline",
        "An agreed pause switch if the error rate rises",
      ],
      escalation: [
        `Anything outside the approved scope goes to ${reviewer === "You" ? "you" : first.owner}`,
        "Escalations are answered within an agreed response time",
        "Each escalation is tagged so recurring gaps get fixed",
      ],
    },
    risks,
    nextAction: deployAction(first),
  };
}

function mergeIntegrations(workflows: RoadmapWorkflow[]): IntegrationNeed[] {
  const merged = new Map<string, IntegrationNeed>();
  for (const need of workflows.flatMap((w) => w.integrations)) {
    const existing = merged.get(need.name);
    if (!existing || (existing.status === "to_confirm" && need.status === "reported")) merged.set(need.name, need);
  }
  return [...merged.values()];
}

function buildFlows(workflows: RoadmapWorkflow[]): ConnectedFlow[] {
  const groups = new Map<FlowGroup, RoadmapWorkflow[]>();
  for (const w of workflows) {
    const g = KINDS[w.key as KindKey].flowGroup;
    groups.set(g, [...(groups.get(g) ?? []), w]);
  }
  return [...groups.entries()].map(([group, items]) => {
    const meta = FLOW_META[group];
    const steps: FlowStep[] = [{ label: meta.entry, type: "system" }];
    let crmAdded = false;
    for (const w of [...items].sort((a, b) => KINDS[a.key as KindKey].flowRank - KINDS[b.key as KindKey].flowRank)) {
      steps.push({ label: w.label, type: "ai" });
      const crm = w.integrations.find((i) => i.name === "CRM");
      if (crm && !crmAdded) {
        steps.push({ label: crm.matched ? `CRM (${crm.matched})` : "CRM (to set up)", type: "system" });
        crmAdded = true;
      }
    }
    steps.push({ label: meta.exit, type: "human" });
    return { name: meta.name, steps };
  });
}

function ninetyRisks(workflows: RoadmapWorkflow[]): Risk[] {
  const risks = workflows.slice(1).flatMap((w) => w.risks.slice(0, 1));
  if (mergeIntegrations(workflows).length >= 3) {
    risks.push({
      risk: "Too many tools connected at once",
      mitigation: "Connect one integration at a time and test each before adding the next",
    });
  }
  risks.push({
    risk: "Over-automation as workflows start feeding each other",
    mitigation: "Keep a human checkpoint at every handoff that affects customers or money",
  });
  return risks;
}

function buildYear(
  source: RoadmapSource,
  workflows: RoadmapWorkflow[],
  knownPains: string[],
  soloOperator: boolean
): DetailedRoadmap["year"] {
  const early = workflows.filter((w) => ["week2", "days31_60", "days61_90"].includes(w.slot));
  const q2 = workflows.filter((w) => w.slot === "months4_6");
  const q3 = workflows.filter((w) => w.slot === "months7_9");
  const covered = new Set(workflows.flatMap((w) => KINDS[w.key as KindKey].departments));
  const uncoveredDepartments = source.departments.filter((d) => d !== "Other" && !covered.has(d));
  const coveredPains = new Set(workflows.flatMap((w) => w.impact.relatedPains));
  const uncoveredPains = knownPains.filter((p) => !coveredPains.has(p));
  const groups = new Set(workflows.map((w) => KINDS[w.key as KindKey].flowGroup));
  const integrationNames = mergeIntegrations(early).map((i) => i.name);

  const bottleneck: string[] = [];
  if (groups.has("revenue")) bottleneck.push("If lead volume rises, check that follow-up and sales capacity keep pace");
  if (groups.has("service"))
    bottleneck.push("If more tickets are resolved automatically, fill the knowledge-base gaps that remain");
  if (groups.has("backoffice"))
    bottleneck.push("Find the approval step that now slows the back-office workflow and simplify it");

  const quarters = [
    {
      label: "Months 1–3",
      title: "Foundation",
      items: [
        ...early.map((w) => `Deploy ${w.employeeName} for ${w.label.toLowerCase()} (${w.slotLabel.split(" · ")[1]})`),
        ...(integrationNames.length ? [`Connect: ${integrationNames.join(", ")}`] : []),
        "Write an SOP for each live workflow covering scope, review rules and escalation",
        "Record KPI baselines before each launch",
        soloOperator
          ? "Set a fixed weekly routine for reviewing AI output"
          : "Train the people who review AI output and handle escalations",
      ],
    },
    {
      label: "Months 4–6",
      title: "Automation",
      items: [
        ...q2.map((w) => `Deploy ${w.employeeName} for ${w.label.toLowerCase()}`),
        ...uncoveredDepartments.slice(0, 2).map((d) => `Assess ${d} for its first AI workflow`),
        ...(early.length > 1 ? ["Connect live workflows so handoffs no longer need re-entry"] : []),
        "Start a monthly AI performance report covering hours, errors and escalations",
        ...(!q2.length && workflows[0]
          ? [`Expand ${workflows[0].label.toLowerCase()} to more of the work it already handles well`]
          : []),
      ],
    },
    {
      label: "Months 7–9",
      title: "Optimization",
      items: [
        ...q3.map((w) => `Deploy ${w.employeeName} for ${w.label.toLowerCase()}`),
        "Compare each workflow's KPIs with its baseline, then keep, fix or retire it",
        "Update instructions and templates from the most common corrections",
        "Reduce human review only where error rates have stayed low",
        ...bottleneck,
        "Extend the best-performing workflow to similar tasks",
      ],
    },
    {
      label: "Months 10–12",
      title: "AI-Powered Operations",
      items: [
        "Run connected workflows with human checkpoints at every customer- or money-affecting step",
        "Automate weekly and monthly reporting across all AI workflows",
        "Hold a governance review: access, approval rules and owners",
        ...uncoveredPains.slice(0, 2).map((p) => `Next year: address “${p}”, which this plan doesn't cover yet`),
        "Set next year's targets from measured results rather than estimates",
      ],
    },
  ];

  return {
    quarters,
    risks: [
      {
        risk: "A listing changes or is discontinued",
        mitigation: "Keep SOPs tool-agnostic and review the alternatives in the deployment plan",
      },
      {
        risk: "Privacy and security exposure grows with each new connection",
        mitigation: "Review AI access quarterly and remove anything a workflow no longer needs",
      },
      {
        risk: "Automation drifts from how the business actually works",
        mitigation: "Owners re-test each workflow against real cases every quarter",
      },
    ],
    nextAction: workflows.length
      ? {
          title: "Schedule a quarterly AI review",
          detail: "Review KPIs against baseline for every live workflow and decide what to expand, adjust or retire.",
          setupTime: null,
          requires: ["KPI baselines from Week 1", "One owner per workflow"],
          impact: null,
          employeeId: null,
        }
      : null,
  };
}

function buildGovernance(workflows: RoadmapWorkflow[]): Governance {
  return {
    allowed: workflows.map((w) => `${w.label}: ${joinPhrases(w.aiHandles.slice(0, 2).map((h) => h.toLowerCase()))}`),
    needsApproval: [
      ...workflows.map((w) => `${w.label}: ${w.humanHandles[0].toLowerCase()}`),
      "Anything sent to customers during a workflow's first 30 days",
      "Any payment, refund, pricing or contractual commitment",
    ],
    dataAccess: [
      ...workflows.map((w) => `${w.label}: ${w.integrations.map((i) => i.name).join(", ")}`),
      "No access to credentials, payroll or personal records unless a workflow requires it",
    ],
    owners: workflows.map((w) => `${w.label}: ${w.owner}`),
    review: [
      "Weekly: the owner checks KPIs, exceptions and a sample of outputs",
      "Monthly: review corrections and escalations across all workflows",
      "Quarterly: decide whether to expand, adjust or retire each workflow",
    ],
    onError: [
      "Correct the output and tell anyone affected",
      "Log the error and its cause",
      "Return the workflow to full human review until the fix is verified",
      "Pause the workflow if the same error happens again",
    ],
    updates: [
      "Change instructions or templates in one place and note what changed",
      "Test changes on sample inputs before they go live",
      "The owner approves any change to customer-facing behaviour",
    ],
  };
}

function phaseImpact(
  label: string,
  windowWeeks: number,
  workflows: RoadmapWorkflow[],
  hourlyRate: number | null,
  note: string
): PhaseImpact {
  const slotOf = (w: RoadmapWorkflow) => SLOTS.find((s) => s.slot === w.slot)!;
  const estimated = workflows.filter((w) => w.impact.hoursPerWeekHigh != null);
  let hoursLow: number | null = null;
  let hoursHigh: number | null = null;
  if (estimated.length) {
    let low = 0;
    let high = 0;
    for (const w of estimated) {
      const liveWeeks = Math.max(0, windowWeeks - slotOf(w).launchWeek);
      low += (w.impact.hoursPerWeekLow ?? 0) * liveWeeks;
      high += (w.impact.hoursPerWeekHigh ?? 0) * liveWeeks;
    }
    hoursLow = Math.round(low);
    hoursHigh = Math.round(high);
  }

  const deployed = workflows.filter((w) => slotOf(w).startWeek < windowWeeks);
  let investment: number | null = null;
  const investmentPartial = deployed.some((w) => w.impact.annualInvestment == null);
  for (const w of deployed) {
    if (w.impact.annualInvestment == null) continue;
    const months = Math.ceil((windowWeeks - slotOf(w).startWeek) / WEEKS_PER_MONTH);
    investment = (investment ?? 0) + (w.impact.annualInvestment / 12) * months;
  }
  if (investment != null) investment = Math.round(investment);

  const valueLow = hoursLow != null && hourlyRate ? roundTo(hoursLow * hourlyRate, 100) : null;
  const valueHigh = hoursHigh != null && hourlyRate ? roundTo(hoursHigh * hourlyRate, 100) : null;
  const netable = investment != null && !investmentPartial ? investment : null;

  return {
    label,
    hoursLow,
    hoursHigh,
    valueLow,
    valueHigh,
    investment,
    investmentPartial,
    netLow: valueLow != null && netable != null ? valueLow - netable : null,
    netHigh: valueHigh != null && netable != null ? valueHigh - netable : null,
    note,
  };
}

function buildAssumptions(
  source: RoadmapSource,
  knownPains: string[],
  reportHours: number | null,
  hourlyRate: number | null
): string[] {
  const assumptions: string[] = [];
  if (reportHours) {
    assumptions.push(
      `Hours start from your AI Report's estimate of ${reportHours} hours/month of automatable work, based on team size (${
        source.employeeCount ?? "not provided"
      }) and ${knownPains.length} reported pain point${knownPains.length === 1 ? "" : "s"}.`
    );
    assumptions.push(
      "Each workflow's share follows how automatable its related pain points are. A pain point addressed by several workflows is split evenly between them."
    );
    assumptions.push(
      "Ranges use 60–100% of that share, because realized time savings depend on adoption, data quality and review time."
    );
  } else {
    assumptions.push("Your report has no hours estimate, so time savings aren't estimated.");
  }
  assumptions.push(
    hourlyRate
      ? `Labor value uses a blended $${hourlyRate}/hour for businesses reporting ${source.revenueRange} in revenue.`
      : "No revenue range was provided, so labor value isn't estimated."
  );
  assumptions.push(
    "AI investment uses each listing's published monthly price. Listings without published pricing are excluded and marked."
  );
  assumptions.push(
    "Phase totals assume each workflow goes live after its test period: the first around week 4, the second around week 8 and the third around week 12."
  );
  assumptions.push("Difficulty levels and setup times are approximate bands, not quotes.");
  assumptions.push(
    "None of these figures are guaranteed. Record your own baseline in Week 1 and replace estimates with measured results."
  );
  return assumptions;
}
