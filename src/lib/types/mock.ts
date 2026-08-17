/**
 * Types for the pre-existing mock/demo data layer (`src/lib/data/*`, minus
 * `live-marketplace.ts`) that still backs the original marketplace/dashboard
 * pages. These are intentionally separate from `@/lib/types/database`
 * (the real, generated Supabase schema types) because the two shapes
 * diverge — this mock catalog predates the live schema and its pages are
 * being migrated to real data incrementally (marketplace-by-problem rebuild,
 * dashboard wiring). New code should use `@/lib/types/database` instead.
 */

export type UserRole = "business" | "agency" | "admin";

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  role: UserRole;
  is_admin: boolean;
  company_name: string | null;
  phone: string | null;
  onboarded: boolean;
  created_at: string;
  updated_at: string;
}

export type ListingStatus = "draft" | "pending_review" | "published" | "rejected" | "archived";
export type EmployeeStatus = ListingStatus;
export type PricingModel = "one_time" | "monthly" | "annual" | "custom";

export interface Employee {
  id: string;
  agency_id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  icon: string;
  cover_image_url: string;
  video_url: string | null;
  website_url: string | null;
  status: ListingStatus;
  is_featured: boolean;
  starting_price_cents: number;
  pricing_model: PricingModel;
  supported_software: string[];
  industries: string[];
  department: string;
  avg_rating: number;
  review_count: number;
  purchase_count: number;
  view_count: number;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  setup_days?: number;
  key_features?: string[];
}

export interface EmployeeFeature {
  id: string;
  employee_id: string;
  title: string;
  description: string;
  icon: string;
  sort_order: number;
}

export interface EmployeeImage {
  id: string;
  employee_id: string;
  url: string;
  alt_text: string;
  sort_order: number;
  created_at: string;
}

export interface Pricing {
  id: string;
  employee_id: string;
  tier_name: string;
  price_cents: number;
  billing_period: "monthly" | "custom";
  description: string;
  features: string[];
  is_most_popular: boolean;
  sort_order: number;
}

export interface Review {
  id: string;
  employee_id: string;
  user_id: string;
  order_id: string | null;
  rating: number;
  title: string;
  body: string;
  is_verified_purchase: boolean;
  created_at: string;
  author_name: string;
  author_avatar_url: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  sort_order: number;
  created_at: string;
}

export type AgencyStatus = "approved" | "pending" | "rejected" | "suspended";

export interface Agency {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  logo_url: string;
  cover_image_url: string;
  website_url: string;
  contact_email: string;
  twitter_url: string | null;
  linkedin_url: string;
  status: AgencyStatus;
  is_verified: boolean;
  is_featured: boolean;
  founded_year: number;
  team_size: string;
  headquarters: string;
  created_at: string;
  updated_at: string;
}

export interface AgencyWithRelations extends Agency {
  employees: Employee[];
  reviewCount: number;
  avgRating: number;
}

export interface EmployeeWithRelations extends Employee {
  agency: {
    id: string;
    name: string;
    slug: string;
    logo_url: string;
    is_verified: boolean;
    website_url: string;
  };
  categories: Category[];
  images: EmployeeImage[];
  features: EmployeeFeature[];
  pricing: Pricing[];
  reviews: Review[];
}

export type OrderStatus = "pending" | "paid" | "fulfilling" | "completed" | "refunded" | "cancelled";

export interface Order {
  id: string;
  employee_id: string;
  buyer_id: string;
  agency_id: string;
  pricing_id: string | null;
  amount_cents: number;
  commission_pct: number;
  commission_cents: number;
  agency_payout_cents: number;
  status: OrderStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type CommissionStatus = "pending" | "cleared" | "paid_out";

export interface Commission {
  id: string;
  order_id: string;
  agency_id: string;
  amount_cents: number;
  status: CommissionStatus;
  cleared_at: string | null;
  paid_out_at: string | null;
  created_at: string;
}

export interface Message {
  id: string;
  thread_id: string;
  sender_id: string;
  recipient_id: string;
  employee_id: string | null;
  body: string;
  read_at: string | null;
  created_at: string;
}

export type NotificationType =
  | "demo_request"
  | "order_placed"
  | "order_paid"
  | "listing_approved"
  | "listing_rejected"
  | "review_received"
  | "message_received"
  | "payout_sent";

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string;
  link: string;
  read_at: string | null;
  created_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  employee_id: string;
  created_at: string;
}

export type DemoRequestStatus = "new" | "contacted" | "scheduled" | "completed" | "declined";

export interface DemoRequest {
  id: string;
  employee_id: string;
  agency_id: string;
  user_id: string | null;
  full_name: string;
  email: string;
  company_name: string;
  message: string | null;
  status: DemoRequestStatus;
  created_at: string;
  updated_at: string;
}

export type BlogPostStatus = "draft" | "published";

export interface BlogPost {
  id: string;
  author_id: string | null;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string;
  status: BlogPostStatus;
  published_at: string | null;
  created_at: string;
}
