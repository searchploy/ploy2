import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared/section-heading";
import { Card } from "@/components/ui/card";
import { Code2, Webhook, KeyRound } from "lucide-react";

export const metadata: Metadata = { title: "Developers" };

const items = [
  { icon: KeyRound, title: "API access", description: "Programmatic access to the Ploy marketplace is on our roadmap — join the waitlist to get early access." },
  { icon: Webhook, title: "Webhooks", description: "Receive real-time events for click-throughs, reported sales, and listing status changes." },
  { icon: Code2, title: "SDKs", description: "Client libraries for embedding Ploy listings and comparisons into your own product." },
];

export default function DevelopersPage() {
  return (
    <div className="container max-w-3xl py-20">
      <SectionHeading eyebrow="Developers" title="Build on Ploy" description="A public API for the AI Employee marketplace is coming soon." />
      <div className="mt-14 grid gap-6 sm:grid-cols-3">
        {items.map((item) => (
          <Card key={item.title} className="flex flex-col gap-3 p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ploy-gold/10 text-ploy-gold">
              <item.icon className="h-5 w-5" />
            </div>
            <h3 className="font-medium">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
