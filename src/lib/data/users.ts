import type { User } from "@/lib/types/mock";

/**
 * Demo identities used to populate the dashboards without a live Supabase
 * session. In production these are replaced by `getServerUser()` in
 * `src/lib/supabase/server.ts`, which reads the authenticated user from
 * the Supabase session cookie.
 */
export const DEMO_BUSINESS_USER_ID = "user-business-demo";
export const DEMO_AGENCY_ID = "agency-northbeam";
export const DEMO_AGENCY_USER_ID = "user-agency-1";
export const DEMO_ADMIN_USER_ID = "user-admin-demo";

export const demoUsers: User[] = [
  {
    id: DEMO_BUSINESS_USER_ID,
    email: "avery@kindledgoods.com",
    full_name: "Avery Collins",
    avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    role: "business",
    is_admin: false,
    company_name: "Kindled Goods",
    phone: "+1 (415) 555-0182",
    onboarded: true,
    created_at: "2025-09-01",
    updated_at: "2026-06-01",
  },
  {
    id: DEMO_AGENCY_USER_ID,
    email: "theo@northbeam.example.com",
    full_name: "Theo Marchetti",
    avatar_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop",
    role: "agency",
    is_admin: false,
    company_name: "Northbeam AI",
    phone: "+1 (512) 555-0110",
    onboarded: true,
    created_at: "2025-01-10",
    updated_at: "2026-06-01",
  },
  {
    id: DEMO_ADMIN_USER_ID,
    email: "admin@ploy.com",
    full_name: "Ploy Admin",
    avatar_url: null,
    role: "admin",
    is_admin: true,
    company_name: "Ploy",
    phone: null,
    onboarded: true,
    created_at: "2024-12-01",
    updated_at: "2026-06-01",
  },
];

export async function getDemoUser(id: string): Promise<User | undefined> {
  return demoUsers.find((u) => u.id === id);
}

/** A broader set of platform users, used only to populate the admin "Users" table. */
export const adminUserDirectory: User[] = [
  ...demoUsers,
  { id: "user-b1", email: "jordan@harborworks.com", full_name: "Jordan Blake", avatar_url: null, role: "business", is_admin: false, company_name: "Harborworks", phone: null, onboarded: true, created_at: "2025-10-02", updated_at: "2026-05-02" },
  { id: "user-b2", email: "priya@brightloop.io", full_name: "Priya Nair", avatar_url: null, role: "business", is_admin: false, company_name: "BrightLoop", phone: null, onboarded: true, created_at: "2025-11-14", updated_at: "2026-04-18" },
  { id: "user-b7", email: "marcus@fieldcraft.com", full_name: "Marcus Webb", avatar_url: null, role: "business", is_admin: false, company_name: "Fieldcraft", phone: null, onboarded: true, created_at: "2025-12-01", updated_at: "2026-05-20" },
  { id: "user-agency-2", email: "team@hearthq.example.com", full_name: "Nina Okafor", avatar_url: null, role: "agency", is_admin: false, company_name: "HearthQ", phone: null, onboarded: true, created_at: "2025-02-14", updated_at: "2026-05-20" },
  { id: "user-agency-3", email: "hi@ledgerlabs.example.com", full_name: "Owen Baptiste", avatar_url: null, role: "agency", is_admin: false, company_name: "Ledger Labs", phone: null, onboarded: true, created_at: "2025-03-01", updated_at: "2026-04-11" },
  { id: "user-agency-4", email: "team@talentforge.example.com", full_name: "Isabel Ruiz", avatar_url: null, role: "agency", is_admin: false, company_name: "TalentForge", phone: null, onboarded: true, created_at: "2025-05-19", updated_at: "2026-03-02" },
];
