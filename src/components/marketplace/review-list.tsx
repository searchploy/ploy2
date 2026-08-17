import { BadgeCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RatingStars } from "@/components/shared/rating-stars";
import { formatDate, initials } from "@/lib/utils";
import type { Review } from "@/lib/types/mock";

export function ReviewList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return <p className="text-sm text-muted-foreground">No reviews yet — be the first to leave one after purchase.</p>;
  }

  return (
    <div className="flex flex-col divide-y divide-border">
      {reviews.map((review) => (
        <div key={review.id} className="flex flex-col gap-3 py-6 first:pt-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src={review.author_avatar_url ?? undefined} alt={review.author_name ?? ""} />
                <AvatarFallback>{initials(review.author_name ?? "U")}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-medium">{review.author_name}</p>
                  {review.is_verified_purchase && (
                    <span className="inline-flex items-center gap-1 text-xs text-ploy-blue">
                      <BadgeCheck className="h-3 w-3" /> Verified purchase
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{formatDate(review.created_at)}</p>
              </div>
            </div>
            <RatingStars rating={review.rating} />
          </div>
          {review.title && <p className="font-medium">{review.title}</p>}
          {review.body && <p className="text-sm text-muted-foreground">{review.body}</p>}
        </div>
      ))}
    </div>
  );
}
