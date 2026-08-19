import Link from "next/link";
import { ArrowRight, GraduationCap, LayoutDashboard, Users, FileText } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";

const included = [
  { icon: GraduationCap, label: "AI Consultant Training" },
  { icon: FileText, label: "Sales Scripts & Proposal Templates" },
  { icon: LayoutDashboard, label: "Client Dashboard & CRM" },
  { icon: Users, label: "Community & Weekly Coaching" },
];

export function ConsultantSection() {
  return (
    <section className="py-24">
      <div className="container flex flex-col items-center gap-10 rounded-3xl border border-border bg-card px-8 py-16 text-center sm:px-16">
        <SectionHeading
          eyebrow="For consultants"
          title="Build an AI Consulting Business with Ploy"
          description="Learn how to help businesses adopt AI while using Ploy's software, templates, and marketplace — the Consultant plan includes every Pro feature automatically."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {included.map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center gap-3 rounded-xl border border-border bg-secondary/30 p-5"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-ploy-gold">
                <item.icon className="h-4.5 w-4.5" />
              </span>
              <p className="text-sm font-medium">{item.label}</p>
            </div>
          ))}
        </div>
        <Button asChild size="lg">
          <Link href="/consultants">
            Become a Consultant
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
