"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SectionHeading } from "@/components/shared/section-heading";

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    toast.success("Message sent", { description: "We'll get back to you within one business day." });
    e.currentTarget.reset();
  }

  return (
    <div className="container max-w-xl py-20">
      <SectionHeading eyebrow="Contact" title="Get in touch" description="Questions about Ploy? Send us a message." align="left" className="items-start text-left" />
      <Card className="mt-10 p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="contact_name">Name</Label>
            <Input id="contact_name" required placeholder="Jane Cooper" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="contact_email">Email</Label>
            <Input id="contact_email" type="email" required placeholder="jane@company.com" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="contact_message">Message</Label>
            <Textarea id="contact_message" required rows={5} placeholder="How can we help?" />
          </div>
          <Button type="submit" disabled={submitting} size="lg" className="mt-2">
            {submitting ? "Sending..." : "Send message"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
