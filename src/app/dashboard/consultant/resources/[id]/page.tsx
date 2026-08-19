import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getResource } from "@/lib/consultant-resources";
import { ResourceContent } from "@/components/consultant/resource-content";

export default async function ResourcePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const resource = getResource(id);

  if (!resource) notFound();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard/consultant/resources" className="inline-flex items-center gap-2 text-sm text-ploy-gold hover:underline mb-4">
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
                className="block text-sm text-ploy-gold hover:underline"
              >
                {section.title}
              </a>
            ))}
          </div>
        </Card>
      )}

      {/* Content */}
      <ResourceContent resource={resource} />

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
