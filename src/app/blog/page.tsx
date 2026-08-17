import Link from "next/link";
import type { Metadata } from "next";
import { SectionHeading } from "@/components/shared/section-heading";
import { formatDate } from "@/lib/utils";
import { getBlogPosts } from "@/lib/data/blog";

export const metadata: Metadata = { title: "Blog" };

export default async function BlogIndexPage() {
  const posts = await getBlogPosts();

  return (
    <div className="container py-20">
      <SectionHeading eyebrow="Blog" title="News and ideas from Ploy" align="left" className="items-start text-left" />
      <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`} className="group flex flex-col gap-3">
            <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-secondary">
              {post.cover_image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.cover_image_url}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
            </div>
            <p className="text-xs text-muted-foreground">{post.published_at && formatDate(post.published_at)}</p>
            <h3 className="font-semibold leading-snug transition-colors group-hover:text-ploy-blue">{post.title}</h3>
            <p className="line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
