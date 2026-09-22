import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { getEntitlements } from "@/lib/auth/entitlements";
import { ProVisibilityPanel } from "@/components/listing/pro-visibility-panel";
import { ListingManagementContent } from "./listing-management-content";

export const metadata = {
  title: "My Listings",
  description: "Manage your marketplace listings",
};

// Moderation status changes out of band, so this must not be cached.
export const dynamic = "force-dynamic";

export default async function MarketplaceListingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const [{ data: listings }, entitlements] = await Promise.all([
    supabase.from("employees").select("*").eq("profile_id", user.id).order("created_at", { ascending: false }),
    // Server-resolved from the subscriptions table — the client never gets to
    // assert Ploy Pro membership.
    getEntitlements(),
  ]);

  const maxListings = entitlements.pro ? 5 : 1;
  const canAddMore = (listings?.length ?? 0) < maxListings;

  return (
    <div className="container max-w-4xl py-8">
      <div className="space-y-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Listings</h1>
            <p className="text-muted-foreground">
              Create and manage your marketplace listings ({listings?.length ?? 0}/{maxListings})
            </p>
          </div>
          {canAddMore && (
            <Button asChild>
              <Link href="/account/marketplace/listing/create">
                Add Listing
              </Link>
            </Button>
          )}
        </div>

        {listings && listings.length > 0 ? (
          <div className="space-y-6">
            {listings.map((listing) => (
              <div key={listing.id}>
                <ProVisibilityPanel isPro={entitlements.pro} status={listing.status} />
                <ListingManagementContent listing={listing} />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">
              No listings yet
            </h2>
            <p className="text-muted-foreground mb-6">
              List your AI tools to start reaching businesses on Ploy. Every listing is reviewed
              before it goes on the marketplace.
            </p>
            <Button asChild>
              <Link href="/account/marketplace/listing/create">
                List Your AI Tool
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
