import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Breadcrumbs, type Crumb } from "@/components/seo/breadcrumbs";

/**
 * Shared furniture for the AI-employee landing pages. These pages are all
 * server components — nothing here needs client JS, so none of it is marked
 * "use client".
 */

export function SeoHero({
  eyebrow,
  heading,
  intro,
  trail,
  cta,
}: {
  eyebrow: string;
  heading: string;
  intro: string;
  trail: Crumb[];
  cta: { label: string; href: string };
}) {
  return (
    <header className="pb-14 pt-10">
      <Breadcrumbs trail={trail} />
      <span className="eyebrow-caps text-[0.7rem] text-ploy-gold">{eyebrow}</span>
      <h1 className="display-caps mt-4 max-w-4xl text-balance text-[1.6rem] sm:text-[1.95rem] lg:text-[2.6rem]">
        {heading}
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">{intro}</p>
      <Button asChild size="lg" className="mt-8">
        <Link href={cta.href}>
          {cta.label}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </header>
  );
}

/**
 * A titled prose section. Headings are h2 so every page keeps a single h1
 * followed by a flat, ordered outline.
 */
export function SeoSection({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="border-t border-border py-14">
      <h2 className="display-caps mb-6 text-[1.15rem] sm:text-[1.35rem]">{title}</h2>
      <div className="flex flex-col gap-4 text-[15px] leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

/** A grid of task/capability cards. */
export function TaskGrid({ items }: { items: { title: string; body: string }[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <Card key={item.title} className="hover-glow-border p-6">
          <h3 className="mb-2 text-base font-bold text-foreground">{item.title}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">{item.body}</p>
        </Card>
      ))}
    </div>
  );
}

/** A checklist — used for "who this suits" and "what to ask" sections. */
export function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-[15px]">
          <Check aria-hidden className="mt-1 h-4 w-4 shrink-0 text-ploy-gold" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Numbered steps, used for the "how it works" sections. */
export function StepList({ steps }: { steps: { title: string; body: string }[] }) {
  return (
    <ol className="flex flex-col gap-5">
      {steps.map((step, i) => (
        <li key={step.title} className="flex gap-4">
          <span
            aria-hidden
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ploy-gold/30 font-mono text-sm text-ploy-gold"
          >
            {i + 1}
          </span>
          <div>
            <h3 className="mb-1 text-base font-bold text-foreground">{step.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{step.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Closing call to action. */
export function SeoCta({
  title,
  body,
  primary,
  secondary,
}: {
  title: string;
  body: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <section className="border-t border-border py-14">
      <Card className="shadow-glow-card flex flex-col items-start gap-5 p-8 sm:p-10">
        <h2 className="display-caps text-[1.15rem] sm:text-[1.35rem]">{title}</h2>
        <p className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground">{body}</p>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href={primary.href}>
              {primary.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          {secondary && (
            <Button asChild size="lg" variant="outline">
              <Link href={secondary.href}>{secondary.label}</Link>
            </Button>
          )}
        </div>
      </Card>
    </section>
  );
}
