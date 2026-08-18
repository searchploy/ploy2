import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ListingCreateForm } from "./listing-create-form";

export const metadata = {
  title: "Create Listing",
  description: "Create a new marketplace listing",
};

export default async function CreateListingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Check if user already has a listing
  const { data: existingListing } = await supabase
    .from("employees")
    .select("id")
    .eq("profile_id", user.id)
    .single();

  if (existingListing) {
    redirect("/account/marketplace/listing");
  }

  // Fetch categories for the form
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div className="container max-w-3xl py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Listing</h1>
          <p className="text-muted-foreground">
            Add your AI solution to the Ploy marketplace
          </p>
        </div>

        <ListingCreateForm categories={categories || []} />
      </div>
    </div>
  );
}
