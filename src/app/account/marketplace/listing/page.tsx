import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { getEntitlements } from "@/lib/auth/entitlements";
import { ProVisibilityPanel } from "@/components/listing/pro-visibility-panel";
import { ListingManagementContent } from "./listing-management-content";

export const metadata = {
  title: "My Listing",
  description: "Manage your marketplace listing",
};

// Moderation status changes out of band, so this must not be cached.
export const dynamic = "force-dynamic";

export default async function MarketplaceListingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const [{ data: listing }, entitlements] = await Promise.all([
    supabase.from("employees").select("*").eq("profile_id", user.id).maybeSingle(),
    // Server-resolved from the subscriptions table — the client never gets to
    // assert Ploy Pro membership.
    getEntitlements(),
  ]);

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
          <>
            <ProVisibilityPanel isPro={entitlements.pro} status={listing.status} />
            <ListingManagementContent listing={listing} />
          </>
        ) : (
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">
              No listing yet
            </h2>
            <p className="text-muted-foreground mb-6">
              List your AI employee to start reaching businesses on Ploy. Every listing is reviewed
              before it goes on the marketplace.
            </p>
            <Button asChild>
              <Link href="/account/marketplace/listing/create">
                List Your AI Employee
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
