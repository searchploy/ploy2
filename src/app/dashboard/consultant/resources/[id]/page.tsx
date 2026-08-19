import { notFound } from "next/navigation";
import { ArrowLeft, Copy, Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getResource } from "@/lib/consultant-resources";

export const metadata = {
  title: "Resource",
};

export const dynamic = "force-dynamic";

export default function ResourcePage({ params }: { params: { id: string } }) {
  const resourceId = parseInt(params.id) as any;
  const resource = getResource(resourceId);

  if (!resource) notFound();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard/consultant/resources" className="inline-flex items-center gap-2 text-sm text-ploy-blue hover:underline mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Resources
        </Link>
        <h1 className="text-3xl font-bold">{resource.title}</h1>
        <p className="text-muted-foreground mt-2">{resource.intro}</p>
      </div>

      {/* Table of Contents */}
      {resource.sections.length > 3 && (
        <Card className="p-6 mb-8 bg-secondary/30 border-secondary">
          <h2 className="font-semibold mb-4">Table of Contents</h2>
          <div className="space-y-2">
            {resource.sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="block text-sm text-ploy-blue hover:underline"
              >
                {section.title}
              </a>
            ))}
          </div>
        </Card>
      )}

      {/* Content Sections */}
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

      {/* Back button */}
      <div className="mt-12 pt-8 border-t">
        <Link href="/dashboard/consultant/resources">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Resources
          </Button>
        </Link>
      </div>
    </div>
  );
}

function CopyableContent({ content }: { content: string }) {
  const lines = content.split("\n");
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
  const [copied, setCopied] = React.useState(false);

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

import React from "react";
