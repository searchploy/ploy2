import { createServiceClient } from "@/lib/supabase/service";
import { sendEmail } from "@/lib/email/resend";
import { buildListingApprovedEmail } from "@/lib/email/templates/listing-approved";
import { siteUrl } from "@/lib/seo/pages";

const KIND = "listing_approved";
const FROM = "Ploy <hello@searchploy.com>";
const REPLY_TO = "admin@searchploy.com";

export type ApprovalEmailOutcome = "sent" | "already_sent" | "no_owner" | "failed";

type ApprovedListing = { id: string; name: string; slug: string; profile_id: string | null };

/*
 * Call only after the approval update has been confirmed. The service client is
 * needed because an admin's session cannot read another user's profile or auth
 * record; the caller has already passed requireAdmin().
 *
 * The listing_notifications primary key is the duplicate guard: the row is
 * claimed before Resend is called, so a repeat click, retry or concurrent
 * approval finds it and skips. A send Resend definitely rejected releases the
 * claim so a later approval can retry; one that may have gone out (timeout)
 * keeps it, preferring a missed email over a duplicate.
 */
export async function sendListingApprovedEmail(listing: ApprovedListing): Promise<ApprovalEmailOutcome> {
  // Seeded and agency-owned listings have no owner account to notify.
  if (!listing.profile_id) return "no_owner";

  const log = (message: string, detail: Record<string, unknown>) =>
    console.error(`[listing-approved-email] ${message}`, { listingId: listing.id, ...detail });

  let service: ReturnType<typeof createServiceClient>;
  try {
    service = createServiceClient();
  } catch (error) {
    log("service client unavailable", { error: error instanceof Error ? error.message : String(error) });
    return "failed";
  }

  const { error: claimError } = await service
    .from("listing_notifications")
    .insert({ employee_id: listing.id, kind: KIND });
  if (claimError) {
    if (claimError.code === "23505") return "already_sent";
    log("could not claim notification", { code: claimError.code, message: claimError.message });
    return "failed";
  }

  const release = async () => {
    const { error } = await service
      .from("listing_notifications")
      .delete()
      .eq("employee_id", listing.id)
      .eq("kind", KIND)
      .is("sent_at", null);
    if (error) log("could not release claim", { code: error.code, message: error.message });
  };

  // The auth record, not profiles.email: nothing keeps the profile copy in step
  // when a user changes their address.
  const [{ data: authData, error: authError }, { data: profile }] = await Promise.all([
    service.auth.admin.getUserById(listing.profile_id),
    service.from("profiles").select("full_name").eq("id", listing.profile_id).maybeSingle(),
  ]);
  const email = authData?.user?.email;
  if (authError || !email) {
    log("owner email not found", { message: authError?.message ?? "no email on auth user" });
    await release();
    return "failed";
  }

  const base = siteUrl().replace(/\/+$/, "");
  const message = buildListingApprovedEmail({
    firstName: profile?.full_name?.trim().split(/\s+/)[0] || "there",
    toolName: listing.name,
    listingUrl: `${base}/marketplace/${encodeURIComponent(listing.slug)}`,
    siteUrl: base,
  });

  const result = await sendEmail({ from: FROM, to: email, replyTo: REPLY_TO, ...message });
  if (!result.ok) {
    log("Resend send failed", { error: result.error, maybeSent: result.maybeSent });
    if (!result.maybeSent) await release();
    return "failed";
  }

  const { error: recordError } = await service
    .from("listing_notifications")
    .update({ sent_at: new Date().toISOString(), resend_id: result.id || null })
    .eq("employee_id", listing.id)
    .eq("kind", KIND);
  // The email went out and the claim row still blocks a resend; only the
  // sent_at stamp is missing.
  if (recordError) log("sent but could not record sent_at", { code: recordError.code, message: recordError.message });

  return "sent";
}
