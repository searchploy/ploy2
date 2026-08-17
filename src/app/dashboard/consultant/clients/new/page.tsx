import { Card } from "@/components/ui/card";
import { ClientForm } from "../client-form";

export default function NewClientPage() {
  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Add Client</h1>
        <p className="text-muted-foreground mt-1">Add a new consulting client</p>
      </div>

      <Card className="p-6">
        <ClientForm />
      </Card>
    </div>
  );
}
