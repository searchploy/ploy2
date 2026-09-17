import Link from "next/link";
import { SUPPORT_EMAIL } from "@/lib/legal/constants";

/**
 * Shell for the long-form legal documents.
 *
 * These are plain components rather than `prose` classes on purpose: the
 * project doesn't include @tailwindcss/typography, so the `prose` utilities
 * the old Terms and Privacy pages used resolved to nothing and both documents
 * rendered as undifferentiated text.
 */

export function LegalPage({
  title,
  updated,
  version,
  intro,
  sections,
  children,
}: {
  title: string;
  updated: string;
  version: string;
  intro?: React.ReactNode;
  sections: { id: string; heading: string }[];
  children: React.ReactNode;
}) {
  return (
    <div className="container max-w-3xl py-14">
      <header className="border-b border-border pb-8">
        <p className="label-micro text-ploy-gold">Legal</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Last updated {updated} · Version {version}
        </p>
        {intro && <div className="mt-5 flex flex-col gap-4 text-sm leading-relaxed text-muted-foreground">{intro}</div>}
      </header>

      <nav aria-label="Contents" className="mt-8 rounded-2xl border border-border bg-secondary/20 p-5">
        <p className="label-micro mb-3">Contents</p>
        <ol className="grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
          {sections.map((section, i) => (
            <li key={section.id} className="text-sm">
              <a
                href={`#${section.id}`}
                className="text-muted-foreground underline-offset-4 hover:text-ploy-gold hover:underline"
              >
                <span className="font-mono text-xs text-muted-foreground/70">{i + 1}.</span>{" "}
                {section.heading}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <article className="mt-12 flex flex-col gap-10">{children}</article>

      <footer className="mt-14 border-t border-border pt-8 text-sm text-muted-foreground">
        <p>
          Questions about this document? Contact{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-ploy-gold underline-offset-4 hover:underline">
            {SUPPORT_EMAIL}
          </a>
          .
        </p>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
          <Link href="/terms" className="hover:text-foreground">Terms of Service</Link>
          <Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link>
          <Link href="/ai-report-disclaimer" className="hover:text-foreground">AI Report Disclaimer</Link>
          <Link href="/marketplace-provider-terms" className="hover:text-foreground">Marketplace Provider Terms</Link>
        </div>
      </footer>
    </div>
  );
}

export function Section({
  id,
  number,
  heading,
  children,
}: {
  id: string;
  number: number;
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="flex items-baseline gap-3 text-lg font-bold tracking-tight">
        <span className="font-mono text-sm text-ploy-gold">{number}.</span>
        {heading}
      </h2>
      <div className="mt-3 flex flex-col gap-4 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}

export function SubHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="mt-1 text-sm font-semibold text-foreground">{children}</h3>;
}

export function List({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2.5">
          <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-ploy-gold/60" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** A point worth not missing in a wall of text — used sparingly. */
export function Callout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-ploy-gold/25 bg-ploy-gold/5 p-5">
      <p className="text-sm font-semibold text-ploy-gold">{title}</p>
      <div className="mt-2 flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </div>
  );
}

/**
 * Shown at the top of every legal document. These are drafts prepared as
 * product infrastructure, not legal advice, and saying so is more honest than
 * letting them read as counsel-reviewed.
 */
export function DraftNotice() {
  return (
    <div className="rounded-2xl border border-border bg-secondary/30 p-5">
      <p className="text-sm font-semibold text-foreground">Please note</p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        This document is a working draft prepared for the Ploy platform. It has not yet been reviewed
        by legal counsel and should not be relied on as legal advice. If you have questions about how
        it applies to you, please consult a qualified attorney.
      </p>
    </div>
  );
}
