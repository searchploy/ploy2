/**
 * Renders a JSON-LD block. Server component — the payload is built on the
 * server and shipped as markup, so no client JS is involved.
 *
 * Values come from our own page definitions and from published listings, never
 * from visitor input, so the serialized JSON cannot carry attacker-controlled
 * markup. `<` is still escaped as a defence in depth against a listing whose
 * name contains a closing script tag.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
