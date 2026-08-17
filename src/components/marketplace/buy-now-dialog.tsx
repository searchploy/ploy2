import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Ploy never hosts checkout or setup. This is a plain outbound link to the
 * agency's own website — the business signs up, sets pricing, and gets set
 * up entirely on the agency's side. Ploy earns a commission if that visit
 * turns into a sale (tracked via `orders` / `commissions`, reported by the
 * agency), not by processing anything itself.
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
      <a href={websiteUrl} target="_blank" rel="noopener noreferrer sponsored">
        Visit {agencyName}
        <ExternalLink className="h-4 w-4" />
      </a>
    </Button>
  );
}
