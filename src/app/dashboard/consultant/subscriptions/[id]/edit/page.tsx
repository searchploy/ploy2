import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { createClient, getServerUser } from "@/lib/supabase/server";
import {
  SubscriptionForm,
  type SubscriptionFormClient,
  type SubscriptionFormData,
} from "../../subscription-form";

export default async function EditSubscriptionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getServerUser();
  const supabase = await createClient();

  if (!user) return <div>Not authenticated</div>;

  const [{ data: subscription }, { data: clients }] = await Promise.all([
    supabase
      .from("consultant_client_subscriptions")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("consultant_clients")
      .select("id, business_name")
      .eq("user_id", user.id)
      .order("business_name", { ascending: true }),
  ]);

  if (!subscription) notFound();

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Edit subscription</h1>
        <p className="mt-1 text-muted-foreground">{subscription.employee_name}</p>
      </div>

      <Card className="p-6">
        <SubscriptionForm
          clients={(clients as SubscriptionFormClient[] | null) ?? []}
          subscriptionId={id}
          initialData={subscription as SubscriptionFormData}
        />
      </Card>
    </div>
  );
}
