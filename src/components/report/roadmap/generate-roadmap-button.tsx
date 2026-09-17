"use client";

import { useState, useTransition } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateRoadmapAction } from "@/app/report/[id]/roadmap-actions";

export function GenerateRoadmapButton({
  reportId,
  label,
  variant = "default",
  size = "lg",
}: {
  reportId: string;
  label: string;
  variant?: "default" | "outline";
  size?: "sm" | "lg";
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center gap-2">
      <Button
        variant={variant}
        size={size}
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            setError(null);
            const result = await generateRoadmapAction(reportId);
            if (!result.ok) setError(result.error);
          })
        }
      >
        {pending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Building your personalized AI roadmap…
          </>
        ) : (
          <>
            <RefreshCw className="mr-2 h-4 w-4" />
            {label}
          </>
        )}
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
