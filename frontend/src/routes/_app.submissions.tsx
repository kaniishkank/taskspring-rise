import { createFileRoute, Link, redirect } from "@tanstack/react-router";
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
import { openMockFile } from "@/lib/utils";

export const Route = createFileRoute("/_app/submissions")({
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
  component: SubmissionsPage,
});

function SubmissionsPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [comments, setComments] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState<Record<string, boolean>>({});

  const loadData = async () => {
    try {
      const [taskData, userData] = await Promise.all([api.getTasks(), api.getUsers()]);
      setTasks(taskData);
      setUsers(userData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    void loadData();
    void api.getCurrentUser().then((data) => setCurrentUser(data.user)).catch(() => {});
  }, []);

  const handleReview = async (taskId: string, subId: string, status: "approved" | "rejected" | "changes_requested") => {
    setProcessing((prev) => ({ ...prev, [subId]: true }));
    try {
      await api.updateSubmissionStatus(taskId, subId, status, comments[subId], currentUser?.id);
      toast.success(`Submission reviewed as ${status.replace("_", " ")}`);
      // Clear comments for this sub
      setComments((prev) => {
        const next = { ...prev };
        delete next[subId];
        return next;
      });
      void loadData();
    } catch {
      toast.error("Failed to review submission");
    } finally {
      setProcessing((prev) => ({ ...prev, [subId]: false }));
    }
  };

  const rows = tasks.flatMap((t) =>
    t.submissions.map((s) => ({ task: t, sub: s, user: users.find((u) => u.id === t.assignedTo) })),
  );

  return (
    <div>
      <PageHeader title="Submissions" description="Review work submitted by your team and approve or request changes." />
      <div className="space-y-4">
        {rows.length === 0 ? (
          <div className="rounded-xl border bg-card p-8 text-center text-sm text-muted-foreground">
            No submissions to review.
          </div>
        ) : (
          rows.map(({ task, sub, user }) => {
            const isPending = sub.status === "submitted" || sub.status === "under_review";
            const isSubProcessing = processing[sub.id];

            return (
              <div key={sub.id} className="rounded-xl border bg-card p-6 shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex min-w-0 items-start gap-3">
                    <UserAvatar name={user?.name} avatar={user?.avatar} size={40} />
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
                  {isPending && (
                    <div className="flex shrink-0 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isSubProcessing}
                        className="hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => void handleReview(task.id, sub.id, "rejected")}
                      >
                        <XCircle className="mr-1.5 h-4 w-4" />Reject
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isSubProcessing}
                        className="hover:bg-warning/10 hover:text-warning-foreground"
                        onClick={() => void handleReview(task.id, sub.id, "changes_requested")}
                      >
                        <MessageSquare className="mr-1.5 h-4 w-4" />Request changes
                      </Button>
                      <Button
                        size="sm"
                        disabled={isSubProcessing}
                        className="bg-success text-success-foreground hover:bg-success/90"
                        onClick={() => void handleReview(task.id, sub.id, "approved")}
                      >
                        <CheckCircle2 className="mr-1.5 h-4 w-4" />Approve
                      </Button>
                    </div>
                  )}
                </div>
                <p className="mt-4 text-sm">{sub.notes}</p>
                {(sub.files.length > 0 || sub.links.length > 0) && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {sub.files.map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => openMockFile(f)}
                        className="inline-flex items-center gap-1 rounded-md border bg-primary/10 border-primary/20 hover:bg-primary/25 px-2 py-1 text-xs text-primary transition cursor-pointer"
                      >
                        <Paperclip className="h-3 w-3 shrink-0" />
                        <span>{f}</span>
                      </button>
                    ))}
                    {sub.links.map((l) => (
                      <a key={l} href={l} target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-md border border-primary/30 bg-primary/10 px-2 py-1 text-xs text-primary hover:bg-primary/20">{l}</a>
                    ))}
                  </div>
                )}
                {isPending && (
                  <Textarea
                    placeholder="Leave a comment for the staff member..."
                    rows={2}
                    className="mt-4"
                    value={comments[sub.id] ?? ""}
                    onChange={(e) => setComments((prev) => ({ ...prev, [sub.id]: e.target.value }))}
                  />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}