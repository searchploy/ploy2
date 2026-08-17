"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertDialog } from "@/components/dashboard/alert-dialog";
import { formatCurrency } from "@/lib/utils";
import type { Employee } from "@/lib/types/mock";

export function ListingsTable({ initialEmployees }: { initialEmployees: Employee[] }) {
  const [employees, setEmployees] = useState(initialEmployees);
  const [pendingDelete, setPendingDelete] = useState<Employee | null>(null);

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
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Purchases</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell className="font-medium">{employee.name}</TableCell>
              <TableCell>
                <StatusBadge status={employee.status} />
              </TableCell>
              <TableCell>{formatCurrency(employee.starting_price_cents)}/mo</TableCell>
              <TableCell>{employee.avg_rating > 0 ? employee.avg_rating.toFixed(1) : "—"}</TableCell>
              <TableCell>{employee.purchase_count}</TableCell>
              <TableCell className="text-right">
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
                      <Link href={`/dashboard/agency/listings/${employee.id}/edit`}>
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setPendingDelete(employee)} className="text-destructive focus:text-destructive">
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
