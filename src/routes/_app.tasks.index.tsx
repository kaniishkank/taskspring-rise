import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, Filter, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
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
import { tasks, userById } from "@/lib/mock/data";
import type { Priority, TaskStatus } from "@/lib/types";

export const Route = createFileRoute("/_app/tasks/")({
  component: TasksPage,
});

function TasksPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<TaskStatus | "all">("all");
  const [priority, setPriority] = useState<Priority | "all">("all");

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
    [q, status, priority],
  );

  return (
    <div>
      <PageHeader
        title="Tasks"
        description="Track every task across your team."
        actions={
          <>
            <Button variant="outline"><Download className="mr-1.5 h-4 w-4" />Export</Button>
            <Button asChild><Link to="/tasks/new"><Plus className="mr-1.5 h-4 w-4" />Create task</Link></Button>
          </>
        }
      />
      <div className="rounded-xl border bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b p-4 md:flex-row md:items-center">
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
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
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
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => {
                const u = userById(t.assignedTo);
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
                        <UserAvatar name={u?.name} size={26} />
                        <span className="truncate">{u?.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{format(new Date(t.dueDate), "MMM d, yyyy")}</td>
                    <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-muted-foreground">No tasks match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t p-3 text-xs text-muted-foreground">
          <span>{filtered.length} of {tasks.length} tasks</span>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}