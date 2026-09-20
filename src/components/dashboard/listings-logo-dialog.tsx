"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LogoUpload } from "@/components/listing/logo-upload";
import { updateListingLogo } from "@/app/dashboard/admin/listings/actions";

export function ListingsLogoDialog({
  listing,
  open,
  onOpenChange,
}: {
  listing?: {
    id: string;
    name: string;
    thumbnail_url?: string | null;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [logoUrl, setLogoUrl] = useState(listing?.thumbnail_url ?? "");
  const [saving, setSaving] = useState(false);

  if (!listing) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await updateListingLogo(listing.id, logoUrl.trim() || null);
      if (result.ok) {
        toast.success("Logo updated", {
          description: `${listing.name}'s logo has been changed.`,
        });
        onOpenChange(false);
      } else {
        toast.error("Failed to update logo", { description: result.error });
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change logo for {listing.name}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-6">
          <LogoUpload value={logoUrl} onChange={setLogoUrl} />
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
