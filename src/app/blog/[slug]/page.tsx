import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/data/blog";

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt ?? undefined };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post || post.status !== "published") notFound();

  return (
    <article className="container max-w-2xl py-20">
      <p className="text-sm text-muted-foreground">{post.published_at && formatDate(post.published_at)}</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{post.title}</h1>
      {post.cover_image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.cover_image_url} alt="" className="mt-8 aspect-[16/9] w-full rounded-2xl object-cover" />
      )}
      <div className="prose prose-neutral mt-8 max-w-none text-muted-foreground">
        <p>{post.excerpt}</p>
        <p>{post.content}</p>
      </div>
    </article>
  );
}
