"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      // The unchecked box has to read as an affordance against a dark card.
      // --input is 11% lightness on an 11% background, so a 1px border in it
      // is invisible; this uses a muted-foreground tint at 2px instead.
      "peer h-[18px] w-[18px] shrink-0 rounded-[5px] border-2 border-muted-foreground/45 bg-transparent shadow-sm transition-colors",
      "hover:border-muted-foreground/80",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ploy-gold focus-visible:ring-offset-1 focus-visible:ring-offset-background",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:border-ploy-gold data-[state=checked]:bg-ploy-gold data-[state=checked]:text-black",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
      <Check className="h-3.5 w-3.5" strokeWidth={3} />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
