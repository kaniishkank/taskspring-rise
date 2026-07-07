import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, Filter, Plus, Search, List, LayoutGrid, AlertCircle, CheckCircle, Clock, Pencil, Trash2, Paperclip, X, Save, Send, Upload } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/app/page-header";
import { StatusBadge, PriorityBadge } from "@/components/app/status-badge";
import { UserAvatar } from "@/components/app/user-avatar";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import type { Priority, TaskStatus, Task, User } from "@/lib/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/tasks/")({
  component: TasksPage,
});

const COLUMNS: { value: TaskStatus; label: string; tone: string }[] = [
  { value: "assigned", label: "Assigned", tone: "border-t-2 border-t-muted-foreground/50 bg-muted/5" },
  { value: "in_progress", label: "In Progress", tone: "border-t-2 border-t-blue-500 bg-blue-500/5" },
  { value: "submitted", label: "Submitted", tone: "border-t-2 border-t-amber-500 bg-amber-500/5" },
  { value: "under_review", label: "Under Review", tone: "border-t-2 border-t-purple-500 bg-purple-500/5" },
  { value: "approved", label: "Approved", tone: "border-t-2 border-t-emerald-500 bg-emerald-500/5" },
  { value: "completed", label: "Completed", tone: "border-t-2 border-t-blue-600 bg-blue-600/5" },
  { value: "rejected", label: "Rejected", tone: "border-t-2 border-t-destructive bg-destructive/5" },
];

const priorityDot: Record<string, string> = {
  low: "bg-muted-foreground",
  medium: "bg-info",
  high: "bg-warning",
  urgent: "bg-destructive",
};

