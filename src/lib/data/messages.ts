import type { Message } from "@/lib/types/mock";
import { DEMO_BUSINESS_USER_ID, DEMO_AGENCY_USER_ID } from "./users";

export const messages: Message[] = [
  { id: "msg-1", thread_id: "thread-1", sender_id: DEMO_BUSINESS_USER_ID, recipient_id: DEMO_AGENCY_USER_ID, employee_id: "emp-ai-sales-rep", body: "Hi! We just purchased AI Sales Rep — when can we kick off onboarding?", read_at: "2026-06-02", created_at: "2026-06-01" },
  { id: "msg-2", thread_id: "thread-1", sender_id: DEMO_AGENCY_USER_ID, recipient_id: DEMO_BUSINESS_USER_ID, employee_id: "emp-ai-sales-rep", body: "Welcome aboard! Let's grab 30 minutes this week to connect your Salesforce and review your pitch deck.", read_at: "2026-06-02", created_at: "2026-06-02" },
  { id: "msg-3", thread_id: "thread-1", sender_id: DEMO_BUSINESS_USER_ID, recipient_id: DEMO_AGENCY_USER_ID, employee_id: "emp-ai-sales-rep", body: "Works for us — Thursday 2pm ET?", read_at: null, created_at: "2026-06-03" },
];

export async function getMessagesForUser(userId: string): Promise<Message[]> {
  return messages.filter((m) => m.sender_id === userId || m.recipient_id === userId);
}
