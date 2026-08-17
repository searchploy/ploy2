import { StageSelect } from "@/components/dashboard/consultant/stage-select";
import type { ConsultantContact } from "@/lib/types/database";

export function ContactsTable({ contacts }: { contacts: ConsultantContact[] }) {
  if (contacts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
        Nothing here yet — add your first contact above.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <table className="w-full text-sm">
        <thead className="bg-secondary/40 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-5 py-3">Business</th>
            <th className="px-5 py-3">Contact</th>
            <th className="px-5 py-3">Source</th>
            <th className="px-5 py-3">Deal value</th>
            <th className="px-5 py-3">Stage</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {contacts.map((c) => (
            <tr key={c.id}>
              <td className="px-5 py-3 font-medium">{c.business_name}</td>
              <td className="px-5 py-3 text-muted-foreground">
                {c.contact_name ?? "—"}
                {c.email && <div className="text-xs">{c.email}</div>}
              </td>
              <td className="px-5 py-3 text-muted-foreground">{c.source ?? "—"}</td>
              <td className="px-5 py-3 font-mono text-muted-foreground">
                {c.deal_value_cents != null ? `$${(c.deal_value_cents / 100).toLocaleString()}` : "—"}
              </td>
              <td className="px-5 py-3">
                <StageSelect contactId={c.id} stage={c.stage} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
