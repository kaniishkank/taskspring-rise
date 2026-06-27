import { createFileRoute, Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { CheckCircle2, MessageSquare, Paperclip, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/app/page-header";
import { StatusBadge } from "@/components/app/status-badge";
import { UserAvatar } from "@/components/app/user-avatar";
import { api } from "@/lib/api";
import type { Task, User } from "@/lib/types";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/submissions")({
  component: SubmissionsPage,
});

function SubmissionsPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    void Promise.all([api.getTasks(), api.getUsers()])
      .then(([taskData, userData]) => {
        setTasks(taskData);
        setUsers(userData);
      })
      .catch(() => {});
  }, []);

  const rows = tasks.flatMap((t) =>
    t.submissions.map((s) => ({ task: t, sub: s, user: users.find((u) => u.id === t.assignedTo) })),
  );

  return (
    <div>
      <PageHeader title="Submissions" description="Review work submitted by your team and approve or request changes." />
      <div className="space-y-4">
        {rows.map(({ task, sub, user }) => (
          <div key={sub.id} className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <UserAvatar name={user?.name} size={40} />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link to="/tasks/$id" params={{ id: task.id }} className="truncate text-base font-semibold hover:underline">{task.title}</Link>
                    <StatusBadge status={sub.status} />
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {user?.name} · submitted {format(new Date(sub.at), "MMM d, yyyy · HH:mm")}
                  </div>
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button variant="outline" size="sm" onClick={() => toast.error("Submission rejected")}>
                  <XCircle className="mr-1.5 h-4 w-4" />Reject
                </Button>
                <Button variant="outline" size="sm" onClick={() => toast("Changes requested")}>
                  <MessageSquare className="mr-1.5 h-4 w-4" />Request changes
                </Button>
                <Button size="sm" onClick={() => toast.success("Submission approved")}>
                  <CheckCircle2 className="mr-1.5 h-4 w-4" />Approve
                </Button>
              </div>
            </div>
            <p className="mt-4 text-sm">{sub.notes}</p>
            {(sub.files.length > 0 || sub.links.length > 0) && (
              <div className="mt-3 flex flex-wrap gap-2">
                {sub.files.map((f) => (
                  <span key={f} className="inline-flex items-center gap-1 rounded-md border bg-muted/40 px-2 py-1 text-xs">
                    <Paperclip className="h-3 w-3" />{f}
                  </span>
                ))}
                {sub.links.map((l) => (
                  <a key={l} href={l} className="inline-flex items-center rounded-md border border-primary/30 bg-primary/10 px-2 py-1 text-xs text-primary hover:bg-primary/20">{l}</a>
                ))}
              </div>
            )}
            <Textarea placeholder="Leave a comment for the staff member..." rows={2} className="mt-4" />
          </div>
        ))}
      </div>
    </div>
  );
}