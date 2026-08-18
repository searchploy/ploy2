"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ListingPreview } from "@/components/listing/listing-preview";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import {
  PRIMARY_TASKS,
  BEST_FOR,
  MAX_PRIMARY_TASKS,
  MAX_DESCRIPTION,
  MAX_TAGLINE,
  slugify,
  normaliseUrl,
} from "@/lib/listing/options";
import type { Database } from "@/lib/types/database";

type Category = Pick<Database["public"]["Tables"]["categories"]["Row"], "id" | "name">;
type Employee = Database["public"]["Tables"]["employees"]["Row"];

function Section({
  step,
  title,
  hint,
  children,
}: {
  step: number;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="flex flex-col gap-5 p-6">
      <div>
        <h2 className="flex items-center gap-2 font-semibold">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ploy-blue/10 text-xs font-mono text-ploy-blue">
            {step}
          </span>
          {title}
        </h2>
        {hint && <p className="mt-1 pl-8 text-sm text-muted-foreground">{hint}</p>}
      </div>
      <div className="flex flex-col gap-5">{children}</div>
    </Card>
  );
}

function Chip({
  label,
  selected,
  disabled,
  onClick,
}: {
  label: string;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled && !selected}
      className={cn(
        "rounded-full border px-3 py-1.5 text-sm transition-colors",
        selected
          ? "border-ploy-blue bg-ploy-blue/10 text-ploy-blue"
          : "border-border text-muted-foreground hover:border-muted-foreground hover:text-foreground",
        disabled && !selected && "cursor-not-allowed opacity-40 hover:border-border"
      )}
    >
      {label}
    </button>
  );
}

function Counter({ value, max }: { value: number; max: number }) {
  return (
    <span className={cn("text-xs", value > max ? "text-destructive" : "text-muted-foreground")}>
      {value}/{max}
    </span>
  );
}

