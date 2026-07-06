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
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  startOfDay,
  endOfDay,
} from "date-fns";
import { ChevronLeft, ChevronRight, Calendar, Copy, Check } from "lucide-react";
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
  const [isSyncOpen, setIsSyncOpen] = useState(false);
  const [copiedWebcal, setCopiedWebcal] = useState(false);
  const [copiedHttp, setCopiedHttp] = useState(false);

  const apiBaseUrl = (import.meta.env.VITE_API_URL ?? "http://localhost:4000/api").replace(/\/api$/, "");
  const webcalUrl = currentUser?.calendarToken ? `${apiBaseUrl.replace(/^http(s)?:/, "webcal:")}/api/calendar/feed/${currentUser.calendarToken}` : "";
  const httpUrl = currentUser?.calendarToken ? `${apiBaseUrl}/api/calendar/feed/${currentUser.calendarToken}` : "";

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

  let start: Date;
  let end: Date;
  if (view === "month") {
    start = startOfWeek(startOfMonth(cursor));
    end = endOfWeek(endOfMonth(cursor));
  } else if (view === "week") {
    start = startOfWeek(cursor);
    end = endOfWeek(cursor);
  } else {
    start = startOfDay(cursor);
    end = endOfDay(cursor);
  }
  const days = eachDayOfInterval({ start, end });

  const handlePrev = () => {
    if (view === "month") {
      setCursor(subMonths(cursor, 1));
    } else if (view === "week") {
      setCursor(subWeeks(cursor, 1));
    } else {
      setCursor(subDays(cursor, 1));
    }
  };

  const handleNext = () => {
    if (view === "month") {
      setCursor(addMonths(cursor, 1));
    } else if (view === "week") {
      setCursor(addWeeks(cursor, 1));
    } else {
      setCursor(addDays(cursor, 1));
    }
  };

  const getHeaderTitle = () => {
    if (view === "month") {
      return format(cursor, "MMMM yyyy");
    } else if (view === "week") {
      const startW = startOfWeek(cursor);
      const endW = endOfWeek(cursor);
      return `Week of ${format(startW, "MMM d")} - ${format(endW, "MMM d, yyyy")}`;
    } else {
      return format(cursor, "eeee, MMMM d, yyyy");
    }
  };

  const tasksByDay = (d: Date) =>
    tasks
      .filter((t) => currentUser?.role !== "STAFF" || t.assignedTo === currentUser?.id)
      .filter((t) => isSameDay(new Date(t.dueDate), d));

  const getAssigneeName = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : "Unassigned";
  };

  const getTaskStatusLabel = (status: string) => {
    return ["completed", "approved"].includes(status) ? "Completed" : "Pending";
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    if (currentUser?.role === "STAFF") {
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
    if (currentUser?.role === "STAFF") return;
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
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSyncOpen(true)}
              className="text-xs font-semibold"
            >
              <Calendar className="mr-1.5 h-3.5 w-3.5" />
              Sync to Device
            </Button>
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
          </div>
        }
      />
      <div className="rounded-xl border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="text-base font-semibold">{getHeaderTitle()}</h3>
          <div className="flex gap-1">
            <Button variant="outline" size="icon" onClick={handlePrev}><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="outline" size="sm" onClick={() => setCursor(new Date())}>Today</Button>
            <Button variant="outline" size="icon" onClick={handleNext}><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
        {view !== "day" && (
          <div className="grid grid-cols-7 border-b text-center text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
              <div key={d} className="py-2">{d}</div>
            ))}
          </div>
        )}
        <div className={cn("grid", view === "day" ? "grid-cols-1" : "grid-cols-7")}>
          {days.map((d) => {
            const inMonth = view !== "month" || isSameMonth(d, cursor);
            const dayTasks = tasksByDay(d);
            const isToday = isSameDay(d, new Date());
            return (
              <div
                key={d.toISOString()}
                onDragOver={handleDragOver}
                onDrop={(e) => void handleDrop(e, d)}
                onDoubleClick={() => {
                  if (currentUser?.role !== "STAFF") {
                    handleDayClick(d);
                  }
                }}
                className={cn(
                  "border-b border-r p-2 text-xs transition-colors hover:bg-muted/10",
                  view === "day" ? "min-h-[350px]" : view === "week" ? "min-h-[250px]" : "min-h-28",
                  !inMonth && "bg-muted/20 text-muted-foreground"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className={cn("inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium", isToday && "bg-primary text-primary-foreground")}>
                    {format(d, "d")}
                  </div>
                  {currentUser?.role !== "STAFF" && (
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
                      draggable={currentUser?.role !== "STAFF"}
                      onDragStart={(e) => handleDragStart(e, t.id)}
                      className="flex items-center gap-1.5 truncate rounded border bg-background px-1.5 py-1 hover:bg-accent cursor-grab active:cursor-grabbing text-[11px] shadow-sm"
                    >
                      <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", priorityDot[t.priority])} />
                      <span className="truncate">
                        {t.title}
                        {currentUser?.role !== "STAFF" && ` (${getAssigneeName(t.assignedTo)})`}
                        {` - [${getTaskStatusLabel(t.status)}]`}
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
                  {users.filter((u) => u.role === "STAFF").map((u) => (
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

      {/* OS Calendar Synchronization Modal */}
      <Dialog open={isSyncOpen} onOpenChange={setIsSyncOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Sync to PC / Device Calendar
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 text-sm">
            <p className="text-muted-foreground">
              Subscribe to your live TaskFlow tasks feed directly in external desktop or mobile calendar clients using the links below.
            </p>

            <div className="space-y-3">
              {/* Webcal option */}
              <div className="space-y-1.5">
                <Label className="font-semibold text-foreground">Option 1: Webcal Protocol (Recommended for Apple Calendar / Outlook Desktop)</Label>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={webcalUrl}
                    className="bg-muted/30 font-mono text-[11px] select-all flex-1 h-9"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-9 shrink-0 gap-1"
                    onClick={() => {
                      navigator.clipboard.writeText(webcalUrl);
                      setCopiedWebcal(true);
                      setTimeout(() => setCopiedWebcal(false), 2000);
                      toast.success("Webcal URL copied!");
                    }}
                  >
                    {copiedWebcal ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                    {copiedWebcal ? "Copied" : "Copy"}
                  </Button>
                </div>
              </div>

              {/* HTTP option */}
              <div className="space-y-1.5">
                <Label className="font-semibold text-foreground">Option 2: HTTP Feed (For Google Calendar / Web Clients)</Label>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={httpUrl}
                    className="bg-muted/30 font-mono text-[11px] select-all flex-1 h-9"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-9 shrink-0 gap-1"
                    onClick={() => {
                      navigator.clipboard.writeText(httpUrl);
                      setCopiedHttp(true);
                      setTimeout(() => setCopiedHttp(false), 2000);
                      toast.success("HTTP URL copied!");
                    }}
                  >
                    {copiedHttp ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                    {copiedHttp ? "Copied" : "Copy"}
                  </Button>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-muted/40 p-3.5 border text-xs text-muted-foreground space-y-2">
              <p className="font-bold text-foreground">How to Subscribe:</p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Apple Calendar</strong>: File ➔ New Calendar Subscription... ➔ Paste the <em>Webcal link</em>.</li>
                <li><strong>Outlook Desktop</strong>: Add Calendar ➔ From Internet ➔ Paste the <em>Webcal link</em>.</li>
                <li><strong>Google Calendar / Web Outlook</strong>: Other Calendars (+) ➔ From URL ➔ Paste the <em>HTTP link</em>.</li>
              </ul>
              <div className="mt-2 border-t pt-2 text-[10px] leading-relaxed">
                <strong className="text-warning-foreground dark:text-warning">Note on Localhost:</strong> Standard cloud-based calendar services (Google Calendar Web, Outlook Web) cannot fetch data from a local `localhost` IP address. For full cloud sync, you must expose your local port via a tunnel service (e.g. ngrok) or run the server on a public domain. Local calendar apps (like Apple Calendar or Windows Calendar) will sync directly.
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={() => setIsSyncOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}