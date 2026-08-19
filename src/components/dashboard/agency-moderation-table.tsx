"use client";

import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { Check, X, Ban } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/dashboard/status-badge";
import type { Agency, AgencyStatus } from "@/lib/types/mock";

export function AgencyModerationTable({ initialAgencies }: { initialAgencies: Agency[] }) {
  const [agencies, setAgencies] = useState(initialAgencies);

  function updateStatus(id: string, status: AgencyStatus) {
    // In production this calls a Server Action that updates `agencies.status`
    // and fires a `listing_approved` / `listing_rejected` notification.
    setAgencies((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    const agency = agencies.find((a) => a.id === id);
    toast.success(`${agency?.name} ${status}`);
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Agency</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Headquarters</TableHead>
          <TableHead>Verified</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {agencies.map((agency) => (
          <TableRow key={agency.id}>
            <TableCell>
              <Link href={`/agencies/${agency.slug}`} className="font-medium hover:text-ploy-gold">
                {agency.name}
              </Link>
              <p className="text-xs text-muted-foreground">{agency.tagline}</p>
            </TableCell>
            <TableCell>
              <StatusBadge status={agency.status} />
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">{agency.headquarters ?? "—"}</TableCell>
            <TableCell className="text-sm text-muted-foreground">{agency.is_verified ? "Yes" : "No"}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                {agency.status !== "approved" && (
                  <Button size="sm" variant="outline" onClick={() => updateStatus(agency.id, "approved")}>
                    <Check className="h-3.5 w-3.5" /> Approve
                  </Button>
                )}
                {agency.status !== "rejected" && agency.status !== "approved" && (
                  <Button size="sm" variant="outline" onClick={() => updateStatus(agency.id, "rejected")}>
                    <X className="h-3.5 w-3.5" /> Reject
                  </Button>
                )}
                {agency.status === "approved" && (
                  <Button size="sm" variant="outline" onClick={() => updateStatus(agency.id, "suspended")}>
                    <Ban className="h-3.5 w-3.5" /> Suspend
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
