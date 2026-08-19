import { redirect } from "next/navigation";
import Link from "next/link";
import { Store } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListingForm } from "@/components/listing/listing-form";

export const metadata = {
  title: "List your AI Employee",
  description: "Add your AI employee to the Ploy marketplace",
};

export default async function CreateListingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in?redirect=/account/marketplace/listing/create");
  }

  // One listing per user. Also enforced by a unique index on employees.profile_id
  // and by RLS, so this is a friendly guard rather than the actual restriction.
  const { data: existing } = await supabase
    .from("employees")
    .select("id, slug")
    .eq("profile_id", user.id)
    .maybeSingle();

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("sort_order", { ascending: true, nullsFirst: false });

  if (existing) {
    return (
      <div className="container max-w-2xl py-12">
        <Card className="flex flex-col items-center gap-4 p-10 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ploy-gold/10 text-ploy-gold">
            <Store className="h-5 w-5" />
          </span>
          <div>
            <p className="font-medium">You already have an AI employee listed.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Each Ploy Pro account can list one AI employee.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link href="/account/marketplace/listing">View My Listing</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/account/marketplace/listing/edit">Edit Listing</Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">List your AI Employee</h1>
        <p className="mt-1 text-muted-foreground">
          Takes about 2 minutes. Businesses browse these listings to find AI solutions.
        </p>
      </div>

      <ListingForm categories={categories ?? []} />
    </div>
  );
}
