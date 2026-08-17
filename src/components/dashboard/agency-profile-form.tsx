"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { initials } from "@/lib/utils";
import type { Agency } from "@/lib/types/mock";

export function AgencyProfileForm({ agency }: { agency: Agency }) {
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    toast.success("Profile updated");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Card className="flex items-center gap-4 p-6">
        <Avatar className="h-16 w-16 border border-border">
          <AvatarImage src={agency.logo_url ?? undefined} alt={agency.name} />
          <AvatarFallback>{initials(agency.name)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{agency.name}</p>
          <Button type="button" variant="outline" size="sm" className="mt-2">
            Change logo
          </Button>
        </div>
      </Card>

      <Card className="flex flex-col gap-4 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="p_name">Agency name</Label>
            <Input id="p_name" defaultValue={agency.name} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="p_website">Website</Label>
            <Input id="p_website" defaultValue={agency.website_url ?? ""} />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="p_tagline">Tagline</Label>
          <Input id="p_tagline" defaultValue={agency.tagline ?? ""} maxLength={100} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="p_description">About</Label>
          <Textarea id="p_description" rows={5} defaultValue={agency.description ?? ""} />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="p_hq">Headquarters</Label>
            <Input id="p_hq" defaultValue={agency.headquarters ?? ""} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="p_team">Team size</Label>
            <Input id="p_team" defaultValue={agency.team_size ?? ""} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="p_founded">Founded year</Label>
            <Input id="p_founded" type="number" defaultValue={agency.founded_year ?? undefined} />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="p_twitter">Twitter/X URL</Label>
            <Input id="p_twitter" defaultValue={agency.twitter_url ?? ""} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="p_linkedin">LinkedIn URL</Label>
            <Input id="p_linkedin" defaultValue={agency.linkedin_url ?? ""} />
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={saving} variant="gradient">
          {saving ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
