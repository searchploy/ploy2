import { DashboardPageHeader } from "@/components/dashboard/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { adminUserDirectory } from "@/lib/data/users";

export default function AdminUsersPage() {
  return (
    <div className="flex flex-col gap-8">
      <DashboardPageHeader title="Users" description={`${adminUserDirectory.length} registered users across businesses and agencies.`} />
      <Card className="p-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {adminUserDirectory.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.full_name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{user.email}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{user.company_name ?? "—"}</TableCell>
                <TableCell>
                  <Badge variant={user.role === "admin" ? "blue" : "outline"} className="capitalize">
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{formatDate(user.created_at)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
