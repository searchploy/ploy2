"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Database } from "@/lib/types/database";
import { format } from "date-fns";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface ProfilePageContentProps {
  profile: Profile | null;
}

export function ProfilePageContent({ profile }: ProfilePageContentProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    email: profile?.email || "",
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name,
        })
        .eq("id", profile?.id);

      if (error) throw error;

      setIsEditing(false);
      router.refresh();
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!profile) {
    return (
      <div className="container flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-8">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">Manage your profile information</p>
        </div>

        {/* Profile Card */}
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="space-y-6">
            {/* Avatar */}
            <div>
              <label className="block text-sm font-medium mb-2">Avatar</label>
              <div className="h-16 w-16 rounded-full bg-ploy-blue/20 flex items-center justify-center border border-border">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Avatar"
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full rounded-full bg-gradient-to-br from-ploy-blue to-ploy-blue/50 flex items-center justify-center text-white font-semibold">
                    {profile.full_name?.charAt(0) || profile.email?.charAt(0)}
                  </div>
                )}
              </div>
            </div>

            {/* Editable Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Full Name
                </label>
                <Input
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
                  disabled={!isEditing}
                  className="bg-secondary/50"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Email
                </label>
                <Input
                  value={formData.email}
                  disabled
                  className="bg-secondary/50 opacity-75"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Email cannot be changed from this page
                </p>
              </div>
            </div>

            {/* Read-only Fields */}
            <div className="space-y-4 border-t border-border pt-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Account Type
                </label>
                <p className="text-sm font-medium capitalize">
                  {profile.role || "User"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Subscription Plan
                </label>
                <p className="text-sm font-medium capitalize">
                  {profile.subscription_plan || "Free"}
                </p>
              </div>

              {profile.created_at && (
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Member Since
                  </label>
                  <p className="text-sm font-medium">
                    {format(new Date(profile.created_at), "MMMM d, yyyy")}
                  </p>
                </div>
              )}

              {profile.email_verified && (
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Email Status
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <p className="text-sm font-medium">Verified</p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 border-t border-border pt-4">
              {isEditing ? (
                <>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        full_name: profile.full_name || "",
                        email: profile.email || "",
                      });
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} className="flex-1">
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
