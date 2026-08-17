import { createClient } from "@/lib/supabase/server";
import { getServerUser } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { deleteClientAction } from "./actions";

const statusColors: Record<string, string> = {
  "Lead": "bg-blue-500/20 text-blue-300",
  "Discovery Call": "bg-purple-500/20 text-purple-300",
  "Report Sent": "bg-amber-500/20 text-amber-300",
  "Proposal Sent": "bg-cyan-500/20 text-cyan-300",
  "Closed": "bg-green-500/20 text-green-300",
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default async function ClientsPage() {
  const user = await getServerUser();
  const supabase = await createClient();

  if (!user) return <div>Not authenticated</div>;

  let clients: any[] = [];
  try {
    const { data: clientsData } = await supabase
      .from("consultant_clients")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    clients = clientsData || [];
  } catch (e) {
    console.error("Error fetching clients:", e);
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Clients</h1>
          <p className="text-muted-foreground mt-1">Manage your consulting clients</p>
        </div>
        <Button asChild variant="gradient">
          <Link href="/dashboard/consultant/clients/new">
            <Plus className="h-4 w-4" />
            Add Client
          </Link>
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business Name</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.length > 0 ? (
                clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.business_name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{client.industry || "—"}</TableCell>
                    <TableCell>
                      <Badge className={`${statusColors[client.status] || "bg-secondary"} border-0`}>
                        {client.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{client.contact_name || "—"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(client.updated_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button asChild size="sm" variant="ghost">
                          <Link href={`/dashboard/consultant/clients/${client.id}/edit`}>
                            <Edit2 className="h-4 w-4" />
                          </Link>
                        </Button>
                        <form action={deleteClientAction}>
                          <input type="hidden" name="id" value={client.id} />
                          <Button type="submit" size="sm" variant="ghost" className="text-red-500 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </form>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    <div className="flex flex-col items-center gap-3">
                      <p>No clients yet</p>
                      <Button asChild size="sm">
                        <Link href="/dashboard/consultant/clients/new">Add your first client</Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
