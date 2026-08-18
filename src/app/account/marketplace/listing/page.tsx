import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { ListingManagementContent } from "./listing-management-content";

export const metadata = {
  title: "My Listing",
  description: "Manage your marketplace listing",
};

export default async function MarketplaceListingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { data: listing } = await supabase
    .from("employees")
    .select("*")
    .eq("profile_id", user.id)
    .single();

  return (
    <div className="container max-w-4xl py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Listing</h1>
          <p className="text-muted-foreground">
            Create and manage your marketplace listing
          </p>
        </div>

        {listing ? (
          <ListingManagementContent listing={listing} />
        ) : (
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">
              No listing yet
            </h2>
            <p className="text-muted-foreground mb-6">
              Create your first marketplace listing to start reaching businesses on Ploy.
            </p>
            <Button asChild>
              <Link href="/account/marketplace/listing/create">
                Create Listing
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
