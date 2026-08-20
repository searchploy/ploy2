"use client";

import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { Check, X, Star, MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

export function ListingsModerationTabs({
  initialEmployees,
  agencyNameById,
}: {
  initialEmployees: Employee[];
  agencyNameById: Record<string, string>;
}) {
  const [employees, setEmployees] = useState(initialEmployees);
  const [pendingDelete, setPendingDelete] = useState<Employee | null>(null);

  const pendingReview = employees.filter((e) => e.status === "pending_review");
  const approved = employees.filter((e) => e.status === "published");
  const rejected = employees.filter((e) => e.status === "rejected");

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
    setEmployees((prev) => prev.filter((e) => e.id !== pendingDelete.id));
    toast.success("Listing deleted", { description: `${pendingDelete.name} was removed from the marketplace.` });
    setPendingDelete(null);
  }

  const EmployeeRow = ({ employee, showActions = false }: { employee: Employee; showActions?: boolean }) => (
    <div key={employee.id} className="flex items-center justify-between border-b border-border p-4 last:border-b-0">
      <div className="flex-1">
        <Link href={`/marketplace/${employee.slug}`} className="font-medium hover:text-ploy-gold">
          {employee.name}
        </Link>
        <p className="text-sm text-muted-foreground">{agencyNameById[employee.agency_id] ?? "—"}</p>
      </div>
      <div className="text-sm font-medium">{formatCurrency(employee.starting_price_cents)}/mo</div>
      {showActions && (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => updateStatus(employee.id, "published")}
            className="gap-1"
          >
            <Check className="h-3.5 w-3.5" /> Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => updateStatus(employee.id, "rejected")}
            className="gap-1"
          >
            <X className="h-3.5 w-3.5" /> Reject
          </Button>
        </div>
      )}
      {!showActions && (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => toggleFeatured(employee.id)}
            title="Toggle featured"
          >
            <Star className={cn("h-3.5 w-3.5", employee.is_featured && "fill-amber-400 text-amber-400")} />
          </Button>
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
                <Link href={`/dashboard/admin/listings/${employee.id}/edit`}>
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </Link>
              </DropdownMenuItem>
              {!showActions && (
                <DropdownMenuItem
                  onClick={() => updateStatus(employee.id, "rejected")}
                  className="text-amber-600 focus:text-amber-600"
                >
                  <X className="h-3.5 w-3.5" /> Reject
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => setPendingDelete(employee)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );

  return (
    <>
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">
            Pending Review
            {pendingReview.length > 0 && (
              <span className="ml-2 rounded-full bg-amber-500/20 px-2 py-1 text-xs font-semibold text-amber-400">
                {pendingReview.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved
            {approved.length > 0 && (
              <span className="ml-2 rounded-full bg-green-500/20 px-2 py-1 text-xs font-semibold text-green-400">
                {approved.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected
            {rejected.length > 0 && (
              <span className="ml-2 rounded-full bg-red-500/20 px-2 py-1 text-xs font-semibold text-red-400">
                {rejected.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4">
          {pendingReview.length > 0 ? (
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="grid grid-cols-4 gap-4 border-b border-border bg-secondary/30 p-4 text-sm font-medium">
                <div>Employee</div>
                <div>Price</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>
              {pendingReview.map((emp) => (
                <EmployeeRow key={emp.id} employee={emp} showActions={true} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">No employees pending review</div>
          )}
        </TabsContent>

        <TabsContent value="approved" className="mt-4">
          {approved.length > 0 ? (
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="grid grid-cols-4 gap-4 border-b border-border bg-secondary/30 p-4 text-sm font-medium">
                <div>Employee</div>
                <div>Price</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>
              {approved.map((emp) => (
                <EmployeeRow key={emp.id} employee={emp} showActions={false} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">No approved employees</div>
          )}
        </TabsContent>

        <TabsContent value="rejected" className="mt-4">
          {rejected.length > 0 ? (
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="grid grid-cols-4 gap-4 border-b border-border bg-secondary/30 p-4 text-sm font-medium">
                <div>Employee</div>
                <div>Price</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>
              {rejected.map((emp) => (
                <EmployeeRow key={emp.id} employee={emp} showActions={false} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">No rejected employees</div>
          )}
        </TabsContent>
      </Tabs>

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
