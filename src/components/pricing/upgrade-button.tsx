"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
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
      {children}
    </Button>
  );
}
