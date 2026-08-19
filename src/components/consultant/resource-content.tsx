"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { ResourceContent as ResourceContentType } from "@/lib/consultant-resources";

export function ResourceContent({ resource }: { resource: ResourceContentType }) {
  return (
    <div className="space-y-8">
      {resource.sections.map((section) => (
        <section key={section.id} id={section.id} className="scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">{section.title}</h2>

          {Array.isArray(section.content) ? (
            <div className="space-y-4">
              {section.content.map((line, idx) => {
                if (!line.trim()) return <div key={idx} />;

                // Code block or template (lines that look like they should be copied)
                if (
                  line.startsWith("---") ||
                  line.startsWith("Subject:") ||
                  line.startsWith("Email:") ||
                  line.startsWith("Hi ") ||
                  line.startsWith("Hi[") ||
                  line.includes("@") ||
                  line.startsWith("Project fee:") ||
                  line.startsWith("Includes:") ||
                  line.startsWith("COVER PAGE") ||
                  line.startsWith("PAGE")
                ) {
                  return (
                    <div key={idx} className="font-mono text-sm bg-secondary/50 p-3 rounded border border-border text-muted-foreground whitespace-pre-wrap break-words">
                      {line}
                    </div>
                  );
                }

                // Pro tip or callout
                if (line.includes("Pro Tip") || line.includes("Note:") || line.includes("IMPORTANT:")) {
                  return (
                    <div key={idx} className="bg-ploy-blue/5 border-l-4 border-ploy-blue p-4 rounded">
                      <p className="text-sm">{line}</p>
                    </div>
                  );
                }

                // Common mistake callout
                if (line.startsWith("❌") || line.startsWith("✓") || line.startsWith("🚩")) {
                  return (
                    <p key={idx} className="text-sm leading-relaxed">
                      {line}
                    </p>
                  );
                }

                // Checkbox items
                if (line.startsWith("□")) {
                  return (
                    <div key={idx} className="flex gap-3">
                      <input type="checkbox" className="mt-1" />
                      <p className="text-sm">{line.replace("□ ", "")}</p>
                    </div>
                  );
                }

                // Regular text
                return (
                  <p key={idx} className="text-sm leading-relaxed text-muted-foreground">
                    {line}
                  </p>
                );
              })}
            </div>
          ) : (
            <CopyableContent content={section.content} />
          )}
        </section>
      ))}
    </div>
  );
}

function CopyableContent({ content }: { content: string }) {
  return (
    <Card className="p-6 bg-secondary/40">
      <div className="flex gap-4">
        <div className="flex-1 font-mono text-sm whitespace-pre-wrap break-words text-muted-foreground">
          {content}
        </div>
        <CopyButton text={content} />
      </div>
    </Card>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="shrink-0 p-2 hover:bg-secondary rounded transition-colors"
      title="Copy to clipboard"
    >
      {copied ? (
        <Check className="h-5 w-5 text-green-500" />
      ) : (
        <Copy className="h-5 w-5 text-muted-foreground" />
      )}
    </button>
  );
}
