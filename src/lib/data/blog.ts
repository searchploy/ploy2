import type { BlogPost } from "@/lib/types/mock";

export const blogPosts: BlogPost[] = [
  {
    id: "post-1",
    author_id: null,
    title: "The rise of the AI Employee: how businesses are hiring differently in 2026",
    slug: "rise-of-the-ai-employee",
    excerpt: "Why more companies are hiring AI employees for entire job functions instead of buying point-solution software.",
    content: "Full article content would go here.",
    cover_image_url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&h=700&fit=crop",
    status: "published",
    published_at: "2026-06-01",
    created_at: "2026-05-28",
  },
  {
    id: "post-2",
    author_id: null,
    title: "How to evaluate an AI employee before you buy",
    slug: "how-to-evaluate-an-ai-employee",
    excerpt: "A practical checklist for comparing AI employees across agencies — integrations, pricing, and proof of results.",
    content: "Full article content would go here.",
    cover_image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=700&fit=crop",
    status: "published",
    published_at: "2026-05-15",
    created_at: "2026-05-10",
  },
  {
    id: "post-3",
    author_id: null,
    title: "Inside Northbeam AI: building AI sales reps that actually close",
    slug: "inside-northbeam-ai",
    excerpt: "A conversation with the team behind two of Ploy's top-rated AI employees.",
    content: "Full article content would go here.",
    cover_image_url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=700&fit=crop",
    status: "published",
    published_at: "2026-04-22",
    created_at: "2026-04-18",
  },
];

export async function getBlogPosts(): Promise<BlogPost[]> {
  return blogPosts.filter((p) => p.status === "published");
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  return blogPosts.find((p) => p.slug === slug);
}
