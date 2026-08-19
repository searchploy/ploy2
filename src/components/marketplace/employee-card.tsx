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
import { cn } from "@/lib/utils";
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
      {/*
        Section 11: only featured listings carry the gold rim and glow, so gold
        continues to mean "promoted" rather than decorating every card.
      */}
      <Card
        circular
        className={cn(
          "group relative flex h-full w-full flex-col items-center justify-center overflow-hidden transition-all hover:-translate-y-1 hover-glow-border p-6",
          employee.is_featured && "gold-hairline gold-glow"
        )}
      >
        <Link href={`/marketplace/${employee.slug}`} className="absolute inset-0 flex flex-col items-center justify-center">
          {employee.cover_image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={employee.cover_image_url}
              alt={employee.name}
              className="absolute inset-0 h-full w-full rounded-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 rounded-full bg-gradient-to-t from-background via-background/50 to-transparent" />
          <div className="relative z-10 flex flex-col items-center justify-center gap-2 text-center">
            <h3 className="font-semibold leading-tight transition-colors group-hover:text-ploy-gold line-clamp-1">
              {employee.name}
            </h3>
            <p className="line-clamp-1 text-xs text-muted-foreground">{employee.tagline}</p>
            <div className="flex items-center gap-1">
              <Link href={`/agencies/${employee.agency.slug}`} className="inline-flex items-center gap-1 text-xs font-medium text-foreground hover:text-ploy-gold">
                {employee.agency.name}
                {employee.agency.is_verified && <BadgeCheck className="h-3 w-3 text-ploy-gold" />}
              </Link>
            </div>
            <div className="pt-2">
              <RatingStars rating={employee.avg_rating} reviewCount={employee.review_count} />
            </div>
          </div>
          {primaryCategory && (
            <Badge variant="blue" className="absolute left-3 top-3 z-20 bg-background/90 backdrop-blur">
              <CategoryIcon name={primaryCategory.icon} className="h-3 w-3" />
              {primaryCategory.name}
            </Badge>
          )}
          {employee.is_featured && (
            <Badge variant="premium" className="absolute right-3 top-3 z-20">
              Featured
            </Badge>
          )}
        </Link>
      </Card>
    </motion.div>
  );
}
