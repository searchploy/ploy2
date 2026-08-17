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

export function ConsultationDialog({ agencyName }: { agencyName: string }) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    setOpen(false);
    toast.success("Consultation requested", {
      description: `${agencyName} will reach out to schedule a time.`,
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" variant="gradient">
          Request consultation
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request a consultation with {agencyName}</DialogTitle>
          <DialogDescription>Share a bit about what you&apos;re looking to solve.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="c_full_name">Full name</Label>
            <Input id="c_full_name" required placeholder="Jane Cooper" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="c_email">Work email</Label>
            <Input id="c_email" type="email" required placeholder="jane@company.com" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="c_message">What are you looking to solve?</Label>
            <Textarea id="c_message" placeholder="Tell us about your business..." />
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
