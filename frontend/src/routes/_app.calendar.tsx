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

  const baseHost = typeof window !== "undefined"
    ? (window.location.host === "localhost:8080" ? "localhost:4000" : window.location.host)
    : "localhost:4000";
  const protocol = typeof window !== "undefined" ? window.location.protocol : "http:";

  const webcalUrl = currentUser?.id ? `webcal://${baseHost}/api/calendar/feed/${currentUser.id}` : "";
  const httpUrl = currentUser?.id ? `${protocol}//${baseHost}/api/calendar/feed/${currentUser.id}` : "";

  const getGoogleUrl = () => {
    if (!httpUrl) return "";
    return `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(httpUrl)}`;
  };

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

    const handleUpdate = () => {
      console.log("[Calendar] Real-time tasks update event detected, refetching...");
      void loadData();
    };

    window.addEventListener("mgg_notifications_updated", handleUpdate);
    window.addEventListener("mgg_tasks_updated", handleUpdate);

    return () => {
      window.removeEventListener("mgg_notifications_updated", handleUpdate);
      window.removeEventListener("mgg_tasks_updated", handleUpdate);
    };
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
      window.dispatchEvent(new CustomEvent("mgg_tasks_updated"));
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
      window.dispatchEvent(new CustomEvent("mgg_tasks_updated"));
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
              Automatically sync your secure background feed containing your tasks (Staff see only assigned items; Managers/Operation see organizational summaries) directly into your native calendar application.
            </p>

            {/* Direct Sync Actions (Section 1) */}
            <div className="flex flex-col gap-2 rounded-lg bg-primary/5 p-4 border border-primary/10">
              <p className="font-semibold text-foreground text-xs uppercase tracking-wider">Quick Actions</p>
              
              <Button asChild className="w-full justify-start h-10 font-medium">
                <a href={webcalUrl}>
                  <Calendar className="mr-2 h-4 w-4 shrink-0" />
                  One-Click Native Sync
                </a>
              </Button>

              <Button asChild variant="outline" className="w-full justify-start h-10 font-medium border-muted-foreground/20">
                <a
                  href={getGoogleUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="mr-2 h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '16px', height: '16px' }}>
                    <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z" fill="#4285F4"/>
                    <path d="M20 9.5H4V18C4 19.1 4.9 20 6 20H18C19.1 20 20 19.1 20 18V9.5Z" fill="#34A853"/>
                    <path d="M20 9.5H4V5C4 3.9 4.9 3 6 3H18C19.1 3 20 3.9 20 5V9.5Z" fill="#EA4335"/>
                    <path d="M12 5V15" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M7 10H17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Sync with Google Calendar
                </a>
              </Button>
            </div>

            {/* Manual Subscription Links (Section 2) */}
            <div className="space-y-3">
              <p className="font-semibold text-foreground text-xs uppercase tracking-wider text-muted-foreground pt-1">Manual Subscription Links</p>
              
              {/* Webcal option */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">Webcal Link (For Apple Calendar / Outlook Desktop)</Label>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={webcalUrl}
                    className="bg-muted/30 font-mono text-[10px] select-all flex-1 h-8"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 shrink-0 px-3 text-xs gap-1"
                    onClick={() => {
                      navigator.clipboard.writeText(webcalUrl);
                      setCopiedWebcal(true);
                      setTimeout(() => setCopiedWebcal(false), 2000);
                      toast.success("Webcal URL copied!");
                    }}
                  >
                    {copiedWebcal ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
                    {copiedWebcal ? "Copied" : "Copy"}
                  </Button>
                </div>
              </div>

              {/* HTTP option */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">HTTP Link (For Google Calendar / Web Clients)</Label>
                <div className="flex gap-2">
                  <Input
                    id="ical-link"
                    readOnly
                    value={httpUrl}
                    className="bg-muted/30 font-mono text-[10px] select-all flex-1 h-8"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 shrink-0 px-3 text-xs gap-1"
                    onClick={() => {
                      navigator.clipboard.writeText(httpUrl);
                      setCopiedHttp(true);
                      setTimeout(() => setCopiedHttp(false), 2000);
                      toast.success("HTTP URL copied!");
                    }}
                  >
                    {copiedHttp ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
                    {copiedHttp ? "Copied" : "Copy"}
                  </Button>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-muted/40 p-3 border text-xs text-muted-foreground space-y-1.5">
              <p className="font-bold text-foreground">How to Subscribe Manually:</p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Apple Calendar</strong>: File ➔ New Calendar Subscription... ➔ Paste Webcal link.</li>
                <li><strong>Outlook Desktop</strong>: Add Calendar ➔ From Internet ➔ Paste Webcal link.</li>
                <li><strong>Google Calendar / Web Outlook</strong>: Other Calendars (+) ➔ From URL ➔ Paste HTTP link.</li>
              </ul>
              <div className="mt-2 border-t pt-2 text-[10px] leading-relaxed">
                <strong className="text-warning-foreground dark:text-warning">Note on Localhost:</strong> Standard cloud-based calendar services (Google Calendar Web, Outlook Web) cannot fetch data from a local `localhost` IP address. For full cloud sync during development, you must expose your local port via a secure tunnel (e.g. running `ngrok http 4000` and utilizing that public address inside the feed string context). Local calendar apps (like Apple Calendar or Windows Calendar) will sync directly.
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