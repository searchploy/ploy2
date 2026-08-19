"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import type { ResourceContent as ResourceContentType, Section } from "@/lib/consultant-resources";

function sectionLines(section: Section): string[] {
  return Array.isArray(section.content) ? section.content : section.content.split("\n");
}

export function ResourceContent({ resource }: { resource: ResourceContentType }) {
  return (
    <div className="space-y-10">
      {resource.sections.map((section) => {
        const lines = sectionLines(section);
        return (
          <section key={section.id} id={section.id} className="scroll-mt-24">
            <div className="mb-4 flex items-start justify-between gap-4 border-b border-border pb-2">
              <h2 className="text-2xl font-bold">{section.title}</h2>
              <CopyButton text={lines.join("\n")} label={`Copy ${section.title}`} />
            </div>

            <div className="space-y-3">
              {lines.map((line, idx) => (
                <Line key={idx} line={line} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function Line({ line }: { line: string }) {
  const trimmed = line.trim();

  if (!trimmed) return <div className="h-2" />;

  // Checklist item — must be tested before the template heuristic below, since
  // checklist lines can contain email addresses ("□ Create business email...").
  if (trimmed.startsWith("□")) {
    return (
      <label className="flex cursor-pointer items-start gap-3 text-sm">
        <input
          type="checkbox"
          className="mt-0.5 h-4 w-4 shrink-0 accent-ploy-gold cursor-pointer"
        />
        <span className="leading-relaxed">{trimmed.replace(/^□\s*/, "")}</span>
      </label>
    );
  }

  // Callouts.
  if (
    trimmed.startsWith("Pro Tip") ||
    trimmed.startsWith("Note:") ||
    trimmed.startsWith("IMPORTANT:")
  ) {
    return (
      <div className="rounded-r border-l-4 border-ploy-gold bg-ploy-gold/5 p-4">
        <p className="text-sm leading-relaxed">{trimmed}</p>
      </div>
    );
  }

  // Verbatim template / script lines, rendered monospaced so the copy-paste
  // shape (subject lines, placeholders, page breaks) stays readable.
  if (
    trimmed.startsWith("---") ||
    trimmed.startsWith("Subject:") ||
    trimmed.startsWith("Hi ") ||
    trimmed.startsWith("Hi [") ||
    trimmed.startsWith("[") ||
    trimmed.startsWith("COVER PAGE") ||
    trimmed.startsWith("PAGE ")
  ) {
    return (
      <div className="whitespace-pre-wrap break-words rounded border border-border bg-secondary/50 p-3 font-mono text-sm text-muted-foreground">
        {line}
      </div>
    );
  }

  return <p className="text-sm leading-relaxed text-muted-foreground">{trimmed}</p>;
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard is unavailable (denied permission / insecure origin) — leave
      // the button in its idle state rather than falsely showing "Copied".
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={label}
      className="inline-flex shrink-0 items-center gap-1.5 rounded border border-border px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-success" />
          Copied
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          Copy
        </>
      )}
    </button>
  );
}
