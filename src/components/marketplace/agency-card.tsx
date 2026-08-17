"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BadgeCheck, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { initials } from "@/lib/utils";
import type { Agency } from "@/lib/types/mock";

export function AgencyCard({
  agency,
  employeeCount,
  rating,
  index = 0,
}: {
  agency: Agency;
  employeeCount: number;
  rating: number;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
    >
      <Card className="flex h-full flex-col gap-4 p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-ploy-blue/5">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border border-border">
            <AvatarImage src={agency.logo_url ?? undefined} alt={agency.name} />
            <AvatarFallback>{initials(agency.name)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-semibold">{agency.name}</h3>
              {agency.is_verified && <BadgeCheck className="h-4 w-4 text-ploy-blue" />}
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              {rating > 0 ? rating.toFixed(1) : "New"}
            </div>
          </div>
        </div>

        <p className="line-clamp-3 flex-1 text-sm text-muted-foreground">{agency.tagline}</p>

        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-muted-foreground">{employeeCount} AI employees</span>
          <Button asChild size="sm" variant="outline">
            <Link href={`/agencies/${agency.slug}`}>Visit profile</Link>
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
