"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RatingStars } from "@/components/shared/rating-stars";
import { PriceBadge } from "@/components/shared/price-badge";
import { CategoryIcon } from "@/components/shared/category-icon";
import type { Category, Employee } from "@/lib/types/mock";

export interface EmployeeCardData extends Employee {
  agency: { name: string; slug: string; is_verified: boolean };
  categories: Category[];
}

export function EmployeeCard({ employee, index = 0 }: { employee: EmployeeCardData; index?: number }) {
  const primaryCategory = employee.categories[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
    >
      <Card className="group flex h-full flex-col overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-ploy-gold/5 hover-glow-border">
        <Link href={`/marketplace/${employee.slug}`} className="relative block aspect-[16/10] overflow-hidden bg-secondary">
          {employee.cover_image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={employee.cover_image_url}
              alt={employee.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
          {primaryCategory && (
            <Badge variant="blue" className="absolute left-3 top-3 bg-background/90 backdrop-blur">
              <CategoryIcon name={primaryCategory.icon} className="h-3 w-3" />
              {primaryCategory.name}
            </Badge>
          )}
          {employee.is_featured && (
            <Badge className="absolute right-3 top-3 bg-foreground/90 text-background">Featured</Badge>
          )}
        </Link>

        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <Link href={`/marketplace/${employee.slug}`}>
                <h3 className="font-semibold leading-tight transition-colors group-hover:text-ploy-gold">
                  {employee.name}
                </h3>
              </Link>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{employee.tagline}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <span>by</span>
            <Link href={`/agencies/${employee.agency.slug}`} className="inline-flex items-center gap-1 font-medium text-foreground hover:text-ploy-gold">
              {employee.agency.name}
              {employee.agency.is_verified && <BadgeCheck className="h-3.5 w-3.5 text-ploy-gold" />}
            </Link>
          </div>

          <RatingStars rating={employee.avg_rating} reviewCount={employee.review_count} />

          <div className="mt-auto flex items-center justify-between pt-3">
            <div>
              <p className="text-xs text-muted-foreground">Starting at</p>
              <PriceBadge cents={employee.starting_price_cents} model={employee.pricing_model} />
            </div>
            <Button asChild size="sm">
              <Link href={`/marketplace/${employee.slug}`}>View Details</Link>
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
