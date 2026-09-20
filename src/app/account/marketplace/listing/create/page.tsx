import { redirect } from "next/navigation";
import Link from "next/link";
import { Store } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListingForm } from "@/components/listing/listing-form";
import { getEntitlements } from "@/lib/auth/entitlements";

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

  const [{ data: existingListings }, entitlements, { data: categories }] = await Promise.all([
    supabase
      .from("employees")
      .select("id, slug")
      .eq("profile_id", user.id),
    getEntitlements(),
    supabase
      .from("categories")
      .select("id, name")
      .order("sort_order", { ascending: true, nullsFirst: false }),
  ]);

  const listingCount = existingListings?.length ?? 0;
  const maxListings = entitlements.pro ? 5 : 1;
  const atLimit = listingCount >= maxListings;

  if (atLimit) {
    return (
      <div className="container max-w-2xl py-12">
        <Card className="flex flex-col items-center gap-4 p-10 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ploy-gold/10 text-ploy-gold">
            <Store className="h-5 w-5" />
          </span>
          <div>
            <p className="font-medium">
              You&apos;ve reached your listing limit.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {entitlements.pro
                ? "Ploy Pro accounts can list up to 5 AI employees."
                : "Free accounts can list 1 AI employee. Upgrade to Ploy Pro for up to 5 listings."}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link href="/account/marketplace/listing">My Listings</Link>
            </Button>
            {!entitlements.pro && (
              <Button asChild variant="outline">
                <Link href="/for-agencies">Upgrade to Pro</Link>
              </Button>
            )}
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
