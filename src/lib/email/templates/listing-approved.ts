// Owner-entered values (name, tool name) land in this HTML, so everything
// interpolated is escaped.
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export const LISTING_APPROVED_SUBJECT = "🎉 Your AI Tool Is Now Live on Ploy";

export function buildListingApprovedEmail({
  firstName,
  toolName,
  listingUrl,
  siteUrl,
}: {
  firstName: string;
  toolName: string;
  listingUrl: string;
  siteUrl: string;
}): { subject: string; html: string; text: string } {
  const name = escapeHtml(firstName);
  const tool = escapeHtml(toolName);
  const href = escapeHtml(listingUrl);
  const home = escapeHtml(siteUrl);

  // Table layout and inline styles because most mail clients ignore <style>
  // blocks and flexbox. Colors are the site's tokens: #08090D background,
  // #101218 card, #d9a441 gold, with the metal gradient where it is supported
  // and the flat gold as the fallback (Gmail drops background-image).
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<title>${escapeHtml(LISTING_APPROVED_SUBJECT)}</title>
</head>
<body style="margin:0;padding:0;background-color:#08090D;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#08090D;">${tool} has been approved and is now live on the Ploy marketplace.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#08090D;">
  <tr>
    <td align="center" style="padding:32px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">
        <tr>
          <td style="padding:0 4px 24px 4px;">
            <a href="${home}" style="text-decoration:none;color:#F3F4F6;">
              <img src="${home}/ploy-mark.png" width="28" height="28" alt="" style="display:inline-block;vertical-align:middle;border:0;">
              <span style="display:inline-block;vertical-align:middle;margin-left:10px;font-family:Helvetica,Arial,sans-serif;font-size:22px;font-weight:700;letter-spacing:-0.5px;color:#F3F4F6;">ploy</span>
            </a>
          </td>
        </tr>
        <tr>
          <td style="background-color:#101218;border:1px solid #3a2c12;border-radius:16px;padding:36px 32px;font-family:Helvetica,Arial,sans-serif;">
            <p style="margin:0 0 12px 0;font-size:12px;font-weight:700;letter-spacing:2.4px;text-transform:uppercase;color:#d9a441;">Listing approved</p>
            <p style="margin:0 0 20px 0;font-size:16px;line-height:24px;color:#F3F4F6;">Hi ${name},</p>
            <p style="margin:0 0 16px 0;font-size:16px;line-height:24px;color:#F3F4F6;">Great news! Your AI tool, <strong style="color:#f5d77a;">${tool}</strong>, has been approved and is now live on the Ploy marketplace.</p>
            <p style="margin:0 0 28px 0;font-size:16px;line-height:24px;color:#9CA3AF;">Your listing is now available for businesses looking for AI solutions.</p>
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="center" bgcolor="#d9a441" style="border-radius:12px;background-color:#d9a441;background-image:linear-gradient(110deg,#b7791f 0%,#d9a441 20%,#f8dc7a 45%,#fff4bd 50%,#efc96e 57%,#c58a24 80%,#d9a441 100%);">
                  <a href="${href}" style="display:inline-block;padding:14px 28px;font-family:Helvetica,Arial,sans-serif;font-size:15px;font-weight:700;letter-spacing:0.3px;color:#08090D;text-decoration:none;border-radius:12px;">View My AI Tool &rarr;</a>
                </td>
              </tr>
            </table>
            <p style="margin:28px 0 0 0;font-size:15px;line-height:23px;color:#F3F4F6;">Thanks for listing with Ploy. We&#39;re excited to have you on the marketplace!</p>
            <p style="margin:20px 0 0 0;font-size:15px;line-height:23px;color:#F3F4F6;">&mdash; The Ploy Team</p>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 4px 0 4px;font-family:Helvetica,Arial,sans-serif;font-size:12px;line-height:18px;color:#6B7280;">
            If the button doesn&#39;t work, copy this link into your browser:<br>
            <a href="${href}" style="color:#d9a441;text-decoration:underline;word-break:break-all;">${href}</a>
            <br><br>
            You&#39;re receiving this because you listed an AI tool on <a href="${home}" style="color:#9CA3AF;">Ploy</a>.
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;

  const text = `Hi ${firstName},

Great news! Your AI tool, ${toolName}, has been approved and is now live on the Ploy marketplace.

Your listing is now available for businesses looking for AI solutions.

View My AI Tool: ${listingUrl}

Thanks for listing with Ploy. We're excited to have you on the marketplace!

— The Ploy Team`;

  return { subject: LISTING_APPROVED_SUBJECT, html, text };
}
