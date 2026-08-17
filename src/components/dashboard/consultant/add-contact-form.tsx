import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addContactAction } from "@/app/dashboard/consultant/actions";

export function AddContactForm({ type }: { type: "prospect" | "client" }) {
  return (
    <form action={addContactAction} className="flex flex-wrap items-end gap-3 rounded-2xl border border-border bg-card p-4">
      <input type="hidden" name="type" value={type} />
      <div className="flex flex-1 flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">Business name</label>
        <Input name="business_name" required placeholder="Acme, Inc." />
      </div>
      <div className="flex flex-1 flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">Contact name</label>
        <Input name="contact_name" placeholder="Jane Cooper" />
      </div>
      <div className="flex flex-1 flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">Email</label>
        <Input name="email" type="email" placeholder="jane@acme.com" />
      </div>
      <div className="flex flex-1 flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">Source</label>
        <Input name="source" placeholder="Referral, cold outreach..." />
      </div>
      <Button type="submit">Add {type === "client" ? "client" : "prospect"}</Button>
    </form>
  );
}
