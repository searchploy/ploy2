// Server-only: reads RESEND_API_KEY, which must never be NEXT_PUBLIC_. Imported
// only from server actions; in a client bundle the key would read as undefined.

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export type SendEmailInput = {
  from: string;
  to: string;
  replyTo?: string;
  subject: string;
  html: string;
  text: string;
};

export type SendEmailResult =
  | { ok: true; id: string }
  // maybeSent: the request may have reached Resend (timeout or dropped
  // connection), so the caller cannot assume the email was not delivered.
  | { ok: false; error: string; maybeSent: boolean };

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, error: "RESEND_API_KEY is not configured", maybeSent: false };

  let response: Response;
  try {
    response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: input.from,
        to: [input.to],
        reply_to: input.replyTo,
        subject: input.subject,
        html: input.html,
        text: input.text,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
      maybeSent: true,
    };
  }

  const body = (await response.json().catch(() => null)) as { id?: string; message?: string } | null;
  if (!response.ok) {
    return {
      ok: false,
      error: `Resend ${response.status}: ${body?.message ?? response.statusText}`,
      maybeSent: false,
    };
  }
  return { ok: true, id: body?.id ?? "" };
}
