"use client";

import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn, formatDate } from "@/lib/utils";
import type { Message } from "@/lib/types/mock";

export function MessageThread({
  messages,
  currentUserId,
  otherPartyName,
}: {
  messages: Message[];
  currentUserId: string;
  otherPartyName: string;
}) {
  const [thread, setThread] = useState(messages);
  const [draft, setDraft] = useState("");

  function handleSend(e: FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    // In production this calls a Server Action that inserts into
    // `messages` and notifies the recipient. Simulated here.
    setThread((prev) => [
      ...prev,
      {
        id: `local-${Date.now()}`,
        thread_id: thread[0]?.thread_id ?? "thread-new",
        sender_id: currentUserId,
        recipient_id: "other",
        employee_id: null,
        body: draft,
        read_at: null,
        created_at: new Date().toISOString(),
      },
    ]);
    setDraft("");
  }

  if (thread.length === 0) {
    return <p className="text-sm text-muted-foreground">No conversations yet.</p>;
  }

  return (
    <Card className="flex flex-col gap-4 p-6">
      <p className="font-semibold">{otherPartyName}</p>
      <div className="flex flex-col gap-4 max-h-[420px] overflow-y-auto pr-1">
        {thread.map((message) => {
          const isMine = message.sender_id === currentUserId;
          return (
            <div key={message.id} className={cn("flex flex-col gap-1", isMine ? "items-end" : "items-start")}>
              <div
                className={cn(
                  "max-w-md rounded-2xl px-4 py-2.5 text-sm",
                  isMine ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
                )}
              >
                {message.body}
              </div>
              <span className="text-xs text-muted-foreground">{formatDate(message.created_at)}</span>
            </div>
          );
        })}
      </div>
      <form onSubmit={handleSend} className="flex gap-2 border-t border-border pt-4">
        <Input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Type a message..." />
        <Button type="submit" size="icon" variant="gradient">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </Card>
  );
}
