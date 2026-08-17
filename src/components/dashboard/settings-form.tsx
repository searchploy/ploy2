"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { initials } from "@/lib/utils";
import type { User } from "@/lib/types/mock";

export function SettingsForm({ user }: { user: User }) {
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    toast.success("Settings saved");
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-6">
      <Card className="flex items-center gap-4 p-6">
        <Avatar className="h-16 w-16 border border-border">
          <AvatarImage src={user.avatar_url ?? undefined} alt={user.full_name ?? ""} />
          <AvatarFallback>{initials(user.full_name ?? user.email)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{user.full_name}</p>
          <Button type="button" variant="outline" size="sm" className="mt-2">
            Change photo
          </Button>
        </div>
      </Card>

      <Card className="flex flex-col gap-4 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="s_name">Full name</Label>
            <Input id="s_name" defaultValue={user.full_name ?? ""} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="s_company">Company</Label>
            <Input id="s_company" defaultValue={user.company_name ?? ""} />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="s_email">Email</Label>
            <Input id="s_email" type="email" defaultValue={user.email} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="s_phone">Phone</Label>
            <Input id="s_phone" defaultValue={user.phone ?? ""} />
          </div>
        </div>
      </Card>

      <Card className="flex flex-col gap-4 p-6">
        <h3 className="font-medium">Password</h3>
        <Separator />
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="s_password">New password</Label>
          <Input id="s_password" type="password" placeholder="Leave blank to keep current password" />
        </div>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={saving} variant="gradient">
          {saving ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
