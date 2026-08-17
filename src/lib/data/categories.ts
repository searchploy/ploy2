import type { Category } from "@/lib/types/mock";

export const categories: Category[] = [
  { id: "cat-sales", name: "Sales", slug: "sales", description: "AI employees that book meetings and close deals.", icon: "TrendingUp", sort_order: 1, created_at: "2025-01-01" },
  { id: "cat-marketing", name: "Marketing", slug: "marketing", description: "Content, campaigns, and growth on autopilot.", icon: "Megaphone", sort_order: 2, created_at: "2025-01-01" },
  { id: "cat-support", name: "Support", slug: "support", description: "24/7 customer support that resolves tickets instantly.", icon: "Headset", sort_order: 3, created_at: "2025-01-01" },
  { id: "cat-finance", name: "Finance", slug: "finance", description: "Bookkeeping, invoicing, and financial reporting.", icon: "Landmark", sort_order: 4, created_at: "2025-01-01" },
  { id: "cat-operations", name: "Operations", slug: "operations", description: "Process automation and back-office execution.", icon: "Settings2", sort_order: 5, created_at: "2025-01-01" },
  { id: "cat-hr", name: "HR", slug: "hr", description: "Onboarding, policy, and people-ops support.", icon: "Users", sort_order: 6, created_at: "2025-01-01" },
  { id: "cat-recruiting", name: "Recruiting", slug: "recruiting", description: "Sourcing, screening, and scheduling candidates.", icon: "UserSearch", sort_order: 7, created_at: "2025-01-01" },
  { id: "cat-legal", name: "Legal", slug: "legal", description: "Contract review and compliance workflows.", icon: "Scale", sort_order: 8, created_at: "2025-01-01" },
  { id: "cat-healthcare", name: "Healthcare", slug: "healthcare", description: "Patient scheduling and intake automation.", icon: "HeartPulse", sort_order: 9, created_at: "2025-01-01" },
  { id: "cat-real-estate", name: "Real Estate", slug: "real-estate", description: "Lead follow-up and listing management.", icon: "Building2", sort_order: 10, created_at: "2025-01-01" },
  { id: "cat-ecommerce", name: "Ecommerce", slug: "ecommerce", description: "Order support and post-purchase automation.", icon: "ShoppingCart", sort_order: 11, created_at: "2025-01-01" },
  { id: "cat-construction", name: "Construction", slug: "construction", description: "Bid follow-up and project coordination.", icon: "HardHat", sort_order: 12, created_at: "2025-01-01" },
];

export async function getCategories(): Promise<Category[]> {
  return categories;
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  return categories.find((c) => c.slug === slug);
}