function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<TaskStatus | "all">("all");
  const [priority, setPriority] = useState<Priority | "all">("all");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "board">("list");
  
  // Dialog visibility
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [saving, setSaving] = useState(false);

  // Edit Form States
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPriority, setEditPriority] = useState<string>("medium");
  const [editDueDate, setEditDueDate] = useState("");
  const [editAssignee, setEditAssignee] = useState("");
  const [editFiles, setEditFiles] = useState<{name: string, size: string, content?: string}[]>([]);

  // Pagination
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 10;

  const loadData = async () => {
    try {
      const [taskData, userData, currentData] = await Promise.all([
        api.getTasks(),
        api.getUsers(),
        api.getCurrentUser()
      ]);
      setTasks(taskData);
      setUsers(userData);
      setCurrentUser(currentData.user);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setPage(0);
  }, [q, status, priority]);

  const filtered = useMemo(
    () =>
      tasks.filter(
        (t) =>
          (status === "all" || t.status === status) &&
          (priority === "all" || t.priority === priority) &&
          (q === "" ||
            t.title.toLowerCase().includes(q.toLowerCase()) ||
            t.id.toLowerCase().includes(q.toLowerCase())),
      ),
    [tasks, q, status, priority],
  );

  const paginated = useMemo(() => {
    return filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  }, [filtered, page]);

  const handleExport = () => {
    if (filtered.length === 0) {
      toast.error("No tasks to export.");
      return;
    }

    const headers = [
      "Task ID",
      "Title",
      "Description",
      "Priority",
      "Status",
      "Assigned To",
      "Assigned By",
      "Due Date",
      "Created Date",
      "Attachments",
      "Comments",
      "Submissions"
    ];

    const formatCell = (val: string | null | undefined) => {
      if (val === null || val === undefined) return `"-"`;
      const trimmed = val.trim();
      if (trimmed === "") return `"-"`;
      return `"${trimmed.replace(/"/g, '""')}"`;
    };

    const rows = filtered.map((t) => {
      const assignee = users.find((u) => u.id === t.assignedTo)?.name || t.assignedTo;
      const creator = users.find((u) => u.id === t.assignedBy)?.name || t.assignedBy;
      
      // Format attachments list: "brief.pdf; wires.fig"
      const attachmentsList = (t.attachments || [])
        .map((att) => att.name)
        .join("; ");

      // Format comments list: "[Priya Shah]: On it -- sharing v1; [Dr. R. Kapoor]: Please align copy"
      const commentsList = (t.comments || [])
        .map((c) => {
          const commentUser = users.find((u) => u.id === c.userId)?.name || c.userId;
          return `[${commentUser}]: ${c.text}`;
        })
        .join("; ");

      // Format submissions list: "Notes: Staging cutover complete (Status: under_review); Notes: First pass complete (Status: rejected)"
      const submissionsList = (t.submissions || [])
        .map((s) => {
          return `Notes: ${s.notes} (Status: ${s.status})`;
        })
        .join("; ");

      return [
        formatCell(t.id),
        formatCell(t.title),
        formatCell(t.description),
        formatCell(t.priority),
        formatCell(t.status),
        formatCell(assignee),
        formatCell(creator),
        formatCell(t.dueDate ? format(new Date(t.dueDate), "yyyy-MM-dd") : ""),
        formatCell(t.createdAt ? format(new Date(t.createdAt), "yyyy-MM-dd") : ""),
        formatCell(attachmentsList),
        formatCell(commentsList),
        formatCell(submissionsList),
      ];
    });

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `mgg_tasks_export_${format(new Date(), "yyyyMMdd_HHmmss")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Tasks exported successfully as CSV!");
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("text/plain", taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, newStatus: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    if (!taskId) return;

    // Find the task
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    if (task.status === newStatus) return;

    // Optimistically update status locally
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      await api.updateTaskStatus(taskId, newStatus);
      toast.success(`Task status updated to ${newStatus.replace("_", " ")}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
      // Rollback
      void loadData();
    }
  };

  const openEdit = (t: Task) => {
    setEditingTask(t);
    setEditTitle(t.title);
    setEditDescription(t.description);
    setEditPriority(t.priority);
    setEditDueDate(t.dueDate ? format(new Date(t.dueDate), "yyyy-MM-dd") : "");
    setEditAssignee(t.assignedTo);
    setEditFiles(t.attachments ?? []);
    setIsEditOpen(true);
  };

  const openDelete = (t: Task) => {
    setTaskToDelete(t);
    setIsDeleteOpen(true);
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;
    setSaving(true);
    try {
      await api.deleteTask(taskToDelete.id);
      toast.success("Task deleted successfully");
      setIsDeleteOpen(false);
      setTasks((prev) => prev.filter((t) => t.id !== taskToDelete.id));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete task");
    } finally {
      setSaving(false);
      setTaskToDelete(null);
    }
  };

  const handleEditTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask || !editTitle.trim() || !editAssignee || !editDueDate) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSaving(true);
    try {
      await api.updateTask(editingTask.id, {
        title: editTitle,
        description: editDescription,
        priority: editPriority,
        dueDate: new Date(editDueDate).toISOString(),
        assignedToId: editAssignee,
        attachments: editFiles,
      });
      toast.success("Task updated successfully");
      setIsEditOpen(false);
      void loadData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update task");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="rounded-xl border bg-card p-8 text-sm text-muted-foreground">Loading tasks…</div>;
  }

  return (
    <div>
      <PageHeader
        title="Tasks"
        description="Track and manage every task across your team."
        actions={
          <div className="flex items-center gap-2">
            <div className="flex rounded-md border bg-card p-1 text-xs">
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "flex items-center gap-1.5 rounded px-3 py-1.5 transition",
                  viewMode === "list" ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <List className="h-3.5 w-3.5" />
                List
              </button>
              <button
                onClick={() => setViewMode("board")}
                className={cn(
                  "flex items-center gap-1.5 rounded px-3 py-1.5 transition",
                  viewMode === "board" ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                Board
              </button>
            </div>             <Button variant="outline" onClick={handleExport}><Download className="mr-1.5 h-4 w-4" />Export</Button>
            {currentUser?.role !== "STAFF" && (
              <Button asChild><Link to="/tasks/new"><Plus className="mr-1.5 h-4 w-4" />Create task</Link></Button>
            )}
          </div>
        }
      />

      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by title or ID..." className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={status} onValueChange={(v) => setStatus(v as TaskStatus | "all")}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {COLUMNS.map((c) => (
                <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={priority} onValueChange={(v) => setPriority(v as Priority | "all")}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="Priority" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priorities</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {viewMode === "list" ? (
        <div className="rounded-xl border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-3 font-medium">Task ID</th>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Priority</th>
                  <th className="px-4 py-3 font-medium">Assigned to</th>
                  <th className="px-4 py-3 font-medium">Due date</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((t) => {
                  const u = users.find((user) => user.id === t.assignedTo);
                  return (
                    <tr key={t.id} className="border-b last:border-0 hover:bg-accent/40">
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{t.id}</td>
                      <td className="px-4 py-3">
                        <Link to="/tasks/$id" params={{ id: t.id }} className="font-medium hover:underline">
                          {t.title}
                        </Link>
                      </td>
                      <td className="px-4 py-3"><PriorityBadge priority={t.priority} /></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                           <UserAvatar name={u?.name} avatar={u?.avatar} size={26} />
                          <span className="truncate">{u?.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{format(new Date(t.dueDate), "MMM d, yyyy")}</td>
                      <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex gap-1">
                          {currentUser?.role !== "STAFF" && (
                            <>
                              <Button variant="ghost" size="icon" onClick={() => openEdit(t)} title="Edit task"><Pencil className="h-4 w-4" /></Button>
                              <Button variant="ghost" size="icon" onClick={() => openDelete(t)} title="Delete task" className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-10 text-center text-sm text-muted-foreground">No tasks match your filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t p-3 text-xs text-muted-foreground">
            <span>Showing {filtered.length > 0 ? page * PAGE_SIZE + 1 : 0} - {Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length} tasks</span>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(p - 1, 0))}
                disabled={page === 0}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={(page + 1) * PAGE_SIZE >= filtered.length}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-6 snap-x min-h-[500px]">
          {COLUMNS.map((col) => {
            const colTasks = filtered.filter((t) => t.status === col.value);
            return (
              <div
                key={col.value}
                onDragOver={handleDragOver}
                onDrop={(e) => void handleDrop(e, col.value)}
                className={cn(
                  "flex w-72 shrink-0 flex-col rounded-xl border p-3 transition snap-start",
                  col.tone
                )}
              >
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="text-sm font-semibold">{col.label}</h4>
                  <span className="rounded bg-background px-2 py-0.5 text-xs font-semibold text-muted-foreground border">
                    {colTasks.length}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-2 overflow-y-auto max-h-[600px] min-h-[250px]">
                  {colTasks.map((t) => {
                    const u = users.find((user) => user.id === t.assignedTo);
                    return (
                      <div
                        key={t.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, t.id)}
                        className="group relative flex cursor-grab flex-col rounded-lg border bg-card p-4 shadow-sm hover:shadow-md transition active:cursor-grabbing hover:-translate-y-0.5"
                      >
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                          <span className="font-mono">{t.id}</span>
                          <div className="flex items-center gap-1">
                            <PriorityBadge priority={t.priority} />
                            {currentUser?.role !== "STAFF" && (
                              <div className="flex items-center ml-1">
                                <button type="button" onClick={(e) => { e.stopPropagation(); openEdit(t); }} className="p-1 hover:text-primary transition"><Pencil className="h-3 w-3" /></button>
                                <button type="button" onClick={(e) => { e.stopPropagation(); openDelete(t); }} className="p-1 hover:text-destructive transition"><Trash2 className="h-3 w-3" /></button>
                              </div>
                            )}
                          </div>
                        </div>
                        <h5 className="mt-2 text-sm font-semibold text-foreground group-hover:text-primary leading-snug">
                          <Link to="/tasks/$id" params={{ id: t.id }} className="hover:underline">
                            {t.title}
                          </Link>
                        </h5>
                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground leading-normal">
                          {t.description}
                        </p>
                        <div className="mt-4 flex items-center justify-between pt-2 border-t">
                          <div className="flex items-center gap-1.5">
                             <UserAvatar name={u?.name} avatar={u?.avatar} size={20} />
                            <span className="max-w-[100px] truncate text-[11px] text-muted-foreground">{u?.name}</span>
                          </div>
                          <span className="text-[10px] font-medium text-muted-foreground">
                            {format(new Date(t.dueDate), "MMM d")}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  {colTasks.length === 0 && (
                    <div className="flex flex-1 flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted/50 p-6 text-center text-xs text-muted-foreground">
                      Drag tasks here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Task Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditTask} className="grid grid-cols-1 gap-6 md:grid-cols-2 pt-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Task title *</Label>
                <Input
                  id="edit-title"
                  required
                  className="mt-1.5"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="edit-desc">Description</Label>
                <Textarea
                  id="edit-desc"
                  rows={4}
                  className="mt-1.5"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
              </div>
              <div>
                <Label className="mb-2 block text-sm font-medium">Attachments</Label>
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed py-4 text-center transition hover:border-primary/50 hover:bg-accent/30">
                  <Upload className="mb-2 h-4 w-4 text-muted-foreground" />
                  <div className="text-xs font-medium">Click to upload files</div>
                  <input type="file" multiple className="hidden" onChange={(e) => {
                    const flist = Array.from(e.target.files ?? []);
                    flist.forEach((file) => {
                      if (file.size > 1024 * 1024 * 10) {
                        toast.error(`File ${file.name} is too large (max 10MB)`);
                        return;
                      }
                      const reader = new FileReader();
                      reader.onload = () => {
                        if (typeof reader.result === "string") {
                          setEditFiles(prev => [...prev, { name: file.name, size: `${(file.size / 1024).toFixed(1)} KB`, content: reader.result as string }]);
                        }
                      };
                      reader.readAsDataURL(file);
                    });
                  }} />
                </label>
                {editFiles.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {editFiles.map((f, i) => (
                      <li key={i} className="flex items-center justify-between rounded-md border bg-muted/30 px-2 py-1.5 text-xs">
                        <span className="flex items-center gap-2 truncate"><Paperclip className="h-3 w-3 text-muted-foreground" />{f.name}</span>
                        <button type="button" onClick={() => setEditFiles(editFiles.filter((_, idx) => idx !== i))} className="text-muted-foreground hover:text-destructive">
                          <X className="h-3 w-3" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Priority</Label>
                <Select value={editPriority} onValueChange={setEditPriority}>
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
                <Label htmlFor="edit-due">Due date *</Label>
                <Input
                  id="edit-due"
                  type="date"
                  className="mt-1.5"
                  required
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                />
              </div>
              <div>
                <Label>Assignee *</Label>
                <Select value={editAssignee} onValueChange={setEditAssignee}>
                  <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select assignee" /></SelectTrigger>
                  <SelectContent>
                    {users.filter(u => u.role === "STAFF").map(u => (
                      <SelectItem key={u.id} value={u.id}>{u.name} ({u.department})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="md:col-span-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} disabled={saving}>Cancel</Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-sm text-foreground">
            Are you sure you want to delete this task? This action cannot be undone.
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)} disabled={saving}>Cancel</Button>
            <Button type="button" variant="destructive" onClick={handleDeleteTask} disabled={saving}>
              {saving ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}