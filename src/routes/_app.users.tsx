import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Pencil, Plus, Search, UserMinus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/app/page-header";
import { UserAvatar } from "@/components/app/user-avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Role, User } from "@/lib/types";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

export const Route = createFileRoute("/_app/users")({
  component: UsersPage,
});

const roleLabels: Record<Role, string> = {
  super_admin: "Super admin",
  manager: "Manager",
  staff: "Staff",
};

function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [q, setQ] = useState("");
  useEffect(() => {
    void api.getUsers().then(setUsers).catch(() => {});
  }, []);
  const filtered = users.filter((u) => u.name.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase()));

  const renderTable = (list: User[]) => (
    <div className="rounded-xl border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Department</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((u) => (
              <tr key={u.id} className="border-b last:border-0 hover:bg-accent/40">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <UserAvatar name={u.name} size={32} />
                    <span className="font-medium">{u.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                <td className="px-4 py-3 text-muted-foreground">{u.department}</td>
                <td className="px-4 py-3">
                  <span className="rounded-md border bg-muted/40 px-2 py-0.5 text-xs capitalize">{roleLabels[u.role]}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs", u.active ? "bg-success/15 text-success" : "bg-muted text-muted-foreground")}>
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {u.active ? "Active" : "Disabled"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex gap-1">
                    <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon"><UserMinus className="h-4 w-4" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div>
      <PageHeader
        title="User management"
        description="Manage managers, staff and roles."
        actions={<Button><Plus className="mr-1.5 h-4 w-4" />Add user</Button>}
      />
      <div className="mb-4 relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search users..." className="pl-9" />
      </div>
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All ({filtered.length})</TabsTrigger>
          <TabsTrigger value="managers">Managers</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
        </TabsList>
        <TabsContent value="all">{renderTable(filtered)}</TabsContent>
        <TabsContent value="managers">{renderTable(filtered.filter((u) => u.role === "manager" || u.role === "super_admin"))}</TabsContent>
        <TabsContent value="staff">{renderTable(filtered.filter((u) => u.role === "staff"))}</TabsContent>
      </Tabs>
    </div>
  );
}