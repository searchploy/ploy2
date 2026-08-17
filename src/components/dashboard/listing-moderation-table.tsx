"use client";

import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { Check, X, Star, MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertDialog } from "@/components/dashboard/alert-dialog";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { cn, formatCurrency } from "@/lib/utils";
import type { Employee, EmployeeStatus } from "@/lib/types/mock";

export function ListingModerationTable({
  initialEmployees,
  agencyNameById,
  editBasePath = "/dashboard/admin/listings",
}: {
  initialEmployees: Employee[];
  agencyNameById: Record<string, string>;
  editBasePath?: string;
}) {
  const [employees, setEmployees] = useState(initialEmployees);
  const [pendingDelete, setPendingDelete] = useState<Employee | null>(null);

  function updateStatus(id: string, status: EmployeeStatus) {
    setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
    const employee = employees.find((e) => e.id === id);
    toast.success(`${employee?.name} ${status.replace("_", " ")}`);
  }

  function toggleFeatured(id: string) {
    setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, is_featured: !e.is_featured } : e)));
  }

  function confirmDelete() {
    if (!pendingDelete) return;
    // In production this calls a Server Action that deletes the row in
    // Supabase (cascading to images/features/pricing) — simulated here.
    setEmployees((prev) => prev.filter((e) => e.id !== pendingDelete.id));
    toast.success("Listing deleted", { description: `${pendingDelete.name} was removed from the marketplace.` });
    setPendingDelete(null);
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Agency</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell>
                <Link href={`/marketplace/${employee.slug}`} className="font-medium hover:text-ploy-blue">
                  {employee.name}
                </Link>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{agencyNameById[employee.agency_id] ?? "—"}</TableCell>
              <TableCell>{formatCurrency(employee.starting_price_cents)}/mo</TableCell>
              <TableCell>
                <StatusBadge status={employee.status} />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleFeatured(employee.id)}
                    title="Toggle featured"
                  >
                    <Star className={cn("h-3.5 w-3.5", employee.is_featured && "fill-amber-400 text-amber-400")} />
                  </Button>
                  {employee.status !== "published" && (
                    <Button size="sm" variant="outline" onClick={() => updateStatus(employee.id, "published")}>
                      <Check className="h-3.5 w-3.5" /> Approve
                    </Button>
                  )}
                  {employee.status !== "rejected" && (
                    <Button size="sm" variant="outline" onClick={() => updateStatus(employee.id, "rejected")}>
                      <X className="h-3.5 w-3.5" /> Reject
                    </Button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/marketplace/${employee.slug}`}>
                          <Eye className="h-3.5 w-3.5" /> View live
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`${editBasePath}/${employee.id}/edit`}>
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setPendingDelete(employee)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Delete listing?"
        description={`This will permanently remove "${pendingDelete?.name}" from the marketplace. This can't be undone.`}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
      />
    </>
  );
}
