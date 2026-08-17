"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

export function CheckoutStatusToast() {
  const searchParams = useSearchParams();
  const checkout = searchParams.get("checkout");

  useEffect(() => {
    if (checkout === "unavailable") {
      toast.error("Checkout isn't set up yet", { description: "Ask the site owner to add Stripe keys to enable upgrades." });
    } else if (checkout === "cancelled") {
      toast("Checkout cancelled");
    } else if (checkout === "error") {
      toast.error("Something went wrong starting checkout. Please try again.");
    }
  }, [checkout]);

  return null;
}
