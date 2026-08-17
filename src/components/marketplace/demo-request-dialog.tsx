"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function DemoRequestDialog({ employeeName, agencyName }: { employeeName: string; agencyName: string }) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    // In production this calls a Server Action that inserts into
    // `demo_requests` and notifies the agency. Simulated here since no
    // live Supabase project is connected in this environment.
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    setOpen(false);
    toast.success("Demo requested", {
      description: `${agencyName} will reach out about ${employeeName} shortly.`,
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" variant="outline" className="flex-1" id="demo">
          Request Demo
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request a demo of {employeeName}</DialogTitle>
          <DialogDescription>
            Tell {agencyName} a bit about your business and they&apos;ll follow up to schedule a walkthrough.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="full_name">Full name</Label>
            <Input id="full_name" name="full_name" required placeholder="Jane Cooper" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Work email</Label>
            <Input id="email" name="email" type="email" required placeholder="jane@company.com" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="company_name">Company</Label>
            <Input id="company_name" name="company_name" placeholder="Company, Inc." />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="message">What are you hoping to solve?</Label>
            <Textarea id="message" name="message" placeholder="Tell us about your current workflow..." />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? "Sending..." : "Send request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
