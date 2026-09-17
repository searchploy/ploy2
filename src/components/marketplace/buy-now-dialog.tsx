import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Ploy never hosts checkout or setup. This is a plain outbound link to the
 * agency's own website — the business signs up, sets pricing, and gets set up
 * entirely on the agency's side. Ploy takes no commission, referral fee or
 * revenue share on whatever happens after the click.
 */
export function BuyNowDialog({
  agencyName,
  websiteUrl,
}: {
  employeeName: string;
  agencyName: string;
  websiteUrl: string | null;
}) {
  if (!websiteUrl) return null;

  return (
    <Button asChild size="lg" variant="gradient" className="flex-1">
      {/* Not rel="sponsored": Ploy is not paid for this placement. */}
      <a href={websiteUrl} target="_blank" rel="noopener noreferrer">
        Visit {agencyName}
        <ExternalLink className="h-4 w-4" />
      </a>
    </Button>
  );
}
