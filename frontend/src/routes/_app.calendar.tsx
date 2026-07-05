import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/app/page-header";
import { PriorityBadge } from "@/components/app/status-badge";
import { api } from "@/lib/api";
import type { Task, User } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/calendar")({
  component: CalendarPage,
});

const priorityDot: Record<string, string> = {
  low: "bg-muted-foreground",
  medium: "bg-info",
  high: "bg-warning",
  urgent: "bg-destructive",
};

function CalendarPage() {
  const [cursor, setCursor] = useState(new Date());
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Quick add task form states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState<string>("medium");
  const [newAssignedToId, setNewAssignedToId] = useState("");
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      const [taskData, userData] = await Promise.all([api.getTasks(), api.getUsers()]);
      setTasks(taskData);
      setUsers(userData);
    } catch {}
  };

  useEffect(() => {
    void loadData();
    void api.getCurrentUser().then((data) => setCurrentUser(data.user)).catch(() => {});
  }, []);

  const start = startOfWeek(startOfMonth(cursor));
  const end = endOfWeek(endOfMonth(cursor));
  const days = eachDayOfInterval({ start, end });

  const tasksByDay = (d: Date) =>
    tasks
      .filter((t) => currentUser?.role !== "staff" || t.assignedTo === currentUser?.id)
      .filter((t) => isSameDay(new Date(t.dueDate), d));

  const getAssigneeName = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : "Unassigned";
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    if (currentUser?.role === "staff") {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, d: Date) => {
    e.preventDefault();
    if (currentUser?.role === "staff") return;
    const taskId = e.dataTransfer.getData("text/plain");
    if (!taskId) return;

    // Optimistically update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, dueDate: d.toISOString() } : t))
    );

    try {
      await api.updateTaskDueDate(taskId, d.toISOString());
      toast.success("Task rescheduled successfully");
      void loadData();
    } catch {
      toast.error("Failed to reschedule task");
      void loadData();
    }
  };

  const handleDayClick = (d: Date) => {
    setSelectedDate(d);
    setNewTitle("");
    setNewPriority("medium");
    setNewAssignedToId("");
    setIsAddOpen(true);
  };

  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAssignedToId || !selectedDate) {
      toast.error("Please fill in task title and assignee.");
      return;
    }
    setSaving(true);
    try {
      await api.createTask({
        title: newTitle,
        description: "Created quickly from calendar view.",
        priority: newPriority,
        dueDate: selectedDate.toISOString(),
        assignedToId: newAssignedToId,
        assignedById: currentUser?.id ?? "m1",
        attachments: [],
      });
      toast.success("Task created successfully!");
      setIsAddOpen(false);
      void loadData();
    } catch {
      toast.error("Failed to create task");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Calendar"
        description="Task deadlines and upcoming work. Drag cards to reschedule or double-click a day to add."
        actions={
          <div className="flex gap-1 rounded-md border bg-card p-1 text-xs">
            {(["month", "week", "day"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  "rounded px-3 py-1.5 capitalize transition font-medium",
                  view === v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {v}
              </button>
            ))}
          </div>
        }
      />
      <div className="rounded-xl border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="text-base font-semibold">{format(cursor, "MMMM yyyy")}</h3>
          <div className="flex gap-1">
            <Button variant="outline" size="icon" onClick={() => setCursor(subMonths(cursor, 1))}><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="outline" size="sm" onClick={() => setCursor(new Date())}>Today</Button>
            <Button variant="outline" size="icon" onClick={() => setCursor(addMonths(cursor, 1))}><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
        <div className="grid grid-cols-7 border-b text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
            <div key={d} className="py-2">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((d) => {
            const inMonth = isSameMonth(d, cursor);
            const dayTasks = tasksByDay(d);
            const isToday = isSameDay(d, new Date());
            return (
              <div
                key={d.toISOString()}
                onDragOver={handleDragOver}
                onDrop={(e) => void handleDrop(e, d)}
                onDoubleClick={() => {
                  if (currentUser?.role !== "staff") {
                    handleDayClick(d);
                  }
                }}
                className={cn(
                  "min-h-28 border-b border-r p-2 text-xs transition-colors hover:bg-muted/10",
                  !inMonth && "bg-muted/20 text-muted-foreground"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className={cn("inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium", isToday && "bg-primary text-primary-foreground")}>
                    {format(d, "d")}
                  </div>
                  {currentUser?.role !== "staff" && (
                    <button
                      onClick={() => handleDayClick(d)}
                      className="h-4 w-4 rounded border text-[9px] flex items-center justify-center hover:bg-accent text-muted-foreground"
                      title="Add task"
                    >
                      +
                    </button>
                  )}
                </div>
                <div className="space-y-1">
                  {dayTasks.slice(0, 3).map((t) => (
                    <Link
                      key={t.id}
                      to="/tasks/$id"
                      params={{ id: t.id }}
                      draggable={currentUser?.role !== "staff"}
                      onDragStart={(e) => handleDragStart(e, t.id)}
                      className="flex items-center gap-1.5 truncate rounded border bg-background px-1.5 py-1 hover:bg-accent cursor-grab active:cursor-grabbing text-[11px] shadow-sm"
                    >
                      <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", priorityDot[t.priority])} />
                      <span className="truncate">
                        {t.title}
                        {currentUser?.role !== "staff" && ` (${getAssigneeName(t.assignedTo)})`}
                      </span>
                    </Link>
                  ))}
                  {dayTasks.length > 3 && <div className="px-1 text-[10px] text-muted-foreground">+{dayTasks.length - 3} more</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 rounded-xl border bg-card p-5 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold">Legend</h3>
        <div className="flex flex-wrap gap-4 text-xs">
          {(["low","medium","high","urgent"] as const).map((p) => (
            <div key={p} className="flex items-center gap-2">
              <span className={cn("h-2 w-2 rounded-full", priorityDot[p])} />
              <PriorityBadge priority={p} />
            </div>
          ))}
        </div>
      </div>

      {/* Quick Add Task Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Quick Create Task</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => void handleQuickAdd(e)} className="space-y-4 py-3">
            <div>
              <Label className="text-xs font-semibold text-muted-foreground">Due Date</Label>
              <div className="text-sm font-semibold mt-1">
                {selectedDate ? format(selectedDate, "eeee, MMMM d, yyyy") : ""}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quick-title">Task Title *</Label>
              <Input
                id="quick-title"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Task description..."
              />
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={newPriority} onValueChange={setNewPriority}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Assign to *</Label>
              <Select value={newAssignedToId} onValueChange={setNewAssignedToId}>
                <SelectTrigger><SelectValue placeholder="Choose a staff member" /></SelectTrigger>
                <SelectContent>
                  {users.filter((u) => u.role === "staff").map((u) => (
                    <SelectItem key={u.id} value={u.id}>{u.name} · {u.department}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saving}>{saving ? "Creating..." : "Create Task"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}