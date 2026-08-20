"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { saveClientAction } from "./actions";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ClientFormProps {
  clientId?: string;
  initialData?: {
    business_name: string;
    industry: string | null;
    contact_name: string | null;
    email: string | null;
    phone: string | null;
    status: string;
    notes: string | null;
    deal_value_cents?: number | null;
  };
}

/** Cents in the database, dollars in the UI. */
function centsToDollars(cents: number | null | undefined): string {
  return cents != null ? String(cents / 100) : "";
}

export function ClientForm({ clientId, initialData }: ClientFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [status, setStatus] = useState(initialData?.status || "Lead");
  const [dealValue, setDealValue] = useState(centsToDollars(initialData?.deal_value_cents));
  const [dealDialogOpen, setDealDialogOpen] = useState(false);
  // What the amount was before the dialog opened, so Cancel can put it back
  // rather than leaving a half-typed figure behind.
  const [dealValueBeforeEdit, setDealValueBeforeEdit] = useState(dealValue);

  function handleStatusChange(next: string) {
    setStatus(next);
    // Ask for the amount as soon as the deal is marked closed — that's the
    // moment the consultant knows it, and it's what Est. Revenue sums.
    if (next === "Closed") {
      setDealValueBeforeEdit(dealValue);
      setDealDialogOpen(true);
    }
  }

  function cancelDealDialog() {
    setDealValue(dealValueBeforeEdit);
    setDealDialogOpen(false);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData(e.currentTarget);
      await saveClientAction(formData, clientId);
      toast.success(clientId ? "Client updated" : "Client added");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="businessName">Business Name *</Label>
          <Input
            id="businessName"
            name="businessName"
            required
            defaultValue={initialData?.business_name || ""}
            placeholder="Acme Corp"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="industry">Industry</Label>
          <Input
            id="industry"
            name="industry"
            defaultValue={initialData?.industry || ""}
            placeholder="Technology"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="contactName">Contact Name</Label>
          <Input
            id="contactName"
            name="contactName"
            defaultValue={initialData?.contact_name || ""}
            placeholder="John Smith"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={initialData?.email || ""}
            placeholder="john@acme.com"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            defaultValue={initialData?.phone || ""}
            placeholder="+1 (555) 000-0000"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="status">Status *</Label>
          <Select value={status} onValueChange={handleStatusChange} name="status">
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Lead">Lead</SelectItem>
              <SelectItem value="Discovery Call">Discovery Call</SelectItem>
              <SelectItem value="Report Sent">Report Sent</SelectItem>
              <SelectItem value="Proposal Sent">Proposal Sent</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          {status === "Closed" && (
            <button
              type="button"
              onClick={() => {
                setDealValueBeforeEdit(dealValue);
                setDealDialogOpen(true);
              }}
              className="self-start text-xs text-ploy-gold hover:underline"
            >
              {dealValue ? `Deal value: $${Number(dealValue).toLocaleString()}` : "Add deal value"}
            </button>
          )}
        </div>
      </div>

      {/* Submitted with the form so the amount saves in the same write as the
          status — never a second request that could fail on its own. */}
      <input type="hidden" name="dealValue" value={status === "Closed" ? dealValue : ""} />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          defaultValue={initialData?.notes || ""}
          placeholder="Internal notes about this client..."
          rows={4}
        />
      </div>

      <div className="flex gap-3 justify-end pt-4 border-t">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving} variant="gradient">
          {saving ? "Saving..." : clientId ? "Update Client" : "Add Client"}
        </Button>
      </div>

      <Dialog open={dealDialogOpen} onOpenChange={(open) => !open && cancelDealDialog()}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>How much did you make?</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              This adds to Est. Revenue on your dashboard. You can leave it blank and add it later.
            </p>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="dealValueInput">Deal value</Label>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">$</span>
                <Input
                  id="dealValueInput"
                  type="number"
                  min={0}
                  step="0.01"
                  inputMode="decimal"
                  autoFocus
                  value={dealValue}
                  placeholder="2500"
                  onChange={(e) => setDealValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      setDealDialogOpen(false);
                    }
                  }}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={cancelDealDialog}>
                Cancel
              </Button>
              <Button type="button" onClick={() => setDealDialogOpen(false)}>
                Done
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </form>
  );
}
