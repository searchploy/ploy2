import { Card } from "@/components/ui/card";
import { createClient, getServerUser } from "@/lib/supabase/server";
import { SubscriptionForm, type SubscriptionFormClient } from "../subscription-form";

export default async function NewSubscriptionPage() {
  const user = await getServerUser();
  const supabase = await createClient();

  if (!user) return <div>Not authenticated</div>;

  const { data } = await supabase
    .from("consultant_clients")
    .select("id, business_name")
    .eq("user_id", user.id)
    .order("business_name", { ascending: true });

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Add subscription</h1>
        <p className="mt-1 text-muted-foreground">
          Log an AI employee you&apos;ve set up for a client
        </p>
      </div>

      <Card className="p-6">
        <SubscriptionForm clients={(data as SubscriptionFormClient[] | null) ?? []} />
      </Card>
    </div>
  );
}