export function ListingForm({
  categories,
  existing,
}: {
  categories: Category[];
  existing?: Employee | null;
}) {
  const router = useRouter();
  const supabase = createClient();
  const isEditing = Boolean(existing);

  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const [saving, setSaving] = useState(false);
  const [slugTouched, setSlugTouched] = useState(Boolean(existing));

  const [form, setForm] = useState({
    name: existing?.name ?? "",
    slug: existing?.slug ?? "",
    categoryId: existing?.category_id ?? "",
    tagline: existing?.tagline ?? "",
    description: existing?.description ?? "",
    primaryTasks: existing?.primary_tasks ?? ([] as string[]),
    customTask: "",
    bestFor: existing?.industries ?? ([] as string[]),
    bestForDescription: existing?.best_for_description ?? "",
    agencyName: existing?.agency_name ?? "",
    websiteUrl: existing?.website_url ?? "",
    logoUrl: existing?.thumbnail_url ?? "",
  });

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const categoryName = useMemo(
    () => categories.find((c) => c.id === form.categoryId)?.name ?? null,
    [categories, form.categoryId]
  );

  const toggle = (key: "primaryTasks" | "bestFor", value: string, max?: number) => {
    const current = form[key];
    if (current.includes(value)) {
      set(key, current.filter((v: string) => v !== value));
    } else if (!max || current.length < max) {
      set(key, [...current, value]);
    }
  };

  const addCustomTask = () => {
    const task = form.customTask.trim();
    if (!task) return;
    if (form.primaryTasks.length >= MAX_PRIMARY_TASKS) {
      toast.error(`You can select up to ${MAX_PRIMARY_TASKS} tasks.`);
      return;
    }
    if (form.primaryTasks.includes(task)) return;
    setForm((f) => ({ ...f, primaryTasks: [...f.primaryTasks, task], customTask: "" }));
  };

  /** Returns the first validation error, or null when the form is publishable. */
  const validate = (): string | null => {
    if (!form.name.trim()) return "Add an AI employee name.";
    if (!form.categoryId) return "Choose a category.";
    if (!form.tagline.trim()) return "Add a tagline.";
    if (form.tagline.length > MAX_TAGLINE) return "Your tagline is too long.";
    if (!form.description.trim()) return "Add a description.";
    if (form.description.length > MAX_DESCRIPTION) return "Your description is too long.";
    if (form.primaryTasks.length === 0) return "Select at least one primary task.";
    if (!form.agencyName.trim()) return "Add your agency or company name.";
    if (!form.websiteUrl.trim()) return "Add your website URL.";
    if (!normaliseUrl(form.websiteUrl)) return "That website URL doesn't look valid.";
    return null;
  };

  const goToPreview = () => {
    const error = validate();
    if (error) {
      toast.error("Almost there", { description: error });
      return;
    }
    setMode("preview");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const publish = async () => {
    const error = validate();
    if (error) {
      toast.error("Almost there", { description: error });
      setMode("edit");
      return;
    }

    setSaving(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("You need to be signed in.");
      setSaving(false);
      return;
    }

    const payload = {
      profile_id: user.id,
      name: form.name.trim(),
      slug: form.slug.trim() || slugify(form.name),
      category_id: form.categoryId,
      tagline: form.tagline.trim(),
      description: form.description.trim(),
      primary_tasks: form.primaryTasks,
      industries: form.bestFor,
      best_for_description: form.bestForDescription.trim() || null,
      agency_name: form.agencyName.trim(),
      website_url: normaliseUrl(form.websiteUrl),
      thumbnail_url: form.logoUrl.trim() || null,
      // Ploy refers buyers to the agency — it never sells the AI employee.
      role: form.primaryTasks[0] ?? "AI Employee",
      status: "published" as const,
      is_published: true,
    };

    const { error: dbError } = isEditing
      ? await supabase.from("employees").update(payload).eq("id", existing!.id)
      : await supabase.from("employees").insert(payload);

    setSaving(false);

    if (dbError) {
      // The one-listing-per-user unique index surfaces here too.
      const duplicate = dbError.code === "23505";
      toast.error(duplicate ? "You already have a listing" : "Couldn't save your listing", {
        description: duplicate
          ? "Each Ploy Pro account can list one AI employee."
          : dbError.message,
      });
      return;
    }

    toast.success(isEditing ? "Listing updated" : "Your AI employee is now live.");
    router.push("/account/marketplace/listing");
    router.refresh();
  };

  if (mode === "preview") {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="font-semibold">Listing preview</h2>
          <p className="text-sm text-muted-foreground">
            This is roughly what businesses will see on the marketplace.
          </p>
        </div>

        <ListingPreview
          data={{
            name: form.name,
            categoryName,
            tagline: form.tagline,
            description: form.description,
            primaryTasks: form.primaryTasks,
            bestFor: form.bestFor,
            bestForDescription: form.bestForDescription,
            agencyName: form.agencyName,
            websiteUrl: form.websiteUrl,
            logoUrl: form.logoUrl,
          }}
        />

        <Card className="flex flex-col gap-4 p-6">
          <div>
            <h2 className="font-semibold">Ready to publish?</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Your AI employee will appear on the Ploy marketplace. Ploy Pro includes enhanced
              marketplace placement to help your listing get discovered.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={publish} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  {isEditing ? "Save Changes" : "Publish Listing"}
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => setMode("edit")} disabled={saving}>
              <ArrowLeft className="h-4 w-4" />
              Back to edit
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Section step={1} title="Basic information">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">AI Employee Name *</Label>
          <Input
            id="name"
            value={form.name}
            placeholder="e.g. AI Sales Representative"
            onChange={(e) => {
              const name = e.target.value;
              setForm((f) => ({
                ...f,
                name,
                slug: slugTouched ? f.slug : slugify(name),
              }));
            }}
          />
          {(form.name || form.slug) && (
            <p className="text-xs text-muted-foreground">
              /marketplace/
              <input
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  set("slug", slugify(e.target.value));
                }}
                className="border-b border-dashed border-border bg-transparent text-foreground outline-none focus:border-ploy-blue"
                size={Math.max(form.slug.length, 8)}
              />
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="category">Category *</Label>
          <select
            id="category"
            value={form.categoryId}
            onChange={(e) => set("categoryId", e.target.value)}
            className="h-10 rounded-md border border-border bg-secondary/50 px-3 text-sm"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="tagline">AI Employee Tagline *</Label>
            <Counter value={form.tagline.length} max={MAX_TAGLINE} />
          </div>
          <Input
            id="tagline"
            value={form.tagline}
            maxLength={MAX_TAGLINE}
            placeholder="e.g. Qualifies inbound leads and books meetings 24/7."
            onChange={(e) => set("tagline", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="description">Description *</Label>
            <Counter value={form.description.length} max={MAX_DESCRIPTION} />
          </div>
          <Textarea
            id="description"
            value={form.description}
            maxLength={MAX_DESCRIPTION}
            placeholder="Explain what this AI employee does, who it helps, and the main outcome it provides."
            className="min-h-28"
            onChange={(e) => set("description", e.target.value)}
          />
        </div>
      </Section>

      <Section
        step={2}
        title="What it does"
        hint={`Select up to ${MAX_PRIMARY_TASKS} tasks so businesses can see at a glance what this AI employee handles.`}
      >
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Label>Primary Tasks *</Label>
            <Counter value={form.primaryTasks.length} max={MAX_PRIMARY_TASKS} />
          </div>
          <div className="flex flex-wrap gap-2">
            {PRIMARY_TASKS.map((task) => (
              <Chip
                key={task}
                label={task}
                selected={form.primaryTasks.includes(task)}
                disabled={form.primaryTasks.length >= MAX_PRIMARY_TASKS}
                onClick={() => toggle("primaryTasks", task, MAX_PRIMARY_TASKS)}
              />
            ))}
          </div>

          {form.primaryTasks.filter((t: string) => !PRIMARY_TASKS.includes(t as never)).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.primaryTasks
                .filter((t: string) => !PRIMARY_TASKS.includes(t as never))
                .map((task: string) => (
                  <Chip
                    key={task}
                    label={task}
                    selected
                    onClick={() => toggle("primaryTasks", task)}
                  />
                ))}
            </div>
          )}

          <div className="flex gap-2">
            <Input
              value={form.customTask}
              placeholder="Add another task"
              onChange={(e) => set("customTask", e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCustomTask();
                }
              }}
            />
            <Button type="button" variant="outline" onClick={addCustomTask}>
              Add
            </Button>
          </div>
        </div>
      </Section>

      <Section step={3} title="Who it's for" hint="Optional, but it helps the right businesses find you.">
        <div className="flex flex-col gap-3">
          <Label>Best For</Label>
          <div className="flex flex-wrap gap-2">
            {BEST_FOR.map((item) => (
              <Chip
                key={item}
                label={item}
                selected={form.bestFor.includes(item)}
                onClick={() => toggle("bestFor", item)}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="bestForDescription">Best For description</Label>
          <Textarea
            id="bestForDescription"
            value={form.bestForDescription}
            placeholder="e.g. Best for growing B2B companies that need help managing inbound leads."
            className="min-h-20"
            onChange={(e) => set("bestForDescription", e.target.value)}
          />
        </div>
      </Section>

      <Section
        step={4}
        title="Company / agency"
        hint="Interested businesses are sent to your website — Ploy doesn't handle the sale."
      >
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="agencyName">Agency / Company Name *</Label>
          <Input
            id="agencyName"
            value={form.agencyName}
            placeholder="e.g. Fieldstone Labs"
            onChange={(e) => set("agencyName", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="websiteUrl">Website URL *</Label>
          <Input
            id="websiteUrl"
            value={form.websiteUrl}
            placeholder="e.g. fieldstonelabs.com"
            onChange={(e) => set("websiteUrl", e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Where the &quot;Visit Agency Website&quot; button sends businesses.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="logoUrl">Company Logo URL</Label>
          <Input
            id="logoUrl"
            value={form.logoUrl}
            placeholder="https://…/logo.png"
            onChange={(e) => set("logoUrl", e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Optional. Paste a link to your logo — file uploads aren&apos;t supported yet.
          </p>
        </div>
      </Section>

      <div className="flex flex-wrap gap-3">
        <Button onClick={goToPreview}>Preview listing</Button>
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
