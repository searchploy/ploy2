"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  };
}

export function ClientForm({ clientId, initialData }: ClientFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

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
          <Select defaultValue={initialData?.status || "Lead"} name="status">
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
        </div>
      </div>

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
    </form>
  );
}
