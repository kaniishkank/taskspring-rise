import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { format, formatDistanceToNow } from "date-fns";
import { ArrowLeft, Calendar, CheckCircle2, MessageSquare, Paperclip, Send, User as UserIcon, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/app/page-header";
import { PriorityBadge, StatusBadge } from "@/components/app/status-badge";
import { UserAvatar } from "@/components/app/user-avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import type { Task, User } from "@/lib/types";
import { toast } from "sonner";
import { openMockFile } from "@/lib/utils";

export const Route = createFileRoute("/_app/tasks/$id")({
  component: TaskDetail,
});

function TaskDetail() {
  const { id } = Route.useParams();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Local form states
  const [commentText, setCommentText] = useState("");
  const [submissionNotes, setSubmissionNotes] = useState("");
  const [submissionLink, setSubmissionLink] = useState("");
  const [submissionFiles, setSubmissionFiles] = useState<{name: string, content: string}[]>([]);
  const [submittingWork, setSubmittingWork] = useState(false);
  const [reviewing, setReviewing] = useState(false);

  const loadTask = async () => {
    try {
      const fresh = await api.getTask(id);
      setTask(fresh);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const [freshTask, userData, currentData] = await Promise.all([
          api.getTask(id),
          api.getUsers(),
          api.getCurrentUser()
        ]);
        setTask(freshTask);
        setUsers(userData);
        setCurrentUser(currentData.user);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    void init();
  }, [id]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !currentUser || !task) return;
    try {
      await api.addComment(task.id, currentUser.id, commentText);
      toast.success("Comment added");
      setCommentText("");
      void loadTask();
    } catch {
      toast.error("Failed to add comment");
    }
  };

  const handleSubmitWork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionNotes.trim() || !currentUser || !task) return;
    setSubmittingWork(true);
    try {
      await api.createSubmission(task.id, {
        userId: currentUser.id,
        notes: submissionNotes,
        files: submissionFiles.map(f => f.content), // Storing base64 strings directly in the JSON array for demo
        links: submissionLink ? [submissionLink] : [],
        status: "submitted",
      });
      toast.success("Proof of work submitted!");
      setSubmissionNotes("");
      setSubmissionLink("");
      setSubmissionFiles([]);
      void loadTask();
    } catch {
      toast.error("Failed to submit work");
    } finally {
      setSubmittingWork(false);
    }
  };

  const handleReview = async (reviewStatus: "approved" | "rejected" | "changes_requested") => {
    if (!task) return;
    setReviewing(true);
    const latestSub = task.submissions[task.submissions.length - 1];
    try {
      if (latestSub) {
        await api.updateSubmissionStatus(
          task.id,
          latestSub.id,
          reviewStatus,
          `Reviewed: ${reviewStatus.replace("_", " ")}`,
          currentUser?.id
        );
      } else {
        let taskStatus = "assigned";
        if (reviewStatus === "approved") taskStatus = "approved";
        else if (reviewStatus === "rejected") taskStatus = "rejected";
        else if (reviewStatus === "changes_requested") taskStatus = "in_progress";
        await api.updateTaskStatus(task.id, taskStatus);
      }
      toast.success(`Task reviewed: ${reviewStatus.replace("_", " ")}`);
      void loadTask();
    } catch {
      toast.error("Failed to review task");
    } finally {
      setReviewing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="text-sm text-muted-foreground font-medium">Loading task details…</span>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="grid place-items-center py-20 text-center">
        <div>
          <h2 className="text-xl font-semibold text-destructive">Task Not Found</h2>
          <p className="text-sm text-muted-foreground mt-1.5">This task may have been deleted or does not exist.</p>
          <Button asChild className="mt-6">
            <Link to="/tasks">Back to tasks</Link>
          </Button>
        </div>
      </div>
    );
  }

  const assignee = users.find((u) => u.id === task.assignedTo);
  const assigner = users.find((u) => u.id === task.assignedBy);
  const isAssignee = currentUser && task.assignedTo === currentUser.id;
  const isManager = currentUser && ["MANAGER", "OPERATION"].includes(currentUser.role);
  const showReviewActions = isManager && ["submitted", "under_review", "assigned", "in_progress", "rejected"].includes(task.status);

  return (
    <div>
      <Link to="/tasks" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to tasks
      </Link>
      <PageHeader
        title={task.title}
        description={`${task.id} · Created ${format(new Date(task.createdAt), "MMM d, yyyy")}`}
        actions={
          showReviewActions && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="hover:bg-destructive/10 hover:text-destructive"
                onClick={() => void handleReview("rejected")}
                disabled={reviewing}
              >
                <XCircle className="mr-1.5 h-4 w-4" />
                Reject
              </Button>
              <Button
                variant="outline"
                className="hover:bg-warning/10 hover:text-warning-foreground"
                onClick={() => void handleReview("changes_requested")}
                disabled={reviewing}
              >
                <MessageSquare className="mr-1.5 h-4 w-4" />
                Request changes
              </Button>
              <Button
                onClick={() => void handleReview("approved")}
                disabled={reviewing}
                className="bg-success text-success-foreground hover:bg-success/90"
              >
                <CheckCircle2 className="mr-1.5 h-4 w-4" />
                Approve
              </Button>
            </div>
          )
        }
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <StatusBadge status={task.status} />
              <PriorityBadge priority={task.priority} />
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{task.description}</p>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="submissions">Submissions ({task.submissions.length})</TabsTrigger>
              <TabsTrigger value="activity">Activity log</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h3 className="mb-4 text-sm font-semibold">Attachments</h3>
                {task.attachments.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No attachments</div>
                ) : (
                  <ul className="space-y-2">
                    {task.attachments.map((a) => (
                      <li key={a.name} className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2 text-sm">
                        <button
                          type="button"
                          onClick={() => openMockFile(a.name)}
                          className="flex items-center gap-2 hover:underline hover:text-primary transition text-left"
                        >
                          <Paperclip className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="font-medium">{a.name}</span>
                        </button>
                        <span className="text-xs text-muted-foreground">{a.size}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Submissions flow for Assignee */}
              {isAssignee && !["approved", "completed"].includes(task.status) && (
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                  <h3 className="mb-4 text-sm font-semibold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Submit Proof of Work
                  </h3>
                  <form onSubmit={(e) => void handleSubmitWork(e)} className="space-y-4">
                    <div>
                      <Label htmlFor="notes">Submission Notes *</Label>
                      <Textarea
                        id="notes"
                        placeholder="Detail what you accomplished..."
                        className="mt-1.5"
                        rows={3}
                        required
                        value={submissionNotes}
                        onChange={(e) => setSubmissionNotes(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="link">Reference Links (Optional)</Label>
                      <Input
                        id="link"
                        type="url"
                        placeholder="https://example.com/project-link"
                        className="mt-1.5"
                        value={submissionLink}
                        onChange={(e) => setSubmissionLink(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="file">File Upload (Optional, max 1MB)</Label>
                      <Input
                        id="file"
                        type="file"
                        className="mt-1.5"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          if (file.size > 1024 * 1024) {
                            toast.error("File must be under 1MB");
                            return;
                          }
                          const reader = new FileReader();
                          reader.onload = () => {
                            if (typeof reader.result === "string") {
                              setSubmissionFiles([{ name: file.name, content: reader.result }]);
                            }
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                      {submissionFiles.length > 0 && (
                        <div className="mt-2 text-xs text-muted-foreground flex items-center justify-between bg-muted/50 p-2 rounded-md border">
                          <span className="truncate">{submissionFiles[0].name}</span>
                          <button type="button" onClick={() => setSubmissionFiles([])} className="text-destructive hover:underline">Remove</button>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit" disabled={submittingWork}>
                        {submittingWork ? "Submitting..." : "Submit Task"}
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h3 className="mb-4 text-sm font-semibold flex items-center gap-2"><MessageSquare className="h-4 w-4" />Comments</h3>
                {task.comments.length > 0 ? (
                  <ul className="space-y-4">
                    {task.comments.map((c) => {
                      const u = users.find((user) => user.id === c.userId);
                      return (
                        <li key={c.id} className="flex gap-3">
                          <UserAvatar name={u?.name} avatar={u?.avatar} size={32} />
                          <div className="min-w-0 flex-1 rounded-lg border bg-muted/30 p-3">
                            <div className="flex items-baseline justify-between gap-2">
                              <span className="text-sm font-medium">{u?.name}</span>
                              <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(c.at), { addSuffix: true })}</span>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">{c.text}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="text-sm text-muted-foreground">No comments yet</div>
                )}
                <form
                  onSubmit={(e) => void handleAddComment(e)}
                  className="mt-4 flex flex-col gap-2"
                >
                  <Textarea
                    placeholder="Write a comment..."
                    rows={3}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <div className="flex justify-end">
                    <Button size="sm" type="submit"><Send className="mr-1.5 h-3.5 w-3.5" />Comment</Button>
                  </div>
                </form>
              </div>
            </TabsContent>

            <TabsContent value="submissions">
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                {task.submissions.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No submissions yet.</div>
                ) : (
                  <ul className="space-y-4">
                    {[...task.submissions].reverse().map((s) => {
                      const subUser = users.find((user) => user.id === s.userId);
                      return (
                        <li key={s.id} className="rounded-lg border p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <UserAvatar name={subUser?.name} avatar={subUser?.avatar} size={24} />
                              <span className="text-xs font-semibold">{subUser?.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <StatusBadge status={s.status} />
                              <span className="text-xs text-muted-foreground">{format(new Date(s.at), "MMM d, yyyy · HH:mm")}</span>
                            </div>
                          </div>
                          <p className="mt-3 text-sm">{s.notes}</p>
                          {s.files && s.files.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {s.files.map((f, i) => (
                                <button
                                  key={i}
                                  type="button"
                                  onClick={() => f.startsWith('data:') ? window.open(f) : openMockFile(f)}
                                  className="inline-flex items-center gap-1 rounded-md border bg-primary/10 border-primary/20 hover:bg-primary/25 px-2 py-1 text-xs text-primary transition cursor-pointer"
                                >
                                  <Paperclip className="h-3 w-3 shrink-0" />
                                  <span className="max-w-[150px] truncate">{f.startsWith('data:') ? 'Attachment' : f}</span>
                                </button>
                              ))}
                            </div>
                          )}
                          {s.links && s.links.length > 0 && (
                            <ul className="mt-2 space-y-1 text-xs text-primary">
                              {s.links.map((l) => <li key={l}><a href={l} target="_blank" rel="noopener noreferrer" className="hover:underline">{l}</a></li>)}
                            </ul>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </TabsContent>

            <TabsContent value="activity">
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <ol className="relative space-y-5 border-l pl-5">
                  <li>
                    <span className="absolute -left-1.5 h-3 w-3 rounded-full bg-primary" />
                    <div className="text-sm font-medium">Task created</div>
                    <div className="text-xs text-muted-foreground">{format(new Date(task.createdAt), "MMM d, yyyy · HH:mm")}</div>
                  </li>
                  <li>
                    <span className="absolute -left-1.5 h-3 w-3 rounded-full bg-info" />
                    <div className="text-sm font-medium">Assigned to {assignee?.name}</div>
                    <div className="text-xs text-muted-foreground">by {assigner?.name}</div>
                  </li>
                  {task.submissions.map((s) => (
                    <li key={s.id}>
                      <span className="absolute -left-1.5 h-3 w-3 rounded-full bg-warning" />
                      <div className="text-sm font-medium">Submission {s.status.replace("_", " ")}</div>
                      <div className="text-xs text-muted-foreground">{format(new Date(s.at), "MMM d, yyyy · HH:mm")}</div>
                    </li>
                  ))}
                </ol>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold">Details</h3>
            <dl className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground flex items-center gap-2"><UserIcon className="h-4 w-4" />Assignee</dt>
                <dd className="flex items-center gap-2"><UserAvatar name={assignee?.name} size={24} />{assignee?.name}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground flex items-center gap-2"><UserIcon className="h-4 w-4" />Assigned by</dt>
                <dd>{assigner?.name}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground flex items-center gap-2"><Calendar className="h-4 w-4" />Due date</dt>
                <dd>{format(new Date(task.dueDate), "MMM d, yyyy")}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Priority</dt>
                <dd><PriorityBadge priority={task.priority} /></dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground">Status</dt>
                <dd><StatusBadge status={task.status} /></dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}