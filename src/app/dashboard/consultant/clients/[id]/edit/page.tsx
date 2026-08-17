import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { ClientForm } from "../../client-form";
import { notFound } from "next/navigation";

export default async function EditClientPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  const { data: client, error } = await supabase
    .from("consultant_clients")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !client) {
    notFound();
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Edit Client</h1>
        <p className="text-muted-foreground mt-1">Update client information</p>
      </div>

      <Card className="p-6">
        <ClientForm clientId={client.id} initialData={client} />
      </Card>
    </div>
  );
}
