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
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { ListingPreview } from "@/components/listing/listing-preview";
import { LogoUpload } from "@/components/listing/logo-upload";
import { ProVisibilityDisclosure } from "@/components/legal/disclosures";
import { acceptProviderTerms } from "@/app/actions/legal";
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
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ploy-gold/10 text-xs font-mono text-ploy-gold">
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
          ? "border-ploy-gold bg-ploy-gold/10 text-ploy-gold"
          : "border-border text-muted-foreground hover:border-muted-foreground hover:text-foreground",
        disabled && !selected && "cursor-not-allowed opacity-40 hover:border-border"
      )}
    >
      {label}
    </button>
  );
}

/**
 * Marks the "Other" choice in the category select. Categories are real rows
 * with uuid ids, so this string can never collide with one — and it must never
 * reach category_id, which is a uuid foreign key.
 */
const OTHER_CATEGORY = "other";

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
  // Never pre-checked, and never remembered from a previous submission: the
  // provider re-confirms the listing is accurate each time they publish. The
  // employees RLS policies require a recorded acceptance regardless, so this
  // checkbox is the prompt, not the enforcement.
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [form, setForm] = useState({
    name: existing?.name ?? "",
    slug: existing?.slug ?? "",
    // An existing listing with a custom category has no category_id, so the
    // sentinel is what re-opens the text field when they come back to edit it.
    categoryId: existing?.custom_category ? OTHER_CATEGORY : existing?.category_id ?? "",
    customCategory: existing?.custom_category ?? "",
    tagline: existing?.tagline ?? "",
    description: existing?.description ?? "",
    primaryTasks: existing?.primary_tasks ?? ([] as string[]),
    customTask: "",
    bestFor: existing?.industries ?? ([] as string[]),
    bestForDescription: existing?.best_for_description ?? "",
    agencyName: existing?.agency_name ?? "",
    websiteUrl: existing?.website_url ?? "",
    logoUrl: existing?.thumbnail_url ?? "",
    // A listing with no price is shown as "Custom Pricing" on the marketplace,
    // which is a legitimate choice — plenty of agencies quote per engagement.
    pricingType: existing && existing.price_monthly == null ? "custom" : "monthly",
    priceMonthly: existing?.price_monthly != null ? String(existing.price_monthly) : "",
  });

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const categoryName = useMemo(
    () => {
      if (form.categoryId === OTHER_CATEGORY) {
        return form.customCategory.trim() || "Other";
      }
      return categories.find((c) => c.id === form.categoryId)?.name ?? null;
    },
    [categories, form.categoryId, form.customCategory]
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
    if (form.categoryId === OTHER_CATEGORY && !form.customCategory.trim())
      return "Name your custom category.";
    if (!form.tagline.trim()) return "Add a tagline.";
    if (form.tagline.length > MAX_TAGLINE) return "Your tagline is too long.";
    if (!form.description.trim()) return "Add a description.";
    if (form.description.length > MAX_DESCRIPTION) return "Your description is too long.";
    if (form.primaryTasks.length === 0) return "Select at least one primary task.";
    if (form.pricingType === "monthly") {
      if (!form.priceMonthly.trim()) return "Add a monthly price, or choose custom pricing.";
      const price = Number(form.priceMonthly);
      if (!Number.isFinite(price) || price < 0) return "That monthly price doesn't look valid.";
    }
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

    if (!acceptedTerms) {
      toast.error("Please confirm the Marketplace Provider Terms", {
        description: "You'll need to agree before your listing can be submitted.",
      });
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

    // Recorded before the write because the employees insert/update policies
    // check for an acceptance row — without this the database refuses the
    // listing rather than saving it unaccepted.
    const accepted = await acceptProviderTerms();
    if (!accepted.ok) {
      toast.error("Couldn't record your agreement", { description: accepted.error });
      setSaving(false);
      return;
    }

    const payload = {
      profile_id: user.id,
      name: form.name.trim(),
      slug: form.slug.trim() || slugify(form.name),
      // "Other" is not a row in categories, so the uuid column stays null and
      // the provider's own wording is the only record of it.
      category_id: form.categoryId === OTHER_CATEGORY ? null : form.categoryId || null,
      custom_category:
        form.categoryId === OTHER_CATEGORY ? form.customCategory.trim() : null,
      tagline: form.tagline.trim(),
      description: form.description.trim(),
      primary_tasks: form.primaryTasks,
      industries: form.bestFor,
      best_for_description: form.bestForDescription.trim() || null,
      agency_name: form.agencyName.trim(),
      website_url: normaliseUrl(form.websiteUrl),
      thumbnail_url: form.logoUrl.trim() || null,
      // null renders as "Custom Pricing" on the marketplace card and hides the
      // price block on the detail page.
      price_monthly: form.pricingType === "monthly" ? Number(form.priceMonthly) : null,
      price_type: form.pricingType === "monthly" ? "monthly" : "custom",
      // Ploy refers buyers to the agency — it never sells the AI employee.
      role: form.primaryTasks[0] ?? "AI Employee",
      // Everything a user saves — new listing, edit of an approved one, or a
      // resubmitted rejection — enters review. An approved listing must not
      // stay live carrying changes nobody has looked at, and this is the only
      // status an owner is allowed to write (see the employees_update_own RLS
      // policy), so it can't be worked around from the client either.
      status: "pending_review" as const,
      is_published: false,
      rejection_reason: null,
    };

    const { error: dbError } = isEditing
      ? await supabase.from("employees").update(payload).eq("id", existing!.id)
      : await supabase.from("employees").insert(payload);

    setSaving(false);

    if (dbError) {
      // employees.slug is unique across the whole table, so this fires when the
      // name a provider chose slugifies onto one that already exists.
      const duplicate = dbError.code === "23505";
      toast.error(duplicate ? "That name is already taken" : "Couldn't save your listing", {
        description: duplicate
          ? "Another listing already uses this name. Try a more specific one."
          : dbError.message,
      });
      return;
    }

    toast.success(isEditing ? "Changes submitted for review" : "Submitted for review", {
      description: isEditing
        ? "Your listing is off the marketplace until the update is approved."
        : "We'll let you know once your AI employee is approved.",
    });
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
            priceMonthly:
              form.pricingType === "monthly" && form.priceMonthly.trim()
                ? Number(form.priceMonthly)
                : null,
          }}
        />

        <Card className="flex flex-col gap-4 p-6">
          <div>
            <h2 className="font-semibold">Ready to submit?</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {isEditing
                ? "Your changes go to our team for review. Your listing is temporarily removed from the marketplace until the update is approved."
                : "Our team reviews every AI employee before it goes on the marketplace. You'll see the status on your listing page."}
            </p>
          </div>

          <p className="text-xs leading-relaxed text-muted-foreground">
            Review is for inclusion on Ploy. It isn&apos;t a certification, and Ploy doesn&apos;t
            verify or guarantee your product&apos;s performance, security or results.
          </p>

          <label
            htmlFor="accept-provider-terms"
            className="flex cursor-pointer items-start gap-2.5 rounded-xl border border-border bg-secondary/20 p-4 text-sm"
          >
            <Checkbox
              id="accept-provider-terms"
              checked={acceptedTerms}
              onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
              className="mt-0.5"
            />
            <span className="text-muted-foreground">
              I agree to the{" "}
              <Link
                href="/marketplace-provider-terms"
                target="_blank"
                className="font-medium text-foreground underline-offset-4 hover:text-ploy-gold hover:underline"
              >
                Ploy Marketplace Provider Terms
              </Link>{" "}
              and confirm that the information in this listing — including its pricing and what it
              claims this AI employee does — is accurate, and that I have the right to list it.
            </span>
          </label>

          <div className="flex flex-wrap gap-3">
            <Button onClick={publish} disabled={saving || !acceptedTerms}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  {isEditing ? "Submit Changes for Review" : "Submit for Review"}
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
                className="border-b border-dashed border-border bg-transparent text-foreground outline-none focus:border-ploy-gold"
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
            <option value={OTHER_CATEGORY}>Other</option>
          </select>
        </div>

        {form.categoryId === OTHER_CATEGORY && (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="customCategory">Custom category name *</Label>
            <Input
              id="customCategory"
              value={form.customCategory}
              placeholder="e.g., Accounting, Manufacturing, Education"
              onChange={(e) => set("customCategory", e.target.value)}
            />
          </div>
        )}

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
        title="Pricing"
        hint="Shown on your marketplace card so businesses can compare at a glance."
      >
        <div className="flex flex-col gap-3">
          <Label>How do you price this? *</Label>
          <div className="flex flex-wrap gap-2">
            <Chip
              label="Monthly price"
              selected={form.pricingType === "monthly"}
              onClick={() => set("pricingType", "monthly")}
            />
            <Chip
              label="Custom pricing"
              selected={form.pricingType === "custom"}
              onClick={() => set("pricingType", "custom")}
            />
          </div>
        </div>

        {form.pricingType === "monthly" ? (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="priceMonthly">Starting price *</Label>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">$</span>
              <Input
                id="priceMonthly"
                type="number"
                min={0}
                step={1}
                inputMode="numeric"
                value={form.priceMonthly}
                placeholder="149"
                className="max-w-40"
                onChange={(e) => set("priceMonthly", e.target.value)}
              />
              <span className="text-sm text-muted-foreground">/month</span>
            </div>
            <p className="text-xs text-muted-foreground">
              If you have tiers, use the lowest — it shows as &ldquo;Starting at&rdquo;.
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Your listing will show <strong className="text-foreground">Custom Pricing</strong>, and
            businesses will get a quote from you directly.
          </p>
        )}
      </Section>

      <Section
        step={5}
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

        <div className="flex flex-col gap-2">
          <Label>Company Logo</Label>
          <LogoUpload value={form.logoUrl} onChange={(url) => set("logoUrl", url)} />
          <p className="text-xs text-muted-foreground">
            Optional. Shown on your marketplace card and listing page.
          </p>
        </div>
      </Section>

      <ProVisibilityDisclosure />

      <div className="flex flex-wrap gap-3">
        <Button onClick={goToPreview}>Preview listing</Button>
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
