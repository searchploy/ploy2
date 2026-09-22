"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { saveSubscriptionAction } from "./actions";

export interface SubscriptionFormClient {
  id: string;
  business_name: string;
}

export interface SubscriptionFormData {
  client_id: string;
  employee_name: string;
  vendor_name: string | null;
  vendor_url: string | null;
  vendor_cost_cents: number | null;
  setup_fee_cents: number | null;
  monthly_fee_cents: number | null;
  status: string | null;
  notes: string | null;
  started_on: string | null;
}

/** Cents in the database, dollars in the UI. */
function centsToDollars(cents: number | null | undefined): string {
  return cents != null ? String(cents / 100) : "";
}

function MoneyField({
  id,
  name,
  label,
  hint,
  defaultValue,
  placeholder,
}: {
  id: string;
  name: string;
  label: string;
  hint: string;
  defaultValue: string;
  placeholder: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">$</span>
        <Input
          id={id}
          name={name}
          type="number"
          min={0}
          step="0.01"
          inputMode="decimal"
          defaultValue={defaultValue}
          placeholder={placeholder}
        />
      </div>
      <p className="text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

export function SubscriptionForm({
  clients,
  subscriptionId,
  initialData,
}: {
  clients: SubscriptionFormClient[];
  subscriptionId?: string;
  initialData?: SubscriptionFormData;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [clientId, setClientId] = useState(initialData?.client_id ?? "");
  const [status, setStatus] = useState(initialData?.status ?? "Active");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData(e.currentTarget);
      await saveSubscriptionAction(formData, subscriptionId);
      toast.success(subscriptionId ? "Subscription updated" : "Subscription added");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  if (clients.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <p className="text-muted-foreground">
          Add a client first — a subscription is always attached to one.
        </p>
        <Button asChild className="mt-4" variant="gradient">
          <a href="/dashboard/consultant/clients/new">Add a client</a>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="clientId">Client *</Label>
          <Select value={clientId} onValueChange={setClientId} name="clientId">
            <SelectTrigger id="clientId">
              <SelectValue placeholder="Pick a client..." />
            </SelectTrigger>
            <SelectContent>
              {clients.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.business_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="employeeName">AI Tool *</Label>
          <Input
            id="employeeName"
            name="employeeName"
            required
            defaultValue={initialData?.employee_name ?? ""}
            placeholder="e.g. Hearth — Customer Support Agent"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="vendorName">Vendor</Label>
          <Input
            id="vendorName"
            name="vendorName"
            defaultValue={initialData?.vendor_name ?? ""}
            placeholder="Northbeam AI"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="vendorUrl">Where you bought it</Label>
          <Input
            id="vendorUrl"
            name="vendorUrl"
            type="url"
            defaultValue={initialData?.vendor_url ?? ""}
            placeholder="https://vendor.com/pricing"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <MoneyField
          id="vendorCost"
          name="vendorCost"
          label="Vendor cost / mo"
          hint="What the vendor bills. Pass-through, not your revenue."
          defaultValue={centsToDollars(initialData?.vendor_cost_cents)}
          placeholder="200"
        />
        <MoneyField
          id="setupFee"
          name="setupFee"
          label="Your setup fee"
          hint="One-time, what you charged to implement it."
          defaultValue={centsToDollars(initialData?.setup_fee_cents)}
          placeholder="900"
        />
        <MoneyField
          id="monthlyFee"
          name="monthlyFee"
          label="Your fee / mo"
          hint="Recurring, what you charge to manage it."
          defaultValue={centsToDollars(initialData?.monthly_fee_cents)}
          placeholder="350"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={setStatus} name="status">
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Paused">Paused</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="startedOn">Started on</Label>
          <Input
            id="startedOn"
            name="startedOn"
            type="date"
            defaultValue={initialData?.started_on ?? ""}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="notes">Setup notes</Label>
        <Textarea
          id="notes"
          name="notes"
          defaultValue={initialData?.notes ?? ""}
          placeholder="Which plan, what you configured, who the account is under, anything you'd need to remember six months from now..."
          rows={4}
        />
      </div>

      <div className="flex justify-end gap-3 border-t pt-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving} variant="gradient">
          {saving ? "Saving..." : subscriptionId ? "Update subscription" : "Add subscription"}
        </Button>
      </div>
    </form>
  );
}
