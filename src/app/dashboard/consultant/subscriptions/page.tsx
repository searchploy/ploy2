import Link from "next/link";
import { Plus, Edit2, Trash2, ExternalLink, Repeat, Wrench, Receipt } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createClient, getServerUser } from "@/lib/supabase/server";
import { deleteSubscriptionAction } from "./actions";

const statusColors: Record<string, string> = {
  Active: "bg-success/15 text-success",
  Paused: "bg-ploy-gold/15 text-ploy-gold",
  Cancelled: "bg-white/[0.06] text-muted-foreground",
};

function money(cents: number) {
  return `$${(cents / 100).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

function cell(cents: number | null) {
  return cents != null ? money(cents) : "—";
}

type Subscription = {
  id: string;
  client_id: string;
  employee_name: string;
  vendor_name: string | null;
  vendor_url: string | null;
  vendor_cost_cents: number | null;
  setup_fee_cents: number | null;
  monthly_fee_cents: number | null;
  status: string | null;
  consultant_clients: { business_name: string } | null;
};

export default async function SubscriptionsPage() {
  const user = await getServerUser();
  const supabase = await createClient();

  if (!user) return <div>Not authenticated</div>;

  let subscriptions: Subscription[] = [];
  try {
    const { data } = await supabase
      .from("consultant_client_subscriptions")
      .select("*, consultant_clients(business_name)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    subscriptions = (data as Subscription[] | null) ?? [];
  } catch (e) {
    console.error("Error fetching subscriptions:", e);
  }

  // Recurring totals count active rows only — a cancelled subscription still
  // belongs in the list as history but is no longer money moving each month.
  const active = subscriptions.filter((s) => s.status === "Active");
  const sum = (rows: Subscription[], key: keyof Subscription) =>
    rows.reduce((total, row) => total + (Number(row[key]) || 0), 0);

  const stats = [
    {
      label: "Monthly recurring",
      value: money(sum(active, "monthly_fee_cents")),
      hint: "What you bill each month across active subscriptions",
      icon: <Repeat className="h-5 w-5" />,
    },
    {
      label: "Setup fees",
      value: money(sum(subscriptions, "setup_fee_cents")),
      hint: "One-time implementation fees you've charged",
      icon: <Wrench className="h-5 w-5" />,
    },
    {
      label: "Vendor cost",
      value: money(sum(active, "vendor_cost_cents")),
      hint: "What the vendors bill each month — pass-through, not your revenue",
      icon: <Receipt className="h-5 w-5" />,
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Subscriptions</h1>
          <p className="mt-1 text-muted-foreground">
            The AI tools you&apos;ve set up for clients, and what each one bills
          </p>
        </div>
        <Button asChild variant="gradient">
          <Link href="/dashboard/consultant/subscriptions/new">
            <Plus className="h-4 w-4" />
            Add subscription
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="mt-2 text-3xl font-semibold">{stat.value}</p>
              </div>
              <div className="text-ploy-gold opacity-60">{stat.icon}</div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">{stat.hint}</p>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>AI Tool</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead className="text-right">Vendor / mo</TableHead>
                <TableHead className="text-right">Setup</TableHead>
                <TableHead className="text-right">Your fee / mo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.length > 0 ? (
                subscriptions.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-medium">
                      {sub.consultant_clients?.business_name ?? "—"}
                    </TableCell>
                    <TableCell>{sub.employee_name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {sub.vendor_url ? (
                        <a
                          href={sub.vendor_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 hover:text-foreground"
                        >
                          {sub.vendor_name || "Vendor site"}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        sub.vendor_name || "—"
                      )}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm text-muted-foreground">
                      {cell(sub.vendor_cost_cents)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {cell(sub.setup_fee_cents)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">
                      {cell(sub.monthly_fee_cents)}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${statusColors[sub.status ?? ""] || "bg-secondary"} border-0`}>
                        {sub.status ?? "—"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button asChild size="sm" variant="ghost">
                          <Link href={`/dashboard/consultant/subscriptions/${sub.id}/edit`}>
                            <Edit2 className="h-4 w-4" />
                          </Link>
                        </Button>
                        <form action={deleteSubscriptionAction}>
                          <input type="hidden" name="id" value={sub.id} />
                          <Button
                            type="submit"
                            size="sm"
                            variant="ghost"
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </form>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-3">
                      <p>Nothing set up yet</p>
                      <p className="max-w-md text-sm">
                        When you buy an AI tool subscription for a client, log it here so you
                        know what you&apos;re managing and what you&apos;re billing for it.
                      </p>
                      <Button asChild size="sm">
                        <Link href="/dashboard/consultant/subscriptions/new">
                          Add your first subscription
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
