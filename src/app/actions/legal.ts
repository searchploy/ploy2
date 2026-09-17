"use server";

import { createClient, getServerUser } from "@/lib/supabase/server";
import { LEGAL_VERSIONS, type LegalDocumentType } from "@/lib/legal/constants";
import type { ListingReportReason } from "@/lib/legal/constants";

export type LegalActionResult = { ok: true } | { ok: false; error: string };

/**
 * Records that the signed-in user accepted the given legal documents at their
 * current versions.
 *
 * The caller chooses which documents, never the version or the identity: the
 * version is read from LEGAL_VERSIONS here, and record_legal_acceptance()
 * takes the user from auth.uid() and the timestamp from the database clock. So
 * a crafted call cannot claim an acceptance for someone else, backdate one, or
 * pin it to a version that was never published.
 */
export async function recordLegalAcceptance(
  documents: LegalDocumentType[]
): Promise<LegalActionResult> {
  const user = await getServerUser();
  if (!user) return { ok: false, error: "You need to be signed in." };

  const supabase = await createClient();

  for (const document of documents) {
    const version = LEGAL_VERSIONS[document];
    if (!version) return { ok: false, error: "Unknown document." };

    const { error } = await supabase.rpc("record_legal_acceptance", {
      p_document_type: document,
      p_document_version: version,
    });

    if (error) {
      console.error("Failed to record legal acceptance:", document, error);
      return { ok: false, error: "We couldn't record your acceptance. Please try again." };
    }
  }

  return { ok: true };
}

/**
 * Accepting the Terms and Privacy Policy at sign-up. Called once the user has
 * verified their email and has a session — there is no authenticated user to
 * attach an acceptance to before that point.
 */
export async function acceptSignupTerms(): Promise<LegalActionResult> {
  return recordLegalAcceptance(["terms", "privacy"]);
}

/**
 * Accepting the Marketplace Provider Terms before submitting a listing.
 *
 * This is convenience, not enforcement: the employees insert/update RLS
 * policies require an acceptance row to exist, so a listing submitted without
 * one is refused by the database even if this action is never called.
 */
export async function acceptProviderTerms(): Promise<LegalActionResult> {
  return recordLegalAcceptance(["marketplace_provider_terms"]);
}

/** Whether the signed-in user has accepted the current version of a document. */
export async function hasAcceptedCurrentVersion(
  document: LegalDocumentType
): Promise<boolean> {
  const user = await getServerUser();
  if (!user) return false;

  const supabase = await createClient();
  const { data } = await supabase
    .from("legal_acceptances")
    .select("id")
    .eq("profile_id", user.id)
    .eq("document_type", document)
    .eq("document_version", LEGAL_VERSIONS[document])
    .maybeSingle();

  return Boolean(data);
}

/**
 * Files a report about a marketplace listing. Open to signed-out visitors —
 * a listing that looks fraudulent is worth hearing about from anyone — with
 * rate limiting and listing validation enforced inside submit_listing_report().
 */
export async function reportListing(
  employeeId: string,
  reason: ListingReportReason,
  detail?: string
): Promise<LegalActionResult> {
  const supabase = await createClient();

  const { error } = await supabase.rpc("submit_listing_report", {
    p_employee_id: employeeId,
    p_reason: reason,
    p_detail: detail?.trim() || null,
  });

  if (error) {
    console.error("Failed to submit listing report:", error);
    // The database distinguishes "too many" from everything else; anything
    // more specific would tell a prober whether an id exists.
    const rateLimited = error.message?.includes("too many");
    return {
      ok: false,
      error: rateLimited
        ? "You've sent several reports recently. Please try again later."
        : "We couldn't submit your report. Please try again.",
    };
  }

  return { ok: true };
}
