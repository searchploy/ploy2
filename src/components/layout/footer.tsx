import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { FOOTER_LINKS, SITE_DESCRIPTION } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="container grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="flex flex-col gap-4">
          <Link href="/">
            <Logo size="sm" />
          </Link>
          <p className="max-w-sm text-sm text-muted-foreground">{SITE_DESCRIPTION}</p>
        </div>

        {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
          <div key={heading} className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold">{heading}</h4>
            <ul className="flex flex-col gap-2.5">
              {links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="container flex flex-col items-center justify-between gap-4 border-t border-border py-6 sm:flex-row">
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Ploy, Inc. All rights reserved.</p>
        <div className="flex gap-6 text-xs text-muted-foreground">
          <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
          <Link href="/terms" className="hover:text-foreground">Terms</Link>
          <Link href="/contact" className="hover:text-foreground">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
