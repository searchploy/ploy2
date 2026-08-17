import Link from "next/link";
import { Users2, BarChart3, TrendingUp, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import { getServerUser } from "@/lib/supabase/server";
import { WelcomeModal } from "@/components/consultant/welcome-modal";

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
    year: "numeric",
  });
}

export default async function ConsultantDashboardPage() {
  const user = await getServerUser();
  const supabase = await createClient();

  if (!user) return <div>Not authenticated</div>;

  // Fetch user profile to check if they've seen the welcome modal
  let hasSeen = true;
  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("has_seen_consultant_welcome")
      .eq("id", user.id)
      .maybeSingle();
    hasSeen = profile?.has_seen_consultant_welcome ?? true;
  } catch (e) {
    console.error("Error fetching profile:", e);
  }

  // Fetch clients and reports
  let clients: Record<string, unknown>[] = [];
  let reports: Record<string, unknown>[] = [];

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

  try {
    const { data: reportsData } = await supabase
      .from("consultant_reports")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);
    reports = reportsData || [];
  } catch (e) {
    console.error("Error fetching reports:", e);
  }

  const stats = [
    {
      label: "Clients",
      value: clients.length,
      icon: <Users2 className="h-5 w-5" />,
    },
    {
      label: "AI Reports",
      value: reports.length,
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      label: "Deals Closed",
      value: clients.filter((c) => c.status === "Closed").length,
      icon: <TrendingUp className="h-5 w-5" />,
    },
    {
      label: "Est. Revenue",
      value: "$0",
      icon: <DollarSign className="h-5 w-5" />,
    },
  ];

  const recentClients = clients.slice(0, 5);

  return (
    <>
      <WelcomeModal userId={user.id} hasSeen={hasSeen} />
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground mt-1">Manage your AI consulting business</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="mt-2 text-3xl font-semibold">{stat.value}</p>
                </div>
                <div className="text-ploy-blue opacity-60">{stat.icon}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* Recent Clients */}
        <Card className="overflow-hidden">
          <div className="border-b border-border/50 p-6 flex items-center justify-between">
            <h2 className="font-semibold">Recent Clients</h2>
            <Button asChild size="sm" variant="outline">
              <Link href="/dashboard/consultant/clients">View all</Link>
            </Button>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Business Name</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentClients.length > 0 ? (
                  recentClients.map((client) => (
                    <TableRow key={client.id as string}>
                      <TableCell className="font-medium">{String(client.business_name)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{String(client.industry) || "—"}</TableCell>
                      <TableCell>
                        <Badge className={`${statusColors[client.status as string] || "bg-secondary"} border-0`}>
                          {String(client.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(String(client.updated_at))}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/dashboard/consultant/clients/${String(client.id)}`}>Open</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No clients yet.{" "}
                      <Link href="/dashboard/consultant/clients" className="text-ploy-blue hover:underline">
                        Add your first client
                      </Link>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Recent Reports */}
        <Card className="overflow-hidden">
          <div className="border-b border-border/50 p-6 flex items-center justify-between">
            <h2 className="font-semibold">Recent AI Reports</h2>
            <Button asChild size="sm" variant="outline">
              <Link href="/dashboard/consultant/reports">View all</Link>
            </Button>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Business Name</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.length > 0 ? (
                  reports.map((report) => (
                    <TableRow key={report.id as string}>
                      <TableCell className="font-medium">
                        {String(clients.find((c) => String(c.id) === String(report.client_id))?.business_name || "Unknown")}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(String(report.created_at))}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="ghost" size="sm">
                          <Link href={`/report/${String(report.report_id)}`}>View</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                      No reports yet.{" "}
                      <Link href="/report" className="text-ploy-blue hover:underline">
                        Generate your first report
                      </Link>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </>
  );
}
