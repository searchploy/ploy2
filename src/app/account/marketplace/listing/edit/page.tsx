import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ListingForm } from "@/components/listing/listing-form";

export const metadata = {
  title: "Edit your AI Employee",
  description: "Update your Ploy marketplace listing",
};

export default async function EditListingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in?redirect=/account/marketplace/listing/edit");
  }

  // RLS restricts this to the caller's own row, so a user cannot reach
  // someone else's listing here.
  const { data: listing } = await supabase
    .from("employees")
    .select("*")
    .eq("profile_id", user.id)
    .maybeSingle();

  if (!listing) {
    redirect("/account/marketplace/listing/create");
  }

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("sort_order", { ascending: true, nullsFirst: false });

  return (
    <div className="container max-w-3xl py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Edit your AI Employee</h1>
        <p className="mt-1 text-muted-foreground">
          Changes are reviewed before they go live. Your listing is temporarily removed from the
          marketplace until the update is approved.
        </p>
      </div>

      <ListingForm categories={categories ?? []} existing={listing} />
    </div>
  );
}
