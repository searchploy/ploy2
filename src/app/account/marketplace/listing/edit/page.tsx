import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function EditListingRedirect() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in?redirect=/account/marketplace/listing");
  }

  // Redirect to the first listing's edit page (or create if none exist)
  const { data: listings } = await supabase
    .from("employees")
    .select("id")
    .eq("profile_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1);

  if (!listings || listings.length === 0) {
    redirect("/account/marketplace/listing/create");
  }

  redirect(`/account/marketplace/listing/edit/${listings[0].id}`);
}
