"use client";

import { useRouter, unstable_rethrow } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { createCheckoutAction } from "@/app/pricing/actions";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { SubscriptionType } from "@/lib/types/database";

export function UpgradeButton({
  subscriptionType,
  returnTo,
  children,
  className,
  size = "lg",
}: {
  subscriptionType: SubscriptionType;
  returnTo: string;
  children: React.ReactNode;
  className?: string;
  size?: "default" | "sm" | "lg";
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      // If not authenticated, redirect to sign-up with appropriate role
      if (!user) {
        router.push(`/sign-up?role=${subscriptionType}&redirect=${encodeURIComponent(returnTo)}`);
        return;
      }

      // If authenticated, proceed with checkout
      await createCheckoutAction(subscriptionType, returnTo);
    } catch (error) {
      // createCheckoutAction hands off to Stripe via redirect(), which works by
      // throwing. Swallowing that here left the visitor on the page with the
      // button re-enabled, looking like the click had done nothing.
      unstable_rethrow(error);
      console.error("Checkout error:", error);
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      size={size}
      className={className}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Redirecting to checkout...
        </>
      ) : (
        children
      )}
    </Button>
  );
}
