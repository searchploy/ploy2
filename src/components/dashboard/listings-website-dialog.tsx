"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateListingWebsite } from "@/app/dashboard/admin/listings/actions";

function normaliseUrl(input: string): string {
  if (!input.trim()) return "";
  const trimmed = input.trim();
  return trimmed.startsWith("http://") || trimmed.startsWith("https://")
    ? trimmed
    : `https://${trimmed}`;
}

export function ListingsWebsiteDialog({
  listing,
  open,
  onOpenChange,
}: {
  listing?: {
    id: string;
    name: string;
    website_url?: string | null;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [websiteUrl, setWebsiteUrl] = useState(listing?.website_url ?? "");
  const [saving, setSaving] = useState(false);

  if (!listing) return null;

  const handleSave = async () => {
    const normalized = normaliseUrl(websiteUrl);
    if (normalized && !normalized.match(/^https?:\/\/.+\./)) {
      toast.error("Invalid URL", { description: "Please enter a valid website URL." });
      return;
    }

    setSaving(true);
    try {
      const result = await updateListingWebsite(listing.id, normalized || null);
      if (result.ok) {
        toast.success("Website updated", {
          description: `${listing.name}'s website has been changed.`,
        });
        onOpenChange(false);
      } else {
        toast.error("Failed to update website", { description: result.error });
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit website for {listing.name}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="website">Website URL</Label>
            <Input
              id="website"
              type="url"
              placeholder="example.com or https://example.com"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Leave blank to remove the website link
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="button" variant="gradient" disabled={saving} onClick={handleSave}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
