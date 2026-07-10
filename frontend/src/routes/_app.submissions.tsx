import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { CheckCircle2, MessageSquare, Paperclip, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/app/page-header";
import { StatusBadge } from "@/components/app/status-badge";
import { UserAvatar } from "@/components/app/user-avatar";
import { api, clearApiCache } from "@/lib/api";
import type { Task, User } from "@/lib/types";
import { toast } from "sonner";
import { openMockFile } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTaskId, setModalTaskId] = useState("");
  const [modalSubId, setModalSubId] = useState("");
  const [modalFeedback, setModalFeedback] = useState("");
  const [modalExtensionDate, setModalExtensionDate] = useState("");
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectTaskId, setRejectTaskId] = useState("");
  const [rejectSubId, setRejectSubId] = useState("");
  const [rejectReason, setRejectReason] = useState("");

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

    // Listen for task updates to sync real-time UI immediately
    const handleTasksUpdate = () => {
      void loadData();
    };
    window.addEventListener("mgg_tasks_updated", handleTasksUpdate);
    return () => {
      window.removeEventListener("mgg_tasks_updated", handleTasksUpdate);
    };
  }, []);

  const handleReview = async (taskId: string, subId: string, status: "approved" | "rejected" | "changes_requested") => {
    setProcessing((prev) => ({ ...prev, [subId]: true }));
    try {
      clearApiCache();
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

  const openMakeChanges = (taskId: string, subId: string) => {
    setModalTaskId(taskId);
    setModalSubId(subId);
    setModalFeedback("");
    setModalExtensionDate("");
    setModalOpen(true);
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalFeedback.trim()) {
      toast.error("Feedback is required.");
      return;
    }
    setModalOpen(false);
    setProcessing((prev) => ({ ...prev, [modalSubId]: true }));
    try {
      clearApiCache();
      await api.updateSubmissionStatus(modalTaskId, modalSubId, "changes_requested", modalFeedback, currentUser?.id, modalExtensionDate || undefined);
      toast.success("Submission reviewed as changes requested");
      void loadData();
    } catch {
      toast.error("Failed to request changes");
    } finally {
      setProcessing((prev) => ({ ...prev, [modalSubId]: false }));
    }
  };

  const openRejectModal = (taskId: string, subId: string) => {
    setRejectTaskId(taskId);
    setRejectSubId(subId);
    setRejectReason("");
    setRejectModalOpen(true);
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectReason.trim()) {
      toast.error("Rejection reason is required.");
      return;
    }
    setRejectModalOpen(false);
    setProcessing((prev) => ({ ...prev, [rejectSubId]: true }));
    try {
      clearApiCache();
      await api.updateSubmissionStatus(rejectTaskId, rejectSubId, "rejected", rejectReason, currentUser?.id);
      toast.success("Submission reviewed as rejected");
      void loadData();
    } catch {
      toast.error("Failed to reject submission");
    } finally {
      setProcessing((prev) => ({ ...prev, [rejectSubId]: false }));
    }
  };

  const rows = (tasks || []).flatMap((t) =>
    (t?.submissions || []).map((s) => ({
      task: t,
      sub: s,
      user: users.find((u) => u.id === s?.userId) || users.find((u) => u.id === t?.assignedTo)
    })),
  );

  if (!rows || rows.length === 0) {
    return (
      <div>
        <PageHeader title="Submissions" description="Review work submitted by your team and approve or request changes." />
        <div className="p-6 text-center text-muted-foreground border rounded-xl bg-card">No submissions found or awaiting turn-ins.</div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Submissions" description="Review work submitted by your team and approve or request changes." />
      <div className="space-y-4">
        {rows.map(({ task, sub, user }) => {
          const isPending = sub?.status === "submitted" || sub?.status === "under_review";
          const isSubProcessing = processing[sub?.id || ""];

          return (
            <div key={sub?.id} className="rounded-xl border bg-card p-6 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                  <UserAvatar name={user?.name || "Former Staff Member"} avatar={user?.avatar} size={40} />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link to="/tasks/$id" params={{ id: task?.id || "" }} className="truncate text-base font-semibold hover:underline">{task?.title || "Untitled Task"}</Link>
                      <StatusBadge status={sub?.status || "submitted"} />
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {user?.name || "Former Staff Member"} · submitted {sub?.at ? format(new Date(sub.at), "MMM d, yyyy · HH:mm") : ""}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {task?.extendedDueDate ? (
                        <span className="text-amber-600 font-semibold text-xs bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded border border-amber-200 inline-block">
                          ⏳ Extended Deadline: {new Date(task.extendedDueDate).toLocaleDateString()}
                        </span>
                      ) : (
                        task?.dueDate && (
                          <span className="text-slate-500 text-xs">
                            Deadline: {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )
                      )}
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
                      onClick={() => openRejectModal(task?.id || "", sub?.id || "")}
                    >
                      <XCircle className="mr-1.5 h-4 w-4" />Reject
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isSubProcessing}
                      className="border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/20 text-amber-600 dark:text-amber-400 hover:text-amber-700"
                      onClick={() => openMakeChanges(task?.id || "", sub?.id || "")}
                    >
                      <MessageSquare className="mr-1.5 h-4 w-4" />Make Changes
                    </Button>
                    <Button
                      size="sm"
                      disabled={isSubProcessing}
                      className="bg-success text-success-foreground hover:bg-success/90"
                      onClick={() => void handleReview(task?.id || "", sub?.id || "", "approved")}
                    >
                      <CheckCircle2 className="mr-1.5 h-4 w-4" />Approve
                    </Button>
                  </div>
                )}
              </div>
              <p className="mt-4 text-sm">{sub?.notes || ""}</p>
              {(((sub?.files || [])).length > 0 || ((sub?.links || [])).length > 0) && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {(sub?.files || []).map((f: any, i: number) => {
                    const isObject = typeof f === 'object' && f !== null;
                    const name = isObject ? f.name : f;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => openMockFile(name)}
                        className="inline-flex items-center gap-1 rounded-md border bg-primary/10 border-primary/20 hover:bg-primary/25 px-2 py-1 text-xs text-primary transition cursor-pointer"
                      >
                        <Paperclip className="h-3 w-3 shrink-0" />
                        <span>{name}</span>
                        {isObject && <span className="text-[10px] text-muted-foreground ml-1">{f.size}</span>}
                      </button>
                    );
                  })}
                  {(sub?.links || []).map((l) => (
                    <a key={l} href={l} target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-md border border-primary/30 bg-primary/10 px-2 py-1 text-xs text-primary hover:bg-primary/20">{l}</a>
                  ))}
                </div>
              )}
              {sub?.feedback && (
                <div className="mt-3 rounded-md bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 p-3 text-xs text-amber-800 dark:text-amber-300">
                  <strong>Review Comment / Feedback:</strong> {sub.feedback}
                </div>
              )}
              {isPending && (
                <Textarea
                  placeholder="Leave a comment for the staff member..."
                  rows={2}
                  className="mt-4"
                  value={comments[sub?.id || ""] ?? ""}
                  onChange={(e) => setComments((prev) => ({ ...prev, [sub?.id || ""]: e.target.value }))}
                />
              )}
            </div>
          );
        })}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Revision / Specification Changes</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleModalSubmit} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label htmlFor="modal-feedback" className="text-sm font-semibold">Change Requirements *</Label>
              <Textarea
                id="modal-feedback"
                placeholder="Specify what needs to be changed or corrected..."
                required
                rows={4}
                value={modalFeedback}
                onChange={(e) => setModalFeedback(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="modal-extension-date" className="text-sm font-semibold">Extension Due Date (Optional)</Label>
              <Input
                id="modal-extension-date"
                type="date"
                value={modalExtensionDate}
                onChange={(e) => setModalExtensionDate(e.target.value)}
              />
            </div>
            <DialogFooter className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-amber-600 text-white hover:bg-amber-700">
                Send Change Request
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Submission & State Reason</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRejectSubmit} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label htmlFor="reject-feedback" className="text-sm font-semibold">Rejection Reason *</Label>
              <Textarea
                id="reject-feedback"
                placeholder="Please specify the rejection reasons or missing documentation details..."
                required
                rows={4}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
            <DialogFooter className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setRejectModalOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white focus:ring-red-500"
                disabled={!rejectReason.trim()}
              >
                Confirm Rejection
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}