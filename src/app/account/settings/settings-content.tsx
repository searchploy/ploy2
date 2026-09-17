"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { SUPPORT_EMAIL } from "@/lib/legal/constants";
import type { Database } from "@/lib/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface SettingsPageContentProps {
  profile: Profile | null;
}

export function SettingsPageContent({ profile }: SettingsPageContentProps) {
  const router = useRouter();
  const supabase = createClient();
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    marketingEmails: false,
    productUpdates: true,
  });
  // Deletion is a support-handled request, not a button.
  //
  // This previously called supabase.auth.admin.deleteUser() from the browser
  // with the anon key. The admin API requires the service role, so the call
  // could never succeed — it failed silently while telling the user their
  // account had been deleted. Deleting an account also has to cancel any live
  // Stripe subscription and preserve billing records that must be retained,
  // none of which can be done safely from the client.
  //
  // The Privacy Policy describes this same request-based process, so the two
  // stay in step.
  const deletionRequestHref = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
    "Delete my account"
  )}&body=${encodeURIComponent(
    `Please delete my Ploy account.\n\nAccount email: ${profile?.email ?? ""}\n`
  )}`;

  if (!profile) {
    return (
      <div className="container flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl py-8">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and preferences
          </p>
        </div>

        {/* Account Section */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Account</h2>
          <div className="rounded-lg border border-border bg-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{profile.email}</p>
              </div>
              <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-green-500/20 text-green-400">
                Verified
              </span>
            </div>

            <div className="border-t border-border pt-4">
              <p className="font-medium mb-2">Account ID</p>
              <code className="text-xs bg-secondary/50 p-2 rounded block overflow-hidden text-ellipsis">
                {profile.id}
              </code>
            </div>

            <div className="border-t border-border pt-4">
              <p className="font-medium mb-2">Session</p>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.push("/");
                }}
              >
                Sign out all sessions
              </Button>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Security</h2>
          <div className="rounded-lg border border-border bg-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Password</p>
                <p className="text-sm text-muted-foreground">
                  Change your password
                </p>
              </div>
              <Button variant="outline" size="sm">
                Change
              </Button>
            </div>

            <div className="border-t border-border pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security
                  </p>
                </div>
                <Switch disabled />
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <p className="font-medium mb-2">Connected Apps</p>
              <p className="text-sm text-muted-foreground">
                No connected applications
              </p>
            </div>
          </div>
        </section>

        {/* Preferences Section */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Preferences</h2>
          <div className="rounded-lg border border-border bg-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Receive important account updates
                </p>
              </div>
              <Switch
                checked={preferences.emailNotifications}
                onCheckedChange={(checked) =>
                  setPreferences({
                    ...preferences,
                    emailNotifications: checked,
                  })
                }
              />
            </div>

            <div className="border-t border-border pt-4 flex items-center justify-between">
              <div>
                <p className="font-medium">Marketing Emails</p>
                <p className="text-sm text-muted-foreground">
                  Ploy doesn&apos;t send marketing email yet. This preference will apply if that
                  changes.
                </p>
              </div>
              <Switch
                checked={preferences.marketingEmails}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, marketingEmails: checked })
                }
              />
            </div>

            <div className="border-t border-border pt-4 flex items-center justify-between">
              <div>
                <p className="font-medium">Product Updates</p>
                <p className="text-sm text-muted-foreground">
                  Learn about new features
                </p>
              </div>
              <Switch
                checked={preferences.productUpdates}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, productUpdates: checked })
                }
              />
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section>
          <h2 className="text-lg font-semibold mb-4 text-destructive">
            Danger Zone
          </h2>
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">Delete Account</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Deleting your account removes your profile, reports, saved items and marketplace
                  listing. Billing records we&apos;re required to keep are retained.
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  If you have an active subscription, cancel it first in{" "}
                  <Link href="/account/billing" className="text-ploy-gold hover:underline">
                    Billing
                  </Link>{" "}
                  so it doesn&apos;t keep billing you.
                </p>
              </div>
              <Button asChild variant="destructive" size="sm" className="shrink-0">
                <a href={deletionRequestHref}>Request deletion</a>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
