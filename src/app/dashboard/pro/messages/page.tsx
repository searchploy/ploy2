import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { MessageThread } from "@/components/dashboard/message-thread";
import { DEMO_BUSINESS_USER_ID } from "@/lib/data/users";
import { getMessagesForUser } from "@/lib/data/messages";

export default async function ProMessagesPage() {
  const messages = await getMessagesForUser(DEMO_BUSINESS_USER_ID);

  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader title="Messages" description="Conversations with agencies about your AI employees." />
      <MessageThread messages={messages} currentUserId={DEMO_BUSINESS_USER_ID} otherPartyName="Northbeam AI" />
    </div>
  );
}
