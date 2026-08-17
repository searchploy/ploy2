import type { DemoRequest } from "@/lib/types/mock";
import { DEMO_AGENCY_ID, DEMO_BUSINESS_USER_ID } from "./users";

export const demoRequests: DemoRequest[] = [
  { id: "dr-1", employee_id: "emp-ai-sales-rep", agency_id: DEMO_AGENCY_ID, user_id: null, full_name: "Priya Nair", email: "priya@brightloop.io", company_name: "BrightLoop", message: "Curious how this integrates with our Salesforce sandbox before we roll out.", status: "new", created_at: "2026-07-05", updated_at: "2026-07-05" },
  { id: "dr-2", employee_id: "emp-ai-sdr", agency_id: DEMO_AGENCY_ID, user_id: null, full_name: "Marcus Webb", email: "marcus@fieldcraft.com", company_name: "Fieldcraft", message: "Team of 4 AEs, looking to add outbound capacity.", status: "contacted", created_at: "2026-07-01", updated_at: "2026-07-03" },
  { id: "dr-3", employee_id: "emp-ai-sales-rep", agency_id: DEMO_AGENCY_ID, user_id: null, full_name: "Elena Cruz", email: "elena@harborworks.com", company_name: "Harborworks", message: null, status: "scheduled", created_at: "2026-06-27", updated_at: "2026-06-29" },
  { id: "dr-4", employee_id: "emp-ai-marketing-manager", agency_id: DEMO_AGENCY_ID, user_id: null, full_name: "Sam Whitfield", email: "sam@loomstack.com", company_name: "Loomstack", message: "Need help scoping a Q3 campaign calendar.", status: "completed", created_at: "2026-06-10", updated_at: "2026-06-15" },
  { id: "dr-5", employee_id: "emp-ai-bookkeeper", agency_id: "agency-ledger-labs", user_id: DEMO_BUSINESS_USER_ID, full_name: "Avery Collins", email: "avery@kindledgoods.com", company_name: "Kindled Goods", message: "Want to see how it handles multi-currency transactions.", status: "scheduled", created_at: "2026-06-22", updated_at: "2026-06-24" },
  { id: "dr-6", employee_id: "emp-ai-recruiter", agency_id: "agency-talentforge", user_id: DEMO_BUSINESS_USER_ID, full_name: "Avery Collins", email: "avery@kindledgoods.com", company_name: "Kindled Goods", message: null, status: "new", created_at: "2026-07-02", updated_at: "2026-07-02" },
];

export async function getDemoRequestsForAgency(agencyId: string): Promise<DemoRequest[]> {
  return demoRequests.filter((d) => d.agency_id === agencyId);
}

export async function getDemoRequestsForUser(userId: string): Promise<DemoRequest[]> {
  return demoRequests.filter((d) => d.user_id === userId);
}
