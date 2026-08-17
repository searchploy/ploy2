import type { Notification } from "@/lib/types/mock";

export const notifications: Notification[] = [
  { id: "notif-1", user_id: "user-agency-1", type: "demo_request", title: "New demo request", body: "Priya Nair requested a demo of AI Sales Rep.", link: "/dashboard/agency/leads", read_at: null, created_at: "2026-07-05" },
  { id: "notif-2", user_id: "user-agency-1", type: "order_paid", title: "New order paid", body: "AI Customer Support Agent order was paid.", link: "/dashboard/agency/sales", read_at: null, created_at: "2026-06-28" },
  { id: "notif-3", user_id: "user-business-demo", type: "listing_approved", title: "Onboarding scheduled", body: "Northbeam AI confirmed your onboarding call.", link: "/dashboard/business/messages", read_at: "2026-06-03", created_at: "2026-06-02" },
];

export async function getNotificationsForUser(userId: string): Promise<Notification[]> {
  return notifications.filter((n) => n.user_id === userId);
}
