"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Database } from "@/lib/types/database";

type Category = Database["public"]["Tables"]["categories"]["Row"];

interface ListingCreateFormProps {
  categories: Category[];
}

export function ListingCreateForm({ categories }: ListingCreateFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    tagline: "",
    description: "",
    category_id: "",
    role: "",
    price_type: "monthly",
    price_monthly: "",
    price_annual: "",
    setup_time: "",
    business_problems: [] as string[],
    integrations: [] as string[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Not authenticated");
      }

      // Create the listing
      const { error, data } = await supabase
        .from("employees")
        .insert([
          {
            profile_id: user.id,
            name: formData.name,
            slug: formData.slug,
            tagline: formData.tagline,
            description: formData.description,
            category_id: formData.category_id,
            role: formData.role,
            price_type: formData.price_type,
            price_monthly: formData.price_monthly
              ? Math.round(parseFloat(formData.price_monthly) * 100)
              : null,
            price_annual: formData.price_annual
              ? Math.round(parseFloat(formData.price_annual) * 100)
              : null,
            setup_time: formData.setup_time,
            business_problems: formData.business_problems,
            integrations: formData.integrations,
            status: "draft",
            is_published: false,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      router.push("/account/marketplace/listing");
    } catch (error) {
      console.error("Error creating listing:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
        <h2 className="text-lg font-semibold">Basic Information</h2>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            Solution Name
          </label>
          <Input
            required
            value={formData.name}
            onChange={(e) => {
              const name = e.target.value;
              setFormData({
                ...formData,
                name,
                slug: generateSlug(name),
              });
            }}
            placeholder="e.g., ChatGPT for Customer Support"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            URL Slug
          </label>
          <Input
            required
            value={formData.slug}
            onChange={(e) =>
              setFormData({ ...formData, slug: e.target.value })
            }
            placeholder="e.g., chatgpt-customer-support"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Will be used in marketplace URL
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Tagline</label>
          <Input
            required
            value={formData.tagline}
            onChange={(e) =>
              setFormData({ ...formData, tagline: e.target.value })
            }
            placeholder="One-line description of your solution"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            Description
          </label>
          <Textarea
            required
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Detailed description of your AI solution"
            className="min-h-32"
          />
        </div>
      </div>

      {/* Category & Role */}
      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
        <h2 className="text-lg font-semibold">Category & Role</h2>

        <div>
          <label className="block text-sm font-medium mb-1.5">Category</label>
          <select
            required
            value={formData.category_id}
            onChange={(e) =>
              setFormData({ ...formData, category_id: e.target.value })
            }
            className="w-full rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Role</label>
          <Input
            required
            value={formData.role}
            onChange={(e) =>
              setFormData({ ...formData, role: e.target.value })
            }
            placeholder="e.g., Support Agent, Content Writer"
          />
        </div>
      </div>

      {/* Pricing */}
      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
        <h2 className="text-lg font-semibold">Pricing</h2>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            Price Type
          </label>
          <select
            value={formData.price_type}
            onChange={(e) =>
              setFormData({ ...formData, price_type: e.target.value })
            }
            className="w-full rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm"
          >
            <option value="monthly">Monthly</option>
            <option value="annual">Annual</option>
            <option value="both">Both</option>
          </select>
        </div>

        {(formData.price_type === "monthly" ||
          formData.price_type === "both") && (
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Monthly Price ($)
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={formData.price_monthly}
              onChange={(e) =>
                setFormData({ ...formData, price_monthly: e.target.value })
              }
              placeholder="0.00"
            />
          </div>
        )}

        {(formData.price_type === "annual" ||
          formData.price_type === "both") && (
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Annual Price ($)
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={formData.price_annual}
              onChange={(e) =>
                setFormData({ ...formData, price_annual: e.target.value })
              }
              placeholder="0.00"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1.5">
            Setup Time
          </label>
          <Input
            value={formData.setup_time}
            onChange={(e) =>
              setFormData({ ...formData, setup_time: e.target.value })
            }
            placeholder="e.g., 1 hour, 2 days"
          />
        </div>
      </div>

      {/* Additional Information */}
      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
        <h2 className="text-lg font-semibold">Additional Information</h2>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            Business Problems (comma-separated)
          </label>
          <Textarea
            value={formData.business_problems.join(", ")}
            onChange={(e) =>
              setFormData({
                ...formData,
                business_problems: e.target.value.split(",").map((p) => p.trim()),
              })
            }
            placeholder="e.g., Slow response times, High support costs"
            className="min-h-20"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            Integrations (comma-separated)
          </label>
          <Textarea
            value={formData.integrations.join(", ")}
            onChange={(e) =>
              setFormData({
                ...formData,
                integrations: e.target.value.split(",").map((i) => i.trim()),
              })
            }
            placeholder="e.g., Slack, Salesforce, HubSpot"
            className="min-h-20"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <Button
          variant="outline"
          type="button"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Listing"}
        </Button>
      </div>
    </form>
  );
}
