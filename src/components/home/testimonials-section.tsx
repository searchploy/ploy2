import { Quote } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { testimonials } from "@/lib/data/testimonials";
import { initials } from "@/lib/utils";

export function TestimonialsSection() {
  return (
    <section className="bg-secondary/30 py-24">
      <div className="container flex flex-col gap-12">
        <SectionHeading eyebrow="Testimonials" title="Loved by businesses and agencies alike" />
        <div className="grid gap-6 md:grid-cols-2">
          {testimonials.map((t) => (
            <div key={t.id} className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-8">
              <Quote className="h-6 w-6 text-ploy-blue" />
              <p className="text-balance text-lg leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-auto flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={t.avatar_url} alt={t.author} />
                  <AvatarFallback>{initials(t.author)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{t.author}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.role}, {t.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
