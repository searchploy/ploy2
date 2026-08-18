import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SettingsPageContent } from "./settings-content";

export const metadata = {
  title: "Settings",
  description: "Manage your account settings",
};

export default async function SettingsPage() {
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

  return <SettingsPageContent profile={profile} />;
}
