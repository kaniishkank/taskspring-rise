import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { Pencil, Plus, Search, UserMinus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/app/page-header";
import { UserAvatar } from "@/components/app/user-avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Role, User } from "@/lib/types";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

type UsersSearch = {
  highlightUserId?: string;
};

export const Route = createFileRoute("/_app/users")({
  validateSearch: (search: Record<string, unknown>): UsersSearch => {
    return {
      highlightUserId: search.highlightUserId as string | undefined,
    };
  },
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      let isStaff = false;
      try {
        const user = JSON.parse(window.sessionStorage.getItem("mgg_user") || "{}");
        if (user && user.role === "STAFF") {
          isStaff = true;
        }
      } catch {}
      if (isStaff) {
        throw redirect({ to: "/" });
      }
    }
  },
  component: UsersPage,
});

const roleLabels: Record<Role, string> = {
  OPERATION: "Operation (Central Team)",
  MANAGER: "Manager (School level)",
  STAFF: "Staff (All Staff)",
};

function UsersPage() {
  const { highlightUserId } = Route.useSearch();
  const rowRefs = useRef<Record<string, HTMLTableRowElement | null>>({});

  const [users, setUsers] = useState<User[]>([]);
  const [q, setQ] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Dialog visibility
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState<Role>("STAFF");
  const [department, setDepartment] = useState("");
  const [active, setActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadUsers = async () => {
    try {
      const data = await api.getUsers();
      setUsers(data);
    } catch {
      toast.error("Failed to load users");
    }
  };

  useEffect(() => {
    void loadUsers();
    void api.getCurrentUser().then(res => setCurrentUser(res.user)).catch(() => {});
  }, []);

  useEffect(() => {
    if (highlightUserId && users.length > 0) {
      setTimeout(() => {
        const row = rowRefs.current[highlightUserId];
        if (row) {
          row.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 300);
    }
  }, [highlightUserId, users]);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(q.toLowerCase()) ||
      u.email.toLowerCase().includes(q.toLowerCase())
  );

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error("Please fill in Name, Email, and Password");
      return;
    }
    setSaving(true);
    try {
      await api.createUser({ name, email, role, department, active, password, phoneNumber });
      toast.success("User added successfully");
      setIsAddOpen(false);
      setName("");
      setEmail("");
      setPhoneNumber("");
      setRole("STAFF");
      setDepartment("");
      setActive(true);
      void loadUsers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add user");
    } finally {
      setSaving(false);
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setSaving(true);
    try {
      await api.updateUser(editingUser.id, { name, email, role, department, active, phoneNumber });
      toast.success("User updated successfully");
      setIsEditOpen(false);
      void loadUsers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (u: User) => {
    try {
      await api.updateUser(u.id, { active: !u.active });
      toast.success(`User ${u.name} is now ${!u.active ? "Active" : "Disabled"}`);
      void loadUsers();
    } catch {
      toast.error("Failed to update user status");
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    if (currentUser?.id === userToDelete.id) {
      toast.error("You cannot delete your own account.");
      return;
    }
    setSaving(true);
    try {
      await api.deleteUser(userToDelete.id);
      toast.success("User deleted successfully");
      setIsDeleteOpen(false);
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete user");
    } finally {
      setSaving(false);
      setUserToDelete(null);
    }
  };

  const openAdd = () => {
    setName("");
    setEmail("");
    setPhoneNumber("");
    setPassword("");
    setRole("STAFF");
    setDepartment("");
    setActive(true);
    setIsAddOpen(true);
  };

  const openEdit = (u: User) => {
    setEditingUser(u);
    setName(u.name);
    setEmail(u.email);
    setPhoneNumber(u.phoneNumber || "");
    setRole(u.role);
    setDepartment(u.department ?? "");
    setActive(u.active);
    setIsEditOpen(true);
  };

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
              <tr 
                key={u.id} 
                ref={(el) => (rowRefs.current[u.id] = el)}
                className={cn(
                  "border-b last:border-0 hover:bg-accent/40 transition-colors",
                  highlightUserId === u.id ? "bg-primary/10 ring-2 ring-primary ring-inset" : ""
                )}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <UserAvatar name={u.name} size={32} />
                    <span className="font-medium">{u.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                <td className="px-4 py-3 text-muted-foreground">{u.department}</td>
                <td className="px-4 py-3">
                  <span className="rounded-md border bg-muted/40 px-2 py-0.5 text-xs capitalize">{roleLabels[u.role] ?? u.role}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs", u.active ? "bg-success/15 text-success" : "bg-muted text-muted-foreground")}>
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {u.active ? "Active" : "Disabled"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(u)} title="Edit user"><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => void handleToggleActive(u)} title={u.active ? "Disable user" : "Enable user"} className={cn(u.active ? "text-muted-foreground hover:text-warning" : "text-success hover:text-success/80")}>
                      <UserMinus className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      disabled={currentUser?.id === u.id}
                      onClick={() => {
                        if (currentUser?.id === u.id) {
                          toast.error("You cannot delete your own account.");
                          return;
                        }
                        setUserToDelete(u);
                        setIsDeleteOpen(true);
                      }} 
                      title="Delete user" 
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
        actions={<Button onClick={openAdd}><Plus className="mr-1.5 h-4 w-4" />Add user</Button>}
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
        <TabsContent value="managers">{renderTable(filtered.filter((u) => u.role === "MANAGER" || u.role === "OPERATION"))}</TabsContent>
        <TabsContent value="staff">{renderTable(filtered.filter((u) => u.role === "STAFF"))}</TabsContent>
      </Tabs>

      {/* Add User Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add User</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => void handleAddUser(e)} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="add-name">Name *</Label>
              <Input id="add-name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-email">Email *</Label>
              <Input id="add-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g. john@acme.co" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-phone">WhatsApp Number</Label>
              <Input id="add-phone" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="e.g. 14155552671" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-password">Temporary Password *</Label>
              <Input id="add-password" type="text" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="e.g. Welcome123" />
            </div>
            <div className="space-y-2">
              <Label>Role *</Label>
              <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="STAFF">Staff</SelectItem>
                  <SelectItem value="MANAGER">Manager</SelectItem>
                  <SelectItem value="OPERATION">Operation (Central Team)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-dept">Department</Label>
              <Input id="add-dept" value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="e.g. Engineering" />
            </div>
            <div className="flex items-center gap-2 pt-2">
              <Checkbox id="add-active" checked={active} onCheckedChange={(c) => setActive(c === true)} />
              <Label htmlFor="add-active" className="cursor-pointer">Active user account</Label>
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Create User"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => void handleEditUser(e)} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name *</Label>
              <Input id="edit-name" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email *</Label>
              <Input id="edit-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">WhatsApp Number</Label>
              <Input id="edit-phone" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Role *</Label>
              <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="STAFF">Staff</SelectItem>
                  <SelectItem value="MANAGER">Manager</SelectItem>
                  <SelectItem value="OPERATION">Operation (Central Team)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-dept">Department</Label>
              <Input id="edit-dept" value={department} onChange={(e) => setDepartment(e.target.value)} />
            </div>
            <div className="flex items-center gap-2 pt-2">
              <Checkbox id="edit-active" checked={active} onCheckedChange={(c) => setActive(c === true)} />
              <Label htmlFor="edit-active" className="cursor-pointer">Active user account</Label>
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-sm text-foreground">
            Are you sure you want to delete <strong>{userToDelete?.name}</strong>? This action cannot be undone.
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)} disabled={saving}>Cancel</Button>
            <Button type="button" variant="destructive" onClick={() => void handleDeleteUser()} disabled={saving}>
              {saving ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}