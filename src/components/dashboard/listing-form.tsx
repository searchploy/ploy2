"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categories } from "@/lib/data/categories";
import type { Employee, PricingModel } from "@/lib/types/mock";

export function ListingForm({
  employee,
  agencies,
  redirectTo = "/account/marketplace/listing",
}: {
  employee?: Employee;
  /** Admin-only: when provided, renders an agency picker so an admin can create/reassign a listing. */
  agencies?: { id: string; name: string }[];
  redirectTo?: string;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const isEdit = Boolean(employee);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    // In production this calls a Server Action that upserts into
    // `employees` (+ features/pricing/images) via Supabase.
    await new Promise((r) => setTimeout(r, 700));
    setSaving(false);
    toast.success(isEdit ? "Listing updated" : "Listing created", {
      description: isEdit ? "Your changes are live." : "Your new AI employee is pending review.",
    });
    router.push(redirectTo);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <Card className="flex flex-col gap-6 p-6">
        {agencies && (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="agency">Agency</Label>
            <Select defaultValue={employee?.agency_id ?? agencies[0]?.id}>
              <SelectTrigger id="agency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {agencies.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}


        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Employee name</Label>
            <Input id="name" name="name" required defaultValue={employee?.name} placeholder="AI Sales Rep" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="category">Primary category</Label>
            <Select defaultValue="cat-sales">
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="tagline">Tagline</Label>
          <Input id="tagline" name="tagline" required defaultValue={employee?.tagline} placeholder="One sentence describing what it does" maxLength={100} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" required defaultValue={employee?.description} rows={5} placeholder="Describe what this AI employee does and how it works..." />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="price">Starting price (USD/mo)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              min={0}
              required
              defaultValue={employee ? employee.starting_price_cents / 100 : undefined}
              placeholder="799"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="pricing_model">Billing period</Label>
            <Select defaultValue={(employee?.pricing_model as PricingModel) ?? "monthly"}>
              <SelectTrigger id="pricing_model">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="annual">Annual</SelectItem>
                <SelectItem value="one_time">One-time</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="software">Supported software (comma separated)</Label>
          <Input
            id="software"
            name="software"
            defaultValue={employee?.supported_software.join(", ")}
            placeholder="Salesforce, HubSpot, Slack"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="industries">Industries (comma separated)</Label>
          <Input id="industries" name="industries" defaultValue={employee?.industries.join(", ")} placeholder="SaaS, Ecommerce" />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="website">Website URL</Label>
          <Input id="website" name="website" type="url" defaultValue={employee?.website_url ?? ""} placeholder="https://example.com" />
        </div>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving} variant="gradient">
          {saving ? "Saving..." : isEdit ? "Save changes" : "Create listing"}
        </Button>
      </div>
    </form>
  );
}
