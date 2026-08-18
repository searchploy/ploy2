import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfilePageContent } from "./profile-content";

export const metadata = {
  title: "Profile",
  description: "View and edit your profile information",
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return <ProfilePageContent profile={profile} />;
}
