import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { Paperclip, Save, Send, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/app/page-header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import type { User } from "@/lib/types";

export const Route = createFileRoute("/_app/tasks/new")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      try {
        const user = JSON.parse(window.sessionStorage.getItem("mgg_user") || "{}");
        if (user && user.role === "staff") {
          throw redirect({ to: "/my-tasks" });
        }
      } catch {}
    }
  },
  component: NewTaskPage,
});

function NewTaskPage() {
  const nav = useNavigate();
  const [files, setFiles] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<string>("medium");
  const [dueDate, setDueDate] = useState("");
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void api.getUsers().then(setUsers).catch(() => {});
    void api.getCurrentUser().then((data) => setCurrentUser(data.user)).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || selectedAssignees.length === 0 || !dueDate) {
      toast.error("Please fill in all required fields and select at least one assignee.");
      return;
    }
    setSaving(true);
    try {
      await Promise.all(
        selectedAssignees.map((userId) =>
          api.createTask({
            title,
            description,
            priority,
            dueDate: new Date(dueDate).toISOString(),
            assignedToId: userId,
            assignedById: currentUser?.id ?? "m1", // fallback to principal if not logged in
            attachments: files.map((name) => ({ name, size: "1.2 MB" })),
          })
        )
      );
      toast.success(`Successfully created and assigned ${selectedAssignees.length} task(s)!`);
      nav({ to: "/tasks" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to create task(s)");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="Create new task" description="Define the task and assign it to a team member." />
      <form
        onSubmit={(e) => void handleSubmit(e)}
        className="grid grid-cols-1 gap-6 lg:grid-cols-3"
      >
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Task title *</Label>
                <Input
                  id="title"
                  placeholder="e.g. Design Q4 launch landing page"
                  className="mt-1.5"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="desc">Description</Label>
                <Textarea
                  id="desc"
                  rows={6}
                  placeholder="Add context, goals, and acceptance criteria..."
                  className="mt-1.5"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <Label className="mb-3 block">Attachments</Label>
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed py-10 text-center transition hover:border-primary/50 hover:bg-accent/30">
              <Upload className="mb-2 h-6 w-6 text-muted-foreground" />
              <div className="text-sm font-medium">Drop files here or click to upload</div>
              <div className="text-xs text-muted-foreground">PDF, DOC, PNG, JPG up to 10MB</div>
              <input type="file" multiple className="hidden" onChange={(e) => {
                const f = Array.from(e.target.files ?? []).map((f) => f.name);
                setFiles((prev) => [...prev, ...f]);
              }} />
            </label>
            {files.length > 0 && (
              <ul className="mt-3 space-y-2">
                {files.map((f, i) => (
                  <li key={i} className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2 text-sm">
                    <span className="flex items-center gap-2 truncate"><Paperclip className="h-4 w-4 text-muted-foreground" />{f}</span>
                    <button type="button" onClick={() => setFiles(files.filter((_, idx) => idx !== i))} className="text-muted-foreground hover:text-destructive">
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold">Details</h3>
            <div className="space-y-4">
              <div>
                <Label>Priority</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="due">Due date *</Label>
                <Input
                  id="due"
                  type="date"
                  className="mt-1.5"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Assign to *</Label>
                <div className="rounded-md border bg-card p-3 space-y-2 max-h-[220px] overflow-y-auto mt-1.5 shadow-sm">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-primary text-xs py-1 select-none">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                      checked={
                        selectedAssignees.length === users.filter((u) => u.role === "staff").length &&
                        selectedAssignees.length > 0
                      }
                      onChange={(e) => {
                        const staff = users.filter((u) => u.role === "staff");
                        if (e.target.checked) {
                          setSelectedAssignees(staff.map((u) => u.id));
                        } else {
                          setSelectedAssignees([]);
                        }
                      }}
                    />
                    <span>Select All Staff</span>
                  </label>
                  <div className="border-t my-1" />
                  {users.filter((u) => u.role === "staff").map((u) => (
                    <label key={u.id} className="flex items-center gap-2 cursor-pointer py-1 select-none text-xs">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                        checked={selectedAssignees.includes(u.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedAssignees((prev) => [...prev, u.id]);
                          } else {
                            setSelectedAssignees((prev) => prev.filter((id) => id !== u.id));
                          }
                        }}
                      />
                      <span className="truncate">{u.name} <span className="text-[10px] text-muted-foreground">({u.department})</span></span>
                    </label>
                  ))}
                </div>
                {selectedAssignees.length > 0 && (
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Selected: {selectedAssignees.length} staff member{selectedAssignees.length > 1 ? "s" : ""}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button type="submit" className="w-full" disabled={saving}>
              <Send className="mr-1.5 h-4 w-4" />
              {saving ? "Creating..." : "Create task"}
            </Button>
            <Button type="button" variant="outline" className="w-full" onClick={() => toast("Draft saved")}>
              <Save className="mr-1.5 h-4 w-4" />Save as draft
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}