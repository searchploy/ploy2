"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { saveModuleAction } from "./actions";
import type { ClassroomModule } from "@/lib/types/database";

interface ModuleFormProps {
  module?: ClassroomModule;
}

export function ModuleForm({ module }: ModuleFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const isEdit = Boolean(module);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData(e.currentTarget);
      await saveModuleAction(formData, module?.id);
      toast.success(isEdit ? "Module updated" : "Module created");
      router.push("/dashboard/admin/classroom");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <Card className="flex flex-col gap-6 p-6">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="title">Module Title</Label>
          <Input
            id="title"
            name="title"
            required
            defaultValue={module?.title ?? ""}
            placeholder="e.g., Finding and Qualifying Leads"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="description">Description (optional)</Label>
          <Input
            id="description"
            name="description"
            defaultValue={module?.description ?? ""}
            placeholder="A brief description of this module"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="content">Module Content</Label>
          <Textarea
            id="content"
            name="content"
            required
            defaultValue={module?.content ?? ""}
            rows={12}
            placeholder="Write your module content here. You can use line breaks and formatting."
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="sort_order">Sort Order</Label>
          <Input
            id="sort_order"
            name="sort_order"
            type="number"
            defaultValue={module?.sort_order ?? 0}
            placeholder="0"
          />
          <p className="text-xs text-muted-foreground">Modules are displayed in order from lowest to highest</p>
        </div>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving} variant="gradient">
          {saving ? "Saving..." : isEdit ? "Update Module" : "Create Module"}
        </Button>
      </div>
    </form>
  );
}
