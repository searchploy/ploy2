import type { Commission, CommissionStatus } from "@/lib/types/mock";
import { orders } from "./orders";

const statusForOrderStatus: Record<string, CommissionStatus> = {
  completed: "paid_out",
  paid: "cleared",
  fulfilling: "cleared",
  pending: "pending",
  cancelled: "pending",
  refunded: "pending",
};

export const commissions: Commission[] = orders
  .filter((o) => o.status !== "cancelled")
  .map((o) => ({
    id: `commission-${o.id}`,
    order_id: o.id,
    agency_id: o.agency_id,
    amount_cents: o.commission_cents,
    status: statusForOrderStatus[o.status] ?? "pending",
    cleared_at: o.status !== "pending" ? o.updated_at : null,
    paid_out_at: o.status === "completed" ? o.updated_at : null,
    created_at: o.created_at,
  }));

export async function getCommissionsForAgency(agencyId: string): Promise<Commission[]> {
  return commissions.filter((c) => c.agency_id === agencyId);
}

export async function getAllCommissionsForAdmin(): Promise<Commission[]> {
  return commissions;
}
