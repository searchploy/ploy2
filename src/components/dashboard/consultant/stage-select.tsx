"use client";

import { useTransition } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateContactStageAction } from "@/app/dashboard/consultant/actions";
import type { ContactStage } from "@/lib/types/database";

const STAGES: ContactStage[] = ["new", "contacted", "meeting_booked", "proposal_sent", "won", "lost"];
const STAGE_LABEL: Record<ContactStage, string> = {
  new: "New",
  contacted: "Contacted",
  meeting_booked: "Meeting Booked",
  proposal_sent: "Proposal Sent",
  won: "Won",
  lost: "Lost",
};

export function StageSelect({ contactId, stage }: { contactId: string; stage: ContactStage }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Select
      value={stage}
      disabled={isPending}
      onValueChange={(v) => startTransition(() => updateContactStageAction(contactId, v as ContactStage))}
    >
      <SelectTrigger className="h-8 w-[150px] text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {STAGES.map((s) => (
          <SelectItem key={s} value={s}>
            {STAGE_LABEL[s]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
