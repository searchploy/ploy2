import type { Order } from "@/lib/types/mock";
import { DEMO_BUSINESS_USER_ID, DEMO_AGENCY_ID } from "./users";

function makeOrder(partial: Partial<Order> & Pick<Order, "id" | "employee_id" | "amount_cents" | "status" | "created_at">): Order {
  return {
    buyer_id: DEMO_BUSINESS_USER_ID,
    agency_id: DEMO_AGENCY_ID,
    pricing_id: null,
    commission_pct: 15,
    commission_cents: Math.round(partial.amount_cents * 0.15),
    agency_payout_cents: partial.amount_cents - Math.round(partial.amount_cents * 0.15),
    notes: null,
    updated_at: partial.created_at,
    ...partial,
  };
}

export const orders: Order[] = [
  makeOrder({ id: "order-1", employee_id: "emp-ai-sales-rep", amount_cents: 99900, status: "completed", created_at: "2026-06-01" }),
  makeOrder({ id: "order-2", employee_id: "emp-ai-sdr", amount_cents: 79900, status: "completed", created_at: "2026-05-12" }),
  makeOrder({ id: "order-3", employee_id: "emp-ai-executive-assistant", amount_cents: 64900, status: "fulfilling", created_at: "2026-06-20" }),
  makeOrder({ id: "order-4", employee_id: "emp-ai-support-agent", amount_cents: 69900, status: "paid", created_at: "2026-06-28", agency_id: "agency-hearthq" }),
  makeOrder({ id: "order-5", employee_id: "emp-ai-bookkeeper", amount_cents: 49900, status: "completed", created_at: "2026-04-02", agency_id: "agency-ledger-labs" }),
  makeOrder({ id: "order-6", employee_id: "emp-ai-appointment-setter", amount_cents: 59900, status: "cancelled", created_at: "2026-03-18" }),
];

export async function getOrdersForBuyer(userId: string): Promise<Order[]> {
  return orders.filter((o) => o.buyer_id === userId);
}

export async function getOrdersForAgency(agencyId: string): Promise<Order[]> {
  return orders.filter((o) => o.agency_id === agencyId);
}

export async function getAllOrdersForAdmin(): Promise<Order[]> {
  return orders;
}
