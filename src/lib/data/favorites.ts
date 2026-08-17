import type { Favorite } from "@/lib/types/mock";
import { DEMO_BUSINESS_USER_ID } from "./users";

export const favorites: Favorite[] = [
  { id: "fav-1", user_id: DEMO_BUSINESS_USER_ID, employee_id: "emp-ai-support-agent", created_at: "2026-06-10" },
  { id: "fav-2", user_id: DEMO_BUSINESS_USER_ID, employee_id: "emp-ai-marketing-manager", created_at: "2026-06-18" },
  { id: "fav-3", user_id: DEMO_BUSINESS_USER_ID, employee_id: "emp-ai-recruiter", created_at: "2026-06-25" },
];

export async function getFavoritesForUser(userId: string): Promise<Favorite[]> {
  return favorites.filter((f) => f.user_id === userId);
}
