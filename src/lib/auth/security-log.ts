import { createClient } from "@/lib/supabase/server";

export type SecurityOutcome = "success" | "denied" | "error";

/**
 * Records a security-relevant event: who did what to which object, and whether
 * it was allowed. Refused attempts are logged too, which is the half that
 * matters when working out whether someone was probing.
 *
 * Never pass passwords, tokens, session data or payment details in `detail`.
 * The rows are readable by admins only.
 *
 * Logging must never break the action it is recording, so failures here are
 * swallowed after being written to the server log.
 */
export async function logSecurityEvent(params: {
  action: string;
  outcome?: SecurityOutcome;
  targetType?: string;
  targetId?: string;
  detail?: Record<string, unknown>;
}): Promise<void> {
  try {
    const supabase = await createClient();
    await supabase.rpc("log_security_event", {
      p_action: params.action,
      p_outcome: params.outcome ?? "success",
      p_target_type: params.targetType ?? null,
      p_target_id: params.targetId ?? null,
      p_detail: (params.detail ?? null) as never,
    });
  } catch (error) {
    console.error("Failed to write security event", params.action, error);
  }
}
