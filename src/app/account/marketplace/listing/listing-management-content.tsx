"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, Share2 } from "lucide-react";
import type { Database } from "@/lib/types/database";

type Employee = Database["public"]["Tables"]["employees"]["Row"];

interface ListingManagementContentProps {
  listing: Employee;
}

export function ListingManagementContent({
  listing,
}: ListingManagementContentProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-start justify-between gap-6">
        {/* Listing Preview */}
        <div className="flex-1">
          <div className="flex items-start gap-4 mb-4">
            {listing.thumbnail_url && (
              <img
                src={listing.thumbnail_url}
                alt={listing.name}
                className="h-24 w-24 rounded-lg object-cover"
              />
            )}
            <div>
              <h2 className="text-2xl font-bold">{listing.name}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {listing.tagline}
              </p>
              <div className="flex flex-col gap-2 mt-3">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold w-fit ${
                    listing.status === "published"
                      ? "bg-green-500/20 text-green-400"
                      : listing.status === "pending_review"
                      ? "bg-amber-500/20 text-amber-400"
                      : listing.status === "rejected"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-gray-500/20 text-gray-400"
                  }`}
                >
                  {listing.status === "published"
                    ? "✓ Approved"
                    : listing.status === "pending_review"
                    ? "⏳ Pending Review"
                    : listing.status === "rejected"
                    ? "✗ Rejected"
                    : listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                </span>
                {listing.status === "pending_review" && (
                  <p className="text-xs text-amber-400">
                    Your listing is under review. We'll notify you when it's approved.
                  </p>
                )}
                {listing.status === "rejected" && (
                  <p className="text-xs text-red-400">
                    Your listing was rejected. Please update and try again.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-4 mt-4">
            <p className="text-sm text-muted-foreground mb-3">
              {listing.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-border pt-4 mt-4">
            {listing.avg_roi_percent && (
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Average ROI
                </p>
                <p className="text-sm font-semibold">
                  {listing.avg_roi_percent}%
                </p>
              </div>
            )}
            {listing.expected_monthly_savings && (
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Monthly Savings
                </p>
                <p className="text-sm font-semibold">
                  ${(listing.expected_monthly_savings / 100).toLocaleString()}
                </p>
              </div>
            )}
            {listing.setup_time && (
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Setup Time
                </p>
                <p className="text-sm font-semibold">{listing.setup_time}</p>
              </div>
            )}
            {listing.price_monthly && (
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Price
                </p>
                <p className="text-sm font-semibold">
                  ${(listing.price_monthly / 100).toLocaleString()}/mo
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Actions Sidebar */}
        <div className="w-48 space-y-2">
          {listing.status === "published" && (
            <Button asChild variant="outline" className="w-full">
              <Link href={`/marketplace/${listing.slug}`}>
                <Eye className="h-4 w-4 mr-2" />
                View Listing
              </Link>
            </Button>
          )}

          {listing.status === "rejected" && (
            <Button asChild variant="outline" className="w-full bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20">
              <Link href={`/account/marketplace/listing/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Try Again
              </Link>
            </Button>
          )}

          {listing.status !== "rejected" && (
            <Button asChild variant="outline" className="w-full">
              <Link href={`/account/marketplace/listing/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </Button>
          )}

          {listing.status === "published" && (
            <Button variant="outline" size="sm" className="w-full">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          )}

          <Button
            variant="destructive"
            size="sm"
            className="w-full"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 border-t border-border pt-4 mt-6">
        <div>
          <p className="text-xs font-medium text-muted-foreground">
            Total Views
          </p>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground">
            Total Clicks
          </p>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground">
            Conversions
          </p>
          <p className="text-2xl font-bold">0</p>
        </div>
      </div>
    </div>
  );
}
