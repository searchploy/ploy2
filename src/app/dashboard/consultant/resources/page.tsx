import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, Eye } from "lucide-react";
import { getAllResources } from "@/lib/consultant-resources";

export default function ResourcesPage() {
  const resources = getAllResources();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold">Resources</h1>
        <p className="text-muted-foreground mt-1">Templates and guides to grow your consulting business</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {resources.map((resource) => (
          <Card key={resource.id} className="p-6 flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <FileDown className="h-5 w-5 text-ploy-blue flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold">{resource.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{resource.description}</p>
              </div>
            </div>
            <Link href={`/dashboard/consultant/resources/${resource.id}`} className="w-full">
              <Button size="sm" variant="outline" className="w-full">
                <Eye className="h-4 w-4 mr-2" />
                View
              </Button>
            </Link>
          </Card>
        ))}
      </div>

      <Card className="p-6 bg-ploy-blue/5 border-ploy-blue/20">
        <h3 className="font-semibold">Discord Community</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Join other AI consultants to share strategies, ask questions, and network.
        </p>
        <Button size="sm" className="mt-4">
          Join Community
        </Button>
      </Card>
    </div>
  );
}
